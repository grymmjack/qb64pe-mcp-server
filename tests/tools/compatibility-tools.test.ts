import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCompatibilityTools } from '../../src/tools/compatibility-tools';
import { ServiceContainer } from '../../src/utils/tool-types';

// Mock the mcp-helpers module
jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

// Import the mocked functions
import { createMCPResponse, createMCPError, createMCPTextResponse } from '../../src/utils/mcp-helpers';

describe('Compatibility Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;
  let registeredTools: Map<string, Function>;
  let mockCompatibilityService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    registeredTools = new Map();

    mockServer = {
      registerTool: jest.fn((name: string, schema: any, handler: Function) => {
        registeredTools.set(name, handler);
      })
    } as any;

    // Create mock compatibility service
    mockCompatibilityService = {
      validateCompatibility: jest.fn(),
      getPlatformCompatibility: jest.fn(),
      searchCompatibility: jest.fn(),
      getBestPractices: jest.fn(),
      getDebuggingGuidance: jest.fn()
    };

    services = {
      compatibilityService: mockCompatibilityService
    } as any;
  });

  describe('registerCompatibilityTools', () => {
    it('should register compatibility tools without errors', () => {
      expect(() => registerCompatibilityTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register exactly 3 compatibility tools', () => {
      registerCompatibilityTools(mockServer, services);
      expect(mockServer.registerTool).toHaveBeenCalledTimes(3);
    });

    it('should register all expected tool names', () => {
      registerCompatibilityTools(mockServer, services);
      const toolNames = (mockServer.registerTool as jest.Mock).mock.calls.map(call => call[0]);
      
      expect(toolNames).toContain('validate_qb64pe_compatibility');
      expect(toolNames).toContain('search_qb64pe_compatibility');
      expect(toolNames).toContain('get_qb64pe_best_practices');
    });
  });

  describe('validate_qb64pe_compatibility', () => {
    it('should validate compatibility successfully', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('validate_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const mockIssues = [
        { severity: 'error', message: 'Type mismatch' },
        { severity: 'warning', message: 'Deprecated function' }
      ];
      const mockPlatformInfo = { platform: 'all', compatible: true };
      
      mockCompatibilityService.validateCompatibility.mockResolvedValue(mockIssues);
      mockCompatibilityService.getPlatformCompatibility.mockResolvedValue(mockPlatformInfo);
      
      await handler!({ code: 'PRINT "test"', platform: 'all' });
      
      expect(mockCompatibilityService.validateCompatibility).toHaveBeenCalledWith('PRINT "test"');
      expect(mockCompatibilityService.getPlatformCompatibility).toHaveBeenCalledWith('all');
      expect(createMCPResponse).toHaveBeenCalledWith({
        issues: mockIssues,
        platformInfo: mockPlatformInfo,
        summary: {
          totalIssues: 2,
          errors: 1,
          warnings: 1
        }
      });
    });

    it('should use default platform when not specified', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('validate_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      mockCompatibilityService.validateCompatibility.mockResolvedValue([]);
      mockCompatibilityService.getPlatformCompatibility.mockResolvedValue({});
      
      await handler!({ code: 'PRINT "test"' });
      
      expect(mockCompatibilityService.getPlatformCompatibility).toHaveBeenCalledWith('all');
    });

    it('should handle validation errors', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('validate_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const error = new Error('Validation failed');
      mockCompatibilityService.validateCompatibility.mockRejectedValue(error);
      
      await handler!({ code: 'test' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'validating compatibility');
    });
  });

  describe('search_qb64pe_compatibility', () => {
    it('should search compatibility knowledge successfully', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('search_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const mockResults = [
        { category: 'function_return_types', title: 'Result 1' },
        { category: 'console_directives', title: 'Result 2' }
      ];
      mockCompatibilityService.searchCompatibility.mockResolvedValue(mockResults);
      
      await handler!({ query: 'function types' });
      
      expect(mockCompatibilityService.searchCompatibility).toHaveBeenCalledWith('function types');
      expect(createMCPResponse).toHaveBeenCalledWith(mockResults);
    });

    it('should filter results by category', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('search_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const mockResults = [
        { category: 'function_return_types', title: 'Result 1' },
        { category: 'console_directives', title: 'Result 2' }
      ];
      mockCompatibilityService.searchCompatibility.mockResolvedValue(mockResults);
      
      await handler!({ query: 'test', category: 'function_return_types' });
      
      const response = (createMCPResponse as jest.Mock).mock.calls[0][0];
      expect(response).toHaveLength(1);
      expect(response[0].category).toBe('function_return_types');
    });

    it('should not filter when category is "all"', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('search_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const mockResults = [
        { category: 'function_return_types', title: 'Result 1' },
        { category: 'console_directives', title: 'Result 2' }
      ];
      mockCompatibilityService.searchCompatibility.mockResolvedValue(mockResults);
      
      await handler!({ query: 'test', category: 'all' });
      
      expect(createMCPResponse).toHaveBeenCalledWith(mockResults);
    });

    it('should handle search errors', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('search_qb64pe_compatibility');
      expect(handler).toBeDefined();
      
      const error = new Error('Search failed');
      mockCompatibilityService.searchCompatibility.mockRejectedValue(error);
      
      await handler!({ query: 'test' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'searching compatibility knowledge');
    });
  });

  describe('get_qb64pe_best_practices', () => {
    it('should get best practices for all topics', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_best_practices');
      expect(handler).toBeDefined();
      
      const mockPractices = ['Practice 1', 'Practice 2'];
      const mockDebuggingHelp = '## Debugging Tips\n- Use PRINT statements';
      
      mockCompatibilityService.getBestPractices.mockResolvedValue(mockPractices);
      mockCompatibilityService.getDebuggingGuidance.mockResolvedValue(mockDebuggingHelp);
      
      await handler!({ topic: 'all' });
      
      expect(mockCompatibilityService.getBestPractices).toHaveBeenCalled();
      expect(mockCompatibilityService.getDebuggingGuidance).toHaveBeenCalled();
      expect(createMCPTextResponse).toHaveBeenCalled();
      
      const guidance = (createMCPTextResponse as jest.Mock).mock.calls[0][0];
      expect(guidance).toContain('QB64PE Best Practices');
      expect(guidance).toContain('Debugging Tips');
      expect(guidance).toContain('Practice 1');
    });

    it('should get debugging-specific best practices', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_best_practices');
      expect(handler).toBeDefined();
      
      const mockPractices = ['Practice 1'];
      const mockDebuggingHelp = '## Debugging Tips\n- Debug info';
      
      mockCompatibilityService.getBestPractices.mockResolvedValue(mockPractices);
      mockCompatibilityService.getDebuggingGuidance.mockResolvedValue(mockDebuggingHelp);
      
      await handler!({ topic: 'debugging' });
      
      expect(mockCompatibilityService.getDebuggingGuidance).toHaveBeenCalled();
      const guidance = (createMCPTextResponse as jest.Mock).mock.calls[0][0];
      expect(guidance).toContain('Debugging Tips');
    });

    it('should skip debugging section for non-debugging topics', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_best_practices');
      expect(handler).toBeDefined();
      
      const mockPractices = ['Practice 1'];
      mockCompatibilityService.getBestPractices.mockResolvedValue(mockPractices);
      
      await handler!({ topic: 'syntax' });
      
      expect(mockCompatibilityService.getBestPractices).toHaveBeenCalled();
      expect(mockCompatibilityService.getDebuggingGuidance).not.toHaveBeenCalled();
    });

    it('should use default topic when not specified', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_best_practices');
      expect(handler).toBeDefined();
      
      const mockPractices = ['Practice 1'];
      const mockDebuggingHelp = 'Debugging help';
      
      mockCompatibilityService.getBestPractices.mockResolvedValue(mockPractices);
      mockCompatibilityService.getDebuggingGuidance.mockResolvedValue(mockDebuggingHelp);
      
      await handler!({});
      
      expect(mockCompatibilityService.getBestPractices).toHaveBeenCalled();
      expect(mockCompatibilityService.getDebuggingGuidance).toHaveBeenCalled();
    });

    it('should handle best practices errors', async () => {
      registerCompatibilityTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_best_practices');
      expect(handler).toBeDefined();
      
      const error = new Error('Best practices failed');
      mockCompatibilityService.getBestPractices.mockRejectedValue(error);
      
      await handler!({ topic: 'syntax' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting best practices');
    });
  });
});
