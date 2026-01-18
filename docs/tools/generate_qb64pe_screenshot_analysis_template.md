# generate_qb64pe_screenshot_analysis_template

Generates QB64PE program templates specifically designed for screenshot analysis testing with known visual elements.

## Description

This tool creates QB64PE program templates that generate predictable visual output for testing screenshot analysis functionality. Each template type produces specific shapes, colors, and text elements that can be used to validate screenshot analysis accuracy and train automated systems.

## Parameters

- **testType** (required): Type of visual test to generate
  - "basic_shapes" - Simple geometric shapes
  - "color_palette" - Color testing and gradients
  - "text_rendering" - Text display in various fonts/sizes
  - "layout_grid" - Grid-based layout testing
  - "animation_frames" - Multi-frame animation sequence
  - "complex_scene" - Complex graphics with multiple elements
  - "custom" - Custom specification (requires customSpecs)

- **customSpecs** (optional): Custom specifications for "custom" testType
  - **shapes**: Array of shape types to include
  - **colors**: Array of color names to use
  - **textElements**: Array of text strings to display
  - **screenSize**: Screen dimensions (e.g., "800x600")

## Usage

### Basic Shapes Template
```typescript
const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
  testType: "basic_shapes"
});
```

### Color Palette Template
```typescript
const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
  testType: "color_palette"
});
```

### Custom Template
```typescript
const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
  testType: "custom",
  customSpecs: {
    shapes: ["circle", "square", "triangle"],
    colors: ["red", "blue", "green"],
    textElements: ["Test", "Demo", "Sample"],
    screenSize: "1024x768"
  }
});
```

## Template Types

### Basic Shapes
Generates simple geometric shapes for fundamental analysis testing:

**Expected Elements:**
- Circle (filled, red)
- Rectangle (filled, blue)
- Line (green)
- Triangle (outline, yellow)
- Title text: "BASIC SHAPES TEST"

**Analysis Focus:**
- Shape detection accuracy
- Color identification
- Text recognition
- Basic layout analysis

**Generated Code Features:**
```basic
$NOPREFIX
$RESIZE:SMOOTH
Screen _NewImage(800, 600, 32)

' Creates circle, rectangle, line, triangle
' Each with distinct colors and labels
' Saves screenshot automatically
```

### Color Palette
Tests color recognition and gradient analysis:

**Expected Elements:**
- Primary color swatches
- Secondary color combinations
- Gradient transitions
- Grayscale spectrum
- Color mixing examples

**Analysis Focus:**
- Color accuracy
- Gradient detection
- Color space analysis
- Hue, saturation, brightness

### Text Rendering
Validates text detection and font rendering:

**Expected Elements:**
- Multiple font sizes
- Different text styles
- Various text colors
- Text positioning tests
- Special characters

**Analysis Focus:**
- OCR accuracy
- Font recognition
- Text positioning
- Character clarity

### Layout Grid
Tests geometric layout and alignment:

**Expected Elements:**
- Grid patterns
- Aligned elements
- Symmetrical layouts
- Spacing consistency
- Border detection

**Analysis Focus:**
- Grid detection
- Alignment analysis
- Spacing measurements
- Layout symmetry

### Animation Frames
Creates multiple frame sequences:

**Expected Elements:**
- Sequential animation frames
- Movement patterns
- Object transformations
- Time-based changes
- Frame transitions

**Analysis Focus:**
- Frame sequence analysis
- Motion detection
- Temporal changes
- Animation smoothness

### Complex Scene
Comprehensive testing with multiple elements:

**Expected Elements:**
- Multiple shape types
- Varied colors and textures
- Complex layouts
- Overlapping elements
- Mixed content types

**Analysis Focus:**
- Complete scene analysis
- Element separation
- Complex layout understanding
- Multi-element detection

## Response Format

```typescript
{
  testType: string,
  templateCode: string,
  analysisSpecs: {
    expectedShapes: string[],
    expectedColors: string[],
    textElements: string[],
    screenSize: string
  },
  usage: {
    compilation: string,
    execution: string,
    expectedOutput: string,
    analysisCommand: string
  },
  files: {
    saveAs: string,
    screenshotDir: string,
    expectedScreenshots: string[]
  }
}
```

## Implementation Example

