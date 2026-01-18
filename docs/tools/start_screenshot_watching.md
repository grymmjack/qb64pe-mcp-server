# start_screenshot_watching

Start watching screenshot directories for new files and automatically trigger analysis.

## Description

This tool sets up automatic file system monitoring to detect new screenshots and trigger analysis workflows. It's essential for creating fully automated visual testing and analysis pipelines where screenshots are analyzed as soon as they're captured.

## Parameters

- **analysisType** (optional): Type of analysis to perform (default: comprehensive)
  - Options: `shapes`, `colors`, `layout`, `text`, `quality`, `comprehensive`
- **autoAnalyze** (optional): Automatically analyze new screenshots (default: true)
- **directory** (optional): Directory to watch (default: qb64pe-screenshots)

## Usage

### Start Basic Watching
```typescript
const result = await mcp_qb64pe_start_screenshot_watching();
```

### Start with Specific Analysis Type
```typescript
const result = await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'shapes',
  autoAnalyze: true,
  directory: 'qb64pe-screenshots'
});
```

### Start Color-Focused Analysis
```typescript
const result = await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'colors',
  autoAnalyze: true
});
```

### Start Text Recognition Watching
```typescript
const result = await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'text',
  autoAnalyze: true,
  directory: 'custom-screenshots'
});
```

### Start Quality Assessment Watching
```typescript
const result = await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'quality',
  autoAnalyze: true
});
```

## Response Format

```typescript
{
  watching: {
    isWatching: boolean,           // Whether watching is active
    watchedDirectories: string[],  // List of directories being monitored
    queueLength: number,           // Files waiting for analysis
    isProcessing: boolean,         // Currently processing a file
    totalAnalyses: number         // Total analyses performed
  },
  configuration: {
    directory: string,             // Directory being watched
    analysisType: string,          // Type of analysis configured
    autoAnalyze: boolean          // Whether auto-analysis is enabled
  },
  instructions: string[]          // Setup and usage guidance
}
```

## Analysis Types

### Comprehensive Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'comprehensive'
});
```

**Analyzes:** Shapes, colors, layout, text, quality, overall description
**Best for:** Complete visual analysis, debugging, quality assessment
**Processing time:** Longest (most thorough)

### Shapes Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'shapes'
});
```

**Analyzes:** Geometric shapes, patterns, drawing elements
**Best for:** Graphics programs, geometric tests, shape validation
**Processing time:** Fast

### Colors Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'colors'
});
```

**Analyzes:** Color palette, dominant colors, color accuracy
**Best for:** Color testing, palette validation, visual themes
**Processing time:** Fast

### Layout Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'layout'
});
```

**Analyzes:** Element positioning, alignment, composition
**Best for:** UI testing, layout validation, design review
**Processing time:** Medium

### Text Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'text'
});
```

**Analyzes:** Text content, fonts, readability
**Best for:** Text rendering tests, font validation, content verification
**Processing time:** Medium

### Quality Analysis
```typescript
await mcp_qb64pe_start_screenshot_watching({
  analysisType: 'quality'
});
```

**Analyzes:** Image clarity, artifacts, technical quality
**Best for:** Performance testing, rendering quality, technical validation
**Processing time:** Fast

## File Watching Configuration

### Directory Structure
```
qb64pe-screenshots/           ← Watched directory
├── qb64pe_2024-01-15_14-30-15_001.png  ← Detected and analyzed
├── qb64pe_2024-01-15_14-30-20_002.png  ← Detected and analyzed
├── manual_test_screenshot.png           ← Detected and analyzed
└── analysis_results/                    ← Analysis outputs
    ├── analysis_001.json
    ├── analysis_002.json
    └── analysis_manual.json
