# get_debugging_help

**Category**: Help & Guidance  
**Description**: Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, and other debugging techniques  
**Type**: Help & Guidance Tool  

## Overview

The `get_debugging_help` tool provides comprehensive debugging assistance for QB64PE programs, offering guidance on using PRINT statements, console directives, debugging techniques, and troubleshooting common issues. This tool is designed to help developers at all skill levels resolve debugging challenges and implement effective debugging strategies.

The tool provides targeted advice based on specific debugging issues, platform considerations, and program types. It covers both traditional debugging approaches and modern enhanced debugging techniques using native logging, ECHO functions, and structured output.

## Purpose

This tool serves multiple debugging assistance functions:

- **Issue Resolution**: Provide specific solutions for debugging problems
- **Technique Guidance**: Explain debugging methods and best practices
- **Platform Support**: Offer platform-specific debugging advice
- **Code Examples**: Provide practical debugging code examples
- **Troubleshooting**: Help resolve common debugging obstacles

## Parameters

### Required Parameters

**issue** (string)  
Description of the debugging issue or challenge. Can include:
- Specific error messages or problems
- Debugging technique questions
- Console output issues
- Program behavior descriptions
- Platform-specific debugging challenges

### Optional Parameters

**platform** (string, enum: ["windows", "macos", "linux", "all"], default: "all")  
Target platform for debugging guidance. When specified:
- Provides platform-specific solutions
- Includes relevant console commands
- Addresses platform-specific limitations
- Offers alternative approaches per platform

## Response Structure

The tool returns comprehensive debugging guidance:

```json
{
  "issue": "Program output not showing in console",
  "platform": "windows",
  "category": "console_output",
  "severity": "medium",
  "solutions": [
    {
      "method": "console_directive",
      "description": "Add $CONSOLE directive to enable console output",
      "code": "$CONSOLE\nPRINT \"Debug output\"",
      "effectiveness": "high",
      "platformSupport": ["windows", "linux", "macos"]
    },
    {
      "method": "echo_functions",
      "description": "Use ECHO functions for graphics mode programs",
      "code": "CALL ECHO(\"Debug message\")",
      "effectiveness": "high",
      "platformSupport": ["windows", "linux", "macos"],
      "note": "Required for graphics modes (SCREEN 1,2,7,8,9,10,11,12,13)"
    }
  ],
  "examples": [
    {
      "title": "Basic Console Debugging",
      "description": "Simple console output for debugging",
      "code": "$CONSOLE\nDIM x AS INTEGER\nx = 10\nPRINT \"Value of x:\"; x\nSLEEP\nEND",
      "explanation": "Uses $CONSOLE directive to enable console output in any graphics mode"
    },
    {
      "title": "Enhanced Debug Logging",
      "description": "Using native logging functions",
      "code": "_LOGINFO \"Program started\"\n_LOGDEBUG \"Variable x = \" + STR$(x)\n_LOGERROR \"Error condition detected\"",
      "explanation": "Native logging functions provide structured debug output"
    }
  ],
  "troubleshooting": [
    {
      "symptom": "No console output visible",
      "causes": ["Missing $CONSOLE directive", "Graphics mode blocking console", "Output redirected incorrectly"],
      "solutions": ["Add $CONSOLE or $CONSOLE:ONLY", "Use ECHO functions", "Check output redirection"]
    },
    {
      "symptom": "Console window closes immediately",
      "causes": ["Missing SLEEP or INPUT", "Program exits too quickly", "No pause mechanism"],
      "solutions": ["Add SLEEP before END", "Use INPUT to wait for keypress", "Add debug pause points"]
    }
  ],
  "bestPractices": [
    "Always use $CONSOLE or $CONSOLE:ONLY for debugging",
    "Add debug output at program start and end",
    "Use descriptive debug messages with variable names",
    "Include timestamp information in debug output",
    "Use ECHO functions in graphics modes",
    "Implement structured debug sections"
  ],
  "relatedTools": [
    "inject_native_qb64pe_logging",
    "generate_advanced_debugging_template",
    "enhance_qb64pe_code_for_debugging"
  ],
  "additionalResources": [
    {
      "title": "QB64PE Console Directives",
      "description": "Complete guide to $CONSOLE usage",
      "reference": "https://qb64phoenix.com/qb64wiki/index.php/Console"
    },
    {
      "title": "Debugging Best Practices",
      "description": "Professional debugging techniques",
      "reference": "LLM_DEBUGGING_GUIDE"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Console Output Issues

Get help with console output problems:

```javascript
const consoleHelp = await getDebuggingHelp({
  issue: "My PRINT statements don't show anything when I run the program",
  platform: "windows"
});

