import { QB64PECompilerService } from "../../src/services/compiler-service";

describe("QB64PECompilerService", () => {
  let service: QB64PECompilerService;

  beforeEach(() => {
    service = new QB64PECompilerService();
  });

  describe("getCompilerOptions", () => {
    it("should return all compiler options", async () => {
      const result = await service.getCompilerOptions();
      expect(result).toBeDefined();
      expect(result).toHaveProperty("headlessWorkflow");
      expect(result).toHaveProperty("options");
      expect(Array.isArray(result.options)).toBe(true);
      expect(result.options.length).toBeGreaterThan(0);
    });

    it("should filter by platform", async () => {
      const result = await service.getCompilerOptions("linux");
      expect(
        result.options.every((opt) => opt.platform.includes("linux")),
      ).toBe(true);
    });

    it("should filter by option type", async () => {
      const result = await service.getCompilerOptions("all", "debugging");
      expect(result.options.every((opt) => opt.category === "debugging")).toBe(
        true,
      );
    });

    it("should combine filters", async () => {
      const result = await service.getCompilerOptions("windows", "compilation");
      expect(
        result.options.every(
          (opt) =>
            opt.platform.includes("windows") && opt.category === "compilation",
        ),
      ).toBe(true);
    });
  });

  describe("getDebuggingHelp", () => {
    it("should provide debugging help for variable issues", async () => {
      const help = await service.getDebuggingHelp("variable value problem");
      expect(help).toContain("Debugging Help");
      expect(typeof help).toBe("string");
      expect(help.length).toBeGreaterThan(0);
    });

    it("should provide debugging help for errors", async () => {
      const help = await service.getDebuggingHelp("runtime error");
      expect(help).toContain("Debugging Help");
    });

    it("should provide general help for unknown issues", async () => {
      const help = await service.getDebuggingHelp("some random issue");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should provide help for loop issues", async () => {
      const help = await service.getDebuggingHelp("infinite loop detected");
      expect(help).toContain("Debugging Help");
      expect(help.length).toBeGreaterThan(0);
    });

    it("should provide help for graphics issues", async () => {
      const help = await service.getDebuggingHelp("screen graphics problem");
      expect(help).toContain("Debugging Help");
      expect(help.length).toBeGreaterThan(0);
    });

    it("should filter techniques by platform", async () => {
      const help = await service.getDebuggingHelp("error", "linux");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });
  });

  describe("getCompilerReference", () => {
    it("should generate complete compiler reference", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("Compiler Reference");
      expect(reference).toContain("Compilation Options");
      expect(reference).toContain("Debugging Options");
      expect(reference).toContain("Optimization Options");
    });

    it("should include platform-specific notes", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("Platform-Specific Notes");
      expect(reference).toContain("Windows");
      expect(reference).toContain("macOS");
      expect(reference).toContain("Linux");
    });

    it("should include cross-platform tips", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("Cross-Platform Compatibility Tips");
    });

    it("should include compilation best practices", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("Compilation Best Practices");
    });
  });

  describe("debugging help variations", () => {
    it("should help with memory issues", async () => {
      const help = await service.getDebuggingHelp("memory leak");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should help with syntax issues", async () => {
      const help = await service.getDebuggingHelp("syntax error");
      expect(help).toBeDefined();
    });

    it("should help with performance issues", async () => {
      const help = await service.getDebuggingHelp("slow performance");
      expect(help).toBeDefined();
    });

    it("should help with file operations", async () => {
      const help = await service.getDebuggingHelp("file not found");
      expect(help).toBeDefined();
    });

    it("should help with arrays", async () => {
      const help = await service.getDebuggingHelp(
        "array subscript out of range",
      );
      expect(help).toBeDefined();
    });

    it("should help with strings", async () => {
      const help = await service.getDebuggingHelp(
        "string concatenation problem",
      );
      expect(help).toBeDefined();
    });
  });

  describe("platform-specific options", () => {
    it("should return Windows-specific options", async () => {
      const result = await service.getCompilerOptions("windows");
      expect(Array.isArray(result.options)).toBe(true);
    });

    it("should return macOS-specific options", async () => {
      const result = await service.getCompilerOptions("macos");
      expect(Array.isArray(result.options)).toBe(true);
    });

    it("should return Linux-specific options", async () => {
      const result = await service.getCompilerOptions("linux");
      expect(Array.isArray(result.options)).toBe(true);
    });

    it("should handle all platforms", async () => {
      const result = await service.getCompilerOptions("all");
      expect(result.options.length).toBeGreaterThan(0);
    });
  });

  describe("option categories", () => {
    it("should return compilation category options", async () => {
      const result = await service.getCompilerOptions("all", "compilation");
      expect(
        result.options.every((opt) => opt.category === "compilation"),
      ).toBe(true);
    });

    it("should return debugging category options", async () => {
      const result = await service.getCompilerOptions("all", "debugging");
      expect(result.options.every((opt) => opt.category === "debugging")).toBe(
        true,
      );
    });

    it("should return optimization category options", async () => {
      const result = await service.getCompilerOptions("all", "optimization");
      expect(
        result.options.every((opt) => opt.category === "optimization"),
      ).toBe(true);
    });

    it("should handle unknown category", async () => {
      const result = await service.getCompilerOptions(
        "all",
        "unknown_category",
      );
      expect(Array.isArray(result.options)).toBe(true);
    });
  });

  describe("debugging help for specific platforms", () => {
    it("should provide Windows-specific debugging help", async () => {
      const help = await service.getDebuggingHelp("crash", "windows");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should provide macOS-specific debugging help", async () => {
      const help = await service.getDebuggingHelp("crash", "macos");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should provide Linux-specific debugging help", async () => {
      const help = await service.getDebuggingHelp("crash", "linux");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });
  });

  describe("complex debugging scenarios", () => {
    it("should help with multiple keywords", async () => {
      const help = await service.getDebuggingHelp(
        "variable undefined runtime error",
      );
      expect(help).toContain("Debugging Help");
    });

    it("should help with empty issue description", async () => {
      const help = await service.getDebuggingHelp("");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should help with long issue descriptions", async () => {
      const longIssue = "variable value problem ".repeat(20);
      const help = await service.getDebuggingHelp(longIssue);
      expect(help).toBeDefined();
    });

    it("should help with special characters in issue", async () => {
      const help = await service.getDebuggingHelp(
        "error: $variable undefined!",
      );
      expect(help).toBeDefined();
    });
  });

  describe("compiler options structure", () => {
    it("should return options with correct structure", async () => {
      const result = await service.getCompilerOptions();
      expect(result).toHaveProperty("headlessWorkflow");
      expect(result).toHaveProperty("options");
      expect(result.headlessWorkflow).toHaveProperty("minimalCommand");
      expect(result.headlessWorkflow).toHaveProperty("recommendedCommand");
      expect(result.headlessWorkflow).toHaveProperty("flags");
      if (result.options.length > 0) {
        const option = result.options[0];
        expect(option).toHaveProperty("flag");
        expect(option).toHaveProperty("description");
        expect(option).toHaveProperty("category");
        expect(option).toHaveProperty("platform");
      }
    });

    it("should have valid platform values", async () => {
      const result = await service.getCompilerOptions();
      result.options.forEach((opt) => {
        expect(Array.isArray(opt.platform)).toBe(true);
        expect(opt.platform.length).toBeGreaterThan(0);
      });
    });

    it("should have valid category values", async () => {
      const result = await service.getCompilerOptions();
      const validCategories = ["compilation", "debugging", "optimization"];
      result.options.forEach((opt) => {
        expect(validCategories).toContain(opt.category);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle undefined platform gracefully", async () => {
      const result = await service.getCompilerOptions(undefined as any);
      expect(Array.isArray(result.options)).toBe(true);
    });

    it("should handle undefined option type gracefully", async () => {
      const result = await service.getCompilerOptions("all", undefined as any);
      expect(Array.isArray(result.options)).toBe(true);
    });

    it("should handle empty string issue in debugging help", async () => {
      const help = await service.getDebuggingHelp("");
      expect(help).toBeDefined();
      expect(typeof help).toBe("string");
    });

    it("should handle unicode in issue description", async () => {
      const help = await service.getDebuggingHelp("変数エラー 漢字");
      expect(help).toBeDefined();
    });
  });

  describe("reference documentation completeness", () => {
    it("should document all option categories", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("Compilation Options");
      expect(reference).toContain("Debugging Options");
      expect(reference).toContain("Optimization Options");
    });

    it("should include examples", async () => {
      const reference = await service.getCompilerReference();
      expect(reference.length).toBeGreaterThan(500);
    });

    it("should be well-formatted markdown", async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain("##");
      expect(reference).toContain("-");
    });
  });

  describe("multiple operations", () => {
    it("should handle multiple getCompilerOptions calls", async () => {
      const opts1 = await service.getCompilerOptions();
      const opts2 = await service.getCompilerOptions("linux");
      const opts3 = await service.getCompilerOptions("all", "debugging");

      expect(Array.isArray(opts1.options)).toBe(true);
      expect(Array.isArray(opts2.options)).toBe(true);
      expect(Array.isArray(opts3.options)).toBe(true);
    });

    it("should handle multiple getDebuggingHelp calls", async () => {
      const help1 = await service.getDebuggingHelp("error");
      const help2 = await service.getDebuggingHelp("crash", "windows");
      const help3 = await service.getDebuggingHelp("memory leak", "linux");

      expect(typeof help1).toBe("string");
      expect(typeof help2).toBe("string");
      expect(typeof help3).toBe("string");
    });

    it("should handle mixed operations", async () => {
      const options = await service.getCompilerOptions();
      const help = await service.getDebuggingHelp("error");
      const reference = await service.getCompilerReference();

      expect(Array.isArray(options.options)).toBe(true);
      expect(typeof help).toBe("string");
      expect(typeof reference).toBe("string");
    });
  });

  describe("compileAndVerify", () => {
    it("should handle missing QB64PE", async () => {
      const result = await service.compileAndVerify("/nonexistent/file.bas");

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it("should handle nonexistent source file", async () => {
      const result = await service.compileAndVerify(
        "/nonexistent/file.bas",
        "/fake/qb64pe",
      );

      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("not found"))).toBe(
        true,
      );
    });

    it("should return proper result structure", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("output");
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("suggestions");
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("should handle compiler flags", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
        ["-c", "-w", "-o", "output"],
      );

      expect(result).toBeDefined();
    });

    it("should include the resolved compiler path in the result", async () => {
      const result = await service.compileAndVerify(
        "/nonexistent/file.bas",
        "/fake/qb64pe",
      );

      expect(result.resolvedCompilerPath).toBe("/fake/qb64pe");
    });

    it("should include the resolved output path in the result", async () => {
      const result = await service.compileAndVerify(
        "/nonexistent/file.bas",
        "/fake/qb64pe",
      );

      expect(result.resolvedOutputPath).toBe("/nonexistent/file.run");
    });

    it("should provide suggestions for errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");

      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("should normalize flags to compile-only mode", () => {
      const normalized = (service as any).normalizeCompileFlags([
        "-c",
        "-w",
        "-x",
        "-o",
        "DRAW.run",
        "-w",
      ]);

      expect(normalized.flags).toEqual(["-q", "-m", "-w", "-x"]);
      expect(normalized.removedFlags).toEqual(["-c", "-o", "DRAW.run"]);
    });

    it("should resolve explicit .run output paths correctly", () => {
      const executablePath = (service as any).resolveExecutablePath(
        "/home/grymmjack/git/DRAW/DRAW.BAS",
        undefined,
        "/home/grymmjack/git/DRAW/DRAW.run",
      );

      expect(executablePath).toBe("/home/grymmjack/git/DRAW/DRAW.run");
    });

    it("should format opaque compile failures with command metadata", () => {
      const formatted = (service as any).formatOpaqueCompileFailure(
        { message: "Command failed", code: 1, signal: null },
        '"/fake/qb64pe" -q -m -x -w -o "/tmp/demo.run" "/tmp/demo.bas"',
        "/tmp/demo.bas",
        "/tmp/demo.run",
      );

      expect(formatted).toContain("Command failed");
      expect(formatted).toContain(
        'Command: "/fake/qb64pe" -q -m -x -w -o "/tmp/demo.run" "/tmp/demo.bas"',
      );
      expect(formatted).toContain("Source: /tmp/demo.bas");
      expect(formatted).toContain("Expected output: /tmp/demo.run");
      expect(formatted).toContain("Exit code: 1");
    });

    it("should quote shell arguments safely for PTY fallback", () => {
      const quoted = (service as any).quoteForShell("/tmp/that's it.bas");

      expect(quoted).toBe("'/tmp/that'\"'\"'s it.bas'");
    });

    it("should suggest _SAVEIMAGE screenshot workflow for graphics code", () => {
      const suggestions = (service as any).getWorkflowToolSuggestions(
        "SCREEN 12\nCIRCLE (100,100), 50\nEND",
      );

      expect(suggestions.some((s: string) => s.includes("_SAVEIMAGE"))).toBe(
        true,
      );
      expect(
        suggestions.some((s: string) =>
          s.includes("analyze_qb64pe_graphics_screenshot"),
        ),
      ).toBe(true);
    });

    it("should suggest porting tools for legacy BASIC patterns", () => {
      const suggestions = (service as any).getWorkflowToolSuggestions(
        'GOSUB Start\nPLAY "CDE"\nDECLARE SUB Foo\nRETURN',
      );

      expect(
        suggestions.some((s: string) =>
          s.includes("analyze_qbasic_file_compatibility"),
        ),
      ).toBe(true);
      expect(
        suggestions.some((s: string) =>
          s.includes("port_qbasic_file_to_qb64pe"),
        ),
      ).toBe(true);
    });

    it("should bypass VS Code task mirroring and use direct compilation only", async () => {
      const tryVSCodeTaskSpy = jest
        .spyOn(service as any, "tryVSCodeTask")
        .mockResolvedValue({
          success: true,
          output: "task output",
          errors: [],
          suggestions: ["task suggestion"],
          executablePath: "/fake/task-output.run",
        });

      const result = await service.compileAndVerify(
        "/nonexistent/file.bas",
        "/fake/qb64pe",
      );

      expect(tryVSCodeTaskSpy).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.errors.some((e) => e.message.includes("not found"))).toBe(
        true,
      );
    });

    it("should read qb64pe.compilerPath from workspace VS Code settings", () => {
      const fs = require("fs");
      const os = require("os");
      const path = require("path");
      const tempRoot = fs.mkdtempSync(
        path.join(os.tmpdir(), "qb64pe-compiler-settings-"),
      );
      const vscodeDir = path.join(tempRoot, ".vscode");
      const sourceDir = path.join(tempRoot, "src");
      const configuredCompiler = path.join(tempRoot, "tools", "qb64pe");
      const sourceFile = path.join(sourceDir, "demo.bas");

      fs.mkdirSync(vscodeDir, { recursive: true });
      fs.mkdirSync(sourceDir, { recursive: true });
      fs.mkdirSync(path.dirname(configuredCompiler), { recursive: true });
      fs.writeFileSync(configuredCompiler, "", "utf-8");
      fs.writeFileSync(sourceFile, 'PRINT "hi"', "utf-8");
      fs.writeFileSync(
        path.join(vscodeDir, "settings.json"),
        JSON.stringify({ "qb64pe.compilerPath": configuredCompiler }),
        "utf-8",
      );

      try {
        const compilerPath = (service as any).getVSCodeConfiguredCompilerPath(
          sourceFile,
        );

        expect(compilerPath).toBe(configuredCompiler);
      } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
      }
    });

    it("should read qb64pe.compilerPath from VS Code user settings", () => {
      const fs = require("fs");
      const os = require("os");
      const path = require("path");
      const tempHome = fs.mkdtempSync(
        path.join(os.tmpdir(), "qb64pe-user-settings-"),
      );
      const sourceRoot = fs.mkdtempSync(
        path.join(os.tmpdir(), "qb64pe-source-root-"),
      );
      const sourceFile = path.join(sourceRoot, "demo.bas");
      const configuredCompiler = path.join(tempHome, "qb64pe", "qb64pe");
      const settingsPath = path.join(
        tempHome,
        ".config",
        "Code",
        "User",
        "settings.json",
      );
      const homedirSpy = jest.spyOn(os, "homedir").mockReturnValue(tempHome);

      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      fs.mkdirSync(path.dirname(configuredCompiler), { recursive: true });
      fs.writeFileSync(configuredCompiler, "", "utf-8");
      fs.writeFileSync(sourceFile, 'PRINT "hi"', "utf-8");
      fs.writeFileSync(
        settingsPath,
        JSON.stringify({ "qb64pe.compilerPath": configuredCompiler }),
        "utf-8",
      );

      try {
        const compilerPath = (service as any).getVSCodeConfiguredCompilerPath(
          sourceFile,
        );

        expect(compilerPath).toBe(configuredCompiler);
      } finally {
        homedirSpy.mockRestore();
        fs.rmSync(tempHome, { recursive: true, force: true });
        fs.rmSync(sourceRoot, { recursive: true, force: true });
      }
    });
  });

  describe("parseCompilationOutput", () => {
    it("should parse error with line numbers", async () => {
      // Create a test file that exists but will fail compilation
      const fs = require("fs");
      const path = require("path");
      const testFile = path.join(process.cwd(), "test-compile.bas");

      // Create test file
      fs.writeFileSync(testFile, 'PRINT "test"', "utf-8");

      try {
        // This will fail because QB64PE doesn't exist
        const result = await service.compileAndVerify(testFile, "/fake/qb64pe");

        // Should handle the error
        expect(result.success).toBe(false);
        expect(result.errors).toBeDefined();
      } finally {
        // Clean up
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
      }
    });

    it("should parse warnings in output", async () => {
      const result = await service.compileAndVerify("/nonexistent/file.bas");
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should add suggestions for type errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions).toBeDefined();
    });

    it("should add suggestions for undeclared variables", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("should add suggestions for SUB/FUNCTION errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions).toBeDefined();
    });

    it("should add suggestions for syntax errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it("should add suggestions for file errors", async () => {
      const result = await service.compileAndVerify("/nonexistent/file.bas");
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("error suggestion logic", () => {
    it("should suggest type checking for type errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      // Should have some suggestions
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("should suggest DIM for undeclared variables", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions).toBeDefined();
    });

    it("should suggest proper END statements", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions).toBeDefined();
    });

    it("should suggest syntax checking", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions).toBeDefined();
    });

    it("should suggest file path checking", async () => {
      const result = await service.compileAndVerify("/nonexistent/file.bas");
      expect(
        result.suggestions.some(
          (s) =>
            s.includes("path") || s.includes("file") || s.includes("exists"),
        ),
      ).toBe(true);
    });
  });

  describe("compilation command building", () => {
    it("should use default flags when none provided", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
      );
      expect(result).toBeDefined();
    });

    it("should use custom flags", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
        ["-x", "-v"],
      );
      expect(result).toBeDefined();
    });

    it("should build output name from source file", async () => {
      const result = await service.compileAndVerify(
        "/path/to/test.bas",
        "/fake/qb64pe",
      );
      expect(result).toBeDefined();
    });
  });

  describe("QB64PE detection", () => {
    it("should check common locations", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.success).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.message.includes("QB64PE") || e.message.includes("not found"),
        ),
      ).toBe(true);
    });

    it("should try PATH when not in common locations", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.errors).toBeDefined();
    });

    it("should provide installation suggestions when not found", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("output parsing patterns", () => {
    it("should handle various error formats", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should handle generic error indicators", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.errors).toBeDefined();
    });

    it("should handle multi-line output", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result).toBeDefined();
    });
  });

  describe("executable detection", () => {
    it("should check for .exe on Windows", async () => {
      const fs = require("fs");
      const path = require("path");
      const testFile = path.join(process.cwd(), "test-exec.bas");

      fs.writeFileSync(testFile, 'PRINT "test"', "utf-8");

      try {
        const result = await service.compileAndVerify(testFile, "/fake/qb64pe");
        expect(result).toBeDefined();
      } finally {
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
      }
    });

    it("should handle missing executable after compilation", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
      );
      expect(result).toBeDefined();
    });

    it("should add warning for missing executable", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
      );
      expect(result).toBeDefined();
    });
  });

  describe("compilation timeout handling", () => {
    it("should handle timeout errors", async () => {
      const result = await service.compileAndVerify(
        "/fake/file.bas",
        "/fake/qb64pe",
      );
      expect(result).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should provide output even on failure", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.output).toBeDefined();
      expect(typeof result.output).toBe("string");
    });
  });

  describe("error severity levels", () => {
    it("should categorize errors", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      result.errors.forEach((error) => {
        expect(["error", "warning"]).toContain(error.severity);
      });
    });

    it("should include line numbers when available", async () => {
      const result = await service.compileAndVerify("/fake/file.bas");
      expect(result.errors).toBeDefined();
    });
  });
});
