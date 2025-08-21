import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Timeout utility for preventing hanging operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
  console.log(`[QB64PE-Install] Starting operation: ${operation} (timeout: ${timeoutMs}ms)`);
  
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      console.log(`[QB64PE-Install] Operation timed out: ${operation} after ${timeoutMs}ms`);
      reject(new Error(`Timeout after ${timeoutMs}ms for operation: ${operation}`));
    }, timeoutMs);
  });
  
  return Promise.race([
    promise.then(result => {
      clearTimeout(timeoutId);
      console.log(`[QB64PE-Install] Operation completed: ${operation}`);
      return result;
    }).catch(error => {
      clearTimeout(timeoutId);
      console.log(`[QB64PE-Install] Operation failed: ${operation} - ${error.message}`);
      throw error;
    }),
    timeoutPromise
  ]);
};

// Logging utility
const log = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
  console.error(`[${timestamp}] ${prefix} QB64PE-Install: ${message}`);
};

export interface QB64PEInstallation {
  isInstalled: boolean;
  installPath?: string;
  version?: string;
  inPath: boolean;
  executable?: string;
  platform: string;
}

export interface PathConfiguration {
  platform: string;
  currentPath: string[];
  pathSeparator: string;
  instructions: {
    temporary: string[];
    permanent: string[];
    verification: string[];
  };
  commonInstallPaths: string[];
  downloadUrl: string;
}

/**
 * Service for detecting QB64PE installation and providing PATH configuration guidance
 */
export class QB64PEInstallationService {
  private readonly platform: string;
  private readonly pathSeparator: string;
  private readonly executableName: string;

  constructor() {
    this.platform = os.platform();
    this.pathSeparator = this.platform === 'win32' ? ';' : ':';
    this.executableName = this.platform === 'win32' ? 'qb64pe.exe' : 'qb64pe';
  }

