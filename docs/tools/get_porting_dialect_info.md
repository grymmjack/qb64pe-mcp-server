# get_porting_dialect_info

Gets information about supported BASIC dialects and their specific conversion rules for porting to QB64PE.

## Description

This tool provides detailed information about different BASIC dialects and their specific porting requirements to QB64PE. It includes conversion rules, compatibility notes, implementation status, and guidance for successful dialect migration.

## Parameters

- **dialect** (optional): Specific dialect to get information about
  - "qbasic" - QBasic/QuickBASIC
  - "gwbasic" - GW-BASIC (Microsoft BASIC-80)
  - "quickbasic" - Microsoft QuickBASIC
  - "vb-dos" - Visual Basic for DOS
  - "applesoft" - Applesoft BASIC (Apple II)
  - "commodore" - Commodore BASIC (C64/VIC-20)
  - "amiga" - AmigaBASIC
  - "atari" - Atari BASIC
  - "vb6" - Visual Basic 6
  - "vbnet" - Visual Basic .NET
  - "vbscript" - VBScript
  - "freebasic" - FreeBASIC
  - "all" - Information about all dialects

## Usage

### Get Information for Specific Dialect
```typescript
const info = await mcp_qb64pe_get_porting_dialect_info({
  dialect: "qbasic"
});
```

### Get Information for All Dialects
```typescript
const info = await mcp_qb64pe_get_porting_dialect_info({
  dialect: "all"
});
```

### Default Behavior (All Dialects)
```typescript
const info = await mcp_qb64pe_get_porting_dialect_info();
```

## Response Format

For a specific dialect:
```typescript
{
  dialect: string,
  implementationStatus: string,
  conversionRules: string[],
  compatibilityNotes: string[],
  commonIssues?: string[],
  examples?: object[]
}
```

For all dialects:
```typescript
{
  dialects: {
    [dialectName: string]: {
      implementationStatus: string,
      conversionRules: string[],
      compatibilityNotes: string[]
    }
  },
  summary: {
    totalDialects: number,
    fullyImplemented: number,
    partiallyImplemented: number
  }
}
```

## Supported Dialects

### QBasic/QuickBASIC
**Implementation Status**: Fully Implemented

**Conversion Rules:**
- Convert ALL CAPS keywords to Pascal Case
- Remove DECLARE statements (QB64PE auto-declares)
- Convert DEF FN to proper functions
- Convert GOSUB/RETURN to function calls
- Add QB64PE metacommands for enhanced features
- Update array syntax for dynamic arrays
- Convert timing functions (TIMER to _TIMER)

**Compatibility Notes:**
- Excellent compatibility with QB64PE
- Most programs port with minimal changes
- Modern QB64PE features enhance functionality
- Maintains original program behavior

**Example Conversion:**
```basic
' QBasic Original
DECLARE SUB MySubroutine ()
DEF FnSquare (x) = x * x

' QB64PE Conversion
' DECLARE removed (auto-declared)
FUNCTION FnSquare (x AS SINGLE) AS SINGLE
    FnSquare = x * x
END FUNCTION
```

### GW-BASIC
**Implementation Status**: Partially Implemented

**Conversion Rules:**
- Convert line numbers to labels
- Replace GOTO statements with structured control
- Convert immediate mode commands to program statements
- Update string handling syntax
- Replace cassette/disk commands with modern file I/O
- Convert graphics commands to QB64PE equivalents

**Compatibility Notes:**
- Requires significant syntax modernization
- Line numbers need manual conversion
- Some hardware-specific commands not supported
- Graphics commands need updating

### Visual Basic 6
**Implementation Status**: Limited Compatibility

**Conversion Rules:**
- Convert form-based code to console/graphics programs
- Replace Windows API calls with QB64PE equivalents
- Convert object-oriented syntax to procedural
- Update control references to direct programming
- Replace database connectivity with file I/O
- Convert event-driven code to linear execution

**Compatibility Notes:**
- GUI elements require complete redesign
- Windows-specific features need alternatives
- Object model not directly compatible
- Focus on core logic preservation

### Commodore BASIC
**Implementation Status**: Partially Implemented

