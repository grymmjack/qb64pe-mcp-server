# validate_qb64pe_syntax

**Category**: Syntax & Validation  
**Description**: Validate QB64PE code syntax and suggest corrections  
**Type**: Syntax Validation Tool  

## Overview

The `validate_qb64pe_syntax` tool performs comprehensive syntax validation of QB64PE source code, identifying syntax errors, structural issues, and providing specific corrections and suggestions. This tool is essential for ensuring code correctness before compilation and execution.

Unlike compatibility tools that focus on cross-platform issues, this tool specifically examines syntax compliance with QB64PE language specifications, including proper statement structure, variable declarations, function usage, and language-specific constructs.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Syntax Error Detection**: Identify and locate syntax errors before compilation
- **Code Structure Validation**: Ensure proper program structure and flow
- **Best Practice Enforcement**: Suggest improvements for code quality
- **Learning Support**: Help developers understand correct QB64PE syntax
- **Pre-compilation Validation**: Catch errors early in the development process

## Parameters

### Required Parameters

**code** (string)  
QB64PE source code to validate. Can include:
- Complete programs with multiple subroutines
- Individual functions or procedures
- Code snippets and blocks
- Single statements for testing

### Optional Parameters

**checkLevel** (string)  
Level of syntax checking to perform. Available levels:
- `"basic"` - Essential syntax validation (default)
- `"strict"` - Comprehensive validation including style issues
- `"best-practices"` - Include coding best practice recommendations

## Response Structure

The tool returns a detailed syntax validation report:

```json
{
  "isValid": false,
  "checkLevel": "strict",
  "totalErrors": 2,
  "totalWarnings": 3,
  "totalSuggestions": 1,
  "errors": [
    {
      "type": "syntax_error",
      "severity": "error",
      "line": 5,
      "column": 12,
      "code": "IF x = 5 THEN PRINT \"Five\"",
      "message": "Missing END IF statement",
      "suggestion": "Add END IF to close the IF block",
      "correctedCode": "IF x = 5 THEN\n    PRINT \"Five\"\nEND IF",
      "rule": "control_structure_completion",
      "explanation": "IF statements without THEN on the same line require END IF"
    },
    {
      "type": "variable_error",
      "severity": "error", 
      "line": 8,
      "column": 5,
      "code": "DIM myArray(size)",
      "message": "Variable 'size' not defined",
      "suggestion": "Define 'size' before using it as array dimension",
      "correctedCode": "size = 100\nDIM myArray(size)",
      "rule": "variable_declaration",
      "explanation": "Array dimensions must use defined variables or constants"
    }
  ],
  "warnings": [
    {
      "type": "style_warning",
      "severity": "warning",
      "line": 3,
      "column": 1,
      "code": "print \"hello\"",
      "message": "Inconsistent keyword casing",
      "suggestion": "Use consistent uppercase for keywords: PRINT",
      "correctedCode": "PRINT \"hello\"",
      "rule": "keyword_casing",
      "explanation": "Consistent keyword casing improves code readability"
    },
    {
      "type": "structure_warning",
      "severity": "warning",
      "line": 12,
      "column": 1,
      "code": "GOTO label1",
      "message": "GOTO statement detected",
      "suggestion": "Consider using structured control flow (IF/THEN, WHILE, FOR)",
      "correctedCode": "' Use structured programming instead of GOTO",
      "rule": "structured_programming",
      "explanation": "Structured programming improves code maintainability"
    }
  ],
  "suggestions": [
    {
      "type": "optimization",
      "severity": "info",
      "message": "Consider adding explicit variable type declarations",
      "benefit": "Improves performance and prevents type-related errors",
      "example": "DIM userName AS STRING\nDIM userAge AS INTEGER"
    }
  ],
  "summary": {
    "linesAnalyzed": 15,
    "statementsChecked": 12,
    "blocksValidated": 3,
    "overallQuality": "needs_improvement"
  },
  "correctedCode": "' Corrected version of the code with fixes applied",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Syntax Validation

Validate simple QB64PE code:

```javascript
const code = `
PRINT "Hello World"
INPUT name$
IF name$ = "quit" THEN
    PRINT "Goodbye"
PRINT "Nice to meet you, " + name$
`;

