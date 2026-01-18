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

    it('should execute autocomplete_qb64pe_keywords handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'autocomplete_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ prefix: 'PR', limit: 5 });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_qb64pe_keywords_by_category handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_keywords_by_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ category: 'function' });
        expect(result).toBeDefined();
      }
    });

    it('should handle category "all" in get_qb64pe_keywords_by_category', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_keywords_by_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ category: 'all' });
        expect(result).toBeDefined();
      }
    });

    it('should execute search_qb64pe_keywords_by_wiki_category handler', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords_by_wiki_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ wikiCategory: 'Graphics' });
        expect(result).toBeDefined();
      }
    });

    it('should handle search with optional searchTerm in wiki category search', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords_by_wiki_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ wikiCategory: 'Graphics', searchTerm: 'SCREEN' });
        expect(result).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in lookup_qb64pe_keyword', async () => {
      const brokenService = {
        keywordsService: {
          validateKeyword: jest.fn(() => { throw new Error('Validation failed'); })
        }
      } as any;

      registerKeywordTools(mockServer, brokenService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'lookup_qb64pe_keyword'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ keyword: 'INVALID' });
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      }
    });

    it('should handle errors in autocomplete_qb64pe_keywords', async () => {
      const brokenService = {
        keywordsService: {
          getAutocomplete: jest.fn(() => { throw new Error('Autocomplete failed'); })
        }
      } as any;

      registerKeywordTools(mockServer, brokenService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'autocomplete_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ prefix: 'PR' });
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      }
    });

    it('should handle errors in get_qb64pe_keywords_by_category', async () => {
      const brokenService = {
        keywordsService: {
          getKeywordsByCategory: jest.fn(() => { throw new Error('Category failed'); }),
          getAllKeywords: jest.fn(() => { throw new Error('Get all failed'); })
        }
      } as any;

      registerKeywordTools(mockServer, brokenService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_qb64pe_keywords_by_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ category: 'function' });
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      }
    });

    it('should handle errors in search_qb64pe_keywords', async () => {
      const brokenService = {
        keywordsService: {
          searchKeywords: jest.fn(() => { throw new Error('Search failed'); })
        }
      } as any;

      registerKeywordTools(mockServer, brokenService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ query: 'test' });
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      }
    });

    it('should handle errors in search_qb64pe_keywords_by_wiki_category', async () => {
      const brokenService = {
        keywordsService: {
          searchByWikiCategory: jest.fn(() => { throw new Error('Wiki search failed'); })
        }
      } as any;

      registerKeywordTools(mockServer, brokenService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords_by_wiki_category'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ wikiCategory: 'Graphics' });
        expect(result).toBeDefined();
        expect(result.isError).toBe(true);
      }
    });
  });

  describe('Keyword Validation and Response Format', () => {
    it('should format valid keyword response with full details', async () => {
      const mockValidation = {
        isValid: true,
        keyword: {
          name: 'PRINT',
          category: 'statement',
          description: 'Outputs text to the screen',
          syntax: 'PRINT [expression]'
        },
        relatedKeywords: ['LPRINT', 'WRITE']
      };

      const mockService = {
        keywordsService: {
          validateKeyword: jest.fn(() => mockValidation)
        }
      } as any;

      registerKeywordTools(mockServer, mockService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'lookup_qb64pe_keyword'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ keyword: 'PRINT' });
        expect(result).toBeDefined();
      }
    });

    it('should handle keyword not found with suggestions', async () => {
      const mockValidation = {
        isValid: false,
        message: 'Keyword not found',
        suggestions: ['PRINT', 'PRINTF']
      };

      const mockService = {
        keywordsService: {
          validateKeyword: jest.fn(() => mockValidation)
        }
      } as any;

      registerKeywordTools(mockServer, mockService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'lookup_qb64pe_keyword'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ keyword: 'PRNT' });
        expect(result).toBeDefined();
      }
    });

    it('should handle keyword not found without suggestions', async () => {
      const mockValidation = {
        isValid: false,
        message: 'Keyword not found'
      };

      const mockService = {
        keywordsService: {
          validateKeyword: jest.fn(() => mockValidation)
        }
      } as any;

      registerKeywordTools(mockServer, mockService);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'lookup_qb64pe_keyword'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ keyword: 'INVALID' });
        expect(result).toBeDefined();
      }
    });

    it('should handle default maxResults in search', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ query: 'screen' });
        expect(result).toBeDefined();
      }
    });

    it('should handle custom maxResults in search', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'search_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ query: 'screen', maxResults: 5 });
        expect(result).toBeDefined();
      }
    });

    it('should handle default limit in autocomplete', async () => {
      registerKeywordTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'autocomplete_qb64pe_keywords'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ prefix: 'SC' });
        expect(result).toBeDefined();
      }
    });
  });
});
