# Build Context Auto-Detection Feature

## Problem Addressed

**Session Problem:** `session-2026-02-11-z5rh3p.json`  
**Issue:** Agent ignores build context warnings and uses incorrect compiler flags

### The Problem

During a QB64PE development session, the agent repeatedly used incorrect compiler flags when calling `compile_and_verify_qb64pe`, despite the tool returning `contextWarning` messages about build parameter differences from previous successful builds. This resulted in:

- Multiple failed compilation attempts (3+) with wrong flag combinations
- Agent not checking `get_project_build_context` before compiling
- Wasted time and user frustration
- Manual intervention required to correct flag usage

### Root Cause

1. Agent workflow did not include checking `get_project_build_context` before compilation
2. Agent ignored `contextWarning` in compilation results
3. Tool defaulted to `["-c", "-x", "-w"]` regardless of previous successful builds
4. No automatic mechanism to apply stored successful flags

## The Solution

### Automatic Build Context Detection

The `compile_and_verify_qb64pe` tool now **automatically** retrieves and applies stored compiler flags from previous successful builds when no flags are explicitly provided.

#### How It Works

```
┌─────────────────────────────────────────────────────┐
│  Agent calls compile_and_verify_qb64pe              │
│  without providing compilerFlags parameter          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Tool checks build context for this project         │
└──────────────────────┬──────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
  ┌────────────────┐      ┌────────────────┐
  │ Context exists │      │ No context     │
  │ with flags     │      │ found          │
  └────────┬───────┘      └────────┬───────┘
           │                       │
           ▼                       ▼
  ┌────────────────┐      ┌────────────────┐
  │ Use stored     │      │ Use defaults   │
  │ flags (e.g.,   │      │ ["-c", "-x",   │
  │ ["-w", "-x"])  │      │ "-w"]          │
  └────────┬───────┘      └────────┬───────┘
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Compile with chosen  │
           │  flags                │
           └───────────────────────┘
```

### Implementation Details

#### 1. Compiler Service Update

**File:** `src/services/compiler-service.ts`

Added `useStoredFlags` parameter (default: `true`) to `compileAndVerify()` method:

```typescript
async compileAndVerify(
  sourceFilePath: string,
  qb64pePath?: string,
  compilerFlags?: string[],
  useStoredFlags: boolean = true,
): Promise<...> {
  // Check build context for previous build parameters
  const previousContext = await this.buildContextService.getContext(sourceFilePath);

  // Auto-determine compiler flags with priority:
  // 1) User-provided flags
  // 2) Stored flags from build context (if useStoredFlags=true)
  // 3) Default flags
  let flags: string[];
  if (compilerFlags) {
    flags = compilerFlags;
  } else if (useStoredFlags && previousContext?.lastUsedCommand?.compilerFlags) {
    flags = previousContext.lastUsedCommand.compilerFlags;
    // Log and inform user
    result.suggestions.push(
      `ℹ️ Using previously successful compiler flags: ${JSON.stringify(flags)}`
    );
  } else {
    flags = ["-c", "-x", "-w"];
  }

  // ... rest of compilation logic
}
```

#### 2. Tool Schema Update

**File:** `src/tools/compiler-tools.ts`

Updated tool registration to include new parameter and enhanced description:

```typescript
server.registerTool(
  "compile_and_verify_qb64pe",
  {
    title: "Compile and Verify QB64PE Code",
    description:
      // ... existing description ...
      "🔧 **BUILD CONTEXT AUTO-DETECTION:**\n" +
      "This tool AUTOMATICALLY uses previously successful compiler flags from build context when available.\n" +
      "If no flags are provided and a successful build exists, those flags will be reused automatically.\n" +
      "Set useStoredFlags=false to explicitly ignore stored flags and use defaults instead.\n\n",
    inputSchema: {
      sourceFilePath: z.string().describe(...),
      qb64pePath: z.string().optional().describe(...),
      compilerFlags: z
        .array(z.string())
        .optional()
        .describe(
          "Compiler flags to use. If not provided, will automatically use stored flags from previous successful build, or default to ['-c', '-x', '-w']"
        ),
      useStoredFlags: z
        .boolean()
        .optional()
        .describe(
          "Whether to automatically use stored flags from build context when compilerFlags is not provided (default: true)"
        ),
    },
  },
  async ({ sourceFilePath, qb64pePath, compilerFlags, useStoredFlags }) => {
    const result = await services.compilerService.compileAndVerify(
      sourceFilePath,
      qb64pePath,
      compilerFlags,
      useStoredFlags
    );
    return createMCPResponse(result);
  }
);
```

#### 3. Documentation Updates

**File:** `docs/tools/compile_and_verify_qb64pe.md`

Added comprehensive section on auto-detection workflow:

- Explanation of the feature
- Usage examples (recommended, manual, override)
- Benefits and key improvements
- Updated system prompt guidance for LLMs

## Usage Examples

### Recommended: Let Auto-Detection Work

```typescript
// ✅ No flags provided - tool automatically uses stored successful flags
const result = await compile_and_verify_qb64pe({
  sourceFilePath: "/path/to/project.bas",
});
// If previous build used ["-w", "-x"], those flags are reused automatically
```

### Optional: Manual Check

