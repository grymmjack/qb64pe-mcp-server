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

### ✅ **Syntax Validation**
- QB64PE-only syntax enforcement (excludes Visual Basic/QBasic constructs)
- Multi-level validation (basic, strict, best-practices)
- Real-time error detection and suggestions
- Code quality scoring (0-100)
- Best practices recommendations

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
- `codeContext` (string, optional): Relevant code context

**Example:**
```json
{
  "issue": "Program crashes when reading file",
  "codeContext": "OPEN \"data.txt\" FOR INPUT AS #1"
}
```

## Available Resources

### 1. `qb64pe://wiki/search`
URI-based access to wiki search functionality.

### 2. `qb64pe://compiler/reference`
Quick reference for all QB64PE compiler options and flags.

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
│   ├── wiki-service.ts   # QB64PE wiki integration
│   ├── compiler-service.ts # Compiler assistance
│   └── syntax-service.ts # Syntax validation
└── types/               # TypeScript type definitions
```

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
  "codeContext": `DIM i AS INTEGER
FOR i = 1 TO 10
    PRINT i
    i = i + 1
NEXT i`
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
