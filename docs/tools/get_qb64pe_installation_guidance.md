# get_qb64pe_installation_guidance

## Overview
The `get_qb64pe_installation_guidance` tool provides comprehensive installation guidance, troubleshooting assistance, and platform-specific setup instructions for QB64PE development environments.

## Purpose
- **Installation Guidance**: Step-by-step QB64PE installation instructions
- **Troubleshooting Support**: Solutions for common installation issues
- **Platform-Specific Help**: Tailored guidance for Windows, macOS, and Linux
- **Environment Setup**: Complete development environment configuration
- **Best Practices**: Optimal installation and configuration recommendations

## Parameters
This tool takes no parameters and provides comprehensive installation guidance.

## Response Structure

### Guidance Object
```json
{
  "installationGuide": {
    "windows": object,
    "macos": object,
    "linux": object
  },
  "troubleshooting": {
    "commonIssues": array,
    "platformSpecific": object,
    "diagnosticSteps": array
  },
  "environmentSetup": {
    "pathConfiguration": object,
    "developmentTools": array,
    "verificationSteps": array
  },
  "bestPractices": array,
  "resources": {
    "downloadLinks": object,
    "documentation": array,
    "community": array
  }
}
```

## Usage Examples

### Get Complete Installation Guidance
```javascript
const guidance = await mcp.call("get_qb64pe_installation_guidance");

console.log("=== QB64PE Installation Guidance ===");
console.log("\n--- Windows Installation ---");
console.log(guidance.installationGuide.windows.steps.join("\n"));

console.log("\n--- Common Issues ---");
guidance.troubleshooting.commonIssues.forEach(issue => {
  console.log(`Problem: ${issue.problem}`);
  console.log(`Solution: ${issue.solution}\n`);
});

console.log("\n--- Best Practices ---");
guidance.bestPractices.forEach(practice => console.log(`- ${practice}`));
```

### Platform-Specific Setup Help
```javascript
const guidance = await mcp.call("get_qb64pe_installation_guidance");
const platform = process.platform; // 'win32', 'darwin', 'linux'

let platformGuide;
switch(platform) {
  case 'win32':
    platformGuide = guidance.installationGuide.windows;
    break;
  case 'darwin':
    platformGuide = guidance.installationGuide.macos;
    break;
  case 'linux':
    platformGuide = guidance.installationGuide.linux;
    break;
}

console.log(`Installation steps for ${platform}:`);
platformGuide.steps.forEach((step, index) => {
  console.log(`${index + 1}. ${step}`);
});
```

### Troubleshooting Workflow
```javascript
const guidance = await mcp.call("get_qb64pe_installation_guidance");

// Check if QB64PE is already installed
const installation = await mcp.call("detect_qb64pe_installation");

if (!installation.isInstalled) {
  console.log("QB64PE not found. Installation needed.");
  console.log("Download from:", guidance.resources.downloadLinks.official);
} else if (!installation.inPath) {
  console.log("QB64PE found but not in PATH.");
  console.log("PATH Configuration:", guidance.environmentSetup.pathConfiguration);
} else {
  console.log("QB64PE installation appears complete!");
  console.log("Verification steps:", guidance.environmentSetup.verificationSteps);
}
```

## Installation Guidelines

### Windows Installation
```javascript
// Example of Windows guidance structure
{
  "steps": [
    "Download QB64PE from official website",
    "Extract to C:\\QB64pe (recommended location)",
    "Add C:\\QB64pe to system PATH environment variable",
    "Open Command Prompt and test 'qb64pe --version'",
    "Install Visual Studio Build Tools if needed for compilation"
  ],
  "requirements": [
    "Windows 10 or later (64-bit recommended)",
    "4GB RAM minimum, 8GB recommended",
    "500MB free disk space",
    "Visual Studio Build Tools (for compilation)"
  ],
  "downloadUrl": "https://github.com/QB64-Phoenix-Edition/QB64pe/releases",
  "pathInstructions": {
    "method1": "System Properties → Environment Variables → PATH",
    "method2": "PowerShell: setx PATH \"$env:PATH;C:\\QB64pe\"",
    "verification": "Open new Command Prompt, type 'qb64pe --version'"
  }
}
```

### macOS Installation
```javascript
// Example of macOS guidance structure
{
  "steps": [
    "Download QB64PE from official website or use Homebrew",
    "If using direct download, extract to /Applications",
    "Create symbolic link: ln -s /Applications/QB64pe.app/Contents/MacOS/qb64pe /usr/local/bin/qb64pe",
    "Test installation: qb64pe --version",
    "Install Xcode Command Line Tools if needed"
  ],
  "homebrewOption": {
    "install": "brew install qb64pe",
    "benefits": "Automatic PATH configuration and dependency management"
  },
  "requirements": [
    "macOS 10.15 or later",
    "Xcode Command Line Tools",
    "4GB RAM minimum"
  ]
}
```

