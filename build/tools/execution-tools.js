"use strict";
/**
 * Execution monitoring tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExecutionTools = registerExecutionTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all execution monitoring tools
 */
function registerExecutionTools(server, services) {
    server.registerTool("analyze_qb64pe_execution_mode", {
        title: "Analyze QB64PE Execution Mode",
        description: "Analyze QB64PE source code to determine execution characteristics and monitoring requirements",
        inputSchema: {
            sourceCode: zod_1.z.string().describe("QB64PE source code to analyze"),
        },
    }, async ({ sourceCode }) => {
        try {
            const executionState = services.executionService.analyzeExecutionMode(sourceCode);
            const guidance = services.executionService.getExecutionGuidance(executionState);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                executionState,
                guidance,
                summary: `Program type: ${executionState.hasGraphics ? "Graphics" : "Console"} ${executionState.hasConsole ? "+ Console" : ""}. ${guidance.recommendation}`,
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "analyzing execution mode");
        }
    });
    server.registerTool("get_process_monitoring_commands", {
        title: "Get Process Monitoring Commands",
        description: "Get cross-platform commands for monitoring QB64PE processes",
        inputSchema: {
            processName: zod_1.z
                .string()
                .optional()
                .describe("Process name to monitor (default: qb64pe)"),
            platform: zod_1.z
                .enum(["windows", "linux", "macos", "current"])
                .optional()
                .describe("Target platform (default: current)"),
        },
    }, async ({ processName = "qb64pe", platform = "current" }) => {
        try {
            const monitoringCommands = services.executionService.getProcessMonitoringCommands(processName);
            const terminationCommands = services.executionService.getProcessTerminationCommands(12345);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                platform: platform === "current" ? require("os").platform() : platform,
                processName,
                monitoring: {
                    commands: monitoringCommands,
                    description: "Commands to check if process is running and monitor resource usage",
                },
                termination: {
                    commands: terminationCommands.map((cmd) => cmd.replace("12345", "{pid}")),
                    description: "Commands to terminate process (replace {pid} with actual process ID)",
                },
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting process monitoring commands");
        }
    });
    server.registerTool("generate_monitoring_template", {
        title: "Generate Monitoring Template",
        description: "Generate monitoring code template based on program analysis",
        inputSchema: {
            sourceCode: zod_1.z.string().describe("QB64PE source code"),
            templateType: zod_1.z.enum(["basic", "detailed", "advanced"]).optional(),
        },
    }, async ({ sourceCode, templateType = "basic" }) => {
        try {
            const template = services.executionService.generateMonitoringTemplate(sourceCode, templateType);
            return (0, mcp_helpers_js_1.createMCPResponse)({ template });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "generating monitoring template");
        }
    });
    server.registerTool("generate_console_formatting_template", {
        title: "Generate Console Formatting Template",
        description: "Generate structured console output formatting template",
        inputSchema: {
            style: zod_1.z.enum(["simple", "structured", "json"]).optional(),
        },
    }, async ({ style = "structured" }) => {
        try {
            const template = services.executionService.generateConsoleFormattingTemplate(style);
            return (0, mcp_helpers_js_1.createMCPResponse)({ template });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "generating console formatting template");
        }
    });
    server.registerTool("get_execution_monitoring_guidance", {
        title: "Get Execution Monitoring Guidance",
        description: "Get comprehensive guidance on monitoring QB64PE execution",
        inputSchema: {},
    }, async () => {
        try {
            const guidance = services.executionService.getMonitoringGuidance();
            return (0, mcp_helpers_js_1.createMCPResponse)({ guidance });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting execution monitoring guidance");
        }
    });
    server.registerTool("parse_console_output", {
        title: "Parse Console Output",
        description: "Parse structured console output from QB64PE programs",
        inputSchema: {
            output: zod_1.z.string().describe("Console output to parse"),
        },
    }, async ({ output }) => {
        try {
            const parsed = services.executionService.parseConsoleOutput(output);
            return (0, mcp_helpers_js_1.createMCPResponse)(parsed);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "parsing console output");
        }
    });
    server.registerTool("get_file_monitoring_commands", {
        title: "Get File Monitoring Commands",
        description: "Get commands for monitoring file-based QB64PE logging",
        inputSchema: {
            logFilePath: zod_1.z.string().optional().describe("Path to log file"),
        },
    }, async ({ logFilePath = "./qb64pe_debug.log" }) => {
        try {
            const commands = services.executionService.getFileMonitoringCommands(logFilePath);
            return (0, mcp_helpers_js_1.createMCPResponse)({ commands });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting file monitoring commands");
        }
    });
}
//# sourceMappingURL=execution-tools.js.map