### Basic Shapes Template Code
```basic
$NOPREFIX
$RESIZE:SMOOTH

Title "QB64PE Basic Shapes Test"
Screen _NewImage(800, 600, 32)
Cls , _RGB32(0, 0, 0) ' Black background

' Define colors
red = _RGB32(255, 0, 0)
blue = _RGB32(0, 0, 255)
green = _RGB32(0, 255, 0)
yellow = _RGB32(255, 255, 0)
white = _RGB32(255, 255, 255)

' Title text
Color white
_PrintString (300, 50), "BASIC SHAPES TEST"

' Circle in top-left quadrant
Circle (200, 200), 80, red
Paint (200, 200), red
_PrintString (160, 290), "Circle"

' Rectangle in top-right quadrant
Line (450, 120)-(650, 280), blue, BF
_PrintString (530, 290), "Rectangle"

' Line in bottom-left quadrant
Line (100, 350)-(300, 500), green
_PrintString (180, 510), "Line"

' Triangle in bottom-right quadrant
Line (500, 350)-(600, 500), yellow
Line (600, 500)-(700, 350), yellow
Line (700, 350)-(500, 350), yellow
_PrintString (580, 510), "Triangle"

Display
_SaveImage "qb64pe-screenshots/basic-shapes-test.png"
_Delay 2
System 0
```

## Usage Workflow

### 1. Generate Template
```typescript
const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
  testType: "basic_shapes"
});
```

### 2. Save and Compile
```bash
# Save template code to file
echo '...' > basic-shapes-template.bas

# Compile with QB64PE
qb64pe -c basic-shapes-template.bas
```

### 3. Execute Program
```bash
# Run the compiled program
./basic-shapes-template.exe
```

### 4. Analyze Screenshots
```typescript
const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
  screenshotPath: "qb64pe-screenshots/basic-shapes-test.png",
  analysisType: "comprehensive",
  expectedElements: template.analysisSpecs.expectedShapes
});
```

## Integration with Testing

### Validation Testing
```typescript
// Generate test template
const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
  testType: "basic_shapes"
});

// Execute and capture
// ... run the generated program ...

// Analyze results
const analysis = await mcp_qb64pe_analyze_qb64pe_graphics_screenshot({
  screenshotPath: "qb64pe-screenshots/basic-shapes-test.png"
});

// Validate expected elements
const foundShapes = analysis.analysis.shapes;
const expectedShapes = template.analysisSpecs.expectedShapes;
const allFound = expectedShapes.every(shape => foundShapes.includes(shape));
```

### Regression Testing
```typescript
// Test multiple template types
const testTypes = ["basic_shapes", "color_palette", "text_rendering"];

for (const testType of testTypes) {
  const template = await mcp_qb64pe_generate_qb64pe_screenshot_analysis_template({
    testType
  });
  
  // Execute template and analyze results
  // Compare with expected specifications
}
```

## Best Practices

1. **Use for validation**: Test screenshot analysis accuracy
2. **Systematic testing**: Run all template types for comprehensive testing
3. **Compare results**: Validate detected elements against expected specifications
4. **Automated pipelines**: Integrate into CI/CD testing workflows
5. **Document variations**: Note any platform-specific rendering differences

## Template Specifications

Each template includes detailed specifications:

- **Expected visual elements**: Shapes, colors, text that should be detected
- **Screen dimensions**: Consistent sizing for comparison
- **File naming**: Predictable screenshot naming for automated processing
- **Execution instructions**: How to compile and run the template
- **Analysis guidance**: What to look for in the generated screenshots

## Platform Considerations

### Windows
- Templates use modern QB64PE syntax
- Screenshots save to `qb64pe-screenshots/` directory
- Color accuracy varies by display settings

### Linux
- Requires X11 for graphics display
- Screenshot capture depends on window manager
- Font rendering may differ from Windows

### macOS
- Graphics performance varies by hardware
- Screenshot formats may need conversion
- Color profiles affect analysis results

## Notes

- Templates use modern QB64PE features like `$NOPREFIX` and `_RGB32`
- Automatic screenshot saving eliminates manual capture steps
- Consistent layouts enable automated comparison testing
- Expected specifications facilitate validation workflows
- Templates can be modified for custom testing requirements