```

### File Detection
The watcher detects:
- **PNG files** (primary format)
- **JPG/JPEG files** 
- **GIF files** (animated analysis)
- **New files only** (not existing files)
- **Complete files** (waits for file write completion)

### Processing Queue
```typescript
{
  watching: {
    queueLength: 3,           // 3 files waiting for analysis
    isProcessing: true,       // Currently analyzing a file
    totalAnalyses: 15        // 15 analyses completed
  }
}
```

**Queue Management:**
- Files are processed in order of detection
- One file analyzed at a time to prevent resource conflicts
- Queue length indicates backlog
- Processing status shows current activity

## Use Cases

### Automated Testing Pipeline
```typescript
async function setupAutomatedTesting() {
  // Start screenshot monitoring
  await mcp_qb64pe_start_screenshot_monitoring({
    captureIntervalMs: 5000
  });
  
  // Start analysis watching
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'comprehensive',
    autoAnalyze: true
  });
  
  console.log('Automated testing pipeline active');
  console.log('Screenshots will be captured and analyzed automatically');
  
  return 'pipeline_started';
}
```

### Visual Regression Testing
```typescript
async function setupRegressionTesting() {
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'layout',
    autoAnalyze: true,
    directory: 'regression-screenshots'
  });
  
  console.log('Visual regression testing started');
  console.log('Layout changes will be automatically detected');
}
```

### Color Accuracy Testing
```typescript
async function setupColorTesting() {
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'colors',
    autoAnalyze: true
  });
  
  console.log('Color accuracy testing active');
  console.log('Color palettes will be automatically analyzed');
}
```

### Performance Monitoring
```typescript
async function setupPerformanceMonitoring() {
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'quality',
    autoAnalyze: true
  });
  
  console.log('Performance monitoring started');
  console.log('Rendering quality will be automatically assessed');
}
```

## Automation Workflows

### Complete Automation Setup
```typescript
class VisualTestAutomation {
  async start() {
    // Start screenshot capture
    await mcp_qb64pe_start_screenshot_monitoring({
      captureIntervalMs: 3000,
      checkIntervalMs: 1000
    });
    
    // Start analysis watching
    await mcp_qb64pe_start_screenshot_watching({
      analysisType: 'comprehensive',
      autoAnalyze: true
    });
    
    console.log('Full automation started');
    return this;
  }
  
  async getStatus() {
    return await mcp_qb64pe_get_automation_status();
  }
  
  async getResults() {
    return await mcp_qb64pe_get_screenshot_analysis_history({
      limit: 20
    });
  }
  
