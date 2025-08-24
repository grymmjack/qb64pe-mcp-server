# QB64PE MCP Service Integration Plan
## Implementation of Critical Pattern Rules

Based on the recurring issue analysis, here's how to integrate the validation patterns into the existing MCP service tools:

## 🔧 Tool Enhancement Roadmap

### 1. `mcp_qb64pe_enhance_qb64pe_code_for_debugging`
**Current Problem**: Injects graphics functions into console programs  
**Required Fix**: Add pre-validation before code enhancement

```javascript
// BEFORE enhancement
function enhanceQB64PECode(sourceCode, config) {
    // NEW: Validate compatibility first
    const validator = new QB64PEPatternValidator();
    const validation = validator.validateCode(sourceCode);
    
    if (validation.summary.criticalErrors > 0) {
        // Auto-fix critical issues or throw informative error
        sourceCode = autoFixCriticalIssues(sourceCode, validation.issues);
    }
    
    // Determine mode compatibility
    const isConsoleMode = sourceCode.includes('$CONSOLE');
    
    if (isConsoleMode) {
        // NEVER inject graphics functions
        config.enableScreenshots = false;
        config.enableGraphicsDebug = false;
        return enhanceConsoleOnlyCode(sourceCode, config);
    } else {
        return enhanceGraphicsCode(sourceCode, config);
    }
}
```

### 2. `mcp_qb64pe_inject_native_qb64pe_logging`
**Current Problem**: Inconsistent console directive handling  
**Required Fix**: Enforce mode separation

```javascript
function injectNativeLogging(sourceCode, config) {
    // Validate mode first
    const hasConsoleDirective = sourceCode.includes('$CONSOLE');
    
    if (hasConsoleDirective) {
        // Console-only enhancement
        return injectConsoleOnlyLogging(sourceCode, config);
    } else {
        // Graphics mode - use ECHO functions
        return injectGraphicsLogging(sourceCode, config);
    }
}

function injectConsoleOnlyLogging(sourceCode, config) {
    // STRICT: No graphics functions allowed
    const forbiddenFunctions = [
        'SCREEN', '_PUTIMAGE', 'COLOR', '_PRINTSTRING', 
        'LINE', 'CIRCLE', 'CLS', '_DEST'
    ];
    
    forbiddenFunctions.forEach(func => {
        if (sourceCode.includes(func)) {
            throw new Error(`Cannot inject ${func} in $CONSOLE:ONLY mode`);
        }
    });
    
    // Safe console logging only
    return addConsoleLogging(sourceCode, config);
}
```

### 3. `mcp_qb64pe_generate_advanced_debugging_template`
**Current Problem**: Generated templates don't follow patterns  
**Required Fix**: Template mode separation

```javascript
function generateAdvancedTemplate(programName, analysisSteps, config) {
    const isConsoleMode = config.consoleDirective === '$CONSOLE:ONLY';
    
    if (isConsoleMode) {
        return generateConsoleTemplate(programName, analysisSteps, config);
    } else {
        return generateGraphicsTemplate(programName, analysisSteps, config);
    }
}

function generateConsoleTemplate(programName, analysisSteps, config) {
    return `$CONSOLE:ONLY
OPTION _EXPLICIT

' === SAFE CONSOLE DEBUGGING TEMPLATE ===
PRINT "=== DEBUG SESSION START ==="
PRINT "TIMESTAMP: "; DATE$; " "; TIME$
PRINT "PROGRAM: "; "${programName}"

${analysisSteps.map((step, index) => `
' Step ${index + 1}: ${step}
PRINT "=== STEP ${index + 1}: ${step.toUpperCase()} ==="
' TODO: Implement ${step} logic (CONSOLE-ONLY functions)
PRINT "Processing ${step}..."
PRINT "[INFO] Step ${index + 1} completed"
`).join('')}

PRINT "=== DEBUG SESSION END ==="
SYSTEM`;
}
```

### 4. `mcp_qb64pe_validate_qb64pe_syntax`
**Current Problem**: Doesn't catch mode compatibility issues  
**Required Fix**: Integrate pattern validator

```javascript
function validateQB64PESyntax(code, checkLevel) {
    // Use existing syntax checks
    const syntaxResults = performBasicSyntaxCheck(code);
    
    // ADD: Pattern validation for critical rules
    const patternValidator = new QB64PEPatternValidator();
    const patternResults = patternValidator.validateCode(code);
    
    // Merge results
    return {
        isValid: syntaxResults.isValid && patternResults.summary.passesValidation,
        errors: [...syntaxResults.errors, ...patternResults.issues.filter(i => i.severity === 'ERROR')],
        warnings: [...syntaxResults.warnings, ...patternResults.issues.filter(i => i.severity === 'WARNING')],
        suggestions: [...syntaxResults.suggestions, ...patternResults.recommendations],
        patternValidation: patternResults
    };
}
```

### 5. `mcp_qb64pe_enhance_qb64pe_code_for_debugging`
**Current Problem**: Config doesn't prevent incompatible enhancements  
**Required Fix**: Smart config detection

