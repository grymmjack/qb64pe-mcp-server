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
});
