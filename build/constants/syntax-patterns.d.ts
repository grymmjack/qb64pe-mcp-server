export interface SyntaxPattern {
    regex?: string;
    begin?: string;
    end?: string;
    name?: string;
    contentName?: string;
    captures?: Record<string, any>;
    beginCaptures?: Record<string, any>;
    endCaptures?: Record<string, any>;
}
export interface RepositoryPattern {
    [key: string]: SyntaxPattern;
}
/**
 * Syntax patterns from QB64PE TextMate grammar
 */
export declare const QB64PE_SYNTAX_PATTERNS: SyntaxPattern[];
/**
 * Repository patterns (reusable syntax elements)
 */
export declare const QB64PE_REPOSITORY_PATTERNS: RepositoryPattern;
/**
 * Get syntax help for QB64PE constructs using TextMate grammar information
 */
export declare function getSyntaxHelp(identifier: string): string | null;
/**
 * Validate code syntax using TextMate grammar patterns
 */
export declare function validateSyntax(code: string): {
    valid: boolean;
    errors: string[];
};
/**
 * Get syntax highlighting information for a given code snippet
 */
export declare function getSyntaxHighlighting(code: string): Array<{
    text: string;
    scope: string;
}>;
//# sourceMappingURL=syntax-patterns.d.ts.map