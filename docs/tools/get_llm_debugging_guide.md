# get_llm_debugging_guide

**Category**: LLM & Automation  
**Description**: Get comprehensive debugging guide specifically designed for LLMs and automated systems working with QB64PE  
**Type**: LLM Integration Guide  

## Overview

The `get_llm_debugging_guide` tool provides specialized debugging guidance tailored for Large Language Models (LLMs) and automated systems working with QB64PE. This tool addresses the unique challenges of debugging QB64PE applications in automated environments, including timeout management, output parsing, error detection, and execution monitoring.

The guide covers LLM-specific debugging strategies, automated execution patterns, structured output formatting, and integration with AI development workflows. It's essential for AI systems that generate, test, or debug QB64PE code programmatically.

## Purpose

This tool serves multiple critical functions for LLM and automated systems:

- **Automated Debugging**: Set up debugging for AI-driven development
- **Timeout Management**: Handle execution timeouts in automated environments
- **Output Parsing**: Structure QB64PE output for AI analysis
- **Error Detection**: Automatically identify and categorize errors
- **Execution Monitoring**: Monitor QB64PE programs in headless environments

## Parameters

This tool takes no parameters and returns comprehensive LLM debugging guidance.

## Response Structure

The tool returns a structured guide optimized for LLM interactions:

```json
{
  "llmDebuggingGuide": {
    "automatedExecution": {
      "timeoutStrategy": "Always implement execution timeouts for automated runs",
      "defaultTimeout": 30,
      "timeoutCommand": "timeout 30s ./program || echo 'EXECUTION_TIMEOUT'",
      "monitoringPatterns": [
        "EXECUTION_START",
        "EXECUTION_END", 
        "EXECUTION_TIMEOUT",
        "EXECUTION_ERROR"
      ]
    },
    "structuredOutput": {
      "format": "Use structured sections for AI parsing",
      "sections": [
        "=== EXECUTION_SUMMARY ===",
        "=== DEBUG_INFO ===",
        "=== ERROR_LOG ===",
        "=== RESOURCE_USAGE ==="
      ],
      "parsing": {
        "sectionDelimiter": "===",
        "keyValueFormat": "key: value",
        "listFormat": "- item"
      }
    },
    "consoleManagement": {
      "directive": "$CONSOLE:ONLY for automated execution",
      "echoFunctions": "Use ECHO_INFO, ECHO_WARN, ECHO_ERROR for structured output",
      "graphicsMode": "MANDATORY: Use ECHO functions in graphics modes for console output",
      "destination": "Avoid _DEST _CONSOLE in automated contexts"
    },
    "errorDetection": {
      "patterns": [
        "compilation_error: qb64pe compilation failed",
        "runtime_error: program crashed during execution", 
        "timeout_error: execution exceeded time limit",
        "resource_error: insufficient memory or file access"
      ],
      "errorParsing": "Parse stderr and structured error sections",
      "recovery": "Implement automatic error recovery and retry logic"
    }
  },
  "aiWorkflows": {
    "codeGeneration": {
      "debugging": "Always inject debugging code in generated programs",
      "templates": "Use debugging templates for consistent output",
      "validation": "Validate generated code before execution"
    },
    "testing": {
      "automated": "Set up automated test execution with timeouts",
      "validation": "Parse output to determine test success/failure",
      "reporting": "Generate structured test reports"
    },
    "analysis": {
      "outputParsing": "Parse structured debug output for analysis",
      "patternRecognition": "Identify common error patterns",
      "optimization": "Suggest code improvements based on debug data"
    }
  },
  "executionPatterns": {
    "headlessExecution": {
      "setup": "Configure QB64PE for headless operation",
      "monitoring": "Monitor execution without user interaction",
      "termination": "Implement clean termination signals"
    },
    "batchProcessing": {
      "multiplePrograms": "Execute multiple QB64PE programs in sequence",
      "resultAggregation": "Collect and analyze results from batch runs",
      "errorHandling": "Handle errors without stopping batch processing"
    },
    "realTimeMonitoring": {
      "statusUpdates": "Provide regular execution status updates",
      "progressTracking": "Track progress through long-running operations",
      "adaptiveTimeouts": "Adjust timeouts based on program complexity"
    }
  },
  "bestPractices": [
    "Always use $CONSOLE:ONLY for automated execution",
    "Implement execution timeouts for all automated runs",
    "Use structured output sections for AI parsing",
    "Include error detection and recovery mechanisms",
    "Monitor resource usage and cleanup",
    "Provide clear execution status indicators",
    "Use ECHO functions instead of PRINT in graphics modes",
    "Structure output for both human and AI consumption"
  ],
  "commonPitfalls": [
    {
      "issue": "Programs hang without timeout",
      "solution": "Always implement execution timeouts",
      "prevention": "Use timeout commands and internal timeout logic"
    },
    {
      "issue": "Console output invisible in graphics mode",
      "solution": "Use $CONSOLE directive and ECHO functions",
      "prevention": "Always include console management in graphics programs"
    },
    {
      "issue": "Unstructured output difficult to parse",
      "solution": "Use structured sections and consistent formatting",
      "prevention": "Follow structured output templates"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Get Complete LLM Debugging Guide

Retrieve comprehensive LLM debugging guidance:

```javascript
const guide = await getLlmDebuggingGuide();