console.log("Issue category:", consoleHelp.category);
console.log("Solutions available:", consoleHelp.solutions.length);

consoleHelp.solutions.forEach((solution, index) => {
  console.log(`\nSolution ${index + 1}: ${solution.method}`);
  console.log("Description:", solution.description);
  console.log("Code example:");
  console.log(solution.code);
  console.log("Effectiveness:", solution.effectiveness);
});

// Display troubleshooting steps
console.log("\nTroubleshooting steps:");
consoleHelp.troubleshooting.forEach(item => {
  console.log(`Symptom: ${item.symptom}`);
  console.log(`Solutions: ${item.solutions.join(', ')}`);
});
```

### Graphics Mode Debugging

Get help with graphics mode debugging challenges:

```javascript
const graphicsHelp = await getDebuggingHelp({
  issue: "Debug output not working in SCREEN 13 graphics mode",
  platform: "all"
});

console.log("Graphics Mode Debugging Help:");
console.log("Issue:", graphicsHelp.issue);

// Find graphics-specific solutions
const graphicsSolutions = graphicsHelp.solutions.filter(s => 
  s.description.toLowerCase().includes('graphics') || 
  s.method.includes('echo')
);

graphicsSolutions.forEach(solution => {
  console.log(`\n${solution.method}:`);
  console.log(solution.description);
  console.log("Code:", solution.code);
  
  if (solution.note) {
    console.log("Note:", solution.note);
  }
});
```

### Performance Debugging

Get help with performance debugging issues:

```javascript
const performanceHelp = await getDebuggingHelp({
  issue: "Program runs slowly and I need to find the bottleneck",
  platform: "linux"
});

console.log("Performance Debugging Guidance:");

// Show relevant solutions for performance debugging
performanceHelp.solutions.forEach(solution => {
  if (solution.description.toLowerCase().includes('performance') || 
      solution.description.toLowerCase().includes('timing')) {
    console.log(`\nMethod: ${solution.method}`);
    console.log("How it helps:", solution.description);
    console.log("Implementation:", solution.code);
  }
});

// Show best practices for performance debugging
console.log("\nBest Practices for Performance Debugging:");
performanceHelp.bestPractices
  .filter(practice => practice.toLowerCase().includes('performance') || 
                     practice.toLowerCase().includes('timing'))
  .forEach(practice => console.log(`- ${practice}`));
```

### Error Handling Debugging

Get help with error handling and exception debugging:

```javascript
const errorHelp = await getDebuggingHelp({
  issue: "Program crashes without error message, need better error handling",
  platform: "windows"
});

console.log("Error Handling Debugging:");

// Show error-related solutions
const errorSolutions = errorHelp.solutions.filter(s => 
  s.description.toLowerCase().includes('error') || 
  s.method.includes('error') ||
  s.method.includes('logging')
);

errorSolutions.forEach(solution => {
  console.log(`\nError Handling Method: ${solution.method}`);
  console.log("Description:", solution.description);
  console.log("Implementation:");
  console.log(solution.code);
  
  if (solution.platformSupport) {
    console.log("Supported platforms:", solution.platformSupport.join(', '));
  }
});

