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
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const wiki_service_js_1 = require("./services/wiki-service.js");
const compiler_service_js_1 = require("./services/compiler-service.js");
const syntax_service_js_1 = require("./services/syntax-service.js");
const compatibility_service_js_1 = require("./services/compatibility-service.js");
const keywords_service_js_1 = require("./services/keywords-service.js");
const execution_service_js_1 = require("./services/execution-service.js");
const installation_service_js_1 = require("./services/installation-service.js");
const porting_service_js_1 = require("./services/porting-service.js");
const screenshot_service_js_1 = require("./services/screenshot-service.js");
const screenshot_watcher_service_js_1 = require("./services/screenshot-watcher-service.js");
const feedback_service_js_1 = require("./services/feedback-service.js");
const debugging_service_js_1 = require("./services/debugging-service.js");
const logging_service_js_1 = __importDefault(require("./services/logging-service.js"));
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
    executionService;
    installationService;
    portingService;
    screenshotService;
    screenshotWatcher;
    feedbackService;
    debuggingService;
    loggingService;
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
        this.executionService = new execution_service_js_1.QB64PEExecutionService();
        this.installationService = new installation_service_js_1.QB64PEInstallationService();
        this.portingService = new porting_service_js_1.QB64PEPortingService();
        this.screenshotService = new screenshot_service_js_1.ScreenshotService();
        this.screenshotWatcher = new screenshot_watcher_service_js_1.ScreenshotWatcherService();
        this.feedbackService = new feedback_service_js_1.FeedbackService();
        this.debuggingService = new debugging_service_js_1.QB64PEDebuggingService();
        this.loggingService = new logging_service_js_1.default();
        // Connect screenshot watcher to feedback service
        this.screenshotWatcher.on('analysis-complete', (analysisResult) => {
            this.handleAnalysisComplete(analysisResult);
        });
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
        // Search keywords by wiki category tool
        this.server.registerTool("search_qb64pe_keywords_by_wiki_category", {
            title: "Search QB64PE Keywords by Wiki Category",
            description: "Search for QB64PE keywords within specific functional categories from the QB64PE wiki",
            inputSchema: {
                category: zod_1.z.enum([
                    "Arrays and Data Storage",
                    "Colors and Transparency",
                    "Console Window",
                    "Conditional Operations",
                    "Definitions and Variable Types",
                    "External Disk and API calls",
                    "Error Trapping, Logging & Debugging",
                    "Event Trapping",
                    "File Input and Output",
                    "Checksums and Hashes",
                    "Compression and Encoding",
                    "Fonts",
                    "Game Controller Input (Joystick)",
                    "Graphic Commands",
                    "Graphics and Imaging:",
                    "Keyboard Input",
                    "Libraries",
                    "Logical Bitwise Operations",
                    "Mathematical Functions and Operations",
                    "Memory Handling and Clipboard",
                    "Mouse Input",
                    "Numerical Manipulation and Conversion",
                    "Port Input and Output (COM and LPT)",
                    "Print formatting",
                    "Printer Output (LPT and USB)",
                    "Program Flow and Loops",
                    "Sounds and Music",
                    "String Text Manipulation and Conversion",
                    "Sub procedures and Functions",
                    "TCP/IP Networking HTTP(S) and Email",
                    "Text on Screen",
                    "Time, Date and Timing",
                    "Window and Desktop",
                    "QB64 Programming Symbols"
                ]).describe("The functional category to search within"),
                query: zod_1.z.string().optional().describe("Optional search query to filter keywords within the category"),
                maxResults: zod_1.z.number().optional().describe("Maximum number of results (default: 50)")
            }
        }, async ({ category, query, maxResults = 50 }) => {
            try {
                const categoryKeywords = this.keywordsService.getKeywordsByWikiCategory(category);
                let filteredKeywords = categoryKeywords;
                // If a query is provided, filter the category keywords
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    filteredKeywords = categoryKeywords.filter((keyword) => {
                        const keywordInfo = this.keywordsService.getKeyword(keyword);
                        const lowerKeyword = keyword.toLowerCase();
                        const lowerDesc = keywordInfo?.description.toLowerCase() || '';
                        return lowerKeyword.includes(lowerQuery) ||
                            lowerDesc.includes(lowerQuery) ||
                            keyword.toLowerCase().startsWith(lowerQuery);
                    });
                }
                // Limit results
                const limitedResults = filteredKeywords.slice(0, maxResults);
                // Get detailed information for each keyword
                const keywordDetails = limitedResults.map((keyword) => {
                    const keywordInfo = this.keywordsService.getKeyword(keyword);
                    return {
                        keyword,
                        category,
                        info: keywordInfo ? {
                            name: keywordInfo.name,
                            type: keywordInfo.type,
                            description: keywordInfo.description,
                            syntax: keywordInfo.syntax,
                            example: keywordInfo.example,
                            version: keywordInfo.version,
                            related: keywordInfo.related
                        } : {
                            name: keyword,
                            description: "Keyword found in wiki category but not in enhanced database"
                        }
                    };
                });
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                category,
                                query: query || null,
                                totalInCategory: categoryKeywords.length,
                                totalReturned: limitedResults.length,
                                keywords: keywordDetails
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error searching keywords by wiki category: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Get all available wiki categories tool
        this.server.registerTool("get_qb64pe_wiki_categories", {
            title: "Get QB64PE Wiki Categories",
            description: "Get all available QB64PE wiki keyword categories with keyword counts",
            inputSchema: {}
        }, async () => {
            try {
                const wikiCategories = this.keywordsService.getWikiCategories();
                const categoryCounts = this.keywordsService.getWikiCategoryCounts();
                const categoriesWithCounts = Object.entries(wikiCategories).map(([categoryName, keywords]) => ({
                    category: categoryName,
                    keywordCount: keywords.length,
                    sampleKeywords: keywords.slice(0, 5), // First 5 keywords as examples
                    description: this.getCategoryDescription(categoryName)
                }));
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                totalCategories: categoriesWithCounts.length,
                                totalKeywords: Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
                                categories: categoriesWithCounts.sort((a, b) => b.keywordCount - a.keywordCount)
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting wiki categories: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Execution monitoring tools
        this.server.registerTool("analyze_qb64pe_execution_mode", {
            title: "Analyze QB64PE Execution Mode",
            description: "Analyze QB64PE source code to determine execution characteristics and monitoring requirements",
            inputSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to analyze")
            }
        }, async ({ sourceCode }) => {
            try {
                const executionState = this.executionService.analyzeExecutionMode(sourceCode);
                const guidance = this.executionService.getExecutionGuidance(executionState);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                executionState,
                                guidance,
                                summary: `Program type: ${executionState.hasGraphics ? 'Graphics' : 'Console'} ${executionState.hasConsole ? '+ Console' : ''}. ${guidance.recommendation}`
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error analyzing execution mode: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_process_monitoring_commands", {
            title: "Get Process Monitoring Commands",
            description: "Get cross-platform commands for monitoring QB64PE processes",
            inputSchema: {
                processName: zod_1.z.string().optional().describe("Process name to monitor (default: qb64pe)"),
                platform: zod_1.z.enum(["windows", "linux", "macos", "current"]).optional().describe("Target platform (default: current)")
            }
        }, async ({ processName = "qb64pe", platform = "current" }) => {
            try {
                const monitoringCommands = this.executionService.getProcessMonitoringCommands(processName);
                const terminationCommands = this.executionService.getProcessTerminationCommands(12345); // Example PID
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                platform: platform === "current" ? require('os').platform() : platform,
                                processName,
                                monitoring: {
                                    commands: monitoringCommands,
                                    description: "Commands to check if process is running and monitor resource usage"
                                },
                                termination: {
                                    commands: terminationCommands.map(cmd => cmd.replace('12345', '{pid}')),
                                    description: "Commands to terminate process (replace {pid} with actual process ID)"
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting monitoring commands: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("generate_monitoring_template", {
            title: "Generate QB64PE Monitoring Template",
            description: "Generate QB64PE code template with built-in logging, screenshots, and execution monitoring",
            inputSchema: {
                originalCode: zod_1.z.string().describe("Original QB64PE code to wrap with monitoring")
            }
        }, async ({ originalCode }) => {
            try {
                const monitoringCode = this.executionService.generateMonitoringTemplate(originalCode);
                return {
                    content: [{
                            type: "text",
                            text: monitoringCode
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating monitoring template: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("generate_console_formatting_template", {
            title: "Generate Console Formatting Template",
            description: "Generate QB64PE template with enhanced console output formatting for better terminal parsing",
            inputSchema: {}
        }, async () => {
            try {
                const formattingTemplate = this.executionService.generateConsoleFormattingTemplate();
                return {
                    content: [{
                            type: "text",
                            text: formattingTemplate
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating console formatting template: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_execution_monitoring_guidance", {
            title: "Get QB64PE Execution Monitoring Guidance",
            description: "Get comprehensive guidance for monitoring QB64PE program execution, including LLM timeout strategies",
            inputSchema: {}
        }, async () => {
            try {
                const guidance = this.executionService.getRealTimeMonitoringGuidance();
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
                            text: `Error getting monitoring guidance: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("parse_console_output", {
            title: "Parse QB64PE Console Output",
            description: "Parse QB64PE console output to detect completion signals, input prompts, and execution state",
            inputSchema: {
                output: zod_1.z.string().describe("Console output to parse")
            }
        }, async ({ output }) => {
            try {
                const parseResult = this.executionService.parseConsoleOutput(output);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(parseResult, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error parsing console output: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_file_monitoring_commands", {
            title: "Get File Monitoring Commands",
            description: "Get cross-platform commands for monitoring QB64PE log files and output",
            inputSchema: {
                logFile: zod_1.z.string().describe("Path to log file to monitor")
            }
        }, async ({ logFile }) => {
            try {
                const commands = this.executionService.getFileMonitoringCommands(logFile);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                logFile,
                                platform: require('os').platform(),
                                commands: {
                                    tail: commands[0],
                                    display: commands[1],
                                    search: commands.length > 2 ? commands[2] : "grep available on Unix-like systems only"
                                },
                                usage: {
                                    tail: "Monitor file in real-time as content is added",
                                    display: "Show current content of the file",
                                    search: "Search for specific patterns in the file"
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting file monitoring commands: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // QB64PE Installation Detection Tools
        this.server.registerTool("detect_qb64pe_installation", {
            title: "Detect QB64PE Installation",
            description: "Detect QB64PE installation and check if it's properly configured in PATH",
            inputSchema: {}
        }, async () => {
            try {
                const installation = await this.installationService.detectInstallation();
                const guidance = this.installationService.generateInstallationGuidance(installation);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                installation,
                                guidance,
                                summary: installation.isInstalled
                                    ? `QB64PE found at ${installation.installPath}${installation.inPath ? ' (in PATH)' : ' (not in PATH)'}`
                                    : 'QB64PE not found - installation required'
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error detecting QB64PE installation: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_qb64pe_path_configuration", {
            title: "Get QB64PE PATH Configuration Guide",
            description: "Get platform-specific instructions for adding QB64PE to system PATH",
            inputSchema: {
                installPath: zod_1.z.string().optional().describe("Known QB64PE installation path (if any)")
            }
        }, async ({ installPath }) => {
            try {
                const config = this.installationService.getPathConfiguration(installPath);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                platform: config.platform,
                                currentPath: config.currentPath,
                                pathSeparator: config.pathSeparator,
                                instructions: config.instructions,
                                commonInstallPaths: config.commonInstallPaths,
                                downloadUrl: config.downloadUrl
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting PATH configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("validate_qb64pe_path", {
            title: "Validate QB64PE Installation Path",
            description: "Check if a specific path contains a valid QB64PE installation",
            inputSchema: {
                testPath: zod_1.z.string().describe("Directory path to test for QB64PE installation")
            }
        }, async ({ testPath }) => {
            try {
                const validation = await this.installationService.validatePath(testPath);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                testPath,
                                validation,
                                result: validation.valid
                                    ? `Valid QB64PE installation found${validation.version ? ` (${validation.version})` : ''}`
                                    : 'No valid QB64PE installation found at this path'
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error validating path: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("generate_qb64pe_installation_report", {
            title: "Generate QB64PE Installation Report",
            description: "Generate a comprehensive report about QB64PE installation status and configuration",
            inputSchema: {}
        }, async () => {
            try {
                const report = await this.installationService.generateInstallationReport();
                return {
                    content: [{
                            type: "text",
                            text: report
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating installation report: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_qb64pe_installation_guidance", {
            title: "Get QB64PE Installation Guidance for LLMs",
            description: "Get user-friendly guidance for QB64PE installation and PATH configuration, optimized for LLM responses",
            inputSchema: {}
        }, async () => {
            try {
                const installation = await this.installationService.detectInstallation();
                const guidance = this.installationService.generateInstallationGuidance(installation);
                // Enhanced guidance specifically for LLMs to provide to users
                const llmGuidance = `# QB64PE Installation Status

${guidance}

## 🤖 **For LLMs: Important Reminders**

When helping users with QB64PE:

1. **Always check installation first** - Use the detection tools before suggesting QB64PE commands
2. **Provide PATH instructions** - If QB64PE is installed but not in PATH, give clear platform-specific instructions
3. **Be platform-aware** - Instructions differ significantly between Windows, macOS, and Linux
4. **Suggest alternatives** - If installation is complex, recommend package managers or pre-built binaries
5. **Verify after setup** - Always have users test with \`qb64pe --version\` after configuration

## 🔧 **Quick Troubleshooting**

**Command not found?**
- Check if QB64PE is installed: Use \`detect_qb64pe_installation\`
- Add to PATH: Use \`get_qb64pe_path_configuration\`
- Verify installation: Use \`validate_qb64pe_path\`

**Installation issues?**
- Generate full report: Use \`generate_qb64pe_installation_report\`
- Get comprehensive guidance: Use \`get_qb64pe_installation_guidance\`

Remember: QB64PE installation and PATH configuration is often the first hurdle for users!`;
                return {
                    content: [{
                            type: "text",
                            text: llmGuidance
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting installation guidance: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // QBasic to QB64PE Porting Tools
        this.server.registerTool("port_qbasic_to_qb64pe", {
            title: "Port QBasic Program to QB64PE",
            description: "Convert QBasic source code to QB64PE with systematic transformations and compatibility improvements",
            inputSchema: {
                sourceCode: zod_1.z.string().describe("QBasic source code to convert to QB64PE"),
                sourceDialect: zod_1.z.enum([
                    "qbasic",
                    "gwbasic",
                    "quickbasic",
                    "vb-dos",
                    "applesoft",
                    "commodore",
                    "amiga",
                    "atari",
                    "vb6",
                    "vbnet",
                    "vbscript",
                    "freebasic"
                ]).optional().describe("Source BASIC dialect (default: qbasic)"),
                addModernFeatures: zod_1.z.boolean().optional().describe("Add modern QB64PE features like $NoPrefix, $Resize:Smooth (default: true)"),
                preserveComments: zod_1.z.boolean().optional().describe("Preserve original comments (default: true)"),
                convertGraphics: zod_1.z.boolean().optional().describe("Convert and enhance graphics operations (default: true)"),
                optimizePerformance: zod_1.z.boolean().optional().describe("Apply performance optimizations (default: true)")
            }
        }, async ({ sourceCode, sourceDialect = "qbasic", addModernFeatures = true, preserveComments = true, convertGraphics = true, optimizePerformance = true }) => {
            try {
                const result = await this.portingService.portQBasicToQB64PE(sourceCode, {
                    sourceDialect,
                    addModernFeatures,
                    preserveComments,
                    convertGraphics,
                    optimizePerformance
                });
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                porting: result,
                                usage: {
                                    originalLines: result.originalCode.split('\n').length,
                                    portedLines: result.portedCode.split('\n').length,
                                    transformationsApplied: result.transformations.length,
                                    compatibilityLevel: result.compatibility,
                                    recommendedNextSteps: this.getPortingNextSteps(result)
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error porting code: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_porting_dialect_info", {
            title: "Get BASIC Dialect Porting Information",
            description: "Get information about supported BASIC dialects and their specific conversion rules for porting to QB64PE",
            inputSchema: {
                dialect: zod_1.z.enum([
                    "qbasic",
                    "gwbasic",
                    "quickbasic",
                    "vb-dos",
                    "applesoft",
                    "commodore",
                    "amiga",
                    "atari",
                    "vb6",
                    "vbnet",
                    "vbscript",
                    "freebasic",
                    "all"
                ]).optional().describe("Specific dialect to get information about (default: all)")
            }
        }, async ({ dialect = "all" }) => {
            try {
                const supportedDialects = this.portingService.getSupportedDialects();
                if (dialect === "all") {
                    const allDialectInfo = supportedDialects.map(d => ({
                        dialect: d,
                        rules: this.portingService.getDialectRules(d),
                        status: this.getDialectStatus(d)
                    }));
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    supportedDialects: supportedDialects.length,
                                    dialects: allDialectInfo,
                                    currentlyImplemented: ["qbasic"],
                                    plannedImplementation: supportedDialects.filter(d => d !== "qbasic"),
                                    notes: [
                                        "QBasic is fully implemented and tested",
                                        "Other dialects will be implemented in future versions",
                                        "All dialects will share common QB64PE transformation patterns",
                                        "Each dialect has specific conversion rules for unique syntax"
                                    ]
                                }, null, 2)
                            }]
                    };
                }
                else {
                    const rules = this.portingService.getDialectRules(dialect);
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    dialect,
                                    implementationStatus: this.getDialectStatus(dialect),
                                    conversionRules: rules,
                                    compatibilityNotes: this.getDialectCompatibilityNotes(dialect)
                                }, null, 2)
                            }]
                    };
                }
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting dialect information: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("analyze_qbasic_compatibility", {
            title: "Analyze QBasic Code for QB64PE Compatibility",
            description: "Analyze QBasic source code to identify potential compatibility issues before porting to QB64PE",
            inputSchema: {
                sourceCode: zod_1.z.string().describe("QBasic source code to analyze"),
                sourceDialect: zod_1.z.enum([
                    "qbasic",
                    "gwbasic",
                    "quickbasic",
                    "vb-dos",
                    "applesoft",
                    "commodore",
                    "amiga",
                    "atari",
                    "vb6",
                    "vbnet",
                    "vbscript",
                    "freebasic"
                ]).optional().describe("Source BASIC dialect (default: qbasic)")
            }
        }, async ({ sourceCode, sourceDialect = "qbasic" }) => {
            try {
                // Perform a dry-run porting to identify issues without making changes
                const dryRunResult = await this.portingService.portQBasicToQB64PE(sourceCode, {
                    sourceDialect,
                    addModernFeatures: false,
                    preserveComments: true,
                    convertGraphics: false,
                    optimizePerformance: false
                });
                const analysis = {
                    sourceDialect,
                    codeAnalysis: {
                        totalLines: sourceCode.split('\n').length,
                        hasGraphics: /\b(SCREEN|CIRCLE|LINE|PSET|POINT|PAINT|PUT|GET|PALETTE)\b/i.test(sourceCode),
                        hasSound: /\b(PLAY|BEEP|SOUND)\b/i.test(sourceCode),
                        hasFileIO: /\b(OPEN|CLOSE|PRINT #|INPUT #|LINE INPUT #)\b/i.test(sourceCode),
                        hasDefFn: /\bDEF\s+\w+\s*\(/i.test(sourceCode),
                        hasGosub: /\bGOSUB\b/i.test(sourceCode),
                        hasMultiStatement: /:\s*(IF|FOR|WHILE|DO)\b/i.test(sourceCode),
                        hasDeclareStatements: /\bDECLARE\s+(SUB|FUNCTION)\b/i.test(sourceCode)
                    },
                    compatibility: {
                        level: dryRunResult.compatibility,
                        issuesFound: dryRunResult.warnings.length + dryRunResult.errors.length,
                        transformationsNeeded: dryRunResult.transformations.length,
                        potentialProblems: dryRunResult.warnings,
                        criticalIssues: dryRunResult.errors
                    },
                    recommendations: this.getCompatibilityRecommendations(dryRunResult, sourceDialect),
                    estimatedPortingEffort: this.estimatePortingEffort(dryRunResult, sourceCode)
                };
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(analysis, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error analyzing compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Graphics Screenshot Analysis Tool
        this.server.registerTool("analyze_qb64pe_graphics_screenshot", {
            title: "Analyze QB64PE Graphics Screenshot",
            description: "Analyze QB64PE graphics program screenshots to detect shapes, colors, layout, and visual elements for LLM analysis",
            inputSchema: {
                screenshotPath: zod_1.z.string().describe("Path to the screenshot file to analyze (PNG, JPG, GIF)"),
                analysisType: zod_1.z.enum([
                    "shapes",
                    "colors",
                    "layout",
                    "text",
                    "quality",
                    "comprehensive"
                ]).optional().describe("Type of analysis to perform (default: comprehensive)"),
                expectedElements: zod_1.z.array(zod_1.z.string()).optional().describe("List of expected visual elements to look for"),
                programCode: zod_1.z.string().optional().describe("Original QB64PE code that generated the screenshot for context")
            }
        }, async ({ screenshotPath, analysisType = "comprehensive", expectedElements, programCode }) => {
            try {
                // Import required modules
                const fs = await Promise.resolve().then(() => __importStar(require('fs')));
                const path = await Promise.resolve().then(() => __importStar(require('path')));
                // Validate screenshot file exists
                if (!fs.existsSync(screenshotPath)) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    error: "Screenshot file not found",
                                    path: screenshotPath,
                                    suggestion: "Check file path and ensure QB64PE program has executed and saved screenshots"
                                }, null, 2)
                            }],
                        isError: true
                    };
                }
                // Get file stats and info
                const stats = fs.statSync(screenshotPath);
                const ext = path.extname(screenshotPath).toLowerCase();
                const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif'];
                if (!supportedFormats.includes(ext)) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    error: "Unsupported image format",
                                    format: ext,
                                    supportedFormats,
                                    suggestion: "Use PNG, JPG, or GIF format for screenshots"
                                }, null, 2)
                            }],
                        isError: true
                    };
                }
                // Analyze program code if provided
                let codeAnalysis = null;
                if (programCode) {
                    const executionState = this.executionService.analyzeExecutionMode(programCode);
                    codeAnalysis = {
                        hasGraphics: executionState.hasGraphics,
                        detectedShapes: this.extractShapesFromCode(programCode),
                        detectedColors: this.extractColorsFromCode(programCode),
                        screenSize: this.extractScreenSize(programCode),
                        textElements: this.extractTextElements(programCode)
                    };
                }
                // Generate comprehensive analysis instructions for LLM
                const analysisInstructions = this.generateAnalysisInstructions(analysisType, expectedElements, codeAnalysis);
                // Prepare analysis metadata
                const analysisMetadata = {
                    screenshot: {
                        path: screenshotPath,
                        format: ext,
                        sizeBytes: stats.size,
                        lastModified: stats.mtime.toISOString(),
                        isWebCompatible: ['.png', '.jpg', '.jpeg', '.gif'].includes(ext)
                    },
                    analysis: {
                        type: analysisType,
                        expectedElements: expectedElements || [],
                        codeContext: codeAnalysis
                    },
                    instructions: analysisInstructions,
                    llmGuidance: this.generateLLMGuidance(analysisType, codeAnalysis)
                };
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify(analysisMetadata, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error analyzing screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Generate Screenshot Analysis Template Tool
        this.server.registerTool("generate_qb64pe_screenshot_analysis_template", {
            title: "Generate QB64PE Screenshot Analysis Template",
            description: "Generate a QB64PE program template specifically designed for screenshot analysis testing with known visual elements",
            inputSchema: {
                testType: zod_1.z.enum([
                    "basic_shapes",
                    "color_palette",
                    "text_rendering",
                    "layout_grid",
                    "animation_frames",
                    "complex_scene",
                    "custom"
                ]).describe("Type of visual test to generate"),
                customSpecs: zod_1.z.object({
                    shapes: zod_1.z.array(zod_1.z.string()).optional(),
                    colors: zod_1.z.array(zod_1.z.string()).optional(),
                    textElements: zod_1.z.array(zod_1.z.string()).optional(),
                    screenSize: zod_1.z.string().optional()
                }).optional().describe("Custom specifications for the test (only used with 'custom' testType)")
            }
        }, async ({ testType, customSpecs }) => {
            try {
                let templateCode = '';
                let analysisSpecs = {};
                switch (testType) {
                    case 'basic_shapes':
                        templateCode = this.generateBasicShapesTemplate();
                        analysisSpecs = {
                            expectedShapes: ['circle', 'rectangle', 'line', 'triangle'],
                            expectedColors: ['red', 'blue', 'green', 'yellow'],
                            textElements: ['BASIC SHAPES TEST', 'Circle', 'Rectangle', 'Line', 'Triangle'],
                            screenSize: '800x600'
                        };
                        break;
                    case 'color_palette':
                        templateCode = this.generateColorPaletteTemplate();
                        analysisSpecs = {
                            expectedShapes: ['rectangle'],
                            expectedColors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
                            textElements: ['COLOR PALETTE TEST', 'RGB Test'],
                            screenSize: '1024x768'
                        };
                        break;
                    case 'text_rendering':
                        templateCode = this.generateTextRenderingTemplate();
                        analysisSpecs = {
                            expectedShapes: [],
                            expectedColors: ['white', 'red', 'green', 'blue'],
                            textElements: ['TEXT RENDERING TEST', 'Different Sizes', 'Different Colors', 'Different Positions'],
                            screenSize: '800x600'
                        };
                        break;
                    case 'layout_grid':
                        templateCode = this.generateLayoutGridTemplate();
                        analysisSpecs = {
                            expectedShapes: ['circle', 'rectangle', 'line'],
                            expectedColors: ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
                            textElements: ['LAYOUT GRID TEST', 'Grid System'],
                            screenSize: '1024x768'
                        };
                        break;
                    case 'custom':
                        templateCode = this.generateCustomTemplate(customSpecs || {});
                        analysisSpecs = customSpecs || {};
                        break;
                    default:
                        templateCode = this.generateBasicShapesTemplate();
                        analysisSpecs = {
                            expectedShapes: ['circle', 'rectangle'],
                            expectedColors: ['red', 'blue'],
                            textElements: ['DEFAULT TEST'],
                            screenSize: '800x600'
                        };
                }
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                testType,
                                templateCode,
                                analysisSpecs,
                                usage: {
                                    compilation: "qb64pe -c template.bas",
                                    execution: "template.exe",
                                    expectedOutput: "Screenshots will be saved to qb64pe-screenshots/",
                                    analysisCommand: "Use analyze_qb64pe_graphics_screenshot with generated images"
                                },
                                files: {
                                    saveAs: `${testType.replace('_', '-')}-template.bas`,
                                    screenshotDir: "qb64pe-screenshots/",
                                    expectedScreenshots: [`${testType.replace('_', '-')}-test.png`]
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating screenshot analysis template: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Screenshot Automation Tools
        this.server.registerTool("capture_qb64pe_screenshot", {
            title: "Capture QB64PE Window Screenshot",
            description: "Automatically capture screenshot of QB64PE program window",
            inputSchema: {
                outputPath: zod_1.z.string().optional().describe("Path to save screenshot (auto-generated if not provided)"),
                windowTitle: zod_1.z.string().optional().describe("Specific window title to capture"),
                processName: zod_1.z.string().optional().describe("Process name to capture (default: qb64pe)"),
                format: zod_1.z.enum(["png", "jpg", "gif"]).optional().describe("Image format (default: png)")
            }
        }, async ({ outputPath, windowTitle, processName, format = "png" }) => {
            try {
                const result = await this.screenshotService.captureQB64PEWindow({
                    outputPath,
                    windowTitle,
                    processName,
                    format
                });
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                capture: result,
                                nextSteps: result.success ? [
                                    `Screenshot saved to: ${result.filePath}`,
                                    "Use analyze_qb64pe_graphics_screenshot to analyze the image",
                                    "Consider starting screenshot monitoring for continuous capture"
                                ] : [
                                    "Check if QB64PE program is running",
                                    "Verify window title or process name",
                                    "Try using get_qb64pe_processes to list available windows"
                                ]
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error capturing screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_qb64pe_processes", {
            title: "Get Running QB64PE Processes",
            description: "List all currently running QB64PE processes and windows",
            inputSchema: {}
        }, async () => {
            try {
                const processes = await this.screenshotService.getQB64PEProcesses();
                const monitoringStatus = this.screenshotService.getMonitoringStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                processes,
                                monitoring: monitoringStatus,
                                summary: {
                                    totalProcesses: processes.length,
                                    processNames: [...new Set(processes.map(p => p.name))],
                                    windowTitles: processes.map(p => p.windowTitle).filter(Boolean)
                                },
                                suggestions: processes.length === 0 ? [
                                    "No QB64PE processes found",
                                    "Compile and run a QB64PE program first",
                                    "Check if QB64PE programs are running in the background"
                                ] : [
                                    "Use capture_qb64pe_screenshot to capture specific windows",
                                    "Consider starting monitoring with start_screenshot_monitoring",
                                    "Window titles can be used for targeted capture"
                                ]
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting QB64PE processes: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("start_screenshot_monitoring", {
            title: "Start Automatic Screenshot Monitoring",
            description: "Start monitoring QB64PE processes and automatically capture screenshots at intervals",
            inputSchema: {
                checkIntervalMs: zod_1.z.number().optional().describe("How often to check for processes (default: 5000ms)"),
                captureIntervalMs: zod_1.z.number().optional().describe("How often to capture screenshots (default: 10000ms)")
            }
        }, async ({ checkIntervalMs = 5000, captureIntervalMs = 10000 }) => {
            try {
                await this.screenshotService.startMonitoring(checkIntervalMs, captureIntervalMs);
                const status = this.screenshotService.getMonitoringStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                monitoring: status,
                                configuration: {
                                    checkInterval: checkIntervalMs,
                                    captureInterval: captureIntervalMs,
                                    screenshotDirectory: status.screenshotDir
                                },
                                instructions: [
                                    "Monitoring started - will capture screenshots automatically",
                                    "Run QB64PE programs to trigger screenshot capture",
                                    "Use stop_screenshot_monitoring to stop when done",
                                    "Use start_screenshot_watching to enable automatic analysis"
                                ]
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error starting monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("stop_screenshot_monitoring", {
            title: "Stop Screenshot Monitoring",
            description: "Stop automatic screenshot monitoring of QB64PE processes",
            inputSchema: {}
        }, async () => {
            try {
                this.screenshotService.stopMonitoring();
                const status = this.screenshotService.getMonitoringStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                monitoring: status,
                                message: "Screenshot monitoring stopped",
                                captured: this.screenshotService.getScreenshotFiles().length + " screenshots available"
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error stopping monitoring: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("start_screenshot_watching", {
            title: "Start Screenshot Directory Watching",
            description: "Start watching screenshot directories for new files and automatically trigger analysis",
            inputSchema: {
                directory: zod_1.z.string().optional().describe("Directory to watch (default: qb64pe-screenshots)"),
                analysisType: zod_1.z.enum(["shapes", "colors", "layout", "text", "quality", "comprehensive"]).optional().describe("Type of analysis to perform (default: comprehensive)"),
                autoAnalyze: zod_1.z.boolean().optional().describe("Automatically analyze new screenshots (default: true)")
            }
        }, async ({ directory = "qb64pe-screenshots", analysisType = "comprehensive", autoAnalyze = true }) => {
            try {
                await this.screenshotWatcher.startWatching(directory, {
                    analysisType,
                    autoAnalyze
                });
                const status = this.screenshotWatcher.getStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                watching: status,
                                configuration: {
                                    directory,
                                    analysisType,
                                    autoAnalyze
                                },
                                instructions: [
                                    "Now watching for new screenshots",
                                    "New screenshots will be automatically detected",
                                    autoAnalyze ? "Analysis will be triggered automatically" : "Use queue_screenshot_analysis to analyze manually",
                                    "Use get_screenshot_analysis_history to see results"
                                ]
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error starting screenshot watching: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("stop_screenshot_watching", {
            title: "Stop Screenshot Watching",
            description: "Stop watching screenshot directories",
            inputSchema: {
                directory: zod_1.z.string().optional().describe("Specific directory to stop watching (empty = stop all)")
            }
        }, async ({ directory }) => {
            try {
                await this.screenshotWatcher.stopWatching(directory);
                const status = this.screenshotWatcher.getStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                watching: status,
                                message: directory ? `Stopped watching ${directory}` : "Stopped watching all directories"
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error stopping watching: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_screenshot_analysis_history", {
            title: "Get Screenshot Analysis History",
            description: "Get history of automatic screenshot analyses performed",
            inputSchema: {
                limit: zod_1.z.number().optional().describe("Maximum number of results to return (default: 10)")
            }
        }, async ({ limit = 10 }) => {
            try {
                const history = this.screenshotWatcher.getAnalysisHistory(limit);
                const recentScreenshots = this.screenshotWatcher.getRecentScreenshots(5);
                const status = this.screenshotWatcher.getStatus();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                history,
                                recentScreenshots,
                                status,
                                summary: {
                                    totalAnalyses: history.length,
                                    successful: history.filter(h => h.success).length,
                                    failed: history.filter(h => !h.success).length,
                                    lastAnalysis: history[0]?.timestamp || null
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting analysis history: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_automation_status", {
            title: "Get Screenshot Automation Status",
            description: "Get comprehensive status of all screenshot automation services",
            inputSchema: {}
        }, async () => {
            try {
                const screenshotStatus = this.screenshotService.getMonitoringStatus();
                const watcherStatus = this.screenshotWatcher.getStatus();
                const recentFiles = this.screenshotService.getScreenshotFiles().slice(0, 5);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                screenshot: {
                                    monitoring: screenshotStatus,
                                    recentFiles: recentFiles.length,
                                    latestFile: recentFiles[0] || null
                                },
                                watcher: watcherStatus,
                                overall: {
                                    fullyAutomated: screenshotStatus.isMonitoring && watcherStatus.isWatching,
                                    capturingScreenshots: screenshotStatus.isMonitoring,
                                    analyzingScreenshots: watcherStatus.isWatching,
                                    totalScreenshots: recentFiles.length
                                },
                                recommendations: this.getAutomationRecommendations(screenshotStatus, watcherStatus)
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting automation status: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Enhanced Debugging Tools
        this.server.registerTool("enhance_qb64pe_code_for_debugging", {
            title: "Enhance QB64PE Code for Debugging",
            description: "Apply comprehensive debugging enhancements to QB64PE source code to address console visibility, flow control, resource management, and graphics context issues",
            inputSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to enhance"),
                config: zod_1.z.object({
                    enableConsole: zod_1.z.boolean().optional().describe("Enable console management (default: true)"),
                    enableLogging: zod_1.z.boolean().optional().describe("Enable logging system (default: true)"),
                    enableScreenshots: zod_1.z.boolean().optional().describe("Enable screenshot system (default: true)"),
                    enableFlowControl: zod_1.z.boolean().optional().describe("Enable flow control for automation (default: true)"),
                    enableResourceTracking: zod_1.z.boolean().optional().describe("Enable resource management (default: true)"),
                    timeoutSeconds: zod_1.z.number().optional().describe("Timeout for automated operations (default: 30)"),
                    autoExit: zod_1.z.boolean().optional().describe("Enable automatic exit behavior (default: true)"),
                    verboseOutput: zod_1.z.boolean().optional().describe("Enable verbose debug output (default: true)")
                }).optional().describe("Debugging configuration options")
            }
        }, async ({ sourceCode, config = {} }) => {
            try {
                const result = this.debuggingService.enhanceCodeForDebugging(sourceCode, config);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                enhancedCode: result.enhancedCode,
                                debugFeatures: result.debugFeatures,
                                modifications: result.modifications,
                                issuesDetected: result.issues.length,
                                solutionsApplied: result.solutions.length,
                                summary: {
                                    originalLines: sourceCode.split('\n').length,
                                    enhancedLines: result.enhancedCode.split('\n').length,
                                    linesAdded: result.enhancedCode.split('\n').length - sourceCode.split('\n').length,
                                    debugFeaturesEnabled: result.debugFeatures.join(', '),
                                    keyModifications: result.modifications.slice(0, 3).join('; ')
                                },
                                usage: {
                                    saveAs: "enhanced_program.bas",
                                    compile: "qb64pe -c enhanced_program.bas",
                                    expectedOutputs: [
                                        "Console output with debugging information",
                                        "Log files in qb64pe-logs/",
                                        "Screenshots in qb64pe-screenshots/ (if graphics program)",
                                        "Resource tracking and cleanup messages"
                                    ]
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error enhancing code for debugging: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_qb64pe_debugging_best_practices", {
            title: "Get QB64PE Debugging Best Practices",
            description: "Get comprehensive debugging best practices and guidelines specifically for QB64PE development",
            inputSchema: {}
        }, async () => {
            try {
                const bestPractices = this.debuggingService.getDebuggingBestPractices();
                return {
                    content: [{
                            type: "text",
                            text: bestPractices
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting debugging best practices: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_llm_debugging_guide", {
            title: "Get LLM QB64PE Debugging Guide",
            description: "Get comprehensive debugging guide specifically designed for LLMs and automated systems working with QB64PE",
            inputSchema: {}
        }, async () => {
            try {
                const guide = this.debuggingService.getLLMDebuggingGuide();
                return {
                    content: [{
                            type: "text",
                            text: guide
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting LLM debugging guide: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Native QB64PE Logging Tools
        this.server.registerTool("inject_native_qb64pe_logging", {
            title: "Inject Native QB64PE Logging",
            description: "Inject native QB64PE logging functions (_LOGINFO, _LOGERROR, etc.) and ECHO functions into source code with proper $CONSOLE:ONLY directive for shell redirection. CRITICAL: In graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.), you MUST use the ECHO functions instead of PRINT/_PRINTSTRING for console output.",
            inputSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to enhance with logging"),
                config: zod_1.z.object({
                    enableNativeLogging: zod_1.z.boolean().optional().describe("Enable native logging functions (default: true)"),
                    enableStructuredOutput: zod_1.z.boolean().optional().describe("Enable structured output sections (default: true)"),
                    enableEchoOutput: zod_1.z.boolean().optional().describe("Enable ECHO functions for simplified console output (default: true)"),
                    consoleDirective: zod_1.z.enum(['$CONSOLE', '$CONSOLE:ONLY']).optional().describe("Console directive to use (default: $CONSOLE:ONLY)"),
                    logLevel: zod_1.z.enum(['TRACE', 'INFO', 'WARN', 'ERROR']).optional().describe("Logging level (default: INFO)"),
                    autoExitTimeout: zod_1.z.number().optional().describe("Auto-exit timeout in seconds (default: 10)"),
                    outputSections: zod_1.z.array(zod_1.z.string()).optional().describe("Custom output sections for structured debugging")
                }).optional().describe("Logging configuration options")
            }
        }, async ({ sourceCode, config = {} }) => {
            try {
                const enhanced = this.loggingService.injectNativeLogging(sourceCode, config);
                return {
                    content: [{
                            type: "text",
                            text: `# Enhanced QB64PE Code with Native Logging & ECHO Functions

## Key Improvements
- ✅ **$CONSOLE:ONLY directive** for proper shell redirection
- ✅ **Native QB64PE logging functions** (_LOGINFO, _LOGERROR, etc.)
- ✅ **ECHO functions** for simplified console output (no _DEST management)
- ✅ **Structured output sections** for systematic debugging
- ✅ **Auto-exit mechanism** for automation compatibility

## Enhanced Code

\`\`\`basic
${enhanced}
\`\`\`

## ECHO Functions Usage (MANDATORY for Graphics Modes)

⚠️  **CRITICAL RULE**: In ANY graphics screen mode (SCREEN 1,2,7,8,9,10,11,12,13, etc.), you MUST use ECHO functions instead of PRINT or _PRINTSTRING for console output. Only use PRINT/_PRINTSTRING if user specifically requests it.

### Simple Console Output (LLM-Friendly)
\`\`\`basic
SCREEN 13  ' Graphics mode - MUST use ECHO
CALL ECHO("Initializing graphics mode...")
CALL ECHO_INFO("Graphics setup complete")
CALL ECHO_ERROR("Texture loading failed")
CALL ECHO_WARN("Low video memory")
CALL ECHO_DEBUG("Sprite count: " + STR$(spriteCount))
\`\`\`

### Text Mode Output
\`\`\`basic
SCREEN 0   ' Text mode - ECHO still recommended
CALL ECHO("Processing data...")
CALL ECHO_INFO("Analysis started")
\`\`\`

## Usage Instructions

### Compilation and Execution
\`\`\`bash
# Compile the enhanced program
qb64pe -c enhanced_program.bas

# Run with output capture (works with $CONSOLE:ONLY)
enhanced_program.exe > analysis_output.txt 2>&1

# Monitor output in real-time
powershell -Command "Get-Content -Path 'analysis_output.txt' -Wait -Tail 10"
\`\`\`

### Expected Output Format
\`\`\`
=== PROGRAM ANALYSIS ===
INFO: Starting analysis...
=== STEP 1: HEADER VALIDATION ===
INFO: Header validation completed
=== RESULTS SUMMARY ===
SUCCESS: All steps completed
Auto-exiting in 10 seconds...
\`\`\`

## Key Features Added
- **Native Logging**: Uses QB64PE's built-in _LOGINFO, _LOGERROR functions
- **Shell Redirection**: $CONSOLE:ONLY enables proper output capture
- **Structured Sections**: Organized output for easy parsing
- **Automation Ready**: Auto-exits to prevent hanging in automated workflows`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error injecting native logging: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("generate_advanced_debugging_template", {
            title: "Generate Advanced QB64PE Debugging Template",
            description: "Generate a comprehensive debugging template with native logging, ECHO functions, structured output, and automated execution monitoring. CRITICAL: Template uses ECHO functions which are MANDATORY for graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.) instead of PRINT/_PRINTSTRING.",
            inputSchema: {
                programName: zod_1.z.string().describe("Name of the program being debugged"),
                analysisSteps: zod_1.z.array(zod_1.z.string()).describe("List of analysis steps to include in the template"),
                config: zod_1.z.object({
                    enableNativeLogging: zod_1.z.boolean().optional().describe("Enable native logging functions (default: true)"),
                    enableStructuredOutput: zod_1.z.boolean().optional().describe("Enable structured output sections (default: true)"),
                    enableEchoOutput: zod_1.z.boolean().optional().describe("Enable ECHO functions for simplified console output (default: true)"),
                    consoleDirective: zod_1.z.enum(['$CONSOLE', '$CONSOLE:ONLY']).optional().describe("Console directive (default: $CONSOLE:ONLY)"),
                    logLevel: zod_1.z.enum(['TRACE', 'INFO', 'WARN', 'ERROR']).optional().describe("Logging level (default: INFO)"),
                    autoExitTimeout: zod_1.z.number().optional().describe("Auto-exit timeout (default: 10)")
                }).optional().describe("Template configuration options")
            }
        }, async ({ programName, analysisSteps, config = {} }) => {
            try {
                const template = this.loggingService.generateAdvancedDebuggingTemplate(programName, analysisSteps, config);
                const outputPath = `${programName.toLowerCase().replace(/\s+/g, '_')}_debug_template.bas`;
                const captureCommand = this.loggingService.generateOutputCaptureCommand(`${programName.toLowerCase().replace(/\s+/g, '_')}_debug_template.exe`);
                return {
                    content: [{
                            type: "text",
                            text: `# Advanced QB64PE Debugging Template

## Generated Template for: ${programName}

### Analysis Steps Included:
${analysisSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Template Code

**File**: \`${outputPath}\`

\`\`\`basic
${template}
\`\`\`

## Usage Workflow

### 1. Save and Compile
\`\`\`bash
# Save the template
echo '${template.replace(/'/g, "''").replace(/\$/g, '$$')}' > "${outputPath}"

# Compile with QB64PE
qb64pe -c "${outputPath}"
\`\`\`

### 2. Execute with Output Capture
\`\`\`bash
# Run with automated output capture
${captureCommand}

# Monitor real-time output
${this.loggingService.generateFileMonitoringCommands('analysis_output.txt').windows}
\`\`\`

### 3. Parse Structured Output
The template generates structured output that can be automatically parsed:

\`\`\`
=== PROGRAM INITIALIZATION ===
Program: ${programName}
Start Time: [timestamp]
Debug Mode: 1

=== STEP 1: [FIRST_STEP] ===
INFO: Starting step 1: [first step]
Processing [first step]...

=== EXECUTION SUMMARY ===
SUCCESS: All X steps completed
Execution Time: X.XX seconds
Auto-exiting in 10 seconds...
\`\`\`

## Template Features

✅ **$CONSOLE:ONLY** - Enables shell output redirection  
✅ **Native QB64PE Logging** - Uses _LOGINFO, _LOGERROR, etc.  
✅ **Structured Sections** - Organized output for parsing  
✅ **Error Handling** - Comprehensive error detection and logging  
✅ **Auto-Exit** - Prevents hanging in automated workflows  
✅ **Execution Timing** - Tracks performance metrics  
✅ **Resource Cleanup** - Proper program termination

This template is specifically designed for LLM-automated debugging workflows and systematic analysis.`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating debugging template: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("parse_qb64pe_structured_output", {
            title: "Parse QB64PE Structured Output",
            description: "Parse structured output from QB64PE programs enhanced with native logging and organized sections",
            inputSchema: {
                output: zod_1.z.string().describe("Raw output from QB64PE program execution")
            }
        }, async ({ output }) => {
            try {
                const parsed = this.loggingService.parseStructuredOutput(output);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                analysis: "QB64PE Structured Output Analysis",
                                summary: {
                                    executionStatus: parsed.summary.success ? "SUCCESS" : "FAILED",
                                    totalSteps: parsed.summary.totalSteps,
                                    failedSteps: parsed.summary.failedSteps,
                                    completionRate: parsed.summary.totalSteps > 0
                                        ? `${Math.round(((parsed.summary.totalSteps - parsed.summary.failedSteps) / parsed.summary.totalSteps) * 100)}%`
                                        : "N/A"
                                },
                                sections: parsed.sections,
                                logs: parsed.logs,
                                recommendations: parsed.summary.success
                                    ? ["Program executed successfully", "All steps completed without errors"]
                                    : [
                                        "Program execution encountered errors",
                                        `${parsed.summary.failedSteps} step(s) failed`,
                                        "Review error logs for specific issues",
                                        "Consider using enhanced error handling"
                                    ]
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error parsing structured output: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("generate_output_capture_commands", {
            title: "Generate Output Capture Commands",
            description: "Generate cross-platform commands for capturing and monitoring QB64PE program output",
            inputSchema: {
                programPath: zod_1.z.string().describe("Path to the QB64PE executable"),
                outputPath: zod_1.z.string().optional().describe("Path for output file (default: analysis_output.txt)"),
                includeMonitoring: zod_1.z.boolean().optional().describe("Include real-time monitoring commands (default: true)")
            }
        }, async ({ programPath, outputPath = 'analysis_output.txt', includeMonitoring = true }) => {
            try {
                const captureCommand = this.loggingService.generateOutputCaptureCommand(programPath, outputPath);
                const monitoringCommands = includeMonitoring
                    ? this.loggingService.generateFileMonitoringCommands(outputPath)
                    : {};
                return {
                    content: [{
                            type: "text",
                            text: `# QB64PE Output Capture Commands

## Primary Capture Command
\`\`\`bash
${captureCommand}
\`\`\`

## Real-time Monitoring Commands

### Windows (PowerShell)
\`\`\`powershell
${monitoringCommands.windows || 'N/A'}
\`\`\`

### Windows (Batch - Continuous)
\`\`\`batch
${monitoringCommands.batch || 'N/A'}
\`\`\`

### Linux/macOS
\`\`\`bash
${monitoringCommands.linux || 'N/A'}
\`\`\`

## Complete Workflow Example

### 1. Compile Program
\`\`\`bash
qb64pe -c your_program.bas
\`\`\`

### 2. Execute with Capture
\`\`\`bash
${captureCommand}
\`\`\`

### 3. Analyze Results
\`\`\`bash
# View captured output
cat "${outputPath}"

# Parse with MCP server
# (Use parse_qb64pe_structured_output tool)
\`\`\`

## Key Benefits

✅ **Shell Redirection Compatible** - Works with $CONSOLE:ONLY directive  
✅ **Cross-Platform Support** - Commands for Windows, Linux, macOS  
✅ **Real-time Monitoring** - Track execution progress  
✅ **Automated Workflow** - Perfect for LLM-driven debugging  
✅ **Error Capture** - Captures both stdout and stderr (2>&1)

## Note for LLMs

These commands are specifically designed for automated QB64PE debugging workflows. The $CONSOLE:ONLY directive in your QB64PE programs ensures proper output redirection compatibility.`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating output capture commands: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Graphics Guide Tool
        this.server.registerTool("get_qb64pe_graphics_guide", {
            title: "Get QB64PE Graphics Statements Guide for LLMs",
            description: "Get comprehensive graphics statements guide specifically designed for LLMs, including _PUTIMAGE usage patterns, image management, and common pitfalls to avoid",
            inputSchema: {
                section: zod_1.z.enum([
                    "all",
                    "putimage",
                    "image_management",
                    "drawing_commands",
                    "screen_management",
                    "troubleshooting",
                    "examples"
                ]).optional().describe("Specific section to retrieve (default: all)")
            }
        }, async ({ section = "all" }) => {
            try {
                const fs = await Promise.resolve().then(() => __importStar(require('fs')));
                const path = await Promise.resolve().then(() => __importStar(require('path')));
                const guidePath = path.join(process.cwd(), 'docs', 'QB64PE_GRAPHICS_STATEMENTS_GUIDE.md');
                if (!fs.existsSync(guidePath)) {
                    return {
                        content: [{
                                type: "text",
                                text: `Graphics guide not found at ${guidePath}. Please ensure the guide exists.`
                            }],
                        isError: true
                    };
                }
                const fullGuide = fs.readFileSync(guidePath, 'utf-8');
                let responseContent = fullGuide;
                if (section !== "all") {
                    // Extract specific section
                    const sections = {
                        putimage: /## 1\. _PUTIMAGE.*?(?=## 2\.)/s,
                        image_management: /## 2\. Essential Graphics Image Management.*?(?=## 3\.)/s,
                        drawing_commands: /## 4\. Basic Drawing Commands.*?(?=## 5\.)/s,
                        screen_management: /## 3\. Screen and Display Management.*?(?=## 4\.)/s,
                        troubleshooting: /## 9\. Troubleshooting Guide for LLMs.*?(?=---)/s,
                        examples: /## 8\. Example Code Patterns for LLMs.*?(?=## 9\.)/s
                    };
                    const sectionRegex = sections[section];
                    if (sectionRegex) {
                        const match = fullGuide.match(sectionRegex);
                        responseContent = match ? match[0] : `Section "${section}" not found in guide.`;
                    }
                }
                return {
                    content: [{
                            type: "text",
                            text: `# QB64PE Graphics Guide${section !== "all" ? ` - ${section.toUpperCase()} Section` : ""}

${responseContent}

---

💡 **LLM Usage Tips:**
- Always use \`_PUTIMAGE (x, y), imageHandle\` for original size placement
- Avoid \`_PUTIMAGE (x1,y1)-(x2,y2), imageHandle\` unless you want stretching
- Remember to \_FREEIMAGE all loaded images
- Use structured error checking for image operations
- Test with small images first to verify behavior`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error reading graphics guide: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // ECHO Helper Functions Tool
        this.server.registerTool("generate_qb64pe_echo_functions", {
            title: "Generate QB64PE ECHO Functions",
            description: "Generate ECHO helper functions for simplified console output without _DEST management. MANDATORY for graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.) - do NOT use PRINT/_PRINTSTRING in graphics modes unless specifically requested by user. These are QB64PE subroutines, NOT shell echo commands.",
            inputSchema: {
                config: zod_1.z.object({
                    enableNativeLogging: zod_1.z.boolean().optional().describe("Enable native logging integration (default: true)"),
                    enableStructuredOutput: zod_1.z.boolean().optional().describe("Enable structured output sections (default: true)"),
                    consoleDirective: zod_1.z.enum(['$CONSOLE', '$CONSOLE:ONLY']).optional().describe("Console directive to use (default: $CONSOLE:ONLY)"),
                    logLevel: zod_1.z.enum(['TRACE', 'INFO', 'WARN', 'ERROR']).optional().describe("Logging level (default: INFO)")
                }).optional().describe("ECHO configuration options")
            }
        }, async ({ config = {} }) => {
            try {
                const echoFunctions = this.loggingService.generateEchoFunctions(config);
                return {
                    content: [{
                            type: "text",
                            text: `# QB64PE ECHO Helper Functions

## Overview
These ECHO functions provide simplified console output for LLMs without requiring _DEST management.

⚠️  **CRITICAL FOR GRAPHICS MODES**: In ANY graphics screen mode (SCREEN 1,2,7,8,9,10,11,12,13, etc.), you MUST use ECHO functions instead of PRINT or _PRINTSTRING for console output that needs to be captured by stdio redirection. Only use PRINT/_PRINTSTRING if the user specifically requests it.

📝 **Important**: These are QB64PE ECHO subroutines, NOT shell echo commands. They work within your QB64PE program and are captured by stdio redirection.

## Generated Functions
\`\`\`basic
${echoFunctions}
\`\`\`

## Usage Examples

### Graphics Mode Console Output (MANDATORY)
\`\`\`basic
SCREEN 13  ' VGA 256-color graphics mode
CALL ECHO("Initializing graphics...")
CALL ECHO_INFO("Graphics mode set to 320x200x256")
' Your graphics code here
CALL ECHO("Rendering complete")
\`\`\`

### Basic Console Output
\`\`\`basic
CALL ECHO("Hello, World!")
CALL ECHO("Processing step 1...")
\`\`\`

### Categorized Output
\`\`\`basic
CALL ECHO_INFO("Starting data processing")
CALL ECHO_ERROR("File not found: " + filename$)
CALL ECHO_WARN("Memory usage is high")
CALL ECHO_DEBUG("Variable value: " + STR$(myVar))
\`\`\`

## Key Benefits for LLMs

✅ **Graphics Mode Compatible** - Works in all screen modes  
✅ **No _DEST Management** - Automatically handles console destination  
✅ **Simplified API** - Just CALL ECHO(message) for output  
✅ **Categorized Output** - INFO, ERROR, WARN, DEBUG variants  
✅ **Native Logging Integration** - Works with QB64PE's built-in logging  
✅ **Automation Friendly** - Perfect for generated code  
✅ **Stdio Redirection** - Captured by shell output redirection  

## Technical Details

The ECHO functions automatically:
1. Store current _DEST value
2. Switch to _CONSOLE for output
3. Print the message
4. Restore original _DEST

This eliminates the complexity of console management in LLM-generated QB64PE code, especially in graphics modes.

## Integration with Enhanced Code

When using with \`inject_native_qb64pe_logging\`, these functions are automatically included and integrated with the native logging system.`
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating ECHO functions: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        // Programming Feedback Tools
        this.server.registerTool("generate_programming_feedback", {
            title: "Generate Programming Feedback",
            description: "Generate detailed programming feedback and suggestions from screenshot analysis",
            inputSchema: {
                screenshotPath: zod_1.z.string().describe("Path to the screenshot to analyze"),
                programCode: zod_1.z.string().optional().describe("Associated QB64PE program code for context")
            }
        }, async ({ screenshotPath, programCode }) => {
            try {
                // First analyze the screenshot
                const fs = await Promise.resolve().then(() => __importStar(require('fs')));
                if (!fs.existsSync(screenshotPath)) {
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    error: "Screenshot file not found",
                                    path: screenshotPath
                                }, null, 2)
                            }],
                        isError: true
                    };
                }
                // Create a mock analysis result for now (in production, this would call the actual analysis)
                const mockAnalysisResult = {
                    screenshotPath,
                    analysisType: 'comprehensive',
                    timestamp: new Date(),
                    success: true,
                    analysis: {
                        shapes: ['circle', 'rectangle'],
                        colors: ['red', 'blue'],
                        textElements: ['Test Program'],
                        layout: 'Well-organized layout with centered elements',
                        quality: 'Good quality screenshot with clear graphics',
                        overallDescription: 'Screenshot shows a simple graphics program with basic shapes'
                    }
                };
                const feedback = this.feedbackService.generateFeedback(mockAnalysisResult, programCode);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                feedback,
                                summary: {
                                    quality: feedback.overallAssessment.quality,
                                    totalSuggestions: feedback.suggestions.length,
                                    priorityBreakdown: {
                                        critical: feedback.suggestions.filter(s => s.priority === 'critical').length,
                                        high: feedback.suggestions.filter(s => s.priority === 'high').length,
                                        medium: feedback.suggestions.filter(s => s.priority === 'medium').length,
                                        low: feedback.suggestions.filter(s => s.priority === 'low').length
                                    },
                                    topSuggestion: feedback.suggestions[0]?.title || 'No suggestions'
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error generating feedback: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_programming_feedback_history", {
            title: "Get Programming Feedback History",
            description: "Get history of programming feedback generated from screenshot analyses",
            inputSchema: {
                limit: zod_1.z.number().optional().describe("Maximum number of feedback entries to return (default: 10)")
            }
        }, async ({ limit = 10 }) => {
            try {
                const history = this.feedbackService.getFeedbackHistory(limit);
                const statistics = this.feedbackService.getStatistics();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                history,
                                statistics,
                                insights: {
                                    totalFeedback: statistics.total,
                                    successRate: statistics.successRate + '%',
                                    mostCommonQuality: Object.entries(statistics.qualityDistribution || {})
                                        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'none',
                                    averageCompleteness: statistics.averageCompleteness + '%',
                                    averageAccuracy: statistics.averageAccuracy + '%'
                                }
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting feedback history: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
        this.server.registerTool("get_feedback_statistics", {
            title: "Get Programming Feedback Statistics",
            description: "Get detailed statistics about programming feedback and improvement trends",
            inputSchema: {}
        }, async () => {
            try {
                const statistics = this.feedbackService.getStatistics();
                const recentFeedback = this.feedbackService.getFeedbackHistory(5);
                // Calculate trends
                const trends = this.calculateFeedbackTrends(recentFeedback);
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                statistics,
                                trends,
                                recommendations: this.generateStatisticsRecommendations(statistics, trends)
                            }, null, 2)
                        }]
                };
            }
            catch (error) {
                return {
                    content: [{
                            type: "text",
                            text: `Error getting feedback statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }],
                    isError: true
                };
            }
        });
    }
    /**
     * Handle screenshot analysis completion and generate feedback
     */
    handleAnalysisComplete(analysisResult) {
        try {
            // Try to find associated program code
            const programCode = analysisResult.metadata?.programCode;
            // Generate programming feedback
            const feedback = this.feedbackService.generateFeedback(analysisResult, programCode);
            console.error(`Generated feedback for ${analysisResult.screenshotPath}:`);
            console.error(`- Quality: ${feedback.overallAssessment.quality}`);
            console.error(`- Suggestions: ${feedback.suggestions.length}`);
            console.error(`- Next steps: ${feedback.nextSteps.join(', ')}`);
            // Emit feedback event (could be used by dashboard or notifications)
            this.screenshotWatcher.emit('feedback-generated', feedback);
        }
        catch (error) {
            console.error('Error generating feedback:', error);
        }
    }
    /**
     * Calculate feedback trends
     */
    calculateFeedbackTrends(recentFeedback) {
        if (recentFeedback.length < 2) {
            return { insufficient_data: true };
        }
        const qualityTrend = this.calculateQualityTrend(recentFeedback);
        const completenesseTrend = this.calculateCompletenessTrend(recentFeedback);
        const suggestionsTrend = this.calculateSuggestionsTrend(recentFeedback);
        return {
            quality: qualityTrend,
            completeness: completenesseTrend,
            suggestions: suggestionsTrend,
            overall: this.determineOverallTrend(qualityTrend, completenesseTrend, suggestionsTrend)
        };
    }
    calculateQualityTrend(feedback) {
        const qualityValues = { poor: 1, fair: 2, good: 3, excellent: 4 };
        const recent = feedback.slice(0, 3).map(f => qualityValues[f.overallAssessment.quality] || 2);
        const older = feedback.slice(3, 6).map(f => qualityValues[f.overallAssessment.quality] || 2);
        if (older.length === 0)
            return 'stable';
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        if (recentAvg > olderAvg + 0.5)
            return 'improving';
        if (recentAvg < olderAvg - 0.5)
            return 'declining';
        return 'stable';
    }
    calculateCompletenessTrend(feedback) {
        const recent = feedback.slice(0, 3).map(f => f.overallAssessment.completeness);
        const older = feedback.slice(3, 6).map(f => f.overallAssessment.completeness);
        if (older.length === 0)
            return 'stable';
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        if (recentAvg > olderAvg + 10)
            return 'improving';
        if (recentAvg < olderAvg - 10)
            return 'declining';
        return 'stable';
    }
    calculateSuggestionsTrend(feedback) {
        const recent = feedback.slice(0, 3).map(f => f.suggestions.length);
        const older = feedback.slice(3, 6).map(f => f.suggestions.length);
        if (older.length === 0)
            return 'stable';
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        // Fewer suggestions is generally better (fewer issues to fix)
        if (recentAvg < olderAvg - 1)
            return 'improving';
        if (recentAvg > olderAvg + 1)
            return 'declining';
        return 'stable';
    }
    determineOverallTrend(quality, completeness, suggestions) {
        const trends = [quality, completeness, suggestions];
        const improving = trends.filter(t => t === 'improving').length;
        const declining = trends.filter(t => t === 'declining').length;
        if (improving > declining)
            return 'improving';
        if (declining > improving)
            return 'declining';
        return 'stable';
    }
    /**
     * Generate statistics recommendations
     */
    generateStatisticsRecommendations(statistics, trends) {
        const recommendations = [];
        if (statistics.total === 0) {
            recommendations.push('Start using screenshot analysis to get feedback');
            return recommendations;
        }
        if (statistics.successRate < 70) {
            recommendations.push('Improve screenshot capture success rate');
        }
        if (statistics.averageCompleteness < 60) {
            recommendations.push('Add more visual elements to your graphics programs');
        }
        if (statistics.averageAccuracy < 70) {
            recommendations.push('Ensure screenshots match expected program output');
        }
        if (trends.overall === 'declining') {
            recommendations.push('Focus on addressing high-priority suggestions');
        }
        else if (trends.overall === 'improving') {
            recommendations.push('Great progress! Continue current development approach');
        }
        if (Object.values(statistics.qualityDistribution || {}).some((count) => count > statistics.total * 0.5)) {
            const dominantQuality = Object.entries(statistics.qualityDistribution || {})
                .sort(([, a], [, b]) => b - a)[0]?.[0];
            if (dominantQuality === 'poor' || dominantQuality === 'fair') {
                recommendations.push('Focus on improving basic graphics quality');
            }
        }
        return recommendations.length > 0 ? recommendations : ['Continue developing and analyzing your QB64PE programs'];
    }
    /**
     * Helper methods for automation recommendations
     */
    getAutomationRecommendations(screenshotStatus, watcherStatus) {
        const recommendations = [];
        if (!screenshotStatus.isMonitoring && !watcherStatus.isWatching) {
            recommendations.push("Start with start_screenshot_monitoring to begin automatic capture");
            recommendations.push("Then use start_screenshot_watching to enable automatic analysis");
        }
        else if (screenshotStatus.isMonitoring && !watcherStatus.isWatching) {
            recommendations.push("Add start_screenshot_watching to automatically analyze captured screenshots");
        }
        else if (!screenshotStatus.isMonitoring && watcherStatus.isWatching) {
            recommendations.push("Add start_screenshot_monitoring to automatically capture QB64PE windows");
        }
        else {
            recommendations.push("Full automation active - screenshots will be captured and analyzed automatically");
            recommendations.push("Run QB64PE programs to see the system in action");
        }
        return recommendations;
    }
    /**
     * Helper methods for graphics screenshot analysis
     */
    extractShapesFromCode(code) {
        const shapes = [];
        const shapePatterns = {
            circle: /\bCIRCLE\s*\(/i,
            line: /\bLINE\s*\(/i,
            rectangle: /\bLINE\s*\([^)]*\)\s*,\s*\([^)]*\)\s*,.*,\s*B/i,
            ellipse: /\b_ELLIPSE\s*\(/i,
            polygon: /\b_POLYGON\s*\(/i,
            triangle: /\bLINE\s*.*LINETO.*LINETO/i
        };
        for (const [shape, pattern] of Object.entries(shapePatterns)) {
            if (pattern.test(code)) {
                shapes.push(shape);
            }
        }
        return shapes;
    }
    extractColorsFromCode(code) {
        const colors = [];
        const colorPatterns = {
            red: /_RGB32\s*\(\s*255\s*,\s*0\s*,\s*0\s*\)|_RED/i,
            green: /_RGB32\s*\(\s*0\s*,\s*255\s*,\s*0\s*\)|_GREEN/i,
            blue: /_RGB32\s*\(\s*0\s*,\s*0\s*,\s*255\s*\)|_BLUE/i,
            white: /_RGB32\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)|_WHITE/i,
            black: /_RGB32\s*\(\s*0\s*,\s*0\s*,\s*0\s*\)|_BLACK/i,
            yellow: /_RGB32\s*\(\s*255\s*,\s*255\s*,\s*0\s*\)|_YELLOW/i,
            magenta: /_RGB32\s*\(\s*255\s*,\s*0\s*,\s*255\s*\)|_MAGENTA/i,
            cyan: /_RGB32\s*\(\s*0\s*,\s*255\s*,\s*255\s*\)|_CYAN/i
        };
        for (const [color, pattern] of Object.entries(colorPatterns)) {
            if (pattern.test(code)) {
                colors.push(color);
            }
        }
        return colors;
    }
    extractScreenSize(code) {
        const sizePattern = /SCREEN\s+_NEWIMAGE\s*\(\s*(\d+)\s*,\s*(\d+)/i;
        const match = code.match(sizePattern);
        return match ? `${match[1]}x${match[2]}` : 'unknown';
    }
    extractTextElements(code) {
        const textElements = [];
        const patterns = [
            /_PRINTSTRING\s*\([^)]*\)\s*,\s*"([^"]+)"/g,
            /PRINT\s+"([^"]+)"/g,
            /_TITLE\s+"([^"]+)"/g
        ];
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                textElements.push(match[1]);
            }
        });
        return textElements;
    }
    generateAnalysisInstructions(analysisType, expectedElements, codeAnalysis) {
        let instructions = `# QB64PE Screenshot Analysis Instructions\n\n`;
        instructions += `## Analysis Type: ${analysisType.toUpperCase()}\n\n`;
        if (codeAnalysis) {
            instructions += `## Code Context\n`;
            instructions += `- Screen Size: ${codeAnalysis.screenSize}\n`;
            instructions += `- Expected Shapes: ${codeAnalysis.detectedShapes.join(', ') || 'None detected'}\n`;
            instructions += `- Expected Colors: ${codeAnalysis.detectedColors.join(', ') || 'None detected'}\n`;
            instructions += `- Text Elements: ${codeAnalysis.textElements.join(', ') || 'None detected'}\n\n`;
        }
        switch (analysisType) {
            case 'shapes':
                instructions += `## Shape Analysis Tasks\n`;
                instructions += `- Identify all geometric shapes (circles, rectangles, lines, triangles, etc.)\n`;
                instructions += `- Measure approximate dimensions and positions\n`;
                instructions += `- Check for shape completeness and accuracy\n`;
                break;
            case 'colors':
                instructions += `## Color Analysis Tasks\n`;
                instructions += `- Identify primary and secondary colors used\n`;
                instructions += `- Check color accuracy against expected RGB values\n`;
                instructions += `- Analyze color distribution and gradients\n`;
                break;
            case 'layout':
                instructions += `## Layout Analysis Tasks\n`;
                instructions += `- Assess overall composition and balance\n`;
                instructions += `- Check element positioning and alignment\n`;
                instructions += `- Verify screen utilization and spacing\n`;
                break;
            case 'text':
                instructions += `## Text Analysis Tasks\n`;
                instructions += `- Read and transcribe all visible text\n`;
                instructions += `- Check text positioning and font rendering\n`;
                instructions += `- Verify text color and readability\n`;
                break;
            case 'quality':
                instructions += `## Quality Analysis Tasks\n`;
                instructions += `- Check for rendering artifacts or distortion\n`;
                instructions += `- Assess image clarity and sharpness\n`;
                instructions += `- Verify color accuracy and saturation\n`;
                break;
            default: // comprehensive
                instructions += `## Comprehensive Analysis Tasks\n`;
                instructions += `1. **Shape Detection**: Identify all geometric shapes and their properties\n`;
                instructions += `2. **Color Analysis**: Document all colors and their usage\n`;
                instructions += `3. **Text Recognition**: Read and locate all text elements\n`;
                instructions += `4. **Layout Assessment**: Analyze composition and positioning\n`;
                instructions += `5. **Quality Evaluation**: Check rendering quality and accuracy\n`;
        }
        if (expectedElements && expectedElements.length > 0) {
            instructions += `\n## Expected Elements to Verify\n`;
            expectedElements.forEach((element, index) => {
                instructions += `${index + 1}. ${element}\n`;
            });
        }
        return instructions;
    }
    generateLLMGuidance(analysisType, codeAnalysis) {
        return {
            responseFormat: "Provide detailed description of visual elements found in the screenshot",
            analysisDepth: analysisType === 'comprehensive' ? 'detailed' : 'focused',
            requiredElements: [
                "Overall composition description",
                "Shape identification and properties",
                "Color usage and accuracy",
                "Text content and positioning",
                "Quality assessment"
            ],
            successCriteria: {
                shapeAccuracy: "All expected shapes are correctly identified",
                colorAccuracy: "Colors match expected RGB values within tolerance",
                textReadability: "All text elements are clearly readable",
                layoutCorrectness: "Elements are positioned as expected",
                overallQuality: "Rendering is clean without artifacts"
            },
            contextualAnalysis: codeAnalysis ? "Use provided code context to validate visual output" : "Analyze screenshot independently"
        };
    }
    generateBasicShapesTemplate() {
        return `' QB64PE Basic Shapes Screenshot Analysis Template
$NOPREFIX
$RESIZE:SMOOTH

Title "QB64PE Basic Shapes Test"
Screen _NewImage(800, 600, 32)
Cls , _RGB32(0, 0, 0) ' Black background

' Colors
Dim red, blue, green, yellow, white
red = _RGB32(255, 0, 0)
blue = _RGB32(0, 0, 255)
green = _RGB32(0, 255, 0)  
yellow = _RGB32(255, 255, 0)
white = _RGB32(255, 255, 255)

' Title text
Color white
_PrintString (300, 50), "BASIC SHAPES TEST"

' Circle in top-left quadrant
Circle (200, 200), 80, red
Paint (200, 200), red
_PrintString (160, 290), "Circle"

' Rectangle in top-right quadrant
Line (450, 120)-(650, 280), blue, BF
_PrintString (530, 290), "Rectangle"

' Line in bottom-left quadrant
Line (100, 350)-(300, 500), green
_PrintString (180, 510), "Line"

' Triangle in bottom-right quadrant
Line (500, 350)-(600, 500), yellow
Line (600, 500)-(700, 350), yellow
Line (700, 350)-(500, 350), yellow
_PrintString (580, 510), "Triangle"

Display
_SaveImage "qb64pe-screenshots/basic-shapes-test.png"
_Delay 2
System 0`;
    }
    generateColorPaletteTemplate() {
        return `' QB64PE Color Palette Screenshot Analysis Template
$NOPREFIX
Screen _NewImage(1024, 768, 32)
Cls , _RGB32(32, 32, 32) ' Dark gray background

Title "QB64PE Color Palette Test"

' Title
Color _RGB32(255, 255, 255)
_PrintString (400, 50), "COLOR PALETTE TEST"

' Color palette
Dim colors(7), colorNames$(7)
colors(0) = _RGB32(255, 0, 0): colorNames$(0) = "Red"
colors(1) = _RGB32(255, 127, 0): colorNames$(1) = "Orange"  
colors(2) = _RGB32(255, 255, 0): colorNames$(2) = "Yellow"
colors(3) = _RGB32(0, 255, 0): colorNames$(3) = "Green"
colors(4) = _RGB32(0, 0, 255): colorNames$(4) = "Blue"
colors(5) = _RGB32(75, 0, 130): colorNames$(5) = "Indigo"
colors(6) = _RGB32(148, 0, 211): colorNames$(6) = "Violet"

For i = 0 To 6
    Line (100 + i * 120, 200)-(200 + i * 120, 400), colors(i), BF
    Color _RGB32(255, 255, 255)
    _PrintString (120 + i * 120, 420), colorNames$(i)
Next i

_PrintString (450, 500), "RGB Test"
Display
_SaveImage "qb64pe-screenshots/color-palette-test.png"
_Delay 2
System 0`;
    }
    generateTextRenderingTemplate() {
        return `' QB64PE Text Rendering Screenshot Analysis Template
$NOPREFIX
Screen _NewImage(800, 600, 32)
Cls , _RGB32(0, 0, 0) ' Black background

Title "QB64PE Text Rendering Test"

' Title
Color _RGB32(255, 255, 255)
_PrintString (250, 50), "TEXT RENDERING TEST"

' Different colors
Color _RGB32(255, 0, 0)
_PrintString (100, 150), "Red Text"

Color _RGB32(0, 255, 0)  
_PrintString (100, 200), "Green Text"

Color _RGB32(0, 0, 255)
_PrintString (100, 250), "Blue Text"

' Different positions
Color _RGB32(255, 255, 255)
_PrintString (50, 350), "Left Position"
_PrintString (350, 350), "Center Position"  
_PrintString (600, 350), "Right Position"

' Size variations (using different strings)
_PrintString (200, 450), "Different Sizes"
_PrintString (250, 480), "Different Colors"
_PrintString (300, 510), "Different Positions"

Display
_SaveImage "qb64pe-screenshots/text-rendering-test.png"
_Delay 2
System 0`;
    }
    generateLayoutGridTemplate() {
        return `' QB64PE Layout Grid Screenshot Analysis Template
$NOPREFIX
Screen _NewImage(1024, 768, 32)
Cls , _RGB32(0, 0, 0) ' Black background

Title "QB64PE Layout Grid Test"

' Grid colors
Dim red, green, blue, yellow, magenta, cyan, white
red = _RGB32(255, 0, 0)
green = _RGB32(0, 255, 0)
blue = _RGB32(0, 0, 255)
yellow = _RGB32(255, 255, 0)
magenta = _RGB32(255, 0, 255)
cyan = _RGB32(0, 255, 255)
white = _RGB32(255, 255, 255)

' Title
Color white
_PrintString (400, 30), "LAYOUT GRID TEST"

' 3x3 grid of different elements
' Row 1
Circle (200, 150), 50, red: Paint (200, 150), red
Line (350, 100)-(450, 200), green, BF
Circle (600, 150), 30, blue

' Row 2  
Line (150, 300)-(250, 400), yellow, BF
Circle (400, 350), 40, magenta: Paint (400, 350), magenta
Line (550, 300)-(650, 400), cyan, B

' Row 3
Line (100, 500)-(300, 520), white
Circle (400, 520), 60, green
Line (550, 450)-(650, 550), red, BF

' Grid labels
Color white
_PrintString (450, 650), "Grid System"

Display
_SaveImage "qb64pe-screenshots/layout-grid-test.png" 
_Delay 2
System 0`;
    }
    generateCustomTemplate(specs) {
        const shapes = specs.shapes || ['circle'];
        const colors = specs.colors || ['red'];
        const textElements = specs.textElements || ['CUSTOM TEST'];
        const screenSize = specs.screenSize || '800x600';
        const [width, height] = screenSize.split('x').map(Number);
        return `' QB64PE Custom Screenshot Analysis Template
$NOPREFIX
Screen _NewImage(${width}, ${height}, 32)
Cls , _RGB32(0, 0, 0) ' Black background

Title "QB64PE Custom Test"

' Custom elements based on specifications
' Colors
Dim testColor
testColor = _RGB32(255, 0, 0) ' Default red

' Title
Color _RGB32(255, 255, 255)
_PrintString (${Math.floor(width / 2) - 50}, 50), "${textElements[0] || 'CUSTOM TEST'}"

' Add custom shapes and elements here
Circle (${Math.floor(width / 2)}, ${Math.floor(height / 2)}, 50, testColor
Paint (${Math.floor(width / 2)}, ${Math.floor(height / 2)}, testColor

Display
_SaveImage "qb64pe-screenshots/custom-test.png"
_Delay 2
System 0`;
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
        // QB64PE execution monitoring resource
        this.server.registerResource("qb64pe-execution", "qb64pe://execution/monitoring", {
            title: "QB64PE Execution Monitoring Guide",
            description: "Comprehensive guide for monitoring QB64PE program execution, process management, and timeout strategies",
            mimeType: "text/markdown"
        }, async (uri) => {
            try {
                const guidance = this.executionService.getRealTimeMonitoringGuidance();
                const formattingTemplate = this.executionService.generateConsoleFormattingTemplate();
                const content = guidance + "\n\n# Console Formatting Template\n\n```basic\n" + formattingTemplate + "\n```";
                return {
                    contents: [{
                            uri: uri.href,
                            text: content
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading execution monitoring guide: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // QB64PE installation guidance resource
        this.server.registerResource("qb64pe-installation", "qb64pe://installation/guide", {
            title: "QB64PE Installation and PATH Configuration Guide",
            description: "Comprehensive guide for installing QB64PE and configuring system PATH across platforms",
            mimeType: "text/markdown"
        }, async (uri) => {
            try {
                const report = await this.installationService.generateInstallationReport();
                const installation = await this.installationService.detectInstallation();
                const config = this.installationService.getPathConfiguration(installation.installPath);
                const content = `${report}

# Additional Resources

## Download Links
- **Official Releases:** ${config.downloadUrl}
- **Development Builds:** https://github.com/QB64-Phoenix-Edition/QB64pe/actions

## Platform-Specific Guides

### Windows
- Use Windows Subsystem for Linux (WSL) for Unix-like development
- Consider using package managers like Chocolatey or Scoop
- PowerShell and Command Prompt have different PATH syntax

### macOS
- Homebrew is the recommended package manager
- Use Terminal.app or iTerm2 for command-line access
- Consider using QB64PE.app bundle for GUI access

### Linux
- Most distributions require manual installation or building from source
- Check your distribution's package repository first
- AppImage and Flatpak provide universal installation options

## Troubleshooting

### Common Issues
1. **Permission denied errors:** Ensure executable permissions on Unix-like systems
2. **Library missing errors:** Install required development libraries
3. **PATH not working:** Restart terminal or source shell configuration files
4. **Compilation errors:** Check QB64PE version compatibility with your OS

### Diagnostic Commands
\`\`\`bash
# Check if QB64PE is accessible
qb64pe --version

# Verify PATH configuration
echo $PATH | grep -i qb64  # Unix-like
echo %PATH% | findstr /i qb64  # Windows

# Test compilation
qb64pe -c test.bas
\`\`\`

Use the MCP tools for automated detection and configuration assistance.`;
                return {
                    contents: [{
                            uri: uri.href,
                            text: content
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading installation guide: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }]
                };
            }
        });
        // QB64PE porting documentation resource
        this.server.registerResource("qb64pe-porting", "qb64pe://porting/guide", {
            title: "QB64PE Porting Guide",
            description: "Comprehensive guide for porting BASIC programs to QB64PE with transformation examples",
            mimeType: "text/markdown"
        }, async (uri) => {
            try {
                const supportedDialects = this.portingService.getSupportedDialects();
                const dialectInfo = supportedDialects.map(d => ({
                    dialect: d,
                    status: this.getDialectStatus(d),
                    rules: this.portingService.getDialectRules(d)
                }));
                const portingGuide = `# QB64PE Porting Guide

This guide provides comprehensive information for porting BASIC programs from various dialects to QB64PE.

## Supported BASIC Dialects

${dialectInfo.map(d => `### ${d.dialect.toUpperCase()}
**Status:** ${d.status}

**Conversion Rules:**
${d.rules.map(rule => `- ${rule}`).join('\n')}
`).join('\n')}

## Key Transformation Patterns

### 1. Keyword Case Conversion
- **QBasic:** \`DEFINT A-Z\`
- **QB64PE:** \`DefInt A-Z\`

### 2. Function Declaration Changes
- **QBasic:** \`DECLARE FUNCTION MyFunc AS INTEGER\`
- **QB64PE:** Remove DECLARE statements, use type sigils

### 3. DEF FN to Function Conversion
- **QBasic:** \`DEF FnRan(x) = INT(RND(1) * x) + 1\`
- **QB64PE:** Convert to proper Function...End Function

### 4. GOSUB/RETURN Elimination
- **QBasic:** \`GOSUB InitVars\` ... \`InitVars: ... RETURN\`
- **QB64PE:** Convert to Sub/Function calls

### 5. Array Syntax Updates
- **QBasic:** \`PUT (x, y), array&, PSET\`
- **QB64PE:** \`Put (x, y), array&(), PSet\`

### 6. Modern QB64PE Features
- Add \`$NoPrefix\` for modern syntax
- Add \`$Resize:Smooth\` for graphics programs
- Use \`Title\` for window titles
- Replace \`END\` with \`System 0\`

## Example: QBasic to QB64PE Conversion

### Original QBasic Code:
\`\`\`basic
DEFINT A-Z
DECLARE FUNCTION MyFunc AS INTEGER

DEF FnRan(x) = INT(RND(1) * x) + 1

GOSUB InitVars
PRINT "Random number:", FnRan(10)
END

InitVars:
  PRINT "Initializing..."
RETURN
\`\`\`

### Converted QB64PE Code:
\`\`\`basic
$NoPrefix

DefInt A-Z

Function FnRan(x)
    FnRan = Int(Rnd(1) * x) + 1
End Function

Sub InitVars
    Print "Initializing..."
End Sub

InitVars
Print "Random number:", FnRan(10)
System 0
\`\`\`

## Compatibility Considerations

### High Compatibility
- Basic arithmetic and logic operations
- String manipulation functions
- File I/O operations
- Graphics commands (SCREEN, CIRCLE, LINE)

### Medium Compatibility
- Complex multi-statement lines
- Specific BASIC dialect features
- Hardware-specific operations

### Low Compatibility
- Assembly language integration
- Platform-specific system calls
- Unsupported legacy keywords

## Best Practices for Porting

1. **Start with compatibility analysis** - Use \`analyze_qbasic_compatibility\`
2. **Port incrementally** - Convert small sections at a time
3. **Test frequently** - Compile and test after each major change
4. **Use QB64PE debugging** - Add \`$CONSOLE\` for debugging
5. **Modernize gradually** - Add QB64PE enhancements after basic porting

## Available MCP Tools

- \`port_qbasic_to_qb64pe\` - Automated conversion with transformation tracking
- \`analyze_qbasic_compatibility\` - Pre-porting compatibility analysis
- \`get_porting_dialect_info\` - Dialect-specific conversion information

## Troubleshooting Common Issues

### Multi-Statement Lines
**Problem:** \`IF x > 0 THEN x = 0: IF x < 0 THEN x = 1\`
**Solution:** Split into separate lines

### Array Declarations
**Problem:** \`DIM arr1(10), arr2(20)\`
**Solution:** Declare arrays separately

### Function Return Types
**Problem:** \`FUNCTION MyFunc AS INTEGER\`
**Solution:** Use type sigils: \`Function MyFunc%\`

Use the MCP porting tools for automated assistance with these transformations.`;
                return {
                    contents: [{
                            uri: uri.href,
                            text: portingGuide
                        }]
                };
            }
            catch (error) {
                return {
                    contents: [{
                            uri: uri.href,
                            text: `Error loading porting guide: ${error instanceof Error ? error.message : 'Unknown error'}`
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
        // Execution monitoring prompt
        this.server.registerPrompt("monitor-qb64pe-execution", {
            title: "Monitor QB64PE Program Execution",
            description: "Provide guidance for monitoring QB64PE program execution with timeout strategies",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to analyze"),
                expectedBehavior: zod_1.z.string().optional().describe("Expected program behavior"),
                platform: zod_1.z.enum(["windows", "macos", "linux"]).optional().describe("Target platform")
            }
        }, ({ sourceCode, expectedBehavior, platform }) => ({
            messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `Analyze this QB64PE program for execution monitoring and provide timeout guidance:

Code:
\`\`\`basic
${sourceCode}
\`\`\`

${expectedBehavior ? `Expected Behavior: ${expectedBehavior}` : ''}
${platform ? `Platform: ${platform}` : ''}

Please provide:
1. Program type analysis (graphics, console, mixed)
2. Execution timeout recommendations for LLMs
3. Process monitoring strategy
4. Console output parsing guidance
5. Screenshot/logging recommendations
6. Cross-platform considerations
7. When to hand over to human interaction

**Important**: LLMs should NOT wait indefinitely for graphics programs. Provide specific timeout values and detection strategies.`
                    }
                }]
        }));
        // Enhanced debugging prompt
        this.server.registerPrompt("debug-qb64pe-comprehensive", {
            title: "Comprehensive QB64PE Debugging Session",
            description: "Create a comprehensive debugging session for QB64PE programs with enhanced analysis and automated fixes",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to debug"),
                problemDescription: zod_1.z.string().optional().describe("Description of the problem being experienced"),
                executionContext: zod_1.z.enum(["automated", "interactive", "testing"]).optional().describe("How the program will be executed"),
                platform: zod_1.z.enum(["windows", "macos", "linux"]).optional().describe("Target platform")
            }
        }, ({ sourceCode, problemDescription, executionContext = "automated", platform }) => ({
            messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please help me debug this QB64PE program using the enhanced debugging tools:

**Source Code:**
\`\`\`basic
${sourceCode}
\`\`\`

${problemDescription ? `**Problem Description:** ${problemDescription}\n` : ''}
**Execution Context:** ${executionContext}
${platform ? `**Platform:** ${platform}\n` : ''}

**Please follow this debugging workflow:**

1. **Use \`enhance_qb64pe_code_for_debugging\`** to analyze and enhance the code
2. **Apply debugging best practices** from \`get_qb64pe_debugging_best_practices\`
3. **Consider LLM-specific guidance** from \`get_llm_debugging_guide\`
4. **Provide execution recommendations** based on the program type detected

**Focus Areas:**
- Console output visibility issues
- Flow control for ${executionContext} execution
- Resource management (file handles, graphics contexts)
- Process lifecycle management
- Cross-platform compatibility

**Expected Output:**
- Enhanced code with debugging features
- Clear execution strategy with timeouts
- Monitoring recommendations
- Human handoff points (if needed)

**Critical:** If this is a graphics program, provide specific timeout guidance and suggest when to hand over to human testing.`
                    }
                }]
        }));
        // QBasic to QB64PE porting prompt
        this.server.registerPrompt("port-qbasic-to-qb64pe", {
            title: "Port QBasic Program to QB64PE",
            description: "Provide guidance for porting QBasic programs to QB64PE with transformation analysis",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QBasic source code to port"),
                sourceDialect: zod_1.z.enum(["qbasic", "gwbasic", "quickbasic", "vb-dos"]).optional().describe("Source BASIC dialect"),
                preserveOriginal: zod_1.z.string().optional().describe("Whether to preserve original formatting and comments (true/false)")
            }
        }, ({ sourceCode, sourceDialect = "qbasic", preserveOriginal = "true" }) => ({
            messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `Help me port this ${sourceDialect.toUpperCase()} program to QB64PE:

Source Code:
\`\`\`basic
${sourceCode}
\`\`\`

Please provide:
1. Automated porting analysis using MCP tools
2. Step-by-step conversion guidance
3. Compatibility assessment and warnings
4. Modern QB64PE enhancements to consider
5. Testing recommendations
6. Common pitfalls to avoid

${preserveOriginal === "true" ? 'Please preserve original comments and structure where possible.' : 'Feel free to modernize the code structure.'}

**Instructions:**
- Use the available MCP porting tools for analysis
- Provide both automated conversion results and manual review guidance
- Focus on QB64PE-specific compatibility issues
- Suggest modern QB64PE features that could enhance the program`
                    }
                }]
        }));
    }
    /**
     * Get a description for a wiki category
     */
    getCategoryDescription(categoryName) {
        const descriptions = {
            "Arrays and Data Storage": "Functions and statements for working with arrays, data, and storage",
            "Colors and Transparency": "Color manipulation, palette operations, and transparency functions",
            "Console Window": "Console window creation and management",
            "Conditional Operations": "Boolean logic and conditional evaluation",
            "Definitions and Variable Types": "Variable type definitions and declarations",
            "External Disk and API calls": "File system operations and external API interactions",
            "Error Trapping, Logging & Debugging": "Error handling, logging, and debugging utilities",
            "Event Trapping": "Event handling and trapping mechanisms",
            "File Input and Output": "File operations for reading and writing data",
            "Checksums and Hashes": "Data integrity and hashing functions",
            "Compression and Encoding": "Data compression and encoding utilities",
            "Fonts": "Font loading, manipulation, and text rendering",
            "Game Controller Input (Joystick)": "Game controller and joystick input handling",
            "Graphic Commands": "Graphics rendering and display commands",
            "Graphics and Imaging:": "Image manipulation and graphics operations",
            "Keyboard Input": "Keyboard input handling and key detection",
            "Libraries": "External library integration and declarations",
            "Logical Bitwise Operations": "Bitwise and logical operations",
            "Mathematical Functions and Operations": "Mathematical calculations and functions",
            "Memory Handling and Clipboard": "Memory management and clipboard operations",
            "Mouse Input": "Mouse input detection and handling",
            "Numerical Manipulation and Conversion": "Number manipulation and type conversion",
            "Port Input and Output (COM and LPT)": "Serial and parallel port communications",
            "Print formatting": "Text formatting for printing",
            "Printer Output (LPT and USB)": "Printer output and control",
            "Program Flow and Loops": "Control flow, loops, and program structure",
            "Sounds and Music": "Audio playback, sound generation, and music",
            "String Text Manipulation and Conversion": "String operations and text manipulation",
            "Sub procedures and Functions": "Subroutines, functions, and procedure management",
            "TCP/IP Networking HTTP(S) and Email": "Network communications and internet protocols",
            "Text on Screen": "Screen text display and positioning",
            "Time, Date and Timing": "Time, date, and timing operations",
            "Window and Desktop": "Window management and desktop operations",
            "QB64 Programming Symbols": "Programming symbols, operators, and syntax elements"
        };
        return descriptions[categoryName] || "QB64PE keyword category";
    }
    /**
     * Helper methods for porting functionality
     */
    /**
     * Get recommended next steps after porting
     */
    getPortingNextSteps(result) {
        const steps = [];
        if (result.compatibility === 'low') {
            steps.push('Review all errors and warnings before testing');
            steps.push('Test each function/subroutine individually');
        }
        if (result.warnings.length > 0) {
            steps.push('Address compatibility warnings');
        }
        if (result.transformations.some((t) => t.includes('GOSUB'))) {
            steps.push('Verify GOSUB to function call conversions work correctly');
        }
        if (result.transformations.some((t) => t.includes('DEF FN'))) {
            steps.push('Test converted DEF FN functions');
        }
        steps.push('Compile with QB64PE and fix any syntax errors');
        steps.push('Test program functionality thoroughly');
        steps.push('Consider adding QB64PE-specific enhancements');
        return steps;
    }
    /**
     * Get implementation status for a BASIC dialect
     */
    getDialectStatus(dialect) {
        const statusMap = {
            'qbasic': 'Fully Implemented',
            'gwbasic': 'Planned',
            'quickbasic': 'Planned',
            'vb-dos': 'Planned',
            'applesoft': 'Future Release',
            'commodore': 'Future Release',
            'amiga': 'Future Release',
            'atari': 'Future Release',
            'vb6': 'Research Phase',
            'vbnet': 'Research Phase',
            'vbscript': 'Research Phase',
            'freebasic': 'Under Consideration'
        };
        return statusMap[dialect] || 'Unknown';
    }
    /**
     * Get compatibility notes for a specific dialect
     */
    getDialectCompatibilityNotes(dialect) {
        const notesMap = {
            'qbasic': [
                'Excellent compatibility with QB64PE',
                'Most programs port with minimal changes',
                'Modern QB64PE features enhance functionality'
            ],
            'gwbasic': [
                'Line numbers need conversion to labels',
                'Some graphics functions differ',
                'File I/O syntax modernization needed'
            ],
            'quickbasic': [
                'Very high compatibility',
                'Module system updates required',
                'Most advanced features supported'
            ],
            'vb-dos': [
                'Good compatibility for basic programs',
                'Form-based applications need significant changes',
                'Control structures mostly compatible'
            ]
        };
        return notesMap[dialect] || ['Compatibility assessment pending implementation'];
    }
    /**
     * Get compatibility recommendations based on porting results
     */
    getCompatibilityRecommendations(result, dialect) {
        const recommendations = [];
        if (result.errors.length > 0) {
            recommendations.push('Critical errors found - manual review required before testing');
        }
        if (result.warnings.some((w) => w.includes('multi-statement'))) {
            recommendations.push('Split multi-statement lines for better QB64PE compatibility');
        }
        if (result.warnings.some((w) => w.includes('array'))) {
            recommendations.push('Review array declarations and separate multi-array statements');
        }
        if (result.transformations.some((t) => t.includes('GOSUB'))) {
            recommendations.push('Manually verify GOSUB to function conversions');
        }
        if (dialect !== 'qbasic') {
            recommendations.push(`Consider ${dialect}-specific compatibility issues during testing`);
        }
        recommendations.push('Test program incrementally - start with basic functionality');
        recommendations.push('Use QB64PE debugging features ($CONSOLE, PRINT statements)');
        return recommendations;
    }
    /**
     * Estimate porting effort based on code analysis
     */
    estimatePortingEffort(result, sourceCode) {
        const lines = sourceCode.split('\n').length;
        const transformations = result.transformations.length;
        const warnings = result.warnings.length;
        const errors = result.errors.length;
        let effort = 'Low';
        if (lines > 500 || transformations > 10 || warnings > 5 || errors > 0) {
            effort = 'Medium';
        }
        if (lines > 1000 || transformations > 20 || warnings > 10 || errors > 3) {
            effort = 'High';
        }
        if (result.transformations.some((t) => t.includes('GOSUB')) ||
            result.transformations.some((t) => t.includes('DEF FN'))) {
            effort = effort === 'Low' ? 'Medium' : 'High';
        }
        return effort;
    }
    /**
     * Generate session recommendations for debugging
     */
    generateSessionRecommendations(session) {
        const recommendations = [];
        if (session.issues.length === 0) {
            recommendations.push('No critical issues detected - code appears ready for testing');
        }
        else {
            const criticalIssues = session.issues.filter((i) => i.severity === 'critical');
            const highIssues = session.issues.filter((i) => i.severity === 'high');
            if (criticalIssues.length > 0) {
                recommendations.push(`Address ${criticalIssues.length} critical issue(s) before testing`);
            }
            if (highIssues.length > 0) {
                recommendations.push(`Review ${highIssues.length} high-priority issue(s) for better reliability`);
            }
        }
        if (session.executionMode === 'graphics') {
            recommendations.push('Graphics program detected - expect window interaction, use timeouts');
        }
        else if (session.executionMode === 'mixed') {
            recommendations.push('Mixed mode program - monitor console output and graphics window');
        }
        const autoFixableIssues = session.issues.filter((i) => i.autoFixable);
        if (autoFixableIssues.length > 0) {
            recommendations.push(`${autoFixableIssues.length} issue(s) can be auto-fixed with enhance_qb64pe_code_for_debugging`);
        }
        return recommendations;
    }
    /**
     * Get recommended actions for a debugging session
     */
    getSessionRecommendedActions(session) {
        const actions = [];
        const unresolvedIssues = session.issues.filter((i) => !i.resolved);
        if (unresolvedIssues.length > 0) {
            actions.push('Apply debugging enhancements to resolve outstanding issues');
        }
        if (session.status === 'active' && new Date().getTime() - session.startTime.getTime() > 300000) {
            actions.push('Session has been active for over 5 minutes - consider closing if completed');
        }
        if (session.executionMode === 'graphics' && !session.solutions.some((s) => s.strategy === 'code_injection')) {
            actions.push('Graphics program should use enhanced debugging for timeout management');
        }
        return actions;
    }
    /**
     * Get execution mode distribution for sessions
     */
    getExecutionModeDistribution(sessions) {
        const distribution = {
            console: 0,
            graphics: 0,
            mixed: 0
        };
        sessions.forEach(session => {
            distribution[session.executionMode] = (distribution[session.executionMode] || 0) + 1;
        });
        return distribution;
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