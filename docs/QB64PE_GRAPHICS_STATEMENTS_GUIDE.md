# QB64PE Graphics Statements Guide for LLMs

## Executive Summary for AI Systems

This guide explains QB64PE graphics statements in simple, clear terms specifically for Large Language Models and automated systems. The primary focus is on `_PUTIMAGE` and its many confusing parameter combinations, followed by comprehensive coverage of all graphics commands.

**Key Point**: `_PUTIMAGE` has multiple syntax forms that can cause stretching/scaling issues if not understood properly. Always specify coordinates explicitly to avoid unexpected scaling.

---

## 1. \_PUTIMAGE - The Most Confusing Graphics Statement

### Why \_PUTIMAGE is Confusing for LLMs

`_PUTIMAGE` has **5 different syntax forms** and the parameters change meaning depending on which form you use. This causes AI systems to accidentally stretch images when they mean to place them at original size.

### The 5 Syntax Forms of \_PUTIMAGE

#### Form 1: Simple Placement (NO STRETCHING)

```basic
_PUTIMAGE (x, y), sourceImageHandle
```

- Places image at coordinates (x, y)
- **Uses original image size**
- **No stretching occurs**
- This is usually what you want for sprites, icons, etc.

#### Form 2: Simple Placement with Destination (NO STRETCHING)

```basic
_PUTIMAGE (x, y), sourceImageHandle, destinationImageHandle
```

- Same as Form 1 but specifies destination
- **Uses original image size**
- **No stretching occurs**

#### Form 3: Source Rectangle Selection (NO STRETCHING)

```basic
_PUTIMAGE (destX, destY), sourceImageHandle, destinationImageHandle, (srcX1, srcY1)-(srcX2, srcY2)
```

- Takes a rectangular area from source image
- Places it at destination coordinates
- **Uses original size of selected area**
- **No stretching occurs**

#### Form 4: Destination Rectangle (STRETCHING OCCURS)

```basic
_PUTIMAGE (destX1, destY1)-(destX2, destY2), sourceImageHandle
```

- **WARNING: This form STRETCHES the entire source image**
- Image is scaled to fit the destination rectangle
- Common cause of accidental stretching

#### Form 5: Full Control (STRETCHING OCCURS)

```basic
_PUTIMAGE (destX1, destY1)-(destX2, destY2), sourceImageHandle, destinationImageHandle, (srcX1, srcY1)-(srcX2, srcY2)
```

- **WARNING: This form STRETCHES the selected source area**
- Selected source rectangle is scaled to fit destination rectangle
- Most flexible but most complex

### Common LLM Mistakes with \_PUTIMAGE

❌ **WRONG** (causes stretching):

```basic
' This will stretch the image to fit a 200x200 area
_PUTIMAGE (100, 100)-(300, 300), imageHandle
```

✅ **CORRECT** (no stretching):

```basic
' This places the image at (100, 100) using original size
_PUTIMAGE (100, 100), imageHandle
```

### \_PUTIMAGE Parameter Quick Reference

| Parameters                                        | Description                                       | Stretching? |
| ------------------------------------------------- | ------------------------------------------------- | ----------- |
| `(x,y), src`                                      | Place at coordinates                              | NO          |
| `(x,y), src, dest`                                | Place at coordinates on destination               | NO          |
| `(x,y), src, dest, (sx1,sy1)-(sx2,sy2)`           | Place source rectangle at coordinates             | NO          |
| `(x1,y1)-(x2,y2), src`                            | Stretch entire source to rectangle                | **YES**     |
| `(x1,y1)-(x2,y2), src, dest, (sx1,sy1)-(sx2,sy2)` | Stretch source rectangle to destination rectangle | **YES**     |

### Best Practices for LLMs

1. **Default to Form 1** unless you specifically need stretching
2. **Always specify coordinates explicitly** - don't rely on defaults
3. **Use Forms 4-5 only when you intentionally want scaling/stretching**
4. **Test with small images first** to verify behavior

---

## 2. Essential Graphics Image Management

### Image Lifecycle Commands

