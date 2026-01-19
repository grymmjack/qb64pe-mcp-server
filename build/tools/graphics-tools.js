"use strict";
/**
 * Graphics and screenshot tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGraphicsTools = registerGraphicsTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all graphics and screenshot-related tools
 */
function registerGraphicsTools(server, services) {
    server.registerTool("analyze_qb64pe_graphics_screenshot", {
        title: "Analyze QB64PE Graphics Screenshot",
        description: "Analyze QB64PE graphics program screenshots to detect shapes, colors, layout, and visual elements",
        inputSchema: {
            screenshotPath: zod_1.z
                .string()
                .describe("Path to the screenshot file to analyze (PNG, JPG, GIF)"),
            analysisType: zod_1.z
                .enum([
                "shapes",
                "colors",
                "layout",
                "text",
                "quality",
                "comprehensive",
            ])
                .optional()
                .describe("Type of analysis to perform (default: comprehensive)"),
            expectedElements: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe("List of expected visual elements to look for"),
            programCode: zod_1.z
                .string()
                .optional()
                .describe("Original QB64PE code that generated the screenshot for context"),
        },
    }, async ({ screenshotPath, analysisType = "comprehensive", expectedElements, programCode, }) => {
        try {
            const analysis = await services.screenshotService.analyzeScreenshot(screenshotPath, {
                analysisType,
                expectedElements,
                programCode,
            });
            return (0, mcp_helpers_js_1.createMCPResponse)(analysis);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "analyzing screenshot");
        }
    });
    server.registerTool("generate_qb64pe_screenshot_analysis_template", {
        title: "Generate Screenshot Analysis Template",
        description: "Generate a template for screenshot analysis based on program requirements",
        inputSchema: {
            programType: zod_1.z
                .enum(["shapes", "animation", "game", "visualization"])
                .optional(),
            expectedElements: zod_1.z.array(zod_1.z.string()).optional(),
        },
    }, async ({ programType = "shapes", expectedElements }) => {
        try {
            const template = services.screenshotService.generateAnalysisTemplate(programType, expectedElements);
            return (0, mcp_helpers_js_1.createMCPTextResponse)(template);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "generating screenshot analysis template");
        }
    });
    server.registerTool("capture_qb64pe_screenshot", {
        title: "Capture QB64PE Screenshot",
        description: "Capture screenshots from running QB64PE programs",
        inputSchema: {
            processName: zod_1.z
                .string()
                .optional()
                .describe("Process name to capture (default: qb64pe)"),
            outputPath: zod_1.z
                .string()
                .optional()
                .describe("Output path for screenshot"),
        },
    }, async ({ processName = "qb64pe", outputPath }) => {
        try {
            const screenshot = await services.screenshotService.captureScreenshot(processName, outputPath);
            return (0, mcp_helpers_js_1.createMCPResponse)(screenshot);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "capturing screenshot");
        }
    });
    server.registerTool("get_qb64pe_processes", {
        title: "Get QB64PE Processes",
        description: "Get information about running QB64PE processes",
        inputSchema: {},
    }, async () => {
        try {
            const processes = await services.screenshotService.getQB64PEProcesses();
            return (0, mcp_helpers_js_1.createMCPResponse)(processes);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting QB64PE processes");
        }
    });
    server.registerTool("start_screenshot_monitoring", {
        title: "Start Screenshot Monitoring",
        description: "Start automated screenshot monitoring for QB64PE processes",
        inputSchema: {
            interval: zod_1.z
                .number()
                .optional()
                .describe("Monitoring interval in seconds (default: 5)"),
            outputDir: zod_1.z
                .string()
                .optional()
                .describe("Output directory for screenshots"),
        },
    }, async ({ interval = 5, outputDir }) => {
        try {
            const status = await services.screenshotService.startMonitoring(interval, outputDir);
            return (0, mcp_helpers_js_1.createMCPResponse)(status);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "starting screenshot monitoring");
        }
    });
    server.registerTool("stop_screenshot_monitoring", {
        title: "Stop Screenshot Monitoring",
        description: "Stop automated screenshot monitoring",
        inputSchema: {},
    }, async () => {
        try {
            const status = await services.screenshotService.stopMonitoring();
            return (0, mcp_helpers_js_1.createMCPResponse)(status);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "stopping screenshot monitoring");
        }
    });
    server.registerTool("start_screenshot_watching", {
        title: "Start Screenshot Watching",
        description: "Start watching for new screenshots and automatically analyze them",
        inputSchema: {
            directory: zod_1.z
                .string()
                .optional()
                .describe("Directory to watch for screenshots"),
        },
    }, async ({ directory }) => {
        try {
            const status = services.screenshotWatcher.startWatching(directory);
            return (0, mcp_helpers_js_1.createMCPResponse)(status);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "starting screenshot watching");
        }
    });
    server.registerTool("stop_screenshot_watching", {
        title: "Stop Screenshot Watching",
        description: "Stop watching for new screenshots",
        inputSchema: {},
    }, async () => {
        try {
            const status = services.screenshotWatcher.stopWatching();
            return (0, mcp_helpers_js_1.createMCPResponse)(status);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "stopping screenshot watching");
        }
    });
    server.registerTool("get_screenshot_analysis_history", {
        title: "Get Screenshot Analysis History",
        description: "Get history of screenshot analyses",
        inputSchema: {
            limit: zod_1.z
                .number()
                .optional()
                .describe("Maximum number of history items (default: 10)"),
        },
    }, async ({ limit = 10 }) => {
        try {
            const history = services.screenshotWatcher.getAnalysisHistory(limit);
            const recentScreenshots = services.screenshotWatcher.getRecentScreenshots(5);
            const status = services.screenshotWatcher.getStatus();
            return (0, mcp_helpers_js_1.createMCPResponse)({
                history,
                recentScreenshots,
                status,
                summary: {
                    totalAnalyses: history.length,
                    successful: history.filter((h) => h.success).length,
                    failed: history.filter((h) => !h.success).length,
                    lastAnalysis: history[0]?.timestamp || null,
                },
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting analysis history");
        }
    });
    server.registerTool("get_automation_status", {
        title: "Get Screenshot Automation Status",
        description: "Get comprehensive status of all screenshot automation services",
        inputSchema: {},
    }, async () => {
        try {
            const screenshotStatus = services.screenshotService.getMonitoringStatus();
            const watcherStatus = services.screenshotWatcher.getStatus();
            const recentFiles = services.screenshotService
                .getScreenshotFiles()
                .slice(0, 5);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                screenshot: {
                    monitoring: screenshotStatus,
                    recentFiles: recentFiles.length,
                    latestFile: recentFiles[0] || null,
                },
                watcher: watcherStatus,
                overall: {
                    fullyAutomated: screenshotStatus.isMonitoring && watcherStatus.isWatching,
                    capturingScreenshots: screenshotStatus.isMonitoring,
                    analyzingScreenshots: watcherStatus.isWatching,
                    totalScreenshots: recentFiles.length,
                },
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting automation status");
        }
    });
    server.registerTool("get_qb64pe_graphics_guide", {
        title: "Get QB64PE Graphics Guide",
        description: "Get comprehensive guide for QB64PE graphics programming",
        inputSchema: {
            topic: zod_1.z.enum(["basics", "advanced", "optimization", "all"]).optional(),
        },
    }, async ({ topic = "all" }) => {
        try {
            const guide = await services.screenshotService.getGraphicsGuide(topic);
            return (0, mcp_helpers_js_1.createMCPTextResponse)(guide);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting graphics guide");
        }
    });
    server.registerTool("generate_qb64pe_echo_functions", {
        title: "Generate QB64PE ECHO Functions",
        description: "Generate ECHO functions for simplified console output in graphics programs",
        inputSchema: {
            includeAllVariants: zod_1.z
                .boolean()
                .optional()
                .describe("Include all ECHO variants (default: true)"),
        },
    }, async ({ includeAllVariants = true }) => {
        try {
            const functions = services.loggingService.generateEchoFunctions(includeAllVariants);
            return (0, mcp_helpers_js_1.createMCPTextResponse)(functions);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "generating ECHO functions");
        }
    });
}
//# sourceMappingURL=graphics-tools.js.map