// Show error-specific troubleshooting
const errorTroubleshooting = errorHelp.troubleshooting.filter(t =>
  t.symptom.toLowerCase().includes('crash') ||
  t.symptom.toLowerCase().includes('error')
);

console.log("\nError Troubleshooting:");
errorTroubleshooting.forEach(item => {
  console.log(`Problem: ${item.symptom}`);
  console.log(`Likely causes: ${item.causes.join(', ')}`);
  console.log(`Solutions: ${item.solutions.join(', ')}`);
});
```

### Cross-Platform Debugging

Get help with cross-platform debugging challenges:

```javascript
const crossPlatformHelp = await getDebuggingHelp({
  issue: "Debug code works on Windows but not on Linux",
  platform: "all"
});

console.log("Cross-Platform Debugging Help:");

// Show platform-specific guidance
crossPlatformHelp.solutions.forEach(solution => {
  console.log(`\nSolution: ${solution.method}`);
  console.log("Description:", solution.description);
  console.log("Platform support:", solution.platformSupport.join(', '));
  
  if (solution.platformSupport.length < 3) {
    console.log("⚠️ Platform-specific solution");
  }
  
  console.log("Code example:");
  console.log(solution.code);
});

// Show cross-platform best practices
console.log("\nCross-Platform Best Practices:");
crossPlatformHelp.bestPractices
  .filter(practice => practice.toLowerCase().includes('platform') ||
                     practice.toLowerCase().includes('console'))
  .forEach(practice => console.log(`- ${practice}`));
```

## Integration Workflows

### Debugging Assistant Integration

```javascript
class QB64PEDebuggingAssistant {
  async diagnoseIssue(userIssue, context = {}) {
    const help = await getDebuggingHelp({
      issue: userIssue,
      platform: context.platform || 'all'
    });
    
    return {
      diagnosis: this.categorizeDiagnosis(help),
      quickFixes: this.extractQuickFixes(help),
      detailedSolutions: this.organizeSolutions(help),
      learningResources: help.additionalResources
    };
  }
  
  categorizeDiagnosis(help) {
    return {
      category: help.category,
      severity: help.severity,
      complexity: this.assessComplexity(help.solutions),
      timeToResolve: this.estimateResolutionTime(help.solutions)
    };
  }
  
  extractQuickFixes(help) {
    return help.solutions
      .filter(s => s.effectiveness === 'high')
      .slice(0, 3)
      .map(solution => ({
        title: solution.method,
        description: solution.description,
        code: solution.code,
        applicableImmediately: true
      }));
  }
  
  organizeSolutions(help) {
    return {
      immediate: help.solutions.filter(s => s.effectiveness === 'high'),
      intermediate: help.solutions.filter(s => s.effectiveness === 'medium'),
      advanced: help.solutions.filter(s => s.effectiveness === 'low'),
      troubleshooting: help.troubleshooting
    };
  }
  
  assessComplexity(solutions) {
    const complexityIndicators = solutions.map(s => {
      const codeLines = s.code.split('\n').length;
      const hasDirectives = s.code.includes('$');
      const hasAdvancedFeatures = s.code.includes('_LOG') || s.code.includes('ECHO');
      
      if (codeLines > 10 || hasAdvancedFeatures) return 'high';
      if (codeLines > 3 || hasDirectives) return 'medium';
      return 'low';
    });
    
    if (complexityIndicators.includes('high')) return 'high';
    if (complexityIndicators.includes('medium')) return 'medium';
    return 'low';
  }
}
```

### IDE Integration Helper

```javascript
class IDEDebuggingHelper {
  async provideDebuggingSuggestions(errorMessage, codeContext) {
    const help = await getDebuggingHelp({
      issue: `Error: ${errorMessage} in context: ${codeContext}`,
      platform: this.detectPlatform()
    });
    
    return {
      inlineHelp: this.generateInlineHelp(help),
      codeActions: this.generateCodeActions(help),
      quickInfo: this.generateQuickInfo(help)
    };
  }
  
