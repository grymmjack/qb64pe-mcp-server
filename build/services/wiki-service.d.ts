export interface WikiSearchResult {
    title: string;
    url: string;
    snippet: string;
    category: string;
}
export interface WikiPageContent {
    title: string;
    content: string;
    examples: string[];
    relatedPages: string[];
}
/**
 * Service for interacting with the QB64PE wiki
 */
export declare class QB64PEWikiService {
    private readonly baseUrl;
    private readonly cache;
    private readonly cacheTimeout;
    /**
     * Search the QB64PE wiki for content
     */
    searchWiki(query: string, category?: string): Promise<WikiSearchResult[]>;
    /**
     * Get detailed content from a specific wiki page
     */
    getPageContent(pageTitle: string, includeExamples?: boolean): Promise<string>;
    /**
     * Get the wiki index/overview
     */
    getWikiIndex(): Promise<string>;
    /**
     * Perform actual wiki search using the search API
     */
    private performWikiSearch;
    /**
     * Perform alternative search when primary search fails
     */
    private performAlternativeSearch;
    /**
     * Extract content from a wiki page
     */
    private extractPageContent;
    /**
     * Extract code examples from a page
     */
    private extractCodeExamples;
    /**
     * Extract wiki index content
     */
    private extractWikiIndex;
    /**
     * Utility methods
     */
    private cleanPageTitle;
    private resolveUrl;
    private categorizeResult;
    private filterByCategory;
    private getCommonPages;
    private getFallbackResults;
    private getFallbackPageContent;
    private getFallbackWikiIndex;
    /**
     * Cache management
     */
    private getCachedResult;
    private setCachedResult;
}
//# sourceMappingURL=wiki-service.d.ts.map