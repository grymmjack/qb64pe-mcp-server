# get_qb64pe_debugging_best_practices

**Category**: Debugging & Best Practices  
**Description**: Get comprehensive debugging best practices and guidelines specifically for QB64PE development  
**Type**: Best Practices Guide  

## Overview

The `get_qb64pe_debugging_best_practices` tool provides comprehensive debugging best practices, methodologies, and guidelines specifically tailored for QB64PE development. This tool is essential for developers who want to improve their debugging skills, establish effective debugging workflows, and avoid common pitfalls in QB64PE programming.

The tool covers platform-specific debugging considerations, console management in graphics modes, resource tracking, automated debugging for LLM systems, and performance optimization techniques. It's particularly valuable for complex applications involving graphics, file I/O, networking, and multi-threaded operations.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Debugging Methodology**: Learn systematic approaches to debugging QB64PE applications
- **Console Management**: Master console output in graphics and mixed-mode applications
- **Resource Tracking**: Implement effective memory and resource management debugging
- **Automated Debugging**: Set up debugging for automated systems and LLM interactions
- **Performance Optimization**: Debug performance issues and bottlenecks

## Parameters

This tool takes no parameters and returns comprehensive debugging best practices.

## Response Structure

The tool returns a structured guide with debugging best practices:

```json
{
  "bestPractices": {
    "consoleDebugging": {
      "graphicsMode": {
        "directive": "$CONSOLE:ONLY or $CONSOLE",
        "outputManagement": "Use _DEST _CONSOLE for console output in graphics mode",
        "echoCunctions": "Use ECHO functions instead of PRINT in graphics modes",
        "examples": [
          "$CONSOLE:ONLY\nSCREEN _NEWIMAGE(800, 600, 32)\nECHO_INFO(\"Graphics initialized\")"
        ]
      },
      "structuredOutput": {
        "sections": "Organize output into logical sections",
        "timestamps": "Include execution timestamps",
        "severity": "Use different levels (INFO, WARN, ERROR)",
        "parsing": "Format for automated parsing"
      }
    },
    "resourceTracking": {
      "imageHandles": "Track _LOADIMAGE and _FREEIMAGE calls",
      "fileHandles": "Monitor OPEN and CLOSE operations",
      "memoryUsage": "Track dynamic arrays and string allocations",
      "soundHandles": "Manage _SNDOPEN and _SNDCLOSE"
    },
    "errorHandling": {
      "onErrorGoto": "Use ON ERROR GOTO for error trapping",
      "validationChecks": "Validate inputs and file existence",
      "gracefulDegradation": "Handle missing resources gracefully",
      "errorReporting": "Provide detailed error information"
    },
    "automatedDebugging": {
      "timeouts": "Implement execution timeouts for automation",
      "exitConditions": "Define clear exit conditions",
      "statusReporting": "Report execution status regularly",
      "logFiles": "Create parseable log files"
    }
  },
  "commonIssues": [
    {
      "issue": "Console output not visible in graphics mode",
      "cause": "Missing $CONSOLE directive",
      "solution": "Add $CONSOLE or $CONSOLE:ONLY at program start",
      "prevention": "Always include console directive when debugging graphics"
    },
    {
      "issue": "Program hangs in infinite loop",
      "cause": "No timeout or exit condition",
      "solution": "Add timeout mechanism and loop counters",
      "prevention": "Implement safety exits in all loops"
    }
  ],
  "debuggingWorkflows": {
    "development": "Interactive debugging with verbose output",
    "testing": "Automated debugging with structured output",
    "production": "Minimal logging with error tracking"
  },
  "platformSpecific": {
    "windows": "Windows-specific debugging considerations",
    "linux": "Linux console and file path handling",
    "macos": "macOS application bundle debugging"
  },
  "tools": [
    "Native QB64PE logging functions",
    "ECHO function system",
    "Structured output parsing",
    "Screenshot automation",
    "Resource monitoring"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Get Complete Debugging Guide

Retrieve comprehensive debugging best practices:

```javascript
const bestPractices = await getQb64peDebuggingBestPractices();

