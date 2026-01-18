# get_file_monitoring_commands

Gets cross-platform commands for monitoring QB64PE log files and output.

## Description

This tool provides platform-specific shell commands for monitoring QB64PE log files in real-time, displaying file contents, and searching for specific patterns. It's essential for tracking program execution, debugging issues, and monitoring automated processes.

## Parameters

- **logFile** (required): Path to log file to monitor

## Usage

```typescript
const commands = await mcp_qb64pe_get_file_monitoring_commands({
  logFile: "c:\\qb64pe-logs\\execution.log"
});
```

## Response Format

The tool returns platform-specific commands:

```typescript
{
  logFile: string,
  platform: string,
  commands: {
    tail: string,      // Real-time monitoring command
    display: string,   // Display file contents command
    search: string     // Pattern search command
  },
  usage: {
    tail: string,      // Description of tail command
    display: string,   // Description of display command
    search: string     // Description of search command
  }
}
```

## Platform-Specific Commands

### Windows (PowerShell)
For Windows systems using PowerShell:

```typescript
{
  platform: "win32",
  commands: {
    tail: "powershell \"Get-Content -Path 'logfile.log' -Wait -Tail 10\"",
    display: "type \"logfile.log\"",
    search: "findstr /N \"ERROR\\|WARNING\\|SUCCESS\" \"logfile.log\""
  }
}
```

**Windows Command Details:**
- **Tail**: Uses PowerShell `Get-Content -Wait` for real-time monitoring
- **Display**: Uses `type` command to show file contents
- **Search**: Uses `findstr` with line numbers for pattern matching

### Linux
For Linux systems using bash:

```typescript
{
  platform: "linux",
  commands: {
    tail: "tail -f 'logfile.log'",
    display: "cat 'logfile.log'",
    search: "grep -n 'ERROR\\|WARNING\\|SUCCESS' 'logfile.log'"
  }
}
```

**Linux Command Details:**
- **Tail**: Uses `tail -f` for following file changes
- **Display**: Uses `cat` to display file contents
- **Search**: Uses `grep` with line numbers for pattern matching

### macOS
For macOS systems (similar to Linux):

```typescript
{
  platform: "darwin",
  commands: {
    tail: "tail -f 'logfile.log'",
    display: "cat 'logfile.log'",
    search: "grep -n 'ERROR\\|WARNING\\|SUCCESS' 'logfile.log'"
  }
}
```

## Command Usage Examples

### Real-Time Monitoring (Tail)
```bash
# Windows PowerShell
powershell "Get-Content -Path 'c:\logs\execution.log' -Wait -Tail 10"

# Linux/macOS
tail -f '/path/to/execution.log'
```

**Use Cases:**
- Monitor program execution in real-time
- Watch for error messages as they occur
- Track progress of long-running operations
- Debug issues as they happen

### Display File Contents
```bash
# Windows
type "c:\logs\execution.log"

# Linux/macOS
cat '/path/to/execution.log'
```

**Use Cases:**
- Review complete log file contents
- Analyze historical execution data
- Export log contents for analysis
- Quick overview of program output

### Pattern Searching
```bash
# Windows
findstr /N "ERROR\|WARNING\|SUCCESS" "c:\logs\execution.log"

# Linux/macOS
grep -n 'ERROR\|WARNING\|SUCCESS' '/path/to/execution.log'
```

**Use Cases:**
- Find specific error messages
- Locate success indicators
- Search for warning conditions
- Extract relevant log entries

## Advanced Monitoring Patterns

### Multiple Pattern Search
```bash
# Windows
findstr /N "ERROR\|WARN\|INFO\|DEBUG" "logfile.log"

# Linux/macOS
grep -n 'ERROR\|WARN\|INFO\|DEBUG' 'logfile.log'
```

### Time-Based Filtering
```bash
# Linux/macOS with timestamp search
grep -n "$(date '+%Y-%m-%d')" 'logfile.log'

# Windows with date search
findstr /N "%date%" "logfile.log"
```

### Case-Insensitive Search
```bash
# Windows
findstr /I /N "error\|warning" "logfile.log"

# Linux/macOS
grep -i -n 'error\|warning' 'logfile.log'
```

## Integration with Automation

