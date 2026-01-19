/**
 * QB64PE Porting Service
 * Converts QBasic programs to QB64PE with systematic transformations
 */
export interface PortingResult {
    originalCode: string;
    portedCode: string;
    transformations: string[];
    warnings: string[];
    errors: string[];
    compatibility: 'high' | 'medium' | 'low';
    summary: string;
}
export interface PortingOptions {
    sourceDialect: 'qbasic' | 'gwbasic' | 'quickbasic' | 'vb-dos' | 'applesoft' | 'commodore' | 'amiga' | 'atari' | 'vb6' | 'vbnet' | 'vbscript' | 'freebasic';
    addModernFeatures: boolean;
    preserveComments: boolean;
    convertGraphics: boolean;
    optimizePerformance: boolean;
}
export declare class QB64PEPortingService {
    private transformations;
    private warnings;
    private errors;
    /**
     * Port QBasic code to QB64PE
     */
    portQBasicToQB64PE(sourceCode: string, options?: Partial<PortingOptions>): Promise<PortingResult>;
    /**
     * Add QB64PE metacommands and modern features
     */
    private addQB64PEMetacommands;
    /**
     * Convert QBasic ALL CAPS keywords to QB64PE Pascal Case
     */
    private convertKeywordCasing;
    /**
     * Remove forward declarations that are not needed in QB64PE
     */
    private removeForwardDeclarations;
    /**
     * Convert DEF FN statements to proper functions
     * Handles both single-line and multi-line DEF FN...END DEF blocks
     */
    private convertDefFnToFunctions;
    /**
     * Fix DIM statements that mix type suffixes with AS declarations
     * Example: DIM result# AS DOUBLE -> DIM result AS DOUBLE
     */
    private fixDimStatements;
    /**
     * Convert GOSUB/RETURN to function calls
     */
    private convertGosubToFunctions;
    /**
     * Convert TYPE declarations to modern syntax
     */
    private convertTypeDeclarations;
    /**
     * Convert array syntax to QB64PE format
     */
    private convertArraySyntax;
    /**
     * Convert string functions to proper casing
     */
    private convertStringFunctions;
    /**
     * Convert mathematical constants and functions
     */
    private convertMathematicalConstants;
    /**
     * Convert exit statements to QB64PE format
     */
    private convertExitStatements;
    /**
     * Convert timing functions to QB64PE equivalents
     */
    private convertTimingFunctions;
    /**
     * Add graphics enhancements for QB64PE
     */
    private addGraphicsEnhancements;
    /**
     * Optimize for QB64PE compatibility
     */
    private optimizeCompatibility;
    /**
     * Check for multi-statement lines that might cause issues
     */
    private checkMultiStatementLines;
    /**
     * Check array declarations for potential issues
     */
    private checkArrayDeclarations;
    /**
     * Check function return types
     */
    private checkFunctionReturnTypes;
    /**
     * Detect if code contains graphics operations
     */
    private detectGraphics;
    /**
     * Assess overall compatibility level
     */
    private assessCompatibility;
    /**
     * Generate summary of porting process
     */
    private generateSummary;
    /**
     * Get supported source dialects
     */
    getSupportedDialects(): string[];
    /**
     * Get dialect-specific conversion rules
     */
    getDialectRules(dialect: string): string[];
    /**
     * Remove deprecated $NOPREFIX metacommand
     * $NOPREFIX was deprecated in QB64-PE v4.0.0
     * QB64-PE auto-converts code with $NOPREFIX
     * All QB64 keywords should use underscore prefix
     */
    private removeNoPrefixMetacommand;
}
//# sourceMappingURL=porting-service.d.ts.map