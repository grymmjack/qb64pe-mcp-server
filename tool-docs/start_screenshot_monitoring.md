# start_screenshot_monitoring

Starts monitoring QB64PE processes and automatically captures screenshots at intervals.

## Description

This tool initiates automatic monitoring of QB64PE processes and captures screenshots at specified intervals when QB64PE windows are detected. It's essential for automated testing, visual debugging, and program analysis workflows.

## Parameters

- **captureIntervalMs** (optional): How often to capture screenshots in milliseconds (default: 10000ms)
- **checkIntervalMs** (optional): How often to check for QB64PE processes in milliseconds (default: 5000ms)

## Usage

### Start Basic Monitoring
```typescript
const result = await mcp_qb64pe_start_screenshot_monitoring();
```

### Start with Custom Intervals
```typescript
const result = await mcp_qb64pe_start_screenshot_monitoring({
  captureIntervalMs: 5000,    // Capture every 5 seconds
  checkIntervalMs: 2000       // Check for processes every 2 seconds
});
```

### Start High-Frequency Monitoring
```typescript
const result = await mcp_qb64pe_start_screenshot_monitoring({
  captureIntervalMs: 2000,    // Very frequent captures
  checkIntervalMs: 1000       // Very frequent process checks
});
```

### Start Low-Frequency Monitoring
```typescript
const result = await mcp_qb64pe_start_screenshot_monitoring({
  captureIntervalMs: 30000,   // Capture every 30 seconds
  checkIntervalMs: 10000      // Check processes every 10 seconds
});
```

## Response Format

```typescript
{
  monitoring: {
    isMonitoring: boolean,           // Whether monitoring is active
    screenshotDir: string           // Directory where screenshots are saved
  },
  configuration: {
    checkInterval: number,          // Process check interval (ms)
    captureInterval: number,        // Screenshot capture interval (ms)
    screenshotDirectory: string     // Full path to screenshot directory
  },
  instructions: string[]            // Setup and usage instructions
}
```

## Monitoring Configuration

### Interval Settings
```typescript
{
  configuration: {
    checkInterval: 2000,            // Check for QB64PE processes every 2 seconds
    captureInterval: 5000,          // Capture screenshots every 5 seconds
    screenshotDirectory: "c:\\...\\qb64pe-screenshots"
  }
}
```

**Interval Guidelines:**
- **checkInterval**: How often to scan for QB64PE processes
  - Lower values (1000-2000ms): Better responsiveness, higher CPU usage
  - Higher values (5000-10000ms): Lower CPU usage, may miss short-running programs
- **captureInterval**: How often to take screenshots when processes are found
  - Lower values (1000-5000ms): Better temporal resolution, more disk space
  - Higher values (10000-30000ms): Less disk space, may miss rapid changes

### Directory Structure
```
qb64pe-screenshots/
├── qb64pe_2024-01-15_14-30-15_001.png
├── qb64pe_2024-01-15_14-30-20_002.png
├── qb64pe_2024-01-15_14-30-25_003.png
└── ...
```

Screenshot filename format: `qb64pe_YYYY-MM-DD_HH-MM-SS_NNN.png`

## Use Cases

### Automated Testing
```typescript
async function runAutomatedTest() {
  // Start monitoring before running test
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 3000,
    checkIntervalMs: 1000
  });
  
  // Run QB64PE program
  await runQB64PEProgram('test-program.bas');
  
  // Let it run and capture screenshots
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Stop monitoring
  await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Analyze captured screenshots
  const screenshots = await listScreenshots();
  return await analyzeTestResults(screenshots);
}
```

### Visual Debugging
```typescript
async function debugVisualProgram() {
  console.log('Starting visual debugging session...');
  
  const monitoring = await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 2000,  // Frequent captures for debugging
    checkIntervalMs: 1000
  });
  
  console.log('Monitoring started. Screenshots will be saved to:');
  console.log(monitoring.configuration.screenshotDirectory);
  
  console.log('Run your QB64PE program now...');
  console.log('Use mcp_qb64pe_stop_screenshot_monitoring() when done');
  
  return monitoring;
}
```

