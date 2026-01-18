import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerWikiTools } from '../../src/tools/wiki-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEWikiService } from '../../src/services/wiki-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createTextToolHandler: jest.fn((handler) => handler)
}));

describe('Wiki Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      wikiService: new QB64PEWikiService()
    } as ServiceContainer;
  });

  describe('registerWikiTools', () => {
    it('should register wiki tools without errors', () => {
      expect(() => registerWikiTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register get_qb64pe_page tool', () => {
      registerWikiTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_qb64pe_page');
    });

    it('should register get_qb64pe_wiki_categories tool', () => {
      registerWikiTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_qb64pe_wiki_categories');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute get_qb64pe_page handler', async () => {
      registerWikiTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_page'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ page: 'PRINT' });
        expect(result).toBeDefined();
      }
    });
  });
});
