# stop_screenshot_watching

Stop watching screenshot directories for new files and automatic analysis.

## Description

This tool stops the automatic file system monitoring that was set up with `start_screenshot_watching`. It halts the detection of new screenshot files and automatic analysis triggers while preserving any analysis results that were generated during the watching session.

## Parameters

- **directory** (optional): Specific directory to stop watching (empty = stop all)

## Usage

### Stop All Watching
```typescript
const result = await mcp_qb64pe_stop_screenshot_watching();
```

### Stop Specific Directory
```typescript
const result = await mcp_qb64pe_stop_screenshot_watching({
  directory: 'qb64pe-screenshots'
});
```

### Stop Custom Directory
```typescript
const result = await mcp_qb64pe_stop_screenshot_watching({
  directory: 'custom-test-screenshots'
});
```

### Stop with Status Check
```typescript
async function stopWatchingWithCheck() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.isWatching) {
    const result = await mcp_qb64pe_stop_screenshot_watching();
    console.log('Watching stopped:', result.message);
    return result;
  } else {
    console.log('No active watching to stop');
    return null;
  }
}
```

## Response Format

```typescript
{
  watching: {
    isWatching: boolean,           // Overall watching status (may still be true for other dirs)
    watchedDirectories: string[],  // Remaining watched directories
    queueLength: number,           // Files still in queue
    isProcessing: boolean,         // Currently processing a file
    totalAnalyses: number         // Total analyses performed
  },
  message: string                  // Confirmation message
}
```

## Watching Lifecycle

### Normal Shutdown Sequence
1. **Stop File System Watching**: Cease monitoring for new files in specified directory
2. **Complete In-Progress Analysis**: Finish any analysis currently being processed
3. **Clear Analysis Queue**: Remove pending files for the stopped directory
4. **Release File System Resources**: Clean up file watchers and handles
5. **Preserve Analysis Results**: Keep all completed analysis results
6. **Update Status**: Remove directory from watched directories list

### Resource Cleanup
```typescript
// Resources cleaned up during stop:
- File system watchers for the specified directory
- Analysis queue entries for that directory
- File change monitoring handles
- Background watching threads
- Temporary file locks
```

### Data Preservation
```typescript
// Data preserved after stopping:
- All completed analysis results
- Screenshot files in the directory
- Analysis history and statistics
- Other directory watchers (if stopping specific directory)
```

## Use Cases

### Complete Test Session End
```typescript
async function endTestSession() {
  // Stop screenshot capture
  await mcp_qb64pe_stop_screenshot_monitoring();
  
  // Stop analysis watching
  const result = await mcp_qb64pe_stop_screenshot_watching();
  
  console.log('Test session ended');
  console.log(result.message);
  
  // Get final analysis results
  const history = await mcp_qb64pe_get_screenshot_analysis_history();
  console.log(`Total analyses completed: ${history.summary.totalAnalyses}`);
  
  return history;
}
```

### Directory-Specific Stopping
```typescript
async function stopSpecificDirectory() {
  const directories = ['test-screenshots', 'debug-screenshots', 'performance-screenshots'];
  
  for (const dir of directories) {
    const result = await mcp_qb64pe_stop_screenshot_watching({
      directory: dir
    });
    
    console.log(`Stopped watching ${dir}:`, result.message);
  }
  
  // Check if any directories are still being watched
  const status = await mcp_qb64pe_get_automation_status();
  console.log('Remaining watched directories:', status.screenshot.watchedDirectories);
}
```

### Error Recovery
```typescript
async function recoverFromError() {
  try {
    // Attempt normal operations
    await runAnalysisWorkflow();
  } catch (error) {
    console.log('Error in analysis workflow:', error.message);
    
    // Stop watching to prevent further issues
    try {
      const result = await mcp_qb64pe_stop_screenshot_watching();
      console.log('Watching stopped after error:', result.message);
    } catch (stopError) {
      console.log('Could not stop watching:', stopError.message);
    }
    
    throw error;
  }
}
```

