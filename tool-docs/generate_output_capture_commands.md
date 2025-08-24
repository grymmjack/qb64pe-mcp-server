# generate_output_capture_commands

**Category**: Output Monitoring & Automation  
**Description**: Generate cross-platform commands for capturing and monitoring QB64PE program output  
**Type**: Command Generation Tool  

## Overview

The `generate_output_capture_commands` tool creates platform-specific shell commands for capturing, monitoring, and redirecting QB64PE program output. This tool is essential for automated testing, continuous integration, debugging workflows, and LLM-assisted development where programmatic access to QB64PE execution output is required.

The tool generates commands that work across Windows (PowerShell/CMD), macOS, and Linux environments, providing solutions for real-time monitoring, file output capture, timeout handling, and process management. It supports both console and graphics mode programs, with special considerations for programs enhanced with native logging and ECHO functions.

## Purpose

This tool serves multiple critical functions in QB64PE development automation:

- **Output Capture**: Generate commands to capture program output to files
- **Real-time Monitoring**: Create commands for live output monitoring
- **Cross-Platform Support**: Provide platform-specific command variants
- **Timeout Management**: Include timeout and process control mechanisms
- **Integration Ready**: Generate commands suitable for CI/CD and automation

## Parameters

### Required Parameters

**programPath** (string)  
Path to the QB64PE executable program to monitor. Can be:
- Absolute path to compiled .exe file
- Relative path from working directory
- Program name if in system PATH
- Path to .bas source file (with qb64pe compiler path)

### Optional Parameters

**outputPath** (string, default: "analysis_output.txt")  
Path for the output file where captured output will be saved. Supports:
- Absolute paths with directory creation
- Relative paths from working directory
- Filename-only (uses current directory)
- Special variables like timestamp insertion

**includeMonitoring** (boolean, default: true)  
Include real-time monitoring commands alongside capture commands. When enabled:
- Generates commands for live output viewing
- Includes process monitoring utilities
- Provides status checking commands
- Adds resource usage monitoring

## Response Structure

The tool returns comprehensive command sets for different platforms and scenarios:

```json
{
  "platform": "windows",
  "programPath": "C:\\Projects\\graphics-demo.exe",
  "outputPath": "analysis_output.txt",
  "commands": {
    "capture": {
      "powershell": "& 'C:\\Projects\\graphics-demo.exe' > analysis_output.txt 2>&1",
      "cmd": "\"C:\\Projects\\graphics-demo.exe\" > analysis_output.txt 2>&1",
      "withTimeout": "timeout /t 30 \"C:\\Projects\\graphics-demo.exe\" > analysis_output.txt 2>&1"
    },
    "monitoring": {
      "realTime": "Get-Content analysis_output.txt -Wait -Tail 10",
      "processStatus": "Get-Process -Name graphics-demo -ErrorAction SilentlyContinue",
      "resourceUsage": "Get-Process -Name graphics-demo | Select-Object CPU, WorkingSet, PagedMemorySize"
    },
    "advanced": {
      "backgroundCapture": "Start-Process -FilePath 'C:\\Projects\\graphics-demo.exe' -RedirectStandardOutput analysis_output.txt -RedirectStandardError error_output.txt -NoNewWindow",
      "withLogging": "& 'C:\\Projects\\graphics-demo.exe' | Tee-Object -FilePath analysis_output.txt",
      "timestampedCapture": "$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'; & 'C:\\Projects\\graphics-demo.exe' > \"output_$timestamp.txt\" 2>&1"
    }
  },
  "crossPlatform": {
    "linux": {
      "capture": "./graphics-demo > analysis_output.txt 2>&1",
      "withTimeout": "timeout 30s ./graphics-demo > analysis_output.txt 2>&1",
      "monitoring": "tail -f analysis_output.txt",
      "processCheck": "pgrep -f graphics-demo"
    },
    "macos": {
      "capture": "./graphics-demo > analysis_output.txt 2>&1",
      "withTimeout": "gtimeout 30s ./graphics-demo > analysis_output.txt 2>&1",
      "monitoring": "tail -f analysis_output.txt",
      "processCheck": "pgrep -f graphics-demo"
    }
  },
  "usage": {
    "basic": "Execute capture command and monitor output file",
    "automated": "Use background capture for CI/CD integration",
    "debugging": "Combine real-time monitoring with timestamped logs",
    "testing": "Use timeout commands for automated test execution"
  },
  "examples": [
    {
      "scenario": "Basic output capture",
      "command": "& 'C:\\Projects\\graphics-demo.exe' > analysis_output.txt 2>&1",
      "description": "Capture all output to file"
    },
    {
      "scenario": "Real-time monitoring",
      "command": "Get-Content analysis_output.txt -Wait -Tail 10",
      "description": "Monitor output in real-time"
    }
  ],
  "notes": [
    "Use timeout commands for programs that may not exit automatically",
    "Monitor both stdout and stderr for complete output capture",
    "Background processes require separate monitoring commands",
    "File paths with spaces need proper quoting"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Output Capture

Generate commands for basic output capture:

```javascript
const basicCapture = await generateOutputCaptureCommands({
  programPath: "C:\\Projects\\test-program.exe",
  outputPath: "test_output.txt"
});

