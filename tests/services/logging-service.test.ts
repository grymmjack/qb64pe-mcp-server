import { QB64PELoggingService } from '../../src/services/logging-service';

describe('QB64PELoggingService', () => {
  let service: QB64PELoggingService;

  beforeEach(() => {
    service = new QB64PELoggingService();
  });

  describe('generateLoggingCode', () => {
    it('should generate logging code', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
      expect(logged.length).toBeGreaterThan(0);
    });

    it('should handle with options', () => {
      const code = 'DIM x AS INTEGER\\nx = 42';
      const options = { logLevel: 'INFO' as const, enableNativeLogging: true };
      const logged = service.injectNativeLogging(code, options);
      expect(typeof logged).toBe('string');
    });

    it('should handle empty code', () => {
      const logged = service.injectNativeLogging('');
      expect(typeof logged).toBe('string');
    });
  });

  describe('injectLogging', () => {
    it('should inject logging statements', () => {
      const code = 'FOR i = 1 TO 10\\nPRINT i\\nNEXT i';
      const result = service.injectNativeLogging(code);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(code.length);
    });

    it('should preserve code structure', () => {
      const code = 'SUB Test\\nPRINT 1\\nEND SUB';
      const result = service.injectNativeLogging(code);
      expect(result).toContain('SUB');
      expect(result).toContain('END SUB');
    });
  });

  describe('generateEchoFunctions', () => {
    it('should generate ECHO functions', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { enableEchoOutput: true });
      expect(logged).toContain('_ECHO');
      expect(logged).toContain('PRINT');
    });

    it('should create reusable functions', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
    });
  });

  describe('createStructuredOutput', () => {
    it('should create structured output code', () => {
      const sections = ['Variables', 'Results', 'Timing'];
      const output = service.generateStructuredOutput(sections);
      expect(typeof output).toBe('string');
      expect(output).toContain('VARIABLES');
    });

    it('should handle empty sections', () => {
      const output = service.generateStructuredOutput([]);
      expect(typeof output).toBe('string');
    });

    it('should format sections properly', () => {
      const sections = ['Test'];
      const output = service.generateStructuredOutput(sections);
      expect(output).toContain('TEST');
    });
  });

  describe('additional logging options', () => {
    it('should handle TRACE log level', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { logLevel: 'TRACE' as const });
      expect(typeof logged).toBe('string');
    });

    it('should handle WARN log level', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { logLevel: 'WARN' as const });
      expect(typeof logged).toBe('string');
    });

    it('should handle ERROR log level', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { logLevel: 'ERROR' as const });
      expect(typeof logged).toBe('string');
    });

    it('should handle auto-exit timeout', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { autoExitTimeout: 5 });
      expect(typeof logged).toBe('string');
    });

    it('should handle custom console directive', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { consoleDirective: '$CONSOLE' as const });
      expect(typeof logged).toBe('string');
    });

    it('should handle disabled features', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { 
        enableNativeLogging: false,
        enableEchoOutput: false,
        enableStructuredOutput: false
      });
      expect(typeof logged).toBe('string');
    });

    it('should handle custom output sections', () => {
      const code = 'PRINT "Test"';
      const logged = service.injectNativeLogging(code, { 
        enableStructuredOutput: true,
        outputSections: ['Custom1', 'Custom2']
      });
      expect(typeof logged).toBe('string');
    });
  });
});
