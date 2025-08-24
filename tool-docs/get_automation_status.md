# get_automation_status

Gets comprehensive status of all screenshot automation services.

## Description

This tool provides a complete overview of all screenshot automation services, including monitoring status, file watching, recent activity, and recommendations for optimizing automation workflows. It's essential for understanding the current state of automated screenshot capture and analysis systems.

## Parameters

This tool takes no parameters.

## Usage

```typescript
const status = await mcp_qb64pe_get_automation_status();
```

## Response Format

The tool returns a comprehensive status object:

```typescript
{
  screenshot: {
    monitoring: {
      isMonitoring: boolean,
      screenshotDir: string
    },
    recentFiles: number,
    latestFile: string
  },
  watcher: {
    isWatching: boolean,
    watchedDirectories: string[],
    queueLength: number,
    isProcessing: boolean,
    totalAnalyses: number
  },
  overall: {
    fullyAutomated: boolean,
    capturingScreenshots: boolean,
    analyzingScreenshots: boolean,
    totalScreenshots: number
  },
  recommendations: string[]
}
```

## Status Categories

### Screenshot Monitoring
Information about automatic screenshot capture:

```typescript
screenshot: {
  monitoring: {
    isMonitoring: false,      // Is automatic capture running?
    screenshotDir: "path"     // Where screenshots are saved
  },
  recentFiles: 5,             // Number of recent screenshot files
  latestFile: "latest.png"    // Most recent screenshot file
}
```

**Key Indicators:**
- **isMonitoring**: Whether automatic screenshot capture is active
- **screenshotDir**: Directory being used for screenshot storage
- **recentFiles**: Count of recent screenshot files available
- **latestFile**: Path to the most recently captured screenshot

### Watcher Services
Information about automatic file watching and analysis:

```typescript
watcher: {
  isWatching: false,          // Is file watching active?
  watchedDirectories: [],     // Directories being monitored
  queueLength: 0,             // Number of files in analysis queue
  isProcessing: false,        // Is analysis currently running?
  totalAnalyses: 0           // Total analyses performed
}
```

**Key Indicators:**
- **isWatching**: Whether directory watching is enabled
- **watchedDirectories**: List of directories being monitored for new files
- **queueLength**: Number of files waiting for analysis
- **isProcessing**: Whether an analysis is currently in progress
- **totalAnalyses**: Total number of analyses completed

### Overall Status
High-level automation state:

```typescript
overall: {
  fullyAutomated: false,      // Is full automation running?
  capturingScreenshots: false, // Is capture working?
  analyzingScreenshots: false, // Is analysis working?
  totalScreenshots: 5         // Total screenshots available
}
```

**Automation Levels:**
- **fullyAutomated**: Both capture and analysis are running
- **capturingScreenshots**: Automatic screenshot capture is active
- **analyzingScreenshots**: Automatic analysis is active
- **totalScreenshots**: Total number of screenshots in the system

## Status Interpretations

### Not Started
```typescript
{
  overall: {
    fullyAutomated: false,
    capturingScreenshots: false,
    analyzingScreenshots: false
  },
  recommendations: [
    "Start with start_screenshot_monitoring to begin automatic capture",
    "Then use start_screenshot_watching to enable automatic analysis"
  ]
}
```
**Action**: Start automation services

### Partially Automated
```typescript
{
  screenshot: { monitoring: { isMonitoring: true } },
  watcher: { isWatching: false },
  overall: { capturingScreenshots: true, analyzingScreenshots: false }
}
```
**Action**: Enable file watching for full automation

### Fully Automated
```typescript
{
  screenshot: { monitoring: { isMonitoring: true } },
  watcher: { isWatching: true },
  overall: { fullyAutomated: true }
}
```
**Action**: Monitor performance and adjust settings if needed

### Processing Backlog
```typescript
{
  watcher: {
    isWatching: true,
    queueLength: 15,
    isProcessing: true
  }
}
```
**Action**: Wait for queue to process or adjust analysis intervals

## Troubleshooting Scenarios