console.log("Windows PowerShell:");
console.log(basicCapture.commands.capture.powershell);

console.log("\nLinux/macOS:");
console.log(basicCapture.crossPlatform.linux.capture);

// Example output:
// Windows PowerShell: & 'C:\Projects\test-program.exe' > test_output.txt 2>&1
// Linux/macOS: ./test-program > test_output.txt 2>&1
```

### Automated Testing Commands

Generate commands for automated test execution:

```javascript
const testCommands = await generateOutputCaptureCommands({
  programPath: "./graphics-test.exe",
  outputPath: "test_results.txt",
  includeMonitoring: true
});

console.log("Test Execution Commands:");
console.log("1. Run with timeout:", testCommands.commands.capture.withTimeout);
console.log("2. Monitor progress:", testCommands.commands.monitoring.realTime);
console.log("3. Check if running:", testCommands.commands.monitoring.processStatus);

// Example usage in test script:
const testScript = `
# Start test with timeout
${testCommands.commands.capture.withTimeout}

# Check if output file was created
if (Test-Path test_results.txt) {
    Write-Host "Test completed successfully"
    Get-Content test_results.txt
} else {
    Write-Host "Test failed - no output generated"
}
`;
```

### CI/CD Integration Commands

Generate commands for continuous integration:

```javascript
const ciCommands = await generateOutputCaptureCommands({
  programPath: "build/release/app.exe",
  outputPath: "ci_output.txt",
  includeMonitoring: false  // Disable interactive monitoring for CI
});

console.log("CI/CD Commands:");
console.log("Background execution:", ciCommands.commands.advanced.backgroundCapture);
console.log("Timestamped output:", ciCommands.commands.advanced.timestampedCapture);

// Example CI script integration:
const ciScript = `
# Execute program in background
${ciCommands.commands.advanced.backgroundCapture}

# Wait for completion and check results
Wait-Process -Name app
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build verification successful"
} else {
    Write-Host "Build verification failed"
    exit 1
}
`;
```

### Real-time Debugging Commands

Generate commands for live debugging sessions:

```javascript
const debugCommands = await generateOutputCaptureCommands({
  programPath: "debug/test-app.exe",
  outputPath: "debug_session.log",
  includeMonitoring: true
});

console.log("Debugging Session Commands:");
console.log("1. Start program with logging:");
console.log(debugCommands.commands.advanced.withLogging);

console.log("\n2. Monitor in real-time:");
console.log(debugCommands.commands.monitoring.realTime);

console.log("\n3. Check resource usage:");
console.log(debugCommands.commands.monitoring.resourceUsage);

// Example debugging workflow:
const debugWorkflow = `
# Terminal 1: Start program with logging
${debugCommands.commands.advanced.withLogging}

# Terminal 2: Monitor output
${debugCommands.commands.monitoring.realTime}

# Terminal 3: Monitor resources
while ($true) {
    ${debugCommands.commands.monitoring.resourceUsage}
    Start-Sleep -Seconds 5
}
`;
```

### Cross-Platform Development

Generate commands for multi-platform development:

```javascript
const crossPlatformCommands = await generateOutputCaptureCommands({
  programPath: "./cross-platform-app",
  outputPath: "platform_test.txt"
});

console.log("Windows Commands:");
Object.entries(crossPlatformCommands.commands.capture).forEach(([type, cmd]) => {
  console.log(`${type}: ${cmd}`);
});

console.log("\nLinux Commands:");
Object.entries(crossPlatformCommands.crossPlatform.linux).forEach(([type, cmd]) => {
  console.log(`${type}: ${cmd}`);
});

console.log("\nmacOS Commands:");
Object.entries(crossPlatformCommands.crossPlatform.macos).forEach(([type, cmd]) => {
  console.log(`${type}: ${cmd}`);
});
```

## Integration Workflows

### Automated Test Runner

```javascript
class TestOutputCapture {
  constructor() {
    this.platform = this.detectPlatform();
  }
  
  async setupTestCapture(testProgram, testName) {
    const outputPath = `test_results/${testName}_${Date.now()}.txt`;
    
    const commands = await generateOutputCaptureCommands({
      programPath: testProgram,
      outputPath: outputPath,
      includeMonitoring: true
    });
    
    return {
      commands,
      outputPath,
      platform: this.platform,
      testName
    };
  }
  
