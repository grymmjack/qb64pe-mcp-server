# Session Problems Service Test

## Purpose
Test the newly added Session Problems Service and Tools to ensure they work correctly.

## New Features Added
1. **SessionProblemsService** - Comprehensive problem tracking and analysis
2. **4 New MCP Tools**:
   - `log_session_problem` - Log development problems
   - `get_session_problems_report` - Generate reports (summary/detailed/markdown)
   - `get_session_problems_statistics` - Get statistical analysis
   - `clear_session_problems` - Reset for new session

## Test Scenarios

### Test 1: Log a Simple Problem
```
Tool: log_session_problem
Parameters:
{
  "category": "syntax",
  "severity": "medium",
  "title": "FUNCTION with UDT return type",
  "description": "QB64PE doesn't support UDTs as FUNCTION return types",
  "context": {
    "language": "QB64PE",
    "library": "VIDEO_MODES",
    "function": "get_video_mode"
  },
  "problem": {
    "attempted": "FUNCTION get_video_mode() AS video_mode",
    "error": "Cannot return UDT from FUNCTION"
  },
  "solution": {
    "approach": "Convert to SUB with BYREF parameter",
    "code": "SUB get_video_mode(result AS video_mode)"
  }
}
```

### Test 2: Generate Summary Report
```
Tool: get_session_problems_report
Parameters:
{
  "format": "summary"
}
```

### Test 3: Get Statistics
```
Tool: get_session_problems_statistics
Parameters: {}
```

### Test 4: Generate Detailed Report
```
Tool: get_session_problems_report
Parameters:
{
  "format": "detailed"
}
```

### Test 5: Generate Markdown Export
```
Tool: get_session_problems_report
Parameters:
{
  "format": "markdown"
}
```

## Expected Outcomes
1. Problems are logged with unique IDs
2. Summary shows problem counts by category and severity
3. Statistics calculate averages and patterns
4. Detailed report includes all problem information
5. Markdown format is properly structured for export

## Verification Steps
1. ✅ TypeScript compiles without errors
2. ✅ Build output includes new service and tools
3. ⏳ MCP server recognizes new tools
4. ⏳ Tools execute and return expected results
5. ⏳ Reports generate correctly
6. ⏳ Statistics are accurate
