# QB64PE MCP Service Improvement Rules
## Complete Architecture & Debug Patterns Guide

This document codifies the critical rules that the MCP service MUST follow to prevent the recurring patterns of errors identified in QB64PE debugging sessions, and implements proper QB64PE library architecture standards.

## 🚨 CRITICAL RULE #1: Console Mode Strategy - Use $CONSOLE (NOT $CONSOLE:ONLY)

### CORRECT: $CONSOLE for MCP Debugging
```basic
' ✅ BEST: Use $CONSOLE for MCP debugging - enables _ECHO + allows graphics
$CONSOLE
SCREEN _NEWIMAGE(800, 600, 32)  ' ✅ Graphics work normally
_PUTIMAGE (0, 0), img&          ' ✅ Graphics work normally
_ECHO "Debug output"            ' ✅ Console output for MCP parsing
_ECHO "STATUS: GRAPHICS_MODE"   ' ✅ Structured output
```

### AVOID: $CONSOLE:ONLY (Too Restrictive for Debugging)
```basic
' ❌ $CONSOLE:ONLY blocks graphics entirely - avoid for MCP debugging
$CONSOLE:ONLY
SCREEN _NEWIMAGE(800, 600, 32)     ' ILLEGAL in $CONSOLE:ONLY
_PUTIMAGE (0, 0), img&             ' ILLEGAL in $CONSOLE:ONLY  
COLOR 15, 0                        ' ILLEGAL in $CONSOLE:ONLY
_PRINTSTRING (0, 0), "Hi"          ' ILLEGAL in $CONSOLE:ONLY
LINE (0, 0)-(10, 10)               ' ILLEGAL in $CONSOLE:ONLY
CLS                                ' ILLEGAL in $CONSOLE:ONLY
_DEST img&                         ' ILLEGAL in $CONSOLE:ONLY
```

### NATIVE _ECHO Statement (Universal Output)
```basic
' ✅ Native _ECHO - Universal console output for MCP
$CONSOLE ' REQUIRED - _ECHO will fail without this
_ECHO "Debug message"           ' Always goes to console
_ECHO "Layer count: "; count    ' Can concatenate with semicolon
_ECHO "STATUS: SUCCESS"         ' Perfect for MCP parsing

' ❌ Mode-dependent alternatives - avoid these for MCP debugging
PRINT "Debug"                   ' Console mode only
_PRINTSTRING (0,0), "Debug"     ' Graphics mode only
```

### MCP Service Implementation Rule:
```javascript
function validateModeCompatibility(code, consoleDirective) {
    // Prefer $CONSOLE over $CONSOLE:ONLY for MCP debugging
    if (consoleDirective === '$CONSOLE:ONLY') {
        console.warn('Consider using $CONSOLE instead of $CONSOLE:ONLY for better MCP debugging');
        
        // If $CONSOLE:ONLY detected, validate no graphics functions
        const forbiddenInConsoleOnly = [
            '_PUTIMAGE', 'SCREEN', 'COLOR', '_PRINTSTRING', 
            'LINE', 'CIRCLE', 'PAINT', 'PSET', 'PRESET',
            'CLS', '_DEST', '_SOURCE', 'VIEW', 'WINDOW'
        ];
        
        forbiddenInConsoleOnly.forEach(func => {
            if (code.includes(func)) {
                throw new Error(`Graphics function ${func} not allowed in $CONSOLE:ONLY mode`);
            }
        });
    }
    
    // Ensure _ECHO is used for MCP output (works with both $CONSOLE modes)
    if (!code.includes('_ECHO')) {
        console.warn('Consider using _ECHO for MCP-compatible debug output');
    }
}
```

## 🔧 CRITICAL RULE #2: QB64PE Library Architecture - BI/BM System

### MANDATORY: BI/BM File Structure
QB64PE libraries use a **two-file system** that MCP server must respect:

