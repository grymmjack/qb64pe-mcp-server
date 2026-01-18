# search_qb64pe_keywords

## Overview
The `search_qb64pe_keywords` tool provides comprehensive search functionality across the QB64PE keywords database, enabling developers to find relevant commands, functions, and statements by name, description, or functionality.

## Purpose
- **Keyword Discovery**: Find QB64PE keywords by name or partial matches
- **Functional Search**: Search by description or functionality
- **Development Assistance**: Help developers find the right commands for their needs
- **Learning Aid**: Explore QB64PE language features and capabilities
- **Reference Tool**: Quick lookup for syntax and usage information

## Parameters

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search query for keywords |

### Optional Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `maxResults` | number | Maximum number of results to return (default: 20) |

## Response Structure

### Search Results Array
```json
[
  {
    "name": string,
    "description": string,
    "category": string,
    "type": string,
    "syntax": string,
    "parameters": array,
    "examples": array,
    "relatedKeywords": array,
    "version": string,
    "deprecated": boolean
  }
]
```

### Field Descriptions
- **`name`**: The keyword name (e.g., "PRINT", "_RGB32")
- **`description`**: Detailed description of keyword functionality
- **`category`**: Functional category (e.g., "Graphics", "Input/Output")
- **`type`**: Keyword type (statement, function, operator, etc.)
- **`syntax`**: Usage syntax with parameter placeholders
- **`parameters`**: Array of parameter descriptions
- **`examples`**: Code examples demonstrating usage
- **`relatedKeywords`**: Similar or related keywords
- **`version`**: QB64PE version information
- **`deprecated`**: Whether the keyword is deprecated

## Usage Examples

### Basic Keyword Search
```javascript
const results = await mcp.call("search_qb64pe_keywords", {
  query: "PRINT"
});

console.log(`Found ${results.length} results for "PRINT"`);
results.forEach(keyword => {
  console.log(`${keyword.name}: ${keyword.description}`);
  console.log(`Syntax: ${keyword.syntax}`);
});
```

### Functional Search
```javascript
const results = await mcp.call("search_qb64pe_keywords", {
  query: "graphics circle drawing",
  maxResults: 10
});

console.log("Graphics-related keywords:");
results.forEach(keyword => {
  console.log(`- ${keyword.name} (${keyword.category}): ${keyword.description}`);
});
```

### Partial Match Search
```javascript
const results = await mcp.call("search_qb64pe_keywords", {
  query: "RGB",
  maxResults: 15
});

console.log("Keywords containing 'RGB':");
results.forEach(keyword => {
  console.log(`${keyword.name}: ${keyword.syntax}`);
  if (keyword.examples.length > 0) {
    console.log(`Example: ${keyword.examples[0]}`);
  }
});
```

### Development Workflow Search
```javascript
// Find keywords for specific programming tasks
const searches = [
  "file input output",
  "keyboard input",
  "mouse input",
  "graphics drawing",
  "sound audio"
];

for (const search of searches) {
  const results = await mcp.call("search_qb64pe_keywords", {
    query: search,
    maxResults: 5
  });
  
  console.log(`\n=== ${search.toUpperCase()} ===`);
  results.forEach(keyword => {
    console.log(`${keyword.name}: ${keyword.description}`);
  });
}
```

## Search Capabilities

### Search Types
1. **Exact Name Match**: Search for specific keyword names
2. **Partial Name Match**: Find keywords containing search terms
3. **Description Search**: Search within keyword descriptions
4. **Category Search**: Find keywords by functional category
5. **Syntax Search**: Search within syntax patterns
6. **Fuzzy Search**: Find keywords with similar names or functionality

### Search Strategies
- **Multiple Terms**: Searches handle multiple words (AND logic)
- **Case Insensitive**: Search is not case-sensitive
- **Stemming**: Handles word variations and suffixes
- **Ranking**: Results ranked by relevance and match quality

## Response Examples

### Graphics Search Results
```json
[
  {
    "name": "CIRCLE",
    "description": "Draws a circle or ellipse on the screen",
    "category": "Graphics Commands",
    "type": "statement",
    "syntax": "CIRCLE [STEP] (column, row), radius [, [color] [, [start] [, [end] [, aspect]]]]",
    "parameters": [
      "column, row: Center coordinates",
      "radius: Circle radius in pixels",
      "color: Color to draw with (optional)",
      "start, end: Arc angles (optional)",
      "aspect: Aspect ratio for ellipse (optional)"
    ],
    "examples": [
      "CIRCLE (160, 100), 50, 12",
      "CIRCLE (320, 240), 100, , 0, 3.14159"
    ],
    "relatedKeywords": ["LINE", "PSET", "PAINT", "_RGB32"],
    "version": "QB64PE",
    "deprecated": false
  },
  {
    "name": "_RGB32",
    "description": "Returns a 32-bit color value from red, green, blue, and optional alpha values",
    "category": "Colors and Transparency",
    "type": "function",
    "syntax": "_RGB32(red, green, blue [, alpha])",
    "parameters": [
      "red: Red component (0-255)",
      "green: Green component (0-255)", 
      "blue: Blue component (0-255)",
      "alpha: Alpha transparency (0-255, optional)"
    ],
    "examples": [
      "_RGB32(255, 0, 0)",
      "_RGB32(128, 128, 255, 200)"
    ],
    "relatedKeywords": ["_RGBA32", "_RED32", "_GREEN32", "_BLUE32", "COLOR"],
    "version": "QB64PE",
    "deprecated": false
  }
]
```

