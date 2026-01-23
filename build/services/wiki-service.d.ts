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
export interface PlatformAvailability {
    keyword: string;
    windows: boolean;
    linux: boolean;
    macos: boolean;
    source: string;
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
     * Parse platform availability from QB64PE wiki pages
     * Extracts Windows/Linux/macOS support information from wiki tables
     */
    parsePlatformAvailability(keywordName: string): Promise<PlatformAvailability | null>;
    /**
     * Batch parse platform availability for multiple keywords
     */
    batchParsePlatformAvailability(keywords: string[]): Promise<Map<string, PlatformAvailability>>;
    /**
     * Extract platform availability information from page HTML
     */
    private extractPlatformInfo;
    /**
     * Determine if a table cell indicates availability
     * Checks for checkmarks (✓, ✔, yes, y) vs crosses (✗, ✘, no, n, -)
     */
    private isAvailable;
    /**
     * Cache management
     */
    private getCachedResult;
    private setCachedResult;
}
//# sourceMappingURL=wiki-service.d.ts.map