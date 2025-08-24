# QB64PE Debugging Enhancement System

## Overview

The QB64PE MCP Server now includes a comprehensive debugging enhancement system that addresses the recurring debugging challenges identified in QB64PE development. This system automatically detects and fixes common issues that cause problems for both human developers and automated systems (LLMs).

## Core Issues Addressed

### 1. Console Output and Program Execution Issues (Issue #1)
**Problem**: Programs exit immediately without showing console output
**Symptoms**: 
- Program compiles but no output visible
- Process exits immediately
- Console window not visible

**Solutions Applied**:
- Automatic `$CONSOLE` directive injection
- Windows console activation with `_CONSOLE ON`
- Debug mode constants for flow control
- Conditional automation pauses

### 2. Flow Control for Automation (Issue #1b)
**Problem**: Programs hang waiting for user input ("Press any key...")
**Symptoms**:
- Program hangs waiting for user input
- Automated testing fails
- LLM cannot continue execution

**Solutions Applied**:
- Replace blocking `SLEEP` statements with conditional pauses
- Add automated timeout for DEBUG_MODE
- Maintain interactive behavior for non-debug use

### 3. File Handle and Resource Management Issues (Issue #4)
**Problem**: "Cannot CREATE because file is already in use" during recompilation
**Symptoms**:
- Cannot CREATE because file is already in use
- Compilation errors after failed runs
- File locking issues

**Solutions Applied**:
- Resource tracking system for file handles
- Automatic cleanup on program exit
- Replace `FREEFILE` with tracked allocation

### 4. Graphics Context Issues (Issue #6)
**Problem**: Graphics operations require proper image context management
**Symptoms**:
- Memory leaks
- Graphics operations fail
- Image handle errors

**Solutions Applied**:
- Graphics context management system
- Automatic image handle tracking
- Bounds checking for graphics operations
- Proper destination management

## New MCP Tools

### `enhance_qb64pe_code_for_debugging`
Applies comprehensive debugging enhancements to QB64PE source code.

**Parameters**:
- `sourceCode`: QB64PE source code to enhance
- `config`: Optional debugging configuration
  - `enableConsole`: Enable console management (default: true)
  - `enableLogging`: Enable logging system (default: true)
  - `enableScreenshots`: Enable screenshot system (default: true)
  - `enableFlowControl`: Enable flow control for automation (default: true)
  - `enableResourceTracking`: Enable resource management (default: true)
  - `timeoutSeconds`: Timeout for automated operations (default: 30)
  - `autoExit`: Enable automatic exit behavior (default: true)
  - `verboseOutput`: Enable verbose debug output (default: true)

**Returns**:
- Enhanced source code with debugging features
- List of modifications applied
- Debug features enabled
- Issues detected and solutions applied

### `get_qb64pe_debugging_best_practices`
Returns comprehensive debugging best practices specifically for QB64PE.

### `get_llm_debugging_guide`
Returns debugging guide specifically designed for LLMs and automated systems.

## Enhanced Code Features

When code is enhanced for debugging, the following systems are automatically injected:

### 1. Console Management System
```basic
$CONSOLE
$IF WIN THEN
_CONSOLE ON
$END IF

CONST DEBUG_MODE = 1
CONST AUTO_TEST_DELAY = 3

SUB DebugPause (message AS STRING)
    IF DEBUG_MODE = 1 THEN
        PRINT message + " (auto-continuing in " + STR$(AUTO_TEST_DELAY) + "s...)"
        _DELAY AUTO_TEST_DELAY
    ELSE
        PRINT message
        SLEEP
    END IF
END SUB
```

### 2. Resource Management System
```basic
DIM SHARED ResourceManager_FileHandles(100) AS INTEGER
DIM SHARED ResourceManager_ImageHandles(100) AS LONG

FUNCTION ResourceManager_GetFileHandle%
    ' Tracked file handle allocation
END FUNCTION

SUB ResourceManager_Cleanup
    ' Automatic cleanup of all resources
END SUB
```

### 3. Graphics Context Management
```basic
SUB GraphicsManager_PushDest (newDest AS LONG)
    ' Save current destination and set new one
END SUB

FUNCTION GraphicsManager_CreateImage& (width AS INTEGER, height AS INTEGER)
    ' Create image with tracking and validation
END FUNCTION

SUB GraphicsManager_SafePSET (x AS INTEGER, y AS INTEGER, clr AS LONG)
    ' Bounds-checked pixel operations
END SUB
```

### 4. Logging System
```basic
SUB LogMessage (category AS STRING, message AS STRING)
    ' Comprehensive logging to files and console
END SUB
```

