/**
 * QB64PE Porting Service
 * Converts QBasic programs to QB64PE with systematic transformations
 */

export interface PortingResult {
  originalCode: string;
  portedCode: string;
  transformations: string[];
  warnings: string[];
  errors: string[];
  compatibility: 'high' | 'medium' | 'low';
  summary: string;
}

export interface PortingOptions {
  sourceDialect: 'qbasic' | 'gwbasic' | 'quickbasic' | 'vb-dos' | 'applesoft' | 'commodore' | 'amiga' | 'atari' | 'vb6' | 'vbnet' | 'vbscript' | 'freebasic';
  addModernFeatures: boolean;
  preserveComments: boolean;
  convertGraphics: boolean;
  optimizePerformance: boolean;
}

export class QB64PEPortingService {
  private transformations: string[] = [];
  private warnings: string[] = [];
  private errors: string[] = [];

  /**
   * Port QBasic code to QB64PE
   */
  async portQBasicToQB64PE(sourceCode: string, options: Partial<PortingOptions> = {}): Promise<PortingResult> {
    const opts: PortingOptions = {
      sourceDialect: 'qbasic',
      addModernFeatures: true,
      preserveComments: true,
      convertGraphics: true,
      optimizePerformance: true,
      ...options
    };

    this.transformations = [];
    this.warnings = [];
    this.errors = [];

    let portedCode = sourceCode;

    // Apply transformations in order
    portedCode = this.addQB64PEMetacommands(portedCode, opts);
    portedCode = this.convertKeywordCasing(portedCode);
    portedCode = this.removeForwardDeclarations(portedCode);
    portedCode = this.convertDefFnToFunctions(portedCode);
    portedCode = this.convertGosubToFunctions(portedCode);
    portedCode = this.convertTypeDeclarations(portedCode);
    portedCode = this.convertArraySyntax(portedCode);
    portedCode = this.convertStringFunctions(portedCode);
    portedCode = this.convertMathematicalConstants(portedCode);
    portedCode = this.convertExitStatements(portedCode);
    portedCode = this.convertTimingFunctions(portedCode);
    portedCode = this.addGraphicsEnhancements(portedCode, opts);
    portedCode = this.optimizeCompatibility(portedCode, opts);

    const compatibility = this.assessCompatibility();

    return {
      originalCode: sourceCode,
      portedCode,
      transformations: this.transformations,
      warnings: this.warnings,
      errors: this.errors,
      compatibility,
      summary: this.generateSummary()
    };
  }

