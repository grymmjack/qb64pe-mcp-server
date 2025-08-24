# get_screenshot_analysis_history

Gets history of automatic screenshot analyses performed.

## Description

This tool retrieves the history of automatic screenshot analyses, including analysis results, recent screenshots, processing status, and summary statistics. It's useful for tracking automated analysis activity, monitoring system performance, and reviewing past analysis results.

## Parameters

- **limit** (optional): Maximum number of results to return (default: 10)

## Usage

### Get Recent Analysis History
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history();
```

### Get Limited Number of Results
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 5
});
```

### Get Extensive History
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 50
});
```

## Response Format

```typescript
{
  history: AnalysisEntry[],
  recentScreenshots: string[],
  status: {
    isWatching: boolean,
    watchedDirectories: string[],
    queueLength: number,
    isProcessing: boolean,
    totalAnalyses: number
  },
  summary: {
    totalAnalyses: number,
    successful: number,
    failed: number,
    lastAnalysis: string | null
  }
}
```

## Analysis Entry Structure

Each analysis entry contains:

```typescript
{
  timestamp: string,               // When analysis was performed
  screenshotPath: string,         // Path to analyzed screenshot
  analysisType: string,           // Type of analysis performed
  success: boolean,               // Whether analysis succeeded
  analysis: {                     // Analysis results
    shapes?: string[],
    colors?: string[],
    textElements?: string[],
    layout?: string,
    quality?: string,
    overallDescription?: string
  },
  processingTime?: number,        // Time taken for analysis (ms)
  error?: string                  // Error message if failed
}
```

## Status Information

### Watching Status
```typescript
status: {
  isWatching: false,              // Is file watching active?
  watchedDirectories: [],         // Directories being monitored
  queueLength: 0,                 // Files waiting for analysis
  isProcessing: false,            // Is analysis currently running?
  totalAnalyses: 0               // Total analyses performed
}
```

**Status Indicators:**
- **isWatching**: Whether automatic directory monitoring is enabled
- **watchedDirectories**: List of directories being monitored for new screenshots
- **queueLength**: Number of screenshots waiting to be analyzed
- **isProcessing**: Whether an analysis is currently in progress
- **totalAnalyses**: Total number of analyses performed since startup

### Summary Statistics
```typescript
summary: {
  totalAnalyses: 0,               // Total analysis attempts
  successful: 0,                  // Successfully completed analyses
  failed: 0,                      // Failed analysis attempts
  lastAnalysis: null              // Timestamp of last analysis
}
```

## Use Cases

### Monitor Automation Activity
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history();

if (history.status.isWatching) {
  console.log("Automation is active");
  console.log(`Queue length: ${history.status.queueLength}`);
  console.log(`Total analyses: ${history.status.totalAnalyses}`);
} else {
  console.log("Automation is not running");
}
```

### Review Recent Analyses
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 10
});

history.history.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.screenshotPath}`);
  console.log(`Success: ${entry.success}`);
  if (entry.analysis) {
    console.log(`Shapes found: ${entry.analysis.shapes?.join(', ')}`);
    console.log(`Colors found: ${entry.analysis.colors?.join(', ')}`);
  }
});
```

### Performance Analysis
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 100
});

// Calculate average processing time
const processingTimes = history.history
  .filter(entry => entry.processingTime)
  .map(entry => entry.processingTime);

const averageTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
console.log(`Average processing time: ${averageTime}ms`);

// Calculate success rate
const successRate = (history.summary.successful / history.summary.totalAnalyses) * 100;
console.log(`Success rate: ${successRate.toFixed(1)}%`);
```

## Historical Analysis

### Trend Analysis
```typescript
function analyzeTrends(history) {
  const entries = history.history.sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const hourlyAnalyses = {};
  entries.forEach(entry => {
    const hour = new Date(entry.timestamp).toISOString().slice(0, 13);
    hourlyAnalyses[hour] = (hourlyAnalyses[hour] || 0) + 1;
  });
  
  return hourlyAnalyses;
}
```

### Quality Assessment
```typescript
function assessQuality(history) {
  const qualityDistribution = {};
  
  history.history.forEach(entry => {
    if (entry.analysis?.quality) {
      const quality = entry.analysis.quality;
      qualityDistribution[quality] = (qualityDistribution[quality] || 0) + 1;
    }
  });
  
  return qualityDistribution;
}
```

### Error Analysis
```typescript
function analyzeErrors(history) {
  const errors = history.history
    .filter(entry => !entry.success)
    .map(entry => entry.error);
  
  const errorCounts = {};
  errors.forEach(error => {
    errorCounts[error] = (errorCounts[error] || 0) + 1;
  });
  
  return errorCounts;
}
```

## Data Export and Reporting

### CSV Export
```typescript
function exportAnalysisHistoryToCSV(history) {
  const headers = [
    'Timestamp', 'Screenshot', 'Type', 'Success', 
    'Shapes', 'Colors', 'Quality', 'Processing Time'
  ];
  
  const rows = history.history.map(entry => [
    entry.timestamp,
    entry.screenshotPath,
    entry.analysisType,
    entry.success,
    entry.analysis?.shapes?.join(';') || '',
    entry.analysis?.colors?.join(';') || '',
    entry.analysis?.quality || '',
    entry.processingTime || ''
  ]);
  
  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}
