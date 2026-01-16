/**
 * Utility functions for MCP server tool registration and response handling
 */

/**
 * Create a standard MCP success response with JSON-formatted data
 * @param data - Data to return in the response
 * @returns MCP response object
 */
export function createMCPResponse(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
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
export function createMCPTextResponse(text: string) {
  return {
    content: [
      {
        type: "text" as const,
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
export function createMCPError(error: unknown, action: string) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return {
    content: [
      {
        type: "text" as const,
        text: `Error ${action}: ${message}`,
      },
    ],
    isError: true,
  };
}

/**
 * Create a tool handler wrapper that provides standard error handling
 * @param handler - Async function that processes tool arguments
 * @param actionDescription - Description of the action (for error messages)
 * @returns Wrapped handler with standard error handling
 */
export function createToolHandler<T extends Record<string, unknown>>(
  handler: (args: T) => Promise<unknown>,
  actionDescription: string,
) {
  return async (args: T) => {
    try {
      const result = await handler(args);

      // If result is already a string, return as text response
      if (typeof result === "string") {
        return createMCPTextResponse(result);
      }

      // Otherwise, return as JSON response
      return createMCPResponse(result);
    } catch (error) {
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
export function createTextToolHandler<T extends Record<string, unknown>>(
  handler: (args: T) => Promise<string>,
  actionDescription: string,
) {
  return async (args: T) => {
    try {
      const result = await handler(args);
      return createMCPTextResponse(result);
    } catch (error) {
      return createMCPError(error, actionDescription);
    }
  };
}
