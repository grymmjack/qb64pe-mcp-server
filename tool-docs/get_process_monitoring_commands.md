# get_process_monitoring_commands

Gets cross-platform commands for monitoring QB64PE processes.

## Description

This tool provides platform-specific shell commands for monitoring QB64PE processes, including checking if programs are running, monitoring resource usage, and terminating processes when necessary. It's essential for automated process management and debugging.

## Parameters

- **platform** (optional): Target platform - "windows", "linux", "macos", "current" (default: "current")
- **processName** (optional): Process name to monitor (default: "qb64pe")

## Usage

### Get Commands for Current Platform
```typescript
const commands = await mcp_qb64pe_get_process_monitoring_commands();
```

### Get Commands for Specific Platform
```typescript
const commands = await mcp_qb64pe_get_process_monitoring_commands({
  platform: "windows",
  processName: "qb64pe"
});
```

### Monitor Custom Process Name
```typescript
const commands = await mcp_qb64pe_get_process_monitoring_commands({
  processName: "my-qb64pe-program"
});
```

## Response Format

```typescript
{
  platform: string,
  processName: string,
  monitoring: {
    commands: string[],
    description: string
  },
  termination: {
    commands: string[],
    description: string
  },
  examples?: {
    listProcesses: string,
    checkSpecific: string,
    killProcess: string
  }
}
```

## Platform-Specific Commands

### Windows
Comprehensive Windows process monitoring using multiple tools:

**Monitoring Commands:**
```cmd
tasklist /FI "IMAGENAME eq qb64pe*" /FO CSV
wmic process where "CommandLine like '%qb64pe%'" get ProcessId,CommandLine,WorkingSetSize,UserModeTime
powershell "Get-Process | Where-Object {$_.ProcessName -like '*qb64pe*'} | Select-Object Id,Name,CPU,WorkingSet,StartTime"
```

**Termination Commands:**
```cmd
taskkill /PID {pid} /T          # Graceful termination
taskkill /PID {pid} /F /T       # Force termination
```

**Features:**
- CSV output for easy parsing
- Detailed process information including memory usage
- PowerShell integration for advanced filtering
- Tree termination (includes child processes)

### Linux
Standard Unix process management tools:

**Monitoring Commands:**
```bash
ps aux | grep qb64pe
pgrep -f qb64pe
top -p $(pgrep -d, qb64pe) -n 1
```

**Termination Commands:**
```bash
kill {pid}                      # Graceful termination
kill -9 {pid}                   # Force termination
pkill -f qb64pe                 # Kill by name pattern
```

**Features:**
- Standard Unix ps output
- Pattern-based process finding
- Resource monitoring with top
- Signal-based termination

### macOS
Similar to Linux with macOS-specific enhancements:

**Monitoring Commands:**
```bash
ps aux | grep qb64pe
pgrep -f qb64pe
top -pid $(pgrep qb64pe) -l 1
```

**Termination Commands:**
```bash
kill {pid}                      # Graceful termination
kill -9 {pid}                   # Force termination
pkill -f qb64pe                 # Kill by name pattern
```

**Features:**
- macOS-compatible ps flags
- Native process filtering
- Activity Monitor integration
- Launchd awareness

## Monitoring Examples

### Check if QB64PE is Running
```bash
# Windows
tasklist /FI "IMAGENAME eq qb64pe.exe" | find "qb64pe"

# Linux/macOS
pgrep qb64pe > /dev/null && echo "Running" || echo "Not running"
```

### Get Process Details
```bash
# Windows
wmic process where "name='qb64pe.exe'" get ProcessId,CommandLine,WorkingSetSize

# Linux
ps aux | grep qb64pe | grep -v grep

# macOS
ps aux | grep qb64pe | grep -v grep
```

### Monitor Resource Usage
```bash
# Windows
powershell "Get-Process qb64pe | Select-Object CPU,WorkingSet"

# Linux
top -p $(pgrep qb64pe) -n 1 | tail -n +8

# macOS
top -pid $(pgrep qb64pe) -l 1 | tail -n +13
```

## Automation Integration

### Process Monitoring Script
```bash
#!/bin/bash
# monitor-qb64pe-processes.sh

PROCESS_NAME="${1:-qb64pe}"
INTERVAL="${2:-5}"

echo "Monitoring $PROCESS_NAME processes every $INTERVAL seconds"
echo "Press Ctrl+C to stop"

while true; do
    echo "=== $(date) ==="
    pgrep -f "$PROCESS_NAME" | while read pid; do
        echo "PID: $pid"
        ps -p $pid -o pid,cpu,mem,time,cmd
    done
    echo ""
    sleep $INTERVAL
done
```

