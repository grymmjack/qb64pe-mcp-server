# QB64PE MCP Server - Tool Examples

Comprehensive examples of all tested tools with sample usage.

Generated: 2026-01-17T20:28:42.831Z

## Compatibility Tools

### validate_qb64pe_syntax

**Description:** Validate QB64PE syntax

**Example Usage:**
```json
{
  "name": "validate_qb64pe_syntax",
  "arguments": {
    "code": "PRINT \"Hello World\"",
    "checkLevel": "basic"
  }
}
```

**Sample Output:**
```
{
  "isValid": true,
  "errors": [],
  "warnings": [],
  "suggestions": [],
  "score": 100,
  "compatibilityIssues": [],
  "keywordIssues": []
}...
```

### validate_qb64pe_compatibility

**Description:** Check compatibility issues

**Example Usage:**
```json
{
  "name": "validate_qb64pe_compatibility",
  "arguments": {
    "code": "SCREEN 13\nPRINT \"Test\"",
    "platform": "all"
  }
}
```

**Sample Output:**
```
{
  "issues": [],
  "platformInfo": {
    "windows": {
      "supported": "Full QB64PE feature support",
      "unsupported": [],
      "notes": "Windows has the most complete feature set"
    },
    ...
```

### search_qb64pe_compatibility

**Description:** Search compatibility knowledge

**Example Usage:**
```json
{
  "name": "search_qb64pe_compatibility",
  "arguments": {
    "query": "console",
    "category": "console_directives"
  }
}
```

**Sample Output:**
```
[
  {
    "category": "console_directives",
    "title": "Console Mode Directives",
    "description": "$CONSOLE:OFF is not valid syntax. Use $CONSOLE for both console and graphics windows, or $CONSOL...
```

## Compiler Tools

### get_compiler_options

**Description:** Get compiler options and flags

**Example Usage:**
```json
{
  "name": "get_compiler_options",
  "arguments": {
    "platform": "all",
    "optionType": "all"
  }
}
```

**Sample Output:**
```
[
  {
    "flag": "-c",
    "description": "Compile to executable without running",
    "platform": [
      "windows",
      "macos",
      "linux"
    ],
    "example": "qb64pe -c myprogram.bas",
   ...
```

## Debugging Tools

### get_debugging_help

**Description:** Get debugging assistance

**Example Usage:**
```json
{
  "name": "get_debugging_help",
  "arguments": {
    "issue": "program hangs on loop",
    "platform": "all"
  }
}
```

**Sample Output:**
```
# QB64PE Debugging Help for: "program hangs on loop"

## Recommended Debugging Techniques

### 1. PRINT Statement Debugging

**Description:** Use PRINT statements to display variable values and progra...
```

### enhance_qb64pe_code_for_debugging

**Description:** Add debugging features to code

**Example Usage:**
```json
{
  "name": "enhance_qb64pe_code_for_debugging",
  "arguments": {
    "sourceCode": "PRINT \"Test\"",
    "config": {
      "enableLogging": true
    }
  }
}
```

**Sample Output:**
```
{
  "enhancedCode": "\n' === DEBUGGING ENHANCEMENT: Logging System ===\nDIM SHARED LogFile AS STRING\nDIM SHARED LogEnabled AS INTEGER\n\nSUB LogInit\n    LogFile = \"/home/grymmjack/git/qb64pe-mcp-se...
```

### get_qb64pe_debugging_best_practices

**Description:** Get debugging best practices

**Example Usage:**
```json
{
  "name": "get_qb64pe_debugging_best_practices",
  "arguments": {}
}
```

**Sample Output:**
```

# QB64PE Debugging Best Practices

## Core Debugging Issues and Solutions

### 1. Console Output and Program Execution Issues
**Problem**: Programs exit immediately without showing output
**Solution*...
```

### get_llm_debugging_guide

**Description:** Get LLM-specific debugging guide

**Example Usage:**
```json
{
  "name": "get_llm_debugging_guide",
  "arguments": {}
}
```

