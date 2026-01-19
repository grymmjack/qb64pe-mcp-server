"use strict";
/**
 * Project Build Context Tools
 *
 * Tools for managing project-specific build configurations
 * to prevent loss of critical build information across conversation summaries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProjectBuildContextTools = registerProjectBuildContextTools;
const zod_1 = require("zod");
const mcp_helpers_1 = require("../utils/mcp-helpers");
function registerProjectBuildContextTools(server, services) {
    /**
     * Get build context for a project
     */
    server.registerTool("get_project_build_context", {
        title: "Get Project Build Context",
        description: "🔍 Retrieve stored build configuration for a QB64PE project.\n\n" +
            "Returns the last used compilation command, flags, and build history for a project. " +
            "Use this to check what compilation parameters were used previously, preventing loss of " +
            "critical build information across conversation summaries.\n\n" +
            "💡 WHEN TO USE:\n" +
            "- When resuming work on a project after conversation summarization\n" +
            "- Before compiling to check if you should use different flags\n" +
            "- To understand the build history and success rate of a project\n\n" +
            "Addresses the problem: 'Conversation summarization loses critical build command details'",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the QB64PE source file (.bas)"),
        },
    }, async ({ sourceFilePath }) => {
        try {
            const context = await services.compilerService.buildContextService.loadContext(sourceFilePath);
            if (!context) {
                return (0, mcp_helpers_1.createMCPTextResponse)(`📋 **No Build Context Found**\n\n` +
                    `No previous build context exists for:\n${sourceFilePath}\n\n` +
                    `This is the first time this project is being compiled through the MCP server.`);
            }
            const stats = await services.compilerService.buildContextService.getProjectStatistics(sourceFilePath);
            let response = `📋 **Project Build Context**\n\n`;
            response += `**Project:** ${context.projectPath}\n\n`;
            response += `**Last Used Command:**\n`;
            response += `\`\`\`\n${context.lastUsedCommand.fullCommand}\n\`\`\`\n\n`;
            response += `**Last Used Flags:** ${JSON.stringify(context.lastUsedCommand.compilerFlags)}\n`;
            if (context.lastUsedCommand.outputName) {
                response += `**Output Name:** ${context.lastUsedCommand.outputName}\n`;
            }
            if (context.lastUsedCommand.qb64pePath) {
                response += `**QB64PE Path:** ${context.lastUsedCommand.qb64pePath}\n`;
            }
            response += `\n`;
            if (context.lastSuccessfulBuild) {
                response += `**Last Successful Build:**\n`;
                response += `- Date: ${context.lastSuccessfulBuild.timestamp.toLocaleString()}\n`;
                response += `- Executable: ${context.lastSuccessfulBuild.executablePath}\n`;
                response += `- Command: \`${context.lastSuccessfulBuild.command}\`\n\n`;
            }
            if (stats) {
                response += `**Build Statistics:**\n`;
                response += `- Total Builds: ${stats.totalBuilds}\n`;
                response += `- Successful: ${stats.successfulBuilds}\n`;
                response += `- Failed: ${stats.failedBuilds}\n`;
                response += `- Success Rate: ${stats.successRate.toFixed(1)}%\n`;
                if (stats.mostUsedFlags.length > 0) {
                    response += `- Most Used Flags: ${stats.mostUsedFlags.join(", ")}\n`;
                }
                response += `\n`;
            }
            response += `**Context Created:** ${context.createdAt.toLocaleString()}\n`;
            response += `**Last Updated:** ${context.updatedAt.toLocaleString()}\n`;
            return (0, mcp_helpers_1.createMCPTextResponse)(response);
        }
        catch (error) {
            return (0, mcp_helpers_1.createMCPError)(error, "getting project build context");
        }
    });
    /**
     * List all projects with build contexts
     */
    server.registerTool("list_project_build_contexts", {
        title: "List All Project Build Contexts",
        description: "📚 List all QB64PE projects that have stored build contexts.\n\n" +
            "Shows all projects with saved compilation history, helping you identify " +
            "which projects have established build configurations.\n\n" +
            "💡 WHEN TO USE:\n" +
            "- To see all projects you've been working on\n" +
            "- To check if a project has a build context before compiling\n" +
            "- To manage and clean up old project contexts",
        inputSchema: {},
    }, async () => {
        try {
            const projects = await services.compilerService.buildContextService.listProjects();
            if (projects.length === 0) {
                return (0, mcp_helpers_1.createMCPTextResponse)(`📚 **No Project Build Contexts**\n\n` +
                    `No projects have build contexts yet. Build contexts are created automatically ` +
                    `when you compile QB64PE projects using compile_and_verify_qb64pe.`);
            }
            let response = `📚 **Project Build Contexts (${projects.length})**\n\n`;
            projects.forEach((project, index) => {
                response += `${index + 1}. **${project.projectPath}**\n`;
                response += `   - Last Build: ${project.lastBuildDate.toLocaleString()}\n`;
                response += `   - Total Builds: ${project.totalBuilds}\n`;
                response += `   - Hash: ${project.projectHash}\n\n`;
            });
            response += `💡 Use \`get_project_build_context\` with a source file path to see full details.`;
            return (0, mcp_helpers_1.createMCPTextResponse)(response);
        }
        catch (error) {
            return (0, mcp_helpers_1.createMCPError)(error, "listing project build contexts");
        }
    });
    /**
     * Clear build context for a project
     */
    server.registerTool("clear_project_build_context", {
        title: "Clear Project Build Context",
        description: "🗑️ Clear stored build context for a specific project.\n\n" +
            "Removes the saved build history and configuration for a project. " +
            "Use this when you want to start fresh with a project or if the stored " +
            "context is outdated.\n\n" +
            "⚠️ WARNING: This action cannot be undone!",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the QB64PE source file (.bas)"),
        },
    }, async ({ sourceFilePath }) => {
        try {
            const success = await services.compilerService.buildContextService.clearContext(sourceFilePath);
            if (success) {
                return (0, mcp_helpers_1.createMCPTextResponse)(`✅ **Build Context Cleared**\n\n` +
                    `Successfully removed build context for:\n${sourceFilePath}\n\n` +
                    `A new context will be created on the next build.`);
            }
            else {
                return (0, mcp_helpers_1.createMCPTextResponse)(`⚠️ **No Context to Clear**\n\n` +
                    `No build context found for:\n${sourceFilePath}`);
            }
        }
        catch (error) {
            return (0, mcp_helpers_1.createMCPError)(error, "clearing project build context");
        }
    });
    /**
     * Get build context statistics
     */
    server.registerTool("get_build_context_statistics", {
        title: "Get Build Context Statistics",
        description: "📊 Get detailed build statistics for a project.\n\n" +
            "Returns comprehensive statistics about build success rate, " +
            "most used flags, and build patterns.",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the QB64PE source file (.bas)"),
        },
    }, async ({ sourceFilePath }) => {
        try {
            const stats = await services.compilerService.buildContextService.getProjectStatistics(sourceFilePath);
            if (!stats) {
                return (0, mcp_helpers_1.createMCPTextResponse)(`📊 **No Build Statistics**\n\n` +
                    `No build history found for:\n${sourceFilePath}\n\n` +
                    `Statistics will be available after compiling the project.`);
            }
            let response = `📊 **Build Statistics**\n\n`;
            response += `**Overall Performance:**\n`;
            response += `- Total Builds: ${stats.totalBuilds}\n`;
            response += `- Successful: ${stats.successfulBuilds} (${stats.successRate.toFixed(1)}%)\n`;
            response += `- Failed: ${stats.failedBuilds} (${(100 - stats.successRate).toFixed(1)}%)\n\n`;
            if (stats.lastBuildDate) {
                response += `**Last Build:** ${stats.lastBuildDate.toLocaleString()}\n\n`;
            }
            if (stats.mostUsedFlags.length > 0) {
                response += `**Most Used Compiler Flags:**\n`;
                stats.mostUsedFlags.forEach((flag, index) => {
                    response += `${index + 1}. \`${flag}\`\n`;
                });
                response += `\n`;
            }
            return (0, mcp_helpers_1.createMCPTextResponse)(response);
        }
        catch (error) {
            return (0, mcp_helpers_1.createMCPError)(error, "getting build statistics");
        }
    });
}
//# sourceMappingURL=project-build-context-tools.js.map