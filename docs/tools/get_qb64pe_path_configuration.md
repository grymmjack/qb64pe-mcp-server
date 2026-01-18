# get_qb64pe_path_configuration

## Overview
The `get_qb64pe_path_configuration` tool provides platform-specific instructions for configuring system PATH to include QB64PE, enabling command-line access across different operating systems.

## Purpose
- **PATH Setup Instructions**: Platform-specific PATH configuration guidance
- **Command-Line Access**: Enable QB64PE execution from any directory
- **Environment Configuration**: System environment variable management
- **Automation Scripts**: Provide scriptable PATH configuration methods
- **Troubleshooting**: PATH-related issue resolution

## Parameters

### Optional Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `installPath` | string | Known QB64PE installation path for customized instructions |

## Response Structure

### Configuration Object
```json
{
  "platform": string,
  "currentPath": string[],
  "qb64peFound": boolean,
  "recommendedPath": string,
  "configurationMethods": {
    "gui": object,
    "commandLine": object,
    "script": object
  },
  "verification": {
    "commands": string[],
    "expectedOutput": string
  },
  "troubleshooting": array,
  "automation": object
}
```

## Usage Examples

### Get Platform-Specific PATH Configuration
```javascript
const pathConfig = await mcp.call("get_qb64pe_path_configuration");

console.log(`Platform: ${pathConfig.platform}`);
console.log(`Recommended PATH: ${pathConfig.recommendedPath}`);

console.log("\n=== GUI Method ===");
console.log(pathConfig.configurationMethods.gui.steps.join("\n"));

console.log("\n=== Command Line Method ===");
console.log("Command:", pathConfig.configurationMethods.commandLine.command);

console.log("\n=== Verification ===");
pathConfig.verification.commands.forEach(cmd => {
  console.log(`Run: ${cmd}`);
});
```

### Custom Installation Path Configuration
```javascript
const installation = await mcp.call("detect_qb64pe_installation");

if (installation.isInstalled && !installation.inPath) {
  const pathConfig = await mcp.call("get_qb64pe_path_configuration", {
    installPath: installation.installPath
  });
  
  console.log("Custom PATH configuration:");
  console.log("Installation found at:", installation.installPath);
  console.log("Add to PATH:", pathConfig.recommendedPath);
  console.log("Method:", pathConfig.configurationMethods.commandLine.command);
}
```

### Automated PATH Setup
```javascript
const pathConfig = await mcp.call("get_qb64pe_path_configuration");

// Use automation scripts for CI/CD or setup scripts
if (pathConfig.automation && pathConfig.automation.script) {
  console.log("Automated setup script:");
  console.log(pathConfig.automation.script);
  
  // Could execute the script automatically in appropriate environments
  // exec(pathConfig.automation.script);
}
```

## Platform-Specific Configuration

### Windows Configuration
```javascript
// Example Windows PATH configuration response
{
  "platform": "windows",
  "currentPath": ["C:\\Windows\\System32", "C:\\Windows"],
  "qb64peFound": false,
  "recommendedPath": "C:\\QB64pe",
  "configurationMethods": {
    "gui": {
      "steps": [
        "Right-click 'This PC' and select 'Properties'",
        "Click 'Advanced system settings'",
        "Click 'Environment Variables' button",
        "In 'System Variables', find and select 'Path'",
        "Click 'Edit' then 'New'",
        "Add 'C:\\QB64pe' to the list",
        "Click 'OK' to save all dialogs"
      ],
      "notes": "Changes take effect in new Command Prompt windows"
    },
    "commandLine": {
      "command": "setx PATH \"%PATH%;C:\\QB64pe\"",
      "description": "Add QB64PE to user PATH (requires new session)",
      "alternative": "setx /M PATH \"%PATH%;C:\\QB64pe\"",
      "alternativeNote": "System-wide PATH (requires administrator)"
    },
    "script": {
      "powershell": "$env:PATH += \";C:\\QB64pe\"; [Environment]::SetEnvironmentVariable(\"PATH\", $env:PATH, \"User\")",
      "batch": "setx PATH \"%PATH%;C:\\QB64pe\""
    }
  },
  "verification": {
    "commands": ["qb64pe --version", "where qb64pe"],
    "expectedOutput": "QB64PE version information should display"
  }
}
```

