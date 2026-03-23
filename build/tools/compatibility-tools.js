"use strict";
/**
 * Compatibility tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompatibilityTools = registerCompatibilityTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
const source_file_utils_js_1 = require("../utils/source-file-utils.js");
/**
 * Register all compatibility-related tools
 */
function registerCompatibilityTools(server, services) {
    // Compatibility validation tool
    server.registerTool("validate_qb64pe_compatibility", {
        title: "Review QB64PE Code for Compatibility Problems",
        description: "Review QB64PE code for compatibility, platform, and migration issues before compiling",
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
    server.registerTool("validate_qb64pe_compatibility_file", {
        title: "Review a QB64PE File for Compatibility Problems",
        description: "Read a .bas/.bm/.bi file from disk, review it for QB64PE compatibility issues, and return fixes",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the .bas/.bm/.bi file to review"),
            platform: zod_1.z
                .enum(["windows", "macos", "linux", "all"])
                .optional()
                .describe("Target platform"),
        },
    }, async ({ sourceFilePath, platform = "all" }) => {
        try {
            const { sourceCode } = await (0, source_file_utils_js_1.readSourceFileForTool)(sourceFilePath);
            const issues = await services.compatibilityService.validateCompatibility(sourceCode);
            const platformInfo = await services.compatibilityService.getPlatformCompatibility(platform);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                sourceFilePath,
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
            return (0, mcp_helpers_js_1.createMCPError)(error, "reviewing compatibility from file");
        }
    });
    // Compatibility knowledge search tool
    server.registerTool("search_qb64pe_compatibility", {
        title: "Find Fixes for QB64PE Compatibility Problems",
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
        title: "Get QB64PE Coding Best Practices",
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
    // Keyboard buffer safety validation tool
    server.registerTool("validate_keyboard_buffer_safety", {
        title: "Review Keyboard Buffer Safety",
        description: "Detect potential keyboard buffer leakage issues in QB64PE code. " +
            "Scans for _KEYDOWN() checks without subsequent buffer drain, " +
            "identifies INKEY$ calls that may capture control characters, " +
            "warns about EXIT SUB after _KEYDOWN() without buffer consumption, " +
            "and suggests buffer drain placement for CTRL/ALT/SHIFT+key handlers. " +
            "This helps prevent subtle bugs where CTRL+key combinations produce " +
            "ASCII control characters (e.g., CTRL+3 produces ESC) that leak into " +
            "the keyboard buffer and trigger unintended handlers.",
        inputSchema: {
            code: zod_1.z
                .string()
                .describe("QB64PE code to check for keyboard buffer safety issues"),
        },
    }, async ({ code }) => {
        try {
            const result = await services.compatibilityService.validateKeyboardBufferSafety(code);
            // Format the response with clear sections
            let report = "# Keyboard Buffer Safety Analysis\n\n";
            if (result.hasIssues) {
                report += `## ⚠️ Issues Found: ${result.summary.totalIssues}\n\n`;
                report += `- **High Risk:** ${result.summary.highRisk}\n`;
                report += `- **Medium Risk:** ${result.summary.mediumRisk}\n`;
                report += `- **Low Risk:** ${result.summary.lowRisk}\n\n`;
                report += "### Issues Detail\n\n";
                result.issues.forEach((issue, index) => {
                    const riskEmoji = issue.riskLevel === "high"
                        ? "🔴"
                        : issue.riskLevel === "medium"
                            ? "🟡"
                            : "🟢";
                    report += `${index + 1}. ${riskEmoji} **Line ${issue.line}** - \`${issue.pattern}\`\n`;
                    report += `   - ${issue.message}\n`;
                    report += `   - **Fix:** ${issue.suggestion}\n\n`;
                });
            }
            else {
                report += "## ✅ No Issues Found\n\n";
                report +=
                    "Your code appears to handle keyboard buffer management safely.\n\n";
            }
            report += "### Code Statistics\n";
            report += `- _KEYDOWN() usages: ${result.summary.keydownUsages}\n`;
            report += `- INKEY$ usages: ${result.summary.inkeyUsages}\n`;
            report += `- Buffer drains: ${result.summary.bufferDrains}\n`;
            report += `- CTRL modifier checks: ${result.summary.ctrlModifierChecks}\n`;
            report += `- ALT modifier checks: ${result.summary.altModifierChecks}\n`;
            report += `- SHIFT modifier checks: ${result.summary.shiftModifierChecks}\n\n`;
            if (result.suggestions.length > 0) {
                report += "### Suggestions\n\n";
                result.suggestions.forEach((suggestion) => {
                    report += `- ${suggestion}\n`;
                });
                report += "\n";
            }
            report += "### Best Practices for Keyboard Buffer Safety\n\n";
            result.bestPractices.forEach((practice) => {
                report += `- ${practice}\n`;
            });
            report += "\n### Buffer Drain Pattern\n\n";
            report += "```basic\n";
            report +=
                "' Drain keyboard buffer to prevent control character leakage\n";
            report += "DO WHILE _KEYHIT: LOOP\n";
            report += "```\n\n";
            report += "### Control Character Reference\n\n";
            report += "| CTRL+Key | ASCII Value | Notes |\n";
            report += "|----------|-------------|-------|\n";
            report += "| CTRL+2 | 0 | NULL character |\n";
            report += "| CTRL+3 | 27 | ESC - may trigger ESC handlers! |\n";
            report += "| CTRL+6 | 30 | Record separator |\n";
            report += "| CTRL+A-Z | 1-26 | Standard control characters |\n";
            return (0, mcp_helpers_js_1.createMCPTextResponse)(report);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "validating keyboard buffer safety");
        }
    });
    server.registerTool("validate_keyboard_buffer_safety_file", {
        title: "Review a QB64PE File for Keyboard Buffer Safety",
        description: "Read a .bas/.bm/.bi file from disk and detect keyboard buffer leakage or unsafe modifier handling",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the .bas/.bm/.bi file to review"),
        },
    }, async ({ sourceFilePath }) => {
        try {
            const { sourceCode } = await (0, source_file_utils_js_1.readSourceFileForTool)(sourceFilePath);
            const result = await services.compatibilityService.validateKeyboardBufferSafety(sourceCode);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                sourceFilePath,
                ...result,
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "reviewing keyboard buffer safety from file");
        }
    });
    // Function self-reference validation tool (code string)
    server.registerTool("validate_function_self_reference", {
        title: "Detect Dangerous Function Self-References in QB64PE Code",
        description: "⚡ CRITICAL BUG DETECTOR: In QB64-PE, reading a FUNCTION's own name inside its body " +
            "is a RECURSIVE CALL, not a variable read. Only assignment (FuncName% = value) is safe. " +
            "Any other read (IF FuncName% < 0, passing as argument, using in an expression) triggers " +
            "infinite recursion → stack overflow → SIGSEGV (exit 139).\n\n" +
            "This tool statically scans code for FUNCTION definitions where the function name appears " +
            "in a read context inside the function body, catching this class of bug at edit time.\n\n" +
            "💡 FIX PATTERN: Use a local variable — DIM result AS INTEGER / result = value / " +
            "IF result < 0 THEN result = 0 / FuncName% = result",
        inputSchema: {
            code: zod_1.z.string().describe("QB64PE code to scan for function self-reference bugs"),
        },
    }, async ({ code }) => {
        try {
            const result = await services.compatibilityService.validateFunctionSelfReferences(code);
            return (0, mcp_helpers_js_1.createMCPResponse)(result);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "validating function self-references");
        }
    });
    // Function self-reference validation tool (file path)
    server.registerTool("validate_function_self_reference_file", {
        title: "Detect Dangerous Function Self-References in a QB64PE File",
        description: "⚡ CRITICAL BUG DETECTOR: Read a .bas/.bm/.bi file from disk and scan for FUNCTION " +
            "definitions where the function name is read (not assigned) inside the function body. " +
            "In QB64-PE this causes infinite recursion → SIGSEGV.\n\n" +
            "Use after editing any file that contains FUNCTIONs, or when debugging exit code 139 crashes.",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the .bas/.bm/.bi file to scan"),
        },
    }, async ({ sourceFilePath }) => {
        try {
            const { sourceCode } = await (0, source_file_utils_js_1.readSourceFileForTool)(sourceFilePath);
            const result = await services.compatibilityService.validateFunctionSelfReferences(sourceCode);
            return (0, mcp_helpers_js_1.createMCPResponse)({
                sourceFilePath,
                ...result,
            });
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "scanning file for function self-references");
        }
    });
}
//# sourceMappingURL=compatibility-tools.js.map