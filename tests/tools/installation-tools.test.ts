import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerInstallationTools } from '../../src/tools/installation-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEInstallationService } from '../../src/services/installation-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

describe('Installation Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      installationService: new QB64PEInstallationService()
    } as ServiceContainer;
  });

  describe('registerInstallationTools', () => {
    it('should register installation tools without errors', () => {
      expect(() => registerInstallationTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register detect_qb64pe_installation tool', () => {
      registerInstallationTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('detect_qb64pe_installation');
    });

    it('should register generate_qb64pe_installation_report tool', () => {
      registerInstallationTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('generate_qb64pe_installation_report');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute detect_qb64pe_installation handler', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'detect_qb64pe_installation'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });
  });
});
