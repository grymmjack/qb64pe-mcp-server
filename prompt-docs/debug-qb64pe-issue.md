# debug-qb64pe-issue

Help debug QB64PE programs with step-by-step guidance, error analysis, and comprehensive troubleshooting assistance.

## 📋 **Overview**

This prompt provides comprehensive debugging assistance for QB64PE programs including:
- Error analysis and diagnosis
- Step-by-step debugging procedures
- Common issue identification
- Tool recommendations
- Testing strategies
- Resolution guidance

## 🔧 **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | ✅ | QB64PE code with the issue |
| `errorDescription` | string | ❌ | Description of the problem encountered |
| `expectedBehavior` | string | ❌ | What the code should do |
| `platform` | string | ❌ | Target platform (windows, macos, linux) |

## 📤 **Generated Response**

The prompt generates a comprehensive debugging guide including:

### 1. **Issue Analysis**
- Problem categorization and classification
- Error pattern recognition
- Symptom analysis and correlation
- Root cause identification

### 2. **Debugging Strategy**
- Step-by-step debugging procedure
- Tool recommendations and usage
- Testing methodology
- Verification steps

### 3. **Common Solutions**
- Known issue resolutions
- Best practice corrections
- Alternative approaches
- Optimization suggestions

### 4. **Prevention Guidance**
- Code patterns to avoid
- Defensive programming techniques
- Error handling improvements
- Quality assurance recommendations

## 💡 **Example Usage**

```javascript
{
  "code": "FOR i = 1 TO 10\\n    PRINT i\\n    IF i = 5 THEN GOTO Done\\nNEXT i\\nDone:",
  "errorDescription": "Program crashes when i equals 5",
  "expectedBehavior": "Should print numbers 1-5 and exit loop",
  "platform": "windows"
}
```

## 🔍 **Debugging Categories**

### Syntax Errors
- **Compilation Issues**: Syntax violations and language errors
- **Type Mismatches**: Variable type conflicts
- **Statement Problems**: Malformed statements and expressions
- **Declaration Issues**: Variable and function declaration problems

### Runtime Errors
- **Crash Analysis**: Program termination and system errors
- **Logic Errors**: Incorrect program behavior
- **Memory Issues**: Stack overflow and memory leaks
- **Resource Problems**: File and graphics handle management

### Performance Issues
- **Slow Execution**: Performance bottlenecks and optimization
- **Memory Usage**: Excessive memory consumption
- **Graphics Problems**: Rendering performance and efficiency
- **I/O Bottlenecks**: File and network operation delays

### Compatibility Problems
- **Platform Issues**: Cross-platform compatibility problems
- **Version Conflicts**: QB64PE version-specific issues
- **Legacy Code**: QBasic conversion problems
- **Library Dependencies**: External library integration issues

## 🛠️ **Debugging Tools Integration**

The prompt recommends and explains usage of MCP tools:

### Enhanced Debugging Tools
- **`enhance_qb64pe_code_for_debugging`**: Add comprehensive debugging capabilities
- **`inject_native_qb64pe_logging`**: Add native logging functions
- **`generate_advanced_debugging_template`**: Create debugging framework

### Analysis Tools
- **`validate_qb64pe_syntax`**: Check syntax issues
- **`validate_qb64pe_compatibility`**: Verify compatibility
- **`analyze_qb64pe_execution_mode`**: Understand execution characteristics

### Monitoring Tools
- **`parse_console_output`**: Analyze program output
- **`get_process_monitoring_commands`**: Monitor program execution
- **`generate_monitoring_template`**: Add execution monitoring

## 📊 **Debugging Output Format**

```markdown
# QB64PE Debugging Analysis

## Issue Summary
- **Problem Type**: Runtime Error
- **Severity**: High
- **Platform**: Windows
- **Likely Cause**: GOTO statement bypass

## Step-by-Step Resolution

### Step 1: Identify the Problem
The GOTO statement at line 3 jumps outside the FOR loop, causing stack corruption.

### Step 2: Apply MCP Tools
Use `enhance_qb64pe_code_for_debugging` to add proper error handling:

### Step 3: Implement Solution
Replace GOTO with structured programming:
```basic
For i = 1 To 10
    Print i
    If i = 5 Then Exit For
Next i
```

### Step 4: Verify Fix
Test the corrected code to ensure proper behavior.

## Prevention Strategies
1. Avoid GOTO statements in favor of structured programming
2. Use proper loop control (EXIT FOR, EXIT DO)
3. Add error handling and validation
```

## 🎯 **Debugging Methodology**

### Systematic Approach
1. **Reproduce**: Ensure the issue is consistently reproducible
2. **Isolate**: Narrow down the problem to specific code sections
3. **Analyze**: Use debugging tools and techniques
4. **Fix**: Implement targeted solutions
5. **Verify**: Test thoroughly to confirm resolution
6. **Document**: Record the solution for future reference

### Common QB64PE Issues
- **Console Management**: $CONSOLE directive problems
- **Graphics Context**: Screen mode and graphics handle issues
- **File Operations**: File handling and path problems
- **Memory Management**: Resource cleanup and leak prevention

## ⚠️ **Important Notes**

- **MCP Tool Integration**: Leverages available debugging tools
- **Platform Awareness**: Considers platform-specific issues
- **Best Practices**: Promotes good coding practices
- **Educational Focus**: Explains underlying concepts
- **Comprehensive Coverage**: Addresses all types of debugging scenarios

## 🔗 **Related Prompts**

- [`review-qb64pe-code`](./review-qb64pe-code.md) - Comprehensive code review
- [`monitor-qb64pe-execution`](./monitor-qb64pe-execution.md) - Execution monitoring
- [`analyze-qb64pe-graphics`](./analyze-qb64pe-graphics.md) - Graphics debugging

## 🔗 **Related Tools**

- [`enhance_qb64pe_code_for_debugging`](../tool-docs/enhance_qb64pe_code_for_debugging.md) - Add debugging capabilities
- [`get_llm_debugging_guide`](../tool-docs/get_llm_debugging_guide.md) - LLM debugging strategies
- [`get_qb64pe_debugging_best_practices`](../tool-docs/get_qb64pe_debugging_best_practices.md) - Debugging best practices
