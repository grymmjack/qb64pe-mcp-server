/**
 * QB64PE Logging Service
 *
 * Provides native QB64PE logging capabilities and enhanced console output management
 * for automated debugging and LLM analysis workflows.
 *
 * Key Features:
 * - Native QB64PE logging function injection (_LOGINFO, _LOGERROR, etc.)
 * - $CONSOLE:ONLY directive management for shell redirection
 * - Structured output section generation
 * - Automated output capture and parsing
 */
export interface LoggingConfiguration {
    enableNativeLogging: boolean;
    enableStructuredOutput: boolean;
    enableEchoOutput: boolean;
    consoleDirective: '$CONSOLE' | '$CONSOLE:ONLY';
    logLevel: 'TRACE' | 'INFO' | 'WARN' | 'ERROR';
    autoExitTimeout: number;
    outputSections: string[];
}
export interface LogEntry {
    level: 'TRACE' | 'INFO' | 'WARN' | 'ERROR';
    message: string;
    timestamp?: string;
    section?: string;
}
export interface StructuredOutput {
    sections: Record<string, string[]>;
    logs: LogEntry[];
    summary: {
        success: boolean;
        totalSteps: number;
        failedSteps: number;
        executionTime?: number;
    };
}
export declare class QB64PELoggingService {
    private defaultConfig;
    /**
     * Inject native QB64PE logging functions into source code
     */
    injectNativeLogging(sourceCode: string, config?: Partial<LoggingConfiguration>): string;
    /**
     * Generate structured output sections for systematic debugging
     */
    generateStructuredOutput(sections: string[], includeLogging?: boolean, config?: Partial<LoggingConfiguration>): string;
    /**
     * Enhance existing QB64PE code with comprehensive logging
     */
    enhanceCodeWithLogging(sourceCode: string, config?: Partial<LoggingConfiguration>): string;
    /**
     * Parse structured output from QB64PE program execution
     */
    parseStructuredOutput(output: string): StructuredOutput;
    /**
     * Generate debugging template with advanced logging
     */
    generateAdvancedDebuggingTemplate(programName: string, analysisSteps: string[], config?: Partial<LoggingConfiguration>): string;
    /**
     * Generate native _ECHO usage guide
     */
    generateEchoFunctions(config?: Partial<LoggingConfiguration>): string;
    /**
     * Generate shell command for output capture
     */
    generateOutputCaptureCommand(programPath: string, outputPath?: string): string;
    /**
     * Generate file monitoring commands for cross-platform use
     */
    generateFileMonitoringCommands(logFile: string): Record<string, string>;
    private generateLoggingHeader;
    private generateEchoHeader;
    private insertAfterDirectives;
    private addStructuredSections;
    private addAutoExitMechanism;
    private addErrorHandling;
    private generateStructuredAnalysisSteps;
}
export default QB64PELoggingService;
//# sourceMappingURL=logging-service.d.ts.map