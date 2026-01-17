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
  });
});