### Selective Watching Management
```typescript
class WatchingManager {
  constructor() {
    this.activeWatchers = new Set();
  }
  
  async startWatching(directory, analysisType) {
    await mcp_qb64pe_start_screenshot_watching({
      directory,
      analysisType,
      autoAnalyze: true
    });
    
    this.activeWatchers.add(directory);
    console.log(`Started watching ${directory} for ${analysisType} analysis`);
  }
  
  async stopWatching(directory) {
    if (this.activeWatchers.has(directory)) {
      const result = await mcp_qb64pe_stop_screenshot_watching({
        directory
      });
      
      this.activeWatchers.delete(directory);
      console.log(`Stopped watching ${directory}`);
      return result;
    } else {
      console.log(`${directory} was not being watched`);
      return null;
    }
  }
  
  async stopAll() {
    const results = [];
    
    for (const directory of this.activeWatchers) {
      const result = await this.stopWatching(directory);
      if (result) results.push(result);
    }
    
    console.log(`Stopped watching ${results.length} directories`);
    return results;
  }
}
```

## Integration with Workflows

### Automation Workflow Control
```typescript
class AutomationController {
  async startFullAutomation() {
    await mcp_qb64pe_start_screenshot_monitoring();
    await mcp_qb64pe_start_screenshot_watching({
      analysisType: 'comprehensive'
    });
    
    console.log('Full automation started');
  }
  
  async stopFullAutomation() {
    const monitorResult = await mcp_qb64pe_stop_screenshot_monitoring();
    const watchResult = await mcp_qb64pe_stop_screenshot_watching();
    
    console.log('Full automation stopped');
    console.log('Monitoring:', monitorResult.message);
    console.log('Watching:', watchResult.message);
    
    return {
      monitoring: monitorResult,
      watching: watchResult
    };
  }
  
  async emergencyStop() {
    try {
      await this.stopFullAutomation();
      console.log('Emergency stop completed successfully');
    } catch (error) {
      console.log('Emergency stop encountered errors:', error.message);
    }
  }
}
```

### Batch Processing Control
```typescript
async function batchProcessWithWatching(batches) {
  const results = [];
  
  for (const [index, batch] of batches.entries()) {
    const batchDir = `batch-${index}-screenshots`;
    
    console.log(`Starting batch ${index + 1}/${batches.length}`);
    
    // Start watching for this batch
    await mcp_qb64pe_start_screenshot_watching({
      directory: batchDir,
      analysisType: 'comprehensive'
    });
    
    // Process batch
    await processBatch(batch, batchDir);
    
    // Stop watching for this batch
    const result = await mcp_qb64pe_stop_screenshot_watching({
      directory: batchDir
    });
    
    console.log(`Batch ${index + 1} completed:`, result.message);
    results.push(result);
  }
  
  return results;
}
```

### Dynamic Watching Management
```typescript
async function dynamicWatchingControl() {
  const watchingConfig = [
    { dir: 'ui-tests', type: 'layout', duration: 30000 },
    { dir: 'graphics-tests', type: 'shapes', duration: 45000 },
    { dir: 'performance-tests', type: 'quality', duration: 60000 }
  ];
  
  // Start all watchers
  for (const config of watchingConfig) {
    await mcp_qb64pe_start_screenshot_watching({
      directory: config.dir,
      analysisType: config.type
    });
    
    // Schedule automatic stop
    setTimeout(async () => {
      const result = await mcp_qb64pe_stop_screenshot_watching({
        directory: config.dir
      });
      console.log(`Auto-stopped ${config.dir}:`, result.message);
    }, config.duration);
  }
  
  console.log('Dynamic watching control activated');
}
```

## Queue and Processing Management

