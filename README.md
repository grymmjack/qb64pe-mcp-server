# QB64PE MCP Server

A comprehensive Model Context Protocol (MCP) server that provides advanced QB64PE (QBasic 64 Phoenix Edition) programming assistance. This server enables AI assistants to search the QB64PE wiki, understand compiler options, provide debugging help, validate QB64PE-only syntax, handle cross-platform differences, **port QBasic programs to QB64PE**, and **provides advanced automated debugging capabilities with native logging**.

## 🚀 **51 Tools & 5 Prompts Available!**

This MCP server provides **51 comprehensive tools** and **5 intelligent prompts** for complete QB64PE development support, from installation detection to advanced debugging and porting assistance.

---

## 📋 **Tools Quick Reference**

### � **Advanced Debugging & Automation (12 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `enhance_qb64pe_code_for_debugging` | Apply comprehensive debugging enhancements with console management, flow control, and resource tracking | [📖](./tool-docs/enhance_qb64pe_code_for_debugging.md) |
| `get_qb64pe_debugging_best_practices` | Get debugging best practices specifically for QB64PE development | [📖](./tool-docs/get_qb64pe_debugging_best_practices.md) |
| `get_llm_debugging_guide` | Get LLM-specific debugging guidance with timeout strategies and automation workflows | [📖](./tool-docs/get_llm_debugging_guide.md) |
| `inject_native_qb64pe_logging` | Inject native QB64PE logging functions (_LOGINFO, _LOGERROR, etc.) with $CONSOLE:ONLY directive | [📖](./tool-docs/inject_native_qb64pe_logging.md) |
| `generate_advanced_debugging_template` | Create comprehensive debugging templates with native logging and structured output | [📖](./tool-docs/generate_advanced_debugging_template.md) |
| `generate_qb64pe_echo_functions` | Generate ECHO helper functions for simplified console output (mandatory for graphics modes) | [📖](./tool-docs/generate_qb64pe_echo_functions.md) |
| `parse_qb64pe_structured_output` | Parse structured output from enhanced QB64PE programs with section analysis | [📖](./tool-docs/parse_qb64pe_structured_output.md) |
| `generate_output_capture_commands` | Generate cross-platform commands for capturing and monitoring QB64PE program output | [📖](./tool-docs/generate_output_capture_commands.md) |
| `get_debugging_help` | Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc. | [📖](./tool-docs/get_debugging_help.md) |
| `get_execution_monitoring_guidance` | Get comprehensive guidance for monitoring QB64PE program execution with LLM timeout strategies | [📖](./tool-docs/get_execution_monitoring_guidance.md) |
| `generate_monitoring_template` | Generate QB64PE code template with built-in logging, screenshots, and execution monitoring | [📖](./tool-docs/generate_monitoring_template.md) |
| `generate_console_formatting_template` | Generate QB64PE template with enhanced console output formatting for better terminal parsing | [📖](./tool-docs/generate_console_formatting_template.md) |

### 🔄 **QBasic to QB64PE Porting (3 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `port_qbasic_to_qb64pe` | Complete automated porting of QBasic programs to QB64PE with 13+ transformation patterns | [📖](./tool-docs/port_qbasic_to_qb64pe.md) |
| `analyze_qbasic_compatibility` | Pre-porting analysis with complexity assessment and effort estimation | [📖](./tool-docs/analyze_qbasic_compatibility.md) |
| `get_porting_dialect_info` | Multi-dialect support information and implementation status | [📖](./tool-docs/get_porting_dialect_info.md) |

### 📖 **Wiki & Documentation (3 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `search_qb64pe_wiki` | Search the QB64PE wiki for documentation, tutorials, and reference materials | [📖](./tool-docs/search_qb64pe_wiki.md) |
| `get_qb64pe_page` | Retrieve detailed content from a specific QB64PE wiki page | [📖](./tool-docs/get_qb64pe_page.md) |
| `get_qb64pe_wiki_categories` | Get all available QB64PE wiki keyword categories with keyword counts | [📖](./tool-docs/get_qb64pe_wiki_categories.md) |

### 🛠️ **Compiler & Development (3 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `get_compiler_options` | Get information about QB64PE compiler command-line options and flags | [📖](./tool-docs/get_compiler_options.md) |
| `get_qb64pe_best_practices` | Get best practices and coding guidelines for QB64PE development | [📖](./tool-docs/get_qb64pe_best_practices.md) |
| `get_qb64pe_graphics_guide` | Get comprehensive graphics statements guide designed for LLMs (includes _PUTIMAGE usage patterns) | [📖](./tool-docs/get_qb64pe_graphics_guide.md) |

