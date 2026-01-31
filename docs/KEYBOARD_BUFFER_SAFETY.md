# Keyboard Buffer Safety Validation

## Overview

The `validate_keyboard_buffer_safety` tool detects potential keyboard buffer leakage issues in QB64PE code. This addresses a subtle but critical bug pattern where CTRL+key combinations produce ASCII control characters that leak into the keyboard buffer and trigger unintended handlers.

## The Problem

When implementing keyboard shortcuts with modifier keys (CTRL, ALT, SHIFT), a common issue arises:

1. **CTRL+key combinations produce ASCII control characters**
   - CTRL+A through CTRL+Z produce ASCII 1-26
   - CTRL+2 produces ASCII 0 (NULL)
   - **CTRL+3 produces ASCII 27 (ESC)** - this is particularly dangerous!
   - CTRL+6 produces ASCII 30

2. **_KEYDOWN() doesn't consume the buffer**
   - `_KEYDOWN()` detects key state but leaves characters in the buffer
   - Later `INKEY$` calls pick up these control characters
   - Multiple handlers may process the same keystroke

3. **Cascading handler execution**
   - If your code has an ESC handler using `_KEYDOWN(27)`
   - And CTRL+3 is pressed (which produces ASCII 27)
   - The ESC handler triggers, but ASCII 27 remains in buffer
   - Other handlers that check `INKEY$` for `CHR$(27)` also trigger

## Real-World Example

This issue was discovered when implementing CTRL+0-9 for background color selection:

```basic
' Problematic code structure
SUB KEYBOARD_HandleInput
    ' Check for ESC to close menu
    IF _KEYDOWN(27) THEN
        HideMenu
        EXIT SUB  ' ASCII 27 still in buffer!
    END IF
    
    ' Check for CTRL modifier
    IF _KEYDOWN(100305) OR _KEYDOWN(100306) THEN
        ' CTRL+3 produces ASCII 27, leaks to INKEY$
        k$ = INKEY$
        ' k$ contains CHR$(27) and triggers ESC behavior elsewhere
    END IF
END SUB
```

## The Solution

### Buffer Drain Pattern

Always drain the keyboard buffer after `_KEYDOWN()` checks for keys that produce `INKEY$` characters:

```basic
' Correct approach
DO WHILE _KEYHIT: LOOP  ' Drain keyboard buffer
```

### Strategic Placement

1. **After _KEYDOWN(27) (ESC) checks:**
```basic
IF _KEYDOWN(27) THEN
    HideMenu
    DO WHILE _KEYHIT: LOOP  ' Drain buffer
    EXIT SUB
END IF
```

2. **Before INKEY$ when CTRL is held:**
```basic
IF _KEYDOWN(100305) OR _KEYDOWN(100306) THEN
    DO WHILE _KEYHIT: LOOP  ' Drain control characters
    ' Now safe to process other input
END IF
```

3. **Before EXIT SUB/FUNCTION after _KEYDOWN():**
```basic
IF _KEYDOWN(someKey) THEN
    ProcessKey
    DO WHILE _KEYHIT: LOOP  ' Clean up before exit
    EXIT SUB
END IF
```

## Tool Usage

### MCP Tool

```
mcp_qb64pe_validate_keyboard_buffer_safety
```

### Input

- `code`: QB64PE source code to analyze

### Output

The tool returns a comprehensive report including:

- **Issues Found**: Categorized by risk level (high, medium, low)
- **Code Statistics**: Usage counts for `_KEYDOWN()`, `INKEY$`, buffer drains, and modifier checks
- **Suggestions**: Context-specific recommendations
- **Best Practices**: General guidelines for keyboard buffer safety
- **Control Character Reference**: ASCII values produced by CTRL+key combinations

## Risk Levels

| Risk Level | Description | Example |
|------------|-------------|---------|
| **High** | ESC key detection without buffer drain | `_KEYDOWN(27)` without `DO WHILE _KEYHIT: LOOP` |
| **High** | CTRL modifier with nearby INKEY$ without drain | CTRL check followed by INKEY$ |
| **Medium** | EXIT SUB/FUNCTION after _KEYDOWN without drain | May leave control chars in buffer |
| **Medium** | INKEY$ near CTRL/ALT detection without prior drain | May capture unintended characters |

## Control Character Reference

| CTRL+Key | ASCII Value | Notes |
|----------|-------------|-------|
| CTRL+@ | 0 | NULL character (same as CTRL+2) |
| CTRL+A - CTRL+Z | 1-26 | Standard control characters |
| CTRL+2 | 0 | NULL character |
| CTRL+3 | 27 | **ESC - triggers ESC handlers!** |
| CTRL+4 | 28 | File separator |
| CTRL+5 | 29 | Group separator |
| CTRL+6 | 30 | Record separator |
| CTRL+7 | 31 | Unit separator |

## Prevention Strategy

1. **Always pair _KEYDOWN() with buffer drain** when detecting keys that also produce INKEY$ characters
2. **Drain before INKEY$** when modifier keys are in use
3. **Drain before EXIT** when handling keyboard events
4. **Use this tool** during development to catch issues early

## See Also

- [QB64PE Wiki: _KEYDOWN](https://qb64phoenix.com/qb64wiki/index.php/_KEYDOWN)
- [QB64PE Wiki: INKEY$](https://qb64phoenix.com/qb64wiki/index.php/INKEY$)
- [QB64PE Wiki: _KEYHIT](https://qb64phoenix.com/qb64wiki/index.php/_KEYHIT)

## Session Problem Reference

This tool was created in response to a logged session problem:
- **Title**: CTRL+number key handling causes crash due to ASCII control character leakage
- **Category**: compatibility
- **Severity**: high
- **Time to identify**: ~45 minutes
- **Root cause**: INKEY$ captures ASCII control characters from CTRL+key combinations before _KEYDOWN() processing
