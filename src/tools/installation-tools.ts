/**
 * Installation tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createMCPTextResponse,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all installation-related tools
 */
export function registerInstallationTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "detect_qb64pe_installation",
    {
      title: "Detect QB64PE Installation",
      description: "Automatically detect QB64PE installation on the system",
      inputSchema: {},
    },
    async () => {
      try {
        const installation =
          await services.installationService.detectInstallation();
        return createMCPResponse(installation);
      } catch (error) {
        return createMCPError(error, "detecting QB64PE installation");
      }
    },
  );

  server.registerTool(
    "get_qb64pe_path_configuration",
    {
      title: "Get QB64PE PATH Configuration Guide",
      description:
        "Get platform-specific instructions for adding QB64PE to system PATH",
      inputSchema: {
        installPath: z
          .string()
          .optional()
          .describe("Known QB64PE installation path (if any)"),
      },
    },
    async ({ installPath }) => {
      try {
        const config =
          services.installationService.getPathConfiguration(installPath);
        return createMCPResponse({
          platform: config.platform,
          currentPath: config.currentPath,
          pathSeparator: config.pathSeparator,
          instructions: config.instructions,
          commonInstallPaths: config.commonInstallPaths,
          downloadUrl: config.downloadUrl,
        });
      } catch (error) {
        return createMCPError(error, "getting PATH configuration");
      }
    },
  );

  server.registerTool(
    "validate_qb64pe_path",
    {
      title: "Validate QB64PE Installation Path",
      description:
        "Check if a specific path contains a valid QB64PE installation",
      inputSchema: {
        testPath: z
          .string()
          .describe("Directory path to test for QB64PE installation"),
      },
    },
    async ({ testPath }) => {
      try {
        const validation =
          await services.installationService.validatePath(testPath);
        return createMCPResponse({
          testPath,
          validation,
          result: validation.valid
            ? `Valid QB64PE installation found${validation.version ? ` (${validation.version})` : ""}`
            : "No valid QB64PE installation found at this path",
        });
      } catch (error) {
        return createMCPError(error, "validating path");
      }
    },
  );

  server.registerTool(
    "generate_qb64pe_installation_report",
    {
      title: "Generate QB64PE Installation Report",
      description:
        "Generate a comprehensive report about QB64PE installation status and configuration",
      inputSchema: {},
    },
    async () => {
      try {
        const report =
          await services.installationService.generateInstallationReport();
        return createMCPTextResponse(report);
      } catch (error) {
        return createMCPError(error, "generating installation report");
      }
    },
  );

  server.registerTool(
    "get_qb64pe_installation_guidance",
    {
      title: "Get QB64PE Installation Guidance for LLMs",
      description:
        "Get user-friendly guidance for QB64PE installation and PATH configuration, optimized for LLM responses",
      inputSchema: {},
    },
    async () => {
      try {
        const installation =
          await services.installationService.detectInstallation();
        const guidance =
          services.installationService.generateInstallationGuidance(
            installation,
          );

        const llmGuidance = `# QB64PE Installation Status

${guidance}

## 🤖 **For LLMs: Important Reminders**

When helping users with QB64PE:

1. **Always check installation first** - Use the detection tools before suggesting QB64PE commands
2. **Provide PATH instructions** - If QB64PE is installed but not in PATH, give clear platform-specific instructions
3. **Be platform-aware** - Instructions differ significantly between Windows, macOS, and Linux
4. **Suggest alternatives** - If installation is complex, recommend package managers or pre-built binaries
5. **Verify after setup** - Always have users test with \`qb64pe --version\` after configuration

## 🔧 **Quick Troubleshooting**

**Command not found?**
- Check if QB64PE is installed: Use \`detect_qb64pe_installation\`
- Add to PATH: Use \`get_qb64pe_path_configuration\`
- Verify installation: Use \`validate_qb64pe_path\`

**Installation issues?**
- Generate full report: Use \`generate_qb64pe_installation_report\`
- Get comprehensive guidance: Use \`get_qb64pe_installation_guidance\`

Remember: QB64PE installation and PATH configuration is often the first hurdle for users!`;

        return createMCPTextResponse(llmGuidance);
      } catch (error) {
        return createMCPError(error, "getting installation guidance");
      }
    },
  );
}
