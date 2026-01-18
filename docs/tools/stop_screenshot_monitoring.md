# stop_screenshot_monitoring

Stop automatic screenshot monitoring of QB64PE processes.

## Description

This tool stops the automatic monitoring and screenshot capture of QB64PE processes that was started with `start_screenshot_monitoring`. It cleanly shuts down the monitoring service while preserving any screenshots that were captured during the monitoring session.

## Parameters

No parameters required.

## Usage

### Stop Monitoring
```typescript
const result = await mcp_qb64pe_stop_screenshot_monitoring();
```

### Stop After Test Completion
```typescript
async function runAutomatedTest() {
  // Start monitoring
  await mcp_qb64pe_start_screenshot_monitoring();
  
  // Run test
  await executeTest();
  
  // Stop monitoring when done
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  console.log(result.message);
  console.log(result.captured);
  
  return result;
}
```

### Stop with Status Check
```typescript
async function stopMonitoringWithCheck() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.isMonitoring) {
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    console.log('Monitoring stopped:', result.message);
    return result;
  } else {
    console.log('Monitoring was not active');
    return null;
  }
}
```

## Response Format

```typescript
{
  monitoring: {
    isMonitoring: boolean,        // Always false after stopping
    screenshotDir: string        // Directory where screenshots were saved
  },
  message: string,               // Confirmation message
  captured: string              // Count of screenshots captured
}
```

## Monitoring Lifecycle

### Normal Shutdown Sequence
1. **Stop Process Detection**: Cease checking for new QB64PE processes
2. **Stop Screenshot Capture**: End automatic screenshot capture timer
3. **Complete In-Progress Operations**: Finish any screenshots currently being captured
4. **Release Resources**: Clean up timers, handles, and temporary resources
5. **Preserve Screenshots**: Keep all captured screenshots in the directory
6. **Update Status**: Set monitoring status to inactive

### Resource Cleanup
```typescript
// Resources cleaned up during stop:
- Process monitoring timers
- Screenshot capture intervals
- Windows handles and process references
- Temporary capture buffers
- Background monitoring threads
```

### Data Preservation
```typescript
// Data preserved after stopping:
- All captured screenshots
- Screenshot directory structure
- File naming and timestamps
- Screenshot metadata
```

## Use Cases

### Test Completion
```typescript
async function completeVisualTest() {
  console.log('Test running...');
  
  // Wait for test completion
  await waitForTestCompletion();
  
  // Stop monitoring
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  console.log(result.message);
  console.log(`Test completed with ${result.captured}`);
  
  // Analyze captured screenshots
  return await analyzeTestScreenshots();
}
```

### Session Management
```typescript
class ScreenshotSession {
  constructor() {
    this.isActive = false;
    this.startTime = null;
    this.screenshots = [];
  }
  
  async start() {
    await mcp_qb64pe_start_screenshot_monitoring();
    this.isActive = true;
    this.startTime = new Date();
    console.log('Screenshot session started');
  }
  
  async stop() {
    if (this.isActive) {
      const result = await mcp_qb64pe_stop_screenshot_monitoring();
      this.isActive = false;
      
      const duration = new Date() - this.startTime;
      console.log(`Session completed in ${Math.round(duration / 1000)}s`);
      console.log(result.captured);
      
      return result;
    } else {
      console.log('No active session to stop');
      return null;
    }
  }
  
  async getStatus() {
    return await mcp_qb64pe_get_automation_status();
  }
}
```

### Cleanup After Errors
```typescript
async function cleanupAfterError() {
  try {
    // Attempt normal operations
    await runSomeOperation();
  } catch (error) {
    console.log('Error occurred:', error.message);
    
    // Ensure monitoring is stopped
    try {
      const result = await mcp_qb64pe_stop_screenshot_monitoring();
      console.log('Monitoring stopped after error:', result.message);
    } catch (stopError) {
      console.log('Could not stop monitoring:', stopError.message);
    }
    
    throw error;
  }
}
```

### Scheduled Stopping
```typescript
async function scheduledMonitoring(durationMs) {
  // Start monitoring
  await mcp_qb64pe_start_screenshot_monitoring();
  console.log('Monitoring started');
  
  // Schedule automatic stop
  setTimeout(async () => {
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    console.log('Scheduled stop:', result.message);
    console.log(result.captured);
  }, durationMs);
  
  console.log(`Monitoring will stop automatically in ${durationMs / 1000}s`);
}
```

