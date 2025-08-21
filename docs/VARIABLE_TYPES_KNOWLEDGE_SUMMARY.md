# QB64PE Variable Types Knowledge Base Summary

## What Was Added

This document summarizes the comprehensive QB64PE variable types knowledge that has been added to the MCP server knowledge base.

## Knowledge Base Enhancements

### 1. Created Comprehensive Documentation
- **File**: `docs/QB64PE_VARIABLE_TYPES_GUIDE.md`
- **Content**: Complete guide covering all QB64PE variable types, sigils, memory usage, and patterns

### 2. Enhanced Compatibility Rules
- **File**: `src/data/compatibility-rules.json`
- **Addition**: New `variable_types` section with:
  - Complete type definitions with memory sizes
  - Unsigned type conventions
  - DIM pattern examples
  - Memory optimization guidelines
  - Performance characteristics

### 3. Enhanced Keywords Database
- **File**: `src/data/keywords-data.json`
- **Addition**: New comprehensive variable types reference entry

## Available Information Through MCP Server

The MCP server now provides detailed information about:

### Variable Type Sigils
| Sigil | Type | Size | Range | Memory Usage |
|-------|------|------|-------|--------------|
| `$` | STRING | Variable | ASCII 0-255 | length + overhead |
| `%` | INTEGER | 2 bytes | -32,768 to 32,767 | 2 bytes |
| `&` | LONG | 4 bytes | -2,147,483,648 to 2,147,483,647 | 4 bytes |
| `!` | SINGLE | 4 bytes | ±3.4E±38 (7 digits) | 4 bytes |
| `#` | DOUBLE | 8 bytes | ±1.7E±308 (15 digits) | 8 bytes |
| `##` | _FLOAT | 32 bytes | Maximum precision | 32 bytes |
| `&&` | _INTEGER64 | 8 bytes | ±9.2×10^18 | 8 bytes |
| `%%` | _BYTE | 1 byte | -128 to 127 | 1 byte |
| `` ` `` | _BIT | 1 bit | 0 or -1 (signed) | 1 bit |
| `%&` | _OFFSET | Platform | Memory addresses | 4 or 8 bytes |

### _UNSIGNED Convention
- **Sigil Method**: Use `~` before type sigil (e.g., `~%`, `~&`, `~&&`)
- **Keyword Method**: Use `_UNSIGNED AS` keyword
- **Benefit**: Doubles positive range for the same memory usage

### Flexible DIM Patterns
The knowledge base includes all QB64PE DIM patterns:
```basic
' Single variable
DIM variable AS type

' Multiple variables same type  
DIM AS INTEGER foo, bar, baz

' Multiple variables mixed types
DIM AS INTEGER count, AS DOUBLE value, AS STRING name

' Arrays
DIM numbers(10) AS INTEGER
DIM matrix(5, 5) AS DOUBLE
DIM names(100) AS STRING * 50

' Unsigned types
DIM AS _UNSIGNED INTEGER positiveCount
DIM positiveValue~%
```

### Memory Size Information
Detailed memory calculations for:
- Individual variable types
- Array memory usage formulas
- Memory optimization strategies
- Performance characteristics

## MCP Server Tools That Provide Variable Types Information

### 1. `lookup_qb64pe_keyword`
- Look up specific type keywords like `DIM`, `_UNSIGNED`, `INTEGER`, etc.
- Get detailed information about each type

### 2. `search_qb64pe_keywords_by_wiki_category`
- Category: "Definitions and Variable Types" - 27 keywords
- Category: "QB64 Programming Symbols" - 32 keywords (includes sigils)

### 3. `search_qb64pe_compatibility`
- Search for variable type compatibility issues
- Get information about type conversion and memory usage

### 4. `search_qb64pe_keywords`
- Search for variable type-related keywords
- Find information about DIM patterns, type declarations

### 5. `validate_qb64pe_syntax`
- Validate code with proper variable type declarations
- Check for syntax issues with DIM statements

## Examples of Available Knowledge

### Memory Usage Examples
```basic
' Memory usage comparison for 1000-element arrays:
DIM AS _BYTE array1(1000)           ' 1,000 bytes
DIM AS INTEGER array2(1000)         ' 2,000 bytes  
DIM AS LONG array3(1000)            ' 4,000 bytes
DIM AS DOUBLE array4(1000)          ' 8,000 bytes
DIM AS _INTEGER64 array5(1000)      ' 8,000 bytes
DIM AS _FLOAT array6(1000)          ' 32,000 bytes
```

### Sigil Usage Examples
```basic
' Using sigils for variable declarations
DIM name$                    ' STRING
DIM count%                   ' INTEGER  
DIM bigNumber&               ' LONG
DIM price!                   ' SINGLE
DIM precise#                 ' DOUBLE
DIM maxFloat##               ' _FLOAT
DIM huge&&                   ' _INTEGER64
DIM small%%                  ' _BYTE
DIM flag`                    ' _BIT
DIM address%&                ' _OFFSET

' Unsigned variants
DIM positiveCount~%          ' _UNSIGNED INTEGER
DIM largeValue~&             ' _UNSIGNED LONG
DIM hugeNumber~&&            ' _UNSIGNED _INTEGER64
DIM byteValue~%%             ' _UNSIGNED _BYTE
DIM bitFlag~`                ' _UNSIGNED _BIT
```

### Performance Information
- **Fastest types**: `_BYTE`, `_UNSIGNED _BYTE`, `INTEGER`, `_UNSIGNED INTEGER`
- **Standard types**: `LONG`, `_UNSIGNED LONG`, `SINGLE`
- **Precision types**: `DOUBLE`, `_INTEGER64`, `_UNSIGNED _INTEGER64`
- **Slowest types**: `_FLOAT`
- **Memory efficient**: `_BIT`, `_BYTE`, `INTEGER`

## How LLMs Can Use This Knowledge

With this comprehensive knowledge base, LLMs can now:

1. **Generate Optimal Variable Declarations**
   - Choose appropriate types based on value ranges
   - Recommend unsigned types for positive-only values
   - Suggest memory-efficient types for large arrays

2. **Provide Memory Usage Analysis**
   - Calculate exact memory requirements for variables and arrays
   - Suggest optimizations for memory-constrained applications
   - Compare memory usage between different type choices

3. **Validate and Fix Type-Related Issues**
   - Detect inappropriate type usage
   - Suggest better type choices for specific use cases
   - Fix compatibility issues with type declarations

4. **Teach Best Practices**
   - Explain when to use each variable type
   - Demonstrate flexible DIM patterns
   - Show proper unsigned type usage

5. **Generate Documentation**
   - Create accurate variable type references
   - Provide examples with correct syntax
   - Explain memory and performance implications

## Testing Verification

All knowledge base enhancements have been tested and verified through:
- ✅ Keyword lookup tests for all major types
- ✅ Wiki category searches for variable types
- ✅ Compatibility searches for type-related issues
- ✅ Syntax validation with comprehensive type examples
- ✅ Build verification ensuring all data compiles correctly

The QB64PE MCP server now provides comprehensive, accurate, and detailed information about QB64PE variable types, enabling LLMs to generate better code and provide more accurate assistance to developers.