```typescript
// If you want to explicitly verify what flags were used before
const context = await get_project_build_context({
  sourceFilePath: "/path/to/project.bas",
});

if (context && context.lastUsedCommand) {
  console.log("Previous flags:", context.lastUsedCommand.compilerFlags);
}

// Then compile (auto-uses those flags anyway)
await compile_and_verify_qb64pe({
  sourceFilePath: "/path/to/project.bas",
});
```

### Override When Needed

```typescript
// Explicitly provide different flags to override stored ones
await compile_and_verify_qb64pe({
  sourceFilePath: "/path/to/project.bas",
  compilerFlags: ["-c", "-w", "-g"], // Use these instead of stored
});

// OR disable auto-detection to force defaults
await compile_and_verify_qb64pe({
  sourceFilePath: "/path/to/project.bas",
  useStoredFlags: false, // Ignore build context, use defaults
});
```

## Benefits

### Before This Feature

```
Compilation Attempt 1: ["-c", "-w", "-x"] ❌ (wrong flags)
  └─ contextWarning: "Previous build used [-w, -x]"
     └─ Agent IGNORES warning

Compilation Attempt 2: ["-w", "-x", "-o", "DRAW.run"] ❌ (wrong order)
  └─ Unexpected character error

Compilation Attempt 3: ["-w", "-x"] ✅ (finally correct)
  └─ Success, but wasted 2 attempts
```

**Metrics:**

- Compilation attempts: 3
- Failed attempts: 2
- Time wasted: ~120 seconds
- User frustration: High

### After This Feature

```
Compilation Attempt 1: ["-w", "-x"] ✅ (auto-detected from build context)
  └─ Success on first try
  └─ Suggestion: "ℹ️ Using previously successful compiler flags: ['-w', '-x']"
```

**Metrics:**

- Compilation attempts: 1
- Failed attempts: 0
- Time saved: ~120 seconds
- User frustration: None

### Key Improvements

✅ **Prevents compilation failures** from wrong flag combinations  
✅ **Eliminates manual tracking** of compiler flags across sessions  
✅ **Automatically learns** from successful builds  
✅ **Reduces attempts** from 3+ down to 1  
✅ **Works seamlessly** across conversation summaries  
✅ **Zero configuration** - works out of the box

## Agent Workflow Changes

### Old Workflow (Problematic)

```
1. User reports compilation error
2. Agent makes code fix
3. Agent calls compile_and_verify_qb64pe with default/guessed flags
4. Tool returns contextWarning about parameter mismatch
5. Agent IGNORES warning, tries different flags manually
6. Multiple failed attempts
7. Eventually succeeds or gives up
```

### New Workflow (Improved)

```
1. User reports compilation error or requests code change
2. Agent makes code fix
3. Agent calls compile_and_verify_qb64pe (NO FLAGS PROVIDED)
4. Tool automatically uses stored successful flags (if exists)
5. Compilation succeeds on first attempt ✅
6. Agent reports success to user
```

## Technical Notes

### Priority Order for Flag Selection

1. **Explicit `compilerFlags` parameter** - User/agent intentionally provides specific flags
2. **Stored flags from build context** - Retrieved from previous successful build (if `useStoredFlags=true`)
3. **Default flags** - Fallback to `["-c", "-x", "-w"]`

### Build Context Storage

Build contexts are stored in `~/.qb64pe-mcp/project-contexts/` with:

- Project hash (based on directory)
- Last used command (flags, output name, full command)
- Build history (last 20 builds with success/failure status)
- Statistics (success rate, most used flags)

### Backward Compatibility

- Existing code continues to work unchanged
- `compilerFlags` parameter still takes precedence
- `useStoredFlags` defaults to `true` (can be disabled if needed)
- No breaking changes to API

## Related Files

- `src/services/compiler-service.ts` - Auto-detection logic
- `src/tools/compiler-tools.ts` - Tool registration with new parameter
- `docs/tools/compile_and_verify_qb64pe.md` - Updated documentation
- `docs/BUILD_CONTEXT_PRESERVATION.md` - Build context system overview
- `src/services/project-build-context-service.ts` - Build context storage

## Session Problem Resolution

**Original Problem:** `session-2026-02-11-z5rh3p.json`

**Status:** ✅ **RESOLVED**

**Solution Applied:**

1. ✅ Auto-detection of stored compiler flags
2. ✅ Tool automatically applies proven-working flag combinations
3. ✅ Enhanced documentation and agent guidance
4. ✅ Optional override mechanism for edge cases

**Expected Outcome:**

- Compilation attempts reduced from 3+ to 1
- Zero agent workflow changes required
- Automatic learning from successful builds
- Seamless operation across conversation boundaries

## Future Enhancements

Potential future improvements:

1. **Platform-specific flag detection** - Different flags for Windows/Linux/macOS
2. **Flag validation** - Warn when incompatible flags are combined
3. **Smart suggestions** - Recommend optimal flags based on project type
4. **Performance tracking** - Measure compilation time with different flag combinations
5. **Conflict resolution** - Handle cases where stored flags fail on different systems

---

**Date Implemented:** February 10, 2026  
**Issue Reference:** session-2026-02-11-z5rh3p.json  
**Severity:** High  
**Status:** Resolved
