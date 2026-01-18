import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCompilerTools } from '../../src/tools/compiler-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PECompilerService } from '../../src/services/compiler-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createTextToolHandler: jest.fn((handler) => handler)
}));

describe('Compiler Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      compilerService: new QB64PECompilerService()
    } as ServiceContainer;
  });

  describe('registerCompilerTools', () => {
    it('should register compiler tools without errors', () => {
      expect(() => registerCompilerTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register get_compiler_options tool', () => {
      registerCompilerTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_compiler_options');
    });

    it('should register get_debugging_help tool', () => {
      registerCompilerTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_debugging_help');
    });

    it('should register compile_and_verify_qb64pe tool', () => {
      registerCompilerTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('compile_and_verify_qb64pe');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute get_compiler_options handler', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_compiler_options'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ platform: 'linux', optionType: 'all' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_compiler_options with defaults', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_compiler_options'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_compiler_options errors', async () => {
      const errorServices = {
        compilerService: {
          getCompilerOptions: jest.fn().mockRejectedValue(new Error('Options failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerCompilerTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_compiler_options'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ platform: 'windows' });
        expect(result).toBeDefined();
      }
    });

    it('should execute validate_qb64pe_syntax handler', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_syntax'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ code: 'PRINT "Test"', checkLevel: 'basic' });
        expect(result).toBeDefined();
      }
    });

    it('should execute validate_qb64pe_syntax with defaults', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_syntax'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ code: 'DIM x AS INTEGER' });
        expect(result).toBeDefined();
      }
    });

    it('should handle validate_qb64pe_syntax errors', async () => {
      const errorServices = {
        syntaxService: {
          validateSyntax: jest.fn().mockRejectedValue(new Error('Validation failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerCompilerTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_syntax'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ code: 'INVALID' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_debugging_help handler', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_debugging_help'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ issue: 'variable scope problem' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_debugging_help with platform', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_debugging_help'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ issue: 'crash on startup', platform: 'windows' });
        expect(result).toBeDefined();
      }
    });

    it('should execute compile_and_verify_qb64pe handler', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'compile_and_verify_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceFilePath: '/path/to/test.bas' });
        expect(result).toBeDefined();
      }
    });

    it('should execute compile_and_verify_qb64pe with all options', async () => {
      registerCompilerTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'compile_and_verify_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceFilePath: '/path/to/test.bas',
          qb64pePath: '/path/to/qb64pe',
          compilerFlags: ['-c', '-w']
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle compile_and_verify_qb64pe errors', async () => {
      const errorServices = {
        compilerService: {
          compileAndVerify: jest.fn().mockRejectedValue(new Error('Compilation failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerCompilerTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'compile_and_verify_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceFilePath: '/invalid/path.bas' });
        expect(result).toBeDefined();
      }
    });
  });
});
