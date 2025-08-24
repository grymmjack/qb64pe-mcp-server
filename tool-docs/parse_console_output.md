# parse_console_output

Parses QB64PE console output to detect completion signals, input prompts, and execution state.

## Description

This tool analyzes console output from QB64PE programs to determine the current execution state, detect completion signals, identify input prompts, and suggest appropriate automation actions. It's essential for automated testing and monitoring of QB64PE programs.

## Parameters

- **output** (required): Console output to parse

## Usage

### Parse Program Output
```typescript
const result = await mcp_qb64pe_parse_console_output({
  output: "Starting QB64PE program...\nECHO: Program initialization complete\nProgram finished successfully."
});
```

### Parse Input Prompts
```typescript
const result = await mcp_qb64pe_parse_console_output({
  output: "Enter your name: "
});
```

### Parse Error Output
```typescript
const result = await mcp_qb64pe_parse_console_output({
  output: "Runtime error 9: Subscript out of range\nPress any key to continue..."
});
```

## Response Format

```typescript
{
  isWaitingForInput: boolean,      // Is program waiting for user input?
  isCompleted: boolean,            // Has program completed execution?
  lastActivity: string,            // Last detected activity or message
  suggestedAction: string          // Recommended automation action
}
```

## Detection Patterns

### Completion Signals
The tool detects various completion patterns:

- **"Program finished successfully"** - Normal completion
- **"Press any key to exit"** - Waiting for acknowledgment
- **"ECHO: Analysis complete"** - Custom completion signal
- **"END OF PROGRAM"** - Explicit termination marker
- **"Process finished with exit code"** - System-level completion

### Input Prompts
Common input detection patterns:

- **"Enter"** / **"Input"** - Standard input requests
- **"Press any key"** - Key press prompts
- **"Choose"** / **"Select"** - Menu selections
- **"Y/N"** / **"Yes/No"** - Boolean confirmations
- **Colon (:**) endings - Typical prompt indicators

### Error States
Error detection includes:

- **"Runtime error"** - QB64PE runtime errors
- **"Syntax error"** - Compilation errors
- **"File not found"** - I/O errors
- **"Access denied"** - Permission errors
- **"Out of memory"** - Resource errors

### Activity Indicators
Program activity detection:

- **"ECHO:"** - Custom logging output
- **"Loading"** / **"Processing"** - Operation indicators
- **"Drawing"** / **"Rendering"** - Graphics operations
- **"Connecting"** / **"Initializing"** - Setup activities

## Suggested Actions

### program_completed
```typescript
{
  isWaitingForInput: true,
  isCompleted: true,
  lastActivity: "Program finished successfully.",
  suggestedAction: "program_completed"
}
```

**When to use:** Program has finished and is waiting for final acknowledgment
**Automation response:** Send key press or terminate process

### send_input
```typescript
{
  isWaitingForInput: true,
  isCompleted: false,
  lastActivity: "Enter your name: ",
  suggestedAction: "send_input"
}
```

**When to use:** Program is actively waiting for user input
**Automation response:** Send appropriate input string

### wait_for_completion
```typescript
{
  isWaitingForInput: false,
  isCompleted: false,
  lastActivity: "Processing data...",
  suggestedAction: "wait_for_completion"
}
```

**When to use:** Program is actively running and processing
**Automation response:** Continue monitoring output

### handle_error
```typescript
{
  isWaitingForInput: true,
  isCompleted: false,
  lastActivity: "Runtime error 9: Subscript out of range",
  suggestedAction: "handle_error"
}
```

**When to use:** Program encountered an error
**Automation response:** Log error and decide on recovery action

### terminate_process
```typescript
{
  isWaitingForInput: false,
  isCompleted: true,
  lastActivity: "Fatal error occurred",
  suggestedAction: "terminate_process"
}
```

**When to use:** Program is unresponsive or critically failed
**Automation response:** Force terminate the process

## Use Cases

### Automated Testing
```typescript
async function runAutomatedTest(programOutput) {
  const parseResult = await mcp_qb64pe_parse_console_output({
    output: programOutput
  });
  
  switch (parseResult.suggestedAction) {
    case 'program_completed':
      console.log('Test completed successfully');
      return 'PASS';
      
    case 'send_input':
      console.log('Program waiting for input:', parseResult.lastActivity);
      // Send predefined test input
      return 'CONTINUE';
      
    case 'handle_error':
      console.log('Test failed with error:', parseResult.lastActivity);
      return 'FAIL';
      
    case 'wait_for_completion':
      console.log('Test still running:', parseResult.lastActivity);
      return 'RUNNING';
      
    default:
      return 'UNKNOWN';
  }
}
```

