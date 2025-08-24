# validate_qb64pe_path

## Overview
The `validate_qb64pe_path` tool validates whether a specific directory path contains a valid QB64PE installation, checking for required files, permissions, and executable functionality.

## Purpose
- **Path Validation**: Verify if a directory contains a valid QB64PE installation
- **Installation Verification**: Check completeness of QB64PE installation at given path
- **Permission Testing**: Validate file permissions and accessibility
- **Executable Testing**: Verify QB64PE executable functionality
- **Troubleshooting**: Diagnose path-related installation issues

## Parameters

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `testPath` | string | Directory path to test for QB64PE installation |

## Response Structure

### Validation Object
```json
{
  "path": string,
  "isValid": boolean,
  "validationResults": {
    "pathExists": boolean,
    "isDirectory": boolean,
    "hasExecutable": boolean,
    "executableWorks": boolean,
    "hasRequiredFiles": boolean,
    "permissionsValid": boolean
  },
  "foundFiles": {
    "executable": string,
    "requiredFiles": string[],
    "missingFiles": string[]
  },
  "permissions": {
    "readable": boolean,
    "writable": boolean,
    "executable": boolean
  },
  "recommendations": string[],
  "issues": string[]
}
```

## Usage Examples

### Validate Known Installation Path
```javascript
const validation = await mcp.call("validate_qb64pe_path", {
  testPath: "C:\\QB64pe"
});

console.log(`Path: ${validation.path}`);
console.log(`Valid Installation: ${validation.isValid}`);

if (validation.isValid) {
  console.log("✓ Valid QB64PE installation found");
  console.log("Executable:", validation.foundFiles.executable);
} else {
  console.log("✗ Invalid installation");
  console.log("Issues:", validation.issues.join(", "));
}
```

### Validate Multiple Potential Paths
```javascript
const potentialPaths = [
  "C:\\QB64pe",
  "C:\\Program Files\\QB64pe",
  "/Applications/QB64pe.app/Contents/MacOS",
  "/opt/qb64pe",
  "/usr/local/bin"
];

for (const path of potentialPaths) {
  const validation = await mcp.call("validate_qb64pe_path", {
    testPath: path
  });
  
  console.log(`${path}: ${validation.isValid ? "✓ Valid" : "✗ Invalid"}`);
  if (!validation.isValid && validation.issues.length > 0) {
    console.log(`  Issues: ${validation.issues.join(", ")}`);
  }
}
```

### Comprehensive Installation Validation
```javascript
const installation = await mcp.call("detect_qb64pe_installation");

if (installation.installPath) {
  const validation = await mcp.call("validate_qb64pe_path", {
    testPath: installation.installPath
  });
  
  console.log("=== Installation Validation ===");
  console.log(`Detected Path: ${installation.installPath}`);
  console.log(`Path Valid: ${validation.isValid}`);
  
  console.log("\n=== Validation Details ===");
  Object.entries(validation.validationResults).forEach(([check, result]) => {
    console.log(`${check}: ${result ? "✓" : "✗"}`);
  });
  
  if (validation.recommendations.length > 0) {
    console.log("\n=== Recommendations ===");
    validation.recommendations.forEach(rec => console.log(`- ${rec}`));
  }
}
```

## Validation Criteria

### Path and Directory Checks
```javascript
{
  "pathExists": "Directory exists on filesystem",
  "isDirectory": "Path points to a directory (not a file)",
  "accessible": "Directory is accessible with current permissions"
}
```

### Executable Validation
```javascript
{
  "hasExecutable": "QB64PE executable file exists",
  "executableName": "Correct executable name for platform",
  "executableWorks": "Executable runs and responds to version check",
  "executablePermissions": "Executable has proper run permissions"
}
```

### Required Files Check
```javascript
{
  "requiredFiles": [
    "qb64pe" // or "qb64pe.exe" on Windows
    "internal/", // QB64PE internal directory
    "help/", // Help files directory
    // Platform-specific additional files
  ],
  "optionalFiles": [
    "source/", // Source code directory
    "programs/", // Example programs
    "README.txt" // Documentation
  ]
}
```

