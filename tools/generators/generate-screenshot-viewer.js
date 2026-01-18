#!/usr/bin/env node

/**
 * Example usage of the Screenshot Viewer Generator
 * Run this to create custom viewers for different QB64PE tests
 */

import { ScreenshotViewerGenerator, testConfigurations } from './src/services/screenshot-viewer-generator.js';
import * as fs from 'fs';

const generator = new ScreenshotViewerGenerator();

console.log('🎨 QB64PE Screenshot Viewer Generator');
console.log('=====================================\n');

// Generate universal auto-discovery viewer
try {
    console.log('📁 Generating auto-discovery viewer...');
    const autoViewer = generator.generateAutoViewer();
    console.log(`✅ Created: ${autoViewer}\n`);
} catch (error) {
    console.log(`❌ Auto-discovery failed: ${error.message}\n`);
}

// Generate specific test viewers
console.log('🔧 Generating specific test viewers...');

// Red Circle Test Viewer
const redCircleViewer = generator.generateTestViewer(testConfigurations.redCircle);
console.log(`✅ Red Circle Test Viewer: ${redCircleViewer}`);

// Graphics Demo Viewer
const graphicsViewer = generator.generateTestViewer(testConfigurations.graphicsDemo);
console.log(`✅ Graphics Demo Viewer: ${graphicsViewer}`);

// Custom test example
const customViewer = generator.generateViewer({
    title: 'Custom QB64PE Test Analysis',
    testName: 'My Custom Test',
    expectedFiles: ['custom-test.bmp', 'custom-result.bmp'],
    programDetails: {
        'Test Type': 'Custom Graphics',
        'Expected Elements': 'Various shapes and colors',
        'Screen Resolution': '1024x768'
    },
    analysisChecklist: [
        'Custom shape renders correctly',
        'Animation frames are smooth',
        'Color palette is accurate',
        'Performance is acceptable'
    ],
    outputFile: 'custom-test-viewer.html'
});
console.log(`✅ Custom Test Viewer: ${customViewer}`);

console.log('\n🎯 Summary:');
console.log('- Universal viewer works with any screenshots');
console.log('- Test-specific viewers have custom checklists');
console.log('- Auto-discovery finds all BMP/PNG files');
console.log('- Modal view for full-size image inspection');
console.log('- Mobile-responsive design');
console.log('- Analysis notes section for documentation\n');

console.log('💡 Usage Tips:');
console.log('- Place BMP/PNG files in qb64pe-screenshots/ directory');
console.log('- Open generated HTML files in any web browser');
console.log('- Use for LLM analysis of QB64PE program outputs');
console.log('- Customize checklists for specific test requirements');
