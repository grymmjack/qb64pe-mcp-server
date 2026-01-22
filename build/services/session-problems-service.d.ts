/**
 * Session Problems Logging Service
 * Tracks development problems during chat sessions for continuous improvement
 */
export interface SessionProblem {
    id: string;
    timestamp: Date;
    category: "syntax" | "compatibility" | "workflow" | "tooling" | "architecture" | "other";
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
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
        priority: "high" | "medium" | "low";
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
export declare class SessionProblemsService {
    private problems;
    private sessionId;
    constructor();
    /**
     * Generate unique session ID
     */
    private generateSessionId;
    /**
     * Log a new problem and immediately persist to disk
     */
    logProblem(problem: Omit<SessionProblem, "id" | "timestamp">): SessionProblem;
    /**
     * Get all problems for current session
     */
    getProblems(): SessionProblem[];
    /**
     * Get problems by category
     */
    getProblemsByCategory(category: SessionProblem["category"]): SessionProblem[];
    /**
     * Get problems by severity
     */
    getProblemsBySeverity(severity: SessionProblem["severity"]): SessionProblem[];
    /**
     * Generate comprehensive report
     */
    generateReport(): SessionProblemsReport;
    /**
     * Identify common patterns in problems
     */
    private identifyPatterns;
    /**
     * Generate recommendations based on problems
     */
    private generateRecommendations;
    /**
     * Find common substrings in error messages
     */
    private findCommonSubstrings;
    /**
     * Export report as markdown
     */
    exportAsMarkdown(report: SessionProblemsReport): string;
    /**
     * Clear all problems (start new session)
     */
    clear(): void;
    /**
     * Get session file path
     */
    private getSessionFilePath;
    /**
     * Persist session problems to disk immediately
     */
    private persistToFile;
    /**
     * Get statistics
     */
    getStatistics(): {
        total: number;
        bySeverity: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        byCategory: {
            syntax: number;
            compatibility: number;
            workflow: number;
            tooling: number;
            architecture: number;
            other: number;
        };
        avgAttemptsBeforeSolution: number;
        toolsNotUsedCount: number;
    };
}
//# sourceMappingURL=session-problems-service.d.ts.map