### Process Monitoring Script
```bash
#!/bin/bash
# monitor-qb64pe.sh

LOG_FILE="$1"
if [ -z "$LOG_FILE" ]; then
    echo "Usage: $0 <log-file>"
    exit 1
fi

echo "Monitoring QB64PE log: $LOG_FILE"
echo "Press Ctrl+C to stop"

# Start monitoring
tail -f "$LOG_FILE" | while read line; do
    if echo "$line" | grep -q "ERROR"; then
        echo "🚨 ERROR detected: $line"
    elif echo "$line" | grep -q "SUCCESS"; then
        echo "✅ SUCCESS: $line"
    fi
done
```

### PowerShell Monitoring Script
```powershell
# monitor-qb64pe.ps1
param(
    [string]$LogFile
)

if (-not $LogFile) {
    Write-Host "Usage: .\monitor-qb64pe.ps1 -LogFile <path>"
    exit 1
}

Write-Host "Monitoring QB64PE log: $LogFile"
Write-Host "Press Ctrl+C to stop"

Get-Content -Path $LogFile -Wait -Tail 0 | ForEach-Object {
    if ($_ -match "ERROR") {
        Write-Host "🚨 ERROR detected: $_" -ForegroundColor Red
    } elseif ($_ -match "SUCCESS") {
        Write-Host "✅ SUCCESS: $_" -ForegroundColor Green
    } else {
        Write-Host $_
    }
}
```

## Use Cases

### Development Debugging
```typescript
// Get monitoring commands for debugging
const commands = await mcp_qb64pe_get_file_monitoring_commands({
  logFile: "qb64pe-logs/debug.log"
});

// Use tail command to monitor in real-time
console.log("Run this command to monitor:", commands.commands.tail);
```

### Automated Testing
```typescript
// Monitor test execution logs
const commands = await mcp_qb64pe_get_file_monitoring_commands({
  logFile: "qb64pe-logs/test-execution.log"
});

// Search for test results
console.log("Search for results:", commands.commands.search);
```

### Production Monitoring
```typescript
// Monitor production QB64PE applications
const commands = await mcp_qb64pe_get_file_monitoring_commands({
  logFile: "/var/log/qb64pe/production.log"
});

// Set up continuous monitoring
console.log("Continuous monitoring:", commands.commands.tail);
```

## Best Practices

1. **Use appropriate command for task**:
   - `tail` for real-time monitoring
   - `display` for one-time review
   - `search` for finding specific issues

2. **Handle file paths properly**:
   - Use quotes around paths with spaces
   - Escape special characters as needed
   - Use absolute paths when possible

3. **Monitor resource usage**:
   - Long-running tail commands consume resources
   - Stop monitoring when not needed
   - Use search commands for historical analysis

4. **Combine with automation**:
   - Use in scripts for automated monitoring
   - Integrate with alerting systems
   - Log monitoring results for analysis

## Common Log Patterns

### QB64PE Execution Logs
```
[2025-08-24 19:12:17] INFO - Program started
[2025-08-24 19:12:17] DEBUG - Initializing graphics mode
[2025-08-24 19:12:18] SUCCESS - Graphics initialized
[2025-08-24 19:12:20] ERROR - File not found: data.txt
[2025-08-24 19:12:21] INFO - Program completed
```

### Enhanced Debugging Logs
```
=== QB64PE Program Started at 08-24-2025 19:12:17 ===
Platform: WINDOWS
Screen Mode: 800x600
19:12:17 - Starting original program code
19:12:18 - Processing complete
19:12:18 - Program completed. Runtime: 1.234 seconds
```

## Error Handling

### File Not Found
```bash
# Check if file exists before monitoring
if [ ! -f "$LOG_FILE" ]; then
    echo "Log file not found: $LOG_FILE"
    exit 1
fi
```

### Permission Issues
```bash
# Check read permissions
if [ ! -r "$LOG_FILE" ]; then
    echo "Cannot read log file: $LOG_FILE"
    exit 1
fi
```

### Long-Running Monitoring
```bash
# Use timeout for automated scripts
timeout 300 tail -f "$LOG_FILE"  # Stop after 5 minutes
```

## Notes

- Commands are generated based on the detected platform
- File paths are properly escaped for shell usage
- Search patterns include common QB64PE log levels
- Real-time monitoring requires the file to exist
- Commands work with both manual execution and automation scripts
- Platform detection ensures appropriate command syntax
