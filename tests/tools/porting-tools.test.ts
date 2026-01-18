import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerPortingTools } from '../../src/tools/porting-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEPortingService } from '../../src/services/porting-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

describe('Porting Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      portingService: new QB64PEPortingService()
    } as ServiceContainer;
  });

  describe('registerPortingTools', () => {
    it('should register porting tools without errors', () => {
      expect(() => registerPortingTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register port_qbasic_to_qb64pe tool', () => {
      registerPortingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('port_qbasic_to_qb64pe');
    });

    it('should register get_porting_dialect_info tool', () => {
      registerPortingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_porting_dialect_info');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute port_qbasic_to_qb64pe handler', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceCode: 'PRINT "Hello"',
          sourceDialect: 'qbasic',
          addModernFeatures: true
        });
        expect(result).toBeDefined();
      }
    });
  });
});