### macOS Configuration
```javascript
// Example macOS PATH configuration response
{
  "platform": "macos",
  "currentPath": ["/usr/bin", "/bin", "/usr/sbin", "/sbin"],
  "qb64peFound": false,
  "recommendedPath": "/Applications/QB64pe.app/Contents/MacOS",
  "configurationMethods": {
    "gui": {
      "steps": [
        "Open Terminal application",
        "Edit shell profile file (~/.zshrc or ~/.bash_profile)",
        "Add export PATH line",
        "Save file and restart terminal"
      ],
      "notes": "Use nano, vim, or text editor of choice"
    },
    "commandLine": {
      "command": "echo 'export PATH=\"$PATH:/Applications/QB64pe.app/Contents/MacOS\"' >> ~/.zshrc",
      "description": "Add QB64PE to PATH in zsh profile",
      "alternative": "echo 'export PATH=\"$PATH:/Applications/QB64pe.app/Contents/MacOS\"' >> ~/.bash_profile",
      "alternativeNote": "For bash shell users"
    },
    "script": {
      "bash": "#!/bin/bash\necho 'export PATH=\"$PATH:/Applications/QB64pe.app/Contents/MacOS\"' >> ~/.zshrc\nsource ~/.zshrc",
      "symlink": "sudo ln -sf \"/Applications/QB64pe.app/Contents/MacOS/qb64pe\" /usr/local/bin/qb64pe"
    }
  },
  "verification": {
    "commands": ["qb64pe --version", "which qb64pe"],
    "expectedOutput": "QB64PE version and path should display"
  }
}
```

### Linux Configuration
```javascript
// Example Linux PATH configuration response
{
  "platform": "linux",
  "currentPath": ["/usr/bin", "/bin", "/usr/local/bin"],
  "qb64peFound": false,
  "recommendedPath": "/opt/qb64pe",
  "configurationMethods": {
    "gui": {
      "steps": [
        "Open terminal",
        "Edit ~/.bashrc or ~/.profile",
        "Add export PATH line",
        "Save and reload shell configuration"
      ],
      "notes": "GUI methods vary by desktop environment"
    },
    "commandLine": {
      "command": "echo 'export PATH=\"$PATH:/opt/qb64pe\"' >> ~/.bashrc",
      "description": "Add QB64PE to PATH in bash profile",
      "reload": "source ~/.bashrc"
    },
    "script": {
      "bash": "#!/bin/bash\necho 'export PATH=\"$PATH:/opt/qb64pe\"' >> ~/.bashrc\nsource ~/.bashrc",
      "systemWide": "echo '/opt/qb64pe' | sudo tee /etc/environment",
      "symlink": "sudo ln -sf /opt/qb64pe/qb64pe /usr/local/bin/qb64pe"
    }
  },
  "verification": {
    "commands": ["qb64pe --version", "which qb64pe", "echo $PATH"],
    "expectedOutput": "QB64PE should be accessible and path should include QB64PE directory"
  }
}
```

## Configuration Methods

### GUI-Based Configuration
User-friendly graphical interface methods for each platform:
- **Windows**: System Properties → Environment Variables
- **macOS**: Terminal + text editor for profile files
- **Linux**: Distribution-specific GUI tools or terminal

### Command-Line Configuration
Single-command setup for immediate configuration:
- **Temporary**: Affects current session only
- **Permanent**: Modifies user or system environment
- **Verification**: Commands to test configuration

### Script-Based Configuration
Automated scripts for:
- **Setup Scripts**: For development environment automation
- **CI/CD Integration**: Automated build environments
- **Team Onboarding**: Consistent environment setup

## Verification and Testing

### Verification Commands
```javascript
{
  "verification": {
    "basic": "qb64pe --version",
    "pathCheck": "which qb64pe",  // Unix
    "pathCheckWindows": "where qb64pe",
    "environmentCheck": "echo $PATH",  // Unix
    "environmentCheckWindows": "echo %PATH%"
  },
  "expectedResults": {
    "version": "Should display QB64PE version information",
    "pathLocation": "Should show full path to QB64PE executable",
    "pathContents": "Should include QB64PE directory in PATH variable"
  }
}
```

