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
export interface KeyboardBufferSafetyIssue {
    line: number;
    column: number;
    pattern: string;
    message: string;
    suggestion: string;
    riskLevel: "high" | "medium" | "low";
}
export interface KeyboardBufferSafetyResult {
    hasIssues: boolean;
    issues: KeyboardBufferSafetyIssue[];
    suggestions: string[];
    bestPractices: string[];
    summary: {
        totalIssues: number;
        highRisk: number;
        mediumRisk: number;
        lowRisk: number;
        keydownUsages: number;
        inkeyUsages: number;
        bufferDrains: number;
        ctrlModifierChecks: number;
        altModifierChecks: number;
        shiftModifierChecks: number;
    };
}
export interface FunctionSelfReferenceIssue {
    line: number;
    column: number;
    functionName: string;
    context: "if_condition" | "expression" | "argument" | "comparison" | "assignment_rhs" | "other";
    lineContent: string;
    message: string;
    suggestion: string;
    severity: "error" | "warning";
}
export interface FunctionSelfReferenceResult {
    hasIssues: boolean;
    issues: FunctionSelfReferenceIssue[];
    functionsScanned: number;
    summary: {
        totalIssues: number;
        errors: number;
        warnings: number;
        affectedFunctions: string[];
    };
    explanation: string;
    prevention: string[];
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
     * Keyboard buffer safety issue detected during validation
     */
    private createKeyboardBufferIssue;
    /**
     * Validate keyboard buffer safety in QB64PE code
     * Detects potential keyboard buffer leakage issues that can cause:
     * - CTRL+key combinations producing ASCII control characters
     * - _KEYDOWN() checks without buffer consumption
     * - INKEY$ capturing unintended control characters
     * - Multiple handlers processing the same keystroke
     */
    validateKeyboardBufferSafety(code: string): Promise<KeyboardBufferSafetyResult>;
    /**
     * Get platform compatibility information
     */
    getPlatformCompatibility(platform?: string): Promise<any>;
    /**
     * Validate QB64-PE code for dangerous function self-references.
     *
     * In QB64-PE, reading a FUNCTION's own name inside the function body is a
     * recursive call, NOT a variable read. Only assignment (FuncName = value)
     * sets the return value. Any other read context (IF, expression, argument)
     * triggers infinite recursion leading to SIGSEGV / stack overflow.
     */
    validateFunctionSelfReferences(code: string): Promise<FunctionSelfReferenceResult>;
}
//# sourceMappingURL=compatibility-service.d.ts.map