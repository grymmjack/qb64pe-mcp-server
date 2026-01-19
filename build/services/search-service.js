"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibilitySearchService = void 0;
const keywords_service_1 = require("./keywords-service");
/**
 * Enhanced search indexing service for QB64PE compatibility content and keywords
 */
class CompatibilitySearchService {
    index;
    initialized = false;
    keywordsService;
    constructor() {
        this.index = {
            terms: new Map(),
            documents: []
        };
        this.keywordsService = new keywords_service_1.KeywordsService();
    }
    /**
     * Initialize the search index with compatibility content and keywords
     */
    async initialize() {
        if (this.initialized)
            return;
        // Add compatibility documents to the index
        await this.indexCompatibilityContent();
        // Add keywords to the index
        await this.indexKeywords();
        this.initialized = true;
    }
    /**
     * Index the compatibility content
     */
    async indexCompatibilityContent() {
        const compatibilityDocs = [
            {
                title: "Function Return Type Declaration",
                content: "QB64PE doesn't support AS TYPE syntax for function return types. Use type sigils instead: % INTEGER & LONG ! SINGLE # DOUBLE $ STRING",
                category: "function_return_types",
                tags: ["function", "return", "type", "sigil", "AS", "declaration"],
                metadata: {
                    severity: "error",
                    examples: ["FUNCTION name%(params)", "FUNCTION name&(params)"]
                }
            },
            {
                title: "Console Mode Directives",
                content: "$CONSOLE:OFF is not valid syntax. Use $CONSOLE for both console and graphics windows, or $CONSOLE:ONLY for console mode only",
                category: "console_directives",
                tags: ["console", "directive", "$CONSOLE", "graphics", "window"],
                metadata: {
                    severity: "error",
                    validDirectives: ["$CONSOLE", "$CONSOLE:ONLY"]
                }
            },
            {
                title: "Multiple IF Statements on One Line",
                content: "Chained IF-THEN statements with colons cause parsing errors. Split IF statements onto separate lines to avoid THEN without IF errors",
                category: "multi_statement_lines",
                tags: ["IF", "THEN", "colon", "multi-statement", "parsing", "error"],
                metadata: {
                    severity: "warning",
                    errorMessage: "THEN without IF"
                }
            },
            {
                title: "Multiple Array Declarations",
                content: "Multiple arrays with dimensions cannot be declared on one line. DIM array declarations should be separate when using dimensions",
                category: "array_declarations",
                tags: ["DIM", "array", "declaration", "dimensions", "multiple"],
                metadata: {
                    severity: "error",
                    errorMessage: "DIM: Expected ,"
                }
            },
            {
                title: "Variable Declaration and Assignment",
                content: "Combining declarations and assignments with colons can cause parsing issues. Separate variable declarations from assignments onto different lines",
                category: "variable_operations",
                tags: ["DIM", "variable", "declaration", "assignment", "colon", "parsing"],
                metadata: {
                    severity: "warning"
                }
            },
            {
                title: "Missing String Functions",
                content: "_WORD$ and _TRIM$ functions don't exist in QB64PE. Use built-in string functions like INSTR, MID$, LEFT$, RIGHT$ for string parsing instead",
                category: "missing_functions",
                tags: ["_WORD$", "_TRIM$", "string", "function", "INSTR", "MID$", "LEFT$", "RIGHT$"],
                metadata: {
                    severity: "error",
                    alternatives: ["INSTR", "MID$", "LEFT$", "RIGHT$", "LTRIM$", "RTRIM$"]
                }
            },
            {
                title: "Legacy BASIC Keywords",
                content: "Legacy BASIC keywords not supported: DEF FN, TRON, TROFF, SETMEM, SIGNAL, ERDEV, ERDEV$, FILEATTR, FRE, IOCTL, IOCTL$. Use modern QB64PE alternatives",
                category: "legacy_keywords",
                tags: ["DEF FN", "TRON", "TROFF", "SETMEM", "SIGNAL", "ERDEV", "legacy", "keywords"],
                metadata: {
                    severity: "error",
                    keywords: ["DEF FN", "TRON", "TROFF", "SETMEM", "SIGNAL", "ERDEV", "ERDEV$", "FILEATTR", "FRE", "IOCTL", "IOCTL$"]
                }
            },
            {
                title: "Device Access Keywords",
                content: "Device access keywords not supported: ON PEN, PEN, ON PLAY(n), PLAY(n) ON/OFF/STOP, ON UEVENT, UEVENT. Use modern QB64PE input/output methods like _MOUSEINPUT, _MOUSEBUTTON",
                category: "device_access",
                tags: ["PEN", "PLAY", "UEVENT", "device", "access", "_MOUSEINPUT", "_MOUSEBUTTON"],
                metadata: {
                    severity: "error",
                    alternatives: ["_MOUSEINPUT", "_MOUSEBUTTON", "_KEYHIT", "_KEYDOWN"]
                }
            },
            {
                title: "Platform-Specific Functions",
                content: "Some functions are Windows-only: _ACCEPTFILEDROP, _TOTALDROPPEDFILES, _DROPPEDFILE, _FINISHDROP, _SCREENPRINT, _SCREENCLICK, _WINDOWHANDLE, _CAPSLOCK, _NUMLOCK, _SCROLLLOCK",
                category: "platform_specific",
                tags: ["Windows", "Linux", "macOS", "platform", "specific", "_ACCEPTFILEDROP", "_SCREENPRINT"],
                metadata: {
                    severity: "warning",
                    platforms: ["windows"],
                    unsupportedOn: ["linux", "macos"]
                }
            },
            {
                title: "Console Platform Functions",
                content: "Console functions may not be available on Linux/macOS: _CONSOLETITLE, _CONSOLECURSOR, _CONSOLEFONT, _CONSOLEINPUT, _CINP. Use standard INPUT/PRINT or check platform compatibility",
                category: "console_platform",
                tags: ["console", "Linux", "macOS", "_CONSOLETITLE", "_CONSOLECURSOR", "_CONSOLEFONT"],
                metadata: {
                    severity: "warning",
                    alternatives: ["INPUT", "PRINT", "_TITLE"]
                }
            },
            {
                title: "Debugging Best Practices",
                content: "Use console output for debugging: $CONSOLE, _DEST _CONSOLE, PRINT debug messages. Modern QB64PE includes assertions and logging: _ASSERT, _LOGERROR, _LOGWARN, _LOGINFO, _LOGTRACE",
                category: "debugging",
                tags: ["debugging", "$CONSOLE", "_DEST", "_ASSERT", "_LOGERROR", "_LOGWARN", "console"],
                metadata: {
                    tools: ["$CONSOLE", "_DEST _CONSOLE", "_ASSERT", "_LOGERROR", "_LOGWARN", "_LOGINFO", "_LOGTRACE"]
                }
            },
            {
                title: "Cross-Platform Development",
                content: "Check platform with _OS$ before using platform-specific features. Provide alternatives for Linux/macOS when using Windows-only functions",
                category: "cross_platform",
                tags: ["cross-platform", "_OS$", "Windows", "Linux", "macOS", "compatibility"],
                metadata: {
                    platformCheck: "_OS$",
                    platforms: ["WINDOWS", "LINUX", "MACOSX"]
                }
            }
        ];
        // Add documents to index
        compatibilityDocs.forEach((doc, index) => {
            this.addDocument({
                id: index,
                title: doc.title,
                content: doc.content,
                category: doc.category,
                tags: doc.tags,
                metadata: doc.metadata
            });
        });
    }
    /**
     * Index all QB64PE keywords
     */
    async indexKeywords() {
        const keywords = this.keywordsService.getAllKeywords();
        const baseId = 1000; // Start keyword IDs at 1000 to avoid conflicts with compatibility docs
        Object.entries(keywords).forEach(([name, keyword], index) => {
            const keywordDoc = {
                id: baseId + index,
                title: `${name} (${keyword.type})`,
                content: `${keyword.description} Syntax: ${keyword.syntax} Example: ${keyword.example}`,
                category: `keyword_${keyword.category}`,
                tags: [
                    'keyword',
                    keyword.type,
                    keyword.category,
                    keyword.version.toLowerCase(),
                    keyword.availability.toLowerCase().replace(/\s+/g, '_'),
                    ...keyword.related,
                    ...keyword.tags || []
                ],
                metadata: {
                    keywordInfo: keyword,
                    isKeyword: true,
                    keywordName: name,
                    keywordType: keyword.type,
                    keywordCategory: keyword.category,
                    version: keyword.version,
                    availability: keyword.availability,
                    related: keyword.related,
                    deprecated: keyword.deprecated || false
                }
            };
            this.addDocument(keywordDoc);
        });
    }
    /**
     * Add a document to the search index
     */
    addDocument(document) {
        this.index.documents.push(document);
        // Index terms from title, content, tags
        const allText = `${document.title} ${document.content} ${document.tags.join(' ')}`;
        const terms = this.extractTerms(allText);
        terms.forEach(term => {
            if (!this.index.terms.has(term)) {
                this.index.terms.set(term, {
                    term,
                    documentIds: [],
                    frequency: 0
                });
            }
            const termData = this.index.terms.get(term);
            if (!termData.documentIds.includes(document.id)) {
                termData.documentIds.push(document.id);
            }
            termData.frequency++;
        });
    }
    /**
     * Extract searchable terms from text
     */
    extractTerms(text) {
        // Convert to lowercase and split on non-alphanumeric characters
        const words = text.toLowerCase()
            .replace(/[^\w\s$%&#!]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1);
        // Also include some original case terms for exact matches
        const originalWords = text
            .replace(/[^\w\s$%&#!]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1);
        return [...new Set([...words, ...originalWords])];
    }
    /**
     * Search the index for documents
     */
    async search(query, maxResults = 10) {
        await this.initialize();
        const queryTerms = this.extractTerms(query);
        const documentScores = new Map();
        const documentMatches = new Map();
        // Score documents based on term matches
        queryTerms.forEach(term => {
            const termData = this.index.terms.get(term);
            if (termData) {
                termData.documentIds.forEach(docId => {
                    const currentScore = documentScores.get(docId) || 0;
                    documentScores.set(docId, currentScore + 1);
                    if (!documentMatches.has(docId)) {
                        documentMatches.set(docId, new Set());
                    }
                    documentMatches.get(docId).add(term);
                });
            }
        });
        // Convert to results and sort by score
        const results = [];
        documentScores.forEach((score, docId) => {
            const document = this.index.documents[docId];
            if (document) {
                results.push({
                    document,
                    score,
                    matches: Array.from(documentMatches.get(docId) || [])
                });
            }
        });
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);
    }
    /**
     * Search by category
     */
    async searchByCategory(category) {
        await this.initialize();
        return this.index.documents.filter(doc => doc.category === category);
    }
    /**
     * Search by tags
     */
    async searchByTags(tags) {
        await this.initialize();
        return this.index.documents.filter(doc => tags.some(tag => doc.tags.some(docTag => docTag.toLowerCase().includes(tag.toLowerCase()))));
    }
    /**
     * Get all categories
     */
    async getCategories() {
        await this.initialize();
        const categories = new Set();
        this.index.documents.forEach(doc => categories.add(doc.category));
        return Array.from(categories);
    }
    /**
     * Get all tags
     */
    async getTags() {
        await this.initialize();
        const tags = new Set();
        this.index.documents.forEach(doc => {
            doc.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }
    /**
     * Search specifically for keywords
     */
    async searchKeywords(query, maxResults = 10) {
        await this.initialize();
        // First try keyword service direct search
        const keywordResults = this.keywordsService.searchKeywords(query, maxResults);
        // Also search indexed keyword documents
        const searchResults = await this.search(query, maxResults * 2);
        const keywordDocs = searchResults.filter(result => result.document.metadata?.isKeyword === true);
        // Combine and deduplicate results
        const combined = new Map();
        // Add keyword service results with higher priority
        keywordResults.forEach(kResult => {
            const key = kResult.keyword;
            if (!combined.has(key)) {
                // Find the corresponding document from search results
                const doc = keywordDocs.find(d => d.document.metadata?.keywordName === kResult.keyword);
                if (doc) {
                    combined.set(key, {
                        ...doc,
                        score: kResult.relevance
                    });
                }
            }
        });
        // Add any additional keyword docs not found by keyword service
        keywordDocs.forEach(doc => {
            const key = doc.document.metadata?.keywordName;
            if (key && !combined.has(key)) {
                combined.set(key, doc);
            }
        });
        return Array.from(combined.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);
    }
    /**
     * Search keywords by category
     */
    async searchKeywordsByCategory(category) {
        await this.initialize();
        const keywords = this.keywordsService.getKeywordsByCategory(category);
        const results = [];
        keywords.forEach(keyword => {
            const doc = this.index.documents.find(d => d.metadata?.keywordName === keyword.name);
            if (doc) {
                results.push({
                    document: doc,
                    score: 100,
                    matches: [keyword.name]
                });
            }
        });
        return results;
    }
    /**
     * Search keywords by type
     */
    async searchKeywordsByType(type) {
        await this.initialize();
        const keywords = this.keywordsService.getKeywordsByType(type);
        const results = [];
        keywords.forEach(keyword => {
            const doc = this.index.documents.find(d => d.metadata?.keywordName === keyword.name);
            if (doc) {
                results.push({
                    document: doc,
                    score: 100,
                    matches: [keyword.name]
                });
            }
        });
        return results;
    }
    /**
     * Get keyword autocomplete suggestions
     */
    async getKeywordAutocomplete(prefix, maxResults = 10) {
        return this.keywordsService.getAutocomplete(prefix, maxResults);
    }
    /**
     * Get all keyword categories
     */
    async getKeywordCategories() {
        return this.keywordsService.getCategories();
    }
}
exports.CompatibilitySearchService = CompatibilitySearchService;
//# sourceMappingURL=search-service.js.map