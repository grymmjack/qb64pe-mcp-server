# QB64PE MCP Server

A comprehensive Model Context Protocol (MCP) server that provides advanced QB64PE (QBasic 64 Phoenix Edition) programming assistance. This server enables AI assistants to search the QB64PE wiki, understand compiler options, provide debugging help, validate QB64PE-only syntax, and handle cross-platform differences.

## Features

### 🔍 **Wiki Integration**
- Search the official QB64PE wiki (https://qb64phoenix.com/qb64wiki/)
- Retrieve complete page content with formatted examples
- Intelligent caching system for improved performance
- Fallback search mechanisms for comprehensive results

### 🛠️ **Compiler Assistance**
- Complete QB64PE compiler options reference (-c, -x, -o, -z, -g, -w)
- Platform-specific compilation guidance (Windows, macOS, Linux)
- Optimization recommendations and build strategies
- Cross-platform compatibility insights

### 🐛 **Debugging Support**
- PRINT statement debugging techniques
- $CONSOLE output management
- File-based logging strategies
- Error handling best practices
- Step-by-step execution guidance

### ✅ **Syntax Validation & Compatibility**
- QB64PE-only syntax enforcement (excludes Visual Basic/QBasic constructs)
- Comprehensive compatibility validation with detailed issue reporting
- Multi-level validation (basic, strict, best-practices)
- Real-time error detection and suggestions
- Code quality scoring (0-100)
- Cross-platform compatibility checking
- Legacy BASIC keyword detection
- Platform-specific function warnings
- **Variable scoping validation** (DIM SHARED, scope access issues)
- **Dynamic array directive checking** ($DYNAMIC usage)
- **SHARED keyword syntax validation**
- **Variable shadowing detection**

### 🔧 **Variable Scoping Assistant**
- **DIM SHARED usage validation** - Ensures variables are properly shared across procedures
- **$DYNAMIC directive checking** - Validates dynamic array declarations
- **Scope access analysis** - Detects variables accessed without proper SHARED declaration
- **Variable shadowing warnings** - Identifies local variables that may shadow global ones
- **Best practices guidance** - Recommends proper variable scoping techniques
- **Real-world examples** - Provides correct and incorrect usage patterns

### 🔍 **Compatibility Knowledge Base**
- Extensive compatibility issue database
- Searchable solutions and workarounds
- Pattern-based code analysis
- Best practices guidance
- Debugging techniques specific to QB64PE
- Platform compatibility matrix (Windows/Linux/macOS)

### 📖 **Keywords Reference System**
- Complete QB64PE keywords database (800+ keywords)
- Smart categorization (statements, functions, operators, metacommands, OpenGL, types, legacy)
- Real-time keyword validation with intelligent suggestions
- Autocomplete support for partial keywords
- Full-text search across keyword definitions and examples
- Version compatibility checking (QBasic vs QB64 vs QB64PE)
- Platform availability information
- Syntax examples and related keyword suggestions

### 📚 **Resources & Prompts**
- Quick access to QB64PE compiler reference
- Common syntax patterns and examples
- Code review templates with focus areas
- Getting started guides and tutorials

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup
1. Clone the repository:
```bash
git clone <your-repo-url>
cd qb64pe-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the MCP server:
```bash
npm start
```

The server will output: `QB64PE MCP Server started successfully`

## Usage

### As an MCP Server

This server implements the Model Context Protocol and can be used with any MCP-compatible AI assistant or application.

#### Configuration for Claude Desktop

Add this configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "qb64pe": {
      "command": "node",
      "args": ["path/to/qb64pe-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

#### Configuration for Other MCP Clients

Use the standard MCP connection format:
- **Transport**: stdio
- **Command**: `node build/index.js`
- **Working Directory**: Path to this project

## Available Tools

### 1. `search_qb64pe_wiki`
Search the QB64PE wiki for information about functions, statements, and concepts.

**Arguments:**
- `query` (string): Search terms
- `maxResults` (number, optional): Maximum results to return (default: 5)

**Example:**
```json
{
  "query": "_RGB32 color functions",
  "maxResults": 3
}
```

### 2. `get_qb64pe_page`
Retrieve the complete content of a specific QB64PE wiki page.

**Arguments:**
- `pageTitle` (string): Exact title of the wiki page

**Example:**
```json
{
  "pageTitle": "_RGB32"
}
```

### 3. `get_compiler_options`
Get detailed information about QB64PE compiler options and usage.

**Arguments:**
- `option` (string, optional): Specific compiler option to learn about
- `platform` (string, optional): Target platform (windows, macos, linux)

**Example:**
```json
{
  "option": "-c",
  "platform": "windows"
}
```

### 4. `validate_qb64pe_syntax`
Validate QB64PE code syntax and get improvement suggestions.

**Arguments:**
- `code` (string): QB64PE code to validate
- `checkLevel` (string, optional): Validation level (basic, strict, best-practices)

**Example:**
```json
{
  "code": "PRINT \"Hello World\"\\nINPUT \"Your name: \", name$",
  "checkLevel": "strict"
}
```

### 5. `get_debugging_help`
Get help with debugging QB64PE programs.

**Arguments:**
- `issue` (string): Description of the debugging issue
- `platform` (string, optional): Target platform

**Example:**
```json
{
  "issue": "Program crashes when reading file",
  "platform": "windows"
}
```

### 6. `validate_qb64pe_compatibility`
Check code for QB64PE compatibility issues with detailed solutions.

**Arguments:**
- `code` (string): QB64PE code to check for compatibility issues
- `platform` (string, optional): Target platform (windows, macos, linux, all)

**Example:**
```json
{
  "code": "FUNCTION Test(x AS INTEGER) AS INTEGER\\n    Test = x * 2\\nEND FUNCTION",
  "platform": "all"
}
```

### 7. `search_qb64pe_compatibility`
Search for compatibility issues, solutions, and best practices.

**Arguments:**
- `query` (string): Search query for compatibility knowledge
- `category` (string, optional): Specific compatibility category

**Categories:**
- `function_return_types`: Function declaration issues
- `console_directives`: Console mode problems
- `multi_statement_lines`: Multi-statement syntax issues
- `array_declarations`: Array declaration limitations
- `missing_functions`: Non-existent functions
- `legacy_keywords`: Unsupported legacy keywords
- `device_access`: Hardware/device access issues
- `platform_specific`: Platform compatibility
- `best_practices`: Coding guidelines
- `debugging`: Debugging techniques

**Example:**
```json
{
  "query": "function return type sigil",
  "category": "function_return_types"
}
```

### 8. `get_qb64pe_best_practices`
Get best practices and coding guidelines for QB64PE development.

**Arguments:**
- `topic` (string, optional): Specific topic for best practices

**Topics:**
- `syntax`: Language syntax guidelines
- `debugging`: Debugging best practices
- `performance`: Performance optimization
- `cross_platform`: Cross-platform development
- `code_organization`: Code structure and organization

**Example:**
```json
{
  "topic": "debugging"
}
```

### 9. `lookup_qb64pe_keyword`
Get detailed information about a specific QB64PE keyword.

**Arguments:**
- `keyword` (string): The QB64PE keyword to look up

**Example:**
```json
{
  "keyword": "PRINT"
}
```

### 10. `autocomplete_qb64pe_keywords`
Get autocomplete suggestions for QB64PE keywords.

**Arguments:**
- `prefix` (string): The partial keyword to autocomplete
- `maxResults` (number, optional): Maximum number of suggestions (default: 10)

**Example:**
```json
{
  "prefix": "_MOU",
  "maxResults": 5
}
```

### 11. `get_qb64pe_keywords_by_category`
Get all keywords in a specific category.

**Arguments:**
- `category` (string): The keyword category to retrieve

**Categories:**
- `statements`: QB64PE statements that perform actions
- `functions`: QB64PE functions that return values
- `operators`: Mathematical and logical operators
- `metacommands`: Compiler directives starting with $
- `opengl`: OpenGL graphics functions and statements
- `types`: Data types and type suffixes
- `constants`: Built-in constants and literals
- `legacy`: Legacy QBasic keywords and compatibility items

**Example:**
```json
{
  "category": "functions"
}
```

### 12. `search_qb64pe_keywords`
Search for QB64PE keywords by name, description, or functionality.

**Arguments:**
- `query` (string): Search query for keywords
- `maxResults` (number, optional): Maximum number of results (default: 20)

**Example:**
```json
{
  "query": "mouse position",
  "maxResults": 10
}
```

## Available Resources

### 1. `qb64pe://wiki/search`
URI-based access to wiki search functionality.

### 2. `qb64pe://compiler/reference`
Quick reference for all QB64PE compiler options and flags.

### 3. `qb64pe://compatibility/`
Comprehensive compatibility documentation and issue solutions.

### 4. `qb64pe://keywords/`
Complete QB64PE keywords reference with categorization and search.

### 5. `qb64pe://keywords/category/{category}`
Keywords filtered by specific category (statements, functions, operators, etc.).

### 6. `qb64pe://keywords/detail/{keyword}`
Detailed information about a specific QB64PE keyword.

## Available Prompts

### 1. `review-qb64pe-code`
Template for comprehensive QB64PE code review.

**Arguments:**
- `code` (string): QB64PE code to review
- `focusAreas` (string, optional): Comma-separated focus areas

**Focus Areas:**
- `syntax`: Language syntax and structure
- `performance`: Optimization opportunities
- `best-practices`: Code quality and maintainability
- `cross-platform`: Platform compatibility
- `debugging`: Debugging and troubleshooting

## Architecture

### Core Components

- **MCP Server**: Main server handling tool/resource registration
- **Wiki Service**: QB64PE wiki integration with caching
- **Compiler Service**: Compiler options and platform guidance  
- **Syntax Service**: QB64PE syntax validation and analysis
- **Compatibility Service**: Compatibility knowledge and validation
- **Search Service**: Semantic search across compatibility content

### Service Details

#### Wiki Service (`WikiService`)
- Searches QB64PE wiki using MediaWiki API
- Extracts and formats page content
- Caches results for performance
- Provides fallback search mechanisms

#### Compiler Service (`CompilerService`)
- Comprehensive compiler option database
- Platform-specific compilation instructions
- Debugging technique recommendations
- Cross-platform development guidance

#### Syntax Service (`QB64PESyntaxService`)
- Multi-level syntax validation
- QB64PE-only syntax enforcement
- Error detection and correction suggestions
- Code quality scoring system
- Compatibility issue detection

#### Compatibility Service (`QB64PECompatibilityService`)
- Comprehensive compatibility validation
- Knowledge base search and retrieval
- Best practices guidance
- Platform compatibility checking
- Legacy keyword detection
- Function return type validation

#### Search Service (`CompatibilitySearchService`)
- Full-text search indexing
- Term-based relevance scoring
- Category and tag filtering
- Semantic search capabilities

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

### Code Structure
```
src/
├── index.ts              # Main MCP server
├── services/
│   ├── wiki-service.ts      # QB64PE wiki integration
│   ├── compiler-service.ts  # Compiler assistance
│   ├── syntax-service.ts    # Syntax validation
│   ├── compatibility-service.ts # Compatibility validation
│   ├── keywords-service.ts  # Keywords reference and validation
│   └── search-service.ts    # Search indexing
├── data/
│   ├── compatibility-rules.json # Structured compatibility rules
│   └── keywords-data.json   # Enhanced keywords database
└── types/                   # TypeScript type definitions
```

## Documentation

- [Compatibility Integration Guide](./docs/COMPATIBILITY_INTEGRATION.md) - Detailed documentation of the compatibility validation system
- [Keywords Integration Guide](./docs/KEYWORDS_INTEGRATION.md) - Comprehensive guide to the keywords reference system
- [Variable Scoping Rules](./docs/VARIABLE_SCOPING_RULES.md) - Complete guide to DIM SHARED, $DYNAMIC, and variable scoping
- [QB64PE Official Wiki](https://qb64phoenix.com/qb64wiki/) - Official QB64PE documentation

## Examples

### Example 1: Search for Graphics Functions
```javascript
// Using the search_qb64pe_wiki tool
{
  "query": "_PUTIMAGE graphics drawing",
  "maxResults": 3
}
```

### Example 2: Validate Code Syntax
```javascript
// Using the validate_qb64pe_syntax tool
{
  "code": `DIM x AS INTEGER
FOR x = 1 TO 10
    PRINT "Number: "; x
NEXT x`,
  "checkLevel": "best-practices"
}
```

### Example 3: Get Debugging Help
```javascript
// Using the get_debugging_help tool
{
  "issue": "Variables showing wrong values in loop",
  "platform": "windows"
}
```

### Example 4: Check Compatibility Issues
```javascript
// Using the validate_qb64pe_compatibility tool
{
  "code": "FUNCTION Test(x AS INTEGER) AS INTEGER\\n    Test = x * 2\\nEND FUNCTION",
  "platform": "all"
}
```

### Example 5: Search Compatibility Knowledge
```javascript
// Using the search_qb64pe_compatibility tool
{
  "query": "console directive",
  "category": "console_directives"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Build and test: `npm run build && npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- QB64PE Official Website: https://qb64phoenix.com/
- QB64PE Wiki: https://qb64phoenix.com/qb64wiki/
- QB64PE Forum: https://qb64phoenix.com/forum/

## Changelog

### v1.0.0
- Initial release
- Wiki search and page retrieval
- Compiler options reference
- Syntax validation system
- Debugging assistance tools
- Cross-platform support guidance
- **NEW**: Comprehensive compatibility validation
- **NEW**: Compatibility knowledge base with search
- **NEW**: Best practices guidance system
- **NEW**: Platform-specific compatibility checking
- **NEW**: Legacy BASIC keyword detection
- **NEW**: Function return type validation
- **NEW**: Variable scoping validation (DIM SHARED, SHARED syntax)
- **NEW**: Dynamic array directive checking ($DYNAMIC)
- **NEW**: Variable accessibility analysis
- **NEW**: Variable shadowing detection
- **NEW**: Scope-specific debugging guidance