console.log("=== LLM QB64PE Debugging Guide ===");
console.log("\n1. Automated Execution:");
console.log("Timeout Strategy:", guide.llmDebuggingGuide.automatedExecution.timeoutStrategy);
console.log("Default Timeout:", guide.llmDebuggingGuide.automatedExecution.defaultTimeout, "seconds");
console.log("Timeout Command:", guide.llmDebuggingGuide.automatedExecution.timeoutCommand);

console.log("\n2. Structured Output:");
console.log("Format:", guide.llmDebuggingGuide.structuredOutput.format);
guide.llmDebuggingGuide.structuredOutput.sections.forEach(section => {
  console.log("Section:", section);
});

console.log("\n3. Console Management:");
console.log("Directive:", guide.llmDebuggingGuide.consoleManagement.directive);
console.log("Echo Functions:", guide.llmDebuggingGuide.consoleManagement.echoFunctions);
```

### Implement Automated Execution Pattern

Set up automated QB64PE execution with LLM guidance:

```javascript
const guide = await getLlmDebuggingGuide();
const executionPattern = guide.llmDebuggingGuide.automatedExecution;

console.log("Automated Execution Setup:");
console.log("1. Timeout Configuration:");
console.log(`   Default: ${executionPattern.defaultTimeout} seconds`);
console.log(`   Command: ${executionPattern.timeoutCommand}`);

console.log("\n2. Monitoring Patterns:");
executionPattern.monitoringPatterns.forEach(pattern => {
  console.log(`   Watch for: ${pattern}`);
});

const automatedExecutionTemplate = `
#!/bin/bash
# Automated QB64PE execution script

PROGRAM="$1"
TIMEOUT="${2:-30}"
OUTPUT_FILE="execution_output.txt"

echo "Starting automated execution of $PROGRAM"
echo "Timeout: $TIMEOUT seconds"

# Execute with timeout and capture output
timeout ${TIMEOUT}s qb64pe -x "$PROGRAM" > "$OUTPUT_FILE" 2>&1
EXIT_CODE=$?

# Check execution result
if [ $EXIT_CODE -eq 124 ]; then
    echo "EXECUTION_TIMEOUT" >> "$OUTPUT_FILE"
    echo "Program timed out after $TIMEOUT seconds"
elif [ $EXIT_CODE -ne 0 ]; then
    echo "EXECUTION_ERROR: Exit code $EXIT_CODE" >> "$OUTPUT_FILE"
    echo "Program failed with exit code $EXIT_CODE"
else
    echo "EXECUTION_SUCCESS" >> "$OUTPUT_FILE"
    echo "Program completed successfully"
fi

# Parse structured output
parse_qb64pe_structured_output "$OUTPUT_FILE"
`;

console.log("\nAutomated execution script:");
console.log(automatedExecutionTemplate);
```

### Setup Structured Output for AI Parsing

Configure structured output based on LLM guidelines:

```javascript
const guide = await getLlmDebuggingGuide();
const outputGuide = guide.llmDebuggingGuide.structuredOutput;

console.log("Structured Output Configuration:");
console.log("Format:", outputGuide.format);
console.log("Sections:", outputGuide.sections);
console.log("Parsing Rules:", outputGuide.parsing);

const structuredOutputTemplate = `
' LLM-optimized structured output template
$CONSOLE:ONLY

SUB ECHO_SECTION(sectionName$)
    PRINT "=== " + sectionName$ + " ==="
END SUB

SUB ECHO_INFO(message$)
    PRINT "INFO: " + message$
END SUB

SUB ECHO_WARN(message$)
    PRINT "WARN: " + message$
END SUB

SUB ECHO_ERROR(message$)
    PRINT "ERROR: " + message$
END SUB

' Program start
ECHO_SECTION("EXECUTION_SUMMARY")
ECHO_INFO("Program: " + COMMAND$(0))
ECHO_INFO("Start time: " + DATE$ + " " + TIME$)

ECHO_SECTION("DEBUG_INFO")
ECHO_INFO("Initializing program")

' Main program logic here
FOR i = 1 TO 10
    ECHO_INFO("Processing step: " + STR$(i))
    ' Your code here
NEXT i

ECHO_SECTION("EXECUTION_END")
ECHO_INFO("Program completed successfully")
ECHO_INFO("End time: " + DATE$ + " " + TIME$)
`;