console.log("=== QB64PE Debugging Best Practices ===");
console.log("\n1. Console Debugging:");
console.log("Graphics Mode:", bestPractices.bestPractices.consoleDebugging.graphicsMode.directive);
console.log("Output Management:", bestPractices.bestPractices.consoleDebugging.graphicsMode.outputManagement);

console.log("\n2. Resource Tracking:");
Object.entries(bestPractices.bestPractices.resourceTracking).forEach(([resource, practice]) => {
  console.log(`${resource}: ${practice}`);
});

console.log("\n3. Common Issues:");
bestPractices.commonIssues.forEach(issue => {
  console.log(`Issue: ${issue.issue}`);
  console.log(`Solution: ${issue.solution}`);
  console.log(`Prevention: ${issue.prevention}\n`);
});
```

### Apply Console Debugging Practices

Implement console debugging best practices:

```javascript
const practices = await getQb64peDebuggingBestPractices();
const consoleGuide = practices.bestPractices.consoleDebugging;

console.log("Console Debugging Setup:");
console.log("1. For graphics programs:");
console.log(consoleGuide.graphicsMode.examples[0]);

console.log("\n2. Structured output format:");
console.log("- Use sections:", consoleGuide.structuredOutput.sections);
console.log("- Include timestamps:", consoleGuide.structuredOutput.timestamps);
console.log("- Use severity levels:", consoleGuide.structuredOutput.severity);
```

### Resource Tracking Implementation

Get resource tracking best practices:

```javascript
const practices = await getQb64peDebuggingBestPractices();
const resourceGuide = practices.bestPractices.resourceTracking;

console.log("Resource Tracking Best Practices:");
console.log("Image Handles:", resourceGuide.imageHandles);
console.log("File Handles:", resourceGuide.fileHandles);
console.log("Memory Usage:", resourceGuide.memoryUsage);
console.log("Sound Handles:", resourceGuide.soundHandles);

// Apply to code structure
const trackingTemplate = `
' Resource tracking implementation
DIM imageHandles(100) AS LONG
DIM imageCount AS INTEGER
DIM fileHandles(10) AS INTEGER
DIM fileCount AS INTEGER

' Track image loading
FUNCTION LoadImageTracked(filename$)
    handle& = _LOADIMAGE(filename$)
    IF handle& <> -1 THEN
        imageHandles(imageCount) = handle&
        imageCount = imageCount + 1
        ECHO_INFO("Image loaded: " + filename$ + ", Handle: " + STR$(handle&))
    ELSE
        ECHO_ERROR("Failed to load image: " + filename$)
    END IF
    LoadImageTracked = handle&
END FUNCTION
`;

console.log("\nImplementation template:");
console.log(trackingTemplate);
```

### Automated Debugging Setup

Configure automated debugging practices:

```javascript
const practices = await getQb64peDebuggingBestPractices();
const automatedGuide = practices.bestPractices.automatedDebugging;

console.log("Automated Debugging Setup:");
console.log("Timeouts:", automatedGuide.timeouts);
console.log("Exit Conditions:", automatedGuide.exitConditions);
console.log("Status Reporting:", automatedGuide.statusReporting);
console.log("Log Files:", automatedGuide.logFiles);

const automatedTemplate = `
' Automated debugging template
$CONSOLE:ONLY
DIM startTime AS DOUBLE
DIM executionTimeout AS INTEGER
executionTimeout = 30 ' 30 seconds

startTime = TIMER
ECHO_INFO("=== EXECUTION_START ===")
ECHO_INFO("Timeout: " + STR$(executionTimeout) + " seconds")

' Main program loop with timeout check
DO
    ' Your program logic here
    
    ' Check timeout
    IF TIMER - startTime > executionTimeout THEN
        ECHO_WARN("Execution timeout reached")
        EXIT DO
    END IF
    
    ' Report status every 5 seconds
    IF INT(TIMER - startTime) MOD 5 = 0 THEN
        ECHO_INFO("Status: Running, Elapsed: " + STR$(INT(TIMER - startTime)) + "s")
    END IF
LOOP

ECHO_INFO("=== EXECUTION_END ===")
ECHO_INFO("Total time: " + STR$(TIMER - startTime) + " seconds")
`;

