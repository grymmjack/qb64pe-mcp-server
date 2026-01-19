/**
 * Project Build Context Service
 *
 * Stores and retrieves project-specific build configurations to prevent
 * loss of critical build information across conversation summaries.
 *
 * Addresses session problem: "Conversation summarization loses critical build command details"
 */

import { promises as fs } from "fs";
import { join, dirname, basename } from "path";
import { homedir } from "os";
import * as crypto from "crypto";

export interface ProjectBuildContext {
  projectPath: string;
  projectHash: string;
  lastUsedCommand: {
    qb64pePath?: string;
    compilerFlags: string[];
    outputName?: string;
    sourceFilePath: string;
    fullCommand: string;
  };
  lastSuccessfulBuild?: {
    timestamp: Date;
    executablePath: string;
    command: string;
  };
  buildHistory: Array<{
    timestamp: Date;
    command: string;
    flags: string[];
    success: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectBuildContextService {
  private contextsDir: string;
  private contexts: Map<string, ProjectBuildContext> = new Map();

  constructor() {
    this.contextsDir = join(homedir(), ".qb64pe-mcp", "project-contexts");
    this.initializeStorage();
  }

  /**
   * Initialize storage directory
   */
  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.contextsDir, { recursive: true });
    } catch (error) {
      console.error(
        "[ProjectBuildContext] Failed to initialize storage:",
        error,
      );
    }
  }

  /**
   * Generate unique hash for project based on directory
   */
  private generateProjectHash(projectPath: string): string {
    const normalizedPath = dirname(projectPath).toLowerCase();
    return crypto
      .createHash("md5")
      .update(normalizedPath)
      .digest("hex")
      .substring(0, 12);
  }

  /**
   * Get context file path for project
   */
  private getContextFilePath(projectHash: string): string {
    return join(this.contextsDir, `${projectHash}.json`);
  }

  /**
   * Load context for a project
   */
  async loadContext(
    sourceFilePath: string,
  ): Promise<ProjectBuildContext | null> {
    const projectHash = this.generateProjectHash(sourceFilePath);

    // Check in-memory cache first
    if (this.contexts.has(projectHash)) {
      return this.contexts.get(projectHash)!;
    }

    // Load from disk
    try {
      const contextFile = this.getContextFilePath(projectHash);
      const data = await fs.readFile(contextFile, "utf-8");
      const context: ProjectBuildContext = JSON.parse(data);

      // Convert timestamp strings to Date objects
      context.createdAt = new Date(context.createdAt);
      context.updatedAt = new Date(context.updatedAt);
      if (context.lastSuccessfulBuild) {
        context.lastSuccessfulBuild.timestamp = new Date(
          context.lastSuccessfulBuild.timestamp,
        );
      }
      context.buildHistory = context.buildHistory.map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));

      this.contexts.set(projectHash, context);
      return context;
    } catch (error) {
      // Context doesn't exist yet
      return null;
    }
  }

  /**
   * Save or update build context for a project
   */
  async saveContext(
    sourceFilePath: string,
    qb64pePath: string | undefined,
    compilerFlags: string[],
    outputName: string | undefined,
    success: boolean,
    executablePath?: string,
  ): Promise<ProjectBuildContext> {
    const projectHash = this.generateProjectHash(sourceFilePath);
    const projectDir = dirname(sourceFilePath);

    let context = await this.loadContext(sourceFilePath);

    const fullCommand = this.buildCommandString(
      qb64pePath,
      compilerFlags,
      outputName,
      sourceFilePath,
    );

    if (!context) {
      // Create new context
      context = {
        projectPath: projectDir,
        projectHash,
        lastUsedCommand: {
          qb64pePath,
          compilerFlags,
          outputName,
          sourceFilePath,
          fullCommand,
        },
        buildHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      // Update existing context
      context.lastUsedCommand = {
        qb64pePath,
        compilerFlags,
        outputName,
        sourceFilePath,
        fullCommand,
      };
      context.updatedAt = new Date();
    }

    // Add to build history
    context.buildHistory.push({
      timestamp: new Date(),
      command: fullCommand,
      flags: compilerFlags,
      success,
    });

    // Keep only last 20 builds in history
    if (context.buildHistory.length > 20) {
      context.buildHistory = context.buildHistory.slice(-20);
    }

    // Update last successful build if this one succeeded
    if (success && executablePath) {
      context.lastSuccessfulBuild = {
        timestamp: new Date(),
        executablePath,
        command: fullCommand,
      };
    }

    // Save to disk and cache
    await this.persistContext(context);
    this.contexts.set(projectHash, context);

    return context;
  }

  /**
   * Build command string for display
   */
  private buildCommandString(
    qb64pePath: string | undefined,
    compilerFlags: string[],
    outputName: string | undefined,
    sourceFilePath: string,
  ): string {
    const qb64 = qb64pePath || "qb64pe";
    const flags = compilerFlags.join(" ");
    const output = outputName ? `-o ${outputName}` : "";
    return `${qb64} ${flags} ${output} ${sourceFilePath}`
      .trim()
      .replace(/\s+/g, " ");
  }

  /**
   * Persist context to disk
   */
  private async persistContext(context: ProjectBuildContext): Promise<void> {
    try {
      const contextFile = this.getContextFilePath(context.projectHash);
      await fs.writeFile(
        contextFile,
        JSON.stringify(context, null, 2),
        "utf-8",
      );
    } catch (error) {
      console.error("[ProjectBuildContext] Failed to persist context:", error);
    }
  }

  /**
   * Check if current parameters differ from last used
   */
  async checkParameterDiff(
    sourceFilePath: string,
    currentFlags: string[],
    currentOutputName?: string,
  ): Promise<{
    differs: boolean;
    previousFlags?: string[];
    previousOutputName?: string;
    previousCommand?: string;
    suggestion?: string;
  }> {
    const context = await this.loadContext(sourceFilePath);

    if (!context) {
      return { differs: false };
    }

    const prevFlags = context.lastUsedCommand.compilerFlags;
    const prevOutputName = context.lastUsedCommand.outputName;

    const flagsDiffer =
      JSON.stringify(currentFlags.sort()) !== JSON.stringify(prevFlags.sort());
    const outputDiffers = currentOutputName !== prevOutputName;

    if (flagsDiffer || outputDiffers) {
      const suggestions: string[] = [];

      if (flagsDiffer) {
        suggestions.push(`Previous flags: [${prevFlags.join(", ")}]`);
        suggestions.push(`Current flags: [${currentFlags.join(", ")}]`);
      }

      if (outputDiffers) {
        suggestions.push(
          `Previous output: ${prevOutputName || "(auto-generated)"}`,
        );
        suggestions.push(
          `Current output: ${currentOutputName || "(auto-generated)"}`,
        );
      }

      return {
        differs: true,
        previousFlags: prevFlags,
        previousOutputName: prevOutputName,
        previousCommand: context.lastUsedCommand.fullCommand,
        suggestion: `Build parameters differ from previous build. ${suggestions.join(" | ")}`,
      };
    }

    return { differs: false };
  }

  /**
   * Get build statistics for a project
   */
  async getProjectStatistics(sourceFilePath: string): Promise<{
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
    successRate: number;
    lastBuildDate?: Date;
    mostUsedFlags: string[];
  } | null> {
    const context = await this.loadContext(sourceFilePath);

    if (!context) {
      return null;
    }

    const totalBuilds = context.buildHistory.length;
    const successfulBuilds = context.buildHistory.filter(
      (b) => b.success,
    ).length;
    const failedBuilds = totalBuilds - successfulBuilds;
    const successRate =
      totalBuilds > 0 ? (successfulBuilds / totalBuilds) * 100 : 0;

    // Find most used flags
    const flagCounts = new Map<string, number>();
    context.buildHistory.forEach((build) => {
      build.flags.forEach((flag) => {
        flagCounts.set(flag, (flagCounts.get(flag) || 0) + 1);
      });
    });

    const mostUsedFlags = Array.from(flagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([flag]) => flag);

    return {
      totalBuilds,
      successfulBuilds,
      failedBuilds,
      successRate,
      lastBuildDate:
        context.buildHistory[context.buildHistory.length - 1]?.timestamp,
      mostUsedFlags,
    };
  }

  /**
   * List all projects with build contexts
   */
  async listProjects(): Promise<
    Array<{
      projectPath: string;
      projectHash: string;
      lastBuildDate: Date;
      totalBuilds: number;
    }>
  > {
    try {
      const files = await fs.readdir(this.contextsDir);
      const contexts: Array<{
        projectPath: string;
        projectHash: string;
        lastBuildDate: Date;
        totalBuilds: number;
      }> = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const data = await fs.readFile(
              join(this.contextsDir, file),
              "utf-8",
            );
            const context: ProjectBuildContext = JSON.parse(data);
            contexts.push({
              projectPath: context.projectPath,
              projectHash: context.projectHash,
              lastBuildDate: new Date(context.updatedAt),
              totalBuilds: context.buildHistory.length,
            });
          } catch (err) {
            console.error(`[ProjectBuildContext] Error reading ${file}:`, err);
          }
        }
      }

      return contexts.sort(
        (a, b) => b.lastBuildDate.getTime() - a.lastBuildDate.getTime(),
      );
    } catch (error) {
      console.error("[ProjectBuildContext] Failed to list projects:", error);
      return [];
    }
  }

  /**
   * Clear context for a specific project
   */
  async clearContext(sourceFilePath: string): Promise<boolean> {
    const projectHash = this.generateProjectHash(sourceFilePath);
    const contextFile = this.getContextFilePath(projectHash);

    try {
      await fs.unlink(contextFile);
      this.contexts.delete(projectHash);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage directory path
   */
  getStorageDir(): string {
    return this.contextsDir;
  }
}
