"use strict";
/**
 * Session Problems Logging Service
 * Tracks development problems during chat sessions for continuous improvement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionProblemsService = void 0;
class SessionProblemsService {
    problems = new Map();
    sessionId;
    constructor() {
        this.sessionId = this.generateSessionId();
    }
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        const date = new Date().toISOString().split('T')[0];
        const random = Math.random().toString(36).substring(2, 8);
        return `session-${date}-${random}`;
    }
    /**
     * Log a new problem and immediately persist to disk
     */
    logProblem(problem) {
        const id = `problem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const fullProblem = {
            ...problem,
            id,
            timestamp: new Date(),
        };
        this.problems.set(id, fullProblem);
        // Immediately persist to disk
        this.persistToFile();
        return fullProblem;
    }
    /**
     * Get all problems for current session
     */
    getProblems() {
        return Array.from(this.problems.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    /**
     * Get problems by category
     */
    getProblemsByCategory(category) {
        return this.getProblems().filter(p => p.category === category);
    }
    /**
     * Get problems by severity
     */
    getProblemsBySeverity(severity) {
        return this.getProblems().filter(p => p.severity === severity);
    }
    /**
     * Generate comprehensive report
     */
    generateReport() {
        const problems = this.getProblems();
        const bySeverity = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };
        const byCategory = {
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
    identifyPatterns(problems) {
        const patterns = [];
        // Check for tool usage patterns
        const toolNotUsed = problems.filter(p => p.metrics?.toolsShouldHaveUsed && p.metrics.toolsShouldHaveUsed.length > 0);
        if (toolNotUsed.length >= 2) {
            patterns.push(`Multiple instances of not using available MCP tools (${toolNotUsed.length} cases) - tools should be used FIRST`);
        }
        // Check for syntax error patterns
        const syntaxErrors = problems.filter(p => p.category === 'syntax');
        if (syntaxErrors.length >= 2) {
            const commonErrors = this.findCommonSubstrings(syntaxErrors.map(e => e.problem.error));
            if (commonErrors.length > 0) {
                patterns.push(`Recurring syntax errors: ${commonErrors.join(', ')}`);
            }
        }
        // Check for repeated manual attempts
        const manualAttempts = problems.filter(p => p.metrics && p.metrics.attemptsBeforeSolution > 2);
        if (manualAttempts.length >= 2) {
            patterns.push(`Multiple problems required 3+ attempts - indicates need for proactive validation`);
        }
        return patterns;
    }
    /**
     * Generate recommendations based on problems
     */
    generateRecommendations(problems, patterns) {
        const recommendations = [];
        // Check if MCP tool creation is needed
        const needNewTools = problems.filter(p => p.mcpImprovement?.toolNeeded);
        if (needNewTools.length > 0) {
            const toolNames = needNewTools
                .map(p => p.mcpImprovement?.toolNeeded)
                .filter(Boolean);
            recommendations.push(`Create new MCP tools: ${[...new Set(toolNames)].join(', ')}`);
        }
        // Check if existing tools need enhancement
        const needEnhancement = problems.filter(p => p.mcpImprovement?.enhancementNeeded);
        if (needEnhancement.length > 0) {
            recommendations.push(`Enhance existing tools: ${needEnhancement.length} tools need improvements`);
        }
        // Workflow recommendations
        if (patterns.some(p => p.includes('not using available MCP tools'))) {
            recommendations.push('CRITICAL: LLM training needed - emphasize using MCP tools FIRST before manual attempts');
            recommendations.push('Add workflow guidance: Validate → Generate → Test pattern');
        }
        // Documentation recommendations
        const docNeeded = problems.filter(p => p.solution.preventionStrategy.toLowerCase().includes('documentation'));
        if (docNeeded.length > 0) {
            recommendations.push(`Update documentation: ${docNeeded.length} problems could be prevented with better docs`);
        }
        return recommendations;
    }
    /**
     * Find common substrings in error messages
     */
    findCommonSubstrings(strings) {
        if (strings.length < 2)
            return [];
        const commonParts = new Set();
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
    exportAsMarkdown(report) {
        const lines = [];
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
    clear() {
        this.problems.clear();
        this.sessionId = this.generateSessionId();
    }
    /**
     * Get session file path
     */
    getSessionFilePath() {
        const os = require('os');
        const path = require('path');
        const homeDir = os.homedir();
        const sessionDir = path.join(homeDir, '.qb64pe-mcp', 'session-problems');
        return path.join(sessionDir, `${this.sessionId}.json`);
    }
    /**
     * Persist session problems to disk immediately
     */
    persistToFile() {
        const fs = require('fs');
        const path = require('path');
        try {
            const filePath = this.getSessionFilePath();
            const dirPath = path.dirname(filePath);
            // Ensure directory exists
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            // Generate report data
            const report = this.generateReport();
            // Convert to JSON with proper formatting
            const jsonData = {
                sessionDate: new Date().toISOString().split('T')[0],
                sessionId: this.sessionId,
                totalProblems: report.totalProblems,
                problems: report.problems.map(p => ({
                    id: p.id,
                    timestamp: p.timestamp.toISOString(),
                    title: p.title,
                    severity: p.severity,
                    category: p.category,
                    description: typeof p.description === 'string' ? p.description : '',
                    context: p.context,
                    problem: p.problem,
                    solution: p.solution,
                    mcpImprovement: p.mcpImprovement,
                    metrics: p.metrics
                })),
                statistics: {
                    bySeverity: report.bySeverity,
                    byCategory: report.byCategory
                },
                patterns: report.patterns,
                recommendations: report.recommendations
            };
            // Write to file atomically
            const tempPath = filePath + '.tmp';
            fs.writeFileSync(tempPath, JSON.stringify(jsonData, null, 2), 'utf-8');
            fs.renameSync(tempPath, filePath);
            console.error(`[Session Problems] Persisted ${report.totalProblems} problem(s) to: ${filePath}`);
        }
        catch (error) {
            console.error(`[Session Problems] Failed to persist to disk: ${error}`);
            // Don't throw - logging failure shouldn't break the tool
        }
    }
    /**
     * Get statistics
     */
    getStatistics() {
        const problems = this.getProblems();
        return {
            total: problems.length,
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
            avgAttemptsBeforeSolution: problems.reduce((sum, p) => sum + (p.metrics?.attemptsBeforeSolution || 0), 0) /
                problems.filter(p => p.metrics?.attemptsBeforeSolution).length || 0,
            toolsNotUsedCount: problems.filter(p => p.metrics?.toolsShouldHaveUsed && p.metrics.toolsShouldHaveUsed.length > 0).length,
        };
    }
}
exports.SessionProblemsService = SessionProblemsService;
//# sourceMappingURL=session-problems-service.js.map