# New Tools Documentation - Add to README.md

## Session Problems Tools (4 tools)

### log_session_problem
**Purpose:** Log development problems during coding sessions for continuous MCP improvement

**Use Case:** Track issues encountered, solutions found, and improvements needed

**Parameters:**
- `category` - Problem category (syntax, compatibility, tooling, api, documentation, deployment, performance)
- `severity` - Issue severity (low, medium, high, critical)
- `title` - Brief problem description
- `description` - Detailed explanation
- `context` - Development context (language, framework, library, function)
- `problem` - What was attempted and what error occurred
- `solution` - How it was solved (approach, code, workaround)
- `mcpImprovement` - Suggestions for MCP server improvements
- `metrics` - Performance metrics (attempts, time, tools used)

**Example:**
```json
{
  "category": "syntax",
  "severity": "high",
  "title": "FUNCTION with UDT return type",
  "description": "QB64PE doesn't support UDTs as FUNCTION return types",
  "context": {
    "language": "QB64PE",
    "library": "VIDEO_MODES"
  },
  "problem": {
    "attempted": "FUNCTION get_mode() AS video_mode",
    "error": "Cannot return UDT from FUNCTION"
  },
  "solution": {
    "approach": "Convert to SUB with BYREF parameter",
    "code": "SUB get_mode(result AS video_mode)"
  }
}
```

---

### get_session_problems_report
**Purpose:** Generate comprehensive analysis reports of logged session problems

**Use Case:** Review problems, identify patterns, generate documentation

**Parameters:**
- `format` - Report format (summary, detailed, markdown)

**Formats:**
- **summary** - Overview with counts and key patterns
- **detailed** - Full problem details with all metadata
- **markdown** - Exportable markdown document

**Example:**
```json
{
  "format": "summary"
}
```

**Output:**
```
# Session Problems Report

Total problems: 5

## By Category
- syntax: 3
- tooling: 2

## By Severity
- high: 3
- medium: 2

## Key Patterns
1. Tool non-usage: 5 occurrences
2. Syntax errors: 3 occurrences

## Recommendations
1. Use validation tools before code generation
2. Check file structure before compilation
```

---

### get_session_problems_statistics
**Purpose:** Statistical analysis of session problems

**Use Case:** Track metrics, measure tool effectiveness, identify improvement areas

**Returns:**
- Problem counts by category and severity
- Average attempts before solution
- Tool usage statistics
- Time wasted analysis
- Pattern frequency

**Example:**
```json
{}
```

---

### clear_session_problems
**Purpose:** Reset session problems log for new development session

**Use Case:** Start fresh after exporting reports or completing a project

**Example:**
```json
{}
```

---

## File Structure Validation Tools (4 tools)

### validate_bi_file_structure
**Purpose:** Validate QB64_GJ_LIB .BI (header/interface) file structure

**Use Case:** Ensure .BI files contain only declarations, not implementations

**Parameters:**
- `content` - Content of the .BI file
- `filename` - Filename for context (optional)

**Validates:**
- ✅ TYPE definitions
- ✅ CONST declarations
- ✅ DIM SHARED variables
- ❌ SUB/FUNCTION implementations (error)
- ℹ️ DECLARE statements (info - optional in QB64PE)

**Example:**
```json
{
  "content": "$INCLUDEONCE\n\nTYPE video_mode\n    width AS INTEGER\nEND TYPE\n\nSUB test\nEND SUB",
  "filename": "VIDEO_MODES.BI"
}
```

**Output:**
```
# .BI File Structure Validation: VIDEO_MODES.BI

**Status:** ❌ INVALID

## Issues Found
- Errors: 1

### ❌ Errors
**Line 8:** SUB/FUNCTION implementation found in .BI file
  Code: `SUB test`
  Fix: Move 'test' implementation to .BM file.
```

---

### validate_bm_file_structure
**Purpose:** Validate QB64_GJ_LIB .BM (implementation) file structure - CRITICAL for preventing compilation errors

**Use Case:** Ensure .BM files contain ONLY SUB/FUNCTION implementations

**Parameters:**
- `content` - Content of the .BM file
- `filename` - Filename for context (optional)

