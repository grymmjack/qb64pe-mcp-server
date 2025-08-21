/**
 * Generate a simple test image to simulate QB64PE screenshot output
 * This creates an HTML canvas image that represents what the red circle test would produce
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('=== Creating Test Image Simulation ===');

// Create an HTML file that generates the expected visual output
const htmlTestImage = `
<!DOCTYPE html>
<html>
<head>
    <title>QB64PE Red Circle Test Simulation</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; font-family: Arial, sans-serif; }
        .container { text-align: center; }
        canvas { border: 2px solid #333; background: black; }
        .info { margin-top: 20px; background: white; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>QB64PE Red Circle Screenshot Test Simulation</h1>
        <p>This simulates what the QB64PE graphics output would look like:</p>
        
        <canvas id="testCanvas" width="800" height="600"></canvas>
        
        <div class="info">
            <h3>Test Specifications:</h3>
            <ul style="text-align: left; display: inline-block;">
                <li><strong>Resolution:</strong> 800x600 pixels</li>
                <li><strong>Background:</strong> Black (RGB 0,0,0)</li>
                <li><strong>Circle:</strong> Red (RGB 255,0,0), Center (400,300), Radius 100px</li>
                <li><strong>Text:</strong> White, "RED CIRCLE TEST" above, "Screenshot Analysis" below</li>
            </ul>
        </div>
    </div>

    <script>
        // Get canvas and context
        const canvas = document.getElementById('testCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set black background
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw red circle in center
        const centerX = 400;
        const centerY = 300;
        const radius = 100;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(255, 0, 0)'; // Pure red
        ctx.fill();
        
        // Add white text
        ctx.fillStyle = 'rgb(255, 255, 255)'; // White
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        
        // Text above circle
        ctx.fillText('RED CIRCLE TEST', centerX, centerY - 150);
        
        // Text below circle  
        ctx.fillText('Screenshot Analysis', centerX, centerY + 140);
        
        console.log('Red circle test image rendered successfully!');
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Circle position:', centerX, centerY);
        console.log('Circle radius:', radius);
    </script>
</body>
</html>
`;

// Save the HTML file
const htmlPath = path.join(process.cwd(), 'qb64pe-screenshots', 'red-circle-simulation.html');
fs.writeFileSync(htmlPath, htmlTestImage);

console.log(`✓ Generated visual test simulation: ${htmlPath}`);
console.log('  - Open this file in a web browser to see the expected visual output');
console.log('  - This represents what the QB64PE program would render');

// Create a description file for the LLM analysis test
const analysisDescription = {
    test_type: 'QB64PE Graphics Screenshot Analysis',
    simulated_output: {
        description: 'Red filled circle centered on black background',
        technical_specs: {
            canvas_size: '800x600 pixels',
            background_color: 'RGB(0,0,0) - Pure Black',
            circle: {
                color: 'RGB(255,0,0) - Pure Red',
                position: 'Center (400, 300)',
                radius: '100 pixels',
                style: 'Filled/Solid'
            },
            text_elements: [
                {
                    content: 'RED CIRCLE TEST',
                    position: 'Above circle (Y: 150)',
                    color: 'RGB(255,255,255) - White',
                    font: '24px Arial'
                },
                {
                    content: 'Screenshot Analysis', 
                    position: 'Below circle (Y: 440)',
                    color: 'RGB(255,255,255) - White',
                    font: '24px Arial'
                }
            ]
        }
    },
    llm_analysis_task: {
        objective: 'Test LLM ability to analyze QB64PE graphics rendering',
        expected_detection: [
            'Geometric shape recognition (circle)',
            'Color identification (red, black, white)',
            'Spatial positioning (center, above, below)',
            'Text content recognition',
            'Overall composition analysis'
        ],
        success_criteria: [
            'LLM correctly identifies red circle',
            'LLM recognizes centered positioning',
            'LLM detects background color (black)',
            'LLM reads text content accurately',
            'LLM describes overall layout correctly'
        ]
    },
    execution_monitoring_validation: {
        program_type: 'Graphics + Console',
        timeout_behavior: 'wait_timeout (prevents infinite waiting)',
        completion_detection: 'Console output parsing',
        screenshot_generation: 'Automatic via _SAVEIMAGE',
        cross_platform_support: 'Windows/Linux/macOS commands'
    }
};

const descriptionPath = path.join(process.cwd(), 'qb64pe-screenshots', 'analysis-description.json');
fs.writeFileSync(descriptionPath, JSON.stringify(analysisDescription, null, 2));

console.log(`✓ Generated analysis description: ${descriptionPath}`);

console.log('\n=== Test Files Created ===');
console.log('1. red-circle-simulation.html - Visual representation of expected output');
console.log('2. analysis-description.json - Detailed test specifications');
console.log('3. mock-analysis-data.json - Simulated LLM analysis results');
console.log('4. test-report.json - Complete test validation report');

console.log('\n=== LLM Testing Instructions ===');
console.log('To test the LLM screenshot analysis capability:');
console.log('1. Open red-circle-simulation.html in a web browser');
console.log('2. Take a screenshot of the rendered canvas');
console.log('3. Show the screenshot to an LLM with this prompt:');
console.log('   "Analyze this QB64PE graphics output. What shapes, colors, and text do you see?"');
console.log('4. Verify the LLM correctly identifies:');
console.log('   - Red filled circle in center');
console.log('   - Black background');
console.log('   - White text labels');
console.log('   - Overall composition and layout');

console.log('\n✓ Graphics Screenshot Analysis Test Simulation Complete!');