**Sample Output:**
```

# QB64PE Debugging Guide for LLMs

## CRITICAL: Never Wait Indefinitely for QB64PE Programs

### Program Type Detection:
1. **Graphics-Only**: No $CONSOLE, uses SCREEN/graphics → Will open window, ma...
```

## Execution Tools

### analyze_qb64pe_execution_mode

**Description:** Analyze execution characteristics

**Example Usage:**
```json
{
  "name": "analyze_qb64pe_execution_mode",
  "arguments": {
    "sourceCode": "PRINT \"Test\""
  }
}
```

**Sample Output:**
```
{
  "executionState": {
    "status": "not_started",
    "hasGraphics": false,
    "hasConsole": false,
    "logFile": "/home/grymmjack/git/qb64pe-mcp-server/qb64pe-logs/execution_1768681722823.log"
 ...
```

### get_process_monitoring_commands

**Description:** Get process monitoring commands

**Example Usage:**
```json
{
  "name": "get_process_monitoring_commands",
  "arguments": {
    "processName": "qb64pe",
    "platform": "current"
  }
}
```

**Sample Output:**
```
{
  "platform": "linux",
  "processName": "qb64pe",
  "monitoring": {
    "commands": [
      "ps aux | grep \"qb64pe\" | grep -v grep",
      "pgrep -af \"qb64pe\"",
      "top -b -n 1 | grep \"qb64p...
```

### generate_monitoring_template

**Description:** Generate monitoring template

**Example Usage:**
```json
{
  "name": "generate_monitoring_template",
  "arguments": {
    "sourceCode": "PRINT \"Test\"",
    "templateType": "basic"
  }
}
```

**Sample Output:**
```
{
  "template": "\n' ============================================================================\n' QB64PE Execution Monitoring Template\n' Auto-generated monitoring wrapper for better execution visi...
```

### get_execution_monitoring_guidance

**Description:** Get monitoring guidance

**Example Usage:**
```json
{
  "name": "get_execution_monitoring_guidance",
  "arguments": {}
}
```

**Sample Output:**
```
Error getting execution monitoring guidance: services.executionService.getMonitoringGuidance is not a function...
```

### parse_console_output

**Description:** Parse console output

**Example Usage:**
```json
{
  "name": "parse_console_output",
  "arguments": {
    "output": "Test output\nLine 2"
  }
}
```

**Sample Output:**
```
{
  "isWaitingForInput": false,
  "isCompleted": false,
  "lastActivity": "Line 2",
  "suggestedAction": "continue_monitoring"
}...
```

## Feedback Tools

### generate_programming_feedback

**Description:** Generate programming feedback

**Example Usage:**
```json
{
  "name": "generate_programming_feedback",
  "arguments": {
    "code": "PRINT \"Hello\"",
    "context": "Learning basics"
  }
}
```

**Sample Output:**
```
[object Object]...
```

### get_feedback_statistics

**Description:** Get feedback statistics

**Example Usage:**
```json
{
  "name": "get_feedback_statistics",
  "arguments": {}
}
```

**Sample Output:**
```
{
  "total": 1,
  "successful": 0,
  "successRate": 0,
  "qualityDistribution": {
    "poor": 1
  },
  "averageCompleteness": 0,
  "averageAccuracy": 0
}...
```

## FileStruct Tools

### validate_bi_file_structure

**Description:** Validate .BI file structure

**Example Usage:**
```json
{
  "name": "validate_bi_file_structure",
  "arguments": {
    "content": "TYPE TestType\n    field AS STRING\nEND TYPE",
    "filename": "test.BI"
  }
}
```

**Sample Output:**
```
# .BI File Structure Validation: test.BI

**Status:** ✅ VALID

## Recommendations
- .BI file structure looks good!

## QB64_GJ_LIB .BI File Rules
✅ **Should contain:**
- TYPE definitions
- CONST decla...
```

### validate_bm_file_structure

**Description:** Validate .BM file structure

**Example Usage:**
```json
{
  "name": "validate_bm_file_structure",
  "arguments": {
    "content": "SUB TestSub\n    PRINT \"Test\"\nEND SUB",
    "filename": "test.BM"
  }
}
```

