# capture_qb64pe_screenshot

Automatically captures screenshots of QB64PE program windows.

## Description

This tool captures screenshots of running QB64PE programs, which is essential for analyzing graphics output, debugging visual programs, and documenting program behavior. It supports multiple image formats and can target specific windows or processes.

## Parameters

- **processName** (optional): Process name to capture (default: "qb64pe")
- **windowTitle** (optional): Specific window title to capture
- **outputPath** (optional): Path to save screenshot (auto-generated if not provided)
- **format** (optional): Image format - "png", "jpg", "gif" (default: "png")

## Usage

### Basic Screenshot Capture
```typescript
const result = await mcp_qb64pe_capture_qb64pe_screenshot();
```

### Capture with Specific Parameters
```typescript
const result = await mcp_qb64pe_capture_qb64pe_screenshot({
  processName: "my-qb64pe-program",
  format: "png",
  outputPath: "c:\\screenshots\\my-program.png"
});
```

### Capture Specific Window
```typescript
const result = await mcp_qb64pe_capture_qb64pe_screenshot({
  windowTitle: "QB64PE Graphics Demo",
  format: "jpg"
});
```

## Response Format

The tool returns a capture result object:

```typescript
{
  capture: {
    success: boolean,
    error: string,
    timestamp: string,
    outputPath?: string,
    processId?: number,
    windowTitle?: string
  },
  nextSteps: string[]
}
```

## Platform Support

### Windows
- Uses native Windows screenshot capabilities
- Supports window targeting by process name or title
- Captures active graphics windows

### Linux
- Uses `xwd` and `convert` commands
- Requires ImageMagick for format conversion
- Supports X11 window targeting

### macOS
- Uses `screencapture` command
- Supports window ID targeting
- Native support for multiple formats

## Output Paths

When `outputPath` is not specified:
- Screenshots are saved to `qb64pe-screenshots/` directory
- Filenames include timestamp for uniqueness
- Format: `screenshot_YYYYMMDD_HHMMSS.{format}`

Example auto-generated paths:
- `qb64pe-screenshots/screenshot_20250824_191055.png`
- `qb64pe-screenshots/qb64pe_capture_191055.jpg`

## Error Handling

Common errors and solutions:

### No QB64PE Process Found
```typescript
{
  capture: {
    success: false,
    error: "No QB64PE process found",
    timestamp: "2025-08-24T19:10:55.461Z"
  },
  nextSteps: [
    "Check if QB64PE program is running",
    "Verify window title or process name", 
    "Try using get_qb64pe_processes to list available windows"
  ]
}
```

### Permission Issues
- Ensure proper screen capture permissions
- Run with appropriate privileges on Windows/macOS
- Check X11 permissions on Linux

### Window Not Found
- Verify the window title or process name
- Use `get_qb64pe_processes` to list available targets
- Check if the window is minimized or hidden

## Integration with Other Tools

### Use with Process Monitoring
```typescript
// First, check available processes
const processes = await mcp_qb64pe_get_qb64pe_processes();

// Then capture from specific process
const screenshot = await mcp_qb64pe_capture_qb64pe_screenshot({
  processName: processes.processes[0].name
});
```

### Use with Screenshot Analysis
```typescript
// Capture screenshot
const capture = await mcp_qb64pe_capture_qb64pe_screenshot();

// Analyze the captured image
if (capture.capture.success && capture.capture.outputPath) {
  const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
    screenshotPath: capture.capture.outputPath
  });
}
```

### Automated Monitoring
```typescript
// Start automatic screenshot monitoring
await mcp_qb64pe_start_screenshot_monitoring({
  captureIntervalMs: 5000  // Capture every 5 seconds
});
```

## Best Practices

1. **Check process availability first** - Use `get_qb64pe_processes` to verify targets
2. **Handle timing issues** - Allow graphics programs time to render before capturing
3. **Use appropriate formats** - PNG for quality, JPG for smaller files
4. **Organize output** - Use custom output paths for better file management
5. **Monitor capture success** - Always check the success flag before proceeding

## Troubleshooting

### Windows Issues
- Enable "Allow apps to access screen recording" in Privacy settings
- Ensure QB64PE window is not minimized
- Check Windows Defender real-time protection settings

### Linux Issues
- Install ImageMagick: `sudo apt-get install imagemagick`
- Verify X11 display variable: `echo $DISPLAY`
- Check window manager compatibility

### macOS Issues  
- Grant screen recording permissions in System Preferences
- Ensure QB64PE has focus when capturing
- Check for Gatekeeper restrictions

## Example Workflow

```typescript
// 1. Check for running programs
const processes = await mcp_qb64pe_get_qb64pe_processes();

if (processes.processes.length > 0) {
  // 2. Capture screenshot
  const capture = await mcp_qb64pe_capture_qb64pe_screenshot({
    processName: processes.processes[0].name,
    format: "png"
  });
  
  if (capture.capture.success) {
    // 3. Analyze the captured image
    const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
      screenshotPath: capture.capture.outputPath
    });
    
    // 4. Generate feedback
    const feedback = await mcp_qb64pe_generate_programming_feedback({
      screenshotPath: capture.capture.outputPath
    });
  }
}
```

## Notes

- Screenshots capture the current state of graphics windows
- Timing is important - capture after graphics rendering is complete
- Multiple formats supported for different use cases
- Automatic file naming prevents overwrites
- Cross-platform implementation handles OS differences transparently