console.log("\nStructured output template:");
console.log(structuredOutputTemplate);
```

### Error Detection and Recovery

Implement error detection patterns for LLM systems:

```javascript
const guide = await getLlmDebuggingGuide();
const errorGuide = guide.llmDebuggingGuide.errorDetection;

console.log("Error Detection Patterns:");
errorGuide.patterns.forEach(pattern => {
  console.log(`- ${pattern}`);
});

console.log("\nError Parsing:", errorGuide.errorParsing);
console.log("Recovery Strategy:", errorGuide.recovery);

const errorDetectionTemplate = `
// JavaScript error detection for LLM systems
class QB64PEErrorDetector {
  detectErrors(output) {
    const errors = [];
    
    // Check for compilation errors
    if (output.includes('compilation failed') || output.includes('error:')) {
      errors.push({
        type: 'compilation_error',
        severity: 'high',
        message: this.extractCompilationError(output)
      });
    }
    
    // Check for runtime errors
    if (output.includes('runtime error') || output.includes('crashed')) {
      errors.push({
        type: 'runtime_error',
        severity: 'high',
        message: this.extractRuntimeError(output)
      });
    }
    
    // Check for timeout
    if (output.includes('EXECUTION_TIMEOUT')) {
      errors.push({
        type: 'timeout_error',
        severity: 'medium',
        message: 'Program execution exceeded time limit'
      });
    }
    
    return errors;
  }
  
  suggestRecovery(errors) {
    const suggestions = [];
    
    errors.forEach(error => {
      switch (error.type) {
        case 'compilation_error':
          suggestions.push('Check syntax and fix compilation issues');
          break;
        case 'runtime_error':
          suggestions.push('Add error handling and resource validation');
          break;
        case 'timeout_error':
          suggestions.push('Optimize code or increase timeout limit');
          break;
      }
    });
    
    return suggestions;
  }
}
`;

console.log("\nError detection implementation:");
console.log(errorDetectionTemplate);
```

## Integration Workflows

### LLM Code Generation with Debugging

```javascript
class LLMCodeGenerator {
  async generateWithDebugging(prompt, requirements) {
    const guide = await getLlmDebuggingGuide();
    
    const debugRequirements = {
      ...requirements,
      debugging: {
        console: guide.llmDebuggingGuide.consoleManagement,
        timeout: guide.llmDebuggingGuide.automatedExecution.defaultTimeout,
        structure: guide.llmDebuggingGuide.structuredOutput
      }
    };
    
    const code = await this.generateCode(prompt, debugRequirements);
    const enhancedCode = await this.injectDebugging(code, guide);
    
    return {
      originalCode: code,
      debugCode: enhancedCode,
      executionInstructions: this.generateExecutionInstructions(guide),
      monitoringSetup: this.generateMonitoringSetup(guide)
    };
  }
  
  injectDebugging(code, guide) {
    let enhanced = code;
    
    // Add console directive
    if (!enhanced.includes('$CONSOLE')) {
      enhanced = '$CONSOLE:ONLY\n' + enhanced;
    }
    
    // Add structured output sections
    enhanced = this.addStructuredSections(enhanced, guide);
    
    // Add timeout mechanism
    enhanced = this.addTimeoutMechanism(enhanced, guide);
    
    // Add ECHO functions
    enhanced = this.addEchoFunctions(enhanced);
    
    return enhanced;
  }
}
```

### Automated Testing Framework

```javascript
class AutomatedTester {
  async setupTestingFramework() {
    const guide = await getLlmDebuggingGuide();
    
    return {
      executionConfig: this.createExecutionConfig(guide),
      outputParser: this.createOutputParser(guide),
      errorDetector: this.createErrorDetector(guide),
      reportGenerator: this.createReportGenerator(guide)
    };
  }
  
  createExecutionConfig(guide) {
    return {
      timeout: guide.llmDebuggingGuide.automatedExecution.defaultTimeout,
      command: guide.llmDebuggingGuide.automatedExecution.timeoutCommand,
      monitoring: guide.llmDebuggingGuide.automatedExecution.monitoringPatterns,
      console: guide.llmDebuggingGuide.consoleManagement.directive
    };
  }
  
