# validate_qb64pe_compatibility

**Category**: Compatibility & Validation  
**Description**: Check code for QB64PE compatibility issues and get solutions  
**Type**: Code Validation Tool  

## Overview

The `validate_qb64pe_compatibility` tool analyzes QB64PE source code to identify potential compatibility issues, deprecated features, platform-specific problems, and provides specific solutions for each issue found. This tool is essential for ensuring code reliability across different platforms and QB64PE versions.

Unlike search tools that provide general information, this tool performs active code analysis, examining syntax patterns, function usage, and programming constructs to identify specific compatibility concerns in your actual code.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Proactive Issue Detection**: Identify compatibility problems before runtime
- **Cross-Platform Validation**: Ensure code works across Windows, Linux, and macOS
- **Legacy Code Assessment**: Evaluate older BASIC code for QB64PE compatibility
- **Best Practice Enforcement**: Identify deprecated patterns and suggest improvements
- **Error Prevention**: Catch common compatibility pitfalls during development

## Parameters

### Required Parameters

**code** (string)  
QB64PE source code to check for compatibility issues. Can be:
- Complete program source code
- Code snippets or functions
- Individual statements or blocks
- Multi-file project code (concatenated)

### Optional Parameters

**platform** (string)  
Target platform for compatibility checking. Available platforms:
- `"windows"` - Windows-specific compatibility issues
- `"macos"` - macOS-specific compatibility issues  
- `"linux"` - Linux-specific compatibility issues
- `"all"` - Cross-platform compatibility (default)

## Response Structure

The tool returns a comprehensive compatibility analysis:

```json
{
  "compatibilityScore": 85,
  "platform": "all",
  "totalIssues": 3,
  "codeAnalyzed": true,
  "issues": [
    {
      "type": "console_directive",
      "severity": "warning",
      "line": 1,
      "column": 1,
      "code": "PRINT \"Hello World\"",
      "problem": "Console output may not be visible without console directive",
      "solution": "Add $CONSOLE:ONLY at the beginning of the program",
      "fixedCode": "$CONSOLE:ONLY\nPRINT \"Hello World\"",
      "explanation": "QB64PE requires explicit console directives for console output to be visible",
      "platforms": ["Windows", "Linux", "macOS"],
      "impact": "medium"
    },
    {
      "type": "function_return_type",
      "severity": "error",
      "line": 5,
      "column": 12,
      "code": "result = INPUT$(1)",
      "problem": "INPUT$ function return type handling",
      "solution": "Use proper string variable assignment",
      "fixedCode": "result$ = INPUT$(1)",
      "explanation": "INPUT$ returns a string and must be assigned to a string variable",
      "platforms": ["Windows", "Linux", "macOS"],
      "impact": "high"
    },
    {
      "type": "array_declaration",
      "severity": "warning",
      "line": 8,
      "column": 5,
      "code": "DIM array()",
      "problem": "Dynamic array declaration without size",
      "solution": "Specify array size or use REDIM for dynamic arrays",
      "fixedCode": "DIM array(100) ' or use REDIM array(size)",
      "explanation": "QB64PE requires explicit array sizing for better memory management",
      "platforms": ["Windows", "Linux", "macOS"],
      "impact": "low"
    }
  ],
  "suggestions": [
    {
      "category": "best_practices",
      "suggestion": "Add explicit variable type declarations",
      "benefit": "Improves performance and prevents type-related errors"
    },
    {
      "category": "modernization",
      "suggestion": "Use _PUTIMAGE instead of PUT for graphics operations",
      "benefit": "Better performance and more features"
    }
  ],
  "platformSpecific": {
    "windows": {
      "issues": 0,
      "notes": ["Code appears compatible with Windows"]
    },
    "linux": {
      "issues": 1,
      "notes": ["Check file path separators for Linux compatibility"]
    },
    "macos": {
      "issues": 1,
      "notes": ["Verify case-sensitive file naming"]
    }
  },
  "fixedCode": "$CONSOLE:ONLY\nPRINT \"Hello World\"\n\nresult$ = INPUT$(1)\n\nDIM array(100)\n",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Compatibility Check

Validate a simple QB64PE program:

```javascript
const code = `
PRINT "Hello World"
INPUT name$
PRINT "Hello " + name$
`;

const validation = await validateQb64peCompatibility({
  code: code
});

console.log(`Compatibility Score: ${validation.compatibilityScore}%`);
console.log(`Issues Found: ${validation.totalIssues}`);

validation.issues.forEach(issue => {
  console.log(`${issue.severity.toUpperCase()}: ${issue.problem}`);
  console.log(`Solution: ${issue.solution}`);
});
```

### Platform-Specific Validation

Check code for specific platform compatibility:

```javascript
const fileCode = `
OPEN "data\\file.txt" FOR INPUT AS #1
WHILE NOT EOF(1)
  LINE INPUT #1, line$
  PRINT line$
WEND
CLOSE #1
`;

const windowsCheck = await validateQb64peCompatibility({
  code: fileCode,
  platform: "windows"
});