### Permission Validation
```javascript
{
  "readable": "Can read files in directory",
  "writable": "Can write to directory (for compilation)",
  "executable": "Can execute QB64PE binary"
}
```

## Response Examples

### Valid Installation (Windows)
```json
{
  "path": "C:\\QB64pe",
  "isValid": true,
  "validationResults": {
    "pathExists": true,
    "isDirectory": true,
    "hasExecutable": true,
    "executableWorks": true,
    "hasRequiredFiles": true,
    "permissionsValid": true
  },
  "foundFiles": {
    "executable": "C:\\QB64pe\\qb64pe.exe",
    "requiredFiles": [
      "qb64pe.exe",
      "internal\\",
      "help\\"
    ],
    "missingFiles": []
  },
  "permissions": {
    "readable": true,
    "writable": true,
    "executable": true
  },
  "recommendations": [
    "Installation is complete and properly configured"
  ],
  "issues": []
}
```

### Invalid Installation - Missing Executable
```json
{
  "path": "/opt/qb64pe",
  "isValid": false,
  "validationResults": {
    "pathExists": true,
    "isDirectory": true,
    "hasExecutable": false,
    "executableWorks": false,
    "hasRequiredFiles": false,
    "permissionsValid": true
  },
  "foundFiles": {
    "executable": null,
    "requiredFiles": ["internal/"],
    "missingFiles": ["qb64pe", "help/"]
  },
  "permissions": {
    "readable": true,
    "writable": true,
    "executable": false
  },
  "recommendations": [
    "Reinstall QB64PE to this directory",
    "Check if executable was moved or renamed",
    "Verify download and extraction completed successfully"
  ],
  "issues": [
    "QB64PE executable not found",
    "Required files missing",
    "Cannot execute QB64PE commands"
  ]
}
```

### Path Does Not Exist
```json
{
  "path": "/nonexistent/path",
  "isValid": false,
  "validationResults": {
    "pathExists": false,
    "isDirectory": false,
    "hasExecutable": false,
    "executableWorks": false,
    "hasRequiredFiles": false,
    "permissionsValid": false
  },
  "foundFiles": {
    "executable": null,
    "requiredFiles": [],
    "missingFiles": ["all"]
  },
  "permissions": {
    "readable": false,
    "writable": false,
    "executable": false
  },
  "recommendations": [
    "Install QB64PE to this location",
    "Use existing QB64PE installation path",
    "Check path spelling and accessibility"
  ],
  "issues": [
    "Path does not exist",
    "Cannot access directory",
    "No QB64PE installation found"
  ]
}
```

## Platform-Specific Validation

### Windows Validation
- **Executable**: `qb64pe.exe`
- **Required Files**: `internal\`, `help\`, Windows-specific libraries
- **Permissions**: NTFS permissions, execution policy
- **Registry**: Optional registry entries for file associations

### macOS Validation
- **Application Bundle**: `QB64pe.app` structure validation
- **Executable**: Binary within app bundle or standalone
- **Required Files**: Info.plist, framework dependencies
- **Permissions**: Code signing, Gatekeeper compatibility

### Linux Validation
- **Executable**: `qb64pe` binary
- **Dependencies**: Shared library dependencies
- **Required Files**: Internal libraries, help files
- **Permissions**: Execute bit, library access

## Common Validation Issues

### Missing Components
```javascript
{
  "issue": "Incomplete installation",
  "causes": [
    "Interrupted download or extraction",
    "Files moved or deleted after installation",
    "Antivirus quarantined files"
  ],
  "solutions": [
    "Re-download and extract QB64PE",
    "Check antivirus quarantine",
    "Verify extraction completed without errors"
  ]
}
```

### Permission Problems
```javascript
{
  "issue": "Permission denied",
  "causes": [
    "Insufficient user permissions",
    "Read-only file system",
    "Security software blocking execution"
  ],
  "solutions": [
    "Run as administrator/sudo",
    "Change file permissions",
    "Add QB64PE to security software exceptions"
  ]
}
```

### Path Issues
```javascript
{
  "issue": "Path not accessible",
  "causes": [
    "Network drive disconnected",
    "Path contains special characters",
    "Symbolic link broken"
  ],
  "solutions": [
    "Use local installation path",
    "Avoid special characters in path",
    "Verify symbolic links point to valid locations"
  ]
}
```

## Related Tools

### Installation Detection
- **`detect_qb64pe_installation`**: Automatic installation detection
- **`generate_qb64pe_installation_report`**: Comprehensive installation analysis
- **`get_qb64pe_installation_guidance`**: Installation help and guidance

### Configuration Tools
- **`get_qb64pe_path_configuration`**: PATH setup instructions
- **`get_qb64pe_processes`**: Check running QB64PE processes

## Integration Workflows

### Installation Verification Workflow
```javascript
// 1. Detect potential installations
const installation = await mcp.call("detect_qb64pe_installation");