**Conversion Rules:**
- Convert PETSCII characters to Unicode/ASCII
- Replace PEEK/POKE with equivalent QB64PE memory functions
- Convert color codes to QB64PE color system
- Update graphics commands for modern resolution
- Replace hardware-specific sound commands
- Convert file handling from tape/disk to modern I/O

**Compatibility Notes:**
- Hardware dependencies require significant changes
- Graphics commands need complete rewrite
- Memory management differs substantially
- Character set conversion needed

## Conversion Examples

### QBasic to QB64PE
```basic
' QBasic Original
10 CLS
20 PRINT "Hello World"
30 FOR I = 1 TO 10
40 PRINT I
50 NEXT I
60 END

' QB64PE Conversion
CLS
PRINT "Hello World"
FOR I = 1 TO 10
    PRINT I
NEXT I
END
```

### GW-BASIC to QB64PE
```basic
' GW-BASIC Original
10 SCREEN 2
20 CIRCLE (160, 100), 50
30 GOTO 10

' QB64PE Conversion
SCREEN 2
DO
    CIRCLE (160, 100), 50
    _DELAY 0.1  ' Prevent infinite loop issues
LOOP
```

### Visual Basic 6 to QB64PE
```basic
' VB6 Original
Private Sub Form_Load()
    Text1.Text = "Hello"
    MsgBox "Welcome"
End Sub

' QB64PE Conversion
PRINT "Hello"
PRINT "Welcome"
INPUT "Press Enter to continue..."; dummy$
```

## Implementation Status Levels

### Fully Implemented
- QBasic/QuickBASIC
- FreeBASIC (subset)
- Direct syntax compatibility
- Minimal conversion needed

### Partially Implemented
- GW-BASIC
- Commodore BASIC
- AmigaBASIC
- Significant conversion required
- Core functionality preserved

### Limited Compatibility
- Visual Basic 6
- Visual Basic .NET
- VBScript
- Major architectural differences
- Logic-focused conversion

### Not Implemented
- Platform-specific dialects with no conversion path
- Highly specialized BASIC variants
- Dialects requiring specific hardware

## Common Conversion Challenges

### Line Numbers
```basic
' Challenge: Converting line-numbered code
10 FOR I = 1 TO 10
20 PRINT I
30 NEXT I

' Solution: Remove line numbers, use structured programming
FOR I = 1 TO 10
    PRINT I
NEXT I
```

### GOTO/GOSUB Usage
```basic
' Challenge: Unstructured control flow
GOTO 100
...
100 PRINT "Subroutine"
RETURN

' Solution: Convert to functions/subroutines
CALL PrintMessage

SUB PrintMessage
    PRINT "Subroutine"
END SUB
```

### Hardware Dependencies
```basic
' Challenge: Hardware-specific commands
POKE 53280, 1  ' Commodore background color

' Solution: Use QB64PE equivalents
_BACKGROUNDCOLOR _RGB32(255, 255, 255)
```

## Best Practices for Porting

1. **Start with structure**: Convert control flow before syntax
2. **Preserve logic**: Maintain original program behavior
3. **Modernize gradually**: Add QB64PE features incrementally
4. **Test frequently**: Verify each conversion step
5. **Document changes**: Track modifications for debugging

## Integration with Porting Tools

### Compatibility Analysis
```typescript
// Check dialect compatibility before porting
const info = await mcp_qb64pe_get_porting_dialect_info({
  dialect: "qbasic"
});

if (info.implementationStatus === "Fully Implemented") {
  // Proceed with automated porting
  const result = await mcp_qb64pe_port_qbasic_to_qb64pe({
    sourceCode: originalCode,
    sourceDialect: "qbasic"
  });
}
```

### Porting Strategy Selection
```typescript
// Choose porting approach based on dialect info
const info = await mcp_qb64pe_get_porting_dialect_info({
  dialect: sourceDialect
});

const strategy = info.implementationStatus === "Fully Implemented" 
  ? "automated" 
  : "manual_with_assistance";
```

## Notes

- Implementation status indicates level of automated conversion support
- Conversion rules provide systematic transformation guidance
- Compatibility notes highlight important considerations for each dialect
- Some dialects may require manual intervention for complex features
- Modern QB64PE features can often enhance ported programs beyond original capabilities