const validation = await validateQb64peSyntax({
  code: code,
  checkLevel: "basic"
});

console.log(`Code is ${validation.isValid ? 'valid' : 'invalid'}`);
console.log(`Errors: ${validation.totalErrors}`);
console.log(`Warnings: ${validation.totalWarnings}`);

validation.errors.forEach(error => {
  console.log(`Line ${error.line}: ${error.message}`);
  console.log(`Suggestion: ${error.suggestion}`);
});
```

### Strict Syntax Checking

Perform comprehensive syntax validation:

```javascript
const complexCode = `
dim x, y as integer
for i = 1 to 10
print i;
if i mod 2 = 0 then print " even"; else print " odd";
print
next i
`;

const strictValidation = await validateQb64peSyntax({
  code: complexCode,
  checkLevel: "strict"
});

console.log("Strict validation results:");
console.log(`Quality: ${strictValidation.summary.overallQuality}`);

strictValidation.warnings.forEach(warning => {
  console.log(`Warning: ${warning.message}`);
  console.log(`Rule: ${warning.rule}`);
});
```

### Best Practices Validation

Get coding best practice recommendations:

```javascript
const improvableCode = `
10 PRINT "Old style line numbers"
20 GOTO 40
30 PRINT "This won't execute"
40 INPUT A$
50 IF A$ = "Y" THEN GOTO 10
60 END
`;

const bestPracticesCheck = await validateQb64peSyntax({
  code: improvableCode,
  checkLevel: "best-practices"
});

console.log("Best practices analysis:");
bestPracticesCheck.suggestions.forEach(suggestion => {
  console.log(`${suggestion.type}: ${suggestion.message}`);
  console.log(`Benefit: ${suggestion.benefit}`);
});
```

### Auto-Correction Application

Apply suggested corrections:

```javascript
const problematicCode = `
PRINT "Enter number:"
INPUT x
IF x > 0 THEN
PRINT "Positive"
PRINT "Processing..."
`;

const validation = await validateQb64peSyntax({
  code: problematicCode,
  checkLevel: "strict"
});

if (!validation.isValid && validation.correctedCode) {
  console.log("Original code had syntax errors.");
  console.log("Here's the corrected version:");
  console.log(validation.correctedCode);
}
```

## Integration Workflows

### IDE Syntax Highlighting

```javascript
class SyntaxHighlighter {
  async validateAndHighlight(code) {
    const validation = await validateQb64peSyntax({ 
      code, 
      checkLevel: "strict" 
    });
    
    return {
      diagnostics: this.createDiagnostics(validation),
      highlights: this.createHighlights(validation),
      quickFixes: this.createQuickFixes(validation),
      overallStatus: validation.isValid ? 'valid' : 'invalid'
    };
  }
  
  createDiagnostics(validation) {
    const diagnostics = [];
    
    // Add errors
    validation.errors.forEach(error => {
      diagnostics.push({
        range: this.createRange(error.line, error.column, error.code.length),
        severity: 'error',
        message: error.message,
        source: 'QB64PE Syntax',
        code: error.rule
      });
    });
    
    // Add warnings
    validation.warnings.forEach(warning => {
      diagnostics.push({
        range: this.createRange(warning.line, warning.column, warning.code.length),
        severity: 'warning',
        message: warning.message,
        source: 'QB64PE Style',
        code: warning.rule
      });
    });
    
    return diagnostics;
  }
  