### 5. Screenshot System
```basic
SUB TakeDebugScreenshot (label AS STRING)
    ' Automatic screenshot generation for graphics programs
END SUB
```

## For LLMs: Critical Usage Guidelines

### NEVER wait indefinitely for QB64PE programs

**Program Type Detection**:
1. **Graphics-Only**: No `$CONSOLE`, uses SCREEN/graphics → Will open window, may wait forever
2. **Console+Graphics**: Has `$CONSOLE` + graphics → Monitor console, allow graphics interaction
3. **Console-Only**: Has `$CONSOLE`, minimal graphics → Monitor STDOUT for completion

**Timeout Strategy**:
- **Graphics programs**: 30-60 seconds max, then suggest human testing
- **Console programs**: 15-30 seconds for simple, 60+ for complex
- **Mixed programs**: Monitor console output, timeout graphics portions

### Automated Debugging Workflow for LLMs:

1. **Enhance Code First**:
```typescript
const enhanced = await enhance_qb64pe_code_for_debugging(sourceCode, {
  enableConsole: true,
  enableFlowControl: true,
  timeoutSeconds: 30,
  autoExit: true
});
```

2. **Compile Enhanced Version**:
```bash
qb64pe -c enhanced_program.bas
```

3. **Execute with Monitoring**:
```bash
timeout 30s ./enhanced_program.exe > output.log 2>&1
```

4. **Parse Results**:
- Check output.log for completion signals
- Look for screenshots in qb64pe-screenshots/
- Review debug logs in qb64pe-logs/

## Expected Outputs

When using the enhanced debugging system:

### Console Output:
```
================================================================
  QB64PE PROGRAM EXECUTION MONITOR
  Started: 08-23-2025 10:30:45
  Log: debug_2025-08-23T10-30-45.log
================================================================
[LOG] 10:30:45 - Starting original program code
[INFO] Program Status: Initializing...
[SUCCESS] Graphics initialized successfully
[LOG] 10:30:46 - Screenshot saved: debug_2025-08-23T10-30-45_auto_001.png
Program completed (auto-continuing in 3s...)
Auto-exiting in 3 seconds...
```

### File Structure:
```
project/
├── enhanced_program.bas
├── enhanced_program.exe
├── qb64pe-logs/
│   └── debug_2025-08-23T10-30-45.log
└── qb64pe-screenshots/
    ├── debug_2025-08-23T10-30-45_auto_001.png
    ├── debug_2025-08-23T10-30-45_auto_002.png
    └── debug_2025-08-23T10-30-45_final_003.png
```

## Integration with Existing Tools

The debugging service integrates seamlessly with existing MCP tools:

- **Execution Service**: Enhanced with debugging features
- **Screenshot Service**: Automatic screenshot generation
- **Compiler Service**: Better error handling and resource management
- **Compatibility Service**: Debugging-aware compatibility checking

## Configuration Examples

### Minimal Enhancement (Console Only):
```typescript
{
  enableConsole: true,
  enableFlowControl: true,
  enableLogging: false,
  enableScreenshots: false,
  timeoutSeconds: 15
}
```

### Full Debug Suite (Graphics Programs):
```typescript
{
  enableConsole: true,
  enableLogging: true,
  enableScreenshots: true,
  enableFlowControl: true,
  enableResourceTracking: true,
  timeoutSeconds: 60,
  autoExit: true,
  verboseOutput: true
}
```

### Automated Testing:
```typescript
{
  enableConsole: true,
  enableFlowControl: true,
  enableResourceTracking: true,
  timeoutSeconds: 30,
  autoExit: true,
  verboseOutput: false
}
```

## Benefits

1. **Eliminates Manual Intervention**: Programs no longer hang waiting for input
2. **Improves Reliability**: Proper resource management prevents compilation errors
3. **Enables Automation**: LLMs can safely execute QB64PE programs with timeouts
4. **Better Debugging**: Comprehensive logging and monitoring
5. **Cross-Platform**: Works consistently across Windows, macOS, and Linux
6. **Backward Compatible**: Enhanced code still works in interactive mode

## Troubleshooting

### If programs still hang:
- Check timeout configuration
- Verify DEBUG_MODE is enabled
- Look for unhandled INPUT statements

### If compilation fails:
- Ensure resource cleanup is working
- Check for file handle leaks
- Verify enhanced code syntax

### If graphics don't work:
- Enable screenshot system
- Check graphics context management
- Verify image handle tracking

The debugging enhancement system transforms QB64PE development from a manually intensive process to an automation-friendly workflow while maintaining full compatibility with existing code and development practices.
