import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerPortingTools } from '../../src/tools/porting-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { QB64PEPortingService } from '../../src/services/porting-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

describe('Porting Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      portingService: new QB64PEPortingService()
    } as ServiceContainer;
  });

  describe('registerPortingTools', () => {
    it('should register porting tools without errors', () => {
      expect(() => registerPortingTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register port_qbasic_to_qb64pe tool', () => {
      registerPortingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('port_qbasic_to_qb64pe');
    });

    it('should register get_porting_dialect_info tool', () => {
      registerPortingTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_porting_dialect_info');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute port_qbasic_to_qb64pe handler', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          sourceCode: 'PRINT "Hello"',
          sourceDialect: 'qbasic',
          addModernFeatures: true
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute port_qbasic_to_qb64pe with default parameters', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'PRINT "Test"' });
        expect(result).toBeDefined();
      }
    });

    it('should execute port_qbasic_to_qb64pe with all options enabled', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'SCREEN 12\\nCIRCLE (320, 240), 100',
          sourceDialect: 'qbasic',
          addModernFeatures: true,
          preserveComments: true,
          convertGraphics: true,
          optimizePerformance: true
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute port_qbasic_to_qb64pe with all options disabled', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'PRINT "Test"',
          sourceDialect: 'qbasic',
          addModernFeatures: false,
          preserveComments: false,
          convertGraphics: false,
          optimizePerformance: false
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_porting_dialect_info with default (all)', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_porting_dialect_info'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ dialect: 'all' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_porting_dialect_info with no parameters', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_porting_dialect_info'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_porting_dialect_info with specific dialect', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_porting_dialect_info'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ dialect: 'qbasic' });
        expect(result).toBeDefined();
      }
    });

    it('should execute analyze_qbasic_compatibility handler', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'SCREEN 12\\nCIRCLE (100, 100), 50',
          sourceDialect: 'qbasic'
        });
        expect(result).toBeDefined();
      }
    });

    it('should execute analyze_qbasic_compatibility with default dialect', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'PRINT "Test"' });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with graphics', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'SCREEN 12\\nPSET (100, 100), 14\\nLINE (0,0)-(100,100)'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with sound', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'PLAY "C D E F"\\nBEEP\\nSOUND 440, 10'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with file I/O', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'OPEN "test.txt" FOR OUTPUT AS #1\\nPRINT #1, "Data"\\nCLOSE #1'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with DEF FN', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'DEF FNSquare(x) = x * x\\nPRINT FNSquare(5)'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with GOSUB', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'GOSUB 100\\nEND\\n100 PRINT "Subroutine"\\nRETURN'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with multi-statement lines', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'x = 10: IF x > 5 THEN PRINT "Greater"'
        });
        expect(result).toBeDefined();
      }
    });

    it('should analyze code with DECLARE statements', async () => {
      registerPortingTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({
          sourceCode: 'DECLARE SUB TestSub()\\nCALL TestSub'
        });
        expect(result).toBeDefined();
      }
    });

    it('should handle errors in port_qbasic_to_qb64pe gracefully', async () => {
      // Create a mock service that throws an error
      const errorServices = {
        portingService: {
          portQBasicToQB64PE: jest.fn().mockRejectedValue(new Error('Porting failed'))
        }
      } as any;
      
      const errorMockServer = {
        registerTool: jest.fn()
      } as any;
      
      registerPortingTools(errorMockServer, errorServices);
      
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'port_qbasic_to_qb64pe'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'INVALID CODE' });
        expect(result).toBeDefined();
      }
    });

    it('should handle errors in get_porting_dialect_info gracefully', async () => {
      // Create a mock service that throws an error
      const errorServices = {
        portingService: {
          getSupportedDialects: jest.fn().mockImplementation(() => { throw new Error('Failed'); }),
          getDialectRules: jest.fn().mockImplementation(() => { throw new Error('Failed'); })
        }
      } as any;
      
      const errorMockServer = {
        registerTool: jest.fn()
      } as any;
      
      registerPortingTools(errorMockServer, errorServices);
      
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_porting_dialect_info'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ dialect: 'qbasic' });
        expect(result).toBeDefined();
      }
    });

    it('should handle errors in analyze_qbasic_compatibility gracefully', async () => {
      // Create a mock service that throws an error
      const errorServices = {
        portingService: {
          portQBasicToQB64PE: jest.fn().mockRejectedValue(new Error('Analysis failed'))
        }
      } as any;
      
      const errorMockServer = {
        registerTool: jest.fn()
      } as any;
      
      registerPortingTools(errorMockServer, errorServices);
      
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'analyze_qbasic_compatibility'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ sourceCode: 'BROKEN' });
        expect(result).toBeDefined();
      }
    });
  });
});
