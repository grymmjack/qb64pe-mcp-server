# get_programming_feedback_history

Gets history of programming feedback generated from screenshot analyses.

## Description

This tool retrieves the historical record of programming feedback generated from screenshot analyses, including detailed feedback entries, statistics, and insights. It's useful for tracking learning progress, identifying improvement patterns, and reviewing past suggestions.

## Parameters

- **limit** (optional): Maximum number of feedback entries to return (default: 10)

## Usage

### Get Recent Feedback History
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history();
```

### Get Limited Number of Entries
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 5
});
```

### Get Extensive History
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 50
});
```

## Response Format

```typescript
{
  history: FeedbackEntry[],
  statistics: {
    total: number,
    successful: number,
    successRate: number,
    qualityDistribution: object,
    averageCompleteness: number,
    averageAccuracy: number
  },
  insights: {
    totalFeedback: number,
    successRate: string,
    mostCommonQuality: string,
    averageCompleteness: string,
    averageAccuracy: string
  }
}
```

## Feedback Entry Structure

Each feedback entry contains:

```typescript
{
  timestamp: string,                    // When feedback was generated
  screenshotPath: string,              // Path to analyzed screenshot
  analysisResult: {                    // Screenshot analysis details
    screenshotPath: string,
    analysisType: string,
    timestamp: string,
    success: boolean,
    analysis: object
  },
  suggestions: SuggestionObject[],     // Improvement suggestions
  overallAssessment: {                 // Quality assessment
    quality: string,
    completeness: number,
    accuracy: number,
    recommendations: string[]
  },
  nextSteps: string[]                  // Recommended next actions
}
```

## Statistics Overview

### Basic Metrics
```typescript
statistics: {
  total: 1,                    // Total feedback entries
  successful: 1,               // Successfully processed analyses
  successRate: 100             // Percentage of successful analyses
}
```

### Quality Distribution
```typescript
qualityDistribution: {
  excellent: 1,                // Number of excellent quality ratings
  good: 0,                     // Number of good quality ratings
  fair: 0,                     // Number of fair quality ratings
  poor: 0                      // Number of poor quality ratings
}
```

### Performance Averages
```typescript
statistics: {
  averageCompleteness: 100,    // Average completeness score (0-100)
  averageAccuracy: 100         // Average accuracy score (0-100)
}
```

## Insights Analysis

### Summary Insights
```typescript
insights: {
  totalFeedback: 1,                    // Total feedback instances
  successRate: "100%",                 // Success rate as percentage
  mostCommonQuality: "excellent",      // Most frequent quality rating
  averageCompleteness: "100%",         // Average completeness as percentage
  averageAccuracy: "100%"              // Average accuracy as percentage
}
```

## Use Cases

### Progress Tracking
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 20
});

// Track improvement over time
const recentQuality = history.history.slice(0, 5)
  .map(entry => entry.overallAssessment.quality);

const earlierQuality = history.history.slice(-5)
  .map(entry => entry.overallAssessment.quality);

console.log("Recent quality:", recentQuality);
console.log("Earlier quality:", earlierQuality);
```

### Learning Analytics
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history();

// Analyze suggestion patterns
const suggestionCategories = history.history
  .flatMap(entry => entry.suggestions)
  .reduce((acc, suggestion) => {
    acc[suggestion.category] = (acc[suggestion.category] || 0) + 1;
    return acc;
  }, {});

console.log("Most common improvement areas:", suggestionCategories);
```

### Performance Review
```typescript
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 30
});

// Calculate trends
const completenessScores = history.history
  .map(entry => entry.overallAssessment.completeness);

const averageCompleteness = completenessScores
  .reduce((a, b) => a + b, 0) / completenessScores.length;

