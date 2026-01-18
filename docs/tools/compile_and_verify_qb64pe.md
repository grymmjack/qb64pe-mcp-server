# compile_and_verify_qb64pe

Compile QB64PE code and return detailed error analysis with actionable suggestions. This tool enables **autonomous compile-verify-fix loops** by providing structured compilation results that can be analyzed and acted upon programmatically.

## Purpose

This tool solves a critical workflow problem: agents making QB64PE code fixes but requiring human intervention to verify compilation. With `compile_and_verify_qb64pe`, agents can:

1. Make code changes/fixes
2. **Automatically compile** to verify the fix
3. **Analyze compilation output** for errors
4. **Iterate autonomously** until successful compilation
5. Only return to user when compilation succeeds or unresolvable error occurs

## Parameters

### Required Parameters

**sourceFilePath** (string)  
Absolute path to the QB64PE source file (.bas) to compile. Must exist and be readable.

### Optional Parameters

**qb64pePath** (string)  
Path to QB64PE executable. If not provided, the tool will automatically search:
- Common installation locations (`/usr/local/bin/qb64pe`, `/opt/qb64pe/qb64pe`, etc.)
- System PATH
- Use `detect_qb64pe_installation` tool if QB64PE location is uncertain

**compilerFlags** (array of strings)  
Additional compiler flags to pass to QB64PE. Default: `['-c', '-w']`
- `-c` = Compile without running
- `-w` = Show warnings
- `-g` = Generate debug information
- `-z` = Enable optimizations
- `-o <name>` = Specify output executable name

## Response Structure

```json
{
  "success": true|false,
  "output": "Full compilation output from QB64PE",
  "errors": [
    {
      "line": 42,
      "message": "Type mismatch: Cannot assign STRING to INTEGER",
      "severity": "error"|"warning"
    }
  ],
  "executablePath": "/path/to/compiled/executable",
  "suggestions": [
    "Check variable types and ensure they match in assignments",
    "Use AS clause for explicit type declarations",
    "Compilation successful! Executable created."
  ]
}
```

### Response Fields

- **success**: `true` if compilation succeeded and executable was created
- **output**: Complete stdout/stderr from QB64PE compiler
- **errors**: Array of parsed errors and warnings with line numbers when available
- **executablePath**: Path to compiled executable (only if success=true)
- **suggestions**: Actionable recommendations for fixing errors or next steps

## Autonomous Workflow Pattern

### Complete Compile-Verify-Fix Loop

```javascript
// Agent autonomous workflow - NO HUMAN INTERVENTION REQUIRED
async function autonomousCompileFix(sourceFile) {
  let iteration = 0;
  const maxIterations = 5;
  
  while (iteration < maxIterations) {
    iteration++;
    console.log(`Iteration ${iteration}: Compiling...`);
    
    // 1. Compile and verify
    const result = await compileAndVerifyQb64pe({
      sourceFilePath: sourceFile
    });
    
    // 2. Check if successful
    if (result.success) {
      console.log("✅ Compilation successful!");
      console.log(`Executable: ${result.executablePath}`);
      return { success: true, iterations: iteration };
    }
    
    // 3. Analyze errors
    console.log(`❌ Compilation failed with ${result.errors.length} errors`);
    result.errors.forEach(err => {
      console.log(`  Line ${err.line || '?'}: ${err.message}`);
    });
    
    // 4. Apply fixes based on error analysis
    const fixes = await analyzeDetermineFixe(result.errors, result.suggestions);
    if (fixes.length === 0) {
      console.log("⚠️ No fixes could be determined automatically");
      return { success: false, reason: "unresolvable", iterations: iteration };
    }
    
    // 5. Apply fixes to source code
    await applyFixes(sourceFile, fixes);
    console.log(`Applied ${fixes.length} fixes, recompiling...`);
    
    // Loop continues - compile again with fixes
  }
  
  return { success: false, reason: "max_iterations", iterations: iteration };
}
```

### Pre-Compilation Validation

```javascript
// Best practice: Validate syntax BEFORE compiling
async function smartCompileWorkflow(sourceFile) {
  // 1. Pre-check syntax (fast, no compilation needed)
  const syntaxCheck = await validateQb64peSyntax({
    code: await readFile(sourceFile),
    checkLevel: "strict"
  });
  
  if (!syntaxCheck.isValid) {
    console.log("Syntax errors detected before compilation:");
    syntaxCheck.errors.forEach(err => console.log(`  ${err.message}`));
    
    // Fix syntax errors first
    await fixSyntaxErrors(sourceFile, syntaxCheck.errors);
  }
  
  // 2. Now compile with verified syntax
  const compileResult = await compileAndVerifyQb64pe({
    sourceFilePath: sourceFile
  });
  
  return compileResult;
}
```

