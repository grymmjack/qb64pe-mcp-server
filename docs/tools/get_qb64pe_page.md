# get_qb64pe_page

**Category**: Wiki & Documentation  
**Description**: Retrieve detailed content from a specific QB64PE wiki page  
**Type**: Content Retrieval Tool  

## Overview

The `get_qb64pe_page` tool provides direct access to specific QB64PE wiki pages, retrieving complete content including detailed documentation, syntax information, examples, and related materials. This tool is essential when you know the exact page you need or want comprehensive information about a specific QB64PE feature.

Unlike search tools that return summaries, this tool retrieves the full content of individual wiki pages, making it ideal for in-depth reference, detailed syntax study, and accessing comprehensive documentation for specific keywords, functions, or concepts.

## Purpose

This tool serves multiple critical functions in QB64PE development:

- **Complete Documentation Access**: Retrieve full page content for thorough reference
- **Syntax Reference**: Access detailed syntax information and parameter descriptions
- **Example Collection**: Gather comprehensive code examples and demonstrations
- **Learning Support**: Access complete tutorials and educational content
- **API Documentation**: Retrieve detailed function and keyword specifications

## Parameters

### Required Parameters

**pageTitle** (string)  
Title or URL of the QB64PE wiki page to retrieve. Can be specified in multiple formats:
- **Exact page title**: "PRINT", "_PUTIMAGE", "SCREEN"
- **URL fragment**: "PUTIMAGE", "File_Input_and_Output"
- **Full URL**: "https://qb64phoenix.com/qb64wiki/index.php/PUTIMAGE"
- **Case-insensitive**: "print", "Print", "PRINT" (all valid)

### Optional Parameters

**includeExamples** (boolean)  
Whether to include code examples in the response (default: true). Set to false for faster retrieval when examples are not needed.

## Response Structure

The tool returns a comprehensive object containing the complete page content:

```json
{
  "title": "_PUTIMAGE",
  "url": "https://qb64phoenix.com/qb64wiki/index.php/PUTIMAGE",
  "category": "Graphics and Imaging",
  "description": "Places an image or portion of an image onto another image",
  "syntax": "_PUTIMAGE [STEP][(dx1, dy1)[-STEP][(dx2, dy2)]], source&[, destination&][, ][STEP][(sx1, sy1)[-STEP][(sx2, sy2)]]",
  "parameters": [
    {
      "name": "dx1, dy1",
      "type": "SINGLE",
      "description": "The destination coordinates to place the image",
      "optional": true
    },
    {
      "name": "source&",
      "type": "LONG",
      "description": "The image handle of the source image",
      "optional": false
    }
  ],
  "examples": [
    {
      "title": "Basic Image Display",
      "code": "SCREEN _NEWIMAGE(800, 600, 32)\nimg& = _LOADIMAGE(\"picture.png\")\n_PUTIMAGE (100, 100), img&\n_FREEIMAGE img&",
      "description": "Loads and displays an image at position 100,100"
    }
  ],
  "relatedPages": [
    "_LOADIMAGE",
    "_FREEIMAGE",
    "_NEWIMAGE",
    "SCREEN"
  ],
  "seeAlso": [
    "Graphics Programming Tutorial",
    "Image Handling Guide"
  ],
  "lastModified": "2024-01-10T15:30:00Z",
  "wordCount": 1250,
  "content": "Full page content in HTML format...",
  "plainText": "Full page content in plain text format...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Page Retrieval

Get complete documentation for a specific keyword:

```javascript
const putimageDoc = await getQb64pePage({
  pageTitle: "_PUTIMAGE",
  includeExamples: true
});

console.log(`${putimageDoc.title}: ${putimageDoc.description}`);
console.log(`Syntax: ${putimageDoc.syntax}`);
console.log(`Examples: ${putimageDoc.examples.length}`);
```

### Multiple Page Retrieval

Get documentation for related functions:

```javascript
const imagePages = await Promise.all([
  getQb64pePage({ pageTitle: "_PUTIMAGE" }),
  getQb64pePage({ pageTitle: "_LOADIMAGE" }),
  getQb64pePage({ pageTitle: "_FREEIMAGE" })
]);

const imageReference = {
  putimage: imagePages[0],
  loadimage: imagePages[1],
  freeimage: imagePages[2]
};

