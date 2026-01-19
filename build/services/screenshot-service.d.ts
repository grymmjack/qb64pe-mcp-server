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
export declare class ScreenshotService {
    private screenshotDir;
    private isMonitoring;
    private monitoringInterval;
    constructor(screenshotDir?: string);
    /**
     * Ensure screenshot directory exists
     */
    private ensureScreenshotDirectory;
    /**
     * Get list of QB64PE processes currently running
     */
    getQB64PEProcesses(): Promise<ProcessInfo[]>;
    /**
     * Get window bounds for a process
     */
    private getWindowBounds;
    /**
     * Get window title for a process
     */
    private getWindowTitle;
    /**
     * Capture screenshot of specific QB64PE window
     */
    captureQB64PEWindow(options?: ScreenshotOptions): Promise<ScreenshotResult>;
    /**
     * Capture screenshot on Windows
     */
    private captureWindowsScreenshot;
    /**
     * Capture screenshot on macOS
     */
    private captureMacOSScreenshot;
    /**
     * Capture screenshot on Linux
     */
    private captureLinuxScreenshot;
    /**
     * Start monitoring QB64PE processes and automatically capture screenshots
     */
    startMonitoring(intervalMs?: number, captureIntervalMs?: number): Promise<void>;
    /**
     * Stop monitoring
     */
    stopMonitoring(): void;
    /**
     * Get monitoring status
     */
    getMonitoringStatus(): {
        isMonitoring: boolean;
        screenshotDir: string;
    };
    /**
     * Get all screenshot files in the directory
     */
    getScreenshotFiles(): string[];
    /**
     * Clean up old screenshots
     */
    cleanupOldScreenshots(maxAge?: number): void;
}
//# sourceMappingURL=screenshot-service.d.ts.map