const linuxCheck = await validateQb64peCompatibility({
  code: fileCode,
  platform: "linux"
});

console.log("Windows issues:", windowsCheck.totalIssues);
console.log("Linux issues:", linuxCheck.totalIssues);
```

### Legacy Code Assessment

Evaluate older BASIC code for QB64PE compatibility:

```javascript
const legacyCode = `
10 CLS
20 PRINT "Enter a number:"
30 INPUT A
40 IF A > 0 THEN GOTO 60
50 PRINT "Invalid": GOTO 20
60 PRINT "Square root is "; SQR(A)
70 END
`;

const assessment = await validateQb64peCompatibility({
  code: legacyCode
});

console.log("Legacy code compatibility assessment:");
console.log(`Score: ${assessment.compatibilityScore}%`);
console.log("Modernization suggestions:", assessment.suggestions);
```

### Fix Application

Apply suggested fixes automatically:

```javascript
const problematicCode = `
PRINT "Debug info"
result = INPUT$(1)
DIM myArray()
`;

const validation = await validateQb64peCompatibility({
  code: problematicCode
});

if (validation.fixedCode) {
  console.log("Original code had issues, here's the fixed version:");
  console.log(validation.fixedCode);
} else {
  console.log("Code is already compatible!");
}
```

## Integration Workflows

### IDE Integration

```javascript
class CompatibilityLinter {
  async lintCode(code, platform = "all") {
    const validation = await validateQb64peCompatibility({ code, platform });
    
    return {
      diagnostics: validation.issues.map(issue => ({
        range: {
          start: { line: issue.line - 1, character: issue.column - 1 },
          end: { line: issue.line - 1, character: issue.column + issue.code.length }
        },
        severity: this.mapSeverity(issue.severity),
        message: issue.problem,
        source: "QB64PE Compatibility",
        code: issue.type,
        codeAction: {
          title: `Fix: ${issue.solution}`,
          edit: this.createEdit(issue)
        }
      })),
      overallScore: validation.compatibilityScore,
      quickFixes: validation.issues.filter(issue => issue.fixedCode)
    };
  }
  
  mapSeverity(severity) {
    const severityMap = {
      'error': 1,    // Error
      'warning': 2,  // Warning
      'info': 3,     // Information
      'hint': 4      // Hint
    };
    return severityMap[severity] || 3;
  }
  
  createEdit(issue) {
    return {
      changes: {
        [issue.uri]: [{
          range: this.getIssueRange(issue),
          newText: issue.fixedCode
        }]
      }
    };
  }
}
```

### Automated Testing

```javascript
class CompatibilityTestSuite {
  async validateProject(projectFiles) {
    const results = [];
    
    for (const file of projectFiles) {
      const code = await this.readFile(file.path);
      const validation = await validateQb64peCompatibility({
        code: code,
        platform: "all"
      });
      
      results.push({
        file: file.path,
        score: validation.compatibilityScore,
        issues: validation.totalIssues,
        criticalIssues: validation.issues.filter(i => i.severity === 'error').length,
        platformIssues: validation.platformSpecific
      });
    }
    
    return {
      overallScore: this.calculateOverallScore(results),
      fileResults: results,
      summary: this.generateSummary(results),
      recommendations: this.generateRecommendations(results)
    };
  }
  
  calculateOverallScore(results) {
    if (results.length === 0) return 100;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  }
  
  generateSummary(results) {
    const totalFiles = results.length;
    const filesWithIssues = results.filter(r => r.issues > 0).length;
    const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
    const criticalIssues = results.reduce((sum, r) => sum + r.criticalIssues, 0);
    
    return {
      totalFiles,
      filesWithIssues,
      totalIssues,
      criticalIssues,
      compatibilityRate: Math.round(((totalFiles - filesWithIssues) / totalFiles) * 100)
    };
  }
}
```

### Build Pipeline Integration

```javascript
class CompatibilityValidator {
  async validateBuild(sourceCode, targetPlatforms = ["all"]) {
    const validationResults = {};
    
    for (const platform of targetPlatforms) {
      const validation = await validateQb64peCompatibility({
        code: sourceCode,
        platform: platform
      });
      
      validationResults[platform] = {
        passed: validation.compatibilityScore >= 90,
        score: validation.compatibilityScore,
        issues: validation.issues,
        criticalIssues: validation.issues.filter(i => i.severity === 'error')
      };
    }
    
    const buildPassed = Object.values(validationResults).every(result => result.passed);
    
    return {
      buildPassed,
      platformResults: validationResults,
      overallScore: this.calculateOverallScore(validationResults),
      blockers: this.findBlockers(validationResults),
      recommendations: this.generateBuildRecommendations(validationResults)
    };
  }
  
