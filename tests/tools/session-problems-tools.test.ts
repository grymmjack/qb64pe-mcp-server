import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSessionProblemsTools } from '../../src/tools/session-problems-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { SessionProblemsService } from '../../src/services/session-problems-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('Session Problems Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      sessionProblemsService: new SessionProblemsService()
    } as ServiceContainer;
  });

  describe('registerSessionProblemsTools', () => {
    it('should register session problems tools without errors', () => {
      expect(() => registerSessionProblemsTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register log_session_problem tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('log_session_problem');
    });

    it('should register get_session_problems_report tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_session_problems_report');
    });

    it('should register clear_session_problems tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('clear_session_problems');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute log_session_problem handler', async () => {
      registerSessionProblemsTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'log_session_problem'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          description: 'Test problem',
          category: 'compilation',
          severity: 'medium'
        });
        expect(result).toBeDefined();
      }
    });
  });
});
