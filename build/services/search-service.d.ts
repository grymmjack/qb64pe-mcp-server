export interface SearchIndex {
    terms: Map<string, SearchTerm>;
    documents: SearchDocument[];
}
export interface SearchTerm {
    term: string;
    documentIds: number[];
    frequency: number;
}
export interface SearchDocument {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    metadata: any;
}
export interface SearchResult {
    document: SearchDocument;
    score: number;
    matches: string[];
}
/**
 * Enhanced search indexing service for QB64PE compatibility content and keywords
 */
export declare class CompatibilitySearchService {
    private index;
    private initialized;
    private keywordsService;
    constructor();
    /**
     * Initialize the search index with compatibility content and keywords
     */
    initialize(): Promise<void>;
    /**
     * Index the compatibility content
     */
    private indexCompatibilityContent;
    /**
     * Index all QB64PE keywords
     */
    private indexKeywords;
    /**
     * Add a document to the search index
     */
    private addDocument;
    /**
     * Extract searchable terms from text
     */
    private extractTerms;
    /**
     * Search the index for documents
     */
    search(query: string, maxResults?: number): Promise<SearchResult[]>;
    /**
     * Search by category
     */
    searchByCategory(category: string): Promise<SearchDocument[]>;
    /**
     * Search by tags
     */
    searchByTags(tags: string[]): Promise<SearchDocument[]>;
    /**
     * Get all categories
     */
    getCategories(): Promise<string[]>;
    /**
     * Get all tags
     */
    getTags(): Promise<string[]>;
    /**
     * Search specifically for keywords
     */
    searchKeywords(query: string, maxResults?: number): Promise<SearchResult[]>;
    /**
     * Search keywords by category
     */
    searchKeywordsByCategory(category: string): Promise<SearchResult[]>;
    /**
     * Search keywords by type
     */
    searchKeywordsByType(type: string): Promise<SearchResult[]>;
    /**
     * Get keyword autocomplete suggestions
     */
    getKeywordAutocomplete(prefix: string, maxResults?: number): Promise<string[]>;
    /**
     * Get all keyword categories
     */
    getKeywordCategories(): Promise<Record<string, any>>;
}
//# sourceMappingURL=search-service.d.ts.map