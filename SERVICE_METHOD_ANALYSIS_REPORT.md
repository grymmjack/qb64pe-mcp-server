# Service Method Analysis Report
## Complete Mapping of Tool Files to Service Method Calls

Generated: January 17, 2026

---

## 1. installation-tools.ts

### Service: `services.installationService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `detectInstallation()` | 31 | none | Tool: detect_qb64pe_installation |
| `getPathConfiguration(installPath)` | 54 | installPath?: string | Tool: get_qb64pe_path_configuration |
| `validatePath(testPath)` | 83 | testPath: string | Tool: validate_qb64pe_path |
| `generateInstallationReport()` | 104 | none | Tool: generate_qb64pe_installation_report |
| `detectInstallation()` | 124 | none | Tool: get_qb64pe_installation_guidance |
| `generateInstallationGuidance(installation)` | 126 | installation: object | Tool: get_qb64pe_installation_guidance |

**Summary:** 6 method calls across 5 tools
**Service Location:** Likely in services/installation-service.ts

---

## 2. graphics-tools.ts

### Service: `services.screenshotService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `analyzeScreenshot(screenshotPath, options)` | 48 | screenshotPath: string, options: object | Tool: analyze_qb64pe_graphics_screenshot |
| `generateAnalysisTemplate(programType, expectedElements)` | 80 | programType: string, expectedElements?: string[] | Tool: generate_qb64pe_screenshot_analysis_template |
| `captureScreenshot(processName, outputPath)` | 106 | processName: string, outputPath?: string | Tool: capture_qb64pe_screenshot |
| `getQB64PEProcesses()` | 123 | none | Tool: get_qb64pe_processes |
| `startMonitoring(interval, outputDir)` | 143 | interval: number, outputDir?: string | Tool: start_screenshot_monitoring |
| `stopMonitoring()` | 160 | none | Tool: stop_screenshot_monitoring |
| `getMonitoringStatus()` | 258 | none | Tool: get_automation_status |
| `getScreenshotFiles()` | 260 | none | Tool: get_automation_status |
| `getGraphicsGuide(topic)` | 287 | topic: string | Tool: get_qb64pe_graphics_guide |

### Service: `services.screenshotWatcher`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `startWatching(directory)` | 179 | directory?: string | Tool: start_screenshot_watching |
| `stopWatching()` | 196 | none | Tool: stop_screenshot_watching |
| `getAnalysisHistory(limit)` | 214 | limit: number | Tool: get_screenshot_analysis_history |
| `getRecentScreenshots(limit)` | 216 | limit: number | Tool: get_screenshot_analysis_history |
| `getStatus()` | 217 | none | Tool: get_screenshot_analysis_history |
| `getStatus()` | 261 | none | Tool: get_automation_status |

### Service: `services.loggingService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `generateEchoFunctions(includeAllVariants)` | 307 | includeAllVariants: boolean | Tool: generate_qb64pe_echo_functions |

**Summary:** 16 method calls across 11 tools
**Service Locations:** 
- services/screenshot-service.ts
- services/screenshot-watcher.ts (or similar)
- services/logging-service.ts

---

## 3. compiler-tools.ts

### Service: `services.compilerService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `getCompilerOptions(platform, optionType)` | 35 | platform: string, optionType: string | Tool: get_compiler_options |
| `getDebuggingHelp(issue, platform)` | 73 | issue: string, platform: string | Tool: get_debugging_help |

### Service: `services.syntaxService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `validateSyntax(code, checkLevel)` | 57 | code: string, checkLevel: string | Tool: validate_qb64pe_syntax |

**Summary:** 3 method calls across 3 tools
**Service Locations:**
- services/compiler-service.ts
- services/syntax-service.ts

---

## 4. session-problems-tools.ts

### Service: `services.sessionProblemsService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `logProblem(args)` | 116 | args: object | Tool: log_session_problem |
| `generateReport()` | 171 | none | Tool: get_session_problems_report |
| `exportAsMarkdown(report)` | 174 | report: object | Tool: get_session_problems_report (format=markdown) |
| `getStatistics()` | 262 | none | Tool: get_session_problems_statistics |
| `getStatistics()` | 322 | none | Tool: clear_session_problems |
| `clear()` | 323 | none | Tool: clear_session_problems |

**Summary:** 6 method calls across 4 tools
**Service Location:** services/session-problems-service.ts

---

## 5. compatibility-tools.ts

### Service: `services.compatibilityService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `validateCompatibility(code)` | 31 | code: string | Tool: validate_qb64pe_compatibility |
| `getPlatformCompatibility(platform)` | 33 | platform: string | Tool: validate_qb64pe_compatibility |
| `searchCompatibility(query)` | 77 | query: string | Tool: search_qb64pe_compatibility |
| `getBestPractices()` | 108 | none | Tool: get_qb64pe_best_practices |
| `getDebuggingGuidance()` | 114 | none | Tool: get_qb64pe_best_practices |

