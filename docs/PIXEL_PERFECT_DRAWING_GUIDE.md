# Pixel Perfect Drawing Guide for QB64PE

## Overview

This guide documents critical patterns and techniques for implementing pixel-perfect drawing algorithms in QB64PE, specifically focusing on Aseprite-style corner smoothing and real-time stroke collection.

## Session Problems Addressed

Based on actual development sessions (2026-01-24), these patterns solve common issues encountered when implementing pixel-perfect drawing modes.

---

## 1. Transparent Pixel Overwrites with \_DONTBLEND

### Problem

When restoring original pixel colors, `PSET` with transparent black (`0x00000000`) does not overwrite existing pixels unless `_DONTBLEND` is used. The canvas background appears black but is actually transparent.

### Root Cause

32-bit images use alpha channel - default cleared canvas is transparent (`0x00000000`), not opaque black (`0xFF000000`). QB64PE's default blend mode won't overwrite with transparent colors.

### Solution

```basic
' CRITICAL: Use _DONTBLEND when restoring transparent pixels
_DONTBLEND destinationImage&

FOR i% = 0 TO pixelCount% - 1
    ' This will now properly overwrite with transparent colors
    PSET (pixels(i%).x, pixels(i%).y), originalColor~&
NEXT

_BLEND destinationImage&  ' Restore normal blending
```

### Key Points

- **Always check what `POINT()` returns** - transparent vs opaque black
- **Use `_DONTBLEND` before PSET operations** that need to overwrite with transparent colors
- **Restore `_BLEND`** after the operation
- **Canvas initialization matters** - `CLS` creates transparent background in 32-bit mode

### Example: Erasing Pixels

```basic
' Capture original pixel colors before drawing
FOR i% = 0 TO count%
    originalColors~&(i%) = POINT(path(i%).X, path(i%).Y)
NEXT

' ... drawing code ...

' Restore original colors (may include transparent pixels)
_DONTBLEND canvasImage&
FOR i% = 0 TO count%
    PSET (path(i%).X, path(i%).Y), originalColors~&(i%)
NEXT
_BLEND canvasImage&
```

---

## 2. Pixel Perfect L-Corner Removal

### Problem

The Aseprite-style algorithm removes L-corners but can create gaps if consecutive corners are both removed. Cascading removal leaves no pixels in that area.

### Root Cause

After removing one corner, if the next pixel is also an L-corner and gets removed, neither pixel exists - creating a visual gap.

### Solution: Skip-Then-Draw-Unconditionally Pattern

```basic
' Check if current pixel is an L-corner
IF IsLCorner%(c%, path(), count%) THEN
    skippedCount% = skippedCount% + 1
    c% = c% + 1  ' Skip the corner

    ' CRITICAL: Draw next pixel WITHOUT corner-checking
    IF c% < count% THEN
        PSET (path(c%).X, path(c%).Y), drawColor~&
    END IF

    c% = c% + 1  ' Move to pixel after that
    GOTO continue_loop  ' Skip normal draw logic
END IF

' Normal draw (with corner checking)
PSET (path(c%).X, path(c%).Y), drawColor~&
c% = c% + 1

continue_loop:
```

### Algorithm Pattern

1. **Detect L-corner** using geometric rules
2. **Skip the corner pixel** (increment counter)
3. **Immediately draw next pixel** WITHOUT checking if it's also a corner
4. **Increment counter again** to move past the forced-draw pixel
5. **Continue normal iteration**

### Why This Works

- Guarantees at least one pixel between any two detected corners
- Prevents cascading gaps in smooth curves
- Maintains visual continuity while removing jaggy corners

### Corner Detection Example

```basic
FUNCTION IsLCorner% (index%, path() AS PathPoint, count%)
    IF index% = 0 OR index% >= count% - 1 THEN
        IsLCorner% = 0  ' Edge cases aren't corners
        EXIT FUNCTION
    END IF

    DIM dx1%, dy1%, dx2%, dy2%

    ' Vector from previous to current
    dx1% = path(index%).X - path(index% - 1).X
    dy1% = path(index%).Y - path(index% - 1).Y

    ' Vector from current to next
    dx2% = path(index% + 1).X - path(index%).X
    dy2% = path(index% + 1).Y - path(index%).Y

    ' L-corner: both vectors are orthogonal AND single-pixel length
    IF (dx1% * dx2% = 0) AND (dy1% * dy2% = 0) THEN
        IF (ABS(dx1%) = 1 OR ABS(dy1%) = 1) AND _
           (ABS(dx2%) = 1 OR ABS(dy2%) = 1) THEN
            IsLCorner% = -1  ' True
            EXIT FUNCTION
        END IF
    END IF

    IsLCorner% = 0  ' False
END FUNCTION
```

---

## 3. Real-Time Stroke Collection

### Problem

When collecting pixels during mouse drag with Bresenham line segments, checking only if current pixel equals LAST pixel misses duplicates when mouse jitters back over previously drawn areas.

### Root Cause

Mouse input can jitter, causing overlapping Bresenham segments that revisit earlier pixels in the path. Simply checking `path(count-1) <> current` doesn't catch revisits.

### Solution: Check Canvas State

