/**
 * Service for QB64PE screenshot support via _SAVEIMAGE.
 *
 * Screenshots are captured entirely from within QB64PE code:
 *   _SAVEIMAGE "/absolute/path/screenshot.png"
 * This service reads the resulting file and returns it as base64
 * so the LLM can inspect the visual output.
 */
export declare class ScreenshotService {
    private screenshotDir;
    constructor(screenshotDir?: string);
    private ensureScreenshotDirectory;
    /**
     * Get all screenshot files in the directory, newest first.
     */
    getScreenshotFiles(): string[];
    /**
     * Read an image file saved by QB64PE's _SAVEIMAGE statement and return its
     * contents as base64 so the calling LLM can inspect the visual output.
     *
     * Workflow:
     *  1. Add  _SAVEIMAGE "/abs/path/screenshot.png"  near the END of QB64PE program
     *     (just before END or an _EXIT call).
     *  2. Compile and run the program so it writes the file.
     *  3. Call this method with the same path to read and return the image.
     */
    analyzeScreenshot(filePath: string, options?: {
        analysisType?: string;
        expectedElements?: string[];
        programCode?: string;
    }): Promise<{
        success: boolean;
        filePath: string;
        base64Data?: string;
        mimeType?: string;
        fileSizeBytes?: number;
        error?: string;
        hint: string;
    }>;
    /**
     * Generate a QB64PE code snippet that adds _SAVEIMAGE calls for screenshot
     * capture, ready to paste into an existing program.
     */
    generateAnalysisTemplate(programType?: string, expectedElements?: string[]): string;
    /**
     * Clean up screenshots older than maxAge milliseconds (default: 24 h).
     */
    cleanupOldScreenshots(maxAge?: number): void;
}
//# sourceMappingURL=screenshot-service.d.ts.map