console.log("\nAutomated debugging template:");
console.log(automatedTemplate);
```

## Integration Workflows

### Debugging Methodology Implementation

```javascript
class DebuggingMethodology {
  async implementBestPractices(projectType) {
    const practices = await getQb64peDebuggingBestPractices();
    
    return {
      setup: this.createSetupGuide(practices, projectType),
      workflow: this.createWorkflow(practices, projectType),
      templates: this.createTemplates(practices, projectType),
      checklist: this.createChecklist(practices)
    };
  }
  
  createSetupGuide(practices, projectType) {
    const setup = {
      console: practices.bestPractices.consoleDebugging,
      resources: practices.bestPractices.resourceTracking,
      errorHandling: practices.bestPractices.errorHandling
    };
    
    if (projectType === 'graphics') {
      setup.special = {
        directive: '$CONSOLE',
        echoFunctions: true,
        screenshots: true
      };
    } else if (projectType === 'automated') {
      setup.special = {
        directive: '$CONSOLE:ONLY',
        timeouts: true,
        structuredOutput: true
      };
    }
    
    return setup;
  }
  
  createWorkflow(practices, projectType) {
    const baseWorkflow = practices.debuggingWorkflows;
    
    return {
      phases: [
        "1. Setup debugging environment",
        "2. Implement logging and monitoring",
        "3. Add error handling and timeouts",
        "4. Test automated execution",
        "5. Validate output parsing"
      ],
      tools: practices.tools,
      platformConsiderations: practices.platformSpecific
    };
  }
}
```

### Code Quality Assurance

```javascript
class DebuggingQualityAssurance {
  async validateDebuggingImplementation(code) {
    const practices = await getQb64peDebuggingBestPractices();
    
    const validation = {
      consoleSetup: this.checkConsoleSetup(code, practices),
      resourceTracking: this.checkResourceTracking(code, practices),
      errorHandling: this.checkErrorHandling(code, practices),
      automation: this.checkAutomation(code, practices)
    };
    
    return {
      score: this.calculateDebuggingScore(validation),
      issues: this.identifyIssues(validation),
      recommendations: this.generateRecommendations(validation, practices),
      compliance: this.checkCompliance(validation, practices)
    };
  }
  
  checkConsoleSetup(code, practices) {
    const hasConsoleDirective = /\$CONSOLE/.test(code);
    const hasGraphics = /SCREEN\s+_NEWIMAGE|SCREEN\s+\d+/.test(code);
    const hasEchoFunctions = /ECHO_/.test(code);
    
    return {
      directive: hasConsoleDirective,
      graphicsCompatible: !hasGraphics || (hasGraphics && hasConsoleDirective),
      echoUsage: hasGraphics ? hasEchoFunctions : true,
      score: this.calculateConsoleScore(hasConsoleDirective, hasGraphics, hasEchoFunctions)
    };
  }
  
  checkResourceTracking(code, practices) {
    const hasImageTracking = /_LOADIMAGE/.test(code) && /_FREEIMAGE/.test(code);
    const hasFileTracking = /OPEN.*FOR/.test(code) && /CLOSE/.test(code);
    const hasErrorChecking = /IF.*<>\s*-1/.test(code);
    
    return {
      images: hasImageTracking,
      files: hasFileTracking,
      errorChecks: hasErrorChecking,
      score: this.calculateResourceScore(hasImageTracking, hasFileTracking, hasErrorChecking)
    };
  }
}
```

### Educational Debugging Guide

```javascript
class DebuggingEducator {
  async createLearningPath() {
    const practices = await getQb64peDebuggingBestPractices();
    
    return {
      beginner: this.createBeginnerGuide(practices),
      intermediate: this.createIntermediateGuide(practices),
      advanced: this.createAdvancedGuide(practices),
      exercises: this.createExercises(practices)
    };
  }
  
