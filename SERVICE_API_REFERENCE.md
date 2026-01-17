# QB64PE MCP Server - Service API Reference

Complete reference of all public methods in TypeScript service classes.

Generated: 2026-01-17

---

## 1. FeedbackService

**File:** `src/services/feedback-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `generateFeedback` | `analysisResult: AnalysisResult`, `programCode?: string` | `ProgrammingFeedback` | Generate programming feedback from screenshot analysis |
| `getFeedbackHistory` | `limit?: number` | `ProgrammingFeedback[]` | Get feedback history with optional limit |
| `clearHistory` | none | `void` | Clear all feedback history |
| `getStatistics` | none | `object` | Get feedback statistics (total, success rate, quality distribution, etc.) |

---

## 2. ScreenshotWatcherService

**File:** `src/services/screenshot-watcher-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `startWatching` | `directory: string`, `options?: { analysisType?, autoAnalyze?, filePattern? }` | `Promise<void>` | Start watching a directory for new screenshots |
| `stopWatching` | `directory?: string` | `Promise<void>` | Stop watching a specific directory or all directories |
| `queueAnalysis` | `request: AnalysisRequest` | `void` | Queue analysis request for processing |
| `getAnalysisHistory` | `limit?: number` | `AnalysisResult[]` | Get analysis history with optional limit |
| `getRecentScreenshots` | `limit: number = 10` | `AnalysisRequest[]` | Get recent screenshots from watched directories |
| `clearHistory` | none | `void` | Clear analysis history |
| `getStatus` | none | `object` | Get watcher status (isWatching, directories, queue length, etc.) |

---

## 3. QB64PESyntaxService

**File:** `src/services/syntax-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `validateSyntax` | `code: string`, `checkLevel: string = "basic"` | `Promise<SyntaxValidationResult>` | Validate QB64PE syntax with configurable strictness |
| `getSyntaxHelp` | `identifier: string` | `string \| null` | Get syntax help for QB64PE constructs |
| `validateSyntaxBasic` | `code: string` | `{ valid: boolean; errors: string[] }` | Basic syntax validation using TextMate patterns |
| `getSyntaxHighlighting` | `code: string` | `Array<{ text: string; scope: string }>` | Get syntax highlighting information |
| `getSyntaxPatterns` | none | `typeof QB64PE_SYNTAX_PATTERNS` | Get available syntax patterns from TextMate grammar |
| `getRepositoryPatterns` | none | `typeof QB64PE_REPOSITORY_PATTERNS` | Get repository patterns from TextMate grammar |

---

## 4. CompatibilitySearchService

**File:** `src/services/search-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `initialize` | none | `Promise<void>` | Initialize the search index with compatibility content and keywords |
| `search` | `query: string`, `maxResults: number = 10` | `Promise<SearchResult[]>` | Search the index for documents |
| `searchByCategory` | `category: string` | `Promise<SearchDocument[]>` | Search by category |
| `searchByTags` | `tags: string[]` | `Promise<SearchDocument[]>` | Search by tags |
| `getCategories` | none | `Promise<string[]>` | Get all categories |
| `getTags` | none | `Promise<string[]>` | Get all tags |
| `searchKeywords` | `query: string`, `maxResults: number = 10` | `Promise<SearchResult[]>` | Search specifically for keywords |
| `searchKeywordsByCategory` | `category: string` | `Promise<SearchResult[]>` | Search keywords by category |
| `searchKeywordsByType` | `type: string` | `Promise<SearchResult[]>` | Search keywords by type |
| `getKeywordAutocomplete` | `prefix: string`, `maxResults: number = 10` | `Promise<string[]>` | Get keyword autocomplete suggestions |
| `getKeywordCategories` | none | `Promise<Record<string, any>>` | Get all keyword categories |

---

## 5. QB64PEDebuggingService

