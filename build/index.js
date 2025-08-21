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
const execution_service_js_1 = require("./services/execution-service.js");
const installation_service_js_1 = require("./services/installation-service.js");
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