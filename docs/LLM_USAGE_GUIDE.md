# LLM Usage Guide for QB64PE MCP Server

## Overview
This guide shows LLMs how to effectively use the QB64PE MCP server for debugging and development assistance.

## Available Tools for LLMs

### 🔧 Core Debugging Tools

#### `enhance_qb64pe_code_for_debugging`
**Purpose**: Transform problematic QB64PE code into automation-friendly code
**When to use**: ALWAYS use this before attempting to execute QB64PE programs

```typescript
// Example LLM tool call
const result = await use_tool("enhance_qb64pe_code_for_debugging", {
  sourceCode: `
PRINT "QB64PE Test Program"
PRINT "Press any key to continue..."
SLEEP
END`,
  config: {
    enableConsole: true,
    enableFlowControl: true,
    enableLogging: true,
    timeoutSeconds: 30,
    autoExit: true
  }
});

// The result contains:
// - enhancedCode: Ready-to-use QB64PE code with debugging features
// - modifications: List of what was changed
// - issues: Problems that were detected and fixed
// - debugFeatures: List of debugging features enabled
```

#### `get_llm_debugging_guide`
**Purpose**: Get comprehensive debugging guidance for LLMs
**When to use**: When you need to understand QB64PE debugging best practices

```typescript
const guide = await use_tool("get_llm_debugging_guide");
// Returns detailed guidance on timeouts, program types, and execution strategies
```

#### `get_qb64pe_debugging_best_practices`
**Purpose**: Get general debugging best practices
**When to use**: When providing debugging advice to users

```typescript
const practices = await use_tool("get_qb64pe_debugging_best_practices");
// Returns comprehensive debugging practices for QB64PE
```

### 🔧 Native Logging Tools (NEW!)

#### `inject_native_qb64pe_logging`
**Purpose**: Add native QB64PE logging functions with proper console directives
**When to use**: When you need structured output and shell redirection compatibility

```typescript
const enhanced = await use_tool("inject_native_qb64pe_logging", {
  sourceCode: `PRINT "Hello"
FOR i = 1 TO 10
    PRINT i
NEXT`,
  config: {
    consoleDirective: "$CONSOLE:ONLY",  // Critical for shell redirection!
    enableNativeLogging: true,
    enableStructuredOutput: true,
    autoExitTimeout: 10
  }
});
// Returns enhanced code with _LOGINFO, _LOGERROR functions and structured sections
```

#### `generate_advanced_debugging_template`
**Purpose**: Create comprehensive debugging templates for complex analysis
**When to use**: When starting a new debugging session or analysis program

```typescript
const template = await use_tool("generate_advanced_debugging_template", {
  programName: "ZLIB Analyzer",
  analysisSteps: [
    "Header Validation",
    "DEFLATE Parsing", 
    "CRC32 Verification",
    "Data Extraction"
  ],
  config: {
    consoleDirective: "$CONSOLE:ONLY",
    enableNativeLogging: true,
    logLevel: "INFO"
  }
});
// Returns complete QB64PE program with systematic debugging structure
```

#### `parse_qb64pe_structured_output`
**Purpose**: Parse structured output from enhanced QB64PE programs
**When to use**: After capturing output from enhanced QB64PE programs

```typescript
const analysis = await use_tool("parse_qb64pe_structured_output", {
  output: `=== PROGRAM ANALYSIS ===
Program: Test
=== STEP 1: VALIDATION ===
INFO: Validation completed
=== RESULTS SUMMARY ===
SUCCESS: All steps completed`
});
// Returns structured analysis with sections, logs, and execution status
```

#### `generate_output_capture_commands`
**Purpose**: Generate cross-platform commands for capturing QB64PE output
**When to use**: When you need to provide users with monitoring commands

```typescript
const commands = await use_tool("generate_output_capture_commands", {
  programPath: "enhanced_analyzer.exe",
  outputPath: "analysis_results.txt",
  includeMonitoring: true
});
// Returns platform-specific commands for output capture and monitoring
```

### 📋 Workflow Tools

