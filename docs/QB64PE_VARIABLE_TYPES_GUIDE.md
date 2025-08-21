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

## C Library Integration and Porting

QB64PE provides robust support for integrating external C libraries and porting existing C code. This section covers comprehensive techniques for working with C libraries, header files, structs, and function declarations.

### C to QB64PE Type Mapping

When porting C libraries, understanding the type correspondence is crucial:

#### Basic C Types to QB64PE

| C Type | Size | QB64PE Equivalent | Sigil | Range (Signed) | Range (Unsigned) |
|--------|------|-------------------|-------|----------------|------------------|
| `char` | 1 byte | `_BYTE` | `%%` | -128 to 127 | 0 to 255 |
| `short int` | 2 bytes | `INTEGER` | `%` | -32,768 to 32,767 | 0 to 65,535 |
| `int` | 4 bytes | `LONG` | `&` | -2,147,483,648 to 2,147,483,647 | 0 to 4,294,967,295 |
| `long int` | 4 bytes | `LONG` | `&` | -2,147,483,648 to 2,147,483,647 | 0 to 4,294,967,295 |
| `long long` | 8 bytes | `_INTEGER64` | `&&` | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | Large positive range |
| `bool` | 1 byte | `_BYTE` | `%%` | true (-1) or false (0) | N/A |
| `float` | 4 bytes | `SINGLE` | `!` | ±3.402823E+38 (~7 digits) | N/A |
| `double` | 8 bytes | `DOUBLE` | `#` | ±1.797693134862315E+308 (~16 digits) | N/A |
| `long double` | 10 bytes | `_FLOAT` | `##` | ±1.189731495357231765E+4932 (~19 digits) | N/A |
| `wchar_t` | 2-4 bytes | `INTEGER` or `LONG` | `%` or `&` | Unicode character | N/A |
| `void*` | Pointer | `_OFFSET` | `%&` | Memory address | Memory address |

#### Windows API Data Types

| Windows Type | Description | Bits | QB64PE Type | Sigil |
|--------------|-------------|------|-------------|-------|
| `BYTE` | 8 bits in one byte | 8 | `_UNSIGNED _BYTE` | `~%%` |
| `WORD` | 2 bytes | 16 | `_UNSIGNED INTEGER` | `~%` |
| `DWORD` | 4 bytes | 32 | `_UNSIGNED LONG` | `~&` |
| `QWORD` | 8 bytes | 64 | `_UNSIGNED _INTEGER64` | `~&&` |
| `CHAR` | ASCII character | 8 | `_BYTE` | `%%` |
| `WCHAR` | Unicode wide character | 16 | `_UNSIGNED INTEGER` | `~%` |
| `LPSTR` | Long pointer to string | ANY | `_OFFSET` | `%&` |
| `LPCSTR` | Long pointer to constant string | ANY | `_OFFSET` | `%&` |
| `LPWSTR` | Long pointer to wide string | ANY | `_OFFSET` | `%&` |
| `PVOID` | Void pointer | ANY | `_OFFSET` | `%&` |
| `HANDLE` | Handle to an object | ANY | `_OFFSET` | `%&` |

### DECLARE LIBRARY Usage

The `DECLARE LIBRARY` block is the primary method for accessing external C libraries:

#### Basic Syntax
```basic
DECLARE LIBRARY "libraryname"
    FUNCTION functionName ALIAS "actual_c_function_name" (parameters) AS return_type
    SUB procedureName ALIAS "actual_c_procedure_name" (parameters)
END DECLARE
```

#### Common Library Examples
```basic
' Standard C library functions
DECLARE LIBRARY
    FUNCTION malloc%& (BYVAL size AS _UNSIGNED LONG)
    SUB free (BYVAL ptr AS _OFFSET)
    FUNCTION strlen& (str AS STRING)
    FUNCTION strcmp& (str1 AS STRING, str2 AS STRING)
    FUNCTION memcpy& (dest AS _OFFSET, source AS _OFFSET, BYVAL num AS _UNSIGNED LONG)
END DECLARE

' Windows API functions
DECLARE LIBRARY "kernel32"
    FUNCTION GetTickCount~& ()
    FUNCTION GetCurrentProcessId~& ()
    SUB Sleep (BYVAL dwMilliseconds AS _UNSIGNED LONG)
END DECLARE

' User32 Windows functions
DECLARE LIBRARY "user32"
    FUNCTION MessageBoxA& (BYVAL hwnd AS _OFFSET, lpText AS STRING, lpCaption AS STRING, BYVAL uType AS _UNSIGNED LONG)
    FUNCTION GetCursorPos& (lpPoint AS _OFFSET)
    FUNCTION SetWindowTextA& (BYVAL hwnd AS _OFFSET, lpString AS STRING)
END DECLARE
```

