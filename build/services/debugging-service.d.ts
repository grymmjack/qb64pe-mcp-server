export interface DebuggingSession {
    id: string;
    projectPath: string;
    sourceCode: string;
    compiledExecutable?: string;
    debugMode: 'automated' | 'interactive' | 'hybrid';
    startTime: Date;
    lastActivity: Date;
    issues: DebuggingIssue[];
    solutions: DebuggingSolution[];
    status: 'active' | 'completed' | 'failed' | 'timeout';
    executionMode: 'console' | 'graphics' | 'mixed';
}
export interface DebuggingIssue {
    id: string;
    type: 'console_visibility' | 'file_handle' | 'graphics_context' | 'process_management' | 'flow_control' | 'compilation' | 'runtime';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    location?: {
        line?: number;
        function?: string;
        file?: string;
    };
    symptoms: string[];
    detectedAt: Date;
    resolved: boolean;
    autoFixable: boolean;
}
export interface DebuggingSolution {
    issueId: string;
    strategy: 'code_injection' | 'template_replacement' | 'configuration_change' | 'manual_intervention';
    priority: 1 | 2 | 3 | 4 | 5;
    description: string;
    implementation: {
        codeChanges?: string[];
        configChanges?: Record<string, any>;
        commands?: string[];
        manualSteps?: string[];
    };
    rationale: string;
    appliedAt?: Date;
    successful?: boolean;
}
export interface DebugModeConfig {
    enableConsole: boolean;
    enableLogging: boolean;
    enableScreenshots: boolean;
    enableFlowControl: boolean;
    enableResourceTracking: boolean;
    timeoutSeconds: number;
    autoExit: boolean;
    verboseOutput: boolean;
}
/**
 * Enhanced debugging service for QB64PE development
 * Addresses the core debugging issues identified in the user's analysis
 */
export declare class QB64PEDebuggingService {
    private readonly debugSessions;
    private readonly templateCache;
    private readonly defaultConfig;
    constructor();
    /**
     * Create a new debugging session with enhanced monitoring
     */
    createDebuggingSession(sourceCode: string, projectPath?: string, config?: Partial<DebugModeConfig>): DebuggingSession;
    /**
     * Apply debugging enhancements to QB64PE source code
     */
    enhanceCodeForDebugging(sourceCode: string, config?: Partial<DebugModeConfig>): {
        enhancedCode: string;
        modifications: string[];
        debugFeatures: string[];
        issues: DebuggingIssue[];
        solutions: DebuggingSolution[];
    };
    /**
     * Issue #1: Console Output and Program Execution Issues
     * Inject console management and visibility controls
     */
    private injectConsoleManagement;
    /**
     * Issue #4: File Handle and Resource Management Issues
     * Inject proper resource management and cleanup
     */
    private injectResourceManagement;
    /**
     * Issue #6: QB64PE Graphics Context Issues
     * Inject graphics context management
     */
    private injectGraphicsContextManagement;
    /**
     * Inject enhanced flow control for automated testing
     */
    private injectFlowControl;
    /**
     * Inject comprehensive logging system
     */
    private injectLoggingSystem;
    /**
     * Inject automated screenshot system for graphics programs
     *
     * IMPROVEMENT: Includes visual debugging markers alongside screenshots.
     * Session Problem: Console output confirms execution but doesn't prove pixels
     * are drawn. Visual markers (colored lines/boxes) confirm both execution AND rendering.
     */
    private injectScreenshotSystem;
    /**
     * Detect execution mode from source code
     */
    private detectExecutionMode;
    /**
     * Analyze code for potential debugging issues
     */
    private analyzeCodeForIssues;
    /**
     * Generate solutions for detected issues
     */
    private generateSolutions;
    /**
     * Get debugging best practices guide
     */
    getDebuggingBestPractices(): string;
    /**
     * Get comprehensive debugging guide for LLMs
     */
    getLLMDebuggingGuide(): string;
    /**
     * Get debug session status
     */
    getSessionStatus(sessionId: string): DebuggingSession | undefined;
    /**
     * List all active debug sessions
     */
    getActiveSessions(): DebuggingSession[];
    /**
     * Close debug session
     */
    closeSession(sessionId: string): boolean;
}
//# sourceMappingURL=debugging-service.d.ts.map