import {
  QB64PE_RESERVED_WORDS,
  QB64PE_ALL_KEYWORDS,
  QB64PE_KEYWORDS_BY_CATEGORY,
  isReservedWord,
  isQB64Keyword,
  getReservedWordAlternatives
} from '../../src/constants/reserved-words';

describe('QB64PE Reserved Words', () => {
  describe('QB64PE_RESERVED_WORDS', () => {
    it('should be defined', () => {
      expect(QB64PE_RESERVED_WORDS).toBeDefined();
    });

    it('should be a Set', () => {
      expect(QB64PE_RESERVED_WORDS instanceof Set).toBe(true);
    });

    it('should have reserved words', () => {
      expect(QB64PE_RESERVED_WORDS.size).toBeGreaterThan(0);
    });

    it('should contain basic reserved words', () => {
      expect(QB64PE_RESERVED_WORDS.has('ABS')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('AND')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('OR')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('NOT')).toBe(true);
    });

    it('should contain QB64PE-specific reserved words', () => {
      expect(QB64PE_RESERVED_WORDS.has('_RGB')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('_ALPHA')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('_NEWIMAGE')).toBe(true);
    });

    it('should contain data type keywords', () => {
      expect(QB64PE_RESERVED_WORDS.has('INTEGER')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('LONG')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('SINGLE')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('DOUBLE')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('STRING')).toBe(true);
    });

    it('should contain mathematical functions', () => {
      expect(QB64PE_RESERVED_WORDS.has('SIN')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('COS')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('TAN')).toBe(true);
      expect(QB64PE_RESERVED_WORDS.has('SQR')).toBe(true);
    });

    it('should be at least 256 words', () => {
      expect(QB64PE_RESERVED_WORDS.size).toBeGreaterThanOrEqual(256);
    });

    it('should be a ReadonlySet', () => {
      // TypeScript compile-time check, but we can verify it's a Set
      expect(QB64PE_RESERVED_WORDS instanceof Set).toBe(true);
    });
  });

  describe('QB64PE_ALL_KEYWORDS', () => {
    it('should be defined', () => {
      expect(QB64PE_ALL_KEYWORDS).toBeDefined();
    });

    it('should be a Set', () => {
      expect(QB64PE_ALL_KEYWORDS instanceof Set).toBe(true);
    });

    it('should have more keywords than reserved words', () => {
      expect(QB64PE_ALL_KEYWORDS.size).toBeGreaterThan(QB64PE_RESERVED_WORDS.size);
    });

    it('should contain all reserved words', () => {
      const reservedWordsArray = Array.from(QB64PE_RESERVED_WORDS);
      const allContained = reservedWordsArray.every(word => 
        QB64PE_ALL_KEYWORDS.has(word)
      );
      expect(allContained).toBe(true);
    });

    it('should contain metacommands', () => {
      expect(QB64PE_ALL_KEYWORDS.has('$CONSOLE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('$INCLUDE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('$DYNAMIC')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('$STATIC')).toBe(true);
    });

    it('should contain control flow keywords', () => {
      expect(QB64PE_ALL_KEYWORDS.has('IF')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('THEN')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('ELSE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('FOR...NEXT')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('WHILE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('DO...LOOP')).toBe(true);
    });

    it('should contain graphics-related keywords', () => {
      expect(QB64PE_ALL_KEYWORDS.has('SCREEN')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('CIRCLE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('LINE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('PSET')).toBe(true);
    });

    it('should contain file operations keywords', () => {
      expect(QB64PE_ALL_KEYWORDS.has('OPEN')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('CLOSE')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('INPUT')).toBe(true);
      expect(QB64PE_ALL_KEYWORDS.has('PRINT')).toBe(true);
    });

    it('should be at least 850 keywords', () => {
      expect(QB64PE_ALL_KEYWORDS.size).toBeGreaterThanOrEqual(850);
    });
  });

  describe('QB64PE_KEYWORDS_BY_CATEGORY', () => {
    it('should be defined', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof QB64PE_KEYWORDS_BY_CATEGORY).toBe('object');
    });

    it('should have category properties', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('statements');
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('functions');
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('metacommands');
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('operators');
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('types');
      expect(QB64PE_KEYWORDS_BY_CATEGORY).toHaveProperty('constants');
    });

    it('should have statements as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.statements instanceof Set).toBe(true);
    });

    it('should have functions as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.functions instanceof Set).toBe(true);
    });

    it('should have metacommands as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.metacommands instanceof Set).toBe(true);
    });

    it('should have operators as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.operators instanceof Set).toBe(true);
    });

    it('should have types as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.types instanceof Set).toBe(true);
    });

    it('should have constants as a Set', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.constants instanceof Set).toBe(true);
    });

    it('should have non-empty category sets', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.statements.size).toBeGreaterThan(0);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.functions.size).toBeGreaterThan(0);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.metacommands.size).toBeGreaterThan(0);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.operators.size).toBeGreaterThan(0);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.types.size).toBeGreaterThan(0);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.constants.size).toBeGreaterThan(0);
    });

    it('should have statements contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.statements.has('IF')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.statements.has('FOR...NEXT')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.statements.has('DO...LOOP')).toBe(true);
    });

    it('should have functions contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.functions.has('ABS')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.functions.has('SIN')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.functions.has('COS')).toBe(true);
    });

    it('should have metacommands contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.metacommands.has('$CONSOLE')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.metacommands.has('$INCLUDE')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.metacommands.has('$DYNAMIC')).toBe(true);
    });

    it('should have operators contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.operators.has('AND')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.operators.has('OR')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.operators.has('NOT')).toBe(true);
    });

    it('should have types contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.types.has('INTEGER')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.types.has('LONG')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.types.has('STRING')).toBe(true);
    });

    it('should have constants contain expected values', () => {
      expect(QB64PE_KEYWORDS_BY_CATEGORY.constants.has('_PI')).toBe(true);
      expect(QB64PE_KEYWORDS_BY_CATEGORY.constants.has('_PIXELSIZE')).toBe(true);
    });

    it('should have all categories be Sets', () => {
      Object.values(QB64PE_KEYWORDS_BY_CATEGORY).forEach(category => {
        expect(category instanceof Set).toBe(true);
      });
    });
  });

  describe('isReservedWord', () => {
    it('should return true for reserved words (uppercase)', () => {
      expect(isReservedWord('ABS')).toBe(true);
      expect(isReservedWord('AND')).toBe(true);
      expect(isReservedWord('INTEGER')).toBe(true);
      expect(isReservedWord('DOUBLE')).toBe(true);
    });

    it('should return true for reserved words (lowercase)', () => {
      expect(isReservedWord('abs')).toBe(true);
      expect(isReservedWord('and')).toBe(true);
      expect(isReservedWord('integer')).toBe(true);
      expect(isReservedWord('double')).toBe(true);
    });

    it('should return true for reserved words (mixed case)', () => {
      expect(isReservedWord('Abs')).toBe(true);
      expect(isReservedWord('And')).toBe(true);
      expect(isReservedWord('Integer')).toBe(true);
      expect(isReservedWord('Double')).toBe(true);
    });

    it('should return true for QB64PE-specific reserved words', () => {
      expect(isReservedWord('_RGB')).toBe(true);
      expect(isReservedWord('_ALPHA')).toBe(true);
      expect(isReservedWord('_NEWIMAGE')).toBe(true);
      expect(isReservedWord('_LOADIMAGE')).toBe(true);
    });

    it('should return true for QB64PE-specific reserved words (lowercase)', () => {
      expect(isReservedWord('_rgb')).toBe(true);
      expect(isReservedWord('_alpha')).toBe(true);
      expect(isReservedWord('_newimage')).toBe(true);
    });

    it('should return false for non-reserved words', () => {
      expect(isReservedWord('myVariable')).toBe(false);
      expect(isReservedWord('userName')).toBe(false);
      expect(isReservedWord('counter')).toBe(false);
      expect(isReservedWord('x')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isReservedWord('')).toBe(false);
    });

    it('should return false for strings with spaces', () => {
      expect(isReservedWord('ABS ')).toBe(false);
      expect(isReservedWord(' ABS')).toBe(false);
      expect(isReservedWord('ABS AND')).toBe(false);
    });

    it('should return false for keywords that are in ALL_KEYWORDS but not RESERVED_WORDS', () => {
      // PRINT is a keyword but not a reserved word (you can have variables named after it)
      const allButNotReserved = Array.from(QB64PE_ALL_KEYWORDS)
        .filter(kw => !QB64PE_RESERVED_WORDS.has(kw))[0];
      
      if (allButNotReserved) {
        expect(isReservedWord(allButNotReserved)).toBe(false);
      }
    });

    it('should handle special characters correctly', () => {
      expect(isReservedWord('ABS$')).toBe(false);
      expect(isReservedWord('ABS%')).toBe(false);
    });
  });

  describe('isQB64Keyword', () => {
    it('should return true for all reserved words', () => {
      expect(isQB64Keyword('ABS')).toBe(true);
      expect(isQB64Keyword('AND')).toBe(true);
      expect(isQB64Keyword('INTEGER')).toBe(true);
    });

    it('should return true for keywords (uppercase)', () => {
      expect(isQB64Keyword('PRINT')).toBe(true);
      expect(isQB64Keyword('IF')).toBe(true);
      expect(isQB64Keyword('WHILE')).toBe(true);
      expect(isQB64Keyword('THEN')).toBe(true);
    });

    it('should return true for keywords (lowercase)', () => {
      expect(isQB64Keyword('print')).toBe(true);
      expect(isQB64Keyword('if')).toBe(true);
      expect(isQB64Keyword('while')).toBe(true);
    });

    it('should return true for keywords (mixed case)', () => {
      expect(isQB64Keyword('Print')).toBe(true);
      expect(isQB64Keyword('If')).toBe(true);
      expect(isQB64Keyword('While')).toBe(true);
    });

    it('should return true for metacommands', () => {
      expect(isQB64Keyword('$CONSOLE')).toBe(true);
      expect(isQB64Keyword('$INCLUDE')).toBe(true);
      expect(isQB64Keyword('$DYNAMIC')).toBe(true);
    });

    it('should return true for metacommands (lowercase)', () => {
      expect(isQB64Keyword('$console')).toBe(true);
      expect(isQB64Keyword('$include')).toBe(true);
    });

    it('should return true for QB64PE-specific keywords', () => {
      expect(isQB64Keyword('_RGB')).toBe(true);
      expect(isQB64Keyword('_ALPHA')).toBe(true);
      expect(isQB64Keyword('_NEWIMAGE')).toBe(true);
      expect(isQB64Keyword('_LOADIMAGE')).toBe(true);
      expect(isQB64Keyword('_DISPLAY')).toBe(true);
    });

    it('should return true for graphics keywords', () => {
      expect(isQB64Keyword('SCREEN')).toBe(true);
      expect(isQB64Keyword('CIRCLE')).toBe(true);
      expect(isQB64Keyword('LINE')).toBe(true);
      expect(isQB64Keyword('PSET')).toBe(true);
    });

    it('should return true for file operation keywords', () => {
      expect(isQB64Keyword('OPEN')).toBe(true);
      expect(isQB64Keyword('CLOSE')).toBe(true);
      expect(isQB64Keyword('INPUT')).toBe(true);
    });

    it('should return false for non-keywords', () => {
      expect(isQB64Keyword('myVariable')).toBe(false);
      expect(isQB64Keyword('userName')).toBe(false);
      expect(isQB64Keyword('counter')).toBe(false);
      expect(isQB64Keyword('x')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isQB64Keyword('')).toBe(false);
    });

    it('should return false for strings with spaces', () => {
      expect(isQB64Keyword('PRINT ')).toBe(false);
      expect(isQB64Keyword(' PRINT')).toBe(false);
      expect(isQB64Keyword('PRINT LINE')).toBe(false);
    });

    it('should handle special characters correctly', () => {
      expect(isQB64Keyword('PRINT$')).toBe(false);
      expect(isQB64Keyword('PRINT%')).toBe(false);
    });
  });

  describe('getReservedWordAlternatives', () => {
    it('should return an array of alternatives', () => {
      const alternatives = getReservedWordAlternatives('INTEGER');
      expect(Array.isArray(alternatives)).toBe(true);
      expect(alternatives.length).toBeGreaterThan(0);
    });

    it('should return 5 alternatives', () => {
      const alternatives = getReservedWordAlternatives('INTEGER');
      expect(alternatives.length).toBe(5);
    });

    it('should return alternatives based on lowercase word', () => {
      const alternatives = getReservedWordAlternatives('INTEGER');
      expect(alternatives).toContain('integer_var');
      expect(alternatives).toContain('integer_value');
      expect(alternatives).toContain('my_integer');
      expect(alternatives).toContain('integer1');
      expect(alternatives).toContain('user_integer');
    });

    it('should handle uppercase input', () => {
      const alternatives = getReservedWordAlternatives('ABS');
      expect(alternatives).toContain('abs_var');
      expect(alternatives).toContain('abs_value');
      expect(alternatives).toContain('my_abs');
      expect(alternatives).toContain('abs1');
      expect(alternatives).toContain('user_abs');
    });

    it('should handle lowercase input', () => {
      const alternatives = getReservedWordAlternatives('abs');
      expect(alternatives).toContain('abs_var');
      expect(alternatives).toContain('abs_value');
      expect(alternatives).toContain('my_abs');
      expect(alternatives).toContain('abs1');
      expect(alternatives).toContain('user_abs');
    });

    it('should handle mixed case input', () => {
      const alternatives = getReservedWordAlternatives('Abs');
      expect(alternatives).toContain('abs_var');
      expect(alternatives).toContain('abs_value');
      expect(alternatives).toContain('my_abs');
      expect(alternatives).toContain('abs1');
      expect(alternatives).toContain('user_abs');
    });

    it('should handle QB64PE-specific keywords', () => {
      const alternatives = getReservedWordAlternatives('_RGB');
      expect(alternatives).toContain('_rgb_var');
      expect(alternatives).toContain('_rgb_value');
      expect(alternatives).toContain('my__rgb');
      expect(alternatives).toContain('_rgb1');
      expect(alternatives).toContain('user__rgb');
    });

    it('should handle single character words', () => {
      const alternatives = getReservedWordAlternatives('X');
      expect(alternatives).toContain('x_var');
      expect(alternatives).toContain('x_value');
      expect(alternatives).toContain('my_x');
      expect(alternatives).toContain('x1');
      expect(alternatives).toContain('user_x');
    });

    it('should handle empty string', () => {
      const alternatives = getReservedWordAlternatives('');
      expect(alternatives).toContain('_var');
      expect(alternatives).toContain('_value');
      expect(alternatives).toContain('my_');
      expect(alternatives).toContain('1');
      expect(alternatives).toContain('user_');
    });

    it('should handle words with numbers', () => {
      const alternatives = getReservedWordAlternatives('test123');
      expect(alternatives).toContain('test123_var');
      expect(alternatives).toContain('test123_value');
      expect(alternatives).toContain('my_test123');
      expect(alternatives).toContain('test1231');
      expect(alternatives).toContain('user_test123');
    });

    it('should handle long words', () => {
      const longWord = 'veryLongVariableName';
      const alternatives = getReservedWordAlternatives(longWord);
      expect(alternatives).toContain('verylongvariablename_var');
      expect(alternatives).toContain('verylongvariablename_value');
      expect(alternatives).toContain('my_verylongvariablename');
      expect(alternatives).toContain('verylongvariablename1');
      expect(alternatives).toContain('user_verylongvariablename');
    });

    it('should always return alternatives in same order', () => {
      const alternatives1 = getReservedWordAlternatives('INTEGER');
      const alternatives2 = getReservedWordAlternatives('INTEGER');
      expect(alternatives1).toEqual(alternatives2);
    });

    it('should provide unique alternatives', () => {
      const alternatives = getReservedWordAlternatives('INTEGER');
      const uniqueSet = new Set(alternatives);
      expect(uniqueSet.size).toBe(alternatives.length);
    });
  });
});