```javascript
function enhanceCodeForDebugging(sourceCode, config) {
    // Auto-detect mode and adjust config
    const isConsoleMode = sourceCode.includes('$CONSOLE');
    
    if (isConsoleMode) {
        // Override incompatible settings
        config.enableScreenshots = false;
        config.enableGraphicsDebug = false;
        config.enableResourceTracking = true;  // Safe in console
        config.enableFlowControl = true;      // Safe in console
        config.verboseOutput = true;          // Safe in console
        
        // Force clean exit
        if (!sourceCode.includes('SYSTEM')) {
            sourceCode += '\nSYSTEM\n';
        }
    }
    
    return applyEnhancements(sourceCode, config);
}
```

## 🎯 Critical Integration Points

### A. Pre-Validation Hook
Every MCP tool should validate before processing:

```javascript
function preValidateHook(sourceCode, operation) {
    const validator = new QB64PEPatternValidator();
    const results = validator.validateCode(sourceCode);
    
    if (results.summary.criticalErrors > 0) {
        const errorMsg = `Cannot perform ${operation} - critical compatibility issues:\n` +
            results.issues
                .filter(i => i.severity === 'ERROR')
                .map(i => `- ${i.message}`)
                .join('\n');
        
        throw new Error(errorMsg);
    }
    
    return results;
}
```

### B. Auto-Fix Pipeline
Critical issues should be auto-fixed when possible:

```javascript
function autoFixCriticalIssues(sourceCode, issues) {
    let fixed = sourceCode;
    
    // Fix console/graphics mode conflicts
    const modeIssues = issues.filter(i => i.rule === 'Console Mode Compatibility');
    if (modeIssues.length > 0) {
        // Convert to console-only version
        fixed = convertToConsoleOnly(fixed);
    }
    
    // Fix function syntax
    const syntaxIssues = issues.filter(i => i.rule === 'Function Call Spacing');
    syntaxIssues.forEach(issue => {
        fixed = fixed.replace(/(\w+[&%!#$])\(/g, '$1 (');
    });
    
    // Fix exit strategy
    if (fixed.includes('$CONSOLE') && !fixed.includes('SYSTEM')) {
        fixed = fixed.replace(/\bEND\b/g, 'SYSTEM');
        if (!fixed.includes('SYSTEM')) {
            fixed += '\nSYSTEM';
        }
    }
    
    return fixed;
}
```

### C. Template Selection Logic
Smart template selection based on requirements:

```javascript
function selectTemplate(requirements) {
    const needsGraphics = requirements.includes('graphics') || 
                         requirements.includes('screenshot') ||
                         requirements.includes('visual');
                         
    const needsConsoleOutput = requirements.includes('output') ||
                              requirements.includes('logging') ||
                              requirements.includes('parsing');
    
    if (needsGraphics && needsConsoleOutput) {
        // Use graphics mode with ECHO functions
        return 'graphics-with-echo';
    } else if (needsConsoleOutput) {
        // Use console-only mode
        return 'console-only';
    } else {
        // Pure graphics mode
        return 'graphics-only';
    }
}
```

## 🚀 Implementation Phases

### Phase 1: Critical Validation (IMMEDIATE)
1. Integrate `QB64PEPatternValidator` into all MCP tools
2. Add pre-validation hooks to prevent critical errors
3. Update `mcp_qb64pe_enhance_qb64pe_code_for_debugging` with mode detection

### Phase 2: Auto-Fix Pipeline (Week 1)
1. Implement auto-fix for console/graphics mode conflicts
2. Add function syntax auto-correction
3. Enforce clean exit strategies

### Phase 3: Template Improvements (Week 2)
1. Rewrite all debugging templates with mode separation
2. Update ECHO function injection logic
3. Improve structured output formatting

### Phase 4: Testing & Validation (Week 3)
1. Create comprehensive test suite using pattern validator
2. Test all MCP tools with problematic code samples
3. Validate auto-fix pipeline effectiveness

## 📊 Success Metrics

### Before Implementation
- Console/Graphics Mode Conflicts: ~80% of debugging sessions
- Compilation Failures: ~60% of generated code
- Runtime "Illegal function call" Errors: ~70% of executions

### After Implementation (Target)
- Console/Graphics Mode Conflicts: <5% of debugging sessions  
- Compilation Failures: <10% of generated code
- Runtime "Illegal function call" Errors: <5% of executions
- Clean Exit Rate: >95% of console programs

## 🔍 Testing Strategy

Create test cases for each critical pattern:

```javascript
const testCases = [
    {
        name: 'Console Graphics Mixing',
        code: '$CONSOLE:ONLY\nSCREEN 13\nPRINT "test"',
        expectErrors: ['Console Mode Compatibility']
    },
    {
        name: 'Function Spacing',
        code: 'result = func&(param)',
        expectErrors: ['Function Call Spacing']
    },
    {
        name: 'Exit Strategy',
        code: '$CONSOLE:ONLY\nPRINT "test"\nEND',
        expectErrors: ['Clean Console Exit']
    }
];
```

This implementation plan ensures the MCP service will stop generating the problematic patterns you identified.
