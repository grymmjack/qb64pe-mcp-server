# QB64PE Variable Scoping and $DYNAMIC Rules

This document describes the variable scoping rules and `$DYNAMIC` directive usage that have been added to the QB64PE MCP server to help with common scoping issues.

## Overview

Variable scoping is one of the most common sources of errors in QB64PE programs. The MCP server now includes specific rules to detect and help resolve these issues.

## Rules Added

### 1. Variable Scope Access (`variable_scope_access`)
- **Severity**: Warning
- **Pattern**: Detects when variables are accessed in SUB/FUNCTION that may not be in scope
- **Message**: "Potential variable scope issue - accessing variables that may not be in scope"
- **Suggestion**: "Use DIM SHARED for variables that need to be accessed across SUB/FUNCTION boundaries"

### 2. Missing $DYNAMIC Directive (`missing_dynamic_directive`)
- **Severity**: Warning  
- **Pattern**: Detects arrays with variable dimensions without `$DYNAMIC`
- **Message**: "Dynamic array without $DYNAMIC directive may cause issues"
- **Suggestion**: "Add '$DYNAMIC or use static array bounds with constants"

### 3. SHARED Without DIM (`shared_without_dim`)
- **Severity**: Error
- **Pattern**: Detects `SHARED` keyword used without `DIM` statement
- **Message**: "SHARED keyword must be used with DIM statement"
- **Suggestion**: "Use 'DIM SHARED variableName AS type' instead of 'SHARED variableName'"

### 4. Local Variable Shadowing (`local_variable_shadow`)
- **Severity**: Info
- **Pattern**: Detects local variables that may shadow SHARED variables
- **Message**: "Local variable may shadow a SHARED variable with the same name"
- **Suggestion**: "Use unique variable names in local scope or explicitly reference SHARED variables"

## Variable Scoping Rules Summary

### Global Scope
- Variables declared in the main program (outside SUB/FUNCTION) are global
- Use `DIM SHARED` to make them accessible in procedures
- Example: `DIM SHARED playerScore AS INTEGER`

### Local Scope
- Variables declared inside SUB/FUNCTION are local by default
- Local variables cannot be accessed from other procedures
- Example: `DIM localVar AS INTEGER` (inside SUB/FUNCTION)

### Accessing Global Variables
- Use `SHARED` (without DIM) to reference existing global variables
- Must be declared at the beginning of each SUB/FUNCTION that needs access
- Example:
```basic
SUB MyProc
    SHARED globalVar
    globalVar = 10
END SUB
```

### Dynamic Arrays
- Require `'$DYNAMIC` directive before declaration
- Use empty parentheses: `DIM arrayName() AS type`
- Resize with `REDIM`: `REDIM arrayName(newSize)`
- Use `REDIM PRESERVE` to keep existing data when resizing

### Static Arrays (default)
- Size fixed at compile time
- Faster access, less memory overhead
- Use constants or literals for size
- Example: `DIM arrayName(100) AS INTEGER`

## Examples

### ❌ Problematic Code
```basic
' Global variables
DIM score AS INTEGER
DIM gameLevel AS INTEGER

score = 0
gameLevel = 1

UpdateGame  ' Will cause scope issues

SUB UpdateGame
    ' ERROR: These variables are not accessible here
    score = score + 100
    gameLevel = gameLevel + 1
END SUB
```

### ✅ Corrected Code
```basic
' Properly shared global variables
DIM SHARED score AS INTEGER
DIM SHARED gameLevel AS INTEGER

score = 0
gameLevel = 1

UpdateGame  ' Now works correctly

SUB UpdateGame
    ' These variables are now accessible
    score = score + 100
    gameLevel = gameLevel + 1
END SUB
```

### ✅ Alternative: Using SHARED in Procedures
```basic
' Global variables in main program
DIM score AS INTEGER
DIM gameLevel AS INTEGER

score = 0
gameLevel = 1

UpdateGame

SUB UpdateGame
    ' Reference existing global variables
    SHARED score, gameLevel
    score = score + 100
    gameLevel = gameLevel + 1
END SUB
```

### ✅ Dynamic Arrays Example
```basic
'$DYNAMIC
DIM SHARED gameData() AS INTEGER

' Main program
REDIM gameData(100)

ProcessData

SUB ProcessData
    ' Resize if needed
    IF someCondition THEN
        REDIM PRESERVE gameData(200)
    END IF
    
    ' Process the array
    FOR i = 0 TO UBOUND(gameData)
        gameData(i) = i * 2
    NEXT i
END SUB
```

## Validation Checklist

The following items have been added to the validation checklist:

- Variables accessed in SUB/FUNCTION without proper SHARED declaration
- Dynamic arrays without $DYNAMIC directive
- SHARED keyword used without DIM statement
- Local variables shadowing SHARED variables with same names
- Arrays not properly shared between procedures
- Missing SHARED declarations for global variable access in procedures

## Knowledge Base Integration

New knowledge base sections have been added covering:

- **Variable Scoping**: Complete rules and examples for QB64PE variable scoping
- **Dynamic Arrays**: Proper usage of `$DYNAMIC` directive and dynamic array management
- **Common Issues**: Typical problems and their solutions
- **Best Practices**: Recommended approaches for variable scoping

## Search and Debugging

The MCP server can now:

- Search for variable scoping information with queries like "variable scope", "shared", "dynamic arrays"
- Provide specific debugging guidance for scope-related issues
- Offer suggestions for resolving variable accessibility problems

## Usage in MCP Client

When using this MCP server with an AI assistant:

1. **Code Validation**: Submit QB64PE code for automatic validation of scoping issues
2. **Search Help**: Ask questions like "How do I share variables between procedures?"
3. **Debugging**: Get specific guidance when encountering variable scope errors
4. **Best Practices**: Learn proper techniques for variable scoping in QB64PE

This enhancement significantly improves the MCP server's ability to help with one of the most common QB64PE programming challenges.
