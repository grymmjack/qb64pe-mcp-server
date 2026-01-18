# inject_native_qb64pe_logging

**Category**: Debugging & Logging  
**Description**: Inject native QB64PE logging functions (_LOGINFO, _LOGERROR, etc.) and ECHO functions into source code with proper $CONSOLE:ONLY directive for shell redirection  
**Type**: Code Injection Tool  

## Overview

The `inject_native_qb64pe_logging` tool automatically injects comprehensive native logging capabilities into QB64PE source code, including custom logging functions, ECHO output functions, and structured debugging sections. This tool is essential for transforming regular QB64PE code into debug-ready applications with professional logging capabilities.

**CRITICAL NOTE**: In graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.), you MUST use the ECHO functions instead of PRINT/_PRINTSTRING for console output. The tool automatically handles this requirement and injects appropriate ECHO functions for graphics compatibility.

## Purpose

This tool serves multiple critical functions in QB64PE debugging:

- **Native Logging**: Inject QB64PE-native logging functions for structured output
- **Graphics Compatibility**: Provide ECHO functions that work in all screen modes
- **Console Management**: Ensure proper console directive setup for output redirection
- **Structured Output**: Create organized, parseable debug output
- **Resource Tracking**: Add automatic resource monitoring and logging

## Parameters

### Required Parameters

**sourceCode** (string)  
QB64PE source code to enhance with native logging capabilities. Can include:
- Graphics programs using SCREEN modes
- Console applications requiring structured output
- Programs needing automated execution monitoring
- Code requiring cross-platform debug output

### Optional Parameters

**config** (object)  
Logging configuration options to customize the injection process:

```javascript
{
  consoleDirective: "$CONSOLE:ONLY",     // Console directive to use
  logLevel: "INFO",                      // Logging level (TRACE, INFO, WARN, ERROR)
  enableNativeLogging: true,             // Enable native logging functions
  enableEchoOutput: true,                // Enable ECHO functions for graphics modes
  enableStructuredOutput: true,          // Enable structured output sections
  outputSections: ["INIT", "MAIN", "CLEANUP"],  // Custom output sections
  autoExitTimeout: 10                    // Auto-exit timeout in seconds
}
```

## Response Structure

The tool returns enhanced code with comprehensive logging capabilities:

```json
{
  "enhancedCode": "' Enhanced QB64PE code with native logging\n$CONSOLE:ONLY\n...",
  "loggingFeatures": {
    "nativeLogging": true,
    "echoFunctions": true,
    "structuredSections": true,
    "consoleDirective": "$CONSOLE:ONLY",
    "logLevel": "INFO",
    "autoExit": true
  },
  "injectedFunctions": [
    {
      "name": "_LOGINFO",
      "purpose": "Native info logging with timestamps",
      "usage": "_LOGINFO(\"message\")"
    },
    {
      "name": "ECHO_INFO", 
      "purpose": "Console output for graphics modes",
      "usage": "ECHO_INFO(\"message\")"
    },
    {
      "name": "SECTION_START",
      "purpose": "Begin structured output section",
      "usage": "SECTION_START(\"SECTION_NAME\")"
    }
  ],
  "graphicsCompatibility": {
    "echoFunctionsRequired": true,
    "consoleDirectiveRequired": true,
    "printReplacementNeeded": false,
    "explanation": "ECHO functions handle console output in all screen modes"
  },
  "outputStructure": {
    "sections": ["PROGRAM_START", "INITIALIZATION", "MAIN_LOGIC", "CLEANUP", "PROGRAM_END"],
    "format": "Structured sections with clear delimiters",
    "parsing": "Compatible with parse_qb64pe_structured_output"
  },
  "originalLineCount": 45,
  "enhancedLineCount": 132,
  "addedLoggingCode": 87,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Logging Injection

Inject native logging into a simple QB64PE program:

```javascript
const simpleCode = `
PRINT "Hello World"
INPUT name$
PRINT "Hello " + name$
`;

const enhanced = await injectNativeQb64peLogging({
  sourceCode: simpleCode
});

