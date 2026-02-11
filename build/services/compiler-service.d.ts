export interface CompilerOption {
    flag: string;
    description: string;
    platform: string[];
    example: string;
    category: "compilation" | "debugging" | "optimization";
}
export interface DebuggingTechnique {
    technique: string;
    description: string;
    example: string;
    platform: string[];
    useCase: string;
}
/**
 * Service for QB64PE compiler information and debugging help
 */
export declare class QB64PECompilerService {
    private buildContextService;
    constructor();
    private readonly compilerOptions;
    private readonly debuggingTechniques;
    /**
     * Get compiler options based on platform and type
     */
    getCompilerOptions(platform?: string, optionType?: string): Promise<CompilerOption[]>;
    /**
     * Get debugging help based on the issue and platform
     */
    getDebuggingHelp(issue: string, platform?: string): Promise<string>;
    /**
     * Get complete compiler reference
     */
    getCompilerReference(): Promise<string>;
    /**
     * Find relevant debugging techniques based on the issue description
     */
    private findRelevantDebuggingTechniques;
    /**
     * Get general debugging advice when no specific techniques match
     */
    private getGeneralDebuggingAdvice;
    /**
     * Get additional debugging tips
     */
    private getAdditionalDebuggingTips;
    /**
     * Try to use VS Code BUILD: Compile task if available
     * Returns null if task not found or not in VS Code environment
     */
    private tryVSCodeTask;
    /**
     * Compile QB64PE code and return compilation result with errors and suggestions
     * This enables autonomous compile-verify-fix loops
     */
    compileAndVerify(sourceFilePath: string, qb64pePath?: string, compilerFlags?: string[], useStoredFlags?: boolean): Promise<{
        success: boolean;
        output: string;
        errors: Array<{
            line?: number;
            message: string;
            severity: "error" | "warning";
        }>;
        executablePath?: string;
        suggestions: string[];
        contextWarning?: string;
    }>;
    /**
     * Parse QB64PE compilation output to extract errors and provide suggestions
     */
    private parseCompilationOutput;
    /**
     * Add context-specific suggestions based on error messages
     */
    private addErrorSuggestions;
    /**
     * Find workspace root by searching for .vscode folder
     */
    private findWorkspaceRoot;
    /**
     * Get platform-specific compilation notes
     */
    private getPlatformSpecificNotes;
}
//# sourceMappingURL=compiler-service.d.ts.map