### ✅ **Syntax & Compatibility (3 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `validate_qb64pe_syntax` | Validate QB64PE code syntax and suggest corrections | [📖](./tool-docs/validate_qb64pe_syntax.md) |
| `validate_qb64pe_compatibility` | Check code for QB64PE compatibility issues and get solutions | [📖](./tool-docs/validate_qb64pe_compatibility.md) |
| `search_qb64pe_compatibility` | Search for compatibility issues, solutions, and best practices | [📖](./tool-docs/search_qb64pe_compatibility.md) |

### 🔍 **Keywords Reference (6 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `lookup_qb64pe_keyword` | Get detailed information about a specific QB64PE keyword | [📖](./tool-docs/lookup_qb64pe_keyword.md) |
| `autocomplete_qb64pe_keywords` | Get autocomplete suggestions for QB64PE keywords | [📖](./tool-docs/autocomplete_qb64pe_keywords.md) |
| `get_qb64pe_keywords_by_category` | Get all keywords in a specific category (statements, functions, operators, etc.) | [📖](./tool-docs/get_qb64pe_keywords_by_category.md) |
| `search_qb64pe_keywords` | Search for QB64PE keywords by name, description, or functionality | [📖](./tool-docs/search_qb64pe_keywords.md) |
| `search_qb64pe_keywords_by_wiki_category` | Search keywords within specific functional categories from the QB64PE wiki | [📖](./tool-docs/search_qb64pe_keywords_by_wiki_category.md) |
| `get_qb64pe_wiki_categories` | Get all available QB64PE wiki keyword categories with counts | [📖](./tool-docs/get_qb64pe_wiki_categories.md) |

### ⚡ **Execution Monitoring & Process Management (7 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `analyze_qb64pe_execution_mode` | Analyze QB64PE source code to determine execution characteristics and monitoring requirements | [📖](./tool-docs/analyze_qb64pe_execution_mode.md) |
| `get_process_monitoring_commands` | Get cross-platform commands for monitoring QB64PE processes | [📖](./tool-docs/get_process_monitoring_commands.md) |
| `parse_console_output` | Parse QB64PE console output to detect completion signals and execution state | [📖](./tool-docs/parse_console_output.md) |
| `get_file_monitoring_commands` | Get cross-platform commands for monitoring QB64PE log files and output | [📖](./tool-docs/get_file_monitoring_commands.md) |
| `get_qb64pe_processes` | List all currently running QB64PE processes and windows | [📖](./tool-docs/get_qb64pe_processes.md) |
| `get_automation_status` | Get comprehensive status of all screenshot automation services | [📖](./tool-docs/get_automation_status.md) |
| `get_feedback_statistics` | Get detailed statistics about programming feedback and improvement trends | [📖](./tool-docs/get_feedback_statistics.md) |

### 📷 **Screenshot & Graphics Analysis (8 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `capture_qb64pe_screenshot` | Automatically capture screenshot of QB64PE program window | [📖](./tool-docs/capture_qb64pe_screenshot.md) |
| `analyze_qb64pe_graphics_screenshot` | Analyze QB64PE graphics program screenshots to detect shapes, colors, layout, and visual elements | [📖](./tool-docs/analyze_qb64pe_graphics_screenshot.md) |
| `generate_qb64pe_screenshot_analysis_template` | Generate QB64PE program templates for screenshot analysis testing | [📖](./tool-docs/generate_qb64pe_screenshot_analysis_template.md) |
| `start_screenshot_monitoring` | Start monitoring QB64PE processes and automatically capture screenshots at intervals | [📖](./tool-docs/start_screenshot_monitoring.md) |
| `stop_screenshot_monitoring` | Stop automatic screenshot monitoring of QB64PE processes | [📖](./tool-docs/stop_screenshot_monitoring.md) |
| `start_screenshot_watching` | Start watching screenshot directories for new files and automatically trigger analysis | [📖](./tool-docs/start_screenshot_watching.md) |
| `stop_screenshot_watching` | Stop watching screenshot directories | [📖](./tool-docs/stop_screenshot_watching.md) |
| `get_screenshot_analysis_history` | Get history of automatic screenshot analyses performed | [📖](./tool-docs/get_screenshot_analysis_history.md) |

### 🔧 **Installation & Setup (6 tools)**
| Tool | Description | Docs |
|------|-------------|------|
| `detect_qb64pe_installation` | Detect QB64PE installation and check if it's properly configured in PATH | [📖](./tool-docs/detect_qb64pe_installation.md) |
| `get_qb64pe_path_configuration` | Get platform-specific instructions for adding QB64PE to system PATH | [📖](./tool-docs/get_qb64pe_path_configuration.md) |
| `validate_qb64pe_path` | Check if a specific path contains a valid QB64PE installation | [📖](./tool-docs/validate_qb64pe_path.md) |
| `generate_qb64pe_installation_report` | Generate a comprehensive report about QB64PE installation status | [📖](./tool-docs/generate_qb64pe_installation_report.md) |
| `get_qb64pe_installation_guidance` | Get user-friendly guidance for QB64PE installation and PATH configuration | [📖](./tool-docs/get_qb64pe_installation_guidance.md) |
| `get_programming_feedback_history` | Get history of programming feedback generated from screenshot analyses | [📖](./tool-docs/get_programming_feedback_history.md) |