  createQuickFixes(validation) {
    const fixes = [];
    
    validation.errors.forEach(error => {
      if (error.correctedCode) {
        fixes.push({
          title: `Fix: ${error.suggestion}`,
          edit: {
            range: this.createRange(error.line, error.column, error.code.length),
            newText: error.correctedCode
          }
        });
      }
    });
    
    return fixes;
  }
}
```

### Code Quality Analyzer

```javascript
class CodeQualityAnalyzer {
  async analyzeQuality(code) {
    const validation = await validateQb64peSyntax({ 
      code, 
      checkLevel: "best-practices" 
    });
    
    const metrics = this.calculateMetrics(validation);
    const score = this.calculateQualityScore(validation, metrics);
    
    return {
      overallScore: score,
      syntaxScore: this.calculateSyntaxScore(validation),
      styleScore: this.calculateStyleScore(validation),
      bestPracticesScore: this.calculateBestPracticesScore(validation),
      metrics: metrics,
      recommendations: this.generateRecommendations(validation),
      trend: await this.calculateTrend(code, score)
    };
  }
  
  calculateMetrics(validation) {
    return {
      linesOfCode: validation.summary.linesAnalyzed,
      statementsPerLine: validation.summary.statementsChecked / validation.summary.linesAnalyzed,
      controlStructures: validation.summary.blocksValidated,
      errorDensity: validation.totalErrors / validation.summary.linesAnalyzed,
      warningDensity: validation.totalWarnings / validation.summary.linesAnalyzed
    };
  }
  
