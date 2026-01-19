# Build Context Preservation Feature

## Overview

The Build Context Preservation feature solves a critical problem identified in session problem logs: **conversation summarization loses critical build command details**.

When LLM conversations are summarized to save tokens, procedural knowledge like exact compilation commands, compiler flags, and project-specific build workflows are often lost. This leads to the agent forgetting important details and using incorrect defaults on subsequent builds.

## The Problem

### Identified Issue

From `session-2026-01-19-7x6j2n.json`:

```json
{
  "title": "Conversation summarization loses critical build command details",
  "problem": {
    "correctCommand": "/Users/grymmjack/git/QB64pe/qb64pe -c -w -x DRAW.BAS -o DRAW.run",
    "incorrectCommandUsed": "/Users/grymmjack/git/QB64pe/qb64pe -c -w DRAW.BAS",
    "userRequiredFlags": "['-c', '-w', '-x'] plus -o DRAW.run",
    "summarizationIssue": "Procedural knowledge (build commands) not preserved in summary"
  }
}
```

### Impact

- Agent forgets exact compilation commands after summarization
- Uses MCP tool defaults instead of user's established workflow
- Breaks build process requiring manual user correction
- Wastes time and causes frustration

## The Solution

### Architecture

1. **ProjectBuildContextService** - Persistent storage for build configurations
2. **Compiler Service Integration** - Automatic context checking and saving
3. **MCP Tools** - Explicit context management
4. **System Prompts** - Guidance for preserving build info in summaries

### Components

#### 1. Project Build Context Service

Located: `src/services/project-build-context-service.ts`

**Features:**

- Stores project-specific build configurations in `~/.qb64pe-mcp/project-contexts/`
- Tracks build history (last 20 builds per project)
- Calculates success rates and statistics
- Generates unique hash per project directory
- Persists across conversation boundaries

**Data Stored:**

```typescript
interface ProjectBuildContext {
  projectPath: string;
  projectHash: string;
  lastUsedCommand: {
    qb64pePath?: string;
    compilerFlags: string[];
    outputName?: string;
    sourceFilePath: string;
    fullCommand: string; // Complete command for easy reference
  };
  lastSuccessfulBuild?: {
    timestamp: Date;
    executablePath: string;
    command: string;
  };
  buildHistory: Array<{
    timestamp: Date;
    command: string;
    flags: string[];
    success: boolean;
  }>;
}
```

#### 2. Compiler Service Integration

Modified: `src/services/compiler-service.ts`

**Enhancements:**

- **Pre-compilation check**: Compares current flags with previous builds
- **Warning generation**: Alerts when parameters differ from project history
- **Automatic saving**: Stores build context after every compilation attempt
- **Smart defaults**: Suggests using previous flags if they differ

**Example Warning:**

```
⚠️ Build parameters differ from previous build!
Previous command: /path/qb64pe -c -w -x DRAW.BAS -o DRAW.run
Consider using previous flags if they were working: ["-c","-w","-x"]
```

#### 3. MCP Tools

New tools in `src/tools/project-build-context-tools.ts`:

##### `get_project_build_context`

Retrieves stored build configuration for a project.

**When to use:**

- When resuming work after conversation summarization
- Before compiling to check previous parameters
- To understand build history

**Example:**

```json
{
  "name": "get_project_build_context",
  "arguments": {
    "sourceFilePath": "/path/to/DRAW.BAS"
  }
}
```

**Output:**

```markdown
📋 **Project Build Context**

**Last Used Command:**
/Users/grymmjack/git/QB64pe/qb64pe -c -w -x DRAW.BAS -o DRAW.run

**Last Used Flags:** ["-c", "-w", "-x"]
**Output Name:** DRAW.run
**QB64PE Path:** /Users/grymmjack/git/QB64pe/qb64pe

**Build Statistics:**

- Total Builds: 5
- Successful: 4
- Failed: 1
- Success Rate: 80.0%
- Most Used Flags: -c, -w, -x
```

##### `list_project_build_contexts`

Lists all projects with stored build contexts.

##### `clear_project_build_context`

Clears stored context for a specific project.

##### `get_build_context_statistics`

Returns detailed build statistics for a project.

#### 4. System Prompt

New prompt: `preserve-build-context`

Located in `src/index.ts` setupPrompts()

**Purpose:** Provides guidance for preserving critical build information in conversation summaries.

**Key Concepts:**

- `[BUILD-CRITICAL]` markers for essential commands
- `[PERSISTENT]` sections in summaries
- `[WORKFLOW]` tags for procedural knowledge
- Validation checklist before summarizing
- Anti-patterns to avoid

## Usage

### For LLM Agents

#### Before Compiling

```typescript
// 1. Check if project has existing build context
const context = await get_project_build_context({
  sourceFilePath: "/path/to/source.bas",
});

// 2. If context exists, use previous flags
if (context) {
  compilerFlags = context.lastUsedCommand.compilerFlags;
}

// 3. Compile with appropriate flags
await compile_and_verify_qb64pe({
  sourceFilePath: "/path/to/source.bas",
  compilerFlags: compilerFlags,
});
```

