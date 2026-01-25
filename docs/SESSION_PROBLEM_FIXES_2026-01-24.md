# Session Problem Fixes - January 24, 2026

This document describes the MCP server improvements implemented based on problems identified in session `session-2026-01-24-owwi3h`.

## Overview

Three critical improvements were made to help prevent common QB64PE programming errors:

1. **DIM AS vs Sigil Mismatch Validator** (Critical Priority)
2. **REDIM \_PRESERVE Warning for .BI Files** (High Priority)
3. **GPL Palette Format Documentation** (Low Priority)

---

## 1. DIM AS vs Sigil Mismatch Validator

### Problem Description

In QB64PE, `DIM x AS INTEGER` creates a variable named `x`, but `x%` (with sigil) is treated as a **DIFFERENT uninitialized variable**. This causes silent bugs where code compiles but fails at runtime with uninitialized values or subscript out of range errors.

### Session Example

```basic
DIM SHARED PALETTE_LOADER_COUNT AS INTEGER
PALETTE_LOADER_COUNT% = 0  ' WRONG - creates a different variable!
```

The code above creates TWO variables:

- `PALETTE_LOADER_COUNT` (declared, initialized to 0 by default)
- `PALETTE_LOADER_COUNT%` (undeclared, used on line 2, contains garbage values)

### Solution Implemented

Added `checkVariableNamingMismatch()` method to [syntax-service.ts](../../src/services/syntax-service.ts):