### Porting Workflow with Autonomous Verification

```javascript
// Port QBasic code and autonomously verify compilation
async function portAndVerify(qbasicFile, outputFile) {
  // 1. Port QBasic to QB64PE
  const ported = await portQbasicToQb64pe({
    sourceCode: await readFile(qbasicFile),
    sourceDialect: "qbasic"
  });
  
  // 2. Save ported code
  await writeFile(outputFile, ported.convertedCode);
  
  // 3. Autonomous compilation loop
  let iteration = 0;
  while (iteration < 3) {
    iteration++;
    
    const result = await compileAndVerifyQb64pe({
      sourceFilePath: outputFile
    });
    
    if (result.success) {
      console.log(`✅ Port successful after ${iteration} iteration(s)`);
      return result;
    }
    
    // Analyze and fix porting issues
    const fixes = await analyzePortingErrors(result.errors);
    await applyFixes(outputFile, fixes);
  }
  
  throw new Error("Porting verification failed after 3 iterations");
}
```

## Error Analysis and Suggestions

The tool provides context-aware suggestions based on error patterns:

### Type Mismatch Errors
```json
{
  "error": {
    "line": 15,
    "message": "Type mismatch: Cannot assign STRING to INTEGER",
    "severity": "error"
  },
  "suggestions": [
    "Check variable types and ensure they match in assignments and function calls",
    "Use AS clause for explicit type declarations (e.g., DIM x AS INTEGER)"
  ]
}
```

### Undeclared Variable Errors
```json
{
  "error": {
    "line": 28,
    "message": "Variable 'count' used before declaration",
    "severity": "error"
  },
  "suggestions": [
    "Ensure all variables are declared with DIM statement",
    "Check variable scoping - use DIM SHARED for global variables"
  ]
}
```

### SUB/FUNCTION Errors
```json
{
  "error": {
    "line": 45,
    "message": "Expected END FUNCTION",
    "severity": "error"
  },
  "suggestions": [
    "Verify SUB/FUNCTION blocks are properly closed with END SUB/END FUNCTION",
    "Ensure SUB/FUNCTION definitions come after main program code"
  ]
}
```

## Platform Compatibility

The tool automatically handles platform-specific details:

- **Executable Extensions**: `.exe` on Windows, no extension on Unix/Linux/macOS
- **Path Separators**: Uses correct separators for the platform
- **QB64PE Detection**: Searches platform-appropriate installation locations
- **Command Execution**: Handles platform-specific shell differences

## Integration with Other Tools

### Recommended Tool Chain

```javascript
// Complete development workflow with tool chain
async function developmentWorkflow(sourceFile) {
  // 1. Installation check
  const installation = await detectQb64peInstallation();
  if (!installation.isInstalled) {
    throw new Error("QB64PE not installed. Use get_qb64pe_installation_guidance");
  }
  
  // 2. Pre-compilation syntax validation
  const syntax = await validateQb64peSyntax({
    code: await readFile(sourceFile),
    checkLevel: "best-practices"
  });
  
  // 3. Compatibility check
  const compat = await validateQb64peCompatibility({
    code: await readFile(sourceFile),
    platform: "all"
  });
  
  // 4. Compile with autonomous retry
  return await autonomousCompileFix(sourceFile);
}
```

### Related Tools

- **`detect_qb64pe_installation`**: Find QB64PE before compilation
- **`validate_qb64pe_syntax`**: Pre-check syntax before compiling
- **`validate_qb64pe_compatibility`**: Check platform compatibility
- **`port_qbasic_to_qb64pe`**: Port and compile QBasic code
- **`get_compiler_options`**: Learn about available compiler flags
- **`get_debugging_help`**: Get debugging strategies for runtime issues

## Error Handling

### QB64PE Not Found

```json
{
  "success": false,
  "output": "",
  "errors": [
    {
      "message": "QB64PE not found. Please specify qb64pePath or ensure QB64PE is in your PATH.",
      "severity": "error"
    }
  ],
  "suggestions": [
    "Install QB64PE or provide the path to the QB64PE executable",
    "Use detect_qb64pe_installation tool to find QB64PE on your system"
  ]
}
```

### Source File Not Found

```json
{
  "success": false,
  "output": "",
  "errors": [
    {
      "message": "Source file not found: /path/to/missing.bas",
      "severity": "error"
    }
  ],
  "suggestions": [
    "Ensure the file path is correct and the file exists"
  ]
}
```

### Compilation Timeout

The tool has a 30-second timeout for compilation. If QB64PE hangs:

