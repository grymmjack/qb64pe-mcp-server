import { CompatibilitySearchService } from './search-service.js';

export interface CompatibilityIssue {
  line: number;
  column: number;
  pattern: string;
  message: string;
  severity: 'error' | 'warning';
  category: string;
  suggestion: string;
  examples?: {
    incorrect: string;
    correct: string;
  };
}

export interface CompatibilityRule {
  pattern: RegExp;
  severity: 'error' | 'warning';
  category: string;
  message: string;
  suggestion: string;
  examples?: {
    incorrect: string;
    correct: string;
  };
}

export interface CompatibilitySearchResult {
  category: string;
  title: string;
  description: string;
  issues: Array<{
    pattern: string;
    message: string;
    suggestion: string;
    examples?: Array<{
      incorrect: string;
      correct: string;
    }>;
  }>;
}

/**
 * Service for QB64PE compatibility knowledge and validation
 */
export class QB64PECompatibilityService {
  private compatibilityRules: CompatibilityRule[];
  private knowledgeBase: any; // Will be loaded from JSON
  private searchService: CompatibilitySearchService;

  constructor() {
    this.compatibilityRules = this.initializeRules();
    this.knowledgeBase = this.loadKnowledgeBase();
    this.searchService = new CompatibilitySearchService();
  }

  /**
   * Initialize compatibility validation rules
   */
  private initializeRules(): CompatibilityRule[] {
    // Load patterns from JSON file
    const jsonPatterns = this.loadPatternsFromJson();
    
    // Convert JSON patterns to CompatibilityRule objects
    const rules: CompatibilityRule[] = [];
    
    if (jsonPatterns && jsonPatterns.patterns) {
      for (const [key, patternObj] of Object.entries(jsonPatterns.patterns)) {
        if (patternObj && typeof patternObj === 'object' && 
            'regex' in patternObj && 'message' in patternObj) {
          const pattern = patternObj as any;
          rules.push({
            pattern: new RegExp(pattern.regex, 'gi'),
            severity: (pattern.severity as 'error' | 'warning') || 'error',
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
      }
    ];
  }

  /**
   * Load patterns from JSON file
   */
  private loadPatternsFromJson(): any {
    try {
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(__dirname, '../data/compatibility-rules.json');
      const content = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading compatibility patterns from JSON:', error);
      return null;
    }
  }

  /**
   * Load knowledge base from embedded data
   */
  private loadKnowledgeBase(): any {
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
        best_practices: [
          "Keep it simple: Avoid complex multi-statement lines",
          "One operation per line: Especially for declarations and assignments",
          "Use type sigils: For function return types instead of AS clauses",
          "Initialize early: Set up arrays and variables before use",
          "Test incrementally: Build up complexity gradually",
          "Separate concerns: Split complex operations into multiple lines",
          "Use standard functions: Stick to well-documented QB64PE functions"
        ]
      }
    };
  }

  /**
   * Validate code for compatibility issues
   */
  async validateCompatibility(code: string): Promise<CompatibilityIssue[]> {
    const issues: CompatibilityIssue[] = [];
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
  async searchCompatibility(query: string): Promise<CompatibilitySearchResult[]> {
    // Use the search service for enhanced search capabilities
    const searchResults = await this.searchService.search(query);
    
    const results: CompatibilitySearchResult[] = searchResults.map(result => ({
      category: result.document.category,
      title: result.document.title,
      description: result.document.content,
      issues: [{
        pattern: result.matches.join(', '),
        message: result.document.content,
        suggestion: `See ${result.document.title} for details`,
        examples: result.document.metadata?.examples ? 
          result.document.metadata.examples.map((ex: string) => ({
            incorrect: ex,
            correct: "See documentation for correct syntax"
          })) : undefined
      }]
    }));

    // Also search through knowledge base categories (legacy search)
    const queryLower = query.toLowerCase();
    Object.entries(this.knowledgeBase.categories).forEach(([categoryKey, categoryData]: [string, any]) => {
      if (
        categoryKey.toLowerCase().includes(queryLower) ||
        categoryData.title?.toLowerCase().includes(queryLower) ||
        categoryData.description?.toLowerCase().includes(queryLower)
      ) {
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
  async getBestPractices(): Promise<string[]> {
    return this.knowledgeBase.categories.best_practices || [];
  }

  /**
   * Get debugging guidance
   */
  async getDebuggingGuidance(issue?: string): Promise<string> {
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
  private getSpecificDebuggingGuidance(issue: string): string {
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
    
    return "- Add debug PRINT statements to trace program flow\\n- Use $CONSOLE for real-time debug output\\n- Check variable values at key points\\n- Test smaller code sections incrementally";
  }

  /**
   * Get platform compatibility information
   */
  async getPlatformCompatibility(platform: string = 'all'): Promise<any> {
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

    return platform === 'all' ? platformInfo : platformInfo[platform as keyof typeof platformInfo] || platformInfo.windows;
  }
}
