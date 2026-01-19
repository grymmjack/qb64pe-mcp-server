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
        description: "Get detailed information about a specific QB64PE keyword",
        inputSchema: {
            keyword: zod_1.z.string().describe("The QB64PE keyword to look up"),
        },
    }, async ({ keyword }) => {
        try {
            const validation = services.keywordsService.validateKeyword(keyword.toUpperCase());
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
                const errorMsg = validation.message || "Keyword not found";
                const suggestions = validation.suggestions?.length
                    ? `\n\nDid you mean: ${validation.suggestions.join(", ")}?`
                    : "";
                return (0, mcp_helpers_js_1.createMCPTextResponse)(`${errorMsg}${suggestions}`);
            }
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "looking up keyword");
        }
    });
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