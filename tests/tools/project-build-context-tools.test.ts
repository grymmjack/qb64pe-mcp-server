/**
 * Tests for Project Build Context Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerProjectBuildContextTools } from "../../src/tools/project-build-context-tools";
import { ServiceContainer } from "../../src/utils/tool-types";
import { ProjectBuildContextService } from "../../src/services/project-build-context-service";

jest.mock("../../src/utils/mcp-helpers", () => ({
  createMCPResponse: jest.fn((data) => ({
    content: [{ type: "text", text: JSON.stringify(data) }],
  })),
  createMCPError: jest.fn((error) => ({
    isError: true,
    content: [{ type: "text", text: String(error) }],
  })),
  createMCPTextResponse: jest.fn((text) => ({
    content: [{ type: "text", text }],
  })),
}));

describe("Project Build Context Tools", () => {
  let mockServer: McpServer;
  let services: ServiceContainer;
  let handlers: Map<string, Function>;
  let mockBuildContextService: jest.Mocked<ProjectBuildContextService>;

  beforeEach(() => {
    handlers = new Map();

    // Create mock build context service
    mockBuildContextService = {
      loadContext: jest.fn(),
      saveContext: jest.fn(),
      checkParameterDiff: jest.fn(),
      getProjectStatistics: jest.fn(),
      listProjects: jest.fn(),
      clearContext: jest.fn(),
      getStorageDir: jest.fn(),
    } as any;

    mockServer = {
      registerTool: jest.fn((name, schema, handler) => {
        handlers.set(name, handler);
      }),
    } as any;

    services = {
      compilerService: {
        buildContextService: mockBuildContextService,
      },
    } as any;
  });

  describe("get_project_build_context tool", () => {
    beforeEach(() => {
      registerProjectBuildContextTools(mockServer, services);
    });

    it("should return message when no context found", async () => {
      mockBuildContextService.loadContext.mockResolvedValue(null);

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("No Build Context Found");
      expect(result.content[0].text).toContain("/path/to/test.bas");
      expect(mockBuildContextService.loadContext).toHaveBeenCalledWith(
        "/path/to/test.bas",
      );
    });

    it("should return context details when found", async () => {
      const mockContext = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          qb64pePath: "/usr/bin/qb64pe",
          compilerFlags: ["-c", "-w", "-x"],
          outputName: "test",
          sourceFilePath: "/path/to/test.bas",
          fullCommand: "/usr/bin/qb64pe -c -w -x -o test /path/to/test.bas",
        },
        lastSuccessfulBuild: {
          timestamp: new Date("2026-01-19T18:00:00Z"),
          executablePath: "/path/to/test",
          command: "/usr/bin/qb64pe -c -w -x -o test /path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date("2026-01-19T17:00:00Z"),
        updatedAt: new Date("2026-01-19T18:00:00Z"),
      };

      const mockStats = {
        totalBuilds: 5,
        successfulBuilds: 4,
        failedBuilds: 1,
        successRate: 80,
        lastBuildDate: new Date("2026-01-19T18:00:00Z"),
        mostUsedFlags: ["-c", "-w", "-x"],
      };

      mockBuildContextService.loadContext.mockResolvedValue(mockContext);
      mockBuildContextService.getProjectStatistics.mockResolvedValue(mockStats);

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Project Build Context");
      expect(result.content[0].text).toContain("/path/to");
      expect(result.content[0].text).toContain(
        "/usr/bin/qb64pe -c -w -x -o test /path/to/test.bas",
      );
      expect(result.content[0].text).toContain("Total Builds: 5");
      expect(result.content[0].text).toContain("Successful: 4");
      expect(result.content[0].text).toContain("Success Rate: 80.0%");
    });

    it("should include last successful build info when available", async () => {
      const mockContext = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          compilerFlags: ["-c", "-w"],
          fullCommand: "qb64pe -c -w test.bas",
          sourceFilePath: "/path/to/test.bas",
        },
        lastSuccessfulBuild: {
          timestamp: new Date("2026-01-19T18:00:00Z"),
          executablePath: "/path/to/test",
          command: "qb64pe -c -w test.bas",
        },
        buildHistory: [],
        createdAt: new Date("2026-01-19T17:00:00Z"),
        updatedAt: new Date("2026-01-19T18:00:00Z"),
      };

      mockBuildContextService.loadContext.mockResolvedValue(mockContext);
      mockBuildContextService.getProjectStatistics.mockResolvedValue(null);

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Last Successful Build");
      expect(result.content[0].text).toContain("/path/to/test");
    });

    it("should show output name when specified", async () => {
      const mockContext = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          compilerFlags: ["-c"],
          outputName: "custom-name",
          fullCommand: "qb64pe -c -o custom-name test.bas",
          sourceFilePath: "/path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBuildContextService.loadContext.mockResolvedValue(mockContext);
      mockBuildContextService.getProjectStatistics.mockResolvedValue(null);

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("**Output Name:** custom-name");
    });

    it("should show QB64PE path when specified", async () => {
      const mockContext = {
        projectPath: "/path/to",
        projectHash: "def456",
        lastUsedCommand: {
          qb64pePath: "/custom/qb64pe",
          compilerFlags: ["-c"],
          fullCommand: "/custom/qb64pe -c test.bas",
          sourceFilePath: "/path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBuildContextService.loadContext.mockResolvedValue(mockContext);
      mockBuildContextService.getProjectStatistics.mockResolvedValue(null);

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain(
        "**QB64PE Path:** /custom/qb64pe",
      );
    });

    it("should handle errors gracefully", async () => {
      mockBuildContextService.loadContext.mockRejectedValue(
        new Error("Test error"),
      );

      const handler = handlers.get("get_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.isError).toBe(true);
    });
  });

  describe("list_project_build_contexts tool", () => {
    beforeEach(() => {
      registerProjectBuildContextTools(mockServer, services);
    });

    it("should return message when no projects exist", async () => {
      mockBuildContextService.listProjects.mockResolvedValue([]);

      const handler = handlers.get("list_project_build_contexts")!;
      const result = await handler({});

      expect(result.content[0].text).toContain("No Project Build Contexts");
      expect(result.content[0].text).toContain("compile_and_verify_qb64pe");
    });

    it("should list all projects with contexts", async () => {
      const mockProjects = [
        {
          projectPath: "/path/to/project1",
          projectHash: "abc123",
          lastBuildDate: new Date("2026-01-19T18:00:00Z"),
          totalBuilds: 5,
        },
        {
          projectPath: "/path/to/project2",
          projectHash: "def456",
          lastBuildDate: new Date("2026-01-19T17:00:00Z"),
          totalBuilds: 3,
        },
      ];

      mockBuildContextService.listProjects.mockResolvedValue(mockProjects);

      const handler = handlers.get("list_project_build_contexts")!;
      const result = await handler({});

      expect(result.content[0].text).toContain("Project Build Contexts (2)");
      expect(result.content[0].text).toContain("/path/to/project1");
      expect(result.content[0].text).toContain("/path/to/project2");
      expect(result.content[0].text).toContain("Total Builds: 5");
      expect(result.content[0].text).toContain("Total Builds: 3");
      expect(result.content[0].text).toContain("abc123");
      expect(result.content[0].text).toContain("def456");
    });

    it("should include helpful message about viewing details", async () => {
      const mockProjects = [
        {
          projectPath: "/path/to/project",
          projectHash: "abc123",
          lastBuildDate: new Date(),
          totalBuilds: 1,
        },
      ];

      mockBuildContextService.listProjects.mockResolvedValue(mockProjects);

      const handler = handlers.get("list_project_build_contexts")!;
      const result = await handler({});

      expect(result.content[0].text).toContain("get_project_build_context");
    });

    it("should handle errors gracefully", async () => {
      mockBuildContextService.listProjects.mockRejectedValue(
        new Error("Test error"),
      );

      const handler = handlers.get("list_project_build_contexts")!;
      const result = await handler({});

      expect(result.isError).toBe(true);
    });
  });

  describe("clear_project_build_context tool", () => {
    beforeEach(() => {
      registerProjectBuildContextTools(mockServer, services);
    });

    it("should successfully clear context", async () => {
      mockBuildContextService.clearContext.mockResolvedValue(true);

      const handler = handlers.get("clear_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Build Context Cleared");
      expect(result.content[0].text).toContain("/path/to/test.bas");
      expect(result.content[0].text).toContain("new context will be created");
      expect(mockBuildContextService.clearContext).toHaveBeenCalledWith(
        "/path/to/test.bas",
      );
    });

    it("should return message when no context to clear", async () => {
      mockBuildContextService.clearContext.mockResolvedValue(false);

      const handler = handlers.get("clear_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("No Context to Clear");
      expect(result.content[0].text).toContain("/path/to/test.bas");
    });

    it("should handle errors gracefully", async () => {
      mockBuildContextService.clearContext.mockRejectedValue(
        new Error("Test error"),
      );

      const handler = handlers.get("clear_project_build_context")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.isError).toBe(true);
    });
  });

  describe("get_build_context_statistics tool", () => {
    beforeEach(() => {
      registerProjectBuildContextTools(mockServer, services);
    });

    it("should return message when no statistics available", async () => {
      mockBuildContextService.getProjectStatistics.mockResolvedValue(null);

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("No Build Statistics");
      expect(result.content[0].text).toContain("/path/to/test.bas");
      expect(result.content[0].text).toContain("after compiling");
    });

    it("should display comprehensive statistics", async () => {
      const mockStats = {
        totalBuilds: 10,
        successfulBuilds: 8,
        failedBuilds: 2,
        successRate: 80,
        lastBuildDate: new Date("2026-01-19T18:00:00Z"),
        mostUsedFlags: ["-c", "-w", "-x"],
      };

      mockBuildContextService.getProjectStatistics.mockResolvedValue(mockStats);

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Build Statistics");
      expect(result.content[0].text).toContain("Total Builds: 10");
      expect(result.content[0].text).toContain("Successful: 8 (80.0%)");
      expect(result.content[0].text).toContain("Failed: 2 (20.0%)");
      expect(result.content[0].text).toContain("Most Used Compiler Flags");
      expect(result.content[0].text).toContain("-c");
      expect(result.content[0].text).toContain("-w");
      expect(result.content[0].text).toContain("-x");
    });

    it("should include last build date when available", async () => {
      const mockStats = {
        totalBuilds: 5,
        successfulBuilds: 5,
        failedBuilds: 0,
        successRate: 100,
        lastBuildDate: new Date("2026-01-19T18:00:00Z"),
        mostUsedFlags: [],
      };

      mockBuildContextService.getProjectStatistics.mockResolvedValue(mockStats);

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Last Build:");
    });

    it("should handle empty most-used flags", async () => {
      const mockStats = {
        totalBuilds: 1,
        successfulBuilds: 1,
        failedBuilds: 0,
        successRate: 100,
        mostUsedFlags: [],
      };

      mockBuildContextService.getProjectStatistics.mockResolvedValue(mockStats);

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Build Statistics");
      expect(result.content[0].text).not.toContain("Most Used Compiler Flags");
    });

    it("should calculate failure percentage correctly", async () => {
      const mockStats = {
        totalBuilds: 10,
        successfulBuilds: 7,
        failedBuilds: 3,
        successRate: 70,
        mostUsedFlags: [],
      };

      mockBuildContextService.getProjectStatistics.mockResolvedValue(mockStats);

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.content[0].text).toContain("Failed: 3 (30.0%)");
    });

    it("should handle errors gracefully", async () => {
      mockBuildContextService.getProjectStatistics.mockRejectedValue(
        new Error("Test error"),
      );

      const handler = handlers.get("get_build_context_statistics")!;
      const result = await handler({ sourceFilePath: "/path/to/test.bas" });

      expect(result.isError).toBe(true);
    });
  });

  describe("tool registration", () => {
    it("should register all four tools", () => {
      registerProjectBuildContextTools(mockServer, services);

      expect(handlers.has("get_project_build_context")).toBe(true);
      expect(handlers.has("list_project_build_contexts")).toBe(true);
      expect(handlers.has("clear_project_build_context")).toBe(true);
      expect(handlers.has("get_build_context_statistics")).toBe(true);
      expect(handlers.size).toBe(4);
    });

    it("should call server.registerTool with correct schemas", () => {
      registerProjectBuildContextTools(mockServer, services);

      expect(mockServer.registerTool).toHaveBeenCalledTimes(4);

      const calls = (mockServer.registerTool as jest.Mock).mock.calls;

      // Check first tool registration
      expect(calls[0][0]).toBe("get_project_build_context");
      expect(calls[0][1]).toHaveProperty("title");
      expect(calls[0][1]).toHaveProperty("description");
      expect(calls[0][1]).toHaveProperty("inputSchema");
    });
  });
});