  /**
   * Add QB64PE metacommands and modern features
   */
  private addQB64PEMetacommands(code: string, options: PortingOptions): string {
    if (!options.addModernFeatures) return code;

    const lines = code.split('\n');
    const hasGraphics = this.detectGraphics(code);
    const hasTitle = /^Title\s+/mi.test(code);
    
    // Find insertion point (after initial comments but before first executable code)
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("'") && !line.startsWith('REM')) {
        insertIndex = i;
        break;
      }
    }

    const metacommands: string[] = [];
    
    // Add $NoPrefix for modern QB64PE syntax
    metacommands.push('$NoPrefix');
    this.transformations.push('Added $NoPrefix metacommand for modern QB64PE syntax');
    
    // Add graphics enhancements for graphics programs
    if (hasGraphics) {
      metacommands.push('$Resize:Smooth');
      this.transformations.push('Added $Resize:Smooth for smooth window resizing');
      
      if (!hasTitle) {
        // Extract title from comments if available
        const titleMatch = code.match(/'\s*([^'\n]+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Ported QB64PE Program';
        metacommands.push(`Title "${title}"`);
        this.transformations.push(`Added window title: "${title}"`);
      }
    }

    // Insert metacommands
    if (metacommands.length > 0) {
      metacommands.push(''); // Empty line for separation
      lines.splice(insertIndex, 0, ...metacommands);
    }

    return lines.join('\n');
  }

  /**
   * Convert QBasic ALL CAPS keywords to QB64PE Pascal Case
   */
  private convertKeywordCasing(code: string): string {
    const keywordMap: Record<string, string> = {
      'DEFINT': 'DefInt',
      'DEFSNG': 'DefSng',
      'DEFDBL': 'DefDbl',
      'DEFSTR': 'DefStr',
      'DECLARE': 'Declare',
      'CONST': 'Const',
      'TYPE': 'Type',
      'END TYPE': 'End Type',
      'DIM': 'Dim',
      'SHARED': 'Shared',
      'REDIM': 'ReDim',
      'FUNCTION': 'Function',
      'END FUNCTION': 'End Function',
      'SUB': 'Sub',
      'END SUB': 'End Sub',
      'FOR': 'For',
      'NEXT': 'Next',
      'WHILE': 'While',
      'WEND': 'Wend',
      'DO': 'Do',
      'LOOP': 'Loop',
      'IF': 'If',
      'THEN': 'Then',
      'ELSE': 'Else',
      'ELSEIF': 'ElseIf',
      'END IF': 'End If',
      'SELECT': 'Select',
      'CASE': 'Case',
      'END SELECT': 'End Select',
      'SCREEN': 'Screen',
      'LOCATE': 'Locate',
      'PRINT': 'Print',
      'INPUT': 'Input',
      'LINE INPUT': 'Line Input',
      'OPEN': 'Open',
      'CLOSE': 'Close',
      'READ': 'Read',
      'DATA': 'Data',
      'RESTORE': 'Restore',
      'CIRCLE': 'Circle',
      'LINE': 'Line',
      'PSET': 'PSet',
      'POINT': 'Point',
      'PUT': 'Put',
      'GET': 'Get',
      'PAINT': 'Paint',
      'PALETTE': 'Palette',
      'COLOR': 'Color',
      'WIDTH': 'Width',
      'VIEW': 'View',
      'WINDOW': 'Window',
      'PLAY': 'Play',
      'BEEP': 'Beep',
      'SOUND': 'Sound',
      'TIMER': 'Timer',
      'RANDOMIZE': 'Randomize',
      'RND': 'Rnd',
      'INT': 'Int',
      'ABS': 'Abs',
      'SQR': 'Sqr',
      'SIN': 'Sin',
      'COS': 'Cos',
      'TAN': 'Tan',
      'ATN': 'Atn',
      'LOG': 'Log',
      'EXP': 'Exp',
      'LEN': 'Len',
      'MID\\$': 'Mid$',
      'LEFT\\$': 'Left$',
      'RIGHT\\$': 'Right$',
      'LTRIM\\$': 'LTrim$',
      'RTRIM\\$': 'RTrim$',
      'TRIM\\$': 'Trim$',
      'INSTR': 'InStr',
      'VAL': 'Val',
      'STR\\$': 'Str$',
      'CHR\\$': 'Chr$',
      'ASC': 'Asc',
      'SPACE\\$': 'Space$',
      'STRING\\$': 'String$',
      'UCASE\\$': 'UCase$',
      'LCASE\\$': 'LCase$',
      'TAB': 'Tab',
      'SPC': 'Spc',
      'POS': 'Pos',
      'CSRLIN': 'CsrLin',
      'INKEY\\$': 'InKey$',
      'EOF': 'Eof',
      'LOF': 'Lof',
      'SEEK': 'Seek',
      'CLS': 'Cls',
      'SYSTEM': 'System',
      'SHELL': 'Shell',
      'SLEEP': 'Sleep',
      'DATE\\$': 'Date$',
      'TIME\\$': 'Time$',
      'PEEK': 'Peek',
      'POKE': 'Poke',
      'DEF SEG': 'Def Seg'
    };

    let convertedCode = code;
    let conversionCount = 0;

    // Convert keywords using word boundaries to avoid partial matches
    for (const [oldKeyword, newKeyword] of Object.entries(keywordMap)) {
      const regex = new RegExp(`\\b${oldKeyword}\\b`, 'gi');
      const matches = convertedCode.match(regex);
      if (matches) {
        convertedCode = convertedCode.replace(regex, newKeyword);
        conversionCount += matches.length;
      }
    }

    if (conversionCount > 0) {
      this.transformations.push(`Converted ${conversionCount} keyword(s) from ALL CAPS to Pascal Case`);
    }

    return convertedCode;
  }

  /**
   * Remove forward declarations that are not needed in QB64PE
   */
  private removeForwardDeclarations(code: string): string {
    const lines = code.split('\n');
    const removedLines: string[] = [];
    
    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('Declare Sub') || trimmed.startsWith('Declare Function')) {
        removedLines.push(trimmed);
        return false;
      }
      return true;
    });

    if (removedLines.length > 0) {
      this.transformations.push(`Removed ${removedLines.length} forward declaration(s): ${removedLines.join(', ')}`);
    }

    return filteredLines.join('\n');
  }

  /**
   * Convert DEF FN statements to proper functions
   */
  private convertDefFnToFunctions(code: string): string {
    const defFnPattern = /^\s*DEF\s+(\w+)\s*\(([^)]*)\)\s*=\s*(.+)$/gmi;
    const matches = Array.from(code.matchAll(defFnPattern));
    
    if (matches.length === 0) return code;

    let convertedCode = code;
    const functions: string[] = [];

    for (const match of matches) {
      const [fullMatch, fnName, parameters, expression] = match;
      
      // Create proper function
      const functionCode = `Function ${fnName} (${parameters})
    ${fnName} = ${expression}
End Function`;

      functions.push(fnName);
      
      // Remove the DEF FN line
      convertedCode = convertedCode.replace(fullMatch, '');
      
      // Add the function at the end
      convertedCode += '\n\n' + functionCode;
    }

    this.transformations.push(`Converted ${functions.length} DEF FN statement(s) to proper functions: ${functions.join(', ')}`);

    return convertedCode;
  }

  /**
   * Convert GOSUB/RETURN to function calls
   */
  private convertGosubToFunctions(code: string): string {
    const lines = code.split('\n');
    const labels: Set<string> = new Set();
    const gosubLines: number[] = [];
    
    // Find GOSUB statements and labels
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Find GOSUB statements
      const gosubMatch = trimmed.match(/^GOSUB\s+(\w+)/i);
      if (gosubMatch) {
        gosubLines.push(index);
        labels.add(gosubMatch[1]);
      }
      
      // Find labels (line starts with label followed by colon)
      const labelMatch = trimmed.match(/^(\w+):\s*$/);
      if (labelMatch) {
        labels.add(labelMatch[1]);
      }
    });

    if (gosubLines.length === 0) return code;

    // Convert GOSUB to function calls
    let convertedCode = code;
    gosubLines.forEach(lineIndex => {
      const line = lines[lineIndex];
      const gosubMatch = line.match(/^(\s*)GOSUB\s+(\w+)/i);
      if (gosubMatch) {
        const [, indent, label] = gosubMatch;
        convertedCode = convertedCode.replace(line, `${indent}${label}`);
      }
    });

    // Convert labels to functions (basic conversion - may need manual refinement)
    labels.forEach(label => {
      const labelPattern = new RegExp(`^(\\s*)${label}:\\s*$`, 'mi');
      const returnPattern = new RegExp(`^(\\s*)RETURN\\s*$`, 'mi');
      
      convertedCode = convertedCode.replace(labelPattern, `$1Sub ${label}`);
      convertedCode = convertedCode.replace(returnPattern, '$1End Sub');
    });

    this.transformations.push(`Converted ${gosubLines.length} GOSUB statement(s) to function calls`);
    this.warnings.push('GOSUB/RETURN conversion may require manual verification and adjustment');

    return convertedCode;
  }

  /**
   * Convert TYPE declarations to modern syntax
   */
  private convertTypeDeclarations(code: string): string {
    let convertedCode = code;
    let conversionCount = 0;

    // Convert AS clauses in TYPE declarations
    const asTypePattern = /(\w+)\s+AS\s+(INTEGER|LONG|SINGLE|DOUBLE|STRING)/gi;
    const matches = convertedCode.match(asTypePattern);
    
    if (matches) {
      convertedCode = convertedCode.replace(asTypePattern, '$1 As $2');
      conversionCount = matches.length;
    }

    if (conversionCount > 0) {
      this.transformations.push(`Converted ${conversionCount} TYPE field declaration(s) to modern syntax`);
    }

    return convertedCode;
  }

  /**
   * Convert array syntax to QB64PE format
   */
  private convertArraySyntax(code: string): string {
    let convertedCode = code;
    let conversionCount = 0;

    // Convert PUT/GET array syntax
    const putGetPattern = /\b(Put|Get)\s*\([^,]+,\s*([^,\s)]+)([^,]*)\),\s*(\w+&?)\s*([^,)]*)\)/gi;
    const matches = Array.from(convertedCode.matchAll(putGetPattern));
    
    for (const match of matches) {
      const [fullMatch, command, coords, coordsRest, arrayName, rest] = match;
      const newSyntax = `${command} (${coords}${coordsRest}), ${arrayName}()${rest ? ', ' + rest.trim() : ''}`;
      convertedCode = convertedCode.replace(fullMatch, newSyntax);
      conversionCount++;
    }

    if (conversionCount > 0) {
      this.transformations.push(`Converted ${conversionCount} array syntax statement(s) to QB64PE format`);
    }

    return convertedCode;
  }

  /**
   * Convert string functions to proper casing
   */
  private convertStringFunctions(code: string): string {
    const stringFunctions: Record<string, string> = {
      'LTRIM\\$': 'LTrim$',
      'RTRIM\\$': 'RTrim$',
      'TRIM\\$': 'Trim$',
      'LEFT\\$': 'Left$',
      'RIGHT\\$': 'Right$',
      'MID\\$': 'Mid$',
      'UCASE\\$': 'UCase$',
      'LCASE\\$': 'LCase$',
      'STR\\$': 'Str$',
      'CHR\\$': 'Chr$',
      'SPACE\\$': 'Space$',
      'STRING\\$': 'String$',
      'INKEY\\$': 'InKey$',
      'DATE\\$': 'Date$',
      'TIME\\$': 'Time$'
    };

    let convertedCode = code;
    let conversionCount = 0;

    for (const [oldFunc, newFunc] of Object.entries(stringFunctions)) {
      const regex = new RegExp(`\\b${oldFunc}\\b`, 'gi');
      const matches = convertedCode.match(regex);
      if (matches) {
        convertedCode = convertedCode.replace(regex, newFunc);
        conversionCount += matches.length;
      }
    }

    if (conversionCount > 0) {
      this.transformations.push(`Converted ${conversionCount} string function(s) to proper casing`);
    }

    return convertedCode;
  }

  /**
   * Convert mathematical constants and functions
   */
  private convertMathematicalConstants(code: string): string {
    let convertedCode = code;
    
    // Convert manual pi calculation to built-in constant
    const piPattern = /\b(\w+#?)\s*=\s*4\s*\*\s*ATN\s*\(\s*1#?\s*\)/gi;
    const piMatches = Array.from(convertedCode.matchAll(piPattern));
    
    for (const match of piMatches) {
      const [fullMatch, varName] = match;
      // Replace with built-in Pi constant
      convertedCode = convertedCode.replace(fullMatch, `${varName} = Pi`);
    }

    if (piMatches.length > 0) {
      this.transformations.push(`Converted ${piMatches.length} manual pi calculation(s) to built-in Pi constant`);
    }

    return convertedCode;
  }

  /**
   * Convert exit statements to QB64PE format
   */
  private convertExitStatements(code: string): string {
    let convertedCode = code;
    
    // Convert standalone END to System 0
    const endPattern = /^\s*END\s*$/gmi;
    const matches = convertedCode.match(endPattern);
    
    if (matches) {
      convertedCode = convertedCode.replace(endPattern, 'System 0');
      this.transformations.push(`Converted ${matches.length} END statement(s) to System 0`);
    }

    return convertedCode;
  }

  /**
   * Convert timing functions to QB64PE equivalents
   */
  private convertTimingFunctions(code: string): string {
    let convertedCode = code;
    
    // Look for Rest subroutine calls and suggest Delay
    const restPattern = /\bRest\s+([^'\n]+)/gi;
    const matches = Array.from(convertedCode.matchAll(restPattern));
    
    for (const match of matches) {
      const [fullMatch, parameter] = match;
      convertedCode = convertedCode.replace(fullMatch, `Delay ${parameter.trim()}`);
    }

    if (matches.length > 0) {
      this.transformations.push(`Converted ${matches.length} Rest call(s) to Delay command`);
    }

    // Convert complex timing to Timer(.001) for precision
    const timerPattern = /TIMER\s*-\s*s#/gi;
    const timerMatches = convertedCode.match(timerPattern);
    
    if (timerMatches) {
      this.warnings.push('Consider using Timer(.001) for more precise timing in QB64PE');
    }

    return convertedCode;
  }

  /**
   * Add graphics enhancements for QB64PE
   */
  private addGraphicsEnhancements(code: string, options: PortingOptions): string {
    if (!options.convertGraphics) return code;
    
    let convertedCode = code;
    const hasGraphics = this.detectGraphics(code);
    
    if (hasGraphics) {
      // Look for SCREEN statement and add AllowFullScreen after it
      const screenPattern = /^(\s*Screen\s+[^\n]*)/gmi;
      const matches = Array.from(convertedCode.matchAll(screenPattern));
      
      for (const match of matches) {
        const [fullMatch, screenLine] = match;
        const enhancement = `${screenLine}
    AllowFullScreen SquarePixels , Smooth`;
        convertedCode = convertedCode.replace(fullMatch, enhancement);
      }

      if (matches.length > 0) {
        this.transformations.push('Added AllowFullScreen SquarePixels, Smooth for enhanced graphics');
      }
    }

    return convertedCode;
  }

  /**
   * Optimize for QB64PE compatibility
   */
  private optimizeCompatibility(code: string, options: PortingOptions): string {
    let convertedCode = code;
    
    // Check for potential compatibility issues
    this.checkMultiStatementLines(convertedCode);
    this.checkArrayDeclarations(convertedCode);
    this.checkFunctionReturnTypes(convertedCode);
    
    return convertedCode;
  }

  /**
   * Check for multi-statement lines that might cause issues
   */
  private checkMultiStatementLines(code: string): void {
    const lines = code.split('\n');
    const problematicLines: number[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Check for multiple IF statements on one line
      if (trimmed.includes('If ') && trimmed.includes(': If ')) {
        problematicLines.push(index + 1);
      }
      // Check for complex multi-statement lines
      if ((trimmed.match(/:/g) || []).length > 1 && trimmed.includes('If ')) {
        problematicLines.push(index + 1);
      }
    });

    if (problematicLines.length > 0) {
      this.warnings.push(`Multi-statement lines detected at line(s) ${problematicLines.join(', ')} - consider splitting for better QB64PE compatibility`);
    }
  }

  /**
   * Check array declarations for potential issues
   */
  private checkArrayDeclarations(code: string): void {
    const multiArrayPattern = /Dim\s+\w+\([^)]+\)[^,\n]*,\s*\w+\([^)]+\)/gi;
    const matches = code.match(multiArrayPattern);
    
    if (matches) {
      this.warnings.push(`${matches.length} multi-array declaration(s) found - consider declaring arrays separately for better QB64PE compatibility`);
    }
  }

  /**
   * Check function return types
   */
  private checkFunctionReturnTypes(code: string): void {
    const functionAsPattern = /Function\s+\w+\([^)]*\)\s+As\s+\w+/gi;
    const matches = code.match(functionAsPattern);
    
    if (matches) {
      this.warnings.push(`${matches.length} function(s) using AS clause for return type - QB64PE prefers type sigils (%, &, !, #, $)`);
    }
  }

  /**
   * Detect if code contains graphics operations
   */
  private detectGraphics(code: string): boolean {
    const graphicsKeywords = ['Screen', 'Circle', 'Line', 'PSet', 'Point', 'Paint', 'Put', 'Get', 'Palette', 'View', 'Window'];
    return graphicsKeywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(code));
  }

  /**
   * Assess overall compatibility level
   */
  private assessCompatibility(): 'high' | 'medium' | 'low' {
    const errorCount = this.errors.length;
    const warningCount = this.warnings.length;
    
    if (errorCount > 0) return 'low';
    if (warningCount > 3) return 'medium';
    return 'high';
  }

  /**
   * Generate summary of porting process
   */
  private generateSummary(): string {
    const transformationCount = this.transformations.length;
    const warningCount = this.warnings.length;
    const errorCount = this.errors.length;
    
    return `Porting completed with ${transformationCount} transformation(s), ${warningCount} warning(s), and ${errorCount} error(s). Compatibility level: ${this.assessCompatibility()}.`;
  }

  /**
   * Get supported source dialects
   */
  getSupportedDialects(): string[] {
    return [
      'qbasic',
      'gwbasic', 
      'quickbasic',
      'vb-dos',
      'applesoft',
      'commodore',
      'amiga',
      'atari',
      'vb6',
      'vbnet',
      'vbscript',
      'freebasic'
    ];
  }

  /**
   * Get dialect-specific conversion rules
   */
  getDialectRules(dialect: string): string[] {
    const rules: Record<string, string[]> = {
      'qbasic': [
        'Convert ALL CAPS keywords to Pascal Case',
        'Remove DECLARE statements',
        'Convert DEF FN to proper functions',
        'Convert GOSUB/RETURN to function calls',
        'Add QB64PE metacommands',
        'Update array syntax',
        'Convert timing functions'
      ],
      'gwbasic': [
        'All QBasic rules apply',
        'Convert line numbers to labels',
        'Update file I/O syntax',
        'Convert graphics coordinates'
      ],
      'quickbasic': [
        'Most QBasic rules apply',
        'Update compiler directives',
        'Convert module declarations'
      ]
    };

    return rules[dialect] || ['Basic BASIC to QB64PE conversion rules'];
  }
}