- **Pass 1**: Scans code for `DIM [SHARED] variableName AS type` declarations (without sigils)
- **Pass 2**: Scans code for variable references with sigils (%, &, !, #, $)
- **Detection**: Flags when a variable declared without sigil is referenced WITH a sigil

### Error Detection

The validator now detects:

```basic
DIM SHARED PALETTE_LOADER_COUNT AS INTEGER
PALETTE_LOADER_COUNT% = 0
```

**Error Message:**

```
Variable 'PALETTE_LOADER_COUNT' declared with 'DIM AS INTEGER' but referenced
as 'PALETTE_LOADER_COUNT%' - these are DIFFERENT variables
```

**Suggestion:**

```
Use 'PALETTE_LOADER_COUNT%' in DIM statement, or remove sigil in usage:
change 'PALETTE_LOADER_COUNT%' to 'PALETTE_LOADER_COUNT'
```

### Correct Patterns

✅ **Option 1**: Use sigil in DIM

```basic
DIM SHARED PALETTE_LOADER_COUNT% AS INTEGER
PALETTE_LOADER_COUNT% = 0
```

✅ **Option 2**: No sigil in DIM or usage

```basic
DIM SHARED PALETTE_LOADER_COUNT AS INTEGER
PALETTE_LOADER_COUNT = 0
```

### Testing

Test file: [test-dim-as-sigil-mismatch.js](../../tests/integration/test-dim-as-sigil-mismatch.js)

- ✅ Detects session problem case
- ✅ Detects multiple variable mismatches
- ✅ No false positives for correct code

---

## 2. REDIM \_PRESERVE Warning for .BI Files

### Problem Description

`REDIM _PRESERVE` can **shrink** arrays, not just grow them. If an array is DIM'd with 256 elements and later code does `REDIM _PRESERVE` to 16 elements, data is lost. This is especially dangerous in initialization code that runs after main array setup.

### Session Example

```basic
' Main file:
DIM SHARED PAL(0 TO 255) AS _UNSIGNED LONG

' EGA.BI include file:
REDIM _PRESERVE SHARED PAL(0 TO 15)  ' WRONG - shrinks from 256 to 16!
```

This caused `UBOUND(PAL)` to change from 255 to 15, silently discarding 240 palette entries.

### Solution Implemented

Added validation to [file-structure-service.ts](../../src/services/file-structure-service.ts):

Detects `REDIM _PRESERVE SHARED` in .BI files and reports it as an **error**.

### Error Detection

```basic
REDIM _PRESERVE SHARED PAL(0 TO i%-1)
```

**Error Message:**

```
REDIM _PRESERVE on SHARED array in .BI file - can silently shrink arrays
```

**Suggestion:**

```
CRITICAL: REDIM _PRESERVE can shrink arrays, not just grow them.
Do NOT resize SHARED arrays in include files. Handle array sizing
in one authoritative location only.
```

### Best Practice

- Declare array size in **one authoritative location** (usually the main .BI file)
- **Never** resize SHARED arrays in include files
- If dynamic sizing is needed, handle it in the main program, not includes

### Testing

Test file: [test-redim-preserve-warning.js](../../tests/integration/test-redim-preserve-warning.js)

- ✅ Detects REDIM \_PRESERVE SHARED in .BI files
- ✅ No false positives for normal .BI files

---

## 3. GPL Palette Format Documentation

### Problem Description

GIMP GPL palette files can use **EITHER spaces OR tabs** as RGB value delimiters. Some palettes (like ATARI-8BIT.gpl) use tabs. A parser that only handles spaces will fail silently, returning 0 colors.

### Session Example

File `ATARI-8BIT.gpl`:

```
GIMP Palette
Name: Atari 8-bit
#
0	0	0
255	255	255
```

Parser checking only for spaces:

```basic
IF char$ = " " THEN  ' Won't detect tabs!
```

Result: `PALETTE_LIST().count = 0` despite file having 256 colors.

### Solution Implemented

Added file format documentation to [compatibility-service.ts](../../src/services/compatibility-service.ts):

New knowledge base section: `file_formats.gimp_gpl_palette`

### Documentation Content

```typescript
gimp_gpl_palette: {
  name: "GIMP GPL Palette Format (.gpl)",
  description: "GIMP palette files can use EITHER spaces OR tabs as RGB value delimiters",
  parsing_issue: "Parsers that only handle spaces will fail on tab-delimited files (e.g., ATARI-8BIT.gpl)",
  solution: "Check for both space (ASCII 32) and tab (CHR$(9)) when parsing RGB values",
  example_fix: "IF char$ = \" \" OR char$ = CHR$(9) THEN  ' Treat both as delimiters",
  detection: "Use shell commands like 'head -20 file.gpl | cat -A' to visualize tabs (shown as ^I)",
  reference: "https://docs.gimp.org/en/gimp-concepts-palettes.html"
}
```

### Correct Parser Code

```basic
' Parse RGB values - handle BOTH spaces AND tabs
IF char$ = " " OR char$ = CHR$(9) THEN
    ' delimiter found
END IF
```

### Access

LLMs can now query this information via:

- `searchCompatibility("GPL palette format")`
- `searchCompatibility("file format")`
- `getBestPractices()` (includes file format notes)

---

## Impact

### Critical Priority (Variable Naming)

- **Prevents**: Silent runtime bugs from variable name confusion
- **Severity**: Critical (causes subscript errors, uninitialized variables)
- **Detection**: Immediate feedback during syntax validation
- **Category**: `variable_naming_mismatch`

### High Priority (REDIM \_PRESERVE)

- **Prevents**: Silent data loss from array shrinking
- **Severity**: High (causes missing data, unexpected behavior)
- **Detection**: Immediate feedback during .BI file validation
- **Category**: `array_resizing`

### Low Priority (GPL Format)

- **Prevents**: Parser failures on tab-delimited palette files
- **Severity**: Medium (causes empty palettes, feature failure)
- **Detection**: Accessible via compatibility knowledge base
- **Category**: `file_formats`

---

## Files Modified

1. **src/services/syntax-service.ts**
   - Added `checkVariableNamingMismatch()` method
   - Integrated into `validateSyntax()` workflow

2. **src/services/file-structure-service.ts**
   - Added REDIM \_PRESERVE detection in `validateBIFile()`

3. **src/services/compatibility-service.ts**
   - Added `file_formats` section to knowledge base
   - Documented GIMP GPL palette format

## Tests Created

1. **tests/integration/test-dim-as-sigil-mismatch.js**
   - Tests variable naming mismatch detection
   - 3 test cases with different scenarios

2. **tests/integration/test-redim-preserve-warning.js**
   - Tests REDIM \_PRESERVE detection in .BI files
   - 2 test cases (error case and normal case)

---

## Usage Examples

### For LLM Agents

**Syntax Validation:**

```typescript
const result = await syntaxService.validateSyntax(code, "basic");

// Check for variable naming mismatches
const mismatchIssues = result.compatibilityIssues.filter(
  (i) => i.category === "variable_naming_mismatch",
);
```

**File Structure Validation:**

```typescript
const biResult = fileStructureService.validateBIFile(biContent);

// Check for REDIM _PRESERVE errors
const redimIssues = biResult.issues.filter((i) =>
  i.issue.includes("REDIM _PRESERVE"),
);
```

**Knowledge Base Query:**

```typescript
const results = await compatibilityService.searchCompatibility("GPL palette");
// Returns file format documentation
```

---

## References

- Session Problems File: [session-2026-01-24-owwi3h.json](../../../.qb64pe-mcp/session-problems/session-2026-01-24-owwi3h.json)
- QB64PE Wiki: https://qb64phoenix.com/qb64wiki/
- GIMP Palette Documentation: https://docs.gimp.org/en/gimp-concepts-palettes.html

---

**Date Implemented:** January 24, 2026  
**Session ID:** session-2026-01-24-owwi3h  
**Status:** ✅ Complete - All tests passing
