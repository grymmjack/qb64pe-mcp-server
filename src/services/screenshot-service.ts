import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export interface ScreenshotOptions {
  outputPath?: string;
  windowTitle?: string;
  processName?: string;
  captureRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  quality?: number;
  format?: 'png' | 'jpg' | 'gif';
}

export interface ScreenshotResult {
  success: boolean;
  filePath?: string;
  error?: string;
  timestamp: string;
  windowInfo?: {
    title: string;
    processId: number;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export interface ProcessInfo {
  pid: number;
  name: string;
  windowTitle: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Service for capturing screenshots of QB64PE programs automatically
 */
export class ScreenshotService {
  private screenshotDir: string;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(screenshotDir: string = 'qb64pe-screenshots') {
    this.screenshotDir = path.resolve(screenshotDir);
    this.ensureScreenshotDirectory();
  }

  /**
   * Ensure screenshot directory exists
   */
  private ensureScreenshotDirectory(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * Get list of QB64PE processes currently running
   */
  async getQB64PEProcesses(): Promise<ProcessInfo[]> {
    const platform = os.platform();
    const processes: ProcessInfo[] = [];

    try {
      if (platform === 'win32') {
        // Windows: Use PowerShell to get process info
        const { stdout } = await execAsync(`
          Get-Process | Where-Object {$_.ProcessName -like "*qb64pe*" -or $_.MainWindowTitle -like "*QB64PE*"} | 
          Select-Object Id, ProcessName, MainWindowTitle | 
          ConvertTo-Json
        `);
        
        const windowsProcesses = JSON.parse(stdout || '[]');
        for (const proc of Array.isArray(windowsProcesses) ? windowsProcesses : [windowsProcesses]) {
          if (proc && proc.Id) {
            processes.push({
              pid: proc.Id,
              name: proc.ProcessName,
              windowTitle: proc.MainWindowTitle || '',
              bounds: await this.getWindowBounds(proc.Id)
            });
          }
        }
      } else {
        // Unix-like systems: Use ps and xwininfo/wmctrl
        const { stdout } = await execAsync('ps aux | grep -i qb64pe | grep -v grep');
        const lines = stdout.trim().split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const parts = line.trim().split(/\s+/);
            const pid = parseInt(parts[1]);
            if (!isNaN(pid)) {
              processes.push({
                pid,
                name: 'qb64pe',
                windowTitle: await this.getWindowTitle(pid),
                bounds: await this.getWindowBounds(pid)
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error getting QB64PE processes:', error);
    }

    return processes;
  }

  /**
   * Get window bounds for a process
   */
  private async getWindowBounds(pid: number): Promise<{ x: number; y: number; width: number; height: number }> {
    const platform = os.platform();
    const defaultBounds = { x: 0, y: 0, width: 800, height: 600 };

    try {
      if (platform === 'win32') {
        // Windows: Use PowerShell to get window rectangle
        const { stdout } = await execAsync(`
          Add-Type -AssemblyName System.Windows.Forms
          $process = Get-Process -Id ${pid} -ErrorAction SilentlyContinue
          if ($process -and $process.MainWindowHandle -ne 0) {
            $rect = New-Object System.Drawing.Rectangle
            [Win32.GetWindowRect]::GetWindowRect($process.MainWindowHandle, [ref]$rect)
            @{
              x = $rect.X
              y = $rect.Y  
              width = $rect.Width
              height = $rect.Height
            } | ConvertTo-Json
          }
        `);
        
        if (stdout.trim()) {
          return JSON.parse(stdout);
        }
      } else {
        // Unix-like: Use xwininfo
        const { stdout } = await execAsync(`xwininfo -id $(xdotool search --pid ${pid}) | grep -E "(Absolute|Width|Height)"`);
        const lines = stdout.split('\n');
        const bounds = { ...defaultBounds };
        
        for (const line of lines) {
          if (line.includes('Absolute upper-left X:')) {
            bounds.x = parseInt(line.split(':')[1].trim());
          } else if (line.includes('Absolute upper-left Y:')) {
            bounds.y = parseInt(line.split(':')[1].trim());
          } else if (line.includes('Width:')) {
            bounds.width = parseInt(line.split(':')[1].trim());
          } else if (line.includes('Height:')) {
            bounds.height = parseInt(line.split(':')[1].trim());
          }
        }
        
        return bounds;
      }
    } catch (error) {
      console.warn('Error getting window bounds:', error);
    }

    return defaultBounds;
  }

  /**
   * Get window title for a process
   */
  private async getWindowTitle(pid: number): Promise<string> {
    try {
      const platform = os.platform();
      
      if (platform === 'win32') {
        const { stdout } = await execAsync(`(Get-Process -Id ${pid}).MainWindowTitle`);
        return stdout.trim();
      } else {
        const { stdout } = await execAsync(`xdotool search --pid ${pid} getwindowname`);
        return stdout.trim();
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Capture screenshot of specific QB64PE window
   */
  async captureQB64PEWindow(options: ScreenshotOptions = {}): Promise<ScreenshotResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const format = options.format || 'png';
    const outputPath = options.outputPath || path.join(this.screenshotDir, `qb64pe-${timestamp}.${format}`);
    
    const platform = os.platform();
    
    try {
      if (platform === 'win32') {
        return await this.captureWindowsScreenshot(outputPath, options);
      } else if (platform === 'darwin') {
        return await this.captureMacOSScreenshot(outputPath, options);
      } else {
        return await this.captureLinuxScreenshot(outputPath, options);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Capture screenshot on Windows
   */
  private async captureWindowsScreenshot(outputPath: string, options: ScreenshotOptions): Promise<ScreenshotResult> {
    const timestamp = new Date().toISOString();
    
    try {
      // Use PowerShell with .NET to capture window
      const psScript = `
        Add-Type -AssemblyName System.Drawing
        Add-Type -AssemblyName System.Windows.Forms
        
        ${options.windowTitle || options.processName ? `
        $process = Get-Process | Where-Object {
          $_.ProcessName -like "*${options.processName || 'qb64pe'}*" -or 
          $_.MainWindowTitle -like "*${options.windowTitle || 'QB64PE'}*"
        } | Select-Object -First 1
        
        if ($process -and $process.MainWindowHandle -ne 0) {
          $hwnd = $process.MainWindowHandle
          $rect = New-Object System.Drawing.Rectangle
          [Win32.GetWindowRect]::GetWindowRect($hwnd, [ref]$rect)
          
          $bitmap = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
          $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
          $graphics.CopyFromScreen($rect.Location, [System.Drawing.Point]::Empty, $rect.Size)
          
          $bitmap.Save("${outputPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
          $bitmap.Dispose()
          $graphics.Dispose()
          
          Write-Output "SUCCESS:$($process.Id):$($process.MainWindowTitle):$($rect.X),$($rect.Y),$($rect.Width),$($rect.Height)"
        } else {
          Write-Output "ERROR:No QB64PE window found"
        }
        ` : `
        $screen = [System.Windows.Forms.SystemInformation]::VirtualScreen
        $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
        
        $bitmap.Save("${outputPath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
        $graphics.Dispose()
        
        Write-Output "SUCCESS:0:Full Screen:0,0,$($screen.Width),$($screen.Height)"
        `}
      `;

      const { stdout } = await execAsync(`powershell -Command "${psScript}"`);
      const result = stdout.trim();
      
      if (result.startsWith('SUCCESS:')) {
        const [, pid, title, bounds] = result.split(':');
        const [x, y, width, height] = bounds.split(',').map(Number);
        
        return {
          success: true,
          filePath: outputPath,
          timestamp,
          windowInfo: {
            title,
            processId: parseInt(pid),
            bounds: { x, y, width, height }
          }
        };
      } else {
        return {
          success: false,
          error: result.replace('ERROR:', ''),
          timestamp
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Capture screenshot on macOS
   */
  private async captureMacOSScreenshot(outputPath: string, options: ScreenshotOptions): Promise<ScreenshotResult> {
    const timestamp = new Date().toISOString();
    
    try {
      let screencaptureCmd = 'screencapture';
      
      if (options.windowTitle) {
        // Capture specific window by title
        screencaptureCmd += ` -l$(osascript -e 'tell app "System Events" to id of window "${options.windowTitle}" of (first application process whose name contains "qb64pe")')`;
      } else if (options.captureRegion) {
        // Capture specific region
        const { x, y, width, height } = options.captureRegion;
        screencaptureCmd += ` -R${x},${y},${width},${height}`;
      }
      
      screencaptureCmd += ` "${outputPath}"`;
      
      await execAsync(screencaptureCmd);
      
      if (fs.existsSync(outputPath)) {
        return {
          success: true,
          filePath: outputPath,
          timestamp
        };
      } else {
        return {
          success: false,
          error: 'Screenshot file was not created',
          timestamp
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Capture screenshot on Linux
   */
  private async captureLinuxScreenshot(outputPath: string, options: ScreenshotOptions): Promise<ScreenshotResult> {
    const timestamp = new Date().toISOString();
    
    try {
      let screenshotCmd = '';
      
      // Try different screenshot tools in order of preference
      const tools = ['import', 'gnome-screenshot', 'scrot', 'xwd'];
      
      for (const tool of tools) {
        try {
          await execAsync(`which ${tool}`);
          
          switch (tool) {
            case 'import':
              if (options.windowTitle) {
                screenshotCmd = `import -window "$(xdotool search --name "${options.windowTitle}" | head -1)" "${outputPath}"`;
              } else {
                screenshotCmd = `import -window root "${outputPath}"`;
              }
              break;
              
            case 'gnome-screenshot':
              if (options.windowTitle) {
                screenshotCmd = `gnome-screenshot -w -f "${outputPath}"`;
              } else {
                screenshotCmd = `gnome-screenshot -f "${outputPath}"`;
              }
              break;
              
            case 'scrot':
              if (options.windowTitle) {
                screenshotCmd = `scrot -s "${outputPath}"`;
              } else {
                screenshotCmd = `scrot "${outputPath}"`;
              }
              break;
              
            case 'xwd':
              if (options.windowTitle) {
                screenshotCmd = `xwd -name "${options.windowTitle}" | convert xwd:- "${outputPath}"`;
              } else {
                screenshotCmd = `xwd -root | convert xwd:- "${outputPath}"`;
              }
              break;
          }
          
          if (screenshotCmd) break;
        } catch {
          continue;
        }
      }
      
      if (!screenshotCmd) {
        return {
          success: false,
          error: 'No suitable screenshot tool found. Install ImageMagick, gnome-screenshot, scrot, or xwd.',
          timestamp
        };
      }
      
      await execAsync(screenshotCmd);
      
      if (fs.existsSync(outputPath)) {
        return {
          success: true,
          filePath: outputPath,
          timestamp
        };
      } else {
        return {
          success: false,
          error: 'Screenshot file was not created',
          timestamp
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Start monitoring QB64PE processes and automatically capture screenshots
   */
  async startMonitoring(intervalMs: number = 5000, captureIntervalMs: number = 10000): Promise<void> {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    let lastCaptureTime = 0;
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const processes = await this.getQB64PEProcesses();
        const now = Date.now();
        
        if (processes.length > 0 && (now - lastCaptureTime) >= captureIntervalMs) {
          // Capture screenshot of the first QB64PE process found
          const result = await this.captureQB64PEWindow({
            processName: processes[0].name,
            windowTitle: processes[0].windowTitle
          });
          
          if (result.success) {
            console.error(`Screenshot captured: ${result.filePath}`);
            lastCaptureTime = now;
          } else {
            console.warn(`Screenshot failed: ${result.error}`);
          }
        }
      } catch (error) {
        console.error('Error in monitoring loop:', error);
      }
    }, intervalMs);
    
    // Removed console.error to prevent MCP protocol parsing issues
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.error('Stopped monitoring QB64PE processes');
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus(): { isMonitoring: boolean; screenshotDir: string } {
    return {
      isMonitoring: this.isMonitoring,
      screenshotDir: this.screenshotDir
    };
  }

  /**
   * Get all screenshot files in the directory
   */
  getScreenshotFiles(): string[] {
    if (!fs.existsSync(this.screenshotDir)) {
      return [];
    }
    
    return fs.readdirSync(this.screenshotDir)
      .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
      .map(file => path.join(this.screenshotDir, file))
      .sort((a, b) => {
        const statA = fs.statSync(a);
        const statB = fs.statSync(b);
        return statB.mtime.getTime() - statA.mtime.getTime();
      });
  }

  /**
   * Clean up old screenshots
   */
  cleanupOldScreenshots(maxAge: number = 24 * 60 * 60 * 1000): void {
    const files = this.getScreenshotFiles();
    const now = Date.now();
    
    for (const file of files) {
      try {
        const stats = fs.statSync(file);
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(file);
          console.error(`Cleaned up old screenshot: ${file}`);
        }
      } catch (error) {
        console.warn(`Error cleaning up ${file}:`, error);
      }
    }
  }
}
