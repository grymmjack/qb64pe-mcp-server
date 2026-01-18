# get_qb64pe_processes

**Category**: System Monitoring  
**Description**: List all currently running QB64PE processes and windows  
**Type**: Process Management Tool  

## Overview

The `get_qb64pe_processes` tool provides comprehensive information about currently running QB64PE processes, compiled executables, and associated windows across different operating systems. This tool helps developers and system administrators monitor QB64PE applications, track resource usage, and manage running instances.

The tool detects various types of QB64PE-related processes including the QB64PE IDE, compiled executables, background processes, and development tools. It provides detailed process information including process IDs, memory usage, execution time, command-line arguments, and window states.

## Purpose

This tool serves multiple system monitoring and management functions:

- **Process Discovery**: Identify all running QB64PE-related processes
- **Resource Monitoring**: Track memory usage, CPU consumption, and execution time
- **Development Support**: Monitor compiled programs during development and testing
- **System Management**: Manage and troubleshoot QB64PE applications
- **Debugging Aid**: Assist in debugging multi-process QB64PE applications

## Parameters

This tool takes no parameters and returns information about all currently running QB64PE processes.

## Response Structure

The tool returns comprehensive process information organized by process type:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "platform": "windows",
  "summary": {
    "totalProcesses": 5,
    "qb64peIdeProcesses": 1,
    "compiledExecutables": 3,
    "relatedProcesses": 1,
    "totalMemoryUsage": "156.7 MB",
    "oldestProcess": {
      "pid": 1234,
      "name": "qb64pe.exe",
      "startTime": "2024-01-15T09:15:00Z",
      "runningTime": "1h 15m"
    }
  },
  "processes": [
    {
      "pid": 1234,
      "name": "qb64pe.exe",
      "type": "ide",
      "status": "running",
      "startTime": "2024-01-15T09:15:00Z",
      "runningTime": "1h 15m",
      "memoryUsage": {
        "workingSet": "45.2 MB",
        "privateBytes": "38.7 MB",
        "virtualSize": "152.3 MB"
      },
      "cpuUsage": {
        "current": "0.8%",
        "average": "1.2%",
        "total": "2m 15s"
      },
      "commandLine": "qb64pe.exe",
      "workingDirectory": "C:\\QB64PE",
      "executable": {
        "path": "C:\\QB64PE\\qb64pe.exe",
        "version": "3.8.0",
        "size": "12.4 MB",
        "modified": "2024-01-10T14:30:00Z"
      },
      "window": {
        "exists": true,
        "title": "QB64PE - Phoenix Edition v3.8.0",
        "visible": true,
        "position": {
          "x": 100,
          "y": 50,
          "width": 1200,
          "height": 800
        },
        "state": "normal",
        "focused": true
      },
      "threads": 4,
      "handles": 156,
      "parentPid": null,
      "childProcesses": []
    },
    {
      "pid": 5678,
      "name": "mygame.exe",
      "type": "compiled_executable",
      "status": "running",
      "startTime": "2024-01-15T10:20:00Z",
      "runningTime": "10m",
      "memoryUsage": {
        "workingSet": "28.4 MB",
        "privateBytes": "24.1 MB",
        "virtualSize": "89.7 MB"
      },
      "cpuUsage": {
        "current": "2.1%",
        "average": "3.5%",
        "total": "21s"
      },
      "commandLine": "mygame.exe",
      "workingDirectory": "C:\\Projects\\MyGame",
      "executable": {
        "path": "C:\\Projects\\MyGame\\mygame.exe",
        "version": "1.0.0",
        "size": "2.1 MB",
        "modified": "2024-01-15T10:18:00Z"
      },
      "window": {
        "exists": true,
        "title": "My Awesome Game",
        "visible": true,
        "position": {
          "x": 200,
          "y": 100,
          "width": 800,
          "height": 600
        },
        "state": "normal",
        "focused": false
      },
      "qb64peMetadata": {
        "compiledWith": "QB64PE v3.8.0",
        "compileTime": "2024-01-15T10:18:00Z",
        "sourceFile": "mygame.bas",
        "debugMode": false,
        "optimizationLevel": "O2"
      },
      "threads": 2,
      "handles": 45,
      "parentPid": null,
      "childProcesses": [],
      "networkConnections": [],
      "openFiles": [
        "C:\\Projects\\MyGame\\data\\config.ini",
        "C:\\Projects\\MyGame\\saves\\player.dat"
      ]
    },
    {
      "pid": 9012,
      "name": "graphics_demo.exe",
      "type": "compiled_executable",
      "status": "running",
      "startTime": "2024-01-15T10:25:00Z",
      "runningTime": "5m",
      "memoryUsage": {
        "workingSet": "42.8 MB",
        "privateBytes": "35.2 MB",
        "virtualSize": "98.4 MB"
      },
      "cpuUsage": {
        "current": "5.2%",
        "average": "4.8%",
        "total": "14s"
      },
      "commandLine": "graphics_demo.exe --fullscreen",
      "workingDirectory": "C:\\Projects\\GraphicsDemo",
      "executable": {
        "path": "C:\\Projects\\GraphicsDemo\\graphics_demo.exe",
        "version": "0.5.0",
        "size": "3.7 MB",
        "modified": "2024-01-15T10:24:00Z"
      },
      "window": {
        "exists": true,
        "title": "Graphics Demo - QB64PE",
        "visible": true,
        "position": {
          "x": 0,
          "y": 0,
          "width": 1920,
          "height": 1080
        },
        "state": "maximized",
        "focused": false,
        "fullscreen": true
      },
      "qb64peMetadata": {
        "compiledWith": "QB64PE v3.8.0",
        "compileTime": "2024-01-15T10:24:00Z",
        "sourceFile": "graphics_demo.bas",
        "debugMode": true,
        "optimizationLevel": "O1"
      },
      "threads": 3,
      "handles": 78,
      "parentPid": null,
      "childProcesses": [],
      "networkConnections": [],
      "openFiles": [
        "C:\\Projects\\GraphicsDemo\\assets\\textures\\background.png",
        "C:\\Projects\\GraphicsDemo\\assets\\sounds\\music.wav"
      ],
      "gpuUsage": {
        "current": "12.5%",
        "average": "15.2%",
        "memoryUsed": "128 MB"
      }
    },
    {
      "pid": 3456,
      "name": "console_tool.exe",
      "type": "compiled_executable",
      "status": "running",
      "startTime": "2024-01-15T10:28:00Z",
      "runningTime": "2m",
      "memoryUsage": {
        "workingSet": "8.2 MB",
        "privateBytes": "6.5 MB",
        "virtualSize": "45.1 MB"
      },
      "cpuUsage": {
        "current": "0.1%",
        "average": "0.3%",
        "total": "0.5s"
      },
      "commandLine": "console_tool.exe --input data.txt --output results.txt",
      "workingDirectory": "C:\\Projects\\Tools",
      "executable": {
        "path": "C:\\Projects\\Tools\\console_tool.exe",
        "version": "1.2.0",
        "size": "1.8 MB",
        "modified": "2024-01-15T10:27:00Z"
      },
      "window": {
        "exists": false,
        "consoleWindow": true,
        "title": "console_tool.exe",
        "visible": true
      },
      "qb64peMetadata": {
        "compiledWith": "QB64PE v3.8.0",
        "compileTime": "2024-01-15T10:27:00Z",
        "sourceFile": "console_tool.bas",
        "debugMode": false,
        "optimizationLevel": "Os",
        "consoleMode": true
      },
      "threads": 1,
      "handles": 12,
      "parentPid": 7890,
      "childProcesses": [],
      "networkConnections": [],
      "openFiles": [
        "C:\\Projects\\Tools\\data.txt",
        "C:\\Projects\\Tools\\results.txt"
      ]
    },
    {
      "pid": 7890,
      "name": "qb64pe_build.exe",
      "type": "build_process",
      "status": "running",
      "startTime": "2024-01-15T10:27:00Z",
      "runningTime": "3m",
      "memoryUsage": {
        "workingSet": "32.1 MB",
        "privateBytes": "28.2 MB",
        "virtualSize": "76.5 MB"
      },
      "cpuUsage": {
        "current": "15.2%",
        "average": "22.1%",
        "total": "39s"
      },
      "commandLine": "qb64pe.exe -x -O2 -o console_tool console_tool.bas",
      "workingDirectory": "C:\\Projects\\Tools",
      "executable": {
        "path": "C:\\QB64PE\\qb64pe.exe",
        "version": "3.8.0",
        "size": "12.4 MB",
        "modified": "2024-01-10T14:30:00Z"
      },
      "window": {
        "exists": false,
        "consoleWindow": true,
        "title": "QB64PE Compiler",
        "visible": false
      },
      "buildInfo": {
        "operation": "compile",
        "sourceFile": "console_tool.bas",
        "outputFile": "console_tool.exe",
        "flags": ["-x", "-O2", "-o", "console_tool"],
        "progress": "linking",
        "estimatedCompletion": "30s"
      },
      "threads": 6,
      "handles": 89,
      "parentPid": null,
      "childProcesses": [3456]
    }
  ],
  "processGroups": {
    "development": {
      "processes": [1234, 7890],
      "description": "QB64PE IDE and build processes",
      "totalMemory": "77.3 MB",
      "averageCpu": "8.0%"
    },
    "runtime": {
      "processes": [5678, 9012, 3456],
      "description": "Running compiled executables",
      "totalMemory": "79.4 MB",
      "averageCpu": "2.5%"
    }
  },
  "systemImpact": {
    "totalCpuUsage": "23.4%",
    "totalMemoryUsage": "156.7 MB",
    "totalHandles": 380,
    "totalThreads": 16,
    "diskActivity": "moderate",
    "networkActivity": "low"
  },
  "alerts": [
    {
      "level": "info",
      "process": 9012,
      "message": "High GPU usage detected in graphics_demo.exe",
      "recommendation": "Monitor performance if system becomes unresponsive"
    },
    {
      "level": "warning",
      "process": 7890,
      "message": "Build process running longer than expected",
      "recommendation": "Check compilation progress or consider terminating if stuck"
    }
  ],
  "capabilities": {
    "canTerminate": true,
    "canSuspend": true,
    "canGetDetailedInfo": true,
    "canMonitorRealtime": true,
    "requiresElevation": false
  }
}
```

## Usage Examples

### Basic Process Listing

Get a simple list of all QB64PE processes:

```javascript
const processes = await getQb64peProcesses();

