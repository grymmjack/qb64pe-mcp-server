"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWikiPlatformTools = registerWikiPlatformTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register wiki platform availability parsing tools
 */
function registerWikiPlatformTools(server, services) {
    server.registerTool("parse_qb64pe_platform_availability", {
        title: "Parse QB64PE Platform Availability",
        description: "Parse platform availability (Windows/Linux/macOS support) from QB64PE wiki for one or more keywords. " +
            "Extracts platform support information from wiki pages including tables and text descriptions. " +
            "Returns which platforms each keyword is available on.",
        inputSchema: {
            keywords: zod_1.z
                .array(zod_1.z.string())
                .describe("Array of QB64PE keywords to check platform availability for (e.g., ['_WINDOWHASFOCUS', '_CONSOLE', 'PRINT'])"),
            updateDatabase: zod_1.z
                .boolean()
                .optional()
                .describe("Whether to automatically update the keywords database with the parsed platform information (default: false)"),
        },
    }, async ({ keywords, updateDatabase = false }) => {
        if (!keywords || keywords.length === 0) {
            return (0, mcp_helpers_js_1.createMCPError)(new Error("No keywords provided"), "parsing platform availability");
        }
        try {
            // Parse platform availability from wiki for each keyword
            const results = await services.wikiService.batchParsePlatformAvailability(keywords);
            const platformData = {};
            // Format results
            for (const [keyword, data] of results.entries()) {
                let availabilityString;
                if (data.windows && data.linux && data.macos) {
                    availabilityString = "All platforms";
                }
                else if (data.windows && data.linux && !data.macos) {
                    availabilityString = "Windows and Linux";
                }
                else if (data.windows && !data.linux && data.macos) {
                    availabilityString = "Windows and macOS";
                }
                else if (!data.windows && data.linux && data.macos) {
                    availabilityString = "Linux and macOS";
                }
                else if (data.windows && !data.linux && !data.macos) {
                    availabilityString = "Windows only";
                }
                else if (!data.windows && data.linux && !data.macos) {
                    availabilityString = "Linux only";
                }
                else if (!data.windows && !data.linux && data.macos) {
                    availabilityString = "macOS only";
                }
                else {
                    availabilityString = "Platform availability unclear";
                }
                platformData[keyword] = {
                    keyword,
                    windows: data.windows,
                    linux: data.linux,
                    macos: data.macos,
                    availabilityString,
                };
            }
            // Update database if requested
            let updateResult;
            if (updateDatabase) {
                const dataForUpdate = new Map();
                for (const [kw, data] of results.entries()) {
                    dataForUpdate.set(kw, {
                        windows: data.windows,
                        linux: data.linux,
                        macos: data.macos,
                    });
                }
                updateResult = services.keywordsService.batchUpdatePlatformAvailability(dataForUpdate);
            }
            return (0, mcp_helpers_js_1.createMCPResponse)({
                success: true,
                totalKeywords: keywords.length,
                foundOnWiki: results.size,
                notFound: keywords.filter((kw) => !results.has(kw)),
                platformData,
                databaseUpdated: updateDatabase,
                updateResult,
                summary: `Parsed platform availability for ${results.size}/${keywords.length} keywords from QB64PE wiki`,
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "parsing platform availability");
        }
    });
}
//# sourceMappingURL=wiki-platform-tools.js.map