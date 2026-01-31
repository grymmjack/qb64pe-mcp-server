/**
 * Compatibility tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createMCPTextResponse,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";
import { KeyboardBufferSafetyIssue } from "../services/compatibility-service.js";

/**
 * Register all compatibility-related tools
 */
export function registerCompatibilityTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  // Compatibility validation tool
  server.registerTool(
    "validate_qb64pe_compatibility",
    {
      title: "Validate QB64PE Compatibility",
      description:
        "Check code for QB64PE compatibility issues and get solutions",
      inputSchema: {
        code: z
          .string()
          .describe("QB64PE code to check for compatibility issues"),
        platform: z
          .enum(["windows", "macos", "linux", "all"])
          .optional()
          .describe("Target platform"),
      },
    },
    async ({ code, platform = "all" }) => {
      try {
        const issues =
          await services.compatibilityService.validateCompatibility(code);
        const platformInfo =
          await services.compatibilityService.getPlatformCompatibility(
            platform,
          );

        return createMCPResponse({
          issues,
          platformInfo,
          summary: {
            totalIssues: issues.length,
            errors: issues.filter((i: any) => i.severity === "error").length,
            warnings: issues.filter((i: any) => i.severity === "warning")
              .length,
          },
        });
      } catch (error) {
        return createMCPError(error, "validating compatibility");
      }
    },
  );

  // Compatibility knowledge search tool
  server.registerTool(
    "search_qb64pe_compatibility",
    {
      title: "Search QB64PE Compatibility Knowledge",
      description:
        "Search for compatibility issues, solutions, and best practices",
      inputSchema: {
        query: z.string().describe("Search query for compatibility knowledge"),
        category: z
          .enum([
            "function_return_types",
            "console_directives",
            "multi_statement_lines",
            "array_declarations",
            "missing_functions",
            "legacy_keywords",
            "device_access",
            "platform_specific",
            "best_practices",
            "debugging",
            "all",
          ])
          .optional()
          .describe("Specific compatibility category to search"),
      },
    },
    async ({ query, category }) => {
      try {
        const results =
          await services.compatibilityService.searchCompatibility(query);
        const filteredResults =
          category && category !== "all"
            ? results.filter((r: any) => r.category === category)
            : results;

        return createMCPResponse(filteredResults);
      } catch (error) {
        return createMCPError(error, "searching compatibility knowledge");
      }
    },
  );

  // Best practices guidance tool
  server.registerTool(
    "get_qb64pe_best_practices",
    {
      title: "Get QB64PE Best Practices",
      description:
        "Get best practices and coding guidelines for QB64PE development",
      inputSchema: {
        topic: z
          .enum([
            "syntax",
            "debugging",
            "performance",
            "cross_platform",
            "code_organization",
            "all",
          ])
          .optional()
          .describe("Specific topic for best practices"),
      },
    },
    async ({ topic = "all" }) => {
      try {
        const practices =
          await services.compatibilityService.getBestPractices();
        let guidance = "# QB64PE Best Practices\n\n";

        if (topic === "debugging" || topic === "all") {
          const debuggingHelp =
            await services.compatibilityService.getDebuggingGuidance();
          guidance += debuggingHelp + "\n\n";
        }

        guidance += "## General Guidelines\n";
        practices.forEach((practice: any) => {
          guidance += `- ${practice}\n`;
        });

        return createMCPTextResponse(guidance);
      } catch (error) {
        return createMCPError(error, "getting best practices");
      }
    },
  );

  // Keyboard buffer safety validation tool
  server.registerTool(
    "validate_keyboard_buffer_safety",
    {
      title: "Validate Keyboard Buffer Safety",
      description:
        "Detect potential keyboard buffer leakage issues in QB64PE code. " +
        "Scans for _KEYDOWN() checks without subsequent buffer drain, " +
        "identifies INKEY$ calls that may capture control characters, " +
        "warns about EXIT SUB after _KEYDOWN() without buffer consumption, " +
        "and suggests buffer drain placement for CTRL/ALT/SHIFT+key handlers. " +
        "This helps prevent subtle bugs where CTRL+key combinations produce " +
        "ASCII control characters (e.g., CTRL+3 produces ESC) that leak into " +
        "the keyboard buffer and trigger unintended handlers.",
      inputSchema: {
        code: z
          .string()
          .describe("QB64PE code to check for keyboard buffer safety issues"),
      },
    },
    async ({ code }) => {
      try {
        const result =
          await services.compatibilityService.validateKeyboardBufferSafety(
            code,
          );

        // Format the response with clear sections
        let report = "# Keyboard Buffer Safety Analysis\n\n";

        if (result.hasIssues) {
          report += `## ⚠️ Issues Found: ${result.summary.totalIssues}\n\n`;
          report += `- **High Risk:** ${result.summary.highRisk}\n`;
          report += `- **Medium Risk:** ${result.summary.mediumRisk}\n`;
          report += `- **Low Risk:** ${result.summary.lowRisk}\n\n`;

          report += "### Issues Detail\n\n";
          result.issues.forEach((issue: KeyboardBufferSafetyIssue, index: number) => {
            const riskEmoji =
              issue.riskLevel === "high"
                ? "🔴"
                : issue.riskLevel === "medium"
                  ? "🟡"
                  : "🟢";
            report += `${index + 1}. ${riskEmoji} **Line ${issue.line}** - \`${issue.pattern}\`\n`;
            report += `   - ${issue.message}\n`;
            report += `   - **Fix:** ${issue.suggestion}\n\n`;
          });
        } else {
          report += "## ✅ No Issues Found\n\n";
          report +=
            "Your code appears to handle keyboard buffer management safely.\n\n";
        }

        report += "### Code Statistics\n";
        report += `- _KEYDOWN() usages: ${result.summary.keydownUsages}\n`;
        report += `- INKEY$ usages: ${result.summary.inkeyUsages}\n`;
        report += `- Buffer drains: ${result.summary.bufferDrains}\n`;
        report += `- CTRL modifier checks: ${result.summary.ctrlModifierChecks}\n`;
        report += `- ALT modifier checks: ${result.summary.altModifierChecks}\n`;
        report += `- SHIFT modifier checks: ${result.summary.shiftModifierChecks}\n\n`;

        if (result.suggestions.length > 0) {
          report += "### Suggestions\n\n";
          result.suggestions.forEach((suggestion: string) => {
            report += `- ${suggestion}\n`;
          });
          report += "\n";
        }

        report += "### Best Practices for Keyboard Buffer Safety\n\n";
        result.bestPractices.forEach((practice: string) => {
          report += `- ${practice}\n`;
        });

        report += "\n### Buffer Drain Pattern\n\n";
        report += "```basic\n";
        report += "' Drain keyboard buffer to prevent control character leakage\n";
        report += "DO WHILE _KEYHIT: LOOP\n";
        report += "```\n\n";

        report += "### Control Character Reference\n\n";
        report += "| CTRL+Key | ASCII Value | Notes |\n";
        report += "|----------|-------------|-------|\n";
        report += "| CTRL+2 | 0 | NULL character |\n";
        report += "| CTRL+3 | 27 | ESC - may trigger ESC handlers! |\n";
        report += "| CTRL+6 | 30 | Record separator |\n";
        report += "| CTRL+A-Z | 1-26 | Standard control characters |\n";

        return createMCPTextResponse(report);
      } catch (error) {
        return createMCPError(error, "validating keyboard buffer safety");
      }
    },
  );
}
