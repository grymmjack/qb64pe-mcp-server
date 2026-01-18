# analyze_qbasic_compatibility

**Category**: Compatibility Analysis  
**Description**: Analyze QBasic source code to identify potential compatibility issues before porting to QB64PE  
**Type**: Analysis & Validation Tool  

## Overview

The `analyze_qbasic_compatibility` tool performs comprehensive analysis of QBasic source code to identify compatibility issues, dialect-specific problems, and optimization opportunities before conversion to QB64PE. This tool is essential for planning migration strategies, estimating conversion effort, and identifying potential challenges.

The tool examines source code structure, identifies deprecated features, analyzes complexity metrics, and provides detailed reports with specific recommendations for successful porting. It supports multiple BASIC dialects and provides targeted analysis for each dialect's unique characteristics.

## Purpose

This tool serves multiple compatibility analysis functions:

- **Issue Detection**: Identify compatibility problems before conversion
- **Complexity Assessment**: Evaluate conversion difficulty and effort
- **Dialect Analysis**: Provide dialect-specific compatibility insights
- **Planning Support**: Generate conversion roadmaps and strategies
- **Risk Assessment**: Identify high-risk conversion areas

## Parameters

### Required Parameters

**sourceCode** (string)  
QBasic source code to analyze for compatibility issues. Can include:
- Complete program files
- Code modules or libraries
- Partial code snippets
- Legacy BASIC code from various sources

### Optional Parameters

**sourceDialect** (string, enum: ["qbasic", "gwbasic", "quickbasic", "vb-dos", "applesoft", "commodore", "amiga", "atari", "vb6", "vbnet", "vbscript", "freebasic"], default: "qbasic")  
Source BASIC dialect for targeted analysis. Each dialect has specific:
- Known compatibility issues
- Deprecated features
- Syntax variations
- Migration patterns

## Response Structure

The tool returns comprehensive compatibility analysis:

