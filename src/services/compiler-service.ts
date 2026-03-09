import { ProjectBuildContextService } from "./project-build-context-service";

export interface CompilerOption {
  flag: string;
  description: string;
  platform: string[];
  example: string;
  category: "compilation" | "debugging" | "optimization";
}

export interface DebuggingTechnique {
  technique: string;
  description: string;
  example: string;
  platform: string[];
  useCase: string;
}

/**
 * Service for QB64PE compiler information and debugging help
 */
export class QB64PECompilerService {
  private buildContextService: ProjectBuildContextService;

  constructor() {
    this.buildContextService = new ProjectBuildContextService();
  }

  private normalizeCompileFlags(flags: string[]): {
    flags: string[];
    removedFlags: string[];
  } {
    const normalized: string[] = [];
    const removedFlags: string[] = [];
    let skipNext = false;

    for (const flag of flags) {
      if (skipNext) {
        removedFlags.push(flag);
        skipNext = false;
        continue;
      }

      if (flag === "-o") {
        removedFlags.push(flag);
        skipNext = true;
        continue;
      }

      if (flag === "-c") {
        removedFlags.push(flag);
        continue;
      }

      if (!normalized.includes(flag)) {
        normalized.push(flag);
      }
    }

    const requiredFlags = ["-q", "-m", "-x"];
    for (let index = requiredFlags.length - 1; index >= 0; index -= 1) {
      const requiredFlag = requiredFlags[index];
      if (!normalized.includes(requiredFlag)) {
        normalized.unshift(requiredFlag);
      }
    }

    return { flags: normalized, removedFlags };
  }

  private resolveExecutablePath(
    sourceFilePath: string,
    outputName?: string,
    explicitOutputPath?: string,
  ): string {
    const path = require("path");

    if (explicitOutputPath) {
      return explicitOutputPath;
    }

    const executableExt = process.platform === "win32" ? ".exe" : "";
    const baseName =
      outputName || path.basename(sourceFilePath, path.extname(sourceFilePath));
    const resolvedName = path.extname(baseName)
      ? baseName
      : baseName + executableExt;

    return path.join(path.dirname(sourceFilePath), resolvedName);
  }

  private quoteForShell(value: string): string {
    return `'${value.replace(/'/g, `'"'"'`)}'`;
  }

  private formatOpaqueCompileFailure(
    execError: any,
    command: string,
    sourceFilePath: string,
    resolvedOutputPath: string,
  ): string {
    const details = [
      execError?.message ||
        "QB64PE compilation failed with no compiler output.",
      `Command: ${command}`,
      `Source: ${sourceFilePath}`,
      `Expected output: ${resolvedOutputPath}`,
    ];

    if (execError?.code !== undefined) {
      details.push(`Exit code: ${String(execError.code)}`);
    }

    if (execError?.signal) {
      details.push(`Signal: ${String(execError.signal)}`);
    }

    return details.join("\n");
  }

  private async tryCaptureCompileFailureWithPty(
    command: string,
    cwd: string,
  ): Promise<string | null> {
    if (process.platform === "win32") {
      return null;
    }

    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    const shellCommand = `cd ${this.quoteForShell(cwd)} && ${command}`;
    const ptyCommand = `script -qefc ${this.quoteForShell(shellCommand)} /dev/null`;

    try {
      const { stdout, stderr } = await execAsync(ptyCommand, {
        cwd,
        timeout: 120000,
      });
      const combinedOutput = `${stdout || ""}${stderr || ""}`.trim();
      return combinedOutput.length > 0 ? combinedOutput : null;
    } catch (ptyError: any) {
      const combinedOutput =
        `${ptyError?.stdout || ""}${ptyError?.stderr || ""}`.trim();
      return combinedOutput.length > 0 ? combinedOutput : null;
    }
  }

  private getVSCodeConfiguredCompilerPath(
    sourceFilePath: string,
  ): string | undefined {
    const fs = require("fs");
    const os = require("os");
    const path = require("path");

    const settingsFiles: string[] = [];
    const workspaceRoot = this.findWorkspaceRoot(sourceFilePath);
    settingsFiles.push(path.join(workspaceRoot, ".vscode", "settings.json"));

    const homeDir = os.homedir();
    if (process.platform === "win32") {
      const appData =
        process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
      settingsFiles.push(path.join(appData, "Code", "User", "settings.json"));
    } else if (process.platform === "darwin") {
      settingsFiles.push(
        path.join(
          homeDir,
          "Library",
          "Application Support",
          "Code",
          "User",
          "settings.json",
        ),
      );
    } else {
      settingsFiles.push(
        path.join(homeDir, ".config", "Code", "User", "settings.json"),
      );
    }

    for (const settingsFile of settingsFiles) {
      try {
        if (!fs.existsSync(settingsFile)) {
          continue;
        }

        const settings = JSON.parse(fs.readFileSync(settingsFile, "utf-8"));
        const compilerPath = settings["qb64pe.compilerPath"];

        if (
          typeof compilerPath === "string" &&
          compilerPath.trim().length > 0 &&
          fs.existsSync(compilerPath)
        ) {
          return compilerPath;
        }
      } catch {
        // Ignore malformed or unreadable VS Code settings files.
      }
    }

    return undefined;
  }