---

## 🎯 **Prompts Quick Reference**

| Prompt | Description | Docs |
|--------|-------------|------|
| `review-qb64pe-code` | Review QB64PE code for best practices, syntax issues, and optimizations | [📖](./prompt-docs/review-qb64pe-code.md) |
| `debug-qb64pe-issue` | Help debug QB64PE programs with step-by-step guidance | [📖](./prompt-docs/debug-qb64pe-issue.md) |
| `monitor-qb64pe-execution` | Provide guidance for monitoring QB64PE program execution with timeout strategies | [📖](./prompt-docs/monitor-qb64pe-execution.md) |
| `analyze-qb64pe-graphics` | Analyze QB64PE graphics programs and provide detailed feedback on visual output | [📖](./prompt-docs/analyze-qb64pe-graphics.md) |
| `port-qbasic-to-qb64pe` | Provide guidance for porting QBasic programs to QB64PE with transformation analysis | [📖](./prompt-docs/port-qbasic-to-qb64pe.md) |

---

## 🚀 **Key Features**

### 🔍 **Critical Discovery: $CONSOLE:ONLY vs $CONSOLE**
```basic
' ❌ OLD WAY - Creates separate console window (no shell redirection)
$CONSOLE

' ✅ NEW WAY - Enables shell output redirection for automation
$CONSOLE:ONLY
```
**Impact**: Enables automated output capture: `program.exe > output.txt 2>&1`

### 📊 **Real-World Success: Advanced Debugging System**
```
=== PROGRAM ANALYSIS ===
Program: ASEPRITE ZLIB Analyzer
Expected: 82944 bytes

=== STEP 1: HEADER VALIDATION ===
INFO: ZLIB header validation completed
CMF: 120, FLG: 156 - Valid header

=== STEP 2: DEFLATE PARSING ===
ERROR: Dynamic Huffman decoder incomplete
Only 51 bytes decoded (0.06% of expected)

=== RESULTS SUMMARY ===
FAILED: Incomplete DEFLATE implementation
Auto-exiting in 10 seconds...
```
- ✅ **Root Cause Found**: Incomplete Dynamic Huffman decoder
- ✅ **Precise Metrics**: 51 bytes vs 82,944 expected (0.06%)
- ✅ **Automated Workflow**: Zero manual intervention required
- ✅ **Structured Output**: Easy parsing for LLM analysis

### 🎯 **GORILLAS.BAS Porting Success**
- **Source**: 1,136 lines QBasic → **Output**: 1,119 lines QB64PE
- **Transformations**: 13 major patterns successfully applied
- **Keywords**: 908 successful conversions to Pascal Case  
- **Compatibility**: HIGH rating - ready to compile
- **Automation**: 99%+ automated with minimal manual review needed

---

## 📚 **Documentation Structure**

### 📖 **Tool Documentation**
Each tool has comprehensive documentation in [`/tool-docs/`](./tool-docs/):
- **Overview**: Purpose and capabilities
- **Parameters**: Input parameters and options
- **Returns**: Output format and examples
- **Use Cases**: Common scenarios and applications
- **Examples**: Practical usage examples
- **Related Tools**: Cross-references and workflows

### 🎯 **Prompt Documentation**  
Each prompt has detailed guidance in [`/prompt-docs/`](./prompt-docs/):
- **Overview**: Prompt purpose and functionality
- **Parameters**: Input requirements and options
- **Generated Response**: Expected output format
- **Examples**: Sample usage scenarios
- **Related Prompts**: Cross-references and workflows

