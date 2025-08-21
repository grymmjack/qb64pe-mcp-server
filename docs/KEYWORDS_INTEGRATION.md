# QB64PE Keywords Integration

This document describes the comprehensive integration of QB64PE keywords into the MCP server, providing multiple access methods for complete keyword reference and validation.

## Overview

The QB64PE Keywords Integration provides:

1. **Complete Keyword Database** - All QB64PE keywords with detailed metadata
2. **Smart Categorization** - Keywords organized by type and functionality  
3. **Syntax Validation** - Real-time keyword validation with suggestions
4. **Autocomplete Support** - Intelligent keyword completion
5. **Search Capabilities** - Full-text search across keyword definitions
6. **MCP Tools & Resources** - Programmatic access via Model Context Protocol

## Data Sources

### Original Keywords File
- **Location**: `docs/resources/QB64PE_Keywords.json`
- **Content**: Complete QB64PE keyword definitions from official documentation
- **Format**: JSON with keyword names and descriptions

### Enhanced Keywords Data
- **Location**: `src/data/keywords-data.json`
- **Content**: Structured keyword information with categorization and metadata
- **Format**: JSON with hierarchical organization

## Keyword Categories

The system organizes keywords into eight main categories:

### 1. Statements (`statements`)
Keywords that perform actions or operations:
- `PRINT`, `INPUT`, `DIM`, `FOR`, `NEXT`, `IF`, `THEN`, `ELSE`
- `_DISPLAY`, `_ACCEPTFILEDROP`, `_SCREENMOVE`
- Control flow, variable declarations, I/O operations

### 2. Functions (`functions`) 
Keywords that return values:
- `_ACOS`, `_ALPHA`, `_AUTODISPLAY`, `ABS`, `ATN`, `COS`
- Mathematical functions, string functions, system queries
- Include return type information and parameter details

### 3. Operators (`operators`)
Mathematical and logical operators:
- `+`, `-`, `*`, `/`, `\\`, `^`, `MOD`
- `AND`, `OR`, `XOR`, `NOT`, `EQV`, `IMP`
- Arithmetic, comparison, and logical operations

### 4. Metacommands (`metacommands`)
Compiler directives starting with `$`:
- `$INCLUDE`, `$CONSOLE`, `$DEBUG`, `$DYNAMIC`, `$STATIC`
- Preprocessor commands and compilation options

### 5. OpenGL (`opengl`)
OpenGL graphics functions and statements:
- `_glBegin`, `_glEnd`, `_glVertex3f`, `_glColor4f`
- Complete OpenGL API bindings for 3D graphics

### 6. Types (`types`)
Data types and type suffixes:
- `INTEGER`, `LONG`, `SINGLE`, `DOUBLE`, `STRING`
- `_BIT`, `_BYTE`, `_INTEGER64`, `_FLOAT`, `_UNSIGNED`

### 7. Constants (`constants`)
Built-in constants and literals:
- Numeric constants, string literals, boolean values
- System-defined constants and enumerations

### 8. Legacy (`legacy`)
Legacy QBasic keywords and compatibility items:
- Keywords from older BASIC versions
- Deprecated or compatibility-only features

## Services Architecture

### KeywordsService (`src/services/keywords-service.ts`)

Core service providing keyword management:

```typescript
interface KeywordInfo {
  name: string;
  type: 'statement' | 'function' | 'operator' | 'metacommand' | 'opengl' | 'type' | 'constant' | 'legacy';
  category: string;
  description: string;
  syntax: string;
  parameters: string[];
  returns: string | null;
  example: string;
  related: string[];
  version: 'QBasic' | 'QB64' | 'QB64PE';
  availability: 'All platforms' | 'Windows' | 'Linux' | 'macOS';
}
```

**Key Methods:**
- `getKeyword(name: string): KeywordInfo | null`
- `getAllKeywords(): Record<string, KeywordInfo>`
- `getKeywordsByCategory(category: string): KeywordInfo[]`
- `searchKeywords(query: string, maxResults?: number): KeywordSearchResult[]`
- `getAutocomplete(prefix: string, maxResults?: number): string[]`
- `validateKeyword(name: string): ValidationResult`

### Enhanced Syntax Service

Extended `QB64PESyntaxService` with keyword validation:

- **Keyword Recognition** - Identifies valid/invalid keywords in code
- **Smart Suggestions** - Provides similar keyword suggestions for typos
- **Version Checking** - Warns about QB64PE-specific vs legacy keywords
- **Deprecation Warnings** - Flags deprecated keywords with alternatives

### Enhanced Search Service

Extended `CompatibilitySearchService` with keyword indexing:

- **Keyword Indexing** - All keywords indexed for fast search
- **Category Filtering** - Search within specific keyword categories
- **Type-Based Search** - Find keywords by type (statement, function, etc.)
- **Version Filtering** - Search by QB64PE version compatibility

## MCP Tools

### 1. Keyword Lookup (`lookup_qb64pe_keyword`)

Get detailed information about a specific keyword:

```json
{
  "keyword": "PRINT"
}
```

**Response:**
```json
{
  "keyword": {
    "name": "PRINT",
    "type": "statement",
    "category": "statements",
    "description": "prints text strings or numerical values to the SCREEN",
    "syntax": "PRINT [expression][;|,][expression]...",
    "example": "PRINT \"Hello, World!\"",
    "version": "QBasic",
    "availability": "All platforms"
  },
  "isValid": true
}
```

### 2. Keyword Autocomplete (`autocomplete_qb64pe_keywords`)

Get autocomplete suggestions for partial keywords:

```json
{
  "prefix": "_AC",
  "maxResults": 10
}
```

**Response:**
```json
{
  "prefix": "_AC",
  "suggestions": ["_ACCEPTFILEDROP", "_ACOS", "_ACOSH"]
}
```