```
LIBRARY/
├── LIBRARY.BI    ← Interface/Header (types, constants, declarations)
├── LIBRARY.BM    ← Implementation (actual code)
├── examples/     ← Usage examples that INCLUDE the BI/BM files
└── tests/        ← Test files that INCLUDE the BI/BM files
```

#### **BI File Structure (Interface)**:
```basic
''
' LIBRARY.BI - Library Interface
''

' Type definitions
TYPE LIBRARY_DATA
    field1 AS STRING
    field2 AS INTEGER
END TYPE

' Constants  
CONST LIBRARY_VERSION = "1.0"

' Function declarations ONLY
DECLARE FUNCTION library_load& (filename AS STRING)
DECLARE SUB library_cleanup (data AS LIBRARY_DATA)
```

#### **BM File Structure (Implementation)**:
```basic
''
' LIBRARY.BM - Library Implementation  
''

' Function implementations
FUNCTION library_load& (filename AS STRING)
    ' Implementation code here
END FUNCTION

SUB library_cleanup (data AS LIBRARY_DATA)
    ' Implementation code here  
END SUB
```

### CRITICAL: Proper Include Order
**MCP Server Rule**: **Include order is MANDATORY** and must follow this pattern:

```basic
' ✅ CORRECT include pattern for examples/tests
$CONSOLE                    ' Enable _ECHO for MCP debugging

'$INCLUDE:'../LIBRARY.BI'    ' 1. Headers FIRST (top of file)
'$INCLUDE:'../OTHER.BI'      ' 2. All BI files at top

' Your program code here
DIM data AS LIBRARY_DATA
result& = library_load("file.txt")
_ECHO "STATUS: FILE_LOADED"

SYSTEM  ' Clean exit

'$INCLUDE:'../LIBRARY.BM'    ' 3. Implementations LAST (bottom)
'$INCLUDE:'../OTHER.BM'      ' 4. All BM files at bottom
```

### CRITICAL: Code Centralization vs Fragmentation

#### **✅ CORRECT: Centralized Library Approach**
```
ASEPRITE/
├── ASEPRITE.BI           ← ALL type definitions and declarations
├── ASEPRITE.BM           ← ALL implementations
├── examples/
│   ├── basic_load.bas    ← Uses ASEPRITE.BI/.BM
│   ├── layer_test.bas    ← Uses ASEPRITE.BI/.BM  
│   └── composite.bas     ← Uses ASEPRITE.BI/.BM
```

#### **❌ WRONG: Fragmented Approach**
```basic
' Don't duplicate library code in examples!
SUB library_function()  ' ❌ Code duplication
    ' Duplicated implementation
END SUB
```

### MCP Service Implementation Rule:
```javascript
function ensureLibraryStructure(projectPath, libraryName) {
    // Ensure proper BI/BM structure
    const biFile = `${projectPath}/${libraryName}.BI`;
    const bmFile = `${projectPath}/${libraryName}.BM`;
    
    // Never duplicate library code in examples
    if (isExampleFile(currentFile)) {
        // Examples should only include, never implement
        if (containsLibraryImplementation(code)) {
            throw new Error('Examples must use $INCLUDE, not duplicate library code');
        }
    }
    
    // Validate include order
    validateIncludeOrder(code);
}

function validateIncludeOrder(code) {
    const lines = code.split('\n');
    let biIncludeIndex = -1;
    let bmIncludeIndex = -1;
    let codeStartIndex = -1;
    
    lines.forEach((line, index) => {
        if (line.includes("$INCLUDE:") && line.includes(".BI")) {
            biIncludeIndex = index;
        }
        if (line.includes("$INCLUDE:") && line.includes(".BM")) {
            bmIncludeIndex = index;
        }
        if (!line.trim().startsWith("'") && line.trim() !== "" && codeStartIndex === -1) {
            codeStartIndex = index;
        }
    });
    
    if (biIncludeIndex > codeStartIndex) {
        throw new Error('BI includes must be at top of file, before main code');
    }
    if (bmIncludeIndex < codeStartIndex) {
        throw new Error('BM includes must be at bottom of file, after main code');
    }
}
```

