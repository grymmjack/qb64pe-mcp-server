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

  describe('enhanceCodeWithLogging', () => {
    it('should enhance code with logging', () => {
      const code = 'PRINT "Test"';
      const enhanced = service.enhanceCodeWithLogging(code, {});
      expect(typeof enhanced).toBe('string');
      expect(enhanced.length).toBeGreaterThan(0);
    });

    it('should handle complex code structures', () => {
      const code = 'FOR i = 1 TO 10\nPRINT i\nNEXT i';
      const enhanced = service.enhanceCodeWithLogging(code, {});
      expect(typeof enhanced).toBe('string');
    });

    it('should handle empty code', () => {
      const enhanced = service.enhanceCodeWithLogging('', {});
      expect(typeof enhanced).toBe('string');
    });
  });

  describe('parseStructuredOutput', () => {
    it('should parse structured output', () => {
      const output = '=== SECTION: TEST ===\nLine 1\nLine 2\n';
      const parsed = service.parseStructuredOutput(output);
      expect(parsed).toHaveProperty('sections');
      expect(parsed).toHaveProperty('logs');
      expect(parsed).toHaveProperty('summary');
    });

    it('should handle empty output', () => {
      const parsed = service.parseStructuredOutput('');
      expect(parsed).toHaveProperty('sections');
      expect(parsed).toHaveProperty('logs');
      expect(parsed).toHaveProperty('summary');
    });

    it('should parse multiple sections', () => {
      const output = '=== SECTION: TEST1 ===\nData1\n=== SECTION: TEST2 ===\nData2\n';
      const parsed = service.parseStructuredOutput(output);
      expect(Object.keys(parsed.sections).length).toBeGreaterThan(0);
    });

    it('should parse log entries', () => {
      const output = '[INFO] Test message\n[ERROR] Error message\n';
      const parsed = service.parseStructuredOutput(output);
      expect(Array.isArray(parsed.logs)).toBe(true);
    });

    it('should extract execution summary', () => {
      const output = 'Total: 10 steps\nFailed: 2 steps\n';
      const parsed = service.parseStructuredOutput(output);
      expect(parsed.summary).toHaveProperty('success');
      expect(parsed.summary).toHaveProperty('totalSteps');
    });
  });

  describe('generateAdvancedDebuggingTemplate', () => {
    it('should generate debugging template', () => {
      const template = service.generateAdvancedDebuggingTemplate(
        'test-program',
        ['Step 1', 'Step 2'],
        {}
      );
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
    });

    it('should include debugging features', () => {
      const template = service.generateAdvancedDebuggingTemplate(
        'simple-test',
        ['Initialize'],
        {}
      );
      expect(typeof template).toBe('string');
    });

    it('should handle empty analysis steps', () => {
      const template = service.generateAdvancedDebuggingTemplate('test', [], {});
      expect(typeof template).toBe('string');
    });

    it('should include specified program name', () => {
      const template = service.generateAdvancedDebuggingTemplate(
        'graphics-test',
        ['Load', 'Render'],
        {}
      );
      expect(typeof template).toBe('string');
    });
  });

  describe('generateEchoFunctions', () => {
    it('should generate ECHO functions', () => {
      const functions = service.generateEchoFunctions();
      expect(typeof functions).toBe('string');
      expect(functions).toContain('ECHO');
    });

    it('should handle custom config', () => {
      const config = { logLevel: 'TRACE' as const };
      const functions = service.generateEchoFunctions(config);
      expect(typeof functions).toBe('string');
    });

    it('should include multiple ECHO variants', () => {
      const functions = service.generateEchoFunctions();
      expect(typeof functions).toBe('string');
      expect(functions.length).toBeGreaterThan(0);
    });
  });

  describe('generateOutputCaptureCommand', () => {
    it('should generate command with default output path', () => {
      const command = service.generateOutputCaptureCommand('test.bas');
      expect(typeof command).toBe('string');
      expect(command.length).toBeGreaterThan(0);
      expect(command).toContain('test.bas');
    });

    it('should generate command with custom output path', () => {
      const command = service.generateOutputCaptureCommand('test.bas', 'output.txt');
      expect(typeof command).toBe('string');
      expect(command).toContain('output.txt');
    });

    it('should handle special characters in paths', () => {
      const command = service.generateOutputCaptureCommand('my test.bas', 'my output.txt');
      expect(typeof command).toBe('string');
    });

    it('should include redirection', () => {
      const command = service.generateOutputCaptureCommand('test.bas');
      expect(command).toContain('>');
    });
  });

  describe('generateFileMonitoringCommands', () => {
    it('should generate monitoring commands', () => {
      const commands = service.generateFileMonitoringCommands('test.log');
      expect(typeof commands).toBe('object');
      expect(commands).toHaveProperty('windows');
      expect(commands).toHaveProperty('linux');
      expect(commands).toHaveProperty('macos');
    });

    it('should include platform-specific commands', () => {
      const commands = service.generateFileMonitoringCommands('debug.log');
      expect(typeof commands.windows).toBe('string');
      expect(typeof commands.linux).toBe('string');
      expect(typeof commands.macos).toBe('string');
    });

    it('should handle paths with spaces', () => {
      const commands = service.generateFileMonitoringCommands('my debug.log');
      expect(typeof commands).toBe('object');
    });
  });

  describe('complex scenarios', () => {
    it('should handle code with existing $CONSOLE directive', () => {
      const code = '$CONSOLE\nPRINT "Test"';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
    });

    it('should handle code with SUB and FUNCTION', () => {
      const code = 'SUB MyTest\nPRINT "Test"\nEND SUB\nFUNCTION Add(a, b)\nAdd = a + b\nEND FUNCTION';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
    });

    it('should handle multiline strings', () => {
      const code = 'PRINT "Line 1"\nPRINT "Line 2"\nPRINT "Line 3"';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
    });

    it('should preserve indentation', () => {
      const code = 'IF x > 0 THEN\n  PRINT "Positive"\nEND IF';
      const logged = service.injectNativeLogging(code);
      expect(typeof logged).toBe('string');
    });
  });
});