console.log("Logging features added:", enhanced.loggingFeatures);
console.log("Functions injected:", enhanced.injectedFunctions.length);
console.log("\nEnhanced code:");
console.log(enhanced.enhancedCode);
```

### Graphics Mode Logging

Inject ECHO functions for graphics applications:

```javascript
const graphicsCode = `
SCREEN _NEWIMAGE(800, 600, 32)
_TITLE "Graphics Demo"

FOR i = 1 TO 100
    CIRCLE (RND * 800, RND * 600), 20, _RGB(255, 0, 0)
NEXT i

_DELAY 2
`;

const enhanced = await injectNativeQb64peLogging({
  sourceCode: graphicsCode,
  config: {
    enableEchoOutput: true,
    enableStructuredOutput: true,
    logLevel: "INFO"
  }
});

console.log("Graphics compatibility:", enhanced.graphicsCompatibility);
console.log("ECHO functions required:", enhanced.graphicsCompatibility.echoFunctionsRequired);
console.log("\nEnhanced graphics code:");
console.log(enhanced.enhancedCode);
```

### Custom Configuration Logging

Apply specific logging configuration:

```javascript
const complexCode = `
OPEN "data.txt" FOR INPUT AS #1
WHILE NOT EOF(1)
    LINE INPUT #1, line$
    PRINT line$
WEND
CLOSE #1
`;

const enhanced = await injectNativeQb64peLogging({
  sourceCode: complexCode,
  config: {
    consoleDirective: "$CONSOLE:ONLY",
    logLevel: "TRACE",
    enableNativeLogging: true,
    enableStructuredOutput: true,
    outputSections: ["FILE_INIT", "FILE_PROCESS", "FILE_CLEANUP"],
    autoExitTimeout: 15
  }
});

console.log("Output sections:", enhanced.outputStructure.sections);
console.log("Logging level:", enhanced.loggingFeatures.logLevel);
```

### Automated Execution Enhancement

Prepare code for automated execution with comprehensive logging:

```javascript
const automationCode = `
FOR i = 1 TO 1000
    result = SIN(i) + COS(i)
    IF i MOD 100 = 0 THEN PRINT "Progress:", i
NEXT i
PRINT "Calculation complete"
`;

const enhanced = await injectNativeQb64peLogging({
  sourceCode: automationCode,
  config: {
    enableNativeLogging: true,
    enableStructuredOutput: true,
    autoExitTimeout: 30,
    logLevel: "INFO"
  }
});

console.log("Automation ready:", enhanced.loggingFeatures.autoExit);
console.log("Enhanced for automated execution");
```

## Integration Workflows

### Graphics Mode Enhancement

```javascript
class GraphicsLogger {
  async enhanceGraphicsProgram(graphicsCode) {
    const enhanced = await injectNativeQb64peLogging({
      sourceCode: graphicsCode,
      config: {
        enableEchoOutput: true,  // MANDATORY for graphics modes
        enableStructuredOutput: true,
        consoleDirective: "$CONSOLE:ONLY"
      }
    });
    
    return {
      code: enhanced.enhancedCode,
      compatibility: enhanced.graphicsCompatibility,
      usage: this.generateUsageInstructions(enhanced),
      monitoring: this.generateMonitoringSetup(enhanced)
    };
  }
  
  generateUsageInstructions(enhanced) {
    return {
      compilation: "qb64pe enhanced_graphics_program.bas",
      execution: "enhanced_graphics_program.exe > debug_output.txt",
      parsing: "parse_qb64pe_structured_output debug_output.txt",
      note: "ECHO functions provide console output in graphics modes"
    };
  }
  