```json
{
  "analysisSuccessful": true,
  "sourceDialect": "qbasic",
  "targetDialect": "qb64pe",
  "codeMetrics": {
    "totalLines": 245,
    "codeLines": 198,
    "commentLines": 35,
    "emptyLines": 12,
    "complexityScore": 7.5,
    "maintainabilityIndex": 68.2,
    "cyclomaticComplexity": 15
  },
  "compatibilityScore": 78,
  "riskLevel": "medium",
  "compatibilityIssues": [
    {
      "category": "graphics_compatibility",
      "severity": "high",
      "issue": "Legacy SCREEN mode usage",
      "description": "SCREEN 13 requires conversion to modern graphics",
      "location": {
        "lineNumber": 45,
        "codeSnippet": "SCREEN 13: CLS"
      },
      "impact": "Visual output may differ",
      "resolution": "Convert to SCREEN _NEWIMAGE(320, 200, 256)",
      "automationLevel": "automatic",
      "estimatedEffort": "low"
    },
    {
      "category": "string_handling",
      "severity": "medium",
      "issue": "String concatenation optimization",
      "description": "Multiple string operations can be optimized",
      "location": {
        "lineNumber": 78,
        "codeSnippet": "result$ = a$ + b$ + c$"
      },
      "impact": "Performance improvement opportunity",
      "resolution": "Use modern string handling or StringBuilder pattern",
      "automationLevel": "semi-automatic",
      "estimatedEffort": "medium"
    },
    {
      "category": "function_conversion",
      "severity": "high",
      "issue": "DEF FN usage",
      "description": "User-defined functions need conversion",
      "location": {
        "lineNumber": 156,
        "codeSnippet": "DEF FNDouble(x) = x * 2"
      },
      "impact": "Functional compatibility",
      "resolution": "Convert to FUNCTION/SUB procedures",
      "automationLevel": "automatic",
      "estimatedEffort": "medium"
    }
  ],
  "dialectSpecificIssues": [
    {
      "dialect": "qbasic",
      "issue": "Line number dependencies",
      "description": "Code uses line numbers for flow control",
      "occurrences": 8,
      "modernAlternative": "Structured programming with SUB/FUNCTION",
      "conversionComplexity": "medium"
    }
  ],
  "featureUsage": {
    "graphics": {
      "used": true,
      "commands": ["SCREEN", "PSET", "LINE", "CIRCLE"],
      "compatibility": "requires_conversion",
      "modernEquivalents": ["_NEWIMAGE", "_PUTPIXEL", "_LINE", "_CIRCLE"]
    },
    "sound": {
      "used": true,
      "commands": ["SOUND", "PLAY"],
      "compatibility": "mostly_compatible",
      "notes": "QB64PE provides enhanced sound capabilities"
    },
    "fileIO": {
      "used": true,
      "commands": ["OPEN", "INPUT", "PRINT"],
      "compatibility": "fully_compatible",
      "notes": "File I/O fully supported in QB64PE"
    },
    "userInput": {
      "used": true,
      "commands": ["INKEY$", "INPUT"],
      "compatibility": "fully_compatible",
      "notes": "Input handling unchanged"
    }
  },
  "optimizationOpportunities": [
    {
      "category": "performance",
      "description": "Variable type optimization",
      "benefit": "10-15% performance improvement",
      "implementation": "Add explicit type declarations"
    },
    {
      "category": "memory",
      "description": "String handling optimization",
      "benefit": "Reduced memory usage",
      "implementation": "Use modern string functions"
    },
    {
      "category": "graphics",
      "description": "Enhanced graphics capabilities",
      "benefit": "Better visual quality and performance",
      "implementation": "Upgrade to 32-bit graphics mode"
    }
  ],
  "migrationPlan": {
    "phase1": {
      "title": "Basic Compatibility",
      "tasks": ["Fix syntax issues", "Update graphics commands", "Convert functions"],
      "estimatedTime": "2-4 hours",
      "risk": "low"
    },
    "phase2": {
      "title": "Performance Optimization",
      "tasks": ["Optimize variables", "Enhance string handling", "Add error checking"],
      "estimatedTime": "3-5 hours",
      "risk": "medium"
    },
    "phase3": {
      "title": "Feature Enhancement",
      "tasks": ["Add modern features", "Improve user interface", "Enhance graphics"],
      "estimatedTime": "5-8 hours",
      "risk": "medium"
    }
  },
  "recommendations": [
    "Convert graphics commands to modern equivalents first",
    "Test each conversion phase before proceeding",
    "Consider performance optimizations for critical loops",
    "Add error handling for file operations",
    "Document changes for future maintenance"
  ],
  "estimatedConversionTime": "8-12 hours",
  "automationPotential": 65,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Usage Examples

### Basic Compatibility Analysis

Analyze simple QBasic code for compatibility issues:

```javascript
const qbasicCode = `
REM Simple QBasic Program
SCREEN 13
CLS
FOR I = 1 TO 100
  PSET (RND * 320, RND * 200), RND * 15 + 1
NEXT I
DEF FNSquare(X) = X * X
PRINT "Square of 5 is"; FNSquare(5)
SLEEP
END
`;

const analysis = await analyzeQbasicCompatibility({
  sourceCode: qbasicCode,
  sourceDialect: "qbasic"
});

console.log("Compatibility Analysis Results:");
console.log("Compatibility score:", analysis.compatibilityScore);
console.log("Risk level:", analysis.riskLevel);
console.log("Issues found:", analysis.compatibilityIssues.length);

console.log("\nKey compatibility issues:");
analysis.compatibilityIssues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue.issue} (${issue.severity})`);
  console.log(`   Line ${issue.location.lineNumber}: ${issue.location.codeSnippet}`);
  console.log(`   Resolution: ${issue.resolution}`);
  console.log(`   Effort: ${issue.estimatedEffort}`);
});

console.log("\nEstimated conversion time:", analysis.estimatedConversionTime);
console.log("Automation potential:", analysis.automationPotential + "%");
```

### GW-BASIC Legacy Analysis

Analyze older GW-BASIC code with line numbers:

```javascript
const gwbasicCode = `
10 REM GW-BASIC Legacy Program
20 SCREEN 2
30 FOR I = 1 TO 100
40   LINE (I, I)-(I+10, I+10), 1, B
50   IF I MOD 10 = 0 THEN GOSUB 100
60 NEXT I
70 GOTO 200
100 REM Subroutine
110 SOUND 440, 5
120 RETURN
200 END
`;

const analysis = await analyzeQbasicCompatibility({
  sourceCode: gwbasicCode,
  sourceDialect: "gwbasic"
});

console.log("GW-BASIC Legacy Analysis:");
console.log("Code complexity:", analysis.codeMetrics.complexityScore);
console.log("Compatibility score:", analysis.compatibilityScore);

console.log("\nDialect-specific issues:");
analysis.dialectSpecificIssues.forEach(issue => {
  console.log(`- ${issue.issue}: ${issue.description}`);
  console.log(`  Occurrences: ${issue.occurrences}`);
  console.log(`  Modern alternative: ${issue.modernAlternative}`);
  console.log(`  Complexity: ${issue.conversionComplexity}`);
});

console.log("\nMigration plan:");
Object.entries(analysis.migrationPlan).forEach(([phase, details]) => {
  console.log(`\n${details.title}:`);
  console.log(`  Tasks: ${details.tasks.join(', ')}`);
  console.log(`  Time: ${details.estimatedTime}`);
  console.log(`  Risk: ${details.risk}`);
});
```

### Complex Program Analysis

Analyze a complex program with multiple features:

```javascript
const complexCode = `
' Complex QBasic Application
DECLARE SUB DrawMenu ()
DECLARE SUB ProcessInput ()
DECLARE FUNCTION FileExists% (filename$)

TYPE UserRecord
  name AS STRING * 30
  age AS INTEGER
  score AS SINGLE
END TYPE

DIM users(100) AS UserRecord
DIM userCount AS INTEGER

SCREEN 12
CALL DrawMenu

DO
  CALL ProcessInput
LOOP UNTIL exitFlag%

SUB DrawMenu
  CLS
  LOCATE 1, 1
  PRINT "Application Menu"
  ' More menu code...
END SUB

SUB ProcessInput
  key$ = INKEY$
  ' Input processing...
END SUB

FUNCTION FileExists% (filename$)
  ' File checking logic...
END FUNCTION
`;

const analysis = await analyzeQbasicCompatibility({
  sourceCode: complexCode,
  sourceDialect: "qbasic"
});

console.log("Complex Program Analysis:");
console.log("Metrics:", analysis.codeMetrics);
console.log("Feature usage:");

Object.entries(analysis.featureUsage).forEach(([feature, details]) => {
  if (details.used) {
    console.log(`\n${feature.toUpperCase()}:`);
    console.log(`  Commands: ${details.commands.join(', ')}`);
    console.log(`  Compatibility: ${details.compatibility}`);
    
    if (details.modernEquivalents) {
      console.log(`  Modern equivalents: ${details.modernEquivalents.join(', ')}`);
    }
    
    if (details.notes) {
      console.log(`  Notes: ${details.notes}`);
    }
  }
});

console.log("\nOptimization opportunities:");
analysis.optimizationOpportunities.forEach(opt => {
  console.log(`- ${opt.description} (${opt.category})`);
  console.log(`  Benefit: ${opt.benefit}`);
  console.log(`  Implementation: ${opt.implementation}`);
});
```

### Batch Analysis

Analyze multiple files for project-wide compatibility:

