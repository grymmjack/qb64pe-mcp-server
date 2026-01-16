/**
 * Debugging tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createMCPTextResponse,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all debugging-related tools
 */
export function registerDebuggingTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "enhance_qb64pe_code_for_debugging",
    {
      title: "Enhance QB64PE Code for Debugging",
      description:
        "Apply comprehensive debugging enhancements to QB64PE source code",
      inputSchema: {
        sourceCode: z.string().describe("QB64PE source code to enhance"),
        config: z
          .object({
            enableConsole: z
              .boolean()
              .optional()
              .describe("Enable console management (default: true)"),
            enableLogging: z
              .boolean()
              .optional()
              .describe("Enable logging system (default: true)"),
            enableScreenshots: z
              .boolean()
              .optional()
              .describe("Enable screenshot system (default: true)"),
            enableFlowControl: z
              .boolean()
              .optional()
              .describe("Enable flow control for automation (default: true)"),
            enableResourceTracking: z
              .boolean()
              .optional()
              .describe("Enable resource management (default: true)"),
            timeoutSeconds: z
              .number()
              .optional()
              .describe("Timeout for automated operations (default: 30)"),
            autoExit: z
              .boolean()
              .optional()
              .describe("Enable automatic exit behavior (default: true)"),
            verboseOutput: z
              .boolean()
              .optional()
              .describe("Enable verbose debug output (default: true)"),
          })
          .optional()
          .describe("Debugging configuration options"),
      },
    },
    async ({ sourceCode, config = {} }) => {
      try {
        const result = services.debuggingService.enhanceCodeForDebugging(
          sourceCode,
          config,
        );

        return createMCPResponse({
          enhancedCode: result.enhancedCode,
          debugFeatures: result.debugFeatures,
          modifications: result.modifications,
          issuesDetected: result.issues.length,
          solutionsApplied: result.solutions.length,
          summary: {
            originalLines: sourceCode.split("\n").length,
            enhancedLines: result.enhancedCode.split("\n").length,
            linesAdded:
              result.enhancedCode.split("\n").length -
              sourceCode.split("\n").length,
            debugFeaturesEnabled: result.debugFeatures.join(", "),
            keyModifications: result.modifications.slice(0, 3).join("; "),
          },
          usage: {
            saveAs: "enhanced_program.bas",
            compile: "qb64pe -c enhanced_program.bas",
            expectedOutputs: [
              "Console output with debugging information",
              "Log files in qb64pe-logs/",
              "Screenshots in qb64pe-screenshots/ (if graphics program)",
              "Resource tracking and cleanup messages",
            ],
          },
        });
      } catch (error) {
        return createMCPError(error, "enhancing code for debugging");
      }
    },
  );

  server.registerTool(
    "get_qb64pe_debugging_best_practices",
    {
      title: "Get QB64PE Debugging Best Practices",
      description:
        "Get comprehensive debugging best practices and guidelines specifically for QB64PE development",
      inputSchema: {},
    },
    async () => {
      try {
        const bestPractices =
          services.debuggingService.getDebuggingBestPractices();
        return createMCPTextResponse(bestPractices);
      } catch (error) {
        return createMCPError(error, "getting debugging best practices");
      }
    },
  );

  server.registerTool(
    "get_llm_debugging_guide",
    {
      title: "Get LLM QB64PE Debugging Guide",
      description:
        "Get comprehensive debugging guide specifically designed for LLMs and automated systems working with QB64PE",
      inputSchema: {},
    },
    async () => {
      try {
        const guide = services.debuggingService.getLLMDebuggingGuide();
        return createMCPTextResponse(guide);
      } catch (error) {
        return createMCPError(error, "getting LLM debugging guide");
      }
    },
  );

  server.registerTool(
    "inject_native_qb64pe_logging",
    {
      title: "Inject Native QB64PE Logging",
      description:
        "Inject native QB64PE logging functions and ECHO functions into source code",
      inputSchema: {
        sourceCode: z
          .string()
          .describe("QB64PE source code to enhance with logging"),
        config: z
          .object({
            enableNativeLogging: z
              .boolean()
              .optional()
              .describe("Enable native logging functions (default: true)"),
            enableStructuredOutput: z
              .boolean()
              .optional()
              .describe("Enable structured output sections (default: true)"),
            enableEchoOutput: z
              .boolean()
              .optional()
              .describe(
                "Enable ECHO functions for simplified console output (default: true)",
              ),
            consoleDirective: z
              .enum(["$CONSOLE", "$CONSOLE:ONLY"])
              .optional()
              .describe("Console directive to use (default: $CONSOLE:ONLY)"),
            logLevel: z
              .enum(["TRACE", "INFO", "WARN", "ERROR"])
              .optional()
              .describe("Logging level (default: INFO)"),
            autoExitTimeout: z
              .number()
              .optional()
              .describe("Auto-exit timeout in seconds (default: 10)"),
            outputSections: z
              .array(z.string())
              .optional()
              .describe("Custom output sections for structured debugging"),
          })
          .optional()
          .describe("Logging configuration options"),
      },
    },
    async ({ sourceCode, config = {} }) => {
      try {
        const enhanced = services.loggingService.injectNativeLogging(
          sourceCode,
          config,
        );

        const documentation = `# Enhanced QB64PE Code with Native Logging & ECHO Functions

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

⚠️  **CRITICAL RULE**: In ANY graphics screen mode, you MUST use ECHO functions instead of PRINT for console output.

### Simple Console Output
\`\`\`basic
SCREEN 13  ' Graphics mode - MUST use ECHO
CALL ECHO("Initializing graphics mode...")
CALL ECHO_INFO("Graphics setup complete")
CALL ECHO_ERROR("Texture loading failed")
\`\`\`

## Usage Instructions

### Compilation and Execution
\`\`\`bash
# Compile the enhanced program
qb64pe -c enhanced_program.bas

# Run with output capture
enhanced_program.exe > analysis_output.txt 2>&1
\`\`\``;

        return createMCPTextResponse(documentation);
      } catch (error) {
        return createMCPError(error, "injecting native logging");
      }
    },
  );

  server.registerTool(
    "generate_advanced_debugging_template",
    {
      title: "Generate Advanced Debugging Template",
      description:
        "Generate a comprehensive debugging template with all modern QB64PE debugging features",
      inputSchema: {
        programType: z
          .enum(["console", "graphics", "mixed"])
          .optional()
          .describe("Type of program (default: mixed)"),
        includeAllFeatures: z
          .boolean()
          .optional()
          .describe("Include all debugging features (default: true)"),
      },
    },
    async ({ programType = "mixed", includeAllFeatures = true }) => {
      try {
        const template = services.debuggingService.generateAdvancedTemplate(
          programType,
          includeAllFeatures,
        );
        return createMCPTextResponse(template);
      } catch (error) {
        return createMCPError(error, "generating advanced debugging template");
      }
    },
  );

  server.registerTool(
    "parse_qb64pe_structured_output",
    {
      title: "Parse QB64PE Structured Output",
      description: "Parse structured output from QB64PE programs for analysis",
      inputSchema: {
        output: z.string().describe("Console output to parse"),
        format: z
          .enum(["structured", "json", "simple"])
          .optional()
          .describe("Output format (default: structured)"),
      },
    },
    async ({ output, format = "structured" }) => {
      try {
        const parsed = services.loggingService.parseStructuredOutput(
          output,
          format,
        );
        return createMCPResponse(parsed);
      } catch (error) {
        return createMCPError(error, "parsing structured output");
      }
    },
  );

  server.registerTool(
    "generate_output_capture_commands",
    {
      title: "Generate Output Capture Commands",
      description:
        "Generate platform-specific commands for capturing QB64PE program output",
      inputSchema: {
        programPath: z.string().describe("Path to the QB64PE executable"),
        outputPath: z
          .string()
          .optional()
          .describe("Path for output file (default: program_output.txt)"),
      },
    },
    async ({ programPath, outputPath = "program_output.txt" }) => {
      try {
        const commands = services.loggingService.generateOutputCaptureCommands(
          programPath,
          outputPath,
        );
        return createMCPResponse(commands);
      } catch (error) {
        return createMCPError(error, "generating output capture commands");
      }
    },
  );
}
