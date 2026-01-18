import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSessionProblemsTools } from '../../src/tools/session-problems-tools';
import { ServiceContainer } from '../../src/utils/tool-types';
import { SessionProblemsService } from '../../src/services/session-problems-service';

jest.mock('../../src/utils/mcp-helpers', () => ({
  createMCPResponse: jest.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })),
  createMCPError: jest.fn((error) => ({ isError: true, content: [{ type: 'text', text: String(error) }] })),
  createMCPTextResponse: jest.fn((text) => ({ content: [{ type: 'text', text }] }))
}));

describe('Session Problems Tools', () => {
  let mockServer: McpServer;
  let services: ServiceContainer;
  let handlers: Map<string, Function>;

  beforeEach(() => {
    handlers = new Map();
    mockServer = {
      registerTool: jest.fn((name: string, schema: any, handler: Function) => {
        handlers.set(name, handler);
      })
    } as any;

    services = {
      sessionProblemsService: new SessionProblemsService()
    } as ServiceContainer;
  });

  describe('registerSessionProblemsTools', () => {
    it('should register session problems tools without errors', () => {
      expect(() => registerSessionProblemsTools(mockServer, services)).not.toThrow();
      expect(mockServer.registerTool).toHaveBeenCalled();
    });

    it('should register all 6 tools', () => {
      registerSessionProblemsTools(mockServer, services);
      expect(mockServer.registerTool).toHaveBeenCalledTimes(6);
    });

    it('should register log_session_problem tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('log_session_problem');
    });

    it('should register get_session_problems_report tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_session_problems_report');
    });

    it('should register get_session_problems_statistics tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_session_problems_statistics');
    });

    it('should register clear_session_problems tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('clear_session_problems');
    });

    it('should register get_unhandled_problems tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('get_unhandled_problems');
    });

    it('should register update_problem_status tool', () => {
      registerSessionProblemsTools(mockServer, services);
      const calls = (mockServer.registerTool as jest.Mock).mock.calls;
      const toolNames = calls.map(call => call[0]);
      expect(toolNames).toContain('update_problem_status');
    });
  });

  describe('log_session_problem tool', () => {
    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
    });

    it('should return error when missing required fields', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when missing category', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        severity: 'medium',
        title: 'Test',
        description: 'Test desc'
      });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when missing severity', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'syntax',
        title: 'Test',
        description: 'Test desc'
      });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when missing title', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'syntax',
        severity: 'medium',
        description: 'Test desc'
      });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when missing description', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'syntax',
        severity: 'medium',
        title: 'Test'
      });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should log problem with minimum required fields', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'syntax',
        severity: 'medium',
        title: 'Test Problem',
        description: 'Test description'
      });
      expect(result.content[0].text).toContain('Problem Logged Successfully');
      expect(result.content[0].text).toContain('Test Problem');
    });

    it('should log problem with all fields including context', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'workflow',
        severity: 'high',
        title: 'Workflow Issue',
        description: 'Detailed description',
        context: { language: 'QB64PE', task: 'Compiling' },
        problem: { attempted: 'Compile', error: 'Syntax error', rootCause: 'Missing semicolon' },
        solution: { implemented: 'Added semicolon', preventionStrategy: 'Better linting' }
      });
      expect(result.content[0].text).toContain('Problem Logged Successfully');
      expect(result.content[0].text).toContain('Workflow Issue');
    });

    it('should log problem with MCP improvement suggestions', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'tooling',
        severity: 'critical',
        title: 'Tool Missing',
        description: 'Need new tool',
        mcpImprovement: {
          toolNeeded: 'validate_code',
          enhancementNeeded: 'Better error messages',
          priority: 'high'
        }
      });
      expect(result.content[0].text).toContain('MCP Improvement Needed');
      expect(result.content[0].text).toContain('validate_code');
      expect(result.content[0].text).toContain('high');
    });

    it('should log problem with only toolNeeded', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'tooling',
        severity: 'high',
        title: 'Need New Tool',
        description: 'Missing functionality',
        mcpImprovement: {
          toolNeeded: 'new_tool',
          priority: 'medium'
        }
      });
      expect(result.content[0].text).toContain('MCP Improvement Needed');
      expect(result.content[0].text).toContain('new_tool');
    });

    it('should log problem with only enhancementNeeded', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'tooling',
        severity: 'medium',
        title: 'Tool Enhancement',
        description: 'Existing tool needs improvement',
        mcpImprovement: {
          enhancementNeeded: 'Better validation',
          priority: 'low'
        }
      });
      expect(result.content[0].text).toContain('MCP Improvement Needed');
      expect(result.content[0].text).toContain('Better validation');
    });

    it('should log problem with metrics', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'architecture',
        severity: 'low',
        title: 'Design Issue',
        description: 'Needs refactoring',
        metrics: {
          attemptsBeforeSolution: 3,
          timeWasted: '15 minutes',
          toolsUsed: ['grep_search', 'read_file'],
          toolsShouldHaveUsed: ['semantic_search']
        }
      });
      expect(result.content[0].text).toContain('Problem Logged Successfully');
    });

    it('should handle compatibility category', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'compatibility',
        severity: 'medium',
        title: 'Compatibility Problem',
        description: 'Version mismatch'
      });
      expect(result.content[0].text).toContain('compatibility');
    });

    it('should handle other category', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'other',
        severity: 'low',
        title: 'Misc Issue',
        description: 'Uncategorized'
      });
      expect(result.content[0].text).toContain('other');
    });

    it('should use default values when context not provided', async () => {
      const handler = handlers.get('log_session_problem')!;
      const result = await handler({
        category: 'syntax',
        severity: 'medium',
        title: 'Test',
        description: 'Testing defaults'
      });
      expect(result.content[0].text).toContain('Problem Logged Successfully');
    });
  });

  describe('get_session_problems_report tool', () => {
    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
      // Log some problems first
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'high',
        title: 'Syntax Error',
        description: 'Missing bracket',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Compile', error: 'Parse error', rootCause: 'Typo' },
        solution: { implemented: 'Fixed typo', preventionStrategy: 'Code review' }
      });
    });

    it('should generate detailed report by default', async () => {
      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('Session Problems Report');
      expect(result.content[0].text).toContain('Syntax Error');
      expect(result.content[0].text).toContain('Summary');
    });

    it('should generate detailed report when format=detailed', async () => {
      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('Session Problems Report');
      expect(result.content[0].text).toContain('Problem 1:');
    });

    it('should generate summary report when format=summary', async () => {
      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'summary' });
      expect(result.content[0].text).toContain('Session Problems Summary');
      expect(result.content[0].text).toContain('Total Problems:');
      expect(result.content[0].text).toContain('format="detailed"');
    });

    it('should generate markdown report when format=markdown', async () => {
      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'markdown' });
      expect(result.content[0].text).toContain('# Session Problems');
    });

    it('should include MCP improvement in detailed report', async () => {
      services.sessionProblemsService.logProblem({
        category: 'tooling',
        severity: 'medium',
        title: 'Tool Issue',
        description: 'Missing feature',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Use tool', error: 'Not found', rootCause: 'Not implemented' },
        solution: { implemented: 'Manual fix', preventionStrategy: 'Add tool' },
        mcpImprovement: {
          toolNeeded: 'new_tool',
          enhancementNeeded: 'Add feature',
          priority: 'high'
        }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('MCP Improvement');
      expect(result.content[0].text).toContain('new_tool');
    });

    it('should include metrics in detailed report', async () => {
      services.sessionProblemsService.logProblem({
        category: 'workflow',
        severity: 'low',
        title: 'Workflow Issue',
        description: 'Inefficient process',
        context: { language: 'TypeScript', framework: 'Jest' },
        problem: { attempted: 'Search', error: 'Too slow', rootCause: 'Wrong tool' },
        solution: { implemented: 'Used better tool', preventionStrategy: 'Learn tools' },
        metrics: {
          attemptsBeforeSolution: 5,
          timeWasted: '20 minutes',
          toolsUsed: ['grep_search'],
          toolsShouldHaveUsed: ['semantic_search']
        }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('Metrics');
      expect(result.content[0].text).toContain('Attempts:');
      expect(result.content[0].text).toContain('(Jest)');
    });

    it('should show patterns and recommendations in summary format', async () => {
      // Log multiple problems that will trigger pattern detection
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'high',
        title: 'Syntax Error 1',
        description: 'Parse error',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Compile', error: 'Expected END IF', rootCause: 'Missing END IF' },
        solution: { implemented: 'Added END IF', preventionStrategy: 'Better checking' },
        metrics: {
          attemptsBeforeSolution: 3,
          timeWasted: '10 minutes',
          toolsUsed: [],
          toolsShouldHaveUsed: ['validate_syntax']
        }
      });
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'high',
        title: 'Syntax Error 2',
        description: 'Another parse error',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Compile', error: 'Expected END IF', rootCause: 'Missing END IF' },
        solution: { implemented: 'Added END IF', preventionStrategy: 'Better checking' },
        metrics: {
          attemptsBeforeSolution: 4,
          timeWasted: '15 minutes',
          toolsUsed: [],
          toolsShouldHaveUsed: ['validate_syntax']
        },
        mcpImprovement: {
          toolNeeded: 'validate_syntax',
          enhancementNeeded: 'Proactive validation',
          priority: 'high'
        }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'summary' });
      expect(result.content[0].text).toContain('Key Patterns');
      expect(result.content[0].text).toContain('Recommendations');
    });

    it('should handle problem without metrics or mcpImprovement in detailed format', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'low',
        title: 'Simple Syntax Error',
        description: 'Missing semicolon',
        context: { language: 'C++' },
        problem: { attempted: 'Compile', error: 'Expected ;', rootCause: 'Typo' },
        solution: { implemented: 'Added ;', preventionStrategy: 'IDE warnings' }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('Simple Syntax Error');
      expect(result.content[0].text).toContain('C++');
    });

    it('should handle problem with metrics but no toolsShouldHaveUsed', async () => {
      // Use fresh service to isolate test
      services.sessionProblemsService = new SessionProblemsService();
      
      services.sessionProblemsService.logProblem({
        category: 'workflow',
        severity: 'medium',
        title: 'Workflow Issue',
        description: 'Slow process',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Execute', error: 'Timeout', rootCause: 'Slow' },
        solution: { implemented: 'Optimized', preventionStrategy: 'Profiling' },
        metrics: {
          attemptsBeforeSolution: 2,
          timeWasted: '5 minutes',
          toolsUsed: ['read_file'],
          toolsShouldHaveUsed: undefined
        }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('Workflow Issue');
      expect(result.content[0].text).toContain('**Attempts:** 2');
    });

    it('should show patterns and recommendations in detailed format', async () => {
      // Clear and start fresh
      services.sessionProblemsService = new SessionProblemsService();
      
      // Log problem with MCP improvement that triggers recommendations
      services.sessionProblemsService.logProblem({
        category: 'tooling',
        severity: 'medium',
        title: 'Tool needed',
        description: 'Missing tool',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Use tool', error: 'Not found', rootCause: 'Not implemented' },
        solution: { implemented: 'Manual fix', preventionStrategy: 'Add tool' },
        mcpImprovement: {
          toolNeeded: 'new_validation_tool',
          enhancementNeeded: 'Better validation',
          priority: 'high'
        }
      });

      const handler = handlers.get('get_session_problems_report')!;
      const result = await handler({ format: 'detailed' });
      expect(result.content[0].text).toContain('## Recommendations');
      expect(result.content[0].text).toContain('1. Create new MCP tools');
      expect(result.content[0].text).toContain('2. Enhance existing tools');
      
      // Verify the numbered list format
      const text = result.content[0].text;
      const recommendationsMatch = text.match(/## Recommendations\n\n([\s\S]*?)\n\n## Problems/);
      expect(recommendationsMatch).toBeTruthy();
      if (recommendationsMatch) {
        const recommendations = recommendationsMatch[1];
        expect(recommendations).toMatch(/\d+\.\s+/); // Verify numbered format
      }
    });
  });

  describe('get_session_problems_statistics tool', () => {
    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
    });

    it('should return statistics for empty session', async () => {
      const handler = handlers.get('get_session_problems_statistics')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('Session Problems Statistics');
      expect(result.content[0].text).toContain('**Total Problems Logged:** 0');
    });

    it('should return statistics with problems', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'critical',
        title: 'Critical Issue',
        description: 'System crash',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Run', error: 'Crash', rootCause: 'Memory leak' },
        solution: { implemented: 'Fixed leak', preventionStrategy: 'Better testing' }
      });

      const handler = handlers.get('get_session_problems_statistics')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('**Total Problems Logged:** 1');
      expect(result.content[0].text).toContain('Critical: 1');
    });

    it('should show warning when tools not used', async () => {
      services.sessionProblemsService.logProblem({
        category: 'workflow',
        severity: 'medium',
        title: 'Missed Tool',
        description: 'Should have used tool',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Manual search', error: 'Slow', rootCause: 'Did not know tool' },
        solution: { implemented: 'Used tool', preventionStrategy: 'Learn tools' },
        metrics: {
          attemptsBeforeSolution: 3,
          toolsUsed: [],
          toolsShouldHaveUsed: ['semantic_search']
        }
      });

      const handler = handlers.get('get_session_problems_statistics')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('⚠️');
      expect(result.content[0].text).toContain('tools should have been used');
    });

    it('should show success when all tools used appropriately', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'low',
        title: 'Minor Issue',
        description: 'Small bug',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Compile', error: 'Warning', rootCause: 'Unused variable' },
        solution: { implemented: 'Removed variable', preventionStrategy: 'Enable warnings' },
        metrics: {
          attemptsBeforeSolution: 1,
          toolsUsed: ['read_file', 'replace_string_in_file'],
          toolsShouldHaveUsed: []
        }
      });

      const handler = handlers.get('get_session_problems_statistics')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('✅');
      expect(result.content[0].text).toContain('utilized available MCP tools appropriately');
    });
  });

  describe('clear_session_problems tool', () => {
    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'medium',
        title: 'Test Problem',
        description: 'For clearing',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Test', error: 'Test', rootCause: 'Test' },
        solution: { implemented: 'Test', preventionStrategy: 'Test' }
      });
    });

    it('should return error when confirm is false', async () => {
      const handler = handlers.get('clear_session_problems')!;
      const result = await handler({ confirm: false });
      expect(result.content[0].text).toContain('Clearing Cancelled');
      expect(result.content[0].text).toContain('confirm=true');
    });

    it('should return error when confirm is missing', async () => {
      const handler = handlers.get('clear_session_problems')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('Clearing Cancelled');
    });

    it('should clear problems when confirm is true', async () => {
      const handler = handlers.get('clear_session_problems')!;
      const result = await handler({ confirm: true });
      expect(result.content[0].text).toContain('Session Problems Cleared');
      expect(result.content[0].text).toContain('1 problems logged');
    });

    it('should show correct count after clearing', async () => {
      const statsBefore = services.sessionProblemsService.getStatistics();
      expect(statsBefore.total).toBe(1);

      const handler = handlers.get('clear_session_problems')!;
      await handler({ confirm: true });

      const statsAfter = services.sessionProblemsService.getStatistics();
      expect(statsAfter.total).toBe(0);
    });
  });

  describe('get_unhandled_problems tool', () => {
    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
    });

    it('should return no problems message when list is empty', async () => {
      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('No Unhandled Problems');
      expect(result.content[0].text).toContain('All logged problems have been addressed');
    });

    it('should return all unhandled problems by default', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'medium',
        title: 'Unhandled Issue',
        description: 'Not yet fixed',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Fix', error: 'Failed', rootCause: 'Unknown' },
        solution: { implemented: 'None', preventionStrategy: 'Unknown' },
        mcpImprovement: {
          toolNeeded: 'debug_tool',
          priority: 'medium'
        }
      });

      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('Unhandled Problems');
      expect(result.content[0].text).toContain('Unhandled Issue');
      expect(result.content[0].text).toContain('Next Steps');
    });

    it('should filter by priority when priorityFilter=high-only', async () => {
      services.sessionProblemsService.logProblem({
        category: 'tooling',
        severity: 'critical',
        title: 'High Priority Problem',
        description: 'Urgent fix needed',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Fix', error: 'Critical', rootCause: 'Bug' },
        solution: { implemented: 'None', preventionStrategy: 'Fix now' },
        mcpImprovement: {
          toolNeeded: 'critical_tool',
          priority: 'high'
        }
      });

      services.sessionProblemsService.logProblem({
        category: 'workflow',
        severity: 'low',
        title: 'Low Priority Problem',
        description: 'Can wait',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Optimize', error: 'Slow', rootCause: 'Algorithm' },
        solution: { implemented: 'None', preventionStrategy: 'Later' },
        mcpImprovement: {
          enhancementNeeded: 'Optimization',
          priority: 'low'
        }
      });

      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({ priorityFilter: 'high-only' });
      expect(result.content[0].text).toContain('High Priority Only');
      expect(result.content[0].text).toContain('High Priority Problem');
    });

    it('should show all problems when priorityFilter=all', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'medium',
        title: 'Problem 1',
        description: 'First problem',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Fix', error: 'Error', rootCause: 'Cause' },
        solution: { implemented: 'None', preventionStrategy: 'None' }
      });

      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({ priorityFilter: 'all' });
      expect(result.content[0].text).toContain('Problem 1');
    });

    it('should display problem details including MCP improvement', async () => {
      services.sessionProblemsService.logProblem({
        category: 'architecture',
        severity: 'high',
        title: 'Design Problem',
        description: 'Needs redesign',
        context: { language: 'TypeScript' },
        problem: { attempted: 'Refactor', error: 'Too complex', rootCause: 'Bad design' },
        solution: { implemented: 'None', preventionStrategy: 'Better planning' },
        mcpImprovement: {
          enhancementNeeded: 'Better architecture tool',
          priority: 'high'
        }
      });

      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('MCP Improvement Needed');
      expect(result.content[0].text).toContain('Better architecture tool');
    });

    it('should show message when no MCP improvement specified', async () => {
      services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'low',
        title: 'Simple Problem',
        description: 'Easy fix',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Fix', error: 'Typo', rootCause: 'Mistake' },
        solution: { implemented: 'Fixed', preventionStrategy: 'Careful' }
      });

      const handler = handlers.get('get_unhandled_problems')!;
      const result = await handler({});
      expect(result.content[0].text).toContain('No MCP improvement specified');
    });
  });

  describe('update_problem_status tool', () => {
    let problemId: string;

    beforeEach(() => {
      registerSessionProblemsTools(mockServer, services);
      const problem = services.sessionProblemsService.logProblem({
        category: 'syntax',
        severity: 'medium',
        title: 'Test Problem',
        description: 'For status update',
        context: { language: 'QB64PE' },
        problem: { attempted: 'Fix', error: 'Error', rootCause: 'Cause' },
        solution: { implemented: 'None', preventionStrategy: 'None' }
      });
      problemId = problem.id;
    });

    it('should return error when problemId is missing', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({ status: 'handled' });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when status is missing', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({ problemId: 'test-id' });
      expect(result.content[0].text).toContain('Missing Required Fields');
    });

    it('should return error when problem not found', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId: 'non-existent-id',
        status: 'handled'
      });
      expect(result.content[0].text).toContain('Problem Not Found');
    });

    it('should update status to acknowledged', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'acknowledged'
      });
      expect(result.content[0].text).toContain('Problem Status Updated');
      expect(result.content[0].text).toContain('acknowledged');
    });

    it('should update status to in-progress', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'in-progress'
      });
      expect(result.content[0].text).toContain('in-progress');
    });

    it('should update status to handled', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'handled'
      });
      expect(result.content[0].text).toContain('handled');
    });

    it('should update status to wont-fix', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'wont-fix'
      });
      expect(result.content[0].text).toContain('wont-fix');
    });

    it('should include handledBy in response', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'handled',
        handledBy: 'agent'
      });
      expect(result.content[0].text).toContain('Handled By:');
      expect(result.content[0].text).toContain('agent');
    });

    it('should include notes in response', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'wont-fix',
        notes: 'Not a priority'
      });
      expect(result.content[0].text).toContain('Notes:');
      expect(result.content[0].text).toContain('Not a priority');
    });

    it('should include both handledBy and notes', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'handled',
        handledBy: 'manual-fix',
        notes: 'Fixed manually in editor'
      });
      expect(result.content[0].text).toContain('manual-fix');
      expect(result.content[0].text).toContain('Fixed manually in editor');
    });

    it('should show problem title in confirmation', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'acknowledged'
      });
      expect(result.content[0].text).toContain('Test Problem');
    });

    it('should indicate problem will not appear in unhandled list', async () => {
      const handler = handlers.get('update_problem_status')!;
      const result = await handler({
        problemId,
        status: 'handled'
      });
      expect(result.content[0].text).toContain('will no longer appear in unhandled problems list');
    });
  });
});
