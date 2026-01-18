import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerExecutionTools } from '../../src/tools/execution-tools';
import { ServiceContainer } from '../../src/utils/tool-types';

// Mock the mcp-helpers module
jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

// Import the mocked functions
import { createMCPResponse, createMCPError } from '../../src/utils/mcp-helpers';

describe('Execution Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;
  let registeredTools: Map<string, Function>;
  let mockExecutionService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    registeredTools = new Map();

    mockServer = {
      registerTool: jest.fn((name: string, schema: any, handler: Function) => {
        registeredTools.set(name, handler);
      })
    } as any;

    // Create mock execution service
    mockExecutionService = {
      analyzeExecutionMode: jest.fn(),
      getExecutionGuidance: jest.fn(),
      getProcessMonitoringCommands: jest.fn(),
      getProcessTerminationCommands: jest.fn(),
      generateMonitoringTemplate: jest.fn(),
      generateConsoleFormattingTemplate: jest.fn(),
      getMonitoringGuidance: jest.fn(),
      parseConsoleOutput: jest.fn(),
      getFileMonitoringCommands: jest.fn()
    };

    services = {
      executionService: mockExecutionService
    } as any;
  });

  describe('registerExecutionTools', () => {
    it('should register execution tools without errors', () => {
      expect(() => registerExecutionTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register exactly 7 execution tools', () => {
      registerExecutionTools(mockServer, services);
      expect(mockServer.registerTool).toHaveBeenCalledTimes(7);
    });

    it('should register all expected tool names', () => {
      registerExecutionTools(mockServer, services);
      const toolNames = (mockServer.registerTool as jest.Mock).mock.calls.map(call => call[0]);
      
      expect(toolNames).toContain('analyze_qb64pe_execution_mode');
      expect(toolNames).toContain('get_process_monitoring_commands');
      expect(toolNames).toContain('generate_monitoring_template');
      expect(toolNames).toContain('generate_console_formatting_template');
      expect(toolNames).toContain('get_execution_monitoring_guidance');
      expect(toolNames).toContain('parse_console_output');
      expect(toolNames).toContain('get_file_monitoring_commands');
    });
  });

  describe('analyze_qb64pe_execution_mode', () => {
    it('should analyze execution mode successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('analyze_qb64pe_execution_mode');
      expect(handler).toBeDefined();
      
      const mockExecutionState = { hasGraphics: true, hasConsole: false };
      const mockGuidance = { recommendation: 'Use graphics mode' };
      
      mockExecutionService.analyzeExecutionMode.mockReturnValue(mockExecutionState);
      mockExecutionService.getExecutionGuidance.mockReturnValue(mockGuidance);
      
      await handler!({ sourceCode: 'SCREEN 12' });
      
      expect(mockExecutionService.analyzeExecutionMode).toHaveBeenCalledWith('SCREEN 12');
      expect(mockExecutionService.getExecutionGuidance).toHaveBeenCalledWith(mockExecutionState);
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle analysis errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('analyze_qb64pe_execution_mode');
      expect(handler).toBeDefined();
      
      const error = new Error('Analysis failed');
      mockExecutionService.analyzeExecutionMode.mockImplementation(() => { throw error; });
      
      await handler!({ sourceCode: 'test' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'analyzing execution mode');
    });
  });

  describe('get_process_monitoring_commands', () => {
    it('should get monitoring commands successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_process_monitoring_commands');
      expect(handler).toBeDefined();
      
      const mockMonitoringCommands = ['ps aux | grep qb64pe'];
      const mockTerminationCommands = ['kill -9 12345'];
      
      mockExecutionService.getProcessMonitoringCommands.mockReturnValue(mockMonitoringCommands);
      mockExecutionService.getProcessTerminationCommands.mockReturnValue(mockTerminationCommands);
      
      await handler!({ processName: 'qb64pe', platform: 'linux' });
      
      expect(mockExecutionService.getProcessMonitoringCommands).toHaveBeenCalledWith('qb64pe');
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle command generation errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_process_monitoring_commands');
      expect(handler).toBeDefined();
      
      const error = new Error('Command generation failed');
      mockExecutionService.getProcessMonitoringCommands.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting process monitoring commands');
    });
  });

  describe('generate_monitoring_template', () => {
    it('should generate monitoring template successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('generate_monitoring_template');
      expect(handler).toBeDefined();
      
      const mockTemplate = 'PRINT "Monitoring template"';
      mockExecutionService.generateMonitoringTemplate.mockReturnValue(mockTemplate);
      
      await handler!({ sourceCode: 'PRINT "test"', templateType: 'basic' });
      
      expect(mockExecutionService.generateMonitoringTemplate).toHaveBeenCalledWith('PRINT "test"', 'basic');
      expect(createMCPResponse).toHaveBeenCalledWith({ template: mockTemplate });
    });

    it('should handle template generation errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('generate_monitoring_template');
      expect(handler).toBeDefined();
      
      const error = new Error('Generation failed');
      mockExecutionService.generateMonitoringTemplate.mockImplementation(() => { throw error; });
      
      await handler!({ sourceCode: 'test' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'generating monitoring template');
    });
  });

  describe('generate_console_formatting_template', () => {
    it('should generate console template successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('generate_console_formatting_template');
      expect(handler).toBeDefined();
      
      const mockTemplate = 'PRINT "Formatted output"';
      mockExecutionService.generateConsoleFormattingTemplate.mockReturnValue(mockTemplate);
      
      await handler!({ style: 'structured' });
      
      expect(mockExecutionService.generateConsoleFormattingTemplate).toHaveBeenCalledWith('structured');
      expect(createMCPResponse).toHaveBeenCalledWith({ template: mockTemplate });
    });

    it('should handle console template errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('generate_console_formatting_template');
      expect(handler).toBeDefined();
      
      const error = new Error('Template failed');
      mockExecutionService.generateConsoleFormattingTemplate.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'generating console formatting template');
    });
  });

  describe('get_execution_monitoring_guidance', () => {
    it('should get monitoring guidance successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_execution_monitoring_guidance');
      expect(handler).toBeDefined();
      
      const mockGuidance = 'Monitor using console output and log files';
      mockExecutionService.getMonitoringGuidance.mockReturnValue(mockGuidance);
      
      await handler!({});
      
      expect(mockExecutionService.getMonitoringGuidance).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalledWith({ guidance: mockGuidance });
    });

    it('should handle guidance errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_execution_monitoring_guidance');
      expect(handler).toBeDefined();
      
      const error = new Error('Guidance failed');
      mockExecutionService.getMonitoringGuidance.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting execution monitoring guidance');
    });
  });

  describe('parse_console_output', () => {
    it('should parse console output successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('parse_console_output');
      expect(handler).toBeDefined();
      
      const mockParsed = { sections: [], variables: [] };
      mockExecutionService.parseConsoleOutput.mockReturnValue(mockParsed);
      
      await handler!({ output: 'test output' });
      
      expect(mockExecutionService.parseConsoleOutput).toHaveBeenCalledWith('test output');
      expect(createMCPResponse).toHaveBeenCalledWith(mockParsed);
    });

    it('should handle parsing errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('parse_console_output');
      expect(handler).toBeDefined();
      
      const error = new Error('Parse failed');
      mockExecutionService.parseConsoleOutput.mockImplementation(() => { throw error; });
      
      await handler!({ output: 'bad output' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'parsing console output');
    });
  });

  describe('get_file_monitoring_commands', () => {
    it('should get file monitoring commands successfully', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_file_monitoring_commands');
      expect(handler).toBeDefined();
      
      const mockCommands = ['tail -f logfile.log'];
      mockExecutionService.getFileMonitoringCommands.mockReturnValue(mockCommands);
      
      await handler!({ logFilePath: 'test.log' });
      
      expect(mockExecutionService.getFileMonitoringCommands).toHaveBeenCalledWith('test.log');
      expect(createMCPResponse).toHaveBeenCalledWith({ commands: mockCommands });
    });

    it('should handle file monitoring errors', async () => {
      registerExecutionTools(mockServer, services);
      const handler = registeredTools.get('get_file_monitoring_commands');
      expect(handler).toBeDefined();
      
      const error = new Error('File monitoring failed');
      mockExecutionService.getFileMonitoringCommands.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting file monitoring commands');
    });
  });
});
