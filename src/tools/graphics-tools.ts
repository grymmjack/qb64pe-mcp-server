/**
 * Graphics and screenshot tool registrations for QB64PE MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createMCPResponse,
  createMCPError,
  createMCPTextResponse,
  createMCPImageResponse,
} from "../utils/mcp-helpers.js";
import { ServiceContainer } from "../utils/tool-types.js";

/**
 * Register all graphics and screenshot-related tools
 */
export function registerGraphicsTools(
  server: McpServer,
  services: ServiceContainer,
): void {
  server.registerTool(
    "analyze_qb64pe_graphics_screenshot",
    {
      title: "Inspect a QB64PE Screenshot Saved with _SAVEIMAGE",
      description:
        "📷 View and analyze a screenshot saved by a QB64PE program using _SAVEIMAGE.\n\n" +
        "🔧 **HOW TO CAPTURE A SCREENSHOT FROM QB64PE CODE:**\n" +
        "Add this line near the END of your QB64PE program (just before END or _EXIT):\n" +
        '    _SAVEIMAGE "/absolute/path/to/screenshot.png"\n' +
        "Then compile and run the program. Once it exits the file will exist on disk.\n" +
        "Finally call this tool with that same path — the image will be returned so you\n" +
        "can see exactly what the program drew.\n\n" +
        "⚠️ The file must already exist (written by _SAVEIMAGE) before calling this tool.",
      inputSchema: {
        screenshotPath: z
          .string()
          .describe(
            "Absolute path to the PNG/JPG/GIF file written by _SAVEIMAGE",
          ),
        analysisType: z
          .enum([
            "shapes",
            "colors",
            "layout",
            "text",
            "quality",
            "comprehensive",
          ])
          .optional()
          .describe("Type of analysis to perform (default: comprehensive)"),
        expectedElements: z
          .array(z.string())
          .optional()
          .describe("List of expected visual elements to look for"),
        programCode: z
          .string()
          .optional()
          .describe(
            "Original QB64PE code that generated the screenshot for context",
          ),
      },
    },
    async ({
      screenshotPath,
      analysisType = "comprehensive",
      expectedElements,
      programCode,
    }) => {
      try {
        const analysis = await services.screenshotService.analyzeScreenshot(
          screenshotPath,
          {
            analysisType,
            expectedElements,
            programCode,
          },
        );
        if (analysis.success && analysis.base64Data && analysis.mimeType) {
          return createMCPImageResponse(
            analysis.base64Data,
            analysis.mimeType,
            `📷 Screenshot: ${screenshotPath} (${analysis.fileSizeBytes} bytes)`,
          );
        }
        return createMCPResponse(analysis);
      } catch (error) {
        return createMCPError(error, "analyzing screenshot");
      }
    },
  );

  server.registerTool(
    "generate_qb64pe_screenshot_analysis_template",
    {
      title: "Generate an _SAVEIMAGE Screenshot Capture Stub",
      description:
        "Generate QB64PE code that writes a screenshot with _SAVEIMAGE so the result can be analyzed reliably",
      inputSchema: {
        programType: z
          .enum(["shapes", "animation", "game", "visualization"])
          .optional(),
        expectedElements: z.array(z.string()).optional(),
      },
    },
    async ({ programType = "shapes", expectedElements }) => {
      try {
        const template = services.screenshotService.generateAnalysisTemplate(
          programType,
          expectedElements,
        );
        return createMCPTextResponse(template);
      } catch (error) {
        return createMCPError(error, "generating screenshot analysis template");
      }
    },
  );

  // capture_qb64pe_screenshot, get_qb64pe_processes, start_screenshot_monitoring,
  // stop_screenshot_monitoring removed — screenshots are taken from within QB64PE
  // code using _SAVEIMAGE, then read back via analyze_qb64pe_graphics_screenshot.

  server.registerTool(
    "start_screenshot_watching",
    {
      title: "Watch for New _SAVEIMAGE Screenshots",
      description:
        "Watch a directory where QB64PE programs save _SAVEIMAGE output and analyze new image files",
      inputSchema: {
        directory: z
          .string()
          .optional()
          .describe("Directory to watch for screenshots"),
      },
    },
    async ({ directory }) => {
      try {
        const status = services.screenshotWatcher.startWatching(directory);
        return createMCPResponse(status);
      } catch (error) {
        return createMCPError(error, "starting screenshot watching");
      }
    },
  );

  server.registerTool(
    "stop_screenshot_watching",
    {
      title: "Stop Watching _SAVEIMAGE Screenshots",
      description:
        "Stop watching for new screenshot files written by _SAVEIMAGE",
      inputSchema: {},
    },
    async () => {
      try {
        const status = services.screenshotWatcher.stopWatching();
        return createMCPResponse(status);
      } catch (error) {
        return createMCPError(error, "stopping screenshot watching");
      }
    },
  );

  server.registerTool(
    "get_screenshot_analysis_history",
    {
      title: "Get _SAVEIMAGE Screenshot Analysis History",
      description:
        "Get analysis history for screenshots written by QB64PE via _SAVEIMAGE",
      inputSchema: {
        limit: z
          .number()
          .optional()
          .describe("Maximum number of history items (default: 10)"),
      },
    },
    async ({ limit = 10 }) => {
      try {
        const history = services.screenshotWatcher.getAnalysisHistory(limit);
        const recentScreenshots =
          services.screenshotWatcher.getRecentScreenshots(5);
        const status = services.screenshotWatcher.getStatus();

        return createMCPResponse({
          history,
          recentScreenshots,
          status,
          summary: {
            totalAnalyses: history.length,
            successful: history.filter((h: any) => h.success).length,
            failed: history.filter((h: any) => !h.success).length,
            lastAnalysis: history[0]?.timestamp || null,
          },
        });
      } catch (error) {
        return createMCPError(error, "getting analysis history");
      }
    },
  );

  server.registerTool(
    "get_automation_status",
    {
      title: "List _SAVEIMAGE Screenshot Files",
      description:
        "List screenshot files saved by QB64PE programs via _SAVEIMAGE",
      inputSchema: {},
    },
    async () => {
      try {
        const recentFiles = services.screenshotService
          .getScreenshotFiles()
          .slice(0, 10);
        return createMCPResponse({
          screenshotDir: recentFiles[0]
            ? require("path").dirname(recentFiles[0])
            : null,
          totalScreenshots: recentFiles.length,
          recentFiles,
          hint: 'Add  _SAVEIMAGE "path.png"  near END of QB64PE program, compile and run, then call analyze_qb64pe_graphics_screenshot.',
        });
      } catch (error) {
        return createMCPError(error, "getting screenshot status");
      }
    },
  );

  // get_qb64pe_graphics_guide removed — method was never implemented.

  server.registerTool(
    "generate_qb64pe_echo_functions",
    {
      title: "Generate QB64PE ECHO Functions",
      description:
        "Generate ECHO functions for simplified console output in graphics programs",
      inputSchema: {
        includeAllVariants: z
          .boolean()
          .optional()
          .describe("Include all ECHO variants (default: true)"),
      },
    },
    async ({ includeAllVariants = true }) => {
      try {
        const functions =
          services.loggingService.generateEchoFunctions(includeAllVariants);
        return createMCPTextResponse(functions);
      } catch (error) {
        return createMCPError(error, "generating ECHO functions");
      }
    },
  );
}
