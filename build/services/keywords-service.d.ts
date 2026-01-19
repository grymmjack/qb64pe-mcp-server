export interface KeywordInfo {
    name: string;
    type: 'statement' | 'function' | 'operator' | 'metacommand' | 'opengl' | 'type' | 'constant' | 'legacy';
    category: string;
    description: string;
    syntax: string;
    parameters: string[];
    returns: string | null;
    example: string;
    related: string[];
    version: 'QBasic' | 'QB64' | 'QB64PE';
    availability: 'All platforms' | 'Windows' | 'Linux' | 'macOS';
    aliases?: string[];
    deprecated?: boolean;
    tags?: string[];
}
export interface KeywordCategory {
    description: string;
    keywords: string[];
}
export interface KeywordsData {
    categories: Record<string, KeywordCategory>;
    keywords: Record<string, KeywordInfo>;
}
export interface KeywordSearchResult {
    keyword: string;
    info: KeywordInfo;
    relevance: number;
    matchType: 'exact' | 'prefix' | 'contains' | 'related';
}
export declare class KeywordsService {
    private keywordsData;
    private originalKeywords;
    private wikiCategoriesData;
    constructor();
    private loadWikiCategoriesData;
    private loadKeywordsData;
    private categorizeKeyword;
    private extractVersion;
    private extractAvailability;
    private generateSyntax;
    private generateExample;
    private findRelatedKeywords;
    private generateEnhancedKeywordsData;
    private saveEnhancedKeywordsData;
    getKeyword(name: string): KeywordInfo | null;
    getAllKeywords(): Record<string, KeywordInfo>;
    getKeywordsByCategory(category: string): KeywordInfo[];
    getCategories(): Record<string, KeywordCategory>;
    searchKeywords(query: string, maxResults?: number): KeywordSearchResult[];
    getAutocomplete(prefix: string, maxResults?: number): string[];
    validateKeyword(name: string): {
        isValid: boolean;
        keyword?: KeywordInfo;
        suggestions?: string[];
    };
    getKeywordsByType(type: KeywordInfo['type']): KeywordInfo[];
    getKeywordsByVersion(version: KeywordInfo['version']): KeywordInfo[];
    getDeprecatedKeywords(): KeywordInfo[];
    regenerateKeywordsData(): void;
    getKeywordCount(): number;
    getOriginalKeywordCount(): number;
    getCategoryStats(): Record<string, number>;
    getKeywordsByTag(tag: string): KeywordInfo[];
    getQB64PESpecificKeywords(): KeywordInfo[];
    getLegacyKeywords(): KeywordInfo[];
    getWikiCategories(): Record<string, string[]>;
    getWikiCategoryCounts(): Record<string, number>;
    getKeywordsByWikiCategory(category: string): string[];
    getWikiCategoryNames(): string[];
    searchWikiCategories(query: string): string[];
    /**
     * Search keywords by wiki category with optional filtering
     */
    searchByWikiCategory(category: string, searchTerm?: string): KeywordInfo[];
}
//# sourceMappingURL=keywords-service.d.ts.map