## Integration with Workflows

### Complete Automation Workflow
```typescript
class AutomationWorkflow {
  async runComplete() {
    try {
      // Start full automation
      await mcp_qb64pe_start_screenshot_monitoring();
      await mcp_qb64pe_start_screenshot_watching();
      
      // Run automated processes
      await this.executeAutomatedTests();
      
      // Stop monitoring
      const monitorResult = await mcp_qb64pe_stop_screenshot_monitoring();
      await mcp_qb64pe_stop_screenshot_watching();
      
      console.log('Automation completed');
      console.log(monitorResult.captured);
      
      return await this.generateReport();
      
    } catch (error) {
      // Ensure cleanup on error
      await this.emergencyStop();
      throw error;
    }
  }
  
  async emergencyStop() {
    try {
      await mcp_qb64pe_stop_screenshot_monitoring();
      await mcp_qb64pe_stop_screenshot_watching();
      console.log('Emergency stop completed');
    } catch (error) {
      console.log('Emergency stop failed:', error.message);
    }
  }
}
```

### Batch Processing
```typescript
async function batchProcess(programs) {
  const results = [];
  
  for (const program of programs) {
    console.log(`Processing ${program}...`);
    
    // Start monitoring for this program
    await mcp_qb64pe_start_screenshot_monitoring({
      captureIntervalMs: 3000
    });
    
    // Run program
    await runProgram(program);
    
    // Stop monitoring and collect results
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    results.push({
      program,
      captured: result.captured,
      directory: result.monitoring.screenshotDir
    });
    
    console.log(`${program} completed: ${result.captured}`);
  }
  
  return results;
}
```

### Resource Management
```typescript
class ResourceManager {
  constructor() {
    this.activeMonitoring = false;
    this.cleanupHandlers = [];
  }
  
  async startMonitoring() {
    if (this.activeMonitoring) {
      throw new Error('Monitoring already active');
    }
    
    await mcp_qb64pe_start_screenshot_monitoring();
    this.activeMonitoring = true;
    
    // Register cleanup handler
    const cleanup = async () => {
      if (this.activeMonitoring) {
        await this.stopMonitoring();
      }
    };
    
    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    this.cleanupHandlers.push(cleanup);
  }
  
  async stopMonitoring() {
    if (!this.activeMonitoring) {
      return null;
    }
    
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    this.activeMonitoring = false;
    
    // Remove cleanup handlers
    this.cleanupHandlers.forEach(handler => {
      process.removeListener('exit', handler);
      process.removeListener('SIGINT', handler);
      process.removeListener('SIGTERM', handler);
    });
    this.cleanupHandlers = [];
    
    return result;
  }
}
```

## Error Handling

### Safe Stopping
```typescript
async function safeStop() {
  try {
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    console.log('Successfully stopped monitoring');
    return result;
  } catch (error) {
    if (error.message.includes('not running')) {
      console.log('Monitoring was not active');
      return { monitoring: { isMonitoring: false }, message: 'Was not running' };
    } else {
      console.log('Error stopping monitoring:', error.message);
      throw error;
    }
  }
}
```

### Force Stop
```typescript
async function forceStop() {
  try {
    // Try normal stop first
    return await mcp_qb64pe_stop_screenshot_monitoring();
  } catch (error) {
    console.log('Normal stop failed, attempting force stop...');
    
    // Implementation would depend on the specific force stop mechanism
    // This might involve killing processes or clearing resources directly
    
    return {
      monitoring: { isMonitoring: false },
      message: 'Force stopped',
      captured: 'Unknown - forced stop'
    };
  }
}
```

### Stop with Verification
```typescript
async function stopWithVerification() {
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Verify monitoring actually stopped
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.isMonitoring) {
    throw new Error('Monitoring did not stop properly');
  }
  
  console.log('Monitoring verified stopped');
  return result;
}
```

## Status Checking

### Pre-Stop Status
```typescript
async function checkBeforeStop() {
  const status = await mcp_qb64pe_get_automation_status();
  
  console.log('Current monitoring status:');
  console.log(`- Is monitoring: ${status.screenshot.isMonitoring}`);
  console.log(`- Total captures: ${status.screenshot.totalCaptures}`);
  console.log(`- Active processes: ${status.screenshot.activeProcesses}`);
  
  if (status.screenshot.isMonitoring) {
    const result = await mcp_qb64pe_stop_screenshot_monitoring();
    console.log('Monitoring stopped');
    return result;
  } else {
    console.log('No active monitoring to stop');
    return null;
  }
}
```

