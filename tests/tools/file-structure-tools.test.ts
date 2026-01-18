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
    it('should execute validate_bi_file_structure handler', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bi_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: 'TYPE TestType\n  field AS INTEGER\nEND TYPE'
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    it('should execute validate_bi_file_structure with filename', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bi_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: '$INCLUDEONCE\nCONST TEST = 1',
          filename: 'test.bi'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute validate_bm_file_structure handler', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bm_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: 'SUB TestSub\n  PRINT "Test"\nEND SUB'
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    it('should execute validate_bm_file_structure with filename', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bm_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: '$INCLUDEONCE\nFUNCTION Test\n  Test = 1\nEND FUNCTION',
          filename: 'test.bm'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute validate_qb64_gj_lib_file_pair handler', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64_gj_lib_file_pair'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          biContent: 'TYPE TestType\n  field AS INTEGER\nEND TYPE',
          bmContent: 'SUB TestSub\n  PRINT "Test"\nEND SUB'
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    it('should execute validate_qb64_gj_lib_file_pair with library name', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64_gj_lib_file_pair'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          biContent: 'CONST TEST = 1',
          bmContent: 'FUNCTION Test\n  Test = 1\nEND FUNCTION',
          libraryName: 'MyLib'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute quick_check_qb64_file_structure handler', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'quick_check_qb64_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          filename: 'test.bi',
          content: 'TYPE TestType\n  field AS INTEGER\nEND TYPE'
        });
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });

    it('should execute quick_check for .bm file', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'quick_check_qb64_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          filename: 'test.bm',
          content: 'SUB TestSub\n  PRINT "Test"\nEND SUB'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute quick_check for other file type', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'quick_check_qb64_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          filename: 'test.bas',
          content: 'PRINT "Hello"'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle validate_bi_file with errors', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bi_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: 'SUB TestSub\n  PRINT "This should not be in .BI"\nEND SUB',
          filename: 'invalid.bi'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle validate_bm_file with errors', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_bm_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          content: 'TYPE InvalidType\n  field AS INTEGER\nEND TYPE',
          filename: 'invalid.bm'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle quick_check with invalid .bi file', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'quick_check_qb64_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          filename: 'invalid.bi',
          content: 'SUB Test\n  PRINT "Invalid"\nEND SUB'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle quick_check with many issues', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'quick_check_qb64_file_structure'
      );
      
      if (call) {
        const handler = call[2];
        const invalidContent = Array(10).fill('SUB Test\nPRINT "Invalid"\nEND SUB').join('\n');
        const result = await handler({ 
          filename: 'many_issues.bi',
          content: invalidContent
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle validate_qb64_gj_lib_file_pair with issues', async () => {
      registerFileStructureTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'validate_qb64_gj_lib_file_pair'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          biContent: 'SUB WrongPlace\nEND SUB',
          bmContent: 'TYPE WrongPlace\nEND TYPE',
          libraryName: 'BadLib'
        });
        expect(result).toBeDefined();
      }
    });
  });
});
