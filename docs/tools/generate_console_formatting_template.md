# generate_console_formatting_template

Generates QB64PE templates with enhanced console output formatting for better terminal parsing.

## Description

This tool creates a QB64PE code template that provides enhanced console output formatting capabilities. The template includes functions for headers, tables, colored output, and structured information display, making console output more readable for both humans and automated parsing systems.

## Parameters

This tool takes no parameters and generates a standard template.

## Usage

```typescript
const template = await mcp_qb64pe_generate_console_formatting_template();
```

## Generated Template Features

The template includes several formatting helper subroutines:

### PrintHeader(title AS STRING)
Creates formatted headers with colored backgrounds:
```basic
CALL PrintHeader("QB64PE PROGRAM OUTPUT")
```
Output:
```
============================================================
  QB64PE PROGRAM OUTPUT
============================================================
```

### PrintInfo(label AS STRING, value AS STRING)  
Displays labeled information in a consistent format:
```basic
CALL PrintInfo("Version", "QB64PE v3.14.1")
CALL PrintInfo("Platform", _OS$)
```
Output:
```
[INFO]      Version: QB64PE v3.14.1
[INFO]     Platform: WINDOWS
```

### PrintSuccess(message AS STRING)
Displays success messages in green:
```basic
CALL PrintSuccess("Program completed successfully!")
```

### PrintError(message AS STRING)
Displays error messages in red:
```basic
CALL PrintError("File not found: data.txt")
```

### PrintTable(headers(), data(), rows, cols)
Creates formatted tables with headers and data:
```basic
DIM headers(2) AS STRING
DIM data(5) AS STRING
headers(0) = "Name"
headers(1) = "Score" 
headers(2) = "Grade"
data(0) = "Alice": data(1) = "95": data(2) = "A"
data(3) = "Bob": data(4) = "87": data(5) = "B"
CALL PrintTable(headers(), data(), 2, 3)
```

## Color Constants

The template defines color constants for consistent formatting:

```basic
CONST HEADER_COLOR = 15  ' White
CONST HEADER_BG = 1      ' Blue  
CONST INFO_COLOR = 14    ' Yellow
CONST SUCCESS_COLOR = 10 ' Green
CONST ERROR_COLOR = 12   ' Red
CONST NORMAL_COLOR = 7   ' Light gray
CONST NORMAL_BG = 0      ' Black
```

## Console Destination Management

All formatting functions properly handle console destination:
- Automatically switches to `_CONSOLE` for output
- Restores previous destination after printing
- Works with both graphics and console modes

## Example Usage in Your Program

```basic
' Include the generated template, then use it like this:

CALL PrintHeader("DATA PROCESSING RESULTS")
CALL PrintInfo("Input File", "data.csv")
CALL PrintInfo("Records", STR$(recordCount))

' Process your data...

IF errorCount = 0 THEN
    CALL PrintSuccess("All records processed successfully")
ELSE
    CALL PrintError("Found " + STR$(errorCount) + " errors")
END IF

' Display results table
DIM headers(2) AS STRING
DIM results(5) AS STRING
headers(0) = "Item"
headers(1) = "Count"
headers(2) = "Status"
' ... populate data ...
CALL PrintTable(headers(), results(), 2, 3)
```

## Benefits for Automated Systems

1. **Consistent Formatting**: Predictable output structure for parsing
2. **Clear Delimiters**: Easy to identify sections and data
3. **Color Coding**: Visual distinction between message types
4. **Table Support**: Structured data presentation
5. **Label-Value Pairs**: Machine-readable information format

## Integration with Other Tools

### With Logging Services
```basic
' Combine with native logging
CALL PrintInfo("Log Level", "INFO")
_LOGINFO "Processing started"
CALL PrintHeader("PROCESSING RESULTS")
```

### With Monitoring Templates
```basic
' Include in monitoring workflows
CALL PrintHeader("EXECUTION MONITORING")
CALL PrintInfo("Start Time", TIME$)
' ... your program logic ...
CALL PrintInfo("End Time", TIME$)
CALL PrintSuccess("Monitoring complete")
```

### With Error Handling
```basic
ON ERROR GOTO ErrorHandler
' ... program logic ...
CALL PrintSuccess("Program completed")
END

ErrorHandler:
CALL PrintError("Runtime error: " + STR$(ERR))
RESUME NEXT
```

## Customization

You can modify the template by:

1. **Changing colors**: Adjust the color constants
2. **Modifying column widths**: Change `colWidth` in PrintTable
3. **Adding new formatters**: Create additional SUBs
4. **Adjusting spacing**: Modify the formatting strings

Example customization:
```basic
SUB PrintWarning (message AS STRING)
    _DEST _CONSOLE
    COLOR 14, 0  ' Yellow on black
    PRINT "[WARNING] " + message
    COLOR NORMAL_COLOR, NORMAL_BG
    _DEST 0
END SUB
```

## Best Practices

1. **Use consistent labeling**: Keep info labels to 12 characters or less
2. **Structure your output**: Use headers to separate sections
3. **Handle long data**: Truncate or wrap long values appropriately
4. **Color accessibility**: Don't rely solely on color for information
5. **Test across platforms**: Verify color support on target systems

## Platform Considerations

- **Windows**: Full color support in console
- **Linux**: Colors work in most terminals
- **macOS**: Color support varies by terminal application
- **Console redirection**: Colors may not appear in redirected output

## Notes

- The template uses `$CONSOLE` directive for console access
- All formatting preserves the graphics destination if in graphics mode
- Colors are ANSI-compatible where supported
- Table formatting is fixed-width for consistent alignment
- Template is designed for both interactive and automated use