### Linux Installation
```javascript
// Example of Linux guidance structure
{
  "steps": [
    "Download QB64PE from official website",
    "Extract to ~/qb64pe or /opt/qb64pe",
    "Make executable: chmod +x qb64pe",
    "Add to PATH or create symlink in /usr/local/bin",
    "Install required libraries (varies by distribution)"
  ],
  "packageManagers": {
    "ubuntu": "sudo apt install build-essential",
    "fedora": "sudo dnf install gcc-c++",
    "arch": "sudo pacman -S base-devel"
  },
  "dependencies": [
    "gcc/g++",
    "libgl1-mesa-dev",
    "libasound2-dev",
    "libgtk-3-dev"
  ]
}
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Installation Not Found
```javascript
{
  "problem": "QB64PE executable not found after installation",
  "causes": [
    "Installation path not in system PATH",
    "Incorrect installation directory",
    "File permissions issues",
    "Antivirus blocking executable"
  ],
  "solutions": [
    "Verify installation path and add to PATH",
    "Check file permissions and make executable",
    "Add QB64PE to antivirus exceptions",
    "Reinstall to default location"
  ]
}
```

#### Compilation Errors
```javascript
{
  "problem": "QB64PE compiles but programs don't run",
  "causes": [
    "Missing compiler dependencies",
    "Incorrect system architecture",
    "Runtime library issues"
  ],
  "solutions": [
    "Install Visual Studio Build Tools (Windows)",
    "Install Xcode Command Line Tools (macOS)",
    "Install build-essential package (Linux)",
    "Verify system architecture compatibility"
  ]
}
```

#### PATH Configuration Issues
```javascript
{
  "problem": "QB64PE works from installation directory but not from command line",
  "causes": [
    "PATH environment variable not updated",
    "Shell not restarted after PATH change",
    "Conflicting executable names"
  ],
  "solutions": [
    "Update PATH environment variable",
    "Restart terminal/shell",
    "Use full path or create alias",
    "Verify PATH with 'echo $PATH' or 'echo %PATH%'"
  ]
}
```

## Environment Setup

### Development Environment Configuration
```javascript
{
  "pathConfiguration": {
    "windows": {
      "systemPath": "Add QB64PE directory to System PATH",
      "userPath": "Add to User PATH for single-user installation",
      "verification": "qb64pe --version"
    },
    "unix": {
      "bashrc": "Add 'export PATH=$PATH:/path/to/qb64pe' to ~/.bashrc",
      "symlink": "Create symlink in /usr/local/bin",
      "verification": "which qb64pe"
    }
  },
  "developmentTools": [
    "Text editor with syntax highlighting",
    "File manager for project organization",
    "Version control system (Git)",
    "Backup solution for source code"
  ],
  "verificationSteps": [
    "Test QB64PE version command",
    "Compile simple test program",
    "Verify executable output",
    "Test PATH accessibility"
  ]
}
```

### Best Practices
```javascript
{
  "bestPractices": [
    "Install QB64PE to standard location for easier PATH configuration",
    "Keep installation directory clean and organized",
    "Regularly backup QB64PE projects and settings",
    "Use version control for source code management",
    "Test installation with simple programs before complex projects",
    "Document custom installation paths for team sharing",
    "Set up development workspace separate from QB64PE installation",
    "Configure text editor with QB64PE syntax highlighting"
  ]
}
```

## Related Tools

### Installation Detection
- **`detect_qb64pe_installation`**: Check current installation status
- **`generate_qb64pe_installation_report`**: Comprehensive installation analysis
- **`validate_qb64pe_path`**: Validate specific installation paths

### Configuration Tools
- **`get_qb64pe_path_configuration`**: Platform-specific PATH setup instructions
- **`get_qb64pe_best_practices`**: Development environment best practices
- **`get_compiler_options`**: QB64PE compiler configuration options

## Integration Workflows

### Complete Setup Workflow
```javascript
// 1. Get installation guidance
const guidance = await mcp.call("get_qb64pe_installation_guidance");

// 2. Check current installation status
const installation = await mcp.call("detect_qb64pe_installation");

// 3. Provide appropriate guidance based on status
if (!installation.isInstalled) {
  console.log("Installation needed:");
  console.log(guidance.installationGuide[process.platform]);
} else if (!installation.inPath) {
  console.log("PATH configuration needed:");
  console.log(guidance.environmentSetup.pathConfiguration);
} else {
  console.log("Verification recommended:");
  console.log(guidance.environmentSetup.verificationSteps);
}
```

### Troubleshooting Assistant
```javascript
// Interactive troubleshooting workflow
const guidance = await mcp.call("get_qb64pe_installation_guidance");
const installation = await mcp.call("detect_qb64pe_installation");

// Identify potential issues
const issues = [];
if (!installation.isInstalled) issues.push("not_installed");
if (!installation.inPath) issues.push("not_in_path");

// Provide targeted guidance
issues.forEach(issue => {
  const relevantGuidance = guidance.troubleshooting.commonIssues
    .find(item => item.category === issue);
  console.log(`Issue: ${relevantGuidance.problem}`);
  console.log(`Solution: ${relevantGuidance.solution}`);
});
```

## Platform-Specific Resources

### Download Links
- **Official Releases**: GitHub releases page with latest versions
- **Nightly Builds**: Development versions for testing
- **Documentation**: Official QB64PE documentation and wiki
- **Community**: Forums, Discord, and community resources

### Platform Tools
- **Windows**: Visual Studio Build Tools, Windows Subsystem for Linux
- **macOS**: Homebrew, Xcode Command Line Tools
- **Linux**: Package managers, development tools, library dependencies

## Success Validation

### Installation Verification
```javascript
// Comprehensive installation verification
const guidance = await mcp.call("get_qb64pe_installation_guidance");

// Run through verification checklist
const verification = guidance.environmentSetup.verificationSteps;
console.log("Verification Checklist:");
verification.forEach((step, index) => {
  console.log(`${index + 1}. ${step}`);
});

// Test with simple program
const testProgram = 'PRINT "QB64PE Installation Test"';
// Use compilation tools to verify complete setup
```

---

**See Also:**
- [Detect QB64PE Installation](./detect_qb64pe_installation.md) - Installation detection and status
- [Generate QB64PE Installation Report](./generate_qb64pe_installation_report.md) - Comprehensive environment analysis
- [Get QB64PE PATH Configuration](./get_qb64pe_path_configuration.md) - PATH setup instructions
