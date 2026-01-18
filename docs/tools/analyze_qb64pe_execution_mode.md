# analyze_qb64pe_execution_mode

Analyzes QB64PE source code to determine execution characteristics and monitoring requirements.

## Description

This tool examines QB64PE source code to identify the type of program, execution patterns, and provides guidance on how to monitor and handle the program's execution. It's particularly useful for automated systems that need to understand how to properly interact with different types of QB64PE programs.

## Parameters

- **sourceCode** (required): QB64PE source code to analyze

## Usage

```typescript
const result = await mcp_qb64pe_analyze_qb64pe_execution_mode({
  sourceCode: `
    SCREEN 13
    PRINT "Testing execution mode analysis"
    FOR i = 1 TO 100
      PSET (i, i), 15
    NEXT i
    SLEEP 2
  `
});
```

## Response Format

The tool returns a detailed analysis object containing:

### executionState
- **status**: Program type (graphics_mode, console_mode, mixed_mode, batch_mode)
- **hasGraphics**: Boolean indicating if program uses graphics
- **hasConsole**: Boolean indicating if program uses console output
- **screenshotDir**: Directory path for screenshot storage
- **logFile**: Path to execution log file

### guidance
- **recommendation**: Human-readable guidance for handling this program type
- **waitingBehavior**: Expected behavior (wait_user_input, auto_complete, timed_execution)
- **monitoringStrategy**: Array of monitoring recommendations
- **crossPlatformCommands**: Platform-specific commands for process monitoring
- **outputParsing**: Patterns and signals for parsing program output

## Program Types

### Graphics Mode
Programs that open graphics windows (SCREEN 1, 7, 8, 9, 10, 11, 12, 13, etc.)
- May run indefinitely waiting for user input
- Require screenshot monitoring
- Need process management for cleanup

### Console Mode  
Programs that run in text mode with console output
- Usually complete automatically
- Output can be captured via stdout
- Text-based interaction patterns

### Mixed Mode
Programs using both graphics and console
- Require dual monitoring strategies
- May switch between modes during execution

### Batch Mode
Non-interactive programs that run to completion
- Process output and exit
- Minimal monitoring required

## Example Scenarios

### Graphics Program Analysis
```typescript
const result = await mcp_qb64pe_analyze_qb64pe_execution_mode({
  sourceCode: `
    SCREEN 13
    CIRCLE (160, 100), 50, 15
    INPUT "Press Enter: ", a$
  `
});
// Returns: graphics_mode with user input waiting behavior
```

### Console Program Analysis
```typescript
const result = await mcp_qb64pe_analyze_qb64pe_execution_mode({
  sourceCode: `
    FOR i = 1 TO 10
      PRINT "Number: "; i
    NEXT i
  `
});
// Returns: console_mode with auto-complete behavior
```

## Best Practices

1. **Always analyze before execution** - Understanding the program type prevents timeout issues
2. **Use monitoring guidance** - Follow the provided monitoring strategy for each program type  
3. **Implement timeouts** - Set appropriate timeouts based on the waitingBehavior
4. **Handle graphics programs specially** - Graphics programs often require user interaction
5. **Monitor process resources** - Use provided commands to track CPU and memory usage

## Integration with Other Tools

This tool works well with:
- `enhance_qb64pe_code_for_debugging` - Add monitoring to code based on analysis
- `generate_monitoring_template` - Create templates suited for the execution mode
- `start_screenshot_monitoring` - Begin monitoring for graphics programs
- `get_process_monitoring_commands` - Get platform-specific monitoring commands

## Common Issues

- **Graphics programs hanging**: Use the provided timeout and monitoring strategies
- **Console output not captured**: Ensure proper redirection for console mode programs
- **Mixed mode complexity**: May require multiple monitoring approaches simultaneously
- **Platform differences**: Use the cross-platform commands for consistent behavior

## Notes

- Analysis is based on static code inspection and common QB64PE patterns
- Graphics programs often require manual testing due to interactive nature
- The tool provides guidance but cannot predict all runtime behaviors
- Consider user interaction requirements when automating graphics programs
