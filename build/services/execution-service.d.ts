export interface ExecutionState {
    processId?: number;
    status: 'not_started' | 'running' | 'completed' | 'terminated' | 'graphics_mode' | 'console_mode';
    hasGraphics: boolean;
    hasConsole: boolean;
    startTime?: Date;
    lastActivity?: Date;
    outputFile?: string;
    screenshotDir?: string;
    logFile?: string;
}
export interface ProcessInfo {
    pid: number;
    command: string;
    cpu: number;
    memory: number;
    status: string;
}
export interface ExecutionGuidance {
    recommendation: string;
    waitingBehavior: 'wait_indefinitely' | 'wait_timeout' | 'wait_user_input' | 'terminate';
    monitoringStrategy: string[];
    crossPlatformCommands: {
        windows: string[];
        linux: string[];
        macos: string[];
    };
    outputParsing: {
        consolePatterns: string[];
        graphicsIndicators: string[];
        completionSignals: string[];
    };
}
/**
 * Service for monitoring and managing QB64PE program execution
 */
export declare class QB64PEExecutionService {
    private readonly screenshotDir;
    private readonly logDir;
    private readonly platform;
    constructor();
    /**
     * Ensure required directories exist and are in .gitignore
     */
    private ensureDirectories;
    /**
     * Update .gitignore to exclude QB64PE output directories
     */
    private updateGitignore;
    /**
     * Analyze QB64PE source code to determine execution characteristics
     */
    analyzeExecutionMode(sourceCode: string): ExecutionState;
    /**
     * Detect if source code uses graphics functions
     * Dynamically uses the validated QB64PE keyword database
     */
    private detectGraphicsUsage;
    /**
     * Get execution guidance based on program characteristics
     */
    getExecutionGuidance(executionState: ExecutionState): ExecutionGuidance;
    /**
     * Generate cross-platform process monitoring commands
     */
    getProcessMonitoringCommands(processName?: string): string[];
    /**
     * Generate cross-platform process termination commands
     */
    getProcessTerminationCommands(pid: number): string[];
    /**
     * Generate QB64PE code template for logging and screenshots
     */
    generateMonitoringTemplate(originalCode: string): string;
    /**
     * Generate improved console output template with formatting
     */
    generateConsoleFormattingTemplate(): string;
    /**
     * Get real-time execution monitoring guidance
     */
    getRealTimeMonitoringGuidance(): string;
    /**
     * Parse console output for completion signals
     */
    parseConsoleOutput(output: string): {
        isWaitingForInput: boolean;
        isCompleted: boolean;
        lastActivity: string;
        suggestedAction: string;
    };
    /**
     * Get file monitoring utilities for log tailing
     */
    getFileMonitoringCommands(logFile: string): string[];
}
//# sourceMappingURL=execution-service.d.ts.map