console.log("Average completeness over time:", averageCompleteness);
```

## Historical Analysis

### Quality Trend Analysis
```typescript
function analyzeQualityTrend(history) {
  const entries = history.history.sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const qualityValues = {
    poor: 1, fair: 2, good: 3, excellent: 4
  };
  
  const scores = entries.map(entry => 
    qualityValues[entry.overallAssessment.quality]
  );
  
  // Calculate trend (positive = improving, negative = declining)
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  return secondAvg - firstAvg;
}
```

### Suggestion Pattern Analysis
```typescript
function analyzeSuggestionPatterns(history) {
  const patterns = {
    categories: {},
    priorities: {},
    types: {}
  };
  
  history.history.forEach(entry => {
    entry.suggestions.forEach(suggestion => {
      patterns.categories[suggestion.category] = 
        (patterns.categories[suggestion.category] || 0) + 1;
      patterns.priorities[suggestion.priority] = 
        (patterns.priorities[suggestion.priority] || 0) + 1;
      patterns.types[suggestion.type] = 
        (patterns.types[suggestion.type] || 0) + 1;
    });
  });
  
  return patterns;
}
```

### Timeline Analysis
```typescript
function analyzeTimeline(history) {
  const timeline = history.history.map(entry => ({
    date: new Date(entry.timestamp).toDateString(),
    quality: entry.overallAssessment.quality,
    completeness: entry.overallAssessment.completeness,
    accuracy: entry.overallAssessment.accuracy,
    suggestionCount: entry.suggestions.length
  }));
  
  return timeline;
}
```

## Data Export and Reporting

### CSV Export
```typescript
function exportToCSV(history) {
  const headers = [
    'Timestamp', 'Quality', 'Completeness', 'Accuracy', 
    'Suggestions', 'Screenshot'
  ];
  
  const rows = history.history.map(entry => [
    entry.timestamp,
    entry.overallAssessment.quality,
    entry.overallAssessment.completeness,
    entry.overallAssessment.accuracy,
    entry.suggestions.length,
    entry.screenshotPath
  ]);
  
  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}
```

### Summary Report
```typescript
function generateSummaryReport(history) {
  return {
    totalFeedback: history.statistics.total,
    successRate: history.statistics.successRate,
    qualityBreakdown: history.statistics.qualityDistribution,
    averageScores: {
      completeness: history.statistics.averageCompleteness,
      accuracy: history.statistics.averageAccuracy
    },
    timespan: {
      earliest: new Date(Math.min(...history.history.map(h => new Date(h.timestamp)))),
      latest: new Date(Math.max(...history.history.map(h => new Date(h.timestamp))))
    },
    mostCommonSuggestions: analyzeSuggestionPatterns(history)
  };
}
```

## Integration with Development Workflow

### Daily Review
```typescript
// Get today's feedback
const today = new Date().toDateString();
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 100
});

const todaysFeedback = history.history.filter(entry => 
  new Date(entry.timestamp).toDateString() === today
);

console.log(`Today's feedback count: ${todaysFeedback.length}`);
```

### Weekly Progress Report
```typescript
// Generate weekly progress report
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 100
});

const weeklyFeedback = history.history.filter(entry => 
  new Date(entry.timestamp) >= weekAgo
);

const weeklyReport = {
  totalProjects: weeklyFeedback.length,
  averageQuality: calculateAverageQuality(weeklyFeedback),
  commonIssues: extractCommonIssues(weeklyFeedback),
  improvements: trackImprovements(weeklyFeedback)
};
```

### Learning Path Optimization
```typescript
// Adjust learning path based on feedback history
const history = await mcp_qb64pe_get_programming_feedback_history({
  limit: 20
});

const focus = determineFocusArea(history);
const nextTopics = recommendNextTopics(history);
const reviewAreas = identifyReviewAreas(history);
```

## Filtering and Search

### Filter by Quality
```typescript
function filterByQuality(history, quality) {
  return history.history.filter(entry => 
    entry.overallAssessment.quality === quality
  );
}
```

### Filter by Date Range
```typescript
function filterByDateRange(history, startDate, endDate) {
  return history.history.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
}
```

### Search by Suggestion Category
```typescript
function searchBySuggestionCategory(history, category) {
  return history.history.filter(entry =>
    entry.suggestions.some(suggestion => 
      suggestion.category === category
    )
  );
}
```

## Best Practices

1. **Regular Review**: Check feedback history periodically to track progress
2. **Trend Analysis**: Look for patterns over time rather than individual entries
3. **Action-Oriented**: Use insights to guide future development focus
4. **Documentation**: Keep notes on how feedback influenced your programming
5. **Context Awareness**: Consider project complexity when interpreting feedback

## Limitations

- History is limited by available feedback data
- Quality assessments are based on visual analysis only
- Suggestions may not account for specific project requirements
- Historical data doesn't include manual feedback or external reviews

## Notes

- Feedback history is preserved across sessions
- Timestamps are in ISO 8601 format for consistency
- Statistics are calculated in real-time from available data
- Insights provide quick summary information for dashboard use
- Data can be exported for external analysis tools