  private getWorkflowToolSuggestions(sourceCode: string): string[] {
    const suggestions: string[] = [];
    const hasGraphics =
      /\b(SCREEN|CIRCLE|LINE|PSET|PRESET|PAINT|DRAW|_PUTIMAGE|_NEWIMAGE|_LOADIMAGE|_DISPLAY|CLS)\b/i.test(
        sourceCode,
      );
    const hasSaveImage = /\b_SAVEIMAGE\b/i.test(sourceCode);
    const hasLegacyPatterns =
      /\b(GOSUB|RETURN|DEF\s+\w+\s*\(|PLAY|BEEP|SOUND|DECLARE\s+(SUB|FUNCTION))\b/i.test(
        sourceCode,
      );
    const hasRuntimeSignals =
      /\b(_LOG(INFO|WARN|ERROR|TRACE)|PRINT\b|\$CONSOLE|INKEY\$|_KEYDOWN|OPEN\s+.+FOR\s+(OUTPUT|APPEND))\b/i.test(
        sourceCode,
      );

    if (hasGraphics) {
      if (hasSaveImage) {
        suggestions.push(
          "🖼️ Graphics program with _SAVEIMAGE detected. After running it, call analyze_qb64pe_graphics_screenshot with the saved image path.",
        );
      } else {
        suggestions.push(
          '🖼️ Graphics code detected. Add _SAVEIMAGE "/absolute/path/screenshot.png" near END, run the program, then call analyze_qb64pe_graphics_screenshot.',
        );
      }
      suggestions.push(
        "🧭 For runtime behavior, call analyze_qb64pe_execution_mode_file or get_execution_monitoring_guidance before running the program.",
      );
    }

    if (hasLegacyPatterns) {
      suggestions.push(
        "🔁 Legacy BASIC patterns detected. Call analyze_qbasic_file_compatibility or port_qbasic_file_to_qb64pe for focused migration help.",
      );
    }

    if (hasRuntimeSignals && !hasGraphics) {
      suggestions.push(
        "📟 Runtime output detected. Call analyze_qb64pe_execution_mode_file or parse_console_output if you need structured monitoring guidance.",
      );
    }

    suggestions.push(
      "🔎 For pre-compile review on the current file, call validate_qb64pe_compatibility_file.",
    );

    return [...new Set(suggestions)];
  }

  private readonly compilerOptions: CompilerOption[] = [
    {
      flag: "-x",
      description:
        "REQUIRED for headless/CLI use. Compile-only mode — does NOT launch the QB64PE IDE GUI. " +
        "Without this flag, invoking qb64pe opens the IDE window and hangs in any terminal/automated environment.",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -w -x myprogram.bas -o myprogram.run",
      category: "compilation",
    },
    {
      flag: "-w",
      description:
        "REQUIRED for headless/CLI use. Suppresses interactive warning dialogs that would otherwise block " +
        "compilation waiting for user input. Essential for non-interactive/automated workflows.",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -w -x myprogram.bas -o myprogram.run",
      category: "compilation",
    },
    {
      flag: "-o",
      description: "Specify output executable path",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -w -x myprogram.bas -o myprogram.run",
      category: "compilation",
    },
    {
      flag: "-c",
      description:
        "Compile source file and show progress in QB64PE's own window. DO NOT use in headless/terminal environments — use -x instead.",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c myprogram.bas",
      category: "compilation",
    },
    {
      flag: "-q",
      description:
        "Quiet mode — suppress compiler banner output. Often combined with -m and -x for clean headless output.",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -q -m -x myprogram.bas",
      category: "compilation",
    },
    {
      flag: "-m",
      description:
        "Message mode — send compiler progress and error messages to stdout/stderr. " +
        "Use with -q and -x for fully headless compilation with captured output.",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -q -m -x myprogram.bas",
      category: "compilation",
    },
    {
      flag: "-f:MaxCompilerProcesses=N",
      description:
        "Set the maximum number of parallel C++ compilation processes. Speeds up compilation significantly on multi-core systems. " +
        "Recommended: set N to the number of CPU cores (e.g. 12 for a 12-core machine). " +
        "The transpiled QB64PE source is compiled from C++, so more processes = faster builds.",
      platform: ["windows", "macos", "linux"],
      example:
        "qb64pe -w -x -f:MaxCompilerProcesses=12 myprogram.bas -o myprogram.run",
      category: "optimization",
    },
    {
      flag: "-z",
      description: "Enable all compiler optimizations",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -w -x -z myprogram.bas -o myprogram.run",
      category: "optimization",
    },
    {
      flag: "-g",
      description: "Generate debug information",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -w -x -g myprogram.bas -o myprogram.run",
      category: "debugging",
    },
  ];

  private readonly debuggingTechniques: DebuggingTechnique[] = [
    {
      technique: "_LOGINFO Debugging",
      description:
        "Use _LOGINFO to log variable values and program flow without disrupting output",
      example: `DIM x AS INTEGER
x = 10
_LOGINFO "x = " + STR$(x)
_LOGINFO "About to enter loop"
FOR i = 1 TO 5
    _LOGINFO "i = " + STR$(i)
    x = x + i
    _LOGINFO "x is now " + STR$(x)
NEXT i
_LOGINFO "Final x = " + STR$(x)`,
      platform: ["windows", "macos", "linux"],
      useCase:
        "Modern debugging with built-in logging, variable inspection, flow control verification",
    },
    {
      technique: "_LOGERROR for Errors with Stacktraces",
      description:
        "Use _LOGERROR to log errors with automatic stacktrace generation showing call hierarchy",
      example: `SUB ProcessData(value AS INTEGER)
    IF value < 0 THEN
        _LOGERROR "Invalid value: " + STR$(value)
        EXIT SUB
    END IF
    ' Process data...
END SUB

' Example stacktrace output:
' [0.12100] ERROR QB64 ProcessData: 3: Invalid value: -5
' #1 [0x00007FF6664AFA7E] in ProcessData() (QB64)
' #2 [0x00007FF6664AF891] in Main QB64 code`,
      platform: ["windows", "macos", "linux"],
      useCase:
        "Error debugging with full call stack, finding where errors originate",
    },
    {
      technique: "$CONSOLE Output (Legacy)",
      description:
        "Use $CONSOLE to create a console window - prefer _LOGINFO for modern debugging",
      example: `' Note: _LOGINFO is preferred for debug output
$CONSOLE
PRINT "This appears in the console window"
DIM myVar AS INTEGER
myVar = 42
PRINT "myVar = "; myVar
INPUT "Press Enter to continue...", dummy$`,
      platform: ["windows", "macos", "linux"],
      useCase: "Legacy code or when console window is specifically needed",
    },
    {
      technique: "_LOGINFO with Debug Flag",
      description: "Use conditional _LOGINFO calls for debug mode",
      example: `DIM debug AS INTEGER
debug = 1  ' Set to 1 for debugging

' Your program code here
FOR i = 1 TO 10
    IF debug THEN _LOGINFO "Processing item " + STR$(i)
    ' Main program logic
NEXT i

IF debug THEN _LOGINFO "Program completed"`,
      platform: ["windows", "macos", "linux"],
      useCase: "Toggle debugging output on/off without disrupting program flow",
    },
    {
      technique: "File Logging",
      description: "Write debug information to a log file",
      example: `OPEN "debug.log" FOR OUTPUT AS #1
PRINT #1, "Program started at "; TIME$

DIM x AS INTEGER
x = 100
PRINT #1, "x initialized to "; x

FOR i = 1 TO 5
    x = x * 2
    PRINT #1, "Loop "; i; ": x = "; x
NEXT i

PRINT #1, "Program ended at "; TIME$
CLOSE #1`,
      platform: ["windows", "macos", "linux"],
      useCase:
        "Persistent debugging, analyzing program execution after running",
    },
    {
      technique: "Error Handling with ON ERROR",
      description:
        "Use QB64PE error handling to catch and debug runtime errors",
      example: `ON ERROR GOTO ErrorHandler

DIM a AS INTEGER, b AS INTEGER, result AS SINGLE
a = 10
b = 0
result = a / b  ' This will cause division by zero

PRINT "Result: "; result
END

ErrorHandler:
PRINT "Error "; ERR; " occurred: "; _ERRORMESSAGE$
PRINT "Error on line "; ERL
PRINT "Press any key to continue..."
SLEEP
RESUME NEXT`,
      platform: ["windows", "macos", "linux"],
      useCase: "Runtime error debugging, graceful error recovery",
    },
    {
      technique: "Step-by-Step Execution",
      description: "Use INPUT or SLEEP to pause execution at specific points",
      example: `DIM count AS INTEGER
count = 0

FOR i = 1 TO 10
    count = count + i
    PRINT "Step "; i; ": count = "; count
    
    ' Pause for debugging
    PRINT "Press Enter to continue..."
    INPUT "", dummy$
NEXT i

PRINT "Final count: "; count`,
      platform: ["windows", "macos", "linux"],
      useCase: "Interactive debugging, step-through execution",
    },
  ];

  /**
   * Get compiler options based on platform and type.
   * Returns a structured result with a prominent headless workflow section.
   */
  async getCompilerOptions(
    platform: string = "all",
    optionType: string = "all",
  ): Promise<{
    headlessWorkflow: {
      summary: string;
      minimalCommand: string;
      recommendedCommand: string;
      flags: Record<string, string>;
      warning: string;
    };
    options: CompilerOption[];
  }> {
    let options = this.compilerOptions;

    // Filter by platform
    if (platform !== "all") {
      options = options.filter(
        (option) =>
          option.platform.includes(platform) || option.platform.includes("all"),
      );
    }

    // Filter by option type
    if (optionType !== "all") {
      options = options.filter((option) => option.category === optionType);
    }

    return {
      headlessWorkflow: {
        summary:
          "QB64PE HEADLESS / CLI COMPILATION — Always use these flags when compiling from a terminal or LLM agent workflow. " +
          "Without -x the compiler opens its IDE GUI which will hang or fail in any non-interactive environment.",
        minimalCommand: "qb64pe -w -x SOURCE.BAS -o OUTPUT.run",
        recommendedCommand:
          "qb64pe -w -x -f:MaxCompilerProcesses=<N> SOURCE.BAS -o OUTPUT.run",
        flags: {
          "-x": "Compile-only — suppresses the IDE GUI launch. REQUIRED for headless use.",
          "-w": "Suppress interactive warning dialogs. REQUIRED for non-interactive use.",
          "-o PATH":
            "Output binary path. Omit the extension on Linux/macOS (or use .exe on Windows).",
          "-f:MaxCompilerProcesses=N":
            "Parallel C++ compilation threads (set N = CPU core count for fastest builds, e.g. 12).",
          "-q": "Quiet mode — suppresses compiler banner. Combine with -m and -x for clean captured output.",
          "-m": "Message mode — routes compiler output to stdout/stderr so it can be captured by scripts.",
        },
        warning:
          "Running `qb64pe SOURCE.BAS` without -x WILL attempt to open the IDE GUI window and hang in any headless/terminal environment.",
      },
      options,
    };
  }

  /**
   * Get debugging help based on the issue and platform
   */
  async getDebuggingHelp(
    issue: string,
    platform: string = "all",
  ): Promise<string> {
    const relevantTechniques = this.findRelevantDebuggingTechniques(
      issue,
      platform,
    );

    let help = `# QB64PE Debugging Help for: "${issue}"\n\n`;

    if (relevantTechniques.length === 0) {
      help += this.getGeneralDebuggingAdvice(platform);
    } else {
      help += "## Recommended Debugging Techniques\n\n";
      relevantTechniques.forEach((technique, index) => {
        help += `### ${index + 1}. ${technique.technique}\n\n`;
        help += `**Description:** ${technique.description}\n\n`;
        help += `**Use Case:** ${technique.useCase}\n\n`;
        help += `**Example:**\n\`\`\`basic\n${technique.example}\n\`\`\`\n\n`;
      });
    }

    help += this.getAdditionalDebuggingTips(platform);
    return help;
  }

  /**
   * Get complete compiler reference
   */
  async getCompilerReference(): Promise<string> {
    let reference = "# QB64PE Compiler Reference\n\n";

    reference += "## Compilation Options\n\n";
    const compilationOptions = (
      await this.getCompilerOptions("all", "compilation")
    ).options;
    compilationOptions.forEach((option) => {
      reference += `### ${option.flag}\n`;
      reference += `**Description:** ${option.description}\n\n`;
      reference += `**Platforms:** ${option.platform.join(", ")}\n\n`;
      reference += `**Example:** \`${option.example}\`\n\n`;
    });

    reference += "## Debugging Options\n\n";
    const debuggingOptions = (await this.getCompilerOptions("all", "debugging"))
      .options;
    debuggingOptions.forEach((option) => {
      reference += `### ${option.flag}\n`;
      reference += `**Description:** ${option.description}\n\n`;
      reference += `**Platforms:** ${option.platform.join(", ")}\n\n`;
      reference += `**Example:** \`${option.example}\`\n\n`;
    });

    reference += "## Optimization Options\n\n";
    const optimizationOptions = (
      await this.getCompilerOptions("all", "optimization")
    ).options;
    optimizationOptions.forEach((option) => {
      reference += `### ${option.flag}\n`;
      reference += `**Description:** ${option.description}\n\n`;
      reference += `**Platforms:** ${option.platform.join(", ")}\n\n`;
      reference += `**Example:** \`${option.example}\`\n\n`;
    });

    reference += this.getPlatformSpecificNotes();

    return reference;
  }

  /**
   * Find relevant debugging techniques based on the issue description
   */
  private findRelevantDebuggingTechniques(
    issue: string,
    platform: string,
  ): DebuggingTechnique[] {
    const issueLower = issue.toLowerCase();
    const techniques: DebuggingTechnique[] = [];

    // Check for specific keywords in the issue
    if (issueLower.includes("variable") || issueLower.includes("value")) {
      techniques.push(
        ...this.debuggingTechniques.filter(
          (t) =>
            t.technique.includes("PRINT") || t.technique.includes("$CONSOLE"),
        ),
      );
    }

    if (issueLower.includes("error") || issueLower.includes("crash")) {
      techniques.push(
        ...this.debuggingTechniques.filter((t) =>
          t.technique.includes("Error Handling"),
        ),
      );
    }

    if (issueLower.includes("loop") || issueLower.includes("infinite")) {
      techniques.push(
        ...this.debuggingTechniques.filter(
          (t) =>
            t.technique.includes("Step-by-Step") ||
            t.technique.includes("PRINT"),
        ),
      );
    }

    if (issueLower.includes("graphics") || issueLower.includes("screen")) {
      techniques.push(
        ...this.debuggingTechniques.filter(
          (t) =>
            t.technique.includes("$CONSOLE") ||
            t.technique.includes("File Logging"),
        ),
      );
    }

    // Filter by platform
    if (platform !== "all") {
      return techniques.filter(
        (t) => t.platform.includes(platform) || t.platform.includes("all"),
      );
    }

    // Remove duplicates
    return techniques.filter(
      (technique, index, array) =>
        array.findIndex((t) => t.technique === technique.technique) === index,
    );
  }

  /**
   * Get general debugging advice when no specific techniques match
   */
  private getGeneralDebuggingAdvice(platform: string): string {
    return `## General QB64PE Debugging Approach

1. **Start Simple**: Begin with basic PRINT statements to understand program flow
2. **Use $CONSOLE**: Create a separate console window for debug output
3. **Check Variables**: Print variable values before and after operations
4. **Isolate Problems**: Comment out sections to narrow down the issue
5. **Use Error Handling**: Implement ON ERROR GOTO for runtime errors

## Modern Debugging Template

\`\`\`basic
_LOGINFO "Program started"

' Your program code here
DIM myVar AS INTEGER
myVar = 10
_LOGINFO "myVar = " + STR$(myVar)

' Error handling with stacktrace
IF myVar < 0 THEN
    _LOGERROR "Invalid value detected: " + STR$(myVar)
    ' Stacktrace will automatically show where this was called from
END IF

' Add more _LOGINFO calls as needed
_LOGINFO "Program completed"
\`\`\`

## All Logging Levels (v4.0.0+)

\`\`\`basic
_LOGTRACE "Detailed trace info"    ' Most verbose
_LOGINFO "General information"     ' Standard debug output
_LOGWARN "Warning message"         ' Potential issues
_LOGERROR "Error with stacktrace" ' Errors with full call stack
\`\`\`

## Legacy Debugging Template (use _LOGINFO above instead)

\`\`\`basic
$CONSOLE  ' Enable console for debugging
PRINT "Program started"

' Your program code here
DIM myVar AS INTEGER
myVar = 10
PRINT "Debug: myVar = "; myVar

' Add more debug prints as needed
PRINT "Program completed"
INPUT "Press Enter to exit...", dummy$
\`\`\`

`;
  }

  /**
   * Get additional debugging tips
   */
  private getAdditionalDebuggingTips(platform: string): string {
    let tips = "## Additional Debugging Tips\n\n";

    tips += "### Platform-Specific Considerations\n\n";

    if (platform === "windows" || platform === "all") {
      tips += "**Windows:**\n";
      tips += "- Console window behavior may vary between Windows versions\n";
      tips += "- Use Windows-specific file paths in debug logs\n";
      tips +=
        "- Consider using Windows Event Viewer for system-level debugging\n\n";
    }

    if (platform === "macos" || platform === "all") {
      tips += "**macOS:**\n";
      tips += "- Console.app can show additional system messages\n";
      tips += "- File permissions may affect debug log creation\n";
      tips += "- Use Terminal for command-line debugging\n\n";
    }

    if (platform === "linux" || platform === "all") {
      tips += "**Linux:**\n";
      tips += "- Use terminal output for console debugging\n";
      tips += "- Check system logs with journalctl or dmesg\n";
      tips += "- File permissions are important for debug logs\n\n";
    }

    tips += "### Best Practices\n\n";
    tips += "- Always use descriptive debug messages\n";
    tips += "- Include variable names and values in debug output\n";
    tips += "- Use timestamps in debug logs for timing analysis\n";
    tips += "- Comment out debug code before final compilation\n";
    tips += "- Create a debug flag to easily enable/disable debugging\n\n";

    tips += "### Performance Debugging\n\n";
    tips += "- Use TIMER function to measure execution time\n";
    tips += "- Profile different sections of your code\n";
    tips += "- Monitor memory usage with large arrays or strings\n";
    tips += "- Test on different platforms for compatibility\n\n";

    return tips;
  }

  /**
   * Try to use VS Code BUILD: Compile task if available
   * Returns null if task not found or not in VS Code environment
   */
  private async tryVSCodeTask(sourceFilePath: string): Promise<{
    success: boolean;
    output: string;
    errors: Array<{
      line?: number;
      message: string;
      severity: "error" | "warning";
    }>;
    suggestions: string[];
    executablePath?: string;
  } | null> {
    const fs = await import("fs");
    const path = await import("path");
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    try {
      // Check if we're in a VS Code environment (multiple detection methods)
      // We're less strict here since MCP server may not have TERM_PROGRAM set
      const likelyVSCode =
        process.env.TERM_PROGRAM?.includes("vscode") ||
        process.env.VSCODE_IPC_HOOK ||
        process.env.VSCODE_PID ||
        process.env.VSCODE_CWD ||
        // Always try to find .vscode folder as fallback
        true;

      if (!likelyVSCode) {
        return null; // Definitely not in VS Code
      }

      // Find workspace root (look for .vscode folder)
      const sourceDir = path.dirname(sourceFilePath);
      let workspaceRoot = sourceDir;
      let vscodeDir = path.join(workspaceRoot, ".vscode");

      // Search up the directory tree for .vscode folder
      for (let i = 0; i < 10; i++) {
        if (fs.existsSync(vscodeDir)) {
          // Found .vscode folder
          console.error(`[VS Code Task] Found .vscode at: ${vscodeDir}`);
          break;
        }
        const parent = path.dirname(workspaceRoot);
        if (parent === workspaceRoot) {
          console.error(
            "[VS Code Task] Reached filesystem root, no .vscode found",
          );
          return null; // Reached filesystem root
        }
        workspaceRoot = parent;
        vscodeDir = path.join(workspaceRoot, ".vscode");
      }

      if (!fs.existsSync(vscodeDir)) {
        console.error("[VS Code Task] No .vscode folder found after search");
        return null; // No .vscode folder found
      }

      // Check if tasks.json exists
      const tasksFile = path.join(vscodeDir, "tasks.json");
      if (!fs.existsSync(tasksFile)) {
        console.error(`[VS Code Task] No tasks.json found at: ${tasksFile}`);
        return null; // No tasks.json
      }

      console.error(`[VS Code Task] Found tasks.json at: ${tasksFile}`);

      // Read and parse tasks.json
      const tasksContent = fs.readFileSync(tasksFile, "utf-8");
      const tasksJson = JSON.parse(tasksContent);

      // Look for "BUILD: Compile" task
      const buildTask = tasksJson.tasks?.find(
        (t: any) => t.label === "BUILD: Compile",
      );

      if (!buildTask) {
        const availableTasks =
          tasksJson.tasks?.map((t: any) => t.label).join(", ") || "none";
        console.error(
          `[VS Code Task] 'BUILD: Compile' task not found. Available tasks: ${availableTasks}`,
        );
        return null; // Task not found
      }

      console.error(`[VS Code Task] Found 'BUILD: Compile' task, executing...`);

      // Execute the VS Code task using task runner
      // We'll use the task's command directly since we can't trigger VS Code tasks from Node
      const result = {
        success: false,
        output: "",
        errors: [] as Array<{
          line?: number;
          message: string;
          severity: "error" | "warning";
        }>,
        suggestions: [] as string[],
        executablePath: undefined as string | undefined,
      };

      // Extract command from task
      let cmd = buildTask.command || "";
      if (buildTask.type === "shell" && buildTask.args) {
        cmd += " " + buildTask.args.join(" ");
      }

      // Replace ${file} with actual source file path
      cmd = cmd.replace(/\$\{file\}/g, sourceFilePath);
      cmd = cmd.replace(/\$\{workspaceFolder\}/g, workspaceRoot);

      // compile_and_verify_qb64pe must never run the built program.
      // If the configured task includes -x, skip it and use the direct path.
      if (/\s-x(\s|$)/.test(cmd)) {
        console.error(
          "[VS Code Task] BUILD: Compile task contains -x; skipping task and falling back to direct compile-only execution.",
        );
        return null;
      }

      let taskOutputPath: string | undefined;
      const outputMatch = cmd.match(/-o\s+["']?([^\s"']+)["']?/);
      if (outputMatch) {
        const rawOutputPath = outputMatch[1]
          .replace(
            /\$\{fileBasenameNoExtension\}/g,
            path.basename(sourceFilePath, path.extname(sourceFilePath)),
          )
          .replace(/\$\{fileDirname\}/g, path.dirname(sourceFilePath));
        taskOutputPath = path.isAbsolute(rawOutputPath)
          ? rawOutputPath
          : path.resolve(workspaceRoot, rawOutputPath);
      }

      // Execute the command
      try {
        const { stdout, stderr } = await execAsync(cmd, {
          cwd: workspaceRoot,
          timeout: 120000,
        });
        result.output = stdout + stderr;

        // Check for successful compilation
        const executablePath = this.resolveExecutablePath(
          sourceFilePath,
          undefined,
          taskOutputPath,
        );

        if (fs.existsSync(executablePath)) {
          result.success = true;
          result.executablePath = executablePath;
        }

        return result;
      } catch (execError: any) {
        result.output =
          execError.stdout + execError.stderr || execError.message;
        return result;
      }
    } catch (error) {
      // Any error in task detection/execution means we fall back to direct compilation
      return null;
    }
  }

  /**
   * Compile QB64PE code and return compilation result with errors and suggestions
   * This enables autonomous compile-verify-fix loops
   */
  async compileAndVerify(
    sourceFilePath: string,
    qb64pePath?: string,
    compilerFlags?: string[],
    useStoredFlags: boolean = true,
  ): Promise<{
    success: boolean;
    output: string;
    errors: Array<{
      line?: number;
      message: string;
      severity: "error" | "warning";
    }>;
    executablePath?: string;
    resolvedCompilerPath?: string;
    resolvedOutputPath?: string;
    suggestions: string[];
    contextWarning?: string;
  }> {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const path = await import("path");
    const execAsync = promisify(exec);

    const result: {
      success: boolean;
      output: string;
      errors: Array<{
        line?: number;
        message: string;
        severity: "error" | "warning";
      }>;
      executablePath?: string;
      resolvedCompilerPath?: string;
      resolvedOutputPath?: string;
      suggestions: string[];
      contextWarning?: string;
    } = {
      success: false,
      output: "",
      errors: [],
      suggestions: [],
    };

    // Check build context for previous build parameters
    const previousContext =
      await this.buildContextService.getContext(sourceFilePath);

    let sourceCodeForHints = "";

    // Auto-determine compiler flags
    // Priority: 1) User-provided flags, 2) Stored flags from build context (if useStoredFlags=true), 3) Default flags
    let flags: string[];
    if (compilerFlags) {
      // User explicitly provided flags - use them
      const normalized = this.normalizeCompileFlags(compilerFlags);
      flags = normalized.flags;
      if (normalized.removedFlags.length > 0) {
        result.suggestions.push(
          `ℹ️ Ignored incompatible verification flags: ${JSON.stringify(normalized.removedFlags)}`,
        );
      }
    } else if (
      useStoredFlags &&
      previousContext?.lastUsedCommand?.compilerFlags
    ) {
      // No flags provided but build context exists - use stored successful flags.
      // Strip any run/output flags: this tool always verifies by compiling only,
      // and it generates its own -o argument from sourceFilePath.
      const rawStoredFlags = previousContext.lastUsedCommand.compilerFlags;
      const normalized = this.normalizeCompileFlags(rawStoredFlags);
      flags = normalized.flags;
      console.error(
        `[Compiler] Using stored compiler flags from build context: ${JSON.stringify(flags)}`,
      );
      result.suggestions.push(
        `ℹ️ Using previously successful compiler flags: ${JSON.stringify(flags)}`,
      );
      if (normalized.removedFlags.length > 0) {
        result.suggestions.push(
          `ℹ️ Ignored stored incompatible verification flags: ${JSON.stringify(normalized.removedFlags)}`,
        );
      }
    } else {
      // No flags provided and no build context - use defaults
      flags = ["-q", "-m", "-x", "-w"];
    }

    // Auto-determine output path if not specified.
    // Priority: 1) Build context, 2) Existing .run file, 3) Default to source directory
    let outputName = path.basename(
      sourceFilePath,
      path.extname(sourceFilePath),
    );
    let outputDir = path.dirname(sourceFilePath);
    if (previousContext?.lastUsedCommand?.outputName) {
      outputName = previousContext.lastUsedCommand.outputName;
      console.error(
        `[Compiler] Using previous output name from build context: ${outputName}`,
      );
    } else {
      // Look for existing .run file in source directory.
      // Do not derive compile behavior from VS Code tasks here: task variables like
      // ${file}, dependsOn chains, OS-specific command blocks, and launcher tasks are
      // tied to the active editor/UI state, while this tool always compiles the
      // explicit sourceFilePath it was given.
      const runFile = path.join(outputDir, outputName + ".run");
      if (fs.existsSync(runFile)) {
        outputName = outputName + ".run";
        console.error(
          `[Compiler] Found existing .run file, using: ${outputName}`,
        );
      }
    }

    // Default: append .run if no extension (for consistency)
    if (!path.extname(outputName)) {
      outputName = outputName + ".run";
      console.error(`[Compiler] Defaulting to .run extension: ${outputName}`);
    }

    const resolvedOutputPath = path.join(outputDir, outputName);
    result.resolvedOutputPath = resolvedOutputPath;

    const paramDiff = await this.buildContextService.checkParameterDiff(
      sourceFilePath,
      flags,
      outputName, // pass computed outputName so stored vs current can be compared accurately
    );

    if (paramDiff.differs) {
      result.contextWarning = paramDiff.suggestion;
      result.suggestions.push(
        `⚠️ Build parameters differ from previous build!`,
      );
      result.suggestions.push(`Previous command: ${paramDiff.previousCommand}`);
      result.suggestions.push(
        `Consider using previous flags if they were working: ${JSON.stringify(
          paramDiff.previousFlags,
        )}`,
      );
    }

    try {
      // compile_and_verify_qb64pe must always use the direct compile path.
      // Do not mirror VS Code tasks here because task execution can surface in
      // a separate terminal context instead of behaving like a silent verify step.

      // Determine QB64PE executable path
      let qb64peExe = qb64pePath;
      if (!qb64peExe) {
        const configuredCompilerPath =
          this.getVSCodeConfiguredCompilerPath(sourceFilePath);

        if (configuredCompilerPath) {
          qb64peExe = configuredCompilerPath;
          result.suggestions.push(
            `ℹ️ Using QB64PE compilerPath from VS Code settings: ${configuredCompilerPath}`,
          );
        }
      }

      if (!qb64peExe) {
        // Try to find QB64PE in common locations
        const commonPaths = [
          "/usr/local/bin/qb64pe",
          "/usr/bin/qb64pe",
          "/opt/qb64pe/qb64pe",
          "/home/grymmjack/git/qb64pe/qb64pe",
          "C:\\QB64pe\\qb64pe.exe",
          "C:\\Program Files\\QB64pe\\qb64pe.exe",
        ];

        for (const testPath of commonPaths) {
          if (fs.existsSync(testPath)) {
            qb64peExe = testPath;
            break;
          }
        }

        // If still not found, try PATH
        if (!qb64peExe) {
          try {
            const { stdout } = await execAsync("which qb64pe || where qb64pe");
            qb64peExe = stdout.trim();
          } catch {
            result.errors.push({
              message:
                "QB64PE not found. Please specify qb64pePath or ensure QB64PE is in your PATH.",
              severity: "error",
            });
            result.suggestions.push(
              "Install QB64PE or provide the path to the QB64PE executable",
            );
            result.suggestions.push(
              "Use detect_qb64pe_installation tool to find QB64PE on your system",
            );
            return result;
          }
        }
      }

      if (qb64peExe) {
        result.resolvedCompilerPath = qb64peExe;
      }

      // Validate source file exists
      if (!fs.existsSync(sourceFilePath)) {
        result.errors.push({
          message: `Source file not found: ${sourceFilePath}`,
          severity: "error",
        });
        result.suggestions.push(
          "Ensure the file path is correct and the file exists",
        );
        return result;
      }

      sourceCodeForHints = fs.readFileSync(sourceFilePath, "utf-8");

      // Validate file extension is .bas or .bm
      const ext = path.extname(sourceFilePath).toLowerCase();
      if (ext !== ".bas" && ext !== ".bm" && ext !== ".bi") {
        result.errors.push({
          message: `Invalid file type: ${ext}. QB64PE can only compile .bas, .bm, or .bi files.`,
          severity: "error",
        });
        result.suggestions.push(
          `The file "${sourceFilePath}" is not a QB64PE source file.`,
        );
        result.suggestions.push(
          "QB64PE source files must have .bas, .bm (module), or .bi (include) extension",
        );
        return result;
      }

      // Build compilation command (flags and outputName already defined above for context check)
      const cmd = `"${qb64peExe}" ${flags.join(
        " ",
      )} -o "${resolvedOutputPath}" "${sourceFilePath}"`;

      // Execute compilation
      try {
        const { stdout, stderr } = await execAsync(cmd, {
          cwd: outputDir,
          timeout: 120000,
        });
        result.output = stdout + stderr;

        // Parse compilation output for errors and warnings
        this.parseCompilationOutput(
          result.output,
          result.errors,
          result.suggestions,
        );

        // Check if executable was created
        const executablePath = this.resolveExecutablePath(
          sourceFilePath,
          outputName,
          resolvedOutputPath,
        );

        if (fs.existsSync(executablePath)) {
          result.success = true;
          result.executablePath = executablePath;
          result.suggestions.push(
            "⚙️ Compilation successful! Executable created.",
          );
        } else if (result.errors.length === 0) {
          result.errors.push({
            message: "Compilation completed but executable not found",
            severity: "warning",
          });
          result.suggestions.push(
            "Check QB64PE output for additional information",
          );
        }
      } catch (execError: any) {
        const directOutput =
          `${execError?.stdout || ""}${execError?.stderr || ""}`.trim();

        if (directOutput.length > 0) {
          result.output = directOutput;
        } else {
          const ptyOutput = await this.tryCaptureCompileFailureWithPty(
            cmd,
            outputDir,
          );

          if (ptyOutput) {
            result.output = ptyOutput;
            result.suggestions.push(
              "ℹ️ QB64PE produced no normal stdout/stderr; captured compiler output through a pseudo-terminal fallback.",
            );
          } else {
            result.output = this.formatOpaqueCompileFailure(
              execError,
              cmd,
              sourceFilePath,
              resolvedOutputPath,
            );
            result.suggestions.push(
              "⚠️ QB64PE returned no compiler output. Included process metadata instead of a generic shell failure message.",
            );
          }
        }

        this.parseCompilationOutput(
          result.output,
          result.errors,
          result.suggestions,
        );

        if (result.errors.length === 0) {
          result.errors.push({
            message: result.output,
            severity: "error",
          });
        }
      }

      // Save build context regardless of success/failure.
      // Persist normalized headless verification flags so future runs keep using
      // console-output compilation instead of the QB64PE progress window.
      const flagsToStore = this.normalizeCompileFlags(flags).flags;
      await this.buildContextService.saveContext(
        sourceFilePath,
        qb64peExe,
        flagsToStore,
        outputName,
        result.success,
        result.executablePath,
      );

      if (sourceCodeForHints) {
        result.suggestions.push(
          ...this.getWorkflowToolSuggestions(sourceCodeForHints),
        );
      }
    } catch (error: any) {
      result.errors.push({
        message: `Compilation error: ${error.message}`,
        severity: "error",
      });
    }

    return result;
  }

  /**
   * Parse QB64PE compilation output to extract errors and provide suggestions
   */
  private parseCompilationOutput(
    output: string,
    errors: Array<{
      line?: number;
      message: string;
      severity: "error" | "warning";
    }>,
    suggestions: string[],
  ): void {
    const lines = output.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse error patterns: "Error on line X: message" or "Line X: Error: message"
      const errorMatch = trimmed.match(
        /(?:error|line)\s+(?:on\s+)?(?:line\s+)?(\d+)[:\s]+(.+)/i,
      );
      if (errorMatch) {
        errors.push({
          line: parseInt(errorMatch[1], 10),
          message: errorMatch[2].trim(),
          severity: "error",
        });

        // Provide context-specific suggestions
        this.addErrorSuggestions(errorMatch[2].trim(), suggestions);
        continue;
      }

      // Parse warning patterns
      const warningMatch = trimmed.match(
        /warning[:\s]+(?:line\s+)?(\d+)?[:\s]*(.+)/i,
      );
      if (warningMatch) {
        errors.push({
          line: warningMatch[1] ? parseInt(warningMatch[1], 10) : undefined,
          message: warningMatch[2].trim(),
          severity: "warning",
        });
        continue;
      }

      // Catch generic error indicators
      if (trimmed.toLowerCase().includes("error") && trimmed.length < 200) {
        errors.push({
          message: trimmed,
          severity: "error",
        });
        this.addErrorSuggestions(trimmed, suggestions);
      }
    }

    // Add general suggestions if errors were found
    if (errors.length > 0) {
      suggestions.push(
        "Use validate_qb64pe_syntax tool to pre-check syntax before compiling",
      );
      suggestions.push("Review QB64PE wiki documentation for correct syntax");
      suggestions.push("Check variable declarations and type compatibility");
    }
  }