### Performance Analysis
```typescript
async function analyzePerformance() {
  // Start monitoring with moderate frequency
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 5000,
    checkIntervalMs: 2000
  });
  
  console.log('Performance monitoring started');
  console.log('Screenshots will show visual performance over time');
  
  // Monitor for extended period
  setTimeout(async () => {
    await mcp_qb64pe_stop_screenshot_monitoring();
    console.log('Performance monitoring complete');
  }, 300000); // 5 minutes
}
```

### Animation Capture
```typescript
async function captureAnimation() {
  // High-frequency capture for smooth animation
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 1000,  // 1 second intervals
    checkIntervalMs: 500      // Responsive process detection
  });
  
  console.log('Animation capture started');
  console.log('Run your animation program now');
  
  return 'monitoring_started';
}
```

## Process Detection

### Automatic Detection
The monitoring system automatically detects:

- **QB64PE.exe** processes
- **QB64PE** windows with specific titles
- **Custom executable names** from QB64PE compilation
- **Graphics windows** created by QB64PE programs

### Detection Scope
```typescript
// Process detection includes:
- "qb64pe.exe"
- "qb64pe"
- Programs compiled with QB64PE
- QB64PE IDE windows
- QB64PE program output windows
```

### Window Focus
Screenshots capture:
- **Active QB64PE windows**
- **Visible graphics output**
- **Console windows** (if visible)
- **Program dialogs and prompts**

## Monitoring Lifecycle

### Startup Sequence
1. **Initialize monitoring service**
2. **Create screenshot directory** (if not exists)
3. **Start process checking timer**
4. **Start screenshot capture timer**
5. **Begin monitoring loop**

### Active Monitoring
```typescript
// While monitoring is active:
while (isMonitoring) {
  // Check for QB64PE processes (every checkInterval)
  const processes = await detectQB64PEProcesses();
  
  if (processes.length > 0) {
    // Capture screenshots (every captureInterval)
    if (shouldCapture()) {
      await captureScreenshots(processes);
    }
  }
  
  await sleep(checkInterval);
}
```

### Cleanup
- **Stop timers** when monitoring ends
- **Release process handles**
- **Clean up temporary resources**
- **Preserve captured screenshots**

## Integration with Analysis

### Combined Monitoring and Analysis
```typescript
async function startFullMonitoring() {
  // Start screenshot monitoring
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 5000,
    checkIntervalMs: 2000
  });
  
  // Start automatic analysis
  await mcp_qb64pe_start_screenshot_watching({
    directory: 'qb64pe-screenshots',
    autoAnalyze: true,
    analysisType: 'comprehensive'
  });
  
  console.log('Full monitoring and analysis started');
}
```

### Monitoring Status Check
```typescript
async function checkMonitoringStatus() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.isMonitoring) {
    console.log('Screenshot monitoring is active');
    console.log('Capture interval:', status.screenshot.captureInterval);
    console.log('Check interval:', status.screenshot.checkInterval);
  } else {
    console.log('Screenshot monitoring is not active');
  }
  
  return status;
}
```

## Error Handling

### Common Issues and Solutions

#### Permission Errors
```typescript
// Handle screenshot permission issues
try {
  await mcp_qb64pe_start_screenshot_monitoring();
} catch (error) {
  if (error.message.includes('permission')) {
    console.log('Screenshot permission denied');
    console.log('Try running with administrator privileges');
  }
}
```

#### Directory Issues
```typescript
// Handle directory creation problems
const result = await mcp_qb64pe_start_screenshot_monitoring();

if (!result.monitoring.isMonitoring) {
  console.log('Failed to start monitoring');
  console.log('Check directory permissions:', result.configuration.screenshotDirectory);
}
```

#### Process Detection Issues
```typescript
// Verify QB64PE process detection
setTimeout(async () => {
  const processes = await mcp_qb64pe_get_qb64pe_processes();
  
  if (processes.length === 0) {
    console.log('No QB64PE processes detected');
    console.log('Make sure QB64PE programs are running');
  } else {
    console.log('Detected processes:', processes.map(p => p.name));
  }
}, 10000); // Check after 10 seconds
```

