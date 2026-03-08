"use strict";
/**
 * Compiler and syntax tool registrations for QB64PE MCP Server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompilerTools = registerCompilerTools;
const zod_1 = require("zod");
const mcp_helpers_js_1 = require("../utils/mcp-helpers.js");
/**
 * Register all compiler and syntax-related tools
 */
function registerCompilerTools(server, services) {
    // Compiler options tool
    server.registerTool("get_compiler_options", {
        title: "Get QB64PE Compiler Options",
        description: "Get information about QB64PE compiler command-line options and flags",
        inputSchema: {
            platform: zod_1.z
                .enum(["windows", "macos", "linux", "all"])
                .optional()
                .describe("Target platform"),
            optionType: zod_1.z
                .enum(["compilation", "debugging", "optimization", "all"])
                .optional()
                .describe("Type of compiler options"),
        },
    }, async ({ platform = "all", optionType = "all" }) => {
        try {
            const options = await services.compilerService.getCompilerOptions(platform, optionType);
            return (0, mcp_helpers_js_1.createMCPResponse)(options);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "getting compiler options");
        }
    });
    // Syntax validation tool
    server.registerTool("validate_qb64pe_syntax", {
        title: "Validate QB64PE Syntax",
        description: "⚡ WHEN TO USE: Before compiling, when terminal shows syntax errors, or when analyzing code for issues.\n\n" +
            "Validates QB64PE code syntax and provides corrections. Use this tool to:\n" +
            "- Pre-check code before compilation (faster than compiling)\n" +
            "- Analyze syntax errors shown in terminal output\n" +
            "- Get line-specific error details\n" +
            "- Receive actionable suggestions for fixes\n\n" +
            "💡 WORKFLOW: Call this FIRST when seeing compilation errors, then apply fixes, then use compile_and_verify_qb64pe to verify.",
        inputSchema: {
            code: zod_1.z.string().describe("QB64PE code to validate"),
            checkLevel: zod_1.z
                .enum(["basic", "strict", "best-practices"])
                .optional()
                .describe("Level of syntax checking"),
        },
    }, async ({ code, checkLevel = "basic" }) => {
        try {
            const validation = await services.syntaxService.validateSyntax(code, checkLevel);
            return (0, mcp_helpers_js_1.createMCPResponse)(validation);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "validating syntax");
        }
    });
    // Debugging help tool
    server.registerTool("get_debugging_help", {
        title: "Get QB64PE Debugging Help",
        description: "Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc.",
        inputSchema: {
            issue: zod_1.z.string().describe("Description of the debugging issue"),
            platform: zod_1.z
                .enum(["windows", "macos", "linux", "all"])
                .optional()
                .describe("Target platform"),
        },
    }, (0, mcp_helpers_js_1.createTextToolHandler)(async ({ issue, platform = "all" }) => {
        return await services.compilerService.getDebuggingHelp(issue, platform);
    }, "getting debugging help"));
    // Compile and verify tool - enables autonomous compile-verify-fix loops
    server.registerTool("compile_and_verify_qb64pe", {
        title: "⚡ Compile and Verify QB64PE Code ⚡",
        description: "⚙️ Compile a .bas file and return structured errors. " +
            "⏳ Takes 20–120 s — wait for it. Call after EVERY .bas edit; loop until result.success=true. " +
            "Always compiles in headless console mode using QB64PE's -q -m -x path. Auto-reuses stored compile flags from the last successful build after normalizing them for verify mode (set useStoredFlags=false to skip).",
        inputSchema: {
            sourceFilePath: zod_1.z
                .string()
                .describe("Absolute path to the .bas file to compile"),
            qb64pePath: zod_1.z
                .string()
                .optional()
                .describe("QB64PE executable path (auto-detected if omitted)"),
            compilerFlags: zod_1.z
                .array(zod_1.z.string())
                .optional()
                .describe("Compiler flags (default: stored flags or ['-q','-m','-x','-w']; -o is ignored and -c is replaced with headless console compile mode)"),
            useStoredFlags: zod_1.z
                .boolean()
                .optional()
                .describe("Use stored flags from last successful build (default: true)"),
        },
    }, async ({ sourceFilePath, qb64pePath, compilerFlags, useStoredFlags }) => {
        try {
            const result = await services.compilerService.compileAndVerify(sourceFilePath, qb64pePath, compilerFlags, useStoredFlags);
            return (0, mcp_helpers_js_1.createMCPResponse)(result);
        }
        catch (error) {
            return (0, mcp_helpers_js_1.createMCPError)(error, "compiling and verifying code");
        }
    });
}
//# sourceMappingURL=compiler-tools.js.map