# QB64PE Development Session Problems Log
**Date:** January 17, 2026  
**Task:** Implementing VIDEO_MODES library for QB64_GJ_LIB  
**Purpose:** Document issues for MCP server improvement and LLM training

---

## CRITICAL: Need for New MCP Tool

### Proposed Tool: `log_session_problems`
**Purpose:** Allow LLMs and users to log development problems during chat sessions for:
- Continuous improvement of MCP tools
- Training data for future LLM interactions
- Pattern recognition in common mistakes
- Documentation of language-specific quirks

**Functionality:**
- Log problems with context (language, framework, error type)
- Categorize by severity and frequency
- Link to solutions and preventive measures
- Generate reports for MCP development team
- Enable feedback loop for tool refinement

---

## Problems Encountered and Solutions

### 1. QB64PE Function Return Type Syntax (HIGH SEVERITY)
**Problem:**
- Used standard BASIC syntax: `FUNCTION name() AS INTEGER`
- QB64PE compiler error: "Expected )" and "Expected ("
- Tried removing parentheses: `FUNCTION name AS INTEGER` - still failed

**Root Cause:**
- QB64PE requires type sigils (%, &, $, !, #) for function returns
- Cannot use `AS TYPE` clause for function return types
- This is a MAJOR departure from standard BASIC syntax

**Solution:**
```basic
' WRONG:
FUNCTION vm_screen_width() AS INTEGER

' CORRECT:
FUNCTION vm_screen_width%
```

**Prevention:**
- MCP tool `mcp_qb64pe_validate_qb64pe_syntax` caught this AFTER manual attempts
- Should have been called FIRST before any code generation
- Need LLM training to recognize QB64PE syntax patterns

**MCP Improvement Needed:**
- Add proactive syntax checking during code generation
- Provide real-time QB64PE syntax hints
- Warn when standard BASIC patterns won't work in QB64PE

---

### 2. Function Parameters with No Arguments (MEDIUM SEVERITY)
**Problem:**
- Used `FUNCTION name()` with empty parentheses
- QB64PE expects no parentheses when function has no parameters

**Solution:**
```basic
' WRONG:
FUNCTION vm_screen_width%()

' CORRECT:
FUNCTION vm_screen_width%
```

**Prevention:**
- This should be part of syntax validation
- MCP tool caught it, but only after being called

**MCP Improvement Needed:**
- Include this in QB64PE best practices documentation
- Validate during code generation phase

---

### 3. Reserved Keyword Conflicts (HIGH SEVERITY)
**Problem:**
- Variable name `pos` caused: "Name already in use (pos)"
- Variable name `palette` caused: "Name already in use (palette)"
- Not obvious that these are reserved in QB64PE

**Occurrences:**
1. Line 243 in VIDEO_MODES.BM: Used `pos` for position counter
2. Test file: Used `pal` and `palette` for palette variables

**Solution:**
- Renamed `pos` → `color_pos`
- Renamed `pal`/`palette` → `cga_pal`

**Prevention:**
- Need MCP tool to check against QB64PE reserved word list
- Should validate variable names during code generation

**MCP Improvement Needed:**
- Create `mcp_qb64pe_validate_identifiers` tool
- Check all variable/function names against reserved words
- Provide suggestions for alternative names
- Include in syntax validation pipeline

---

### 4. DIM SHARED Placement Rules (CRITICAL SEVERITY)
**Problem:**
- Placed `DIM SHARED` statements in .BM (implementation) file
- Error: "Statement cannot be placed between SUB/FUNCTIONs"
- Compilation failed at 94% progress

**Code Location:**
```basic
' VIDEO_MODES.BM (WRONG)
$INCLUDEONCE

DIM SHARED VM_MODES_INITIALIZED AS INTEGER
DIM SHARED VM_MODES_DATA(100) AS VM_MODE
DIM SHARED VM_MODES_COUNT AS INTEGER
```

**Root Cause:**
- QB64PE .BM files can ONLY contain SUB/FUNCTION implementations
- ALL variable declarations (DIM SHARED) must be in .BI files
- This is specific to QB64_GJ_LIB architecture pattern

**Solution:**
- Moved all DIM SHARED statements from .BM to .BI file
- .BI file: Types, Constants, DIM SHARED declarations
- .BM file: SUB/FUNCTION implementations ONLY

**Prevention:**
- MCP tool should understand QB64_GJ_LIB .BI/.BM pattern
- Validate file structure before compilation
- Check that .BM contains only SUB/FUNCTION definitions

**MCP Improvement Needed:**
- Add `mcp_qb64pe_validate_file_structure` tool
- Understand project-specific patterns (like .BI/.BM split)
- Provide warnings during code generation
- Parse copilot-instructions.md for project conventions

---

### 5. DECLARE Statements in QB64PE (LOW SEVERITY)
**Problem:**
- Initially included DECLARE statements in .BI file
- These are optional in QB64PE (unlike QuickBASIC 4.5)
- Caused confusion and unnecessary code

**Solution:**
- Removed all DECLARE statements from .BI file
- QB64PE handles forward references automatically

**Prevention:**
- MCP documentation should clarify QB64PE vs QB4.5 differences
- copilot-instructions.md specifies this, but wasn't followed initially

**MCP Improvement Needed:**
- Better parsing of project conventions from documentation
- Distinguish between QB64PE and legacy BASIC requirements

---

### 6. UDT Return Values Not Supported (MEDIUM SEVERITY)
**Problem:**
- Tried to create functions returning User Defined Types (UDTs)
- QB64PE doesn't support this well
- Error: "Name already in use"

**Attempted Code:**
```basic
FUNCTION vm_get_mode(index AS INTEGER) AS VM_MODE
    ' ... returns UDT
END FUNCTION
```

**Solution:**
- Changed to SUB-based API with BYREF parameters
```basic
SUB vm_get_mode(index AS INTEGER, result AS VM_MODE)
    ' ... populates result
END SUB
```

**Prevention:**
- MCP tool should know QB64PE limitations
- Suggest SUB with BYREF instead of FUNCTION for UDT returns

**MCP Improvement Needed:**
- Document QB64PE type system limitations
- Provide alternative patterns when restrictions encountered
- Include in compatibility checking

---

### 7. Delayed Use of MCP Tools (CRITICAL PROCESS ISSUE)
**Problem:**
- Available MCP tools not used immediately
- Multiple manual attempts to fix syntax errors
- User had to explicitly instruct: "self serve your own education"
- Wasted time and context window on trial-and-error

**Pattern:**
1. Generated code with wrong syntax
2. Compilation failed
3. Tried to fix manually (guessed wrong)
4. Compilation failed again
5. User redirected to use MCP tools
6. Finally called `mcp_qb64pe_validate_qb64pe_syntax`
7. Got correct answer immediately

**Root Cause:**
- LLM didn't prioritize using available tools
- Assumed knowledge instead of validating
- MCP tools treated as optional, not required

**Solution:**
- User instruction forced use of MCP tools
- Immediate success after tool usage
- Learned correct patterns from tool responses

**Prevention:**
- **ALWAYS use MCP tools FIRST for QB64PE syntax questions**
- Don't guess or assume QB64PE syntax
- Validate before generating code, not after

**MCP Improvement Needed (HIGHEST PRIORITY):**
- LLM training should emphasize: "When MCP tools available, USE THEM FIRST"
- Add workflow guidance: Validate → Generate → Test
- Create meta-tool that suggests which tools to use for given task
- Implement pre-generation validation hooks

---

## Compilation Timeline

| Attempt | Error | Solution | Tool Used |
|---------|-------|----------|-----------|
| 1 | "Expected )" | Manual fix - WRONG | None |
| 2 | "Expected (" | Manual fix - WRONG | None |
| 3 | "Name already in use" (UDT return) | Changed to SUB | None |
| 4 | User intervention | --- | --- |
| 5 | simple_test.bas success | Used type sigils | `mcp_qb64pe_validate_qb64pe_syntax` ✓ |
| 6 | "Name already in use (pos)" | Renamed variable | `mcp_qb64pe_validate_qb64pe_syntax` ✓ |
| 7 | "Statement cannot be placed..." | Moved DIM SHARED to .BI | Manual analysis |
| 8 | **SUCCESS** | All fixes applied | --- |

**Time to First Error:** Immediate  
**Time to First MCP Tool Use:** After user redirection  
**Time to Solution After MCP Use:** Immediate  
**Lesson:** MCP tools work perfectly when actually used

---

## Language-Specific Quirks Discovered

### QB64PE Syntax Rules
1. Function return types use sigils: `%` `&` `$` `!` `#`
2. No `AS TYPE` clause for function returns
3. No parentheses for parameterless functions
4. Reserved words: `pos`, `palette`, `screen`, `step`, `timer`, etc.
5. UDT return values not well-supported
6. .BI/.BM file separation (project convention)

### QB64_GJ_LIB Architecture
1. .BI files: Types, Constants, DIM SHARED only
2. .BM files: SUB/FUNCTION implementations only
3. No DECLARE statements (QB64PE handles automatically)
4. Type sigil usage mandatory
5. PHPDoc-style comments for documentation

---

## Recommendations for MCP Development

### New Tools Needed

1. **`mcp_qb64pe_validate_identifiers`**
   - Check variable/function names against reserved words
   - Suggest alternatives when conflicts found
   - Include in pre-generation validation

2. **`mcp_qb64pe_validate_file_structure`**
   - Verify .BI contains only declarations
   - Verify .BM contains only implementations
   - Check project-specific conventions

3. **`mcp_qb64pe_generate_code_with_validation`**
   - Generate code with automatic syntax validation
   - Apply project conventions automatically
   - Return validated, ready-to-use code

4. **`log_session_problems`** (NEW - THIS REQUEST)
   - Log problems during development sessions
   - Categorize by language/framework/error type
   - Track solutions and prevention strategies
   - Generate reports for MCP improvement
   - Enable continuous learning and improvement

### Existing Tool Improvements

1. **`mcp_qb64pe_validate_qb64pe_syntax`**
   - Already works perfectly - just needs to be used FIRST
   - Should be called automatically before code generation
   - Make it default part of workflow, not optional

2. **`mcp_qb64pe_search_qb64pe_wiki`**
   - Used successfully for syntax lookup
   - Could be more proactive in suggesting usage

3. **`mcp_qb64pe_get_qb64pe_best_practices`**
   - Provided excellent guidance when called
   - Should be integrated into code generation process

### LLM Training Recommendations

1. **Prioritize MCP tool usage**
   - When tools available for task, USE THEM FIRST
   - Don't guess syntax - validate with tools
   - Tools are authoritative, memory is not

2. **QB64PE-specific training**
   - Type sigil system is MANDATORY
   - No `AS TYPE` for function returns
   - Reserved word awareness
   - .BI/.BM file separation patterns

3. **Error recovery patterns**
   - Reserved word conflicts → check with validation tool
   - Syntax errors → use syntax validation FIRST
   - Architecture questions → refer to project documentation

### Documentation Improvements

1. **QB64PE Syntax Guide**
   - Clear examples of ALL syntax variations
   - Reserved word list with alternatives
   - Type system limitations and workarounds

2. **Project Convention Guide**
   - .BI/.BM separation rules with examples
   - When to use DIM SHARED vs local variables
   - Naming conventions and namespace management

3. **MCP Workflow Guide**
   - When to use which tools
   - Required vs optional tool calls
   - Validation workflow: Validate → Generate → Test

---

## Success Metrics

### What Worked Well
✅ MCP tools provided accurate information when used  
✅ `mcp_qb64pe_validate_qb64pe_syntax` caught all syntax issues  
✅ Compilation succeeded after all MCP-guided fixes  
✅ Test suite (10 sections) passed completely  
✅ Library successfully integrated into QB64_GJ_LIB

### What Needs Improvement
❌ Delayed MCP tool usage (human needed to intervene)  
❌ Multiple failed compilation attempts before tool use  
❌ Reserved word conflicts not caught proactively  
❌ File structure rules not validated before compilation  
❌ No logging mechanism for problems encountered

### Key Learning
**The MCP tools work perfectly - the problem is getting the LLM to actually use them FIRST instead of guessing.**

---

## Conclusion

This session demonstrates that:
1. MCP tools are highly effective when used
2. Main problem is LLM workflow, not tool capability
3. Need for proactive validation and logging
4. Continuous improvement requires problem tracking
5. New `log_session_problems` tool would enable learning loop

**Recommendation:** Implement the `log_session_problems` tool ASAP to capture these lessons for future MCP development and LLM training refinement.

---

## Appendix: Error Messages for Training Data

```
Error 1: "Expected )"
Context: FUNCTION vm_screen_width() AS INTEGER
Fix: Use type sigil → FUNCTION vm_screen_width%

Error 2: "Name already in use (pos)"
Context: DIM pos AS INTEGER
Fix: Rename to avoid reserved word → DIM color_pos AS INTEGER

Error 3: "Statement cannot be placed between SUB/FUNCTIONs"
Context: DIM SHARED in .BM file
Fix: Move to .BI file

Error 4: "Name already in use (palette)"
Context: DIM palette AS VM_PALETTE
Fix: Rename to avoid reserved word → DIM cga_pal AS VM_PALETTE
```

These patterns should be added to QB64PE MCP server's knowledge base for future prevention.

---

**End of Session Problems Log**  
**Total Problems:** 7 major issues  
**Resolution Rate:** 100% (after MCP tool usage)  
**Time to Solution:** Immediate (when tools used)  
**Primary Learning:** USE THE TOOLS FIRST!
