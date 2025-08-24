# generate_advanced_debugging_template

**Category**: Templates & Code Generation  
**Description**: Generate a comprehensive debugging template with native logging, ECHO functions, structured output, and automated execution monitoring  
**Type**: Template Generation Tool  

## Overview

The `generate_advanced_debugging_template` tool creates comprehensive debugging templates that serve as starting points for QB64PE applications requiring sophisticated debugging capabilities. These templates include native logging functions, ECHO output systems, structured output sections, and automated execution monitoring.

**CRITICAL NOTE**: The template uses ECHO functions which are MANDATORY for graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.) instead of PRINT/_PRINTSTRING. This ensures console output works correctly in all QB64PE screen modes.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Template Generation**: Create complete debugging framework templates
- **Best Practice Implementation**: Include proven debugging patterns and structures
- **Graphics Compatibility**: Provide ECHO functions for all screen modes
- **Automation Ready**: Include timeout and monitoring for automated execution
- **Educational Resource**: Serve as learning examples for debugging techniques

## Parameters

### Required Parameters

**programName** (string)  
Name of the program being debugged. Used for template customization and output identification.

**analysisSteps** (array of strings)  
List of analysis steps to include in the template. Each step becomes a structured section with appropriate logging and monitoring.

### Optional Parameters

**config** (object)  
Template configuration options to customize the generated debugging framework:

```javascript
{
  consoleDirective: "$CONSOLE:ONLY",      // Console directive (default: $CONSOLE:ONLY)
  logLevel: "INFO",                       // Logging level (default: INFO)
  enableNativeLogging: true,              // Enable native logging functions (default: true)
  enableEchoOutput: true,                 // Enable ECHO functions for graphics modes (default: true)
  enableStructuredOutput: true,           // Enable structured output sections (default: true)
  autoExitTimeout: 10                     // Auto-exit timeout (default: 10)
}
```

## Response Structure

The tool returns a complete debugging template with comprehensive features:

```json
{
  "template": "' Advanced QB64PE Debugging Template\n$CONSOLE:ONLY\n...",
  "templateFeatures": {
    "nativeLogging": true,
    "echoFunctions": true,
    "structuredOutput": true,
    "automatedExecution": true,
    "resourceTracking": true,
    "errorHandling": true
  },
  "includedComponents": [
    {
      "name": "Console Directive",
      "description": "$CONSOLE:ONLY for automated execution compatibility",
      "location": "line 1"
    },
    {
      "name": "Native Logging Functions",
      "description": "_LOGINFO, _LOGWARN, _LOGERROR with timestamps",
      "location": "lines 5-25"
    },
    {
      "name": "ECHO Functions",
      "description": "Graphics-compatible console output functions",
      "location": "lines 27-45"
    },
    {
      "name": "Structured Output Sections",
      "description": "Organized debug sections for analysis steps",
      "location": "lines 47-65"
    }
  ],
  "analysisSteps": [
    "Program Initialization",
    "Data Processing",
    "Result Analysis",
    "Cleanup Operations"
  ],
  "usageInstructions": {
    "compilation": "qb64pe -x debugging_template.bas",
    "execution": "timeout 30s ./debugging_template > debug_output.txt",
    "parsing": "parse_qb64pe_structured_output debug_output.txt",
    "monitoring": "Monitor for EXECUTION_START, EXECUTION_END, EXECUTION_TIMEOUT patterns"
  },
  "templateType": "advanced_debugging",
  "lineCount": 156,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Debugging Template

Generate a comprehensive debugging template:

```javascript
const template = await generateAdvancedDebuggingTemplate({
  programName: "Graphics Demo",
  analysisSteps: [
    "Initialize graphics system",
    "Load image resources", 
    "Render graphics elements",
    "Process user input",
    "Cleanup and exit"
  ]
});

console.log("Template features:", template.templateFeatures);
console.log("Components included:", template.includedComponents.length);
console.log("\nGenerated template:");
console.log(template.template);
```

### Custom Configuration Template

Generate template with specific configuration:

```javascript
const customTemplate = await generateAdvancedDebuggingTemplate({
  programName: "Data Processor",
  analysisSteps: [
    "Load configuration",
    "Initialize data structures",
    "Process input files",
    "Generate reports",
    "Archive results"
  ],
  config: {
    consoleDirective: "$CONSOLE",
    logLevel: "TRACE",
    autoExitTimeout: 60,
    enableStructuredOutput: true
  }
});

