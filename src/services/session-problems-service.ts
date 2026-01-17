/**
 * Session Problems Logging Service
 * Tracks development problems during chat sessions for continuous improvement
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface SessionProblem {
  id: string;
  timestamp: Date;
  category: 'syntax' | 'compatibility' | 'workflow' | 'tooling' | 'architecture' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'new' | 'acknowledged' | 'in-progress' | 'handled' | 'wont-fix';
  handledBy?: string;
  handledAt?: Date;
  handlingNotes?: string;
  context: {
    language: string;
    framework?: string;
    task?: string;
    fileType?: string;
  };
  problem: {
    attempted: string;
    error: string;
    rootCause: string;
  };
  solution: {
    implemented: string;
    preventionStrategy: string;
  };
  mcpImprovement?: {
    toolNeeded?: string;
    enhancementNeeded?: string;
    priority: 'high' | 'medium' | 'low';
  };
  metrics?: {
    attemptsBeforeSolution: number;
    timeWasted?: string;
    toolsUsed: string[];
    toolsShouldHaveUsed?: string[];
  };
}

export interface SessionProblemsReport {
  sessionId: string;
  date: Date;
  totalProblems: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  patterns: string[];
  recommendations: string[];
  problems: SessionProblem[];
}

export class SessionProblemsService {
  private problems: Map<string, SessionProblem> = new Map();
  private sessionId: string;
  private storageDir: string;
  private currentSessionFile: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.storageDir = join(homedir(), '.qb64pe-mcp', 'session-problems');
    this.currentSessionFile = join(this.storageDir, `${this.sessionId}.json`);
    this.initializeStorage();
  }

  /**
   * Initialize storage directory and load existing session
   */
  private async initializeStorage(): Promise<void> {
    try {
      // Create storage directory if it doesn't exist
      await fs.mkdir(this.storageDir, { recursive: true });
      
      // Try to load existing session file
      try {
        const data = await fs.readFile(this.currentSessionFile, 'utf-8');
        const sessionData = JSON.parse(data);
        
        // Restore problems from file
        sessionData.problems.forEach((problem: SessionProblem) => {
          // Convert timestamp string back to Date
    
    // Save to disk asynchronously (don't block)
    this.saveToFile().catch(err => 
      console.error('[SessionProblems] Failed to persist problem:', err)
    );
    
          problem.timestamp = new Date(problem.timestamp);
          this.problems.set(problem.id, problem);
        });
      } catch (error) {
        // File doesn't exist yet, that's fine - new session
      }
    } catch (error) {
      console.error('[SessionProblems] Failed to initialize storage:', error);
    }
  }

  /**
   * Save current session to disk
   */
  private async saveToFile(): Promise<void> {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        lastUpdated: new Date().toISOString(),
        problems: Array.from(this.problems.values()),
      };
      
      await fs.writeFile(
        this.currentSessionFile,
        JSON.stringify(sessionData, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('[SessionProblems] Failed to save to file:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const date = new Date().toISOString().split('T')[0];
    const random = Math.random().toString(36).substring(2, 8);
    return `session-${date}-${random}`;
  }

  /**
   * Log a new problem
   */
  logProblem(problem: Omit<SessionProblem, 'id' | 'timestamp' | 'status'>): SessionProblem {
    const id = `problem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fullProblem: SessionProblem = {
      ...problem,
      id,
      timestamp: new Date(),
      status: 'new',
    };

    this.problems.set(id, fullProblem);
    
    // Save to disk asynchronously (don't block)
    this.saveToFile().catch(err => 
      console.error('[SessionProblems] Failed to persist problem:', err)
    );
    
    return fullProblem;
  }

  /**
   * Get all problems for current session
   */
  getProblems(): SessionProblem[] {
    return Array.from(this.problems.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Get problems by category
   */
  getProblemsByCategory(category: SessionProblem['category']): SessionProblem[] {
    return this.getProblems().filter(p => p.category === category);
  }

  /**
   * Get problems by severity
   */
  getProblemsBySeverity(severity: SessionProblem['severity']): SessionProblem[] {
    return this.getProblems().filter(p => p.severity === severity);
  }

  /**
   * Update problem status
   */
  updateProblemStatus(
    problemId: string,
    status: SessionProblem['status'],
    handledBy?: string,
    notes?: string
  ): SessionProblem | null {
    const problem = this.problems.get(problemId);
    if (!problem) return null;

    problem.status = status;
    if (status === 'handled' || status === 'wont-fix') {
      problem.handledBy = handledBy;
      problem.handledAt = new Date();
      problem.handlingNotes = notes;
    }

    this.problems.set(problemId, problem);
    
    // Save to disk
    this.saveToFile().catch(err => 
      console.error('[SessionProblems] Failed to persist status update:', err)
    );
    
    return problem;
  }

  /**
   * Get problems by status
   */
  getProblemsByStatus(status: SessionProblem['status']): SessionProblem[] {
    return this.getProblems().filter(p => p.status === status);
  }

  /**
   * Get unhandled problems (new + acknowledged + in-progress)
   */
  getUnhandledProblems(): SessionProblem[] {
    return this.getProblems().filter(
      p => p.status === 'new' || p.status === 'acknowledged' || p.status === 'in-progress'
    );
  }

  /**
   * Get actionable problems for MCP improvement (high priority unhandled)
   */
  getActionableProblems(): SessionProblem[] {
    return this.getUnhandledProblems()
      .filter(p => p.mcpImprovement && p.mcpImprovement.priority === 'high')
      .sort((a, b) => {
        // Sort by severity first
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }

  /**
   * Generate comprehensive report
   */
  generateReport(): SessionProblemsReport {
    const problems = this.getProblems();
    
    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byCategory: Record<string, number> = {
      syntax: 0,
      compatibility: 0,
      workflow: 0,
      tooling: 0,
      architecture: 0,
      other: 0,
    };

    problems.forEach(problem => {
      bySeverity[problem.severity]++;
      byCategory[problem.category]++;
    });

    const patterns = this.identifyPatterns(problems);
    const recommendations = this.generateRecommendations(problems, patterns);

    return {
      sessionId: this.sessionId,
      date: new Date(),
      totalProblems: problems.length,
      bySeverity,
      byCategory,
      patterns,
      recommendations,
      problems,
    };
  }

  /**
   * Identify common patterns in problems
   */
  private identifyPatterns(problems: SessionProblem[]): string[] {
    const patterns: string[] = [];

    // Check for tool usage patterns
    const toolNotUsed = problems.filter(
      p => p.metrics?.toolsShouldHaveUsed && p.metrics.toolsShouldHaveUsed.length > 0
    );
    if (toolNotUsed.length >= 2) {
      patterns.push(
        `Multiple instances of not using available MCP tools (${toolNotUsed.length} cases) - tools should be used FIRST`
      );
    }

    // Check for syntax error patterns
    const syntaxErrors = problems.filter(p => p.category === 'syntax');
    if (syntaxErrors.length >= 2) {
      const commonErrors = this.findCommonSubstrings(
        syntaxErrors.map(e => e.problem.error)
      );
      if (commonErrors.length > 0) {
        patterns.push(`Recurring syntax errors: ${commonErrors.join(', ')}`);
      }
    }

    // Check for repeated manual attempts
    const manualAttempts = problems.filter(
      p => p.metrics && p.metrics.attemptsBeforeSolution > 2
    );
    if (manualAttempts.length >= 2) {
      patterns.push(
        `Multiple problems required 3+ attempts - indicates need for proactive validation`
      );
    }

    return patterns;
  }

  /**
   * Generate recommendations based on problems
   */
  private generateRecommendations(
    problems: SessionProblem[],
    patterns: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Check if MCP tool creation is needed
    const needNewTools = problems.filter(
      p => p.mcpImprovement?.toolNeeded
    );
    if (needNewTools.length > 0) {
      const toolNames = needNewTools
        .map(p => p.mcpImprovement?.toolNeeded)
        .filter(Boolean);
      recommendations.push(
        `Create new MCP tools: ${[...new Set(toolNames)].join(', ')}`
      );
    }

    // Check if existing tools need enhancement
    const needEnhancement = problems.filter(
      p => p.mcpImprovement?.enhancementNeeded
    );
    if (needEnhancement.length > 0) {
      recommendations.push(
        `Enhance existing tools: ${needEnhancement.length} tools need improvements`
      );
    }

    // Workflow recommendations
    if (patterns.some(p => p.includes('not using available MCP tools'))) {
      recommendations.push(
        'CRITICAL: LLM training needed - emphasize using MCP tools FIRST before manual attempts'
      );
      recommendations.push(
        'Add workflow guidance: Validate → Generate → Test pattern'
      );
    }

    // Documentation recommendations
    const docNeeded = problems.filter(
      p => p.solution.preventionStrategy.toLowerCase().includes('documentation')
    );
    if (docNeeded.length > 0) {
      recommendations.push(
        `Update documentation: ${docNeeded.length} problems could be prevented with better docs`
      );
    }

    return recommendations;
  }

  /**
   * Find common substrings in error messages
   */
  private findCommonSubstrings(strings: string[]): string[] {
    if (strings.length < 2) return [];

    const commonParts: Set<string> = new Set();

    // Extract common patterns (simple approach)
    strings.forEach(str1 => {
      strings.forEach(str2 => {
        if (str1 !== str2) {
          const words1 = str1.toLowerCase().split(/\s+/);
          const words2 = str2.toLowerCase().split(/\s+/);
          
          words1.forEach(word => {
            if (word.length > 4 && words2.includes(word)) {
              commonParts.add(word);
            }
          });
        }
      });
    });

    return Array.from(commonParts);
  }

  /**
   * Export report as markdown
   */
  exportAsMarkdown(report: SessionProblemsReport): string {
    const lines: string[] = [];

    lines.push(`# Session Problems Report`);
    lines.push(`**Session ID:** ${report.sessionId}`);
    lines.push(`**Date:** ${report.date.toISOString()}`);
    lines.push(`**Total Problems:** ${report.totalProblems}`);
    lines.push('');

    lines.push('## Summary');
    lines.push('');
    lines.push('### By Severity');
    Object.entries(report.bySeverity).forEach(([severity, count]) => {
      if (count > 0) {
        lines.push(`- **${severity}**: ${count}`);
      }
    });
    lines.push('');

    lines.push('### By Category');
    Object.entries(report.byCategory).forEach(([category, count]) => {
      if (count > 0) {
        lines.push(`- **${category}**: ${count}`);
      }
    });
    lines.push('');

    if (report.patterns.length > 0) {
      lines.push('## Identified Patterns');
      report.patterns.forEach(pattern => {
        lines.push(`- ${pattern}`);
      });
      lines.push('');
    }

    if (report.recommendations.length > 0) {
      lines.push('## Recommendations');
      report.recommendations.forEach((rec, i) => {
        lines.push(`${i + 1}. ${rec}`);
      });
      lines.push('');
    }

    lines.push('## Problems Detail');
    lines.push('');

    report.problems.forEach((problem, i) => {
      lines.push(`### ${i + 1}. ${problem.title} (${problem.severity.toUpperCase()})`);
      lines.push(`**Category:** ${problem.category}`);
      lines.push(`**Context:** ${problem.context.language}${problem.context.framework ? ` (${problem.context.framework})` : ''}`);
      lines.push('');
      
      lines.push('**Problem:**');
      lines.push(`- Attempted: ${problem.problem.attempted}`);
      lines.push(`- Error: ${problem.problem.error}`);
      lines.push(`- Root Cause: ${problem.problem.rootCause}`);
      lines.push('');

      lines.push('**Solution:**');
      lines.push(`- Implemented: ${problem.solution.implemented}`);
      lines.push(`- Prevention: ${problem.solution.preventionStrategy}`);
      lines.push('');

      if (problem.mcpImprovement) {
        lines.push('**MCP Improvement Needed:**');
        if (problem.mcpImprovement.toolNeeded) {
          lines.push(`- New Tool: ${problem.mcpImprovement.toolNeeded}`);
        }
        if (problem.mcpImprovement.enhancementNeeded) {
          lines.push(`- Enhancement: ${problem.mcpImprovement.enhancementNeeded}`);
        }
        lines.push(`- Priority: ${problem.mcpImprovement.priority}`);
        lines.push('');
      }

      if (problem.metrics) {
        lines.push('**Metrics:**');
        lines.push(`- Attempts: ${problem.metrics.attemptsBeforeSolution}`);
        if (problem.metrics.timeWasted) {
          lines.push(`- Time Wasted: ${problem.metrics.timeWasted}`);
        }
        if (problem.metrics.toolsUsed.length > 0) {
          lines.push(`- Tools Used: ${problem.metrics.toolsUsed.join(', ')}`);
        }
        if (problem.metrics.toolsShouldHaveUsed && problem.metrics.toolsShouldHaveUsed.length > 0) {
          lines.push(`- Should Have Used: ${problem.metrics.toolsShouldHaveUsed.join(', ')}`);
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Clear all problems (start new session)
   */
  clear(): void {
    this.problems.clear();
    this.sessionId = this.generateSessionId();
    this.currentSessionFile = join(this.storageDir, `${this.sessionId}.json`);
    
    // Save empty session file
    this.saveToFile().catch(err => 
      console.error('[SessionProblems] Failed to save cleared session:', err)
    );
  }

  /**
   * Get storage location
   */
  getStorageLocation(): string {
    return this.currentSessionFile;
  }

  /**
   * List all saved session files
   */
  async listSessions(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.storageDir);
      return files.filter(f => f.endsWith('.json')).sort().reverse();
    } catch (error) {
      return [];
    }
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const problems = this.getProblems();
    return {
      total: problems.length,
      byStatus: {
        new: problems.filter(p => p.status === 'new').length,
        acknowledged: problems.filter(p => p.status === 'acknowledged').length,
        inProgress: problems.filter(p => p.status === 'in-progress').length,
        handled: problems.filter(p => p.status === 'handled').length,
        wontFix: problems.filter(p => p.status === 'wont-fix').length,
      },
      unhandled: this.getUnhandledProblems().length,
      actionable: this.getActionableProblems().length,
      bySeverity: {
        critical: problems.filter(p => p.severity === 'critical').length,
        high: problems.filter(p => p.severity === 'high').length,
        medium: problems.filter(p => p.severity === 'medium').length,
        low: problems.filter(p => p.severity === 'low').length,
      },
      byCategory: {
        syntax: problems.filter(p => p.category === 'syntax').length,
        compatibility: problems.filter(p => p.category === 'compatibility').length,
        workflow: problems.filter(p => p.category === 'workflow').length,
        tooling: problems.filter(p => p.category === 'tooling').length,
        architecture: problems.filter(p => p.category === 'architecture').length,
        other: problems.filter(p => p.category === 'other').length,
      },
      avgAttemptsBeforeSolution:
        problems.reduce((sum, p) => sum + (p.metrics?.attemptsBeforeSolution || 0), 0) /
        problems.filter(p => p.metrics?.attemptsBeforeSolution).length || 0,
      toolsNotUsedCount: problems.filter(
        p => p.metrics?.toolsShouldHaveUsed && p.metrics.toolsShouldHaveUsed.length > 0
      ).length,
    };
  }
}
