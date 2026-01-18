# autocomplete_qb64pe_keywords

## Overview
The `autocomplete_qb64pe_keywords` tool provides intelligent autocomplete suggestions for QB64PE keywords based on partial input, helping with code completion and keyword discovery.

## Purpose
- **Code Completion**: Provide real-time keyword suggestions while typing
- **IDE Integration**: Support intelligent code editors and development environments
- **Learning Aid**: Help discover keywords by partial names
- **Productivity Tool**: Speed up coding with smart suggestions

## Parameters

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `prefix` | string | The partial keyword to autocomplete |

### Optional Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `maxResults` | number | Maximum number of suggestions (default: 10) |

## Response Structure

### Suggestions Array
```json
[
  {
    "name": string,
    "description": string,
    "category": string,
    "type": string,
    "relevanceScore": number
  }
]
```

## Usage Examples

### Basic Autocomplete
```javascript
const suggestions = await mcp.call("autocomplete_qb64pe_keywords", {
  prefix: "PR",
  maxResults: 5
});

suggestions.forEach(suggestion => {
  console.log(`${suggestion.name}: ${suggestion.description}`);
});
```

### IDE Integration Example
```javascript
// Simulate typing in an IDE
const partialInput = "CIR";

const completions = await mcp.call("autocomplete_qb64pe_keywords", {
  prefix: partialInput,
  maxResults: 10
});

console.log(`Completions for "${partialInput}":`);
completions.forEach((completion, index) => {
  console.log(`${index + 1}. ${completion.name} (${completion.type})`);
});
```

## Related Tools

### Keyword Discovery
- **`search_qb64pe_keywords`**: Search for keywords by name or function
- **`lookup_qb64pe_keyword`**: Get detailed information about specific keywords
- **`get_qb64pe_keywords_by_category`**: Browse keywords by category

## Best Practices

### Effective Autocomplete
- **Short Prefixes**: Use 2-3 character prefixes for broad suggestions
- **Longer Prefixes**: Use longer prefixes for more specific matches
- **Case Insensitive**: Autocomplete works regardless of case
- **Multiple Attempts**: Try different prefixes if first attempt doesn't find desired keyword

---

**See Also:**
- [Search QB64PE Keywords](./search_qb64pe_keywords.md) - Search for keywords
- [Lookup QB64PE Keyword](./lookup_qb64pe_keyword.md) - Detailed keyword information
- [Get QB64PE Keywords by Category](./get_qb64pe_keywords_by_category.md) - Browse by category