  generateInlineHelp(help) {
    return help.solutions.map(solution => ({
      message: solution.description,
      severity: this.mapSeverity(solution.effectiveness),
      quickFix: solution.code,
      range: this.findApplicableRange(solution)
    }));
  }
  
  generateCodeActions(help) {
    return help.solutions.map(solution => ({
      title: `Apply ${solution.method}`,
      kind: 'quickfix',
      edit: {
        changes: [{
          newText: solution.code,
          range: this.getInsertionPoint()
        }]
      }
    }));
  }
  
  generateQuickInfo(help) {
    return {
      category: help.category,
      summary: help.solutions[0]?.description || 'No solution available',
      bestPractices: help.bestPractices.slice(0, 3),
      relatedCommands: help.relatedTools
    };
  }
}
```

### Educational System Integration

```javascript
class DebuggingEducationSystem {
  async createLearningPath(studentLevel, specificIssue) {
    const help = await getDebuggingHelp({
      issue: specificIssue,
      platform: 'all'
    });
    
    return {
      currentIssue: this.analyzeCurrentIssue(help),
      learningModules: this.createLearningModules(help, studentLevel),
      practiceExercises: this.generatePracticeExercises(help),
      assessmentCriteria: this.defineAssessmentCriteria(help)
    };
  }
  
  analyzeCurrentIssue(help) {
    return {
      type: help.category,
      difficulty: this.mapDifficulty(help.severity),
      concepts: this.extractConcepts(help),
      prerequisites: this.identifyPrerequisites(help)
    };
  }
  
  createLearningModules(help, level) {
    const modules = [];
    
    // Basic module: Understanding the issue
    modules.push({
      title: "Understanding the Problem",
      content: help.troubleshooting,
      exercises: ["Identify symptoms", "Understand causes"],
      duration: "15 minutes"
    });
    
    // Intermediate module: Applying solutions
    modules.push({
      title: "Implementing Solutions",
      content: help.solutions.filter(s => s.effectiveness === 'high'),
      exercises: ["Apply quickfixes", "Test solutions"],
      duration: "30 minutes"
    });
    
    // Advanced module: Best practices
    if (level === 'advanced') {
      modules.push({
        title: "Professional Debugging Practices",
        content: help.bestPractices,
        exercises: ["Implement logging", "Create debug frameworks"],
        duration: "45 minutes"
      });
    }
    
    return modules;
  }
  
  generatePracticeExercises(help) {
    return help.examples.map((example, index) => ({
      id: `exercise_${index + 1}`,
      title: example.title,
      description: example.description,
      starterCode: this.createProblematicCode(example),
      expectedSolution: example.code,
      hints: this.generateHints(example),
      difficulty: this.assessExerciseDifficulty(example)
    }));
  }
}
```

## Error Handling

The tool provides comprehensive error handling for various scenarios:

### Invalid Issue Description

```javascript
const validateIssue = (issue) => {
  if (!issue || typeof issue !== 'string') {
    throw new Error("Issue description must be a non-empty string");
  }
  
  if (issue.trim().length < 5) {
    throw new Error("Issue description too short - please provide more details");
  }
  
  if (issue.length > 1000) {
    console.warn("Issue description very long - may be truncated");
    return issue.substring(0, 1000) + "...";
  }
  
  return issue.trim();
};
```

### Platform-Specific Limitations

```javascript
const handlePlatformLimitations = (help, requestedPlatform) => {
  if (requestedPlatform !== 'all') {
    // Filter solutions for platform compatibility
    help.solutions = help.solutions.filter(solution => 
      !solution.platformSupport || 
      solution.platformSupport.includes(requestedPlatform)
    );
    
    if (help.solutions.length === 0) {
      help.solutions.push({
        method: "generic_approach",
        description: `Platform-specific solutions not available for ${requestedPlatform}`,
        code: "REM Use generic debugging approaches",
        effectiveness: "medium",
        platformSupport: [requestedPlatform]
      });
    }
  }
  
  return help;
};
```

### Unknown Issues

```javascript
const handleUnknownIssues = (issue) => {
  const commonKeywords = [
    'console', 'output', 'print', 'error', 'crash', 'slow', 'graphics', 
    'input', 'file', 'variable', 'loop', 'function', 'subroutine'
  ];
  
  const foundKeywords = commonKeywords.filter(keyword => 
    issue.toLowerCase().includes(keyword)
  );
  
  if (foundKeywords.length === 0) {
    return {
      category: "general",
      severity: "unknown",
      solutions: [
        {
          method: "systematic_debugging",
          description: "Apply systematic debugging approach",
          code: "$CONSOLE\nPRINT \"Debug: Program start\"\nREM Add debug points throughout your code\nPRINT \"Debug: Program end\"\nSLEEP",
          effectiveness: "medium"
        }
      ],
      suggestions: [
        "Describe specific symptoms you're experiencing",
        "Include any error messages",
        "Mention what you expected vs what happened",
        "Specify which part of the program has issues"
      ]
    };
  }
  
  return null; // Continue with normal processing
};
```

## Best Practices

### 1. Issue Description Quality

Provide clear and detailed issue descriptions:

```javascript
// Good: Specific and detailed
const goodIssue = "PRINT statements in my graphics program (SCREEN 13) don't appear in console, but the program runs without errors";

