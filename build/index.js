"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const wiki_service_js_1 = require("./services/wiki-service.js");
const compiler_service_js_1 = require("./services/compiler-service.js");
const syntax_service_js_1 = require("./services/syntax-service.js");
/**
 * Main MCP Server for QB64PE Development
 */
class QB64PEMCPServer {
    server;
    wikiService;
    compilerService;
    syntaxService;
    constructor() {
        this.server = new mcp_js_1.McpServer({
            name: "qb64pe-mcp-server",
            version: "1.0.0"
        });
        // Initialize services
        this.wikiService = new wiki_service_js_1.QB64PEWikiService();
        this.compilerService = new compiler_service_js_1.QB64PECompilerService();
        this.syntaxService = new syntax_service_js_1.QB64PESyntaxService();
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