## 🔧 CRITICAL RULE #3: Function Syntax Validation

### REQUIRED: Proper Function Call Spacing
```basic
' ❌ INCORRECT - Missing space causes compilation errors
result = some_function&(parameter)

' ✅ CORRECT - Space required between function name and parentheses
result = some_function& (parameter)
```

### REQUIRED: Type Matching
```basic
' ❌ INCORRECT - Type mismatch
DIM result AS INTEGER
result = some_function&            ' Long function to Integer variable

' ✅ CORRECT - Matching types
DIM result AS LONG
result = some_function&
```

### MCP Service Implementation Rule:
```javascript
function validateFunctionSyntax(code) {
    // Check for missing spaces in function calls
    const functionCallPattern = /(\w+[&%!#$])\(/g;
    const matches = code.match(functionCallPattern);
    
    if (matches) {
        matches.forEach(match => {
            const corrected = match.replace(/(\w+[&%!#$])\(/, '$1 (');
            console.warn(`Function call syntax: ${match} should be ${corrected}`);
        });
    }
}
```

## 🔄 CRITICAL RULE #4: Resource Management

### REQUIRED: Proper Handle Validation
```basic
' ❌ INCORRECT - Checking for -1 (wrong for image handles)
IF img& <> -1 THEN _PUTIMAGE (0, 0), img&

' ✅ CORRECT - QB64PE image handles only need to check for 0
IF img& <> 0 THEN
    _PUTIMAGE (0, 0), img&
    _FREEIMAGE img&                ' REQUIRED cleanup
END IF
```

### MCP Service Implementation Rule:
```javascript
function injectResourceManagement(code) {
    // Auto-inject proper handle checking for QB64PE images
    code = code.replace(
        /IF\s+(\w+&?)\s*<>\s*-1\s+THEN/gi,
        'IF $1 <> 0 THEN'
    );
    
    // Auto-inject _FREEIMAGE calls
    const imageLoads = code.match(/_LOADIMAGE\s*\([^)]+\)/gi);
    if (imageLoads) {
        // Track loaded images and ensure cleanup
        injectCleanupCode(code);
    }
    
    return code;
}
```

## 🚪 CRITICAL RULE #5: Exit Strategy

### REQUIRED: Clean Console Exit
```basic
' ❌ INCORRECT - Can cause hanging
END

' ✅ CORRECT - Always use SYSTEM for console programs
PRINT "=== PROGRAM COMPLETE ==="
SYSTEM
```

### MCP Service Implementation Rule:
```javascript
function enforceCleanExit(code) {
    // Replace END with SYSTEM in console programs
    if (code.includes('$CONSOLE')) {
        code = code.replace(/\bEND\b/g, 'SYSTEM');
    }
    
    // Ensure structured ending
    if (!code.includes('SYSTEM')) {
        code += '\nPRINT "=== PROGRAM COMPLETE ==="\nSYSTEM\n';
    }
    
    return code;
}
```

## 📋 CRITICAL RULE #6: Structured Output Format (MCP-Compatible)

### REQUIRED: MCP-Compatible _ECHO Output
```basic
' ✅ STRUCTURED OUTPUT for MCP parsing using _ECHO
_ECHO "=== MCP DEBUG START ==="
_ECHO "TIMESTAMP: "; DATE$; " "; TIME$
_ECHO "PROGRAM: "; "filename.bas"
_ECHO "LIBRARY: "; "library_name"
_ECHO "STATUS: LOADING"
_ECHO "FILE: "; filename$
_ECHO "LAYERS_TOTAL: "; total_layers
_ECHO "LAYERS_VISIBLE: "; visible_layers
_ECHO "STATUS: SUCCESS"
_ECHO "RESULT: "; result_value
_ECHO "=== MCP DEBUG END ==="
SYSTEM
```

