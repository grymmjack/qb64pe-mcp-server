"use strict";
/**
 * Utility functions for MCP server tool registration and response handling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMCPResponse = createMCPResponse;
exports.createMCPTextResponse = createMCPTextResponse;
exports.createMCPError = createMCPError;
exports.createMCPImageResponse = createMCPImageResponse;
exports.createToolHandler = createToolHandler;
exports.createTextToolHandler = createTextToolHandler;
/**
 * Create a standard MCP success response with JSON-formatted data
 * @param data - Data to return in the response
 * @returns MCP response object
 */
function createMCPResponse(data) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
/**
 * Create a standard MCP success response with plain text
 * @param text - Text content to return
 * @returns MCP response object
 */
function createMCPTextResponse(text) {
    return {
        content: [
            {
                type: "text",
                text,
            },
        ],
    };
}
/**
 * Create a standard MCP error response
 * @param error - Error object or unknown error
 * @param action - Description of the action that failed
 * @returns MCP error response object
 */
function createMCPError(error, action) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
        content: [
            {
                type: "text",
                text: `Error ${action}: ${message}`,
            },
        ],
        isError: true,
    };
}
/**
 * Create an MCP response that embeds an image (base64) so the LLM can see it.
 * @param base64Data - Raw base64-encoded image bytes (no data-URL prefix)
 * @param mimeType - MIME type, e.g. 'image/png'
 * @param caption - Optional text shown alongside the image
 */
function createMCPImageResponse(base64Data, mimeType = "image/png", caption) {
    const content = [];
    if (caption) {
        content.push({ type: "text", text: caption });
    }
    content.push({ type: "image", data: base64Data, mimeType });
    return { content };
}
/**
 * Create a tool handler wrapper that provides standard error handling
 * @param handler - Async function that processes tool arguments
 * @param actionDescription - Description of the action (for error messages)
 * @returns Wrapped handler with standard error handling
 */
function createToolHandler(handler, actionDescription) {
    return async (args) => {
        try {
            const result = await handler(args);
            // If result is already a string, return as text response
            if (typeof result === "string") {
                return createMCPTextResponse(result);
            }
            // Otherwise, return as JSON response
            return createMCPResponse(result);
        }
        catch (error) {
            return createMCPError(error, actionDescription);
        }
    };
}
/**
 * Create a tool handler for methods that return text content
 * @param handler - Async function that processes tool arguments and returns text
 * @param actionDescription - Description of the action (for error messages)
 * @returns Wrapped handler with standard error handling
 */
function createTextToolHandler(handler, actionDescription) {
    return async (args) => {
        try {
            const result = await handler(args);
            return createMCPTextResponse(result);
        }
        catch (error) {
            return createMCPError(error, actionDescription);
        }
    };
}
//# sourceMappingURL=mcp-helpers.js.map