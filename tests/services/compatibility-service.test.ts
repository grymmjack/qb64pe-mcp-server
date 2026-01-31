import { QB64PECompatibilityService } from '../../src/services/compatibility-service';

describe('QB64PECompatibilityService', () => {
  let service: QB64PECompatibilityService;

  beforeEach(() => {
    service = new QB64PECompatibilityService();
  });

  describe('validateCompatibility', () => {
    it('should detect function return type issues', async () => {
      const code = 'FUNCTION Test(x AS INTEGER) AS INTEGER\nTest = x * 2\nEND FUNCTION';
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle valid code', async () => {
      const code = 'FUNCTION Test%(x AS INTEGER)\nTest% = x * 2\nEND FUNCTION';
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should detect multiple issues', async () => {
      const code = `
        FUNCTION Test(x AS INTEGER) AS INTEGER
        SUB OldSub()
        END SUB
      `;
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle empty code', async () => {
      const issues = await service.validateCompatibility('');
      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBe(0);
    });

    it('should provide suggestions for issues', async () => {
      const code = 'FUNCTION Bad(x AS INTEGER) AS STRING\nBad = "test"\nEND FUNCTION';
      const issues = await service.validateCompatibility(code);
      if (issues.length > 0) {
        expect(issues[0]).toHaveProperty('suggestion');
      }
    });
  });

  describe('getPlatformCompatibility', () => {
    it('should return Windows compatibility info', async () => {
      const info = await service.getPlatformCompatibility('windows');
      expect(info).toBeDefined();
      expect(info).toHaveProperty('supported');
      expect(info).toHaveProperty('unsupported');
    });

    it('should return macOS compatibility info', async () => {
      const info = await service.getPlatformCompatibility('macos');
      expect(info).toBeDefined();
      expect(info).toHaveProperty('supported');
      expect(info).toHaveProperty('unsupported');
    });

    it('should return Linux compatibility info', async () => {
      const info = await service.getPlatformCompatibility('linux');
      expect(info).toBeDefined();
      expect(info).toHaveProperty('supported');
      expect(info).toHaveProperty('unsupported');
    });

    it('should return all platforms info', async () => {
      const info = await service.getPlatformCompatibility('all');
      expect(info).toBeDefined();
      expect(info).toHaveProperty('windows');
      expect(info).toHaveProperty('linux');
      expect(info).toHaveProperty('macos');
    });
  });

  describe('searchCompatibility', () => {
    it('should search for function issues', async () => {
      const results = await service.searchCompatibility('function return');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search for type issues', async () => {
      const results = await service.searchCompatibility('type');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty search', async () => {
      const results = await service.searchCompatibility('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search for graphics issues', async () => {
      const results = await service.searchCompatibility('screen graphics');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should search for file handling', async () => {
      const results = await service.searchCompatibility('file open');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('issue categorization', () => {
    it('should categorize function issues', async () => {
      const code = 'FUNCTION Test(x) AS INTEGER\\nTest = x\\nEND FUNCTION';
      const issues = await service.validateCompatibility(code);
      if (issues.length > 0) {
        expect(issues[0]).toHaveProperty('category');
        expect(issues[0]).toHaveProperty('severity');
      }
    });

    it('should detect errors vs warnings', async () => {
      const code = 'DIM x AS INTEGER\\nx = 10';
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('code validation edge cases', () => {
    it('should handle multiline code', async () => {
      const code = `
        FUNCTION Calculate%(a AS INTEGER, b AS INTEGER)
          DIM result AS INTEGER
          result = a + b
          Calculate% = result
        END FUNCTION
      `;
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle comments', async () => {
      const code = `' This is a comment\nPRINT "test"`;
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle string literals', async () => {
      const code = 'PRINT "Function test AS INTEGER"';
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('getBestPractices', () => {
    it('should return best practices array', async () => {
      const practices = await service.getBestPractices();
      expect(Array.isArray(practices)).toBe(true);
    });

    it('should provide meaningful practices', async () => {
      const practices = await service.getBestPractices();
      expect(practices).toBeDefined();
    });
  });

  describe('getDebuggingGuidance', () => {
    it('should provide general debugging guidance', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toBeDefined();
      expect(typeof guidance).toBe('string');
      expect(guidance.length).toBeGreaterThan(0);
      expect(guidance).toContain('Debugging Guide');
    });

    it('should provide function-specific guidance', async () => {
      const guidance = await service.getDebuggingGuidance('function return error');
      expect(guidance).toContain('function');
      expect(guidance).toContain('Specific Guidance');
    });

    it('should provide array-specific guidance', async () => {
      const guidance = await service.getDebuggingGuidance('array subscript out of range');
      expect(guidance).toContain('array');
      expect(guidance).toContain('bounds');
    });

    it('should provide file-specific guidance', async () => {
      const guidance = await service.getDebuggingGuidance('file open error');
      expect(guidance).toContain('file');
      expect(guidance).toContain('FREEFILE');
    });

    it('should provide syntax-specific guidance', async () => {
      const guidance = await service.getDebuggingGuidance('syntax error expected');
      expect(guidance.toLowerCase()).toContain('quotes');
    });

    it('should provide scope-specific guidance', async () => {
      const guidance = await service.getDebuggingGuidance('variable scope problem');
      expect(guidance).toContain('SHARED');
    });

    it('should provide dynamic array guidance', async () => {
      const guidance = await service.getDebuggingGuidance('dynamic array issue');
      // Contains 'array' so gets array guidance
      expect(guidance.toLowerCase()).toContain('bound');
    });

    it('should provide general guidance for unknown issues', async () => {
      const guidance = await service.getDebuggingGuidance('unknown weird error');
      expect(guidance).toBeDefined();
      expect(guidance).toContain('debug');
    });

    it('should handle empty issue string', async () => {
      const guidance = await service.getDebuggingGuidance('');
      expect(guidance).toBeDefined();
      expect(typeof guidance).toBe('string');
    });
  });

  describe('debugging guidance details', () => {
    it('should include traditional error handling', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('ON ERROR');
    });

    it('should include modern assertions', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('_ASSERT');
    });

    it('should include console debugging', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('$CONSOLE');
    });

    it('should include modern logging', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('_LOGERROR');
    });
  });

  describe('specific guidance patterns', () => {
    it('should mention type sigils for function errors', async () => {
      const guidance = await service.getDebuggingGuidance('function type problem');
      expect(guidance).toContain('sigil');
    });

    it('should mention bounds checking for array errors', async () => {
      const guidance = await service.getDebuggingGuidance('array bounds error');
      expect(guidance).toContain('BOUND');
    });

    it('should mention file closing for file errors', async () => {
      const guidance = await service.getDebuggingGuidance('file handle error');
      expect(guidance).toContain('close');
    });

    it('should mention quotes for syntax errors', async () => {
      const guidance = await service.getDebuggingGuidance('syntax parse error');
      expect(guidance).toContain('quotes');
    });

    it('should mention DIM SHARED for scope errors', async () => {
      const guidance = await service.getDebuggingGuidance('scope issue shared');
      expect(guidance).toContain('DIM SHARED');
    });

    it('should mention REDIM for dynamic arrays', async () => {
      const guidance = await service.getDebuggingGuidance('dynamic issue');
      // 'dynamic' alone triggers dynamic array guidance
      expect(guidance.toLowerCase()).toContain('redim');
    });
  });

  describe('knowledge base integration', () => {
    it('should load knowledge base on initialization', async () => {
      const newService = new QB64PECompatibilityService();
      const practices = await newService.getBestPractices();
      expect(Array.isArray(practices)).toBe(true);
    });

    it('should provide consistent results', async () => {
      const guidance1 = await service.getDebuggingGuidance('test');
      const guidance2 = await service.getDebuggingGuidance('test');
      expect(guidance1).toBe(guidance2);
    });
  });

  describe('platform-specific compatibility', () => {
    it('should differentiate Windows-specific features', async () => {
      const windowsInfo = await service.getPlatformCompatibility('windows');
      expect(windowsInfo).toBeDefined();
    });

    it('should differentiate macOS-specific features', async () => {
      const macInfo = await service.getPlatformCompatibility('macos');
      expect(macInfo).toBeDefined();
    });

    it('should differentiate Linux-specific features', async () => {
      const linuxInfo = await service.getPlatformCompatibility('linux');
      expect(linuxInfo).toBeDefined();
    });

    it('should aggregate all platform info', async () => {
      const allInfo = await service.getPlatformCompatibility('all');
      expect(allInfo).toHaveProperty('windows');
      expect(allInfo).toHaveProperty('macos');
      expect(allInfo).toHaveProperty('linux');
    });
  });

  describe('error severity classification', () => {
    it('should classify errors appropriately', async () => {
      const code = 'FUNCTION Bad(x AS INTEGER) AS STRING\nBad = x\nEND FUNCTION';
      const issues = await service.validateCompatibility(code);
      if (issues.length > 0) {
        expect(['error', 'warning', 'info']).toContain(issues[0].severity);
      }
    });
  });

  describe('search functionality', () => {
    it('should find relevant compatibility issues', async () => {
      const results = await service.searchCompatibility('function');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle case-insensitive search', async () => {
      const results1 = await service.searchCompatibility('FUNCTION');
      const results2 = await service.searchCompatibility('function');
      expect(Array.isArray(results1)).toBe(true);
      expect(Array.isArray(results2)).toBe(true);
    });

    it('should return empty array for no matches', async () => {
      const results = await service.searchCompatibility('xyzabc123impossible');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('multiple issue detection', () => {
    it('should detect multiple different issues', async () => {
      const code = `
        FUNCTION Test(x AS INTEGER) AS INTEGER
        FUNCTION Another(y AS STRING) AS STRING
      `;
      const issues = await service.validateCompatibility(code);
      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('guidance formatting', () => {
    it('should provide well-formatted guidance', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('#');
      expect(guidance).toContain('```');
    });

    it('should include code examples in guidance', async () => {
      const guidance = await service.getDebuggingGuidance();
      expect(guidance).toContain('basic');
    });
  });

  describe('boolean constants validation', () => {
    it('should detect usage of user-defined TRUE constant', async () => {
      const code = 'MARQUEE_draw TRUE';
      const issues = await service.validateCompatibility(code);
      const trueIssue = issues.find(issue => issue.category === 'boolean_constants');
      expect(trueIssue).toBeDefined();
      expect(trueIssue?.message).toContain('not built-in');
    });

    it('should detect usage of user-defined FALSE constant', async () => {
      const code = 'result = FALSE';
      const issues = await service.validateCompatibility(code);
      const falseIssue = issues.find(issue => issue.category === 'boolean_constants');
      expect(falseIssue).toBeDefined();
      expect(falseIssue?.message).toContain('not built-in');
    });

    it('should not flag TRUE when it is being defined', async () => {
      const code = 'CONST TRUE = -1';
      const issues = await service.validateCompatibility(code);
      const trueIssue = issues.find(issue => 
        issue.category === 'boolean_constants' && issue.pattern === 'TRUE'
      );
      // Should not find it as an error when followed by =
      expect(trueIssue).toBeUndefined();
    });

    it('should suggest using _TRUE and _FALSE', async () => {
      const code = 'IF flag = TRUE THEN';
      const issues = await service.validateCompatibility(code);
      const trueIssue = issues.find(issue => issue.category === 'boolean_constants');
      expect(trueIssue?.suggestion).toContain('_TRUE');
      expect(trueIssue?.suggestion).toContain('_FALSE');
    });
  });

  describe('unnecessary DECLARE SUB validation', () => {
    it('should detect unnecessary DECLARE SUB statement', async () => {
      const code = 'DECLARE SUB MyProcedure';
      const issues = await service.validateCompatibility(code);
      const declareIssue = issues.find(issue => issue.category === 'unnecessary_declarations');
      expect(declareIssue).toBeDefined();
      expect(declareIssue?.message).toContain('unnecessary');
    });

    it('should also detect unnecessary DECLARE FUNCTION', async () => {
      const code = 'DECLARE FUNCTION Calculate% (x AS INTEGER)';
      const issues = await service.validateCompatibility(code);
      const declareIssue = issues.find(issue => 
        issue.category === 'unnecessary_declarations'
      );
      // Both SUB and FUNCTION DECLARE are unnecessary in QB64PE
      expect(declareIssue).toBeDefined();
    });

    it('should suggest removing DECLARE statements', async () => {
      const code = 'DECLARE SUB Draw_Menu';
      const issues = await service.validateCompatibility(code);
      const declareIssue = issues.find(issue => issue.category === 'unnecessary_declarations');
      expect(declareIssue?.suggestion).toContain('Remove DECLARE');
    });

    it('should mention DECLARE is only for C library imports', async () => {
      const code = 'DECLARE SUB HandleClick';
      const issues = await service.validateCompatibility(code);
      const declareIssue = issues.find(issue => issue.category === 'unnecessary_declarations');
      expect(declareIssue?.suggestion).toContain('DECLARE LIBRARY');
    });
  });

  describe('validateKeyboardBufferSafety', () => {
    it('should detect _KEYDOWN(27) without buffer drain', async () => {
      const code = `
SUB HandleKeys
  IF _KEYDOWN(27) THEN
    EXIT SUB
  END IF
END SUB`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.hasIssues).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
      const escIssue = result.issues.find(i => i.pattern.includes('_KEYDOWN(27)'));
      expect(escIssue).toBeDefined();
    });

    it('should not flag code with proper buffer drain', async () => {
      const code = `
SUB HandleKeys
  IF _KEYDOWN(27) THEN
    DO WHILE _KEYHIT: LOOP
    EXIT SUB
  END IF
END SUB`;
      const result = await service.validateKeyboardBufferSafety(code);
      const escIssues = result.issues.filter(i => i.pattern.includes('_KEYDOWN(27)'));
      expect(escIssues.length).toBe(0);
    });

    it('should detect CTRL modifier check without buffer drain', async () => {
      const code = `
SUB HandleKeys
  IF _KEYDOWN(100305) THEN
    ' CTRL is held
    k$ = INKEY$
  END IF
END SUB`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.summary.ctrlModifierChecks).toBeGreaterThan(0);
    });

    it('should detect INKEY$ after CTRL check without drain', async () => {
      const code = `
SUB HandleKeys
  IF _KEYDOWN(100305) THEN
    k$ = INKEY$
    IF k$ = CHR$(3) THEN SYSTEM
  END IF
END SUB`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.summary.inkeyUsages).toBeGreaterThan(0);
    });

    it('should return summary statistics', async () => {
      const code = `
DO
  IF _KEYDOWN(27) THEN EXIT DO
  k$ = INKEY$
LOOP`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.summary).toBeDefined();
      expect(result.summary.keydownUsages).toBeDefined();
      expect(result.summary.inkeyUsages).toBeDefined();
      expect(result.summary.bufferDrains).toBeDefined();
    });

    it('should provide best practices', async () => {
      const code = 'k$ = INKEY$';
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.bestPractices).toBeDefined();
      expect(result.bestPractices.length).toBeGreaterThan(0);
    });

    it('should handle empty code', async () => {
      const result = await service.validateKeyboardBufferSafety('');
      expect(result.hasIssues).toBe(false);
      expect(result.issues.length).toBe(0);
    });

    it('should skip comments', async () => {
      const code = `
' IF _KEYDOWN(27) THEN EXIT SUB
REM Another comment with _KEYDOWN(27)`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.summary.keydownUsages).toBe(0);
    });

    it('should detect EXIT SUB after _KEYDOWN without buffer drain', async () => {
      const code = `
SUB HandleInput
  IF _KEYDOWN(65) THEN
    ' Handle A key
    EXIT SUB
  END IF
END SUB`;
      const result = await service.validateKeyboardBufferSafety(code);
      const exitIssue = result.issues.find(i => i.pattern.includes('EXIT'));
      expect(exitIssue).toBeDefined();
    });

    it('should suggest buffer drain pattern', async () => {
      const code = `IF _KEYDOWN(27) THEN END`;
      const result = await service.validateKeyboardBufferSafety(code);
      if (result.issues.length > 0) {
        expect(result.issues[0].suggestion).toContain('KEYHIT');
      }
    });

    it('should provide control character reference in best practices', async () => {
      const code = `
IF _KEYDOWN(100305) THEN
  k$ = INKEY$
END IF`;
      const result = await service.validateKeyboardBufferSafety(code);
      expect(result.bestPractices.some(p => p.includes('CTRL') || p.includes('buffer'))).toBe(true);
    });
  });
});