## Performance Considerations

### CPU Usage
```typescript
// Optimize for lower CPU usage
await mcp_qb64pe_start_screenshot_monitoring({
  captureIntervalMs: 15000,   // Less frequent captures
  checkIntervalMs: 10000      // Less frequent process checks
});
```

### Disk Space
```typescript
// Monitor disk usage
function estimateDiskUsage(intervalMs, durationMs) {
  const capturesPerHour = (3600000 / intervalMs);
  const totalCaptures = capturesPerHour * (durationMs / 3600000);
  const avgSizeKB = 200; // Estimated screenshot size
  
  return {
    totalCaptures,
    estimatedSizeKB: totalCaptures * avgSizeKB,
    estimatedSizeMB: (totalCaptures * avgSizeKB) / 1024
  };
}

const usage = estimateDiskUsage(5000, 3600000); // 5s interval, 1 hour
console.log(`Estimated ${usage.estimatedSizeMB}MB for 1 hour`);
```

### Memory Usage
```typescript
// Minimize memory footprint
const monitoringConfig = {
  captureIntervalMs: 10000,   // Reasonable frequency
  checkIntervalMs: 5000,      // Efficient process checking
  maxScreenshots: 100         // Automatic cleanup after limit
};
```

## Automation Workflows

### Test Automation
```typescript
class QB64PETestRunner {
  async runVisualTest(testProgram) {
    // Start monitoring
    await mcp_qb64pe_start_screenshot_monitoring({
      captureIntervalMs: 3000,
      checkIntervalMs: 1000
    });
    
    // Run test
    const testResult = await this.executeTest(testProgram);
    
    // Capture during execution
    await this.waitForCompletion(testResult);
    
    // Stop monitoring
    await mcp_qb64pe_stop_screenshot_monitoring();
    
    // Analyze results
    return await this.analyzeScreenshots();
  }
}
```

### Continuous Monitoring
```typescript
class ContinuousMonitor {
  async startLongTermMonitoring() {
    await mcp_qb64pe_start_screenshot_monitoring({
      captureIntervalMs: 30000,  // 30 second intervals
      checkIntervalMs: 15000     // 15 second process checks
    });
    
    // Set up cleanup routine
    setInterval(async () => {
      await this.cleanupOldScreenshots();
    }, 3600000); // Cleanup every hour
    
    console.log('Long-term monitoring started');
  }
  
  async cleanupOldScreenshots() {
    // Remove screenshots older than 24 hours
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
    // Implementation depends on file system operations
  }
}
```

## Best Practices

1. **Choose Appropriate Intervals**: Balance capture frequency with system resources
2. **Monitor Disk Space**: Regular cleanup of old screenshots
3. **Check Process Detection**: Verify QB64PE processes are being detected
4. **Combine with Analysis**: Use with screenshot watching for automated analysis
5. **Handle Permissions**: Ensure proper permissions for screenshot capture
6. **Set Timeouts**: Don't run monitoring indefinitely without supervision

## Troubleshooting

### No Screenshots Being Captured
```typescript
// Debug checklist:
1. Are QB64PE processes running? (use get_qb64pe_processes)
2. Is monitoring actually started? (check return value)
3. Are screenshots being saved? (check directory)
4. Are intervals too long? (reduce captureIntervalMs)
5. Permission issues? (try administrator privileges)
```

### High Resource Usage
```typescript
// Optimize performance:
1. Increase capture intervals
2. Increase check intervals  
3. Limit monitoring duration
4. Clean up old screenshots
5. Monitor system resources
```

### Screenshot Quality Issues
```typescript
// Improve screenshot quality:
1. Ensure QB64PE windows are visible
2. Check for overlapping windows
3. Verify graphics mode compatibility
4. Test with simple programs first
```

## Notes

- Monitoring continues until explicitly stopped with `stop_screenshot_monitoring`
- Screenshots are saved with timestamp-based filenames for easy organization
- Process detection works across different QB64PE window types and compiled executables
- Monitoring can run in background while other operations continue
- Resource usage scales with frequency settings - adjust based on system capabilities
- Works best when combined with screenshot watching for automatic analysis
