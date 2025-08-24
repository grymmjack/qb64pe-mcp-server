# get_qb64pe_graphics_guide

Gets comprehensive graphics statements guide specifically designed for LLMs, including _PUTIMAGE usage patterns, image management, and common pitfalls to avoid.

## Description

This tool provides a comprehensive graphics programming guide for QB64PE, specifically designed for LLM consumption. It covers the most important graphics statements, with special focus on `_PUTIMAGE` usage patterns, image management, and common mistakes that LLMs should avoid.

## Parameters

- **section** (optional): Specific section to retrieve
  - "all" - Complete graphics guide (default)
  - "putimage" - _PUTIMAGE usage patterns and syntax
  - "image_management" - Loading, creating, and freeing images
  - "drawing_commands" - Basic drawing statements
  - "screen_management" - Screen modes and management
  - "troubleshooting" - Common issues and solutions
  - "examples" - Complete example programs

## Usage

### Get Complete Graphics Guide
```typescript
const guide = await mcp_qb64pe_get_qb64pe_graphics_guide();
```

### Get Specific Section
```typescript
const guide = await mcp_qb64pe_get_qb64pe_graphics_guide({
  section: "putimage"
});
```

### Get Image Management Guide
```typescript
const guide = await mcp_qb64pe_get_qb64pe_graphics_guide({
  section: "image_management"
});
```

## Key Sections Overview

### _PUTIMAGE Section
The most important section for LLMs, covering:

**Why _PUTIMAGE is Confusing:**
- Has 5 different syntax forms
- Parameters change meaning between forms
- Common cause of accidental image stretching

**The 5 Syntax Forms:**

1. **Simple Placement (NO STRETCHING)**
   ```basic
   _PUTIMAGE (x, y), sourceImageHandle
   ```
   - Places image at coordinates using original size
   - **Most commonly used form**

2. **Simple Placement with Destination (NO STRETCHING)**
   ```basic
   _PUTIMAGE (x, y), sourceImageHandle, destinationImageHandle
   ```
   - Same as form 1 but specifies destination

3. **Source Rectangle Selection (NO STRETCHING)**
   ```basic
   _PUTIMAGE (destX, destY), sourceImageHandle, destinationImageHandle, (srcX1, srcY1)-(srcX2, srcY2)
   ```
   - Takes rectangular area from source
   - Places at destination using original size

4. **Destination Rectangle (STRETCHING OCCURS)**
   ```basic
   _PUTIMAGE (destX1, destY1)-(destX2, destY2), sourceImageHandle
   ```
   - ⚠️ **WARNING**: Stretches entire source image
   - Common cause of accidental stretching

5. **Full Control (STRETCHING OCCURS)**
   ```basic
   _PUTIMAGE (destX1, destY1)-(destX2, destY2), sourceImageHandle, destinationImageHandle, (srcX1, srcY1)-(srcX2, srcY2)
   ```
   - ⚠️ **WARNING**: Stretches selected source area
   - Most flexible but most complex

### Image Management Section
Covers proper image handling:

**Loading Images:**
```basic
imageHandle = _LOADIMAGE("filename.png", 32)
IF imageHandle < -1 THEN
    ' Image loaded successfully
ELSE
    PRINT "Failed to load image"
END IF
```

**Creating Images:**
```basic
newImage = _NEWIMAGE(800, 600, 32)
_DEST newImage
' Draw on the new image
_DEST 0  ' Return to main screen
```

**Freeing Memory:**
```basic
_FREEIMAGE imageHandle  ' Always free loaded images
```

### Drawing Commands Section
Basic graphics statements:

**Lines and Shapes:**
```basic
LINE (x1, y1)-(x2, y2), color
CIRCLE (x, y), radius, color
PSET (x, y), color
```

**Filled Shapes:**
```basic
LINE (x1, y1)-(x2, y2), color, BF  ' Filled rectangle
CIRCLE (x, y), radius, color: PAINT (x, y), color  ' Filled circle
```

### Screen Management Section
Screen setup and management:

**Modern Screen Creation:**
```basic
SCREEN _NEWIMAGE(800, 600, 32)  ' 32-bit color depth
```

**Color Functions:**
```basic
red = _RGB32(255, 0, 0)
alpha = _RGBA32(255, 0, 0, 128)  ' Semi-transparent red
```

### Troubleshooting Section
Common issues and solutions:

**Problem**: Images appear stretched
**Solution**: Use `_PUTIMAGE (x, y), imageHandle` instead of `_PUTIMAGE (x1,y1)-(x2,y2), imageHandle`

**Problem**: Memory leaks
**Solution**: Always call `_FREEIMAGE` for loaded images

**Problem**: Colors look wrong
**Solution**: Use 32-bit color mode: `SCREEN _NEWIMAGE(width, height, 32)`

## LLM-Specific Guidance

### Common Mistakes to Avoid

1. **Accidental Stretching**
   ```basic
   ' ❌ WRONG (causes stretching)
   _PUTIMAGE (100, 100)-(300, 300), imageHandle
   
   ' ✅ CORRECT (no stretching)
   _PUTIMAGE (100, 100), imageHandle
   ```