console.log("QB64PE Processes Summary:");
console.log("========================");
console.log(`Platform: ${processes.platform}`);
console.log(`Total Processes: ${processes.summary.totalProcesses}`);
console.log(`Total Memory Usage: ${processes.summary.totalMemoryUsage}`);

console.log("\nRunning Processes:");
processes.processes.forEach(process => {
  console.log(`\n${process.name} (PID: ${process.pid})`);
  console.log(`  Type: ${process.type}`);
  console.log(`  Status: ${process.status}`);
  console.log(`  Memory: ${process.memoryUsage.workingSet}`);
  console.log(`  CPU: ${process.cpuUsage.current}`);
  console.log(`  Running Time: ${process.runningTime}`);
  
  if (process.window && process.window.exists) {
    console.log(`  Window: ${process.window.title} (${process.window.state})`);
  }
});
```

### Process Monitoring Dashboard

Create a real-time monitoring dashboard:

```javascript
class Qb64peProcessMonitor {
  constructor() {
    this.processes = new Map();
    this.monitoring = false;
    this.updateInterval = 5000; // 5 seconds
  }
  
  async startMonitoring() {
    this.monitoring = true;
    console.log("Starting QB64PE process monitoring...");
    
    while (this.monitoring) {
      try {
        const currentProcesses = await getQb64peProcesses();
        this.updateProcessInfo(currentProcesses);
        this.displayDashboard(currentProcesses);
        
        await this.sleep(this.updateInterval);
        
      } catch (error) {
        console.error("Monitoring error:", error);
        await this.sleep(this.updateInterval);
      }
    }
  }
  