  async stop() {
    await mcp_qb64pe_stop_screenshot_monitoring();
    await mcp_qb64pe_stop_screenshot_watching();
    console.log('Automation stopped');
  }
}
```

### Conditional Analysis
```typescript
async function setupConditionalAnalysis() {
  // Start watching without auto-analysis
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'shapes',
    autoAnalyze: false  // Manual control
  });
  
  // Implement custom logic
  setInterval(async () => {
    const status = await mcp_qb64pe_get_automation_status();
    
    if (status.screenshot.queueLength > 0) {
      // Only analyze during specific conditions
      if (isAnalysisTime()) {
        console.log('Triggering analysis for queued screenshots');
        // Manual analysis trigger would go here
      }
    }
  }, 10000);
}
```

### Multi-Directory Watching
```typescript
async function setupMultiDirectoryWatch() {
  // Watch multiple directories with different analysis types
  const directories = [
    { dir: 'test-screenshots', type: 'comprehensive' },
    { dir: 'performance-screenshots', type: 'quality' },
    { dir: 'ui-screenshots', type: 'layout' }
  ];
  
  for (const config of directories) {
    await mcp_qb64pe_start_screenshot_watching({
      directory: config.dir,
      analysisType: config.type,
      autoAnalyze: true
    });
    
    console.log(`Started watching ${config.dir} for ${config.type} analysis`);
  }
}
```

## Integration with Development

### Development Workflow
```typescript
async function setupDevelopmentWatch() {
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'comprehensive',
    autoAnalyze: true
  });
  
  console.log('Development watching started');
  console.log('Take screenshots manually or run programs to trigger analysis');
  
  // Monitor for analysis results
  setInterval(async () => {
    const history = await mcp_qb64pe_get_screenshot_analysis_history({
      limit: 1
    });
    
    if (history.history.length > 0) {
      const latest = history.history[0];
      console.log(`Latest analysis: ${latest.screenshotPath}`);
      console.log(`Found: ${latest.analysis.shapes?.join(', ') || 'No shapes'}`);
    }
  }, 15000);
}
```

### Debugging Integration
```typescript
async function setupDebuggingWatch() {
  await mcp_qb64pe_start_screenshot_watching({
    analysisType: 'comprehensive',
    autoAnalyze: true,
    directory: 'debug-screenshots'
  });
  
  console.log('Debugging watch active');
  console.log('Screenshots in debug-screenshots/ will be analyzed automatically');
  
  return {
    getLatestAnalysis: async () => {
      const history = await mcp_qb64pe_get_screenshot_analysis_history({
        limit: 1
      });
      return history.history[0] || null;
    },
    
    waitForAnalysis: (timeout = 30000) => {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          const status = await mcp_qb64pe_get_automation_status();
          if (status.screenshot.totalAnalyses > 0) {
            clearInterval(checkInterval);
            resolve(await mcp_qb64pe_get_screenshot_analysis_history({ limit: 1 }));
          }
        }, 1000);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Analysis timeout'));
        }, timeout);
      });
    }
  };
}
```

## Performance and Resource Management

### Resource Monitoring
```typescript
async function monitorWatchingPerformance() {
  const startTime = Date.now();
  let lastAnalysisCount = 0;
  
  setInterval(async () => {
    const status = await mcp_qb64pe_get_automation_status();
    const currentAnalyses = status.screenshot.totalAnalyses;
    const newAnalyses = currentAnalyses - lastAnalysisCount;
    const elapsed = Date.now() - startTime;
    
    console.log(`Performance Report:`);
    console.log(`- Total analyses: ${currentAnalyses}`);
    console.log(`- New in last minute: ${newAnalyses}`);
    console.log(`- Queue length: ${status.screenshot.queueLength}`);
    console.log(`- Currently processing: ${status.screenshot.isProcessing}`);
    console.log(`- Uptime: ${Math.round(elapsed / 1000)}s`);
    
    lastAnalysisCount = currentAnalyses;
  }, 60000); // Every minute
}
```

### Queue Management
```typescript
async function manageAnalysisQueue() {
  const status = await mcp_qb64pe_get_automation_status();
  
  if (status.screenshot.queueLength > 10) {
    console.log('Queue is getting large - consider:');
    console.log('1. Reducing screenshot capture frequency');
    console.log('2. Using faster analysis types');
    console.log('3. Processing screenshots in batches');
  }
  
  if (status.screenshot.isProcessing) {
    console.log('Analysis in progress...');
  } else if (status.screenshot.queueLength > 0) {
    console.log(`${status.screenshot.queueLength} files waiting for analysis`);
  } else {
    console.log('All files processed, waiting for new screenshots');
  }
}
```

## Error Handling and Recovery

### Robust Watching Setup
```typescript
async function setupRobustWatching() {
  try {
    const result = await mcp_qb64pe_start_screenshot_watching({
      analysisType: 'comprehensive',
      autoAnalyze: true
    });
    
    if (result.watching.isWatching) {
      console.log('Screenshot watching started successfully');
      
      // Set up health monitoring
      const healthCheck = setInterval(async () => {
        try {
          const status = await mcp_qb64pe_get_automation_status();
          
          if (!status.screenshot.isWatching) {
            console.log('Watching stopped unexpectedly - restarting...');
            clearInterval(healthCheck);
            await setupRobustWatching(); // Restart
          }
        } catch (error) {
          console.log('Health check failed:', error.message);
        }
      }, 30000); // Check every 30 seconds
      
    } else {
      throw new Error('Failed to start watching');
    }
    
  } catch (error) {
    console.log('Failed to start screenshot watching:', error.message);
    
    // Retry after delay
    setTimeout(() => {
      console.log('Retrying screenshot watching setup...');
      setupRobustWatching();
    }, 5000);
  }
}
```

### Error Recovery
```typescript
async function handleWatchingErrors() {
  const status = await mcp_qb64pe_get_automation_status();
  
  // Check for stuck processing
  if (status.screenshot.isProcessing) {
    console.log('Analysis appears to be stuck');
    console.log('Consider restarting watching if this persists');
  }
  
  // Check for queue backup
  if (status.screenshot.queueLength > 20) {
    console.log('Queue is backing up');
    console.log('Consider stopping and restarting with optimized settings');
  }
  
  // Check for total failure
  if (!status.screenshot.isWatching && status.screenshot.queueLength === 0) {
    console.log('Watching appears to have stopped');
    console.log('Restart with: mcp_qb64pe_start_screenshot_watching()');
  }
}
```

## Analysis Result Processing

### Real-time Result Processing
```typescript
async function processAnalysisResults() {
  let lastProcessedCount = 0;
  
  setInterval(async () => {
    const history = await mcp_qb64pe_get_screenshot_analysis_history();
    const newResults = history.history.slice(0, history.summary.totalAnalyses - lastProcessedCount);
    
    for (const result of newResults) {
      console.log(`New analysis: ${result.screenshotPath}`);
      
      if (result.success) {
        // Process successful analysis
        console.log(`Shapes found: ${result.analysis.shapes?.join(', ') || 'none'}`);
        console.log(`Colors found: ${result.analysis.colors?.join(', ') || 'none'}`);
        
        // Custom processing logic here
        await processAnalysisResult(result);
      } else {
        console.log(`Analysis failed: ${result.error}`);
      }
    }
    
    lastProcessedCount = history.summary.totalAnalyses;
  }, 5000); // Check every 5 seconds
}
```

### Analysis Filtering
```typescript
async function filterAndProcessResults() {
  const history = await mcp_qb64pe_get_screenshot_analysis_history({
    limit: 50
  });
  
  // Filter successful shape analyses
  const shapeAnalyses = history.history.filter(result => 
    result.success && 
    result.analysisType === 'shapes' && 
    result.analysis.shapes && 
    result.analysis.shapes.length > 0
  );
  
  // Filter color analyses
  const colorAnalyses = history.history.filter(result =>
    result.success &&
    result.analysisType === 'colors' &&
    result.analysis.colors &&
    result.analysis.colors.length > 3
  );
  
  console.log(`Found ${shapeAnalyses.length} shape analyses`);
  console.log(`Found ${colorAnalyses.length} color analyses`);
  
  return { shapeAnalyses, colorAnalyses };
}
```

## Best Practices

1. **Choose Appropriate Analysis Types**: Use specific types for targeted analysis
2. **Monitor Queue Length**: Prevent backups by balancing capture and analysis rates
3. **Set Up Health Monitoring**: Automatically detect and recover from failures
4. **Process Results Promptly**: Handle analysis results to prevent memory buildup
5. **Use Robust Error Handling**: Implement retry logic and graceful degradation
6. **Optimize for Your Use Case**: Balance thoroughness with performance needs

## Troubleshooting

### Watching Not Starting
```typescript
// Debug checklist:
1. Check directory exists and is accessible
2. Verify write permissions
3. Ensure no other watchers on same directory
4. Check system file watching limits
5. Verify analysis type is valid
```

### No Analysis Results
```typescript
// Common causes:
1. No new screenshots being added
2. Auto-analysis disabled
3. Analysis failing silently
4. Queue backing up
5. Processing stuck on problematic file
```

### Poor Performance
```typescript
// Optimization strategies:
1. Use specific analysis types instead of comprehensive
2. Reduce screenshot capture frequency
3. Process files in smaller batches
4. Monitor system resources
5. Clean up old analysis results
```

## Notes

- File watching continues until explicitly stopped with `stop_screenshot_watching`
- Analysis results are stored in memory and accessible through history tools
- The tool supports multiple directory watching with different analysis configurations
- Performance scales with analysis type complexity and file frequency
- Automatic analysis can be disabled for manual control of the analysis pipeline
- Works best when combined with screenshot monitoring for complete automation