```basic
' Set up source for pixel reading
_SOURCE canvasImage&

' During mouse drag loop
DO WHILE _MOUSEBUTTON(1)  ' While left button held
    cx% = _MOUSEX
    cy% = _MOUSEY

    ' CRITICAL: Check if pixel already drawn in this stroke
    existingColor~& = POINT(cx%, cy%)

    IF existingColor~& <> drawColor~& THEN
        ' Pixel not yet drawn - add to path
        path(pathCount%).X = cx%
        path(pathCount%).Y = cy%
        pathCount% = pathCount% + 1

        ' Draw immediately
        PSET (cx%, cy%), drawColor~&
    END IF

    ' ... Bresenham interpolation if needed ...

    _LIMIT 60
LOOP
```

### Key Benefits

- **Eliminates duplicates automatically** - canvas is source of truth
- **Handles mouse jitter** - revisited pixels already match color
- **Prevents non-sequential ordering** - path array stays clean
- **Works with Bresenham interpolation** - each interpolated pixel checked

### Integration with Bresenham

```basic
' Fill gap between last and current mouse position
IF pathCount% > 0 THEN
    lastX% = path(pathCount% - 1).X
    lastY% = path(pathCount% - 1).Y

    ' Bresenham line from last to current
    BresenhamLine lastX%, lastY%, cx%, cy%, drawColor~&, path(), pathCount%
END IF

SUB BresenhamLine (x1%, y1%, x2%, y2%, color~&, path() AS PathPoint, count%)
    ' ... bresenham setup ...

    DO
        ' Check canvas state before adding
        IF POINT(currentX%, currentY%) <> color~& THEN
            path(count%).X = currentX%
            path(count%).Y = currentY%
            count% = count% + 1
            PSET (currentX%, currentY%), color~&
        END IF

        ' ... bresenham step logic ...
    LOOP
END SUB
```

---

## 4. Visual Debugging for Graphics Algorithms

### Problem

Console `_ECHO` output confirms code executes but doesn't prove pixels are actually drawn to the correct destination. Visual result may be unchanged despite algorithm running.

### Solution: Visual Markers

```basic
' Draw obvious colored markers when key events occur
DIM debugMarkerColor~&
debugMarkerColor~& = _RGB32(0, 255, 0)  ' Bright green

' Example: Corner detection debug
IF IsLCorner%(c%, path(), count%) THEN
    ' VISUAL PROOF: Draw marker when corner detected
    LINE (0, 100)-(319, 100), debugMarkerColor~&  ' Screen edge line
    LINE (x% - 1, y% - 1)-(x% + 1, y% + 1), debugMarkerColor~&, BF  ' Pixel highlight

    ' Console log too (but visual is primary proof)
    _ECHO "Corner detected at (" + STR$(x%) + "," + STR$(y%) + ")"
END IF

' Example: Algorithm phase markers
SUB MarkPhase(phaseName$, y%)
    DIM phaseColor~&
    SELECT CASE phaseName$
        CASE "START": phaseColor~& = _RGB32(0, 255, 0)     ' Green
        CASE "PROCESS": phaseColor~& = _RGB32(255, 255, 0) ' Yellow
        CASE "END": phaseColor~& = _RGB32(255, 0, 0)       ' Red
    END SELECT

    ' Draw horizontal line at screen edge
    LINE (0, y%)-(10, y%), phaseColor~&
END SUB
```

### Visual Marker Strategies

1. **Edge markers** - Lines at screen edges (0-10 pixels width)
2. **Pixel highlights** - Small filled boxes around specific pixels
3. **Color coding** - Different colors for different events/phases
4. **Temporary markers** - Can be toggled or removed after verification

### Best Practices

- **Use bright, contrasting colors** (green, cyan, magenta)
- **Combine with console output** for complete debugging
- **Position markers at screen edges** to avoid obscuring main content
- **Use different colors** for different code paths
- **Keep markers small** (2-4 pixels) to maintain visibility

---

## Quick Reference

### Transparent Pixel Operations

```basic
_DONTBLEND dest&
PSET (x, y), transparentColor~&  ' 0x00000000
_BLEND dest&
```

### Pixel Perfect Corner Skipping

```basic
IF IsCorner THEN
    c% = c% + 1                      ' Skip corner
    PSET (path(c%).X, path(c%).Y), col  ' Draw next unconditionally
    c% = c% + 1                      ' Skip past it
    GOTO next_iteration
END IF
```

### Canvas State Checking

```basic
_SOURCE canvas&
IF POINT(x, y) <> drawColor~& THEN
    ' Add to path - not yet drawn
END IF
```

### Visual Debug Marker

```basic
LINE (0, y)-(10, y), _RGB32(0, 255, 0)  ' Edge marker
LINE (x-1, y-1)-(x+1, y+1), _RGB32(0, 255, 0), BF  ' Pixel highlight
```

---

## Related Documentation

- [QB64PE Graphics Guide](./QB64PE_GRAPHICS_STATEMENTS_GUIDE.md)
- [Debugging Best Practices](./tools/get_qb64pe_debugging_best_practices.md)
- [Visual Debugging with Screenshots](./tools/generate_qb64pe_screenshot_analysis_template.md)

---

## Session Problem References

These patterns were discovered and validated during actual development sessions:

- **Session 2026-01-24** - Pixel perfect drawing implementation
  - Problem IDs: `problem-1769270419878-71ysyt`, `problem-1769270430010-ksj6vh`
  - Problem IDs: `problem-1769270440111-00oo4m`, `problem-1769270457882-9r1932`

---

_Last Updated: 2026-01-24_  
_Based on: qb64pe-mcp-server session problems_