### 📚 **Core Documentation**
Comprehensive guides in [`/docs/`](./docs/):
- [QB64PE Debugging Enhancement System](./docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
- [QB64PE Execution Monitoring](./docs/QB64PE_EXECUTION_MONITORING.md)
- [LLM Usage Guide](./docs/LLM_USAGE_GUIDE.md)
- [Compatibility Integration Guide](./docs/COMPATIBILITY_INTEGRATION.md)
- [Keywords Integration Guide](./docs/KEYWORDS_INTEGRATION.md)

---

## 💡 **Example Workflows**

### 🔄 **QBasic to QB64PE Porting**
```javascript
// 1. Analyze compatibility
{ "tool": "analyze_qbasic_compatibility", "sourceCode": "PRINT \"Hello\"..." }

// 2. Port the code  
{ "tool": "port_qbasic_to_qb64pe", "sourceCode": "PRINT \"Hello\"..." }

// 3. Validate result
{ "tool": "validate_qb64pe_compatibility", "code": "Print \"Hello\"..." }
```

### 🐛 **Advanced Debugging**
```javascript
// 1. Enhance code for debugging
{ "tool": "enhance_qb64pe_code_for_debugging", "sourceCode": "FOR i = 1 TO 10..." }

// 2. Inject native logging
{ "tool": "inject_native_qb64pe_logging", "config": { "consoleDirective": "$CONSOLE:ONLY" } }

// 3. Parse structured output
{ "tool": "parse_qb64pe_structured_output", "output": "=== PROGRAM ANALYSIS ===..." }
```

### 📷 **Graphics Analysis**
```javascript
// 1. Generate test program
{ "tool": "generate_qb64pe_screenshot_analysis_template", "testType": "basic_shapes" }

// 2. Capture & analyze
{ "tool": "capture_qb64pe_screenshot", "tool": "analyze_qb64pe_graphics_screenshot" }
```

---

**🎉 GETTING THERE! 51 Tools & 5 Prompts - Your Complete QB64PE Development Companion! 🚀**
- **`enhance_qb64pe_code_for_debugging`** - Apply comprehensive debugging enhancements with console management, flow control, resource tracking, and graphics context fixes
- **`get_qb64pe_debugging_best_practices`** - Get debugging best practices specifically for QB64PE development
- **`get_llm_debugging_guide`** - Get LLM-specific debugging guidance with timeout strategies and automation workflows
- **`inject_native_qb64pe_logging`** - Inject native QB64PE logging functions (_LOGINFO, _LOGERROR, etc.) with $CONSOLE:ONLY directive for shell redirection
- **`generate_advanced_debugging_template`** - Create comprehensive debugging templates with native logging, structured output, and execution monitoring
- **`parse_qb64pe_structured_output`** - Parse structured output from enhanced QB64PE programs with section analysis and execution status
- **`generate_output_capture_commands`** - Generate cross-platform commands for capturing and monitoring QB64PE program output
- **`get_debugging_help`** - Get help with debugging QB64PE programs using PRINT statements, $CONSOLE, etc.
- **`get_execution_monitoring_guidance`** - Get comprehensive guidance for monitoring QB64PE program execution with LLM timeout strategies

### 🔄 **QBasic to QB64PE Porting (3 tools)**
- **`port_qbasic_to_qb64pe`** - Complete automated porting of QBasic programs to QB64PE with 13+ transformation patterns
- **`analyze_qbasic_compatibility`** - Pre-porting analysis with complexity assessment and effort estimation  
- **`get_porting_dialect_info`** - Multi-dialect support information and implementation status

### 📖 Wiki & Documentation (3 tools)
- **`search_qb64pe_wiki`** - Search the QB64PE wiki for documentation, tutorials, and reference materials
- **`get_qb64pe_page`** - Retrieve detailed content from a specific QB64PE wiki page
- **`get_qb64pe_wiki_categories`** - Get all available QB64PE wiki keyword categories with keyword counts

### 🛠️ Compiler & Development (3 tools)
- **`get_compiler_options`** - Get information about QB64PE compiler command-line options and flags
- **`get_qb64pe_best_practices`** - Get best practices and coding guidelines for QB64PE development  
- **`detect_qb64pe_installation`** - Detect QB64PE installation and check if it's properly configured in PATH

### ✅ Syntax & Compatibility (3 tools)
- **`validate_qb64pe_syntax`** - Validate QB64PE code syntax and suggest corrections
- **`validate_qb64pe_compatibility`** - Check code for QB64PE compatibility issues and get solutions
- **`search_qb64pe_compatibility`** - Search for compatibility issues, solutions, and best practices

### 🔍 Keywords Reference (6 tools)
- **`lookup_qb64pe_keyword`** - Get detailed information about a specific QB64PE keyword
- **`autocomplete_qb64pe_keywords`** - Get autocomplete suggestions for QB64PE keywords
- **`get_qb64pe_keywords_by_category`** - Get all keywords in a specific category (statements, functions, operators, etc.)
- **`search_qb64pe_keywords`** - Search for QB64PE keywords by name, description, or functionality
- **`search_qb64pe_keywords_by_wiki_category`** - Search keywords within specific functional categories from the QB64PE wiki
- **`get_qb64pe_wiki_categories`** - Get all available QB64PE wiki keyword categories with counts

### ⚡ Execution Monitoring & Screenshots (12 tools)
- **`analyze_qb64pe_execution_mode`** - Analyze QB64PE source code to determine execution characteristics and monitoring requirements
- **`get_process_monitoring_commands`** - Get cross-platform commands for monitoring QB64PE processes
- **`generate_monitoring_template`** - Generate QB64PE code template with built-in logging, screenshots, and execution monitoring
- **`generate_console_formatting_template`** - Generate QB64PE template with enhanced console output formatting
- **`parse_console_output`** - Parse QB64PE console output to detect completion signals and execution state
- **`get_file_monitoring_commands`** - Get cross-platform commands for monitoring QB64PE log files and output
- **`capture_qb64pe_screenshot`** - Automatically capture screenshot of QB64PE program window
- **`analyze_qb64pe_graphics_screenshot`** - Analyze QB64PE graphics program screenshots to detect shapes, colors, layout, and visual elements
- **`generate_qb64pe_screenshot_analysis_template`** - Generate QB64PE program templates for screenshot analysis testing
- **`start_screenshot_monitoring`** - Start monitoring QB64PE processes and automatically capture screenshots at intervals
- **`stop_screenshot_monitoring`** - Stop automatic screenshot monitoring of QB64PE processes
- **`get_automation_status`** - Get comprehensive status of all screenshot automation services

### 🔧 Installation & Setup (4 tools)
- **`get_qb64pe_path_configuration`** - Get platform-specific instructions for adding QB64PE to system PATH
- **`validate_qb64pe_path`** - Check if a specific path contains a valid QB64PE installation
- **`generate_qb64pe_installation_report`** - Generate a comprehensive report about QB64PE installation status
- **`get_qb64pe_installation_guidance`** - Get user-friendly guidance for QB64PE installation and PATH configuration

### 💡 Prompts (3 prompts)
- **`review-qb64pe-code`** - Review QB64PE code for best practices, syntax issues, and optimizations
- **`debug-qb64pe-issue`** - Help debug QB64PE programs with step-by-step guidance
- **`monitor-qb64pe-execution`** - Provide guidance for monitoring QB64PE program execution with timeout strategies

---

### 🔍 **Keywords Reference System**
- Complete QB64PE keywords database (800+ keywords)
- Smart categorization (statements, functions, operators, metacommands, OpenGL, types, legacy)
- Real-time keyword validation with intelligent suggestions
- Autocomplete support for partial keywords
- Full-text search across keyword definitions and examples
- Version compatibility checking (QBasic vs QB64 vs QB64PE)
- Platform availability information
- Syntax examples and related keyword suggestions

### ⚡**Execution Monitoring & Process Management**
- **Program execution type detection** - Identifies graphics vs console vs mixed programs
- **LLM timeout strategies** - Prevents infinite waiting for graphics programs that require user interaction
- **Cross-platform process monitoring** - Commands for Windows, Linux, and macOS process management
- **Real-time console output parsing** - Detects completion signals, input prompts, and program state
- **Automatic screenshot generation** - Captures visual output from graphics programs using `_SAVEIMAGE`
- **Enhanced logging and monitoring** - Automatic log file generation with timestamps and progress tracking
- **Console output formatting** - Color-coded, structured output for better terminal parsing
- **Process termination strategies** - Graceful and force termination commands across platforms
- **File monitoring utilities** - Real-time log file monitoring and pattern searching
- **Code template generation** - Wraps user code with monitoring, logging, and screenshot capabilitiesCP) server that provides advanced QB64PE (QBasic 64 Phoenix Edition) programming assistance. This server enables AI assistants to search the QB64PE wiki, understand compiler options, provide debugging help, validate QB64PE-only syntax, and handle cross-platform differences.

