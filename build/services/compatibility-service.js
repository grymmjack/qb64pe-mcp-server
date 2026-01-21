"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QB64PECompatibilityService = void 0;
const search_service_js_1 = require("./search-service.js");
/**
 * Service for QB64PE compatibility knowledge and validation
 */
class QB64PECompatibilityService {
    compatibilityRules;
    knowledgeBase; // Will be loaded from JSON
    searchService;
    constructor() {
        this.compatibilityRules = this.initializeRules();
        this.knowledgeBase = this.loadKnowledgeBase();
        this.searchService = new search_service_js_1.CompatibilitySearchService();
    }
    /**
     * Initialize compatibility validation rules
     */
    initializeRules() {
        // Load patterns from JSON file
        const jsonPatterns = this.loadPatternsFromJson();
        // Convert JSON patterns to CompatibilityRule objects
        const rules = [];
        if (jsonPatterns && jsonPatterns.patterns) {
            for (const [key, patternObj] of Object.entries(jsonPatterns.patterns)) {
                if (patternObj && typeof patternObj === 'object' &&
                    'regex' in patternObj && 'message' in patternObj) {
                    const pattern = patternObj;
                    rules.push({
                        pattern: new RegExp(pattern.regex, 'gi'),
                        severity: pattern.severity || 'error',
                        category: key,
                        message: pattern.message,
                        suggestion: pattern.suggestion || '',
                        examples: pattern.examples ? {
                            incorrect: pattern.examples.incorrect || '',
                            correct: pattern.examples.correct || ''
                        } : undefined
                    });
                }
            }
        }
        // Also include hardcoded rules for backwards compatibility
        return [
            ...rules,
            {
                pattern: /FUNCTION\s+(\w+)\s*\([^)]*\)\s+AS\s+(\w+)/gi,
                severity: 'error',
                category: 'function_return_types',
                message: 'Function return types must use type sigils, not AS clauses',
                suggestion: 'Use FUNCTION {name}{sigil}({params}) instead of FUNCTION {name}({params}) AS {type}',
                examples: {
                    incorrect: 'FUNCTION NearestPaletteIndex(r AS INTEGER, g AS INTEGER, b AS INTEGER) AS INTEGER',
                    correct: 'FUNCTION NearestPaletteIndex%(r AS INTEGER, g AS INTEGER, b AS INTEGER)'
                }
            },
            {
                pattern: /\$CONSOLE\s*:\s*OFF/gi,
                severity: 'error',
                category: 'console_directives',
                message: '$CONSOLE:OFF is not valid syntax',
                suggestion: 'Use $CONSOLE or $CONSOLE:ONLY instead',
                examples: {
                    incorrect: '$CONSOLE:OFF',
                    correct: '$CONSOLE'
                }
            },
            {
                pattern: /IF\s+[^\n]+\s+THEN\s+[^\n]+:\s*IF\s+[^\n]+\s+THEN/gi,
                severity: 'warning',
                category: 'multi_statement_lines',
                message: 'Chained IF statements on one line can cause parsing errors',
                suggestion: 'Split IF statements onto separate lines',
                examples: {
                    incorrect: 'IF r < 0 THEN r = 0: IF r > 255 THEN r = 255',
                    correct: 'IF r < 0 THEN r = 0\\nIF r > 255 THEN r = 255'
                }
            },
            {
                pattern: /DIM\s+\w+\s*\([^)]+\)\s+AS\s+\w+\s*,\s*\w+\s*\([^)]+\)\s+AS\s+\w+/gi,
                severity: 'error',
                category: 'array_declarations',
                message: 'Multiple array declarations with dimensions on one line not supported',
                suggestion: 'Declare each array on a separate line',
                examples: {
                    incorrect: 'DIM er#(0 TO w) AS DOUBLE, eg#(0 TO w) AS DOUBLE, eb#(0 TO w) AS DOUBLE',
                    correct: 'DIM er(0 TO w) AS DOUBLE\\nDIM eg(0 TO w) AS DOUBLE\\nDIM eb(0 TO w) AS DOUBLE'
                }
            },
            {
                pattern: /DIM\s+\w+\s+AS\s+\w+:\s*\w+\s*=/gi,
                severity: 'warning',
                category: 'variable_operations',
                message: 'Combining declarations and assignments can cause parsing issues',
                suggestion: 'Separate variable declarations and assignments onto different lines',
                examples: {
                    incorrect: 'DIM oldS AS LONG: oldS = _SOURCE: _SOURCE img',
                    correct: 'DIM oldS AS LONG\\noldS = _SOURCE\\n_SOURCE img'
                }
            },
            {
                pattern: /\b(_WORD\$|_TRIM\$)\b/gi,
                severity: 'error',
                category: 'missing_functions',
                message: 'Function does not exist in QB64PE',
                suggestion: 'Use built-in string functions like INSTR, MID$, LEFT$, RIGHT$ instead',
                examples: {
                    incorrect: 'r = VAL(_TRIM$(_WORD$(line$, 1, " ")))',
                    correct: 'pos1 = INSTR(line$, " ")\\nIF pos1 > 0 THEN r = VAL(LEFT$(line$, pos1 - 1))'
                }
            },
            {
                pattern: /\b(DEF\s+FN|TRON|TROFF|SETMEM|SIGNAL|ERDEV|ERDEV\$|FILEATTR|FRE|IOCTL|IOCTL\$)\b/gi,
                severity: 'error',
                category: 'legacy_keywords',
                message: 'Legacy BASIC keyword not supported in QB64PE',
                suggestion: 'Use modern QB64PE alternatives',
                examples: {
                    incorrect: 'DEF FN Square(x) = x * x',
                    correct: 'FUNCTION Square%(x AS INTEGER)\\n    Square% = x * x\\nEND FUNCTION'
                }
            },
            {
                pattern: /\b(ON\s+PEN|PEN\s+(ON|OFF|STOP)|ON\s+PLAY\(\d+\)|PLAY\(\d+\)\s+(ON|OFF|STOP)|ON\s+UEVENT|UEVENT)\b/gi,
                severity: 'error',
                category: 'device_access',
                message: 'Device access keyword not supported in QB64PE',
                suggestion: 'Use modern QB64PE input/output methods',
                examples: {
                    incorrect: 'ON PEN GOSUB HandlePen',
                    correct: 'Use _MOUSEINPUT and _MOUSEBUTTON for mouse input'
                }
            },
            {
                pattern: /OPEN\s+"(LPT\d*:|CON:|KBRD:)/gi,
                severity: 'error',
                category: 'device_open',
                message: 'Device OPEN statements not supported in QB64PE',
                suggestion: 'Use LPRINT for printer output or modern I/O methods',
                examples: {
                    incorrect: 'OPEN "LPT1:" FOR OUTPUT AS #1',
                    correct: 'LPRINT "text to printer"'
                }
            },
            {
                pattern: /\b(_ACCEPTFILEDROP|_TOTALDROPPEDFILES|_DROPPEDFILE|_FINISHDROP|_SCREENPRINT|_SCREENCLICK|_WINDOWHANDLE)\b/gi,
                severity: 'warning',
                category: 'platform_specific',
                message: 'Function may not be available on all platforms (Linux/macOS)',
                suggestion: 'Check platform compatibility or provide alternatives',
                examples: {
                    incorrect: '_SCREENPRINT',
                    correct: 'Check IF _OS$ = "WINDOWS" before using Windows-specific functions'
                }
            },
            {
                pattern: /\b(_CONSOLETITLE|_CONSOLECURSOR|_CONSOLEFONT|_CONSOLEINPUT|_CINP)\b/gi,
                severity: 'warning',
                category: 'console_platform',
                message: 'Console function may not be available on Linux/macOS',
                suggestion: 'Use standard INPUT/PRINT or check platform compatibility',
                examples: {
                    incorrect: '_CONSOLETITLE "My Program"',
                    correct: '_TITLE "My Program"  \' Use _TITLE instead'
                }
            },
            {
                pattern: /\b(CHAIN|RUN)\b/gi,
                severity: 'warning',
                category: 'program_control',
                message: 'Program control statement may not be available on Linux/macOS',
                suggestion: 'Use SHELL or restructure program logic',
                examples: {
                    incorrect: 'CHAIN "otherprog.bas"',
                    correct: 'SHELL "qb64pe otherprog.bas"'
                }
            },
            {
                pattern: /(?:SUB|FUNCTION)\s+\w+[\s\S]*?\w+\s*=\s*\w+[\s\S]*?(?=END\s+(?:SUB|FUNCTION))/gi,
                severity: 'warning',
                category: 'variable_scope',
                message: 'Potential variable scope issue - accessing variables that may not be in scope',
                suggestion: 'Use DIM SHARED for variables that need to be accessed across SUB/FUNCTION boundaries',
                examples: {
                    incorrect: 'SUB MyProc\n    globalVar = 10  \' Error: may not be in scope',
                    correct: 'DIM SHARED globalVar AS INTEGER\nSUB MyProc\n    globalVar = 10  \' Now accessible'
                }
            },
            {
                pattern: /DIM\s+\w+\s*\(\s*[a-zA-Z]\w*\s*(?:TO\s+[a-zA-Z]\w*)?\s*\)\s+AS/gi,
                severity: 'warning',
                category: 'dynamic_arrays',
                message: 'Dynamic array without $DYNAMIC directive may cause issues',
                suggestion: 'Add \'$DYNAMIC or use static array bounds with constants',
                examples: {
                    incorrect: 'DIM arr(size) AS INTEGER  \' Without $DYNAMIC',
                    correct: '\'$DYNAMIC\nDIM arr() AS INTEGER\nREDIM arr(size)'
                }
            },
            {
                pattern: /SHARED\s+(?!.*DIM)\w+/gi,
                severity: 'error',
                category: 'shared_syntax',
                message: 'SHARED keyword must be used with DIM statement',
                suggestion: 'Use \'DIM SHARED variableName AS type\' instead of \'SHARED variableName\'',
                examples: {
                    incorrect: 'SHARED myVar',
                    correct: 'DIM SHARED myVar AS INTEGER'
                }
            },
            {
                pattern: /(?:SUB|FUNCTION)\s+\w+[\s\S]*?DIM\s+(?!SHARED)\w+[\s\S]*?(?=\bEND\s+(?:SUB|FUNCTION))/gi,
                severity: 'info',
                category: 'variable_shadowing',
                message: 'Local variable may shadow a SHARED variable with the same name',
                suggestion: 'Use unique variable names in local scope or explicitly reference SHARED variables',
                examples: {
                    incorrect: 'DIM SHARED count AS INTEGER\nSUB Process\n    DIM count AS INTEGER  \' Shadows global',
                    correct: 'DIM SHARED count AS INTEGER\nSUB Process\n    DIM localCount AS INTEGER  \' Unique name'
                }
            },
            {
                pattern: /\b(TRUE|FALSE)\b(?!\s*=)/gi,
                severity: 'warning',
                category: 'boolean_constants',
                message: 'TRUE and FALSE are not built-in constants in QB64PE',
                suggestion: 'Use _TRUE (-1) and _FALSE (0) which are reserved words, or define your own: CONST TRUE = -1, FALSE = 0',
                examples: {
                    incorrect: 'MARQUEE_draw TRUE\nIF condition = FALSE THEN',
                    correct: 'MARQUEE_draw _TRUE\nIF condition = _FALSE THEN\n\' Or: CONST TRUE = -1, FALSE = 0'
                }
            },
            {
                pattern: /^\s*DECLARE\s+(SUB|FUNCTION)\s+\w+(?!.*LIBRARY)/gmi,
                severity: 'info',
                category: 'unnecessary_declarations',
                message: 'DECLARE SUB/FUNCTION is unnecessary in QB64PE - procedures are automatically available',
                suggestion: 'Remove DECLARE statements. QB64PE handles forward references automatically. DECLARE is only needed for DECLARE LIBRARY (C library imports).',
                examples: {
                    incorrect: 'DECLARE SUB MyProcedure\nDECLARE FUNCTION Calculate%',
                    correct: 'SUB MyProcedure\n    PRINT "Hello"\nEND SUB\n\n\' DECLARE only for C libraries:\nDECLARE LIBRARY\n    FUNCTION c_func&\nEND DECLARE'
                }
            }
        ];
    }
    /**
     * Load patterns from JSON file
     */
    loadPatternsFromJson() {
        try {
            const fs = require('fs');
            const path = require('path');
            const jsonPath = path.join(__dirname, '../data/compatibility-rules.json');
            const content = fs.readFileSync(jsonPath, 'utf8');
            return JSON.parse(content);
        }
        catch (error) {
            console.error('Error loading compatibility patterns from JSON:', error);
            return null;
        }
    }
    /**
     * Load knowledge base from embedded data
     */
    loadKnowledgeBase() {
        // For now, return a structured representation of the knowledge
        // In a real implementation, this could load from the JSON file
        return {
            categories: {
                function_return_types: {
                    title: "Function Return Type Declaration",
                    description: "QB64PE doesn't support AS TYPE syntax for function return types",
                    typeSigils: {
                        "%": "INTEGER",
                        "&": "LONG",
                        "!": "SINGLE",
                        "#": "DOUBLE",
                        "$": "STRING"
                    }
                },
                console_directives: {
                    title: "Console Mode Directives",
                    description: "Valid console directive syntax in QB64PE",
                    validDirectives: {
                        "$CONSOLE": "Shows both console and graphics windows",
                        "$CONSOLE:ONLY": "Console mode only (no graphics)"
                    }
                },
                unsupported_keywords: {
                    title: "Unsupported Keywords and Statements",
                    legacy: [
                        "ALIAS", "ANY", "BYVAL", "CALLS", "CDECL", "DECLARE",
                        "DEF FN", "EXIT DEF", "END DEF", "ERDEV", "ERDEV$",
                        "FILEATTR", "FRE", "IOCTL", "IOCTL$"
                    ],
                    device: [
                        "ON PEN", "PEN", "ON PLAY(n)", "PLAY(n) ON/OFF/STOP",
                        "ON UEVENT", "UEVENT", "SETMEM", "SIGNAL", "TRON", "TROFF"
                    ]
                },
                variable_scoping: {
                    title: "Variable Scoping and SHARED Variables",
                    description: "QB64PE variable scoping rules and SHARED variable usage",
                    scopeRules: {
                        local: "Variables in SUB/FUNCTION are local by default",
                        global: "Variables in main program are global",
                        shared: "Use DIM SHARED or SHARED to access global variables in procedures"
                    },
                    commonIssues: [
                        "Accessing variables without proper SHARED declaration",
                        "Missing $DYNAMIC directive for dynamic arrays",
                        "Using SHARED without DIM statement",
                        "Local variables shadowing SHARED variables"
                    ]
                },
                dynamic_arrays: {
                    title: "Dynamic Array Management",
                    description: "Proper usage of dynamic arrays in QB64PE",
                    directive: "$DYNAMIC must be used before dynamic array declarations",
                    syntax: {
                        static: "DIM arrayName(constantSize) AS type",
                        dynamic: "'$DYNAMIC\\nDIM arrayName() AS type\\nREDIM arrayName(variableSize)"
                    }
                },
                best_practices: [
                    "Keep it simple: Avoid complex multi-statement lines",
                    "One operation per line: Especially for declarations and assignments",
                    "Use type sigils: For function return types instead of AS clauses",
                    "Initialize early: Set up arrays and variables before use",
                    "Test incrementally: Build up complexity gradually",
                    "Separate concerns: Split complex operations into multiple lines",
                    "Use standard functions: Stick to well-documented QB64PE functions",
                    "Boolean values: Use _TRUE (-1) and _FALSE (0) reserved words, or define your own constants",
                    "No DECLARE needed: SUBs/FUNCTIONs are auto-available. DECLARE is only for C library imports (DECLARE LIBRARY)"
                ],
                boolean_constants: {
                    title: "Boolean Values in QB64PE",
                    description: "QB64PE provides _TRUE and _FALSE as reserved words that evaluate to boolean values",
                    reservedWords: {
                        _TRUE: "-1 (all bits set to 1) - ALWAYS available as reserved word",
                        _FALSE: "0 (all bits set to 0) - ALWAYS available as reserved word"
                    },
                    userDefinedConstants: {
                        note: "TRUE and FALSE are NOT built-in, but you can define them",
                        syntax: "CONST TRUE = -1, FALSE = 0",
                        alternative: "Use _TRUE and _FALSE which are always available"
                    },
                    examples: {
                        recommended: [
                            "IF flag = _TRUE THEN",
                            "MARQUEE_draw _TRUE",
                            "result = _FALSE"
                        ],
                        userDefined: [
                            "CONST TRUE = -1, FALSE = 0",
                            "IF flag = TRUE THEN  ' Now works",
                            "result = FALSE  ' Now works"
                        ],
                        numeric: [
                            "IF flag = -1 THEN  ' Direct numeric comparison",
                            "result = 0  ' Direct numeric assignment"
                        ]
                    },
                    rationale: "QB64PE provides _TRUE and _FALSE as reserved words. Traditional TRUE/FALSE are not built-in but can be defined by users. The value -1 represents true (all bits 1) and 0 represents false, following BASIC convention."
                },
                unnecessary_declarations: {
                    title: "DECLARE Statement Usage in QB64PE",
                    description: "QB64PE handles forward references automatically - DECLARE is only for C library imports",
                    rules: {
                        subs: "DECLARE SUB is NOT needed - SUBs are automatically available throughout the program",
                        functions: "DECLARE FUNCTION is NOT needed - FUNCTIONs are automatically available",
                        forward_reference: "SUBs and FUNCTIONs can be called before they are defined without any DECLARE",
                        c_libraries: "DECLARE LIBRARY ... END DECLARE is ONLY for importing C library functions"
                    },
                    examples: {
                        incorrect: [
                            "DECLARE SUB MyProcedure",
                            "DECLARE FUNCTION Calculate% (x AS INTEGER)",
                            "' These are unnecessary in QB64PE"
                        ],
                        correct: [
                            "' No DECLARE needed - just define:",
                            "SUB MyProcedure",
                            "    PRINT \"Hello\"",
                            "END SUB",
                            "",
                            "FUNCTION Calculate% (x AS INTEGER)",
                            "    Calculate% = x * 2",
                            "END FUNCTION",
                            "",
                            "' DECLARE only for C libraries:",
                            "DECLARE LIBRARY",
                            "    FUNCTION my_c_function& (x AS LONG)",
                            "END DECLARE"
                        ]
                    },
                    rationale: "QB64PE's modern parser handles all forward references automatically. DECLARE statements are only needed for DECLARE LIBRARY blocks when importing C library functions."
                }
            }
        };
    }
    /**
     * Validate code for compatibility issues
     */
    async validateCompatibility(code) {
        const issues = [];
        const lines = code.split('\\n');
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            this.compatibilityRules.forEach(rule => {
                rule.pattern.lastIndex = 0; // Reset regex state
                const match = rule.pattern.exec(line);
                if (match) {
                    issues.push({
                        line: lineNum,
                        column: match.index + 1,
                        pattern: match[0],
                        message: rule.message,
                        severity: rule.severity,
                        category: rule.category,
                        suggestion: rule.suggestion,
                        examples: rule.examples
                    });
                }
            });
        });
        return issues;
    }
    /**
     * Search compatibility knowledge base
     */
    async searchCompatibility(query) {
        // Use the search service for enhanced search capabilities
        const searchResults = await this.searchService.search(query);
        const results = searchResults.map(result => ({
            category: result.document.category,
            title: result.document.title,
            description: result.document.content,
            issues: [{
                    pattern: result.matches.join(', '),
                    message: result.document.content,
                    suggestion: `See ${result.document.title} for details`,
                    examples: result.document.metadata?.examples ?
                        result.document.metadata.examples.map((ex) => ({
                            incorrect: ex,
                            correct: "See documentation for correct syntax"
                        })) : undefined
                }]
        }));
        // Also search through knowledge base categories (legacy search)
        const queryLower = query.toLowerCase();
        Object.entries(this.knowledgeBase.categories).forEach(([categoryKey, categoryData]) => {
            if (categoryKey.toLowerCase().includes(queryLower) ||
                categoryData.title?.toLowerCase().includes(queryLower) ||
                categoryData.description?.toLowerCase().includes(queryLower)) {
                const existingResult = results.find(r => r.category === categoryKey);
                if (!existingResult) {
                    const issues = this.compatibilityRules
                        .filter(rule => rule.category === categoryKey)
                        .map(rule => ({
                        pattern: rule.pattern.source,
                        message: rule.message,
                        suggestion: rule.suggestion,
                        examples: rule.examples ? [rule.examples] : undefined
                    }));
                    results.push({
                        category: categoryKey,
                        title: categoryData.title || categoryKey,
                        description: categoryData.description || '',
                        issues
                    });
                }
            }
        });
        return results;
    }
    /**
     * Get best practices guidance
     */
    async getBestPractices() {
        return this.knowledgeBase.categories.best_practices || [];
    }
    /**
     * Get debugging guidance
     */
    async getDebuggingGuidance(issue) {
        const baseGuidance = `
# QB64PE Debugging Guide

## Traditional Error Handling
\`\`\`basic
ON ERROR GOTO ErrorHandler
' Your code here
OPEN "file.txt" FOR INPUT AS #1
END

ErrorHandler:
    PRINT "Error"; ERR; "occurred at line"; _ERRORLINE
    RESUME NEXT
\`\`\`

## Modern Assertions (QB64PE v4.0.0+)
\`\`\`basic
$ASSERTS:CONSOLE
_ASSERT x > 0, "X must be positive"
_ASSERT LEN(filename$) > 0, "Filename cannot be empty"
\`\`\`

## Console Debugging
\`\`\`basic
$CONSOLE
_DEST _CONSOLE
PRINT "Debug: Variable x ="; x
_DEST 0
\`\`\`

## Modern Logging (QB64PE v4.0.0+)
\`\`\`basic
_LOGERROR "Critical error occurred"
_LOGWARN "Warning: Using default values"
_LOGINFO "Processing file: " + filename$
_LOGTRACE "Function called with: " + STR$(value)
\`\`\`
`;
        if (issue) {
            const specificGuidance = this.getSpecificDebuggingGuidance(issue);
            return baseGuidance + "\\n\\n## Specific Guidance\\n" + specificGuidance;
        }
        return baseGuidance;
    }
    /**
     * Get specific debugging guidance for an issue
     */
    getSpecificDebuggingGuidance(issue) {
        const issueLower = issue.toLowerCase();
        if (issueLower.includes('function') || issueLower.includes('return')) {
            return "- Check function return type sigils (%, &, !, #, $)\\n- Verify all functions end with END FUNCTION\\n- Ensure function name matches in declaration and assignment";
        }
        if (issueLower.includes('array') || issueLower.includes('subscript')) {
            return "- Check array bounds with LBOUND and UBOUND\\n- Ensure arrays are DIMmed before use\\n- Verify array indices are within valid range";
        }
        if (issueLower.includes('file') || issueLower.includes('open')) {
            return "- Use FREEFILE to get available file numbers\\n- Check file exists before opening\\n- Always close files when done\\n- Use ON ERROR for file operation error handling";
        }
        if (issueLower.includes('syntax') || issueLower.includes('expected')) {
            return "- Check for unmatched quotes or parentheses\\n- Avoid multi-statement lines with control structures\\n- Separate variable declarations from assignments\\n- Use proper type sigils for functions";
        }
        if (issueLower.includes('scope') || issueLower.includes('shared') || issueLower.includes('variable')) {
            return "- Use DIM SHARED for variables accessed across procedures\\n- Add SHARED declaration in SUB/FUNCTION for global variables\\n- Check that variables are declared before use\\n- Avoid variable name conflicts between local and global scope";
        }
        if (issueLower.includes('array') || issueLower.includes('dynamic')) {
            return "- Use '$DYNAMIC directive before dynamic array declarations\\n- Ensure arrays are properly shared with DIM SHARED\\n- Check array bounds and initialization\\n- Use REDIM for dynamic array resizing";
        }
        return "- Add debug PRINT statements to trace program flow\\n- Use $CONSOLE for real-time debug output\\n- Check variable values at key points\\n- Test smaller code sections incrementally";
    }
    /**
     * Get platform compatibility information
     */
    async getPlatformCompatibility(platform = 'all') {
        const platformInfo = {
            windows: {
                supported: "Full QB64PE feature support",
                unsupported: [],
                notes: "Windows has the most complete feature set"
            },
            linux: {
                supported: "Most QB64PE features except Windows-specific ones",
                unsupported: [
                    "_ACCEPTFILEDROP", "_TOTALDROPPEDFILES", "_DROPPEDFILE", "_FINISHDROP",
                    "_SCREENPRINT", "_SCREENCLICK", "_WINDOWHANDLE",
                    "_CONSOLETITLE", "_CONSOLECURSOR", "_CONSOLEFONT",
                    "LPRINT", "_PRINTIMAGE", "OPEN COM", "LOCK", "UNLOCK"
                ],
                notes: "Console operations and some hardware access not available"
            },
            macos: {
                supported: "Most QB64PE features except Windows-specific ones",
                unsupported: [
                    "_ACCEPTFILEDROP", "_TOTALDROPPEDFILES", "_DROPPEDFILE", "_FINISHDROP",
                    "_SCREENPRINT", "_SCREENCLICK", "_WINDOWHASFOCUS", "_WINDOWHANDLE",
                    "_CONSOLETITLE", "_CONSOLECURSOR", "_CONSOLEFONT",
                    "LPRINT", "_PRINTIMAGE", "OPEN COM", "LOCK", "UNLOCK"
                ],
                notes: "Similar to Linux with some differences in window handling"
            }
        };
        return platform === 'all' ? platformInfo : platformInfo[platform] || platformInfo.windows;
    }
}
exports.QB64PECompatibilityService = QB64PECompatibilityService;
//# sourceMappingURL=compatibility-service.js.map