**File:** `src/services/debugging-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `createDebuggingSession` | `sourceCode: string`, `projectPath: string = '.'`, `config?: Partial<DebugModeConfig>` | `DebuggingSession` | Create a new debugging session with enhanced monitoring |
| `enhanceCodeForDebugging` | `sourceCode: string`, `config?: Partial<DebugModeConfig>` | `object` | Apply debugging enhancements to QB64PE source code |
| `getDebuggingBestPractices` | none | `string` | Get debugging best practices guide |
| `getLLMDebuggingGuide` | none | `string` | Get comprehensive debugging guide for LLMs |
| `getSessionStatus` | `sessionId: string` | `DebuggingSession \| undefined` | Get debug session status |
| `getActiveSessions` | none | `DebuggingSession[]` | List all active debug sessions |
| `closeSession` | `sessionId: string` | `boolean` | Close debug session |

---

## 6. QB64PEPortingService

**File:** `src/services/porting-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `portQBasicToQB64PE` | `sourceCode: string`, `options?: Partial<PortingOptions>` | `Promise<PortingResult>` | Port QBasic code to QB64PE with systematic transformations |
| `getSupportedDialects` | none | `string[]` | Get supported source dialects |
| `getDialectRules` | `dialect: string` | `string[]` | Get dialect-specific conversion rules |

---

## 7. FileStructureService

**File:** `src/services/file-structure-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `validateBIFile` | `content: string` | `FileStructureValidationResult` | Validate .BI file structure (headers/interfaces) |
| `validateBMFile` | `content: string` | `FileStructureValidationResult` | Validate .BM file structure (implementations) |
| `validateFile` | `filename: string`, `content: string` | `FileStructureValidationResult` | Validate any QB64PE file structure (auto-detects type) |
| `followsGJLibConventions` | `biContent: string`, `bmContent: string` | `object` | Check if content follows QB64_GJ_LIB conventions |

---

## 8. ScreenshotService

**File:** `src/services/screenshot-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getQB64PEProcesses` | none | `Promise<ProcessInfo[]>` | Get list of QB64PE processes currently running |
| `captureQB64PEWindow` | `options?: ScreenshotOptions` | `Promise<ScreenshotResult>` | Capture screenshot of specific QB64PE window |
| `startMonitoring` | `intervalMs: number = 5000`, `captureIntervalMs: number = 10000` | `Promise<void>` | Start monitoring QB64PE processes and automatically capture screenshots |
| `stopMonitoring` | none | `void` | Stop monitoring |
| `getMonitoringStatus` | none | `{ isMonitoring: boolean; screenshotDir: string }` | Get monitoring status |
| `getScreenshotFiles` | none | `string[]` | Get all screenshot files in the directory |
| `cleanupOldScreenshots` | `maxAge: number = 24 * 60 * 60 * 1000` | `void` | Clean up old screenshots |

---

## 9. ValidationService

**File:** `src/services/validation-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `validateCode` | `code: string \| undefined`, `options?: CodeValidationOptions` | `ValidationResult` | Validate QB64PE code input |
| `validatePath` | `path: string \| undefined`, `options?: PathValidationOptions` | `ValidationResult` | Validate file path input |
| `validateRequiredString` | `value: any`, `paramName: string`, `options?: { minLength?, maxLength? }` | `ValidationResult` | Validate required string parameter |
| `validateNumber` | `value: any`, `paramName: string`, `options?: { min?, max?, integer? }` | `ValidationResult` | Validate number parameter with range |
| `validateArray` | `value: any`, `paramName: string`, `options?: { minLength?, maxLength?, itemValidator? }` | `ValidationResult` | Validate array parameter |
| `validateEnum` | `value: any`, `paramName: string`, `allowedValues: string[]` | `ValidationResult` | Validate enum/choice parameter |
| `combineResults` | `...results: ValidationResult[]` | `ValidationResult` | Combine multiple validation results |

---

## 10. SessionProblemsService

**File:** `src/services/session-problems-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `logProblem` | `problem: Omit<SessionProblem, 'id' \| 'timestamp'>` | `SessionProblem` | Log a new problem |
| `getProblems` | none | `SessionProblem[]` | Get all problems for current session |
| `getProblemsByCategory` | `category: SessionProblem['category']` | `SessionProblem[]` | Get problems by category |
| `getProblemsBySeverity` | `severity: SessionProblem['severity']` | `SessionProblem[]` | Get problems by severity |
| `generateReport` | none | `SessionProblemsReport` | Generate comprehensive report |
| `exportAsMarkdown` | `report: SessionProblemsReport` | `string` | Export report as markdown |
| `clear` | none | `void` | Clear all problems (start new session) |
| `getStatistics` | none | `object` | Get statistics about logged problems |

---

## 11. QB64PEInstallationService

**File:** `src/services/installation-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `detectInstallation` | none | `Promise<QB64PEInstallation>` | Detect QB64PE installation and PATH configuration |
| `getCommonInstallPaths` | none | `string[]` | Get common installation paths for current platform |
| `getPathConfiguration` | `installPath?: string` | `PathConfiguration` | Generate PATH configuration guidance for current platform |
| `validatePath` | `testPath: string` | `Promise<{ valid: boolean; executable?: string; version?: string }>` | Check if a given path contains QB64PE |
| `generateInstallationGuidance` | `installation: QB64PEInstallation` | `string` | Generate installation guidance message for LLMs |
| `generateInstallationReport` | none | `Promise<string>` | Generate a complete installation report |