  /**
   * Add context-specific suggestions based on error messages
   */
  private addErrorSuggestions(
    errorMessage: string,
    suggestions: string[],
  ): void {
    const lower = errorMessage.toLowerCase();

    if (lower.includes("type") || lower.includes("mismatch")) {
      suggestions.push(
        "Check variable types and ensure they match in assignments and function calls",
      );
      suggestions.push(
        "Use AS clause for explicit type declarations (e.g., DIM x AS INTEGER)",
      );
    }

    if (lower.includes("dim") || lower.includes("undeclared")) {
      suggestions.push("Ensure all variables are declared with DIM statement");
      suggestions.push(
        "Check variable scoping - use DIM SHARED for global variables",
      );
    }

    if (
      lower.includes("sub") ||
      lower.includes("function") ||
      lower.includes("end")
    ) {
      suggestions.push(
        "Verify SUB/FUNCTION blocks are properly closed with END SUB/END FUNCTION",
      );
      suggestions.push(
        "Ensure SUB/FUNCTION definitions come after main program code",
      );
    }

    if (lower.includes("syntax") || lower.includes("expected")) {
      suggestions.push(
        "Check for missing parentheses, commas, or other syntax elements",
      );
      suggestions.push("Verify statement syntax matches QB64PE documentation");
    }

    if (lower.includes("file") || lower.includes("include")) {
      suggestions.push(
        "Check that all $INCLUDE files exist and paths are correct",
      );
      suggestions.push(
        "Ensure file paths use correct separators for your platform",
      );
    }
  }

