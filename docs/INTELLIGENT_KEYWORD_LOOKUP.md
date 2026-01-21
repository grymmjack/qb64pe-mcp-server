# Intelligent Keyword Lookup System

## Overview

The QB64PE MCP Server now includes an intelligent fallback system for keyword lookups. When a keyword is not found in the local database, the system automatically performs semantic searches and provides helpful alternatives.

## How It Works

### Primary Lookup
1. User requests keyword lookup: `mcp_qb64pe_lookup_qb64pe_keyword TRUE`
2. System searches local keyword database
3. If found: Returns detailed keyword information
4. If NOT found: Triggers intelligent fallback system

### Intelligent Fallback Strategy

When a keyword is not found, the system automatically:

1. **Semantic Term Inference**: Analyzes the keyword to infer related search terms
   - `TRUE`/`FALSE` → searches for "BOOLEAN", "CONSTANTS"
   - `SCREEN`/`PIXEL` → searches for "SCREEN", "GRAPHICS", "_DISPLAY"
   - `FILE`/`OPEN` → searches for "OPEN", "FILE", "INPUT", "OUTPUT"
   - etc.

2. **Automatic Search Execution**: Performs searches with inferred terms
   - Returns top 5 results for each semantic term
   - Shows match type and relevance score
   - Provides wiki links for each result

3. **Wiki Search URL**: Generates direct wiki search link
   - Format: `https://qb64phoenix.com/qb64wiki/index.php?search=KEYWORD&title=Special%3ASearch&profile=default&fulltext=1`
   - Allows manual verification against official documentation

4. **Suggestions**: Shows "Did you mean?" suggestions from local database

## Example Usage

### Scenario: Looking up _TRUE

**Input:**
```
mcp_qb64pe_lookup_qb64pe_keyword _TRUE
```

**If _TRUE not in local database, output:**
```
⚠️ **Keyword "_TRUE" not found in local database.**

🔍 **Attempting fallback searches...**

### Search results for "BOOLEAN":
1. **Boolean** (exact match, relevance: 100)
   - Boolean statements are evaluations that return true (-1) or false (0) values...
   - Wiki: https://qb64phoenix.com/qb64wiki/index.php/Boolean

### Search results for "CONSTANTS":
1. **Constants** (exact match, relevance: 100)
   - Constants page shows _TRUE = -1, _FALSE = 0
   - Wiki: https://qb64phoenix.com/qb64wiki/index.php/Constants

📚 **Direct Wiki Search:** [_TRUE](https://qb64phoenix.com/qb64wiki/index.php?search=_TRUE&title=Special%3ASearch&profile=default&fulltext=1)

💡 **Did you mean:** _FALSE, TRUE (if in database)?

**Tip:** Try searching for related concepts. For example:
- If looking for TRUE/FALSE, try searching for "boolean"
- If looking for a graphics function, try searching for "graphics" or "screen"
- If looking for a file operation, try searching for "file" or "open"
```

## Semantic Categories

The system recognizes these semantic categories:

| Category | Trigger Keywords | Search Terms |
|----------|-----------------|--------------|
| Boolean | true, false | BOOLEAN, CONSTANTS |
| Graphics | screen, pixel, draw, color, graphics, image | SCREEN, GRAPHICS, _DISPLAY |
| File I/O | file, open, read, write, load, save | OPEN, FILE, INPUT, OUTPUT |
| String | string, text, chr, asc | STRING, CHR$, ASC |
| Math | math, calc, sin, cos, sqrt | SIN, COS, SQR, ABS |
| Sound | sound, audio, play, music | SOUND, PLAY, _SNDOPEN |

## Benefits

1. **No False Negatives**: Even if keyword not in database, users get relevant information
2. **Educational**: Shows related keywords and concepts
3. **Self-Documenting**: Provides tips and examples
4. **Wiki Integration**: Direct links to official documentation
5. **Autonomous**: LLMs can follow the fallback suggestions automatically

## Integration with Other Tools

### Tool Hierarchy
```
1. mcp_qb64pe_lookup_qb64pe_keyword (primary - includes auto-fallback)
   ↓ (if not found, auto-suggests)
2. mcp_qb64pe_search_qb64pe_keywords (secondary - broader search)
   ↓ (if still not found)
3. fetch_webpage (tertiary - verify against wiki)
```

### Example Workflow for LLMs

When looking up an unknown keyword:

```typescript
// Step 1: Try lookup (now includes auto-fallback)
const result = await mcp_qb64pe_lookup_qb64pe_keyword("_TRUE");

// Step 2: If lookup suggests searching, use search tool
if (result.includes("Search results for")) {
  // Follow the suggestions provided in the fallback results
  // No need for separate search - fallback already did it!
}

// Step 3: If still unclear, fetch actual wiki page
if (result.includes("Direct Wiki Search")) {
  // Extract wiki URL from result and fetch
  await fetch_webpage(wikiUrl);
}
```

## Implementation Details

### Code Location
- File: `src/tools/keyword-tools.ts`
- Function: `registerKeywordTools()` → `lookup_qb64pe_keyword` handler
- Helper: `inferSemanticTerms(keyword: string): string[]`

### Semantic Inference Logic
```typescript
function inferSemanticTerms(keyword: string): string[] {
  const terms: string[] = [];
  const lower = keyword.toLowerCase();
  
  // Boolean-related
  if (lower.includes('true') || lower.includes('false')) {
    terms.push('BOOLEAN', 'CONSTANTS');
  }
  
  // ... more categories ...
  
  // Fallback: use keyword itself
  if (terms.length === 0) {
    terms.push(keyword.toUpperCase());
  }
  
  return terms;
}
```

## Future Enhancements

Potential improvements:

1. **Machine Learning**: Learn from user searches to improve semantic term mapping
2. **Synonym Dictionary**: Expand semantic categories with community input
3. **Cache Wiki Results**: Store frequently accessed wiki pages locally
4. **Context-Aware Search**: Consider previously searched keywords for better suggestions
5. **Fuzzy Matching**: Handle typos and similar-sounding keywords

## Related Documentation

- [Project Conventions](../.github/instructions/project-conventions.instructions.md) - Verification process
- [Keywords Integration](KEYWORDS_INTEGRATION.md) - Original keyword system
- [LLM Usage Guide](LLM_USAGE_GUIDE.md) - How LLMs should use MCP tools

## Changelog

### v2.0.1 - January 21, 2026
- ✨ Added intelligent fallback system to `lookup_qb64pe_keyword`
- ✨ Implemented semantic term inference for 6 categories
- ✨ Auto-generates wiki search URLs
- ✨ Provides contextual tips and suggestions
- 📝 Updated project conventions with smart search strategy
