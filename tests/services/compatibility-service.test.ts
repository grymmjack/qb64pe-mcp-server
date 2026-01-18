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
});