console.log("Complete image handling reference compiled");
```

### Tutorial Content Retrieval

Access comprehensive tutorial content:

```javascript
const tutorial = await getQb64pePage({
  pageTitle: "Graphics Programming Tutorial"
});

console.log(`Tutorial: ${tutorial.title}`);
console.log(`Word count: ${tutorial.wordCount}`);
console.log(`Examples included: ${tutorial.examples.length}`);
```

### Quick Syntax Reference

Get syntax without examples for faster retrieval:

```javascript
const quickRef = await getQb64pePage({
  pageTitle: "PRINT",
  includeExamples: false
});

console.log(`${quickRef.title}: ${quickRef.syntax}`);
quickRef.parameters.forEach(param => {
  console.log(`  ${param.name}: ${param.description}`);
});
```

## Integration Workflows

### Documentation Builder

```javascript
class QB64PEDocumentationBuilder {
  async buildFunctionReference(functionNames) {
    const pages = await Promise.all(
      functionNames.map(name => getQb64pePage({ pageTitle: name }))
    );
    
    return {
      functions: pages.map(page => ({
        name: page.title,
        syntax: page.syntax,
        description: page.description,
        parameters: page.parameters,
        examples: this.selectBestExamples(page.examples),
        relatedFunctions: page.relatedPages
      })),
      crossReferences: this.buildCrossReferences(pages),
      generated: new Date().toISOString()
    };
  }
  
  selectBestExamples(examples) {
    // Select most relevant examples based on complexity and clarity
    return examples
      .sort((a, b) => this.getExampleQuality(b) - this.getExampleQuality(a))
      .slice(0, 3);
  }
  
  buildCrossReferences(pages) {
    const references = new Map();
    
    pages.forEach(page => {
      page.relatedPages.forEach(related => {
        if (!references.has(related)) {
          references.set(related, []);
        }
        references.get(related).push(page.title);
      });
    });
    
    return Object.fromEntries(references);
  }
}
```

### Interactive Help System

```javascript
class InteractiveHelpSystem {
  async getDetailedHelp(keyword) {
    const page = await getQb64pePage({ pageTitle: keyword });
    
    return {
      summary: this.createSummary(page),
      syntaxHelp: this.createSyntaxHelp(page),
      examples: this.createInteractiveExamples(page.examples),
      relatedTopics: page.relatedPages,
      quickReference: this.createQuickReference(page)
    };
  }
  
  createSummary(page) {
    return {
      name: page.title,
      purpose: page.description,
      category: page.category,
      complexity: this.assessComplexity(page)
    };
  }
  
  createSyntaxHelp(page) {
    return {
      syntax: page.syntax,
      parameters: page.parameters.map(param => ({
        name: param.name,
        required: !param.optional,
        type: param.type,
        description: param.description,
        example: this.generateParameterExample(param)
      }))
    };
  }
  
  createInteractiveExamples(examples) {
    return examples.map(example => ({
      title: example.title,
      code: example.code,
      explanation: this.generateExplanation(example.code),
      variations: this.generateVariations(example.code)
    }));
  }
}
```

### Code Completion Engine

```javascript
class CodeCompletionEngine {
  async enhanceCompletion(keyword) {
    const page = await getQb64pePage({ pageTitle: keyword });
    
    return {
      insertText: this.generateInsertText(page.syntax),
      documentation: {
        summary: page.description,
        syntax: page.syntax,
        parameters: page.parameters
      },
      snippets: this.generateSnippets(page.examples),
      relatedCompletions: await this.getRelatedCompletions(page.relatedPages)
    };
  }
  