```javascript
const projectFiles = [
  { name: "main.bas", content: "REM Main program\nSCREEN 13\nCALL Graphics", dialect: "qbasic" },
  { name: "graphics.bas", content: "SUB Graphics\nLINE (0,0)-(319,199),15,B\nEND SUB", dialect: "qbasic" },
  { name: "utils.bas", content: "DEF FNMax(a, b) = (a > b) * a + (b >= a) * b", dialect: "qbasic" }
];

const projectAnalysis = [];

for (const file of projectFiles) {
  const analysis = await analyzeQbasicCompatibility({
    sourceCode: file.content,
    sourceDialect: file.dialect
  });
  
  projectAnalysis.push({
    filename: file.name,
    analysis: analysis
  });
}

console.log("Project-Wide Compatibility Analysis:");

// Calculate project statistics
const projectStats = projectAnalysis.reduce((stats, file) => ({
  totalLines: stats.totalLines + file.analysis.codeMetrics.totalLines,
  totalIssues: stats.totalIssues + file.analysis.compatibilityIssues.length,
  avgCompatibility: stats.avgCompatibility + file.analysis.compatibilityScore,
  maxComplexity: Math.max(stats.maxComplexity, file.analysis.codeMetrics.complexityScore)
}), { totalLines: 0, totalIssues: 0, avgCompatibility: 0, maxComplexity: 0 });

projectStats.avgCompatibility = projectStats.avgCompatibility / projectAnalysis.length;

console.log("Project Statistics:");
console.log(`Total lines: ${projectStats.totalLines}`);
console.log(`Total issues: ${projectStats.totalIssues}`);
console.log(`Average compatibility: ${projectStats.avgCompatibility.toFixed(1)}%`);
console.log(`Max complexity: ${projectStats.maxComplexity}`);

// Show per-file analysis
console.log("\nPer-file analysis:");
projectAnalysis.forEach(file => {
  console.log(`\n${file.filename}:`);
  console.log(`  Compatibility: ${file.analysis.compatibilityScore}%`);
  console.log(`  Issues: ${file.analysis.compatibilityIssues.length}`);
  console.log(`  Risk: ${file.analysis.riskLevel}`);
  
  const highSeverityIssues = file.analysis.compatibilityIssues.filter(i => i.severity === 'high');
  if (highSeverityIssues.length > 0) {
    console.log(`  High-severity issues: ${highSeverityIssues.length}`);
  }
});

// Generate project recommendations
console.log("\nProject Recommendations:");
const allRecommendations = projectAnalysis.flatMap(f => f.analysis.recommendations);
const uniqueRecommendations = [...new Set(allRecommendations)];
uniqueRecommendations.forEach(rec => console.log(`- ${rec}`));
```

### Interactive Analysis

Perform interactive analysis with user feedback:

```javascript
const performInteractiveAnalysis = async (sourceCode) => {
  console.log("Starting interactive compatibility analysis...");
  
  const analysis = await analyzeQbasicCompatibility({
    sourceCode: sourceCode,
    sourceDialect: "qbasic"
  });
  
  console.log(`\nAnalysis complete! Compatibility score: ${analysis.compatibilityScore}%`);
  console.log(`Risk level: ${analysis.riskLevel}`);
  
  if (analysis.compatibilityIssues.length > 0) {
    console.log(`\nFound ${analysis.compatibilityIssues.length} compatibility issues:`);
    
    for (let i = 0; i < analysis.compatibilityIssues.length; i++) {
      const issue = analysis.compatibilityIssues[i];
      console.log(`\nIssue ${i + 1}: ${issue.issue} (${issue.severity})`);
      console.log(`Description: ${issue.description}`);
      console.log(`Location: Line ${issue.location.lineNumber}`);
      console.log(`Code: ${issue.location.codeSnippet}`);
      console.log(`Resolution: ${issue.resolution}`);
      console.log(`Effort: ${issue.estimatedEffort}`);
      
      // Simulate user interaction
      const userResponse = await askUser(`Would you like to see more details about this issue? (y/n)`);
      if (userResponse.toLowerCase() === 'y') {
        console.log(`Impact: ${issue.impact}`);
        console.log(`Automation level: ${issue.automationLevel}`);
      }
    }
  }
  
  // Show optimization opportunities
  if (analysis.optimizationOpportunities.length > 0) {
    console.log(`\nOptimization opportunities (${analysis.optimizationOpportunities.length}):`);
    analysis.optimizationOpportunities.forEach((opt, index) => {
      console.log(`${index + 1}. ${opt.description}`);
      console.log(`   Benefit: ${opt.benefit}`);
    });
  }
  
  // Show migration plan
  console.log("\nSuggested migration plan:");
  Object.entries(analysis.migrationPlan).forEach(([phase, details]) => {
    console.log(`\n${details.title}:`);
    console.log(`  Estimated time: ${details.estimatedTime}`);
    console.log(`  Risk level: ${details.risk}`);
    details.tasks.forEach(task => console.log(`  - ${task}`));
  });
  
  return analysis;
};

// Helper function for user interaction (pseudo-code)
const askUser = async (question) => {
  // Implementation would depend on environment
  console.log(question);
  return "y"; // Simulate user response
};
```

