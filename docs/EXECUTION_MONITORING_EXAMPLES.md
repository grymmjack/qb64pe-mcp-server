# QB64PE Execution Monitoring Examples

This document demonstrates how to use the new execution monitoring features in the QB64PE MCP server.

## Example 1: Analyzing Program Execution Mode

```javascript
// Analyze a graphics program that will "hang"
const graphicsCode = `
SCREEN _NEWIMAGE(800, 600, 32)
DO
    WHILE _MOUSEINPUT
        IF _MOUSEBUTTON(1) THEN
            CLS , _RGB32(RND * 255, RND * 255, RND * 255)
        END IF
    WEND
    IF _KEYHIT = 27 THEN EXIT DO
    _LIMIT 60
LOOP
`;

// Result: 
// {
//   "status": "graphics_mode",
//   "hasGraphics": true,
//   "hasConsole": false,
//   "recommendation": "Graphics-only program detected. Will open window and may run indefinitely..."
//   "waitingBehavior": "wait_user_input"
// }
```

## Example 2: Console Output Parsing

```javascript
// Parse different types of console output
const outputs = [
    "Processing file 1 of 10...",           // → continue_monitoring
    "Press any key to continue...",         // → requires_user_input  
    "Program completed successfully",       // → program_completed
    "Enter your name: ",                    // → requires_user_input
    "Program finished\nExiting..."          // → program_completed
];

// Each output is analyzed for completion signals and input prompts
```

## Example 3: Cross-Platform Process Monitoring

### Windows Commands
```powershell
# Check running QB64PE processes
tasklist /FI "IMAGENAME eq qb64pe*" /FO CSV

# Get detailed process info
wmic process where "CommandLine like '%qb64pe%'" get ProcessId,WorkingSetSize

# Terminate process
taskkill /PID {pid} /F /T
```

### Linux/macOS Commands  
```bash
# Monitor processes
ps aux | grep qb64 | grep -v grep
pgrep -af qb64

# Terminate process
kill {pid}        # Graceful
kill -9 {pid}     # Force
```

## Example 4: Generated Monitoring Template

The service can wrap any QB64PE program with monitoring capabilities:

```basic
' Original simple program
PRINT "Hello, QB64PE!"
FOR i = 1 TO 5
    PRINT "Count: "; i
NEXT i
```

Becomes:

```basic
' ============================================================================
' QB64PE Execution Monitoring Template  
' Auto-generated monitoring wrapper for better execution visibility
' ============================================================================

$CONSOLE ' Enable console for logging output

' Monitoring variables
DIM LogFile AS STRING
DIM ScreenshotCounter AS INTEGER  
DIM StartTime AS DOUBLE

' Initialize monitoring
LogFile = "qb64pe-logs/execution_timestamp.log"
ScreenshotCounter = 0
StartTime = TIMER

' Monitoring SUBs for logging and screenshots
SUB LogMessage (msg AS STRING)
    ' Logs to both file and console with color formatting
END SUB

SUB TakeScreenshot
    ' Generates timestamped screenshots if graphics mode
END SUB

' ============================================================================
' ORIGINAL PROGRAM CODE (your code here)
' ============================================================================

CALL LogMessage("Starting original program code")

PRINT "Hello, QB64PE!"
FOR i = 1 TO 5
    PRINT "Count: "; i
NEXT i

CALL LogMessage("Original program code completed")
' Automatic cleanup and final reporting
```

## Example 5: Console Formatting Template

Enhanced console output for better parsing:

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

' Usage:
CALL PrintHeader("DATA PROCESSING")
CALL PrintInfo("Status", "Processing complete")
```

## Example 6: Real-Time Log Monitoring

### Windows PowerShell
```powershell
# Monitor log file in real-time
Get-Content -Path "qb64pe-logs\execution_*.log" -Wait -Tail 10

# Search for specific patterns
findstr /N "ERROR\|WARNING\|SUCCESS" "qb64pe-logs\execution_*.log"
```

### Linux/macOS  
```bash
# Monitor log file in real-time
tail -f qb64pe-logs/execution_*.log

# Search for patterns
grep -n "ERROR\|WARNING\|SUCCESS" qb64pe-logs/execution_*.log
```

## LLM Integration Recommendations

### For Graphics Programs:
1. Analyze with `analyze_qb64pe_execution_mode`
2. If `hasGraphics: true` and `hasConsole: false`:
   - Set timeout to 30-60 seconds
   - Generate monitoring template
   - Monitor process CPU usage
   - Hand over to human after timeout

### For Console Programs:
1. Generate monitoring template with enhanced formatting
2. Parse output with `parse_console_output`
3. Look for completion signals:
   - "Press any key", "END", "finished"
   - Input prompts: "Enter", "Y/N", etc.
4. Set reasonable timeouts based on program complexity

### For Mixed Programs:
1. Monitor both console output and graphics
2. Use console output to track progress
3. Allow for user interaction in graphics portion
4. Generate screenshots at key intervals

## File Structure Created

The execution service automatically creates and manages:

```
project-root/
├── qb64pe-screenshots/     # Auto-generated screenshots
│   ├── screenshot_timestamp_001.bmp
│   └── screenshot_timestamp_002.bmp
├── qb64pe-logs/            # Execution logs
│   ├── execution_timestamp.log
│   └── execution_timestamp2.log
└── .gitignore              # Updated to exclude output files
```

## Best Practices Summary

1. **Always analyze first** - Use execution mode analysis before running programs
2. **Set appropriate timeouts** - Don't wait forever for graphics programs
3. **Monitor process state** - Check CPU usage and responsiveness  
4. **Parse output intelligently** - Look for completion signals and input prompts
5. **Generate monitoring code** - Wrap programs with logging and screenshot capabilities
6. **Know when to hand over** - Let humans interact with graphics programs after timeout