### No Recent Screenshots
```typescript
{
  screenshot: {
    monitoring: { isMonitoring: false },
    recentFiles: 0,
    latestFile: null
  }
}
```
**Solutions:**
1. Start screenshot monitoring: `start_screenshot_monitoring`
2. Check if QB64PE programs are running: `get_qb64pe_processes`
3. Manually capture: `capture_qb64pe_screenshot`

### High Queue Length
```typescript
{
  watcher: {
    queueLength: 20,
    isProcessing: true
  }
}
```
**Solutions:**
1. Reduce capture frequency
2. Increase analysis intervals
3. Pause monitoring temporarily

### Processing Stuck
```typescript
{
  watcher: {
    isProcessing: true,
    queueLength: 5
  }
  // Status hasn't changed for extended period
}
```
**Solutions:**
1. Stop and restart watching: `stop_screenshot_watching` then `start_screenshot_watching`
2. Check for file system issues
3. Clear the queue manually

## Integration with Automation

### Starting Full Automation
```typescript
// Check current status
const status = await mcp_qb64pe_get_automation_status();

if (!status.overall.capturingScreenshots) {
  // Start screenshot monitoring
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 10000
  });
}

if (!status.overall.analyzingScreenshots) {
  // Start file watching
  await mcp_qb64pe_start_screenshot_watching({
    autoAnalyze: true
  });
}
```

### Monitoring Automation Health
```typescript
// Regular status checks
setInterval(async () => {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.watcher.queueLength > 10) {
    console.log("Analysis queue is getting long");
  }
  
  if (!status.overall.fullyAutomated) {
    console.log("Automation is not fully operational");
  }
}, 30000); // Check every 30 seconds
```

### Performance Optimization
```typescript
const status = await mcp_qb64pe_get_automation_status();

// Adjust based on performance
if (status.watcher.queueLength > 5) {
  // Reduce capture frequency
  await mcp_qb64pe_stop_screenshot_monitoring();
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 20000  // Slower capture
  });
}
```

## Recommendations Interpretation

Common recommendations and their meanings:

### "Start with start_screenshot_monitoring"
- No automatic capture is running
- Need to begin screenshot automation
- Should be the first step in automation setup

### "Then use start_screenshot_watching"
- Capture is working but analysis is not automated
- Need to enable automatic file analysis
- Second step for full automation

### "Consider reducing capture frequency"
- Analysis queue is building up
- Capture is faster than analysis can handle
- Performance optimization needed

### "Check QB64PE processes"
- No QB64PE programs detected
- Screenshots may not be capturing anything useful
- Need to verify target programs are running

## Best Practices

1. **Check status before changes**: Always check current status before starting/stopping services
2. **Monitor queue length**: Watch for analysis backlogs
3. **Balance capture and analysis**: Adjust intervals based on processing capacity
4. **Regular health checks**: Periodically verify automation is working
5. **Gradual optimization**: Make small adjustments and monitor impact

## Common Status Patterns

### Development Mode
```typescript
// Frequent manual testing
{
  overall: { fullyAutomated: false },
  screenshot: { recentFiles: 10 },
  recommendations: ["Manual testing mode detected"]
}
```

### Production Monitoring
```typescript
// Continuous automation
{
  overall: { fullyAutomated: true },
  watcher: { totalAnalyses: 150 },
  recommendations: ["Automation running smoothly"]
}
```

### Heavy Load
```typescript
// High activity period
{
  watcher: { queueLength: 8, isProcessing: true },
  recommendations: ["Consider reducing capture frequency"]
}
```

## Error Conditions

### Service Failures
- **isMonitoring: false** when expected to be true
- **isWatching: false** after starting
- **isProcessing: true** for extended periods

### Resource Issues
- Very high queue lengths (>20)
- No recent files despite monitoring
- Processing timeouts

## Notes

- Status reflects real-time state of automation services
- Recommendations are based on current activity patterns
- Queue length indicates analysis performance
- Total counts help track system usage over time
- Status changes frequently during active automation periods
