/**
 * Execution monitoring tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMCPResponse, createMCPError } from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";
import { readSourceFileForTool } from "../utils/source-file-utils.js";

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
      title: "Decide How a QB64PE Program Should Be Monitored",
      description:
        "Analyze QB64PE source code and tell the LLM whether the program is graphics, console, or mixed, plus how to monitor it",
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
    "analyze_qb64pe_execution_mode_file",
    {
      title: "Decide How a QB64PE File Should Be Monitored",
      description:
        "Read a .bas/.bm/.bi file from disk and return the best runtime-monitoring approach for it",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe("Absolute path to the .bas/.bm/.bi file to analyze"),
      },
    },
    async ({ sourceFilePath }) => {
      try {
        const { sourceCode } = await readSourceFileForTool(sourceFilePath);
        const executionState =
          services.executionService.analyzeExecutionMode(sourceCode);
        const guidance =
          services.executionService.getExecutionGuidance(executionState);

        return createMCPResponse({
          sourceFilePath,
          executionState,
          guidance,
          summary: `Program type: ${executionState.hasGraphics ? "Graphics" : "Console"} ${
            executionState.hasConsole ? "+ Console" : ""
          }. ${guidance.recommendation}`,
        });
      } catch (error) {
        return createMCPError(error, "analyzing execution mode from file");
      }
    },
  );

  server.registerTool(
    "get_process_monitoring_commands",
    {
      title: "Get Commands to Watch a Running QB64PE Program",
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
      title: "Create QB64PE Runtime Monitoring Code",
      description:
        "Generate QB64PE runtime-monitoring code based on the program source",
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
    "generate_monitoring_template_file",
    {
      title: "Create Runtime Monitoring Code for a QB64PE File",
      description:
        "Read a .bas/.bm/.bi file from disk and generate a monitoring template for it",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe("Absolute path to the .bas/.bm/.bi file"),
        templateType: z.enum(["basic", "detailed", "advanced"]).optional(),
      },
    },
    async ({ sourceFilePath, templateType = "basic" }) => {
      try {
        const { sourceCode } = await readSourceFileForTool(sourceFilePath);
        const template = services.executionService.generateMonitoringTemplate(
          sourceCode,
          templateType,
        );
        return createMCPResponse({ sourceFilePath, template });
      } catch (error) {
        return createMCPError(
          error,
          "generating monitoring template from file",
        );
      }
    },
  );

  server.registerTool(
    "generate_console_formatting_template",
    {
      title: "Create Structured Console Logging Format",
      description:
        "Generate structured console output formats for QB64PE runtime logging",
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
      title: "Get a QB64PE Runtime Monitoring Plan",
      description:
        "Get a practical monitoring plan for running QB64PE programs",
      inputSchema: {},
    },
    async () => {
      try {
        const guidance =
          services.executionService.getRealTimeMonitoringGuidance();
        return createMCPResponse({ guidance });
      } catch (error) {
        return createMCPError(error, "getting execution monitoring guidance");
      }
    },
  );

  server.registerTool(
    "parse_console_output",
    {
      title: "Turn QB64PE Console Output Into Structured Data",
      description:
        "Parse QB64PE console/log output into structured data for the LLM",
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
      title: "Get Commands to Watch QB64PE Log Files",
      description:
        "Get shell commands for tailing and watching file-based QB64PE logs",
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
