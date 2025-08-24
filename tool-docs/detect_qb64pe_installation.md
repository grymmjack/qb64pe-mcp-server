# detect_qb64pe_installation

## Overview
The `detect_qb64pe_installation` tool automatically detects QB64PE installation status and configuration, providing comprehensive information about the development environment setup.

## Purpose
- **Installation Detection**: Check if QB64PE is properly installed on the system
- **PATH Validation**: Verify if QB64PE is accessible via system PATH
- **Version Information**: Retrieve QB64PE version details
- **Platform Analysis**: Identify platform-specific installation characteristics
- **Configuration Assessment**: Evaluate installation completeness and accessibility

## Parameters
This tool takes no parameters and performs automatic detection.

## Response Structure

### Installation Object
```json
{
  "isInstalled": boolean,
  "installPath": string,
  "version": string,
  "inPath": boolean,
  "executable": string,
  "platform": string
}
```

### Field Descriptions
- **`isInstalled`**: Whether QB64PE is detected on the system
- **`installPath`**: Full path to QB64PE installation directory
- **`version`**: QB64PE version string (if detectable)
- **`inPath`**: Whether QB64PE executable is in system PATH
- **`executable`**: Name of the QB64PE executable file
- **`platform`**: Operating system platform (windows, macos, linux)

## Usage Examples

### Basic Installation Check
```javascript
const installation = await mcp.call("detect_qb64pe_installation");
console.log("QB64PE Installed:", installation.isInstalled);
console.log("Installation Path:", installation.installPath);
console.log("In PATH:", installation.inPath);
```

### Conditional Setup Based on Detection
```javascript
const installation = await mcp.call("detect_qb64pe_installation");

if (!installation.isInstalled) {
  console.log("QB64PE not found. Please install QB64PE first.");
  // Provide installation guidance
} else if (!installation.inPath) {
  console.log("QB64PE found but not in PATH. Configuring...");
  // Use path configuration tools
} else {
  console.log("QB64PE ready for development!");
  console.log(`Version: ${installation.version}`);
  console.log(`Path: ${installation.installPath}`);
}
```

### Development Environment Validation
```javascript
const installation = await mcp.call("detect_qb64pe_installation");

const status = {
  installed: installation.isInstalled,
  accessible: installation.inPath,
  platform: installation.platform,
  ready: installation.isInstalled && installation.inPath
};

if (status.ready) {
  console.log("Development environment is ready!");
} else {
  console.log("Environment setup required:", status);
}
```

## Detection Logic

### Windows Detection
- **Registry Check**: Looks for QB64PE installation entries
- **Common Paths**: Checks typical installation directories
  - `C:\QB64pe\`
  - `C:\Program Files\QB64pe\`
  - `%USERPROFILE%\QB64pe\`
- **Executable Search**: Looks for `qb64pe.exe`
- **PATH Validation**: Tests if `qb64pe` command is accessible

### macOS Detection
- **Application Bundle**: Searches for QB64PE.app
- **Common Locations**:
  - `/Applications/QB64pe.app`
  - `~/Applications/QB64pe.app`
  - `/usr/local/bin/qb64pe`
- **Symlink Detection**: Checks for symbolic links in PATH
- **Version Extraction**: Attempts to read version from bundle

### Linux Detection
- **Package Manager**: Checks if installed via package manager
- **Binary Locations**:
  - `/usr/bin/qb64pe`
  - `/usr/local/bin/qb64pe`
  - `~/qb64pe/qb64pe`
- **Source Installations**: Detects source-compiled versions
- **PATH Verification**: Tests command availability

## Response Examples

### Successful Detection (Windows)
```json
{
  "isInstalled": true,
  "installPath": "C:\\QB64pe",
  "version": "3.8.0",
  "inPath": true,
  "executable": "qb64pe.exe",
  "platform": "windows"
}
```

### Not Found
```json
{
  "isInstalled": false,
  "installPath": null,
  "version": null,
  "inPath": false,
  "executable": null,
  "platform": "windows"
}
```

### Found but Not in PATH (macOS)
```json
{
  "isInstalled": true,
  "installPath": "/Applications/QB64pe.app",
  "version": "3.8.0",
  "inPath": false,
  "executable": "QB64pe",
  "platform": "macos"
}
```

## Related Tools

### Configuration Tools
- **`get_qb64pe_path_configuration`**: Get platform-specific PATH setup instructions
- **`validate_qb64pe_path`**: Validate specific installation paths
- **`generate_qb64pe_installation_report`**: Generate comprehensive installation report

### Guidance Tools
- **`get_qb64pe_installation_guidance`**: Get installation help and troubleshooting
- **`get_compiler_options`**: Learn about QB64PE compiler capabilities
- **`get_qb64pe_best_practices`**: Development environment best practices

## Integration Workflows

### Environment Setup Automation
```javascript
// 1. Detect current installation
const installation = await mcp.call("detect_qb64pe_installation");

// 2. Generate detailed report
const report = await mcp.call("generate_qb64pe_installation_report");

// 3. Get configuration guidance if needed
if (!installation.inPath) {
  const pathConfig = await mcp.call("get_qb64pe_path_configuration", {
    installPath: installation.installPath
  });
  console.log("PATH Configuration:", pathConfig);
}
```

### Development Tool Validation
```javascript
// Validate development environment before project setup
const installation = await mcp.call("detect_qb64pe_installation");

if (installation.isInstalled) {
  // Proceed with development tools
  const bestPractices = await mcp.call("get_qb64pe_best_practices");
  const compilerOptions = await mcp.call("get_compiler_options");
} else {
  // Guide user through installation
  const guidance = await mcp.call("get_qb64pe_installation_guidance");
}
```

## Troubleshooting

### Common Issues
1. **False Negatives**: QB64PE installed but not detected
   - Check non-standard installation paths
   - Verify file permissions and accessibility
   - Look for renamed executables

2. **Version Detection Failures**: Installation found but version unknown
   - Version information may not be available
   - Try running `qb64pe --version` manually
   - Check for custom builds without version info

3. **PATH Detection Issues**: Executable found but PATH test fails
   - PATH environment variable may not be updated
   - Terminal/shell restart may be required
   - PATH modifications may need system restart

### Debug Steps
1. **Manual Verification**: Test QB64PE commands manually
2. **Path Inspection**: Check actual PATH environment variable
3. **Permission Check**: Verify file and directory permissions
4. **Multiple Installations**: Look for conflicting installations

## Best Practices

### Before Development
- Always run detection before starting QB64PE projects
- Validate both installation and PATH accessibility
- Generate installation report for environment documentation

### In CI/CD Pipelines
- Use detection as part of build environment validation
- Cache detection results to avoid repeated checks
- Fail fast if QB64PE is not properly configured

### For Multi-Platform Projects
- Run detection on all target platforms
- Document platform-specific installation requirements
- Provide fallback instructions for missing installations

---

**See Also:**
- [Generate QB64PE Installation Report](./generate_qb64pe_installation_report.md) - Comprehensive installation analysis
- [Get QB64PE Installation Guidance](./get_qb64pe_installation_guidance.md) - Installation help and troubleshooting
- [Get QB64PE PATH Configuration](./get_qb64pe_path_configuration.md) - PATH setup instructions