## 🎯 **QBasic to QB64PE Porting System**

### Automated Code Transformation
- **Complete QBasic Program Conversion** - Successfully converts complex programs like GORILLAS.BAS (1,136 lines)
- **13+ Transformation Patterns** - Systematic keyword conversion, metacommand addition, legacy code modernization
- **High Compatibility Success Rate** - Real-world testing achieves "HIGH" compatibility with minimal manual intervention
- **Intelligent Analysis Engine** - Pre-porting assessment with complexity scoring and effort estimation

### Supported Transformations
1. **QB64PE Metacommands** - Adds `$NoPrefix`, `$Resize:Smooth`, `Title` for modern programs
2. **Keyword Case Conversion** - ALL CAPS → Pascal Case (900+ keywords converted automatically)  
3. **Declaration Cleanup** - Removes unnecessary `DECLARE SUB/FUNCTION` statements
4. **DEF FN Modernization** - Converts `DEF FnName(x) = expression` to proper `Function...End Function`
5. **GOSUB Elimination** - Transforms structured programming paradigms to proper subroutines
6. **Type Declaration Updates** - `TYPE...END TYPE` → `Type...End Type` with field modernization
7. **Array Syntax Enhancement** - Modern QB64PE array notation and PUT/GET improvements
8. **Mathematical Constants** - `pi# = 4 * ATN(1#)` → `pi# = Pi` using built-in constants
9. **Exit Statement Modernization** - `END` → `System 0` for proper program termination
10. **Timing Functions** - `Rest t#` → `Delay t#` with modern QB64PE timing
11. **Graphics Enhancements** - Adds `AllowFullScreen SquarePixels, Smooth` capabilities
12. **String Function Casing** - `LTRIM$` → `LTrim$` and all string function conversions
13. **Multi-Statement Detection** - Identifies complex lines requiring manual review

