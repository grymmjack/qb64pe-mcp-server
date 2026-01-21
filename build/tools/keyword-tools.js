"use strict";
/**
 * Keyword-related tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKeywordTools = registerKeywordTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all keyword-related tools
 */
function registerKeywordTools(server, services) {
    // Keyword lookup tool
    server.registerTool("lookup_qb64pe_keyword", {
        title: "Lookup QB64PE Keyword",
        description: "Get detailed information about a specific QB64PE keyword. Automatically performs fallback searches if keyword not found in local database.",
        inputSchema: {
            keyword: zod_1.z.string().describe("The QB64PE keyword to look up"),
        },
    }, async ({ keyword }) => {
        try {
            const upperKeyword = keyword.toUpperCase();
            const validation = services.keywordsService.validateKeyword(upperKeyword);
            if (validation.isValid && validation.keyword) {
                const wikiUrl = `https://qb64phoenix.com/qb64wiki/index.php/${validation.keyword.name.replace(/ /g, "_")}`;
                let response = `# ${validation.keyword.name}\n\n`;
                response += `**Category:** ${validation.keyword.category}\n\n`;
                response += `**Wiki:** ${wikiUrl}\n\n`;
                if (validation.keyword.description) {
                    response += `**Description:** ${validation.keyword.description}\n\n`;
                }
                if (validation.keyword.syntax) {
                    response += `**Syntax:**\n\`\`\`qb64\n${validation.keyword.syntax}\n\`\`\`\n\n`;
                }
                if (validation.relatedKeywords &&
                    validation.relatedKeywords.length > 0) {
                    response += `**Related Keywords:** ${validation.relatedKeywords.join(", ")}\n`;
                }
                return (0, mcp_helpers_js_1.createMCPTextResponse)(response);
            }
            else {
                // FALLBACK STRATEGY: Try intelligent searches
                let response = `⚠️ **Keyword "${keyword}" not found in local database.**\n\n`;
                // Strategy 1: Try searching with semantic terms
                const semanticTerms = inferSemanticTerms(keyword);
                if (semanticTerms.length > 0) {
                    response += `🔍 **Attempting fallback searches...**\n\n`;
                    for (const term of semanticTerms) {
                        const searchResults = services.keywordsService.searchKeywords(term, 5);
                        if (searchResults.length > 0) {
                            response += `### Search results for "${term}":\n`;
                            searchResults.forEach((result, idx) => {
                                response += `${idx + 1}. **${result.keyword}** (${result.matchType} match, relevance: ${result.relevance})\n`;
                                response += `   - ${result.info.description}\n`;
                                response += `   - Wiki: https://qb64phoenix.com/qb64wiki/index.php/${result.keyword.replace(/ /g, "_")}\n\n`;
                            });
                        }
                    }
                }
                // Strategy 2: Provide wiki search URL
                const wikiSearchUrl = `https://qb64phoenix.com/qb64wiki/index.php?search=${encodeURIComponent(keyword)}&title=Special%3ASearch&profile=default&fulltext=1`;
                response += `\n📚 **Direct Wiki Search:** [${keyword}](${wikiSearchUrl})\n\n`;
                // Strategy 3: Show any suggestions from validation
                if (validation.suggestions && validation.suggestions.length > 0) {
                    response += `💡 **Did you mean:** ${validation.suggestions.join(", ")}?\n\n`;
                }
                response += `\n**Tip:** Try searching for related concepts. For example:\n`;
                response += `- If looking for TRUE/FALSE, try searching for "boolean"\n`;
                response += `- If looking for a graphics function, try searching for "graphics" or "screen"\n`;
                response += `- If looking for a file operation, try searching for "file" or "open"\n`;
                return (0, mcp_helpers_js_1.createMCPTextResponse)(response);
            }
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "looking up keyword");
        }
    });
    /**
     * Infer semantic search terms from a keyword
     */
    function inferSemanticTerms(keyword) {
        const terms = [];
        const lower = keyword.toLowerCase();
        // Boolean-related
        if (lower.includes('true') || lower.includes('false')) {
            terms.push('BOOLEAN', 'CONSTANTS');
        }
        // Graphics-related
        if (lower.includes('screen') || lower.includes('pixel') || lower.includes('draw') ||
            lower.includes('color') || lower.includes('graphics') || lower.includes('image')) {
            terms.push('SCREEN', 'GRAPHICS', '_DISPLAY');
        }
        // File-related
        if (lower.includes('file') || lower.includes('open') || lower.includes('read') ||
            lower.includes('write') || lower.includes('load') || lower.includes('save')) {
            terms.push('OPEN', 'FILE', 'INPUT', 'OUTPUT');
        }
        // String-related
        if (lower.includes('string') || lower.includes('text') || lower.includes('chr') ||
            lower.includes('asc')) {
            terms.push('STRING', 'CHR$', 'ASC');
        }
        // Math-related
        if (lower.includes('math') || lower.includes('calc') || lower.includes('sin') ||
            lower.includes('cos') || lower.includes('sqrt')) {
            terms.push('SIN', 'COS', 'SQR', 'ABS');
        }
        // Sound-related
        if (lower.includes('sound') || lower.includes('audio') || lower.includes('play') ||
            lower.includes('music')) {
            terms.push('SOUND', 'PLAY', '_SNDOPEN');
        }
        // Always try the keyword itself if no terms found
        if (terms.length === 0) {
            terms.push(keyword.toUpperCase());
        }
        return terms;
    }
    // Autocomplete keywords tool
    server.registerTool("autocomplete_qb64pe_keywords", {
        title: "Autocomplete QB64PE Keywords",
        description: "Get keyword suggestions based on partial input",
        inputSchema: {
            prefix: zod_1.z.string().describe("Partial keyword to autocomplete"),
            limit: zod_1.z.number().optional().describe("Maximum number of suggestions"),
        },
    }, async ({ prefix, limit = 10 }) => {
        try {
            const suggestions = services.keywordsService.getAutocomplete(prefix.toUpperCase(), limit);
            return (0, mcp_helpers_js_1.createMCPResponse)(suggestions);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "autocompleting keywords");
        }
    });
    // Get keywords by category
    server.registerTool("get_qb64pe_keywords_by_category", {
        title: "Get QB64PE Keywords by Category",
        description: "Get all keywords in a specific category",
        inputSchema: {
            category: zod_1.z
                .enum([
                "statement",
                "function",
                "metacommand",
                "operator",
                "keyword",
                "all",
            ])
                .describe("Category to filter by"),
        },
    }, async ({ category }) => {
        try {
            const keywords = category === "all"
                ? services.keywordsService.getAllKeywords()
                : services.keywordsService.getKeywordsByCategory(category);
            return (0, mcp_helpers_js_1.createMCPResponse)(keywords);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting keywords by category");
        }
    });
    // Search keywords
    server.registerTool("search_qb64pe_keywords", {
        title: "Search QB64PE Keywords",
        description: "Search for keywords by name or description",
        inputSchema: {
            query: zod_1.z.string().describe("Search query"),
            maxResults: zod_1.z
                .number()
                .optional()
                .describe("Maximum number of results to return (default: 20)"),
        },
    }, async ({ query, maxResults = 20 }) => {
        try {
            const results = services.keywordsService.searchKeywords(query.toUpperCase(), maxResults);
            return (0, mcp_helpers_js_1.createMCPResponse)(results);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "searching keywords");
        }
    });
    // Search keywords by wiki category
    server.registerTool("search_qb64pe_keywords_by_wiki_category", {
        title: "Search QB64PE Keywords by Wiki Category",
        description: "Search for keywords within specific wiki categories",
        inputSchema: {
            wikiCategory: zod_1.z.string().describe("Wiki category name to search in"),
            searchTerm: zod_1.z
                .string()
                .optional()
                .describe("Optional search term within the category"),
        },
    }, async ({ wikiCategory, searchTerm }) => {
        try {
            const results = await services.keywordsService.searchByWikiCategory(wikiCategory, searchTerm);
            return (0, mcp_helpers_js_1.createMCPResponse)(results);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "searching keywords by wiki category");
        }
    });
}
//# sourceMappingURL=keyword-tools.js.map