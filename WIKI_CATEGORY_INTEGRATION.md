# Wiki Category Search Integration

## Overview

We've successfully integrated the QB64PE Wiki keyword categorization system into the MCP server, providing powerful new ways to search and discover QB64PE keywords by their functional categories.

## New Features

### 1. Wiki Category Data Integration

- **Data Source**: `docs/resources/QB64PE Keywords by Category.json`
- **Categories**: 34 functional categories from the QB64PE wiki
- **Keywords**: 707 categorized keywords mapped to their functional areas
- **Structure**: Each category contains an array of related keywords

### 2. New MCP Tools

#### `search_qb64pe_keywords_by_wiki_category`
**Purpose**: Search for keywords within specific functional categories

**Parameters**:
- `category` (required): One of 34 available categories
- `query` (optional): Filter keywords within the category
- `maxResults` (optional): Limit number of results (default: 50)

**Available Categories**:
- Arrays and Data Storage
- Colors and Transparency  
- Console Window
- Conditional Operations
- Definitions and Variable Types
- External Disk and API calls
- Error Trapping, Logging & Debugging
- Event Trapping
- File Input and Output
- Checksums and Hashes
- Compression and Encoding
- Fonts
- Game Controller Input (Joystick)
- Graphic Commands
- Graphics and Imaging:
- Keyboard Input
- Libraries
- Logical Bitwise Operations
- Mathematical Functions and Operations
- Memory Handling and Clipboard
- Mouse Input
- Numerical Manipulation and Conversion
- Port Input and Output (COM and LPT)
- Print formatting
- Printer Output (LPT and USB)
- Program Flow and Loops
- Sounds and Music
- String Text Manipulation and Conversion
- Sub procedures and Functions
- TCP/IP Networking HTTP(S) and Email
- Text on Screen
- Time, Date and Timing
- Window and Desktop
- QB64 Programming Symbols

**Example Usage**:
```json
{
  "tool": "search_qb64pe_keywords_by_wiki_category",
  "arguments": {
    "category": "Colors and Transparency",
    "query": "RGB",
    "maxResults": 10
  }
}
```

#### `get_qb64pe_wiki_categories`
**Purpose**: Get all available wiki categories with statistics

**Parameters**: None

**Returns**:
- Total number of categories
- Total number of keywords
- List of categories with keyword counts and sample keywords
- Category descriptions

**Example Response**:
```json
{
  "totalCategories": 34,
  "totalKeywords": 707,
  "categories": [
    {
      "category": "Graphics and Imaging:",
      "keywordCount": 48,
      "sampleKeywords": ["_AUTODISPLAY", "_CLIP", "_COPYIMAGE", "_COPYPALETTE", "_DESKTOPHEIGHT"],
      "description": "Image manipulation and graphics operations"
    }
  ]
}
```

### 3. Enhanced KeywordsService

#### New Methods:
- `getWikiCategories()`: Returns all wiki categories with their keywords
- `getWikiCategoryCounts()`: Returns keyword counts per category
- `getKeywordsByWikiCategory(category)`: Gets keywords for a specific category
- `getWikiCategoryNames()`: Returns list of all category names
- `searchWikiCategories(query)`: Search for categories by name

### 4. Category Statistics

**Top 5 Categories by Keyword Count**:
1. Graphics and Imaging: 48 keywords
2. Colors and Transparency: 43 keywords  
3. File Input and Output: 39 keywords
4. External Disk and API calls: 38 keywords
5. Program Flow and Loops: 35 keywords

## Benefits

### For Developers
- **Focused Discovery**: Find keywords by functional area
- **Better Organization**: Keywords grouped by what they do, not just alphabetically
- **Context-Aware Search**: Understand keyword relationships within functional domains
- **Learning Aid**: Discover related keywords in the same functional area

### For AI Assistants
- **Smarter Recommendations**: Suggest keywords from relevant categories
- **Domain-Specific Help**: Provide category-focused assistance
- **Better Code Generation**: Use category knowledge for more accurate code suggestions

## Implementation Details

### Data Loading
- Wiki categories loaded from JSON file on service initialization
- Automatic fallback if file not found
- Concurrent loading with existing keyword data

### Type Safety
- Full TypeScript typing for all new methods
- Proper error handling for missing categories
- Comprehensive input validation

### Performance
- Categories cached in memory for fast access
- Efficient filtering for category-specific searches
- Optimized data structures for quick lookups

## Usage Examples

### Find All Color-Related Keywords
```typescript
const colorKeywords = keywordsService.getKeywordsByWikiCategory('Colors and Transparency');
// Returns: ['_ALPHA', '_ALPHA32', '_RGB', '_RGB32', 'COLOR', ...]
```

### Search for Graphics Functions
```json
{
  "tool": "search_qb64pe_keywords_by_wiki_category",
  "arguments": {
    "category": "Graphics and Imaging:",
    "query": "image"
  }
}
```

### Get Category Overview
```json
{
  "tool": "get_qb64pe_wiki_categories"
}
```

## Future Enhancements

1. **Cross-Category Search**: Search across multiple categories
2. **Category Hierarchy**: Support for subcategories
3. **Usage Statistics**: Track which categories are most requested
4. **Dynamic Categories**: Allow custom category creation
5. **Category Aliases**: Support for alternative category names

## Compatibility

- **Backward Compatible**: All existing tools continue to work
- **Progressive Enhancement**: New features add capabilities without breaking changes
- **Type Safe**: Full TypeScript support for all new functionality
- **Error Resilient**: Graceful degradation if wiki data unavailable

## Technical Notes

- Categories are loaded once during service initialization
- Memory usage increase is minimal (~50KB for category data)
- Search performance optimized for real-time usage
- No external dependencies required

This integration provides a powerful new dimension to keyword discovery and makes the QB64PE MCP server even more useful for developers and AI assistants working with QB64PE code.
