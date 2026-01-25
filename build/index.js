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
const validation_service_js_1 = require("./services/validation-service.js");
const session_problems_service_js_1 = require("./services/session-problems-service.js");
const file_structure_service_js_1 = require("./services/file-structure-service.js");
// Import tool registration modules
const wiki_tools_js_1 = require("./tools/wiki-tools.js");
const keyword_tools_js_1 = require("./tools/keyword-tools.js");
const compiler_tools_js_1 = require("./tools/compiler-tools.js");
const compatibility_tools_js_1 = require("./tools/compatibility-tools.js");
const execution_tools_js_1 = require("./tools/execution-tools.js");
const installation_tools_js_1 = require("./tools/installation-tools.js");
const porting_tools_js_1 = require("./tools/porting-tools.js");
const graphics_tools_js_1 = require("./tools/graphics-tools.js");
const debugging_tools_js_1 = require("./tools/debugging-tools.js");
const feedback_tools_js_1 = require("./tools/feedback-tools.js");
const session_problems_tools_js_1 = require("./tools/session-problems-tools.js");
const project_build_context_tools_js_1 = require("./tools/project-build-context-tools.js");
const file_structure_tools_js_1 = require("./tools/file-structure-tools.js");
const wiki_platform_tools_js_1 = require("./tools/wiki-platform-tools.js");
const mouse_input_tools_js_1 = require("./tools/mouse-input-tools.js");
const tool_discovery_js_1 = require("./utils/tool-discovery.js");
/**
 * Enhanced MCP Server with automatic tool discovery
 */