  createOutputParser(guide) {
    const sections = guide.llmDebuggingGuide.structuredOutput.sections;
    const parsing = guide.llmDebuggingGuide.structuredOutput.parsing;
    
    return {
      sections: sections,
      delimiter: parsing.sectionDelimiter,
      format: parsing.keyValueFormat,
      extractSection: (output, sectionName) => {
        const start = output.indexOf(`=== ${sectionName} ===`);
        if (start === -1) return null;
        
        const nextSection = output.indexOf('===', start + 1);
        const end = nextSection === -1 ? output.length : nextSection;
        
        return output.slice(start, end);
      }
    };
  }
}
```

### Real-time Monitoring System

```javascript
class RealTimeMonitor {
  async setupMonitoring() {
    const guide = await getLlmDebuggingGuide();
    
    return {
      patterns: guide.llmDebuggingGuide.automatedExecution.monitoringPatterns,
      intervals: this.createMonitoringIntervals(guide),
      handlers: this.createEventHandlers(guide),
      alerting: this.createAlertingSystem(guide)
    };
  }
  
  createMonitoringIntervals(guide) {
    return {
      statusCheck: 5000,  // Check status every 5 seconds
      progressUpdate: 10000,  // Progress update every 10 seconds
      timeoutWarning: guide.llmDebuggingGuide.automatedExecution.defaultTimeout * 0.8 * 1000,
      maxExecution: guide.llmDebuggingGuide.automatedExecution.defaultTimeout * 1000
    };
  }
  
  createEventHandlers(guide) {
    return {
      onStart: (data) => console.log('Execution started:', data),
      onProgress: (data) => console.log('Progress update:', data),
      onWarning: (data) => console.warn('Warning:', data),
      onError: (data) => console.error('Error detected:', data),
      onTimeout: (data) => console.error('Execution timeout:', data),
      onComplete: (data) => console.log('Execution completed:', data)
    };
  }
}
```

## Error Handling

The tool handles various LLM-specific scenarios:

### Automated Environment Issues

```javascript
const handleAutomatedEnvironment = async () => {
  const guide = await getLlmDebuggingGuide();
  
  return {
    headlessSetup: guide.executionPatterns.headlessExecution,
    batchProcessing: guide.executionPatterns.batchProcessing,
    monitoring: guide.executionPatterns.realTimeMonitoring,
    fallbacks: guide.commonPitfalls.map(pitfall => ({
      issue: pitfall.issue,
      solution: pitfall.solution,
      prevention: pitfall.prevention
    }))
  };
};
```

### AI System Integration

```javascript
const integrateWithAISystem = async (aiSystemType) => {
  const guide = await getLlmDebuggingGuide();
  
  const integrationMap = {
    'openai': guide.aiWorkflows,
    'claude': guide.aiWorkflows,
    'local_llm': guide.aiWorkflows,
    'custom_ai': guide.aiWorkflows
  };
  
  return {
    workflows: integrationMap[aiSystemType] || guide.aiWorkflows,
    bestPractices: guide.bestPractices,
    pitfalls: guide.commonPitfalls
  };
};
```

## Best Practices

### 1. Always Use Timeouts

Implement execution timeouts for all automated runs:

```javascript
// Good: With timeout
const executeWithTimeout = async (program, timeout = 30) => {
  const guide = await getLlmDebuggingGuide();
  const command = guide.llmDebuggingGuide.automatedExecution.timeoutCommand
    .replace('30s', `${timeout}s`)
    .replace('./program', program);
  
  return await executeCommand(command);
};
```

### 2. Structure Output for AI Parsing

Use consistent structured output:

```javascript
// Good: Structured output
const structuredCode = `
$CONSOLE:ONLY
ECHO_SECTION("EXECUTION_SUMMARY")
ECHO_INFO("Program started")
' ... program logic ...
ECHO_SECTION("EXECUTION_END")
ECHO_INFO("Program completed")
`;
```

### 3. Monitor Execution Status

Provide regular status updates:

```javascript
// Good: Status monitoring
const monitorExecution = async (program) => {
  const guide = await getLlmDebuggingGuide();
  const patterns = guide.llmDebuggingGuide.automatedExecution.monitoringPatterns;
  
  // Watch for specific patterns in output
  patterns.forEach(pattern => {
    console.log(`Monitoring for: ${pattern}`);
  });
};
```

## Cross-References

- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Code enhancement for debugging
- **[get_qb64pe_debugging_best_practices](./get_qb64pe_debugging_best_practices.md)** - General debugging practices
- **[inject_native_qb64pe_logging](./inject_native_qb64pe_logging.md)** - Native logging injection
- **[parse_qb64pe_structured_output](./parse_qb64pe_structured_output.md)** - Output parsing
- **[get_execution_monitoring_guidance](./get_execution_monitoring_guidance.md)** - Monitoring guidance

## See Also

- [LLM Usage Guide](../docs/LLM_USAGE_GUIDE.md)
- [QB64PE Execution Monitoring](../docs/QB64PE_EXECUTION_MONITORING.md)
- [Automated Debugging Workflows](../docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
