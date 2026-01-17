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
  });

  describe('getCompilerReference', () => {
    it('should generate complete compiler reference', async () => {
      const reference = await service.getCompilerReference();
      expect(reference).toContain('Compiler Reference');
      expect(reference).toContain('Compilation Options');
      expect(reference).toContain('Debugging Options');
      expect(reference).toContain('Optimization Options');
    });
  });
});