## Integration Workflows

### Development Environment Integration

```javascript
class CompatibilityAnalyzer {
  constructor() {
    this.analysisCache = new Map();
    this.projectMetrics = new Map();
  }
  
  async analyzeProject(projectPath) {
    const basicFiles = await this.findBasicFiles(projectPath);
    const analyses = [];
    
    for (const file of basicFiles) {
      const content = await this.readFile(file.path);
      
      // Check cache first
      const cacheKey = this.generateCacheKey(content);
      let analysis = this.analysisCache.get(cacheKey);
      
      if (!analysis) {
        analysis = await analyzeQbasicCompatibility({
          sourceCode: content,
          sourceDialect: this.detectDialect(content, file.path)
        });
        
        this.analysisCache.set(cacheKey, analysis);
      }
      
      analyses.push({
        filename: file.name,
        relativePath: file.relativePath,
        analysis: analysis
      });
    }
    
    const projectSummary = this.generateProjectSummary(analyses);
    this.projectMetrics.set(projectPath, projectSummary);
    
    return {
      projectPath: projectPath,
      files: analyses,
      summary: projectSummary,
      recommendations: this.generateProjectRecommendations(analyses)
    };
  }
  
  generateProjectSummary(analyses) {
    const summary = {
      totalFiles: analyses.length,
      totalLines: 0,
      totalIssues: 0,
      averageCompatibility: 0,
      riskDistribution: { low: 0, medium: 0, high: 0 },
      commonIssues: new Map(),
      estimatedEffort: 0
    };
    
    analyses.forEach(({ analysis }) => {
      summary.totalLines += analysis.codeMetrics.totalLines;
      summary.totalIssues += analysis.compatibilityIssues.length;
      summary.averageCompatibility += analysis.compatibilityScore;
      summary.riskDistribution[analysis.riskLevel]++;
      
      // Track common issues
      analysis.compatibilityIssues.forEach(issue => {
        const count = summary.commonIssues.get(issue.category) || 0;
        summary.commonIssues.set(issue.category, count + 1);
      });
      
      // Estimate effort (parse time strings like "2-4 hours")
      const timeString = analysis.estimatedConversionTime;
      const hours = this.parseTimeEstimate(timeString);
      summary.estimatedEffort += hours;
    });
    
    summary.averageCompatibility = summary.averageCompatibility / analyses.length;
    
    return summary;
  }
  
  generateProjectRecommendations(analyses) {
    const recommendations = [];
    
    // Check for common patterns
    const hasGraphics = analyses.some(a => a.analysis.featureUsage.graphics?.used);
    const hasComplexStructures = analyses.some(a => a.analysis.codeMetrics.complexityScore > 8);
    const hasHighRiskFiles = analyses.some(a => a.analysis.riskLevel === 'high');
    
    if (hasGraphics) {
      recommendations.push({
        priority: 'high',
        category: 'graphics',
        description: 'Project uses graphics - prioritize graphics conversion testing',
        action: 'Create graphics test suite before conversion'
      });
    }
    
    if (hasComplexStructures) {
      recommendations.push({
        priority: 'medium',
        category: 'complexity',
        description: 'Complex code structures detected',
        action: 'Consider incremental conversion approach'
      });
    }
    
    if (hasHighRiskFiles) {
      recommendations.push({
        priority: 'high',
        category: 'risk',
        description: 'High-risk files require careful planning',
        action: 'Convert high-risk files manually or with extra validation'
      });
    }
    
    return recommendations;
  }
}
```

### Continuous Integration Integration

