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
export declare class ScreenshotWatcherService extends EventEmitter {
    private watcher;
    private watchedDirectories;
    private analysisQueue;
    private isProcessing;
    private analysisHistory;
    constructor();
    /**
     * Setup internal event handlers
     */
    private setupEventHandlers;
    /**
     * Start watching a directory for new screenshots
     */
    startWatching(directory: string, options?: {
        analysisType?: 'shapes' | 'colors' | 'layout' | 'text' | 'quality' | 'comprehensive';
        autoAnalyze?: boolean;
        filePattern?: string;
    }): Promise<void>;
    /**
     * Stop watching a specific directory
     */
    stopWatching(directory?: string): Promise<void>;
    /**
     * Handle new file detection
     */
    private handleNewFile;
    /**
     * Handle file change (useful for detecting when QB64PE finishes writing)
     */
    private handleFileChange;
    /**
     * Check if file is a screenshot
     */
    private isScreenshotFile;
    /**
     * Handle screenshot detected event
     */
    private handleScreenshotDetected;
    /**
     * Enhance analysis request with additional metadata
     */
    private enhanceAnalysisRequest;
    /**
     * Find associated QB64PE code file
     */
    private findAssociatedCode;
    /**
     * Extract expected elements from filename
     */
    private extractExpectedElements;
    /**
     * Queue analysis request
     */
    queueAnalysis(request: AnalysisRequest): void;
    /**
     * Process analysis queue
     */
    private processAnalysisQueue;
    /**
     * Perform analysis on screenshot
     */
    private performAnalysis;
    /**
     * Handle analysis completion
     */
    private handleAnalysisComplete;
    /**
     * Get analysis history
     */
    getAnalysisHistory(limit?: number): AnalysisResult[];
    /**
     * Get recent screenshots
     */
    getRecentScreenshots(limit?: number): AnalysisRequest[];
    /**
     * Clear analysis history
     */
    clearHistory(): void;
    /**
     * Get watcher status
     */
    getStatus(): {
        isWatching: boolean;
        watchedDirectories: string[];
        queueLength: number;
        isProcessing: boolean;
        totalAnalyses: number;
    };
}
//# sourceMappingURL=screenshot-watcher-service.d.ts.map