# get_qb64pe_wiki_categories

## Overview
The `get_qb64pe_wiki_categories` tool retrieves all available QB64PE wiki keyword categories with keyword counts, providing an organized overview of the QB64PE documentation structure.

## Purpose
- **Category Discovery**: Find all available functional categories in QB64PE
- **Documentation Navigation**: Understand the organization of QB64PE wiki
- **Keyword Statistics**: See how many keywords exist in each category
- **Learning Path**: Identify areas of QB64PE to explore and learn

## Parameters
This tool takes no parameters and returns all available categories.

## Response Structure

### Categories Object
```json
{
  "categories": {
    "categoryName": number
  },
  "totalCategories": number,
  "totalKeywords": number
}
```

## Usage Examples

### Browse All Categories
```javascript
const categories = await mcp.call("get_qb64pe_wiki_categories");

console.log(`Total Categories: ${categories.totalCategories}`);
console.log(`Total Keywords: ${categories.totalKeywords}`);

console.log("\nCategories by keyword count:");
Object.entries(categories.categories)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} keywords`);
  });
```

### Find Largest Categories
```javascript
const categories = await mcp.call("get_qb64pe_wiki_categories");

const sortedCategories = Object.entries(categories.categories)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10);

console.log("Top 10 categories by keyword count:");
sortedCategories.forEach(([category, count], index) => {
  console.log(`${index + 1}. ${category}: ${count} keywords`);
});
```

## Response Example

```json
{
  "categories": {
    "Graphics and Imaging": 45,
    "String Text Manipulation and Conversion": 38,
    "Mathematical Functions and Operations": 32,
    "File Input and Output": 28,
    "Program Flow and Loops": 25,
    "Keyboard Input": 22,
    "Colors and Transparency": 20,
    "Arrays and Data Storage": 18,
    "Sounds and Music": 15,
    "Mouse Input": 12
  },
  "totalCategories": 34,
  "totalKeywords": 980
}
```

## Related Tools

### Category Exploration
- **`search_qb64pe_keywords_by_wiki_category`**: Search keywords within specific categories
- **`get_qb64pe_keywords_by_category`**: Get keywords by basic categories
- **`search_qb64pe_wiki`**: Search QB64PE wiki content

### Keyword Discovery
- **`search_qb64pe_keywords`**: Search for keywords by name or function
- **`lookup_qb64pe_keyword`**: Get detailed information about specific keywords

## Integration Workflows

### Learning Path Generator
```javascript
const categories = await mcp.call("get_qb64pe_wiki_categories");

// Suggest learning path based on category sizes
const learningPath = Object.entries(categories.categories)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([category, count]) => ({
    category,
    keywords: count,
    priority: count > 20 ? "High" : "Medium"
  }));

console.log("Suggested Learning Path:");
learningPath.forEach((item, index) => {
  console.log(`${index + 1}. ${item.category} (${item.keywords} keywords, ${item.priority} priority)`);
});
```

## Best Practices

### Category Navigation
- **Start with Large Categories**: Focus on categories with many keywords
- **Explore by Interest**: Choose categories relevant to your projects
- **Systematic Learning**: Work through categories methodically
- **Cross-Reference**: Compare with basic keyword categories

---

**See Also:**
- [Search QB64PE Keywords by Wiki Category](./search_qb64pe_keywords_by_wiki_category.md) - Search within categories
- [Get QB64PE Keywords by Category](./get_qb64pe_keywords_by_category.md) - Browse basic categories
- [Search QB64PE Wiki](./search_qb64pe_wiki.md) - Search wiki content
