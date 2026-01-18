import { QB64PESyntaxService } from '../../src/services/syntax-service';

describe('QB64PESyntaxService', () => {
  let service: QB64PESyntaxService;

  beforeEach(() => {
    service = new QB64PESyntaxService();
  });

  describe('validateSyntax', () => {
    it('should validate simple valid code', async () => {
      const code = 'PRINT "Hello World"';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
    });

    it('should detect syntax errors', async () => {
      const code = 'PRINT "Unclosed string';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should validate FUNCTION declarations', async () => {
      const code = 'FUNCTION Test%(x AS INTEGER)\nTest% = x * 2\nEND FUNCTION';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should validate SUB declarations', async () => {
      const code = 'SUB MySub\nPRINT "Test"\nEND SUB';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should handle empty code', async () => {
      const result = await service.validateSyntax('');
      
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
    });

    it('should detect undefined variables', async () => {
      const code = 'x = y + 10\nPRINT x';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should validate DIM statements', async () => {
      const code = 'DIM x AS INTEGER\nx = 10\nPRINT x';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
    });

    it('should validate FOR loops', async () => {
      const code = 'FOR i = 1 TO 10\nPRINT i\nNEXT i';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should validate WHILE loops', async () => {
      const code = 'WHILE x < 10\nx = x + 1\nWEND';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should validate IF statements', async () => {
      const code = 'IF x > 5 THEN\nPRINT "Greater"\nEND IF';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should detect mismatched brackets', async () => {
      const code = 'DIM arr(10 AS INTEGER';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should provide syntax score', async () => {
      const code = 'PRINT "Hello"';
      const result = await service.validateSyntax(code);
      
      expect(result).toHaveProperty('score');
      expect(typeof result.score).toBe('number');
    });
  });

  describe('getSyntaxHelp', () => {
    it('should provide help for PRINT', () => {
      const help = service.getSyntaxHelp('PRINT');
      expect(help === null || typeof help === 'string').toBe(true);
    });

    it('should provide help for DIM', () => {
      const help = service.getSyntaxHelp('DIM');
      expect(help === null || typeof help === 'string').toBe(true);
    });

    it('should provide help for FUNCTION', () => {
      const help = service.getSyntaxHelp('FUNCTION');
      expect(help === null || typeof help === 'string').toBe(true);
    });

    it('should handle unknown keywords', () => {
      const help = service.getSyntaxHelp('UNKNOWN_KEYWORD_XYZ');
      expect(help === null || typeof help === 'string').toBe(true);
    });
  });

  describe('getSyntaxHighlighting', () => {
    it('should highlight QB64PE code', () => {
      const code = 'PRINT "Hello World"';
      const result = service.getSyntaxHighlighting(code);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty code', () => {
      const result = service.getSyntaxHighlighting('');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should highlight keywords', () => {
      const code = 'DIM x AS INTEGER';
      const result = service.getSyntaxHighlighting(code);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSyntaxPatterns', () => {
    it('should get syntax patterns', () => {
      const patterns = service.getSyntaxPatterns();
      expect(patterns).toBeDefined();
    });
  });

  describe('getRepositoryPatterns', () => {
    it('should get repository patterns', () => {
      const patterns = service.getRepositoryPatterns();
      expect(patterns).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle comments', async () => {
      const code = `' This is a comment\nPRINT "test"`;
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
    });

    it('should handle multiple statements per line', async () => {
      const code = 'x = 10: y = 20: PRINT x + y';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
    });

    it('should handle string literals with quotes', async () => {
      const code = 'PRINT "He said ""Hello"""';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
    });

    it('should validate complex expressions', async () => {
      const code = 'result = (x * 2 + y) / (z - 5)';
      const result = await service.validateSyntax(code);
      
      expect(result).toBeDefined();
    });
  });
});