  findBlockers(validationResults) {
    const blockers = [];
    
    Object.entries(validationResults).forEach(([platform, result]) => {
      result.criticalIssues.forEach(issue => {
        blockers.push({
          platform,
          issue: issue.problem,
          solution: issue.solution,
          line: issue.line
        });
      });
    });
    
    return blockers;
  }
}
```

## Error Handling

The tool handles various error conditions gracefully:

### Invalid Code Syntax

```javascript
const validateWithErrorHandling = async (code, platform) => {
  try {
    return await validateQb64peCompatibility({ code, platform });
  } catch (error) {
    if (error.message.includes('syntax error')) {
      return {
        compatibilityScore: 0,
        totalIssues: 1,
        issues: [{
          type: "syntax_error",
          severity: "error",
          problem: "Code contains syntax errors",
          solution: "Fix syntax errors before compatibility checking",
          explanation: error.message
        }],
        codeAnalyzed: false
      };
    }
    throw error;
  }
};
```

### Large Code Analysis

```javascript
const validateLargeCode = async (code, platform) => {
  const maxSize = 100000; // 100KB limit
  
  if (code.length > maxSize) {
    console.warn("Code is large, analyzing in chunks");
    
    const chunks = [];
    for (let i = 0; i < code.length; i += maxSize) {
      chunks.push(code.slice(i, i + maxSize));
    }
    
    const results = await Promise.all(
      chunks.map(chunk => validateQb64peCompatibility({ code: chunk, platform }))
    );
    
    return this.mergeValidationResults(results);
  }
  
  return await validateQb64peCompatibility({ code, platform });
};
```

### Platform Compatibility

```javascript
const validateAllPlatforms = async (code) => {
  const platforms = ["windows", "macos", "linux"];
  const results = {};
  
  for (const platform of platforms) {
    try {
      results[platform] = await validateQb64peCompatibility({ code, platform });
    } catch (error) {
      results[platform] = {
        error: error.message,
        compatibilityScore: 0,
        issues: []
      };
    }
  }
  
  return {
    crossPlatform: results,
    mostCompatible: this.findMostCompatible(results),
    universalIssues: this.findUniversalIssues(results)
  };
};
```

## Best Practices

### 1. Regular Validation

Integrate compatibility checking into your development workflow:

```javascript
class DevelopmentWorkflow {
  async validateOnSave(code, platform) {
    const validation = await validateQb64peCompatibility({ code, platform });
    
    if (validation.compatibilityScore < 80) {
      console.warn("Code compatibility score is low");
      this.showCompatibilityWarnings(validation.issues);
    }
    
    return validation;
  }
  
  async validateBeforeCommit(projectFiles) {
    for (const file of projectFiles) {
      const code = await this.readFile(file);
      const validation = await validateQb64peCompatibility({ code });
      
      if (validation.issues.some(issue => issue.severity === 'error')) {
        throw new Error(`Compatibility errors in ${file}: commit blocked`);
      }
    }
  }
}
```

### 2. Targeted Platform Testing

Test specific platforms when needed:

```javascript
// For cross-platform applications
const multiPlatformValidation = async (code) => {
  const platforms = ["windows", "linux", "macos"];
  const results = await Promise.all(
    platforms.map(platform => 
      validateQb64peCompatibility({ code, platform })
    )
  );
  
  return platforms.reduce((acc, platform, index) => {
    acc[platform] = results[index];
    return acc;
  }, {});
};

// For platform-specific code
const windowsValidation = await validateQb64peCompatibility({
  code: windowsSpecificCode,
  platform: "windows"
});
```

### 3. Progressive Fixing

Address issues in order of severity:

```javascript
const prioritizeIssues = (validation) => {
  const { issues } = validation;
  
  return {
    critical: issues.filter(i => i.severity === 'error'),
    important: issues.filter(i => i.severity === 'warning'),
    optional: issues.filter(i => i.severity === 'info')
  };
};
```

### 4. Code Quality Metrics

Track compatibility over time:

```javascript
class CompatibilityTracker {
  async trackProject(projectCode) {
    const validation = await validateQb64peCompatibility({ code: projectCode });
    
    const metrics = {
      timestamp: new Date().toISOString(),
      compatibilityScore: validation.compatibilityScore,
      totalIssues: validation.totalIssues,
      issueBreakdown: this.categorizeIssues(validation.issues),
      codeSize: projectCode.length,
      qualityTrend: await this.calculateTrend(validation.compatibilityScore)
    };
    
    await this.saveMetrics(metrics);
    return metrics;
  }
}
```

## Cross-References

- **[search_qb64pe_compatibility](./search_qb64pe_compatibility.md)** - Search compatibility information
- **[validate_qb64pe_syntax](./validate_qb64pe_syntax.md)** - Syntax validation
- **[port_qbasic_to_qb64pe](./port_qbasic_to_qb64pe.md)** - Legacy code porting
- **[get_qb64pe_best_practices](./get_qb64pe_best_practices.md)** - Development best practices
- **[analyze_qbasic_compatibility](./analyze_qbasic_compatibility.md)** - QBasic compatibility analysis

## See Also

- [QB64PE Compatibility Guide](../docs/COMPATIBILITY_INTEGRATION.md)
- [QB64PE Best Practices](../docs/QB64PE_DEBUGGING_BEST_PRACTICES.md)
- [Code Validation Workflows](../docs/LLM_USAGE_GUIDE.md)
