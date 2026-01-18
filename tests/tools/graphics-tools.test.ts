import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGraphicsTools } from '../../src/tools/graphics-tools';
import { ServiceContainer } from '../../src/utils/tool-types';

// Mock the mcp-helpers module with inline functions
jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

// Import the mocked functions
import { createMCPResponse, createMCPError, createMCPTextResponse } from '../../src/utils/mcp-helpers';

describe('Graphics Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;
  let registeredTools: Map<string, Function>;
  let mockScreenshotService: any;
  let mockScreenshotWatcher: any;
  let mockLoggingService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    registeredTools = new Map();

    mockServer = {
      registerTool: jest.fn((name: string, schema: any, handler: Function) => {
        registeredTools.set(name, handler);
      })
    } as any;

    // Create mock services
    mockScreenshotService = {
      analyzeScreenshot: jest.fn(),
      generateAnalysisTemplate: jest.fn(),
      captureScreenshot: jest.fn(),
      getQB64PEProcesses: jest.fn(),
      startMonitoring: jest.fn(),
      stopMonitoring: jest.fn(),
      getMonitoringStatus: jest.fn(),
      getScreenshotFiles: jest.fn(),
      getGraphicsGuide: jest.fn()
    };

    mockScreenshotWatcher = {
      startWatching: jest.fn(),
      stopWatching: jest.fn(),
      getAnalysisHistory: jest.fn(),
      getRecentScreenshots: jest.fn(),
      getStatus: jest.fn()
    };

    mockLoggingService = {
      generateEchoFunctions: jest.fn()
    };

    services = {
      screenshotService: mockScreenshotService,
      screenshotWatcher: mockScreenshotWatcher,
      loggingService: mockLoggingService
    } as any;
  });

  describe('registerGraphicsTools', () => {
    it('should register graphics tools without errors', () => {
      expect(() => registerGraphicsTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register exactly 12 graphics tools', () => {
      registerGraphicsTools(mockServer, services);
      expect(mockServer.registerTool).toHaveBeenCalledTimes(12);
    });

    it('should register all expected tool names', () => {
      registerGraphicsTools(mockServer, services);
      const toolNames = (mockServer.registerTool as jest.Mock).mock.calls.map(call => call[0]);
      
      expect(toolNames).toContain('analyze_qb64pe_graphics_screenshot');
      expect(toolNames).toContain('generate_qb64pe_screenshot_analysis_template');
      expect(toolNames).toContain('capture_qb64pe_screenshot');
      expect(toolNames).toContain('get_qb64pe_processes');
      expect(toolNames).toContain('start_screenshot_monitoring');
      expect(toolNames).toContain('stop_screenshot_monitoring');
    });
  });

  describe('analyze_qb64pe_graphics_screenshot', () => {
    it('should analyze screenshot successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('analyze_qb64pe_graphics_screenshot');
      expect(handler).toBeDefined();
      
      const mockAnalysis = { shapes: ['circle'], colors: ['red'] };
      mockScreenshotService.analyzeScreenshot.mockResolvedValue(mockAnalysis);
      
      await handler!({ screenshotPath: '/test.png' });
      
      expect(mockScreenshotService.analyzeScreenshot).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalledWith(mockAnalysis);
    });

    it('should handle analysis errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('analyze_qb64pe_graphics_screenshot');
      expect(handler).toBeDefined();
      
      const error = new Error('Analysis failed');
      mockScreenshotService.analyzeScreenshot.mockRejectedValue(error);
      
      await handler!({ screenshotPath: '/test.png' });
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'analyzing screenshot');
    });
  });

  describe('capture_qb64pe_screenshot', () => {
    it('should capture screenshot successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('capture_qb64pe_screenshot');
      expect(handler).toBeDefined();
      
      const mockResult = { path: '/screenshot.png', success: true };
      mockScreenshotService.captureScreenshot.mockResolvedValue(mockResult);
      
      await handler!({});
      
      expect(mockScreenshotService.captureScreenshot).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalledWith(mockResult);
    });

    it('should handle capture errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('capture_qb64pe_screenshot');
      expect(handler).toBeDefined();
      
      const error = new Error('Capture failed');
      mockScreenshotService.captureScreenshot.mockRejectedValue(error);
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'capturing screenshot');
    });
  });

  describe('start_screenshot_monitoring', () => {
    it('should start monitoring successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('start_screenshot_monitoring');
      expect(handler).toBeDefined();
      
      mockScreenshotService.startMonitoring.mockResolvedValue(undefined);
      
      await handler!({ interval: 5 });
      
      expect(mockScreenshotService.startMonitoring).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle monitoring errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('start_screenshot_monitoring');
      expect(handler).toBeDefined();
      
      const error = new Error('Start failed');
      mockScreenshotService.startMonitoring.mockRejectedValue(error);
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'starting screenshot monitoring');
    });
  });

  describe('stop_screenshot_monitoring', () => {
    it('should stop monitoring successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('stop_screenshot_monitoring');
      expect(handler).toBeDefined();
      
      mockScreenshotService.stopMonitoring.mockResolvedValue(undefined);
      
      await handler!({});
      
      expect(mockScreenshotService.stopMonitoring).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle stop errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('stop_screenshot_monitoring');
      expect(handler).toBeDefined();
      
      const error = new Error('Stop failed');
      mockScreenshotService.stopMonitoring.mockRejectedValue(error);
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'stopping screenshot monitoring');
    });
  });

  describe('get_automation_status', () => {
    it('should get comprehensive status', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_automation_status');
      expect(handler).toBeDefined();
      
      const mockMonitoringStatus = { isMonitoring: true };
      const mockWatcherStatus = { isWatching: false };
      const mockFiles = ['/file1.png'];
      
      mockScreenshotService.getMonitoringStatus.mockReturnValue(mockMonitoringStatus);
      mockScreenshotWatcher.getStatus.mockReturnValue(mockWatcherStatus);
      mockScreenshotService.getScreenshotFiles.mockReturnValue(mockFiles);
      
      await handler!({});
      
      expect(mockScreenshotService.getMonitoringStatus).toHaveBeenCalled();
      expect(mockScreenshotWatcher.getStatus).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle status errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_automation_status');
      expect(handler).toBeDefined();
      
      const error = new Error('Status failed');
      mockScreenshotService.getMonitoringStatus.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting automation status');
    });
  });

  describe('get_qb64pe_graphics_guide', () => {
    it('should get graphics guide successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_graphics_guide');
      expect(handler).toBeDefined();
      
      const mockGuide = 'Graphics guide content';
      mockScreenshotService.getGraphicsGuide.mockResolvedValue(mockGuide);
      
      await handler!({ topic: 'basics' });
      
      expect(mockScreenshotService.getGraphicsGuide).toHaveBeenCalledWith('basics');
      expect(createMCPTextResponse).toHaveBeenCalledWith(mockGuide);
    });

    it('should handle guide errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_graphics_guide');
      expect(handler).toBeDefined();
      
      const error = new Error('Guide failed');
      mockScreenshotService.getGraphicsGuide.mockRejectedValue(error);
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting graphics guide');
    });
  });

  describe('generate_qb64pe_screenshot_analysis_template', () => {
    it('should generate template successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('generate_qb64pe_screenshot_analysis_template');
      expect(handler).toBeDefined();
      
      const mockTemplate = 'Analysis template code';
      mockScreenshotService.generateAnalysisTemplate.mockReturnValue(mockTemplate);
      
      await handler!({ programType: 'shapes' });
      
      expect(mockScreenshotService.generateAnalysisTemplate).toHaveBeenCalledWith('shapes', undefined);
      expect(createMCPTextResponse).toHaveBeenCalledWith(mockTemplate);
    });

    it('should handle template generation errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('generate_qb64pe_screenshot_analysis_template');
      expect(handler).toBeDefined();
      
      const error = new Error('Template failed');
      mockScreenshotService.generateAnalysisTemplate.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'generating screenshot analysis template');
    });
  });

  describe('get_qb64pe_processes', () => {
    it('should get processes successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_processes');
      expect(handler).toBeDefined();
      
      const mockProcesses = [{ pid: 1234, name: 'qb64pe' }];
      mockScreenshotService.getQB64PEProcesses.mockResolvedValue(mockProcesses);
      
      await handler!({});
      
      expect(mockScreenshotService.getQB64PEProcesses).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalledWith(mockProcesses);
    });

    it('should handle process detection errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_qb64pe_processes');
      expect(handler).toBeDefined();
      
      const error = new Error('Process detection failed');
      mockScreenshotService.getQB64PEProcesses.mockRejectedValue(error);
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting QB64PE processes');
    });
  });

  describe('start_screenshot_watching', () => {
    it('should start watching successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('start_screenshot_watching');
      expect(handler).toBeDefined();
      
      mockScreenshotWatcher.startWatching.mockResolvedValue(undefined);
      
      await handler!({ directory: '/watch' });
      
      expect(mockScreenshotWatcher.startWatching).toHaveBeenCalledWith('/watch');
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle watching errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('start_screenshot_watching');
      expect(handler).toBeDefined();
      
      const error = new Error('Watch failed');
      mockScreenshotWatcher.startWatching.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'starting screenshot watching');
    });
  });

  describe('stop_screenshot_watching', () => {
    it('should stop watching successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('stop_screenshot_watching');
      expect(handler).toBeDefined();
      
      mockScreenshotWatcher.stopWatching.mockResolvedValue(undefined);
      
      await handler!({});
      
      expect(mockScreenshotWatcher.stopWatching).toHaveBeenCalled();
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle stop watching errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('stop_screenshot_watching');
      expect(handler).toBeDefined();
      
      const error = new Error('Stop watch failed');
      mockScreenshotWatcher.stopWatching.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'stopping screenshot watching');
    });
  });

  describe('get_screenshot_analysis_history', () => {
    it('should get analysis history successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_screenshot_analysis_history');
      expect(handler).toBeDefined();
      
      const mockHistory = [{ timestamp: '2024-01-01', success: true }];
      const mockScreenshots = [{ path: '/shot1.png' }];
      const mockStatus = { isWatching: true, totalAnalyses: 5 };
      
      mockScreenshotWatcher.getAnalysisHistory.mockReturnValue(mockHistory);
      mockScreenshotWatcher.getRecentScreenshots.mockReturnValue(mockScreenshots);
      mockScreenshotWatcher.getStatus.mockReturnValue(mockStatus);
      
      await handler!({ limit: 10 });
      
      expect(mockScreenshotWatcher.getAnalysisHistory).toHaveBeenCalledWith(10);
      expect(createMCPResponse).toHaveBeenCalled();
    });

    it('should handle history errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('get_screenshot_analysis_history');
      expect(handler).toBeDefined();
      
      const error = new Error('History failed');
      mockScreenshotWatcher.getAnalysisHistory.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'getting analysis history');
    });
  });

  describe('generate_qb64pe_echo_functions', () => {
    it('should generate echo functions successfully', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('generate_qb64pe_echo_functions');
      expect(handler).toBeDefined();
      
      const mockFunctions = 'SUB EchoString(msg AS STRING)\nPRINT msg\nEND SUB';
      mockLoggingService.generateEchoFunctions.mockReturnValue(mockFunctions);
      
      await handler!({ includeStructuredSections: true });
      
      expect(mockLoggingService.generateEchoFunctions).toHaveBeenCalledWith(true);
      expect(createMCPTextResponse).toHaveBeenCalledWith(mockFunctions);
    });

    it('should handle echo function generation errors', async () => {
      registerGraphicsTools(mockServer, services);
      const handler = registeredTools.get('generate_qb64pe_echo_functions');
      expect(handler).toBeDefined();
      
      const error = new Error('Echo generation failed');
      mockLoggingService.generateEchoFunctions.mockImplementation(() => { throw error; });
      
      await handler!({});
      
      expect(createMCPError).toHaveBeenCalledWith(error, 'generating ECHO functions');
    });
  });
});