### Working with C Structs

Converting C structs to QB64PE TYPE definitions requires careful attention to memory layout and alignment:

#### Basic Struct Conversion
```c
// C struct example
typedef struct {
    int x;
    int y;
    float speed;
    char name[32];
} Player;
```

```basic
' QB64PE TYPE equivalent
TYPE Player
    x AS LONG               ' int -> LONG
    y AS LONG               ' int -> LONG  
    speed AS SINGLE         ' float -> SINGLE
    name AS STRING * 32     ' char[32] -> fixed STRING
END TYPE
```

#### Complex Struct with Pointers
```c
// C struct with pointers and nested structs
typedef struct Point {
    double x, y;
} Point;

typedef struct Shape {
    int type;
    Point* vertices;
    int vertex_count;
    void* user_data;
} Shape;
```

```basic
' QB64PE TYPE equivalents
TYPE Point
    x AS DOUBLE
    y AS DOUBLE
END TYPE

TYPE Shape
    shapeType AS LONG           ' int -> LONG
    vertices AS _OFFSET         ' Point* -> _OFFSET
    vertex_count AS LONG        ' int -> LONG
    user_data AS _OFFSET        ' void* -> _OFFSET
END TYPE
```

#### Working with Unions
```c
// C union example
typedef union {
    int i;
    float f;
    char bytes[4];
} Data;
```

QB64PE doesn't have direct union support, but you can use memory manipulation:
```basic
' Simulate union with _MEM
TYPE DataUnion
    memory AS _MEM
END TYPE

DIM data AS DataUnion
data.memory = _MEMNEW(4)  ' Allocate 4 bytes

' Access as integer
_MEMPUT data.memory, data.memory.OFFSET, 42 AS LONG

' Access as float  
DIM floatValue AS SINGLE
_MEMGET data.memory, data.memory.OFFSET, floatValue

' Access as bytes
DIM i AS INTEGER
FOR i = 0 TO 3
    DIM byteValue AS _UNSIGNED _BYTE
    _MEMGET data.memory, data.memory.OFFSET + i, byteValue
    PRINT "Byte"; i; "="; byteValue
NEXT i
```

### Memory Management

When working with C libraries, proper memory management is crucial:

#### Allocating and Freeing Memory
```basic
DECLARE LIBRARY
    FUNCTION malloc%& (BYVAL size AS _UNSIGNED LONG)
    SUB free (BYVAL ptr AS _OFFSET)
END DECLARE

' Allocate memory for an array of integers
DIM arraySize AS LONG: arraySize = 100
DIM arrayPtr AS _OFFSET
arrayPtr = malloc(arraySize * 4)  ' 4 bytes per LONG

IF arrayPtr = 0 THEN
    PRINT "Memory allocation failed!"
    END
END IF

' Use the memory (example: set values)
DIM i AS LONG
FOR i = 0 TO arraySize - 1
    _MEMPUT _MEM(arrayPtr, arraySize * 4), arrayPtr + i * 4, i AS LONG
NEXT i

' Free the memory when done
free arrayPtr
```

#### Working with _MEM for C Interop
```basic
' Create QB64PE managed memory that C can access
DIM buffer AS _MEM
buffer = _MEMNEW(1024)  ' 1KB buffer

' Pass to C function expecting void*
DECLARE LIBRARY "mylib"
    SUB process_buffer (BYVAL buffer_ptr AS _OFFSET, BYVAL size AS _UNSIGNED LONG)
END DECLARE

process_buffer buffer.OFFSET, buffer.SIZE

' Clean up
_MEMFREE buffer
```

### String Handling Between C and QB64PE

String handling requires special attention due to different string representations:

#### Null-Terminated Strings
```basic
DECLARE LIBRARY
    FUNCTION strlen& (str AS STRING)
    FUNCTION strcpy& (dest AS _OFFSET, source AS STRING)
END DECLARE

' QB64PE strings are automatically null-terminated when passed to C
DIM text AS STRING: text = "Hello, World!"
DIM length AS LONG: length = strlen(text)
PRINT "String length:"; length

' For C functions that modify strings, use fixed-length strings
DIM buffer AS STRING * 256
strcpy _OFFSET(buffer), "Initial text"
```

#### Wide Character Strings (Unicode)
```basic
DECLARE LIBRARY "kernel32"
    FUNCTION MultiByteToWideChar& (BYVAL CodePage AS _UNSIGNED LONG, BYVAL dwFlags AS _UNSIGNED LONG, _
                                  lpMultiByteStr AS STRING, BYVAL cbMultiByte AS LONG, _
                                  BYVAL lpWideCharStr AS _OFFSET, BYVAL cchWideChar AS LONG)
END DECLARE

' Convert ASCII to Unicode
DIM asciiText AS STRING: asciiText = "Hello"
DIM unicodeBuffer AS _MEM: unicodeBuffer = _MEMNEW(LEN(asciiText) * 2)
DIM result AS LONG

result = MultiByteToWideChar(0, 0, asciiText, LEN(asciiText), unicodeBuffer.OFFSET, LEN(asciiText))
```

