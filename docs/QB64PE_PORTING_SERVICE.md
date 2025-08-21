# QB64PE Porting Service Documentation

## Overview

The QB64PE Porting Service provides automated conversion of BASIC programs from various dialects to QB64PE with systematic transformations and compatibility analysis.

## Implementation Status

### ✅ Fully Implemented
- **QBasic** - Complete implementation with all major transformation patterns

### 🔄 Planned (Core Framework Ready)
- **GW-BASIC** - Line number conversion, graphics updates
- **QuickBasic 4.x** - Module system updates, enhanced compatibility
- **Visual BASIC for DOS** - Form-based applications, control structures

### 🔮 Future Releases
- **Applesoft BASIC** - Apple II compatibility layer
- **Commodore BASIC** - C64/C128 specific conversions
- **AMIGA BASIC** - Amiga-specific function mapping
- **ATARI BASIC** - Atari system function updates

### 🔬 Research Phase
- **Visual Basic 6** - Complex object model conversion
- **VB.NET** - Framework-to-QB64PE mapping
- **VBScript** - Scripting environment adaptation
- **FreeBASIC** - Modern BASIC feature compatibility

## Key Features

### 1. Automated Code Transformation
- **Keyword Case Conversion**: ALL CAPS → Pascal Case
- **Metacommand Addition**: Modern QB64PE directives
- **Function Declaration Updates**: Remove unnecessary DECLARE statements
- **DEF FN Conversion**: Convert to proper Function...End Function
- **GOSUB/RETURN Elimination**: Convert to structured programming
- **Array Syntax Updates**: Modern QB64PE array operations
- **Type Declaration Modernization**: Enhanced type syntax

### 2. Compatibility Analysis
- **Pre-porting Assessment**: Identify potential issues before conversion
- **Real-time Warning System**: Alert to compatibility concerns
- **Effort Estimation**: Predict manual work required
- **Best Practice Recommendations**: Suggest modern QB64PE enhancements

### 3. Enhanced Features
- **Graphics Improvements**: Add AllowFullScreen, smooth resizing
- **Timing Optimization**: Convert to precise Timer(.001) and Delay
- **Mathematical Constants**: Use built-in Pi instead of calculations
- **Modern Exit Handling**: System 0 instead of END

## Transformation Examples

### QBasic Input:
```basic
DEFINT A-Z
DECLARE SUB Test
DEF FnRan(x) = INT(RND(1) * x) + 1
GOSUB InitVars
PRINT "Random:", FnRan(10)
END

InitVars:
  PRINT "Initializing..."
RETURN
```

### QB64PE Output:
```basic
$NoPrefix

DefInt A-Z

Function FnRan(x)
    FnRan = Int(Rnd(1) * x) + 1
End Function

Sub InitVars
    Print "Initializing..."
End Sub

InitVars
Print "Random:", FnRan(10)
System 0
```

## GORILLAS.BAS Success Case

The porting service successfully converted the complete QBasic GORILLAS.BAS game (1,136 lines) with:

- **13 Major Transformations Applied**
- **908 Keywords Converted** to Pascal Case
- **25 DECLARE Statements Removed**
- **High Compatibility Rating** (ready to compile)
- **Only 2 Warnings** (requiring minor manual review)
- **Zero Errors** in automated conversion

### Key Transformations:
1. Added $NoPrefix and $Resize:Smooth metacommands
2. Added appropriate window title
3. Converted all keywords to modern casing
4. Removed unnecessary forward declarations
5. Converted DEF FN to proper function
6. Updated GOSUB/RETURN to structured calls
7. Modernized TYPE declarations
8. Updated array syntax for PUT/GET operations
9. Converted manual pi calculation to built-in constant
10. Updated exit statements to System 0
11. Converted Rest calls to Delay commands
12. Added graphics enhancements
13. Preserved all functionality and logic

## MCP Tools Available

### 1. `port_qbasic_to_qb64pe`
**Primary conversion tool** - Performs complete automated porting

**Parameters:**
- `sourceCode`: Source BASIC code to convert
- `sourceDialect`: Target dialect (qbasic, gwbasic, etc.)
- `addModernFeatures`: Enable QB64PE enhancements (default: true)
- `preserveComments`: Maintain original documentation (default: true)
- `convertGraphics`: Apply graphics improvements (default: true)
- `optimizePerformance`: Apply performance optimizations (default: true)

**Output:**
- Complete ported code
- Detailed transformation log
- Compatibility assessment
- Warning and error reports
- Recommended next steps

### 2. `analyze_qbasic_compatibility`
**Pre-porting analysis** - Assess compatibility before conversion

**Features:**
- Code complexity analysis
- Feature detection (graphics, sound, file I/O)
- Compatibility level prediction
- Effort estimation
- Specific recommendations

### 3. `get_porting_dialect_info`
**Dialect information** - Get conversion rules for specific BASIC variants

**Provides:**
- Implementation status for each dialect
- Specific conversion rules
- Compatibility notes
- Planned features

## Best Practices

### 1. Pre-Porting Assessment
Always run `analyze_qbasic_compatibility` first to understand:
- Code complexity and size
- Potential compatibility issues
- Estimated porting effort
- Specific dialect considerations

### 2. Incremental Conversion
For large programs:
1. Start with basic functionality
2. Test core logic first
3. Add graphics enhancements
4. Apply performance optimizations
5. Add modern QB64PE features

### 3. Manual Review Required
Always manually review:
- GOSUB/RETURN conversions
- Multi-statement line splits
- Array declaration changes
- Function return type updates
- Platform-specific code

### 4. Testing Strategy
After porting:
1. Compile with QB64PE
2. Test basic functionality
3. Verify graphics operations
4. Check timing-sensitive code
5. Test file I/O operations
6. Validate user input handling

## Common Issues and Solutions

### Multi-Statement Lines
**Issue:** `IF x > 0 THEN x = 0: IF x < 0 THEN x = 1`
**Solution:** Automatic splitting into separate lines

### Array Declarations
**Issue:** `DIM arr1(10), arr2(20)`
**Solution:** Separate declarations recommended

### Function Return Types
**Issue:** `FUNCTION MyFunc AS INTEGER`
**Solution:** Convert to type sigils: `Function MyFunc%`

### GOSUB Dependencies
**Issue:** Complex label dependencies
**Solution:** Manual verification of call order

## Future Enhancements

### Planned Features
1. **Line Number Conversion** (for GW-BASIC)
2. **Module System Updates** (for QuickBasic)
3. **Form Control Mapping** (for VB-DOS)
4. **Cross-Dialect Detection** (automatic source identification)
5. **Interactive Porting Mode** (step-by-step guidance)

### Advanced Transformations
1. **Optimization Suggestions** (performance improvements)
2. **Modern Feature Integration** (QB64PE-specific enhancements)
3. **Code Structure Modernization** (improved organization)
4. **Cross-Platform Compatibility** (platform-specific adaptations)

## Integration with MCP Server

The porting service is fully integrated with the QB64PE MCP Server, providing:

- **Automated tool invocation** through MCP protocol
- **Real-time progress reporting** with transformation tracking  
- **Comprehensive error handling** with detailed diagnostics
- **Resource access** to porting documentation and examples
- **Prompt templates** for guided porting assistance

This makes it easy for LLMs to help users port BASIC programs to QB64PE with minimal manual intervention while maintaining high code quality and compatibility.
