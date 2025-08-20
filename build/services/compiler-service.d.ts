export interface CompilerOption {
    flag: string;
    description: string;
    platform: string[];
    example: string;
    category: 'compilation' | 'debugging' | 'optimization';
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
     * Get platform-specific compilation notes
     */
    private getPlatformSpecificNotes;
}
//# sourceMappingURL=compiler-service.d.ts.map