### Input/Output Search Results
```json
[
  {
    "name": "INPUT",
    "description": "Waits for user input from keyboard and assigns it to a variable",
    "category": "Keyboard Input",
    "type": "statement", 
    "syntax": "INPUT [prompt] [;] variable",
    "parameters": [
      "prompt: Optional text to display (string)",
      "variable: Variable to store input"
    ],
    "examples": [
      "INPUT \"Enter your name: \", name$",
      "INPUT age"
    ],
    "relatedKeywords": ["INKEY$", "LINE INPUT", "_KEYHIT"],
    "version": "QBasic/QB64PE",
    "deprecated": false
  }
]
```

## Advanced Search Features

### Category-Specific Searches
```javascript
// Search within specific categories
const graphicsKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "category:graphics drawing"
});

const inputKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "category:input keyboard mouse"
});
```

### Version-Specific Searches
```javascript
// Find QB64PE-specific features
const modernKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "version:QB64PE modern features"
});

// Find legacy QBasic keywords
const legacyKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "version:QBasic legacy"
});
```

### Syntax Pattern Searches
```javascript
// Find keywords with specific syntax patterns
const functionKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "type:function return value"
});

const statementKeywords = await mcp.call("search_qb64pe_keywords", {
  query: "type:statement command"
});
```

## Related Tools

### Keyword Reference
- **`lookup_qb64pe_keyword`**: Get detailed information about specific keywords
- **`get_qb64pe_keywords_by_category`**: Browse keywords by functional category
- **`autocomplete_qb64pe_keywords`**: Get keyword autocomplete suggestions

### Wiki and Documentation
- **`search_qb64pe_wiki`**: Search QB64PE wiki for detailed documentation
- **`get_qb64pe_page`**: Get specific wiki pages for keywords
- **`get_qb64pe_wiki_categories`**: Browse all available wiki categories

### Advanced Search
- **`search_qb64pe_keywords_by_wiki_category`**: Search within specific wiki categories
- **`search_qb64pe_compatibility`**: Search compatibility and porting information

## Integration Workflows

### Development Assistant Workflow
```javascript
// Help developer find the right keyword for a task
const task = "draw colored rectangles on screen";

// 1. Search for relevant keywords
const keywords = await mcp.call("search_qb64pe_keywords", {
  query: "rectangle box draw color graphics",
  maxResults: 10
});

// 2. Get detailed info for most relevant results
for (const keyword of keywords.slice(0, 3)) {
  const details = await mcp.call("lookup_qb64pe_keyword", {
    keyword: keyword.name
  });
  
  console.log(`${keyword.name}: ${details.description}`);
  console.log(`Examples: ${details.examples.join("; ")}`);
}
```

### Learning and Exploration Workflow
```javascript
// Explore QB64PE capabilities by category
const categories = [
  "graphics", "input", "output", "file", "sound", "math"
];

for (const category of categories) {
  const keywords = await mcp.call("search_qb64pe_keywords", {
    query: category,
    maxResults: 5
  });
  
  console.log(`\n=== ${category.toUpperCase()} KEYWORDS ===`);
  keywords.forEach(kw => {
    console.log(`${kw.name}: ${kw.description}`);
  });
}
```

### Code Completion Workflow
```javascript
// Provide intelligent code completion
const partialKeyword = "PR";

// 1. Get autocomplete suggestions
const suggestions = await mcp.call("autocomplete_qb64pe_keywords", {
  prefix: partialKeyword,
  maxResults: 10
});

// 2. Search for detailed matches
const searchResults = await mcp.call("search_qb64pe_keywords", {
  query: partialKeyword,
  maxResults: 5
});

console.log("Suggestions:", suggestions.map(s => s.name));
console.log("Detailed matches:", searchResults.map(r => `${r.name}: ${r.syntax}`));
```

## Search Optimization

### Query Construction Tips
- **Use Multiple Terms**: Combine related terms for better results
- **Include Context**: Add context words like "graphics", "input", "file"
- **Try Variations**: Search for both full names and abbreviations
- **Use Categories**: Include category names in searches

### Result Filtering
```javascript
// Filter results by specific criteria
const results = await mcp.call("search_qb64pe_keywords", {
  query: "graphics drawing",
  maxResults: 50
});

// Filter for non-deprecated keywords only
const currentKeywords = results.filter(kw => !kw.deprecated);

// Filter by category
const graphicsOnly = results.filter(kw => 
  kw.category.toLowerCase().includes("graphics")
);

// Filter by type
const functions = results.filter(kw => kw.type === "function");
```

## Best Practices

### Effective Searching
- **Start Broad**: Begin with general terms, then narrow down
- **Use Multiple Queries**: Try different search terms for comprehensive results
- **Check Related Keywords**: Explore related keywords from results
- **Combine Tools**: Use search with lookup for detailed information

### Development Integration
- **Cache Results**: Store frequently used search results
- **Build Keyword Libraries**: Create project-specific keyword collections
- **Use in Documentation**: Include search results in code documentation
- **IDE Integration**: Integrate search into development environments

### Learning Approach
- **Explore Categories**: Browse different functional categories
- **Study Examples**: Review code examples from search results
- **Practice Usage**: Try keywords in actual code
- **Build Reference**: Create personal keyword reference guides

---

**See Also:**
- [Lookup QB64PE Keyword](./lookup_qb64pe_keyword.md) - Detailed keyword information
- [Get QB64PE Keywords by Category](./get_qb64pe_keywords_by_category.md) - Browse by category
- [Autocomplete QB64PE Keywords](./autocomplete_qb64pe_keywords.md) - Keyword completion
