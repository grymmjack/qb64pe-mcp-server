# Monitor QB64PE Execution

## Overview
The `monitor-qb64pe-execution` prompt provides comprehensive guidance for monitoring QB64PE program execution, including timeout strategies specifically designed for LLM interactions and automated systems.

## Purpose
- **Execution Analysis**: Determine program type (graphics, console, mixed) and expected behavior
- **Timeout Management**: LLM-specific timeout recommendations based on program complexity
- **Process Monitoring**: Strategy for tracking program execution and state
- **Output Parsing**: Guidelines for capturing and interpreting program output
- **Automation Strategy**: When to use automated monitoring vs human intervention

## Arguments

### Required
- **`sourceCode`** (string): QB64PE source code to analyze for execution characteristics

### Optional
- **`expectedBehavior`** (string): Description of expected program behavior
- **`platform`** (string): Target platform - `windows`, `macos`, `linux`

## Usage Examples

### Basic Execution Monitoring
```json
{
  "prompt": "monitor-qb64pe-execution",
  "sourceCode": "PRINT \"Hello World\"\nINPUT \"Press Enter\"; dummy$"
}
```

### Graphics Program Monitoring
```json
{
  "prompt": "monitor-qb64pe-execution",
  "sourceCode": "SCREEN 13\nCIRCLE (160, 100), 50, 12\nSLEEP 5",
  "expectedBehavior": "Should display a red circle and wait 5 seconds",
  "platform": "windows"
}
```

### Complex Interactive Program
```json
{
  "prompt": "monitor-qb64pe-execution",
  "sourceCode": "DO\n  INPUT \"Enter command: \", cmd$\n  IF cmd$ = \"quit\" THEN EXIT DO\n  PRINT \"Processing: \"; cmd$\nLOOP",
  "expectedBehavior": "Interactive command loop until 'quit' entered"
}
```

## Response Structure

The prompt provides structured guidance covering:

### 1. Program Analysis
- **Execution Mode**: Console, Graphics, or Mixed
- **Interaction Level**: None, Simple Input, Complex Interactive
- **Expected Runtime**: Short (<10s), Medium (10s-2min), Long (>2min), Indefinite
- **Platform Considerations**: OS-specific behaviors and requirements

### 2. LLM Timeout Recommendations
- **Minimum Timeout**: Based on program complexity
- **Maximum Timeout**: Safe upper bounds for automated systems
- **Timeout Strategy**: Progressive timeouts or fixed limits
- **Fallback Actions**: What to do when timeouts occur

### 3. Monitoring Strategy
- **Process Tracking**: How to monitor the QB64PE process
- **Output Capture**: Console redirection and logging techniques
- **Screenshot Capture**: For graphics programs requiring visual verification
- **Status Detection**: Identifying completion, errors, or hang states

### 4. Console Output Parsing
- **Expected Patterns**: What output to expect and how to parse it
- **Completion Signals**: How to detect program completion
- **Error Detection**: Identifying runtime errors and crashes
- **Input Prompts**: Recognizing when program expects user input

### 5. Automation Guidelines
- **Automated Execution**: When and how to run programs automatically
- **Human Handover**: When to escalate to human interaction
- **Retry Logic**: How to handle failed executions
- **Resource Management**: Memory and process cleanup

## Related Tools

### Execution Enhancement
- **`enhance_qb64pe_code_for_debugging`**: Add monitoring capabilities to source code
- **`inject_native_qb64pe_logging`**: Add structured logging for better output parsing
- **`generate_advanced_debugging_template`**: Create monitoring-ready program templates

### Output Analysis
- **`parse_qb64pe_structured_output`**: Parse enhanced program output
- **`parse_console_output`**: Parse standard QB64PE console output
- **`get_execution_monitoring_guidance`**: Get detailed monitoring best practices

