/**
 * Porting tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMCPResponse, createMCPError } from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";
import { readSourceFileForTool } from "../utils/source-file-utils.js";

/**
 * Register all porting-related tools
 */
export function registerPortingTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "port_qbasic_to_qb64pe",
    {
      title: "Convert Legacy BASIC Code to QB64PE",
      description:
        "Convert legacy BASIC source code into QB64PE-ready code with compatibility and modernization changes",
      inputSchema: {
        sourceCode: z
          .string()
          .describe("QBasic source code to convert to QB64PE"),
        sourceDialect: z
          .enum([
            "qbasic",
            "gwbasic",
            "quickbasic",
            "vb-dos",
            "applesoft",
            "commodore",
            "amiga",
            "atari",
            "vb6",
            "vbnet",
            "vbscript",
            "freebasic",
          ])
          .optional()
          .describe("Source BASIC dialect (default: qbasic)"),
        addModernFeatures: z
          .boolean()
          .optional()
          .describe(
            "Add modern QB64PE features like $Resize:Smooth, $VersionInfo (default: true)",
          ),
        preserveComments: z
          .boolean()
          .optional()
          .describe("Preserve original comments (default: true)"),
        convertGraphics: z
          .boolean()
          .optional()
          .describe("Convert and enhance graphics operations (default: true)"),
        optimizePerformance: z
          .boolean()
          .optional()
          .describe("Apply performance optimizations (default: true)"),
      },
    },
    async ({
      sourceCode,
      sourceDialect = "qbasic",
      addModernFeatures = true,
      preserveComments = true,
      convertGraphics = true,
      optimizePerformance = true,
    }) => {
      try {
        const result = await services.portingService.portQBasicToQB64PE(
          sourceCode,
          {
            sourceDialect,
            addModernFeatures,
            preserveComments,
            convertGraphics,
            optimizePerformance,
          },
        );

        return createMCPResponse({
          porting: result,
          usage: {
            originalLines: result.originalCode.split("\n").length,
            portedLines: result.portedCode.split("\n").length,
            transformationsApplied: result.transformations.length,
            compatibilityLevel: result.compatibility,
          },
        });
      } catch (error) {
        return createMCPError(error, "porting code");
      }
    },
  );

  server.registerTool(
    "port_qbasic_file_to_qb64pe",
    {
      title: "Convert a Legacy BASIC File to QB64PE",
      description:
        "Read a .bas/.bm/.bi file from disk and convert it into QB64PE-ready code",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe("Absolute path to the legacy BASIC source file"),
        sourceDialect: z
          .enum([
            "qbasic",
            "gwbasic",
            "quickbasic",
            "vb-dos",
            "applesoft",
            "commodore",
            "amiga",
            "atari",
            "vb6",
            "vbnet",
            "vbscript",
            "freebasic",
          ])
          .optional()
          .describe("Source BASIC dialect (default: qbasic)"),
        addModernFeatures: z.boolean().optional(),
        preserveComments: z.boolean().optional(),
        convertGraphics: z.boolean().optional(),
        optimizePerformance: z.boolean().optional(),
      },
    },
    async ({
      sourceFilePath,
      sourceDialect = "qbasic",
      addModernFeatures = true,
      preserveComments = true,
      convertGraphics = true,
      optimizePerformance = true,
    }) => {
      try {
        const { sourceCode } = await readSourceFileForTool(sourceFilePath);
        const result = await services.portingService.portQBasicToQB64PE(
          sourceCode,
          {
            sourceDialect,
            addModernFeatures,
            preserveComments,
            convertGraphics,
            optimizePerformance,
          },
        );

        return createMCPResponse({
          sourceFilePath,
          porting: result,
          usage: {
            originalLines: result.originalCode.split("\n").length,
            portedLines: result.portedCode.split("\n").length,
            transformationsApplied: result.transformations.length,
            compatibilityLevel: result.compatibility,
          },
        });
      } catch (error) {
        return createMCPError(error, "porting code from file");
      }
    },
  );

  server.registerTool(
    "get_porting_dialect_info",
    {
      title: "Explain BASIC Dialect Conversion Rules",
      description:
        "Get information about supported BASIC dialects and their specific conversion rules for porting to QB64PE",
      inputSchema: {
        dialect: z
          .enum([
            "qbasic",
            "gwbasic",
            "quickbasic",
            "vb-dos",
            "applesoft",
            "commodore",
            "amiga",
            "atari",
            "vb6",
            "vbnet",
            "vbscript",
            "freebasic",
            "all",
          ])
          .optional()
          .describe("Specific dialect to get information about (default: all)"),
      },
    },
    async ({ dialect = "all" }) => {
      try {
        const supportedDialects =
          services.portingService.getSupportedDialects();

        if (dialect === "all") {
          const allDialectInfo = supportedDialects.map((d: string) => ({
            dialect: d,
            rules: services.portingService.getDialectRules(d),
          }));

          return createMCPResponse({
            supportedDialects: supportedDialects.length,
            dialects: allDialectInfo,
            currentlyImplemented: ["qbasic"],
            plannedImplementation: supportedDialects.filter(
              (d: string) => d !== "qbasic",
            ),
          });
        } else {
          const rules = services.portingService.getDialectRules(dialect);
          return createMCPResponse({
            dialect,
            conversionRules: rules,
          });
        }
      } catch (error) {
        return createMCPError(error, "getting dialect information");
      }
    },
  );

  server.registerTool(
    "analyze_qbasic_compatibility",
    {
      title: "Review Legacy BASIC Code for QB64PE Porting",
      description:
        "Review legacy BASIC source code and identify what will need attention before porting it to QB64PE",
      inputSchema: {
        sourceCode: z.string().describe("QBasic source code to analyze"),
        sourceDialect: z
          .enum([
            "qbasic",
            "gwbasic",
            "quickbasic",
            "vb-dos",
            "applesoft",
            "commodore",
            "amiga",
            "atari",
            "vb6",
            "vbnet",
            "vbscript",
            "freebasic",
          ])
          .optional()
          .describe("Source BASIC dialect (default: qbasic)"),
      },
    },
    async ({ sourceCode, sourceDialect = "qbasic" }) => {
      try {
        const dryRunResult = await services.portingService.portQBasicToQB64PE(
          sourceCode,
          {
            sourceDialect,
            addModernFeatures: false,
            preserveComments: true,
            convertGraphics: false,
            optimizePerformance: false,
          },
        );

        const analysis = {
          sourceDialect,
          codeAnalysis: {
            totalLines: sourceCode.split("\n").length,
            hasGraphics:
              /\b(SCREEN|CIRCLE|LINE|PSET|POINT|PAINT|PUT|GET|PALETTE)\b/i.test(
                sourceCode,
              ),
            hasSound: /\b(PLAY|BEEP|SOUND)\b/i.test(sourceCode),
            hasFileIO: /\b(OPEN|CLOSE|PRINT #|INPUT #|LINE INPUT #)\b/i.test(
              sourceCode,
            ),
            hasDefFn: /\bDEF\s+\w+\s*\(/i.test(sourceCode),
            hasGosub: /\bGOSUB\b/i.test(sourceCode),
            hasMultiStatement: /:\s*(IF|FOR|WHILE|DO)\b/i.test(sourceCode),
            hasDeclareStatements: /\bDECLARE\s+(SUB|FUNCTION)\b/i.test(
              sourceCode,
            ),
          },
          compatibility: {
            level: dryRunResult.compatibility,
            issuesFound:
              dryRunResult.warnings.length + dryRunResult.errors.length,
            transformationsNeeded: dryRunResult.transformations.length,
            potentialProblems: dryRunResult.warnings,
            criticalIssues: dryRunResult.errors,
          },
        };

        return createMCPResponse(analysis);
      } catch (error) {
        return createMCPError(error, "analyzing compatibility");
      }
    },
  );

  server.registerTool(
    "analyze_qbasic_file_compatibility",
    {
      title: "Review a Legacy BASIC File for QB64PE Porting",
      description:
        "Read a legacy BASIC file from disk and analyze its QB64PE porting risks before conversion",
      inputSchema: {
        sourceFilePath: z
          .string()
          .describe("Absolute path to the legacy BASIC source file"),
        sourceDialect: z
          .enum([
            "qbasic",
            "gwbasic",
            "quickbasic",
            "vb-dos",
            "applesoft",
            "commodore",
            "amiga",
            "atari",
            "vb6",
            "vbnet",
            "vbscript",
            "freebasic",
          ])
          .optional()
          .describe("Source BASIC dialect (default: qbasic)"),
      },
    },
    async ({ sourceFilePath, sourceDialect = "qbasic" }) => {
      try {
        const { sourceCode } = await readSourceFileForTool(sourceFilePath);
        const dryRunResult = await services.portingService.portQBasicToQB64PE(
          sourceCode,
          {
            sourceDialect,
            addModernFeatures: false,
            preserveComments: true,
            convertGraphics: false,
            optimizePerformance: false,
          },
        );

        return createMCPResponse({
          sourceFilePath,
          sourceDialect,
          codeAnalysis: {
            totalLines: sourceCode.split("\n").length,
            hasGraphics:
              /\b(SCREEN|CIRCLE|LINE|PSET|POINT|PAINT|PUT|GET|PALETTE)\b/i.test(
                sourceCode,
              ),
            hasSound: /\b(PLAY|BEEP|SOUND)\b/i.test(sourceCode),
            hasFileIO: /\b(OPEN|CLOSE|PRINT #|INPUT #|LINE INPUT #)\b/i.test(
              sourceCode,
            ),
            hasDefFn: /\bDEF\s+\w+\s*\(/i.test(sourceCode),
            hasGosub: /\bGOSUB\b/i.test(sourceCode),
            hasMultiStatement: /:\s*(IF|FOR|WHILE|DO)\b/i.test(sourceCode),
            hasDeclareStatements: /\bDECLARE\s+(SUB|FUNCTION)\b/i.test(
              sourceCode,
            ),
          },
          compatibility: {
            level: dryRunResult.compatibility,
            issuesFound:
              dryRunResult.warnings.length + dryRunResult.errors.length,
            transformationsNeeded: dryRunResult.transformations.length,
            potentialProblems: dryRunResult.warnings,
            criticalIssues: dryRunResult.errors,
          },
        });
      } catch (error) {
        return createMCPError(error, "analyzing file compatibility");
      }
    },
  );
}
