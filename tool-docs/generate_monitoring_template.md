# generate_monitoring_template

Generates QB64PE code templates with built-in logging, screenshots, and execution monitoring.

## Description

This tool wraps existing QB64PE source code with comprehensive monitoring capabilities including file logging, console output formatting, screenshot capture, execution timing, and cleanup procedures. It's designed to provide visibility into program execution for debugging and analysis purposes.

## Parameters

- **originalCode** (required): QB64PE source code to wrap with monitoring capabilities

## Usage

```typescript
const template = await mcp_qb64pe_generate_monitoring_template({
  originalCode: `
    PRINT "Hello World"
    FOR i = 1 TO 10
        PRINT "Number: "; i
    NEXT i
  `
});
```

## Generated Template Features

### File Logging System
- **Log File Creation**: Automatically creates timestamped log files
- **Structured Logging**: Logs program start, execution events, and completion
- **Error Tracking**: Captures runtime errors and exceptions
- **Timing Information**: Records execution duration and timestamps

Example log output:
```
=== QB64PE Program Started at 08-24-2025 19:12:17 ===
Platform: WINDOWS
Screen Mode: 80x25
19:12:17 - Starting original program code
19:12:17 - Original program code completed
19:12:17 - Program completed. Runtime: 0.015 seconds
```

### Screenshot Management
- **Automatic Screenshots**: Takes screenshots at key points
- **Graphics Mode Detection**: Only captures when in graphics mode
- **Timestamped Files**: Screenshots include execution timestamp
- **Sequential Numbering**: Multiple screenshots are numbered sequentially

Screenshot filenames:
```
screenshot_2025-08-24T19-12-17-613Z_001.bmp
screenshot_2025-08-24T19-12-17-613Z_002.bmp
```

### Console Output Formatting
- **Colored Headers**: Visual separation of monitoring information
- **Status Messages**: Clear indication of execution phases
- **Runtime Statistics**: Display of execution time and resource usage
- **Log File References**: Shows where detailed logs are saved

Console output example:
```
============================================================
  QB64PE PROGRAM EXECUTION MONITOR
  Started: 08-24-2025 19:12:17
  Log: execution_2025-08-24T19-12-17-613Z.log
============================================================
[LOG] 19:12:17 - Starting original program code
Hello World
Number: 1
Number: 2
...
[LOG] 19:12:17 - Original program code completed
------------------------------------------------------------
EXECUTION COMPLETED - Runtime: 0.015s
Check log file: execution_2025-08-24T19-12-17-613Z.log
------------------------------------------------------------
```

## Template Structure

The generated template includes:

### 1. Initialization Section
```basic
$CONSOLE ' Enable console for logging output
DIM LogFile AS STRING
DIM ScreenshotCounter AS INTEGER
DIM StartTime AS DOUBLE
```

### 2. Monitoring Subroutines
- **LogMessage(msg AS STRING)**: Logs to file and console
- **TakeScreenshot**: Captures graphics screen when appropriate
- **MonitoringCleanup**: Finalizes logging and displays summary

### 3. Original Code Integration
Your original code is inserted between monitoring setup and cleanup:
```basic
' ============================================================================
' ORIGINAL PROGRAM CODE BEGINS HERE
' ============================================================================

' Your original code here...

' ============================================================================
' MONITORING CLEANUP
' ============================================================================
```

### 4. Cleanup and Exit
- Final logging and statistics
- Screenshot capture if graphics were used
- User prompt before exit

## File Output Locations

### Log Files
- **Directory**: `qb64pe-logs/`
- **Format**: `execution_YYYY-MM-DDTHH-MM-SS-SSSZ.log`
- **Content**: Timestamped execution events and statistics

### Screenshots  
- **Directory**: `qb64pe-screenshots/`
- **Format**: `screenshot_YYYY-MM-DDTHH-MM-SS-SSSZ_NNN.bmp`
- **Numbering**: Sequential counter for multiple screenshots

## Use Cases

