/**
 * Tests for Project Build Context Service
 */

import { ProjectBuildContextService } from "../../src/services/project-build-context-service";
import { promises as fs } from "fs";
import { join } from "path";

// Mock fs module
jest.mock("fs", () => ({
  promises: {
    mkdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
    unlink: jest.fn(),
  },
}));

describe("ProjectBuildContextService", () => {
  let service: ProjectBuildContextService;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    service = new ProjectBuildContextService();
  });

  describe("loadContext", () => {
    it("should return null when context file does not exist", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("ENOENT"));

      const context = await service.loadContext("/path/to/test.bas");

      expect(context).toBeNull();
    });

    it("should load and parse existing context", async () => {
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
        buildHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockContext));

      const context = await service.loadContext("/path/to/test.bas");

      expect(context).toBeDefined();
      expect(context?.projectPath).toBe("/path/to");
      expect(context?.lastUsedCommand.compilerFlags).toEqual([
        "-c",
        "-w",
        "-x",
      ]);
    });
  });

  describe("saveContext", () => {
    it("should create new context for first build", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("ENOENT"));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const context = await service.saveContext(
        "/path/to/test.bas",
        "/usr/bin/qb64pe",
        ["-c", "-w"],
        "test",
        true,
        "/path/to/test",
      );

      expect(context).toBeDefined();
      expect(context.lastUsedCommand.compilerFlags).toEqual(["-c", "-w"]);
      expect(context.lastSuccessfulBuild).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("should update existing context", async () => {
      const existingContext = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          qb64pePath: "/usr/bin/qb64pe",
          compilerFlags: ["-c", "-w"],
          outputName: "test",
          sourceFilePath: "/path/to/test.bas",
          fullCommand: "/usr/bin/qb64pe -c -w -o test /path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (fs.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(existingContext),
      );
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const context = await service.saveContext(
        "/path/to/test.bas",
        "/usr/bin/qb64pe",
        ["-c", "-w", "-x"], // Different flags
        "test",
        true,
        "/path/to/test",
      );

      expect(context.lastUsedCommand.compilerFlags).toEqual(["-c", "-w", "-x"]);
      expect(context.buildHistory.length).toBe(1);
    });

    it("should track build history", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("ENOENT"));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      // First build - success
      let context = await service.saveContext(
        "/path/to/test.bas",
        "/usr/bin/qb64pe",
        ["-c", "-w"],
        "test",
        true,
        "/path/to/test",
      );

      expect(context.buildHistory.length).toBe(1);
      expect(context.buildHistory[0].success).toBe(true);

      // Mock the readFile to return the previous context
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(context));

      // Second build - failure
      context = await service.saveContext(
        "/path/to/test.bas",
        "/usr/bin/qb64pe",
        ["-c", "-w"],
        "test",
        false,
        undefined,
      );

      expect(context.buildHistory.length).toBe(2);
      expect(context.buildHistory[1].success).toBe(false);
    });
  });

  describe("checkParameterDiff", () => {
    it("should return no diff when no previous context exists", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("ENOENT"));

      const diff = await service.checkParameterDiff("/path/to/test.bas", [
        "-c",
        "-w",
      ]);

      expect(diff.differs).toBe(false);
    });

    it("should detect flag differences", async () => {
      const context = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          qb64pePath: "/usr/bin/qb64pe",
          compilerFlags: ["-c", "-w", "-x"],
          outputName: "test",
          sourceFilePath: "/path/to/test.bas",
          fullCommand: "/usr/bin/qb64pe -c -w -x -o test /path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(context));

      const diff = await service.checkParameterDiff(
        "/path/to/test.bas",
        ["-c", "-w"], // Missing -x flag
      );

      expect(diff.differs).toBe(true);
      expect(diff.previousFlags).toEqual(["-c", "-w", "-x"]);
      expect(diff.suggestion).toContain("differ");
    });

    it("should not detect diff when flags are same but in different order", async () => {
      const context = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          qb64pePath: "/usr/bin/qb64pe",
          compilerFlags: ["-c", "-w", "-x"],
          outputName: undefined, // No output name specified
          sourceFilePath: "/path/to/test.bas",
          fullCommand: "/usr/bin/qb64pe -c -w -x /path/to/test.bas",
        },
        buildHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(context));

      const diff = await service.checkParameterDiff(
        "/path/to/test.bas",
        ["-x", "-w", "-c"], // Same flags, different order
      );

      expect(diff.differs).toBe(false);
    });
  });

  describe("getProjectStatistics", () => {
    it("should return null when no context exists", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error("ENOENT"));

      const stats = await service.getProjectStatistics("/path/to/test.bas");

      expect(stats).toBeNull();
    });

    it("should calculate statistics correctly", async () => {
      const context = {
        projectPath: "/path/to",
        projectHash: "abc123",
        lastUsedCommand: {
          qb64pePath: "/usr/bin/qb64pe",
          compilerFlags: ["-c", "-w"],
          outputName: "test",
          sourceFilePath: "/path/to/test.bas",
          fullCommand: "/usr/bin/qb64pe -c -w -o test /path/to/test.bas",
        },
        buildHistory: [
          {
            timestamp: new Date(),
            command: "cmd1",
            flags: ["-c", "-w"],
            success: true,
          },
          {
            timestamp: new Date(),
            command: "cmd2",
            flags: ["-c", "-w", "-x"],
            success: false,
          },
          {
            timestamp: new Date(),
            command: "cmd3",
            flags: ["-c", "-w"],
            success: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(context));

      const stats = await service.getProjectStatistics("/path/to/test.bas");

      expect(stats).toBeDefined();
      expect(stats!.totalBuilds).toBe(3);
      expect(stats!.successfulBuilds).toBe(2);
      expect(stats!.failedBuilds).toBe(1);
      expect(stats!.successRate).toBeCloseTo(66.67, 1);
      expect(stats!.mostUsedFlags).toContain("-c");
      expect(stats!.mostUsedFlags).toContain("-w");
    });
  });

  describe("listProjects", () => {
    it("should return empty array when no contexts exist", async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      const projects = await service.listProjects();

      expect(projects).toEqual([]);
    });

    it("should list all projects with contexts", async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([
        "abc123.json",
        "def456.json",
      ]);

      const context1 = {
        projectPath: "/path/to/project1",
        projectHash: "abc123",
        lastUsedCommand: { fullCommand: "cmd1" },
        buildHistory: [{ timestamp: new Date() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date("2024-01-01").toISOString(),
      };

      const context2 = {
        projectPath: "/path/to/project2",
        projectHash: "def456",
        lastUsedCommand: { fullCommand: "cmd2" },
        buildHistory: [{ timestamp: new Date() }, { timestamp: new Date() }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      };

      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(context1))
        .mockResolvedValueOnce(JSON.stringify(context2));

      const projects = await service.listProjects();

      expect(projects.length).toBe(2);
      expect(projects[0].projectPath).toBe("/path/to/project2"); // Sorted by date, newest first
      expect(projects[1].projectPath).toBe("/path/to/project1");
    });
  });

  describe("clearContext", () => {
    it("should delete context file and return true", async () => {
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await service.clearContext("/path/to/test.bas");

      expect(result).toBe(true);
      expect(fs.unlink).toHaveBeenCalled();
    });

    it("should return false if context does not exist", async () => {
      (fs.unlink as jest.Mock).mockRejectedValue(new Error("ENOENT"));

      const result = await service.clearContext("/path/to/test.bas");

      expect(result).toBe(false);
    });
  });
});