  stopMonitoring() {
    this.monitoring = false;
    console.log("Stopping QB64PE process monitoring...");
  }
  
  updateProcessInfo(currentProcesses) {
    // Track process changes
    const currentPids = new Set(currentProcesses.processes.map(p => p.pid));
    const previousPids = new Set(this.processes.keys());
    
    // Detect new processes
    const newProcesses = currentProcesses.processes.filter(p => !previousPids.has(p.pid));
    const terminatedProcesses = Array.from(previousPids).filter(pid => !currentPids.has(pid));
    
    // Log changes
    newProcesses.forEach(process => {
      console.log(`🆕 New process started: ${process.name} (PID: ${process.pid})`);
    });
    
    terminatedProcesses.forEach(pid => {
      const process = this.processes.get(pid);
      console.log(`🔚 Process terminated: ${process.name} (PID: ${pid})`);
    });
    
    // Update process map
    this.processes.clear();
    currentProcesses.processes.forEach(process => {
      this.processes.set(process.pid, process);
    });
  }
  
  displayDashboard(processInfo) {
    console.clear();
    console.log("QB64PE Process Monitor Dashboard");
    console.log("================================");
    console.log(`Update Time: ${new Date().toLocaleTimeString()}`);
    console.log(`Platform: ${processInfo.platform}`);
    console.log();
    
    // Summary section
    console.log("SUMMARY:");
    console.log(`  Total Processes: ${processInfo.summary.totalProcesses}`);
    console.log(`  Memory Usage: ${processInfo.summary.totalMemoryUsage}`);
    console.log(`  CPU Usage: ${processInfo.systemImpact.totalCpuUsage}`);
    console.log(`  Threads: ${processInfo.systemImpact.totalThreads}`);
    console.log(`  Handles: ${processInfo.systemImpact.totalHandles}`);
    console.log();
    
    // Process groups
    console.log("PROCESS GROUPS:");
    Object.entries(processInfo.processGroups).forEach(([groupName, group]) => {
      console.log(`  ${groupName.toUpperCase()}:`);
      console.log(`    Processes: ${group.processes.length}`);
      console.log(`    Memory: ${group.totalMemory}`);
      console.log(`    Avg CPU: ${group.averageCpu}`);
    });
    console.log();
    
    // Active processes
    console.log("ACTIVE PROCESSES:");
    processInfo.processes.forEach(process => {
      const indicator = this.getProcessIndicator(process);
      console.log(`  ${indicator} ${process.name} (${process.pid})`);
      console.log(`      Type: ${process.type} | Memory: ${process.memoryUsage.workingSet} | CPU: ${process.cpuUsage.current}`);
      
      if (process.window && process.window.exists) {
        console.log(`      Window: ${process.window.title} [${process.window.state}]`);
      }
      
      if (process.qb64peMetadata) {
        console.log(`      Source: ${process.qb64peMetadata.sourceFile} | Debug: ${process.qb64peMetadata.debugMode}`);
      }
    });
    console.log();
    
    // Alerts
    if (processInfo.alerts && processInfo.alerts.length > 0) {
      console.log("ALERTS:");
      processInfo.alerts.forEach(alert => {
        const icon = alert.level === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`  ${icon} ${alert.message}`);
        console.log(`      Recommendation: ${alert.recommendation}`);
      });
      console.log();
    }
    
