export interface CompilerOption {
  flag: string;
  description: string;
  platform: string[];
  example: string;
  category: 'compilation' | 'debugging' | 'optimization';
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
  private readonly compilerOptions: CompilerOption[] = [
    {
      flag: "-c",
      description: "Compile to executable without running",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c myprogram.bas",
      category: "compilation"
    },
    {
      flag: "-x",
      description: "Compile and run immediately",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -x myprogram.bas",
      category: "compilation"
    },
    {
      flag: "-o",
      description: "Specify output executable name",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c -o myapp myprogram.bas",
      category: "compilation"
    },
    {
      flag: "-z",
      description: "Enable all compiler optimizations",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c -z myprogram.bas",
      category: "optimization"
    },
    {
      flag: "-g",
      description: "Generate debug information",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c -g myprogram.bas",
      category: "debugging"
    },
    {
      flag: "-w",
      description: "Show compilation warnings",
      platform: ["windows", "macos", "linux"],
      example: "qb64pe -c -w myprogram.bas",
      category: "debugging"
    }
  ];

  private readonly debuggingTechniques: DebuggingTechnique[] = [
    {
      technique: "PRINT Statement Debugging",
      description: "Use PRINT statements to display variable values and program flow",
      example: `DIM x AS INTEGER
x = 10
PRINT "Debug: x = "; x
PRINT "About to enter loop"
FOR i = 1 TO 5
    PRINT "Debug: i = "; i
    x = x + i
    PRINT "Debug: x is now "; x
NEXT i
PRINT "Final x = "; x`,
      platform: ["windows", "macos", "linux"],
      useCase: "Basic debugging, variable inspection, flow control verification"
    },
    {
      technique: "$CONSOLE Output",
      description: "Use $CONSOLE to create a console window for debug output",
      example: `$CONSOLE
PRINT "This appears in the console window"
DIM myVar AS INTEGER
myVar = 42
PRINT "myVar = "; myVar
INPUT "Press Enter to continue...", dummy$`,
      platform: ["windows", "macos", "linux"],
      useCase: "Detailed debugging without interfering with graphics"
    },
    {
      technique: "_CONSOLE Toggle",
      description: "Dynamically show/hide console for debugging",
      example: `DIM debug AS INTEGER
debug = 1  ' Set to 1 for debugging

IF debug THEN _CONSOLE ON

' Your program code here
FOR i = 1 TO 10
    IF debug THEN PRINT "Processing item"; i
    ' Main program logic
NEXT i

IF debug THEN
    PRINT "Debug: Program completed"
    INPUT "Press Enter to exit...", dummy$
END IF`,
      platform: ["windows", "macos", "linux"],
      useCase: "Toggle debugging output on/off"
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
      useCase: "Persistent debugging, analyzing program execution after running"
    },
    {
      technique: "Error Handling with ON ERROR",
      description: "Use QB64PE error handling to catch and debug runtime errors",
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
      useCase: "Runtime error debugging, graceful error recovery"
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
      useCase: "Interactive debugging, step-through execution"
    }
  ];

  /**
   * Get compiler options based on platform and type
   */
  async getCompilerOptions(platform: string = "all", optionType: string = "all"): Promise<CompilerOption[]> {
    let options = this.compilerOptions;

    // Filter by platform
    if (platform !== "all") {
      options = options.filter(option => 
        option.platform.includes(platform) || option.platform.includes("all")
      );
    }

    // Filter by option type
    if (optionType !== "all") {
      options = options.filter(option => option.category === optionType);
    }

    return options;
  }

  /**
   * Get debugging help based on the issue and platform
   */
  async getDebuggingHelp(issue: string, platform: string = "all"): Promise<string> {
    const relevantTechniques = this.findRelevantDebuggingTechniques(issue, platform);
    
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
    const compilationOptions = await this.getCompilerOptions("all", "compilation");
    compilationOptions.forEach(option => {
      reference += `### ${option.flag}\n`;
      reference += `**Description:** ${option.description}\n\n`;
      reference += `**Platforms:** ${option.platform.join(", ")}\n\n`;
      reference += `**Example:** \`${option.example}\`\n\n`;
    });

    reference += "## Debugging Options\n\n";
    const debuggingOptions = await this.getCompilerOptions("all", "debugging");
    debuggingOptions.forEach(option => {
      reference += `### ${option.flag}\n`;
      reference += `**Description:** ${option.description}\n\n`;
      reference += `**Platforms:** ${option.platform.join(", ")}\n\n`;
      reference += `**Example:** \`${option.example}\`\n\n`;
    });

    reference += "## Optimization Options\n\n";
    const optimizationOptions = await this.getCompilerOptions("all", "optimization");
    optimizationOptions.forEach(option => {
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
  private findRelevantDebuggingTechniques(issue: string, platform: string): DebuggingTechnique[] {
    const issueLower = issue.toLowerCase();
    const techniques: DebuggingTechnique[] = [];

    // Check for specific keywords in the issue
    if (issueLower.includes("variable") || issueLower.includes("value")) {
      techniques.push(...this.debuggingTechniques.filter(t => 
        t.technique.includes("PRINT") || t.technique.includes("$CONSOLE")
      ));
    }

    if (issueLower.includes("error") || issueLower.includes("crash")) {
      techniques.push(...this.debuggingTechniques.filter(t => 
        t.technique.includes("Error Handling")
      ));
    }

    if (issueLower.includes("loop") || issueLower.includes("infinite")) {
      techniques.push(...this.debuggingTechniques.filter(t => 
        t.technique.includes("Step-by-Step") || t.technique.includes("PRINT")
      ));
    }

    if (issueLower.includes("graphics") || issueLower.includes("screen")) {
      techniques.push(...this.debuggingTechniques.filter(t => 
        t.technique.includes("$CONSOLE") || t.technique.includes("File Logging")
      ));
    }

    // Filter by platform
    if (platform !== "all") {
      return techniques.filter(t => 
        t.platform.includes(platform) || t.platform.includes("all")
      );
    }

    // Remove duplicates
    return techniques.filter((technique, index, array) => 
      array.findIndex(t => t.technique === technique.technique) === index
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

## Basic Debugging Template

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
      tips += "- Consider using Windows Event Viewer for system-level debugging\n\n";
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