#### `analyze_qb64pe_execution_mode`
**Purpose**: Understand what type of program you're dealing with
**When to use**: Before deciding on execution strategy

```typescript
const analysis = await use_tool("analyze_qb64pe_execution_mode", {
  sourceCode: userCode
});

// Returns program type: 'console', 'graphics', or 'mixed'
// Use this to determine appropriate timeouts and monitoring
```

#### `generate_monitoring_template`
**Purpose**: Wrap user code with comprehensive monitoring
**When to use**: For complex programs that need detailed tracking

```typescript
const monitored = await use_tool("generate_monitoring_template", {
  originalCode: userCode
});
// Returns code with logging, screenshots, and execution monitoring
```

## Prompt Templates for Structured Guidance

### `debug-qb64pe-comprehensive`
**Purpose**: Complete debugging workflow with enhanced analysis
**When to use**: When user reports QB64PE debugging issues

```typescript
const guidance = await use_prompt("debug-qb64pe-comprehensive", {
  sourceCode: userCode,
  problemDescription: "Program hangs waiting for input",
  executionContext: "automated", // or "interactive" or "testing"
  platform: "windows" // optional
});
```

## LLM Decision Tree for QB64PE Programs

```
User asks for QB64PE help
│
├── Has QB64PE code? 
│   ├── YES → Continue to analysis
│   └── NO → Use regular QB64PE tools (keywords, wiki, etc.)
│
├── Is this a debugging issue?
│   ├── YES → Use debugging workflow (see below)
│   └── NO → Use appropriate QB64PE tools
│
└── Debugging Workflow:
    1. Analyze code with analyze_qb64pe_execution_mode
    2. Enhance code with enhance_qb64pe_code_for_debugging  
    3. Provide execution guidance based on program type
    4. Set appropriate timeouts (see timeout guide below)
```

## Critical Timeout Guidelines for LLMs

### 🚨 NEVER WAIT INDEFINITELY FOR QB64PE PROGRAMS

#### Program Type Detection:
1. **Graphics-Only Programs** (no $CONSOLE, uses SCREEN/graphics)
   - **Timeout**: 30-60 seconds maximum
   - **Action**: Generate screenshots, then suggest human testing
   - **Reason**: These often wait forever for user interaction

2. **Console Programs** (has $CONSOLE, minimal graphics)
   - **Timeout**: 15-30 seconds for simple, 60+ for complex
   - **Action**: Monitor console output for completion signals
   - **Reason**: Should terminate naturally or prompt for input

3. **Mixed Programs** (both console and graphics)
   - **Timeout**: Monitor console output, timeout graphics at 60 seconds
   - **Action**: Parse console for progress, capture graphics screenshots
   - **Reason**: Console shows progress, graphics may need interaction

#### Example LLM Responses:

**For Graphics Programs:**
```
I'll enhance this QB64PE graphics program for debugging and run it with a 60-second timeout. Graphics programs often require user interaction, so if it doesn't complete automatically, I'll capture screenshots and suggest manual testing.

[Enhanced code with debugging features]
[Execution with timeout monitoring]
[Screenshots and analysis if available]

If the program is waiting for user interaction (mouse clicks, key presses), you'll need to run it manually to test the interactive features.
```

**For Console Programs:**
```
This appears to be a console-based QB64PE program. I'll enhance it for debugging and monitor the output for completion signals or error messages.

[Enhanced code with debugging features]
[Execution with console output monitoring]
[Analysis of output and completion status]
```

## Practical LLM Workflow Examples

### Example 1: User Reports Hanging Program

```typescript
// 1. First, analyze the program type
const analysis = await use_tool("analyze_qb64pe_execution_mode", {
  sourceCode: userCode
});

// 2. Enhance the code for debugging
const enhanced = await use_tool("enhance_qb64pe_code_for_debugging", {
  sourceCode: userCode,
  config: {
    enableConsole: true,
    enableFlowControl: true,
    timeoutSeconds: analysis.hasGraphics ? 60 : 30,
    autoExit: true
  }
});

// 3. Provide enhanced code to user with execution guidance
const response = `I've enhanced your QB64PE code to fix the hanging issue. The enhanced version includes:

${enhanced.modifications.join('\n')}

Here's the enhanced code:
\`\`\`basic
${enhanced.enhancedCode}
\`\`\`

Execution guidance:
- Program type: ${analysis.hasGraphics ? 'Graphics' : 'Console'}
- Expected timeout: ${analysis.hasGraphics ? '60' : '30'} seconds
- ${analysis.hasGraphics ? 'May require user interaction for full testing' : 'Should complete automatically'}
`;
```

### Example 2: User Asks About Compilation Errors

```typescript
// 1. Check for debugging best practices
const practices = await use_tool("get_qb64pe_debugging_best_practices");

// 2. If code is provided, enhance it
if (userProvidedCode) {
  const enhanced = await use_tool("enhance_qb64pe_code_for_debugging", {
    sourceCode: userProvidedCode,
    config: { enableResourceTracking: true }
  });
  
  // Provide solution based on enhanced analysis
}
```

### Example 3: User Wants to Run Graphics Program

```typescript
// 1. Analyze for graphics
const analysis = await use_tool("analyze_qb64pe_execution_mode", {
  sourceCode: userCode
});

if (analysis.hasGraphics) {
  // 2. Enhance with screenshots enabled
  const enhanced = await use_tool("enhance_qb64pe_code_for_debugging", {
    sourceCode: userCode,
    config: {
      enableScreenshots: true,
      enableConsole: true,
      timeoutSeconds: 60
    }
  });
  
  // 3. Warn about graphics program behavior
  const response = `This is a graphics program that will open a window. I've enhanced it to automatically capture screenshots and use a 60-second timeout. If it requires user interaction (mouse/keyboard), you'll need to test it manually.

Enhanced code with automatic screenshots:
\`\`\`basic
${enhanced.enhancedCode}
\`\`\`

The program will:
- Automatically capture screenshots at key points
- Log activities to qb64pe-logs/
- Timeout after 60 seconds if waiting for input
- Save screenshots to qb64pe-screenshots/
`;
}
```

## Error Handling for LLMs

### Common Issues and Responses:

1. **Tool Call Fails:**
```typescript
try {
  const enhanced = await use_tool("enhance_qb64pe_code_for_debugging", {
    sourceCode: userCode
  });
} catch (error) {
  // Fall back to basic guidance
  const guide = await use_tool("get_llm_debugging_guide");
  return `I couldn't automatically enhance the code, but here's debugging guidance: ${guide}`;
}
```

2. **No Code Provided:**
```typescript
if (!userCode) {
  const practices = await use_tool("get_qb64pe_debugging_best_practices");
  return `To help debug QB64PE programs, I need to see the code. Here are general debugging practices: ${practices}`;
}
```

3. **Complex Program:**
```typescript
if (userCode.split('\n').length > 100) {
  const monitoring = await use_tool("generate_monitoring_template", {
    originalCode: userCode
  });
  return `This is a complex program. I've wrapped it with comprehensive monitoring: ${monitoring}`;
}
```

## Integration with Other MCP Tools

LLMs can combine debugging tools with other QB64PE MCP tools:

```typescript
// 1. Search for related keywords
const keywords = await use_tool("search_qb64pe_keywords", {
  query: "graphics debugging"
});

// 2. Get compatibility information  
const compatibility = await use_tool("validate_qb64pe_compatibility", {
  code: userCode
});

// 3. Enhance for debugging
const enhanced = await use_tool("enhance_qb64pe_code_for_debugging", {
  sourceCode: userCode
});

// 4. Provide comprehensive response combining all information
```

## Summary for LLMs

✅ **ALWAYS enhance QB64PE code before execution**
✅ **Use appropriate timeouts based on program type**
✅ **Monitor console output for completion signals**
✅ **Capture screenshots for graphics programs**
✅ **Hand off to humans for interactive testing when needed**
❌ **NEVER wait indefinitely for QB64PE programs**
❌ **Don't ignore program type analysis**
❌ **Don't skip debugging enhancements for "simple" programs**

The debugging enhancement system makes QB64PE development automation-friendly while maintaining compatibility with human workflows.
