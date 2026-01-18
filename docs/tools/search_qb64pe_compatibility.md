# search_qb64pe_compatibility

**Category**: Compatibility & Validation  
**Description**: Search for compatibility issues, solutions, and best practices  
**Type**: Compatibility Analysis Tool  

## Overview

The `search_qb64pe_compatibility` tool provides comprehensive searching capabilities for QB64PE compatibility information, including common issues, solutions, best practices, and platform-specific considerations. This tool is essential for developers working with legacy code, cross-platform development, or encountering compatibility challenges.

The tool searches through a curated knowledge base of compatibility information, including function return types, console directives, multi-statement lines, array declarations, missing functions, legacy keywords, device access, and platform-specific considerations.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Issue Resolution**: Find solutions to specific compatibility problems
- **Best Practices Discovery**: Learn recommended approaches for common scenarios
- **Legacy Code Support**: Get help with porting older BASIC code
- **Platform Compatibility**: Find cross-platform development guidance
- **Preventive Guidance**: Avoid common compatibility pitfalls

## Parameters

### Required Parameters

**query** (string)  
Search query for compatibility knowledge. Can include:
- Specific error messages (e.g., "Type mismatch", "Illegal function call")
- Function or keyword names (e.g., "INPUT$", "PLAY", "TIMER")
- Problem descriptions (e.g., "program crashes on startup", "console not showing")
- Platform references (e.g., "Linux graphics", "Windows file paths")

### Optional Parameters

**category** (string)  
Specific compatibility category to search within. Available categories:
- `"function_return_types"` - Issues with function return value handling
- `"console_directives"` - Problems with $CONSOLE, $SCREENHIDE, etc.
- `"multi_statement_lines"` - Issues with multiple statements per line
- `"array_declarations"` - Array initialization and declaration problems
- `"missing_functions"` - Functions not available in QB64PE
- `"legacy_keywords"` - Deprecated or changed keywords
- `"device_access"` - Hardware access and device I/O issues
- `"platform_specific"` - OS-specific compatibility concerns
- `"best_practices"` - Recommended approaches and patterns
- `"debugging"` - Debugging and troubleshooting techniques
- `"all"` - Search all categories (default)

## Response Structure

The tool returns a structured object containing compatibility information:

```json
{
  "query": "console not showing",
  "category": "console_directives",
  "totalResults": 8,
  "searchTime": "0.12s",
  "results": [
    {
      "title": "Console Window Not Appearing",
      "category": "console_directives",
      "problem": "Console window does not appear when using PRINT statements",
      "solution": "Add $CONSOLE:ONLY directive at the beginning of your program",
      "example": "$CONSOLE:ONLY\nPRINT \"Hello World\"",
      "explanation": "The $CONSOLE:ONLY directive forces the program to run in console mode only, ensuring console output is visible",
      "relatedIssues": ["PRINT not showing output", "Program window not responding"],
      "platforms": ["Windows", "Linux", "macOS"],
      "severity": "common",
      "lastUpdated": "2024-01-10T15:30:00Z"
    },
    {
      "title": "Mixed Graphics and Console Output",
      "category": "console_directives",
      "problem": "Need both graphics window and console output",
      "solution": "Use $CONSOLE directive with _DEST _CONSOLE for console output",
      "example": "$CONSOLE\nSCREEN _NEWIMAGE(800, 600, 32)\n_DEST _CONSOLE\nPRINT \"Debug info\"\n_DEST 0",
      "explanation": "Use $CONSOLE (not $CONSOLE:ONLY) and switch destinations for output",
      "relatedIssues": ["Graphics window conflicts", "Debugging graphics programs"],
      "platforms": ["Windows", "Linux", "macOS"],
      "severity": "intermediate",
      "lastUpdated": "2024-01-08T09:15:00Z"
    }
  ],
  "suggestions": [
    "console window",
    "$CONSOLE directive",
    "PRINT output",
    "debugging console"
  ],
  "relatedCategories": [
    "debugging",
    "best_practices"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### General Compatibility Search

Search for solutions to a specific problem:

```javascript
const consoleIssue = await searchQb64peCompatibility({
  query: "console not showing"
});

console.log(`Found ${consoleIssue.totalResults} solutions`);
consoleIssue.results.forEach(result => {
  console.log(`${result.title}: ${result.solution}`);
  console.log(`Example: ${result.example}`);
});
```

### Category-Specific Search

Search within a specific compatibility category:

```javascript
const arrayIssues = await searchQb64peCompatibility({
  query: "array initialization",
  category: "array_declarations"
});

console.log("Array declaration issues:");
arrayIssues.results.forEach(issue => {
  console.log(`Problem: ${issue.problem}`);
  console.log(`Solution: ${issue.solution}`);
});
```

### Platform-Specific Issues

Find platform-specific compatibility information:

```javascript
const linuxIssues = await searchQb64peCompatibility({
  query: "Linux file paths",
  category: "platform_specific"
});

