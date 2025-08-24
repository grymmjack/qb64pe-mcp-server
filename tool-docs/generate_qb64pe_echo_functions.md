# generate_qb64pe_echo_functions

Generates ECHO helper functions for simplified console output without _DEST management, mandatory for graphics modes.

## Description

This tool generates QB64PE ECHO helper functions that provide simplified console output capabilities. These functions are **MANDATORY** for graphics modes (SCREEN 1,2,7,8,9,10,11,12,13, etc.) when you need console output to be captured by stdio redirection. The ECHO functions automatically handle console destination management, making them perfect for LLM-generated code.

## Parameters

- **config** (optional): ECHO configuration options
  - **consoleDirective**: "\\$CONSOLE" or "\\$CONSOLE:ONLY" (default: "\\$CONSOLE:ONLY")
  - **enableNativeLogging**: Enable native logging integration (default: true)
  - **enableStructuredOutput**: Enable structured output sections (default: true)
  - **logLevel**: "TRACE", "INFO", "WARN", "ERROR" (default: "INFO")

## Usage

### Basic ECHO Functions
```typescript
const functions = await mcp_qb64pe_generate_qb64pe_echo_functions();
```

### Custom Configuration
```typescript
const functions = await mcp_qb64pe_generate_qb64pe_echo_functions({
  config: {
    consoleDirective: "$CONSOLE:ONLY",
    enableNativeLogging: true,
    logLevel: "INFO"
  }
});
```

## Generated Functions

The tool generates several ECHO helper functions:

### Core ECHO Functions
```basic
SUB ECHO (message AS STRING)
SUB ECHO_INFO (message AS STRING)
SUB ECHO_ERROR (message AS STRING)
SUB ECHO_WARN (message AS STRING)
SUB ECHO_DEBUG (message AS STRING)
```

### Usage in QB64PE Code
```basic
' Graphics mode - ECHO functions are MANDATORY
SCREEN 13
CALL ECHO("Initializing graphics mode...")
CALL ECHO_INFO("Graphics mode set to 320x200x256")

' Your graphics code here
CIRCLE (160, 100), 50, 15

CALL ECHO("Rendering complete")
```

## Critical Graphics Mode Requirements

### ⚠️ MANDATORY for Graphics Modes
In ANY graphics screen mode, you **MUST** use ECHO functions instead of PRINT or _PRINTSTRING:

```basic
' ❌ WRONG - Will not be captured in graphics mode
SCREEN 13
PRINT "This won't appear in stdio output"

' ✅ CORRECT - Will be captured properly
SCREEN 13
CALL ECHO("This will appear in stdio output")
```

### Graphics Modes Requiring ECHO
- SCREEN 1 (CGA 4-color)
- SCREEN 2 (CGA monochrome)
- SCREEN 7 (EGA 16-color)
- SCREEN 8 (EGA 16-color)
- SCREEN 9 (EGA/VGA 16-color)
- SCREEN 10 (EGA/VGA monochrome)
- SCREEN 11 (VGA 2-color)
- SCREEN 12 (VGA 16-color)
- SCREEN 13 (VGA 256-color)
- _NEWIMAGE modes with color depth > 0

## Function Categories

### Basic Output
```basic
CALL ECHO("Basic message")
```
- Simple console output
- Automatically handles destination management
- Works in all screen modes

### Informational Messages
```basic
CALL ECHO_INFO("Starting process...")
```
- Prefixed with `[INFO]`
- Used for status updates
- Colored output when supported

### Error Messages
```basic
CALL ECHO_ERROR("File not found: " + filename$)
```
- Prefixed with `[ERROR]`
- Used for error reporting
- Red colored output when supported

### Warning Messages
```basic
CALL ECHO_WARN("Memory usage is high")
```
- Prefixed with `[WARN]`
- Used for warnings
- Yellow colored output when supported

### Debug Messages
```basic
CALL ECHO_DEBUG("Variable value: " + STR$(myVar))
```
- Prefixed with `[DEBUG]`
- Used for debugging information
- Only shown when debug level is enabled

