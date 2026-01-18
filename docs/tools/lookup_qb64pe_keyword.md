# lookup_qb64pe_keyword

## Overview
The `lookup_qb64pe_keyword` tool provides detailed information about a specific QB64PE keyword, including comprehensive syntax, usage examples, parameters, and related information.

## Purpose
- **Detailed Reference**: Get comprehensive information about specific keywords
- **Syntax Guidance**: Understand exact syntax and parameter requirements
- **Usage Examples**: See practical code examples and implementations
- **Context Information**: Learn about keyword relationships and alternatives
- **Development Support**: Quick reference during coding

## Parameters

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string | The QB64PE keyword to look up |

## Response Structure

### Keyword Information Object
```json
{
  "name": string,
  "description": string,
  "category": string,
  "type": string,
  "syntax": string,
  "parameters": array,
  "returnValue": object,
  "examples": array,
  "relatedKeywords": array,
  "version": string,
  "deprecated": boolean,
  "notes": array,
  "seeAlso": array
}
```

## Usage Examples

### Basic Keyword Lookup
```javascript
const keyword = await mcp.call("lookup_qb64pe_keyword", {
  keyword: "CIRCLE"
});

console.log(`${keyword.name}: ${keyword.description}`);
console.log(`Syntax: ${keyword.syntax}`);
console.log("Examples:");
keyword.examples.forEach(example => console.log(`  ${example}`));
```

### Function Lookup with Return Value
```javascript
const func = await mcp.call("lookup_qb64pe_keyword", {
  keyword: "_RGB32"
});

console.log(`${func.name} (${func.type})`);
console.log(`Description: ${func.description}`);
console.log(`Returns: ${func.returnValue.type} - ${func.returnValue.description}`);
console.log(`Syntax: ${func.syntax}`);
```

### Development Reference Workflow
```javascript
const keywords = ["PRINT", "INPUT", "CIRCLE", "_RGB32", "FOR"];

for (const kw of keywords) {
  const info = await mcp.call("lookup_qb64pe_keyword", {
    keyword: kw
  });
  
  console.log(`\n=== ${info.name} ===`);
  console.log(`Category: ${info.category}`);
  console.log(`Type: ${info.type}`);
  console.log(`Syntax: ${info.syntax}`);
  
  if (info.examples.length > 0) {
    console.log(`Example: ${info.examples[0]}`);
  }
}
```

## Response Examples

### Statement Keyword (CIRCLE)
```json
{
  "name": "CIRCLE",
  "description": "Draws a circle or ellipse on the screen at specified coordinates",
  "category": "Graphics Commands",
  "type": "statement",
  "syntax": "CIRCLE [STEP] (column, row), radius [, [color] [, [start] [, [end] [, aspect]]]]",
  "parameters": [
    {
      "name": "STEP",
      "type": "keyword",
      "required": false,
      "description": "Use relative coordinates from current position"
    },
    {
      "name": "column, row",
      "type": "numeric",
      "required": true,
      "description": "Center coordinates of the circle"
    },
    {
      "name": "radius",
      "type": "numeric", 
      "required": true,
      "description": "Radius of the circle in pixels"
    },
    {
      "name": "color",
      "type": "numeric",
      "required": false,
      "description": "Color attribute or RGB value"
    }
  ],
  "returnValue": null,
  "examples": [
    "CIRCLE (160, 100), 50",
    "CIRCLE (320, 240), 75, 12",
    "CIRCLE STEP (50, 25), 30, _RGB32(255, 0, 0)"
  ],
  "relatedKeywords": ["LINE", "PSET", "PAINT", "_RGB32", "ELLIPSE"],
  "version": "QBasic/QB64PE",
  "deprecated": false,
  "notes": [
    "Coordinates are relative to current screen mode",
    "Color parameter is optional, uses current foreground color if omitted",
    "Can draw arcs by specifying start and end angles"
  ],
  "seeAlso": ["LINE", "ELLIPSE", "PAINT"]
}
```