**Summary:** 5 method calls across 3 tools
**Service Location:** services/compatibility-service.ts

---

## 6. porting-tools.ts

### Service: `services.portingService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `portQBasicToQB64PE(sourceCode, options)` | 46 | sourceCode: string, options: object | Tool: port_qbasic_to_qb64pe |
| `getSupportedDialects()` | 72 | none | Tool: get_porting_dialect_info |
| `getDialectRules(dialect)` | 75 | dialect: string | Tool: get_porting_dialect_info |
| `getDialectRules(dialect)` | 91 | dialect: string | Tool: get_porting_dialect_info |
| `portQBasicToQB64PE(sourceCode, options)` | 113 | sourceCode: string, options: object | Tool: analyze_qbasic_compatibility |

**Summary:** 5 method calls across 3 tools
**Service Location:** services/porting-service.ts

---

## 7. keyword-tools.ts

### Service: `services.keywordsService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `validateKeyword(keyword)` | 29 | keyword: string | Tool: lookup_qb64pe_keyword |
| `getAutocomplete(prefix, limit)` | 79 | prefix: string, limit: number | Tool: autocomplete_qb64pe_keywords |
| `getAllKeywords()` | 108 | none | Tool: get_qb64pe_keywords_by_category (category=all) |
| `getKeywordsByCategory(category)` | 110 | category: string | Tool: get_qb64pe_keywords_by_category |
| `searchKeywords(query, maxResults)` | 128 | query: string, maxResults: number | Tool: search_qb64pe_keywords |
| `searchByWikiCategory(wikiCategory, searchTerm)` | 152 | wikiCategory: string, searchTerm?: string | Tool: search_qb64pe_keywords_by_wiki_category |

**Summary:** 6 method calls across 5 tools
**Service Location:** services/keywords-service.ts

---

## 8. execution-tools.ts

### Service: `services.executionService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `analyzeExecutionMode(sourceCode)` | 30 | sourceCode: string | Tool: analyze_qb64pe_execution_mode |
| `getExecutionGuidance(executionState)` | 32 | executionState: object | Tool: analyze_qb64pe_execution_mode |
| `getProcessMonitoringCommands(processName)` | 56 | processName: string | Tool: get_process_monitoring_commands |
| `getProcessTerminationCommands(pid)` | 58 | pid: number | Tool: get_process_monitoring_commands |
| `generateMonitoringTemplate(sourceCode, templateType)` | 86 | sourceCode: string, templateType: string | Tool: generate_monitoring_template |
| `generateConsoleFormattingTemplate(style)` | 107 | style: string | Tool: generate_console_formatting_template |
| `getMonitoringGuidance()` | 126 | none | Tool: get_execution_monitoring_guidance |
| `parseConsoleOutput(output)` | 143 | output: string | Tool: parse_console_output |
| `getFileMonitoringCommands(logFilePath)` | 160 | logFilePath: string | Tool: get_file_monitoring_commands |

**Summary:** 9 method calls across 7 tools
**Service Location:** services/execution-service.ts

---

## 9. debugging-tools.ts

### Service: `services.debuggingService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `enhanceCodeForDebugging(sourceCode, config)` | 63 | sourceCode: string, config: object | Tool: enhance_qb64pe_code_for_debugging |
| `getDebuggingBestPractices()` | 95 | none | Tool: get_qb64pe_debugging_best_practices |
| `getLLMDebuggingGuide()` | 110 | none | Tool: get_llm_debugging_guide |
| `generateAdvancedTemplate(programType, includeAllFeatures)` | 176 | programType: string, includeAllFeatures: boolean | Tool: generate_advanced_debugging_template |

### Service: `services.loggingService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `injectNativeLogging(sourceCode, config)` | 131 | sourceCode: string, config: object | Tool: inject_native_qb64pe_logging |
| `parseStructuredOutput(output, format)` | 193 | output: string, format: string | Tool: parse_qb64pe_structured_output |
| `generateOutputCaptureCommands(programPath, outputPath)` | 213 | programPath: string, outputPath: string | Tool: generate_output_capture_commands |

**Summary:** 7 method calls across 7 tools
**Service Locations:**
- services/debugging-service.ts
- services/logging-service.ts

---

## 10. file-structure-tools.ts

