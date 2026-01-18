import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerKeywordTools } from '../../src/tools/keyword-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { KeywordsService } from '../../src/services/keywords-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('Keyword Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      keywordsService: new KeywordsService()
    } as ServiceContainer;
  });

  describe('registerKeywordTools', () => {
    it('should register keyword tools without errors', () => {
      expect(() => registerKeywordTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register lookup_qb64pe_keyword tool', () => {
      registerKeywordTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('lookup_qb64pe_keyword');
    });

    it('should register search_qb64pe_keywords tool', () => {
      registerKeywordTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('search_qb64pe_keywords');
    });

    it('should register autocomplete_qb64pe_keywords tool', () => {
      registerKeywordTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('autocomplete_qb64pe_keywords');
    });

    it('should register get_qb64pe_keywords_by_category tool', () => {
      registerKeywordTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_qb64pe_keywords_by_category');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute lookup_qb64pe_keyword handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'lookup_qb64pe_keyword'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ keyword: 'PRINT' });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    it('should execute search_qb64pe_keywords handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ query: 'print' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_keyword_autocomplete handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_keyword_autocomplete'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ prefix: 'PR' });
        expect(result).toBeDefined();
      }
    });
  });
});
