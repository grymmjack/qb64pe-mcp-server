/**
 * Session Problems Logging Service
 * Tracks development problems during chat sessions for continuous improvement
 */
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
export declare class SessionProblemsService {
    private problems;
    private sessionId;
    private storageDir;
    private currentSessionFile;
    constructor();
    /**
     * Initialize storage directory and load existing session
     */
    private initializeStorage;
    /**
     * Save current session to disk
     */
    private saveToFile;
    /**
     * Generate unique session ID
     */
    private generateSessionId;
    /**
     * Log a new problem
     */
    logProblem(problem: Omit<SessionProblem, 'id' | 'timestamp' | 'status'>): SessionProblem;
    /**
     * Get all problems for current session
     */
    getProblems(): SessionProblem[];
    /**
     * Get problems by category
     */
    getProblemsByCategory(category: SessionProblem['category']): SessionProblem[];
    /**
     * Get problems by severity
     */
    getProblemsBySeverity(severity: SessionProblem['severity']): SessionProblem[];
    /**
     * Update problem status
     */
    updateProblemStatus(problemId: string, status: SessionProblem['status'], handledBy?: string, notes?: string): SessionProblem | null;
    /**
     * Get problems by status
     */
    getProblemsByStatus(status: SessionProblem['status']): SessionProblem[];
    /**
     * Get unhandled problems (new + acknowledged + in-progress)
     */
    getUnhandledProblems(): SessionProblem[];
    /**
     * Get actionable problems for MCP improvement (high priority unhandled)
     */
    getActionableProblems(): SessionProblem[];
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
     * Get storage location
     */
    getStorageLocation(): string;
    /**
     * List all saved session files
     */
    listSessions(): Promise<string[]>;
    /**
     * Get statistics
     */
    getStatistics(): {
        total: number;
        byStatus: {
            new: number;
            acknowledged: number;
            inProgress: number;
            handled: number;
            wontFix: number;
        };
        unhandled: number;
        actionable: number;
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