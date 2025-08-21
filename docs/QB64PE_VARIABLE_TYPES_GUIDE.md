# QB64PE Variable Types Comprehensive Guide

This document provides comprehensive information about QB64PE variable types, including sigils, memory sizes, DIM patterns, and _UNSIGNED conventions.

## Variable Type Overview

QB64PE uses more variable types than QBasic ever did. The variable type determines the size of values that numerical variables can hold.

**Default Behavior:**
- If no suffix is used and no DEFxxx or _DEFINE command has been used and the variable hasn't been DIMmed, the default variable type is SINGLE.
- _MEM and _OFFSET variable types cannot be cast to other variable types!
- All types dealing with number values are signed as a default.

## Variable Type Sigils (Suffixes)

QB64PE uses specific sigil characters to denote variable types:

### Numeric Type Sigils

| Sigil | Type | Size | Range | Example |
|-------|------|------|-------|---------|
| `$` | STRING | Variable | Text/ASCII 0-255 | `name$` |
| `%` | INTEGER | 2 bytes | -32,768 to 32,767 | `count%` |
| `&` | LONG | 4 bytes | -2,147,483,648 to 2,147,483,647 | `bigNum&` |
| `!` | SINGLE | 4 bytes | ±3.4E±38 (7 digits) | `price!` |
| `#` | DOUBLE | 8 bytes | ±1.7E±308 (15 digits) | `precise#` |
| `##` | _FLOAT | 32 bytes | Maximum floating-point precision | `maxFloat##` |
| `&&` | _INTEGER64 | 8 bytes | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | `huge&&` |
| `%%` | _BYTE | 1 byte | -128 to 127 | `small%%` |
| `` ` `` | _BIT | 1 bit | 0 or -1 (signed), 0 or 1 (unsigned) | ``flag` `` |
| `%&` | _OFFSET | Platform-dependent | Memory address pointer | `address%&` |

### Unsigned Type Sigils

The `~` symbol before any numeric sigil makes it unsigned:

| Sigil | Type | Size | Range | Example |
|-------|------|------|-------|---------|
| `~%` | _UNSIGNED INTEGER | 2 bytes | 0 to 65,535 | `uCount~%` |
| `~&` | _UNSIGNED LONG | 4 bytes | 0 to 4,294,967,295 | `uBig~&` |
| `~&&` | _UNSIGNED _INTEGER64 | 8 bytes | 0 to 18,446,744,073,709,551,615 | `uHuge~&&` |
| `~%%` | _UNSIGNED _BYTE | 1 byte | 0 to 255 | `uSmall~%%` |
| `~` ` | _UNSIGNED _BIT | 1 bit | 0 or 1 | `uFlag~` ` |
| `~%&` | _UNSIGNED _OFFSET | Platform-dependent | Positive memory addresses | `uAddress~%&` |

## Memory Sizes Summary

| Type | Size (bytes) | Memory Usage Notes |
|------|--------------|-------------------|
| _BIT | 1 bit | Smallest unit, stored in byte |
| _BYTE | 1 | Single byte value |
| INTEGER | 2 | Two bytes |
| LONG | 4 | Four bytes |
| SINGLE | 4 | Four bytes (floating-point) |
| DOUBLE | 8 | Eight bytes (double precision) |
| _INTEGER64 | 8 | Eight bytes (large integers) |
| _FLOAT | 32 | Thirty-two bytes (maximum precision) |
| _OFFSET | Variable | Platform-dependent (4 or 8 bytes) |
| STRING | Variable | Length + string data |
| _MEM | Fixed | Structure with OFFSET, SIZE, TYPE, ELEMENTSIZE |

## DIM Declaration Patterns

QB64PE provides flexible ways to declare variables:

### Basic DIM Syntax
```basic
DIM variable AS type
DIM variable1 AS type1, variable2 AS type2, variable3 AS type3
```

### Multi-Variable Declaration Examples
```basic
' Declare multiple variables of the same type
DIM AS INTEGER foo, bar, baz
DIM AS LONG count, total, sum
DIM AS DOUBLE x, y, z
DIM AS STRING name, address, city

' Mixed type declarations
DIM AS INTEGER width, height, AS DOUBLE area, AS STRING title

' With initial array sizing
DIM AS INTEGER numbers(10), values(5), AS STRING names(100)

' Unsigned declarations
DIM AS _UNSIGNED INTEGER positiveCount, maxValue
DIM AS _UNSIGNED LONG largeNumber, AS _UNSIGNED _BYTE flags(8)
```

### Array Declaration Patterns
```basic
' Static arrays
DIM staticArray(10) AS INTEGER
DIM matrix(5, 5) AS DOUBLE
DIM grid(0 TO 9, 0 TO 9) AS INTEGER

' Dynamic arrays (use REDIM)
DIM SHARED dynamicArray() AS LONG
REDIM dynamicArray(newSize) AS LONG

' Preserve existing data when resizing
REDIM _PRESERVE dynamicArray(newSize + 10) AS LONG
```

### Fixed-Length String Declarations
```basic
' Fixed-length strings
DIM fixedString AS STRING * 20
DIM userName AS STRING * 32, password AS STRING * 16

' Array of fixed-length strings
DIM names(100) AS STRING * 50
```

## _UNSIGNED Convention

The `_UNSIGNED` keyword or `~` sigil expands the positive range of numerical types:

### Using _UNSIGNED Keyword
```basic
DIM AS _UNSIGNED INTEGER positiveOnly     ' 0 to 65,535
DIM AS _UNSIGNED LONG bigPositive         ' 0 to 4,294,967,295
DIM AS _UNSIGNED _BYTE smallPositive      ' 0 to 255
DIM AS _UNSIGNED _INTEGER64 hugePositive  ' 0 to 18,446,744,073,709,551,615
```

### Using ~ Sigil
```basic
DIM positiveOnly~%       ' _UNSIGNED INTEGER
DIM bigPositive~&        ' _UNSIGNED LONG  
DIM smallPositive~%%     ' _UNSIGNED _BYTE
DIM hugePositive~&&      ' _UNSIGNED _INTEGER64
```

### Memory Optimization Benefits
- Unsigned types can represent larger positive values in the same memory space
- Useful for counters, array indices, memory addresses
- Essential when interfacing with C libraries or system APIs

## Variable Type Casting and Conversion

### Automatic Type Promotion
```basic
DIM smallValue%%, bigValue&
smallValue%% = 100
bigValue& = smallValue%%  ' Automatic promotion
```

### Explicit Casting Functions
```basic
' Convert between types
DIM intValue%, longValue&, floatValue!
intValue% = 42
longValue& = CINT(floatValue!)   ' Convert to integer
floatValue! = CSNG(intValue%)    ' Convert to single
```

### Type Compatibility Rules
- Smaller types automatically promote to larger types
- Floating-point types can lose precision when converted to integers
- Unsigned types require careful handling to avoid overflow

## Default Type Declaration Commands

### Legacy QBasic Commands
```basic
DEFINT A-Z        ' Default all variables A-Z to INTEGER
DEFSNG A-M        ' Default variables A-M to SINGLE
DEFDBL N-Z        ' Default variables N-Z to DOUBLE
DEFSTR S          ' Default variables starting with S to STRING
DEFLNG L          ' Default variables starting with L to LONG
```

### QB64PE _DEFINE Command
```basic
_DEFINE A-M AS INTEGER        ' Modern way to set defaults
_DEFINE N-Z AS DOUBLE         ' More flexible than DEFxxx
_DEFINE S AS STRING           ' Works with QB64PE types
_DEFINE U AS _UNSIGNED LONG   ' Can specify unsigned types
```

## Special Memory Types

### _MEM Type
```basic
DIM memBlock AS _MEM
memBlock = _MEMNEW(1024)  ' Allocate 1KB
' Properties: .OFFSET, .SIZE, .TYPE, .ELEMENTSIZE
_MEMFREE memBlock
```

### _OFFSET Type
```basic
DIM memoryAddress AS _OFFSET
DIM AS _OFFSET ptr1, ptr2, ptr3
```

## Best Practices for Variable Types

1. **Use appropriate sizes**: Don't use DOUBLE when SINGLE suffices
2. **Consider unsigned types**: For positive-only values like array indices
3. **Be explicit**: Use DIM AS statements for clarity
4. **Memory efficiency**: Use smaller types when range permits
5. **Type consistency**: Maintain consistent types throughout calculations
6. **Array optimization**: Consider element size when declaring large arrays

### Example: Optimized Variable Declarations
```basic
' Good: Appropriate types for usage
DIM AS _UNSIGNED INTEGER playerCount, maxPlayers
DIM AS SINGLE playerX, playerY, playerSpeed
DIM AS _UNSIGNED _BYTE red, green, blue
DIM AS STRING playerName, levelName
DIM AS _UNSIGNED LONG score, highScore

' Array with appropriate element types
DIM AS _UNSIGNED _BYTE pixels(screenWidth, screenHeight)
DIM AS STRING * 32 playerNames(maxPlayers)
```

## Performance Considerations

- **_BYTE** and **_UNSIGNED _BYTE**: Fastest for small integer operations
- **INTEGER** and **_UNSIGNED INTEGER**: Good balance of speed and range  
- **LONG** and **_UNSIGNED LONG**: Standard for most integer calculations
- **SINGLE**: Fastest floating-point type for most purposes
- **DOUBLE**: Use when precision is critical
- **_FLOAT**: Maximum precision but slower performance
- **_INTEGER64**: Use only when values exceed LONG range

## Memory Layout Examples

```basic
' Memory usage comparison
DIM AS _BYTE array1(1000)           ' 1,000 bytes
DIM AS INTEGER array2(1000)         ' 2,000 bytes  
DIM AS LONG array3(1000)            ' 4,000 bytes
DIM AS DOUBLE array4(1000)          ' 8,000 bytes
DIM AS _INTEGER64 array5(1000)      ' 8,000 bytes
DIM AS _FLOAT array6(1000)          ' 32,000 bytes

' Total memory for TYPE structures
TYPE Player
    x AS SINGLE                     ' 4 bytes
    y AS SINGLE                     ' 4 bytes  
    health AS _UNSIGNED _BYTE       ' 1 byte
    score AS _UNSIGNED LONG         ' 4 bytes
    name AS STRING * 32             ' 32 bytes
END TYPE                            ' Total: 45 bytes per player

DIM players(100) AS Player          ' 4,500 bytes total
```

This comprehensive guide provides LLMs with detailed knowledge about QB64PE variable types, enabling accurate code generation and optimization recommendations.
