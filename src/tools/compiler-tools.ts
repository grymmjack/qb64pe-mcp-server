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
      description: "Validate QB64PE code syntax and suggest corrections",
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
}
