export interface SyntaxValidationResult {
  isValid: boolean;
  errors: SyntaxError[];
  warnings: SyntaxWarning[];
  suggestions: string[];
  score: number; // 0-100 syntax quality score
}

export interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  suggestion?: string;
}

export interface SyntaxWarning {
  line: number;
  column: number;
  message: string;
  rule: string;
  suggestion: string;
}

/**
 * Service for QB64PE syntax validation and analysis
 */
export class QB64PESyntaxService {
  private readonly qb64Keywords: Set<string> = new Set([
    // Core statements
    'PRINT', 'INPUT', 'DIM', 'FOR', 'NEXT', 'IF', 'THEN', 'ELSE', 'END', 'SUB', 'FUNCTION',
    'WHILE', 'WEND', 'DO', 'LOOP', 'SELECT', 'CASE', 'GOTO', 'GOSUB', 'RETURN', 'EXIT',
    
    // Data types
    'INTEGER', 'LONG', 'SINGLE', 'DOUBLE', 'STRING', 'BYTE', '_BYTE', '_INTEGER64',
    '_FLOAT', '_UNSIGNED', 'AS', 'TYPE', 'CONST', 'STATIC', 'SHARED', 'REDIM',
    
    // Operators
    'AND', 'OR', 'XOR', 'NOT', 'MOD', 'EQV', 'IMP',
    
    // QB64PE specific
    '_DISPLAY', '_AUTODISPLAY', '_CONSOLE', '_SCREENMOVE', '_RESIZE', '_TITLE',
    '_ICON', '_RGB', '_RGB32', '_RGBA', '_RGBA32', '_ALPHA', '_RED', '_GREEN', '_BLUE',
    '_NEWIMAGE', '_FREEIMAGE', '_PUTIMAGE', '_SOURCE', '_DEST', '_WIDTH', '_HEIGHT',
    '_MOUSEX', '_MOUSEY', '_MOUSEBUTTON', '_MOUSEINPUT', '_KEYHIT', '_KEYDOWN',
    '_SNDOPEN', '_SNDPLAY', '_SNDSTOP', '_SNDCLOSE', '_SNDVOL',
    
    // File operations
    'OPEN', 'CLOSE', 'GET', 'PUT', 'SEEK', 'LOF', 'EOF', 'FREEFILE',
    
    // Math functions
    'ABS', 'ATN', 'COS', 'EXP', 'FIX', 'INT', 'LOG', 'RND', 'SGN', 'SIN', 'SQR', 'TAN',
    
    // String functions
    'ASC', 'CHR$', 'INSTR', 'LCASE$', 'LEFT$', 'LEN', 'LTRIM$', 'MID$', 'RIGHT$', 
    'RTRIM$', 'SPACE$', 'STR$', 'STRING$', 'TRIM$', 'UCASE$', 'VAL',
    
    // Date/Time
    'DATE$', 'TIME$', 'TIMER',
    
    // Graphics
    'CLS', 'COLOR', 'LOCATE', 'PSET', 'PRESET', 'LINE', 'CIRCLE', 'PAINT', 'DRAW', 'VIEW', 'WINDOW',
    'SCREEN', 'PALETTE', 'POINT'
  ]);

  private readonly nonQB64Constructs: Array<{pattern: RegExp, message: string, suggestion: string}> = [
    {
      pattern: /\bMsgBox\b/gi,
      message: "MsgBox is Visual Basic syntax, not QB64PE",
      suggestion: "Use INPUT or PRINT statements instead"
    },
    {
      pattern: /\bDeclare\s+Function\b/gi,
      message: "VB-style Declare Function syntax not used in QB64PE",
      suggestion: "Use $INCLUDE or built-in QB64PE functions"
    },
    {
      pattern: /\bByVal\b|\bByRef\b/gi,
      message: "ByVal/ByRef are Visual Basic keywords",
      suggestion: "QB64PE passes by value by default, use BYVAL only when needed"
    },
    {
      pattern: /\bPrivate\b|\bPublic\b/gi,
      message: "Private/Public are Visual Basic keywords",
      suggestion: "Use SHARED for global variables or SUB/FUNCTION parameters"
    },
    {
      pattern: /\bLet\b\s*=/gi,
      message: "LET statement is QBasic/Visual Basic style",
      suggestion: "Direct assignment is preferred in QB64PE"
    },
    {
      pattern: /\bOption\s+Explicit\b/gi,
      message: "Option Explicit is Visual Basic syntax",
      suggestion: "QB64PE doesn't require variable declaration by default"
    }
  ];