```

### Summary Report
```typescript
function generateAnalysisReport(history) {
  return {
    overview: {
      totalAnalyses: history.summary.totalAnalyses,
      successRate: (history.summary.successful / history.summary.totalAnalyses * 100).toFixed(1),
      failureRate: (history.summary.failed / history.summary.totalAnalyses * 100).toFixed(1)
    },
    automation: {
      isActive: history.status.isWatching,
      watchedDirectories: history.status.watchedDirectories.length,
      queueLength: history.status.queueLength,
      currentlyProcessing: history.status.isProcessing
    },
    recent: {
      lastAnalysis: history.summary.lastAnalysis,
      recentCount: history.history.length,
      recentScreenshots: history.recentScreenshots.length
    }
  };
}
```

## Integration with Automation

### Check Analysis Status
```typescript
// Monitor automation health
const history = await mcp_qb64pe_get_screenshot_analysis_history();

if (history.status.queueLength > 10) {
  console.log("Analysis queue is getting long - consider adjusting intervals");
}

if (!history.status.isWatching && history.recentScreenshots.length > 0) {
  console.log("Screenshots available but watching is not enabled");
  // Could automatically start watching
}
```

### Performance Monitoring
```typescript
// Track analysis performance over time
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 100
});

const recentFailures = history.history
  .slice(0, 10)
  .filter(entry => !entry.success);

if (recentFailures.length > 3) {
  console.log("High failure rate detected in recent analyses");
  // Could trigger diagnostic actions
}
```

### Automation Optimization
```typescript
// Optimize based on historical performance
const history = await mcp_qb64pe_get_screenshot_analysis_history({
  limit: 50
});

const avgProcessingTime = history.history
  .filter(entry => entry.processingTime)
  .reduce((sum, entry) => sum + entry.processingTime, 0) / 
  history.history.filter(entry => entry.processingTime).length;

if (avgProcessingTime > 5000) {  // 5 seconds
  console.log("Analysis taking longer than expected");
  // Could adjust capture intervals or analysis settings
}
```

## Filtering and Search

### Filter by Success Status
```typescript
function filterBySuccess(history, successful = true) {
  return history.history.filter(entry => entry.success === successful);
}
```

### Filter by Date Range
```typescript
function filterByDateRange(history, startDate, endDate) {
  return history.history.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
}
```

### Search by Analysis Content
```typescript
function searchByContent(history, searchTerm) {
  return history.history.filter(entry => {
    if (!entry.analysis) return false;
    
    const searchIn = [
      ...(entry.analysis.shapes || []),
      ...(entry.analysis.colors || []),
      ...(entry.analysis.textElements || []),
      entry.analysis.layout || '',
      entry.analysis.quality || '',
      entry.analysis.overallDescription || ''
    ].join(' ').toLowerCase();
    
    return searchIn.includes(searchTerm.toLowerCase());
  });
}
```

## Best Practices

1. **Regular Monitoring**: Check analysis history periodically to ensure automation is working
2. **Performance Tracking**: Monitor processing times and success rates
3. **Error Analysis**: Review failed analyses to identify patterns
4. **Resource Management**: Watch queue lengths to prevent backlogs
5. **Data Retention**: Consider archiving old analysis data to prevent memory issues

## Troubleshooting

### No Analysis History
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history();

if (history.summary.totalAnalyses === 0) {
  // No analyses have been performed
  // Check if automation is set up correctly
  console.log("No analysis history found");
  console.log("Watching status:", history.status.isWatching);
  console.log("Recent screenshots:", history.recentScreenshots.length);
}
```

### High Failure Rate
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history();
const failureRate = history.summary.failed / history.summary.totalAnalyses;

if (failureRate > 0.2) {  // More than 20% failures
  // Investigate common error patterns
  const errors = history.history
    .filter(entry => !entry.success)
    .map(entry => entry.error);
  
  console.log("High failure rate detected:", failureRate);
  console.log("Common errors:", [...new Set(errors)]);
}
```

### Performance Issues
```typescript
const history = await mcp_qb64pe_get_screenshot_analysis_history();

if (history.status.queueLength > history.status.totalAnalyses * 0.1) {
  // Queue is growing faster than analyses complete
  console.log("Analysis queue is backing up");
  console.log("Consider reducing capture frequency or optimizing analysis");
}
```

## Notes

- History is maintained in memory and may be limited by system resources
- Analysis results depend on screenshot quality and content
- Processing times vary based on image complexity and system performance
- Status information reflects real-time automation state
- Historical data helps optimize automation settings and identify issues
