# review-qb64pe-code

Review QB64PE code for best practices, syntax issues, and optimizations with comprehensive analysis and recommendations.

## 📋 **Overview**

This prompt provides comprehensive QB64PE code review including:
- Syntax validation and error detection
- Best practices assessment
- Performance optimization suggestions
- Cross-platform compatibility analysis
- Code quality improvements
- Security and stability recommendations

## 🔧 **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | ✅ | QB64PE code to review |
| `focusAreas` | string | ❌ | Comma-separated focus areas for review |

### Focus Areas

| Area | Description |
|------|-------------|
| `syntax` | Language syntax and structure validation |
| `performance` | Optimization opportunities and efficiency |
| `best-practices` | Code quality and maintainability |
| `cross-platform` | Platform compatibility issues |
| `debugging` | Debugging and troubleshooting improvements |
| `security` | Security considerations and safe coding |
| `modern-features` | Utilization of modern QB64PE features |

## 📤 **Generated Response**

The prompt generates a comprehensive code review including:

### 1. **Syntax Analysis**
- Error detection and correction suggestions
- QB64PE-specific syntax validation
- Keyword usage verification
- Statement structure analysis

### 2. **Best Practices Assessment**
- Variable naming conventions
- Code organization and structure
- Comment quality and documentation
- Function and subroutine design

### 3. **Performance Review**
- Loop optimization opportunities
- Memory usage analysis
- Graphics rendering efficiency
- I/O operation improvements

### 4. **Compatibility Analysis**
- Cross-platform considerations
- QB64PE version compatibility
- Legacy code modernization
- Platform-specific warnings

### 5. **Security & Stability**
- Error handling adequacy
- Resource management
- Input validation
- Buffer overflow prevention

## 💡 **Example Usage**

```javascript
{
  "code": "DIM x AS INTEGER\\nFOR x = 1 TO 10\\n    PRINT x\\nNEXT x",
  "focusAreas": "syntax,performance,best-practices"
}
```

## 📊 **Review Output Format**

```markdown
# QB64PE Code Review Report

## Overall Assessment
- **Quality Score**: 8.5/10
- **Main Issues**: 2 warnings, 0 errors
- **Recommendations**: 3 improvements suggested

## Syntax Analysis
✅ **PASSED**: No syntax errors detected
⚠️ **WARNING**: Consider using explicit variable declarations

## Best Practices
✅ **GOOD**: Proper loop structure
❌ **ISSUE**: Missing program comments
🔧 **SUGGESTION**: Add descriptive variable names

## Performance
✅ **EFFICIENT**: Loop optimization good
🚀 **OPPORTUNITY**: Consider _LIMIT for frame rate control

## Cross-Platform Compatibility
✅ **COMPATIBLE**: No platform-specific issues detected

## Recommendations
1. Add program header with description
2. Use more descriptive variable names
3. Consider error handling for edge cases
```

## 🎯 **Review Categories**

### Code Quality Metrics
- **Readability**: How easy is the code to understand?
- **Maintainability**: How easy is it to modify and extend?
- **Reliability**: How robust is the error handling?
- **Efficiency**: How well does it use system resources?

### QB64PE-Specific Checks
- **Modern Features**: Usage of new QB64PE capabilities
- **Legacy Compatibility**: Proper handling of QBasic conversions
- **Graphics Optimization**: Efficient use of graphics functions
- **Console Management**: Proper $CONSOLE directive usage

### Security Assessment
- **Input Validation**: Checking user input safety
- **File Operations**: Safe file handling practices
- **Memory Management**: Proper resource cleanup
- **Error Recovery**: Graceful failure handling

## ⚠️ **Important Notes**

- **Comprehensive Analysis**: Covers all aspects of QB64PE development
- **Actionable Feedback**: Provides specific improvement suggestions
- **Learning Focused**: Educational explanations for best practices
- **Version Aware**: Considers QB64PE-specific features and limitations
- **Context Sensitive**: Adapts recommendations based on code purpose

## 🔗 **Related Prompts**

- [`debug-qb64pe-issue`](./debug-qb64pe-issue.md) - Debug specific problems
- [`monitor-qb64pe-execution`](./monitor-qb64pe-execution.md) - Execution monitoring guidance
- [`port-qbasic-to-qb64pe`](./port-qbasic-to-qb64pe.md) - QBasic porting assistance

## 🔗 **Related Tools**

- [`validate_qb64pe_syntax`](../tool-docs/validate_qb64pe_syntax.md) - Automated syntax validation
- [`validate_qb64pe_compatibility`](../tool-docs/validate_qb64pe_compatibility.md) - Compatibility checking
- [`get_qb64pe_best_practices`](../tool-docs/get_qb64pe_best_practices.md) - Best practices reference