### Function Keyword (_RGB32)
```json
{
  "name": "_RGB32",
  "description": "Returns a 32-bit color value from red, green, blue, and optional alpha values",
  "category": "Colors and Transparency",
  "type": "function",
  "syntax": "_RGB32(red, green, blue [, alpha])",
  "parameters": [
    {
      "name": "red",
      "type": "numeric",
      "required": true,
      "description": "Red color component (0-255)"
    },
    {
      "name": "green",
      "type": "numeric",
      "required": true,
      "description": "Green color component (0-255)"
    },
    {
      "name": "blue",
      "type": "numeric",
      "required": true,
      "description": "Blue color component (0-255)"
    },
    {
      "name": "alpha",
      "type": "numeric",
      "required": false,
      "description": "Alpha transparency (0-255, default 255=opaque)"
    }
  ],
  "returnValue": {
    "type": "LONG",
    "description": "32-bit color value suitable for use with graphics commands"
  },
  "examples": [
    "_RGB32(255, 0, 0) ' Red",
    "_RGB32(0, 255, 0) ' Green", 
    "_RGB32(128, 128, 255, 200) ' Light blue with transparency"
  ],
  "relatedKeywords": ["_RGBA32", "_RED32", "_GREEN32", "_BLUE32", "_ALPHA32"],
  "version": "QB64PE",
  "deprecated": false,
  "notes": [
    "Returns a LONG value that can be used with any graphics command",
    "Alpha channel only works with 32-bit screen modes",
    "Values outside 0-255 range are automatically clamped"
  ],
  "seeAlso": ["_RGBA32", "COLOR", "_NEWIMAGE"]
}
```

## Related Tools

### Keyword Discovery
- **`search_qb64pe_keywords`**: Search for keywords by name or function
- **`get_qb64pe_keywords_by_category`**: Browse keywords by category
- **`autocomplete_qb64pe_keywords`**: Get keyword completion suggestions

### Documentation and Wiki
- **`get_qb64pe_page`**: Get detailed wiki page for keywords
- **`search_qb64pe_wiki`**: Search wiki for additional documentation
- **`search_qb64pe_keywords_by_wiki_category`**: Search within wiki categories

## Integration Workflows

### Code Development Assistant
```javascript
// Look up keywords as developer types
const currentWord = "CIRCLE";

const keywordInfo = await mcp.call("lookup_qb64pe_keyword", {
  keyword: currentWord
});

if (keywordInfo) {
  // Show syntax help
  console.log("Syntax:", keywordInfo.syntax);
  
  // Show parameter details
  keywordInfo.parameters.forEach(param => {
    const req = param.required ? "Required" : "Optional";
    console.log(`${param.name} (${req}): ${param.description}`);
  });
  
  // Show quick example
  if (keywordInfo.examples.length > 0) {
    console.log("Example:", keywordInfo.examples[0]);
  }
}
```

### Documentation Generator
```javascript
// Generate documentation for a list of keywords
const projectKeywords = ["PRINT", "INPUT", "CIRCLE", "LINE", "_RGB32"];

for (const kw of projectKeywords) {
  const info = await mcp.call("lookup_qb64pe_keyword", {
    keyword: kw
  });
  
  console.log(`## ${info.name}`);
  console.log(info.description);
  console.log(`\`\`\`basic\n${info.syntax}\n\`\`\``);
  
  if (info.examples.length > 0) {
    console.log("### Examples");
    info.examples.forEach(example => {
      console.log(`\`\`\`basic\n${example}\n\`\`\``);
    });
  }
}
```

### Learning and Reference Tool
```javascript
// Interactive keyword explorer
const keyword = "FOR";

const info = await mcp.call("lookup_qb64pe_keyword", {
  keyword: keyword
});

console.log(`Learning about: ${info.name}`);
console.log(`Category: ${info.category}`);
console.log(`Description: ${info.description}`);

console.log("\nSyntax:");
console.log(info.syntax);

console.log("\nExamples:");
info.examples.forEach((example, index) => {
  console.log(`${index + 1}. ${example}`);
});

console.log("\nRelated keywords to explore:");
info.relatedKeywords.forEach(related => console.log(`- ${related}`));
```

## Best Practices

### Effective Usage
- **Verify Spelling**: Ensure correct keyword spelling for accurate lookups
- **Explore Related**: Check related keywords for alternatives
- **Study Examples**: Review all provided examples for complete understanding
- **Check Versions**: Note version compatibility for target environments

### Development Integration
- **Cache Lookups**: Store frequently used keyword information
- **Build Help Systems**: Integrate lookup into development tools
- **Create References**: Generate project-specific keyword references
- **Validate Usage**: Cross-reference syntax with actual code

---

**See Also:**
- [Search QB64PE Keywords](./search_qb64pe_keywords.md) - Search for keywords
- [Get QB64PE Keywords by Category](./get_qb64pe_keywords_by_category.md) - Browse by category
- [Autocomplete QB64PE Keywords](./autocomplete_qb64pe_keywords.md) - Keyword completion
