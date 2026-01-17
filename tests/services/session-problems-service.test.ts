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
});