// 2. Validate detected installation
if (installation.installPath) {
  const validation = await mcp.call("validate_qb64pe_path", {
    testPath: installation.installPath
  });
  
  if (!validation.isValid) {
    console.log("Installation issues found:");
    validation.issues.forEach(issue => console.log(`- ${issue}`));
    
    // 3. Get guidance for fixing issues
    const guidance = await mcp.call("get_qb64pe_installation_guidance");
    console.log("Resolution guidance:", guidance.troubleshooting);
  }
}
```

### Multi-Path Validation
```javascript
// Validate multiple common installation paths
const commonPaths = [
  "C:\\QB64pe",
  "C:\\Program Files\\QB64pe",
  "/Applications/QB64pe.app/Contents/MacOS",
  "/opt/qb64pe",
  "/usr/local/bin"
];

const validPaths = [];
for (const path of commonPaths) {
  const validation = await mcp.call("validate_qb64pe_path", {
    testPath: path
  });
  
  if (validation.isValid) {
    validPaths.push(path);
  }
}

console.log(`Found ${validPaths.length} valid QB64PE installations`);
validPaths.forEach(path => console.log(`- ${path}`));
```

### Development Environment Setup
```javascript
// Validate development environment setup
const projectPath = "/path/to/project";
const qb64pePath = "/opt/qb64pe";

const validation = await mcp.call("validate_qb64pe_path", {
  testPath: qb64pePath
});

if (validation.isValid) {
  console.log("QB64PE installation validated");
  
  // Configure PATH if needed
  const pathConfig = await mcp.call("get_qb64pe_path_configuration", {
    installPath: qb64pePath
  });
  
  console.log("Setup command:", pathConfig.configurationMethods.commandLine.command);
} else {
  console.log("QB64PE installation issues:");
  validation.recommendations.forEach(rec => console.log(`- ${rec}`));
}
```

## Best Practices

### Path Validation
- **Test Before Use**: Always validate paths before using in scripts
- **Handle Edge Cases**: Check for special characters, spaces, non-ASCII characters
- **Verify Permissions**: Ensure adequate permissions for development workflow
- **Document Results**: Keep validation results for troubleshooting

### Development Workflow
- **Validate Early**: Check installation validity before starting projects
- **Cache Results**: Store validation results to avoid repeated checks
- **Monitor Changes**: Re-validate if installation directory is modified
- **Fallback Plans**: Have alternative installation paths ready

### Cross-Platform Considerations
- **Platform-Specific Paths**: Use appropriate paths for each operating system
- **Permission Models**: Understand different permission systems
- **File System Limits**: Consider path length and character restrictions
- **Security Policies**: Work within system security constraints

---

**See Also:**
- [Detect QB64PE Installation](./detect_qb64pe_installation.md) - Automatic installation detection
- [Get QB64PE PATH Configuration](./get_qb64pe_path_configuration.md) - PATH setup instructions
- [Get QB64PE Installation Guidance](./get_qb64pe_installation_guidance.md) - Installation help and troubleshooting
