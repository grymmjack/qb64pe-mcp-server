/**
 * Execution monitoring tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMCPResponse, createMCPError } from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all execution monitoring tools
 */
export function registerExecutionTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "analyze_qb64pe_execution_mode",
    {
      title: "Analyze QB64PE Execution Mode",
      description:
        "Analyze QB64PE source code to determine execution characteristics and monitoring requirements",
      inputSchema: {
        sourceCode: z.string().describe("QB64PE source code to analyze"),
      },
    },
    async ({ sourceCode }) => {
      try {
        const executionState =
          services.executionService.analyzeExecutionMode(sourceCode);
        const guidance =
          services.executionService.getExecutionGuidance(executionState);

        return createMCPResponse({
          executionState,
          guidance,
          summary: `Program type: ${executionState.hasGraphics ? "Graphics" : "Console"} ${
            executionState.hasConsole ? "+ Console" : ""
          }. ${guidance.recommendation}`,
        });
      } catch (error) {
        return createMCPError(error, "analyzing execution mode");
      }
    },
  );

  server.registerTool(
    "get_process_monitoring_commands",
    {
      title: "Get Process Monitoring Commands",
      description:
        "Get cross-platform commands for monitoring QB64PE processes",
      inputSchema: {
        processName: z
          .string()
          .optional()
          .describe("Process name to monitor (default: qb64pe)"),
        platform: z
          .enum(["windows", "linux", "macos", "current"])
          .optional()
          .describe("Target platform (default: current)"),
      },
    },
    async ({ processName = "qb64pe", platform = "current" }) => {
      try {
        const monitoringCommands =
          services.executionService.getProcessMonitoringCommands(processName);
        const terminationCommands =
          services.executionService.getProcessTerminationCommands(12345);

        return createMCPResponse({
          platform:
            platform === "current" ? require("os").platform() : platform,
          processName,
          monitoring: {
            commands: monitoringCommands,
            description:
              "Commands to check if process is running and monitor resource usage",
          },
          termination: {
            commands: terminationCommands.map((cmd: string) =>
              cmd.replace("12345", "{pid}"),
            ),
            description:
              "Commands to terminate process (replace {pid} with actual process ID)",
          },
        });
      } catch (error) {
        return createMCPError(error, "getting process monitoring commands");
      }
    },
  );

  server.registerTool(
    "generate_monitoring_template",
    {
      title: "Generate Monitoring Template",
      description:
        "Generate monitoring code template based on program analysis",
      inputSchema: {
        sourceCode: z.string().describe("QB64PE source code"),
        templateType: z.enum(["basic", "detailed", "advanced"]).optional(),
      },
    },
    async ({ sourceCode, templateType = "basic" }) => {
      try {
        const template = services.executionService.generateMonitoringTemplate(
          sourceCode,
          templateType,
        );
        return createMCPResponse({ template });
      } catch (error) {
        return createMCPError(error, "generating monitoring template");
      }
    },
  );

  server.registerTool(
    "generate_console_formatting_template",
    {
      title: "Generate Console Formatting Template",
      description: "Generate structured console output formatting template",
      inputSchema: {
        style: z.enum(["simple", "structured", "json"]).optional(),
      },
    },
    async ({ style = "structured" }) => {
      try {
        const template =
          services.executionService.generateConsoleFormattingTemplate(style);
        return createMCPResponse({ template });
      } catch (error) {
        return createMCPError(error, "generating console formatting template");
      }
    },
  );

  server.registerTool(
    "get_execution_monitoring_guidance",
    {
      title: "Get Execution Monitoring Guidance",
      description: "Get comprehensive guidance on monitoring QB64PE execution",
      inputSchema: {},
    },
    async () => {
      try {
        const guidance = services.executionService.getMonitoringGuidance();
        return createMCPResponse({ guidance });
      } catch (error) {
        return createMCPError(error, "getting execution monitoring guidance");
      }
    },
  );

  server.registerTool(
    "parse_console_output",
    {
      title: "Parse Console Output",
      description: "Parse structured console output from QB64PE programs",
      inputSchema: {
        output: z.string().describe("Console output to parse"),
      },
    },
    async ({ output }) => {
      try {
        const parsed = services.executionService.parseConsoleOutput(output);
        return createMCPResponse(parsed);
      } catch (error) {
        return createMCPError(error, "parsing console output");
      }
    },
  );

  server.registerTool(
    "get_file_monitoring_commands",
    {
      title: "Get File Monitoring Commands",
      description: "Get commands for monitoring file-based QB64PE logging",
      inputSchema: {
        logFilePath: z.string().optional().describe("Path to log file"),
      },
    },
    async ({ logFilePath = "./qb64pe_debug.log" }) => {
      try {
        const commands =
          services.executionService.getFileMonitoringCommands(logFilePath);
        return createMCPResponse({ commands });
      } catch (error) {
        return createMCPError(error, "getting file monitoring commands");
      }
    },
  );
}