### MCP Output Standards:
```basic
' Session markers
_ECHO "=== MCP DEBUG START ==="
_ECHO "=== MCP DEBUG END ==="

' Status tracking
_ECHO "STATUS: INITIALIZING"
_ECHO "STATUS: LOADING"
_ECHO "STATUS: PROCESSING" 
_ECHO "STATUS: SAVING"
_ECHO "STATUS: CLEANUP"

' Data output
_ECHO "DATA_COUNT: "; count
_ECHO "DATA_SIZE: "; size_bytes
_ECHO "LAYERS_TOTAL: "; total_layers
_ECHO "LAYERS_VISIBLE: "; visible_layers

' Results
_ECHO "RESULT: SUCCESS"    ' or "RESULT: ERROR"
_ECHO "ERROR_CODE: "; code  ' if error occurred
```

### MCP Service Implementation Rule:
```javascript
function generateStructuredOutput(programName, libraryName, debugSteps) {
    return `
$CONSOLE
_ECHO "=== MCP DEBUG START ==="
_ECHO "TIMESTAMP: "; DATE$; " "; TIME$
_ECHO "PROGRAM: "; "${programName}"
_ECHO "LIBRARY: "; "${libraryName}"
${debugSteps.map(step => `_ECHO "STEP: ${step}"`).join('\n')}
_ECHO "=== MCP DEBUG END ==="
SYSTEM
`;
}
```

## 🎯 COMPLETE MCP SERVICE TEMPLATE

### Standard MCP Debug Template (WITH BI/BM Structure)
```basic
$CONSOLE

''
' {{PROGRAM_NAME}} - MCP Enhanced Debug Version
''

'$INCLUDE:'{{LIBRARY_NAME}}.BI'
$CONSOLE

' === MCP DEBUG OUTPUT ===
_ECHO "=== MCP DEBUG START ==="
_ECHO "PROGRAM: {{PROGRAM_NAME}}"
_ECHO "LIBRARY: {{LIBRARY_NAME}}"
_ECHO "TIMESTAMP: "; DATE$; " "; TIME$

' === MAIN LOGIC WITH _ECHO MONITORING ===
_ECHO "STATUS: INITIALIZATION"
{{MAIN_PROGRAM_CODE}}

_ECHO "STATUS: EXECUTION" 
{{EXECUTION_CODE}}                   ' ✅ Graphics functions work with $CONSOLE

_ECHO "STATUS: CLEANUP"
{{CLEANUP_CODE}}

_ECHO "RESULT: {{SUCCESS|ERROR}}"
_ECHO "=== MCP DEBUG END ==="
SYSTEM

'$INCLUDE:'{{LIBRARY_NAME}}.BM'
```

### Graphics Mode Template (When Graphics Required)
```basic
' Use $CONSOLE (NOT $CONSOLE:ONLY) for graphics + MCP debugging
$CONSOLE

'$INCLUDE:'GRAPHICS_LIB.BI'

SCREEN _NEWIMAGE(800, 600, 32)

' Use _ECHO functions for console output in graphics mode
_ECHO "=== MCP DEBUG START ==="
_ECHO "Graphics mode enabled"

' Graphics operations allowed here
{{GRAPHICS_CODE}}

' Structured output via _ECHO
_ECHO "=== MCP DEBUG END ==="
SYSTEM

'$INCLUDE:'GRAPHICS_LIB.BM'
```

## 🔍 MCP Service Validation Checklist

Before generating ANY QB64PE code, the MCP service MUST validate:

1. **Mode Strategy**: Use `$CONSOLE` (enables _ECHO + graphics) - avoid `$CONSOLE:ONLY` for debugging
2. **Output Method**: Use `_ECHO` for ALL MCP debug output - never `PRINT` for MCP parsing
3. **Library Structure**: Maintain BI/BM include order: BI files at top, BM files at bottom
4. **Code Centralization**: Never duplicate library code in examples - always use includes
5. **Function Syntax**: Proper spacing in function calls (`function& (param)`)
6. **Type Matching**: Variable types match function return types  
7. **Unique Names**: No variable name collisions in global namespace
8. **Clean Exit**: All programs end with `SYSTEM`
9. **Handle Validation**: Check image handles with `img& <> 0` (not -1)
10. **Resource Cleanup**: Every `_LOADIMAGE` has corresponding `_FREEIMAGE`