class ToolDiscoveryMCPServer extends mcp_js_1.McpServer {
    hasLearnedTools = false;
    originalRegisterTool;
    constructor(config) {
        super(config);
        // Wrap the registerTool method to track tools and inject discovery
        this.originalRegisterTool = this.registerTool.bind(this);
        this.registerTool = this.wrapRegisterTool.bind(this);
    }
    /**
     * Wrapped registerTool that tracks tools and injects discovery on first call
     */
    wrapRegisterTool(name, config, handler) {
        // Register tool in discovery manager
        const category = this.inferCategoryFromToolName(name);
        tool_discovery_js_1.toolDiscoveryManager.registerTool({
            name,
            title: config.title || name,
            description: config.description || "No description provided",
            category,
            inputSchema: JSON.stringify(config.inputSchema || {}, null, 2),
        });
        // Wrap the handler to inject tool discovery on first call
        const wrappedHandler = async (args, extra) => {
            // If this is the first tool call (any tool), provide tool summary
            if (!tool_discovery_js_1.toolDiscoveryManager.hasLearnedTools()) {
                tool_discovery_js_1.toolDiscoveryManager.markToolsAsLearned();
                const toolSummary = tool_discovery_js_1.toolDiscoveryManager.getToolSummary();
                try {
                    // Get the actual tool result
                    const actualResult = await handler(args, extra);
                    // Combine tool discovery with the actual result
                    return {
                        content: [
                            {
                                type: "text",
                                text: `🎓 **CRITICAL: QB64PE MCP Server Workflow Requirements**

⚠️ **READ THIS CAREFULLY - MANDATORY BEHAVIOR PATTERNS:**

**1. AUTO-COMPILE AFTER EDITS (REQUIRED):**
When you edit ANY QB64PE source file (.bas, .bm, .bi):
- ✅ DO: Edit → IMMEDIATELY compile → Report result
- ❌ DON'T: Edit → Wait for user to ask if it compiles
- ❌ DON'T: Edit → Say "changes made" → Stop without compiling

**2. TOOL NAME DETECTION (REQUIRED):**
When user types tool names like 'mcp_qb64pe_*':
- Recognize this as implicit request to USE that tool
- Call the tool with reasonable defaults
- Explain what it does and show results

**3. ERROR FIXING (REQUIRED):**
When terminal shows compilation errors:
- Detect error context automatically
- Apply fixes WITHOUT asking permission
- Compile to verify fixes work
- Repeat until success (max 5 iterations)

${toolSummary}

---

📋 **Your Request Result:**

`,
                            },
                            ...(actualResult.content || [actualResult]),
                        ],
                    };
                }
                catch (error) {
                    // Even if the tool fails, still provide discovery info
                    return {
                        content: [
                            {
                                type: "text",
                                text: `🎓 **IMPORTANT: QB64PE MCP Server Tool Discovery**

Before processing your request, you must review all available tools in this MCP server.

${toolSummary}

---

⚠️ **Tool Error:** ${error instanceof Error ? error.message : "Unknown error"}
`,
                            },
                        ],
                    };
                }
            }
            // Normal operation - just call the handler
            return handler(args, extra);
        };
        // Call the original registerTool method
        this.originalRegisterTool(name, config, wrappedHandler);
    }
    /**
     * Infer category from tool name
     */
    inferCategoryFromToolName(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("wiki"))
            return "wiki";
        if (lowerName.includes("keyword"))
            return "keywords";
        if (lowerName.includes("compile"))
            return "compiler";
        if (lowerName.includes("compatibility") || lowerName.includes("validate"))
            return "compatibility";
        if (lowerName.includes("execute") || lowerName.includes("run"))
            return "execution";
        if (lowerName.includes("install") || lowerName.includes("setup"))
            return "installation";
        if (lowerName.includes("port") || lowerName.includes("convert"))
            return "porting";
        if (lowerName.includes("graphic") ||
            lowerName.includes("screenshot") ||
            lowerName.includes("image"))
            return "graphics";
        if (lowerName.includes("debug"))
            return "debugging";
        if (lowerName.includes("feedback") || lowerName.includes("report"))
            return "feedback";
        return "other";
    }
}
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
    validationService;
    sessionProblemsService;
    fileStructureService;
    constructor() {
        this.server = new ToolDiscoveryMCPServer({
            name: "qb64pe-mcp-server",
            version: "1.0.0",
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
        this.validationService = new validation_service_js_1.ValidationService();
        this.sessionProblemsService = new session_problems_service_js_1.SessionProblemsService();
        this.fileStructureService = new file_structure_service_js_1.FileStructureService();
        // Connect screenshot watcher to feedback service
        this.screenshotWatcher.on("analysis-complete", (analysisResult) => {
            // Screenshot analysis completed - feedback can be generated via feedback service
            console.error(`Screenshot analysis completed: ${analysisResult.screenshotPath}`);
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
        // Create service container for tool registrations
        const services = {
            wikiService: this.wikiService,
            compilerService: this.compilerService,
            syntaxService: this.syntaxService,
            compatibilityService: this.compatibilityService,
            keywordsService: this.keywordsService,
            executionService: this.executionService,
            installationService: this.installationService,
            portingService: this.portingService,
            screenshotService: this.screenshotService,
            screenshotWatcher: this.screenshotWatcher,
            feedbackService: this.feedbackService,
            debuggingService: this.debuggingService,
            loggingService: this.loggingService,
            validationService: this.validationService,
            sessionProblemsService: this.sessionProblemsService,
            fileStructureService: this.fileStructureService,
        };
        // Register all tools by category
        (0, wiki_tools_js_1.registerWikiTools)(this.server, services);
        (0, keyword_tools_js_1.registerKeywordTools)(this.server, services);
        (0, compiler_tools_js_1.registerCompilerTools)(this.server, services);
        (0, compatibility_tools_js_1.registerCompatibilityTools)(this.server, services);
        (0, execution_tools_js_1.registerExecutionTools)(this.server, services);
        (0, installation_tools_js_1.registerInstallationTools)(this.server, services);
        (0, porting_tools_js_1.registerPortingTools)(this.server, services);
        (0, graphics_tools_js_1.registerGraphicsTools)(this.server, services);
        (0, debugging_tools_js_1.registerDebuggingTools)(this.server, services);
        (0, feedback_tools_js_1.registerFeedbackTools)(this.server, services);
        (0, session_problems_tools_js_1.registerSessionProblemsTools)(this.server, services);
        (0, project_build_context_tools_js_1.registerProjectBuildContextTools)(this.server, services);
        (0, file_structure_tools_js_1.registerFileStructureTools)(this.server, services);
        (0, wiki_platform_tools_js_1.registerWikiPlatformTools)(this.server, services);
        (0, mouse_input_tools_js_1.registerMouseInputTools)(this.server, services);
    }
    async setupResources() {
        // QB64PE wiki base resource
        this.server.registerResource("qb64pe-wiki", "qb64pe://wiki/", {
            title: "QB64PE Wiki",
            description: "Access to the QB64PE wiki documentation",
            mimeType: "text/markdown",
        }, async (uri) => {
            const wikiIndex = await this.wikiService.getWikiIndex();
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: wikiIndex,
                    },
                ],
            };
        });
        // Compiler reference resource
        this.server.registerResource("qb64pe-compiler", "qb64pe://compiler/reference", {
            title: "QB64PE Compiler Reference",
            description: "Complete reference for QB64PE compiler options and usage",
            mimeType: "text/markdown",
        }, async (uri) => {
            const compilerRef = await this.compilerService.getCompilerReference();
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: compilerRef,
                    },
                ],
            };
        });
        // Compatibility documentation resource
        this.server.registerResource("qb64pe-compatibility", "qb64pe://compatibility/", {
            title: "QB64PE Compatibility Guide",
            description: "Comprehensive compatibility documentation and issue solutions",
            mimeType: "text/markdown",
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
                    contents: [
                        {
                            uri: uri.href,
                            text: compatibilityContent,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading compatibility documentation: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // QB64PE keywords base resource
        this.server.registerResource("qb64pe-keywords", "qb64pe://keywords/", {
            title: "QB64PE Keywords Reference",
            description: "Complete reference of QB64PE keywords and syntax",
            mimeType: "application/json",
        }, async (uri) => {
            try {
                const categories = this.keywordsService.getCategories();
                const allKeywords = this.keywordsService.getAllKeywords();
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: JSON.stringify({
                                categories,
                                totalKeywords: Object.keys(allKeywords).length,
                                keywordsByCategory: Object.entries(categories).reduce((acc, [catName, catInfo]) => {
                                    acc[catName] = {
                                        description: catInfo.description,
                                        count: catInfo.keywords.length,
                                        keywords: catInfo.keywords.slice(0, 10), // First 10 as examples
                                    };
                                    return acc;
                                }, {}),
                            }, null, 2),
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading keywords reference: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // Keywords by category resource
        this.server.registerResource("qb64pe-keywords-category", "qb64pe://keywords/category/{category}", {
            title: "QB64PE Keywords by Category",
            description: "Keywords filtered by specific category",
            mimeType: "application/json",
        }, async (uri) => {
            try {
                const url = new URL(uri.href);
                const category = url.pathname.split("/").pop();
                if (!category) {
                    return {
                        contents: [
                            {
                                uri: uri.href,
                                text: JSON.stringify({ error: "Category not specified" }, null, 2),
                            },
                        ],
                    };
                }
                const keywords = this.keywordsService.getKeywordsByCategory(category);
                const categories = this.keywordsService.getCategories();
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: JSON.stringify({
                                category,
                                description: categories[category]?.description,
                                keywords: keywords.map((k) => ({
                                    name: k.name,
                                    type: k.type,
                                    description: k.description,
                                    syntax: k.syntax,
                                    version: k.version,
                                    availability: k.availability,
                                })),
                            }, null, 2),
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading keywords by category: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // Individual keyword resource
        this.server.registerResource("qb64pe-keyword-detail", "qb64pe://keywords/detail/{keyword}", {
            title: "QB64PE Keyword Detail",
            description: "Detailed information about a specific keyword",
            mimeType: "application/json",
        }, async (uri) => {
            try {
                const url = new URL(uri.href);
                const keyword = url.pathname.split("/").pop()?.toUpperCase();
                if (!keyword) {
                    return {
                        contents: [
                            {
                                uri: uri.href,
                                text: JSON.stringify({ error: "Keyword not specified" }, null, 2),
                            },
                        ],
                    };
                }
                const validation = this.keywordsService.validateKeyword(keyword);
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: JSON.stringify(validation, null, 2),
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading keyword detail: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // QB64PE execution monitoring resource
        this.server.registerResource("qb64pe-execution", "qb64pe://execution/monitoring", {
            title: "QB64PE Execution Monitoring Guide",
            description: "Comprehensive guide for monitoring QB64PE program execution, process management, and timeout strategies",
            mimeType: "text/markdown",
        }, async (uri) => {
            try {
                const guidance = this.executionService.getRealTimeMonitoringGuidance();
                const formattingTemplate = this.executionService.generateConsoleFormattingTemplate();
                const content = guidance +
                    "\n\n# Console Formatting Template\n\n```basic\n" +
                    formattingTemplate +
                    "\n```";
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: content,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading execution monitoring guide: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // QB64PE installation guidance resource
        this.server.registerResource("qb64pe-installation", "qb64pe://installation/guide", {
            title: "QB64PE Installation and PATH Configuration Guide",
            description: "Comprehensive guide for installing QB64PE and configuring system PATH across platforms",
            mimeType: "text/markdown",
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
                    contents: [
                        {
                            uri: uri.href,
                            text: content,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading installation guide: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        });
        // Agent Intelligence Guide resource
        this.server.registerResource("qb64pe-agent-intelligence", "qb64pe://agent/intelligence-guide", {
            title: "QB64PE Agent Intelligence Guide",
            description: "Comprehensive guide for agents on using QB64PE MCP tools intelligently, including context recognition, tool selection patterns, autonomous workflows, and decision frameworks",
            mimeType: "text/markdown",
        }, async (uri) => {
            try {
                const { readFile } = await Promise.resolve().then(() => __importStar(require("fs/promises")));
                const { join } = await Promise.resolve().then(() => __importStar(require("path")));
                const guideContent = await readFile(join(process.cwd(), "AGENT_INTELLIGENCE_GUIDE.md"), "utf-8");
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: guideContent,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `# Agent Intelligence Guide

⚠️ Guide file not found. Key principles:
- Recognize compilation context from terminal output
- Use analyze-compilation-error prompt for compilation failures
- Apply fixes autonomously without asking permission
- Use compile_and_verify_qb64pe to verify changes
- Iterate up to 5 times until compilation succeeds`,
                        },
                    ],
                };
            }
        });
        // QB64PE porting documentation resource
        this.server.registerResource("qb64pe-porting", "qb64pe://porting/guide", {
            title: "QB64PE Porting Guide",
            description: "Comprehensive guide for porting BASIC programs to QB64PE with transformation examples",
            mimeType: "text/markdown",
        }, async (uri) => {
            try {
                const supportedDialects = this.portingService.getSupportedDialects();
                const dialectInfo = supportedDialects.map((d) => ({
                    dialect: d,
                    status: this.getDialectStatus(d),
                    rules: this.portingService.getDialectRules(d),
                }));
                const portingGuide = `# QB64PE Porting Guide

This guide provides comprehensive information for porting BASIC programs from various dialects to QB64PE.

## Supported BASIC Dialects

${dialectInfo
                    .map((d) => `### ${d.dialect.toUpperCase()}
**Status:** ${d.status}

**Conversion Rules:**
${d.rules.map((rule) => `- ${rule}`).join("\n")}
`)
                    .join("\n")}

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
- Use proper underscore prefixes for QB64PE keywords (_RGB32, _NEWIMAGE, etc.)
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
                    contents: [
                        {
                            uri: uri.href,
                            text: portingGuide,
                        },
                    ],
                };
            }
            catch (error) {
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Error loading porting guide: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
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
                focusAreas: zod_1.z
                    .string()
                    .optional()
                    .describe("Comma-separated list of areas to focus the review on: syntax, performance, best-practices, cross-platform, debugging"),
            },
        }, ({ code, focusAreas = "syntax, best-practices" }) => ({
            messages: [
                {
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

Ensure all suggestions are specific to QB64PE and not other BASIC dialects.`,
                    },
                },
            ],
        }));
        // Debugging helper prompt
        this.server.registerPrompt("debug-qb64pe-issue", {
            title: "Debug QB64PE Issue",
            description: "Help debug QB64PE programs with step-by-step guidance",
            argsSchema: {
                problemDescription: zod_1.z
                    .string()
                    .describe("Description of the problem or error"),
                code: zod_1.z.string().optional().describe("Relevant QB64PE code (if any)"),
                platform: zod_1.z
                    .enum(["windows", "macos", "linux"])
                    .optional()
                    .describe("Target platform"),
            },
        }, ({ problemDescription, code, platform }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Help me debug this QB64PE issue:

Problem: ${problemDescription}
${platform ? `Platform: ${platform}` : ""}
${code ? `\n\nCode:\n\`\`\`basic\n${code}\n\`\`\`` : ""}

Please provide:
1. Likely causes of the issue
2. Step-by-step debugging approach using QB64PE tools
3. PRINT statement debugging strategies
4. $CONSOLE usage for debugging
5. Platform-specific considerations (if applicable)
6. Common QB64PE pitfalls to check

Focus specifically on QB64PE debugging techniques and tools.`,
                    },
                },
            ],
        }));
        // Execution monitoring prompt
        this.server.registerPrompt("monitor-qb64pe-execution", {
            title: "Monitor QB64PE Program Execution",
            description: "Provide guidance for monitoring QB64PE program execution with timeout strategies",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to analyze"),
                expectedBehavior: zod_1.z
                    .string()
                    .optional()
                    .describe("Expected program behavior"),
                platform: zod_1.z
                    .enum(["windows", "macos", "linux"])
                    .optional()
                    .describe("Target platform"),
            },
        }, ({ sourceCode, expectedBehavior, platform }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Analyze this QB64PE program for execution monitoring and provide timeout guidance:

Code:
\`\`\`basic
${sourceCode}
\`\`\`

${expectedBehavior ? `Expected Behavior: ${expectedBehavior}` : ""}
${platform ? `Platform: ${platform}` : ""}

Please provide:
1. Program type analysis (graphics, console, mixed)
2. Execution timeout recommendations for LLMs
3. Process monitoring strategy
4. Console output parsing guidance
5. Screenshot/logging recommendations
6. Cross-platform considerations
7. When to hand over to human interaction

**Important**: LLMs should NOT wait indefinitely for graphics programs. Provide specific timeout values and detection strategies.`,
                    },
                },
            ],
        }));
        // Enhanced debugging prompt
        this.server.registerPrompt("debug-qb64pe-comprehensive", {
            title: "Comprehensive QB64PE Debugging Session",
            description: "Create a comprehensive debugging session for QB64PE programs with enhanced analysis and automated fixes",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QB64PE source code to debug"),
                problemDescription: zod_1.z
                    .string()
                    .optional()
                    .describe("Description of the problem being experienced"),
                executionContext: zod_1.z
                    .enum(["automated", "interactive", "testing"])
                    .optional()
                    .describe("How the program will be executed"),
                platform: zod_1.z
                    .enum(["windows", "macos", "linux"])
                    .optional()
                    .describe("Target platform"),
            },
        }, ({ sourceCode, problemDescription, executionContext = "automated", platform, }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please help me debug this QB64PE program using the enhanced debugging tools:

**Source Code:**
\`\`\`basic
${sourceCode}
\`\`\`

${problemDescription ? `**Problem Description:** ${problemDescription}\n` : ""}
**Execution Context:** ${executionContext}
${platform ? `**Platform:** ${platform}\n` : ""}

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

**Critical:** If this is a graphics program, provide specific timeout guidance and suggest when to hand over to human testing.`,
                    },
                },
            ],
        }));
        // QBasic to QB64PE porting prompt
        this.server.registerPrompt("port-qbasic-to-qb64pe", {
            title: "Port QBasic Program to QB64PE",
            description: "Provide guidance for porting QBasic programs to QB64PE with transformation analysis",
            argsSchema: {
                sourceCode: zod_1.z.string().describe("QBasic source code to port"),
                sourceDialect: zod_1.z
                    .enum(["qbasic", "gwbasic", "quickbasic", "vb-dos"])
                    .optional()
                    .describe("Source BASIC dialect"),
                preserveOriginal: zod_1.z
                    .string()
                    .optional()
                    .describe("Whether to preserve original formatting and comments (true/false)"),
            },
        }, ({ sourceCode, sourceDialect = "qbasic", preserveOriginal = "true", }) => ({
            messages: [
                {
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

${preserveOriginal === "true" ? "Please preserve original comments and structure where possible." : "Feel free to modernize the code structure."}

**Instructions:**
- Use the available MCP porting tools for analysis
- Provide both automated conversion results and manual review guidance
- Focus on QB64PE-specific compatibility issues
- Suggest modern QB64PE features that could enhance the program`,
                    },
                },
            ],
        }));
        // Compilation error analysis prompt - NEW!
        this.server.registerPrompt("analyze-compilation-error", {
            title: "Analyze QB64PE Compilation Error",
            description: "Intelligent analysis of QB64PE compilation failures with autonomous fix guidance. Use when user shows terminal output from failed compilation.",
            argsSchema: {
                terminalOutput: zod_1.z
                    .string()
                    .describe("Complete terminal output from failed QB64PE compilation"),
                sourceFilePath: zod_1.z
                    .string()
                    .describe("Absolute path to the .bas file that failed to compile"),
                errorContext: zod_1.z
                    .string()
                    .optional()
                    .describe("Additional context about what the user was trying to do"),
            },
        }, ({ terminalOutput, sourceFilePath, errorContext }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `🚨 **QB64PE Compilation Failed - Autonomous Fix Required**

You are an expert QB64PE developer tasked with AUTONOMOUSLY fixing compilation errors.

## Terminal Output
\`\`\`
${terminalOutput}
\`\`\`

## Source File
${sourceFilePath}

${errorContext ? `## Context\n${errorContext}\n` : ""}

## YOUR AUTONOMOUS ACTION PLAN

You MUST execute this plan WITHOUT asking the user for permission:

### Step 1: Analyze Errors
- Call \`validate_qb64pe_syntax\` with the source code from ${sourceFilePath}
- Parse terminal output for line numbers, error types, and messages
- Identify error patterns (type mismatches, missing declarations, syntax errors, etc.)

### Step 2: Map Errors to Fixes
Use this decision matrix:

**Type Errors** (Type mismatch, Cannot assign, incompatible types)
→ Tool: \`validate_qb64pe_syntax\` + \`validate_qb64pe_compatibility\`
→ Action: Fix variable types, add/correct AS clauses

**Declaration Errors** (Variable not declared, DIM required, Undeclared)
→ Tool: \`validate_qb64pe_syntax\`
→ Action: Add DIM statements, check scoping

**Structure Errors** (Expected END, Missing END, Unexpected END)
→ Tool: \`validate_qb64pe_syntax\`
→ Action: Close SUB/FUNCTION/IF/FOR blocks properly

**Porting Errors** (Not supported, Legacy syntax, QBasic compatibility)
→ Tool: \`port_qbasic_to_qb64pe\` or \`validate_qb64pe_compatibility\`
→ Action: Modernize to QB64PE syntax

### Step 3: Apply ALL Fixes
- Edit the source file to fix ALL identified errors
- Use line numbers from terminal output to target specific locations
- Apply fixes systematically, starting with declaration errors

### Step 4: Verify Compilation
- Call \`compile_and_verify_qb64pe\` with sourceFilePath: "${sourceFilePath}"
- Check result.success and result.errors
- Parse result.suggestions for additional guidance

### Step 5: Iterate Until Success
- If result.success = false:
  - Analyze result.errors for new/remaining issues
  - Apply additional fixes
  - Call \`compile_and_verify_qb64pe\` again
  - REPEAT until result.success = true
- Maximum 5 iterations

### Step 6: Report Results
- Report ONLY final outcome to user
- Show executable path if successful
- Explain what fixes were applied
- Report iteration count

## CRITICAL RULES

❌ **NEVER** ask "Should I fix this?"
✅ **ALWAYS** fix it automatically

❌ **NEVER** say "You need to add..."
✅ **ALWAYS** add it yourself and report what you did

❌ **NEVER** stop after first fix
✅ **ALWAYS** iterate until compilation succeeds

❌ **NEVER** guess what's wrong
✅ **ALWAYS** use \`validate_qb64pe_syntax\` to confirm

## Available MCP Tools

Use these tools in your autonomous workflow:
- \`validate_qb64pe_syntax\` - Pre-analyze syntax issues
- \`validate_qb64pe_compatibility\` - Check platform/type compatibility
- \`compile_and_verify_qb64pe\` - Compile and get structured error feedback
- \`port_qbasic_to_qb64pe\` - Re-port if porting-related issues detected
- \`detect_qb64pe_installation\` - If "QB64PE not found" error

## Expected Response Format

\`\`\`markdown
# Autonomous Compilation Fix

## Error Analysis
- Total errors: X
- Error types: [list]
- Root causes: [analysis]

## Fixes Applied
1. [Description of fix 1] (Line X)
2. [Description of fix 2] (Line Y)
3. [...]

## Compilation Results
- Iteration 1: [result]
- Iteration 2: [result] (if needed)
- Final: ✅ SUCCESS or ❌ FAILED

## Summary
[Brief summary of what was fixed and final outcome]
\`\`\`

**NOW: Execute the autonomous action plan. Do NOT wait for user confirmation.**`,
                    },
                },
            ],
        }));
        // Build context preservation prompt
        this.server.registerPrompt("preserve-build-context", {
            title: "Preserve Build Context in Summaries",
            description: "Guidance for preserving critical build commands and procedural knowledge in conversation summaries. " +
                "Addresses the problem: 'Conversation summarization loses critical build command details'",
            argsSchema: {
                summaryType: zod_1.z
                    .enum(["conversation", "session", "project"])
                    .optional()
                    .describe("Type of summary being created"),
            },
        }, ({ summaryType = "conversation" }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `🔍 **Build Context Preservation Guidance**

When creating ${summaryType} summaries, you MUST preserve critical build and workflow information to prevent loss across conversation boundaries.

## [BUILD-CRITICAL] Information to Preserve

### 1. Compilation Commands
Mark with [BUILD-CRITICAL] in summaries:
- **Exact QB64PE compilation command**: Full command with all flags
- **Compiler flags used**: e.g., \`-c -w -x\`, \`-o outputname\`
- **Output executable name**: If specified with \`-o\` flag
- **QB64PE installation path**: If non-standard location
- **Source file path**: Project location

Example preservation:
\`\`\`
[BUILD-CRITICAL] Compilation Command:
/Users/grymmjack/git/QB64pe/qb64pe -c -w -x DRAW.BAS -o DRAW.run
\`\`\`

### 2. Procedural Knowledge (Not Just Declarative)
Preserve HOW to do things, not just WHAT was done:
- Build process steps and order
- Custom workflows established by user
- Flags that differ from MCP tool defaults
- Project-specific requirements

### 3. Project Configuration
- Include/library paths
- Platform-specific settings
- Custom build parameters
- Environment variables

## Validation Checklist

Before finalizing a summary, verify:
- [ ] Build command is complete and exact
- [ ] All non-default flags are documented
- [ ] Output name is specified if custom
- [ ] QB64PE path is saved if non-standard
- [ ] Workflow steps are preserved, not just results

## MCP Tools for Build Context

Use these tools to ensure build context is never lost:
- \`get_project_build_context\` - Retrieve saved build info before summarizing
- \`list_project_build_contexts\` - Check all projects being worked on
- \`compile_and_verify_qb64pe\` - Automatically saves build context

## Anti-Patterns to Avoid

❌ **BAD**: "Last command: ./DRAW.run" (execution only)
✅ **GOOD**: "Build: /path/qb64pe -c -w -x DRAW.BAS -o DRAW.run | Run: ./DRAW.run"

❌ **BAD**: Using MCP tool defaults without checking history
✅ **GOOD**: Check \`get_project_build_context\` first, use previous flags

❌ **BAD**: "The code was fixed" (declarative only)
✅ **GOOD**: "Build process: 1) Fix syntax 2) Compile with -c -w -x 3) Run executable" (procedural)

## Summary Template

\`\`\`markdown
## Build Configuration [PERSISTENT]

**Project**: [path]

**Build Command**: [BUILD-CRITICAL]
\`\`\`bash
[exact command]
\`\`\`

**Compiler Flags**: [list with explanations]
**Output**: [executable name and location]
**Last Successful Build**: [timestamp]

## Critical Workflows [WORKFLOW]

1. [Step-by-step procedures established]
2. [Custom processes user requires]
3. [Deviations from defaults]
\`\`\`

This ensures the next conversation can immediately resume with correct build parameters!`,
                    },
                },
            ],
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
            Fonts: "Font loading, manipulation, and text rendering",
            "Game Controller Input (Joystick)": "Game controller and joystick input handling",
            "Graphic Commands": "Graphics rendering and display commands",
            "Graphics and Imaging:": "Image manipulation and graphics operations",
            "Keyboard Input": "Keyboard input handling and key detection",
            Libraries: "External library integration and declarations",
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
            "QB64 Programming Symbols": "Programming symbols, operators, and syntax elements",
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
        if (result.compatibility === "low") {
            steps.push("Review all errors and warnings before testing");
            steps.push("Test each function/subroutine individually");
        }
        if (result.warnings.length > 0) {
            steps.push("Address compatibility warnings");
        }
        if (result.transformations.some((t) => t.includes("GOSUB"))) {
            steps.push("Verify GOSUB to function call conversions work correctly");
        }
        if (result.transformations.some((t) => t.includes("DEF FN"))) {
            steps.push("Test converted DEF FN functions");
        }
        steps.push("Compile with QB64PE and fix any syntax errors");
        steps.push("Test program functionality thoroughly");
        steps.push("Consider adding QB64PE-specific enhancements");
        return steps;
    }
    /**
     * Get implementation status for a BASIC dialect
     */
    getDialectStatus(dialect) {
        const statusMap = {
            qbasic: "Fully Implemented",
            gwbasic: "Planned",
            quickbasic: "Planned",
            "vb-dos": "Planned",
            applesoft: "Future Release",
            commodore: "Future Release",
            amiga: "Future Release",
            atari: "Future Release",
            vb6: "Research Phase",
            vbnet: "Research Phase",
            vbscript: "Research Phase",
            freebasic: "Under Consideration",
        };
        return statusMap[dialect] || "Unknown";
    }
    /**
     * Get compatibility notes for a specific dialect
     */
    getDialectCompatibilityNotes(dialect) {
        const notesMap = {
            qbasic: [
                "Excellent compatibility with QB64PE",
                "Most programs port with minimal changes",
                "Modern QB64PE features enhance functionality",
            ],
            gwbasic: [
                "Line numbers need conversion to labels",
                "Some graphics functions differ",
                "File I/O syntax modernization needed",
            ],
            quickbasic: [
                "Very high compatibility",
                "Module system updates required",
                "Most advanced features supported",
            ],
            "vb-dos": [
                "Good compatibility for basic programs",
                "Form-based applications need significant changes",
                "Control structures mostly compatible",
            ],
        };
        return (notesMap[dialect] || ["Compatibility assessment pending implementation"]);
    }
    /**
     * Get compatibility recommendations based on porting results
     */
    getCompatibilityRecommendations(result, dialect) {
        const recommendations = [];
        if (result.errors.length > 0) {
            recommendations.push("Critical errors found - manual review required before testing");
        }
        if (result.warnings.some((w) => w.includes("multi-statement"))) {
            recommendations.push("Split multi-statement lines for better QB64PE compatibility");
        }
        if (result.warnings.some((w) => w.includes("array"))) {
            recommendations.push("Review array declarations and separate multi-array statements");
        }
        if (result.transformations.some((t) => t.includes("GOSUB"))) {
            recommendations.push("Manually verify GOSUB to function conversions");
        }
        if (dialect !== "qbasic") {
            recommendations.push(`Consider ${dialect}-specific compatibility issues during testing`);
        }
        recommendations.push("Test program incrementally - start with basic functionality");
        recommendations.push("Use QB64PE debugging features ($CONSOLE, PRINT statements)");
        return recommendations;
    }
    /**
     * Estimate porting effort based on code analysis
     */
    estimatePortingEffort(result, sourceCode) {
        const lines = sourceCode.split("\n").length;
        const transformations = result.transformations.length;
        const warnings = result.warnings.length;
        const errors = result.errors.length;
        let effort = "Low";
        if (lines > 500 || transformations > 10 || warnings > 5 || errors > 0) {
            effort = "Medium";
        }
        if (lines > 1000 || transformations > 20 || warnings > 10 || errors > 3) {
            effort = "High";
        }
        if (result.transformations.some((t) => t.includes("GOSUB")) ||
            result.transformations.some((t) => t.includes("DEF FN"))) {
            effort = effort === "Low" ? "Medium" : "High";
        }
        return effort;
    }
    /**
     * Generate session recommendations for debugging
     */
    generateSessionRecommendations(session) {
        const recommendations = [];
        if (session.issues.length === 0) {
            recommendations.push("No critical issues detected - code appears ready for testing");
        }
        else {
            const criticalIssues = session.issues.filter((i) => i.severity === "critical");
            const highIssues = session.issues.filter((i) => i.severity === "high");
            if (criticalIssues.length > 0) {
                recommendations.push(`Address ${criticalIssues.length} critical issue(s) before testing`);
            }
            if (highIssues.length > 0) {
                recommendations.push(`Review ${highIssues.length} high-priority issue(s) for better reliability`);
            }
        }
        if (session.executionMode === "graphics") {
            recommendations.push("Graphics program detected - expect window interaction, use timeouts");
        }
        else if (session.executionMode === "mixed") {
            recommendations.push("Mixed mode program - monitor console output and graphics window");
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
            actions.push("Apply debugging enhancements to resolve outstanding issues");
        }
        if (session.status === "active" &&
            new Date().getTime() - session.startTime.getTime() > 300000) {
            actions.push("Session has been active for over 5 minutes - consider closing if completed");
        }
        if (session.executionMode === "graphics" &&
            !session.solutions.some((s) => s.strategy === "code_injection")) {
            actions.push("Graphics program should use enhanced debugging for timeout management");
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
            mixed: 0,
        };
        sessions.forEach((session) => {
            distribution[session.executionMode] =
                (distribution[session.executionMode] || 0) + 1;
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