```javascript
class CICompatibilityChecker {
  async checkCompatibility(commitSha, changedFiles) {
    const basicFiles = changedFiles.filter(f => f.endsWith('.bas') || f.endsWith('.qbs'));
    
    if (basicFiles.length === 0) {
      return { status: 'skipped', reason: 'No BASIC files changed' };
    }
    
    const results = [];
    let overallStatus = 'pass';
    
    for (const file of basicFiles) {
      const content = await this.getFileContent(commitSha, file);
      
      const analysis = await analyzeQbasicCompatibility({
        sourceCode: content,
        sourceDialect: this.inferDialect(file)
      });
      
      const fileResult = {
        filename: file,
        compatibilityScore: analysis.compatibilityScore,
        riskLevel: analysis.riskLevel,
        issueCount: analysis.compatibilityIssues.length,
        highSeverityIssues: analysis.compatibilityIssues.filter(i => i.severity === 'high').length
      };
      
      // Determine file status
      if (analysis.compatibilityScore < 50 || analysis.riskLevel === 'high') {
        fileResult.status = 'fail';
        overallStatus = 'fail';
      } else if (analysis.compatibilityScore < 80 || analysis.riskLevel === 'medium') {
        fileResult.status = 'warning';
        if (overallStatus === 'pass') overallStatus = 'warning';
      } else {
        fileResult.status = 'pass';
      }
      
      results.push(fileResult);
    }
    
    return {
      status: overallStatus,
      commitSha: commitSha,
      filesAnalyzed: basicFiles.length,
      results: results,
      summary: this.generateCISummary(results),
      recommendations: this.generateCIRecommendations(results)
    };
  }
  
  generateCISummary(results) {
    return {
      totalFiles: results.length,
      passedFiles: results.filter(r => r.status === 'pass').length,
      warningFiles: results.filter(r => r.status === 'warning').length,
      failedFiles: results.filter(r => r.status === 'fail').length,
      averageCompatibility: results.reduce((sum, r) => sum + r.compatibilityScore, 0) / results.length,
      totalIssues: results.reduce((sum, r) => sum + r.issueCount, 0),
      criticalIssues: results.reduce((sum, r) => sum + r.highSeverityIssues, 0)
    };
  }
  
  generateCIRecommendations(results) {
    const recommendations = [];
    
    const failedFiles = results.filter(r => r.status === 'fail');
    if (failedFiles.length > 0) {
      recommendations.push({
        priority: 'critical',
        message: `${failedFiles.length} files have critical compatibility issues`,
        files: failedFiles.map(f => f.filename),
        action: 'Review and fix compatibility issues before merging'
      });
    }
    
    const warningFiles = results.filter(r => r.status === 'warning');
    if (warningFiles.length > 0) {
      recommendations.push({
        priority: 'medium',
        message: `${warningFiles.length} files have compatibility warnings`,
        files: warningFiles.map(f => f.filename),
        action: 'Consider addressing warnings for better compatibility'
      });
    }
    
    return recommendations;
  }
}
```

### Educational Platform Integration

