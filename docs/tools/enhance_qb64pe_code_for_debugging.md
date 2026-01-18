# enhance_qb64pe_code_for_debugging

Apply comprehensive debugging enhancements to QB64PE source code to address console visibility, flow control, resource management, and graphics context issues.

## 📋 **Overview**

This tool automatically enhances QB64PE code with comprehensive debugging capabilities including:
- Console management with proper $CONSOLE directives
- Flow control for automated testing
- Resource tracking and cleanup
- Graphics context management
- Auto-exit mechanisms for LLM automation

## 🔧 **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceCode` | string | ✅ | QB64PE source code to enhance |
| `config` | object | ❌ | Debugging configuration options |

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoExit` | boolean | `true` | Enable automatic exit behavior |
| `enableConsole` | boolean | `true` | Enable console management |
| `enableFlowControl` | boolean | `true` | Enable flow control for automation |
| `enableLogging` | boolean | `true` | Enable logging system |
| `enableResourceTracking` | boolean | `true` | Enable resource management |
| `enableScreenshots` | boolean | `true` | Enable screenshot system |
| `timeoutSeconds` | number | `30` | Timeout for automated operations |
| `verboseOutput` | boolean | `true` | Enable verbose debug output |

## 📤 **Returns**

Enhanced QB64PE code with:
- **Console Management**: Proper $CONSOLE:ONLY directive for shell redirection
- **Auto-Exit Logic**: Timeout-based program termination
- **Resource Tracking**: File handle and graphics context cleanup
- **Error Handling**: Comprehensive error detection and recovery
- **Logging Integration**: Built-in debug output with timestamps
- **Flow Control**: Automated execution patterns for LLM compatibility

## 💡 **Example Usage**

```javascript
{
  "sourceCode": "PRINT \"Hello\"\\nFOR i = 1 TO 10\\n    PRINT i\\nNEXT",
  "config": {
    "enableConsole": true,
    "enableLogging": true,
    "enableFlowControl": true,
    "timeoutSeconds": 30,
    "autoExit": true
  }
}
```

## 🎯 **Use Cases**

- **Automated Testing**: Prepare code for LLM-driven testing workflows
- **Debug Integration**: Add comprehensive debugging to existing programs
- **Console Compatibility**: Ensure programs work with shell redirection
- **Resource Safety**: Prevent resource leaks in automated environments
- **Timeout Handling**: Avoid infinite loops in automated testing

## ⚠️ **Important Notes**

- Uses `$CONSOLE:ONLY` for MCP compatibility
- Adds auto-exit mechanisms to prevent hanging
- Preserves original program logic while adding debugging
- Compatible with both console and graphics programs
- Includes proper error handling and cleanup

## 🔗 **Related Tools**

- [`inject_native_qb64pe_logging`](./inject_native_qb64pe_logging.md) - Add native logging functions
- [`generate_advanced_debugging_template`](./generate_advanced_debugging_template.md) - Create debugging templates
- [`parse_qb64pe_structured_output`](./parse_qb64pe_structured_output.md) - Parse enhanced output
