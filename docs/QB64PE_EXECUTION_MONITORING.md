# QB64PE Execution Monitoring Guide

This document provides comprehensive guidance for monitoring QB64PE program execution, managing timeouts, and implementing cross-platform process monitoring strategies.

## Overview

QB64PE programs can have different execution characteristics that require different monitoring approaches:

1. **Graphics-only Programs**: Open graphics windows and may run indefinitely waiting for user interaction
2. **Console Programs**: Use `$CONSOLE` and provide text output that can be monitored
3. **Mixed Programs**: Combine graphics and console output

## Key Issues for LLMs and Automated Systems

### The "Hanging" Problem

- **Graphics programs** often sit in event loops waiting for user input (mouse clicks, key presses)
- **LLMs should NOT wait indefinitely** for these programs to complete
- **Console output** can be monitored for progress and completion signals
- **Process monitoring** helps detect hung or waiting states

## MCP Server Tools for Execution Monitoring

### 1. `analyze_qb64pe_execution_mode`

Analyzes source code to determine execution characteristics:

```json
{
  "executionState": {
    "status": "graphics_mode",
    "hasGraphics": true,
    "hasConsole": false,
    "screenshotDir": "./qb64pe-screenshots"
  },
  "guidance": {
    "recommendation": "Graphics-only program detected. Will open window and may run indefinitely...",
    "waitingBehavior": "wait_user_input",
    "monitoringStrategy": ["Monitor process CPU usage", "Generate screenshots", "Set timeout"]
  }
}
```

### 2. `get_process_monitoring_commands`

Provides cross-platform commands for process monitoring:

```json
{
  "platform": "win32",
  "monitoring": {
    "commands": [
      "tasklist /FI \"IMAGENAME eq qb64pe*\" /FO CSV",
      "wmic process where \"CommandLine like '%qb64pe%'\" get ProcessId,WorkingSetSize"
    ]
  },
  "termination": {
    "commands": ["taskkill /PID {pid} /T", "taskkill /PID {pid} /F /T"]
  }
}
```

### 3. `generate_monitoring_template`

Creates QB64PE code with built-in monitoring:

- Automatic logging to timestamped files
- Screenshot generation at key points
- Console output formatting
- Execution timing and completion tracking

### 4. `parse_console_output`

Analyzes console output for completion signals:

```json
{
  "isWaitingForInput": true,
  "isCompleted": false,
  "lastActivity": "Press any key to continue...",
  "suggestedAction": "requires_user_input"
}
```

## Timeout Strategies for Different Program Types

### Graphics-Only Programs
- **Timeout**: 30-60 seconds maximum
- **Strategy**: Monitor CPU usage - if low and stable after initial spike, program is likely waiting for input
- **Action**: Hand over to human for interactive testing
- **Screenshots**: Generate automatically to capture visual output

### Console Programs  
- **Timeout**: 15-30 seconds for simple programs, longer for data processing
- **Strategy**: Parse console output for completion signals
- **Signals**: "Press any key", "END", "finished", input prompts
- **Action**: Continue monitoring or terminate if hung

### Mixed Programs
- **Timeout**: Variable based on console output
- **Strategy**: Monitor both console and graphics
- **Action**: Parse console for progress, allow graphics interaction

## Cross-Platform Process Management

### Windows Commands
```powershell
# Monitor processes
tasklist /FI "IMAGENAME eq *.exe" | findstr qb64
wmic process where "CommandLine like '%qb64%'" get ProcessId,WorkingSetSize

# Terminate process
taskkill /PID {pid} /F /T
```

### Linux/macOS Commands  
```bash
# Monitor processes
ps aux | grep qb64 | grep -v grep
pgrep -af qb64
top -p {pid} -n 1

# Terminate process
kill {pid}        # Graceful
kill -9 {pid}     # Force
```

## Automated Screenshot Generation

The execution service can inject screenshot code into QB64PE programs:

```basic
SUB TakeScreenshot (filename AS STRING)
    _SAVEIMAGE filename + "_" + TIME$ + ".bmp"
END SUB

' Call at key points
CALL TakeScreenshot("debug")
```

Screenshots are automatically saved to `qb64pe-screenshots/` directory which is added to `.gitignore`.

## Enhanced Console Output

Use colored, formatted console output for better parsing:

```basic
$CONSOLE

SUB PrintHeader (title AS STRING)
    _DEST _CONSOLE
    COLOR 15, 1  ' White on blue
    PRINT STRING$(60, "=")
    PRINT "  " + title
    PRINT STRING$(60, "=")
    COLOR 7, 0   ' Reset
    _DEST 0
END SUB

SUB PrintInfo (label AS STRING, value AS STRING)
    _DEST _CONSOLE
    COLOR 14, 0  ' Yellow
    PRINT "[INFO] " + label + ": " + value
    COLOR 7, 0   ' Reset
    _DEST 0
END SUB
```

## Log File Monitoring

Real-time log monitoring commands:

### Windows
```powershell
Get-Content -Path "qb64pe-logs\execution_*.log" -Wait -Tail 10
```

### Linux/macOS
```bash
tail -f qb64pe-logs/execution_*.log
```

## Integration with .gitignore

The execution service automatically updates `.gitignore` to exclude:
- `qb64pe-screenshots/` - Generated screenshots
- `qb64pe-logs/` - Execution logs  
- `*.exe` - Compiled executables
- QB64PE temporary files

## Best Practices for LLMs

### 1. Always Analyze First
Use `analyze_qb64pe_execution_mode` before running any QB64PE program.

### 2. Set Appropriate Timeouts
- Graphics programs: 30-60 seconds maximum
- Console programs: 15-30 seconds initially
- Data processing: Longer timeouts with progress monitoring

### 3. Monitor Process State
Use cross-platform commands to check:
- CPU usage (steady low = waiting for input)
- Memory usage (growing = potential memory leak)
- Process responsiveness

### 4. Parse Output Intelligently
Look for completion signals:
- "Press any key", "END", "SYSTEM"
- Input prompts: "Enter value:", "Y/N?"
- Error messages or exceptions

### 5. Generate Monitoring Code
Use `generate_monitoring_template` to wrap user code with:
- Automatic logging
- Screenshot generation
- Formatted console output
- Execution timing

### 6. Know When to Hand Over
- Graphics programs after timeout → Human interaction needed
- Input prompts → Human input required
- Hung processes → Terminate and report

## Example Workflow

1. **Analyze**: `analyze_qb64pe_execution_mode(sourceCode)`
2. **Generate**: `generate_monitoring_template(sourceCode)` 
3. **Compile and Run**: Execute the enhanced code
4. **Monitor**: Use appropriate commands for platform
5. **Parse**: `parse_console_output(output)` for signals
6. **Timeout**: Apply strategy based on program type
7. **Cleanup**: Terminate if needed, save logs/screenshots

This approach ensures LLMs don't hang waiting for graphics programs while still providing useful monitoring and debugging capabilities.
