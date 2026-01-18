import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGraphicsTools } from '../../src/tools/graphics-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { ScreenshotService } from '../../src/services/screenshot-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createTextToolHandler: jest.fn((handler) => handler)
}));

describe('Graphics Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      screenshotService: new ScreenshotService()
    } as ServiceContainer;
  });

  describe('registerGraphicsTools', () => {
    it('should register graphics tools without errors', () => {
      expect(() => registerGraphicsTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register multiple graphics-related tools', () => {
      registerGraphicsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  describe('Tool Registration Count', () => {
    it('should register at least one tool', () => {
      registerGraphicsTools(mockServer, services);
      expect(mockServer.registerTool).toHaveBeenCalled();
      const callCount = (mockServer.registerTool as jest.Mock).mock.calls.length;
      expect(callCount).toBeGreaterThan(0);
    });
  });
});
