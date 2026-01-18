# port_qbasic_to_qb64pe

Convert QBasic source code to QB64PE with systematic transformations and compatibility improvements.

## 📋 **Overview**

This tool provides complete automated porting of QBasic programs to QB64PE with 13+ transformation patterns including:
- Keyword case conversion (900+ keywords)
- Metacommand addition ($NoPrefix, $Resize:Smooth)
- Legacy code modernization
- Performance optimizations
- Cross-platform enhancements

## 🔧 **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceCode` | string | ✅ | QBasic source code to convert to QB64PE |
| `sourceDialect` | enum | ❌ | Source BASIC dialect (default: "qbasic") |
| `preserveComments` | boolean | ❌ | Preserve original comments (default: true) |
| `addModernFeatures` | boolean | ❌ | Add modern QB64PE features (default: true) |
| `convertGraphics` | boolean | ❌ | Convert and enhance graphics operations (default: true) |
| `optimizePerformance` | boolean | ❌ | Apply performance optimizations (default: true) |

### Source Dialects

| Dialect | Status | Description |
|---------|--------|-------------|
| `qbasic` | ✅ Fully Implemented | Standard QBasic programs |
| `gwbasic` | 🔄 Planned | GW-BASIC with line numbers |
| `quickbasic` | 🔄 Planned | QuickBASIC 4.x programs |
| `vb-dos` | 🔄 Planned | Visual BASIC for DOS |
| `applesoft` | 🔮 Future | Applesoft BASIC |
| `commodore` | 🔮 Future | Commodore BASIC |
| `amiga` | 🔮 Future | Amiga BASIC |
| `atari` | 🔮 Future | Atari BASIC |
| `vb6` | 🔬 Research | Visual BASIC 6 |
| `vbnet` | 🔬 Research | VB.NET |
| `vbscript` | 🔬 Research | VBScript |
| `freebasic` | 🤔 Consideration | FreeBASIC |

## 📤 **Returns**

```json
{
  "success": true,
  "originalLines": 1136,
  "convertedLines": 1119,
  "compatibility": "HIGH",
  "transformations": [
    "Added $NoPrefix metacommand",
    "Converted 908 keywords to Pascal Case",
    "Added modern QB64PE graphics enhancements"
  ],
  "warnings": [],
  "errors": [],
  "convertedCode": "' Enhanced QB64PE version...",
  "nextSteps": [
    "Compile with QB64PE and fix any syntax errors",
    "Test program functionality thoroughly"
  ]
}
```

## 🔄 **Transformation Patterns**

### 1. **QB64PE Metacommands**
```basic
' Added automatically:
$NoPrefix
$Resize:Smooth
Title "Program Name"
```

### 2. **Keyword Case Conversion**
```basic
' QBasic → QB64PE
PRINT "hello" → Print "hello"
FOR I = 1 TO 10 → For i = 1 To 10
DIM ARRAY(100) → Dim Array(100)
```

### 3. **DEF FN Modernization**
```basic
' QBasic
DEF FnSquare(x) = x * x

' QB64PE
Function FnSquare(x As Single) As Single
    FnSquare = x * x
End Function
```

### 4. **Graphics Enhancements**
```basic
' Adds modern features:
AllowFullScreen SquarePixels, Smooth
```

### 5. **Mathematical Constants**
```basic
' QBasic → QB64PE
pi# = 4 * ATN(1#) → pi# = Pi
```

## 💡 **Example Usage**

```javascript
{
  "sourceCode": "PRINT \"Hello World\"\\nFOR I = 1 TO 5\\n    PRINT I\\nNEXT I",
  "sourceDialect": "qbasic",
  "preserveComments": true,
  "addModernFeatures": true,
  "convertGraphics": true,
  "optimizePerformance": true
}
```

## 🎯 **Real-World Success**

### GORILLAS.BAS Porting Results
- **Source**: 1,136 lines QBasic
- **Output**: 1,119 lines QB64PE  
- **Transformations**: 13 major patterns applied
- **Keywords**: 908 successful conversions
- **Compatibility**: HIGH rating
- **Automation**: 99%+ automated

## ⚠️ **Important Notes**

- **High Success Rate**: Real-world testing achieves "HIGH" compatibility
- **Minimal Manual Work**: 99%+ automation with systematic transformations
- **Preserves Logic**: Original program structure and functionality maintained
- **Modern Enhancements**: Adds QB64PE-specific improvements
- **Compatibility Warnings**: Identifies issues requiring manual review

## 🔗 **Related Tools**

- [`analyze_qbasic_compatibility`](./analyze_qbasic_compatibility.md) - Pre-porting analysis
- [`get_porting_dialect_info`](./get_porting_dialect_info.md) - Dialect support information
- [`validate_qb64pe_compatibility`](./validate_qb64pe_compatibility.md) - Post-porting validation
