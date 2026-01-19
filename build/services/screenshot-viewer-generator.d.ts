/**
 * QB64PE Screenshot Viewer Generator
 * Creates dynamic HTML viewers for QB64PE graphics program analysis
 */
interface ViewerOptions {
    title?: string;
    testName?: string;
    expectedFiles?: string[];
    analysisChecklist?: string[];
    programDetails?: Record<string, string | number>;
    outputFile?: string;
}
interface TestConfig {
    programName: string;
    expectedOutput: string;
    screenSize: string;
    colors?: string[];
    shapes?: string[];
    textElements?: string[];
    screenshotFiles?: string[];
}
export declare class ScreenshotViewerGenerator {
    private screenshotDir;
    constructor(screenshotDir?: string);
    /**
     * Generate a custom screenshot viewer for specific test cases
     */
    generateViewer(options?: ViewerOptions): string;
    /**
     * Auto-discover screenshots and generate viewer
     */
    generateAutoViewer(): string;
    /**
     * Generate viewer for specific QB64PE program test
     */
    generateTestViewer(testConfig: TestConfig): string;
    getGenericChecklist(): string[];
    private generateProgramDetailsHTML;
    private generateChecklistHTML;
    getViewerTemplate(): string;
}
export declare const testConfigurations: {
    redCircle: {
        programName: string;
        expectedOutput: string;
        screenSize: string;
        colors: string[];
        shapes: string[];
        textElements: string[];
        screenshotFiles: string[];
    };
    gorillasGame: {
        programName: string;
        expectedOutput: string;
        screenSize: string;
        colors: string[];
        shapes: string[];
        textElements: string[];
        screenshotFiles: string[];
    };
    graphicsDemo: {
        programName: string;
        expectedOutput: string;
        screenSize: string;
        colors: string[];
        shapes: string[];
        textElements: string[];
        screenshotFiles: string[];
    };
};
export {};
//# sourceMappingURL=screenshot-viewer-generator.d.ts.map