### Post-Stop Verification
```typescript
async function verifyStop() {
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Wait a moment for cleanup
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Verify status
  const status = await mcp_qb64pe_get_automation_status();
  
  const verification = {
    stopResult: result,
    isActuallyStopped: !status.screenshot.isMonitoring,
    finalStatus: status.screenshot
  };
  
  if (verification.isActuallyStopped) {
    console.log('✓ Monitoring successfully stopped');
  } else {
    console.log('✗ Warning: Monitoring may still be active');
  }
  
  return verification;
}
```

## Screenshot Analysis Integration

### Stop and Analyze
```typescript
async function stopAndAnalyze() {
  // Stop monitoring
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  console.log(result.message);
  
  // Get list of captured screenshots
  const screenshotDir = result.monitoring.screenshotDir;
  const screenshots = await listScreenshotsInDirectory(screenshotDir);
  
  // Analyze all captured screenshots
  const analyses = [];
  for (const screenshot of screenshots) {
    const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
      screenshotPath: screenshot,
      analysisType: 'comprehensive'
    });
    analyses.push(analysis);
  }
  
  return {
    stopResult: result,
    screenshots: screenshots.length,
    analyses
  };
}
```

### Stop with Report Generation
```typescript
async function stopWithReport() {
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  const report = {
    session: {
      stopped: new Date().toISOString(),
      message: result.message,
      captured: result.captured
    },
    directory: result.monitoring.screenshotDir,
    summary: await generateSessionSummary(result.monitoring.screenshotDir)
  };
  
  // Save report
  const reportPath = `${result.monitoring.screenshotDir}/session_report.json`;
  await saveReport(reportPath, report);
  
  console.log('Session report saved to:', reportPath);
  return report;
}
```

## Cleanup and Maintenance

### Cleanup Old Sessions
```typescript
async function cleanupAfterStop() {
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Optional: Clean up old screenshots
  const screenshotDir = result.monitoring.screenshotDir;
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  await cleanupOldScreenshots(screenshotDir, cutoffDate);
  
  console.log('Monitoring stopped and old files cleaned up');
  return result;
}
```

### Archive Session
```typescript
async function archiveSession() {
  const result = await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Create archive of this session
  const archiveName = `session_${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const archivePath = `archives/${archiveName}`;
  
  await createArchive(result.monitoring.screenshotDir, archivePath);
  
  console.log(`Session archived to: ${archivePath}`);
  console.log(result.message);
  
  return {
    ...result,
    archived: archivePath
  };
}
```

## Best Practices

1. **Always Stop When Done**: Don't leave monitoring running indefinitely
2. **Handle Errors Gracefully**: Ensure monitoring stops even if other operations fail
3. **Verify Stop**: Check status after stopping to ensure cleanup completed
4. **Preserve Screenshots**: Don't delete screenshots immediately - they may be needed for analysis
5. **Use in Try-Finally**: Ensure monitoring stops even if exceptions occur
6. **Check Before Starting**: Verify no monitoring is active before starting new sessions

## Troubleshooting

### Monitoring Won't Stop
```typescript
// Possible causes and solutions:
1. Process is hung - try force stop or restart application
2. Resource locks - wait and retry
3. Permission issues - check system permissions
4. Background operations - wait for completion
```

### Screenshots Not Preserved
```typescript
// Ensure screenshots are saved:
1. Check directory permissions
2. Verify disk space
3. Ensure proper shutdown sequence
4. Check for cleanup scripts running
```

### Status Shows Still Running
```typescript
// If status shows monitoring still active after stop:
1. Wait 2-3 seconds and check again
2. Try stopping again
3. Check for multiple monitoring instances
4. Restart the application if necessary
```

## Notes

- Stopping monitoring immediately halts new screenshot capture
- In-progress screenshots may complete after the stop command
- All captured screenshots remain in the directory after stopping
- The monitoring service can be restarted immediately after stopping
- Stopping does not affect screenshot watching services (separate tool)
- Resource cleanup is automatic but may take a few seconds to complete
