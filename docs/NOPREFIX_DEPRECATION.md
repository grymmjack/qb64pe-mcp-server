# $NOPREFIX Deprecation in QB64-PE

## Overview

`$NOPREFIX` was **deprecated in QB64-PE v4.0.0** and should no longer be used in new QB64PE code.

## What Was $NOPREFIX?

$NOPREFIX was a metacommand that allowed QB64-specific keywords to be used without the underscore prefix. For example:

```basic
$NOPREFIX
Screen NewImage(800, 600, 32)
Circle (400, 300), 100, RGB32(255, 0, 0)
```

## Why Was It Deprecated?

1. **Naming Conflicts**: Removing the underscore prefix could cause conflicts with existing QBasic/QuickBASIC variables and constants
2. **Code Compatibility**: Made it harder to port code between QB64 projects
3. **Confusion**: Mixed naming conventions (with and without underscores) reduced code clarity
4. **QB64-PE Evolution**: The underscore prefix is now the standard convention

## Automatic Conversion

QB64-PE v4.0.0+ includes an **automatic converter** that handles code with `$NOPREFIX`. When you try to compile code with `$NOPREFIX`, QB64-PE will automatically:

1. Remove the `$NOPREFIX` metacommand
2. Add underscores to all QB64-specific keywords
3. Compile the converted code

## How to Fix Old Code

### Before (with $NOPREFIX):
```basic
$NOPREFIX
Screen NewImage(800, 600, 32)
Cls
Circle (400, 300), 100, RGB32(255, 0, 0)
Display
```

### After (modern QB64-PE):
```basic
SCREEN _NEWIMAGE(800, 600, 32)
CLS
CIRCLE (400, 300), 100, _RGB32(255, 0, 0)
_DISPLAY
```

## MCP Server Handling

The QB64PE MCP Server automatically handles `$NOPREFIX` removal:

### Porting Service
- Automatically detects and removes `$NOPREFIX` from ported code
- Adds warning about deprecation
- Ensures all QB64 keywords use underscore prefix

### Feedback Service
- No longer suggests using `$NOPREFIX`
- Removed from best practices recommendations

### Keywords Service
- Updated keyword definition to mark as deprecated
- Provides deprecation information in lookup

## Modern QB64-PE Best Practices

### Always Use Underscore Prefixes
```basic
' ✅ CORRECT - Modern QB64-PE
_DISPLAY
_RGB32(255, 0, 0)
_NEWIMAGE(800, 600, 32)
_KEYHIT
_MOUSEX

' ❌ INCORRECT - Don't use without underscore
DISPLAY
RGB32(255, 0, 0)
NEWIMAGE(800, 600, 32)
```

### Exception: SUB _GL
The only QB64 keyword that **must always be prefixed** is `SUB _GL`, even when `$NOPREFIX` was used.

## Migration Guide

If you have existing code with `$NOPREFIX`:

1. **Automatic (Recommended)**: Let QB64-PE's auto-converter handle it when you compile
2. **Manual**: Use the MCP Server's porting service to convert your code
3. **Find & Replace**: Use these patterns:
   - Remove line: `$NOPREFIX` or `$NoPrefix`
   - Add underscores to QB64 keywords (see keyword list below)

## Common QB64 Keywords Requiring Underscore

### Graphics
- `_NEWIMAGE` (not NewImage)
- `_RGB32`, `_RGBA32`, `_RGB`, `_RGBA`
- `_DISPLAY`, `_AUTODISPLAY`
- `_PUTIMAGE`, `_LOADIMAGE`, `_FREEIMAGE`
- `_RED32`, `_GREEN32`, `_BLUE32`, `_ALPHA32`

### Input
- `_KEYHIT`, `_KEYDOWN`
- `_MOUSEINPUT`, `_MOUSEX`, `_MOUSEY`, `_MOUSEBUTTON`

### Screen
- `_SCREENMOVE`, `_SCREENX`, `_SCREENY`
- `_WIDTH`, `_HEIGHT`
- `_FULLSCREEN`, `_RESIZE`

### Sound
- `_SNDOPEN`, `_SNDPLAY`, `_SNDSTOP`, `_SNDCLOSE`

### System
- `_TITLE`, `_ICON`
- `_DELAY`, `_LIMIT`
- `_OS$`, `_BIT`, `_BYTE`

## Example Conversion

### Old Program with $NOPREFIX
```basic
$NoPrefix
Dim img As Long
img = LoadImage("sprite.png")
Screen NewImage(800, 600, 32)
Title "My Game"

Do
    Cls
    PutImage (100, 100), img
    Display
    Limit 60
Loop Until KeyHit = 27

FreeImage img
End
```

### Modernized for QB64-PE
```basic
DIM img AS LONG
img = _LOADIMAGE("sprite.png")
SCREEN _NEWIMAGE(800, 600, 32)
_TITLE "My Game"

DO
    CLS
    _PUTIMAGE (100, 100), img
    _DISPLAY
    _LIMIT 60
LOOP UNTIL _KEYHIT = 27

_FREEIMAGE img
END
```

## References

- [QB64-PE Wiki: $NOPREFIX](https://qb64phoenix.com/qb64wiki/index.php/$NOPREFIX)
- [QB64-PE Forum Discussion](https://qb64phoenix.com/forum/)
- QB64-PE v4.0.0 Release Notes

## Summary

- ✅ **DO**: Use underscore prefix for all QB64-specific keywords
- ✅ **DO**: Let QB64-PE auto-convert old code with `$NOPREFIX`
- ✅ **DO**: Update your coding habits to modern QB64-PE standards
- ❌ **DON'T**: Use `$NOPREFIX` in new code
- ❌ **DON'T**: Mix prefixed and non-prefixed keywords
- ❌ **DON'T**: Assume old code examples will work without conversion

---

**Last Updated**: January 17, 2026  
**QB64-PE Version**: v4.0.0+  
**Status**: $NOPREFIX is officially deprecated