    console.log("Press Ctrl+C to stop monitoring");
  }
  
  getProcessIndicator(process) {
    if (process.type === 'ide') return '🔧';
    if (process.type === 'compiled_executable') return '🎮';
    if (process.type === 'build_process') return '⚙️';
    return '📋';
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const monitor = new Qb64peProcessMonitor();

// Start monitoring
monitor.startMonitoring();

// Stop monitoring after 60 seconds (example)
setTimeout(() => {
  monitor.stopMonitoring();
}, 60000);
```

### Process Management Tools

Create tools for managing QB64PE processes:

```javascript
class Qb64peProcessManager {
  constructor() {
    this.processes = new Map();
  }
  
  async refreshProcessList() {
    const processInfo = await getQb64peProcesses();
    this.processes.clear();
    
    processInfo.processes.forEach(process => {
      this.processes.set(process.pid, process);
    });
    
    return processInfo;
  }
  
  async getProcessByName(name) {
    await this.refreshProcessList();
    return Array.from(this.processes.values()).filter(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  async getProcessByType(type) {
    await this.refreshProcessList();
    return Array.from(this.processes.values()).filter(p => p.type === type);
  }
  
  async getHighResourceProcesses(cpuThreshold = 10, memoryThreshold = 100) {
    await this.refreshProcessList();
    
    return Array.from(this.processes.values()).filter(process => {
      const cpuUsage = parseFloat(process.cpuUsage.current.replace('%', ''));
      const memoryUsage = parseFloat(process.memoryUsage.workingSet.replace(' MB', ''));
      
      return cpuUsage > cpuThreshold || memoryUsage > memoryThreshold;
    });
  }
  
  async getLongRunningProcesses(hoursThreshold = 2) {
    await this.refreshProcessList();
    const now = new Date();
    
    return Array.from(this.processes.values()).filter(process => {
      const startTime = new Date(process.startTime);
      const hoursRunning = (now - startTime) / (1000 * 60 * 60);
      
      return hoursRunning > hoursThreshold;
    });
  }
  
  async getCompiledExecutables() {
    return await this.getProcessByType('compiled_executable');
  }
  
  async getQb64peIdeProcesses() {
    return await this.getProcessByType('ide');
  }
  
  async getBuildProcesses() {
    return await this.getProcessByType('build_process');
  }
  
  async generateProcessReport() {
    const processInfo = await this.refreshProcessList();
    
    const report = {
      timestamp: new Date(),
      summary: processInfo.summary,
      analysis: {
        ideInstances: await this.getQb64peIdeProcesses(),
        runningPrograms: await this.getCompiledExecutables(),
        buildProcesses: await this.getBuildProcesses(),
        highResourceUsage: await this.getHighResourceProcesses(),
        longRunning: await this.getLongRunningProcesses()
      },
      recommendations: []
    };
    
    // Generate recommendations
    if (report.analysis.ideInstances.length > 1) {
      report.recommendations.push({
        type: 'performance',
        message: `Multiple QB64PE IDE instances (${report.analysis.ideInstances.length}) are running`,
        suggestion: 'Consider closing unused IDE instances to free memory'
      });
    }
    
    if (report.analysis.highResourceUsage.length > 0) {
      report.recommendations.push({
        type: 'resource',
        message: `${report.analysis.highResourceUsage.length} processes using high resources`,
        suggestion: 'Monitor these processes for performance impact'
      });
    }
    
    if (report.analysis.longRunning.length > 0) {
      report.recommendations.push({
        type: 'maintenance',
        message: `${report.analysis.longRunning.length} processes running for extended periods`,
        suggestion: 'Consider restarting long-running processes if experiencing issues'
      });
    }
    
    return report;
  }
  
  formatProcessReport(report) {
    const lines = [];
    
    lines.push("QB64PE Process Report");
    lines.push("====================");
    lines.push(`Generated: ${report.timestamp.toLocaleString()}`);
    lines.push("");
    
    // Summary
    lines.push("SUMMARY:");
    lines.push(`  Total Processes: ${report.summary.totalProcesses}`);
    lines.push(`  Memory Usage: ${report.summary.totalMemoryUsage}`);
    lines.push(`  Oldest Process: ${report.summary.oldestProcess.name} (${report.summary.oldestProcess.runningTime})`);
    lines.push("");
    
    // Analysis
    lines.push("ANALYSIS:");
    lines.push(`  IDE Instances: ${report.analysis.ideInstances.length}`);
    lines.push(`  Running Programs: ${report.analysis.runningPrograms.length}`);
    lines.push(`  Build Processes: ${report.analysis.buildProcesses.length}`);
    lines.push(`  High Resource Usage: ${report.analysis.highResourceUsage.length}`);
    lines.push(`  Long Running: ${report.analysis.longRunning.length}`);
    lines.push("");
    
    // Detailed sections
    if (report.analysis.runningPrograms.length > 0) {
      lines.push("RUNNING PROGRAMS:");
      report.analysis.runningPrograms.forEach(process => {
        lines.push(`  📱 ${process.name} (${process.pid})`);
        lines.push(`     Memory: ${process.memoryUsage.workingSet} | CPU: ${process.cpuUsage.current}`);
        lines.push(`     Source: ${process.qb64peMetadata?.sourceFile || 'Unknown'}`);
        if (process.window && process.window.exists) {
          lines.push(`     Window: ${process.window.title}`);
        }
      });
      lines.push("");
    }
    
    if (report.analysis.highResourceUsage.length > 0) {
      lines.push("HIGH RESOURCE USAGE:");
      report.analysis.highResourceUsage.forEach(process => {
        lines.push(`  ⚡ ${process.name} (${process.pid})`);
        lines.push(`     Memory: ${process.memoryUsage.workingSet} | CPU: ${process.cpuUsage.current}`);
        lines.push(`     Running: ${process.runningTime}`);
      });
      lines.push("");
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
      lines.push("RECOMMENDATIONS:");
      report.recommendations.forEach((rec, index) => {
        lines.push(`  ${index + 1}. ${rec.message}`);
        lines.push(`     Suggestion: ${rec.suggestion}`);
      });
      lines.push("");
    }
    
    return lines.join('\n');
  }
}

// Usage
const processManager = new Qb64peProcessManager();

// Get all compiled executables
const executables = await processManager.getCompiledExecutables();
console.log("Running QB64PE Programs:");
executables.forEach(exe => {
  console.log(`- ${exe.name}: ${exe.window?.title || 'No window'}`);
});

// Generate and display report
const report = await processManager.generateProcessReport();
console.log(processManager.formatProcessReport(report));

// Find high resource usage processes
const highUsage = await processManager.getHighResourceProcesses(5, 50);
if (highUsage.length > 0) {
  console.log("\nHigh Resource Usage Processes:");
  highUsage.forEach(process => {
    console.log(`⚠️ ${process.name}: ${process.cpuUsage.current} CPU, ${process.memoryUsage.workingSet} RAM`);
  });
}
```

### Development Environment Monitor

Monitor QB64PE development environment:

```javascript
class DevelopmentMonitor {
  constructor() {
    this.sessionStart = new Date();
    this.processHistory = [];
    this.alerts = [];
  }
  
  async monitorDevelopmentSession() {
    const processes = await getQb64peProcesses();
    
    const sessionInfo = {
      sessionDuration: this.calculateSessionDuration(),
      ideProcesses: processes.processes.filter(p => p.type === 'ide'),
      compiledPrograms: processes.processes.filter(p => p.type === 'compiled_executable'),
      buildProcesses: processes.processes.filter(p => p.type === 'build_process'),
      systemHealth: this.assessSystemHealth(processes),
      productivity: this.assessProductivity(processes)
    };
    
    // Track process history
    this.processHistory.push({
      timestamp: new Date(),
      processCount: processes.summary.totalProcesses,
      memoryUsage: processes.summary.totalMemoryUsage,
      processes: processes.processes.map(p => ({
        pid: p.pid,
        name: p.name,
        type: p.type,
        memory: p.memoryUsage.workingSet,
        cpu: p.cpuUsage.current
      }))
    });
    
    // Keep only last 100 entries
    if (this.processHistory.length > 100) {
      this.processHistory = this.processHistory.slice(-100);
    }
    
    return sessionInfo;
  }
  
  calculateSessionDuration() {
    const now = new Date();
    const duration = now - this.sessionStart;
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
  
  assessSystemHealth(processes) {
    const health = {
      status: 'good',
      issues: [],
      metrics: {
        totalMemory: processes.summary.totalMemoryUsage,
        processCount: processes.summary.totalProcesses,
        alerts: processes.alerts?.length || 0
      }
    };
    
    // Check for issues
    const totalMemoryMB = parseFloat(processes.summary.totalMemoryUsage.replace(' MB', ''));
    if (totalMemoryMB > 500) {
      health.status = 'warning';
      health.issues.push('High memory usage detected');
    }
    
    if (processes.summary.totalProcesses > 10) {
      health.status = 'warning';
      health.issues.push('Many QB64PE processes running');
    }
    
    if (processes.alerts && processes.alerts.length > 2) {
      health.status = 'warning';
      health.issues.push('Multiple system alerts');
    }
    
    return health;
  }
  
  assessProductivity(processes) {
    const ideProcesses = processes.processes.filter(p => p.type === 'ide');
    const buildProcesses = processes.processes.filter(p => p.type === 'build_process');
    const runningPrograms = processes.processes.filter(p => p.type === 'compiled_executable');
    
    return {
      ideActive: ideProcesses.length > 0,
      currentlyBuilding: buildProcesses.length > 0,
      programsRunning: runningPrograms.length,
      multiTasking: ideProcesses.length > 1,
      developmentActivity: ideProcesses.length > 0 || buildProcesses.length > 0 ? 'active' : 'idle'
    };
  }
  
  generateDevelopmentReport() {
    const report = {
      sessionSummary: {
        startTime: this.sessionStart,
        duration: this.calculateSessionDuration(),
        historyEntries: this.processHistory.length
      },
      currentStatus: null,
      trends: this.analyzeTrends(),
      recommendations: []
    };
    
    return report;
  }
  
  analyzeTrends() {
    if (this.processHistory.length < 2) {
      return { insufficient_data: true };
    }
    
    const recent = this.processHistory.slice(-10);
    const older = this.processHistory.slice(-20, -10);
    
    const recentAvgProcesses = recent.reduce((sum, entry) => sum + entry.processCount, 0) / recent.length;
    const olderAvgProcesses = older.length > 0 ? older.reduce((sum, entry) => sum + entry.processCount, 0) / older.length : recentAvgProcesses;
    
    const processCountTrend = recentAvgProcesses > olderAvgProcesses ? 'increasing' : 
                             recentAvgProcesses < olderAvgProcesses ? 'decreasing' : 'stable';
    
    return {
      processCount: {
        trend: processCountTrend,
        current: recentAvgProcesses,
        previous: olderAvgProcesses
      },
      memoryUsage: {
        trend: this.calculateMemoryTrend(recent, older)
      },
      activityLevel: this.calculateActivityLevel(recent)
    };
  }
  
  calculateMemoryTrend(recent, older) {
    const extractMemory = (entries) => {
      return entries.map(entry => parseFloat(entry.memoryUsage.replace(' MB', '')));
    };
    
    const recentMemory = extractMemory(recent);
    const olderMemory = older.length > 0 ? extractMemory(older) : recentMemory;
    
    const recentAvg = recentMemory.reduce((sum, val) => sum + val, 0) / recentMemory.length;
    const olderAvg = olderMemory.reduce((sum, val) => sum + val, 0) / olderMemory.length;
    
    return recentAvg > olderAvg ? 'increasing' : 
           recentAvg < olderAvg ? 'decreasing' : 'stable';
  }
  
  calculateActivityLevel(recent) {
    const buildActivity = recent.filter(entry => 
      entry.processes.some(p => p.type === 'build_process')
    ).length;
    
    const ideActivity = recent.filter(entry => 
      entry.processes.some(p => p.type === 'ide')
    ).length;
    
    if (buildActivity > recent.length * 0.5) return 'high';
    if (ideActivity > recent.length * 0.7) return 'medium';
    return 'low';
  }
}

// Usage
const devMonitor = new DevelopmentMonitor();

// Monitor development session
setInterval(async () => {
  const sessionInfo = await devMonitor.monitorDevelopmentSession();
  
  console.log("\nDevelopment Session Status:");
  console.log(`Duration: ${sessionInfo.sessionDuration}`);
  console.log(`IDE Processes: ${sessionInfo.ideProcesses.length}`);
  console.log(`Running Programs: ${sessionInfo.compiledPrograms.length}`);
  console.log(`Build Processes: ${sessionInfo.buildProcesses.length}`);
  console.log(`System Health: ${sessionInfo.systemHealth.status}`);
  console.log(`Development Activity: ${sessionInfo.productivity.developmentActivity}`);
  
  if (sessionInfo.systemHealth.issues.length > 0) {
    console.log("Issues:");
    sessionInfo.systemHealth.issues.forEach(issue => {
      console.log(`  ⚠️ ${issue}`);
    });
  }
}, 10000); // Update every 10 seconds
```

## Integration Workflows

### System Administration Integration

```javascript
class SystemAdminTools {
  constructor() {
    this.alertThresholds = {
      memoryUsage: 200, // MB
      cpuUsage: 20,     // %
      processCount: 8,
      runningTime: 4    // hours
    };
  }
  
  async performSystemCheck() {
    const processes = await getQb64peProcesses();
    
    const systemCheck = {
      timestamp: new Date(),
      status: 'healthy',
      issues: [],
      recommendations: [],
      processes: processes,
      metrics: this.calculateSystemMetrics(processes)
    };
    
    // Check thresholds
    this.checkMemoryThreshold(systemCheck);
    this.checkCpuThreshold(systemCheck);
    this.checkProcessCountThreshold(systemCheck);
    this.checkLongRunningProcesses(systemCheck);
    
    return systemCheck;
  }
  
  checkMemoryThreshold(systemCheck) {
    const totalMemoryMB = parseFloat(systemCheck.processes.summary.totalMemoryUsage.replace(' MB', ''));
    
    if (totalMemoryMB > this.alertThresholds.memoryUsage) {
      systemCheck.status = 'warning';
      systemCheck.issues.push({
        type: 'memory',
        severity: 'warning',
        message: `QB64PE processes using ${totalMemoryMB}MB memory (threshold: ${this.alertThresholds.memoryUsage}MB)`,
        processes: systemCheck.processes.processes.filter(p => 
          parseFloat(p.memoryUsage.workingSet.replace(' MB', '')) > 50
        )
      });
      
      systemCheck.recommendations.push({
        action: 'Consider closing unnecessary QB64PE processes',
        priority: 'medium',
        impact: 'Reduce system memory pressure'
      });
    }
  }
  
  checkCpuThreshold(systemCheck) {
    const highCpuProcesses = systemCheck.processes.processes.filter(p => 
      parseFloat(p.cpuUsage.current.replace('%', '')) > this.alertThresholds.cpuUsage
    );
    
    if (highCpuProcesses.length > 0) {
      systemCheck.status = 'warning';
      systemCheck.issues.push({
        type: 'cpu',
        severity: 'warning',
        message: `${highCpuProcesses.length} processes using high CPU`,
        processes: highCpuProcesses
      });
      
      systemCheck.recommendations.push({
        action: 'Monitor high CPU processes for performance impact',
        priority: 'medium',
        impact: 'Prevent system slowdown'
      });
    }
  }
  
  generateSystemReport(systemCheck) {
    const report = [];
    
    report.push("QB64PE System Administration Report");
    report.push("===================================");
    report.push(`Generated: ${systemCheck.timestamp.toLocaleString()}`);
    report.push(`System Status: ${systemCheck.status.toUpperCase()}`);
    report.push("");
    
    // System metrics
    report.push("SYSTEM METRICS:");
    report.push(`  Total Memory Usage: ${systemCheck.processes.summary.totalMemoryUsage}`);
    report.push(`  Total CPU Usage: ${systemCheck.processes.systemImpact.totalCpuUsage}`);
    report.push(`  Active Processes: ${systemCheck.processes.summary.totalProcesses}`);
    report.push(`  Total Threads: ${systemCheck.processes.systemImpact.totalThreads}`);
    report.push(`  Total Handles: ${systemCheck.processes.systemImpact.totalHandles}`);
    report.push("");
    
    // Issues
    if (systemCheck.issues.length > 0) {
      report.push("ISSUES DETECTED:");
      systemCheck.issues.forEach((issue, index) => {
        report.push(`  ${index + 1}. ${issue.message} (${issue.severity})`);
        if (issue.processes && issue.processes.length > 0) {
          report.push("     Affected processes:");
          issue.processes.forEach(proc => {
            report.push(`       - ${proc.name} (${proc.pid}): ${proc.memoryUsage.workingSet}, ${proc.cpuUsage.current}`);
          });
        }
      });
      report.push("");
    }
    
    // Recommendations
    if (systemCheck.recommendations.length > 0) {
      report.push("RECOMMENDATIONS:");
      systemCheck.recommendations.forEach((rec, index) => {
        report.push(`  ${index + 1}. ${rec.action} (${rec.priority} priority)`);
        report.push(`     Impact: ${rec.impact}`);
      });
      report.push("");
    }
    
    // Process details
    report.push("PROCESS DETAILS:");
    systemCheck.processes.processes.forEach(process => {
      report.push(`  📋 ${process.name} (${process.pid})`);
      report.push(`     Type: ${process.type}`);
      report.push(`     Memory: ${process.memoryUsage.workingSet}`);
      report.push(`     CPU: ${process.cpuUsage.current}`);
      report.push(`     Running: ${process.runningTime}`);
      report.push(`     Threads: ${process.threads}`);
      
      if (process.window && process.window.exists) {
        report.push(`     Window: ${process.window.title}`);
      }
      
      if (process.qb64peMetadata) {
        report.push(`     Source: ${process.qb64peMetadata.sourceFile}`);
        report.push(`     Compiled: ${process.qb64peMetadata.compileTime}`);
      }
      
      report.push("");
    });
    
    return report.join('\n');
  }
}
```

### Automated Testing Integration

```javascript
class TestEnvironmentMonitor {
  constructor() {
    this.testSessions = new Map();
    this.processSnapshots = [];
  }
  
  async startTestSession(testName) {
    const sessionId = `test_${Date.now()}`;
    const startSnapshot = await getQb64peProcesses();
    
    this.testSessions.set(sessionId, {
      testName: testName,
      startTime: new Date(),
      startSnapshot: startSnapshot,
      endSnapshot: null,
      duration: null,
      processChanges: []
    });
    
    console.log(`Started test session: ${testName} (${sessionId})`);
    return sessionId;
  }
  
  async endTestSession(sessionId) {
    const session = this.testSessions.get(sessionId);
    if (!session) {
      throw new Error(`Test session not found: ${sessionId}`);
    }
    
    const endSnapshot = await getQb64peProcesses();
    session.endSnapshot = endSnapshot;
    session.duration = new Date() - session.startTime;
    
    // Analyze process changes
    session.processChanges = this.analyzeProcessChanges(
      session.startSnapshot,
      session.endSnapshot
    );
    
    console.log(`Ended test session: ${session.testName} (duration: ${session.duration}ms)`);
    return session;
  }
  
  analyzeProcessChanges(startSnapshot, endSnapshot) {
    const startPids = new Set(startSnapshot.processes.map(p => p.pid));
    const endPids = new Set(endSnapshot.processes.map(p => p.pid));
    
    const newProcesses = endSnapshot.processes.filter(p => !startPids.has(p.pid));
    const terminatedPids = Array.from(startPids).filter(pid => !endPids.has(pid));
    const continuingProcesses = endSnapshot.processes.filter(p => startPids.has(p.pid));
    
    return {
      newProcesses: newProcesses,
      terminatedProcesses: terminatedPids.map(pid => 
        startSnapshot.processes.find(p => p.pid === pid)
      ),
      continuingProcesses: continuingProcesses,
      summary: {
        processesCreated: newProcesses.length,
        processesTerminated: terminatedPids.length,
        processesContinuing: continuingProcesses.length
      }
    };
  }
  
  generateTestReport(sessionId) {
    const session = this.testSessions.get(sessionId);
    if (!session) {
      throw new Error(`Test session not found: ${sessionId}`);
    }
    
    const report = {
      testName: session.testName,
      sessionId: sessionId,
      duration: session.duration,
      startTime: session.startTime,
      endTime: new Date(session.startTime.getTime() + session.duration),
      processAnalysis: session.processChanges,
      resourceUsage: this.analyzeResourceUsage(session),
      testResult: this.determineTestResult(session)
    };
    
    return report;
  }
  
  analyzeResourceUsage(session) {
    const startUsage = this.extractResourceUsage(session.startSnapshot);
    const endUsage = this.extractResourceUsage(session.endSnapshot);
    
    return {
      memoryStart: startUsage.memory,
      memoryEnd: endUsage.memory,
      memoryDelta: endUsage.memory - startUsage.memory,
      processCountStart: startUsage.processCount,
      processCountEnd: endUsage.processCount,
      processCountDelta: endUsage.processCount - startUsage.processCount
    };
  }
  
  extractResourceUsage(snapshot) {
    const totalMemoryMB = parseFloat(snapshot.summary.totalMemoryUsage.replace(' MB', ''));
    
    return {
      memory: totalMemoryMB,
      processCount: snapshot.summary.totalProcesses
    };
  }
  
  determineTestResult(session) {
    const changes = session.processChanges;
    
    // Determine if test passed based on process behavior
    const hasUnexpectedProcesses = changes.newProcesses.some(p => 
      p.type === 'compiled_executable' && !p.qb64peMetadata
    );
    
    const hasOrphanedProcesses = changes.continuingProcesses.some(p => 
      p.type === 'compiled_executable' && 
      new Date() - new Date(p.startTime) > session.duration + 5000 // 5s grace period
    );
    
    if (hasUnexpectedProcesses || hasOrphanedProcesses) {
      return {
        status: 'failed',
        reason: 'Process management issues detected',
        issues: []
      };
    }
    
    return {
      status: 'passed',
      reason: 'Clean process management'
    };
  }
}
```

## Error Handling

The tool provides robust error handling for system-level operations:

### Process Access Errors

```javascript
const handleProcessAccessError = (error) => {
  return {
    error: true,
    type: 'access_denied',
    message: 'Insufficient permissions to access process information',
    suggestion: 'Run with elevated privileges for complete process information',
    partialData: true
  };
};
```

### Platform Compatibility

```javascript
const handlePlatformDifferences = (platform) => {
  const platformCapabilities = {
    windows: {
      canGetDetailedInfo: true,
      canTerminate: true,
      canSuspend: true,
      requiresElevation: false
    },
    macos: {
      canGetDetailedInfo: true,
      canTerminate: true,
      canSuspend: false,
      requiresElevation: true
    },
    linux: {
      canGetDetailedInfo: true,
      canTerminate: true,
      canSuspend: true,
      requiresElevation: false
    }
  };
  
  return platformCapabilities[platform] || platformCapabilities.linux;
};
```

### Process Detection Failures

```javascript
const handleDetectionFailure = (error) => {
  return {
    timestamp: new Date().toISOString(),
    platform: process.platform,
    summary: {
      totalProcesses: 0,
      qb64peIdeProcesses: 0,
      compiledExecutables: 0,
      relatedProcesses: 0,
      totalMemoryUsage: "0 MB"
    },
    processes: [],
    error: {
      type: 'detection_failed',
      message: error.message,
      suggestion: 'Check system permissions and QB64PE installation'
    }
  };
};
```

## Best Practices

### 1. Regular Monitoring

Monitor processes regularly during development:

```javascript
// Good: Regular monitoring with appropriate intervals
const monitorDevelopment = async () => {
  setInterval(async () => {
    const processes = await getQb64peProcesses();
    
    // Check for issues
    const highMemoryProcesses = processes.processes.filter(p => 
      parseFloat(p.memoryUsage.workingSet.replace(' MB', '')) > 100
    );
    
    if (highMemoryProcesses.length > 0) {
      console.log('High memory usage detected:', highMemoryProcesses.map(p => p.name));
    }
  }, 30000); // Every 30 seconds
};
```

### 2. Resource Threshold Management

Set appropriate thresholds for different environments:

```javascript
// Good: Environment-appropriate thresholds
const getThresholds = (environment) => {
  const thresholds = {
    development: { memory: 200, cpu: 20, processes: 10 },
    testing: { memory: 100, cpu: 15, processes: 5 },
    production: { memory: 50, cpu: 10, processes: 3 }
  };
  
  return thresholds[environment] || thresholds.development;
};
```

### 3. Process Cleanup

Ensure proper cleanup of orphaned processes:

```javascript
// Good: Systematic cleanup approach
const cleanupOrphanedProcesses = async () => {
  const processes = await getQb64peProcesses();
  
  // Identify orphaned processes (running longer than expected)
  const orphanedProcesses = processes.processes.filter(process => {
    const runningHours = this.parseRunningTime(process.runningTime);
    return runningHours > 8 && process.type === 'compiled_executable';
  });
  
  // Log and optionally terminate
  orphanedProcesses.forEach(process => {
    console.log(`Orphaned process detected: ${process.name} (${process.runningTime})`);
  });
};
```

### 4. Performance Impact Minimization

Minimize the performance impact of monitoring:

```javascript
// Good: Efficient monitoring approach
const efficientMonitoring = async () => {
  // Cache results for short periods
  let cachedProcesses = null;
  let cacheTime = null;
  const CACHE_DURATION = 5000; // 5 seconds
  
  const getProcesses = async () => {
    const now = Date.now();
    
    if (cachedProcesses && cacheTime && (now - cacheTime) < CACHE_DURATION) {
      return cachedProcesses;
    }
    
    cachedProcesses = await getQb64peProcesses();
    cacheTime = now;
    
    return cachedProcesses;
  };
  
  return getProcesses;
};
```

## Cross-References

- **[get_process_monitoring_commands](./get_process_monitoring_commands.md)** - Process monitoring commands
- **[get_file_monitoring_commands](./get_file_monitoring_commands.md)** - File monitoring commands  
- **[get_automation_status](./get_automation_status.md)** - Automation status
- **[parse_console_output](./parse_console_output.md)** - Console output parsing
- **[generate_monitoring_template](./generate_monitoring_template.md)** - Monitoring templates

## See Also

- [QB64PE Execution Monitoring Guide](../docs/QB64PE_EXECUTION_MONITORING.md)
- [System Administration Guide](../docs/SYSTEM_ADMINISTRATION.md)
- [Development Environment Setup](../docs/DEVELOPMENT_ENVIRONMENT.md)