  async executeTest(testSetup) {
    const { commands, outputPath, testName } = testSetup;
    
    try {
      // Execute with platform-specific command
      const command = this.selectCommand(commands);
      await this.runCommand(command);
      
      // Verify output was captured
      if (await this.fileExists(outputPath)) {
        return await this.analyzeTestOutput(outputPath, testName);
      } else {
        throw new Error(`No output captured for test: ${testName}`);
      }
    } catch (error) {
      return {
        testName,
        status: 'failed',
        error: error.message,
        outputPath
      };
    }
  }
  
  selectCommand(commands) {
    switch (this.platform) {
      case 'windows':
        return commands.commands.capture.withTimeout;
      case 'linux':
      case 'macos':
        return commands.crossPlatform[this.platform].withTimeout;
      default:
        return commands.commands.capture.powershell;
    }
  }
  
  async analyzeTestOutput(outputPath, testName) {
    const output = await this.readFile(outputPath);
    
    return {
      testName,
      status: output.includes('ERROR') ? 'failed' : 'passed',
      outputSize: output.length,
      outputPath,
      summary: this.extractSummary(output)
    };
  }
}
```

### Continuous Integration Integration

```javascript
class CIOutputCapture {
  async generateCICommands(buildConfig) {
    const commands = await generateOutputCaptureCommands({
      programPath: buildConfig.executablePath,
      outputPath: `ci_results/${buildConfig.buildId}.txt`,
      includeMonitoring: false
    });
    
    return this.generateCIScript(commands, buildConfig);
  }
  
  generateCIScript(commands, buildConfig) {
    const script = `
#!/bin/bash
set -e

echo "Starting CI verification for build ${buildConfig.buildId}"

# Create output directory
mkdir -p ci_results

# Execute program with timeout
${this.selectCICommand(commands)}

# Check exit code
if [ $? -eq 0 ]; then
    echo "CI verification passed"
    
    # Parse output for additional checks
    if grep -q "ERROR" ci_results/${buildConfig.buildId}.txt; then
        echo "Errors found in output"
        exit 1
    fi
    
    echo "All checks passed"
    exit 0
else
    echo "CI verification failed"
    exit 1
fi
`;
    
    return script;
  }
  
  selectCICommand(commands) {
    // Use timeout command appropriate for CI environment
    return process.platform === 'win32' 
      ? commands.commands.capture.withTimeout
      : commands.crossPlatform.linux.withTimeout;
  }
}
```

### Development Monitoring System

```javascript
class DevelopmentMonitor {
  async setupDevelopmentMonitoring(projectPath) {
    const commands = await generateOutputCaptureCommands({
      programPath: `${projectPath}/debug/app.exe`,
      outputPath: `${projectPath}/logs/dev_session.log`,
      includeMonitoring: true
    });
    
    return this.createMonitoringScript(commands, projectPath);
  }
  
  createMonitoringScript(commands, projectPath) {
    return {
      startDevelopment: this.createStartScript(commands),
      monitorOutput: this.createMonitorScript(commands),
      checkHealth: this.createHealthScript(commands),
      cleanup: this.createCleanupScript(projectPath)
    };
  }
  
  createStartScript(commands) {
    return `
# Start development session with comprehensive logging
echo "Starting development session..."

# Create log directory
mkdir -p logs

# Start application with output capture
${commands.commands.advanced.withLogging}
`;
  }
  
  createMonitorScript(commands) {
    return `
# Monitor development session output
echo "Monitoring development output..."

# Real-time log monitoring
${commands.commands.monitoring.realTime}
`;
  }
  
