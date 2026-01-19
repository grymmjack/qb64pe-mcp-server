"use strict";
/**
 * Project Build Context Service
 *
 * Stores and retrieves project-specific build configurations to prevent
 * loss of critical build information across conversation summaries.
 *
 * Addresses session problem: "Conversation summarization loses critical build command details"
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectBuildContextService = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const crypto = __importStar(require("crypto"));
class ProjectBuildContextService {
    contextsDir;
    contexts = new Map();
    constructor() {
        this.contextsDir = (0, path_1.join)((0, os_1.homedir)(), ".qb64pe-mcp", "project-contexts");
        this.initializeStorage();
    }
    /**
     * Initialize storage directory
     */
    async initializeStorage() {
        try {
            await fs_1.promises.mkdir(this.contextsDir, { recursive: true });
        }
        catch (error) {
            console.error("[ProjectBuildContext] Failed to initialize storage:", error);
        }
    }
    /**
     * Generate unique hash for project based on directory
     */
    generateProjectHash(projectPath) {
        const normalizedPath = (0, path_1.dirname)(projectPath).toLowerCase();
        return crypto
            .createHash("md5")
            .update(normalizedPath)
            .digest("hex")
            .substring(0, 12);
    }
    /**
     * Get context file path for project
     */
    getContextFilePath(projectHash) {
        return (0, path_1.join)(this.contextsDir, `${projectHash}.json`);
    }
    /**
     * Load context for a project
     */
    async loadContext(sourceFilePath) {
        const projectHash = this.generateProjectHash(sourceFilePath);
        // Check in-memory cache first
        if (this.contexts.has(projectHash)) {
            return this.contexts.get(projectHash);
        }
        // Load from disk
        try {
            const contextFile = this.getContextFilePath(projectHash);
            const data = await fs_1.promises.readFile(contextFile, "utf-8");
            const context = JSON.parse(data);
            // Convert timestamp strings to Date objects
            context.createdAt = new Date(context.createdAt);
            context.updatedAt = new Date(context.updatedAt);
            if (context.lastSuccessfulBuild) {
                context.lastSuccessfulBuild.timestamp = new Date(context.lastSuccessfulBuild.timestamp);
            }
            context.buildHistory = context.buildHistory.map((entry) => ({
                ...entry,
                timestamp: new Date(entry.timestamp),
            }));
            this.contexts.set(projectHash, context);
            return context;
        }
        catch (error) {
            // Context doesn't exist yet
            return null;
        }
    }
    /**
     * Save or update build context for a project
     */
    async saveContext(sourceFilePath, qb64pePath, compilerFlags, outputName, success, executablePath) {
        const projectHash = this.generateProjectHash(sourceFilePath);
        const projectDir = (0, path_1.dirname)(sourceFilePath);
        let context = await this.loadContext(sourceFilePath);
        const fullCommand = this.buildCommandString(qb64pePath, compilerFlags, outputName, sourceFilePath);
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
        }
        else {
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
    buildCommandString(qb64pePath, compilerFlags, outputName, sourceFilePath) {
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
    async persistContext(context) {
        try {
            const contextFile = this.getContextFilePath(context.projectHash);
            await fs_1.promises.writeFile(contextFile, JSON.stringify(context, null, 2), "utf-8");
        }
        catch (error) {
            console.error("[ProjectBuildContext] Failed to persist context:", error);
        }
    }
    /**
     * Check if current parameters differ from last used
     */
    async checkParameterDiff(sourceFilePath, currentFlags, currentOutputName) {
        const context = await this.loadContext(sourceFilePath);
        if (!context) {
            return { differs: false };
        }
        const prevFlags = context.lastUsedCommand.compilerFlags;
        const prevOutputName = context.lastUsedCommand.outputName;
        const flagsDiffer = JSON.stringify(currentFlags.sort()) !== JSON.stringify(prevFlags.sort());
        const outputDiffers = currentOutputName !== prevOutputName;
        if (flagsDiffer || outputDiffers) {
            const suggestions = [];
            if (flagsDiffer) {
                suggestions.push(`Previous flags: [${prevFlags.join(", ")}]`);
                suggestions.push(`Current flags: [${currentFlags.join(", ")}]`);
            }
            if (outputDiffers) {
                suggestions.push(`Previous output: ${prevOutputName || "(auto-generated)"}`);
                suggestions.push(`Current output: ${currentOutputName || "(auto-generated)"}`);
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
    async getProjectStatistics(sourceFilePath) {
        const context = await this.loadContext(sourceFilePath);
        if (!context) {
            return null;
        }
        const totalBuilds = context.buildHistory.length;
        const successfulBuilds = context.buildHistory.filter((b) => b.success).length;
        const failedBuilds = totalBuilds - successfulBuilds;
        const successRate = totalBuilds > 0 ? (successfulBuilds / totalBuilds) * 100 : 0;
        // Find most used flags
        const flagCounts = new Map();
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
            lastBuildDate: context.buildHistory[context.buildHistory.length - 1]?.timestamp,
            mostUsedFlags,
        };
    }
    /**
     * List all projects with build contexts
     */
    async listProjects() {
        try {
            const files = await fs_1.promises.readdir(this.contextsDir);
            const contexts = [];
            for (const file of files) {
                if (file.endsWith(".json")) {
                    try {
                        const data = await fs_1.promises.readFile((0, path_1.join)(this.contextsDir, file), "utf-8");
                        const context = JSON.parse(data);
                        contexts.push({
                            projectPath: context.projectPath,
                            projectHash: context.projectHash,
                            lastBuildDate: new Date(context.updatedAt),
                            totalBuilds: context.buildHistory.length,
                        });
                    }
                    catch (err) {
                        console.error(`[ProjectBuildContext] Error reading ${file}:`, err);
                    }
                }
            }
            return contexts.sort((a, b) => b.lastBuildDate.getTime() - a.lastBuildDate.getTime());
        }
        catch (error) {
            console.error("[ProjectBuildContext] Failed to list projects:", error);
            return [];
        }
    }
    /**
     * Clear context for a specific project
     */
    async clearContext(sourceFilePath) {
        const projectHash = this.generateProjectHash(sourceFilePath);
        const contextFile = this.getContextFilePath(projectHash);
        try {
            await fs_1.promises.unlink(contextFile);
            this.contexts.delete(projectHash);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get storage directory path
     */
    getStorageDir() {
        return this.contextsDir;
    }
}
exports.ProjectBuildContextService = ProjectBuildContextService;
//# sourceMappingURL=project-build-context-service.js.map