#### After Conversation Summarization

```typescript
// Invoke the preservation prompt for guidance
await use_prompt("preserve-build-context", {
  summaryType: "conversation",
});

// Check all active projects
const projects = await list_project_build_contexts();

// Include build contexts in summary
for (const project of projects) {
  const context = await get_project_build_context({
    sourceFilePath: project.sourceFilePath,
  });
  // Include in summary with [BUILD-CRITICAL] marker
}
```

### For Users

Build contexts are created automatically. No manual intervention needed!

The system will:

1. Automatically save build configurations when you compile
2. Warn you if parameters change from previous builds
3. Suggest using previous working flags
4. Track success rates for your projects

### Summary Template

When creating summaries, use this template:

````markdown
## Build Configuration [PERSISTENT]

**Project**: /path/to/project

**Build Command**: [BUILD-CRITICAL]

```bash
/path/to/qb64pe -c -w -x source.bas -o executable
```
````

**Compiler Flags**:

- `-c`: Compile without running
- `-w`: Show warnings
- `-x`: Execute after compilation

**Output**: executable (custom name specified)

**Last Successful Build**: 2026-01-19 18:00:00
**Success Rate**: 80%

## Critical Workflows [WORKFLOW]

1. Edit source file
2. Compile with full flags: `-c -w -x`
3. Specify output name with `-o`
4. Run resulting executable

```

## Benefits

### Before This Feature
❌ Agent forgets build commands after summarization
❌ Uses wrong flags (defaults instead of user's workflow)
❌ Requires manual user correction
❌ Wastes time and causes errors

### After This Feature
✅ Build commands persisted across conversations
✅ Warnings when parameters differ from history
✅ Automatic context restoration
✅ Build history and statistics tracking
✅ Zero manual intervention needed

## Implementation Details

### Storage Location
```

~/.qb64pe-mcp/project-contexts/
├── abc123def456.json # Project context (hashed by directory)
├── 789ghi012jkl.json
└── ...

````

### Project Hash Generation
Projects are identified by MD5 hash of their directory path:
```typescript
const hash = crypto.createHash('md5')
  .update(dirname(sourceFilePath).toLowerCase())
  .digest('hex')
  .substring(0, 12);
````

This ensures:

- Unique identification per project directory
- Persistence across file renames within same directory
- Cross-platform compatibility

### Build History Limit

- Stores last 20 builds per project
- Prevents unbounded growth
- Provides sufficient history for pattern analysis

### Context File Format

```json
{
  "projectPath": "/path/to/project",
  "projectHash": "abc123def456",
  "lastUsedCommand": {
    "qb64pePath": "/usr/bin/qb64pe",
    "compilerFlags": ["-c", "-w", "-x"],
    "outputName": "program",
    "sourceFilePath": "/path/to/project/source.bas",
    "fullCommand": "/usr/bin/qb64pe -c -w -x -o program source.bas"
  },
  "lastSuccessfulBuild": {
    "timestamp": "2026-01-19T18:00:00.000Z",
    "executablePath": "/path/to/project/program",
    "command": "/usr/bin/qb64pe -c -w -x -o program source.bas"
  },
  "buildHistory": [
    {
      "timestamp": "2026-01-19T18:00:00.000Z",
      "command": "...",
      "flags": ["-c", "-w", "-x"],
      "success": true
    }
  ],
  "createdAt": "2026-01-19T17:00:00.000Z",
  "updatedAt": "2026-01-19T18:00:00.000Z"
}
```

## Testing

Tests located in: `tests/services/project-build-context-service.test.ts`

Coverage includes:

- Context loading and saving
- Parameter difference detection
- Build history tracking
- Statistics calculation
- Project listing
- Context clearing

Run tests:

```bash
npm test project-build-context-service.test.ts
```

## Future Enhancements

Potential improvements identified in session problem log:

1. **Workflow Detection**: Automatically detect repeated command patterns
2. **Parameter Memory**: Remember last successful parameters per file
3. **Validation Prompts**: Prompt user when switching from established workflow
4. **Build Profiles**: Support multiple build configurations (debug, release, etc.)
5. **Team Sharing**: Share build contexts across team via git

## Related Documentation

- [Session Problems Service](./QB64PE_SESSION_PROBLEMS.md)
- [Compiler Tools](../tools/compile_and_verify_qb64pe.md)
- [Logging Service](./QB64PE_LOGGING_SERVICE_GUIDE.md)

## Conclusion

The Build Context Preservation feature ensures that critical build information survives conversation summarization, preventing the loss of procedural knowledge and maintaining workflow continuity across LLM interactions.

**Key Takeaway**: Build commands are automatically remembered, warnings are provided when parameters change, and summaries can include [BUILD-CRITICAL] markers to preserve essential information.