console.log("Custom configuration applied");
console.log("Log level:", customTemplate.config?.logLevel);
console.log("Timeout:", customTemplate.config?.autoExitTimeout);
```

### Automated Testing Template

Generate template optimized for automated testing:

```javascript
const testTemplate = await generateAdvancedDebuggingTemplate({
  programName: "Automated Test Suite",
  analysisSteps: [
    "Test environment setup",
    "Execute test cases",
    "Validate results",
    "Generate test report",
    "Cleanup test data"
  ],
  config: {
    consoleDirective: "$CONSOLE:ONLY",
    logLevel: "INFO", 
    autoExitTimeout: 30,
    enableNativeLogging: true,
    enableEchoOutput: true
  }
});

console.log("Automated testing template generated");
console.log("Usage instructions:", testTemplate.usageInstructions);
```

### Graphics Application Template

Generate template for graphics applications:

```javascript
const graphicsTemplate = await generateAdvancedDebuggingTemplate({
  programName: "Graphics Application",
  analysisSteps: [
    "Initialize graphics mode",
    "Load graphics resources",
    "Main rendering loop", 
    "Handle user interaction",
    "Shutdown graphics system"
  ],
  config: {
    enableEchoOutput: true,  // MANDATORY for graphics modes
    enableStructuredOutput: true,
    consoleDirective: "$CONSOLE:ONLY"
  }
});

console.log("Graphics template with ECHO functions");
console.log("ECHO functions included:", graphicsTemplate.templateFeatures.echoFunctions);
```

## Integration Workflows

### Template Customization Engine

```javascript
class TemplateCustomizer {
  async createCustomTemplate(requirements) {
    const baseTemplate = await generateAdvancedDebuggingTemplate({
      programName: requirements.name,
      analysisSteps: requirements.steps,
      config: requirements.config
    });
    
    return {
      template: this.customizeTemplate(baseTemplate, requirements),
      documentation: this.generateDocumentation(baseTemplate),
      examples: this.generateExamples(baseTemplate),
      integration: this.generateIntegrationGuide(baseTemplate)
    };
  }
  
  customizeTemplate(template, requirements) {
    let customized = template.template;
    
    // Add custom functions if specified
    if (requirements.customFunctions) {
      customized = this.addCustomFunctions(customized, requirements.customFunctions);
    }
    
    // Add specific error handling
    if (requirements.errorHandling) {
      customized = this.addErrorHandling(customized, requirements.errorHandling);
    }
    
    // Add resource tracking
    if (requirements.resourceTracking) {
      customized = this.addResourceTracking(customized, requirements.resourceTracking);
    }
    
    return customized;
  }
  
  generateDocumentation(template) {
    return {
      overview: "Advanced debugging template with comprehensive logging",
      features: template.templateFeatures,
      components: template.includedComponents,
      usage: template.usageInstructions,
      examples: this.extractExamples(template.template)
    };
  }
}
```

### Educational Template System

```javascript
class EducationalTemplateSystem {
  async createLearningTemplates(difficulty) {
    const templates = {
      beginner: await this.createBeginnerTemplate(),
      intermediate: await this.createIntermediateTemplate(),
      advanced: await this.createAdvancedTemplate()
    };
    
    return templates[difficulty] || templates.beginner;
  }
  
  async createBeginnerTemplate() {
    return await generateAdvancedDebuggingTemplate({
      programName: "Beginner Debugging Example",
      analysisSteps: [
        "Program startup",
        "Simple calculation",
        "Display result",
        "Program end"
      ],
      config: {
        logLevel: "INFO",
        enableNativeLogging: true,
        enableEchoOutput: true
      }
    });
  }
  
