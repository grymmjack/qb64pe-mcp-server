"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QB64PEWikiService = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
/**
 * Service for interacting with the QB64PE wiki
 */
class QB64PEWikiService {
    baseUrl = "https://qb64phoenix.com/qb64wiki/index.php";
    cache = new Map();
    cacheTimeout = 10 * 60 * 1000; // 10 minutes
    /**
     * Search the QB64PE wiki for content
     */
    async searchWiki(query, category) {
        const cacheKey = `search:${query}:${category || "all"}`;
        const cached = this.getCachedResult(cacheKey);
        if (cached)
            return cached;
        try {
            // First try the wiki's search functionality
            const searchResults = await this.performWikiSearch(query, category);
            // If no results, try alternative search methods
            if (searchResults.length === 0) {
                const alternativeResults = await this.performAlternativeSearch(query, category);
                this.setCachedResult(cacheKey, alternativeResults);
                return alternativeResults;
            }
            this.setCachedResult(cacheKey, searchResults);
            return searchResults;
        }
        catch (error) {
            console.error("Wiki search error:", error);
            // Return fallback results
            return this.getFallbackResults(query, category);
        }
    }
    /**
     * Get detailed content from a specific wiki page
     */
    async getPageContent(pageTitle, includeExamples = true) {
        const cacheKey = `page:${pageTitle}:${includeExamples}`;
        const cached = this.getCachedResult(cacheKey);
        if (cached)
            return cached;
        try {
            // Clean up the page title for URL
            const cleanTitle = this.cleanPageTitle(pageTitle);
            const url = `${this.baseUrl}/${cleanTitle}`;
            const response = await axios_1.default.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "QB64PE-MCP-Server/1.0.0",
                },
            });
            const $ = cheerio.load(response.data);
            // Extract main content
            const title = $("h1").first().text().trim();
            const content = this.extractPageContent($, includeExamples);
            const result = `# ${title}\n\n${content}`;
            this.setCachedResult(cacheKey, result);
            return result;
        }
        catch (error) {
            console.error("Page fetch error:", error);
            return this.getFallbackPageContent(pageTitle);
        }
    }
    /**
     * Get the wiki index/overview
     */
    async getWikiIndex() {
        const cacheKey = "wiki-index";
        const cached = this.getCachedResult(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/Main_Page`, {
                timeout: 10000,
                headers: {
                    "User-Agent": "QB64PE-MCP-Server/1.0.0",
                },
            });
            const $ = cheerio.load(response.data);
            const index = this.extractWikiIndex($);
            this.setCachedResult(cacheKey, index);
            return index;
        }
        catch (error) {
            console.error("Wiki index fetch error:", error);
            return this.getFallbackWikiIndex();
        }
    }
    /**
     * Perform actual wiki search using the search API
     */
    async performWikiSearch(query, category) {
        const searchUrl = `${this.baseUrl}/Special:Search`;
        const params = new URLSearchParams({
            search: query,
            go: "Go",
        });
        const response = await axios_1.default.get(`${searchUrl}?${params}`, {
            timeout: 10000,
            headers: {
                "User-Agent": "QB64PE-MCP-Server/1.0.0",
            },
        });
        const $ = cheerio.load(response.data);
        const results = [];
        // Parse search results
        $(".mw-search-result").each((_, element) => {
            const $result = $(element);
            const titleElement = $result.find(".mw-search-result-heading a");
            const title = titleElement.text().trim();
            const url = titleElement.attr("href") || "";
            const snippet = $result.find(".searchresult").text().trim();
            if (title && url) {
                results.push({
                    title,
                    url: this.resolveUrl(url),
                    snippet,
                    category: this.categorizeResult(title, snippet),
                });
            }
        });
        return this.filterByCategory(results, category);
    }
    /**
     * Perform alternative search when primary search fails
     */
    async performAlternativeSearch(query, category) {
        // Try searching for common QB64PE pages
        const commonPages = this.getCommonPages();
        const results = [];
        for (const page of commonPages) {
            if (page.title.toLowerCase().includes(query.toLowerCase()) ||
                page.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))) {
                results.push({
                    title: page.title,
                    url: page.url,
                    snippet: page.description,
                    category: page.category,
                });
            }
        }
        return this.filterByCategory(results, category);
    }
    /**
     * Extract content from a wiki page
     */
    extractPageContent($, includeExamples) {
        let content = "";
        // Extract main content from the page
        const contentDiv = $("#mw-content-text");
        // Remove navigation and other non-content elements
        contentDiv.find(".navbox, .infobox, .metadata, .ambox").remove();
        // Extract paragraphs and headings
        contentDiv.find("p, h2, h3, h4, h5, h6").each((_, element) => {
            const $element = $(element);
            const text = $element.text().trim();
            if (text) {
                if ($element.is("h2, h3, h4, h5, h6")) {
                    const level = "#".repeat(parseInt($element.prop("tagName")?.slice(1) || "1"));
                    content += `\n${level} ${text}\n\n`;
                }
                else {
                    content += `${text}\n\n`;
                }
            }
        });
        // Extract code examples if requested
        if (includeExamples) {
            const examples = this.extractCodeExamples($);
            if (examples.length > 0) {
                content += "\n## Code Examples\n\n";
                examples.forEach((example, index) => {
                    content += `### Example ${index + 1}\n\n\`\`\`basic\n${example}\n\`\`\`\n\n`;
                });
            }
        }
        return content.trim();
    }
    /**
     * Extract code examples from a page
     */
    extractCodeExamples($) {
        const examples = [];
        // Look for code blocks in various formats
        $("pre, code").each((_, element) => {
            const $element = $(element);
            const code = $element.text().trim();
            // Filter for QB64PE code (basic heuristics)
            if (code.length > 20 &&
                (code.includes("PRINT") ||
                    code.includes("DIM") ||
                    code.includes("FOR") ||
                    code.includes("IF") ||
                    code.includes("SUB") ||
                    code.includes("FUNCTION"))) {
                examples.push(code);
            }
        });
        return examples.slice(0, 5); // Limit to 5 examples
    }
    /**
     * Extract wiki index content
     */
    extractWikiIndex($) {
        let index = "# QB64PE Wiki Index\n\n";
        // Extract main sections and links
        $("#mw-content-text")
            .find("h2, h3, ul")
            .each((_, element) => {
            const $element = $(element);
            if ($element.is("h2, h3")) {
                const level = "#".repeat(parseInt($element.prop("tagName")?.slice(1) || "1"));
                index += `${level} ${$element.text().trim()}\n\n`;
            }
            else if ($element.is("ul")) {
                $element.find("li a").each((_, link) => {
                    const $link = $(link);
                    const title = $link.text().trim();
                    const href = $link.attr("href");
                    if (title && href) {
                        index += `- [${title}](${this.resolveUrl(href)})\n`;
                    }
                });
                index += "\n";
            }
        });
        return index;
    }
    /**
     * Utility methods
     */
    cleanPageTitle(title) {
        // Remove URL scheme if present
        if (title.startsWith("http")) {
            const url = new URL(title);
            return url.pathname.split("/").pop() || title;
        }
        // Replace spaces with underscores
        return title.replace(/\s+/g, "_");
    }
    resolveUrl(url) {
        if (url.startsWith("http")) {
            return url;
        }
        if (url.startsWith("/")) {
            return `https://qb64phoenix.com${url}`;
        }
        return `https://qb64phoenix.com/qb64wiki/index.php/${url}`;
    }
    categorizeResult(title, snippet) {
        const text = (title + " " + snippet).toLowerCase();
        if (text.includes("function") || text.includes("sub"))
            return "functions";
        if (text.includes("statement") || text.includes("command"))
            return "statements";
        if (text.includes("operator"))
            return "operators";
        if (text.includes("data type") || text.includes("variable"))
            return "data-types";
        if (text.includes("tutorial") || text.includes("guide"))
            return "tutorials";
        if (text.includes("example"))
            return "examples";
        if (text.includes("keyword"))
            return "keywords";
        return "general";
    }
    filterByCategory(results, category) {
        if (!category || category === "all") {
            return results;
        }
        return results.filter((result) => result.category === category);
    }
    getCommonPages() {
        return [
            {
                title: "PRINT",
                url: `${this.baseUrl}/PRINT`,
                description: "Display text and values on the screen",
                keywords: ["print", "output", "display", "text"],
                category: "statements",
            },
            {
                title: "DIM",
                url: `${this.baseUrl}/DIM`,
                description: "Declare variables and arrays",
                keywords: ["dim", "variable", "array", "declare"],
                category: "statements",
            },
            {
                title: "FOR...NEXT",
                url: `${this.baseUrl}/FOR...NEXT`,
                description: "Loop structure for repetitive tasks",
                keywords: ["for", "next", "loop", "iteration"],
                category: "statements",
            },
            {
                title: "IF...THEN",
                url: `${this.baseUrl}/IF...THEN`,
                description: "Conditional execution statement",
                keywords: ["if", "then", "else", "conditional"],
                category: "statements",
            },
            {
                title: "SUB",
                url: `${this.baseUrl}/SUB`,
                description: "Define subroutines",
                keywords: ["sub", "subroutine", "procedure"],
                category: "statements",
            },
            {
                title: "FUNCTION",
                url: `${this.baseUrl}/FUNCTION`,
                description: "Define functions that return values",
                keywords: ["function", "return", "value"],
                category: "statements",
            },
        ];
    }
    getFallbackResults(query, category) {
        const commonPages = this.getCommonPages();
        return commonPages
            .filter((page) => page.title.toLowerCase().includes(query.toLowerCase()) ||
            page.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())))
            .filter((page) => !category || category === "all" || page.category === category)
            .map((page) => ({
            title: page.title,
            url: page.url,
            snippet: page.description,
            category: page.category,
        }));
    }
    getFallbackPageContent(pageTitle) {
        return `# ${pageTitle}

Unable to fetch content from the QB64PE wiki. This could be due to:

1. Network connectivity issues
2. The page doesn't exist
3. The page title format is incorrect

Please try:
- Checking the page title spelling
- Using the search function to find similar pages
- Visiting the wiki directly at: https://qb64phoenix.com/qb64wiki/

Common QB64PE topics include:
- PRINT statements for output
- DIM for variable declarations
- FOR...NEXT loops
- IF...THEN conditionals
- SUB and FUNCTION definitions
- Data types (INTEGER, STRING, SINGLE, etc.)
`;
    }
    getFallbackWikiIndex() {
        return `# QB64PE Wiki Index

## Core Language Elements
- [PRINT](https://qb64phoenix.com/qb64wiki/index.php/PRINT) - Display output
- [DIM](https://qb64phoenix.com/qb64wiki/index.php/DIM) - Declare variables
- [FOR...NEXT](https://qb64phoenix.com/qb64wiki/index.php/FOR...NEXT) - Loop structures
- [IF...THEN](https://qb64phoenix.com/qb64wiki/index.php/IF...THEN) - Conditionals
- [SUB](https://qb64phoenix.com/qb64wiki/index.php/SUB) - Subroutines
- [FUNCTION](https://qb64phoenix.com/qb64wiki/index.php/FUNCTION) - Functions

## Data Types
- [INTEGER](https://qb64phoenix.com/qb64wiki/index.php/INTEGER)
- [STRING](https://qb64phoenix.com/qb64wiki/index.php/STRING)
- [SINGLE](https://qb64phoenix.com/qb64wiki/index.php/SINGLE)
- [DOUBLE](https://qb64phoenix.com/qb64wiki/index.php/DOUBLE)

## Graphics and Sound
- [_DISPLAY](https://qb64phoenix.com/qb64wiki/index.php/_DISPLAY)
- [_AUTODISPLAY](https://qb64phoenix.com/qb64wiki/index.php/_AUTODISPLAY)
- [PLAY](https://qb64phoenix.com/qb64wiki/index.php/PLAY)

## File Operations
- [OPEN](https://qb64phoenix.com/qb64wiki/index.php/OPEN)
- [CLOSE](https://qb64phoenix.com/qb64wiki/index.php/CLOSE)
- [INPUT](https://qb64phoenix.com/qb64wiki/index.php/INPUT)
- [OUTPUT](https://qb64phoenix.com/qb64wiki/index.php/OUTPUT)

Visit the full wiki at: https://qb64phoenix.com/qb64wiki/
`;
    }
    /**
     * Parse platform availability from QB64PE wiki pages
     * Extracts Windows/Linux/macOS support information from wiki tables
     */
    async parsePlatformAvailability(keywordName) {
        const cacheKey = `platform:${keywordName}`;
        const cached = this.getCachedResult(cacheKey);
        if (cached)
            return cached;
        try {
            // Clean up the keyword name for URL
            const cleanName = this.cleanPageTitle(keywordName);
            const url = `${this.baseUrl}/${cleanName}`;
            const response = await axios_1.default.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "QB64PE-MCP-Server/1.0.0",
                },
            });
            const $ = cheerio.load(response.data);
            // Look for platform availability information in various formats
            const availability = this.extractPlatformInfo($, keywordName, response.data);
            if (availability) {
                this.setCachedResult(cacheKey, availability);
                return availability;
            }
            return null;
        }
        catch (error) {
            console.error(`Platform availability parse error for ${keywordName}:`, error);
            return null;
        }
    }
    /**
     * Batch parse platform availability for multiple keywords
     */
    async batchParsePlatformAvailability(keywords) {
        const results = new Map();
        // Process in batches to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < keywords.length; i += batchSize) {
            const batch = keywords.slice(i, i + batchSize);
            const promises = batch.map((kw) => this.parsePlatformAvailability(kw));
            const batchResults = await Promise.all(promises);
            batchResults.forEach((result, idx) => {
                if (result) {
                    results.set(batch[idx], result);
                }
            });
            // Small delay between batches to be nice to the server
            if (i + batchSize < keywords.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        return results;
    }
    /**
     * Extract platform availability information from page HTML
     */
    extractPlatformInfo($, keywordName, html) {
        let windows = true;
        let linux = true;
        let macos = true;
        // Strategy 1: Look for explicit "Availability" or "Platform" tables
        $("table").each((_, table) => {
            const $table = $(table);
            const tableText = $table.text().toLowerCase();
            if (tableText.includes("availab") ||
                tableText.includes("platform") ||
                tableText.includes("windows") ||
                tableText.includes("linux") ||
                tableText.includes("macos")) {
                // Parse table headers to find platform columns
                const headers = [];
                $table.find("th").each((_, th) => {
                    headers.push($(th).text().trim().toLowerCase());
                });
                const winIdx = headers.findIndex((h) => h.includes("win"));
                const linIdx = headers.findIndex((h) => h.includes("lin") || h.includes("unix"));
                const macIdx = headers.findIndex((h) => h.includes("mac") || h.includes("osx"));
                if (winIdx >= 0 || linIdx >= 0 || macIdx >= 0) {
                    // Found platform columns - look for checkmarks/crosses in the keyword's row
                    $table.find("tr").each((_, tr) => {
                        const $tr = $(tr);
                        const rowText = $tr.text().toLowerCase();
                        if (rowText.includes(keywordName.toLowerCase().replace(/_/g, ""))) {
                            const cells = $tr.find("td");
                            if (winIdx >= 0 && winIdx < cells.length) {
                                const cell = $(cells[winIdx]).text().trim();
                                windows = this.isAvailable(cell);
                            }
                            if (linIdx >= 0 && linIdx < cells.length) {
                                const cell = $(cells[linIdx]).text().trim();
                                linux = this.isAvailable(cell);
                            }
                            if (macIdx >= 0 && macIdx < cells.length) {
                                const cell = $(cells[macIdx]).text().trim();
                                macos = this.isAvailable(cell);
                            }
                        }
                    });
                }
            }
        });
        // Strategy 2: Look for text patterns in the page content
        const pageText = $.text().toLowerCase();
        // Check for "not available" or "not supported" patterns
        if (pageText.includes("not available") ||
            pageText.includes("not supported") ||
            pageText.includes("windows only") ||
            pageText.includes("windows-only")) {
            if (pageText.includes("linux") ||
                pageText.includes("macos") ||
                pageText.includes("mac")) {
                // Parse which platforms are excluded
                if (pageText.match(/not.*(?:available|supported).*(?:on|in).*linux/)) {
                    linux = false;
                }
                if (pageText.match(/not.*(?:available|supported).*(?:on|in).*(?:macos|mac|osx)/)) {
                    macos = false;
                }
                if (pageText.match(/not.*(?:available|supported).*(?:on|in).*windows/)) {
                    windows = false;
                }
            }
            else if (pageText.includes("windows only") ||
                pageText.includes("windows-only")) {
                linux = false;
                macos = false;
            }
        }
        // Strategy 3: Look for positive availability mentions
        if (pageText.match(/available.*(?:on|in).*windows.*(?:and|,).*linux/)) {
            windows = true;
            linux = true;
            // Check if macOS is explicitly excluded
            if (pageText.match(/not.*(?:on|in).*(?:macos|mac|osx)/)) {
                macos = false;
            }
        }
        // Strategy 4: Check meta information sections
        const metaSections = ["availability", "platform support", "compatibility"];
        metaSections.forEach((section) => {
            $(`h2, h3, h4`).each((_, heading) => {
                const $heading = $(heading);
                if ($heading.text().toLowerCase().includes(section)) {
                    const $content = $heading.nextUntil("h2, h3, h4");
                    const contentText = $content.text().toLowerCase();
                    if (contentText.includes("windows") &&
                        contentText.includes("linux")) {
                        windows = true;
                        linux = true;
                    }
                    if (contentText.match(/not.*(?:macos|mac)/)) {
                        macos = false;
                    }
                    if (contentText.match(/windows.*only/)) {
                        linux = false;
                        macos = false;
                    }
                    if (contentText.match(/linux.*only/)) {
                        windows = false;
                        macos = false;
                    }
                }
            });
        });
        return {
            keyword: keywordName,
            windows,
            linux,
            macos,
            source: "wiki",
        };
    }
    /**
     * Determine if a table cell indicates availability
     * Checks for checkmarks (✓, ✔, yes, y) vs crosses (✗, ✘, no, n, -)
     */
    isAvailable(cellText) {
        const text = cellText.toLowerCase().trim();
        // Check for positive indicators
        if (text.includes("✓") ||
            text.includes("✔") ||
            text.includes("yes") ||
            text === "y" ||
            text.includes("supported") ||
            text.includes("available")) {
            return true;
        }
        // Check for negative indicators
        if (text.includes("✗") ||
            text.includes("✘") ||
            text.includes("no") ||
            text === "n" ||
            text === "-" ||
            text === "x" ||
            text.includes("not supported") ||
            text.includes("unavailable")) {
            return false;
        }
        // Default to true if ambiguous (assume available unless explicitly marked otherwise)
        return true;
    }
    /**
     * Cache management
     */
    getCachedResult(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }
    setCachedResult(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
}
exports.QB64PEWikiService = QB64PEWikiService;
//# sourceMappingURL=wiki-service.js.map