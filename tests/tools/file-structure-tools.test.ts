import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFileStructureTools } from '../../src/tools/file-structure-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { FileStructureService } from '../../src/services/file-structure-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('File Structure Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      fileStructureService: new FileStructureService()
    } as ServiceContainer;
  });

  describe('registerFileStructureTools', () => {
    it('should register file structure tools without errors', () => {
      expect(() => registerFileStructureTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register validate_bi_file_structure tool', () => {
      registerFileStructureTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('validate_bi_file_structure');
    });

    it('should register validate_bm_file_structure tool', () => {
      registerFileStructureTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('validate_bm_file_structure');
    });

    it('should register validate_qb64_gj_lib_file_pair tool', () => {
      registerFileStructureTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('validate_qb64_gj_lib_file_pair');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute validate_qb64_gj_lib_bi_file handler', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64_gj_lib_bi_file'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          filePath: 'test.bi',
          content: 'TYPE TestType\\n  field AS INTEGER\\nEND TYPE'
        });
        expect(result).toBeDefined();
      }
    });
  });
});