  validateGraphicsCompatibility(code) {
    const hasGraphics = /SCREEN\s+_NEWIMAGE|SCREEN\s+\d+/.test(code);
    const hasEcho = /ECHO_/.test(code);
    const hasConsoleDirective = /\$CONSOLE/.test(code);
    
    return {
      hasGraphics,
      hasEcho,
      hasConsoleDirective,
      compatible: !hasGraphics || (hasGraphics && hasEcho && hasConsoleDirective)
    };
  }
}
```

### Automated Testing Pipeline

```javascript
class AutomatedTestingPipeline {
  async setupLoggingForTests(testCode) {
    const enhanced = await injectNativeQb64peLogging({
      sourceCode: testCode,
      config: {
        enableNativeLogging: true,
        enableStructuredOutput: true,
        logLevel: "INFO",
        autoExitTimeout: 60,
        outputSections: ["TEST_START", "TEST_EXECUTION", "TEST_RESULTS", "TEST_END"]
      }
    });
    
    return {
      testCode: enhanced.enhancedCode,
      executionPlan: this.createExecutionPlan(enhanced),
      outputParser: this.createOutputParser(enhanced),
      validator: this.createValidator(enhanced)
    };
  }
  
  createExecutionPlan(enhanced) {
    return {
      timeout: enhanced.loggingFeatures.autoExit ? enhanced.config?.autoExitTimeout || 10 : 60,
      command: "qb64pe -x test_program.bas && timeout 60s ./test_program > test_output.txt",
      monitoring: enhanced.outputStructure.sections,
      expectedOutputs: this.extractExpectedOutputs(enhanced.enhancedCode)
    };
  }
  
  createOutputParser(enhanced) {
    return {
      sections: enhanced.outputStructure.sections,
      format: enhanced.outputStructure.format,
      parseFunction: "parse_qb64pe_structured_output",
      compatibility: enhanced.outputStructure.parsing
    };
  }
}
```

### Development Debugging Framework

```javascript
class DevelopmentDebugger {
  async setupDevelopmentLogging(sourceCode) {
    const enhanced = await injectNativeQb64peLogging({
      sourceCode,
      config: {
        enableNativeLogging: true,
        enableEchoOutput: true,
        enableStructuredOutput: true,
        logLevel: "TRACE",
        consoleDirective: "$CONSOLE",  // Both console and graphics
        outputSections: ["INIT", "DEBUG", "MAIN", "CLEANUP"]
      }
    });
    
    return {
      debugCode: enhanced.enhancedCode,
      features: enhanced.loggingFeatures,
      functions: enhanced.injectedFunctions,
      workflow: this.createDevelopmentWorkflow(enhanced)
    };
  }
  
  createDevelopmentWorkflow(enhanced) {
    return {
      phases: [
        "1. Code with native logging injected",
        "2. Compile and run with console output",
        "3. Monitor structured debug sections",
        "4. Analyze ECHO function output",
        "5. Use native logging for detailed tracing"
      ],
      tools: enhanced.injectedFunctions.map(func => func.name),
      benefits: [
        "Real-time debug output in graphics modes",
        "Structured sections for organized analysis",
        "Native QB64PE logging integration",
        "Cross-platform compatible output"
      ]
    };
  }
}
```

## Error Handling

The tool handles various scenarios gracefully:

### Graphics Mode Detection

```javascript
const handleGraphicsMode = async (sourceCode, config) => {
  const hasGraphics = /SCREEN\s+_NEWIMAGE|SCREEN\s+\d+/i.test(sourceCode);
  
  if (hasGraphics) {
    // Force ECHO functions for graphics compatibility
    const graphicsConfig = {
      ...config,
      enableEchoOutput: true,
      consoleDirective: config?.consoleDirective || "$CONSOLE:ONLY"
    };
    
    console.log("Graphics mode detected - ECHO functions required");
    return await injectNativeQb64peLogging({ sourceCode, config: graphicsConfig });
  }
  
  return await injectNativeQb64peLogging({ sourceCode, config });
};
```

### Code Parsing Issues

```javascript
const safeInjectLogging = async (sourceCode, config) => {
  try {
    return await injectNativeQb64peLogging({ sourceCode, config });
  } catch (error) {
    if (error.message.includes('parse error')) {
      console.warn("Code parsing issue, applying basic logging injection");
      return await injectBasicLogging(sourceCode);
    }
    throw error;
  }
};