#### \_NEWIMAGE - Create New Images

```basic
imageHandle& = _NEWIMAGE(width, height, colorDepth)
```

- Creates a new blank image in memory
- Common color depths: 32 (RGBA), 256 (palette), 1 (monochrome)
- Returns a handle for referencing the image

#### \_LOADIMAGE - Load From Files

```basic
imageHandle& = _LOADIMAGE("filename.png")
imageHandle& = _LOADIMAGE("filename.png", 32)  ' Force 32-bit
```

- Loads image files (PNG, JPG, BMP, GIF)
- Returns handle or -1 if failed
- Second parameter forces color depth

#### \_FREEIMAGE - Clean Up Memory

```basic
_FREEIMAGE imageHandle&
```

- **CRITICAL**: Always free images when done
- Prevents memory leaks
- Don't free screen handles (0, \_DEST, \_DISPLAY)

#### \_COPYIMAGE - Duplicate Images

```basic
newHandle& = _COPYIMAGE(originalHandle&)
```

- Creates exact copy of image
- Useful for preserving originals before modification

### Image Information Functions

#### \_WIDTH and \_HEIGHT - Get Dimensions

```basic
w = _WIDTH(imageHandle&)
h = _HEIGHT(imageHandle&)
```

- Get pixel dimensions of any image
- Essential for positioning and bounds checking

#### \_PIXELSIZE - Get Color Depth

```basic
depth = _PIXELSIZE(imageHandle&)
```

- Returns bytes per pixel (1, 2, 4 for different modes)

---

## 3. Screen and Display Management

### Screen Setup Commands

#### SCREEN - Set Display Mode

```basic
SCREEN _NEWIMAGE(800, 600, 32)  ' Modern approach
SCREEN 13                       ' Legacy 320x200 mode
SCREEN 0                        ' Text mode
```

#### \_DEST and \_SOURCE - Control Drawing Context

```basic
_DEST imageHandle&     ' Set where drawing goes
_SOURCE imageHandle&   ' Set where _PUTIMAGE reads from
```

- **Important**: All drawing commands use \_DEST target
- \_PUTIMAGE reads from \_SOURCE by default

#### \_DISPLAY - Control Screen Updates

```basic
_AUTODISPLAY OFF  ' Turn off automatic display
' ... do multiple drawing operations ...
_DISPLAY          ' Update screen manually
_AUTODISPLAY ON   ' Resume automatic updates
```

### Display Information

```basic
currentScreen& = _DISPLAY        ' Get current display handle
desktopWidth = _DESKTOPWIDTH     ' Get system desktop width
desktopHeight = _DESKTOPHEIGHT   ' Get system desktop height
```

---

## 4. Basic Drawing Commands

### Pixel Operations

```basic
PSET (x, y), color           ' Set pixel to color
PRESET (x, y), color         ' Set pixel (default background color)
colorValue = POINT(x, y)     ' Get pixel color
```

### Line Drawing

```basic
LINE (x1, y1)-(x2, y2), color           ' Draw line
LINE (x1, y1)-(x2, y2), color, B        ' Draw box outline
LINE (x1, y1)-(x2, y2), color, BF       ' Draw filled box
```

### Circle and Arc Drawing

```basic
CIRCLE (x, y), radius, color             ' Full circle
CIRCLE (x, y), radius, color, start, end ' Arc (angles in radians)
CIRCLE (x, y), radius, color, , , aspect ' Ellipse
```

### Advanced Drawing

```basic
DRAW "M100,100 L200,200 L100,200 L100,100"  ' Vector drawing with string commands
PAINT (x, y), fillColor, borderColor          ' Flood fill
```

---

## 5. Advanced Graphics Operations

### \_MAPTRIANGLE - Perspective Mapping

```basic
_MAPTRIANGLE (sx1,sy1)-(sx2,sy2)-(sx3,sy3), sourceImage&, (dx1,dy1)-(dx2,dy2)-(dx3,dy3), destImage&
```

- Maps triangular sections with perspective/rotation
- More complex than \_PUTIMAGE but allows 3D-like effects

