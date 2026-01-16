/**
 * Feedback tool registrations for QB64PE MCP Server
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
 * Register all feedback-related tools
 */
export function registerFeedbackTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "generate_programming_feedback",
    {
      title: "Generate Programming Feedback",
      description:
        "Generate constructive feedback for QB64PE programming sessions",
      inputSchema: {
        code: z.string().describe("QB64PE code to provide feedback on"),
        context: z
          .string()
          .optional()
          .describe("Additional context about the programming session"),
      },
    },
    async ({ code, context }) => {
      try {
        const feedback = services.feedbackService.generateFeedback(
          code,
          context,
        );
        return createMCPTextResponse(feedback);
      } catch (error) {
        return createMCPError(error, "generating programming feedback");
      }
    },
  );

  server.registerTool(
    "get_programming_feedback_history",
    {
      title: "Get Programming Feedback History",
      description: "Get history of programming feedback sessions",
      inputSchema: {
        limit: z
          .number()
          .optional()
          .describe("Maximum number of feedback items (default: 10)"),
      },
    },
    async ({ limit = 10 }) => {
      try {
        const history = services.feedbackService.getFeedbackHistory(limit);
        return createMCPResponse(history);
      } catch (error) {
        return createMCPError(error, "getting feedback history");
      }
    },
  );

  server.registerTool(
    "get_feedback_statistics",
    {
      title: "Get Feedback Statistics",
      description: "Get statistics about programming feedback sessions",
      inputSchema: {},
    },
    async () => {
      try {
        const stats = services.feedbackService.getStatistics();
        return createMCPResponse(stats);
      } catch (error) {
        return createMCPError(error, "getting feedback statistics");
      }
    },
  );
}
