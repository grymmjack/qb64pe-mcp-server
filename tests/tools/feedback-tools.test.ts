import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFeedbackTools } from '../../src/tools/feedback-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { FeedbackService } from '../../src/services/feedback-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] }))
}));

describe('Feedback Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;

  beforeEach(() => {
    mockServer = {
      registerTool: jest.fn()
    } as any;

    services = {
      feedbackService: new FeedbackService()
    } as ServiceContainer;
  });

  describe('registerFeedbackTools', () => {
    it('should register feedback tools without errors', () => {
      expect(() => registerFeedbackTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register generate_programming_feedback tool', () => {
      registerFeedbackTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('generate_programming_feedback');
    });

    it('should register get_programming_feedback_history tool', () => {
      registerFeedbackTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_programming_feedback_history');
    });
  });

  describe('Tool Handler Execution', () => {
    it('should execute generate_programming_feedback handler', async () => {
      registerFeedbackTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_programming_feedback'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ 
          code: 'PRINT "Hello"',
          context: 'Testing basic output'
        });
        expect(result).toBeDefined();
      }
    });
  });
});