  generateInsertText(syntax) {
    // Convert syntax to VS Code snippet format
    return syntax.replace(/\[([^\]]+)\]/g, '${1:$1}')
                 .replace(/(\w+)&/g, '${2:$1}');
  }
  
  generateSnippets(examples) {
    return examples.map((example, index) => ({
      label: `${example.title} Example`,
      insertText: this.formatAsSnippet(example.code),
      description: example.description
    }));
  }
  
  async getRelatedCompletions(relatedPages) {
    const related = await Promise.all(
      relatedPages.slice(0, 5).map(async (page) => {
        try {
          const pageData = await getQb64pePage({ 
            pageTitle: page, 
            includeExamples: false 
          });
          return {
            name: pageData.title,
            description: pageData.description,
            syntax: pageData.syntax
          };
        } catch (error) {
          return null;
        }
      })
    );
    
    return related.filter(item => item !== null);
  }
}
```

## Error Handling

The tool handles various error conditions gracefully:

### Page Not Found

```javascript
const safeGetPage = async (pageTitle) => {
  try {
    return await getQb64pePage({ pageTitle });
  } catch (error) {
    if (error.message.includes('not found')) {
      console.log(`Page "${pageTitle}" not found. Searching for similar pages...`);
      
      // Try alternative searches
      const alternatives = await searchQb64peWiki({ 
        query: pageTitle, 
        category: "keywords" 
      });
      
      if (alternatives.results.length > 0) {
        console.log("Did you mean:", alternatives.results[0].title);
        return await getQb64pePage({ pageTitle: alternatives.results[0].title });
      }
    }
    throw error;
  }
};
```

### Network Issues

```javascript
const getPageWithRetry = async (pageTitle, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await getQb64pePage({ pageTitle });
    } catch (error) {
      if (i === retries - 1) {
        // Last attempt failed, try cache
        const cached = await getCachedPage(pageTitle);
        if (cached) {
          console.warn(`Using cached version of ${pageTitle}`);
          return cached;
        }
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Invalid Page Titles

```javascript
const normalizePageTitle = (title) => {
  // Handle common variations
  const normalizations = {
    'putimage': '_PUTIMAGE',
    'loadimage': '_LOADIMAGE',
    'freeimage': '_FREEIMAGE',
    'newimage': '_NEWIMAGE'
  };
  
  const lower = title.toLowerCase();
  return normalizations[lower] || title;
};

const getPageNormalized = async (pageTitle) => {
  const normalized = normalizePageTitle(pageTitle);
  return await getQb64pePage({ pageTitle: normalized });
};
```

## Best Practices

### 1. Page Title Optimization

Use consistent and accurate page titles:

```javascript
// Good: Use exact wiki page titles
const page = await getQb64pePage({ pageTitle: "_PUTIMAGE" });

// Better: Normalize input for user convenience
const normalizedTitle = normalizePageTitle(userInput);
const page = await getQb64pePage({ pageTitle: normalizedTitle });
```

### 2. Selective Content Loading

Use includeExamples parameter strategically:

```javascript
// For quick reference
const quickRef = await getQb64pePage({ 
  pageTitle: "PRINT",
  includeExamples: false 
});

// For comprehensive study
const fullDoc = await getQb64pePage({ 
  pageTitle: "PRINT",
  includeExamples: true 
});
```

### 3. Batch Processing

Efficiently retrieve multiple pages:

```javascript
const getMultiplePages = async (pageTitles) => {
  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < pageTitles.length; i += batchSize) {
    const batch = pageTitles.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(title => getQb64pePage({ pageTitle: title }))
    );
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < pageTitles.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};
```

### 4. Intelligent Caching

Implement smart caching strategies:

```javascript
class PageCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50;
    this.ttl = 30 * 60 * 1000; // 30 minutes
  }
  
  async getPage(pageTitle, includeExamples = true) {
    const cacheKey = `${pageTitle}:${includeExamples}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    const fresh = await getQb64pePage({ pageTitle, includeExamples });
    
    this.cache.set(cacheKey, {
      data: fresh,
      timestamp: Date.now()
    });
    
    // Cleanup old entries
    if (this.cache.size > this.maxSize) {
      const oldestEntry = Array.from(this.cache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0];
      this.cache.delete(oldestEntry[0]);
    }
    
    return fresh;
  }
}
```

## Cross-References

- **[search_qb64pe_wiki](./search_qb64pe_wiki.md)** - Search wiki content
- **[search_qb64pe_keywords_by_wiki_category](./search_qb64pe_keywords_by_wiki_category.md)** - Category-specific searching
- **[lookup_qb64pe_keyword](./lookup_qb64pe_keyword.md)** - Individual keyword lookup
- **[search_qb64pe_keywords](./search_qb64pe_keywords.md)** - General keyword searching
- **[get_qb64pe_wiki_categories](./get_qb64pe_wiki_categories.md)** - Available categories

## See Also

- [QB64PE Wiki Integration Guide](../docs/WIKI_CATEGORY_INTEGRATION.md)
- [QB64PE Documentation Access](../docs/GRAPHICS_GUIDE_ACCESS.md)
- [LLM Usage Guide](../docs/LLM_USAGE_GUIDE.md)
