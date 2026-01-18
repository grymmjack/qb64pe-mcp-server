# search_qb64pe_wiki

**Category**: Wiki & Documentation  
**Description**: Search the QB64PE wiki for documentation, tutorials, and reference materials  
**Type**: Documentation Search Tool  

## Overview

The `search_qb64pe_wiki` tool provides comprehensive searching capabilities across the entire QB64PE wiki, including documentation pages, tutorials, examples, and reference materials. This tool is essential for developers seeking detailed information about QB64PE features, syntax, and best practices.

Unlike keyword-specific searches, this tool searches the full content of wiki pages, making it ideal for finding tutorials, detailed explanations, code examples, and comprehensive documentation on specific topics. It's particularly valuable for learning new concepts, troubleshooting issues, and understanding complex QB64PE features.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Comprehensive Documentation Search**: Find detailed explanations and tutorials
- **Example Discovery**: Locate code examples and implementation patterns
- **Troubleshooting Support**: Find solutions to common problems
- **Learning Resource Access**: Access educational content and guides
- **Reference Material Lookup**: Find detailed API documentation and specifications

## Parameters

### Required Parameters

**query** (string)  
Search query for QB64PE wiki content. Can include:
- Function or keyword names (e.g., "_PUTIMAGE", "SCREEN", "TIMER")
- Programming concepts (e.g., "graphics programming", "file handling")
- Specific topics (e.g., "mouse input", "sound effects", "networking")
- Problem descriptions (e.g., "window not responding", "image loading error")

### Optional Parameters

**category** (string)  
Specific category to search within. Available categories:
- `"keywords"` - Language keywords and statements
- `"functions"` - Built-in functions and their usage
- `"statements"` - Programming statements and commands
- `"operators"` - Mathematical and logical operators
- `"data-types"` - Variable types and data structures
- `"tutorials"` - Step-by-step learning guides
- `"examples"` - Code examples and demonstrations
- `"all"` - Search all categories (default)

## Response Structure

The tool returns a structured object containing search results:

```json
{
  "query": "graphics programming",
  "category": "all",
  "totalResults": 25,
  "searchTime": "0.15s",
  "results": [
    {
      "title": "Graphics Programming in QB64PE",
      "url": "https://qb64phoenix.com/qb64wiki/index.php/Graphics_Programming",
      "snippet": "QB64PE provides comprehensive graphics capabilities including drawing primitives, image handling, and advanced rendering features...",
      "category": "tutorials",
      "relevanceScore": 0.95,
      "lastModified": "2024-01-10T15:30:00Z"
    },
    {
      "title": "_PUTIMAGE",
      "url": "https://qb64phoenix.com/qb64wiki/index.php/PUTIMAGE",
      "snippet": "The _PUTIMAGE statement places an image or portion of an image onto another image. Syntax: _PUTIMAGE [STEP][(dx1, dy1)...",
      "category": "keywords",
      "relevanceScore": 0.88,
      "lastModified": "2024-01-08T09:15:00Z"
    }
  ],
  "suggestions": [
    "graphics commands",
    "image handling",
    "drawing functions",
    "screen modes"
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Wiki Search

Search for general information about graphics:

```javascript
const graphicsInfo = await searchQb64peWiki({
  query: "graphics programming"
});

console.log(`Found ${graphicsInfo.totalResults} results`);
graphicsInfo.results.forEach(result => {
  console.log(`${result.title}: ${result.snippet}`);
  console.log(`Category: ${result.category}, Score: ${result.relevanceScore}`);
});
```

### Category-Specific Search

Search for examples in a specific category:

```javascript
const examples = await searchQb64peWiki({
  query: "file handling",
  category: "examples"
});

console.log("File handling examples:");
examples.results.forEach(example => {
  console.log(`${example.title}: ${example.url}`);
});
```

### Tutorial Discovery

Find learning resources:

```javascript
const tutorials = await searchQb64peWiki({
  query: "beginner programming",
  category: "tutorials"
});

console.log("Beginner tutorials:");
tutorials.results.forEach(tutorial => {
  console.log(`${tutorial.title}: ${tutorial.snippet}`);
});
```

### Troubleshooting Search

Find solutions to specific problems:

```javascript
const solutions = await searchQb64peWiki({
  query: "program crashes when loading image"
});

console.log("Potential solutions:");
solutions.results.forEach(solution => {
  console.log(`${solution.title}: ${solution.snippet}`);
});
```

## Integration Workflows

### Learning Assistant

```javascript
class QB64PELearningAssistant {
  async findLearningResources(topic) {
    const [tutorials, examples, references] = await Promise.all([
      searchQb64peWiki({ query: topic, category: "tutorials" }),
      searchQb64peWiki({ query: topic, category: "examples" }),
      searchQb64peWiki({ query: topic, category: "keywords" })
    ]);
    
    return {
      topic,
      tutorials: tutorials.results,
      examples: examples.results,
      references: references.results,
      learningPath: this.generateLearningPath(tutorials.results, examples.results)
    };
  }
  
  generateLearningPath(tutorials, examples) {
    // Sort by complexity and create a suggested learning sequence
    return [...tutorials, ...examples]
      .sort((a, b) => this.getComplexityScore(a) - this.getComplexityScore(b))
      .map(item => ({
        title: item.title,
        url: item.url,
        type: item.category,
        difficulty: this.getDifficultyLevel(item)
      }));
  }
}
```

### Documentation Search Engine

```javascript
class QB64PEDocumentationSearch {
  async searchComprehensive(query) {
    const results = await searchQb64peWiki({ query });
    
    return {
      primary: results.results.filter(r => r.relevanceScore > 0.8),
      secondary: results.results.filter(r => r.relevanceScore > 0.5 && r.relevanceScore <= 0.8),
      related: results.results.filter(r => r.relevanceScore <= 0.5),
      suggestions: results.suggestions
    };
  }
  