  /**
   * Find workspace root by searching for .vscode folder
   */
  private findWorkspaceRoot(sourceFilePath: string): string {
    const path = require("path");
    const fs = require("fs");

    let currentDir = path.dirname(sourceFilePath);
    for (let i = 0; i < 10; i++) {
      const vscodeDir = path.join(currentDir, ".vscode");
      if (fs.existsSync(vscodeDir)) {
        return currentDir;
      }
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break; // Reached root
      currentDir = parent;
    }
    return path.dirname(sourceFilePath); // Fallback to source directory
  }

  /**
   * Get platform-specific compilation notes
   */
  private getPlatformSpecificNotes(): string {
    return `
## Platform-Specific Notes

### Windows
- Executable files have .exe extension
- Console behavior may vary between Windows versions
- Some graphics features may be Windows-specific
- Path separators use backslash (\\)

### macOS
- Executable files have no extension by default
- Case-sensitive file system considerations
- Some libraries may require additional setup
- Path separators use forward slash (/)

### Linux
- Executable files have no extension by default
- Case-sensitive file system (important for includes)
- May require additional development packages
- Path separators use forward slash (/)
- Different distributions may have varying library locations

## Cross-Platform Compatibility Tips

1. **File Paths**: Use relative paths when possible
2. **File Names**: Avoid case variations that work on some platforms but not others
3. **Libraries**: Test platform-specific features on target platforms
4. **Line Endings**: QB64PE handles different line endings, but be aware of text file compatibility
5. **Testing**: Always test on target platforms before distribution

## Compilation Best Practices

1. **Clean Builds**: Delete intermediate files between compilations
2. **Version Control**: Keep source code in version control
3. **Documentation**: Comment your code thoroughly
4. **Testing**: Test compiled executables on clean systems
5. **Dependencies**: Document any external dependencies required
`;
  }
}