### Porting Results Example (GORILLAS.BAS)
- ✅ **Source**: 1,136 lines QBasic → **Output**: 1,119 lines QB64PE
- ✅ **Transformations**: 13 major patterns successfully applied
- ✅ **Keywords**: 908 successful conversions to Pascal Case  
- ✅ **Compatibility**: HIGH rating - ready to compile
- ✅ **Automation**: 99%+ automated with minimal manual review needed

### Future Dialect Support Framework
- **GW-BASIC** - Line number conversion patterns ready
- **QuickBasic 4.x** - Module system updates planned  
- **Visual BASIC for DOS** - Control structure compatibility designed
- **12 Additional Dialects** - Extensible framework supports FreeBASIC, VB6, Commodore BASIC, etc.

---

## Features

### � **Advanced Debugging & Automation System**
- **Comprehensive Code Enhancement** - Automatically fixes console visibility, flow control, resource management, and graphics context issues
- **Native QB64PE Logging** - Injects _LOGINFO, _LOGERROR, _LOGWARN, _LOGTRACE functions for structured debugging
- **Critical $CONSOLE:ONLY Discovery** - Enables shell redirection (`program.exe > output.txt 2>&1`) for automated workflows
- **Structured Output Generation** - Creates organized debugging sections for systematic analysis
- **Auto-Exit Mechanisms** - Prevents infinite waiting in automated LLM workflows
- **Real-World Proven** - Successfully diagnosed complex issues like ASEPRITE ZLIB decompression problems
- **Cross-Platform Monitoring** - Commands for Windows, Linux, macOS process and file monitoring
- **Advanced Template Generation** - Creates comprehensive debugging programs with built-in logging and error handling

