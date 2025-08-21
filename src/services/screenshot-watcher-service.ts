import * as chokidar from 'chokidar';
import * as path from 'path';
import * as fs from 'fs';
import { EventEmitter } from 'events';

export interface AnalysisRequest {
  screenshotPath: string;
  timestamp: Date;
  fileSize: number;
  analysisType: 'shapes' | 'colors' | 'layout' | 'text' | 'quality' | 'comprehensive';
  metadata?: {
    programCode?: string;
    expectedElements?: string[];
    processInfo?: {
      pid: number;
      name: string;
      windowTitle: string;
    };
  };
}

export interface AnalysisResult {
  screenshotPath: string;
  analysisType: string;
  timestamp: Date;
  success: boolean;
  analysis?: {
    shapes: string[];
    colors: string[];
    textElements: string[];
    layout: string;
    quality: string;
    overallDescription: string;
  };
  error?: string;
  suggestions?: string[];
}

/**
 * Service for watching screenshot directories and triggering automatic analysis
 */
export class ScreenshotWatcherService extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private watchedDirectories: Set<string> = new Set();
  private analysisQueue: AnalysisRequest[] = [];
  private isProcessing: boolean = false;
  private analysisHistory: AnalysisResult[] = [];

  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * Setup internal event handlers
   */
  private setupEventHandlers(): void {
    this.on('screenshot-detected', this.handleScreenshotDetected.bind(this));
    this.on('analysis-complete', this.handleAnalysisComplete.bind(this));
  }

  /**
   * Start watching a directory for new screenshots
   */
  async startWatching(directory: string, options: {
    analysisType?: 'shapes' | 'colors' | 'layout' | 'text' | 'quality' | 'comprehensive';
    autoAnalyze?: boolean;
    filePattern?: string;
  } = {}): Promise<void> {
    const absolutePath = path.resolve(directory);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }

    this.watchedDirectories.add(absolutePath);

    // Initialize watcher if not already created
    if (!this.watcher) {
      this.watcher = chokidar.watch([], {
        ignored: /^\./, // ignore dotfiles
        persistent: true,
        ignoreInitial: false,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100
        }
      });

      this.watcher.on('add', (filePath: string) => {
        this.handleNewFile(filePath, options);
      });

      this.watcher.on('change', (filePath: string) => {
        this.handleFileChange(filePath, options);
      });

      this.watcher.on('error', (error: unknown) => {
        console.error('Screenshot watcher error:', error);
        this.emit('error', error);
      });
    }

    // Add directory to watcher
    const watchPattern = options.filePattern || '**/*.{png,jpg,jpeg,gif}';
    const fullPattern = path.join(absolutePath, watchPattern);
    this.watcher.add(fullPattern);

    console.log(`Started watching ${absolutePath} for screenshots`);
    this.emit('watching-started', { directory: absolutePath, pattern: watchPattern });
  }

  /**
   * Stop watching a specific directory
   */
  async stopWatching(directory?: string): Promise<void> {
    if (directory) {
      const absolutePath = path.resolve(directory);
      this.watchedDirectories.delete(absolutePath);
      
      if (this.watcher) {
        this.watcher.unwatch(path.join(absolutePath, '**/*.{png,jpg,jpeg,gif}'));
      }
      
      console.log(`Stopped watching ${absolutePath}`);
      this.emit('watching-stopped', { directory: absolutePath });
    } else {
      // Stop watching all directories
      if (this.watcher) {
        await this.watcher.close();
        this.watcher = null;
      }
      this.watchedDirectories.clear();
      console.log('Stopped watching all directories');
      this.emit('watching-stopped', { directory: 'all' });
    }
  }

  /**
   * Handle new file detection
   */
  private handleNewFile(filePath: string, options: any): void {
    if (this.isScreenshotFile(filePath)) {
      console.log(`New screenshot detected: ${filePath}`);
      
      const stats = fs.statSync(filePath);
      const analysisRequest: AnalysisRequest = {
        screenshotPath: filePath,
        timestamp: new Date(),
        fileSize: stats.size,
        analysisType: options.analysisType || 'comprehensive'
      };

      this.emit('screenshot-detected', analysisRequest);

      if (options.autoAnalyze !== false) {
        this.queueAnalysis(analysisRequest);
      }
    }
  }

  /**
   * Handle file change (useful for detecting when QB64PE finishes writing)
   */
  private handleFileChange(filePath: string, options: any): void {
    if (this.isScreenshotFile(filePath)) {
      console.log(`Screenshot file updated: ${filePath}`);
      // Could trigger re-analysis if needed
    }
  }

  /**
   * Check if file is a screenshot
   */
  private isScreenshotFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
  }

  /**
   * Handle screenshot detected event
   */
  private async handleScreenshotDetected(request: AnalysisRequest): Promise<void> {
    console.log(`Processing screenshot: ${request.screenshotPath}`);
    
    // Extract any metadata from filename or directory structure
    const enhancedRequest = await this.enhanceAnalysisRequest(request);
    
    this.emit('screenshot-ready', enhancedRequest);
  }

  /**
   * Enhance analysis request with additional metadata
   */
  private async enhanceAnalysisRequest(request: AnalysisRequest): Promise<AnalysisRequest> {
    const filename = path.basename(request.screenshotPath);
    const directory = path.dirname(request.screenshotPath);
    
    // Try to find associated QB64PE code
    const codeFile = this.findAssociatedCode(request.screenshotPath);
    let programCode: string | undefined;
    
    if (codeFile && fs.existsSync(codeFile)) {
      try {
        programCode = fs.readFileSync(codeFile, 'utf-8');
      } catch (error) {
        console.warn(`Could not read associated code file ${codeFile}:`, error);
      }
    }

    // Extract expected elements from filename patterns
    const expectedElements = this.extractExpectedElements(filename);

    return {
      ...request,
      metadata: {
        ...request.metadata,
        programCode,
        expectedElements
      }
    };
  }

  /**
   * Find associated QB64PE code file
   */
  private findAssociatedCode(screenshotPath: string): string | null {
    const dir = path.dirname(screenshotPath);
    const baseName = path.basename(screenshotPath, path.extname(screenshotPath));
    
    // Common patterns for associated code files
    const patterns = [
      `${baseName}.bas`,
      `${baseName}.bi`,
      `${baseName}-source.bas`,
      baseName.replace(/-test$|-screenshot$/, '.bas'),
      baseName.replace(/test-/, '').replace(/-test/, '.bas')
    ];

    // Look in current directory and parent directories
    const searchDirs = [
      dir,
      path.join(dir, '..'),
      path.join(dir, '../test-project'),
      path.join(dir, '../src'),
      path.join(dir, '../examples')
    ];

    for (const searchDir of searchDirs) {
      if (fs.existsSync(searchDir)) {
        for (const pattern of patterns) {
          const codeFile = path.join(searchDir, pattern);
          if (fs.existsSync(codeFile)) {
            return codeFile;
          }
        }
      }
    }

    return null;
  }

  /**
   * Extract expected elements from filename
   */
  private extractExpectedElements(filename: string): string[] {
    const elements: string[] = [];
    const lower = filename.toLowerCase();

    // Shape keywords
    if (lower.includes('circle')) elements.push('circle');
    if (lower.includes('rectangle') || lower.includes('rect')) elements.push('rectangle');
    if (lower.includes('line')) elements.push('line');
    if (lower.includes('triangle')) elements.push('triangle');
    if (lower.includes('ellipse')) elements.push('ellipse');
    if (lower.includes('polygon')) elements.push('polygon');

    // Color keywords
    if (lower.includes('red')) elements.push('red');
    if (lower.includes('blue')) elements.push('blue');
    if (lower.includes('green')) elements.push('green');
    if (lower.includes('yellow')) elements.push('yellow');
    if (lower.includes('color')) elements.push('colors');
    if (lower.includes('palette')) elements.push('color palette');

    // Test type keywords
    if (lower.includes('text')) elements.push('text elements');
    if (lower.includes('grid')) elements.push('grid layout');
    if (lower.includes('basic')) elements.push('basic shapes');

    return elements;
  }

  /**
   * Queue analysis request
   */
  queueAnalysis(request: AnalysisRequest): void {
    this.analysisQueue.push(request);
    this.processAnalysisQueue();
  }

  /**
   * Process analysis queue
   */
  private async processAnalysisQueue(): Promise<void> {
    if (this.isProcessing || this.analysisQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.analysisQueue.length > 0) {
      const request = this.analysisQueue.shift()!;
      
      try {
        const result = await this.performAnalysis(request);
        this.analysisHistory.push(result);
        this.emit('analysis-complete', result);
      } catch (error) {
        const errorResult: AnalysisResult = {
          screenshotPath: request.screenshotPath,
          analysisType: request.analysisType,
          timestamp: new Date(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        this.analysisHistory.push(errorResult);
        this.emit('analysis-error', errorResult);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Perform analysis on screenshot
   */
  private async performAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    console.log(`Analyzing ${request.screenshotPath} (${request.analysisType})`);

    // This would normally call the MCP server's analyze_qb64pe_graphics_screenshot tool
    // For now, we'll create a mock analysis that would be replaced with actual LLM calls
    
    const result: AnalysisResult = {
      screenshotPath: request.screenshotPath,
      analysisType: request.analysisType,
      timestamp: new Date(),
      success: true,
      analysis: {
        shapes: request.metadata?.expectedElements?.filter(e => 
          ['circle', 'rectangle', 'line', 'triangle', 'ellipse'].includes(e)
        ) || [],
        colors: request.metadata?.expectedElements?.filter(e => 
          ['red', 'blue', 'green', 'yellow', 'colors'].includes(e)
        ) || [],
        textElements: request.metadata?.expectedElements?.filter(e => 
          e.includes('text')
        ) || [],
        layout: 'Automated layout analysis pending LLM integration',
        quality: 'Good quality screenshot detected',
        overallDescription: `Screenshot analysis ready for LLM processing. Expected elements: ${request.metadata?.expectedElements?.join(', ') || 'none specified'}`
      },
      suggestions: [
        'Screenshot captured successfully and ready for analysis',
        'Consider integrating with vision-capable LLM for detailed analysis',
        request.metadata?.programCode ? 'Associated QB64PE code found for context' : 'No associated code found - consider naming conventions'
      ]
    };

    return result;
  }

  /**
   * Handle analysis completion
   */
  private handleAnalysisComplete(result: AnalysisResult): void {
    console.log(`Analysis complete for ${result.screenshotPath}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    
    if (result.success && result.analysis) {
      console.log(`Found ${result.analysis.shapes.length} shapes, ${result.analysis.colors.length} colors`);
    }

    // Could trigger additional actions like notifications, reports, etc.
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory(limit?: number): AnalysisResult[] {
    const history = this.analysisHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Get recent screenshots
   */
  getRecentScreenshots(limit: number = 10): AnalysisRequest[] {
    const recent: AnalysisRequest[] = [];
    
    for (const dir of this.watchedDirectories) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
          .filter(file => this.isScreenshotFile(path.join(dir, file)))
          .map(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            return {
              screenshotPath: filePath,
              timestamp: stats.mtime,
              fileSize: stats.size,
              analysisType: 'comprehensive' as const
            };
          })
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        recent.push(...files);
      }
    }

    return recent.slice(0, limit);
  }

  /**
   * Clear analysis history
   */
  clearHistory(): void {
    this.analysisHistory = [];
    console.log('Analysis history cleared');
  }

  /**
   * Get watcher status
   */
  getStatus(): {
    isWatching: boolean;
    watchedDirectories: string[];
    queueLength: number;
    isProcessing: boolean;
    totalAnalyses: number;
  } {
    return {
      isWatching: this.watcher !== null,
      watchedDirectories: Array.from(this.watchedDirectories),
      queueLength: this.analysisQueue.length,
      isProcessing: this.isProcessing,
      totalAnalyses: this.analysisHistory.length
    };
  }
}
