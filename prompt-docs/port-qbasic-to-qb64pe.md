# Port QBasic to QB64PE

## Overview
The `port-qbasic-to-qb64pe` prompt provides comprehensive guidance for porting QBasic programs to QB64PE, including analysis of compatibility issues, transformation strategies, and modernization opportunities.

## Purpose
- **Compatibility Analysis**: Identify QBasic features that need modification for QB64PE
- **Transformation Planning**: Provide step-by-step porting strategies
- **Modernization Guidance**: Suggest QB64PE enhancements and modern features
- **Error Prevention**: Identify potential issues before they occur
- **Optimization Opportunities**: Recommend performance and functionality improvements

## Arguments

### Required
- **`sourceCode`** (string): Original QBasic source code to be ported

### Optional
- **`sourceDialect`** (string): Source BASIC dialect (default: `qbasic`)
  - `qbasic`, `gwbasic`, `quickbasic`, `vb-dos`, `applesoft`, `commodore`, `amiga`, `atari`, `vb6`, `vbnet`, `vbscript`, `freebasic`
- **`targetFeatures`** (array): Desired QB64PE features to incorporate
- **`preserveCompatibility`** (boolean): Whether to maintain backward compatibility (default: true)
- **`modernizationLevel`** (string): Level of modernization - `minimal`, `moderate`, `aggressive`

### Target Features
- **`graphics`**: Enhanced graphics capabilities
- **`sound`**: Modern sound and music features
- **`networking`**: TCP/IP and HTTP capabilities
- **`filesystem`**: Advanced file operations
- **`input`**: Modern input handling (mouse, joystick)
- **`performance`**: Performance optimizations

## Usage Examples

### Basic QBasic Porting
```json
{
  "prompt": "port-qbasic-to-qb64pe",
  "sourceCode": "10 PRINT \"Hello World\"\n20 INPUT \"Enter name: \", name$\n30 PRINT \"Hello \"; name$"
}
```

### GW-BASIC to QB64PE with Modernization
```json
{
  "prompt": "port-qbasic-to-qb64pe",
  "sourceCode": "10 SCREEN 2\n20 FOR I=1 TO 100\n30 PSET (I*3,100),1\n40 NEXT I",
  "sourceDialect": "gwbasic",
  "targetFeatures": ["graphics", "performance"],
  "modernizationLevel": "moderate"
}
```

### Complex Program with Compatibility Preservation
```json
{
  "prompt": "port-qbasic-to-qb64pe",
  "sourceCode": "' Legacy business application code...",
  "preserveCompatibility": true,
  "modernizationLevel": "minimal"
}
```

## Response Structure

The prompt provides comprehensive porting guidance covering:

### 1. Compatibility Assessment
- **Compatibility Score**: Overall compatibility rating (1-10)
- **Critical Issues**: Features that require immediate attention
- **Warning Issues**: Features that may cause problems
- **Enhancement Opportunities**: Areas where QB64PE can improve the program

### 2. Code Analysis
- **Language Features**: Analysis of BASIC language constructs used
- **System Dependencies**: Platform-specific code identification
- **Legacy Constructs**: Outdated features that need updating
- **Modern Equivalents**: QB64PE alternatives for legacy features

### 3. Transformation Plan
- **Step-by-Step Process**: Ordered list of porting tasks
- **Priority Levels**: Critical, important, and optional changes
- **Testing Strategy**: How to verify porting success
- **Rollback Plan**: How to handle porting failures

### 4. Modern Enhancements
- **Performance Improvements**: QB64PE-specific optimizations
- **Feature Additions**: New capabilities to consider adding
- **Code Quality**: Modernization for better maintainability
- **Cross-Platform Considerations**: Making code work across operating systems

### 5. Implementation Guidance
- **Code Examples**: Before/after code comparisons
- **Best Practices**: QB64PE-specific coding recommendations
- **Common Pitfalls**: Issues to avoid during porting
- **Validation Techniques**: How to verify correct porting

## Related Tools

### Compatibility Analysis
- **`analyze_qbasic_compatibility`**: Pre-porting compatibility assessment
- **`validate_qb64pe_compatibility`**: Post-porting validation
- **`get_porting_dialect_info`**: Information about specific BASIC dialects

### Automated Porting
- **`port_qbasic_to_qb64pe`**: Automated porting with transformation patterns
- **`search_qb64pe_compatibility`**: Find solutions for specific compatibility issues
- **`validate_qb64pe_syntax`**: Validate ported code syntax

### Enhancement Tools
- **`enhance_qb64pe_code_for_debugging`**: Add modern debugging features
- **`inject_native_qb64pe_logging`**: Add logging capabilities
- **`get_qb64pe_best_practices`**: Modern QB64PE coding standards

## Common Porting Scenarios

### Scenario 1: Line-Numbered QBasic
```basic
' Original QBasic code
10 REM Simple calculator
20 INPUT "First number: ", a
30 INPUT "Second number: ", b
40 PRINT "Sum: "; a + b
50 END
```

**Porting Strategy:**
1. Remove line numbers (optional)
2. Modernize comments
3. Add error handling
4. Consider input validation

### Scenario 2: Graphics Program
```basic
' Original graphics code
SCREEN 13
FOR i = 1 TO 100
  PSET (RND * 320, RND * 200), RND * 255
NEXT i
```

**Porting Strategy:**
1. Update screen mode if needed
2. Use modern graphics features
3. Add proper timing
4. Consider resolution independence