  async findByFunction(functionName) {
    const functionResults = await searchQb64peWiki({
      query: functionName,
      category: "functions"
    });
    
    const exampleResults = await searchQb64peWiki({
      query: `${functionName} example`,
      category: "examples"
    });
    
    return {
      function: functionResults.results[0],
      examples: exampleResults.results,
      relatedFunctions: this.extractRelatedFunctions(functionResults.results)
    };
  }
}
```

### Help System Integration

```javascript
class ContextualHelpSystem {
  async getContextualHelp(currentCode, cursorPosition) {
    const currentKeyword = this.extractKeywordAtPosition(currentCode, cursorPosition);
    
    if (currentKeyword) {
      const help = await searchQb64peWiki({
        query: currentKeyword,
        category: "keywords"
      });
      
      return {
        keyword: currentKeyword,
        documentation: help.results[0],
        examples: await this.findExamples(currentKeyword),
        relatedTopics: help.suggestions
      };
    }
    
    return null;
  }
  
  async findExamples(keyword) {
    const examples = await searchQb64peWiki({
      query: `${keyword} example`,
      category: "examples"
    });
    
    return examples.results.map(example => ({
      title: example.title,
      code: this.extractCodeFromSnippet(example.snippet),
      url: example.url
    }));
  }
}
```

## Error Handling

The tool handles various error conditions gracefully:

### Empty Search Results

```javascript
const handleEmptyResults = async (query) => {
  const results = await searchQb64peWiki({ query });
  
  if (results.totalResults === 0) {
    console.log(`No results found for "${query}"`);
    console.log("Suggestions:", results.suggestions.join(", "));
    
    // Try alternative searches
    const alternatives = await Promise.all(
      results.suggestions.map(suggestion => 
        searchQb64peWiki({ query: suggestion })
      )
    );
    
    return alternatives.find(alt => alt.totalResults > 0);
  }
  
  return results;
};
```

### Network Issues

```javascript
const searchWithFallback = async (query, category = "all") => {
  try {
    return await searchQb64peWiki({ query, category });
  } catch (error) {
    console.warn("Wiki search failed, using local cache");
    return await getLocalCachedResults(query, category);
  }
};
```

### Invalid Category

```javascript
const safeSearch = async (query, category) => {
  const validCategories = ["keywords", "functions", "statements", "operators", "data-types", "tutorials", "examples", "all"];
  
  if (category && !validCategories.includes(category)) {
    console.warn(`Invalid category "${category}", using "all"`);
    category = "all";
  }
  
  return await searchQb64peWiki({ query, category });
};
```

## Best Practices

### 1. Query Optimization

Use specific and descriptive queries:

```javascript
// Good: Specific query
const results = await searchQb64peWiki({
  query: "_PUTIMAGE scaling and rotation"
});

// Better: Multiple targeted searches
const [scalingInfo, rotationInfo] = await Promise.all([
  searchQb64peWiki({ query: "_PUTIMAGE scaling" }),
  searchQb64peWiki({ query: "_PUTIMAGE rotation" })
]);
```

### 2. Category Filtering

Use categories to narrow search scope:

```javascript
// For learning
const tutorials = await searchQb64peWiki({
  query: "file operations",
  category: "tutorials"
});

// For reference
const functions = await searchQb64peWiki({
  query: "file operations",
  category: "functions"
});

// For implementation
const examples = await searchQb64peWiki({
  query: "file operations",
  category: "examples"
});
```

### 3. Result Processing

Process results based on relevance and needs:

```javascript
const processSearchResults = (results) => {
  const highRelevance = results.results.filter(r => r.relevanceScore > 0.8);
  const mediumRelevance = results.results.filter(r => r.relevanceScore > 0.5 && r.relevanceScore <= 0.8);
  
  return {
    primary: highRelevance.slice(0, 3), // Top 3 most relevant
    secondary: mediumRelevance.slice(0, 5), // Top 5 moderately relevant
    suggestions: results.suggestions
  };
};
```

### 4. Caching and Performance

Implement intelligent caching:

```javascript
class WikiSearchCache {
  constructor() {
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
  }
  
  async search(query, category = "all") {
    const cacheKey = `${query}:${category}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const results = await searchQb64peWiki({ query, category });
    
    this.cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
    
    // Cleanup old entries
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    return results;
  }
}
```

## Cross-References

- **[search_qb64pe_keywords_by_wiki_category](./search_qb64pe_keywords_by_wiki_category.md)** - Category-specific keyword searching
- **[get_qb64pe_page](./get_qb64pe_page.md)** - Retrieve specific wiki pages
- **[search_qb64pe_keywords](./search_qb64pe_keywords.md)** - General keyword searching
- **[lookup_qb64pe_keyword](./lookup_qb64pe_keyword.md)** - Individual keyword details
- **[get_qb64pe_wiki_categories](./get_qb64pe_wiki_categories.md)** - Available categories

## See Also

- [QB64PE Wiki Integration Guide](../docs/WIKI_CATEGORY_INTEGRATION.md)
- [QB64PE Documentation Access](../docs/GRAPHICS_GUIDE_ACCESS.md)
- [LLM Usage Guide](../docs/LLM_USAGE_GUIDE.md)