### 3. Keywords by Category (`get_qb64pe_keywords_by_category`)

Get all keywords in a specific category:

```json
{
  "category": "functions"
}
```

**Response:**
```json
{
  "category": "functions",
  "description": "QB64PE functions that return values",
  "keywords": [
    {
      "name": "_ACOS",
      "description": "arccosine function returns the angle in radians",
      "type": "function",
      "version": "QB64PE"
    }
  ]
}
```

### 4. Search Keywords (`search_qb64pe_keywords`)

Search for keywords by name, description, or functionality:

```json
{
  "query": "mouse",
  "maxResults": 10
}
```

**Response:**
```json
{
  "query": "mouse",
  "results": [
    {
      "keyword": "_MOUSEX",
      "relevance": 95,
      "matchType": "contains",
      "info": {
        "name": "_MOUSEX",
        "type": "function",
        "description": "returns the current horizontal position of the mouse cursor"
      }
    }
  ]
}
```

## MCP Resources

### 1. Keywords Base Resource (`qb64pe://keywords/`)

Access to complete keywords reference:

**Response:**
```json
{
  "categories": {
    "statements": {
      "description": "QB64PE statements that perform actions",
      "keywords": ["PRINT", "INPUT", "DIM", ...]
    }
  },
  "totalKeywords": 847,
  "keywordsByCategory": {
    "statements": {
      "description": "QB64PE statements that perform actions",
      "count": 234,
      "keywords": ["PRINT", "INPUT", "DIM", "FOR", "NEXT", ...]
    }
  }
}
```

### 2. Keywords by Category (`qb64pe://keywords/category/{category}`)

Category-filtered keyword lists:

**Example:** `qb64pe://keywords/category/functions`

**Response:**
```json
{
  "category": "functions",
  "description": "QB64PE functions that return values",
  "keywords": [
    {
      "name": "_ACOS",
      "type": "function",
      "description": "arccosine function returns the angle in radians",
      "syntax": "angle = _ACOS(cosine_value)",
      "version": "QB64PE",
      "availability": "All platforms"
    }
  ]
}
```

### 3. Keyword Detail (`qb64pe://keywords/detail/{keyword}`)

Detailed information about specific keywords:

**Example:** `qb64pe://keywords/detail/PRINT`

**Response:**
```json
{
  "isValid": true,
  "keyword": {
    "name": "PRINT",
    "type": "statement",
    "category": "statements",
    "description": "prints text strings or numerical values to the SCREEN",
    "syntax": "PRINT [expression][;|,][expression]...",
    "parameters": ["expression: Any valid QB64PE expression", "; or , : Output separator"],
    "returns": null,
    "example": "PRINT \"Hello, World!\"\nPRINT \"Number:\"; 42",
    "related": ["PRINT USING", "_PRINTSTRING", "INPUT", "LOCATE"],
    "version": "QBasic",
    "availability": "All platforms"
  }
}
```

## Usage Examples

### AI Assistant Integration

The keywords integration enables AI assistants to:

1. **Validate Code in Real-Time**
   ```
   Human: Is "_ACCEPTFILEDROP" a valid QB64PE keyword?
   AI: [Uses lookup_qb64pe_keyword] 
   Yes, _ACCEPTFILEDROP is a valid QB64PE statement...
   ```

2. **Provide Autocomplete Suggestions**
   ```
   Human: What keywords start with "_MOU"?
   AI: [Uses autocomplete_qb64pe_keywords]
   Keywords starting with "_MOU": _MOUSEX, _MOUSEY, _MOUSEBUTTON, _MOUSEINPUT, _MOUSEMOVE...
   ```

3. **Explain Keyword Functionality**
   ```
   Human: How do I use the CIRCLE statement?
   AI: [Uses lookup_qb64pe_keyword for CIRCLE]
   The CIRCLE statement creates circles, ellipses or arcs...
   ```

4. **Category-Based Exploration**
   ```
   Human: Show me all OpenGL functions
   AI: [Uses get_qb64pe_keywords_by_category with "opengl"]
   Here are the OpenGL functions available in QB64PE...
   ```

### Developer Workflow Integration

1. **Code Completion** - Autocomplete partial keywords
2. **Syntax Validation** - Real-time keyword validation
3. **Documentation Lookup** - Instant access to keyword documentation
4. **Version Checking** - Compatibility validation across QB64PE versions
5. **Best Practices** - Related keyword suggestions for better coding

## Data Generation Process

The enhanced keywords data is automatically generated from the original keywords JSON through:

1. **Categorization Algorithm** - Classifies keywords by type and functionality
2. **Syntax Generation** - Creates syntax patterns based on keyword types
3. **Example Generation** - Produces usage examples for each keyword
4. **Relationship Detection** - Identifies related keywords through description analysis
5. **Metadata Extraction** - Extracts version, platform, and deprecation information

## Future Enhancements

### Planned Features

1. **Interactive Examples** - Runnable code examples for each keyword
2. **Visual Documentation** - Diagrams and visual aids for complex keywords
3. **Usage Analytics** - Track most commonly used keywords
4. **Custom Categories** - User-defined keyword groupings
5. **Code Generation** - Template generation based on keyword patterns

### Integration Opportunities

1. **IDE Plugins** - Direct integration with code editors
2. **Documentation Sites** - Enhanced web documentation
3. **Training Materials** - Interactive learning modules
4. **Code Analysis Tools** - Static analysis integration
5. **Migration Tools** - Legacy code conversion assistance

## Conclusion

The QB64PE Keywords Integration provides comprehensive keyword support through multiple access methods, enabling enhanced development experiences for QB64PE programmers. The system combines complete keyword coverage with intelligent search, validation, and documentation features, making it an essential tool for QB64PE development workflows.
