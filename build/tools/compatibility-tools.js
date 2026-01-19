"use strict";
/**
 * Compatibility tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompatibilityTools = registerCompatibilityTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all compatibility-related tools
 */
function registerCompatibilityTools(server, services) {
    // Compatibility validation tool
    server.registerTool("validate_qb64pe_compatibility", {
        title: "Validate QB64PE Compatibility",
        description: "Check code for QB64PE compatibility issues and get solutions",
        inputSchema: {
            code: zod_1.z
                .string()
                .describe("QB64PE code to check for compatibility issues"),
            platform: zod_1.z
                .enum(["windows", "macos", "linux", "all"])
                .optional()
                .describe("Target platform"),
        },
    }, async ({ code, platform = "all" }) => {
        try {
            const issues = await services.compatibilityService.validateCompatibility(code);
            const platformInfo = await services.compatibilityService.getPlatformCompatibility(platform);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                issues,
                platformInfo,
                summary: {
                    totalIssues: issues.length,
                    errors: issues.filter((i) => i.severity === "error").length,
                    warnings: issues.filter((i) => i.severity === "warning")
                        .length,
                },
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "validating compatibility");
        }
    });
    // Compatibility knowledge search tool
    server.registerTool("search_qb64pe_compatibility", {
        title: "Search QB64PE Compatibility Knowledge",
        description: "Search for compatibility issues, solutions, and best practices",
        inputSchema: {
            query: zod_1.z.string().describe("Search query for compatibility knowledge"),
            category: zod_1.z
                .enum([
                "function_return_types",
                "console_directives",
                "multi_statement_lines",
                "array_declarations",
                "missing_functions",
                "legacy_keywords",
                "device_access",
                "platform_specific",
                "best_practices",
                "debugging",
                "all",
            ])
                .optional()
                .describe("Specific compatibility category to search"),
        },
    }, async ({ query, category }) => {
        try {
            const results = await services.compatibilityService.searchCompatibility(query);
            const filteredResults = category && category !== "all"
                ? results.filter((r) => r.category === category)
                : results;
            return (0, mcp_helpers_js_1.createMCPResponse)(filteredResults);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "searching compatibility knowledge");
        }
    });
    // Best practices guidance tool
    server.registerTool("get_qb64pe_best_practices", {
        title: "Get QB64PE Best Practices",
        description: "Get best practices and coding guidelines for QB64PE development",
        inputSchema: {
            topic: zod_1.z
                .enum([
                "syntax",
                "debugging",
                "performance",
                "cross_platform",
                "code_organization",
                "all",
            ])
                .optional()
                .describe("Specific topic for best practices"),
        },
    }, async ({ topic = "all" }) => {
        try {
            const practices = await services.compatibilityService.getBestPractices();
            let guidance = "# QB64PE Best Practices\n\n";
            if (topic === "debugging" || topic === "all") {
                const debuggingHelp = await services.compatibilityService.getDebuggingGuidance();
                guidance += debuggingHelp + "\n\n";
            }
            guidance += "## General Guidelines\n";
            practices.forEach((practice) => {
                guidance += `- ${practice}\n`;
            });
            return (0, mcp_helpers_js_1.createMCPTextResponse)(guidance);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting best practices");
        }
    });
}
//# sourceMappingURL=compatibility-tools.js.map