  createBeginnerGuide(practices) {
    return {
      title: "QB64PE Debugging Fundamentals",
      topics: [
        "Setting up console output",
        "Basic PRINT debugging",
        "Understanding error messages",
        "Simple error handling"
      ],
      practicalExamples: this.extractBeginnerExamples(practices),
      commonMistakes: practices.commonIssues.slice(0, 3)
    };
  }
  
  createIntermediateGuide(practices) {
    return {
      title: "Advanced Debugging Techniques",
      topics: [
        "Graphics mode debugging",
        "Resource tracking",
        "Structured output",
        "Automated debugging"
      ],
      practicalExamples: this.extractIntermediateExamples(practices),
      bestPractices: practices.bestPractices
    };
  }
  
  createAdvancedGuide(practices) {
    return {
      title: "Professional Debugging Workflows",
      topics: [
        "Cross-platform debugging",
        "Performance debugging",
        "Automated testing integration",
        "Production monitoring"
      ],
      workflows: practices.debuggingWorkflows,
      tools: practices.tools
    };
  }
}
```

## Error Handling

The tool handles various scenarios gracefully:

### Platform-Specific Considerations

```javascript
const getPlatformSpecificPractices = async (platform) => {
  const practices = await getQb64peDebuggingBestPractices();
  
  const platformGuide = practices.platformSpecific[platform] || practices.platformSpecific;
  
  return {
    platform: platform,
    specific: platformGuide,
    universal: practices.bestPractices,
    adaptations: this.adaptForPlatform(practices.bestPractices, platform)
  };
};
```

### Project-Specific Adaptations

```javascript
const adaptPracticesForProject = async (projectType, complexity) => {
  const practices = await getQb64peDebuggingBestPractices();
  
  const adaptations = {
    simple: this.simplifyPractices(practices),
    graphics: this.enhanceForGraphics(practices),
    automation: this.optimizeForAutomation(practices),
    complex: this.addAdvancedPractices(practices)
  };
  
  return adaptations[projectType] || practices;
};
```

## Best Practices

### 1. Implementation Strategy

Apply debugging practices systematically:

```javascript
// Start with basic practices
const basicSetup = {
  console: true,
  errorHandling: true,
  basicLogging: true
};

// Add advanced features as needed
const advancedSetup = {
  ...basicSetup,
  resourceTracking: true,
  automation: true,
  screenshots: true
};
```

### 2. Workflow Integration

Integrate debugging into development workflow:

```javascript
class DebuggingWorkflow {
  async setupDevelopmentDebugging() {
    const practices = await getQb64peDebuggingBestPractices();
    return practices.debuggingWorkflows.development;
  }
  
  async setupTestingDebugging() {
    const practices = await getQb64peDebuggingBestPractices();
    return practices.debuggingWorkflows.testing;
  }
  
  async setupProductionDebugging() {
    const practices = await getQb64peDebuggingBestPractices();
    return practices.debuggingWorkflows.production;
  }
}
```

### 3. Continuous Improvement

Regularly update debugging practices:

```javascript
const trackDebuggingEffectiveness = async (debuggingData) => {
  const practices = await getQb64peDebuggingBestPractices();
  
  return {
    currentPractices: practices,
    effectiveness: analyzeEffectiveness(debuggingData),
    improvements: suggestImprovements(practices, debuggingData),
    evolution: trackPracticeEvolution(practices)
  };
};
```

## Cross-References

- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Code enhancement for debugging
- **[get_llm_debugging_guide](./get_llm_debugging_guide.md)** - LLM-specific debugging
- **[inject_native_qb64pe_logging](./inject_native_qb64pe_logging.md)** - Native logging injection
- **[generate_advanced_debugging_template](./generate_advanced_debugging_template.md)** - Debug templates
- **[get_debugging_help](./get_debugging_help.md)** - Debugging assistance

## See Also

- [QB64PE Debugging Enhancement System](../docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
- [Execution Monitoring Guide](../docs/QB64PE_EXECUTION_MONITORING.md)
- [LLM Debugging Guide](../docs/LLM_USAGE_GUIDE.md)
