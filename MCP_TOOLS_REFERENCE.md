# QB64PE MCP Server - Exposed Tools Reference

## Overview

The QB64PE MCP Server exposes **52 tools** organized into **12 functional categories** through the Model Context Protocol (MCP). External systems (like Claude Desktop, AI assistants, or other MCP clients) can call these tools to get QB64PE programming assistance.

## How MCP Works

The server implements the [Model Context Protocol](https://modelcontextprotocol.io/) which allows:

- **Tool Discovery**: Clients can query available tools
- **Schema Validation**: Each tool has a defined input schema (using Zod)
- **Structured Responses**: Tools return JSON responses with text content
- **Error Handling**: Standardized error responses

## Exposed Tools by Category

### 📖 Wiki & Documentation (3 tools)

| Tool Name                    | Description                      | Key Parameters      |
| ---------------------------- | -------------------------------- | ------------------- |
| `search_qb64pe_wiki`         | Search the QB64PE wiki           | `query` (string)    |
| `get_qb64pe_page`            | Get specific wiki page content   | `pageName` (string) |
| `get_qb64pe_wiki_categories` | List all wiki keyword categories | None                |

**Use Cases:**

- Finding documentation for specific keywords
- Browsing available reference materials
- Discovering QB64PE features

---

### 🔤 Keyword Tools (5 tools)

| Tool Name                                 | Description                      | Key Parameters        |
| ----------------------------------------- | -------------------------------- | --------------------- |
| `lookup_qb64pe_keyword`                   | Get detailed keyword information | `keyword` (string)    |
| `autocomplete_qb64pe_keywords`            | Autocomplete partial keywords    | `partial` (string)    |
| `get_qb64pe_keywords_by_category`         | Get keywords by category         | `category` (string)   |
| `search_qb64pe_keywords`                  | Search keywords by text          | `searchText` (string) |
| `search_qb64pe_keywords_by_wiki_category` | Search by wiki category          | `category` (string)   |

**Use Cases:**

- Code completion suggestions
- Finding appropriate statements/functions
- Learning available QB64PE features

---

### 🛠️ Compiler Tools (3 tools)

| Tool Name                | Description                       | Key Parameters                |
| ------------------------ | --------------------------------- | ----------------------------- |
| `get_compiler_options`   | Get compiler command-line options | `optionName` (optional)       |
| `validate_qb64pe_syntax` | Validate QB64PE code syntax       | `code` (string), `checkLevel` |
| `get_debugging_help`     | Get debugging guidance            | `issue` (string)              |

**Use Cases:**

- Configuring compilation
- Validating code before compilation
- Getting compiler-specific help

---

### ✅ Compatibility Tools (3 tools)

| Tool Name                       | Description                    | Key Parameters               |
| ------------------------------- | ------------------------------ | ---------------------------- |
| `validate_qb64pe_compatibility` | Check code compatibility       | `code` (string), `platform`  |
| `search_qb64pe_compatibility`   | Search compatibility knowledge | `query` (string), `category` |
| `get_qb64pe_best_practices`     | Get best practices             | `topic` (optional)           |

**Use Cases:**

- Cross-platform compatibility checking
- Finding platform-specific issues
- Learning best practices

---

### ⚙️ Execution & Monitoring (7 tools)

| Tool Name                              | Description                   | Key Parameters             |
| -------------------------------------- | ----------------------------- | -------------------------- |
| `analyze_qb64pe_execution_mode`        | Analyze graphics/console mode | `code` (string)            |
| `get_process_monitoring_commands`      | Get OS monitoring commands    | `platform`, `processId`    |
| `generate_monitoring_template`         | Generate monitoring template  | `includeScreenshots`, etc. |
| `generate_console_formatting_template` | Generate console template     | `includeTimestamps`, etc.  |
| `get_execution_monitoring_guidance`    | Get monitoring guidance       | `scenario` (string)        |
| `parse_console_output`                 | Parse structured output       | `consoleOutput` (string)   |
| `get_file_monitoring_commands`         | Get file monitoring commands  | `platform`, `filePath`     |

**Use Cases:**

- Monitoring running programs
- Capturing program output
- Debugging long-running processes

---

### 💾 Installation Tools (5 tools)

| Tool Name                             | Description                   | Key Parameters           |
| ------------------------------------- | ----------------------------- | ------------------------ |
| `detect_qb64pe_installation`          | Detect QB64PE installation    | `searchPaths` (optional) |
| `get_qb64pe_path_config`              | Get PATH configuration guide  | `installPath` (optional) |
| `validate_qb64pe_path`                | Validate installation path    | `testPath` (string)      |
| `generate_qb64pe_installation_report` | Generate install report       | None                     |
| `get_qb64pe_installation_guidance`    | Get LLM installation guidance | None                     |

**Use Cases:**

- Finding QB64PE installation
- Setting up development environment
- Troubleshooting installation issues

---

### 🔄 Porting Tools (3 tools)

| Tool Name                      | Description                | Key Parameters               |
| ------------------------------ | -------------------------- | ---------------------------- |
| `port_qbasic_to_qb64pe`        | Port QBasic code to QB64PE | `code`, `dialect`, `options` |
| `get_porting_dialect_info`     | Get dialect information    | `dialect` (string or "all")  |
| `analyze_qbasic_compatibility` | Analyze porting complexity | `code`, `sourceDialect`      |

**Use Cases:**

- Automatically converting QBasic code
- Understanding porting requirements
- Estimating porting effort

---

### 🎨 Graphics & Screenshots (11 tools)

| Tool Name                               | Description                      | Key Parameters                   |
| --------------------------------------- | -------------------------------- | -------------------------------- |
| `analyze_qb64pe_graphics_screenshot`    | Analyze screenshot for debugging | `screenshotPath`, `analysisType` |
| `generate_screenshot_analysis_template` | Generate analysis template       | `mode`                           |
| `capture_qb64pe_screenshot`             | Capture QB64PE window            | `processId`, `outputPath`        |
| `get_qb64pe_processes`                  | List QB64PE processes            | None                             |
| `start_screenshot_monitoring`           | Start auto-capture monitoring    | `processId`, `interval`          |
| `stop_screenshot_monitoring`            | Stop monitoring                  | None                             |
| `start_screenshot_watching`             | Start file watching              | `directory`                      |
| `stop_screenshot_watching`              | Stop watching                    | None                             |
| `get_screenshot_analysis_history`       | Get analysis history             | None                             |
| `get_screenshot_automation_status`      | Get automation status            | None                             |
| `get_qb64pe_graphics_guide`             | Get graphics programming guide   | None                             |
| `generate_qb64pe_echo_functions`        | Generate ECHO helpers            | None                             |

**Use Cases:**

- Automated visual debugging
- Screenshot analysis for graphics programs
- Continuous monitoring during development

---

### 🐛 Debugging Tools (7 tools)

| Tool Name                              | Description                  | Key Parameters            |
| -------------------------------------- | ---------------------------- | ------------------------- |
| `enhance_qb64pe_code_for_debugging`    | Add debug enhancements       | `code`, `options`         |
| `get_qb64pe_debugging_best_practices`  | Get debugging best practices | None                      |
| `get_llm_qb64pe_debugging_guide`       | Get LLM-specific guidance    | None                      |
| `inject_native_qb64pe_logging`         | Add native logging           | `code`                    |
| `generate_advanced_debugging_template` | Generate debug template      | `mode`, `includeLogging`  |
| `parse_qb64pe_structured_output`       | Parse structured output      | `output` (string)         |
| `generate_output_capture_commands`     | Generate capture commands    | `programPath`, `platform` |

**Use Cases:**

- Adding comprehensive debugging
- Automated code instrumentation
- Log parsing and analysis

---

### 💬 Feedback Tools (3 tools)

| Tool Name                          | Description            | Key Parameters    |
| ---------------------------------- | ---------------------- | ----------------- |
| `generate_programming_feedback`    | Generate code feedback | `code`, `context` |
| `get_programming_feedback_history` | Get feedback history   | None              |
| `get_feedback_statistics`          | Get feedback stats     | None              |

**Use Cases:**

- Code review assistance
- Learning from feedback patterns
- Tracking improvement over time

---

## MCP Server Configuration

### Connection Details

```json
{
  "mcpServers": {
    "qb64pe": {
      "command": "node",
      "args": ["/path/to/qb64pe-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### Example Tool Call

**Request (JSON-RPC 2.0):**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "validate_qb64pe_syntax",
    "arguments": {
      "code": "PRINT \"Hello World\"",
      "checkLevel": "basic"
    }
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"isValid\":true,\"totalErrors\":0,\"totalWarnings\":0,...}"
      }
    ]
  }
}
```

## Input Validation

All tools use the **ValidationService** for input validation:

- **Code validation**: Length limits, encoding checks
- **Path validation**: Platform-specific path rules
- **String validation**: Required fields, length constraints
- **Number validation**: Range checking, integer validation
- **Enum validation**: Allowed values checking

## Error Handling

All tools use standardized error responses via `createMCPError()`:

```typescript
{
  content: [{
    type: "text",
    text: "Error validating syntax: Invalid code structure at line 5"
  }],
  isError: true
}
```

## Response Formats

### Success Response

```typescript
{
  content: [
    {
      type: "text",
      text: JSON.stringify(result, null, 2),
    },
  ];
}
```

### Text Response

```typescript
{
  content: [
    {
      type: "text",
      text: "Plain text response",
    },
  ];
}
```

## Tool Categories Summary

| Category          | Tools  | Primary Purpose                 |
| ----------------- | ------ | ------------------------------- |
| **Wiki**          | 3      | Documentation & reference       |
| **Keywords**      | 5      | Code completion & discovery     |
| **Compiler**      | 3      | Compilation & validation        |
| **Compatibility** | 3      | Cross-platform compatibility    |
| **Execution**     | 7      | Process monitoring & analysis   |
| **Installation**  | 5      | Environment setup               |
| **Porting**       | 3      | Code migration                  |
| **Graphics**      | 11     | Visual debugging & screenshots  |
| **Debugging**     | 7      | Code instrumentation & analysis |
| **Feedback**      | 3      | Code review & improvement       |
| **TOTAL**         | **51** | **Complete QB64PE development** |

## Common Use Cases

### 1. Code Validation Workflow

```
lookup_qb64pe_keyword → validate_qb64pe_syntax → validate_qb64pe_compatibility
```

### 2. Debugging Workflow

```
enhance_qb64pe_code_for_debugging → execute → parse_qb64pe_structured_output
```

### 3. Graphics Development Workflow

```
get_qb64pe_graphics_guide → code → capture_qb64pe_screenshot → analyze_qb64pe_graphics_screenshot
```

### 4. Porting Workflow

```
analyze_qbasic_compatibility → port_qbasic_to_qb64pe → validate_qb64pe_syntax
```

## Additional MCP Features

Beyond tools, the server also exposes:

### Prompts (5 available)

- Pre-configured prompts for common tasks
- Template generation
- Interactive guidance

### Resources

- Dynamic resource access
- Wiki content integration
- Documentation retrieval

## Client Integration

MCP clients can:

1. **Discover tools** via `tools/list`
2. **Get schemas** for each tool
3. **Call tools** with validated parameters
4. **Receive structured** JSON responses
5. **Handle errors** with detailed messages

## Architecture Benefits

- ✅ **Type-safe**: All tools have Zod schemas
- ✅ **Validated**: Input validation on all parameters
- ✅ **Modular**: 10 separate tool modules
- ✅ **Tested**: 64 tests covering utilities
- ✅ **Documented**: Comprehensive tool documentation
- ✅ **Consistent**: Standardized response/error handling

## Summary

The QB64PE MCP Server provides a **comprehensive programming assistant** through 51 specialized tools, enabling:

- 🔍 **Discovery**: Find QB64PE features and documentation
- ✍️ **Development**: Write, validate, and debug code
- 🔄 **Migration**: Port legacy code to QB64PE
- 🎨 **Graphics**: Visual debugging with screenshots
- 🐛 **Debugging**: Comprehensive code instrumentation
- 💻 **Environment**: Installation and setup assistance

All tools are accessible through the standard MCP protocol, making them available to any MCP-compatible client.