```javascript
class EducationalCompatibilityTutor {
  constructor() {
    this.lessonPlans = new Map();
    this.studentProgress = new Map();
  }
  
  async createCompatibilityLesson(sourceCode, studentLevel) {
    const analysis = await analyzeQbasicCompatibility({
      sourceCode: sourceCode,
      sourceDialect: 'qbasic'
    });
    
    const lesson = {
      title: this.generateLessonTitle(analysis),
      difficulty: this.assessDifficulty(analysis, studentLevel),
      objectives: this.generateLearningObjectives(analysis),
      sections: this.createLessonSections(analysis),
      exercises: this.generateExercises(analysis),
      assessment: this.createAssessment(analysis)
    };
    
    return lesson;
  }
  
  generateLearningObjectives(analysis) {
    const objectives = [];
    
    if (analysis.featureUsage.graphics?.used) {
      objectives.push("Understand QBasic vs QB64PE graphics differences");
      objectives.push("Learn modern graphics command equivalents");
    }
    
    if (analysis.compatibilityIssues.some(i => i.category === 'function_conversion')) {
      objectives.push("Convert DEF FN to modern SUB/FUNCTION syntax");
    }
    
    if (analysis.codeMetrics.complexityScore > 6) {
      objectives.push("Identify and resolve complex compatibility issues");
    }
    
    objectives.push("Assess conversion effort and planning");
    objectives.push("Apply compatibility best practices");
    
    return objectives;
  }
  
  createLessonSections(analysis) {
    const sections = [];
    
    // Introduction section
    sections.push({
      title: "Introduction to Compatibility Analysis",
      content: this.generateIntroContent(analysis),
      duration: "10 minutes",
      type: "theory"
    });
    
    // Issue identification section
    sections.push({
      title: "Identifying Compatibility Issues",
      content: this.generateIssueContent(analysis),
      duration: "15 minutes",
      type: "analysis",
      interactiveElements: this.createIssueIdentificationExercises(analysis)
    });
    
    // Resolution strategies section
    sections.push({
      title: "Resolution Strategies",
      content: this.generateResolutionContent(analysis),
      duration: "20 minutes",
      type: "practical",
      codeExamples: this.extractCodeExamples(analysis)
    });
    
    // Migration planning section
    sections.push({
      title: "Migration Planning",
      content: this.generatePlanningContent(analysis),
      duration: "15 minutes",
      type: "planning",
      tools: ["Migration timeline", "Risk assessment", "Testing strategy"]
    });
    
    return sections;
  }
  
  async trackStudentProgress(studentId, lessonId, section, completionData) {
    const progress = this.studentProgress.get(studentId) || {};
    
    if (!progress[lessonId]) {
      progress[lessonId] = {
        startTime: new Date(),
        sectionsCompleted: [],
        exercisesCompleted: [],
        assessmentScores: [],
        currentSection: 0
      };
    }
    
    const lessonProgress = progress[lessonId];
    lessonProgress.sectionsCompleted.push({
      section: section,
      completedAt: new Date(),
      timeSpent: completionData.timeSpent,
      score: completionData.score
    });
    
    // Update current section
    lessonProgress.currentSection = section + 1;
    
    // Check for achievements
    const achievements = this.checkAchievements(lessonProgress, completionData);
    
    this.studentProgress.set(studentId, progress);
    
    return {
      progress: lessonProgress,
      achievements: achievements,
      nextSection: this.getNextSection(lessonId, section),
      recommendations: this.generateProgressRecommendations(lessonProgress)
    };
  }
}
```

## Error Handling

The tool provides comprehensive error handling for various analysis scenarios:

### Source Code Validation

```javascript
const validateAnalysisInput = (sourceCode, sourceDialect) => {
  if (!sourceCode || typeof sourceCode !== 'string') {
    throw new Error("Source code must be a non-empty string");
  }
  
  if (sourceCode.trim().length === 0) {
    throw new Error("Source code cannot be empty");
  }
  
  const validDialects = [
    'qbasic', 'gwbasic', 'quickbasic', 'vb-dos', 'applesoft', 
    'commodore', 'amiga', 'atari', 'vb6', 'vbnet', 'vbscript', 'freebasic'
  ];
  
  if (sourceDialect && !validDialects.includes(sourceDialect)) {
    console.warn(`Unknown dialect '${sourceDialect}', using 'qbasic' as default`);
    sourceDialect = 'qbasic';
  }
  
  return { sourceCode: sourceCode.trim(), sourceDialect: sourceDialect || 'qbasic' };
};
```

### Analysis Failures

```javascript
const handleAnalysisFailures = async (sourceCode, error) => {
  console.warn("Full analysis failed, attempting partial analysis");
  
  try {
    // Attempt basic metrics analysis
    const basicMetrics = analyzeBasicMetrics(sourceCode);
    
    return {
      analysisSuccessful: false,
      partialAnalysis: true,
      error: error.message,
      basicMetrics: basicMetrics,
      recommendedAction: "Manual review required - automated analysis failed",
      fallbackSuggestions: [
        "Check for syntax errors in source code",
        "Verify code is valid BASIC syntax",
        "Try analyzing smaller code sections",
        "Consider manual compatibility review"
      ]
    };
  } catch (fallbackError) {
    return {
      analysisSuccessful: false,
      partialAnalysis: false,
      error: error.message,
      fallbackError: fallbackError.message,
      recommendedAction: "Manual analysis required - automated analysis completely failed"
    };
  }
};
```

### Dialect-Specific Error Handling

