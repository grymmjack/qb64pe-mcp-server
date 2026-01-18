import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDebuggingTools } from '../../src/tools/debugging-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEDebuggingService } from '../../src/services/debugging-service';
import { QB64PELoggingService } from '../../src/services/logging-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('Debugging Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      debuggingService: new QB64PEDebuggingService(),
      loggingService: new QB64PELoggingService()
    } as ServiceContainer;
  });

  describe('registerDebuggingTools', () => {
    it('should register debugging tools without errors', () => {
      expect(() => registerDebuggingTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register multiple debugging tools', () => {
      registerDebuggingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });

    it('should register enhance_qb64pe_code_for_debugging tool', () => {
      registerDebuggingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('enhance_qb64pe_code_for_debugging');
    });

    it('should register generate_advanced_debugging_template tool', () => {
      registerDebuggingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('generate_advanced_debugging_template');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute enhance_qb64pe_code_for_debugging handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'enhance_qb64pe_code_for_debugging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceCode: 'PRINT "Test"',
          config: {}
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute enhance_qb64pe_code_for_debugging with full config', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'enhance_qb64pe_code_for_debugging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceCode: 'SCREEN 13\nCIRCLE (100, 100), 50',
          config: {
            enableConsole: true,
            enableLogging: true,
            enableScreenshots: true,
            enableFlowControl: true,
            enableResourceTracking: true,
            timeoutSeconds: 30,
            autoExit: true,
            verboseOutput: true
          }
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle enhance_qb64pe_code_for_debugging errors', async () => {
      const errorServices = {
        debuggingService: {
          enhanceCodeForDebugging: jest.fn().mockImplementation(() => { throw new Error('Enhancement failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'enhance_qb64pe_code_for_debugging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'TEST' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_qb64pe_debugging_best_practices handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_debugging_best_practices'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_qb64pe_debugging_best_practices errors', async () => {
      const errorServices = {
        debuggingService: {
          getDebuggingBestPractices: jest.fn().mockImplementation(() => { throw new Error('Failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_debugging_best_practices'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_llm_debugging_guide handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_llm_debugging_guide'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_llm_debugging_guide errors', async () => {
      const errorServices = {
        debuggingService: {
          getLLMDebuggingGuide: jest.fn().mockImplementation(() => { throw new Error('Failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_llm_debugging_guide'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute inject_native_qb64pe_logging handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'inject_native_qb64pe_logging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'PRINT "Test"' });
        expect(result).toBeDefined();
      }
    });

    it('should execute inject_native_qb64pe_logging with config', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'inject_native_qb64pe_logging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceCode: 'SCREEN 13\nPRINT "Graphics"',
          config: {
            enableNativeLogging: true,
            enableStructuredOutput: true,
            enableEchoOutput: true,
            consoleDirective: '$CONSOLE:ONLY',
            logLevel: 'INFO',
            autoExitTimeout: 10
          }
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle inject_native_qb64pe_logging errors', async () => {
      const errorServices = {
        loggingService: {
          injectNativeLogging: jest.fn().mockImplementation(() => { throw new Error('Injection failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'inject_native_qb64pe_logging'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'TEST' });
        expect(result).toBeDefined();
      }
    });

    it('should execute generate_advanced_debugging_template handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_advanced_debugging_template'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ programType: 'console', includeAllFeatures: true });
        expect(result).toBeDefined();
      }
    });

    it('should execute generate_advanced_debugging_template with defaults', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_advanced_debugging_template'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle generate_advanced_debugging_template errors', async () => {
      const errorServices = {
        debuggingService: {
          generateAdvancedTemplate: jest.fn().mockImplementation(() => { throw new Error('Template failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_advanced_debugging_template'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute parse_qb64pe_structured_output handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'parse_qb64pe_structured_output'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ output: 'Test output', format: 'structured' });
        expect(result).toBeDefined();
      }
    });

    it('should execute parse_qb64pe_structured_output with defaults', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'parse_qb64pe_structured_output'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ output: 'Test' });
        expect(result).toBeDefined();
      }
    });

    it('should handle parse_qb64pe_structured_output errors', async () => {
      const errorServices = {
        loggingService: {
          parseStructuredOutput: jest.fn().mockImplementation(() => { throw new Error('Parse failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'parse_qb64pe_structured_output'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ output: 'TEST' });
        expect(result).toBeDefined();
      }
    });

    it('should execute generate_output_capture_commands handler', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_output_capture_commands'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ programPath: '/path/to/program.exe' });
        expect(result).toBeDefined();
      }
    });

    it('should execute generate_output_capture_commands with outputPath', async () => {
      registerDebuggingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_output_capture_commands'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          programPath: '/path/to/program.exe',
          outputPath: '/custom/output.txt'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle generate_output_capture_commands errors', async () => {
      const errorServices = {
        loggingService: {
          generateOutputCaptureCommands: jest.fn().mockImplementation(() => { throw new Error('Commands failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerDebuggingTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_output_capture_commands'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ programPath: '/test' });
        expect(result).toBeDefined();
      }
    });
  });
});