### Color and Palette Management

```basic
COLOR foregroundColor, backgroundColor
PALETTE paletteIndex, rgbValue
_RGB32(red, green, blue)        ' Create 32-bit color
_RGBA32(red, green, blue, alpha) ' Create color with transparency
```

### Blending Modes - \_BLEND and \_DONTBLEND

**CRITICAL for transparent pixel operations:**

```basic
' Enable blending (default behavior)
_BLEND imageHandle&

' Disable blending for direct pixel overwrites
_DONTBLEND imageHandle&
```

#### When to Use \_DONTBLEND

**Problem**: `PSET` with transparent colors (`0x00000000`) doesn't overwrite existing pixels in default blend mode.

**Solution**: Use `_DONTBLEND` before operations that need to overwrite with transparent pixels:

```basic
' Save original pixel colors (may include transparent pixels)
originalColor~& = POINT(x%, y%)

' ... your drawing code ...

' Restore transparent pixels - REQUIRES _DONTBLEND
_DONTBLEND canvasImage&
PSET (x%, y%), originalColor~&  ' Now overwrites even if transparent
_BLEND canvasImage&              ' Restore normal blending
```

#### Key Points

- **32-bit mode default**: `CLS` creates transparent background (`0x00000000`), not opaque black (`0xFF000000`)
- **`POINT()` returns transparency**: Check alpha channel of returned color
- **Always restore `_BLEND`**: After `_DONTBLEND` operations
- **Use case**: Erasing pixels, restoring backgrounds, pixel-perfect editing

#### Common Transparent Color Operations

```basic
' Check if pixel is transparent
pixelColor~& = POINT(x%, y%)
IF _ALPHA(pixelColor~&) = 0 THEN PRINT "Transparent"

' Erase to transparent (with _DONTBLEND)
transparentColor~& = _RGBA32(0, 0, 0, 0)
_DONTBLEND destImage&
PSET (x%, y%), transparentColor~&
_BLEND destImage&

' Clear area to transparent
_DONTBLEND destImage&
LINE (x1, y1)-(x2, y2), _RGBA32(0, 0, 0, 0), BF
_BLEND destImage&
```

See [Pixel Perfect Drawing Guide](./PIXEL_PERFECT_DRAWING_GUIDE.md) for more transparency patterns.

### Screen Capture and Saving

```basic
_SAVEIMAGE "screenshot.png"              ' Save current screen
_SAVEIMAGE imageHandle&, "image.png"     ' Save specific image
screenImage& = _SCREENIMAGE              ' Capture desktop
```

---

## 6. Critical Concepts for LLMs

### Image Handles vs Screen Numbers

- **Image Handles**: Negative numbers (-1, -2, etc.) for \_NEWIMAGE/\_LOADIMAGE
- **Screen 0**: Default text screen
- **Legacy Screens**: 1-13 for old graphics modes
- **Never free Screen 0 or current \_DEST**

### Coordinate Systems

- **(0,0) is top-left corner**
- **X increases rightward, Y increases downward**
- **Use STEP for relative positioning**: `LINE STEP(10,10)-STEP(50,50)`

### Memory Management Rules

1. **Always \_FREEIMAGE when done with loaded/created images**
2. **Never free the current \_DEST or Screen 0**
3. **Check if \_LOADIMAGE returned -1 (failure)**

### Common Error Patterns

- Forgetting to \_FREEIMAGE (memory leaks)
- Using wrong \_PUTIMAGE syntax (accidental stretching)
- Drawing to wrong \_DEST target
- Mixing image handles and screen numbers

---

## 7. Complete Graphics Keywords Reference

### Image Management

- `_NEWIMAGE` - Create new image buffer
- `_LOADIMAGE` - Load image from file
- `_FREEIMAGE` - Release image memory
- `_COPYIMAGE` - Duplicate image
- `_SAVEIMAGE` - Save image to file

### Image Information

- `_WIDTH` - Get image width
- `_HEIGHT` - Get image height
- `_PIXELSIZE` - Get color depth