  createHealthScript(commands) {
    return `
# Check development session health
echo "Checking session health..."

# Process status
${commands.commands.monitoring.processStatus}

# Resource usage
${commands.commands.monitoring.resourceUsage}
`;
  }
}
```

## Error Handling

The tool handles various edge cases and provides robust error handling:

### Invalid Program Path Handling

```javascript
const validateProgramPath = (programPath) => {
  if (!programPath || typeof programPath !== 'string') {
    throw new Error("Program path must be a non-empty string");
  }
  
  if (programPath.trim().length === 0) {
    throw new Error("Program path cannot be empty");
  }
  
  // Platform-specific path validation
  const isWindowsPath = programPath.includes('\\') || programPath.match(/^[A-Za-z]:/);
  const isUnixPath = programPath.startsWith('/') || programPath.startsWith('./');
  
  if (!isWindowsPath && !isUnixPath && !programPath.includes('/')) {
    console.warn("Program path appears to be relative - ensure it's accessible from working directory");
  }
  
  return true;
};
```

### Output Path Validation

```javascript
const validateOutputPath = (outputPath) => {
  if (!outputPath) {
    return "analysis_output.txt"; // Use default
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"|?*]/;
  if (invalidChars.test(outputPath)) {
    throw new Error("Output path contains invalid characters");
  }
  
  // Ensure directory exists or can be created
  const directory = path.dirname(outputPath);
  if (directory && directory !== '.') {
    console.log(`Note: Output directory '${directory}' will be created if it doesn't exist`);
  }
  
  return outputPath;
};
```

### Platform Detection and Fallbacks

```javascript
const generateWithFallbacks = async (params) => {
  try {
    return await generateOutputCaptureCommands(params);
  } catch (error) {
    console.warn("Primary command generation failed, using fallbacks");
    
    return {
      platform: "unknown",
      programPath: params.programPath,
      outputPath: params.outputPath || "output.txt",
      commands: {
        generic: `"${params.programPath}" > "${params.outputPath || 'output.txt'}" 2>&1`,
        monitoring: `echo "Monitoring not available for unknown platform"`,
        fallback: true
      },
      error: error.message,
      suggestions: [
        "Verify program path is correct",
        "Check platform compatibility",
        "Use platform-specific command variants"
      ]
    };
  }
};
```

## Best Practices

### 1. Platform-Specific Optimization

Use platform-appropriate commands:

```javascript
// Good: Platform-specific command selection
const selectOptimalCommand = (commands, platform) => {
  switch (platform) {
    case 'windows':
      return commands.commands.capture.powershell; // Use PowerShell for better Unicode support
    case 'linux':
      return commands.crossPlatform.linux.withTimeout; // Include timeout for safety
    case 'macos':
      return commands.crossPlatform.macos.withTimeout; // Use gtimeout if available
    default:
      return commands.commands.capture.cmd; // Fallback to basic command
  }
};
```

### 2. Output File Management

Implement proper output file handling:

```javascript
// Good: Timestamped and organized output files
const generateOutputPath = (baseDir, programName, testType) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${baseDir}/${programName}_${testType}_${timestamp}.txt`;
};

// Good: Output file cleanup strategy
const manageOutputFiles = (outputDir, maxAge = 7) => {
  const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
  
  // Implementation for cleaning old output files
  return `find "${outputDir}" -name "*.txt" -type f -mtime +${maxAge} -delete`;
};
```

### 3. Resource Monitoring

Include comprehensive resource monitoring:

```javascript
// Good: Resource usage tracking
const generateResourceMonitoring = (programName) => {
  return {
    windows: `Get-Process -Name "${programName}" | Select-Object CPU, WorkingSet, PagedMemorySize`,
    linux: `ps -p $(pgrep -f "${programName}") -o pid,cpu,vsz,rss`,
    macos: `ps -p $(pgrep -f "${programName}") -o pid,cpu,vsz,rss`
  };
};
```

### 4. Error Recovery

Implement robust error recovery mechanisms:

```javascript
// Good: Command with error recovery
const generateRobustCommand = (programPath, outputPath) => {
  return `
# Attempt execution with error handling
if (Test-Path "${programPath}") {
    try {
        & "${programPath}" > "${outputPath}" 2>&1
        Write-Host "Execution completed successfully"
    } catch {
        Write-Host "Execution failed: $($_.Exception.Message)"
        echo "EXECUTION_FAILED: $($_.Exception.Message)" > "${outputPath}"
    }
} else {
    Write-Host "Program not found: ${programPath}"
    echo "PROGRAM_NOT_FOUND: ${programPath}" > "${outputPath}"
}
`;
};
```

## Cross-References

- **[parse_qb64pe_structured_output](./parse_qb64pe_structured_output.md)** - Output parsing
- **[inject_native_qb64pe_logging](./inject_native_qb64pe_logging.md)** - Logging enhancement
- **[get_execution_monitoring_guidance](./get_execution_monitoring_guidance.md)** - Monitoring guidance
- **[enhance_qb64pe_code_for_debugging](./enhance_qb64pe_code_for_debugging.md)** - Debug enhancement
- **[get_file_monitoring_commands](./get_file_monitoring_commands.md)** - File monitoring
- **[get_process_monitoring_commands](./get_process_monitoring_commands.md)** - Process monitoring

## See Also

- [Execution Monitoring Examples](../docs/EXECUTION_MONITORING_EXAMPLES.md)
- [Cross-Platform Development Guide](../docs/QB64PE_EXECUTION_MONITORING.md)
- [CI/CD Integration Guide](../docs/LLM_CONNECTION_EXAMPLES.md)
