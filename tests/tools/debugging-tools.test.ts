import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDebuggingTools } from '../../src/tools/debugging-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEDebuggingService } from '../../src/services/debugging-service';

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
      debuggingService: new QB64PEDebuggingService()
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
  });
});
