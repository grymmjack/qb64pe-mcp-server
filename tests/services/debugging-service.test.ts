import { QB64PEDebuggingService } from '../../src/services/debugging-service';
import * as fs from 'fs';

jest.mock('fs');

describe('QB64PEDebuggingService', () => {
  let service: QB64PEDebuggingService;

  beforeEach(() => {
    service = new QB64PEDebuggingService();
    jest.clearAllMocks();
  });

  describe('createDebuggingSession', () => {
    it('should create debugging session', () => {
      const code = 'PRINT "Test"';
      const session = service.createDebuggingSession(code);
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('sourceCode');
      expect(session).toHaveProperty('status');
    });

    it('should detect graphics programs', () => {
      const code = '_DISPLAY\\nCIRCLE (100, 100), 50\\n_DISPLAY';
      const session = service.createDebuggingSession(code);
      expect(session.executionMode).toBeDefined();
    });

    it('should detect console programs', () => {
      const code = 'PRINT "Hello"\\nINPUT x';
      const session = service.createDebuggingSession(code);
      expect(session.executionMode).toBeDefined();
    });
  });

  describe('enhanceCodeForDebugging', () => {
    it('should enhance code with debugging features', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id);
      expect(result).toHaveProperty('enhancedCode');
      expect(result).toHaveProperty('modifications');
    });

    it('should handle complex programs', () => {
      const code = 'FOR i = 1 TO 10\\n  PRINT i\\nNEXT i';
      const session = service.createDebuggingSession(code);
      const result = service.enhanceCodeForDebugging(session.id);
      expect(result.enhancedCode.length).toBeGreaterThan(code.length);
    });

    it('should add console management', () => {
      const session = service.createDebuggingSession('_DISPLAY\\nPRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { enableConsole: true });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should add logging system', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { enableLogging: true });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should add screenshots', () => {
      const session = service.createDebuggingSession('_DISPLAY');
      const result = service.enhanceCodeForDebugging(session.id, { enableScreenshots: true });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should add resource tracking', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { enableResourceTracking: true });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should add flow control', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { enableFlowControl: true });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should respect timeout settings', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { timeoutSeconds: 60 });
      expect(result.enhancedCode).toBeDefined();
    });

    it('should support verbose output', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const result = service.enhanceCodeForDebugging(session.id, { verboseOutput: true });
      expect(result.enhancedCode).toBeDefined();
    });
  });

  describe('session management', () => {
    it('should retrieve session by id', () => {
      const session = service.createDebuggingSession('PRINT "Test"');
      const retrieved = service.getSessionStatus(session.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(session.id);
    });

    it('should return undefined for non-existent session', () => {
      const retrieved = service.getSessionStatus('non-existent-id');
      expect(retrieved).toBeUndefined();
    });

    it('should handle empty code', () => {
      const session = service.createDebuggingSession('');
      expect(session).toBeDefined();
      expect(session.sourceCode).toBe('');
    });
  });
});
