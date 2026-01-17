import { KeywordInfo } from './keywords-service';
import { QB64PE_SYNTAX_PATTERNS, QB64PE_REPOSITORY_PATTERNS } from '../constants/syntax-patterns';
export interface SyntaxValidationResult {
    isValid: boolean;
    errors: SyntaxError[];
    warnings: SyntaxWarning[];
    suggestions: string[];
    score: number;
    compatibilityIssues: CompatibilityIssue[];
    keywordIssues: KeywordIssue[];
}
export interface KeywordIssue {
    line: number;
    column: number;
    keyword: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    suggestions: string[];
    keywordInfo?: KeywordInfo;
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
export interface CompatibilityIssue {
    line: number;
    column: number;
    pattern: string;
    message: string;
    severity: 'error' | 'warning';
    category: string;
    suggestion: string;
    examples?: {
        incorrect: string;
        correct: string;
    };
}
/**
 * Service for QB64PE syntax validation and analysis
 */
export declare class QB64PESyntaxService {
    private keywordsService;
    constructor();
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
     * Check for compatibility issues using known patterns
     */
    private checkCompatibilityIssues;
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
    /**
     * Check for reserved keyword conflicts in variable declarations
     * Now uses comprehensive QB64PE_RESERVED_WORDS list from MCP keyword database
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
     * Validate keywords in code lines
     */
    private validateKeywords;
    /**
     * Extract tokens from a line of code
     */
    private extractTokens;
    /**
     * Check if a token is a string literal
     */
    private isStringLiteral;
    /**
     * Check if a token is a numeric literal
     */
    private isNumericLiteral;
    /**
     * Check if a token is an operator
     */
    private isOperator;
    /**
     * Check if a token is likely a keyword (heuristic)
     */
    private isLikelyKeyword;
    /**
     * Calculate syntax quality score
     */
    private calculateSyntaxScore;
    /**
     * Get syntax help for QB64PE constructs using TextMate grammar information
     */
    getSyntaxHelp(identifier: string): string | null;
    /**
     * Validate code syntax using TextMate grammar patterns (basic validation)
     */
    validateSyntaxBasic(code: string): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Get syntax highlighting information for code
     */
    getSyntaxHighlighting(code: string): Array<{
        text: string;
        scope: string;
    }>;
    /**
     * Get available syntax patterns from TextMate grammar
     */
    getSyntaxPatterns(): typeof QB64PE_SYNTAX_PATTERNS;
    /**
     * Get repository patterns from TextMate grammar
     */
    getRepositoryPatterns(): typeof QB64PE_REPOSITORY_PATTERNS;
}
//# sourceMappingURL=syntax-service.d.ts.map