### Process Management
- **`get_qb64pe_processes`**: List currently running QB64PE processes
- **`capture_qb64pe_screenshot`**: Capture screenshots of graphics programs
- **`analyze_qb64pe_graphics_screenshot`**: Analyze program visual output

## Best Practices

### For LLM Systems
1. **Start Conservative**: Use shorter timeouts initially and extend as needed
2. **Layer Monitoring**: Combine process, output, and visual monitoring
3. **Plan Fallbacks**: Always have timeout and error handling strategies
4. **Log Everything**: Capture all output for post-execution analysis

### For Graphics Programs
1. **Use Screenshots**: Visual verification is essential for graphics programs
2. **Implement Timeouts**: Graphics programs can easily hang or loop indefinitely
3. **Monitor Resources**: Track memory and CPU usage for performance issues
4. **Test Scaling**: Graphics behavior can vary by screen resolution and hardware

### For Interactive Programs
1. **Detect Input Prompts**: Recognize when programs expect user input
2. **Provide Default Inputs**: Have fallback responses for common prompts
3. **Implement Escape Sequences**: Always provide ways to exit interactive loops
4. **Monitor State Changes**: Track program state through output patterns

## Example Scenarios

### Scenario 1: Simple Console Program
```basic
' Program that prints and exits
PRINT "Processing data..."
FOR i = 1 TO 1000
  ' Some processing
NEXT i
PRINT "Complete!"
```
**Monitoring Strategy**: 30-second timeout, capture stdout, look for "Complete!" signal

### Scenario 2: Graphics Demo
```basic
' Graphics program with animation
SCREEN 13
FOR i = 1 TO 100
  CLS
  CIRCLE (i * 3, 100), 10, i MOD 16
  _DELAY 0.1
NEXT i
```
**Monitoring Strategy**: 15-second timeout, screenshot capture, process monitoring

### Scenario 3: Interactive Tool
```basic
' Interactive calculator
DO
  INPUT "Enter expression (or 'quit'): ", expr$
  IF expr$ = "quit" THEN EXIT DO
  ' Calculate and display result
LOOP
```
**Monitoring Strategy**: Detect input prompts, provide automated inputs, 5-minute max runtime

## Integration Examples

### With MCP Tools
```javascript
// 1. Analyze execution requirements
const analysis = await mcp.call("monitor-qb64pe-execution", {
  sourceCode: myProgram,
  platform: "windows"
});

// 2. Enhance code for monitoring
const enhanced = await mcp.call("enhance_qb64pe_code_for_debugging", {
  sourceCode: myProgram,
  config: { enableLogging: true, timeoutSeconds: analysis.recommendedTimeout }
});

// 3. Execute with monitoring
// ... run enhanced program with appropriate timeouts
```

### With Process Monitoring
```bash
# Windows PowerShell monitoring
$timeout = 30
$process = Start-Process -FilePath "program.exe" -PassThru
$completed = $process.WaitForExit($timeout * 1000)
if (-not $completed) {
  $process.Kill()
  Write-Host "Program timed out after $timeout seconds"
}
```

## Troubleshooting

### Common Issues
1. **Program Hangs**: Implement proper timeouts and process termination
2. **No Output**: Check for buffering issues or silent execution
3. **Unexpected Input**: Prepare for prompts not mentioned in source code
4. **Graphics Not Visible**: Use screenshot capture for headless environments

### Debug Techniques
1. **Enhanced Logging**: Use debugging enhancement tools
2. **Step-by-Step Execution**: Break complex programs into smaller parts
3. **Output Analysis**: Examine all stdout/stderr for clues
4. **Process Inspection**: Monitor CPU, memory, and I/O usage

---

**See Also:**
- [Debug QB64PE Issue](./debug-qb64pe-issue.md) - For troubleshooting specific problems
- [Analyze QB64PE Graphics](./analyze-qb64pe-graphics.md) - For graphics program analysis
- [QB64PE Execution Monitoring Guide](../docs/QB64PE_EXECUTION_MONITORING.md) - Detailed technical guide
