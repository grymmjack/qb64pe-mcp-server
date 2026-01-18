import { QB64PECompilerService } from '../../src/services/compiler-service';

describe('QB64PECompilerService', () => {
  let service: QB64PECompilerService;

  beforeEach(() => {
    service = new QB64PECompilerService();
  });

  describe('getCompilerOptions', () => {
    it('should return all compiler options', async () => {
      const options = await service.getCompilerOptions();
      expect(options).toBeDefined();
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
    });

    it('should filter by platform', async () => {
      const linuxOptions = await service.getCompilerOptions('linux');
      expect(linuxOptions.every(opt => opt.platform.includes('linux'))).toBe(true);
    });

    it('should filter by option type', async () => {
      const debugOptions = await service.getCompilerOptions('all', 'debugging');
      expect(debugOptions.every(opt => opt.category === 'debugging')).toBe(true);
    });

    it('should combine filters', async () => {
      const options = await service.getCompilerOptions('windows', 'compilation');
      expect(options.every(opt => 
        opt.platform.includes('windows') && opt.category === 'compilation'
      )).toBe(true);
    });
  });

  describe('getDebuggingHelp', () => {
    it('should provide debugging help for variable issues', async () => {
      const help = await service.getDebuggingHelp('variable value problem');
      expect(help).toContain('Debugging Help');
      expect(typeof help).toBe('string');
      expect(help.length).toBeGreaterThan(0);
    });

    it('should provide debugging help for errors', async () => {
      const help = await service.getDebuggingHelp('runtime error');
      expect(help).toContain('Debugging Help');
    });

    it('should provide general help for unknown issues', async () => {
      const help = await service.getDebuggingHelp('some random issue');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should provide help for loop issues', async () => {
      const help = await service.getDebuggingHelp('infinite loop detected');
      expect(help).toContain('Debugging Help');
      expect(help.length).toBeGreaterThan(0);
    });

    it('should provide help for graphics issues', async () => {
      const help = await service.getDebuggingHelp('screen graphics problem');
      expect(help).toContain('Debugging Help');
      expect(help.length).toBeGreaterThan(0);
    });

    it('should filter techniques by platform', async () => {
      const help = await service.getDebuggingHelp('error', 'linux');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });
  });

  describe('getCompilerReference', () => {
    it('should generate complete compiler reference', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Compiler Reference');
      expect(reference).toContain('Compilation Options');
      expect(reference).toContain('Debugging Options');
      expect(reference).toContain('Optimization Options');
    });

    it('should include platform-specific notes', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Platform-Specific Notes');
      expect(reference).toContain('Windows');
      expect(reference).toContain('macOS');
      expect(reference).toContain('Linux');
    });

    it('should include cross-platform tips', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Cross-Platform Compatibility Tips');
    });

    it('should include compilation best practices', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Compilation Best Practices');
    });
  });

  describe('debugging help variations', () => {
    it('should help with memory issues', async () => {
      const help = await service.getDebuggingHelp('memory leak');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should help with syntax issues', async () => {
      const help = await service.getDebuggingHelp('syntax error');
      expect(help).toBeDefined();
    });

    it('should help with performance issues', async () => {
      const help = await service.getDebuggingHelp('slow performance');
      expect(help).toBeDefined();
    });

    it('should help with file operations', async () => {
      const help = await service.getDebuggingHelp('file not found');
      expect(help).toBeDefined();
    });

    it('should help with arrays', async () => {
      const help = await service.getDebuggingHelp('array subscript out of range');
      expect(help).toBeDefined();
    });

    it('should help with strings', async () => {
      const help = await service.getDebuggingHelp('string concatenation problem');
      expect(help).toBeDefined();
    });
  });

  describe('platform-specific options', () => {
    it('should return Windows-specific options', async () => {
      const options = await service.getCompilerOptions('windows');
      expect(Array.isArray(options)).toBe(true);
    });

    it('should return macOS-specific options', async () => {
      const options = await service.getCompilerOptions('macos');
      expect(Array.isArray(options)).toBe(true);
    });

    it('should return Linux-specific options', async () => {
      const options = await service.getCompilerOptions('linux');
      expect(Array.isArray(options)).toBe(true);
    });

    it('should handle all platforms', async () => {
      const options = await service.getCompilerOptions('all');
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('option categories', () => {
    it('should return compilation category options', async () => {
      const options = await service.getCompilerOptions('all', 'compilation');
      expect(options.every(opt => opt.category === 'compilation')).toBe(true);
    });

    it('should return debugging category options', async () => {
      const options = await service.getCompilerOptions('all', 'debugging');
      expect(options.every(opt => opt.category === 'debugging')).toBe(true);
    });

    it('should return optimization category options', async () => {
      const options = await service.getCompilerOptions('all', 'optimization');
      expect(options.every(opt => opt.category === 'optimization')).toBe(true);
    });

    it('should handle unknown category', async () => {
      const options = await service.getCompilerOptions('all', 'unknown_category');
      expect(Array.isArray(options)).toBe(true);
    });
  });

  describe('debugging help for specific platforms', () => {
    it('should provide Windows-specific debugging help', async () => {
      const help = await service.getDebuggingHelp('crash', 'windows');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should provide macOS-specific debugging help', async () => {
      const help = await service.getDebuggingHelp('crash', 'macos');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should provide Linux-specific debugging help', async () => {
      const help = await service.getDebuggingHelp('crash', 'linux');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });
  });

  describe('complex debugging scenarios', () => {
    it('should help with multiple keywords', async () => {
      const help = await service.getDebuggingHelp('variable undefined runtime error');
      expect(help).toContain('Debugging Help');
    });

    it('should help with empty issue description', async () => {
      const help = await service.getDebuggingHelp('');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should help with long issue descriptions', async () => {
      const longIssue = 'variable value problem '.repeat(20);
      const help = await service.getDebuggingHelp(longIssue);
      expect(help).toBeDefined();
    });

    it('should help with special characters in issue', async () => {
      const help = await service.getDebuggingHelp('error: $variable undefined!');
      expect(help).toBeDefined();
    });
  });

  describe('compiler options structure', () => {
    it('should return options with correct structure', async () => {
      const options = await service.getCompilerOptions();
      if (options.length > 0) {
        const option = options[0];
        expect(option).toHaveProperty('flag');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('category');
        expect(option).toHaveProperty('platform');
      }
    });

    it('should have valid platform values', async () => {
      const options = await service.getCompilerOptions();
      options.forEach(opt => {
        expect(Array.isArray(opt.platform)).toBe(true);
        expect(opt.platform.length).toBeGreaterThan(0);
      });
    });

    it('should have valid category values', async () => {
      const options = await service.getCompilerOptions();
      const validCategories = ['compilation', 'debugging', 'optimization'];
      options.forEach(opt => {
        expect(validCategories).toContain(opt.category);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined platform gracefully', async () => {
      const options = await service.getCompilerOptions(undefined as any);
      expect(Array.isArray(options)).toBe(true);
    });

    it('should handle undefined option type gracefully', async () => {
      const options = await service.getCompilerOptions('all', undefined as any);
      expect(Array.isArray(options)).toBe(true);
    });

    it('should handle empty string issue in debugging help', async () => {
      const help = await service.getDebuggingHelp('');
      expect(help).toBeDefined();
      expect(typeof help).toBe('string');
    });

    it('should handle unicode in issue description', async () => {
      const help = await service.getDebuggingHelp('変数エラー 漢字');
      expect(help).toBeDefined();
    });
  });

  describe('reference documentation completeness', () => {
    it('should document all option categories', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Compilation Options');
      expect(reference).toContain('Debugging Options');
      expect(reference).toContain('Optimization Options');
    });

    it('should include examples', async () => {
      const reference = await service.getCompilerReference();
      expect(reference.length).toBeGreaterThan(500);
    });

    it('should be well-formatted markdown', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('##');
      expect(reference).toContain('-');
    });
  });

  describe('multiple operations', () => {
    it('should handle multiple getCompilerOptions calls', async () => {
      const opts1 = await service.getCompilerOptions();
      const opts2 = await service.getCompilerOptions('linux');
      const opts3 = await service.getCompilerOptions('all', 'debugging');
      
      expect(Array.isArray(opts1)).toBe(true);
      expect(Array.isArray(opts2)).toBe(true);
      expect(Array.isArray(opts3)).toBe(true);
    });

    it('should handle multiple getDebuggingHelp calls', async () => {
      const help1 = await service.getDebuggingHelp('error');
      const help2 = await service.getDebuggingHelp('crash', 'windows');
      const help3 = await service.getDebuggingHelp('memory leak', 'linux');
      
      expect(typeof help1).toBe('string');
      expect(typeof help2).toBe('string');
      expect(typeof help3).toBe('string');
    });

    it('should handle mixed operations', async () => {
      const options = await service.getCompilerOptions();
      const help = await service.getDebuggingHelp('error');
      const reference = await service.getCompilerReference();
      
      expect(Array.isArray(options)).toBe(true);
      expect(typeof help).toBe('string');
      expect(typeof reference).toBe('string');
    });
  });

  describe('compileAndVerify', () => {
    it('should handle missing QB64PE', async () => {
      const result = await service.compileAndVerify('/nonexistent/file.bas');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle nonexistent source file', async () => {
      const result = await service.compileAndVerify(
        '/nonexistent/file.bas',
        '/fake/qb64pe'
      );
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('not found'))).toBe(true);
    });

    it('should return proper result structure', async () => {
      const result = await service.compileAndVerify('/fake/file.bas');
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('output');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('suggestions');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it('should handle compiler flags', async () => {
      const result = await service.compileAndVerify(
        '/fake/file.bas',
        '/fake/qb64pe',
        ['-c', '-w', '-o', 'output']
      );
      
      expect(result).toBeDefined();
    });

    it('should provide suggestions for errors', async () => {
      const result = await service.compileAndVerify('/fake/file.bas');
      
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });
});