---

## 12. QB64PECompatibilityService

**File:** `src/services/compatibility-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `validateCompatibility` | `code: string` | `Promise<CompatibilityIssue[]>` | Validate code for compatibility issues |
| `searchCompatibility` | `query: string` | `Promise<CompatibilitySearchResult[]>` | Search compatibility knowledge base |
| `getBestPractices` | none | `Promise<string[]>` | Get best practices guidance |
| `getDebuggingGuidance` | `issue?: string` | `Promise<string>` | Get debugging guidance (optionally issue-specific) |
| `getPlatformCompatibility` | `platform: string = 'all'` | `Promise<any>` | Get platform compatibility information |

---

## 13. QB64PECompilerService

**File:** `src/services/compiler-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getCompilerOptions` | `platform: string = "all"`, `optionType: string = "all"` | `Promise<CompilerOption[]>` | Get compiler options based on platform and type |
| `getDebuggingHelp` | `issue: string`, `platform: string = "all"` | `Promise<string>` | Get debugging help based on the issue and platform |
| `getCompilerReference` | none | `Promise<string>` | Get complete compiler reference |

---

## 14. ScreenshotViewerGenerator

**File:** `src/services/screenshot-viewer-generator.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `generateViewer` | `options?: ViewerOptions` | `string` | Generate a custom screenshot viewer for specific test cases |
| `generateAutoViewer` | none | `string` | Auto-discover screenshots and generate viewer |
| `generateTestViewer` | `testConfig: TestConfig` | `string` | Generate viewer for specific QB64PE program test |
| `getGenericChecklist` | none | `string[]` | Get generic analysis checklist |
| `getViewerTemplate` | none | `string` | Get the viewer HTML template |

---

## 15. KeywordsService

**File:** `src/services/keywords-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `getKeyword` | `name: string` | `KeywordInfo \| null` | Get information about a specific keyword |
| `getAllKeywords` | none | `Record<string, KeywordInfo>` | Get all keywords |
| `getKeywordsByCategory` | `category: string` | `KeywordInfo[]` | Get keywords by category |
| `getCategories` | none | `Record<string, KeywordCategory>` | Get all categories |
| `searchKeywords` | `query: string`, `maxResults: number = 20` | `KeywordSearchResult[]` | Search keywords with relevance scoring |
| `getAutocomplete` | `prefix: string`, `maxResults: number = 10` | `string[]` | Get autocomplete suggestions |
| `validateKeyword` | `name: string` | `object` | Validate a keyword and get suggestions |
| `getKeywordsByType` | `type: KeywordInfo['type']` | `KeywordInfo[]` | Get keywords by type |
| `getKeywordsByVersion` | `version: KeywordInfo['version']` | `KeywordInfo[]` | Get keywords by version |
| `getDeprecatedKeywords` | none | `KeywordInfo[]` | Get deprecated keywords |
| `regenerateKeywordsData` | none | `void` | Regenerate keywords data from source |
| `getKeywordCount` | none | `number` | Get total keyword count |
| `getOriginalKeywordCount` | none | `number` | Get original keyword count from JSON |
| `getCategoryStats` | none | `Record<string, number>` | Get statistics by category |
| `getKeywordsByTag` | `tag: string` | `KeywordInfo[]` | Get keywords by tag |
| `getQB64PESpecificKeywords` | none | `KeywordInfo[]` | Get QB64PE-specific keywords |
| `getLegacyKeywords` | none | `KeywordInfo[]` | Get legacy keywords |
| `getWikiCategories` | none | `Record<string, string[]>` | Get wiki categories |
| `getWikiCategoryCounts` | none | `Record<string, number>` | Get wiki category counts |
| `getKeywordsByWikiCategory` | `category: string` | `string[]` | Get keywords by wiki category |
| `getWikiCategoryNames` | none | `string[]` | Get wiki category names |
| `searchWikiCategories` | `query: string` | `string[]` | Search wiki categories |

---

## 16. QB64PEWikiService

**File:** `src/services/wiki-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `searchWiki` | `query: string`, `category?: string` | `Promise<WikiSearchResult[]>` | Search the QB64PE wiki for content |
| `getPageContent` | `pageTitle: string`, `includeExamples: boolean = true` | `Promise<string>` | Get detailed content from a specific wiki page |
| `getWikiIndex` | none | `Promise<string>` | Get the wiki index/overview |

