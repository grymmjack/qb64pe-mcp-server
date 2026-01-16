/**
 * Unit tests for MCP helper functions
 */

import {
  createMCPResponse,
  createMCPTextResponse,
  createMCPError,
  createToolHandler,
  createTextToolHandler,
} from "../../src/utils/mcp-helpers";

describe("MCP Helpers", () => {
  describe("createMCPResponse", () => {
    it("should create response with object content", () => {
      const data = { foo: "bar", count: 42 };
      const response = createMCPResponse(data);

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe("text");
      const text = response.content[0].text;
      const parsed = JSON.parse(text);
      expect(parsed.foo).toBe("bar");
      expect(parsed.count).toBe(42);
    });

    it("should create response with array content", () => {
      const data = [1, 2, 3];
      const response = createMCPResponse(data);

      expect(response.content).toHaveLength(1);
      const text = response.content[0].text;
      const parsed = JSON.parse(text);
      expect(parsed).toEqual([1, 2, 3]);
    });

    it("should handle nested objects", () => {
      const data = {
        user: { name: "Test", age: 30 },
        items: ["a", "b", "c"],
      };
      const response = createMCPResponse(data);

      const text = response.content[0].text;
      const parsed = JSON.parse(text);
      expect(parsed.user.name).toBe("Test");
      expect(parsed.items).toEqual(["a", "b", "c"]);
    });
  });

  describe("createMCPTextResponse", () => {
    it("should create response with plain text", () => {
      const text = "Hello, World!";
      const response = createMCPTextResponse(text);

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe("text");
      expect(response.content[0].text).toBe(text);
    });

    it("should handle multiline text", () => {
      const text = "Line 1\nLine 2\nLine 3";
      const response = createMCPTextResponse(text);

      expect(response.content[0].text).toBe(text);
    });

    it("should handle empty string", () => {
      const response = createMCPTextResponse("");

      expect(response.content).toHaveLength(1);
      expect(response.content[0].text).toBe("");
    });
  });

  describe("createMCPError", () => {
    it("should create error response from Error object", () => {
      const error = new Error("Test error message");
      const response = createMCPError(error, "test operation");

      expect(response.content).toHaveLength(1);
      expect(response.content[0].type).toBe("text");
      expect(response.content[0].text).toContain("Error");
      expect(response.content[0].text).toContain("test operation");
      expect(response.content[0].text).toContain("Test error message");
      expect(response.isError).toBe(true);
    });

    it("should handle error without message", () => {
      const error = new Error();
      const response = createMCPError(error, "operation");

      expect(response.content[0].text).toContain("Error");
      expect(response.isError).toBe(true);
    });

    it("should handle string error", () => {
      const response = createMCPError("String error", "parsing");

      expect(response.content[0].text).toContain("Error");
      expect(response.content[0].text).toContain("parsing");
      expect(response.isError).toBe(true);
    });

    it("should handle unknown error type", () => {
      const response = createMCPError({ custom: "error" }, "processing");

      expect(response.content[0].text).toContain("Error");
      expect(response.isError).toBe(true);
    });

    it("should include operation context", () => {
      const error = new Error("Database connection failed");
      const response = createMCPError(error, "connecting to database");

      expect(response.content[0].text).toContain("connecting to database");
    });
  });

  describe("Response structure", () => {
    it("should have correct content array structure", () => {
      const response = createMCPTextResponse("test");

      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content[0]).toHaveProperty("type");
      expect(response.content[0]).toHaveProperty("text");
    });

    it("should set isError flag for errors", () => {
      const errorResponse = createMCPError(new Error("fail"), "test");
      expect(errorResponse.isError).toBe(true);
    });

    it("should not have isError flag for success responses", () => {
      const successResponse = createMCPResponse({ success: true });
      expect("isError" in successResponse).toBe(false);
    });
  });

  describe("createToolHandler", () => {
    it("should handle successful string result", async () => {
      const handler = async () => "Success message";
      const wrappedHandler = createToolHandler(handler, "test operation");

      const result = await wrappedHandler({});
      expect(result.content[0].text).toBe("Success message");
    });

    it("should handle successful object result", async () => {
      const handler = async () => ({ status: "ok", count: 5 });
      const wrappedHandler = createToolHandler(handler, "test operation");

      const result = await wrappedHandler({});
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe("ok");
      expect(parsed.count).toBe(5);
    });

    it("should handle errors in handler", async () => {
      const handler = async () => {
        throw new Error("Handler failed");
      };
      const wrappedHandler = createToolHandler(handler, "failing operation");

      const result = await wrappedHandler({});
      expect("isError" in result).toBe(true);
      expect(result.content[0].text).toContain("failing operation");
    });

    it("should pass arguments to handler", async () => {
      const handler = async (args: { value: number }) => args.value * 2;
      const wrappedHandler = createToolHandler(handler, "multiply");

      const result = await wrappedHandler({ value: 21 });
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed).toBe(42);
    });
  });

  describe("createTextToolHandler", () => {
    it("should handle successful text result", async () => {
      const handler = async () => "Text response";
      const wrappedHandler = createTextToolHandler(handler, "text operation");

      const result = await wrappedHandler({});
      expect(result.content[0].text).toBe("Text response");
    });

    it("should handle errors in handler", async () => {
      const handler = async () => {
        throw new Error("Text handler failed");
      };
      const wrappedHandler = createTextToolHandler(handler, "text operation");

      const result = await wrappedHandler({});
      expect("isError" in result).toBe(true);
      expect(result.content[0].text).toContain("text operation");
    });

    it("should pass arguments to handler", async () => {
      const handler = async (args: { name: string }) => `Hello, ${args.name}!`;
      const wrappedHandler = createTextToolHandler(handler, "greet");

      const result = await wrappedHandler({ name: "World" });
      expect(result.content[0].text).toBe("Hello, World!");
    });
  });
});
