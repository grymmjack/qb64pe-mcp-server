"use strict";
/**
 * QB64PE Screenshot Viewer Generator
 * Creates dynamic HTML viewers for QB64PE graphics program analysis
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfigurations = exports.ScreenshotViewerGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ScreenshotViewerGenerator {
    screenshotDir;
    constructor(screenshotDir = 'qb64pe-screenshots') {
        this.screenshotDir = screenshotDir;
    }
    /**
     * Generate a custom screenshot viewer for specific test cases
     */
    generateViewer(options = {}) {
        const { title = 'QB64PE Graphics Screenshot Analysis', testName = 'Generic Test', expectedFiles = [], analysisChecklist = [], programDetails = {}, outputFile = 'screenshot-viewer.html' } = options;
        const template = this.getViewerTemplate();
        // Replace placeholders with actual content
        let htmlContent = template
            .replace('{{TITLE}}', title)
            .replace('{{TEST_NAME}}', testName)
            .replace('{{PROGRAM_DETAILS}}', this.generateProgramDetailsHTML(programDetails))
            .replace('{{EXPECTED_FILES}}', JSON.stringify(expectedFiles))
            .replace('{{ANALYSIS_CHECKLIST}}', this.generateChecklistHTML(analysisChecklist));
        const outputPath = path.join(this.screenshotDir, outputFile);
        fs.writeFileSync(outputPath, htmlContent);
        return outputPath;
    }
    /**
     * Auto-discover screenshots and generate viewer
     */
    generateAutoViewer() {
        if (!fs.existsSync(this.screenshotDir)) {
            throw new Error(`Screenshot directory ${this.screenshotDir} does not exist`);
        }
        const files = fs.readdirSync(this.screenshotDir)
            .filter(file => file.toLowerCase().endsWith('.bmp') || file.toLowerCase().endsWith('.png'))
            .sort();
        const options = {
            title: 'QB64PE Screenshot Analysis - Auto-Generated',
            testName: 'Auto-Discovered Screenshots',
            expectedFiles: files,
            analysisChecklist: this.getGenericChecklist(),
            programDetails: {
                'Screenshots Found': files.length,
                'Directory': this.screenshotDir,
                'Generated': new Date().toISOString()
            }
        };
        return this.generateViewer(options);
    }
    /**
     * Generate viewer for specific QB64PE program test
     */
    generateTestViewer(testConfig) {
        const { programName, expectedOutput, screenSize, colors, shapes, textElements, screenshotFiles } = testConfig;
        const programDetails = {
            'Program': programName,
            'Expected Output': expectedOutput,
            'Screen Size': screenSize,
            'Colors': colors?.join(', ') || 'Various',
            'Shapes': shapes?.join(', ') || 'Various',
            'Text Elements': textElements?.join(', ') || 'None'
        };
        const checklist = [
            ...this.getGenericChecklist(),
            ...(shapes?.map((shape) => `${shape} is properly rendered`) || []),
            ...(colors?.map((color) => `${color} color appears correct`) || []),
            ...(textElements?.map((text) => `"${text}" text is visible and readable`) || [])
        ];
        return this.generateViewer({
            title: `QB64PE Analysis - ${programName}`,
            testName: programName,
            expectedFiles: screenshotFiles || [],
            programDetails,
            analysisChecklist: checklist,
            outputFile: `${programName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-viewer.html`
        });
    }
    getGenericChecklist() {
        return [
            'Image loads without corruption or errors',
            'Expected resolution and aspect ratio',
            'Color accuracy and rendering quality',
            'Geometric shapes are properly formed',
            'Text is readable and properly positioned',
            'No visual artifacts or rendering glitches',
            'Background color matches expectations',
            'Foreground elements are clearly visible',
            'Overall composition is well-structured',
            'Program output matches intended design'
        ];
    }
    generateProgramDetailsHTML(details) {
        if (!details || Object.keys(details).length === 0) {
            return '<li><em>No specific program details provided</em></li>';
        }
        return Object.entries(details)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('\n                ');
    }
    generateChecklistHTML(checklist) {
        if (!checklist || checklist.length === 0) {
            return this.getGenericChecklist()
                .map(item => `<li>${item}</li>`)
                .join('\n                ');
        }
        return checklist
            .map((item) => `<li>${item}</li>`)
            .join('\n                ');
    }
    getViewerTemplate() {
        // Return the universal viewer template with placeholders
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <!-- CSS would go here - same as universal viewer -->
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 {{TITLE}}</h1>
            <p>Analysis viewer for {{TEST_NAME}}</p>
        </div>
        
        <div class="analysis-section">
            <h2>📋 Program Details</h2>
            <ul>
                {{PROGRAM_DETAILS}}
            </ul>
        </div>
        
        <!-- Screenshot loading section -->
        <div id="screenshot-container" class="screenshot-grid">
            <!-- Dynamically populated -->
        </div>

        <div class="analysis-section">
            <h2>🔍 Analysis Checklist</h2>
            <ul class="checklist">
                {{ANALYSIS_CHECKLIST}}
            </ul>
        </div>
    </div>

    <script>
        const expectedFiles = {{EXPECTED_FILES}};
        // JavaScript functionality here
    </script>
</body>
</html>`;
    }
}
exports.ScreenshotViewerGenerator = ScreenshotViewerGenerator;
// Example usage configurations
exports.testConfigurations = {
    redCircle: {
        programName: 'Red Circle Test',
        expectedOutput: 'Red circle in center of black screen',
        screenSize: '800x600 pixels',
        colors: ['Pure Red (RGB 255,0,0)', 'Black background', 'White text'],
        shapes: ['Filled circle (radius 100px)'],
        textElements: ['RED CIRCLE TEST', 'Screenshot Analysis'],
        screenshotFiles: ['red-circle-test.bmp', 'red-circle-test-final.bmp']
    },
    gorillasGame: {
        programName: 'Gorillas Game Port',
        expectedOutput: 'City skyline with gorillas and explosions',
        screenSize: '640x480 pixels',
        colors: ['Blue sky', 'Building colors', 'Yellow explosions'],
        shapes: ['Rectangle buildings', 'Gorilla sprites', 'Explosion effects'],
        textElements: ['Score display', 'Player names', 'Game status'],
        screenshotFiles: ['gorillas-start.bmp', 'gorillas-gameplay.bmp', 'gorillas-explosion.bmp']
    },
    graphicsDemo: {
        programName: 'Graphics Demo',
        expectedOutput: 'Various geometric shapes and patterns',
        screenSize: '800x600 pixels',
        colors: ['Rainbow spectrum', 'Gradient effects'],
        shapes: ['Lines', 'Circles', 'Rectangles', 'Polygons'],
        textElements: ['Shape labels', 'Color information'],
        screenshotFiles: ['graphics-demo.bmp']
    }
};
//# sourceMappingURL=screenshot-viewer-generator.js.map