### Program Monitoring
```typescript
function monitorProgram(output) {
  const result = mcp_qb64pe_parse_console_output({ output });
  
  if (result.isCompleted) {
    console.log('Program completed:', result.lastActivity);
    // Take screenshot, save logs, cleanup
  } else if (result.isWaitingForInput) {
    console.log('Program waiting for input');
    // Send automatic response or alert user
  } else {
    console.log('Program running:', result.lastActivity);
    // Continue monitoring
  }
  
  return result;
}
```

### Input Automation
```typescript
async function automateInput(output, inputMap) {
  const result = await mcp_qb64pe_parse_console_output({ output });
  
  if (result.suggestedAction === 'send_input') {
    const prompt = result.lastActivity.toLowerCase();
    
    // Match prompts to predefined responses
    for (const [pattern, response] of Object.entries(inputMap)) {
      if (prompt.includes(pattern.toLowerCase())) {
        console.log(`Sending input '${response}' for prompt '${prompt}'`);
        return response;
      }
    }
    
    console.log('No matching input found for prompt:', prompt);
    return null;
  }
  
  return null;
}

// Example input mapping
const testInputs = {
  'enter your name': 'TestUser',
  'enter a number': '42',
  'press any key': ' ',
  'continue (y/n)': 'y'
};
```

### Error Handling
```typescript
function handleProgramError(output) {
  const result = mcp_qb64pe_parse_console_output({ output });
  
  if (result.suggestedAction === 'handle_error') {
    const error = result.lastActivity;
    
    // Categorize errors
    if (error.includes('Runtime error')) {
      const errorCode = error.match(/Runtime error (\d+)/)?.[1];
      return {
        type: 'runtime',
        code: errorCode,
        message: error,
        recoverable: true
      };
    } else if (error.includes('Syntax error')) {
      return {
        type: 'syntax',
        message: error,
        recoverable: false
      };
    } else if (error.includes('File not found')) {
      return {
        type: 'file_io',
        message: error,
        recoverable: true
      };
    }
  }
  
  return null;
}
```

## Output Analysis Examples

### Normal Program Flow
```typescript
// Input: "Starting program...\nLoading data...\nProcessing complete\nPress any key to exit"
{
  isWaitingForInput: true,
  isCompleted: true,
  lastActivity: "Press any key to exit",
  suggestedAction: "program_completed"
}
```

### Input Required
```typescript
// Input: "Welcome to the calculator\nEnter first number: "
{
  isWaitingForInput: true,
  isCompleted: false,
  lastActivity: "Enter first number: ",
  suggestedAction: "send_input"
}
```

### Error Condition
```typescript
// Input: "Runtime error 53: File not found\nPress any key to continue..."
{
  isWaitingForInput: true,
  isCompleted: false,
  lastActivity: "Runtime error 53: File not found",
  suggestedAction: "handle_error"
}
```

### Processing State
```typescript
// Input: "Rendering graphics...\nApplying filters..."
{
  isWaitingForInput: false,
  isCompleted: false,
  lastActivity: "Applying filters...",
  suggestedAction: "wait_for_completion"
}
```

## Integration with Automation

### Continuous Monitoring
```typescript
class QB64PEMonitor {
  constructor() {
    this.outputBuffer = '';
    this.lastState = null;
  }
  
  async processOutput(newOutput) {
    this.outputBuffer += newOutput;
    
    const result = await mcp_qb64pe_parse_console_output({
      output: this.outputBuffer
    });
    
    if (this.stateChanged(result)) {
      await this.handleStateChange(result);
      this.lastState = result;
    }
    
    return result;
  }
  
  stateChanged(newState) {
    return !this.lastState || 
           this.lastState.suggestedAction !== newState.suggestedAction ||
           this.lastState.isWaitingForInput !== newState.isWaitingForInput ||
           this.lastState.isCompleted !== newState.isCompleted;
  }
  
  async handleStateChange(state) {
    console.log('State changed:', state.suggestedAction);
    console.log('Last activity:', state.lastActivity);
    
    switch (state.suggestedAction) {
      case 'program_completed':
        await this.onProgramCompleted(state);
        break;
      case 'send_input':
        await this.onInputRequired(state);
        break;
      case 'handle_error':
        await this.onError(state);
        break;
    }
  }
}
```

