export interface QB64PEInstallation {
    isInstalled: boolean;
    installPath?: string;
    version?: string;
    inPath: boolean;
    executable?: string;
    platform: string;
}
export interface PathConfiguration {
    platform: string;
    currentPath: string[];
    pathSeparator: string;
    instructions: {
        temporary: string[];
        permanent: string[];
        verification: string[];
    };
    commonInstallPaths: string[];
    downloadUrl: string;
}
/**
 * Service for detecting QB64PE installation and providing PATH configuration guidance
 */
export declare class QB64PEInstallationService {
    private readonly platform;
    private readonly pathSeparator;
    private readonly executableName;
    constructor();
    /**
     * Detect QB64PE installation and PATH configuration
     */
    detectInstallation(): Promise<QB64PEInstallation>;
    /**
     * Check if QB64PE is available in PATH
     */
    private checkInPath;
    /**
     * Search common installation paths for QB64PE
     */
    private searchCommonPaths;
    /**
     * Get QB64PE version information
     */
    private getVersion;
    /**
     * Get common installation paths for current platform
     */
    getCommonInstallPaths(): string[];
    /**
     * Generate PATH configuration guidance for current platform
     */
    getPathConfiguration(installPath?: string): PathConfiguration;
    /**
     * Get current PATH environment variable
     */
    private getCurrentPath;
    /**
     * Generate Windows PATH configuration instructions
     */
    private getWindowsPathInstructions;
    /**
     * Generate macOS PATH configuration instructions
     */
    private getMacOSPathInstructions;
    /**
     * Generate Linux PATH configuration instructions
     */
    private getLinuxPathInstructions;
    /**
     * Generate generic PATH configuration instructions
     */
    private getGenericPathInstructions;
    /**
     * Generate installation guidance message for LLMs
     */
    generateInstallationGuidance(installation: QB64PEInstallation): string;
    /**
     * Get package manager installation instructions
     */
    private getPackageManagerInstructions;
    /**
     * Check if a given path contains QB64PE
     */
    validatePath(testPath: string): Promise<{
        valid: boolean;
        executable?: string;
        version?: string;
    }>;
    /**
     * Generate a complete installation report
     */
    generateInstallationReport(): Promise<string>;
}
//# sourceMappingURL=installation-service.d.ts.map