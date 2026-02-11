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
      title: "Compile and Verify QB64PE Code",
      description:
        "🎯 WHEN TO USE: After fixing compilation errors, after editing .bas files, or when verifying code changes work.\n\n" +
        "🚨 **CRITICAL WORKFLOW REQUIREMENT:** This tool MUST be called IMMEDIATELY after ANY code edit operation on QB64PE files.\n\n" +
        "Compiles QB64PE code and returns detailed error analysis with actionable suggestions. " +
        "This tool enables autonomous compile-verify-fix loops by providing structured compilation " +
        "results that can be analyzed and acted upon programmatically.\n\n" +
        "💡 MANDATORY AUTO-COMPILE WORKFLOW:\n" +
        "1. User requests code change OR you detect error in terminal\n" +
        "2. Apply fixes using replace_string_in_file/multi_replace_string_in_file\n" +
        "3. **IMMEDIATELY** call THIS tool (compile_and_verify_qb64pe) - DO NOT WAIT\n" +
        "4. Check result.success - if false, analyze result.errors\n" +
        "5. Apply additional fixes based on errors and suggestions\n" +
        "6. REPEAT steps 3-5 until result.success = true\n" +
        "7. Report final success to user\n\n" +
        "⚡ CRITICAL: Use this tool after EVERY code change to verify fixes work. Do NOT wait for user to ask 'does it compile?' - this is automatic!\n\n" +
        "🔧 **BUILD CONTEXT AUTO-DETECTION:**\n" +
        "This tool AUTOMATICALLY uses previously successful compiler flags from build context when available.\n" +
        "If no flags are provided and a successful build exists, those flags will be reused automatically.\n" +
        "Set useStoredFlags=false to explicitly ignore stored flags and use defaults instead.\n\n" +
        "❌ BAD: Edit file → Wait for user to ask if it compiles\n" +
        "✅ GOOD: Edit file → Immediately compile → Report success/errors → Fix if needed → Repeat",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe(
            "Absolute path to the QB64PE source file (.bas) to compile",
          ),
        qb64pePath: z
          .string()
          .optional()
          .describe(
            "Path to QB64PE executable. If not provided, will search common locations and PATH.",
          ),
        compilerFlags: z
          .array(z.string())
          .optional()
          .describe(
            "Compiler flags to use. If not provided, will automatically use stored flags from previous successful build, or default to ['-c', '-x', '-w']",
          ),
        useStoredFlags: z
          .boolean()
          .optional()
          .describe(
            "Whether to automatically use stored flags from build context when compilerFlags is not provided (default: true)",
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
