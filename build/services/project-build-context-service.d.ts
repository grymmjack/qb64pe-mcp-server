/**
 * Project Build Context Service
 *
 * Stores and retrieves project-specific build configurations to prevent
 * loss of critical build information across conversation summaries.
 *
 * Addresses session problem: "Conversation summarization loses critical build command details"
 */
export interface ProjectBuildContext {
    projectPath: string;
    projectHash: string;
    lastUsedCommand: {
        qb64pePath?: string;
        compilerFlags: string[];
        outputName?: string;
        sourceFilePath: string;
        fullCommand: string;
    };
    lastSuccessfulBuild?: {
        timestamp: Date;
        executablePath: string;
        command: string;
    };
    buildHistory: Array<{
        timestamp: Date;
        command: string;
        flags: string[];
        success: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProjectBuildContextService {
    private contextsDir;
    private contexts;
    constructor();
    /**
     * Initialize storage directory
     */
    private initializeStorage;
    /**
     * Generate unique hash for project based on directory
     */
    private generateProjectHash;
    /**
     * Get context file path for project
     */
    private getContextFilePath;
    /**
     * Load context for a project
     */
    loadContext(sourceFilePath: string): Promise<ProjectBuildContext | null>;
    /**
     * Get context for a project (alias for loadContext)
     */
    getContext(sourceFilePath: string): Promise<ProjectBuildContext | null>;
    /**
     * Save or update build context for a project
     */
    saveContext(sourceFilePath: string, qb64pePath: string | undefined, compilerFlags: string[], outputName: string | undefined, success: boolean, executablePath?: string): Promise<ProjectBuildContext>;
    /**
     * Build command string for display
     */
    private buildCommandString;
    /**
     * Persist context to disk
     */
    private persistContext;
    /**
     * Check if current parameters differ from last used
     */
    checkParameterDiff(sourceFilePath: string, currentFlags: string[], currentOutputName?: string): Promise<{
        differs: boolean;
        previousFlags?: string[];
        previousOutputName?: string;
        previousCommand?: string;
        suggestion?: string;
    }>;
    /**
     * Get build statistics for a project
     */
    getProjectStatistics(sourceFilePath: string): Promise<{
        totalBuilds: number;
        successfulBuilds: number;
        failedBuilds: number;
        successRate: number;
        lastBuildDate?: Date;
        mostUsedFlags: string[];
    } | null>;
    /**
     * List all projects with build contexts
     */
    listProjects(): Promise<Array<{
        projectPath: string;
        projectHash: string;
        lastBuildDate: Date;
        totalBuilds: number;
    }>>;
    /**
     * Clear context for a specific project
     */
    clearContext(sourceFilePath: string): Promise<boolean>;
    /**
     * Get storage directory path
     */
    getStorageDir(): string;
}
//# sourceMappingURL=project-build-context-service.d.ts.map