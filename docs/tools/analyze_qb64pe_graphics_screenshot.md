# analyze_qb64pe_graphics_screenshot

Analyze QB64PE graphics program screenshots to detect shapes, colors, layout, and visual elements for LLM analysis.

## 📋 **Overview**

This tool provides comprehensive visual analysis of QB64PE graphics program screenshots including:
- Shape detection and identification
- Color palette analysis
- Layout and positioning assessment
- Text element recognition
- Visual quality evaluation
- Programming feedback generation

## 🔧 **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `screenshotPath` | string | ✅ | Path to the screenshot file to analyze (PNG, JPG, GIF) |
| `analysisType` | enum | ❌ | Type of analysis to perform (default: "comprehensive") |
| `programCode` | string | ❌ | Original QB64PE code that generated the screenshot for context |
| `expectedElements` | array | ❌ | List of expected visual elements to look for |

### Analysis Types

| Type | Description |
|------|-------------|
| `shapes` | Focus on geometric shapes and objects |
| `colors` | Analyze color usage and palette |
| `layout` | Examine positioning and arrangement |
| `text` | Detect and analyze text elements |
| `quality` | Assess visual quality and rendering |
| `comprehensive` | Complete analysis covering all aspects |

## 📤 **Returns**

```json
{
  "success": true,
  "analysisType": "comprehensive",
  "imageInfo": {
    "width": 800,
    "height": 600,
    "format": "PNG",
    "colorDepth": 32
  },
  "detectedElements": {
    "shapes": [
      {
        "type": "circle",
        "position": { "x": 400, "y": 300 },
        "size": { "radius": 50 },
        "color": "#FF0000"
      }
    ],
    "colors": {
      "primary": ["#FF0000", "#00FF00", "#0000FF"],
      "background": "#000000",
      "palette": "16-color"
    },
    "text": [
      {
        "content": "Score: 1500",
        "position": { "x": 10, "y": 10 },
        "font": "default"
      }
    ]
  },
  "quality": {
    "score": 8.5,
    "issues": [],
    "recommendations": []
  },
  "feedback": {
    "positive": ["Good color contrast", "Clear shape rendering"],
    "improvements": ["Consider anti-aliasing for smoother lines"],
    "codeIssues": [],
    "suggestions": ["Add more visual feedback for user interactions"]
  }
}
```

## 🎨 **Analysis Capabilities**

### Shape Detection
- **Geometric Shapes**: Circles, rectangles, lines, polygons
- **Complex Objects**: Sprites, characters, UI elements
- **Position Analysis**: Coordinate mapping and alignment
- **Size Measurements**: Accurate dimension detection

### Color Analysis
- **Palette Identification**: 16-color, 256-color, true-color modes
- **Color Harmony**: Complementary and analogous color schemes
- **Contrast Assessment**: Readability and accessibility evaluation
- **Background Analysis**: Solid colors, gradients, patterns

### Layout Evaluation
- **Element Positioning**: Alignment and spacing analysis
- **Visual Hierarchy**: Importance and focus assessment
- **Screen Utilization**: Effective use of available space
- **UI Design**: User interface layout evaluation

### Quality Assessment
- **Rendering Quality**: Smoothness and clarity evaluation
- **Visual Artifacts**: Detection of rendering issues
- **Performance Impact**: Analysis of graphics efficiency
- **Cross-Platform Compatibility**: Rendering consistency

## 💡 **Example Usage**

```javascript
{
  "screenshotPath": "qb64pe-screenshots/game_screen_001.png",
  "analysisType": "comprehensive",
  "programCode": "SCREEN 12\\nCIRCLE (400, 300), 50, 4\\nPRINT \"Score: 1500\"",
  "expectedElements": ["red circle", "score display", "game interface"]
}
```

## 🎯 **Use Cases**

- **Game Development**: Analyze game screenshots for visual feedback
- **Graphics Testing**: Validate graphics output automatically
- **UI Design Review**: Assess user interface layouts
- **Educational Analysis**: Provide learning feedback on graphics programming
- **Quality Assurance**: Automated visual testing workflows

## 🔍 **Programming Feedback**

The tool provides specific programming feedback including:

### Code Quality Analysis
- **Graphics Function Usage**: Proper use of CIRCLE, LINE, PSET, etc.
- **Color Management**: Effective palette and color selection
- **Performance Considerations**: Optimization opportunities
- **Best Practices**: QB64PE graphics programming guidelines

### Common Issues Detection
- **Coordinate Problems**: Off-screen or misaligned elements
- **Color Conflicts**: Poor contrast or clashing colors
- **Memory Leaks**: Image handle management issues
- **Rendering Efficiency**: Unnecessary redrawing or complexity

## ⚠️ **Important Notes**

- **File Format Support**: PNG, JPG, GIF images supported
- **Code Context**: Providing program code enhances analysis accuracy
- **Expected Elements**: Pre-defining expected elements improves validation
- **Quality Scoring**: 0-10 scale with detailed recommendations
- **Automated Workflow**: Integrates with screenshot monitoring systems

## 🔗 **Related Tools**

- [`capture_qb64pe_screenshot`](./capture_qb64pe_screenshot.md) - Capture screenshots automatically
- [`generate_qb64pe_screenshot_analysis_template`](./generate_qb64pe_screenshot_analysis_template.md) - Create test programs
- [`generate_programming_feedback`](./generate_programming_feedback.md) - Generate detailed feedback reports