console.log("Linux-specific compatibility issues:");
linuxIssues.results.forEach(issue => {
  console.log(`${issue.title}: ${issue.explanation}`);
});
```

### Legacy Code Migration

Find help with legacy BASIC code:

```javascript
const legacyHelp = await searchQb64peCompatibility({
  query: "QBasic PLAY statement",
  category: "legacy_keywords"
});

console.log("Legacy code migration help:");
legacyHelp.results.forEach(help => {
  console.log(`${help.title}: ${help.solution}`);
});
```

## Integration Workflows

### Compatibility Checker

```javascript
class CompatibilityChecker {
  async checkCodeCompatibility(code) {
    const issues = [];
    
    // Check for common compatibility patterns
    const patterns = [
      { regex: /INPUT\$/, category: "function_return_types" },
      { regex: /PLAY\s+"/, category: "legacy_keywords" },
      { regex: /^(?!.*\$CONSOLE).*PRINT/, category: "console_directives" },
      { regex: /DIM\s+\w+\(\)/, category: "array_declarations" }
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(code)) {
        const results = await searchQb64peCompatibility({
          query: pattern.regex.source,
          category: pattern.category
        });
        
        if (results.totalResults > 0) {
          issues.push({
            pattern: pattern.regex.source,
            category: pattern.category,
            solutions: results.results
          });
        }
      }
    }
    
    return {
      totalIssues: issues.length,
      issues: issues,
      recommendations: await this.generateRecommendations(issues)
    };
  }
  