### Display Control

- `SCREEN` - Set display mode
- `_DEST` - Set drawing destination
- `_SOURCE` - Set image source
- `_DISPLAY` - Update screen
- `_AUTODISPLAY` - Control automatic updates

### Drawing Commands

- `_PUTIMAGE` - Copy/scale image regions
- `_MAPTRIANGLE` - Perspective image mapping
- `LINE` - Draw lines and rectangles
- `CIRCLE` - Draw circles and ellipses
- `PSET/PRESET` - Set individual pixels
- `POINT` - Read pixel color
- `PAINT` - Flood fill
- `DRAW` - Vector drawing with string commands

### Color Operations

- `COLOR` - Set text/drawing colors
- `PALETTE` - Modify color palette
- `_RGB32/_RGBA32` - Create true color values
- `_BLEND/_DONTBLEND` - Control transparency blending mode

### Transparency and Alpha Channel

- `_ALPHA` - Extract alpha component from color
- `_BLEND` - Enable transparency blending (default)
- `_DONTBLEND` - Disable blending for direct pixel overwrites
- `_RGBA32` - Create color with custom alpha value
- `_CLEARCOLOR` - Set transparent color for images

### Screen Utilities

- `CLS` - Clear screen
- `VIEW` - Set viewport
- `WINDOW` - Set coordinate mapping
- `PCOPY` - Copy between screen pages

### Legacy Graphics I/O

- `GET (graphics)` - Store screen area to array
- `PUT (graphics)` - Display array data to screen

---

## 8. Example Code Patterns for LLMs

### Loading and Displaying an Image (No Stretching)

```basic
SCREEN _NEWIMAGE(800, 600, 32)
imageHandle& = _LOADIMAGE("sprite.png")
IF imageHandle& < 0 THEN
    PRINT "Failed to load image"
    END
END IF

' Place image at original size
_PUTIMAGE (100, 100), imageHandle&

' Clean up
_FREEIMAGE imageHandle&
```

### Creating and Drawing on Custom Image

```basic
SCREEN _NEWIMAGE(800, 600, 32)
canvas& = _NEWIMAGE(400, 300, 32)

' Draw on the custom image
_DEST canvas&
CLS , _RGB32(64, 128, 255)  ' Blue background
CIRCLE (200, 150), 50, _RGB32(255, 255, 0)  ' Yellow circle

' Display the custom image on main screen
_DEST 0
_PUTIMAGE (200, 150), canvas&

' Clean up
_FREEIMAGE canvas&
```

### Animation Loop with Proper Memory Management

```basic
SCREEN _NEWIMAGE(800, 600, 32)
sprite& = _LOADIMAGE("player.png")

x = 100: y = 100
DO
    CLS

    ' Move sprite
    x = x + 1
    IF x > 800 THEN x = 0

    ' Draw sprite at original size
    _PUTIMAGE (x, y), sprite&

    _DISPLAY
    _LIMIT 60  ' 60 FPS
LOOP UNTIL INKEY$ = CHR$(27)  ' ESC to exit

_FREEIMAGE sprite&
```

---

## 9. Troubleshooting Guide for LLMs

### Problem: Image appears stretched

**Solution**: Check \_PUTIMAGE syntax. Use `(x,y), imageHandle` instead of `(x1,y1)-(x2,y2), imageHandle`

### Problem: Nothing appears on screen

**Check**:

- Is \_DEST set correctly?
- Is image loaded successfully (handle > 0)?
- Are coordinates within screen bounds?
- Is \_AUTODISPLAY ON or did you call \_DISPLAY?

### Problem: Memory issues

**Check**:

- Are you calling \_FREEIMAGE for all loaded images?
- Are you trying to free Screen 0 or current \_DEST?

### Problem: Colors look wrong

**Check**:

- Image color depth vs screen color depth
- Load image with specific color depth: `_LOADIMAGE("file.png", 32)`

---

This guide should help LLMs understand QB64PE graphics operations without falling into common traps, especially the \_PUTIMAGE stretching issue that has been problematic in the past.