### Debugging Programs
```typescript
const template = await mcp_qb64pe_generate_monitoring_template({
  originalCode: `
    SCREEN 13
    FOR i = 1 TO 100
        PSET (i, i), 15
    NEXT i
    SLEEP 2
  `
});
// Results in monitored graphics program with screenshots
```

### Analyzing Console Programs
```typescript
const template = await mcp_qb64pe_generate_monitoring_template({
  originalCode: `
    FOR i = 1 TO 1000
        PRINT "Processing record "; i
    NEXT i
  `
});
// Results in monitored console program with timing
```

### Error Detection
```typescript
const template = await mcp_qb64pe_generate_monitoring_template({
  originalCode: `
    OPEN "nonexistent.dat" FOR INPUT AS #1
    INPUT #1, data$
    CLOSE #1
  `
});
// Results in monitored program that logs errors
```

## Integration with Other Tools

### With Execution Analysis
```typescript
// Generate monitored code
const template = await mcp_qb64pe_generate_monitoring_template({
  originalCode: sourceCode
});

// Analyze execution characteristics  
const analysis = await mcp_qb64pe_analyze_qb64pe_execution_mode({
  sourceCode: template
});
```

### With Enhanced Debugging
```typescript
// First add monitoring
const monitored = await mcp_qb64pe_generate_monitoring_template({
  originalCode: sourceCode
});

// Then add debugging enhancements
const enhanced = await mcp_qb64pe_enhance_qb64pe_code_for_debugging({
  sourceCode: monitored
});
```

### With Screenshot Analysis
```typescript
// Run monitored program (creates screenshots)
// Then analyze captured screenshots
const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
  screenshotPath: "qb64pe-screenshots/screenshot_..._001.bmp"
});
```

## Customization Options

### Logging Levels
Modify the LogMessage SUB to support different log levels:
```basic
SUB LogMessage (level AS STRING, msg AS STRING)
    OPEN LogFile FOR APPEND AS #99
    PRINT #99, TIME$ + " [" + level + "] " + msg
    CLOSE #99
END SUB
```

### Screenshot Triggers
Add custom screenshot calls at specific points:
```basic
' Take screenshot before critical operation
CALL LogMessage("Starting critical calculation")
CALL TakeScreenshot
' ... critical code ...
CALL TakeScreenshot
CALL LogMessage("Critical calculation completed")
```

### Performance Monitoring
Add memory and CPU tracking:
```basic
SUB LogPerformance
    CALL LogMessage("Memory usage: " + STR$(_MEMGET(m_lock, m_block, LONG)))
    ' Add more performance metrics as needed
END SUB
```

## Best Practices

1. **Use for debugging**: Ideal for troubleshooting problematic programs
2. **Monitor long-running programs**: Track progress and performance
3. **Capture visual output**: Essential for graphics program analysis
4. **Preserve original logic**: Template doesn't modify program behavior
5. **Clean up resources**: Template handles proper file closure and cleanup

## Performance Considerations

- **File I/O overhead**: Logging adds small performance cost
- **Screenshot impact**: Graphics screenshots may cause brief pauses
- **Console output**: Colored output may slow execution slightly
- **Memory usage**: Minimal additional memory requirements

## Troubleshooting

### Log File Issues
- Ensure `qb64pe-logs/` directory exists
- Check file permissions for write access
- Verify disk space availability

### Screenshot Problems  
- Screenshots only work in graphics modes (SCREEN 1, 7, 8, 9, 10, 11, 12, 13)
- Ensure `qb64pe-screenshots/` directory exists
- Check file format support (.bmp is most reliable)

### Console Output Issues
- Some terminals may not support all colors
- Redirected output may lose color formatting
- Console may need to be enabled manually in some cases

## Notes

- Template preserves all original program functionality
- Monitoring adds minimal overhead to execution
- Screenshots are only taken in graphics modes
- Log files provide detailed execution timeline
- Template is cross-platform compatible
- Cleanup ensures proper resource management
