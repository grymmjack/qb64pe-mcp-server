import { AnalysisResult } from './screenshot-watcher-service.js';
export interface FeedbackSuggestion {
    type: 'improvement' | 'optimization' | 'fix' | 'enhancement' | 'best_practices';
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'graphics' | 'performance' | 'code_structure' | 'best_practices';
    title: string;
    description: string;
    codeExample?: string;
    reasoning: string;
    expectedResult: string;
}
export interface ProgrammingFeedback {
    timestamp: Date;
    screenshotPath: string;
    analysisResult: AnalysisResult;
    suggestions: FeedbackSuggestion[];
    overallAssessment: {
        quality: 'poor' | 'fair' | 'good' | 'excellent';
        completeness: number;
        accuracy: number;
        recommendations: string[];
    };
    nextSteps: string[];
}
/**
 * Service for generating programming feedback based on screenshot analysis
 */
export declare class FeedbackService {
    private feedbackHistory;
    /**
     * Generate programming feedback from screenshot analysis
     */
    generateFeedback(analysisResult: AnalysisResult, programCode?: string): ProgrammingFeedback;
    /**
     * Generate specific programming suggestions
     */
    private generateSuggestions;
    /**
     * Add shape-related suggestions
     */
    private addShapeSuggestions;
    /**
     * Add color-related suggestions
     */
    private addColorSuggestions;
    /**
     * Add text-related suggestions
     */
    private addTextSuggestions;
    /**
     * Add quality-related suggestions
     */
    private addQualitySuggestions;
    /**
     * Add code structure suggestions
     */
    private addCodeStructureSuggestions;
    /**
     * Assess overall quality
     */
    private assessOverallQuality;
    /**
     * Generate quality recommendations
     */
    private generateQualityRecommendations;
    /**
     * Generate next steps
     */
    private generateNextSteps;
    /**
     * Get priority weight for sorting
     */
    private getPriorityWeight;
    /**
     * Extract shapes from QB64PE code (simplified version)
     */
    private extractShapesFromCode;
    /**
     * Extract colors from QB64PE code (simplified version)
     */
    private extractColorsFromCode;
    /**
     * Get feedback history
     */
    getFeedbackHistory(limit?: number): ProgrammingFeedback[];
    /**
     * Clear feedback history
     */
    clearHistory(): void;
    /**
     * Get feedback statistics
     */
    getStatistics(): any;
}
//# sourceMappingURL=feedback-service.d.ts.map