**Sample Output:**
```
# .BM File Structure Validation: test.BM

**Status:** ✅ VALID

## Recommendations
- .BM file structure looks good!

## QB64_GJ_LIB .BM File Rules
✅ **Should contain:**
- SUB/FUNCTION implementations O...
```

### validate_qb64_gj_lib_file_pair

**Description:** Validate .BI/.BM file pair

**Example Usage:**
```json
{
  "name": "validate_qb64_gj_lib_file_pair",
  "arguments": {
    "biContent": "TYPE Test\nEND TYPE",
    "bmContent": "SUB TestFunc\nEND SUB",
    "libraryName": "TestLib"
  }
}
```

**Sample Output:**
```
# QB64_GJ_LIB File Pair Validation: TestLib

**Status:** ❌ NON-COMPLIANT

## Issues Found
- .BI file missing $INCLUDEONCE directive
- .BM file missing $INCLUDEONCE directive

## Suggestions
- Add '$IN...
```

### quick_check_qb64_file_structure

**Description:** Quick structure check

**Example Usage:**
```json
{
  "name": "quick_check_qb64_file_structure",
  "arguments": {
    "filename": "test.BI",
    "content": "CONST MAX = 100"
  }
}
```

**Sample Output:**
```
# Quick Structure Check: test.BI

**File Type:** .BI
**Status:** ✅ VALID
**Issues:** 0 errors, 0 warnings

✅ File structure looks good!
...
```

## Graphics Tools

### get_qb64pe_graphics_guide

**Description:** Get graphics programming guide

**Example Usage:**
```json
{
  "name": "get_qb64pe_graphics_guide",
  "arguments": {
    "topic": "basics"
  }
}
```

**Sample Output:**
```
Error getting graphics guide: services.screenshotService.getGraphicsGuide is not a function...
```

## Installation Tools

### detect_qb64pe_installation

**Description:** Auto-detect QB64PE installation

**Example Usage:**
```json
{
  "name": "detect_qb64pe_installation",
  "arguments": {}
}
```

**Sample Output:**
```
{
  "isInstalled": false,
  "inPath": false,
  "platform": "linux"
}...
```

### generate_qb64pe_installation_report

**Description:** Generate installation report

**Example Usage:**
```json
{
  "name": "generate_qb64pe_installation_report",
  "arguments": {}
}
```

**Sample Output:**
```
# QB64PE Installation Report

**Generated:** 2026-01-17T20:28:42.815Z
**Platform:** linux

## Installation Status

❌ **Installed:** No
❌ **In PATH:** No





## Current PATH Configuration

**PATH Sepa...
```

### get_qb64pe_installation_guidance

**Description:** Get installation guidance

**Example Usage:**
```json
{
  "name": "get_qb64pe_installation_guidance",
  "arguments": {}
}
```

**Sample Output:**
```
# QB64PE Installation Status

❌ QB64PE not found on this system!

**Platform:** linux

## Installation Steps:

### 1. Download QB64PE:
Visit: https://github.com/QB64-Phoenix-Edition/QB64pe/releases
- ...
```

## Keywords Tools

### lookup_qb64pe_keyword

**Description:** Look up keyword information

**Example Usage:**
```json
{
  "name": "lookup_qb64pe_keyword",
  "arguments": {
    "keyword": "PRINT"
  }
}
```