  async createIntermediateTemplate() {
    return await generateAdvancedDebuggingTemplate({
      programName: "Intermediate Debugging Example",
      analysisSteps: [
        "Initialize system",
        "Load configuration",
        "Process data with loops",
        "Handle file operations",
        "Error recovery",
        "Cleanup resources"
      ],
      config: {
        logLevel: "INFO",
        enableStructuredOutput: true,
        autoExitTimeout: 30
      }
    });
  }
  
  async createAdvancedTemplate() {
    return await generateAdvancedDebuggingTemplate({
      programName: "Advanced Debugging Example",
      analysisSteps: [
        "Multi-threaded initialization",
        "Graphics system setup",
        "Real-time data processing",
        "Network communication",
        "Performance monitoring",
        "Graceful shutdown"
      ],
      config: {
        logLevel: "TRACE",
        enableNativeLogging: true,
        enableEchoOutput: true,
        enableStructuredOutput: true,
        autoExitTimeout: 60
      }
    });
  }
}
```

### Project Template Generator

```javascript
class ProjectTemplateGenerator {
  async generateProjectTemplate(projectType, specifications) {
    const templateConfigs = {
      'game': {
        analysisSteps: [
          "Initialize game engine",
          "Load game assets",
          "Main game loop",
          "Handle player input",
          "Update game state",
          "Render graphics",
          "Handle collisions",
          "Save game state"
        ],
        config: {
          enableEchoOutput: true,  // Graphics mode
          autoExitTimeout: 120,
          logLevel: "INFO"
        }
      },
      'utility': {
        analysisSteps: [
          "Parse command line",
          "Validate input",
          "Process data",
          "Generate output",
          "Handle errors"
        ],
        config: {
          consoleDirective: "$CONSOLE:ONLY",
          logLevel: "INFO",
          autoExitTimeout: 30
        }
      },
      'simulation': {
        analysisSteps: [
          "Initialize simulation",
          "Load parameters",
          "Run simulation steps",
          "Collect data",
          "Analyze results",
          "Export findings"
        ],
        config: {
          logLevel: "TRACE",
          autoExitTimeout: 300,
          enableStructuredOutput: true
        }
      }
    };
    
    const config = templateConfigs[projectType] || templateConfigs.utility;
    
    return await generateAdvancedDebuggingTemplate({
      programName: specifications.name || `${projectType} Application`,
      analysisSteps: specifications.customSteps || config.analysisSteps,
      config: { ...config.config, ...specifications.config }
    });
  }
}
```

## Error Handling

The tool handles various scenarios gracefully:

### Analysis Steps Validation

```javascript
const validateAnalysisSteps = (steps) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      "Program initialization",
      "Main processing", 
      "Result output",
      "Program cleanup"
    ];
  }
  
  // Ensure steps are descriptive
  return steps.map(step => {
    if (typeof step !== 'string' || step.trim().length === 0) {
      return "Processing step";
    }
    return step.trim();
  });
};
```

### Configuration Validation

```javascript
const validateTemplateConfig = (config) => {
  const defaults = {
    consoleDirective: "$CONSOLE:ONLY",
    logLevel: "INFO",
    enableNativeLogging: true,
    enableEchoOutput: true,
    enableStructuredOutput: true,
    autoExitTimeout: 10
  };
  
  const validated = { ...defaults, ...config };
  
  // Validate log level
  const validLogLevels = ["TRACE", "INFO", "WARN", "ERROR"];
  if (!validLogLevels.includes(validated.logLevel)) {
    console.warn(`Invalid log level "${validated.logLevel}", using INFO`);
    validated.logLevel = "INFO";
  }
  
  // Validate timeout
  if (validated.autoExitTimeout < 1 || validated.autoExitTimeout > 3600) {
    console.warn(`Invalid timeout "${validated.autoExitTimeout}", using 10 seconds`);
    validated.autoExitTimeout = 10;
  }
  
  return validated;
};
```

### Template Generation Fallback

```javascript
const generateWithFallback = async (programName, analysisSteps, config) => {
  try {
    return await generateAdvancedDebuggingTemplate({
      programName,
      analysisSteps,
      config
    });
  } catch (error) {
    console.warn("Template generation failed, creating minimal template");
    
    return {
      template: createMinimalTemplate(programName),
      templateFeatures: {
        minimal: true,
        echoFunctions: true,
        basicLogging: true
      },
      error: error.message
    };
  }
};

