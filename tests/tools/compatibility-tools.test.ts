import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCompatibilityTools } from '../../src/tools/compatibility-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PECompatibilityService } from '../../src/services/compatibility-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('Compatibility Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      compatibilityService: new QB64PECompatibilityService()
    } as ServiceContainer;
  });

  describe('registerCompatibilityTools', () => {
    it('should register compatibility tools without errors', () => {
      expect(() => registerCompatibilityTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register validate_qb64pe_compatibility tool', () => {
      registerCompatibilityTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('validate_qb64pe_compatibility');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute validate_qb64pe_compatibility handler', async () => {
      registerCompatibilityTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ query: 'function return types' });
        expect(result).toBeDefined();
      }
    });
  });
});
