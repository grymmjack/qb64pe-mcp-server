export declare const QB64PE_RESERVED_WORDS: ReadonlySet<string>;
export declare const QB64PE_ALL_KEYWORDS: ReadonlySet<string>;
export declare const QB64PE_KEYWORDS_BY_CATEGORY: {
    statements: Set<string>;
    functions: Set<string>;
    metacommands: Set<string>;
    operators: Set<string>;
    types: Set<string>;
    constants: Set<string>;
};
/**
 * Check if a word is a reserved keyword
 */
export declare function isReservedWord(word: string): boolean;
/**
 * Check if a word is any QB64PE keyword
 */
export declare function isQB64Keyword(word: string): boolean;
/**
 * Get suggested alternative names for a reserved word
 */
export declare function getReservedWordAlternatives(word: string): string[];
//# sourceMappingURL=reserved-words.d.ts.map