### Timeout Management
```typescript
function createTimeoutHandler(parseFunction, timeoutMs = 30000) {
  return async function(output) {
    const result = await parseFunction(output);
    
    if (result.suggestedAction === 'wait_for_completion') {
      // Start timeout if not already running
      if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          console.log('Program timeout - no completion detected');
          this.handleTimeout();
        }, timeoutMs);
      }
    } else {
      // Clear timeout on any other action
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
    
    return result;
  };
}
```

### Response Automation
```typescript
async function automateResponse(output, responseConfig) {
  const result = await mcp_qb64pe_parse_console_output({ output });
  
  const config = responseConfig[result.suggestedAction];
  if (!config) return null;
  
  switch (result.suggestedAction) {
    case 'program_completed':
      if (config.autoAcknowledge) {
        return ' '; // Send space to acknowledge
      }
      break;
      
    case 'send_input':
      const inputPattern = Object.keys(config.inputs).find(pattern => 
        result.lastActivity.toLowerCase().includes(pattern.toLowerCase())
      );
      if (inputPattern) {
        return config.inputs[inputPattern];
      }
      break;
      
    case 'handle_error':
      if (config.autoRecover) {
        return config.recoveryInput || ' ';
      }
      break;
  }
  
  return null;
}
```

## Advanced Parsing

### Multi-line Analysis
```typescript
function parseMultilineOutput(output) {
  const lines = output.split('\n');
  const lastNonEmptyLine = lines.filter(line => line.trim()).pop();
  
  // Analyze the last meaningful line for state
  const result = mcp_qb64pe_parse_console_output({
    output: lastNonEmptyLine || output
  });
  
  // Additional context from full output
  result.lineCount = lines.length;
  result.hasErrors = output.toLowerCase().includes('error');
  result.hasEcho = output.includes('ECHO:');
  
  return result;
}
```

### Pattern Customization
```typescript
function createCustomParser(customPatterns) {
  return function(output) {
    const baseResult = mcp_qb64pe_parse_console_output({ output });
    
    // Apply custom patterns
    for (const pattern of customPatterns) {
      if (pattern.regex.test(output)) {
        baseResult.customMatch = pattern.name;
        baseResult.suggestedAction = pattern.action;
        break;
      }
    }
    
    return baseResult;
  };
}

// Example custom patterns
const gamePatterns = [
  {
    name: 'game_over',
    regex: /GAME OVER/i,
    action: 'program_completed'
  },
  {
    name: 'high_score',
    regex: /enter.*name.*high.*score/i,
    action: 'send_input'
  }
];
```

## Best Practices

1. **Parse Incrementally**: Process output as it arrives rather than waiting for completion
2. **Handle State Changes**: React to state transitions, not just current state
3. **Use Timeouts**: Set reasonable timeouts for programs that might hang
4. **Log All States**: Keep detailed logs of state changes for debugging
5. **Custom Patterns**: Add application-specific patterns for better detection
6. **Error Recovery**: Implement graceful error handling and recovery

## Troubleshooting

### False Positives
```typescript
// Filter out common false positives
function filterFalsePositives(result, output) {
  // "Enter" in the middle of a sentence shouldn't trigger input detection
  if (result.suggestedAction === 'send_input' && 
      !output.trim().endsWith(':') && 
      !output.toLowerCase().includes('press')) {
    result.isWaitingForInput = false;
    result.suggestedAction = 'wait_for_completion';
  }
  
  return result;
}
```

### Missed Patterns
```typescript
// Add additional pattern checking
function enhanceDetection(result, output) {
  const lower = output.toLowerCase();
  
  // Check for additional completion signals
  if (!result.isCompleted && (
      lower.includes('finished') || 
      lower.includes('done') || 
      lower.includes('complete'))) {
    result.isCompleted = true;
    result.suggestedAction = 'program_completed';
  }
  
  return result;
}
```

## Notes

- Output parsing is based on common QB64PE patterns and may need customization for specific programs
- The tool analyzes the most recent output to determine current state
- False positives can occur with programs that include input-like prompts in regular output
- Custom patterns can be implemented for application-specific detection needs
- Processing is designed to be fast and suitable for real-time monitoring