  /**
   * Validate QB64PE syntax
   */
  async validateSyntax(code: string, checkLevel: string = "basic"): Promise<SyntaxValidationResult> {
    const lines = code.split('\n');
    const errors: SyntaxError[] = [];
    const warnings: SyntaxWarning[] = [];
    const suggestions: string[] = [];

    // Perform different levels of checking
    switch (checkLevel) {
      case "strict":
        this.performStrictValidation(lines, errors, warnings, suggestions);
        break;
      case "best-practices":
        this.performBestPracticesValidation(lines, errors, warnings, suggestions);
        break;
      default:
        this.performBasicValidation(lines, errors, warnings, suggestions);
        break;
    }

    // Check for non-QB64PE syntax
    this.checkNonQB64Syntax(lines, errors, warnings);

    // Calculate syntax quality score
    const score = this.calculateSyntaxScore(lines, errors, warnings);

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      warnings,
      suggestions,
      score
    };
  }

  /**
   * Perform basic syntax validation
   */
  private performBasicValidation(
    lines: string[], 
    errors: SyntaxError[], 
    warnings: SyntaxWarning[], 
    suggestions: string[]
  ): void {
    const loopStack: Array<{type: string, line: number}> = [];
    const subFunctionStack: Array<{type: string, name: string, line: number}> = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim().toUpperCase();

      // Skip comments and empty lines
      if (trimmedLine.startsWith("'") || trimmedLine.startsWith("REM") || trimmedLine === "") {
        return;
      }

      // Check for basic syntax errors
      this.checkBasicSyntaxErrors(line, lineNum, errors);

      // Check loop structures
      this.checkLoopStructures(trimmedLine, lineNum, loopStack, errors);

      // Check SUB/FUNCTION structures
      this.checkSubFunctionStructures(trimmedLine, lineNum, subFunctionStack, errors);

      // Check variable declarations
      this.checkVariableDeclarations(line, lineNum, warnings, suggestions);
    });

    // Check for unclosed structures
    this.checkUnclosedStructures(loopStack, subFunctionStack, errors);
  }

  /**
   * Perform strict validation (includes all basic checks plus more)
   */
  private performStrictValidation(
    lines: string[], 
    errors: SyntaxError[], 
    warnings: SyntaxWarning[], 
    suggestions: string[]
  ): void {
    // First perform basic validation
    this.performBasicValidation(lines, errors, warnings, suggestions);

    // Additional strict checks
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for undeclared variables (stricter)
      this.checkUndeclaredVariables(line, lineNum, warnings);
      
      // Check for deprecated constructs
      this.checkDeprecatedConstructs(line, lineNum, warnings);
      
      // Check for potential type mismatches
      this.checkTypeMismatches(line, lineNum, warnings);
    });
  }

  /**
   * Perform best practices validation
   */
  private performBestPracticesValidation(
    lines: string[], 
    errors: SyntaxError[], 
    warnings: SyntaxWarning[], 
    suggestions: string[]
  ): void {
    // Perform strict validation first
    this.performStrictValidation(lines, errors, warnings, suggestions);

    // Best practices checks
    this.checkBestPractices(lines, warnings, suggestions);
  }

  /**
   * Check for non-QB64PE syntax (VB, QBasic, etc.)
   */
  private checkNonQB64Syntax(
    lines: string[], 
    errors: SyntaxError[], 
    warnings: SyntaxWarning[]
  ): void {
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      this.nonQB64Constructs.forEach(construct => {
        const match = construct.pattern.exec(line);
        if (match) {
          warnings.push({
            line: lineNum,
            column: match.index + 1,
            message: construct.message,
            rule: 'non-qb64pe-syntax',
            suggestion: construct.suggestion
          });
        }
      });
    });
  }

  /**
   * Check basic syntax errors
   */
  private checkBasicSyntaxErrors(line: string, lineNum: number, errors: SyntaxError[]): void {
    // Check for unmatched quotes
    const quotes = line.match(/"/g);
    if (quotes && quotes.length % 2 !== 0) {
      errors.push({
        line: lineNum,
        column: line.lastIndexOf('"') + 1,
        message: "Unmatched quote",
        severity: 'error',
        rule: 'unmatched-quotes',
        suggestion: "Ensure all quotes are properly closed"
      });
    }

    // Check for unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({
        line: lineNum,
        column: line.length,
        message: "Unmatched parentheses",
        severity: 'error',
        rule: 'unmatched-parentheses',
        suggestion: "Check that all parentheses are properly matched"
      });
    }

    // Check for invalid line continuation
    if (line.trim().endsWith('_') && !line.trim().endsWith(' _')) {
      errors.push({
        line: lineNum,
        column: line.lastIndexOf('_') + 1,
        message: "Line continuation underscore must be preceded by space",
        severity: 'error',
        rule: 'invalid-line-continuation',
        suggestion: "Add space before underscore for line continuation"
      });
    }
  }

  /**
   * Check loop structures
   */
  private checkLoopStructures(
    trimmedLine: string, 
    lineNum: number, 
    loopStack: Array<{type: string, line: number}>, 
    errors: SyntaxError[]
  ): void {
    if (trimmedLine.startsWith('FOR ')) {
      loopStack.push({type: 'FOR', line: lineNum});
    } else if (trimmedLine === 'NEXT' || trimmedLine.startsWith('NEXT ')) {
      if (loopStack.length === 0 || loopStack[loopStack.length - 1].type !== 'FOR') {
        errors.push({
          line: lineNum,
          column: 1,
          message: "NEXT without matching FOR",
          severity: 'error',
          rule: 'unmatched-next',
          suggestion: "Ensure every NEXT has a matching FOR"
        });
      } else {
        loopStack.pop();
      }
    } else if (trimmedLine.startsWith('WHILE ')) {
      loopStack.push({type: 'WHILE', line: lineNum});
    } else if (trimmedLine === 'WEND') {
      if (loopStack.length === 0 || loopStack[loopStack.length - 1].type !== 'WHILE') {
        errors.push({
          line: lineNum,
          column: 1,
          message: "WEND without matching WHILE",
          severity: 'error',
          rule: 'unmatched-wend',
          suggestion: "Ensure every WEND has a matching WHILE"
        });
      } else {
        loopStack.pop();
      }
    } else if (trimmedLine.startsWith('DO')) {
      loopStack.push({type: 'DO', line: lineNum});
    } else if (trimmedLine.startsWith('LOOP')) {
      if (loopStack.length === 0 || loopStack[loopStack.length - 1].type !== 'DO') {
        errors.push({
          line: lineNum,
          column: 1,
          message: "LOOP without matching DO",
          severity: 'error',
          rule: 'unmatched-loop',
          suggestion: "Ensure every LOOP has a matching DO"
        });
      } else {
        loopStack.pop();
      }
    }
  }

  /**
   * Check SUB/FUNCTION structures
   */
  private checkSubFunctionStructures(
    trimmedLine: string, 
    lineNum: number, 
    subFunctionStack: Array<{type: string, name: string, line: number}>, 
    errors: SyntaxError[]
  ): void {
    if (trimmedLine.startsWith('SUB ')) {
      const match = trimmedLine.match(/SUB\s+(\w+)/);
      const name = match ? match[1] : 'unnamed';
      subFunctionStack.push({type: 'SUB', name, line: lineNum});
    } else if (trimmedLine.startsWith('FUNCTION ')) {
      const match = trimmedLine.match(/FUNCTION\s+(\w+)/);
      const name = match ? match[1] : 'unnamed';
      subFunctionStack.push({type: 'FUNCTION', name, line: lineNum});
    } else if (trimmedLine === 'END SUB') {
      if (subFunctionStack.length === 0 || subFunctionStack[subFunctionStack.length - 1].type !== 'SUB') {
        errors.push({
          line: lineNum,
          column: 1,
          message: "END SUB without matching SUB",
          severity: 'error',
          rule: 'unmatched-end-sub',
          suggestion: "Ensure every END SUB has a matching SUB"
        });
      } else {
        subFunctionStack.pop();
      }
    } else if (trimmedLine === 'END FUNCTION') {
      if (subFunctionStack.length === 0 || subFunctionStack[subFunctionStack.length - 1].type !== 'FUNCTION') {
        errors.push({
          line: lineNum,
          column: 1,
          message: "END FUNCTION without matching FUNCTION",
          severity: 'error',
          rule: 'unmatched-end-function',
          suggestion: "Ensure every END FUNCTION has a matching FUNCTION"
        });
      } else {
        subFunctionStack.pop();
      }
    }
  }

  /**
   * Check variable declarations
   */
  private checkVariableDeclarations(
    line: string, 
    lineNum: number, 
    warnings: SyntaxWarning[], 
    suggestions: string[]
  ): void {
    // Check for implicit variable declarations
    const trimmedLine = line.trim().toUpperCase();
    if (trimmedLine.startsWith('DIM ')) {
      // This is good - explicit declaration
      return;
    }

    // Check for variables that appear to be used without declaration
    const variablePattern = /(\b[A-Za-z][A-Za-z0-9]*[$%!#&]?)\s*=/;
    const match = variablePattern.exec(line);
    if (match) {
      const varName = match[1];
      // Skip if it's a known keyword
      if (!this.qb64Keywords.has(varName.toUpperCase())) {
        warnings.push({
          line: lineNum,
          column: match.index + 1,
          message: `Variable '${varName}' used without explicit declaration`,
          rule: 'implicit-declaration',
          suggestion: `Consider adding 'DIM ${varName} AS <type>' before first use`
        });
      }
    }
  }

  /**
   * Check for unclosed structures
   */
  private checkUnclosedStructures(
    loopStack: Array<{type: string, line: number}>, 
    subFunctionStack: Array<{type: string, name: string, line: number}>, 
    errors: SyntaxError[]
  ): void {
    // Check unclosed loops
    loopStack.forEach(loop => {
      errors.push({
        line: loop.line,
        column: 1,
        message: `Unclosed ${loop.type} loop`,
        severity: 'error',
        rule: 'unclosed-loop',
        suggestion: `Add matching ${loop.type === 'FOR' ? 'NEXT' : loop.type === 'WHILE' ? 'WEND' : 'LOOP'}`
      });
    });

    // Check unclosed SUB/FUNCTION
    subFunctionStack.forEach(subFunc => {
      errors.push({
        line: subFunc.line,
        column: 1,
        message: `Unclosed ${subFunc.type} '${subFunc.name}'`,
        severity: 'error',
        rule: 'unclosed-sub-function',
        suggestion: `Add 'END ${subFunc.type}' to close ${subFunc.type} '${subFunc.name}'`
      });
    });
  }

  /**
   * Check for undeclared variables (strict mode)
   */
  private checkUndeclaredVariables(line: string, lineNum: number, warnings: SyntaxWarning[]): void {
    // This would require more sophisticated analysis to track variable scope
    // For now, we'll implement a simplified version
  }

  /**
   * Check for deprecated constructs
   */
  private checkDeprecatedConstructs(line: string, lineNum: number, warnings: SyntaxWarning[]): void {
    const deprecatedPatterns = [
      {pattern: /\bDEF\s+FN/gi, message: "DEF FN is deprecated, use FUNCTION instead"},
      {pattern: /\bGOSUB\b/gi, message: "GOSUB is discouraged, use SUB procedures instead"},
      {pattern: /\bON\s+ERROR\s+RESUME\s+NEXT/gi, message: "Consider using structured error handling"}
    ];

    deprecatedPatterns.forEach(dep => {
      const match = dep.pattern.exec(line);
      if (match) {
        warnings.push({
          line: lineNum,
          column: match.index + 1,
          message: dep.message,
          rule: 'deprecated-construct',
          suggestion: "Consider using modern QB64PE alternatives"
        });
      }
    });
  }

  /**
   * Check for type mismatches
   */
  private checkTypeMismatches(line: string, lineNum: number, warnings: SyntaxWarning[]): void {
    // Check for string/numeric mismatches
    const stringToNumeric = /(\w+\$)\s*=\s*(\d+)/g;
    const numericToString = /(\w+[%!#&]?)\s*=\s*"[^"]*"/g;

    let match;
    while ((match = stringToNumeric.exec(line)) !== null) {
      warnings.push({
        line: lineNum,
        column: match.index + 1,
        message: `Assigning numeric value to string variable '${match[1]}'`,
        rule: 'type-mismatch',
        suggestion: "Use STR$() to convert numeric to string"
      });
    }

    while ((match = numericToString.exec(line)) !== null) {
      warnings.push({
        line: lineNum,
        column: match.index + 1,
        message: `Assigning string value to numeric variable '${match[1]}'`,
        rule: 'type-mismatch',
        suggestion: "Use VAL() to convert string to numeric"
      });
    }
  }

  /**
   * Check best practices
   */
  private checkBestPractices(lines: string[], warnings: SyntaxWarning[], suggestions: string[]): void {
    let hasConsoleOrPrint = false;
    let hasErrorHandling = false;
    let hasComments = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim().toUpperCase();

      // Check for console/print usage
      if (trimmedLine.includes('PRINT') || trimmedLine.includes('$CONSOLE')) {
        hasConsoleOrPrint = true;
      }

      // Check for error handling
      if (trimmedLine.includes('ON ERROR')) {
        hasErrorHandling = true;
      }

      // Check for comments
      if (line.trim().startsWith("'") || line.trim().startsWith("REM")) {
        hasComments = true;
      }

      // Check line length
      if (line.length > 120) {
        warnings.push({
          line: lineNum,
          column: 121,
          message: "Line is very long (>120 characters)",
          rule: 'line-length',
          suggestion: "Consider breaking long lines for readability"
        });
      }

      // Check for magic numbers
      const magicNumberPattern = /\b(?!0|1|2|10|100|1000)\d{3,}\b/g;
      let match;
      while ((match = magicNumberPattern.exec(line)) !== null) {
        warnings.push({
          line: lineNum,
          column: match.index + 1,
          message: `Magic number '${match[0]}' found`,
          rule: 'magic-number',
          suggestion: "Consider using a named constant"
        });
      }
    });

    // Add general suggestions
    if (!hasComments) {
      suggestions.push("Add comments to explain complex logic");
    }
    if (!hasErrorHandling && lines.length > 20) {
      suggestions.push("Consider adding error handling for larger programs");
    }
  }

  /**
   * Calculate syntax quality score
   */
  private calculateSyntaxScore(lines: string[], errors: SyntaxError[], warnings: SyntaxWarning[]): number {
    let score = 100;
    
    // Deduct points for errors and warnings
    score -= errors.filter(e => e.severity === 'error').length * 10;
    score -= errors.filter(e => e.severity === 'warning').length * 5;
    score -= warnings.length * 2;

    // Bonus points for good practices
    const codeLines = lines.filter(line => 
      line.trim() !== '' && 
      !line.trim().startsWith("'") && 
      !line.trim().startsWith("REM")
    ).length;

    const commentLines = lines.filter(line => 
      line.trim().startsWith("'") || 
      line.trim().startsWith("REM")
    ).length;

    if (commentLines > 0 && codeLines > 0) {
      const commentRatio = commentLines / codeLines;
      if (commentRatio > 0.1) score += 5; // Good commenting
    }

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }
}
