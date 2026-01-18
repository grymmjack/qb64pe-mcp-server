# get_qb64pe_keywords_by_category

## Overview
The `get_qb64pe_keywords_by_category` tool retrieves all QB64PE keywords within a specific functional category, providing organized access to related commands and functions.

## Purpose
- **Category Browsing**: Explore QB64PE keywords organized by functionality
- **Learning Tool**: Discover related keywords within specific areas
- **Reference Guide**: Get comprehensive lists of keywords for specific purposes
- **Development Planning**: Find all available tools for specific programming tasks

## Parameters

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | The keyword category to retrieve |

### Available Categories
- `statements` - Core language statements
- `functions` - Built-in functions
- `operators` - Mathematical and logical operators
- `metacommands` - Compiler directives and metacommands
- `opengl` - OpenGL graphics functions
- `types` - Data types and type-related keywords
- `constants` - Predefined constants
- `legacy` - Legacy QBasic keywords

## Response Structure

### Category Keywords Array
```json
[
  {
    "name": string,
    "description": string,
    "type": string,
    "syntax": string,
    "category": string,
    "version": string,
    "deprecated": boolean
  }
]
```

## Usage Examples

### Browse Graphics Keywords
```javascript
const graphics = await mcp.call("get_qb64pe_keywords_by_category", {
  category: "statements"
});

console.log(`Found ${graphics.length} statement keywords`);
graphics.forEach(keyword => {
  console.log(`${keyword.name}: ${keyword.description}`);
});
```

### Explore Functions
```javascript
const functions = await mcp.call("get_qb64pe_keywords_by_category", {
  category: "functions"
});

const mathFunctions = functions.filter(f => 
  f.description.toLowerCase().includes("math") || 
  f.description.toLowerCase().includes("calculation")
);

console.log("Mathematical functions:");
mathFunctions.forEach(func => {
  console.log(`${func.name}: ${func.syntax}`);
});
```

### Compare Legacy vs Modern Keywords
```javascript
const legacy = await mcp.call("get_qb64pe_keywords_by_category", {
  category: "legacy"
});

const modern = await mcp.call("get_qb64pe_keywords_by_category", {
  category: "opengl"
});

console.log(`Legacy keywords: ${legacy.length}`);
console.log(`OpenGL keywords: ${modern.length}`);
```

## Related Tools

### Keyword Search and Discovery
- **`search_qb64pe_keywords`**: Search keywords by name or function
- **`lookup_qb64pe_keyword`**: Get detailed information about specific keywords
- **`autocomplete_qb64pe_keywords`**: Get keyword completion suggestions

### Category and Wiki Tools
- **`get_qb64pe_wiki_categories`**: Get all available wiki categories
- **`search_qb64pe_keywords_by_wiki_category`**: Search within wiki categories

## Best Practices

### Effective Browsing
- **Start with Core Categories**: Begin with statements and functions
- **Explore Related Categories**: Check multiple categories for complete coverage
- **Filter Results**: Use array methods to filter by specific criteria
- **Compare Categories**: Understand relationships between different keyword groups

---

**See Also:**
- [Search QB64PE Keywords](./search_qb64pe_keywords.md) - Search for specific keywords
- [Lookup QB64PE Keyword](./lookup_qb64pe_keyword.md) - Detailed keyword information
- [Get QB64PE Wiki Categories](./get_qb64pe_wiki_categories.md) - Browse wiki categories