2. **Memory Leaks**
   ```basic
   ' ❌ WRONG (memory leak)
   image = _LOADIMAGE("sprite.png", 32)
   ' ... use image ...
   ' Missing _FREEIMAGE
   
   ' ✅ CORRECT (proper cleanup)
   image = _LOADIMAGE("sprite.png", 32)
   ' ... use image ...
   _FREEIMAGE image
   ```

3. **Invalid Image Handles**
   ```basic
   ' ❌ WRONG (no error checking)
   image = _LOADIMAGE("sprite.png", 32)
   _PUTIMAGE (0, 0), image
   
   ' ✅ CORRECT (with error checking)
   image = _LOADIMAGE("sprite.png", 32)
   IF image < -1 THEN
       _PUTIMAGE (0, 0), image
       _FREEIMAGE image
   ELSE
       PRINT "Failed to load image"
   END IF
   ```

### Best Practices for LLMs

1. **Always use error checking** when loading images
2. **Default to simple _PUTIMAGE syntax** unless stretching is needed
3. **Free all loaded images** before program ends
4. **Use 32-bit color mode** for modern graphics
5. **Test with small programs** before complex graphics

## Example Programs

### Simple Image Display
```basic
SCREEN _NEWIMAGE(800, 600, 32)

' Load and display image
sprite = _LOADIMAGE("player.png", 32)
IF sprite < -1 THEN
    _PUTIMAGE (100, 100), sprite
    _FREEIMAGE sprite
ELSE
    PRINT "Could not load player.png"
END IF

_KEYHIT: SYSTEM
```

### Multiple Sprites
```basic
SCREEN _NEWIMAGE(800, 600, 32)

' Load sprites
player = _LOADIMAGE("player.png", 32)
enemy = _LOADIMAGE("enemy.png", 32)

IF player < -1 AND enemy < -1 THEN
    ' Display sprites at different positions
    _PUTIMAGE (100, 100), player
    _PUTIMAGE (200, 150), enemy
    _PUTIMAGE (300, 200), player
    
    ' Clean up
    _FREEIMAGE player
    _FREEIMAGE enemy
ELSE
    PRINT "Could not load all sprites"
END IF

_KEYHIT: SYSTEM
```

### Sprite Animation
```basic
SCREEN _NEWIMAGE(800, 600, 32)

' Load spritesheet
spritesheet = _LOADIMAGE("animation.png", 32)
IF spritesheet < -1 THEN
    frameWidth = 64
    frameHeight = 64
    x = 100: y = 100
    frame = 0
    
    DO
        CLS
        
        ' Calculate source rectangle for current frame
        srcX = frame * frameWidth
        srcY = 0
        
        ' Display current frame (no stretching)
        _PUTIMAGE (x, y), spritesheet, 0, (srcX, srcY)-(srcX + frameWidth - 1, srcY + frameHeight - 1)
        
        frame = (frame + 1) MOD 4  ' 4 animation frames
        _DELAY 0.2
        _DISPLAY
    LOOP UNTIL _KEYHIT
    
    _FREEIMAGE spritesheet
ELSE
    PRINT "Could not load animation.png"
END IF

SYSTEM
```

## Quick Reference

### _PUTIMAGE Syntax Guide
| Use Case | Syntax | Notes |
|----------|--------|-------|
| Place image | `_PUTIMAGE (x, y), img` | No stretching |
| Place on destination | `_PUTIMAGE (x, y), img, dest` | No stretching |
| Sprite from sheet | `_PUTIMAGE (x, y), img, dest, (sx1,sy1)-(sx2,sy2)` | No stretching |
| Scale image | `_PUTIMAGE (x1,y1)-(x2,y2), img` | ⚠️ Stretches |
| Scale sprite | `_PUTIMAGE (x1,y1)-(x2,y2), img, dest, (sx1,sy1)-(sx2,sy2)` | ⚠️ Stretches |

### Essential Functions
- `_LOADIMAGE(file$, mode)` - Load image from file
- `_NEWIMAGE(w, h, mode)` - Create new image
- `_FREEIMAGE(handle)` - Free image memory
- `_RGB32(r, g, b)` - Create color value
- `_DEST handle` - Set drawing destination
- `_SOURCE handle` - Set source for POINT

### Color Modes
- `32` - 32-bit RGBA (recommended)
- `256` - 8-bit palette mode
- `0` - Text mode

## Integration with Other Tools

### With Screenshot Analysis
```typescript
// Generate graphics program
const guide = await mcp_qb64pe_get_qb64pe_graphics_guide({
  section: "examples"
});

// Create QB64PE program using guide
// ... compile and run ...

// Analyze resulting screenshot
const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
  screenshotPath: "output.png"
});
```

### With Code Enhancement
```typescript
// Get graphics guidance
const guide = await mcp_qb64pe_get_qb64pe_graphics_guide({
  section: "putimage"
});

// Apply guidance to enhance graphics code
const enhanced = await mcp_qb64pe_enhance_qb64pe_code_for_debugging({
  sourceCode: originalGraphicsCode
});
```

## Notes

- Guide is specifically tailored for LLM consumption
- Focuses on preventing common AI-generated code mistakes
- Emphasizes the most confusing aspects of QB64PE graphics
- Provides ready-to-use code examples
- Includes error handling patterns that LLMs should follow
- Updated with modern QB64PE best practices
