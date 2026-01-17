/**
 * Session Problems Logging Tools
 * Tools for logging and tracking development problems during chat sessions
 */

import { z } from "zod";
import { ServiceContainer } from "../utils/tool-types.js";

export function registerSessionProblemsTools(
  server: any,
  services: ServiceContainer
): void {
  /**
   * Log a session problem
   */
  server.registerTool(
    "log_session_problem",
    {
      title: "Log Session Problem",
      description: "Log a development problem encountered during the session for continuous improvement and MCP refinement",
      inputSchema: {
        category: z.enum(["syntax", "compatibility", "workflow", "tooling", "architecture", "other"]).optional().describe("Problem category"),
        severity: z.enum(["critical", "high", "medium", "low"]).optional().describe("Problem severity"),
        title: z.string().optional().describe("Brief problem title"),
        description: z.string().optional().describe("Detailed problem description"),
        context: z.record(z.any()).optional().describe("Problem context - flexible object for any contextual fields"),
        problem: z.record(z.any()).optional().describe("Problem details - flexible object for error details, attempts, etc."),
        solution: z.record(z.any()).optional().describe("Solution details - flexible object for implementation, prevention, etc."),
        mcpImprovement: z.record(z.any()).optional().describe("MCP improvement suggestions - flexible object"),
        metrics: z.record(z.any()).optional().describe("Performance metrics - flexible object")
      }
    },
    async (args: any) => {
      // Validate that at minimum we have category, severity, title, and description
      if (!args.category || !args.severity || !args.title || !args.description) {
        return {
          content: [
            {
              type: "text" as const,
              text: `❌ **Missing Required Fields**

To log a session problem, you must provide at minimum:
- **category**: One of: syntax, compatibility, workflow, tooling, architecture, other
- **severity**: One of: critical, high, medium, low
- **title**: Brief problem title
- **description**: Detailed problem description

**Recommended fields** for better tracking:
- **context**: { language: "QB64PE", task: "what you were doing" }
- **problem**: { attempted: "what you tried", error: "error message", rootCause: "why it failed" }
- **solution**: { implemented: "what fixed it", preventionStrategy: "how to avoid" }

**Example:**
\`\`\`json
{
  "category": "syntax",
  "severity": "medium",
  "title": "MCP tool validation error",
  "description": "Tool failed due to JSON schema validation issue",
  "context": { "language": "TypeScript" },
  "problem": {
    "attempted": "Called log_session_problem with empty object",
    "error": "keyValidator.._parse is not a function",
    "rootCause": "Required fields were not provided"
  },
  "solution": {
    "implemented": "Made fields optional and added validation",
    "preventionStrategy": "Provide better error messages"
  }
}
\`\`\``,
            },
          ],
        };
      }

      // Set defaults for optional nested objects
      const problemData = {
        category: args.category,
        severity: args.severity,
        title: args.title,
        description: args.description,
        context: args.context || { language: "Unknown" },
        problem: args.problem || {
          attempted: "Not specified",
          error: "Not specified",
          rootCause: "Not specified"
        },
        solution: args.solution || {
          implemented: "Not specified",
          preventionStrategy: "Not specified"
        },
        mcpImprovement: args.mcpImprovement,
        metrics: args.metrics
      };

      const problemLogged = services.sessionProblemsService.logProblem(problemData);

      return {
        content: [
          {
            type: "text" as const,
            text: `✅ **Problem Logged Successfully**

**Problem ID:** ${problemLogged.id}
**Title:** ${problemLogged.title}
**Severity:** ${problemLogged.severity.toUpperCase()}
**Category:** ${problemLogged.category}

This problem has been recorded for MCP server improvement and future LLM training.

${problemLogged.mcpImprovement ? `
**MCP Improvement Needed:**
${problemLogged.mcpImprovement.toolNeeded ? `- New Tool: ${problemLogged.mcpImprovement.toolNeeded}` : ''}
${problemLogged.mcpImprovement.enhancementNeeded ? `- Enhancement: ${problemLogged.mcpImprovement.enhancementNeeded}` : ''}
- Priority: ${problemLogged.mcpImprovement.priority}
` : ''}

Use \`get_session_problems_report\` to view all logged problems and recommendations.`,
          },
        ],
      };
    }
  );

  /**
   * Get session problems report
   */
  server.registerTool(
    "get_session_problems_report",
    {
      title: "Get Session Problems Report",
      description: "Generate a comprehensive report of all problems logged during the current session",
      inputSchema: {
        format: z.enum(["summary", "detailed", "markdown"]).optional().describe("Report format (default: detailed)")
      }
    },
    async (args: any) => {
      const format = args.format || "detailed";
      const report = services.sessionProblemsService.generateReport();

      if (format === "markdown") {
        const markdown = services.sessionProblemsService.exportAsMarkdown(report);
        return {
          content: [
            {
              type: "text" as const,
              text: markdown,
            },
          ],
        };
      }

      if (format === "summary") {
        return {
          content: [
            {
              type: "text" as const,
              text: `# Session Problems Summary

**Session ID:** ${report.sessionId}
**Total Problems:** ${report.totalProblems}

## By Severity
${Object.entries(report.bySeverity).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## By Category
${Object.entries(report.byCategory).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Key Patterns
${report.patterns.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

## Recommendations
${report.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

Use format="detailed" or format="markdown" for complete problem details.`,
            },
          ],
        };
      }

      // Detailed format
      const problemsText = report.problems.map((p: any, i: number) => `
## Problem ${i + 1}: ${p.title}

**Severity:** ${p.severity} | **Category:** ${p.category}
**Context:** ${p.context.language}${p.context.framework ? ` (${p.context.framework})` : ''}

### Problem
- **Attempted:** ${p.problem.attempted}
- **Error:** ${p.problem.error}
- **Root Cause:** ${p.problem.rootCause}

### Solution
- **Implemented:** ${p.solution.implemented}
- **Prevention:** ${p.solution.preventionStrategy}

${p.mcpImprovement ? `### MCP Improvement
${p.mcpImprovement.toolNeeded ? `- **Tool Needed:** ${p.mcpImprovement.toolNeeded}` : ''}
${p.mcpImprovement.enhancementNeeded ? `- **Enhancement:** ${p.mcpImprovement.enhancementNeeded}` : ''}
- **Priority:** ${p.mcpImprovement.priority}` : ''}

${p.metrics ? `### Metrics
- **Attempts:** ${p.metrics.attemptsBeforeSolution}
${p.metrics.timeWasted ? `- **Time Wasted:** ${p.metrics.timeWasted}` : ''}
${p.metrics.toolsUsed.length > 0 ? `- **Tools Used:** ${p.metrics.toolsUsed.join(', ')}` : ''}
${p.metrics.toolsShouldHaveUsed && p.metrics.toolsShouldHaveUsed.length > 0 ? `- **Should Have Used:** ${p.metrics.toolsShouldHaveUsed.join(', ')}` : ''}` : ''}
`).join('\n---\n');

      return {
        content: [
          {
            type: "text" as const,
            text: `# Session Problems Report

**Session ID:** ${report.sessionId}
**Date:** ${report.date.toISOString()}
**Total Problems:** ${report.totalProblems}

## Summary

### By Severity
${Object.entries(report.bySeverity).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}

### By Category
${Object.entries(report.byCategory).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}

${report.patterns.length > 0 ? `## Identified Patterns

${report.patterns.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}` : ''}

${report.recommendations.length > 0 ? `## Recommendations

${report.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}` : ''}

## Problems

${problemsText}`,
          },
        ],
      };
    }
  );

  /**
   * Get session problems statistics
   */
  server.registerTool(
    "get_session_problems_statistics",
    {
      title: "Get Session Problems Statistics",
      description: "Get statistical analysis of session problems",
      inputSchema: {}
    },
    async () => {
      const stats = services.sessionProblemsService.getStatistics();

      return {
        content: [
          {
            type: "text" as const,
            text: `# Session Problems Statistics

**Total Problems Logged:** ${stats.total}

## Distribution

### By Severity
- Critical: ${stats.bySeverity.critical}
- High: ${stats.bySeverity.high}
- Medium: ${stats.bySeverity.medium}
- Low: ${stats.bySeverity.low}

### By Category
- Syntax: ${stats.byCategory.syntax}
- Compatibility: ${stats.byCategory.compatibility}
- Workflow: ${stats.byCategory.workflow}
- Tooling: ${stats.byCategory.tooling}
- Architecture: ${stats.byCategory.architecture}
- Other: ${stats.byCategory.other}

## Performance Metrics
- **Average Attempts Before Solution:** ${stats.avgAttemptsBeforeSolution.toFixed(1)}
- **Problems Where Tools Weren't Used:** ${stats.toolsNotUsedCount}

${stats.toolsNotUsedCount > 0 ? `
⚠️ **Warning:** ${stats.toolsNotUsedCount} problems occurred where MCP tools should have been used but weren't.
This indicates a need for better LLM training on tool usage prioritization.
` : '✅ All problems utilized available MCP tools appropriately.'}`,
          },
        ],
      };
    }
  );

  /**
   * Clear session problems
   */
  server.registerTool(
    "clear_session_problems",
    {
      title: "Clear Session Problems",
      description: "Clear all logged session problems and start fresh (useful for starting a new session)",
      inputSchema: {
        confirm: z.boolean().describe("Must be true to confirm clearing")
      }
    },
    async (args: any) => {
      if (!args.confirm) {
        return {
          content: [
            {
              type: "text" as const,
              text: "❌ **Clearing Cancelled**\n\nSet confirm=true to clear session problems.",
            },
          ],
        };
      }

      const oldStats = services.sessionProblemsService.getStatistics();
      services.sessionProblemsService.clear();

      return {
        content: [
          {
            type: "text" as const,
            text: `✅ **Session Problems Cleared**

Previous session had ${oldStats.total} problems logged.
A new session has been started with a fresh problem log.

Old session ID has been archived.`,
          },
        ],
      };
    }
  );
}
