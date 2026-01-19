"use strict";
/**
 * Wiki-related tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWikiTools = registerWikiTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all wiki-related tools
 */
function registerWikiTools(server, services) {
    // Wiki search tool
    server.registerTool("search_qb64pe_wiki", {
        title: "Search QB64PE Wiki",
        description: "Search the QB64PE wiki for documentation, tutorials, and reference materials",
        inputSchema: {
            query: zod_1.z.string().describe("Search query for QB64PE wiki content"),
            category: zod_1.z
                .enum([
                "keywords",
                "functions",
                "statements",
                "operators",
                "data-types",
                "tutorials",
                "examples",
                "all",
            ])
                .optional()
                .describe("Specific category to search in"),
        },
    }, async ({ query, category }) => {
        try {
            const results = await services.wikiService.searchWiki(query, category);
            return (0, mcp_helpers_js_1.createMCPResponse)(results);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "searching wiki");
        }
    });
    // Get QB64PE page content
    server.registerTool("get_qb64pe_page", {
        title: "Get QB64PE Wiki Page",
        description: "Retrieve detailed content from a specific QB64PE wiki page",
        inputSchema: {
            pageTitle: zod_1.z.string().describe("Title or URL of the QB64PE wiki page"),
            includeExamples: zod_1.z
                .boolean()
                .optional()
                .describe("Whether to include code examples"),
        },
    }, (0, mcp_helpers_js_1.createTextToolHandler)(async ({ pageTitle, includeExamples = true }) => {
        return await services.wikiService.getPageContent(pageTitle, includeExamples);
    }, "fetching page"));
    // Get wiki categories
    server.registerTool("get_qb64pe_wiki_categories", {
        title: "Get QB64PE Wiki Categories",
        description: "Get all available QB64PE wiki categories for organizing keywords and functions",
        inputSchema: {},
    }, async () => {
        try {
            const categories = await services.wikiService.getWikiCategories();
            return (0, mcp_helpers_js_1.createMCPResponse)(categories);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting wiki categories");
        }
    });
}
//# sourceMappingURL=wiki-tools.js.map