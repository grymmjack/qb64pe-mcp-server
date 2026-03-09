/**
 * Compiler and syntax tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createTextToolHandler,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all compiler and syntax-related tools
 */
export function registerCompilerTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  // Compiler options tool
  server.registerTool(
    "get_compiler_options",
    {
      title: "Get QB64PE Compiler Options",
      description:
        "Get QB64PE compiler command-line flags and the headless compilation workflow.\n\n" +
        "⚡ HEADLESS / CLI COMPILATION (LLM agents MUST use this):\n" +
        "  qb64pe -w -x [-f:MaxCompilerProcesses=N] SOURCE.BAS -o OUTPUT.run\n\n" +
        "Critical flags for terminal/agent use:\n" +
        "  -x  Compile-only, NO IDE GUI launch (REQUIRED — without it the compiler opens its window and hangs)\n" +
        "  -w  Suppress interactive warning dialogs (REQUIRED for non-interactive)\n" +
        "  -o  Output binary path\n" +
        "  -f:MaxCompilerProcesses=N  Parallel C++ compile threads (set N = CPU cores for speed)\n\n" +
        "This tool returns a headlessWorkflow summary plus the full list of compiler flags.",
      inputSchema: {
        platform: z
          .enum(["windows", "macos", "linux", "all"])
          .optional()
          .describe("Target platform"),
        optionType: z
          .enum(["compilation", "debugging", "optimization", "all"])
          .optional()
          .describe("Type of compiler options"),
      },
    },
    async ({ platform = "all", optionType = "all" }) => {
      try {
        const options = await services.compilerService.getCompilerOptions(
          platform,
          optionType,
        );
        return createMCPResponse(options);
      } catch (error) {
        return createMCPError(error, "getting compiler options");
      }
    },
  );

  // Syntax validation tool
  server.registerTool(
    "validate_qb64pe_syntax",
    {
      title: "Validate QB64PE Syntax",
      description:
        "⚡ WHEN TO USE: Before compiling, when terminal shows syntax errors, or when analyzing code for issues.\n\n" +
        "Validates QB64PE code syntax and provides corrections. Use this tool to:\n" +
        "- Pre-check code before compilation (faster than compiling)\n" +
        "- Analyze syntax errors shown in terminal output\n" +
        "- Get line-specific error details\n" +
        "- Receive actionable suggestions for fixes\n\n" +
        "💡 WORKFLOW: Call this FIRST when seeing compilation errors, then apply fixes, then use compile_and_verify_qb64pe to verify.",
      inputSchema: {
        code: z.string().describe("QB64PE code to validate"),
        checkLevel: z
          .enum(["basic", "strict", "best-practices"])
          .optional()
          .describe("Level of syntax checking"),
      },
    },
    async ({ code, checkLevel = "basic" }) => {
      try {
        const validation = await services.syntaxService.validateSyntax(
          code,
          checkLevel,
        );
        return createMCPResponse(validation);
      } catch (error) {
        return createMCPError(error, "validating syntax");
      }
    },
  );

  // Debugging help tool
  server.registerTool(
    "get_debugging_help",
    {
      title: "Get QB64PE Debugging Help",
      description:
        "Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc.",
      inputSchema: {
        issue: z.string().describe("Description of the debugging issue"),
        platform: z
          .enum(["windows", "macos", "linux", "all"])
          .optional()
          .describe("Target platform"),
      },
    },
    createTextToolHandler(async ({ issue, platform = "all" }) => {
      return await services.compilerService.getDebuggingHelp(issue, platform);
    }, "getting debugging help"),
  );

  // Compile and verify tool - enables autonomous compile-verify-fix loops
  server.registerTool(
    "compile_and_verify_qb64pe",
    {
      title: "⚡ Compile and Verify QB64PE Code ⚡",
      description:
        "⚙️ Compile a .bas file and return structured errors. " +
        "⏳ Takes 20–120 s — wait for it. Call after EVERY .bas edit; loop until result.success=true. " +
        "Always compiles in headless console mode using QB64PE's -q -m -x path. Auto-reuses stored compile flags from the last successful build after normalizing them for verify mode (set useStoredFlags=false to skip).",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe("Absolute path to the .bas file to compile"),
        qb64pePath: z
          .string()
          .optional()
          .describe("QB64PE executable path (auto-detected if omitted)"),
        compilerFlags: z
          .array(z.string())
          .optional()
          .describe(
            "Compiler flags (default: stored flags or ['-q','-m','-x','-w']; -o is ignored and -c is replaced with headless console compile mode)",
          ),
        useStoredFlags: z
          .boolean()
          .optional()
          .describe(
            "Use stored flags from last successful build (default: true)",
          ),
      },
    },
    async ({ sourceFilePath, qb64pePath, compilerFlags, useStoredFlags }) => {
      try {
        const result = await services.compilerService.compileAndVerify(
          sourceFilePath,
          qb64pePath,
          compilerFlags,
          useStoredFlags,
        );
        return createMCPResponse(result);
      } catch (error) {
        return createMCPError(error, "compiling and verifying code");
      }
    },
  );
}
