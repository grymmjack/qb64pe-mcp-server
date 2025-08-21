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
    completeness: number; // 0-100%
    accuracy: number; // 0-100%
    recommendations: string[];
  };
  nextSteps: string[];
}

/**
 * Service for generating programming feedback based on screenshot analysis
 */
export class FeedbackService {
  private feedbackHistory: ProgrammingFeedback[] = [];

  /**
   * Generate programming feedback from screenshot analysis
   */
  generateFeedback(analysisResult: AnalysisResult, programCode?: string): ProgrammingFeedback {
    const suggestions = this.generateSuggestions(analysisResult, programCode);
    const assessment = this.assessOverallQuality(analysisResult, programCode);
    const nextSteps = this.generateNextSteps(analysisResult, suggestions);

    const feedback: ProgrammingFeedback = {
      timestamp: new Date(),
      screenshotPath: analysisResult.screenshotPath,
      analysisResult,
      suggestions,
      overallAssessment: assessment,
      nextSteps
    };

    this.feedbackHistory.push(feedback);
    return feedback;
  }

  /**
   * Generate specific programming suggestions
   */
  private generateSuggestions(analysisResult: AnalysisResult, programCode?: string): FeedbackSuggestion[] {
    const suggestions: FeedbackSuggestion[] = [];

    if (!analysisResult.success || !analysisResult.analysis) {
      suggestions.push({
        type: 'fix',
        priority: 'critical',
        category: 'graphics',
        title: 'Screenshot Analysis Failed',
        description: 'The screenshot could not be analyzed properly',
        reasoning: analysisResult.error || 'Unknown analysis error',
        expectedResult: 'Successful screenshot capture and analysis'
      });
      return suggestions;
    }

    const analysis = analysisResult.analysis;

    // Shape-related suggestions
    this.addShapeSuggestions(suggestions, analysis, programCode);
    
    // Color-related suggestions
    this.addColorSuggestions(suggestions, analysis, programCode);
    
    // Text-related suggestions
    this.addTextSuggestions(suggestions, analysis, programCode);
    
    // Quality-related suggestions
    this.addQualitySuggestions(suggestions, analysis, programCode);
    
    // Code structure suggestions
    if (programCode) {
      this.addCodeStructureSuggestions(suggestions, analysis, programCode);
    }

    return suggestions.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));
  }

  /**
   * Add shape-related suggestions
   */
  private addShapeSuggestions(suggestions: FeedbackSuggestion[], analysis: any, programCode?: string): void {
    if (analysis.shapes.length === 0) {
      suggestions.push({
        type: 'enhancement',
        priority: 'medium',
        category: 'graphics',
        title: 'No Shapes Detected',
        description: 'The screenshot contains no recognizable geometric shapes',
        reasoning: 'Graphics programs typically include shapes like circles, rectangles, or lines',
        expectedResult: 'Add some basic shapes to make the graphics more interesting',
        codeExample: `CIRCLE (400, 300), 50, _RGB32(255, 0, 0)
LINE (100, 100)-(700, 500), _RGB32(0, 255, 0)
LINE (200, 200)-(600, 400), _RGB32(0, 0, 255), BF`
      });
    } else if (analysis.shapes.length === 1) {
      suggestions.push({
        type: 'enhancement',
        priority: 'low',
        category: 'graphics',
        title: 'Limited Shape Variety',
        description: `Only one type of shape detected: ${analysis.shapes[0]}`,
        reasoning: 'Adding variety in shapes creates more visually appealing graphics',
        expectedResult: 'Include multiple types of shapes for visual interest',
        codeExample: `' Add different shapes for variety
CIRCLE (200, 200), 75, _RGB32(255, 0, 0)  ' Circle
LINE (400, 150)-(600, 250), _RGB32(0, 255, 0), BF  ' Rectangle
LINE (100, 400)-(500, 400), _RGB32(0, 0, 255)  ' Line`
      });
    }

    // Check for overlapping shapes
    if (analysis.shapes.length > 2) {
      suggestions.push({
        type: 'optimization',
        priority: 'low',
        category: 'graphics',
        title: 'Shape Composition',
        description: 'Multiple shapes detected - consider composition and layering',
        reasoning: 'Good composition makes graphics more professional',
        expectedResult: 'Well-organized shape layout with intentional positioning'
      });
    }
  }

  /**
   * Add color-related suggestions
   */
  private addColorSuggestions(suggestions: FeedbackSuggestion[], analysis: any, programCode?: string): void {
    if (analysis.colors.length === 0) {
      suggestions.push({
        type: 'enhancement',
        priority: 'medium',
        category: 'graphics',
        title: 'No Colors Detected',
        description: 'The screenshot appears monochromatic or uses default colors',
        reasoning: 'Colors add visual appeal and can convey information',
        expectedResult: 'Use _RGB32() to add custom colors to your graphics',
        codeExample: `Dim red, blue, green
red = _RGB32(255, 0, 0)
blue = _RGB32(0, 0, 255)
green = _RGB32(0, 255, 0)
CIRCLE (300, 200), 50, red`
      });
    } else if (analysis.colors.length === 1) {
      suggestions.push({
        type: 'enhancement',
        priority: 'low',
        category: 'graphics',
        title: 'Limited Color Palette',
        description: `Only one color detected: ${analysis.colors[0]}`,
        reasoning: 'Color variety creates more engaging visuals',
        expectedResult: 'Expand color palette for more visual interest',
        codeExample: `' Create a color palette
Dim colors(5)
colors(0) = _RGB32(255, 0, 0)    ' Red
colors(1) = _RGB32(0, 255, 0)    ' Green
colors(2) = _RGB32(0, 0, 255)    ' Blue
colors(3) = _RGB32(255, 255, 0)  ' Yellow
colors(4) = _RGB32(255, 0, 255)  ' Magenta`
      });
    }

    // Suggest complementary colors
    if (analysis.colors.length >= 2) {
      suggestions.push({
        type: 'optimization',
        priority: 'low',
        category: 'graphics',
        title: 'Color Harmony',
        description: 'Consider color theory for better visual harmony',
        reasoning: 'Complementary colors create pleasing visual combinations',
        expectedResult: 'More aesthetically pleasing color combinations'
      });
    }
  }

  /**
   * Add text-related suggestions
   */
  private addTextSuggestions(suggestions: FeedbackSuggestion[], analysis: any, programCode?: string): void {
    if (analysis.textElements.length === 0) {
      suggestions.push({
        type: 'enhancement',
        priority: 'low',
        category: 'graphics',
        title: 'No Text Elements',
        description: 'No text was detected in the screenshot',
        reasoning: 'Text can provide context and information to graphics',
        expectedResult: 'Consider adding labels or titles to your graphics',
        codeExample: `_TITLE "My QB64PE Graphics Program"
_PRINTSTRING (300, 50), "Graphics Demo"
_PRINTSTRING (100, 500), "Press any key to continue"`
      });
    }

    // Check for text readability
    if (analysis.textElements.length > 0) {
      suggestions.push({
        type: 'optimization',
        priority: 'medium',
        category: 'graphics',
        title: 'Text Readability',
        description: 'Ensure text is clearly visible and well-positioned',
        reasoning: 'Good text placement and contrast improve readability',
        expectedResult: 'Clear, readable text that enhances the graphics'
      });
    }
  }

  /**
   * Add quality-related suggestions
   */
  private addQualitySuggestions(suggestions: FeedbackSuggestion[], analysis: any, programCode?: string): void {
    const qualityKeywords = ['artifact', 'distortion', 'blurry', 'pixelated', 'poor'];
    const hasQualityIssues = qualityKeywords.some(keyword => 
      analysis.quality.toLowerCase().includes(keyword)
    );

    if (hasQualityIssues) {
      suggestions.push({
        type: 'fix',
        priority: 'high',
        category: 'graphics',
        title: 'Graphics Quality Issues',
        description: 'The screenshot shows quality problems',
        reasoning: analysis.quality,
        expectedResult: 'Clean, crisp graphics without artifacts',
        codeExample: `' Ensure proper screen setup
SCREEN _NEWIMAGE(1024, 768, 32)
_SCREENMOVE _MIDDLE
_DELAY 0.1  ' Allow screen to stabilize`
      });
    }

    // Suggest screen size optimization
    suggestions.push({
      type: 'optimization',
      priority: 'low',
      category: 'performance',
      title: 'Screen Size Optimization',
      description: 'Consider optimal screen dimensions for your graphics',
      reasoning: 'Proper screen size ensures graphics display correctly',
      expectedResult: 'Graphics that fit well within the screen bounds',
      codeExample: `' Common screen sizes
SCREEN _NEWIMAGE(800, 600, 32)   ' 4:3 ratio
SCREEN _NEWIMAGE(1024, 768, 32)  ' Standard
SCREEN _NEWIMAGE(1280, 720, 32)  ' HD 16:9`
    });
  }

  /**
   * Add code structure suggestions
   */
  private addCodeStructureSuggestions(suggestions: FeedbackSuggestion[], analysis: any, programCode: string): void {
    // Check for modern QB64PE features
    if (!programCode.includes('$NOPREFIX')) {
      suggestions.push({
        type: 'improvement',
        priority: 'medium',
        category: 'code_structure',
        title: 'Use Modern QB64PE Features',
        description: 'Consider using $NOPREFIX for cleaner code',
        reasoning: '$NOPREFIX allows using QB64PE commands without underscores',
        expectedResult: 'Cleaner, more readable code',
        codeExample: `$NOPREFIX
Screen NewImage(800, 600, 32)
Circle (400, 300), 100, RGB32(255, 0, 0)`
      });
    }

    // Check for proper variable declarations
    if (!programCode.includes('DIM') && programCode.includes('=')) {
      suggestions.push({
        type: 'best_practices',
        priority: 'low',
        category: 'code_structure',
        title: 'Variable Declarations',
        description: 'Consider declaring variables explicitly',
        reasoning: 'Explicit variable declarations improve code clarity',
        expectedResult: 'More maintainable and clear code',
        codeExample: `Dim red, blue, green AS LONG
red = _RGB32(255, 0, 0)
blue = _RGB32(0, 0, 255)
green = _RGB32(0, 255, 0)`
      });
    }

    // Check for program structure
    if (!programCode.includes('SUB') && !programCode.includes('FUNCTION') && programCode.split('\n').length > 20) {
      suggestions.push({
        type: 'improvement',
        priority: 'medium',
        category: 'code_structure',
        title: 'Code Organization',
        description: 'Consider breaking large programs into functions/subroutines',
        reasoning: 'Modular code is easier to maintain and understand',
        expectedResult: 'Well-organized, modular code structure',
        codeExample: `SUB DrawShapes
    CIRCLE (200, 200), 50, _RGB32(255, 0, 0)
    LINE (300, 150)-(500, 250), _RGB32(0, 255, 0), BF
END SUB

CALL DrawShapes`
      });
    }
  }

  /**
   * Assess overall quality
   */
  private assessOverallQuality(analysisResult: AnalysisResult, programCode?: string): any {
    if (!analysisResult.success) {
      return {
        quality: 'poor',
        completeness: 0,
        accuracy: 0,
        recommendations: ['Fix screenshot capture and analysis issues']
      };
    }

    const analysis = analysisResult.analysis!;
    let qualityScore = 0;
    let completenessScore = 0;
    let accuracyScore = 0;

    // Quality assessment
    if (!analysis.quality.toLowerCase().includes('poor') && 
        !analysis.quality.toLowerCase().includes('artifact')) {
      qualityScore += 25;
    }
    if (analysis.shapes.length > 0) qualityScore += 25;
    if (analysis.colors.length > 1) qualityScore += 25;
    if (analysis.textElements.length > 0) qualityScore += 25;

    // Completeness assessment (based on expected vs actual elements)
    completenessScore = Math.min(100, (analysis.shapes.length * 30) + 
                                     (analysis.colors.length * 20) + 
                                     (analysis.textElements.length * 20) + 30);

    // Accuracy assessment (based on code-to-visual correlation)
    if (programCode) {
      const codeShapes = this.extractShapesFromCode(programCode);
      const codeColors = this.extractColorsFromCode(programCode);
      
      const shapeAccuracy = codeShapes.length > 0 ? 
        (analysis.shapes.filter((s: string) => codeShapes.includes(s)).length / codeShapes.length) * 100 : 100;
      const colorAccuracy = codeColors.length > 0 ? 
        (analysis.colors.filter((c: string) => codeColors.includes(c)).length / codeColors.length) * 100 : 100;
      
      accuracyScore = (shapeAccuracy + colorAccuracy) / 2;
    } else {
      accuracyScore = 75; // Default when no code to compare
    }

    let quality: 'poor' | 'fair' | 'good' | 'excellent';
    if (qualityScore >= 75) quality = 'excellent';
    else if (qualityScore >= 50) quality = 'good';
    else if (qualityScore >= 25) quality = 'fair';
    else quality = 'poor';

    return {
      quality,
      completeness: Math.round(completenessScore),
      accuracy: Math.round(accuracyScore),
      recommendations: this.generateQualityRecommendations(quality, completenessScore, accuracyScore)
    };
  }

  /**
   * Generate quality recommendations
   */
  private generateQualityRecommendations(quality: string, completeness: number, accuracy: number): string[] {
    const recommendations: string[] = [];

    if (quality === 'poor') {
      recommendations.push('Focus on basic graphics functionality first');
    }
    if (completeness < 50) {
      recommendations.push('Add more visual elements to make graphics more complete');
    }
    if (accuracy < 70) {
      recommendations.push('Ensure screenshot captures match the intended code output');
    }
    if (quality === 'excellent' && completeness > 80 && accuracy > 90) {
      recommendations.push('Excellent work! Consider adding advanced features or animations');
    }

    return recommendations;
  }

  /**
   * Generate next steps
   */
  private generateNextSteps(analysisResult: AnalysisResult, suggestions: FeedbackSuggestion[]): string[] {
    const nextSteps: string[] = [];

    // Prioritize critical and high priority suggestions
    const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
    const highSuggestions = suggestions.filter(s => s.priority === 'high');

    if (criticalSuggestions.length > 0) {
      nextSteps.push(`Address critical issue: ${criticalSuggestions[0].title}`);
    }

    if (highSuggestions.length > 0) {
      nextSteps.push(`Fix high priority issue: ${highSuggestions[0].title}`);
    }

    // Add general next steps
    if (analysisResult.success) {
      nextSteps.push('Continue developing graphics features');
      nextSteps.push('Test with different screen sizes and color combinations');
      nextSteps.push('Consider adding user interaction or animation');
    } else {
      nextSteps.push('Debug screenshot capture issues');
      nextSteps.push('Ensure QB64PE program compiles and runs correctly');
    }

    return nextSteps.slice(0, 5); // Limit to 5 steps
  }

  /**
   * Get priority weight for sorting
   */
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  /**
   * Extract shapes from QB64PE code (simplified version)
   */
  private extractShapesFromCode(code: string): string[] {
    const shapes: string[] = [];
    if (/\bCIRCLE\s*\(/i.test(code)) shapes.push('circle');
    if (/\bLINE\s*\([^)]*\)\s*,\s*\([^)]*\)\s*,.*,\s*B/i.test(code)) shapes.push('rectangle');
    if (/\bLINE\s*\(/i.test(code)) shapes.push('line');
    return shapes;
  }

  /**
   * Extract colors from QB64PE code (simplified version)
   */
  private extractColorsFromCode(code: string): string[] {
    const colors: string[] = [];
    if (/_RGB32\s*\(\s*255\s*,\s*0\s*,\s*0\s*\)|_RED/i.test(code)) colors.push('red');
    if (/_RGB32\s*\(\s*0\s*,\s*255\s*,\s*0\s*\)|_GREEN/i.test(code)) colors.push('green');
    if (/_RGB32\s*\(\s*0\s*,\s*0\s*,\s*255\s*\)|_BLUE/i.test(code)) colors.push('blue');
    return colors;
  }

  /**
   * Get feedback history
   */
  getFeedbackHistory(limit?: number): ProgrammingFeedback[] {
    const history = this.feedbackHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Clear feedback history
   */
  clearHistory(): void {
    this.feedbackHistory = [];
  }

  /**
   * Get feedback statistics
   */
  getStatistics(): any {
    const total = this.feedbackHistory.length;
    if (total === 0) return { total: 0 };

    const successful = this.feedbackHistory.filter(f => f.analysisResult.success).length;
    const qualityDistribution = this.feedbackHistory.reduce((acc, f) => {
      acc[f.overallAssessment.quality] = (acc[f.overallAssessment.quality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgCompleteness = this.feedbackHistory.reduce((sum, f) => 
      sum + f.overallAssessment.completeness, 0) / total;
    const avgAccuracy = this.feedbackHistory.reduce((sum, f) => 
      sum + f.overallAssessment.accuracy, 0) / total;

    return {
      total,
      successful,
      successRate: Math.round((successful / total) * 100),
      qualityDistribution,
      averageCompleteness: Math.round(avgCompleteness),
      averageAccuracy: Math.round(avgAccuracy)
    };
  }
}
