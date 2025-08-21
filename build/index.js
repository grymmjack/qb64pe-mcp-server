"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const wiki_service_js_1 = require("./services/wiki-service.js");
const compiler_service_js_1 = require("./services/compiler-service.js");
const syntax_service_js_1 = require("./services/syntax-service.js");
const compatibility_service_js_1 = require("./services/compatibility-service.js");
const keywords_service_js_1 = require("./services/keywords-service.js");
/**
 * Main MCP Server for QB64PE Development
 */
class QB64PEMCPServer {
    server;
    wikiService;
    compilerService;
    syntaxService;
    compatibilityService;
    keywordsService;
    constructor() {
        this.server = new mcp_js_1.McpServer({
            name: "qb64pe-mcp-server",
            version: "1.0.0"
        });
        // Initialize services
        this.wikiService = new wiki_service_js_1.QB64PEWikiService();
        this.compilerService = new compiler_service_js_1.QB64PECompilerService();
        this.syntaxService = new syntax_service_js_1.QB64PESyntaxService();
        this.compatibilityService = new compatibility_service_js_1.QB64PECompatibilityService();
        this.keywordsService = new keywords_service_js_1.KeywordsService();
    }
    /**
     * Initialize and configure the MCP server
     */
    async initialize() {
        await this.setupTools();
        await this.setupResources();
        await this.setupPrompts();
    }
    /**
     * Setup tool implementations
     */
    async setupTools() {
        // Wiki search tool
        this.server.registerTool("search_qb64pe_wiki", {
            title: "Search QB64PE Wiki",
            description: "Search the QB64PE wiki for documentation, tutorials, and reference materials",
            inputSchema: {
                query: zod_1.z.string().describe("Search query for QB64PE wiki content"),
                category: zod_1.z.enum([
                    "keywords",
                    "functions",
                    "statements",
                    "operators",
                    "data-types",
                    "tutorials",
                    "examples",
                    "all"
                ]).optional().describe("Specific category to search in")
            }
        }, async ({ query, category }) => {
            try {
                const results = await this.wikiService.searchWiki(query, category);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(results, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error searching wiki: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get QB64PE page content
        this.server.registerTool("get_qb64pe_page", {
            title: "Get QB64PE Wiki Page",
            description: "Retrieve detailed content from a specific QB64PE wiki page",
            inputSchema: {
                pageTitle: zod_1.z.string().describe("Title or URL of the QB64PE wiki page"),
                includeExamples: zod_1.z.boolean().optional().describe("Whether to include code examples")
            }
        }, async ({ pageTitle, includeExamples = true }) => {
            try {
                const content = await this.wikiService.getPageContent(pageTitle, includeExamples);
                return {
                    content: [{
                            type: "text",
                            text: content
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Compiler options tool
        this.server.registerTool("get_compiler_options", {
            title: "Get QB64PE Compiler Options",
            description: "Get information about QB64PE compiler command-line options and flags",
            inputSchema: {
                platform: zod_1.z.enum(["windows", "macos", "linux", "all"]).optional().describe("Target platform"),
                optionType: zod_1.z.enum(["compilation", "debugging", "optimization", "all"]).optional().describe("Type of compiler options")
            }
        }, async ({ platform = "all", optionType = "all" }) => {
            try {
                const options = await this.compilerService.getCompilerOptions(platform, optionType);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(options, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting compiler options: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Syntax validation tool
        this.server.registerTool("validate_qb64pe_syntax", {
            title: "Validate QB64PE Syntax",
            description: "Validate QB64PE code syntax and suggest corrections",
            inputSchema: {
                code: zod_1.z.string().describe("QB64PE code to validate"),
                checkLevel: zod_1.z.enum(["basic", "strict", "best-practices"]).optional().describe("Level of syntax checking")
            }
        }, async ({ code, checkLevel = "basic" }) => {
            try {
                const validation = await this.syntaxService.validateSyntax(code, checkLevel);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(validation, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error validating syntax: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Debugging help tool
        this.server.registerTool("get_debugging_help", {
            title: "Get QB64PE Debugging Help",
            description: "Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc.",
            inputSchema: {
                issue: zod_1.z.string().describe("Description of the debugging issue"),
                platform: zod_1.z.enum(["windows", "macos", "linux", "all"]).optional().describe("Target platform")
            }
        }, async ({ issue, platform = "all" }) => {
            try {
                const help = await this.compilerService.getDebuggingHelp(issue, platform);
                return {
                    content: [{
                            type: "text",
                            text: help
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting debugging help: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Compatibility validation tool
        this.server.registerTool("validate_qb64pe_compatibility", {
            title: "Validate QB64PE Compatibility",
            description: "Check code for QB64PE compatibility issues and get solutions",
            inputSchema: {
                code: zod_1.z.string().describe("QB64PE code to check for compatibility issues"),
                platform: zod_1.z.enum(["windows", "macos", "linux", "all"]).optional().describe("Target platform")
            }
        }, async ({ code, platform = "all" }) => {
            try {
                const issues = await this.compatibilityService.validateCompatibility(code);
                const platformInfo = await this.compatibilityService.getPlatformCompatibility(platform);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                issues,
                                platformInfo,
                                summary: {
                                    totalIssues: issues.length,
                                    errors: issues.filter(i => i.severity === 'error').length,
                                    warnings: issues.filter(i => i.severity === 'warning').length
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error validating compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Compatibility knowledge search tool
        this.server.registerTool("search_qb64pe_compatibility", {
            title: "Search QB64PE Compatibility Knowledge",
            description: "Search for compatibility issues, solutions, and best practices",
            inputSchema: {
                query: zod_1.z.string().describe("Search query for compatibility knowledge"),
                category: zod_1.z.enum([
                    "function_return_types",
                    "console_directives",
                    "multi_statement_lines",
                    "array_declarations",
                    "missing_functions",
                    "legacy_keywords",
                    "device_access",
                    "platform_specific",
                    "best_practices",
                    "debugging",
                    "all"
                ]).optional().describe("Specific compatibility category to search")
            }
        }, async ({ query, category }) => {
            try {
                const results = await this.compatibilityService.searchCompatibility(query);
                const filteredResults = category && category !== 'all'
                    ? results.filter(r => r.category === category)
                    : results;
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(filteredResults, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error searching compatibility knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Best practices guidance tool
        this.server.registerTool("get_qb64pe_best_practices", {
            title: "Get QB64PE Best Practices",
            description: "Get best practices and coding guidelines for QB64PE development",
            inputSchema: {
                topic: zod_1.z.enum([
                    "syntax",
                    "debugging",
                    "performance",
                    "cross_platform",
                    "code_organization",
                    "all"
                ]).optional().describe("Specific topic for best practices")
            }
        }, async ({ topic = "all" }) => {
            try {
                const practices = await this.compatibilityService.getBestPractices();
                let guidance = "# QB64PE Best Practices\n\n";
                if (topic === "debugging" || topic === "all") {
                    const debuggingHelp = await this.compatibilityService.getDebuggingGuidance();
                    guidance += debuggingHelp + "\n\n";
                }
                guidance += "## General Guidelines\n";
                practices.forEach(practice => {
                    guidance += `- ${practice}\n`;
                });
                return {
                    content: [{
                            type: "text",
                            text: guidance
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting best practices: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Keyword lookup tool
        this.server.registerTool("lookup_qb64pe_keyword", {
            title: "Lookup QB64PE Keyword",
            description: "Get detailed information about a specific QB64PE keyword",
            inputSchema: {
                keyword: zod_1.z.string().describe("The QB64PE keyword to look up")
            }
        }, async ({ keyword }) => {
            try {
                const validation = this.keywordsService.validateKeyword(keyword.toUpperCase());
                if (validation.isValid && validation.keyword) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    keyword: validation.keyword,
                                    isValid: true
                                }, null, 2)
                            }]
                    };
                }
                else {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    keyword: keyword,
                                    isValid: false,
                                    suggestions: validation.suggestions || []
                                }, null, 2)
                            }]
                    };
                }
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error looking up keyword: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Keyword autocomplete tool
        this.server.registerTool("autocomplete_qb64pe_keywords", {
            title: "QB64PE Keyword Autocomplete",
            description: "Get autocomplete suggestions for QB64PE keywords",
            inputSchema: {
                prefix: zod_1.z.string().describe("The partial keyword to autocomplete"),
                maxResults: zod_1.z.number().optional().describe("Maximum number of suggestions (default: 10)")
            }
        }, async ({ prefix, maxResults = 10 }) => {
            try {
                const suggestions = this.keywordsService.getAutocomplete(prefix, maxResults);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                prefix,
                                suggestions
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting autocomplete: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Keywords by category tool
        this.server.registerTool("get_qb64pe_keywords_by_category", {
            title: "Get QB64PE Keywords by Category",
            description: "Get all keywords in a specific category",
            inputSchema: {
                category: zod_1.z.enum([
                    "statements",
                    "functions",
                    "operators",
                    "metacommands",
                    "opengl",
                    "types",
                    "constants",
                    "legacy"
                ]).describe("The keyword category to retrieve")
            }
        }, async ({ category }) => {
            try {
                const keywords = this.keywordsService.getKeywordsByCategory(category);
                const categories = this.keywordsService.getCategories();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                category,
                                description: categories[category]?.description || "No description available",
                                keywords: keywords.map(k => ({
                                    name: k.name,
                                    description: k.description,
                                    type: k.type,
                                    version: k.version
                                }))
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting keywords by category: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Search keywords tool
        this.server.registerTool("search_qb64pe_keywords", {
            title: "Search QB64PE Keywords",
            description: "Search for QB64PE keywords by name, description, or functionality",
            inputSchema: {
                query: zod_1.z.string().describe("Search query for keywords"),
                maxResults: zod_1.z.number().optional().describe("Maximum number of results (default: 20)")
            }
        }, async ({ query, maxResults = 20 }) => {
            try {
                const results = this.keywordsService.searchKeywords(query, maxResults);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                query,
                                results: results.map(r => ({
                                    keyword: r.keyword,
                                    relevance: r.relevance,
                                    matchType: r.matchType,
                                    info: {
                                        name: r.info.name,
                                        type: r.info.type,
                                        description: r.info.description,
                                        syntax: r.info.syntax,
                                        example: r.info.example,
                                        version: r.info.version
                                    }
                                }))
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error searching keywords: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
    }
    /**
     * Setup resource implementations
     */
    async setupResources() {
        // QB64PE wiki base resource
        this.server.registerResource("qb64pe-wiki", "qb64pe://wiki/", {
            title: "QB64PE Wiki",
            description: "Access to the QB64PE wiki documentation",
            mimeType: "text/markdown"
        }, async (uri) => {
            const wikiIndex = await this.wikiService.getWikiIndex();
            return {
                contents: [{
                        uri: uri.href,
                        text: wikiIndex
                    }]
            };
        });
        // Compiler reference resource
        this.server.registerResource("qb64pe-compiler", "qb64pe://compiler/reference", {
            title: "QB64PE Compiler Reference",
            description: "Complete reference for QB64PE compiler options and usage",
            mimeType: "text/markdown"
        }, async (uri) => {
            const compilerRef = await this.compilerService.getCompilerReference();
            return {
                contents: [{
                        uri: uri.href,
                        text: compilerRef
                    }]
            };
        });
        // Compatibility documentation resource
        this.server.registerResource("qb64pe-compatibility", "qb64pe://compatibility/", {
            title: "QB64PE Compatibility Guide",
            description: "Comprehensive compatibility documentation and issue solutions",
            mimeType: "text/markdown"
        }, async (uri) => {
            try {
                // Try to read the compatibility documentation file
                const compatibilityContent = `# QB64PE Compatibility Guide

This resource provides comprehensive compatibility information for QB64PE development.

## Available Tools
- validate_qb64pe_compatibility: Check code for compatibility issues
- search_qb64pe_compatibility: Search compatibility knowledge base
- get_qb64pe_best_practices: Get coding best practices

## Key Compatibility Areas
- Function return type declarations (use sigils, not AS clauses)
- Console directives ($CONSOLE, $CONSOLE:ONLY)
- Multi-statement line restrictions
- Array declaration limitations
- Missing string functions
- Legacy BASIC keyword support
- Platform-specific features

Use the tools above to get detailed information and solutions for specific issues.`;
                return {
                    contents: [{
                            uri: uri.href,
                            text: compatibilityContent
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading compatibility documentation: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // QB64PE keywords base resource
        this.server.registerResource("qb64pe-keywords", "qb64pe://keywords/", {
            title: "QB64PE Keywords Reference",
            description: "Complete reference of QB64PE keywords and syntax",
            mimeType: "application/json"
        }, async (uri) => {
            try {
                const categories = this.keywordsService.getCategories();
                const allKeywords = this.keywordsService.getAllKeywords();
                return {
                    contents: [{
                            uri: uri.href,
                            text: JSON.stringify({
                                categories,
                                totalKeywords: Object.keys(allKeywords).length,
                                keywordsByCategory: Object.entries(categories).reduce((acc, [catName, catInfo]) => {
                                    acc[catName] = {
                                        description: catInfo.description,
                                        count: catInfo.keywords.length,
                                        keywords: catInfo.keywords.slice(0, 10) // First 10 as examples
                                    };
                                    return acc;
                                }, {})
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading keywords reference: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // Keywords by category resource
        this.server.registerResource("qb64pe-keywords-category", "qb64pe://keywords/category/{category}", {
            title: "QB64PE Keywords by Category",
            description: "Keywords filtered by specific category",
            mimeType: "application/json"
        }, async (uri) => {
            try {
                const url = new URL(uri.href);
                const category = url.pathname.split('/').pop();
                if (!category) {
                    return {
                        contents: [{
                                uri: uri.href,
                                text: JSON.stringify({ error: "Category not specified" }, null, 2)
                            }]
                    };
                }
                const keywords = this.keywordsService.getKeywordsByCategory(category);
                const categories = this.keywordsService.getCategories();
                return {
                    contents: [{
                            uri: uri.href,
                            text: JSON.stringify({
                                category,
                                description: categories[category]?.description,
                                keywords: keywords.map(k => ({
                                    name: k.name,
                                    type: k.type,
                                    description: k.description,
                                    syntax: k.syntax,
                                    version: k.version,
                                    availability: k.availability
                                }))
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading keywords by category: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // Individual keyword resource
        this.server.registerResource("qb64pe-keyword-detail", "qb64pe://keywords/detail/{keyword}", {
            title: "QB64PE Keyword Detail",
            description: "Detailed information about a specific keyword",
            mimeType: "application/json"
        }, async (uri) => {
            try {
                const url = new URL(uri.href);
                const keyword = url.pathname.split('/').pop()?.toUpperCase();
                if (!keyword) {
                    return {
                        contents: [{
                                uri: uri.href,
                                text: JSON.stringify({ error: "Keyword not specified" }, null, 2)
                            }]
                    };
                }
                const validation = this.keywordsService.validateKeyword(keyword);
                return {
                    contents: [{
                            uri: uri.href,
                            text: JSON.stringify(validation, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading keyword detail: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
    }
    /**
     * Setup prompt templates
     */
    async setupPrompts() {
        // Code review prompt
        this.server.registerPrompt("review-qb64pe-code", {
            title: "Review QB64PE Code",
            description: "Review QB64PE code for best practices, syntax issues, and optimizations",
            argsSchema: {
                code: zod_1.z.string().describe("QB64PE code to review"),
                focusAreas: zod_1.z.string().optional().describe("Comma-separated list of areas to focus the review on: syntax, performance, best-practices, cross-platform, debugging")
            }
        }, ({ code, focusAreas = "syntax, best-practices" }) => ({
            messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please review this QB64PE code focusing on: ${focusAreas}

Code to review:
\`\`\`basic
${code}
\`\`\`

Please provide:
1. Syntax validation and corrections
2. Best practice recommendations
3. Cross-platform compatibility notes
4. Performance optimization suggestions
5. Debugging recommendations

Ensure all suggestions are specific to QB64PE and not other BASIC dialects.`
                    }
                }]
        }));
        // Debugging helper prompt
        this.server.registerPrompt("debug-qb64pe-issue", {
            title: "Debug QB64PE Issue",
            description: "Help debug QB64PE programs with step-by-step guidance",
            argsSchema: {
                problemDescription: zod_1.z.string().describe("Description of the problem or error"),
                code: zod_1.z.string().optional().describe("Relevant QB64PE code (if any)"),
                platform: zod_1.z.enum(["windows", "macos", "linux"]).optional().describe("Target platform")
            }
        }, ({ problemDescription, code, platform }) => ({
            messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `Help me debug this QB64PE issue:

Problem: ${problemDescription}
${platform ? `Platform: ${platform}` : ''}
${code ? `\n\nCode:\n\`\`\`basic\n${code}\n\`\`\`` : ''}

Please provide:
1. Likely causes of the issue
2. Step-by-step debugging approach using QB64PE tools
3. PRINT statement debugging strategies
4. $CONSOLE usage for debugging
5. Platform-specific considerations (if applicable)
6. Common QB64PE pitfalls to check

Focus specifically on QB64PE debugging techniques and tools.`
                    }
                }]
        }));
    }
    /**
     * Start the MCP server
     */
    async start() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("QB64PE MCP Server started successfully");
    }
}
// Main execution
async function main() {
    const server = new QB64PEMCPServer();
    await server.initialize();
    await server.start();
}
// Error handling
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map