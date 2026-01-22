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
  services: ServiceContainer
): void {
  // Compiler options tool
  server.registerTool(
    "get_compiler_options",
    {
      title: "Get QB64PE Compiler Options",
      description:
        "Get information about QB64PE compiler command-line options and flags",
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
          optionType
        );
        return createMCPResponse(options);
      } catch (error) {
        return createMCPError(error, "getting compiler options");
      }
    }
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
          checkLevel
        );
        return createMCPResponse(validation);
      } catch (error) {
        return createMCPError(error, "validating syntax");
      }
    }
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
    }, "getting debugging help")
  );

  // Compile and verify tool - enables autonomous compile-verify-fix loops
  server.registerTool(
    "compile_and_verify_qb64pe",
    {
      title: "Compile and Verify QB64PE Code",
      description:
        "🎯 WHEN TO USE: After fixing compilation errors, after editing .bas files, or when verifying code changes work.\n\n" +
        "Compiles QB64PE code and returns detailed error analysis with actionable suggestions. " +
        "This tool enables autonomous compile-verify-fix loops by providing structured compilation " +
        "results that can be analyzed and acted upon programmatically.\n\n" +
        "💡 AUTONOMOUS WORKFLOW:\n" +
        "1. Apply fixes to source code\n" +
        "2. Call this tool to compile and verify\n" +
        "3. Check result.success - if false, analyze result.errors\n" +
        "4. Apply additional fixes based on errors and suggestions\n" +
        "5. REPEAT steps 2-4 until result.success = true\n\n" +
        "⚡ CRITICAL: Use this tool after EVERY code change to verify fixes work. Do NOT wait for user to compile manually!",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe(
            "Absolute path to the QB64PE source file (.bas) to compile"
          ),
        qb64pePath: z
          .string()
          .optional()
          .describe(
            "Path to QB64PE executable. If not provided, will search common locations and PATH."
          ),
        compilerFlags: z
          .array(z.string())
          .optional()
          .describe(
            "Additional compiler flags (default: ['-c', '-x', '-w'] for compile only, no-console, show warnings)"
          ),
      },
    },
    async ({ sourceFilePath, qb64pePath, compilerFlags }) => {
      try {
        const result = await services.compilerService.compileAndVerify(
          sourceFilePath,
          qb64pePath,
          compilerFlags
        );
        return createMCPResponse(result);
      } catch (error) {
        return createMCPError(error, "compiling and verifying code");
      }
    }
  );
}
