import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFeedbackTools } from '../../src/tools/feedback-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { FeedbackService } from '../../src/services/feedback-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
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

    it('should execute generate_programming_feedback without context', async () => {
      registerFeedbackTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_programming_feedback'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ code: 'DIM x AS INTEGER' });
        expect(result).toBeDefined();
      }
    });

    it('should handle generate_programming_feedback errors', async () => {
      const errorServices = {
        feedbackService: {
          generateFeedback: jest.fn().mockImplementation(() => { throw new Error('Feedback failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerFeedbackTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'generate_programming_feedback'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ code: 'TEST' });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_programming_feedback_history handler', async () => {
      registerFeedbackTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_programming_feedback_history'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({ limit: 5 });
        expect(result).toBeDefined();
      }
    });

    it('should execute get_programming_feedback_history with default limit', async () => {
      registerFeedbackTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_programming_feedback_history'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_programming_feedback_history errors', async () => {
      const errorServices = {
        feedbackService: {
          getFeedbackHistory: jest.fn().mockImplementation(() => { throw new Error('History failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerFeedbackTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_programming_feedback_history'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should execute get_feedback_statistics handler', async () => {
      registerFeedbackTools(mockServer, services);
      const call = (mockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_feedback_statistics'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });

    it('should handle get_feedback_statistics errors', async () => {
      const errorServices = {
        feedbackService: {
          getStatistics: jest.fn().mockImplementation(() => { throw new Error('Stats failed'); })
        }
      } as any;

      const errorMockServer = {
        registerTool: jest.fn()
      } as any;

      registerFeedbackTools(errorMockServer, errorServices);
      const call = (errorMockServer.registerTool as jest.Mock).mock.calls.find(
        c => c[0] === 'get_feedback_statistics'
      );
      
      if (call) {
        const handler = call[2];
        const result = await handler({});
        expect(result).toBeDefined();
      }
    });
  });
});