---

## 17. QB64PEExecutionService

**File:** `src/services/execution-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `analyzeExecutionMode` | `sourceCode: string` | `ExecutionState` | Analyze QB64PE source code to determine execution characteristics |
| `getExecutionGuidance` | `executionState: ExecutionState` | `ExecutionGuidance` | Get execution guidance based on program characteristics |
| `getProcessMonitoringCommands` | `processName: string = 'qb64pe'` | `string[]` | Generate cross-platform process monitoring commands |
| `getProcessTerminationCommands` | `pid: number` | `string[]` | Generate cross-platform process termination commands |
| `generateMonitoringTemplate` | `originalCode: string` | `string` | Generate QB64PE code template for logging and screenshots |
| `generateConsoleFormattingTemplate` | none | `string` | Generate improved console output template with formatting |
| `getRealTimeMonitoringGuidance` | none | `string` | Get real-time execution monitoring guidance |
| `parseConsoleOutput` | `output: string` | `object` | Parse console output for completion signals |
| `getFileMonitoringCommands` | `logFile: string` | `string[]` | Get file monitoring utilities for log tailing |

---

## 18. QB64PELoggingService

**File:** `src/services/logging-service.ts`

### Public Methods

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `injectNativeLogging` | `sourceCode: string`, `config?: Partial<LoggingConfiguration>` | `string` | Inject native QB64PE logging functions into source code |
| `generateStructuredOutput` | `sections: string[]`, `includeLogging: boolean = true`, `config?: Partial<LoggingConfiguration>` | `string` | Generate structured output sections for systematic debugging |
| `enhanceCodeWithLogging` | `sourceCode: string`, `config?: Partial<LoggingConfiguration>` | `string` | Enhance existing QB64PE code with comprehensive logging |
| `parseStructuredOutput` | `output: string` | `StructuredOutput` | Parse structured output from QB64PE program execution |
| `generateAdvancedDebuggingTemplate` | `programName: string`, `analysisSteps: string[]`, `config?: Partial<LoggingConfiguration>` | `string` | Generate debugging template with advanced logging |
| `generateEchoFunctions` | `config?: Partial<LoggingConfiguration>` | `string` | Generate native _ECHO usage guide |
| `generateOutputCaptureCommand` | `programPath: string`, `outputPath: string = 'analysis_output.txt'` | `string` | Generate shell command for output capture |
| `generateFileMonitoringCommands` | `logFile: string` | `Record<string, string>` | Generate file monitoring commands for cross-platform use |

---

## Summary Statistics

- **Total Services:** 18
- **Total Public Methods:** 141
- **Average Methods per Service:** ~7.8

## Key Method Patterns

### Validation Methods
- `validate*` - Perform validation and return structured results
- `check*` - Boolean checks or simple validations

### Query/Search Methods
- `search*` - Search with relevance scoring
- `get*` - Retrieve specific data
- `find*` - Locate specific items

### Generation Methods
- `generate*` - Create code, templates, or documentation
- `create*` - Instantiate new objects or sessions

### Analysis Methods
- `analyze*` - Examine code or data structure
- `parse*` - Extract structured information

### Monitoring Methods
- `start*` / `stop*` - Control monitoring processes
- `getStatus` - Query current state

## Common Parameter Patterns

1. **String parameters** - Most methods accept `string` for code, queries, paths
2. **Optional configuration** - Many use `options?: Partial<ConfigType>`
3. **Limits** - Search/query methods typically have `maxResults` or `limit` parameters
4. **Async patterns** - File I/O and external services return `Promise<T>`

## Return Type Patterns

1. **Structured results** - Most return interfaces like `ValidationResult`, `CompatibilityIssue[]`
2. **Strings** - Documentation and templates return formatted strings (Markdown, code)
3. **Arrays** - Collections return `T[]` with consistent typing
4. **Booleans** - Simple checks return `boolean` or structured `{ isValid: boolean; ... }`

---

*This reference was auto-generated from TypeScript source files. For detailed parameter types and interfaces, refer to the individual service files.*