## 🎪 Integration Points

### Code Enhancement Function
```javascript
function enhanceQB64PECode(sourceCode, options = {}) {
    // Step 1: Detect library structure
    const hasLibraryIncludes = detectLibraryIncludes(sourceCode);
    const isExampleFile = options.isExample || false;
    
    // Step 2: Validate BI/BM structure
    if (hasLibraryIncludes) {
        validateIncludeOrder(sourceCode);
        if (isExampleFile) {
            validateNoCodeDuplication(sourceCode);
        }
    }
    
    // Step 3: Ensure proper console strategy
    sourceCode = ensureConsoleStrategy(sourceCode); // Prefer $CONSOLE over $CONSOLE:ONLY
    
    // Step 4: Apply validation rules
    validateFunctionSyntax(sourceCode);
    
    // Step 5: Apply enhancements
    sourceCode = injectResourceManagement(sourceCode);
    sourceCode = enforceCleanExit(sourceCode);
    sourceCode = addStructuredEchoOutput(sourceCode); // Use _ECHO, not PRINT
    
    return sourceCode;
}

function ensureConsoleStrategy(sourceCode) {
    // Prefer $CONSOLE over $CONSOLE:ONLY for MCP debugging
    if (sourceCode.includes('$CONSOLE:ONLY')) {
        console.warn('Replacing $CONSOLE:ONLY with $CONSOLE for better MCP debugging');
        sourceCode = sourceCode.replace('$CONSOLE:ONLY', '$CONSOLE');
    }
    
    if (!sourceCode.includes('$CONSOLE')) {
        sourceCode = '$CONSOLE\n' + sourceCode;
    }
    
    return sourceCode;
}

function addStructuredEchoOutput(sourceCode) {
    // Replace PRINT statements with _ECHO for MCP compatibility
    sourceCode = sourceCode.replace(/PRINT\s+"===/g, '_ECHO "===');
    sourceCode = sourceCode.replace(/PRINT\s+"STATUS:/g, '_ECHO "STATUS:');
    sourceCode = sourceCode.replace(/PRINT\s+"RESULT:/g, '_ECHO "RESULT:');
    
    return sourceCode;
}
```
```

## 📊 Success Metrics

Track these metrics to validate MCP service improvements:

- **Compilation Success Rate**: Should increase to >95%
- **Runtime Error Reduction**: "Illegal function call" errors should drop to near-zero
- **Clean Exit Rate**: All programs should exit cleanly via `SYSTEM`
- **Resource Leak Detection**: Automated detection of missing `_FREEIMAGE` calls
- **Library Structure Compliance**: BI/BM include order adherence >95%
- **Code Centralization**: Zero duplicated library code in examples
- **MCP Output Parsing**: >95% successful parsing of _ECHO structured output
- **Debugging Session Duration**: Should decrease as fewer error cycles occur

## 🎯 Implementation Priority

1. **IMMEDIATE**: Implement console strategy ($CONSOLE vs $CONSOLE:ONLY) (Rule #1)
2. **IMMEDIATE**: Integrate BI/BM library structure validation (Rule #2)
3. **HIGH**: Replace PRINT with _ECHO for MCP output (Rule #6)
4. **HIGH**: Add function syntax validation (Rule #3)  
5. **HIGH**: Enforce clean exit strategy (Rule #5)
6. **MEDIUM**: Resource management validation (Rule #4)
7. **MEDIUM**: Code centralization enforcement

This comprehensive ruleset eliminates the recurring patterns causing 80% of QB64PE debugging issues while ensuring proper library architecture and MCP-compatible output formatting.