### Service: `services.fileStructureService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `validateBIFile(content)` | 34 | content: string | Tool: validate_bi_file_structure |
| `validateBMFile(content)` | 127 | content: string | Tool: validate_bm_file_structure |
| `followsGJLibConventions(biContent, bmContent)` | 225 | biContent: string, bmContent: string | Tool: validate_qb64_gj_lib_file_pair |
| `validateFile(filename, content)` | 285 | filename: string, content: string | Tool: quick_check_qb64_file_structure |

**Summary:** 4 method calls across 4 tools
**Service Location:** services/file-structure-service.ts

---

## 11. feedback-tools.ts

### Service: `services.feedbackService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `generateFeedback(code, context)` | 28 | code: string, context?: string | Tool: generate_programming_feedback |
| `getFeedbackHistory(limit)` | 45 | limit: number | Tool: get_programming_feedback_history |
| `getStatistics()` | 61 | none | Tool: get_feedback_statistics |

**Summary:** 3 method calls across 3 tools
**Service Location:** services/feedback-service.ts

---

## 12. wiki-tools.ts

### Service: `services.wikiService`

| Method | Line | Parameters | Usage Context |
|--------|------|------------|---------------|
| `searchWiki(query, category)` | 30 | query: string, category?: string | Tool: search_qb64pe_wiki |
| `getPageContent(pageTitle, includeExamples)` | 49 | pageTitle: string, includeExamples: boolean | Tool: get_qb64pe_page |
| `getWikiCategories()` | 62 | none | Tool: get_qb64pe_wiki_categories |

**Summary:** 3 method calls across 3 tools
**Service Location:** services/wiki-service.ts

---

## MASTER SUMMARY

### Total Statistics
- **Total Tool Files Analyzed:** 12
- **Total Tools Registered:** 58
- **Total Service Method Calls:** 67
- **Unique Services Used:** 13

### Services and Method Counts

| Service | Method Count | Used in Tools |
|---------|--------------|---------------|
| services.installationService | 6 | 5 |
| services.screenshotService | 9 | 6 |
| services.screenshotWatcher | 6 | 3 |
| services.loggingService | 4 | 3 |
| services.compilerService | 2 | 2 |
| services.syntaxService | 1 | 1 |
| services.sessionProblemsService | 6 | 4 |
| services.compatibilityService | 5 | 3 |
| services.portingService | 5 | 3 |
| services.keywordsService | 6 | 5 |
| services.executionService | 9 | 7 |
| services.debuggingService | 4 | 4 |
| services.fileStructureService | 4 | 4 |
| services.feedbackService | 3 | 3 |
| services.wikiService | 3 | 3 |

### Potential Issues to Investigate

1. **Method Name Verification Needed:**
   - Check if `services.keywordsService.searchKeywords()` matches the actual method name (might be `search()`)
   - Verify `services.keywordsService.getAutocomplete()` vs `getAutocompleteSuggestions()`
   - Confirm `services.keywordsService.validateKeyword()` vs `isValidKeyword()`

2. **Parameter Consistency:**
   - `services.portingService.portQBasicToQB64PE()` - options object structure needs verification
   - `services.debuggingService.enhanceCodeForDebugging()` - config parameter structure
   - `services.loggingService.injectNativeLogging()` - config parameter structure

3. **Return Type Verification:**
   - All services should return consistent structures (success/failure, data, errors)
   - Async methods should properly handle promises and errors

4. **Missing Error Handling:**
   - All method calls are wrapped in try-catch blocks ✅
   - Using `createMCPError()` helper consistently ✅

### Recommended Next Steps

1. **Cross-reference with actual service implementations:**
   - Check `build/services/keywords-service.js` for actual method names
   - Verify all other service files exist and match expected signatures

2. **Create service interface definitions:**
   - Define TypeScript interfaces for each service
   - Document expected parameters and return types

3. **Add integration tests:**
   - Test each tool with its corresponding service methods
   - Verify parameter passing and return value handling

4. **Documentation updates:**
   - Ensure service method documentation matches tool usage
   - Add examples for each service method

---

## File Pattern Analysis

### Common Patterns Found:

1. **All files use standard MCP helpers:**
   ```typescript
   import { createMCPResponse, createMCPError, createMCPTextResponse } from "../utils/mcp-helpers.js";
   ```

2. **Consistent error handling:**
   ```typescript
   try {
     const result = await services.someService.someMethod(params);
     return createMCPResponse(result);
   } catch (error) {
     return createMCPError(error, "context description");
   }
   ```

3. **Services accessed via ServiceContainer:**
   ```typescript
   function registerTools(server: McpServer, services: ServiceContainer): void
   ```

### Tool Registration Patterns:

- **Standard registration:** Most files use `server.registerTool()`
- **Alternative registration:** file-structure-tools.ts uses `server.tool()` (older API?)
- **Text tool handler:** Some tools use `createTextToolHandler()` wrapper

---

## End of Report