### Scenario 3: File Operations
```basic
' Original file handling
OPEN "DATA.TXT" FOR INPUT AS #1
WHILE NOT EOF(1)
  INPUT #1, record$
  PRINT record$
WEND
CLOSE #1
```

**Porting Strategy:**
1. Add error handling
2. Use modern file operations
3. Consider Unicode support
4. Add path validation

## Dialect-Specific Considerations

### GW-BASIC to QB64PE
- **Line Numbers**: Usually required, can be removed
- **String Handling**: Different string manipulation functions
- **Graphics**: Limited graphics that can be enhanced
- **File Formats**: Binary file format differences

### QuickBASIC to QB64PE
- **Procedures**: Modern procedure syntax available
- **Types**: Enhanced user-defined types
- **Error Handling**: Improved error handling options
- **Modularity**: Better code organization features

### Visual Basic DOS to QB64PE
- **Forms**: No direct equivalent, need redesign
- **Controls**: Convert to console or graphics equivalents
- **Events**: Redesign event-driven code
- **APIs**: Replace Windows API calls with QB64PE equivalents

## Modernization Levels

### Minimal Modernization
- Fix syntax incompatibilities only
- Preserve original structure and logic
- Minimal code changes
- Focus on getting code to run

### Moderate Modernization
- Update to modern QB64PE features
- Improve error handling
- Add some performance optimizations
- Enhance user interface elements

### Aggressive Modernization
- Complete restructuring for QB64PE
- Add modern features throughout
- Optimize for performance and maintainability
- Redesign user interface and interaction

## Best Practices

### Pre-Porting
1. **Backup Original Code**: Always preserve the original
2. **Document Dependencies**: Note any external files or hardware dependencies
3. **Test Original**: Ensure original code works as expected
4. **Plan Testing**: Design test cases for ported version

### During Porting
1. **Port Incrementally**: Work on small sections at a time
2. **Test Frequently**: Verify each change works correctly
3. **Document Changes**: Keep track of all modifications
4. **Preserve Comments**: Maintain or improve code documentation

### Post-Porting
1. **Comprehensive Testing**: Test all functionality thoroughly
2. **Performance Comparison**: Compare performance with original
3. **Code Review**: Review for QB64PE best practices
4. **Documentation Update**: Update any external documentation

## Common Issues and Solutions

### Syntax Differences
```basic
' QBasic syntax issues and QB64PE solutions

' Issue: Variable type suffixes
DIM name AS STRING    ' QB64PE preferred
name$ = "text"       ' QBasic style (still works)

' Issue: Array declarations
DIM array(1 TO 100) AS INTEGER  ' QB64PE style
DIM array%(100)                 ' QBasic style

' Issue: Function return types
FUNCTION Calculate# (x, y)      ' QBasic
FUNCTION Calculate (x, y) AS DOUBLE  ' QB64PE
```

### Graphics Compatibility
```basic
' Graphics mode updates
SCREEN 13              ' QBasic VGA mode
_NEWIMAGE 640, 480, 32 ' Modern QB64PE alternative

' Color handling
COLOR 15, 1            ' QBasic colors
_RGB32(255, 255, 255)  ' QB64PE true color
```

### File Operations
```basic
' Traditional file handling
OPEN "file.dat" FOR RANDOM AS #1 LEN = 50

' Modern QB64PE approach
IF _FILEEXISTS("file.dat") THEN
  OPEN "file.dat" FOR BINARY AS #1
END IF
```

## Integration Examples

### With Compatibility Tools
```javascript
// 1. Analyze compatibility first
const compatibility = await mcp.call("analyze_qbasic_compatibility", {
  sourceCode: originalCode,
  sourceDialect: "qbasic"
});

// 2. Get porting guidance
const portingPlan = await mcp.call("port-qbasic-to-qb64pe", {
  sourceCode: originalCode,
  modernizationLevel: "moderate"
});

// 3. Validate ported code
const validation = await mcp.call("validate_qb64pe_syntax", {
  code: portedCode
});
```

### With Enhancement Tools
```javascript
// 1. Port the code
const ported = await mcp.call("port-qbasic-to-qb64pe", {
  sourceCode: originalCode
});

// 2. Add modern debugging
const enhanced = await mcp.call("enhance_qb64pe_code_for_debugging", {
  sourceCode: ported.modernizedCode
});

// 3. Add logging capabilities
const final = await mcp.call("inject_native_qb64pe_logging", {
  sourceCode: enhanced.enhancedCode
});
```

## Troubleshooting

### Common Porting Errors
1. **Syntax Errors**: Use QB64PE syntax validation tools
2. **Runtime Errors**: Test thoroughly with various inputs
3. **Logic Errors**: Compare behavior with original program
4. **Performance Issues**: Profile and optimize bottlenecks

### Debug Porting Issues
1. **Isolate Problems**: Test small code sections independently
2. **Compare Outputs**: Verify ported code produces same results
3. **Use Debugging Tools**: Add logging and debugging features
4. **Consult Documentation**: Reference QB64PE manual for specific features

### Validation Techniques
1. **Unit Testing**: Test individual functions and procedures
2. **Integration Testing**: Test complete program workflows
3. **Regression Testing**: Ensure changes don't break existing functionality
4. **Performance Testing**: Verify acceptable performance characteristics

---

**See Also:**
- [Debug QB64PE Issue](./debug-qb64pe-issue.md) - For troubleshooting ported code issues
- [Review QB64PE Code](./review-qb64pe-code.md) - For code quality review after porting
- [QB64PE Compatibility Documentation](../docs/COMPATIBILITY_INTEGRATION.md) - Detailed compatibility reference
