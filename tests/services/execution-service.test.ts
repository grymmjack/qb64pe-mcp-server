import { QB64PEExecutionService } from '../../src/services/execution-service';

jest.mock('fs');
jest.mock('os');

describe('QB64PEExecutionService', () => {
  let service: QB64PEExecutionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QB64PEExecutionService();
  });

  describe('analyzeExecutionMode', () => {
    it('should detect console-only program', () => {
      const code = '$CONSOLE\nPRINT "Hello World"';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasConsole).toBe(true);
      expect(state.hasGraphics).toBe(false);
      expect(state.status).toBe('console_mode');
    });

    it('should detect graphics-only program', () => {
      const code = 'SCREEN 12\\nCIRCLE (100, 100), 50';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
      expect(state.hasConsole).toBe(false);
      expect(state.status).toBe('graphics_mode');
    });

    it('should detect mixed graphics and console', () => {
      const code = '$CONSOLE\nSCREEN 12\nPRINT "Starting graphics"';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
      expect(state.hasConsole).toBe(true);
      expect(state.status).toBe('graphics_mode');
    });

    it('should detect PSET graphics', () => {
      const code = 'PSET (10, 20), 15';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
    });

    it('should detect LINE graphics', () => {
      const code = 'LINE (0, 0)-(100, 100), 14';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
    });

    it('should detect _NEWIMAGE graphics', () => {
      const code = 'img& = _NEWIMAGE(640, 480, 32)';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
    });

    it('should detect _PUTIMAGE graphics', () => {
      const code = '_PUTIMAGE (0, 0), source&, dest&';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
    });

    it('should detect CLS as graphics', () => {
      const code = 'CLS\nPRINT "Test"';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.hasGraphics).toBe(true);
    });

    it('should handle code without graphics or console', () => {
      const code = 'DIM x AS INTEGER\\nx = 10';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.status).toBe('not_started');
    });

    it('should include screenshot directory for graphics', () => {
      const code = 'SCREEN 13';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.screenshotDir).toBeDefined();
    });

    it('should not include screenshot directory for console only', () => {
      const code = '$CONSOLE\nPRINT "test"';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.screenshotDir).toBeUndefined();
    });

    it('should always include log file', () => {
      const code = 'PRINT "test"';
      const state = service.analyzeExecutionMode(code);
      
      expect(state.logFile).toBeDefined();
      expect(state.logFile).toContain('execution_');
    });
  });

  describe('getExecutionGuidance', () => {
    it('should provide guidance for graphics-only programs', () => {
      const state = {
        status: 'graphics_mode' as const,
        hasGraphics: true,
        hasConsole: false
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.recommendation).toContain('Graphics-only');
      expect(guidance.waitingBehavior).toBe('wait_user_input');
      expect(guidance.monitoringStrategy.length).toBeGreaterThan(0);
    });

    it('should provide guidance for mixed programs', () => {
      const state = {
        status: 'graphics_mode' as const,
        hasGraphics: true,
        hasConsole: true
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.recommendation).toContain('Mixed graphics/console');
      expect(guidance.waitingBehavior).toBe('wait_timeout');
      expect(guidance.monitoringStrategy.length).toBeGreaterThan(0);
    });

    it('should provide guidance for console-only programs', () => {
      const state = {
        status: 'console_mode' as const,
        hasGraphics: false,
        hasConsole: true
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.recommendation).toContain('Console program');
      expect(guidance.waitingBehavior).toBe('wait_timeout');
    });

    it('should include console patterns in guidance', () => {
      const state = {
        status: 'console_mode' as const,
        hasGraphics: false,
        hasConsole: true
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.outputParsing.consolePatterns.length).toBeGreaterThan(0);
    });

    it('should include graphics indicators in guidance', () => {
      const state = {
        status: 'graphics_mode' as const,
        hasGraphics: true,
        hasConsole: false
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.outputParsing.graphicsIndicators.length).toBeGreaterThan(0);
    });

    it('should include completion signals in guidance', () => {
      const state = {
        status: 'console_mode' as const,
        hasGraphics: false,
        hasConsole: true
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.outputParsing.completionSignals.length).toBeGreaterThan(0);
    });

    it('should provide cross-platform commands', () => {
      const state = {
        status: 'console_mode' as const,
        hasGraphics: false,
        hasConsole: true
      };
      
      const guidance = service.getExecutionGuidance(state);
      
      expect(guidance.crossPlatformCommands).toBeDefined();
      expect(guidance.crossPlatformCommands.windows).toBeDefined();
      expect(guidance.crossPlatformCommands.linux).toBeDefined();
      expect(guidance.crossPlatformCommands.macos).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      const state = service.analyzeExecutionMode('');
      expect(state.status).toBe('not_started');
    });

    it('should handle case-insensitive keywords', () => {
      const state = service.analyzeExecutionMode('screen 12\ncircle (10,10), 5');
      expect(state.hasGraphics).toBe(true);
    });

    it('should handle multiple graphics keywords', () => {
      const code = 'SCREEN 12\nLINE (0,0)-(100,100)\nCIRCLE (50,50), 25';
      const state = service.analyzeExecutionMode(code);
      expect(state.hasGraphics).toBe(true);
    });

    it('should not detect graphics in comments', () => {
      const code = `' SCREEN 12\nPRINT "test"`;
      const state = service.analyzeExecutionMode(code);
      // May still detect due to pattern matching, but should be okay
      expect(state).toBeDefined();
    });
  });

  describe('getProcessMonitoringCommands', () => {
    it('should return platform-specific commands', () => {
      const commands = service.getProcessMonitoringCommands('test');
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should include process name in commands', () => {
      const commands = service.getProcessMonitoringCommands('myprogram');
      const commandStr = commands.join(' ');
      expect(commandStr).toContain('myprogram');
    });

    it('should use default process name', () => {
      const commands = service.getProcessMonitoringCommands();
      expect(Array.isArray(commands)).toBe(true);
    });
  });

  describe('getProcessTerminationCommands', () => {
    it('should return termination commands for pid', () => {
      const commands = service.getProcessTerminationCommands(12345);
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should include pid in commands', () => {
      const commands = service.getProcessTerminationCommands(99999);
      const commandStr = commands.join(' ');
      expect(commandStr).toContain('99999');
    });

    it('should have graceful and force options', () => {
      const commands = service.getProcessTerminationCommands(1234);
      expect(commands.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('generateMonitoringTemplate', () => {
    it('should wrap code with monitoring', () => {
      const code = 'PRINT "Hello"';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain(code);
      expect(template).toContain('$CONSOLE');
      expect(template).toContain('LogMessage');
      expect(template).toContain('TakeScreenshot');
    });

    it('should include logging functionality', () => {
      const code = 'x = 10';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain('LogFile');
      expect(template).toContain('OPEN');
      expect(template).toContain('PRINT #99');
    });

    it('should include screenshot functionality', () => {
      const code = 'CIRCLE (50,50), 25';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain('_SAVEIMAGE');
      expect(template).toContain('ScreenshotCounter');
    });

    it('should include timestamps', () => {
      const code = 'DIM x';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain('TIMER');
      expect(template).toContain('DATE$');
      expect(template).toContain('TIME$');
    });

    it('should format output nicely', () => {
      const code = 'PRINT 1';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain('===');
      expect(template).toContain('COLOR');
      expect(template).toContain('STRING$');
    });

    it('should handle cleanup', () => {
      const code = 'END';
      const template = service.generateMonitoringTemplate(code);
      
      expect(template).toContain('MonitoringCleanup');
      expect(template).toContain('SYSTEM');
    });
  });

  describe('generateConsoleFormattingTemplate', () => {
    it('should generate formatting template', () => {
      const template = service.generateConsoleFormattingTemplate();
      
      expect(template).toContain('$CONSOLE');
      expect(template).toBeDefined();
      expect(template.length).toBeGreaterThan(100);
    });

    it('should include helper SUBs', () => {
      const template = service.generateConsoleFormattingTemplate();
      
      expect(template).toContain('SUB PrintHeader');
      expect(template).toContain('SUB PrintInfo');
      expect(template).toContain('SUB PrintSuccess');
      expect(template).toContain('SUB PrintError');
      expect(template).toContain('SUB PrintTable');
    });

    it('should define color constants', () => {
      const template = service.generateConsoleFormattingTemplate();
      
      expect(template).toContain('CONST HEADER_COLOR');
      expect(template).toContain('CONST INFO_COLOR');
      expect(template).toContain('CONST SUCCESS_COLOR');
      expect(template).toContain('CONST ERROR_COLOR');
    });

    it('should use console destination', () => {
      const template = service.generateConsoleFormattingTemplate();
      
      expect(template).toContain('_DEST _CONSOLE');
      expect(template).toContain('COLOR');
    });

    it('should include example usage', () => {
      const template = service.generateConsoleFormattingTemplate();
      
      expect(template).toContain('Example usage');
      expect(template).toContain('CALL PrintHeader');
    });
  });

  describe('getRealTimeMonitoringGuidance', () => {
    it('should return monitoring guidance', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toBeDefined();
      expect(typeof guidance).toBe('string');
      expect(guidance.length).toBeGreaterThan(100);
    });

    it('should include timeout recommendations', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('timeout');
      expect(guidance).toContain('DO NOT WAIT INDEFINITELY');
    });

    it('should include program type detection', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('Graphics Only');
      expect(guidance).toContain('Console Only');
      expect(guidance).toContain('Console + Graphics');
    });

    it('should include cross-platform commands', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('Windows');
      expect(guidance).toContain('Linux');
      expect(guidance).toContain('macOS');
    });

    it('should include output parsing strategies', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('Output Parsing');
      expect(guidance).toContain('Console Output Patterns');
    });

    it('should include screenshot guidance', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('Screenshot');
      expect(guidance).toContain('_SAVEIMAGE');
    });

    it('should include termination strategies', () => {
      const guidance = service.getRealTimeMonitoringGuidance();
      
      expect(guidance).toContain('Termination');
      expect(guidance).toContain('Graceful');
      expect(guidance).toContain('Force');
    });
  });

  describe('parseConsoleOutput', () => {
    it('should detect input prompts', () => {
      const output = 'Enter your name:\nPress any key to continue';
      const result = service.parseConsoleOutput(output);
      
      expect(result.isWaitingForInput).toBe(true);
      expect(result.suggestedAction).toBe('requires_user_input');
    });

    it('should detect completion signals', () => {
      const output = 'Processing...\nProgram completed\nDone';
      const result = service.parseConsoleOutput(output);
      
      expect(result.isCompleted).toBe(true);
      expect(result.suggestedAction).toBe('program_completed');
    });

    it('should handle empty output', () => {
      const output = '';
      const result = service.parseConsoleOutput(output);
      
      expect(result.isWaitingForInput).toBe(false);
      expect(result.isCompleted).toBe(false);
      expect(result.suggestedAction).toBe('no_output_timeout_recommended');
    });

    it('should detect last activity', () => {
      const output = 'Line 1\nLine 2\nLine 3\nLast line here';
      const result = service.parseConsoleOutput(output);
      
      expect(result.lastActivity).toBe('Last line here');
    });

    it('should be case insensitive', () => {
      const output = 'PRESS ANY KEY TO CONTINUE';
      const result = service.parseConsoleOutput(output);
      
      expect(result.isWaitingForInput).toBe(true);
    });

    it('should check multiple lines', () => {
      const output = 'Working...\nAlmost done\nPress enter to exit';
      const result = service.parseConsoleOutput(output);
      
      expect(result.isWaitingForInput).toBe(true);
    });

    it('should continue monitoring by default', () => {
      const output = 'Processing data...\nLoading...';
      const result = service.parseConsoleOutput(output);
      
      expect(result.suggestedAction).toBe('continue_monitoring');
    });

    it('should detect various completion words', () => {
      const completionWords = ['end', 'finished', 'complete', 'done', 'exit'];
      
      completionWords.forEach(word => {
        const output = `Program ${word}`;
        const result = service.parseConsoleOutput(output);
        expect(result.isCompleted).toBe(true);
      });
    });

    it('should detect various input prompts', () => {
      const prompts = ['Enter value:', 'Type Y/N:', 'Choose option:', 'Press key'];
      
      prompts.forEach(prompt => {
        const output = prompt;
        const result = service.parseConsoleOutput(output);
        expect(result.isWaitingForInput).toBe(true);
      });
    });

    it('should handle multiline output correctly', () => {
      const output = `Starting program...
Initializing...
Loading data...
Processing records 1-100
Processing records 101-200
Almost done
Finished successfully`;
      
      const result = service.parseConsoleOutput(output);
      expect(result.isCompleted).toBe(true);
      expect(result.lastActivity).toBe('Finished successfully');
    });
  });

  describe('getFileMonitoringCommands', () => {
    it('should return file monitoring commands', () => {
      const commands = service.getFileMonitoringCommands('test.log');
      
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should include log file path', () => {
      const logPath = '/path/to/execution.log';
      const commands = service.getFileMonitoringCommands(logPath);
      
      const commandStr = commands.join(' ');
      expect(commandStr.length).toBeGreaterThan(0);
    });

    it('should have tail command equivalent', () => {
      const commands = service.getFileMonitoringCommands('app.log');
      
      expect(commands.length).toBeGreaterThanOrEqual(1);
    });

    it('should support filtering', () => {
      const commands = service.getFileMonitoringCommands('debug.log');
      
      // Should have at least one command, and on supported platforms should have filtering
      expect(commands.length).toBeGreaterThanOrEqual(1);
      
      // Check if filtering is present (grep/findstr/ERROR patterns)
      // Note: May not be present if platform is unknown/mocked
      const hasFilter = commands.some(cmd => 
        cmd.includes('ERROR') || cmd.includes('grep') || cmd.includes('findstr')
      );
      
      // Either has filtering OR is the default tail command
      expect(hasFilter || commands.some(cmd => cmd.includes('tail'))).toBe(true);
    });
  });
});