### Troubleshooting Common Issues
```javascript
{
  "troubleshooting": [
    {
      "issue": "Command not found after PATH configuration",
      "causes": ["Shell not restarted", "Incorrect path", "Typo in configuration"],
      "solutions": [
        "Restart terminal/command prompt",
        "Verify installation path is correct",
        "Check for typos in PATH configuration",
        "Use full path to test executable directly"
      ]
    },
    {
      "issue": "PATH works in one terminal but not others",
      "causes": ["User vs system PATH", "Shell-specific configuration"],
      "solutions": [
        "Configure system PATH instead of user PATH",
        "Add to multiple shell profile files",
        "Use symlink in standard system directory"
      ]
    },
    {
      "issue": "Permission denied when setting PATH",
      "causes": ["Insufficient privileges", "Read-only environment"],
      "solutions": [
        "Use administrator/sudo privileges",
        "Configure user PATH instead of system PATH",
        "Use symbolic links as alternative"
      ]
    }
  ]
}
```

## Automation Support

### CI/CD Integration
```javascript
{
  "automation": {
    "github_actions": {
      "windows": "echo \"${{ env.QB64PE_PATH }}\" >> $GITHUB_PATH",
      "linux": "echo \"${{ env.QB64PE_PATH }}\" >> $GITHUB_PATH",
      "macos": "echo \"${{ env.QB64PE_PATH }}\" >> $GITHUB_PATH"
    },
    "docker": {
      "env": "ENV PATH=\"$PATH:/opt/qb64pe\"",
      "copy": "COPY qb64pe /opt/qb64pe/"
    },
    "vagrant": {
      "provision": "echo 'export PATH=\"$PATH:/opt/qb64pe\"' >> /home/vagrant/.bashrc"
    }
  }
}
```

### Team Setup Scripts
```javascript
{
  "teamSetup": {
    "windows": {
      "script": "setup-qb64pe-windows.bat",
      "content": "@echo off\nsetx PATH \"%PATH%;C:\\QB64pe\"\necho QB64PE added to PATH"
    },
    "unix": {
      "script": "setup-qb64pe.sh",
      "content": "#!/bin/bash\necho 'export PATH=\"$PATH:/opt/qb64pe\"' >> ~/.bashrc\nsource ~/.bashrc\necho \"QB64PE added to PATH\""
    }
  }
}
```

## Related Tools

### Installation Tools
- **`detect_qb64pe_installation`**: Check current installation and PATH status
- **`generate_qb64pe_installation_report`**: Comprehensive installation analysis
- **`get_qb64pe_installation_guidance`**: Complete installation guidance

### Validation Tools
- **`validate_qb64pe_path`**: Validate specific installation paths
- **`get_qb64pe_processes`**: Check currently running QB64PE processes

## Integration Workflows

### Complete Setup Workflow
```javascript
// 1. Detect current installation
const installation = await mcp.call("detect_qb64pe_installation");

// 2. Get PATH configuration if not in PATH
if (installation.isInstalled && !installation.inPath) {
  const pathConfig = await mcp.call("get_qb64pe_path_configuration", {
    installPath: installation.installPath
  });
  
  console.log("PATH Configuration Needed:");
  console.log("Method:", pathConfig.configurationMethods.commandLine.command);
  
  // 3. Validate after configuration
  console.log("Verify with:", pathConfig.verification.commands.join(" && "));
}
```

### Development Environment Setup
```javascript
// Automated development environment setup
const pathConfig = await mcp.call("get_qb64pe_path_configuration");

// Configure PATH based on platform
const setupScript = pathConfig.automation?.script || pathConfig.configurationMethods.script;

console.log("Setup script for automated installation:");
console.log(setupScript);

// Verification
console.log("Verification commands:");
pathConfig.verification.commands.forEach(cmd => console.log(`- ${cmd}`));
```

## Best Practices

### PATH Configuration
- **Use System PATH**: For system-wide access (requires admin privileges)
- **Use User PATH**: For single-user installations
- **Verify Installation**: Always test PATH configuration after setup
- **Document Changes**: Keep track of PATH modifications for troubleshooting

### Cross-Platform Considerations
- **Standard Locations**: Use platform-standard installation directories
- **Shell Compatibility**: Consider different shell environments (bash, zsh, PowerShell)
- **Permission Management**: Handle privilege requirements appropriately
- **Fallback Methods**: Provide alternative approaches (symlinks, aliases)

---

**See Also:**
- [Detect QB64PE Installation](./detect_qb64pe_installation.md) - Installation detection and status
- [Validate QB64PE Path](./validate_qb64pe_path.md) - Path validation and testing
- [Get QB64PE Installation Guidance](./get_qb64pe_installation_guidance.md) - Complete installation guidance
