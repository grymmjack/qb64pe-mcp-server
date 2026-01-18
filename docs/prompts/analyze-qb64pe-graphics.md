# Analyze QB64PE Graphics

## Overview
The `analyze-qb64pe-graphics` prompt provides comprehensive analysis and feedback for QB64PE graphics programs, helping developers understand visual output, identify rendering issues, and optimize graphics performance.

## Purpose
- **Visual Analysis**: Examine graphics program output and identify visual elements
- **Performance Assessment**: Evaluate graphics rendering efficiency and optimization opportunities
- **Bug Detection**: Identify common graphics programming issues and rendering problems
- **Enhancement Suggestions**: Provide recommendations for improving visual quality and code structure
- **Cross-Platform Compatibility**: Analyze platform-specific graphics behaviors

## Arguments

### Required
- **`sourceCode`** (string): QB64PE graphics program source code to analyze

### Optional
- **`screenshotPath`** (string): Path to screenshot of program output for visual analysis
- **`expectedOutput`** (string): Description of expected visual behavior
- **`platform`** (string): Target platform - `windows`, `macos`, `linux`
- **`focusAreas`** (array): Specific areas to focus analysis on

### Focus Areas
- **`rendering`**: Graphics rendering quality and correctness
- **`performance`**: Animation smoothness and frame rates
- **`colors`**: Color usage, palettes, and visual appeal
- **`layout`**: Screen layout, positioning, and composition
- **`animation`**: Animation techniques and timing
- **`user-interface`**: UI elements and user interaction design

## Usage Examples

### Basic Graphics Analysis
```json
{
  "prompt": "analyze-qb64pe-graphics",
  "sourceCode": "SCREEN 13\nCIRCLE (160, 100), 50, 12\nLINE (100, 50)-(220, 150), 14, B"
}
```

### Screenshot-Based Analysis
```json
{
  "prompt": "analyze-qb64pe-graphics",
  "sourceCode": "SCREEN 1\nFOR i = 1 TO 10\n  CIRCLE (i*30, 100), 20, i MOD 4\nNEXT",
  "screenshotPath": "./screenshots/circles_demo.png",
  "expectedOutput": "Row of colorful circles across the screen"
}
```

### Performance-Focused Analysis
```json
{
  "prompt": "analyze-qb64pe-graphics",
  "sourceCode": "' Game loop with animation code...",
  "focusAreas": ["performance", "animation"],
  "platform": "windows"
}
```

## Response Structure

The prompt provides comprehensive analysis covering:

### 1. Visual Assessment
- **Screen Mode Analysis**: Evaluation of chosen screen mode appropriateness
- **Color Usage**: Analysis of color choices, palettes, and visual harmony
- **Layout Composition**: Assessment of element positioning and screen utilization
- **Visual Quality**: Overall aesthetic quality and professional appearance

### 2. Code Structure Analysis
- **Graphics Organization**: How graphics commands are structured and organized
- **Drawing Efficiency**: Analysis of drawing command optimization
- **Resource Management**: Image and buffer management practices
- **Error Handling**: Graphics-specific error handling and edge cases

### 3. Performance Evaluation
- **Rendering Speed**: Efficiency of drawing operations
- **Animation Smoothness**: Frame rate and timing analysis
- **Memory Usage**: Graphics memory and buffer utilization
- **CPU Efficiency**: Processing load of graphics operations

### 4. Technical Assessment
- **Platform Compatibility**: Cross-platform graphics behavior
- **Resolution Handling**: Screen resolution and scaling considerations
- **Hardware Requirements**: Graphics hardware dependencies
- **Modern Features**: Usage of advanced QB64PE graphics features

### 5. Improvement Recommendations
- **Optimization Suggestions**: Specific performance improvements
- **Visual Enhancements**: Ways to improve visual appeal
- **Code Refactoring**: Structural improvements for maintainability
- **Feature Additions**: Suggestions for enhanced functionality

## Related Tools

### Graphics Creation
- **`generate_qb64pe_screenshot_analysis_template`**: Create test programs for graphics analysis
- **`generate_qb64pe_echo_functions`**: Add console output to graphics programs
- **`enhance_qb64pe_code_for_debugging`**: Add debugging to graphics programs

### Screenshot Analysis
- **`capture_qb64pe_screenshot`**: Capture program screenshots automatically
- **`analyze_qb64pe_graphics_screenshot`**: Analyze existing screenshots
- **`start_screenshot_monitoring`**: Monitor graphics programs for visual changes

### Graphics Reference
- **`get_qb64pe_graphics_guide`**: Get comprehensive graphics programming guide
- **`search_qb64pe_keywords_by_wiki_category`**: Find graphics-related commands
- **`get_qb64pe_page`**: Get detailed documentation for graphics commands

## Best Practices

### Visual Design
1. **Choose Appropriate Screen Modes**: Select screen modes that match your needs
2. **Use Color Effectively**: Consider color blindness and visual accessibility
3. **Plan Layout Carefully**: Design screen layouts before implementing
4. **Test on Different Hardware**: Verify appearance across different systems

### Performance Optimization
1. **Minimize Redundant Drawing**: Avoid unnecessary screen updates
2. **Use Efficient Drawing Commands**: Choose the most appropriate graphics commands
3. **Implement Proper Timing**: Use `_DELAY` or `_LIMIT` for smooth animation
4. **Manage Resources**: Clean up images and buffers when done

