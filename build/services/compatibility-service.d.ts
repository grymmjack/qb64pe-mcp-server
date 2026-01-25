export interface CompatibilityIssue {
    line: number;
    column: number;
    pattern: string;
    message: string;
    severity: "error" | "warning" | "info";
    category: string;
    suggestion: string;
    examples?: {
        incorrect: string;
        correct: string;
    };
}
export interface CompatibilityRule {
    pattern: RegExp;
    severity: "error" | "warning" | "info";
    category: string;
    message: string;
    suggestion: string;
    examples?: {
        incorrect: string;
        correct: string;
    };
}
export interface CompatibilitySearchResult {
    category: string;
    title: string;
    description: string;
    issues: Array<{
        pattern: string;
        message: string;
        suggestion: string;
        examples?: Array<{
            incorrect: string;
            correct: string;
        }>;
    }>;
}
/**
 * Service for QB64PE compatibility knowledge and validation
 */
export declare class QB64PECompatibilityService {
    private compatibilityRules;
    private knowledgeBase;
    private searchService;
    constructor();
    /**
     * Initialize compatibility validation rules
     */
    private initializeRules;
    /**
     * Load patterns from JSON file
     */
    private loadPatternsFromJson;
    /**
     * Load knowledge base from embedded data
     */
    private loadKnowledgeBase;
    /**
     * Validate code for compatibility issues
     */
    validateCompatibility(code: string): Promise<CompatibilityIssue[]>;
    /**
     * Search compatibility knowledge base
     */
    searchCompatibility(query: string): Promise<CompatibilitySearchResult[]>;
    /**
     * Get best practices guidance
     */
    getBestPractices(): Promise<string[]>;
    /**
     * Get debugging guidance
     */
    getDebuggingGuidance(issue?: string): Promise<string>;
    /**
     * Get specific debugging guidance for an issue
     */
    private getSpecificDebuggingGuidance;
    /**
     * Get platform compatibility information
     */
    getPlatformCompatibility(platform?: string): Promise<any>;
}
//# sourceMappingURL=compatibility-service.d.ts.map