### �🔍 **Wiki Integration**
- Search the official QB64PE wiki (https://qb64phoenix.com/qb64wiki/)
- Retrieve complete page content with formatted examples
- Intelligent caching system for improved performance
- Fallback search mechanisms for comprehensive results

### 🛠️ **Compiler Assistance**
- Complete QB64PE compiler options reference (-c, -x, -o, -z, -g, -w)
- Platform-specific compilation guidance (Windows, macOS, Linux)
- Optimization recommendations and build strategies
- Cross-platform compatibility insights

### 🐛 **Enhanced Debugging Support**
- **Native Logging Integration** - _LOGINFO, _LOGERROR, _LOGWARN, _LOGTRACE functions
- **Structured Debugging Sections** - Organized output for systematic analysis
- **$CONSOLE:ONLY Management** - Proper console directives for shell redirection
- **Auto-Exit Mechanisms** - Timeout-based program termination for automation
- **Resource Tracking** - File handle and graphics context management
- **Error Detection & Cleanup** - Comprehensive error handling and resource cleanup
- **Template Generation** - Advanced debugging templates with built-in monitoring
- **Output Parsing** - Structured analysis of program execution results

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

### 13. `analyze_qb64pe_execution_mode`
Analyze QB64PE source code to determine execution characteristics and monitoring requirements.

**Arguments:**
- `sourceCode` (string): QB64PE source code to analyze

**Returns execution state and guidance for monitoring:**
- Program type (graphics, console, mixed)
- Timeout recommendations for LLMs
- Monitoring strategies
- Screenshot and logging requirements

**Example:**
```json
{
  "sourceCode": "SCREEN _NEWIMAGE(800, 600, 32)\\nDO\\n    _LIMIT 60\\nLOOP"
}
```

### 14. `get_process_monitoring_commands`
Get cross-platform commands for monitoring QB64PE processes.

**Arguments:**
- `processName` (string, optional): Process name to monitor (default: "qb64pe")
- `platform` (string, optional): Target platform (windows, linux, macos, current)

**Example:**
```json
{
  "processName": "qb64pe",
  "platform": "windows"
}
```

### 15. `generate_monitoring_template`
Generate QB64PE code template with built-in logging, screenshots, and execution monitoring.

**Arguments:**
- `originalCode` (string): Original QB64PE code to wrap with monitoring

**Example:**
```json
{
  "originalCode": "PRINT \"Hello World\"\\nFOR i = 1 TO 5\\n    PRINT i\\nNEXT i"
}
```

### 16. `generate_console_formatting_template`
Generate QB64PE template with enhanced console output formatting for better terminal parsing.

**Arguments:** None

**Returns:** Template code with color-coded console output functions

### 17. `get_execution_monitoring_guidance`
Get comprehensive guidance for monitoring QB64PE program execution, including LLM timeout strategies.

**Arguments:** None

**Returns:** Detailed markdown guide for execution monitoring best practices

### 18. `parse_console_output`
Parse QB64PE console output to detect completion signals, input prompts, and execution state.

**Arguments:**
- `output` (string): Console output to parse

**Example:**
```json
{
  "output": "Processing complete.\\nPress any key to continue..."
}
```

### 19. `get_file_monitoring_commands`
Get cross-platform commands for monitoring QB64PE log files and output.

**Arguments:**
- `logFile` (string): Path to log file to monitor

**Example:**
```json
{
  "logFile": "qb64pe-logs/execution_timestamp.log"
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

### 7. `qb64pe://execution/monitoring`
Comprehensive guide for monitoring QB64PE program execution, process management, and timeout strategies for LLMs.

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

### 2. `monitor-qb64pe-execution`
Template for monitoring QB64PE program execution with timeout strategies.

**Arguments:**
- `sourceCode` (string): QB64PE source code to analyze
- `expectedBehavior` (string, optional): Expected program behavior
- `platform` (string, optional): Target platform (windows, macos, linux)

**Provides guidance for:**
- Program type analysis (graphics, console, mixed)
- Execution timeout recommendations for LLMs
- Process monitoring strategy
- Console output parsing guidance
- Screenshot/logging recommendations
- When to hand over to human interaction

## Architecture

### Core Components

- **MCP Server**: Main server handling tool/resource registration
- **Wiki Service**: QB64PE wiki integration with caching
- **Compiler Service**: Compiler options and platform guidance  
- **Syntax Service**: QB64PE syntax validation and analysis
- **Compatibility Service**: Compatibility knowledge and validation
- **Keywords Service**: Keywords reference and validation
- **Execution Service**: Program execution monitoring and process management
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

#### Execution Service (`QB64PEExecutionService`)
- Program execution type detection (graphics, console, mixed)
- LLM timeout strategy recommendations
- Cross-platform process monitoring commands
- Console output parsing and completion signal detection
- Automatic screenshot generation using `_SAVEIMAGE`
- Enhanced logging and monitoring template generation
- Console output formatting for better parsing
- Real-time log file monitoring utilities
- Process termination strategies across platforms

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
│   ├── execution-service.ts # Program execution monitoring
│   └── search-service.ts    # Search indexing
├── data/
│   ├── compatibility-rules.json # Structured compatibility rules
│   └── keywords-data.json   # Enhanced keywords database
└── types/                   # TypeScript type definitions
```

## Documentation

### 🚀 **New Debugging & Automation Guides**
- [QB64PE Debugging Enhancement System](./docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md) - Complete guide to the advanced debugging system
- [QB64PE Logging Service Guide](./docs/QB64PE_LOGGING_SERVICE_GUIDE.md) - Comprehensive native logging service documentation
- [Logging Service Implementation Summary](./docs/LOGGING_SERVICE_IMPLEMENTATION_SUMMARY.md) - Implementation summary and success metrics
- [LLM Usage Guide](./docs/LLM_USAGE_GUIDE.md) - How LLMs use the MCP server tools and workflows
- [LLM Connection Examples](./docs/LLM_CONNECTION_EXAMPLES.md) - Configuration examples for connecting LLMs to the MCP server

### 📚 **Core Development Guides**
- [Execution Monitoring Guide](./docs/QB64PE_EXECUTION_MONITORING.md) - Comprehensive guide for monitoring QB64PE program execution, process management, and LLM timeout strategies
- [Execution Monitoring Examples](./docs/EXECUTION_MONITORING_EXAMPLES.md) - Practical examples and usage patterns for execution monitoring features
- [Compatibility Integration Guide](./docs/COMPATIBILITY_INTEGRATION.md) - Detailed documentation of the compatibility validation system
- [Keywords Integration Guide](./docs/KEYWORDS_INTEGRATION.md) - Comprehensive guide to the keywords reference system
- [Variable Scoping Rules](./docs/VARIABLE_SCOPING_RULES.md) - Complete guide to DIM SHARED, $DYNAMIC, and variable scoping

### 🌐 **External Resources**
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

### Example 6: Analyze Program Execution Mode
```javascript
// Using the analyze_qb64pe_execution_mode tool
{
  "sourceCode": "SCREEN _NEWIMAGE(800, 600, 32)\\nDO\\n    WHILE _MOUSEINPUT\\n        IF _MOUSEBUTTON(1) THEN CLS\\n    WEND\\n    _LIMIT 60\\nLOOP"
}

// Result indicates graphics program that will wait indefinitely for user input
// LLM should timeout after 30-60 seconds and hand over to human
```

### Example 7: Generate Monitoring Template
```javascript
// Using the generate_monitoring_template tool
{
  "originalCode": "PRINT \"Processing data...\"\\nFOR i = 1 TO 100\\n    PRINT \"Item\"; i\\nNEXT i"
}

// Returns enhanced code with automatic logging, screenshots, and progress tracking
```

### Example 8: Parse Console Output
```javascript
// Using the parse_console_output tool
{
  "output": "Processing complete.\\nPress any key to continue..."
}

// Result: {"isWaitingForInput": true, "isCompleted": true, "suggestedAction": "requires_user_input"}
```

### Example 9: Enhanced Code Debugging (NEW!)
```javascript
// Using the enhance_qb64pe_code_for_debugging tool
{
  "sourceCode": "PRINT \"Hello\"\\nFOR i = 1 TO 10\\n    PRINT i\\nNEXT",
  "config": {
    "enableConsole": true,
    "enableLogging": true,
    "enableFlowControl": true,
    "timeoutSeconds": 30,
    "autoExit": true
  }
}

// Returns enhanced code with console management, logging, auto-exit, and resource tracking
```

### Example 10: Native Logging Injection (NEW!)
```javascript
// Using the inject_native_qb64pe_logging tool
{
  "sourceCode": "PRINT \"Processing data\"\\nFOR i = 1 TO 100\\n    PRINT i\\nNEXT",
  "config": {
    "consoleDirective": "$CONSOLE:ONLY",  // Critical for shell redirection!
    "enableNativeLogging": true,
    "enableStructuredOutput": true
  }
}

// Returns code with _LOGINFO, _LOGERROR functions and structured sections
```

### Example 11: Advanced Debugging Template (NEW!)
```javascript
// Using the generate_advanced_debugging_template tool
{
  "programName": "Data Analyzer",
  "analysisSteps": ["Header Validation", "Data Processing", "Results Summary"],
  "config": {
    "consoleDirective": "$CONSOLE:ONLY",
    "enableNativeLogging": true,
    "autoExitTimeout": 15
  }
}

// Returns complete debugging program with systematic analysis structure
```

### Example 12: Parse Structured Output (NEW!)
```javascript
// Using the parse_qb64pe_structured_output tool
{
  "output": "=== PROGRAM ANALYSIS ===\\nProgram: Test\\n=== STEP 1: VALIDATION ===\\nINFO: Validation completed\\n=== RESULTS SUMMARY ===\\nSUCCESS: All steps completed"
}

// Returns structured analysis with sections, logs, execution status, and completion rate
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

### v2.0.0 - Advanced Debugging & Automation Release
- **🚀 MAJOR**: Advanced Debugging Enhancement System with comprehensive code fixing
- **🚀 MAJOR**: Native QB64PE Logging Service with _LOGINFO, _LOGERROR, etc.
- **🔍 CRITICAL DISCOVERY**: $CONSOLE:ONLY vs $CONSOLE for shell redirection compatibility
- **NEW**: `enhance_qb64pe_code_for_debugging` - Comprehensive debugging enhancements
- **NEW**: `inject_native_qb64pe_logging` - Native logging injection with proper console directives
- **NEW**: `generate_advanced_debugging_template` - Advanced debugging templates
- **NEW**: `parse_qb64pe_structured_output` - Structured output analysis
- **NEW**: `generate_output_capture_commands` - Cross-platform monitoring commands
- **NEW**: `get_qb64pe_debugging_best_practices` - Debugging best practices
- **NEW**: `get_llm_debugging_guide` - LLM-specific debugging guidance
- **ENHANCED**: Shell redirection compatibility for automated workflows
- **ENHANCED**: Real-world tested with ASEPRITE ZLIB analysis success case
- **ENHANCED**: Structured debugging sections for systematic analysis
- **ENHANCED**: Auto-exit mechanisms for LLM automation compatibility
- **ENHANCED**: Resource tracking and cleanup management
- **ENHANCED**: Cross-platform output capture and monitoring

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
- **NEW**: Program execution monitoring and timeout strategies
- **NEW**: Cross-platform process monitoring commands
- **NEW**: Console output parsing for completion signals
- **NEW**: Automatic screenshot generation using _SAVEIMAGE
- **NEW**: Enhanced logging and monitoring templates
- **NEW**: Real-time log file monitoring utilities
- **NEW**: LLM timeout recommendations for graphics programs