  async generateRecommendations(issues) {
    const recommendations = [];
    
    for (const issue of issues) {
      const bestSolution = issue.solutions[0]; // Highest relevance
      recommendations.push({
        problem: bestSolution.problem,
        recommendation: bestSolution.solution,
        example: bestSolution.example,
        priority: this.getPriority(bestSolution.severity)
      });
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}
```

### Migration Assistant

```javascript
class QB64PEMigrationAssistant {
  async analyzeLegacyCode(code) {
    const categories = [
      "legacy_keywords",
      "function_return_types",
      "array_declarations",
      "console_directives"
    ];
    
    const analysis = {};
    
    for (const category of categories) {
      const results = await searchQb64peCompatibility({
        query: "common issues",
        category: category
      });
      
      analysis[category] = {
        totalKnownIssues: results.totalResults,
        relevantIssues: this.findRelevantIssues(code, results.results),
        recommendations: this.generateCategoryRecommendations(results.results)
      };
    }
    
    return {
      overallCompatibility: this.calculateCompatibilityScore(analysis),
      categoryAnalysis: analysis,
      migrationPlan: await this.generateMigrationPlan(analysis),
      estimatedEffort: this.estimateMigrationEffort(analysis)
    };
  }
  
  findRelevantIssues(code, issues) {
    return issues.filter(issue => {
      // Check if issue patterns exist in the code
      return this.codeContainsPattern(code, issue.problem);
    });
  }
  
  async generateMigrationPlan(analysis) {
    const steps = [];
    
    // Prioritize by severity and impact
    Object.entries(analysis).forEach(([category, data]) => {
      data.relevantIssues.forEach(issue => {
        steps.push({
          step: steps.length + 1,
          category: category,
          problem: issue.problem,
          solution: issue.solution,
          example: issue.example,
          priority: this.getPriority(issue.severity)
        });
      });
    });
    
    return steps.sort((a, b) => b.priority - a.priority);
  }
}
```

### Error Diagnostic Tool

```javascript
class ErrorDiagnosticTool {
  async diagnoseError(errorMessage, code) {
    const diagnostics = await searchQb64peCompatibility({
      query: errorMessage
    });
    
    const contextualResults = await this.analyzeContext(code, diagnostics.results);
    
    return {
      errorMessage: errorMessage,
      possibleCauses: contextualResults.causes,
      solutions: contextualResults.solutions,
      preventionTips: contextualResults.prevention,
      relatedIssues: diagnostics.suggestions
    };
  }
  
  async analyzeContext(code, results) {
    const context = this.extractCodeContext(code);
    
    return {
      causes: results
        .filter(result => this.isRelevantToContext(result, context))
        .map(result => result.problem),
      solutions: results
        .filter(result => this.isRelevantToContext(result, context))
        .map(result => ({
          solution: result.solution,
          example: result.example,
          confidence: this.calculateConfidence(result, context)
        }))
        .sort((a, b) => b.confidence - a.confidence),
      prevention: await this.generatePreventionTips(results)
    };
  }
  
  extractCodeContext(code) {
    return {
      hasConsoleDirective: code.includes('$CONSOLE'),
      hasGraphics: /SCREEN|_NEWIMAGE/.test(code),
      hasFileIO: /OPEN|INPUT|PRINT#/.test(code),
      hasArrays: /DIM\s+\w+\(/.test(code),
      language: this.detectLanguageVariant(code)
    };
  }
}
```

## Error Handling

The tool handles various error conditions gracefully:

### No Results Found

```javascript
const handleNoResults = async (query, category) => {
  const results = await searchQb64peCompatibility({ query, category });
  
  if (results.totalResults === 0) {
    console.log(`No compatibility information found for "${query}"`);
    console.log("Suggestions:", results.suggestions.join(", "));
    
    // Try broader search
    if (category !== "all") {
      console.log("Trying broader search...");
      return await searchQb64peCompatibility({ query, category: "all" });
    }
    
    // Try related categories
    const relatedResults = await Promise.all(
      results.relatedCategories.map(cat => 
        searchQb64peCompatibility({ query, category: cat })
      )
    );
    
    return relatedResults.find(result => result.totalResults > 0);
  }
  
  return results;
};
```

### Query Optimization

```javascript
const optimizeQuery = (query) => {
  // Common query transformations for better results
  const optimizations = {
    'error': 'common error messages',
    'crash': 'program crash troubleshooting',
    'not working': 'common problems solutions',
    'linux': 'linux platform compatibility',
    'windows': 'windows platform compatibility',
    'console': 'console directive usage'
  };
  
  const lowercaseQuery = query.toLowerCase();
  
  for (const [pattern, replacement] of Object.entries(optimizations)) {
    if (lowercaseQuery.includes(pattern)) {
      return replacement;
    }
  }
  
  return query;
};
```

### Fallback Strategies

```javascript
const searchWithFallback = async (query, category) => {
  try {
    let results = await searchQb64peCompatibility({ query, category });
    
    if (results.totalResults === 0) {
      // Try optimized query
      const optimizedQuery = optimizeQuery(query);
      results = await searchQb64peCompatibility({ 
        query: optimizedQuery, 
        category 
      });
    }
    
    if (results.totalResults === 0 && category !== "all") {
      // Try all categories
      results = await searchQb64peCompatibility({ 
        query, 
        category: "all" 
      });
    }
    
    return results;
  } catch (error) {
    console.warn("Compatibility search failed, using cached data");
    return await getCachedCompatibilityData(query, category);
  }
};
```

## Best Practices

### 1. Query Formulation

Use descriptive and specific queries:

```javascript
// Good: Specific error message
const results = await searchQb64peCompatibility({
  query: "Type mismatch in function return"
});

// Better: Include context
const results = await searchQb64peCompatibility({
  query: "INPUT$ function type mismatch QB64PE",
  category: "function_return_types"
});
```

### 2. Category Usage

Use appropriate categories for focused results:

```javascript
// For specific issue types
const consoleIssues = await searchQb64peCompatibility({
  query: "PRINT output",
  category: "console_directives"
});

// For general exploration
const allIssues = await searchQb64peCompatibility({
  query: "common problems",
  category: "all"
});
```

### 3. Result Processing

Process results based on severity and relevance:

```javascript
const processCompatibilityResults = (results) => {
  const critical = results.results.filter(r => r.severity === "critical");
  const common = results.results.filter(r => r.severity === "common");
  const minor = results.results.filter(r => r.severity === "minor");
  
  return {
    immediate: critical, // Fix immediately
    planned: common,    // Plan to fix
    optional: minor     // Fix when convenient
  };
};
```

### 4. Caching Strategy

Implement intelligent caching for compatibility data:

```javascript
class CompatibilityCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }
  
  async search(query, category = "all") {
    const cacheKey = `${query}:${category}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.data;
    }
    
    const fresh = await searchQb64peCompatibility({ query, category });
    
    this.cache.set(cacheKey, {
      data: fresh,
      timestamp: Date.now()
    });
    
    return fresh;
  }
}
```

## Cross-References

- **[validate_qb64pe_compatibility](./validate_qb64pe_compatibility.md)** - Code compatibility validation
- **[validate_qb64pe_syntax](./validate_qb64pe_syntax.md)** - Syntax validation
- **[port_qbasic_to_qb64pe](./port_qbasic_to_qb64pe.md)** - Legacy code porting
- **[get_qb64pe_best_practices](./get_qb64pe_best_practices.md)** - Development best practices
- **[get_debugging_help](./get_debugging_help.md)** - Debugging assistance

## See Also

- [QB64PE Compatibility Guide](../docs/COMPATIBILITY_INTEGRATION.md)
- [QB64PE Best Practices](../docs/QB64PE_DEBUGGING_BEST_PRACTICES.md)
- [Porting Implementation Guide](../docs/PORTING_IMPLEMENTATION_SUMMARY.md)
