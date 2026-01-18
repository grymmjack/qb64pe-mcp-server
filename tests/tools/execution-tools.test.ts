import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerExecutionTools } from '../../src/tools/execution-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEExecutionService } from '../../src/services/execution-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

describe('Execution Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      executionService: new QB64PEExecutionService()
    } as ServiceContainer;
  });

  describe('registerExecutionTools', () => {
    it('should register execution tools without errors', () => {
      expect(() => registerExecutionTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register analyze_qb64pe_execution_mode tool', () => {
      registerExecutionTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('analyze_qb64pe_execution_mode');
    });

  });

  describe('Tool Handler Execution', () => {
    it('should execute generate_execution_command handler', async () => {
      registerExecutionTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_execution_command'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceFile: 'test.bas',
          mode: 'console'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_running_processes handler', async () => {
      registerExecutionTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_running_processes'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });
  });
});
