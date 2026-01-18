import { ScreenshotViewerGenerator } from './build/services/screenshot-viewer-generator.js';

const generator = new ScreenshotViewerGenerator();

// Grid and Shapes test configuration
const gridShapesConfig = {
    programName: 'Grid and Shapes Test',
    expectedOutput: 'Grid layout with various geometric shapes and patterns',
    screenSize: '1024x768 pixels (4:3 aspect ratio)',
    colors: [
        'Red, Green, Blue primary colors',
        'Yellow, Orange, Purple secondary colors', 
        'White, Cyan, Magenta accent colors',
        'Dark blue background (RGB 20,30,50)'
    ],
    shapes: [
        'Filled and hollow circles',
        'Gradient circle effect',
        'Filled and hollow rectangles', 
        'Triangles (equilateral and right)',
        'Hexagon approximation',
        'Diamond shape',
        'Concentric circles pattern',
        'Checkerboard pattern',
        'Spiral pattern',
        '5-pointed star'
    ],
    textElements: [
        'Title: "QB64PE GRAPHICS TEST - GRID AND SHAPES"',
        'Subtitle: "Testing various geometric elements"',
        'Shape labels for each element',
        'Grid specifications',
        'Resolution information',
        'Completion status'
    ],
    screenshotFiles: [
        'grid-shapes-test.bmp',
        'grid-shapes-animated.bmp'
    ]
};

// Generate the custom viewer
const viewerPath = generator.generateTestViewer(gridShapesConfig);
console.log(`✅ Grid and Shapes test viewer created: ${viewerPath}`);

// Also update the universal viewer to include these new files
const universalPath = generator.generateViewer({
    title: 'QB64PE Graphics Analysis - All Tests',
    testName: 'Multiple Test Results',
    expectedFiles: [
        'red-circle-test.bmp',
        'red-circle-test-final.bmp', 
        'grid-shapes-test.bmp',
        'grid-shapes-animated.bmp'
    ],
    programDetails: {
        'Test Count': '2',
        'Screenshot Count': '4',
        'Total Size': '~10MB',
        'Resolutions': '800x600, 1024x768'
    },
    outputFile: 'all-tests-viewer.html'
});

console.log(`✅ Universal viewer updated: ${universalPath}`);
console.log('\n🎯 Analysis Ready!');
console.log('Open either viewer in a web browser to analyze the graphics output.');