## Technical Implementation

### Automatic Destination Management
```basic
SUB ECHO (message AS STRING)
    DIM currentDest AS LONG
    currentDest = _DEST
    _DEST _CONSOLE
    PRINT message
    _DEST currentDest
END SUB
```

The functions automatically:
1. Store the current _DEST value
2. Switch to _CONSOLE for output
3. Print the message with appropriate formatting
4. Restore the original _DEST

### Console Directive Integration
The functions work with console directives:
- **\\$CONSOLE**: Enables console alongside graphics
- **\\$CONSOLE:ONLY**: Console-only mode for better stdio capture

## Integration with Other Tools

### With Native Logging
```basic
' ECHO functions integrate with native logging
$CONSOLE:ONLY
' ... ECHO functions here ...
CALL ECHO_INFO("This appears in both console and log file")
```

### With Enhanced Debugging
```basic
' Use in debugging templates
CALL ECHO("=== DEBUGGING SESSION START ===")
CALL ECHO_INFO("Program: " + PROGRAM_NAME$)
CALL ECHO_DEBUG("Debug mode enabled")
```

### With Monitoring Templates
```basic
' Perfect for monitored execution
CALL ECHO("=== PROGRAM EXECUTION START ===")
' ... your program code ...
CALL ECHO("=== PROGRAM EXECUTION END ===")
```

## Best Practices

1. **Always use in graphics modes**: Essential for stdio capture
2. **Choose appropriate categories**: INFO for status, ERROR for errors, etc.
3. **Keep messages concise**: Better for automated parsing
4. **Use consistent formatting**: Helps with log analysis
5. **Include context**: Add relevant variable values or state information

## Common Usage Patterns

### Program Initialization
```basic
SCREEN 13
CALL ECHO("=== GRAPHICS PROGRAM STARTED ===")
CALL ECHO_INFO("Screen mode: 320x200x256")
CALL ECHO_INFO("Color depth: 8-bit")
```

### Error Handling
```basic
ON ERROR GOTO ErrorHandler
' ... program code ...

ErrorHandler:
CALL ECHO_ERROR("Runtime error " + STR$(ERR) + " at line " + STR$(_ERRORLINE))
RESUME NEXT
```

### Progress Tracking
```basic
FOR i = 1 TO 100
    ' Process data...
    IF i MOD 10 = 0 THEN
        CALL ECHO_INFO("Progress: " + STR$(i) + "%")
    END IF
NEXT i
```

### Debugging Output
```basic
CALL ECHO_DEBUG("Entering main loop")
CALL ECHO_DEBUG("Counter value: " + STR$(counter))
CALL ECHO_DEBUG("Exiting main loop")
```

## Platform Considerations

### Windows
- Full color support in console windows
- Works with PowerShell and Command Prompt
- Compatible with stdio redirection

### Linux
- Color support in most terminals
- Works with bash and other shells
- Full stdio compatibility

### macOS
- Color support varies by terminal
- Works with Terminal.app and other applications
- Compatible with shell redirection

## Performance Impact

- **Minimal overhead**: Simple destination switching
- **No file I/O**: Direct console output only
- **Efficient implementation**: No string processing overhead
- **Graphics compatible**: No performance impact on graphics rendering

## Troubleshooting

### Console Output Not Appearing
- Ensure you're using ECHO functions in graphics modes
- Check that \\$CONSOLE directive is present
- Verify stdio redirection is working

### Color Not Displaying
- Some terminals don't support color codes
- Use `$CONSOLE:ONLY` for better compatibility
- Test in different terminal environments

### Graphics Mode Issues
- ECHO functions are required for stdio capture
- PRINT statements won't appear in redirected output
- Use _DEST management manually only if necessary

## Notes

- These are QB64PE subroutines, not shell echo commands
- Functions work within your QB64PE program execution
- Essential for LLM-generated code in graphics modes
- Automatically included when using enhanced debugging tools
- Compatible with all QB64PE screen modes and _NEWIMAGE
- Provides consistent output format for automated parsing