### Function Pointers and Callbacks

Some C libraries require callback functions:

#### Simple Callback Example
```c
// C library expects a callback function
typedef int (*CompareFunc)(const void* a, const void* b);
void qsort(void* base, size_t num, size_t size, CompareFunc compare);
```

```basic
' QB64PE doesn't support function pointers directly
' Use intermediate C wrapper or library-specific solutions

DECLARE LIBRARY "mysort"
    SUB qsort_ints (BYVAL array_ptr AS _OFFSET, BYVAL count AS _UNSIGNED LONG)
END DECLARE

' The C wrapper would handle the callback internally
DIM numbers(10) AS LONG
' ... fill array ...
qsort_ints _OFFSET(numbers(0)), UBOUND(numbers) + 1
```

### Error Handling and Return Codes

Many C libraries use return codes for error handling:

```basic
DECLARE LIBRARY "mylib"
    FUNCTION open_file& (filename AS STRING)
    FUNCTION read_data& (BYVAL handle AS LONG, BYVAL buffer AS _OFFSET, BYVAL size AS _UNSIGNED LONG)
    SUB close_file (BYVAL handle AS LONG)
END DECLARE

' Error handling pattern
DIM fileHandle AS LONG
fileHandle = open_file("data.bin")

IF fileHandle < 0 THEN
    SELECT CASE fileHandle
        CASE -1: PRINT "File not found"
        CASE -2: PRINT "Permission denied"
        CASE -3: PRINT "Invalid filename"
        CASE ELSE: PRINT "Unknown error:"; fileHandle
    END SELECT
    END
END IF

' Use the file...
DIM buffer AS _MEM: buffer = _MEMNEW(1024)
DIM bytesRead AS LONG
bytesRead = read_data(fileHandle, buffer.OFFSET, buffer.SIZE)

' Clean up
close_file fileHandle
_MEMFREE buffer
```

### Platform-Specific Considerations

#### Windows DLL Loading
```basic
' QB64PE automatically handles DLL loading for DECLARE LIBRARY
' DLLs must be in the same directory as the EXE or in system PATH

' For dynamic loading at runtime:
DECLARE LIBRARY "kernel32"
    FUNCTION LoadLibraryA%& (lpLibFileName AS STRING)
    FUNCTION GetProcAddress%& (BYVAL hModule AS _OFFSET, lpProcName AS STRING)
    FUNCTION FreeLibrary& (BYVAL hLibModule AS _OFFSET)
END DECLARE
```

#### Linux Shared Libraries
```basic
' Similar to Windows, but uses .so files
DECLARE LIBRARY "libmath.so"
    FUNCTION my_sqrt# (BYVAL x AS DOUBLE)
END DECLARE

' Or system libraries
DECLARE LIBRARY "libc.so.6"
    FUNCTION getpid& ()
END DECLARE
```

### Advanced Porting Techniques

#### Bitfield Handling
```c
// C bitfields
struct Flags {
    unsigned int flag1 : 1;
    unsigned int flag2 : 1;
    unsigned int value : 6;
};
```

```basic
' QB64PE bitfield simulation
TYPE Flags
    data AS _UNSIGNED _BYTE
END TYPE

' Helper functions for bitfield access
FUNCTION GetFlag1% (flags AS Flags)
    GetFlag1 = (flags.data AND 1)
END FUNCTION

SUB SetFlag1 (flags AS Flags, value AS INTEGER)
    IF value THEN
        flags.data = flags.data OR 1
    ELSE
        flags.data = flags.data AND NOT 1
    END IF
END SUB

FUNCTION GetValue% (flags AS Flags)
    GetValue = (flags.data AND &HFC) \ 4  ' Bits 2-7, shifted right 2
END FUNCTION
```

#### Macro Translation
```c
// C macros
#define MAX_SIZE 1024
#define MIN(a,b) ((a) < (b) ? (a) : (b))
#define OFFSET_OF(type, member) ((size_t) &((type*)0)->member)
```

```basic
' QB64PE constants and functions
CONST MAX_SIZE = 1024

FUNCTION MIN& (a AS LONG, b AS LONG)
    IF a < b THEN MIN = a ELSE MIN = b
END FUNCTION

' For OFFSET_OF, use TYPE with known member positions
```

### Complete Example: Porting a C Library

Here's a complete example of porting a simple C graphics library:

```c
// Original C library (graphics.h)
typedef struct {
    int x, y;
    unsigned int color;
} Pixel;

typedef struct {
    int width, height;
    Pixel* pixels;
} Image;

Image* create_image(int width, int height);
void destroy_image(Image* img);
void set_pixel(Image* img, int x, int y, unsigned int color);
unsigned int get_pixel(Image* img, int x, int y);
void save_image(Image* img, const char* filename);
```

```basic
' QB64PE port
TYPE Pixel
    x AS LONG
    y AS LONG
    color AS _UNSIGNED LONG
END TYPE

TYPE Image
    width AS LONG
    height AS LONG
    pixels AS _OFFSET  ' Pointer to Pixel array
END TYPE

DECLARE LIBRARY "graphics"
    FUNCTION create_image%& (BYVAL width AS LONG, BYVAL height AS LONG)
    SUB destroy_image (BYVAL img AS _OFFSET)
    SUB set_pixel (BYVAL img AS _OFFSET, BYVAL x AS LONG, BYVAL y AS LONG, BYVAL color AS _UNSIGNED LONG)
    FUNCTION get_pixel~& (BYVAL img AS _OFFSET, BYVAL x AS LONG, BYVAL y AS LONG)
    SUB save_image (BYVAL img AS _OFFSET, filename AS STRING)
END DECLARE

' Usage example
DIM img AS _OFFSET
img = create_image(640, 480)

IF img <> 0 THEN
    set_pixel img, 100, 100, &HFF0000  ' Red pixel
    DIM pixelColor AS _UNSIGNED LONG
    pixelColor = get_pixel(img, 100, 100)
    PRINT "Pixel color:"; HEX$(pixelColor)
    
    save_image img, "output.bmp"
    destroy_image img
ELSE
    PRINT "Failed to create image"
END IF
```

### Debugging C Integration

#### Common Issues and Solutions

1. **Type Mismatches**: Use exact type mapping from the reference tables
2. **Memory Corruption**: Always free allocated memory and check bounds
3. **String Encoding**: Be aware of ASCII vs Unicode requirements
4. **Calling Conventions**: Most C libraries use standard calling conventions
5. **Structure Padding**: QB64PE handles most alignment automatically

#### Debug Techniques
```basic
' Check if library loads successfully
DECLARE LIBRARY "mylib"
    FUNCTION test_function& ()
END DECLARE

ON ERROR GOTO LibraryError
DIM result AS LONG: result = test_function()
PRINT "Library loaded successfully, result:"; result
GOTO LibraryOK

LibraryError:
PRINT "Error loading library or calling function"
PRINT "Error:"; ERR; "Line:"; ERL
RESUME LibraryOK

LibraryOK:
```

### Best Practices for C Library Porting

1. **Start Small**: Port simple functions first, then move to complex structures
2. **Test Incrementally**: Verify each function works before moving to the next
3. **Document Type Mappings**: Keep a reference of your C-to-QB64PE type conversions
4. **Handle Memory Carefully**: Always pair malloc/free and _MEMNEW/_MEMFREE
5. **Use Error Checking**: Validate return codes and check for null pointers
6. **Consider Endianness**: Be aware of byte order when working with binary data
7. **Test Cross-Platform**: Verify behavior on different operating systems

### Library Requirements and Deployment

#### DLL/Shared Library Placement
QB64PE requires all DLL files to either be:
- In the same directory as the compiled executable
- In the system PATH (Windows: C:\WINDOWS\SYSTEM32)
- For Linux: in standard library paths (/lib, /usr/lib, etc.)

#### Creating $INCLUDE Text Libraries
You can create your own QB64PE libraries using text files:

```basic
' Create a .BI file for declarations and types
' mylib.bi
TYPE MyStruct
    value AS LONG
    name AS STRING * 32
END TYPE

DECLARE SUB MyLibFunction (data AS MyStruct)
DECLARE FUNCTION MyLibCalculate& (x AS SINGLE, y AS SINGLE)
```

```basic
' Create a .BM file for implementations  
' mylib.bm
SUB MyLibFunction (data AS MyStruct)
    PRINT "Processing:"; data.name; "with value"; data.value
END SUB

FUNCTION MyLibCalculate& (x AS SINGLE, y AS SINGLE)
    MyLibCalculate = INT(x * y + 0.5)
END FUNCTION
```

```basic
' Use in your main program
$INCLUDE: 'mylib.bi'        ' Include at top for declarations

' Your main program code here

$INCLUDE: 'mylib.bm'        ' Include at bottom for implementations
```

This comprehensive guide provides LLMs with detailed knowledge about QB64PE variable types and C library integration, enabling accurate code generation, optimization recommendations, and successful porting of C libraries to QB64PE.

````
```

This comprehensive guide provides LLMs with detailed knowledge about QB64PE variable types, enabling accurate code generation and optimization recommendations.
