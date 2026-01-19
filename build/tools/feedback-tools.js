"use strict";
/**
 * Feedback tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFeedbackTools = registerFeedbackTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all feedback-related tools
 */
function registerFeedbackTools(server, services) {
    server.registerTool("generate_programming_feedback", {
        title: "Generate Programming Feedback",
        description: "Generate constructive feedback for QB64PE programming sessions",
        inputSchema: {
            code: zod_1.z.string().describe("QB64PE code to provide feedback on"),
            context: zod_1.z
                .string()
                .optional()
                .describe("Additional context about the programming session"),
        },
    }, async ({ code, context }) => {
        try {
            const feedback = services.feedbackService.generateFeedback(code, context);
            return (0, mcp_helpers_js_1.createMCPTextResponse)(feedback);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "generating programming feedback");
        }
    });
    server.registerTool("get_programming_feedback_history", {
        title: "Get Programming Feedback History",
        description: "Get history of programming feedback sessions",
        inputSchema: {
            limit: zod_1.z
                .number()
                .optional()
                .describe("Maximum number of feedback items (default: 10)"),
        },
    }, async ({ limit = 10 }) => {
        try {
            const history = services.feedbackService.getFeedbackHistory(limit);
            return (0, mcp_helpers_js_1.createMCPResponse)(history);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting feedback history");
        }
    });
    server.registerTool("get_feedback_statistics", {
        title: "Get Feedback Statistics",
        description: "Get statistics about programming feedback sessions",
        inputSchema: {},
    }, async () => {
        try {
            const stats = services.feedbackService.getStatistics();
            return (0, mcp_helpers_js_1.createMCPResponse)(stats);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting feedback statistics");
        }
    });
}
//# sourceMappingURL=feedback-tools.js.map