**Validates:**
- ✅ SUB/FUNCTION implementations ONLY
- ❌ TYPE definitions (error - move to .BI)
- ❌ CONST declarations (warning - move to .BI)
- ❌ DIM SHARED variables (CRITICAL ERROR - causes "Statement cannot be placed between SUB/FUNCTIONs")

**Example:**
```json
{
  "content": "$INCLUDEONCE\n\nDIM SHARED test AS INTEGER\n\nSUB init\nEND SUB",
  "filename": "VIDEO_MODES.BM"
}
```

**Output:**
```
# .BM File Structure Validation: VIDEO_MODES.BM

**Status:** ❌ INVALID

## Issues Found
- Errors: 1

### ❌ Errors (MUST FIX)
**Line 3:** DIM SHARED found in .BM file
  Code: `DIM SHARED test AS INTEGER`
  Fix: Move all DIM SHARED declarations to .BI file. This is CRITICAL for QB64_GJ_LIB architecture.

## Recommendations
- CRITICAL: Move all DIM SHARED declarations to .BI file to avoid compilation errors
```

---

### validate_qb64_gj_lib_file_pair
**Purpose:** Validate matched .BI/.BM file pair for QB64_GJ_LIB architecture compliance

**Use Case:** Check both files together before compilation

**Parameters:**
- `biContent` - Content of the .BI file
- `bmContent` - Content of the .BM file
- `libraryName` - Name of the library (optional)

**Validates:**
- Both file structures
- $INCLUDEONCE in both files
- Proper separation of concerns
- Overall architecture compliance

**Example:**
```json
{
  "biContent": "$INCLUDEONCE\n\nDIM SHARED test AS INTEGER",
  "bmContent": "$INCLUDEONCE\n\nSUB init\nEND SUB",
  "libraryName": "VIDEO_MODES"
}
```

---

### quick_check_qb64_file_structure
**Purpose:** Fast structure check of any QB64PE file before compilation

**Use Case:** Quick validation to catch common errors

**Parameters:**
- `filename` - Filename (with .BI or .BM extension)
- `content` - File content

**Features:**
- Auto-detects file type from extension
- Shows top 5 issues
- Directs to detailed validation if needed
- Skips non-.BI/.BM files

**Example:**
```json
{
  "filename": "VIDEO_MODES.BM",
  "content": "$INCLUDEONCE\n\nSUB test\nEND SUB"
}
```

**Output:**
```
# Quick Structure Check: VIDEO_MODES.BM

**File Type:** .BM
**Status:** ✅ VALID
**Issues:** 0 errors, 0 warnings

✅ File structure looks good!
```

---

## Integration Notes

### Tool Categories
- **Session Problems Tools** - Category: Development & Feedback
- **File Structure Tools** - Category: Validation & Quality

### Recommended Workflow

**Before Coding:**
1. Review previous session problems with `get_session_problems_report`
2. Clear old session with `clear_session_problems`

**During Development:**
1. Log problems as they occur with `log_session_problem`
2. Validate file structure with `quick_check_qb64_file_structure`
3. Use detailed validation for specific file types

**After Coding:**
1. Generate session report with `get_session_problems_report format=markdown`
2. Review statistics with `get_session_problems_statistics`
3. Export for team review or documentation

**Before Compilation:**
1. Validate .BI files with `validate_bi_file_structure`
2. Validate .BM files with `validate_bm_file_structure`
3. Validate pairs with `validate_qb64_gj_lib_file_pair`

---

## Error Prevention

These tools prevent common QB64PE/QB64_GJ_LIB errors:

1. **DIM SHARED Placement** - Prevents "Statement cannot be placed between SUB/FUNCTIONs"
2. **File Structure Violations** - Ensures proper .BI/.BM separation
3. **Recurring Problems** - Tracks patterns to prevent repetition
4. **Tool Non-Usage** - Identifies when MCP tools should have been used

---

## Statistics & Metrics

Track development efficiency:
- Average attempts before solution
- Time wasted on preventable errors
- Tool usage vs should-have-used ratios
- Pattern frequency analysis
- Category and severity distributions

---

*Last Updated: January 17, 2026*  
*Total MCP Tools: 59*
