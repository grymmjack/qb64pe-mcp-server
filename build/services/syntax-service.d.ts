export interface SyntaxValidationResult {
    isValid: boolean;
    errors: SyntaxError[];
    warnings: SyntaxWarning[];
    suggestions: string[];
    score: number;
}
export interface SyntaxError {
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    rule: string;
    suggestion?: string;
}
export interface SyntaxWarning {
    line: number;
    column: number;
    message: string;
    rule: string;
    suggestion: string;
}
/**
 * Service for QB64PE syntax validation and analysis
 */
export declare class QB64PESyntaxService {
    private readonly qb64Keywords;
    private readonly nonQB64Constructs;
    /**
     * Validate QB64PE syntax
     */
    validateSyntax(code: string, checkLevel?: string): Promise<SyntaxValidationResult>;
    /**
     * Perform basic syntax validation
     */
    private performBasicValidation;
    /**
     * Perform strict validation (includes all basic checks plus more)
     */
    private performStrictValidation;
    /**
     * Perform best practices validation
     */
    private performBestPracticesValidation;
    /**
     * Check for non-QB64PE syntax (VB, QBasic, etc.)
     */
    private checkNonQB64Syntax;
    /**
     * Check basic syntax errors
     */
    private checkBasicSyntaxErrors;
    /**
     * Check loop structures
     */
    private checkLoopStructures;
    /**
     * Check SUB/FUNCTION structures
     */
    private checkSubFunctionStructures;
    /**
     * Check variable declarations
     */
    private checkVariableDeclarations;
    /**
     * Check for unclosed structures
     */
    private checkUnclosedStructures;
    /**
     * Check for undeclared variables (strict mode)
     */
    private checkUndeclaredVariables;
    /**
     * Check for deprecated constructs
     */
    private checkDeprecatedConstructs;
    /**
     * Check for type mismatches
     */
    private checkTypeMismatches;
    /**
     * Check best practices
     */
    private checkBestPractices;
    /**
     * Calculate syntax quality score
     */
    private calculateSyntaxScore;
}
//# sourceMappingURL=syntax-service.d.ts.map