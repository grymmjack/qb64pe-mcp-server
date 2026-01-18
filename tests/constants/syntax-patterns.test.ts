import {
  QB64PE_SYNTAX_PATTERNS,
  QB64PE_REPOSITORY_PATTERNS,
  getSyntaxHelp,
  validateSyntax,
  getSyntaxHighlighting,
  type SyntaxPattern,
  type RepositoryPattern
} from '../../src/constants/syntax-patterns';

describe('QB64PE Syntax Patterns', () => {
  describe('QB64PE_SYNTAX_PATTERNS', () => {
    it('should have syntax patterns defined', () => {
      expect(QB64PE_SYNTAX_PATTERNS).toBeDefined();
      expect(Array.isArray(QB64PE_SYNTAX_PATTERNS)).toBe(true);
    });

    it('should have at least 10 patterns', () => {
      expect(QB64PE_SYNTAX_PATTERNS.length).toBeGreaterThanOrEqual(10);
    });

    it('should have patterns with valid properties', () => {
      const firstPattern = QB64PE_SYNTAX_PATTERNS[0];
      expect(firstPattern).toBeDefined();
      expect(typeof firstPattern).toBe('object');
    });

    it('should have string patterns', () => {
      const stringPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'string.quoted.double.QB64PE'
      );
      expect(stringPattern).toBeDefined();
    });

    it('should have keyword patterns', () => {
      const keywordPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'keyword.all.QB64PE'
      );
      expect(keywordPattern).toBeDefined();
    });

    it('should have comment patterns', () => {
      const commentPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.beginCaptures && p.beginCaptures['1']?.name?.includes('comment')
      );
      expect(commentPattern).toBeDefined();
    });

    it('should have numeric constant patterns', () => {
      const numericPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'constant.numeric.QB64PE'
      );
      expect(numericPattern).toBeDefined();
    });

    it('should have preprocessor patterns', () => {
      const preprocessorPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'meta.preprocessor.QB64PE'
      );
      expect(preprocessorPattern).toBeDefined();
    });

    it('should have control keyword patterns', () => {
      const controlPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'keyword.control.QB64PE'
      );
      expect(controlPattern).toBeDefined();
    });

    it('should have operator patterns', () => {
      const operatorPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'operator.QB64PE'
      );
      expect(operatorPattern).toBeDefined();
    });

    it('should have variable patterns', () => {
      const variablePattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'variable.QB64PE'
      );
      expect(variablePattern).toBeDefined();
    });

    it('should have function patterns', () => {
      const functionPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'support.function.QB64PE'
      );
      expect(functionPattern).toBeDefined();
    });

    it('should have type patterns', () => {
      const typePattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'support.type.QB64PE'
      );
      expect(typePattern).toBeDefined();
    });

    it('should have punctuation separator patterns', () => {
      const punctuationPattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'punctuation.separator.QB64PE'
      );
      expect(punctuationPattern).toBeDefined();
    });

    it('should have meta ending-space pattern', () => {
      const endingSpacePattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'meta.ending-space'
      );
      expect(endingSpacePattern).toBeDefined();
    });

    it('should have meta leading-space pattern', () => {
      const leadingSpacePattern = QB64PE_SYNTAX_PATTERNS.find(p => 
        p.name === 'meta.leading-space'
      );
      expect(leadingSpacePattern).toBeDefined();
      expect(Array.isArray(leadingSpacePattern)).toBe(false);
    });

    it('should have patterns with begin/end properties', () => {
      const patternsWithBeginEnd = QB64PE_SYNTAX_PATTERNS.filter(p => 
        p.begin && p.end
      );
      expect(patternsWithBeginEnd.length).toBeGreaterThan(0);
    });

    it('should have patterns with regex properties', () => {
      const patternsWithRegex = QB64PE_SYNTAX_PATTERNS.filter(p => 
        p.regex
      );
      expect(patternsWithRegex.length).toBeGreaterThan(0);
    });

    it('should have patterns with captures', () => {
      const patternsWithCaptures = QB64PE_SYNTAX_PATTERNS.filter(p => 
        p.captures
      );
      expect(patternsWithCaptures.length).toBeGreaterThan(0);
    });

    it('should have patterns with beginCaptures and endCaptures', () => {
      const patternsWithBothCaptures = QB64PE_SYNTAX_PATTERNS.filter(p => 
        p.beginCaptures && p.endCaptures
      );
      expect(patternsWithBothCaptures.length).toBeGreaterThan(0);
    });

    it('should export expected number of patterns', () => {
      expect(QB64PE_SYNTAX_PATTERNS.length).toBeGreaterThanOrEqual(16);
    });
  });

  describe('QB64PE_REPOSITORY_PATTERNS', () => {
    it('should have repository patterns defined', () => {
      expect(QB64PE_REPOSITORY_PATTERNS).toBeDefined();
      expect(typeof QB64PE_REPOSITORY_PATTERNS).toBe('object');
    });

    it('should have round-brackets pattern', () => {
      expect(QB64PE_REPOSITORY_PATTERNS['round-brackets']).toBeDefined();
      expect(QB64PE_REPOSITORY_PATTERNS['round-brackets'].begin).toBe('\\(');
      expect(QB64PE_REPOSITORY_PATTERNS['round-brackets'].end).toBe('\\)');
    });

    it('should have properly structured repository patterns', () => {
      const roundBrackets = QB64PE_REPOSITORY_PATTERNS['round-brackets'];
      expect(roundBrackets.name).toBe('meta.round-brackets');
      expect(roundBrackets.beginCaptures).toBeDefined();
      expect(roundBrackets.endCaptures).toBeDefined();
    });

    it('should have correct begin capture for round-brackets', () => {
      const roundBrackets = QB64PE_REPOSITORY_PATTERNS['round-brackets'];
      expect(roundBrackets.beginCaptures).toBeDefined();
      expect(roundBrackets.beginCaptures?.['0']).toBeDefined();
      expect(roundBrackets.beginCaptures?.['0'].name).toBe('punctuation.section.round-brackets.begin.QB64PE');
    });

    it('should have correct end capture for round-brackets', () => {
      const roundBrackets = QB64PE_REPOSITORY_PATTERNS['round-brackets'];
      expect(roundBrackets.endCaptures).toBeDefined();
      expect(roundBrackets.endCaptures?.['0']).toBeDefined();
      expect(roundBrackets.endCaptures?.['0'].name).toBe('punctuation.section.round-brackets.end.QB64PE');
    });

    it('should only have expected repository pattern keys', () => {
      const keys = Object.keys(QB64PE_REPOSITORY_PATTERNS);
      expect(keys).toContain('round-brackets');
    });
  });

  describe('getSyntaxHelp', () => {
    it('should identify string functions (ending with $)', () => {
      const help = getSyntaxHelp('CHR$');
      expect(help).toBeDefined();
      expect(help).toContain('string function');
      expect(help).toContain('CHR$');
    });

    it('should identify string variables (ending with $)', () => {
      const help = getSyntaxHelp('myVar$');
      expect(help).toBeDefined();
      expect(help).toContain('$');
    });

    it('should identify QB64PE-specific functions (starting with _)', () => {
      const help = getSyntaxHelp('_LIMIT');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE system constant');
      expect(help).toContain('_');
    });

    it('should identify OpenGL functions', () => {
      const help = getSyntaxHelp('GlVertex3f');
      expect(help).toBeDefined();
      expect(help).toContain('OpenGL');
    });

    it('should identify QB64PE system constants', () => {
      const help = getSyntaxHelp('_RGB');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE');
    });

    it('should return null for regular identifiers', () => {
      const help = getSyntaxHelp('PRINT');
      expect(help).toBeNull();
    });

    it('should handle lowercase identifiers', () => {
      const help = getSyntaxHelp('chr$');
      expect(help).toBeDefined();
      expect(help).toContain('string');
    });

    it('should handle mixed case identifiers', () => {
      const help = getSyntaxHelp('_Limit');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE system constant');
    });

    it('should identify QB64PE system constants with all uppercase (e.g., _RGB)', () => {
      const help = getSyntaxHelp('_RGB');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE system constant');
    });

    it('should identify QB64PE system constants (all caps after underscore)', () => {
      const help = getSyntaxHelp('_NEWIMAGE');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE system constant');
    });

    it('should handle OpenGL functions with mixed case', () => {
      const help = getSyntaxHelp('GluPerspective');
      expect(help).toBeDefined();
      expect(help).toContain('OpenGL');
    });

    it('should handle identifiers without special prefixes or suffixes', () => {
      const help = getSyntaxHelp('normalVar');
      expect(help).toBeNull();
    });

    it('should handle identifiers with numbers', () => {
      const help = getSyntaxHelp('var123');
      expect(help).toBeNull();
    });

    it('should handle empty string identifier', () => {
      const help = getSyntaxHelp('');
      expect(help).toBeNull();
    });

    it('should identify QB64PE-specific functions with mixed case (not all caps)', () => {
      const help = getSyntaxHelp('_Load3DFont');
      expect(help).toBeDefined();
      expect(help).toContain('QB64PE-specific');
    });
  });

  describe('validateSyntax', () => {
    it('should validate correct code', () => {
      const result = validateSyntax('PRINT "Hello World"');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unclosed strings', () => {
      const result = validateSyntax('PRINT "Hello World');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed string literal');
    });

    it('should detect unclosed strings with multiple lines', () => {
      const result = validateSyntax('PRINT "Hello\nPRINT "World"');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed string literal');
    });

    it('should validate code with even number of quotes', () => {
      const result = validateSyntax('PRINT "Hello" : PRINT "World"');
      expect(result.valid).toBe(true);
    });

    it('should detect mismatched parentheses (too many open)', () => {
      const result = validateSyntax('PRINT CHR$(65');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mismatched parentheses');
    });

    it('should detect mismatched parentheses (too many close)', () => {
      const result = validateSyntax('PRINT CHR$65)');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mismatched parentheses');
    });

    it('should validate code with balanced parentheses', () => {
      const result = validateSyntax('PRINT CHR$(65)');
      expect(result.valid).toBe(true);
    });

    it('should validate code with nested parentheses', () => {
      const result = validateSyntax('PRINT CHR$(ASC("A"))');
      expect(result.valid).toBe(true);
    });

    it('should handle empty code', () => {
      const result = validateSyntax('');
      expect(result.valid).toBe(true);
    });

    it('should detect multiple errors', () => {
      const result = validateSyntax('PRINT "Hello (World');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate multiline code', () => {
      const code = 'PRINT "Line 1"\nPRINT "Line 2"';
      const result = validateSyntax(code);
      expect(result.valid).toBe(true);
    });

    it('should handle code with only opening parentheses', () => {
      const result = validateSyntax('IF (x > 5');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mismatched parentheses');
    });

    it('should handle code with only closing parentheses', () => {
      const result = validateSyntax('x = y)');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mismatched parentheses');
    });

    it('should handle code with no parentheses', () => {
      const result = validateSyntax('x = 5');
      expect(result.valid).toBe(true);
    });

    it('should handle code with no quotes', () => {
      const result = validateSyntax('x = 5 + 10');
      expect(result.valid).toBe(true);
    });

    it('should handle code with single quote (string error)', () => {
      const result = validateSyntax('PRINT "Hello');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed string literal');
    });

    it('should handle code with three quotes', () => {
      const result = validateSyntax('PRINT "A" "B');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unclosed string literal');
    });

    it('should handle complex nested parentheses', () => {
      const result = validateSyntax('PRINT ((x + y) * (a + b))');
      expect(result.valid).toBe(true);
    });
  });

  describe('getSyntaxHighlighting', () => {
    it('should tokenize simple code', () => {
      const tokens = getSyntaxHighlighting('PRINT "Hello"');
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should identify strings in code', () => {
      const tokens = getSyntaxHighlighting('PRINT "Hello World"');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
      expect(stringToken?.text).toBe('"Hello World"');
    });

    it('should identify comments with REM', () => {
      const tokens = getSyntaxHighlighting('REM This is a comment');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
      expect(commentToken?.text).toContain('REM');
    });

    it('should identify comments with apostrophe', () => {
      const tokens = getSyntaxHighlighting("' This is a comment");
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
      expect(commentToken?.text).toContain("'");
    });

    it('should handle case-insensitive REM', () => {
      const tokens = getSyntaxHighlighting('rem lowercase comment');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle code with both strings and comments', () => {
      const tokens = getSyntaxHighlighting('PRINT "Test" \'comment');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(stringToken).toBeDefined();
      expect(commentToken).toBeDefined();
    });

    it('should handle multiline code', () => {
      const code = 'PRINT "Line 1"\nPRINT "Line 2"';
      const tokens = getSyntaxHighlighting(code);
      expect(tokens.length).toBeGreaterThan(2);
    });

    it('should handle empty strings', () => {
      const tokens = getSyntaxHighlighting('PRINT ""');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
    });

    it('should handle code without special tokens', () => {
      const tokens = getSyntaxHighlighting('x = 5');
      expect(tokens.length).toBeGreaterThan(0);
      const sourceToken = tokens.find(t => t.scope === 'source.QB64PE');
      expect(sourceToken).toBeDefined();
    });

    it('should handle empty code', () => {
      const tokens = getSyntaxHighlighting('');
      expect(Array.isArray(tokens)).toBe(true);
    });

    it('should tokenize code before comment', () => {
      const tokens = getSyntaxHighlighting('x = 5 REM assign value');
      expect(tokens.length).toBeGreaterThan(1);
      const sourceToken = tokens.find(t => t.scope === 'source.QB64PE');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(sourceToken).toBeDefined();
      expect(commentToken).toBeDefined();
    });

    it('should handle comment at start of line with apostrophe', () => {
      const tokens = getSyntaxHighlighting("'comment at start");
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
      expect(commentToken?.text).toContain("'comment at start");
    });

    it('should handle REM comment at start of line', () => {
      const tokens = getSyntaxHighlighting("REM comment at start");
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
      expect(commentToken?.text).toContain("REM comment at start");
    });

    it('should handle code followed by apostrophe comment', () => {
      const tokens = getSyntaxHighlighting("x = 5 'comment");
      expect(tokens.length).toBeGreaterThan(1);
      const sourceToken = tokens.find(t => t.scope === 'source.QB64PE' && t.text === 'x = 5 ');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(sourceToken).toBeDefined();
      expect(commentToken).toBeDefined();
    });

    it('should handle multiple strings on same line', () => {
      const tokens = getSyntaxHighlighting('PRINT "A" "B"');
      const stringTokens = tokens.filter(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringTokens.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle string at end of line', () => {
      const tokens = getSyntaxHighlighting('PRINT "text"');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
      expect(stringToken?.text).toBe('"text"');
    });

    it('should handle mixed content on multiple lines', () => {
      const code = 'PRINT "Test"\nREM Comment\nx = 5';
      const tokens = getSyntaxHighlighting(code);
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      const sourceToken = tokens.find(t => t.scope === 'source.QB64PE');
      expect(stringToken).toBeDefined();
      expect(commentToken).toBeDefined();
      expect(sourceToken).toBeDefined();
    });

    it('should handle line with only spaces', () => {
      const tokens = getSyntaxHighlighting('   ');
      expect(Array.isArray(tokens)).toBe(true);
    });

    it('should handle newlines within code', () => {
      const tokens = getSyntaxHighlighting('\n\n');
      expect(Array.isArray(tokens)).toBe(true);
    });

    it('should handle string with spaces', () => {
      const tokens = getSyntaxHighlighting('PRINT "  spaces  "');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
      expect(stringToken?.text).toBe('"  spaces  "');
    });

    it('should handle rem in middle of line (case insensitive)', () => {
      const tokens = getSyntaxHighlighting('x = 5: rem set value');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle Rem with mixed case', () => {
      const tokens = getSyntaxHighlighting('Rem Mixed Case Comment');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle rEm with unusual case', () => {
      const tokens = getSyntaxHighlighting('rEm unusual case');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle comment that does not match at index 0', () => {
      const tokens = getSyntaxHighlighting('code REM not at start');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle line with code then string', () => {
      const tokens = getSyntaxHighlighting('x = "value"');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
    });

    it('should handle unclosed string followed by more code', () => {
      const tokens = getSyntaxHighlighting('PRINT "unclosed');
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle empty line in multiline code', () => {
      const code = 'PRINT "A"\n\nPRINT "B"';
      const tokens = getSyntaxHighlighting(code);
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle multiple comments', () => {
      const code = "'comment1\n'comment2";
      const tokens = getSyntaxHighlighting(code);
      const commentTokens = tokens.filter(t => t.scope === 'comment.line.QB64PE');
      expect(commentTokens.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle code with multiple operators', () => {
      const tokens = getSyntaxHighlighting('x = y + z * 2');
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle string with escaped content', () => {
      const tokens = getSyntaxHighlighting('PRINT "test"');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken).toBeDefined();
    });

    it('should handle comment at exact start (index 0)', () => {
      const tokens = getSyntaxHighlighting('REM at position 0');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle apostrophe at first character', () => {
      const tokens = getSyntaxHighlighting("'first char");
      expect(tokens[0].scope).toBe('comment.line.QB64PE');
    });

    it('should handle REM within first 10 characters', () => {
      const tokens = getSyntaxHighlighting('x = 1 REM within 10');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle code without comment match', () => {
      const tokens = getSyntaxHighlighting('x = y + z');
      const sourceTokens = tokens.filter(t => t.scope === 'source.QB64PE');
      expect(sourceTokens.length).toBeGreaterThan(0);
    });

    it('should handle string that spans to end of line', () => {
      const tokens = getSyntaxHighlighting('PRINT "end of line"');
      const stringToken = tokens.find(t => t.scope === 'string.quoted.double.QB64PE');
      expect(stringToken?.text).toBe('"end of line"');
    });

    it('should handle comment match with empty first capture group', () => {
      const tokens = getSyntaxHighlighting("'empty before");
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });

    it('should handle comment match beyond 10 characters', () => {
      const tokens = getSyntaxHighlighting('longcodehere REM far away');
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle apostrophe beyond 10 characters', () => {
      const tokens = getSyntaxHighlighting("longcodehere 'far comment");
      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should handle line starting with non-apostrophe but having REM far', () => {
      const tokens = getSyntaxHighlighting('code = value REM comment');
      const commentToken = tokens.find(t => t.scope === 'comment.line.QB64PE');
      expect(commentToken).toBeDefined();
    });
  });

  describe('type definitions', () => {
    it('should have SyntaxPattern type', () => {
      const pattern: SyntaxPattern = {
        regex: 'test',
        name: 'test.pattern'
      };
      expect(pattern).toBeDefined();
    });

    it('should have RepositoryPattern type', () => {
      const repo: RepositoryPattern = {
        'test': {
          begin: 'start',
          end: 'end'
        }
      };
      expect(repo).toBeDefined();
    });
  });
});