### PowerShell Monitoring Script
```powershell
# Monitor-QB64PE.ps1
param(
    [string]$ProcessName = "qb64pe",
    [int]$Interval = 5
)

Write-Host "Monitoring $ProcessName processes every $Interval seconds"
Write-Host "Press Ctrl+C to stop"

while ($true) {
    Write-Host "=== $(Get-Date) ==="
    
    $processes = Get-Process | Where-Object {$_.ProcessName -like "*$ProcessName*"}
    
    if ($processes) {
        $processes | Select-Object Id,Name,CPU,WorkingSet,StartTime | Format-Table
    } else {
        Write-Host "No $ProcessName processes found"
    }
    
    Start-Sleep $Interval
}
```

## Use Cases

### Development Debugging
```typescript
// Check if compiled program is running
const commands = await mcp_qb64pe_get_process_monitoring_commands({
  processName: "my-program"
});

// Use monitoring commands to track execution
console.log("Check status:", commands.monitoring.commands[0]);
```

### Automated Testing
```typescript
// Monitor test execution
const commands = await mcp_qb64pe_get_process_monitoring_commands({
  platform: "current",
  processName: "test-runner"
});

// Kill hanging test processes
console.log("Cleanup command:", commands.termination.commands[1]);
```

### Performance Monitoring
```typescript
// Track resource usage during execution
const commands = await mcp_qb64pe_get_process_monitoring_commands();

// Run monitoring command periodically
setInterval(() => {
  exec(commands.monitoring.commands[2]); // PowerShell detailed info
}, 10000);
```

## Advanced Monitoring

### Memory Usage Tracking
```bash
# Linux - track memory over time
while true; do
    pid=$(pgrep qb64pe)
    if [ ! -z "$pid" ]; then
        echo "$(date): $(ps -p $pid -o pid,vsz,rss,pcpu --no-headers)"
    fi
    sleep 5
done
```

### CPU Usage Monitoring
```bash
# Monitor CPU usage with timestamps
top -p $(pgrep qb64pe) -d 5 -b | grep qb64pe | while read line; do
    echo "$(date): $line"
done
```

### Process Tree Monitoring
```bash
# Show process hierarchy
pstree -p $(pgrep qb64pe)

# Windows equivalent
wmic process where "name='qb64pe.exe'" get ProcessId,ParentProcessId,CommandLine
```

## Error Handling

### Process Not Found
```bash
# Check if process exists before monitoring
if ! pgrep qb64pe > /dev/null; then
    echo "QB64PE process not found"
    exit 1
fi
```

### Permission Issues
```bash
# Check permissions for process access
if ! ps -p $(pgrep qb64pe) > /dev/null 2>&1; then
    echo "Cannot access process information"
    exit 1
fi
```

### Multiple Processes
```bash
# Handle multiple QB64PE processes
pgrep qb64pe | while read pid; do
    echo "Monitoring PID: $pid"
    ps -p $pid -o pid,cmd
done
```

## Best Practices

1. **Use appropriate tools**: Choose the right command for your monitoring needs
2. **Handle multiple processes**: Account for multiple QB64PE instances
3. **Monitor resource usage**: Track CPU and memory to detect issues
4. **Graceful termination**: Try normal termination before forcing
5. **Regular cleanup**: Remove orphaned processes

## Common Patterns

### Health Check
```bash
# Simple health check
if pgrep qb64pe > /dev/null; then
    echo "QB64PE is running"
else
    echo "QB64PE is not running"
fi
```

### Resource Alert
```bash
# Alert if memory usage is high
mem_usage=$(ps -p $(pgrep qb64pe) -o rss --no-headers)
if [ "$mem_usage" -gt 1000000 ]; then  # 1GB
    echo "High memory usage detected: ${mem_usage}KB"
fi
```

### Timeout Handling
```bash
# Kill process after timeout
timeout 300 my-qb64pe-program || {
    echo "Program timed out, terminating..."
    pkill -f my-qb64pe-program
}
```

## Notes

- Commands are platform-specific and tested for compatibility
- Process names may vary based on compilation and execution method
- Resource monitoring accuracy depends on system capabilities
- Termination commands should be used carefully to avoid data loss
- Some commands require appropriate permissions on the target system