```javascript
const handleDialectSpecificErrors = (sourceCode, dialect, error) => {
  const dialectIssues = {
    commodore: "PETSCII characters may cause parsing issues",
    applesoft: "Floating point format differences may affect analysis",
    vb6: "Object-oriented syntax not compatible with analysis",
    vbnet: "Modern .NET constructs not analyzable"
  };
  
  const knownIssue = dialectIssues[dialect];
  
  if (knownIssue) {
    return {
      analysisSuccessful: false,
      dialectIssue: knownIssue,
      error: error.message,
      suggestions: [
        `Convert ${dialect} specific features manually`,
        "Use generic BASIC syntax for analysis",
        "Consider partial code analysis",
        "Seek dialect-specific conversion tools"
      ]
    };
  }
  
  return null; // No known dialect issue
};
```

## Best Practices

### 1. Thorough Pre-Analysis

Always perform comprehensive analysis before conversion:

```javascript
// Good: Complete analysis before planning
const performComprehensiveAnalysis = async (sourceCode) => {
  const analysis = await analyzeQbasicCompatibility({
    sourceCode: sourceCode,
    sourceDialect: 'qbasic'
  });
  
  // Review all aspects
  console.log("Compatibility score:", analysis.compatibilityScore);
  console.log("Risk level:", analysis.riskLevel);
  console.log("Issues count:", analysis.compatibilityIssues.length);
  console.log("Optimization opportunities:", analysis.optimizationOpportunities.length);
  
  // Make informed decisions based on analysis
  return analysis;
};
```

### 2. Issue Prioritization

Prioritize issues by severity and impact:

```javascript
// Good: Systematic issue prioritization
const prioritizeIssues = (compatibilityIssues) => {
  const prioritized = {
    critical: compatibilityIssues.filter(i => i.severity === 'high' && i.impact.includes('functional')),
    high: compatibilityIssues.filter(i => i.severity === 'high'),
    medium: compatibilityIssues.filter(i => i.severity === 'medium'),
    low: compatibilityIssues.filter(i => i.severity === 'low')
  };
  
  console.log("Issue prioritization:");
  Object.entries(prioritized).forEach(([priority, issues]) => {
    console.log(`${priority}: ${issues.length} issues`);
  });
  
  return prioritized;
};
```

### 3. Batch Analysis

Analyze multiple files systematically:

```javascript
// Good: Organized batch analysis
const analyzeBatch = async (files) => {
  const results = [];
  
  for (const file of files) {
    try {
      const analysis = await analyzeQbasicCompatibility({
        sourceCode: file.content,
        sourceDialect: file.dialect || 'qbasic'
      });
      
      results.push({
        filename: file.name,
        success: true,
        analysis: analysis
      });
    } catch (error) {
      results.push({
        filename: file.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return {
    totalFiles: files.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results
  };
};
```

### 4. Documentation and Planning

Document analysis results for planning:

```javascript
// Good: Comprehensive documentation
const documentAnalysis = (analysis, filename) => {
  return {
    file: filename,
    analysisDate: new Date(),
    compatibilityScore: analysis.compatibilityScore,
    riskLevel: analysis.riskLevel,
    criticalIssues: analysis.compatibilityIssues.filter(i => i.severity === 'high'),
    estimatedEffort: analysis.estimatedConversionTime,
    migrationPlan: analysis.migrationPlan,
    recommendations: analysis.recommendations,
    automationPotential: analysis.automationPotential
  };
};
```

## Cross-References

- **[port_qbasic_to_qb64pe](./port_qbasic_to_qb64pe.md)** - Code porting tool
- **[validate_qb64pe_syntax](./validate_qb64pe_syntax.md)** - Syntax validation
- **[validate_qb64pe_compatibility](./validate_qb64pe_compatibility.md)** - Compatibility validation
- **[get_porting_dialect_info](./get_porting_dialect_info.md)** - Dialect information
- **[search_qb64pe_compatibility](./search_qb64pe_compatibility.md)** - Compatibility search
- **[get_qb64pe_best_practices](./get_qb64pe_best_practices.md)** - Best practices

## See Also

- [Compatibility Integration Guide](../docs/COMPATIBILITY_INTEGRATION.md)
- [Porting Implementation Summary](../PORTING_IMPLEMENTATION_SUMMARY.md)
- [QB64PE Best Practices](../docs/QB64PE_DEBUGGING_ENHANCEMENT_SYSTEM.md)