### Code Organization
1. **Separate Graphics Logic**: Keep graphics code organized and modular
2. **Use Constants**: Define screen dimensions and colors as constants
3. **Comment Visual Code**: Explain complex visual effects and layouts
4. **Handle Edge Cases**: Account for different screen sizes and capabilities

## Example Scenarios

### Scenario 1: Simple Shape Drawing
```basic
' Basic shapes demonstration
SCREEN 13
CLS
CIRCLE (160, 100), 50, 12    ' Red circle
LINE (100, 50)-(220, 150), 14, B  ' Yellow box
PSET (160, 100), 15          ' White center point
```
**Analysis Focus**: Color choices, positioning, basic drawing techniques

### Scenario 2: Animation Loop
```basic
' Bouncing ball animation
SCREEN 13
x = 50: y = 50: dx = 2: dy = 2
DO
  CLS
  CIRCLE (x, y), 10, 12
  x = x + dx: y = y + dy
  IF x <= 10 OR x >= 310 THEN dx = -dx
  IF y <= 10 OR y >= 190 THEN dy = -dy
  _DELAY 0.02
LOOP UNTIL INKEY$ <> ""
```
**Analysis Focus**: Animation smoothness, collision detection, timing

### Scenario 3: User Interface
```basic
' Simple menu system
SCREEN 12
COLOR 15, 1
CLS
LOCATE 5, 30: PRINT "MAIN MENU"
LOCATE 8, 25: PRINT "1. Start Game"
LOCATE 10, 25: PRINT "2. Options"
LOCATE 12, 25: PRINT "3. Exit"
LINE (200, 60)-(440, 220), 14, B
```
**Analysis Focus**: UI design, readability, user experience

## Integration Examples

### With Screenshot Analysis
```javascript
// 1. Generate test program
const testProgram = await mcp.call("generate_qb64pe_screenshot_analysis_template", {
  testType: "basic_shapes"
});

// 2. Analyze the code
const codeAnalysis = await mcp.call("analyze-qb64pe-graphics", {
  sourceCode: testProgram
});

// 3. Capture and analyze visual output
const screenshot = await mcp.call("capture_qb64pe_screenshot");
const visualAnalysis = await mcp.call("analyze_qb64pe_graphics_screenshot", {
  screenshotPath: screenshot.filePath,
  programCode: testProgram
});
```

### With Performance Monitoring
```javascript
// Combine graphics analysis with execution monitoring
const analysis = await mcp.call("analyze-qb64pe-graphics", {
  sourceCode: myGraphicsProgram,
  focusAreas: ["performance", "animation"]
});

const monitoring = await mcp.call("monitor-qb64pe-execution", {
  sourceCode: myGraphicsProgram,
  expectedBehavior: "Smooth 60 FPS animation"
});
```

## Common Graphics Issues

### Rendering Problems
1. **Flickering**: Usually caused by not using double buffering or poor timing
2. **Color Issues**: Palette problems or incorrect color values
3. **Positioning Errors**: Math errors in coordinate calculations
4. **Scaling Problems**: Issues with different screen resolutions

### Performance Issues
1. **Slow Animation**: Inefficient drawing or missing timing controls
2. **Memory Leaks**: Not properly managing image resources
3. **CPU Overload**: Too many drawing operations per frame
4. **Synchronization**: Animation timing problems

### Compatibility Issues
1. **Screen Mode Support**: Not all modes work on all platforms
2. **Color Depth**: Different systems may handle colors differently
3. **Resolution Dependencies**: Hard-coded coordinates not scaling properly
4. **Hardware Limitations**: Graphics features not available on all systems

## Advanced Features

### Modern QB64PE Graphics
- **`_PUTIMAGE`**: Advanced image manipulation and scaling
- **`_LOADIMAGE`**: Loading external image files
- **`_NEWIMAGE`**: Creating custom screen buffers
- **`_BLEND`**: Advanced blending modes and transparency

### Optimization Techniques
- **Hardware Surfaces**: Using `_HARDWARE` for better performance
- **Batch Operations**: Combining multiple drawing operations
- **Selective Updates**: Only redrawing changed areas
- **Precomputed Graphics**: Caching complex visual elements

## Troubleshooting

### Debug Graphics Issues
1. **Add Debug Output**: Use `ECHO` functions to debug graphics programs
2. **Simplify First**: Start with basic shapes and add complexity gradually
3. **Test Incrementally**: Verify each graphics operation works correctly
4. **Use Screenshots**: Capture output for detailed analysis

### Performance Debugging
1. **Profile Drawing Operations**: Time different graphics commands
2. **Monitor Resource Usage**: Track memory and CPU consumption
3. **Test Different Approaches**: Compare various drawing techniques
4. **Optimize Critical Paths**: Focus on frequently executed graphics code

---

**See Also:**
- [Monitor QB64PE Execution](./monitor-qb64pe-execution.md) - For execution monitoring of graphics programs
- [Debug QB64PE Issue](./debug-qb64pe-issue.md) - For troubleshooting graphics problems
- [QB64PE Graphics Guide](../docs/GRAPHICS_GUIDE_ACCESS.md) - Comprehensive graphics programming reference