// Poor: Too vague
const poorIssue = "debug not working";

// Good: Include context and symptoms
const betterIssue = "Program crashes when accessing array element, no error message shown, need to add error checking";
```

### 2. Platform Awareness

Specify platform when platform-specific guidance is needed:

```javascript
// Good: Platform-specific request
const platformSpecific = await getDebuggingHelp({
  issue: "Console window closes immediately on Windows",
  platform: "windows"
});

// Good: Cross-platform compatibility
const crossPlatform = await getDebuggingHelp({
  issue: "Need debugging approach that works on all platforms",
  platform: "all"
});
```

### 3. Solution Implementation

Implement solutions systematically:

```javascript
const implementSolutions = async (help) => {
  // Start with highest effectiveness solutions
  const prioritizedSolutions = help.solutions
    .sort((a, b) => {
      const effectivenessOrder = { high: 3, medium: 2, low: 1 };
      return effectivenessOrder[b.effectiveness] - effectivenessOrder[a.effectiveness];
    });
  
  for (const solution of prioritizedSolutions) {
    console.log(`Trying: ${solution.method}`);
    console.log(`Code to implement:\n${solution.code}`);
    
    // Test implementation (pseudo-code)
    const result = await testSolution(solution);
    if (result.success) {
      console.log("Solution successful!");
      break;
    }
  }
};
```

### 4. Learning Integration

Use debugging help as learning opportunities:

```javascript
const learnFromDebugging = (help) => {
  // Extract learning concepts
  const concepts = help.solutions.map(s => s.method);
  const techniques = help.bestPractices;
  
  return {
    conceptsLearned: concepts,
    techniquesToPractice: techniques,
    followUpResources: help.additionalResources,
    practiceExercises: help.examples
  };
};
```

## Cross-References

- **[inject_native_qb64pe_logging](./inject_native_qb64pe_logging.md)** - Logging enhancement
- **[generate_advanced_debugging_template](./generate_advanced_debugging_template.md)** - Debug templates
- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Code enhancement
- **[get_llm_debugging_guide](./get_llm_debugging_guide.md)** - LLM debugging
- **[parse_qb64pe_structured_output](./parse_qb64pe_structured_output.md)** - Output parsing
- **[get_execution_monitoring_guidance](./get_execution_monitoring_guidance.md)** - Monitoring guidance

## See Also

- [QB64PE Debugging Best Practices](../docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
- [LLM Debugging Guide](../docs/LLM_USAGE_GUIDE.md)
- [Console Directives Reference](https://qb64phoenix.com/qb64wiki/index.php/Console)