### Wait for Queue Completion
```typescript
async function stopAfterQueueCompletion() {
  console.log('Waiting for analysis queue to complete...');
  
  // Wait for queue to empty
  let status;
  do {
    status = await mcp_qb64pe_get_automation_status();
    
    if (status.screenshot.queueLength > 0) {
      console.log(`Queue length: ${status.screenshot.queueLength}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } while (status.screenshot.queueLength > 0 || status.screenshot.isProcessing);
  
  // Now stop watching
  const result = await mcp_qb64pe_stop_screenshot_watching();
  console.log('Stopped after queue completion:', result.message);
  
  return result;
}
```

### Force Stop with Queue Cleanup
```typescript
async function forceStopWithCleanup() {
  const statusBefore = await mcp_qb64pe_get_automation_status();
  
  console.log(`Stopping with ${statusBefore.screenshot.queueLength} items in queue`);
  
  const result = await mcp_qb64pe_stop_screenshot_watching();
  
  // Wait for cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const statusAfter = await mcp_qb64pe_get_automation_status();
  
  console.log('Force stop completed');
  console.log(`Queue before: ${statusBefore.screenshot.queueLength}`);
  console.log(`Queue after: ${statusAfter.screenshot.queueLength}`);
  
  return result;
}
```

### Progressive Shutdown
```typescript
async function progressiveShutdown() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.watchedDirectories.length > 1) {
    // Stop directories one by one
    for (const directory of status.screenshot.watchedDirectories) {
      console.log(`Stopping ${directory}...`);
      
      const result = await mcp_qb64pe_stop_screenshot_watching({
        directory
      });
      
      console.log(`Stopped ${directory}:`, result.message);
      
      // Small delay between stops
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    // Stop all at once
    const result = await mcp_qb64pe_stop_screenshot_watching();
    console.log('All watching stopped:', result.message);
  }
}
```

## Error Handling and Recovery

### Safe Stopping
```typescript
async function safeStopWatching(directory = null) {
  try {
    const result = await mcp_qb64pe_stop_screenshot_watching(
      directory ? { directory } : {}
    );
    
    console.log('Successfully stopped watching');
    return result;
  } catch (error) {
    if (error.message.includes('not watching')) {
      console.log('Directory was not being watched');
      return { 
        watching: { isWatching: false },
        message: 'Was not watching'
      };
    } else {
      console.log('Error stopping watching:', error.message);
      throw error;
    }
  }
}
```

### Recovery from Stuck Analysis
```typescript
async function recoverFromStuckAnalysis() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.isProcessing) {
    console.log('Analysis appears stuck, forcing stop...');
    
    // Force stop to clear stuck analysis
    const result = await mcp_qb64pe_stop_screenshot_watching();
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify recovery
    const newStatus = await mcp_qb64pe_get_automation_status();
    
    if (!newStatus.screenshot.isProcessing) {
      console.log('Successfully recovered from stuck analysis');
      return result;
    } else {
      throw new Error('Could not recover from stuck analysis');
    }
  } else {
    console.log('No stuck analysis detected');
    return await mcp_qb64pe_stop_screenshot_watching();
  }
}
```

### Graceful Shutdown with Timeout
```typescript
async function gracefulShutdownWithTimeout(timeoutMs = 30000) {
  console.log('Starting graceful shutdown...');
  
  const shutdownPromise = (async () => {
    // Wait for current processing to complete
    let status;
    do {
      status = await mcp_qb64pe_get_automation_status();
      if (status.screenshot.isProcessing) {
        console.log('Waiting for current analysis to complete...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (status.screenshot.isProcessing);
    
    // Now stop watching
    return await mcp_qb64pe_stop_screenshot_watching();
  })();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Graceful shutdown timeout'));
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([shutdownPromise, timeoutPromise]);
    console.log('Graceful shutdown completed');
    return result;
  } catch (error) {
    if (error.message.includes('timeout')) {
      console.log('Graceful shutdown timed out, forcing stop...');
      return await mcp_qb64pe_stop_screenshot_watching();
    } else {
      throw error;
    }
  }
}
```

## Status Verification

### Post-Stop Verification
```typescript
async function verifyStop(expectedDirectory = null) {
  const result = await mcp_qb64pe_stop_screenshot_watching(
    expectedDirectory ? { directory: expectedDirectory } : {}
  );
  
  // Wait for cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verify status
  const status = await mcp_qb64pe_get_automation_status();
  
  const verification = {
    stopResult: result,
    statusAfterStop: status.screenshot,
    directoryRemoved: expectedDirectory ? 
      !status.screenshot.watchedDirectories.includes(expectedDirectory) : 
      status.screenshot.watchedDirectories.length === 0
  };
  
  if (verification.directoryRemoved) {
    console.log('✓ Directory successfully removed from watching');
  } else {
    console.log('✗ Warning: Directory may still be watched');
  }
  
  return verification;
}
```

### Complete Status Check
```typescript
async function completeStatusCheck() {
  const statusBefore = await mcp_qb64pe_get_automation_status();
  
  console.log('Before stopping:');
  console.log(`- Is watching: ${statusBefore.screenshot.isWatching}`);
  console.log(`- Watched directories: ${statusBefore.screenshot.watchedDirectories.join(', ')}`);
  console.log(`- Queue length: ${statusBefore.screenshot.queueLength}`);
  console.log(`- Is processing: ${statusBefore.screenshot.isProcessing}`);
  
  const result = await mcp_qb64pe_stop_screenshot_watching();
  
  const statusAfter = await mcp_qb64pe_get_automation_status();
  
  console.log('After stopping:');
  console.log(`- Is watching: ${statusAfter.screenshot.isWatching}`);
  console.log(`- Watched directories: ${statusAfter.screenshot.watchedDirectories.join(', ')}`);
  console.log(`- Queue length: ${statusAfter.screenshot.queueLength}`);
  
  return {
    before: statusBefore,
    after: statusAfter,
    stopResult: result
  };
}
```

## Analysis Result Preservation

### Save Analysis Results Before Stopping
```typescript
async function saveResultsAndStop() {
  // Get current analysis results
  const history = await mcp_qb64pe_get_screenshot_analysis_history();
  
  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = `analysis_results_${timestamp}.json`;
  
  await saveResultsToFile(resultsFile, history);
  console.log(`Analysis results saved to: ${resultsFile}`);
  
  // Now stop watching
  const result = await mcp_qb64pe_stop_screenshot_watching();
  
  return {
    stopResult: result,
    resultsSaved: resultsFile,
    totalAnalyses: history.summary.totalAnalyses
  };
}
```

### Export and Stop
```typescript
async function exportAndStop() {
  // Export analysis data
  const history = await mcp_qb64pe_get_screenshot_analysis_history();
  
  const exportData = {
    session: {
      endTime: new Date().toISOString(),
      totalAnalyses: history.summary.totalAnalyses,
      successRate: history.summary.successful / history.summary.totalAnalyses
    },
    analyses: history.history,
    summary: history.summary
  };
  
  // Stop watching
  const result = await mcp_qb64pe_stop_screenshot_watching();
  
  return {
    export: exportData,
    stop: result
  };
}
```

## Best Practices

1. **Complete Queue Processing**: Allow pending analyses to finish before stopping
2. **Verify Stop**: Check status after stopping to ensure cleanup completed
3. **Preserve Results**: Save analysis results before stopping if needed
4. **Handle Specific Directories**: Use directory parameter for selective stopping
5. **Graceful Shutdown**: Wait for current processing to complete when possible
6. **Error Recovery**: Implement timeout-based force stops for stuck operations

## Troubleshooting

### Watching Won't Stop
```typescript
// Possible causes and solutions:
1. Analysis is stuck - use force stop or timeout
2. Multiple watchers active - stop specific directories
3. File system locks - wait and retry
4. Permission issues - check system permissions
```

### Directory Still Listed After Stop
```typescript
// If directory still appears in watched list:
1. Wait a few seconds and check again
2. Try stopping the specific directory again
3. Check for multiple watcher instances
4. Restart the service if necessary
```

### Queue Not Clearing
```typescript
// If queue doesn't clear after stop:
1. Check if processing is stuck
2. Use force stop to clear queue
3. Verify no new files being added
4. Check file system issues
```

## Notes

- Stopping watching immediately halts detection of new files in the specified directory
- In-progress analysis may complete after the stop command
- Analysis results and history are preserved after stopping
- Multiple directories can be watched simultaneously and stopped independently
- Stopping one directory doesn't affect watching of other directories
- The watching service can be restarted immediately after stopping
- Queue cleanup is automatic but may take a few seconds to complete