**Sample Output:**
```
# PRINT

**Category:** statements

**Wiki:** https://qb64phoenix.com/qb64wiki/index.php/PRINT

**Description:** prints text strings or numerical values to the SCREEN.

**Syntax:**
```qb64
PRINT [param...
```

### autocomplete_qb64pe_keywords

**Description:** Autocomplete keyword suggestions

**Example Usage:**
```json
{
  "name": "autocomplete_qb64pe_keywords",
  "arguments": {
    "prefix": "PRI",
    "limit": 5
  }
}
```

**Sample Output:**
```
[
  "PRINT",
  "PRINT (file statement)",
  "PRINT USING",
  "PRINT USING (file statement)"
]...
```

### get_qb64pe_keywords_by_category

**Description:** Get keywords by category

**Example Usage:**
```json
{
  "name": "get_qb64pe_keywords_by_category",
  "arguments": {
    "category": "statement"
  }
}
```

**Sample Output:**
```
[]...
```

### search_qb64pe_keywords

**Description:** Search for keywords

**Example Usage:**
```json
{
  "name": "search_qb64pe_keywords",
  "arguments": {
    "query": "screen",
    "maxResults": 10
  }
}
```

**Sample Output:**
```
[
  {
    "keyword": "SCREEN",
    "info": {
      "name": "SCREEN",
      "type": "statement",
      "category": "statements",
      "description": "sets the display mode and size of the program wind...
```

## Other Tools

### generate_console_formatting_template

**Description:** Generate console formatting

**Example Usage:**
```json
{
  "name": "generate_console_formatting_template",
  "arguments": {
    "style": "simple"
  }
}
```

**Sample Output:**
```
{
  "template": "\n' ============================================================================\n' QB64PE Enhanced Console Output Template\n' Improved formatting for better terminal parsing and huma...
```

### get_automation_status

**Description:** Get automation status

**Example Usage:**
```json
{
  "name": "get_automation_status",
  "arguments": {}
}
```

**Sample Output:**
```
{
  "screenshot": {
    "monitoring": {
      "isMonitoring": false,
      "screenshotDir": "/home/grymmjack/git/qb64pe-mcp-server/qb64pe-screenshots"
    },
    "recentFiles": 0,
    "latestFile": nu...
```

### generate_qb64pe_echo_functions

**Description:** Generate ECHO functions

**Example Usage:**
```json
{
  "name": "generate_qb64pe_echo_functions",
  "arguments": {
    "includeAllVariants": true
  }
}
```

**Sample Output:**
```

' _ECHO - Native QB64PE console output
' Auto-generated by QB64PE Logging Service
'
' Use _ECHO for direct console output without _DEST management
' Compatible with $CONSOLE:ONLY directive for shell ...
```

### inject_native_qb64pe_logging

**Description:** Inject native logging

**Example Usage:**
```json
{
  "name": "inject_native_qb64pe_logging",
  "arguments": {
    "sourceCode": "PRINT \"Test\"",
    "config": {
      "enableNativeLogging": true
    }
  }
}
```

**Sample Output:**
```
# Enhanced QB64PE Code with Native Logging & ECHO Functions

## Key Improvements
- ✅ **$CONSOLE:ONLY directive** for proper shell redirection
- ✅ **Native QB64PE logging functions** (_LOGINFO, _LOGERR...
```

### parse_qb64pe_structured_output

**Description:** Parse structured output

**Example Usage:**
```json
{
  "name": "parse_qb64pe_structured_output",
  "arguments": {
    "output": "Test output",
    "format": "simple"
  }
}
```

**Sample Output:**
```
{
  "sections": {},
  "logs": [],
  "summary": {
    "success": true,
    "totalSteps": 0,
    "failedSteps": 0
  }
}...
```

### generate_output_capture_commands

**Description:** Generate output capture commands

**Example Usage:**
```json
{
  "name": "generate_output_capture_commands",
  "arguments": {
    "programPath": "/path/to/program"
  }
}
```

**Sample Output:**
```
Error generating output capture commands: services.loggingService.generateOutputCaptureCommands is not a function...
```

## Porting Tools

### analyze_qbasic_compatibility

**Description:** Analyze QBasic compatibility

**Example Usage:**
```json
{
  "name": "analyze_qbasic_compatibility",
  "arguments": {
    "sourceCode": "PRINT \"Hello\"",
    "sourceDialect": "qbasic"
  }
}
```

**Sample Output:**
```
{
  "sourceDialect": "qbasic",
  "codeAnalysis": {
    "totalLines": 1,
    "hasGraphics": false,
    "hasSound": false,
    "hasFileIO": false,
    "hasDefFn": false,
    "hasGosub": false,
    "hasM...
```

### port_qbasic_to_qb64pe

**Description:** Port QBasic to QB64PE

**Example Usage:**
```json
{
  "name": "port_qbasic_to_qb64pe",
  "arguments": {
    "sourceCode": "SCREEN 13\nPRINT \"Test\"",
    "sourceDialect": "qbasic",
    "addModernFeatures": true
  }
}
```

**Sample Output:**
```
{
  "porting": {
    "originalCode": "SCREEN 13\nPRINT \"Test\"",
    "portedCode": "$Resize:Smooth\nTitle \"Ported QB64PE Program\"\n\nScreen 13\n    AllowFullScreen SquarePixels , Smooth\nPrint \"Te...
```

### get_porting_dialect_info

**Description:** Get dialect porting info

**Example Usage:**
```json
{
  "name": "get_porting_dialect_info",
  "arguments": {
    "dialect": "qbasic"
  }
}
```

**Sample Output:**
```
{
  "dialect": "qbasic",
  "conversionRules": [
    "Convert ALL CAPS keywords to Pascal Case",
    "Remove DECLARE statements",
    "Convert DEF FN to proper functions",
    "Convert GOSUB/RETURN to ...
```

## Session Tools

### log_session_problem

**Description:** Log development problem

**Example Usage:**
```json
{
  "name": "log_session_problem",
  "arguments": {
    "category": "tooling",
    "severity": "low",
    "title": "Test problem",
    "description": "Testing comprehensive suite",
    "context": {
      "language": "QB64PE"
    }
  }
}
```

**Sample Output:**
```
✅ **Problem Logged Successfully**

**Problem ID:** problem-1768681722826-bbx2uh
**Title:** Test problem
**Severity:** LOW
**Category:** tooling

This problem has been recorded for MCP server improveme...
```

### get_session_problems_report

**Description:** Get problems report

**Example Usage:**
```json
{
  "name": "get_session_problems_report",
  "arguments": {
    "format": "summary"
  }
}
```

**Sample Output:**
```
# Session Problems Summary

**Session ID:** session-2026-01-17-2d4x06
**Total Problems:** 1

## By Severity
- critical: 0
- high: 0
- medium: 0
- low: 1

## By Category
- syntax: 0
- compatibility: 0
...
```

### get_session_problems_statistics

**Description:** Get problems statistics

**Example Usage:**
```json
{
  "name": "get_session_problems_statistics",
  "arguments": {}
}
```

**Sample Output:**
```
# Session Problems Statistics

**Total Problems Logged:** 1

## Distribution

### By Severity
- Critical: 0
- High: 0
- Medium: 0
- Low: 1

### By Category
- Syntax: 0
- Compatibility: 0
- Workflow: 0...
```

## Wiki Tools

### search_qb64pe_wiki

**Description:** Search QB64PE wiki for documentation

**Example Usage:**
```json
{
  "name": "search_qb64pe_wiki",
  "arguments": {
    "query": "PRINT",
    "category": "keywords"
  }
}
```

**Sample Output:**
```
🎓 **IMPORTANT: QB64PE MCP Server Tool Discovery**

Before processing your request, you must review all available tools in this MCP server.
This ensures you can make the most effective use of the capa...
```

### get_qb64pe_page

**Description:** Get detailed wiki page content

**Example Usage:**
```json
{
  "name": "get_qb64pe_page",
  "arguments": {
    "pageTitle": "PRINT",
    "includeExamples": true
  }
}
```

**Sample Output:**
```
# PRINT

The PRINT statement prints numeric or string expressions to the program screen. Typing shortcut ?  will convert to PRINT.


## Contents


## Syntax


## Parameters

Usage:

Example 1: Using s...
```

### get_qb64pe_wiki_categories

**Description:** Get all wiki categories

**Example Usage:**
```json
{
  "name": "get_qb64pe_wiki_categories",
  "arguments": {}
}
```

**Sample Output:**
```
Error getting wiki categories: services.wikiService.getWikiCategories is not a function...
```