const injectBasicLogging = async (sourceCode) => {
  // Minimal logging injection for problematic code
  const basicEnhancement = `
$CONSOLE:ONLY

' Basic ECHO functions
SUB ECHO_INFO(msg$)
    PRINT "INFO: " + msg$
END SUB

SUB ECHO_WARN(msg$)
    PRINT "WARN: " + msg$
END SUB

SUB ECHO_ERROR(msg$)
    PRINT "ERROR: " + msg$
END SUB

ECHO_INFO("Program started")

${sourceCode}

ECHO_INFO("Program ended")
`;

  return {
    enhancedCode: basicEnhancement,
    loggingFeatures: {
      nativeLogging: false,
      echoFunctions: true,
      basic: true
    }
  };
};
```

### Configuration Validation

```javascript
const validateConfig = (config) => {
  const defaults = {
    consoleDirective: "$CONSOLE:ONLY",
    logLevel: "INFO",
    enableNativeLogging: true,
    enableEchoOutput: true,
    enableStructuredOutput: true,
    autoExitTimeout: 10
  };
  
  const validLogLevels = ["TRACE", "INFO", "WARN", "ERROR"];
  const validConsoleDirectives = ["$CONSOLE", "$CONSOLE:ONLY"];
  
  const validated = { ...defaults, ...config };
  
  if (!validLogLevels.includes(validated.logLevel)) {
    console.warn(`Invalid log level "${validated.logLevel}", using INFO`);
    validated.logLevel = "INFO";
  }
  
  if (!validConsoleDirectives.includes(validated.consoleDirective)) {
    console.warn(`Invalid console directive "${validated.consoleDirective}", using $CONSOLE:ONLY`);
    validated.consoleDirective = "$CONSOLE:ONLY";
  }
  
  return validated;
};
```

## Best Practices

### 1. Graphics Mode Requirements

Always use ECHO functions for graphics modes:

```javascript
// CRITICAL: For graphics programs, ECHO functions are MANDATORY
const graphicsProgram = `
SCREEN _NEWIMAGE(800, 600, 32)
' WRONG: PRINT "Debug info"  <- Will not show in graphics mode
' RIGHT: ECHO_INFO("Debug info")  <- Works in all modes
`;

const enhanced = await injectNativeQb64peLogging({
  sourceCode: graphicsProgram,
  config: {
    enableEchoOutput: true  // MANDATORY for graphics
  }
});
```

### 2. Console Directive Selection

Choose appropriate console directives:

```javascript
// For automated execution (output redirection)
const automatedConfig = {
  consoleDirective: "$CONSOLE:ONLY"  // Console only, no graphics window
};

// For development (both console and graphics)
const developmentConfig = {
  consoleDirective: "$CONSOLE"  // Both console and graphics available
};
```

### 3. Structured Output Organization

Use structured sections for organized output:

```javascript
const structuredConfig = {
  enableStructuredOutput: true,
  outputSections: [
    "INITIALIZATION",
    "DATA_PROCESSING", 
    "RESULTS",
    "CLEANUP"
  ]
};

const enhanced = await injectNativeQb64peLogging({
  sourceCode: myCode,
  config: structuredConfig
});
```

### 4. Log Level Management

Select appropriate log levels:

```javascript
// Development: Verbose logging
const devConfig = { logLevel: "TRACE" };

// Testing: Standard logging
const testConfig = { logLevel: "INFO" };

// Production: Error logging only
const prodConfig = { logLevel: "ERROR" };
```

## Cross-References

- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Comprehensive debugging enhancement
- **[generate_advanced_debugging_template](./generate_advanced_debugging_template.md)** - Advanced debugging templates
- **[get_llm_debugging_guide](./get_llm_debugging_guide.md)** - LLM-specific debugging
- **[parse_qb64pe_structured_output](./parse_qb64pe_structured_output.md)** - Output parsing
- **[get_qb64pe_debugging_best_practices](./get_qb64pe_debugging_best_practices.md)** - Debugging best practices

## See Also

- [Echo Functionality Summary](../ECHO_FUNCTIONALITY_SUMMARY.md)
- [Graphics Mode Update](../GRAPHICS_MODE_UPDATE_SUMMARY.md)
- [File-Based Logging](../FILE_BASED_LOGGING_UPDATE_SUMMARY.md)
