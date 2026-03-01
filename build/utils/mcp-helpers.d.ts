/**
 * Utility functions for MCP server tool registration and response handling
 */
/**
 * Create a standard MCP success response with JSON-formatted data
 * @param data - Data to return in the response
 * @returns MCP response object
 */
export declare function createMCPResponse(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
/**
 * Create a standard MCP success response with plain text
 * @param text - Text content to return
 * @returns MCP response object
 */
export declare function createMCPTextResponse(text: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
/**
 * Create a standard MCP error response
 * @param error - Error object or unknown error
 * @param action - Description of the action that failed
 * @returns MCP error response object
 */
export declare function createMCPError(error: unknown, action: string): {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
};
/**
 * Create an MCP response that embeds an image (base64) so the LLM can see it.
 * @param base64Data - Raw base64-encoded image bytes (no data-URL prefix)
 * @param mimeType - MIME type, e.g. 'image/png'
 * @param caption - Optional text shown alongside the image
 */
export declare function createMCPImageResponse(base64Data: string, mimeType?: string, caption?: string): {
    content: ({
        type: "text";
        text: string;
    } | {
        type: "image";
        data: string;
        mimeType: string;
    })[];
};
/**
 * Create a tool handler wrapper that provides standard error handling
 * @param handler - Async function that processes tool arguments
 * @param actionDescription - Description of the action (for error messages)
 * @returns Wrapped handler with standard error handling
 */
export declare function createToolHandler<T extends Record<string, unknown>>(handler: (args: T) => Promise<unknown>, actionDescription: string): (args: T) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
/**
 * Create a tool handler for methods that return text content
 * @param handler - Async function that processes tool arguments and returns text
 * @param actionDescription - Description of the action (for error messages)
 * @returns Wrapped handler with standard error handling
 */
export declare function createTextToolHandler<T extends Record<string, unknown>>(handler: (args: T) => Promise<string>, actionDescription: string): (args: T) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=mcp-helpers.d.ts.map