```json
{
  "success": false,
  "output": "Partial output before timeout...",
  "errors": [
    {
      "message": "Compilation timed out after 30 seconds",
      "severity": "error"
    }
  ],
  "suggestions": [
    "Check for infinite loops in meta-programming ($IF blocks)",
    "Verify all $INCLUDE files are accessible",
    "Try compiling with fewer optimizations"
  ]
}
```

## Best Practices

### 1. Always Compile After Fixes

**DON'T:**
```javascript
// ❌ Make fix and return to user without verification
await replaceStringInFile(file, oldCode, fixedCode);
// Agent stops here, user must manually compile
```

**DO:**
```javascript
// ✅ Make fix and autonomously verify it works
await replaceStringInFile(file, oldCode, fixedCode);

const result = await compileAndVerifyQb64pe({
  sourceFilePath: file
});

if (!result.success) {
  // Iterate and fix more issues
  await handleCompilationErrors(result.errors);
}
```

### 2. Use Pre-Compilation Validation

```javascript
// Validate syntax first (faster than compilation)
const syntaxCheck = await validateQb64peSyntax({ code, checkLevel: "strict" });
if (!syntaxCheck.isValid) {
  // Fix syntax errors before attempting compilation
  await fixSyntaxIssues(syntaxCheck.errors);
}

// Then compile
await compileAndVerifyQb64pe({ sourceFilePath: file });
```

### 3. Limit Iteration Count

```javascript
// Prevent infinite loops - cap iterations
const MAX_ITERATIONS = 5;
for (let i = 0; i < MAX_ITERATIONS; i++) {
  const result = await compileAndVerifyQb64pe({ sourceFilePath: file });
  if (result.success) break;
  
  await applyFixes(file, result.errors);
}
```

### 4. Provide Detailed Error Context

```javascript
// When returning to user, include full context
if (!result.success) {
  console.log("Compilation failed after autonomous fix attempts:");
  console.log(`Errors remaining: ${result.errors.length}`);
  result.errors.forEach((err, i) => {
    console.log(`${i + 1}. Line ${err.line || '?'}: ${err.message}`);
  });
  console.log("\nSuggested actions:");
  result.suggestions.forEach((sug, i) => {
    console.log(`${i + 1}. ${sug}`);
  });
}
```

## System Prompt Guidance for LLMs

When using this tool, LLMs should follow this pattern:

```
AUTONOMOUS COMPILATION WORKFLOW:

When fixing QB64PE compilation errors:

1. Make code fixes using edit tools
2. IMMEDIATELY call compile_and_verify_qb64pe to verify the fix
3. Analyze compilation results:
   - If success: Report to user and complete task
   - If errors: Analyze error messages and suggestions
4. Apply additional fixes based on error analysis
5. REPEAT steps 2-4 until:
   - Compilation succeeds, OR
   - No more automatic fixes can be determined, OR
   - Maximum iterations reached (typically 5)

NEVER:
- Make a fix and wait for user to compile
- Stop after first compilation error without attempting fixes
- Assume fixes work without verification

ALWAYS:
- Compile after each fix to verify it works
- Use error messages and suggestions to guide next fix
- Continue iterating autonomously until success or deadlock
```

## Performance Considerations

- **Compilation Time**: Typical QB64PE compilation takes 2-30 seconds depending on code size
- **Timeout**: 30-second timeout prevents hanging on problematic code
- **Iteration Limits**: Recommend max 5 iterations to prevent excessive API usage
- **Pre-validation**: Use `validate_qb64pe_syntax` first to catch syntax errors without compilation

## Success Metrics

### Efficiency Gain

**Before (Human Intervention Required):**
- Agent makes fix
- Human manually runs compilation
- Human reports error back to agent
- Repeat for each error
- **Result**: 3+ human interventions per porting task

**After (Autonomous Loop):**
- Agent makes fix
- Agent compiles automatically
- Agent analyzes results autonomously
- Agent iterates until success
- **Result**: 0 human interventions (100% reduction)

### Example Session Improvement

**Session Problem Addressed:**
```json
{
  "problem": "Agent required human intervention to compile after each fix",
  "iterations": 3,
  "humanInterventions": 3,
  "solution": "Use compile_and_verify_qb64pe for autonomous verification",
  "expectedOutcome": "0 human interventions needed"
}
```

---

**See Also:**
- [validate_qb64pe_syntax](./validate_qb64pe_syntax.md) - Pre-compilation syntax checking
- [validate_qb64pe_compatibility](./validate_qb64pe_compatibility.md) - Platform compatibility
- [port_qbasic_to_qb64pe](./port_qbasic_to_qb64pe.md) - QBasic porting with compilation
- [detect_qb64pe_installation](./detect_qb64pe_installation.md) - Find QB64PE installation
- [get_compiler_options](./get_compiler_options.md) - Compiler flags reference
