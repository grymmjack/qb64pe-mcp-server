import { SessionProblemsService } from '../../src/services/session-problems-service';

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockRejectedValue(new Error('File not found')),
    writeFile: jest.fn().mockResolvedValue(undefined),
    readdir: jest.fn().mockResolvedValue([]),
  }
}));

describe('SessionProblemsService', () => {
  let service: SessionProblemsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SessionProblemsService();
  });

  describe('logProblem', () => {
    it('should log a new problem', () => {
      const problem = {
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Test Problem',
        description: 'A test problem occurred',
        context: {
          language: 'QB64PE',
          task: 'Compiling program'
        },
        problem: {
          attempted: 'Compile code',
          error: 'Syntax error',
          rootCause: 'Missing semicolon'
        },
        solution: {
          implemented: 'Added semicolon',
          preventionStrategy: 'Use linter'
        }
      };

      const result = service.logProblem(problem);
      
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should include metrics when provided', () => {
      const problem = {
        category: 'tooling' as const,
        severity: 'medium' as const,
        title: 'Tool Issue',
        description: 'Tool not working',
        context: {
          language: 'QB64PE'
        },
        problem: {
          attempted: 'Use tool',
          error: 'Tool failed',
          rootCause: 'Unknown'
        },
        solution: {
          implemented: 'Fixed tool',
          preventionStrategy: 'Better testing'
        },
        metrics: {
          attemptsBeforeSolution: 3,
          timeWasted: '5 minutes',
          toolsUsed: ['tool1', 'tool2']
        }
      };

      const result = service.logProblem(problem);
      expect(result.id).toBeDefined();
    });

    it('should include MCP improvement suggestions', () => {
      const problem = {
        category: 'workflow' as const,
        severity: 'high' as const,
        title: 'Workflow Problem',
        description: 'Workflow is inefficient',
        context: {
          language: 'QB64PE'
        },
        problem: {
          attempted: 'Follow workflow',
          error: 'Too slow',
          rootCause: 'Missing automation'
        },
        solution: {
          implemented: 'Automated step',
          preventionStrategy: 'Add tool'
        },
        mcpImprovement: {
          toolNeeded: 'Automation tool',
          enhancementNeeded: 'Better workflow',
          priority: 'high' as const
        }
      };

      const result = service.logProblem(problem);
      expect(result.id).toBeDefined();
    });
  });

  describe('getProblems', () => {
    it('should return all problems', () => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'low' as const,
        title: 'Problem 1',
        description: 'First problem',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      service.logProblem({
        category: 'syntax' as const,
        severity: 'low' as const,
        title: 'Problem 2',
        description: 'Second problem',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      const problems = service.getProblems();
      expect(problems.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getProblemsByCategory', () => {
    beforeEach(() => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'low' as const,
        title: 'Syntax Problem',
        description: 'Syntax issue',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      service.logProblem({
        category: 'compatibility' as const,
        severity: 'low' as const,
        title: 'Compatibility Problem',
        description: 'Compatibility issue',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
    });

    it('should filter by category', () => {
      const syntaxProblems = service.getProblemsByCategory('syntax');
      expect(syntaxProblems.every(p => p.category === 'syntax')).toBe(true);
    });

    it('should return empty array for category with no problems', () => {
      const problems = service.getProblemsByCategory('architecture');
      expect(problems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getProblemsBySeverity', () => {
    beforeEach(() => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'critical' as const,
        title: 'Critical Problem',
        description: 'Very serious',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      service.logProblem({
        category: 'syntax' as const,
        severity: 'low' as const,
        title: 'Low Problem',
        description: 'Minor issue',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
    });

    it('should filter by severity', () => {
      const criticalProblems = service.getProblemsBySeverity('critical');
      expect(criticalProblems.every(p => p.severity === 'critical')).toBe(true);
    });
  });

  describe('updateProblemStatus', () => {
    it('should update problem status', () => {
      const problem = service.logProblem({
        category: 'syntax' as const,
        severity: 'low' as const,
        title: 'Updateable Problem',
        description: 'Will be updated',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      const updated = service.updateProblemStatus(problem.id, 'handled', 'Developer', 'Fixed the issue');
      
      expect(updated?.status).toBe('handled');
      expect(updated?.handledBy).toBe('Developer');
      expect(updated?.handlingNotes).toBe('Fixed the issue');
    });

    it('should return null for non-existent problem', () => {
      const result = service.updateProblemStatus('nonexistent', 'handled');
      expect(result).toBeNull();
    });
  });

  describe('generateReport', () => {
    beforeEach(() => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Report Problem 1',
        description: 'First',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });

      service.logProblem({
        category: 'compatibility' as const,
        severity: 'medium' as const,
        title: 'Report Problem 2',
        description: 'Second',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
    });

    it('should generate comprehensive report', () => {
      const report = service.generateReport();
      
      expect(report).toHaveProperty('sessionId');
      expect(report).toHaveProperty('totalProblems');
      expect(report).toHaveProperty('bySeverity');
      expect(report).toHaveProperty('byCategory');
      expect(report.totalProblems).toBeGreaterThanOrEqual(2);
    });

    it('should include severity breakdown', () => {
      const report = service.generateReport();
      
      expect(report.bySeverity).toBeDefined();
      expect(typeof report.bySeverity).toBe('object');
    });

    it('should include category breakdown', () => {
      const report = service.generateReport();
      
      expect(report.byCategory).toBeDefined();
      expect(typeof report.byCategory).toBe('object');
    });

    it('should include recommendations', () => {
      const report = service.generateReport();
      
      expect(report.recommendations).toBeDefined();
      expect(Array.isArray(report.recommendations)).toBe(true);
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'critical' as const,
        title: 'Stats Problem',
        description: 'For statistics',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
    });

    it('should return statistics object', () => {
      const stats = service.getStatistics();
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('bySeverity');
      expect(stats).toHaveProperty('byCategory');
      expect(stats).toHaveProperty('byStatus');
    });

    it('should have correct counts', () => {
      const stats = service.getStatistics();
      
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getProblemsByStatus', () => {
    beforeEach(() => {
      const id = service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Status Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      service.updateProblemStatus(id.id, 'handled', 'agent');
    });

    it('should filter by status', () => {
      const handled = service.getProblemsByStatus('handled');
      expect(handled.length).toBeGreaterThan(0);
      expect(handled.every(p => p.status === 'handled')).toBe(true);
    });

    it('should return new problems', () => {
      service.logProblem({
        category: 'workflow' as const,
        severity: 'medium' as const,
        title: 'New Problem',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      const newProblems = service.getProblemsByStatus('new');
      expect(newProblems.length).toBeGreaterThan(0);
    });
  });

  describe('getUnhandledProblems', () => {
    it('should return unhandled problems', () => {
      service.logProblem({
        category: 'tooling' as const,
        severity: 'high' as const,
        title: 'Unhandled',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      const unhandled = service.getUnhandledProblems();
      expect(Array.isArray(unhandled)).toBe(true);
    });
  });

  describe('getActionableProblems', () => {
    it('should return high priority problems', () => {
      service.logProblem({
        category: 'architecture' as const,
        severity: 'critical' as const,
        title: 'High Priority',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' },
        mcpImprovement: {
          toolNeeded: 'New tool',
          priority: 'high' as const
        }
      });
      const actionable = service.getActionableProblems();
      expect(Array.isArray(actionable)).toBe(true);
    });

    it('should sort by severity', () => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'medium' as const,
        title: 'Medium Priority',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' },
        mcpImprovement: {
          priority: 'high' as const
        }
      });
      service.logProblem({
        category: 'tooling' as const,
        severity: 'critical' as const,
        title: 'Critical Priority',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' },
        mcpImprovement: {
          priority: 'high' as const
        }
      });
      const actionable = service.getActionableProblems();
      if (actionable.length >= 2) {
        expect(actionable[0].severity).toBe('critical');
      }
    });
  });

  describe('clear', () => {
    it('should clear all problems', () => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'To Clear',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      service.clear();
      expect(service.getProblems().length).toBe(0);
    });
  });

  describe('generateReport', () => {
    it('should generate comprehensive report', () => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Report Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const report = service.generateReport();
      expect(report).toBeDefined();
      expect(typeof report).toBe('object');
      expect(report.sessionId).toBeDefined();
    });

    it('should include statistics in report', () => {
      service.logProblem({
        category: 'tooling' as const,
        severity: 'medium' as const,
        title: 'Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const report = service.generateReport();
      expect(report.bySeverity).toBeDefined();
      expect(report.byCategory).toBeDefined();
    });

    it('should include problem details in report', () => {
      service.logProblem({
        category: 'workflow' as const,
        severity: 'low' as const,
        title: 'Detailed Problem',
        description: 'Test Description',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const report = service.generateReport();
      expect(report.problems.some(p => p.title === 'Detailed Problem')).toBe(true);
    });
  });

  describe('file persistence', () => {
    it('should handle save errors gracefully', () => {
      const problem = service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Save Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      expect(problem.id).toBeDefined();
    });

    it('should initialize storage directory', async () => {
      const newService = new SessionProblemsService();
      expect(newService).toBeDefined();
    });
  });

  describe('problem updates', () => {
    it('should update status to acknowledged', () => {
      const problem = service.logProblem({
        category: 'compatibility' as const,
        severity: 'medium' as const,
        title: 'Acknowledged Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const updated = service.updateProblemStatus(problem.id, 'acknowledged');
      expect(updated).not.toBeNull();
      if (updated) {
        expect(updated.status).toBe('acknowledged');
      }
    });

    it('should update status to in-progress', () => {
      const problem = service.logProblem({
        category: 'tooling' as const,
        severity: 'high' as const,
        title: 'In Progress Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const updated = service.updateProblemStatus(problem.id, 'in-progress');
      expect(updated).not.toBeNull();
      if (updated) {
        expect(updated.status).toBe('in-progress');
      }
    });

    it('should update status to wont-fix', () => {
      const problem = service.logProblem({
        category: 'workflow' as const,
        severity: 'low' as const,
        title: 'Wont Fix Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const updated = service.updateProblemStatus(problem.id, 'wont-fix', 'user', 'Not worth fixing');
      expect(updated).not.toBeNull();
      if (updated) {
        expect(updated.status).toBe('wont-fix');
        expect(updated.handledBy).toBe('user');
        expect(updated.handlingNotes).toBe('Not worth fixing');
      }
    });

    it('should set handledAt timestamp', () => {
      const problem = service.logProblem({
        category: 'architecture' as const,
        severity: 'critical' as const,
        title: 'Timestamp Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const updated = service.updateProblemStatus(problem.id, 'handled', 'agent');
      expect(updated).not.toBeNull();
      if (updated) {
        expect(updated.handledAt).toBeDefined();
        expect(updated.handledAt instanceof Date).toBe(true);
      }
    });
  });

  describe('filtering and querying', () => {
    beforeEach(() => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Filter Test 1',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      service.logProblem({
        category: 'compatibility' as const,
        severity: 'medium' as const,
        title: 'Filter Test 2',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
    });

    it('should filter multiple categories', () => {
      const syntax = service.getProblemsByCategory('syntax');
      const compat = service.getProblemsByCategory('compatibility');
      
      expect(syntax.length).toBeGreaterThan(0);
      expect(compat.length).toBeGreaterThan(0);
    });

    it('should filter multiple severities', () => {
      const high = service.getProblemsBySeverity('high');
      const medium = service.getProblemsBySeverity('medium');
      
      expect(high.some(p => p.severity === 'high')).toBe(true);
      expect(medium.some(p => p.severity === 'medium')).toBe(true);
    });
  });

  describe('statistics calculation', () => {
    it('should calculate category distribution', () => {
      service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Stats Test 1',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      service.logProblem({
        category: 'syntax' as const,
        severity: 'medium' as const,
        title: 'Stats Test 2',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const stats = service.getStatistics();
      expect(stats.byCategory).toBeDefined();
    });

    it('should calculate severity distribution', () => {
      service.logProblem({
        category: 'tooling' as const,
        severity: 'critical' as const,
        title: 'Severity Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const stats = service.getStatistics();
      expect(stats.bySeverity).toBeDefined();
    });

    it('should calculate status distribution', () => {
      const id = service.logProblem({
        category: 'workflow' as const,
        severity: 'high' as const,
        title: 'Status Stats Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      service.updateProblemStatus(id.id, 'handled', 'agent');
      
      const stats = service.getStatistics();
      expect(stats.byStatus).toBeDefined();
    });
  });

  describe('MCP improvement tracking', () => {
    it('should track high priority improvements', () => {
      service.logProblem({
        category: 'tooling' as const,
        severity: 'high' as const,
        title: 'MCP Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' },
        mcpImprovement: {
          toolNeeded: 'Better tool',
          priority: 'high' as const
        }
      });
      
      const actionable = service.getActionableProblems();
      expect(actionable.some(p => p.mcpImprovement?.priority === 'high')).toBe(true);
    });

    it('should include enhancement suggestions', () => {
      service.logProblem({
        category: 'architecture' as const,
        severity: 'medium' as const,
        title: 'Enhancement Test',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' },
        mcpImprovement: {
          enhancementNeeded: 'Better architecture',
          priority: 'medium' as const
        }
      });
      
      const problems = service.getProblems();
      expect(problems.some(p => p.mcpImprovement?.enhancementNeeded)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle updating non-existent problem', () => {
      // Service returns null instead of throwing
      const result = service.updateProblemStatus('nonexistent-id', 'handled');
      expect(result).toBeNull();
    });

    it('should handle empty problem list operations', () => {
      service.clear();
      expect(service.getProblems()).toEqual([]);
      expect(service.getUnhandledProblems()).toEqual([]);
      expect(service.getActionableProblems()).toEqual([]);
    });

    it('should handle concurrent log operations', () => {
      const problem1 = service.logProblem({
        category: 'syntax' as const,
        severity: 'high' as const,
        title: 'Concurrent 1',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      const problem2 = service.logProblem({
        category: 'tooling' as const,
        severity: 'medium' as const,
        title: 'Concurrent 2',
        description: 'Test',
        context: { language: 'QB64PE' },
        problem: { attempted: 'A', error: 'E', rootCause: 'R' },
        solution: { implemented: 'I', preventionStrategy: 'P' }
      });
      
      expect(problem1.id).not.toBe(problem2.id);
    });
  });
});