  calculateQualityScore(validation, metrics) {
    let score = 100;
    
    // Deduct for errors
    score -= validation.totalErrors * 10;
    
    // Deduct for warnings  
    score -= validation.totalWarnings * 3;
    
    // Adjust for code complexity
    if (metrics.statementsPerLine > 2) {
      score -= (metrics.statementsPerLine - 2) * 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}
```

### Educational Syntax Tutor

```javascript
class SyntaxTutor {
  async provideTutoring(code) {
    const validation = await validateQb64peSyntax({ 
      code, 
      checkLevel: "best-practices" 
    });
    
    return {
      lessonsNeeded: this.identifyLessons(validation),
      practiceExercises: this.generateExercises(validation),
      explanations: this.generateExplanations(validation),
      progressAssessment: this.assessProgress(validation)
    };
  }
  
  identifyLessons(validation) {
    const lessons = [];
    
    validation.errors.forEach(error => {
      switch (error.rule) {
        case 'control_structure_completion':
          lessons.push('Control Structure Syntax');
          break;
        case 'variable_declaration':
          lessons.push('Variable Declaration and Scope');
          break;
        case 'function_syntax':
          lessons.push('Function and Subroutine Syntax');
          break;
      }
    });
    
    validation.warnings.forEach(warning => {
      switch (warning.rule) {
        case 'keyword_casing':
          lessons.push('QB64PE Coding Style');
          break;
        case 'structured_programming':
          lessons.push('Structured Programming Principles');
          break;
      }
    });
    
    return [...new Set(lessons)]; // Remove duplicates
  }
  
  generateExercises(validation) {
    const exercises = [];
    
    validation.errors.forEach(error => {
      exercises.push({
        type: 'fix_error',
        instruction: `Fix this syntax error: ${error.message}`,
        problematicCode: error.code,
        expectedSolution: error.correctedCode,
        hint: error.suggestion
      });
    });
    
    return exercises;
  }
}
```

## Error Handling

The tool handles various error conditions gracefully:

### Malformed Code Input

```javascript
const validateSafely = async (code, checkLevel = "basic") => {
  try {
    return await validateQb64peSyntax({ code, checkLevel });
  } catch (error) {
    return {
      isValid: false,
      totalErrors: 1,
      errors: [{
        type: "parse_error",
        severity: "error",
        line: 1,
        column: 1,
        message: "Unable to parse code: " + error.message,
        suggestion: "Check for malformed syntax or encoding issues",
        rule: "parse_failure"
      }],
      warnings: [],
      suggestions: []
    };
  }
};
```

### Large Code Handling

```javascript
const validateLargeCode = async (code, checkLevel) => {
  const maxSize = 50000; // 50KB limit for single validation
  
  if (code.length > maxSize) {
    console.warn("Code is large, validating in sections");
    
    const sections = this.splitCodeIntoSections(code);
    const validations = await Promise.all(
      sections.map(section => validateQb64peSyntax({ 
        code: section, 
        checkLevel 
      }))
    );
    
    return this.mergeValidationResults(validations);
  }
  
  return await validateQb64peSyntax({ code, checkLevel });
};
```

### Incremental Validation

```javascript
const validateIncremental = async (code, previousValidation) => {
  // Only validate changed portions for performance
  const changes = this.detectChanges(code, previousValidation.originalCode);
  
  if (changes.length === 0) {
    return previousValidation;
  }
  
  // Validate only changed sections plus context
  const relevantCode = this.extractRelevantCode(code, changes);
  const partialValidation = await validateQb64peSyntax({ 
    code: relevantCode,
    checkLevel: "basic"
  });
  
  return this.mergeWithPreviousValidation(partialValidation, previousValidation);
};
```

## Best Practices

### 1. Validation Levels

Choose appropriate validation levels:

```javascript
// For development - catch all issues
const developmentValidation = await validateQb64peSyntax({
  code: myCode,
  checkLevel: "best-practices"
});

// For quick checks - basic syntax only
const quickValidation = await validateQb64peSyntax({
  code: myCode,
  checkLevel: "basic"
});

// For code review - comprehensive but not pedantic
const reviewValidation = await validateQb64peSyntax({
  code: myCode,
  checkLevel: "strict"
});
```

### 2. Error Prioritization

Handle errors by severity:

```javascript
const prioritizeIssues = (validation) => {
  return {
    mustFix: validation.errors, // Blocks compilation
    shouldFix: validation.warnings.filter(w => w.severity === 'warning'),
    couldImprove: validation.suggestions
  };
};
```

### 3. Continuous Validation

Integrate into development workflow:

```javascript
class ContinuousValidator {
  constructor() {
    this.validationCache = new Map();
  }
  
  async validateOnType(code, debounceMs = 500) {
    clearTimeout(this.validationTimeout);
    
    this.validationTimeout = setTimeout(async () => {
      const validation = await validateQb64peSyntax({ 
        code, 
        checkLevel: "basic" 
      });
      
      this.updateUI(validation);
    }, debounceMs);
  }
  
  async validateOnSave(code) {
    return await validateQb64peSyntax({ 
      code, 
      checkLevel: "strict" 
    });
  }
  
  async validateBeforeCommit(code) {
    const validation = await validateQb64peSyntax({ 
      code, 
      checkLevel: "best-practices" 
    });
    
    if (validation.totalErrors > 0) {
      throw new Error("Cannot commit code with syntax errors");
    }
    
    return validation;
  }
}
```

### 4. Performance Optimization

Optimize validation for large codebases:

```javascript
class PerformantValidator {
  async validateEfficiently(code, options = {}) {
    const { 
      skipCache = false, 
      parallelValidation = true,
      maxChunkSize = 10000 
    } = options;
    
    // Check cache first
    if (!skipCache) {
      const cached = this.getFromCache(code);
      if (cached) return cached;
    }
    
    // For large code, validate in parallel chunks
    if (code.length > maxChunkSize && parallelValidation) {
      return await this.validateInParallel(code, maxChunkSize);
    }
    
    // Standard validation
    const result = await validateQb64peSyntax({ code });
    this.cacheResult(code, result);
    return result;
  }
}
```

## Cross-References

- **[validate_qb64pe_compatibility](./validate_qb64pe_compatibility.md)** - Compatibility validation
- **[search_qb64pe_compatibility](./search_qb64pe_compatibility.md)** - Compatibility issue search
- **[get_qb64pe_best_practices](./get_qb64pe_best_practices.md)** - Development best practices
- **[lookup_qb64pe_keyword](./lookup_qb64pe_keyword.md)** - Keyword syntax reference
- **[get_debugging_help](./get_debugging_help.md)** - Debugging assistance

## See Also

- [QB64PE Syntax Guide](../docs/QB64PE_LANGUAGE_REFERENCE.md)
- [Code Quality Guidelines](../docs/QB64PE_DEBUGGING_BEST_PRACTICES.md)
- [Development Workflows](../docs/LLM_USAGE_GUIDE.md)
