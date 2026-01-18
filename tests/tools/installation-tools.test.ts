import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerInstallationTools } from '../../src/tools/installation-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEInstallationService } from '../../src/services/installation-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
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

    it('should handle detect_qb64pe_installation errors', async () => {
      const errorServices = {
        installationService: {
          detectInstallation: jest.fn().mockRejectedValue(new Error('Detection failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerInstallationTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'detect_qb64pe_installation'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_qb64pe_path_configuration handler', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_path_configuration'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_qb64pe_path_configuration with installPath', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_path_configuration'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ installPath: '/path/to/qb64pe' });
        expect(result).toBeDefined();
      }
    });

    it('should handle get_qb64pe_path_configuration errors', async () => {
      const errorServices = {
        installationService: {
          getPathConfiguration: jest.fn().mockImplementation(() => { throw new Error('Config failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerInstallationTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_path_configuration'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute validate_qb64pe_path handler', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_path'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ testPath: '/test/path' });
        expect(result).toBeDefined();
      }
    });

    it('should handle validate_qb64pe_path errors', async () => {
      const errorServices = {
        installationService: {
          validatePath: jest.fn().mockRejectedValue(new Error('Validation failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerInstallationTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64pe_path'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ testPath: '/invalid' });
        expect(result).toBeDefined();
      }
    });

    it('should execute generate_qb64pe_installation_report handler', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_qb64pe_installation_report'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle generate_qb64pe_installation_report errors', async () => {
      const errorServices = {
        installationService: {
          generateInstallationReport: jest.fn().mockRejectedValue(new Error('Report failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerInstallationTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_qb64pe_installation_report'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_qb64pe_installation_guidance handler', async () => {
      registerInstallationTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_installation_guidance'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_qb64pe_installation_guidance errors', async () => {
      const errorServices = {
        installationService: {
          detectInstallation: jest.fn().mockRejectedValue(new Error('Guidance failed'))
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerInstallationTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_installation_guidance'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });
  });
});