const createMinimalTemplate = (programName) => {
  return `
' Minimal Debugging Template for ${programName}
$CONSOLE:ONLY

SUB ECHO_INFO(msg$)
    PRINT "INFO: " + msg$
END SUB

SUB ECHO_WARN(msg$)
    PRINT "WARN: " + msg$
END SUB

SUB ECHO_ERROR(msg$)
    PRINT "ERROR: " + msg$
END SUB

ECHO_INFO("=== EXECUTION_START ===")
ECHO_INFO("Program: ${programName}")

' Your code here

ECHO_INFO("=== EXECUTION_END ===")
`;
};
```

## Best Practices

### 1. Template Selection

Choose appropriate templates for different scenarios:

```javascript
// For graphics applications - ECHO functions required
const graphicsTemplate = {
  config: {
    enableEchoOutput: true,  // MANDATORY
    consoleDirective: "$CONSOLE:ONLY"
  }
};

// For console applications
const consoleTemplate = {
  config: {
    consoleDirective: "$CONSOLE:ONLY",
    enableNativeLogging: true
  }
};

// For automated testing
const testingTemplate = {
  config: {
    autoExitTimeout: 30,
    enableStructuredOutput: true,
    logLevel: "INFO"
  }
};
```

### 2. Analysis Steps Planning

Plan comprehensive analysis steps:

```javascript
// Good: Specific and actionable steps
const goodSteps = [
  "Initialize graphics system (SCREEN _NEWIMAGE)",
  "Load and validate image resources",
  "Set up main rendering loop",
  "Process user input events",
  "Update game logic and physics",
  "Render graphics and UI elements",
  "Handle cleanup and resource deallocation"
];

// Avoid: Vague or incomplete steps
const poorSteps = [
  "Start program",
  "Do stuff",
  "End program"
];
```

### 3. Configuration Optimization

Optimize configuration for specific use cases:

```javascript
// Development: Comprehensive debugging
const devConfig = {
  logLevel: "TRACE",
  enableNativeLogging: true,
  enableEchoOutput: true,
  enableStructuredOutput: true,
  autoExitTimeout: 300  // 5 minutes for development
};

// Production: Minimal overhead
const prodConfig = {
  logLevel: "ERROR",
  enableNativeLogging: false,
  enableEchoOutput: true,  // Still needed for graphics
  autoExitTimeout: 30
};

// Testing: Automated friendly
const testConfig = {
  logLevel: "INFO",
  consoleDirective: "$CONSOLE:ONLY",
  enableStructuredOutput: true,
  autoExitTimeout: 60
};
```

### 4. Template Evolution

Continuously improve templates based on usage:

```javascript
class TemplateEvolution {
  async improveTemplate(templateUsageData) {
    const improvements = this.analyzeUsagePatterns(templateUsageData);
    
    return {
      commonIssues: improvements.issues,
      suggestedEnhancements: improvements.enhancements,
      optimizations: improvements.optimizations,
      newFeatures: improvements.features
    };
  }
  
  analyzeUsagePatterns(data) {
    return {
      issues: this.identifyCommonIssues(data),
      enhancements: this.suggestEnhancements(data),
      optimizations: this.findOptimizations(data),
      features: this.proposeNewFeatures(data)
    };
  }
}
```

## Cross-References

- **[inject_native_qb64pe_logging](./inject_native_qb64pe_logging.md)** - Native logging injection
- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Code debugging enhancement
- **[get_llm_debugging_guide](./get_llm_debugging_guide.md)** - LLM debugging guidance
- **[get_qb64pe_debugging_best_practices](./get_qb64pe_debugging_best_practices.md)** - Debugging best practices
- **[parse_qb64pe_structured_output](./parse_qb64pe_structured_output.md)** - Output parsing

## See Also

- [Echo Functionality Summary](../ECHO_FUNCTIONALITY_SUMMARY.md)
- [Advanced Debugging Templates](../docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
- [LLM Integration Guide](../docs/LLM_USAGE_GUIDE.md)
