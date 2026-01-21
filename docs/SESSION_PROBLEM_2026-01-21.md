# Session Problem Resolution - January 21, 2026

## Summary
Addressed compatibility issues identified in session `session-2026-01-21-waqugi` by enhancing the QB64PE MCP server's compatibility checking capabilities.

## Problems Identified

### 1. Boolean Constants Not Defined (HIGH PRIORITY)
**Issue**: QB64PE does not define TRUE and FALSE constants by default, but code was using them expecting them to be available.

**Symptoms**:
- `Syntax error - TRUE is not defined in QB64PE`
- Code using `MARQUEE_draw TRUE` or `IF condition = TRUE THEN` fails to compile

**Root Cause**: QB64PE follows traditional BASIC convention where boolean values are represented as -1 (true) and 0 (false), but doesn't pre-define TRUE/FALSE constants.

### 2. Unnecessary DECLARE SUB Statements (MEDIUM PRIORITY)
**Issue**: DECLARE SUB statements are unnecessary in QB64PE as SUBs are automatically available throughout the program.

**Symptoms**:
- Code includes `DECLARE SUB MyProcedure` statements that add clutter
- Confusion about when DECLARE is needed vs not needed

**Root Cause**: QB64PE's modern parser handles forward references automatically for SUBs, unlike older BASIC dialects.

## Implemented Solutions

### 1. Boolean Constants Detection
Added new compatibility rule `undefined_boolean_constants`:
- **Pattern**: Detects usage of `TRUE` or `FALSE` without definition
- **Severity**: Error
- **Suggestion**: Use -1 for true and 0 for false, or define constants
- **Category**: `boolean_constants`

**Code Changes**:
- Added pattern to `src/services/compatibility-service.ts`
- Added pattern to `src/data/compatibility-rules.json`
- Added comprehensive knowledge base section in JSON explaining boolean values
- Includes examples of correct and incorrect usage

### 2. Unnecessary DECLARE SUB Detection
Added new compatibility rule `unnecessary_declare_sub`:
- **Pattern**: Detects `DECLARE SUB` statements at start of lines
- **Severity**: Warning
- **Suggestion**: Remove DECLARE SUB, only DECLARE FUNCTION is needed
- **Category**: `unnecessary_declarations`

**Code Changes**:
- Added pattern to `src/services/compatibility-service.ts`
- Added pattern to `src/data/compatibility-rules.json`
- Added comprehensive knowledge base section explaining DECLARE usage
- Updated best practices to include this guidance

## Documentation Updates

### Knowledge Base Additions

#### Boolean Constants Section
- Explains why -1 is true (all bits set) and 0 is false
- Shows how to define your own TRUE/FALSE constants
- Mentions alternative _TRUE/_FALSE (if user-defined)
- Includes rationale for BASIC boolean convention
- Provides correct/incorrect code examples

#### DECLARE Statements Section
- Clarifies when DECLARE is needed (functions) vs not needed (subs)
- Explains QB64PE's automatic forward reference handling
- Shows migration path from QBasic/older dialects
- Includes correct/incorrect code examples
- Documents function return type signatures

### Best Practices Updates
Added to coding guidelines:
- "Boolean values: Use -1 for true and 0 for false (or define CONST TRUE = -1, FALSE = 0)"
- "No DECLARE SUB needed: SUBs are automatically available, only DECLARE FUNCTIONs"

Added to syntax rules:
- "TRUE and FALSE are not built-in constants - use -1 and 0 respectively"
- "DECLARE SUB is unnecessary - only DECLARE FUNCTION is needed"

## Test Coverage

### New Tests Added
Created comprehensive test suite in `tests/services/compatibility-service.test.ts`:

**Boolean Constants Tests**:
- Detects undefined TRUE constant usage
- Detects undefined FALSE constant usage
- Does not flag TRUE when being defined (CONST TRUE = -1)
- Provides correct suggestions (-1 and 0)

**DECLARE SUB Tests**:
- Detects unnecessary DECLARE SUB statements
- Does not flag DECLARE FUNCTION (which is needed)
- Provides suggestion to remove DECLARE SUB
- Mentions that only DECLARE FUNCTION is needed

**Test Results**: All 61 tests pass ✓

## Impact Assessment

### Benefits
1. **Prevents Compilation Errors**: Catches TRUE/FALSE usage before compilation
2. **Cleaner Code**: Identifies unnecessary DECLARE SUB statements
3. **Better Education**: Knowledge base educates developers about QB64PE conventions
4. **Improved Workflow**: Reduces trial-and-error cycles during development

### Backward Compatibility
- No breaking changes to existing API
- All existing tests continue to pass
- New rules are additive - enhance existing validation

## Usage Examples

### Before (Error-Prone Code)
```basic
DECLARE SUB MyProcedure
DECLARE SUB Draw_Menu

DIM running AS INTEGER
running = TRUE

IF running = TRUE THEN
    MARQUEE_draw TRUE
END IF

SUB MyProcedure
    PRINT "Hello"
END SUB
```

### After (Corrected Code)
```basic
' No DECLARE SUB needed - removed

' Define boolean constants at top
CONST TRUE = -1
CONST FALSE = 0

DIM running AS INTEGER
running = TRUE  ' Now defined

IF running = TRUE THEN
    MARQUEE_draw TRUE  ' Now defined
END IF

SUB MyProcedure
    PRINT "Hello"
END SUB
```

Or use literal values:
```basic
' No DECLARE SUB needed

DIM running AS INTEGER
running = -1  ' Use -1 for true

IF running = -1 THEN
    MARQUEE_draw -1  ' Use -1 for true
END IF

SUB MyProcedure
    PRINT "Hello"
END SUB
```

## Files Modified

1. `/src/services/compatibility-service.ts`
   - Added two new compatibility rules with examples and suggestions
   - Updated knowledge base with boolean_constants and unnecessary_declarations sections

2. `/src/data/compatibility-rules.json`
   - Added `undefined_boolean_constants` pattern
   - Added `unnecessary_declare_sub` pattern
   - Added comprehensive boolean_constants knowledge section
   - Added comprehensive declare_statements knowledge section
   - Updated best_practices arrays

3. `/tests/services/compatibility-service.test.ts`
   - Added 8 new test cases for boolean constants validation
   - Added 4 new test cases for DECLARE SUB validation

## Recommendations

### For LLM Agents Using This MCP
1. Always check for TRUE/FALSE usage and suggest -1/0 or constant definitions
2. Scan code for DECLARE SUB statements and recommend removal
3. Only suggest DECLARE FUNCTION for functions with return values
4. Educate users about QB64PE boolean conventions when they ask

### For Users
1. Define `CONST TRUE = -1, FALSE = 0` at the top of your program if you prefer named constants
2. Remove all DECLARE SUB statements from your code
3. Only use DECLARE FUNCTION for functions that return values
4. Run compatibility validation before compiling to catch these issues

## Future Enhancements
- [ ] Add auto-fix capability to replace TRUE with -1 and FALSE with 0
- [ ] Add auto-fix to remove DECLARE SUB statements
- [ ] Consider adding _TRUE and _FALSE constants to a standard include file
- [ ] Enhance workflow detection to prefer VSCode tasks over direct tool calls

## Version Information
- **MCP Server Version**: 2.0.0
- **Date Implemented**: January 21, 2026
- **Session Reference**: session-2026-01-21-waqugi
- **Test Status**: All tests passing (61/61)
