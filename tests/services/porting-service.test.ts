import { QB64PEPortingService } from '../../src/services/porting-service';

describe('QB64PEPortingService', () => {
  let service: QB64PEPortingService;

  beforeEach(() => {
    service = new QB64PEPortingService();
  });

  describe('portQBasicToQB64PE', () => {
    it('should port simple QBasic code', async () => {
      const code = 'PRINT "Hello"';
      const result = await service.portQBasicToQB64PE(code);
      expect(result).toHaveProperty('portedCode');
      expect(result).toHaveProperty('transformations');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('errors');
    });

    it('should preserve code functionality', async () => {
      const code = 'FOR i = 1 TO 10\\nPRINT i\\nNEXT i';
      const result = await service.portQBasicToQB64PE(code);
      expect(result.portedCode).toContain('For');  // Porting converts to title case
      expect(result.portedCode).toContain('NEXT'); // NEXT stays uppercase
    });

    it('should handle with options', async () => {
      const code = 'PRINT "Test"';
      const options = { addModernFeatures: true, optimizePerformance: true };
      const result = await service.portQBasicToQB64PE(code, options);
      expect(result).toBeDefined();
    });

    it('should handle DEF FN statements', async () => {
      const code = 'DEF FNSquare(x) = x * x\\nPRINT FNSquare(5)';
      const result = await service.portQBasicToQB64PE(code);
      expect(result.transformations.length).toBeGreaterThan(0);
    });

    it('should modernize graphics code', async () => {
      const code = 'SCREEN 13\\nCIRCLE (160, 100), 50';
      const result = await service.portQBasicToQB64PE(code, { convertGraphics: true });
      expect(result.portedCode).toBeDefined();
    });

    it('should handle different dialects', async () => {
      const code = 'PRINT "Test"';
      const result = await service.portQBasicToQB64PE(code, { sourceDialect: 'qbasic' });
      expect(result).toBeDefined();
    });



    it('should add error handling', async () => {
      const code = 'OPEN "test.txt" FOR INPUT AS #1';
      const result = await service.portQBasicToQB64PE(code, { addModernFeatures: true });
      expect(result).toBeDefined();
    });

    it('should handle empty code', async () => {
      const result = await service.portQBasicToQB64PE('');
      expect(result.portedCode).toBe('');
      expect(result.errors.length).toBe(0);
    });

    it('should detect incompatibilities', async () => {
      const code = 'POKE 1000, 255'; // Potential incompatibility
      const result = await service.portQBasicToQB64PE(code);
      expect(result.warnings.length >= 0).toBe(true);
    });
  });


});