  /**
   * Detect QB64PE installation and PATH configuration
   */
  async detectInstallation(): Promise<QB64PEInstallation> {
    log('Starting QB64PE installation detection');
    
    const installation: QB64PEInstallation = {
      isInstalled: false,
      inPath: false,
      platform: this.platform
    };

    try {
      log(`Detecting on platform: ${this.platform}`);
      
      // First check if QB64PE is in PATH (with timeout)
      log('Checking if QB64PE is in PATH...');
      const pathResult = await withTimeout(
        this.checkInPath(), 
        5000, 
        'checkInPath'
      );
      
      if (pathResult.found) {
        log(`✅ Found QB64PE in PATH: ${pathResult.path}`);
        installation.isInstalled = true;
        installation.inPath = true;
        installation.installPath = pathResult.path;
        installation.executable = pathResult.executable;
        
        // Get version with timeout
        log('Getting version information...');
        installation.version = pathResult.executable ? await withTimeout(
          this.getVersion(pathResult.executable), 
          3000, 
          'getVersion from PATH'
        ) : undefined;
        
        log(`✅ Detection complete - QB64PE found in PATH (version: ${installation.version || 'unknown'})`);
        return installation;
      }

      log('QB64PE not found in PATH, searching common installation directories...');
      
      // Search common installation directories (with timeout)
      const searchResult = await withTimeout(
        this.searchCommonPaths(), 
        10000, 
        'searchCommonPaths'
      );
      
      if (searchResult.found) {
        log(`✅ Found QB64PE installation: ${searchResult.path}`);
        installation.isInstalled = true;
        installation.inPath = false;
        installation.installPath = searchResult.path;
        installation.executable = searchResult.executable;
        
        // Get version with timeout
        log('Getting version information...');
        installation.version = searchResult.executable ? await withTimeout(
          this.getVersion(searchResult.executable), 
          3000, 
          'getVersion from search'
        ) : undefined;
        
        log(`✅ Detection complete - QB64PE found but not in PATH (version: ${installation.version || 'unknown'})`);
        return installation;
      }

      log('❌ QB64PE not found in PATH or common installation directories');
      return installation;
      
    } catch (error) {
      log(`Error during detection: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      // Return partial installation info even on error
      return installation;
    }
  }

  /**
   * Check if QB64PE is available in PATH
   */
  private async checkInPath(): Promise<{ found: boolean; path?: string; executable?: string }> {
    log('Checking PATH for QB64PE executable...');
    
    try {
      let command: string;
      
      if (this.platform === 'win32') {
        command = 'where qb64pe';
        log('Using Windows "where" command');
      } else {
        command = 'which qb64pe';
        log('Using Unix "which" command');
      }

      log(`Executing: ${command} (with 3s timeout)`);
      
      // Add timeout specifically for the exec call
      const execPromise = execAsync(command);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Command "${command}" timed out after 3s`));
        }, 3000);
      });
      
      const { stdout } = await Promise.race([execPromise, timeoutPromise]);
      const executablePath = stdout.trim().split('\n')[0];
      
      log(`Command output: ${executablePath}`);
      
      if (executablePath && executablePath.length > 0) {
        // Quick existence check with timeout
        try {
          const exists = fs.existsSync(executablePath);
          if (exists) {
            log(`✅ Found executable at: ${executablePath}`);
            return {
              found: true,
              path: path.dirname(executablePath),
              executable: executablePath
            };
          } else {
            log('❌ Executable path does not exist');
          }
        } catch (fsError) {
          log(`❌ File system error checking path: ${fsError}`);
        }
      } else {
        log('❌ No executable path returned from command');
      }
    } catch (error) {
      log(`PATH check failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'warn');
      // This is expected if QB64PE is not in PATH, so don't treat as fatal error
    }

    return { found: false };
  }

  /**
   * Search common installation paths for QB64PE
   */
  private async searchCommonPaths(): Promise<{ found: boolean; path?: string; executable?: string }> {
    const commonPaths = this.getCommonInstallPaths();
    log(`Searching ${commonPaths.length} common installation paths...`);
    
    for (let i = 0; i < commonPaths.length; i++) {
      const searchPath = commonPaths[i];
      log(`[${i + 1}/${commonPaths.length}] Checking: ${searchPath}`);
      
      try {
        const executablePath = path.join(searchPath, this.executableName);
        
        // Quick existence check with timeout protection
        const exists = await withTimeout(
          new Promise<boolean>((resolve) => {
            try {
              resolve(fs.existsSync(executablePath));
            } catch (error) {
              log(`Error checking path ${executablePath}: ${error}`, 'warn');
              resolve(false);
            }
          }),
          1000,
          `check existence of ${executablePath}`
        );
        
        if (exists) {
          log(`Found potential executable: ${executablePath}`);
          
          // Verify it's a file with timeout protection
          const isFile = await withTimeout(
            new Promise<boolean>((resolve) => {
              try {
                const stats = fs.statSync(executablePath);
                resolve(stats.isFile());
              } catch (error) {
                log(`Error getting file stats for ${executablePath}: ${error}`, 'warn');
                resolve(false);
              }
            }),
            1000,
            `verify file stats for ${executablePath}`
          );
          
          if (isFile) {
            log(`✅ Valid QB64PE installation found: ${searchPath}`);
            return {
              found: true,
              path: searchPath,
              executable: executablePath
            };
          } else {
            log(`Path exists but is not a file: ${executablePath}`, 'warn');
          }
        }
      } catch (error) {
        log(`Error searching path ${searchPath}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'warn');
        // Continue searching other paths
      }
    }

    log('❌ No QB64PE installation found in common paths');
    return { found: false };
  }

  /**
   * Get QB64PE version information
   */
  private async getVersion(executablePath: string): Promise<string | undefined> {
    log(`Getting version for: ${executablePath}`);
    
    try {
      // Try --version first with timeout
      log('Trying --version flag...');
      const versionPromise = execAsync(`"${executablePath}" --version`);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Version command timed out after 5s`));
        }, 5000);
      });
      
      const { stdout } = await Promise.race([versionPromise, timeoutPromise]);
      const version = stdout.trim();
      log(`Version output: ${version}`);
      return version;
    } catch (error) {
      log(`--version failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'warn');
      
      try {
        // Try alternative -v flag with timeout
        log('Trying -v flag...');
        const versionPromise = execAsync(`"${executablePath}" -v`);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Version -v command timed out after 5s`));
          }, 5000);
        });
        
        const { stdout } = await Promise.race([versionPromise, timeoutPromise]);
        const version = stdout.trim();
        log(`Version output: ${version}`);
        return version;
      } catch (error2) {
        log(`-v also failed: ${error2 instanceof Error ? error2.message : 'Unknown error'}`, 'warn');
        
        // Try to get version from filename or directory structure
        try {
          log('Attempting to extract version from path...');
          const dirName = path.basename(path.dirname(executablePath));
          const versionMatch = dirName.match(/v?\d+\.\d+(\.\d+)?/);
          if (versionMatch) {
            log(`Extracted version from path: ${versionMatch[0]}`);
            return versionMatch[0];
          }
        } catch (error3) {
          log(`Path version extraction failed: ${error3}`, 'warn');
        }
        
        log('Could not determine version', 'warn');
        return undefined;
      }
    }
  }

  /**
   * Get common installation paths for current platform
   */
  getCommonInstallPaths(): string[] {
    switch (this.platform) {
      case 'win32':
        return [
          'C:\\QB64pe',
          'C:\\QB64pe\\qb64pe',
          'C:\\Program Files\\QB64pe',
          'C:\\Program Files (x86)\\QB64pe',
          'C:\\qb64',
          'C:\\qb64pe',
          path.join(os.homedir(), 'QB64pe'),
          path.join(os.homedir(), 'Downloads', 'QB64pe'),
          path.join(os.homedir(), 'git', 'QB64pe'),
          'C:\\Users\\grymmjack\\git\\QB64pe' // User-specific path
        ];
      
      case 'darwin': // macOS
        return [
          '/Applications/QB64pe.app/Contents/MacOS',
          '/usr/local/bin',
          '/opt/QB64pe',
          path.join(os.homedir(), 'QB64pe'),
          path.join(os.homedir(), 'Applications', 'QB64pe.app', 'Contents', 'MacOS'),
          path.join(os.homedir(), 'Downloads', 'QB64pe'),
          '/opt/homebrew/bin',
          '/usr/local/Cellar/qb64pe/*/bin'
        ];
      
      case 'linux':
        return [
          '/usr/local/bin',
          '/usr/bin',
          '/opt/QB64pe',
          '/opt/qb64pe',
          path.join(os.homedir(), 'QB64pe'),
          path.join(os.homedir(), '.local', 'bin'),
          path.join(os.homedir(), 'bin'),
          path.join(os.homedir(), 'Downloads', 'QB64pe'),
          '/snap/bin',
          '/var/lib/flatpak/exports/bin'
        ];
      
      default:
        return [
          '/usr/local/bin',
          '/usr/bin',
          path.join(os.homedir(), 'QB64pe'),
          path.join(os.homedir(), 'bin')
        ];
    }
  }

  /**
   * Generate PATH configuration guidance for current platform
   */
  getPathConfiguration(installPath?: string): PathConfiguration {
    const currentPath = this.getCurrentPath();
    
    const config: PathConfiguration = {
      platform: this.platform,
      currentPath,
      pathSeparator: this.pathSeparator,
      instructions: {
        temporary: [],
        permanent: [],
        verification: []
      },
      commonInstallPaths: this.getCommonInstallPaths(),
      downloadUrl: 'https://github.com/QB64-Phoenix-Edition/QB64pe/releases'
    };

    // Generate platform-specific instructions
    switch (this.platform) {
      case 'win32':
        config.instructions = this.getWindowsPathInstructions(installPath);
        break;
      case 'darwin':
        config.instructions = this.getMacOSPathInstructions(installPath);
        break;
      case 'linux':
        config.instructions = this.getLinuxPathInstructions(installPath);
        break;
      default:
        config.instructions = this.getGenericPathInstructions(installPath);
    }

    return config;
  }

  /**
   * Get current PATH environment variable
   */
  private getCurrentPath(): string[] {
    const pathEnv = process.env.PATH || '';
    return pathEnv.split(this.pathSeparator).filter(p => p.length > 0);
  }

  /**
   * Generate Windows PATH configuration instructions
   */
  private getWindowsPathInstructions(installPath?: string): PathConfiguration['instructions'] {
    const qb64Path = installPath || 'C:\\QB64pe';
    
    return {
      temporary: [
        `# Temporary PATH addition (current session only):`,
        `$env:PATH += ";${qb64Path}"`,
        ``,
        `# Or in Command Prompt:`,
        `set PATH=%PATH%;${qb64Path}`,
        ``,
        `# Verify:`,
        `qb64pe --version`
      ],
      permanent: [
        `# Method 1: Using PowerShell (Run as Administrator):`,
        `[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";${qb64Path}", [EnvironmentVariableTarget]::Machine)`,
        ``,
        `# Method 2: Using GUI:`,
        `1. Press Win + X, select "System"`,
        `2. Click "Advanced system settings"`,
        `3. Click "Environment Variables..."`,
        `4. Under "System variables", select "Path" and click "Edit..."`,
        `5. Click "New" and add: ${qb64Path}`,
        `6. Click "OK" on all dialogs`,
        `7. Restart Command Prompt/PowerShell`,
        ``,
        `# Method 3: Using Command Prompt (Run as Administrator):`,
        `setx PATH "%PATH%;${qb64Path}" /M`,
        ``,
        `# Method 4: Using Registry Editor (Advanced):`,
        `# Navigate to: HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`,
        `# Edit the "Path" value and append: ;${qb64Path}`
      ],
      verification: [
        `# Test QB64PE is accessible:`,
        `qb64pe --version`,
        `qb64pe --help`,
        ``,
        `# Check PATH contains QB64PE:`,
        `echo $env:PATH | Select-String "QB64pe"`,
        ``,
        `# Or in Command Prompt:`,
        `echo %PATH% | findstr QB64pe`,
        ``,
        `# Locate QB64PE executable:`,
        `where qb64pe`
      ]
    };
  }

  /**
   * Generate macOS PATH configuration instructions
   */
  private getMacOSPathInstructions(installPath?: string): PathConfiguration['instructions'] {
    const qb64Path = installPath || '/Applications/QB64pe.app/Contents/MacOS';
    
    return {
      temporary: [
        `# Temporary PATH addition (current session only):`,
        `export PATH="$PATH:${qb64Path}"`,
        ``,
        `# Verify:`,
        `qb64pe --version`
      ],
      permanent: [
        `# Method 1: Add to ~/.zshrc (default shell on macOS 10.15+):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.zshrc`,
        `source ~/.zshrc`,
        ``,
        `# Method 2: Add to ~/.bash_profile (if using bash):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.bash_profile`,
        `source ~/.bash_profile`,
        ``,
        `# Method 3: Add to ~/.profile (universal):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.profile`,
        `source ~/.profile`,
        ``,
        `# Method 4: Create symbolic link to /usr/local/bin:`,
        `sudo ln -sf "${qb64Path}/qb64pe" /usr/local/bin/qb64pe`,
        ``,
        `# Method 5: Using Homebrew (if QB64PE has a formula):`,
        `brew install qb64pe  # If available`,
        ``,
        `# For QB64PE.app from Applications folder:`,
        `echo 'export PATH="$PATH:/Applications/QB64pe.app/Contents/MacOS"' >> ~/.zshrc`
      ],
      verification: [
        `# Test QB64PE is accessible:`,
        `qb64pe --version`,
        `qb64pe --help`,
        ``,
        `# Check PATH contains QB64PE:`,
        `echo $PATH | grep QB64pe`,
        ``,
        `# Locate QB64PE executable:`,
        `which qb64pe`,
        ``,
        `# Check shell configuration:`,
        `cat ~/.zshrc | grep QB64pe`,
        `cat ~/.bash_profile | grep QB64pe`
      ]
    };
  }

  /**
   * Generate Linux PATH configuration instructions
   */
  private getLinuxPathInstructions(installPath?: string): PathConfiguration['instructions'] {
    const qb64Path = installPath || '/opt/QB64pe';
    
    return {
      temporary: [
        `# Temporary PATH addition (current session only):`,
        `export PATH="$PATH:${qb64Path}"`,
        ``,
        `# Verify:`,
        `qb64pe --version`
      ],
      permanent: [
        `# Method 1: Add to ~/.bashrc (most common):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.bashrc`,
        `source ~/.bashrc`,
        ``,
        `# Method 2: Add to ~/.profile (shell-independent):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.profile`,
        `source ~/.profile`,
        ``,
        `# Method 3: Add to ~/.zshrc (if using zsh):`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.zshrc`,
        `source ~/.zshrc`,
        ``,
        `# Method 4: System-wide installation (/etc/environment):`,
        `sudo echo 'PATH="$PATH:${qb64Path}"' >> /etc/environment`,
        `# Then logout and login again`,
        ``,
        `# Method 5: Create symbolic link to /usr/local/bin:`,
        `sudo ln -sf "${qb64Path}/qb64pe" /usr/local/bin/qb64pe`,
        ``,
        `# Method 6: Using package manager (if available):`,
        `# Ubuntu/Debian: sudo apt install qb64pe`,
        `# Fedora: sudo dnf install qb64pe`,
        `# Arch: yay -S qb64pe-git`,
        ``,
        `# Method 7: AppImage or Flatpak:`,
        `# flatpak install flathub org.qb64pe.QB64pe`,
        `# Then add flatpak to PATH or use: flatpak run org.qb64pe.QB64pe`
      ],
      verification: [
        `# Test QB64PE is accessible:`,
        `qb64pe --version`,
        `qb64pe --help`,
        ``,
        `# Check PATH contains QB64PE:`,
        `echo $PATH | grep QB64pe`,
        ``,
        `# Locate QB64PE executable:`,
        `which qb64pe`,
        ``,
        `# Check shell configuration:`,
        `cat ~/.bashrc | grep QB64pe`,
        `cat ~/.profile | grep QB64pe`,
        ``,
        `# Check system PATH:`,
        `cat /etc/environment | grep QB64pe`
      ]
    };
  }

  /**
   * Generate generic PATH configuration instructions
   */
  private getGenericPathInstructions(installPath?: string): PathConfiguration['instructions'] {
    const qb64Path = installPath || '/usr/local/QB64pe';
    
    return {
      temporary: [
        `# Temporary PATH addition (current session only):`,
        `export PATH="$PATH:${qb64Path}"`,
        ``,
        `# Verify:`,
        `qb64pe --version`
      ],
      permanent: [
        `# Add to shell configuration file:`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.profile`,
        `source ~/.profile`,
        ``,
        `# Or add to ~/.bashrc if using bash:`,
        `echo 'export PATH="$PATH:${qb64Path}"' >> ~/.bashrc`,
        `source ~/.bashrc`,
        ``,
        `# Create symbolic link to system binary directory:`,
        `sudo ln -sf "${qb64Path}/qb64pe" /usr/local/bin/qb64pe`
      ],
      verification: [
        `# Test QB64PE is accessible:`,
        `qb64pe --version`,
        ``,
        `# Check PATH contains QB64PE:`,
        `echo $PATH | grep QB64pe`,
        ``,
        `# Locate QB64PE executable:`,
        `which qb64pe`
      ]
    };
  }

  /**
   * Generate installation guidance message for LLMs
   */
  generateInstallationGuidance(installation: QB64PEInstallation): string {
    if (installation.isInstalled && installation.inPath) {
      return `✅ QB64PE is properly installed and configured!
      
**Installation Details:**
- Path: ${installation.installPath}
- Executable: ${installation.executable}
- Version: ${installation.version || 'Unknown'}
- In PATH: Yes ✅
- Platform: ${installation.platform}

QB64PE is ready to use. You can compile programs with:
\`qb64pe -c yourprogram.bas\``;
    }

    if (installation.isInstalled && !installation.inPath) {
      const config = this.getPathConfiguration(installation.installPath);
      
      return `⚠️ QB64PE is installed but not in PATH!

**Found QB64PE at:** ${installation.installPath}
**Executable:** ${installation.executable}
**Version:** ${installation.version || 'Unknown'}

**To fix this, add QB64PE to your PATH:**

### Quick Fix (Temporary):
\`\`\`bash
${config.instructions.temporary.join('\n')}
\`\`\`

### Permanent Solution:
\`\`\`bash
${config.instructions.permanent.slice(0, 6).join('\n')}
\`\`\`

### Verify Installation:
\`\`\`bash
${config.instructions.verification.slice(0, 3).join('\n')}
\`\`\`

After adding to PATH, restart your terminal and try: \`qb64pe --version\``;
    }

    // QB64PE not found
    const config = this.getPathConfiguration();
    
    return `❌ QB64PE not found on this system!

**Platform:** ${installation.platform}

## Installation Steps:

### 1. Download QB64PE:
Visit: ${config.downloadUrl}
- Download the appropriate version for ${installation.platform}
- Extract to a suitable location

### 2. Recommended Installation Paths:
${config.commonInstallPaths.slice(0, 5).map(p => `- ${p}`).join('\n')}

### 3. Add to PATH:

**Quick Setup (after installation):**
\`\`\`bash
${config.instructions.temporary.join('\n')}
\`\`\`

**Permanent Setup:**
\`\`\`bash
${config.instructions.permanent.slice(0, 8).join('\n')}
\`\`\`

### 4. Verify Installation:
\`\`\`bash
${config.instructions.verification.slice(0, 4).join('\n')}
\`\`\`

## Alternative Installation Methods:

### Package Managers:
${this.getPackageManagerInstructions()}

### Manual Installation:
1. Download from GitHub releases
2. Extract to desired directory
3. Add directory to PATH
4. Verify with \`qb64pe --version\`

**Important:** After installation, you may need to restart your terminal or IDE for PATH changes to take effect.`;
  }

  /**
   * Get package manager installation instructions
   */
  private getPackageManagerInstructions(): string {
    switch (this.platform) {
      case 'win32':
        return `- **Chocolatey:** \`choco install qb64pe\` (if available)
- **Scoop:** \`scoop install qb64pe\` (if available)
- **Winget:** \`winget install QB64PE\` (if available)`;
      
      case 'darwin':
        return `- **Homebrew:** \`brew install qb64pe\` (if available)
- **MacPorts:** \`sudo port install qb64pe\` (if available)`;
      
      case 'linux':
        return `- **Ubuntu/Debian:** \`sudo apt install qb64pe\` (if available)
- **Fedora:** \`sudo dnf install qb64pe\` (if available)  
- **Arch Linux:** \`yay -S qb64pe-git\` (AUR)
- **Snap:** \`sudo snap install qb64pe\` (if available)
- **Flatpak:** \`flatpak install org.qb64pe.QB64pe\` (if available)`;
      
      default:
        return `- Check your distribution's package manager
- Look for QB64PE in software repositories
- Build from source if necessary`;
    }
  }

  /**
   * Check if a given path contains QB64PE
   */
  async validatePath(testPath: string): Promise<{ valid: boolean; executable?: string; version?: string }> {
    log(`Validating path: ${testPath}`);
    
    try {
      const executablePath = path.join(testPath, this.executableName);
      log(`Looking for executable: ${executablePath}`);
      
      // Check existence with timeout
      const exists = await withTimeout(
        new Promise<boolean>((resolve) => {
          try {
            resolve(fs.existsSync(executablePath));
          } catch (error) {
            log(`Error checking existence: ${error}`, 'error');
            resolve(false);
          }
        }),
        2000,
        `check existence of ${executablePath}`
      );
      
      if (exists) {
        log('Executable exists, checking if it\'s a file...');
        
        // Verify it's a file with timeout
        const isFile = await withTimeout(
          new Promise<boolean>((resolve) => {
            try {
              const stats = fs.statSync(executablePath);
              resolve(stats.isFile());
            } catch (error) {
              log(`Error getting file stats: ${error}`, 'error');
              resolve(false);
            }
          }),
          2000,
          `verify file stats for ${executablePath}`
        );
        
        if (isFile) {
          log('✅ Valid executable found, getting version...');
          
          // Get version with timeout
          const version = await withTimeout(
            this.getVersion(executablePath),
            5000,
            'getVersion for validation'
          );
          
          log(`✅ Path validation successful (version: ${version || 'unknown'})`);
          return {
            valid: true,
            executable: executablePath,
            version
          };
        } else {
          log('❌ Path exists but is not a file');
        }
      } else {
        log('❌ Executable not found at path');
      }
      
      return { valid: false };
    } catch (error) {
      log(`Path validation error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      return { valid: false };
    }
  }

  /**
   * Generate a complete installation report
   */
  async generateInstallationReport(): Promise<string> {
    log('Generating complete installation report...');
    
    try {
      const installation = await withTimeout(
        this.detectInstallation(),
        15000,
        'detectInstallation for report'
      );
      
      const config = this.getPathConfiguration(installation.installPath);
      
      const report = `# QB64PE Installation Report

**Generated:** ${new Date().toISOString()}
**Platform:** ${installation.platform}

## Installation Status

${installation.isInstalled ? '✅' : '❌'} **Installed:** ${installation.isInstalled ? 'Yes' : 'No'}
${installation.inPath ? '✅' : '❌'} **In PATH:** ${installation.inPath ? 'Yes' : 'No'}

${installation.installPath ? `**Install Path:** ${installation.installPath}` : ''}
${installation.executable ? `**Executable:** ${installation.executable}` : ''}
${installation.version ? `**Version:** ${installation.version}` : ''}

## Current PATH Configuration

**PATH Separator:** ${config.pathSeparator}
**Current PATH Entries:** ${config.currentPath.length}

${config.currentPath.length > 0 ? `
**Relevant PATH Entries:**
${config.currentPath.filter(p => p.toLowerCase().includes('qb64')).map(p => `- ${p}`).join('\n') || '(No QB64PE-related entries found)'}
` : ''}

## Recommended Actions

${this.generateInstallationGuidance(installation)}

## Platform-Specific Information

**Common Install Paths for ${installation.platform}:**
${config.commonInstallPaths.map(p => `- ${p}`).join('\n')}

**Download URL:** ${config.downloadUrl}

---
*This report was generated by the QB64PE MCP Server Installation Service*`;

      log('✅ Installation report generated successfully');
      return report;
      
    } catch (error) {
      const errorMsg = `Error generating installation report: ${error instanceof Error ? error.message : 'Unknown error'}`;
      log(errorMsg, 'error');
      
      // Return a basic error report rather than throwing
      return `# QB64PE Installation Report - ERROR

**Generated:** ${new Date().toISOString()}
**Platform:** ${this.platform}

## Error

${errorMsg}

This usually indicates a timeout or system issue during detection.
You can try:
1. Manually checking if QB64PE is installed
2. Running 'qb64pe --version' in terminal
3. Checking common installation paths manually

## Common Installation Paths for ${this.platform}:
${this.getCommonInstallPaths().map(p => `- ${p}`).join('\n')}

## Download QB64PE:
https://github.com/QB64-Phoenix-Edition/QB64pe/releases

---
*Error report generated by QB64PE MCP Server Installation Service*`;
    }
  }
}
