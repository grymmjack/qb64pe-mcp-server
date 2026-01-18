#!/usr/bin/env node

/**
 * Enhanced QB64PE Graphics Test with HTTP Server Integration
 * Now outputs HTTP URLs for VS Code Simple Browser viewing
 */

import * as fs from 'fs';
import * as path from 'path';

const SERVER_PORT = 5173;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const SCREENSHOTS_DIR = 'qb64pe-screenshots';

console.log('🎮 QB64PE Enhanced Graphics Analysis Test');
console.log('==========================================\n');

// Check if server is running
async function checkServerStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/health`);
        const health = await response.json();
        console.log('✅ Screenshot server is running');
        console.log(`📁 Serving: ${health.serving}`);
        console.log(`🌐 URL: ${SERVER_URL}/\n`);
        return true;
    } catch (error) {
        console.log('❌ Screenshot server not running');
        console.log('💡 Start it with: npm run start:server');
        console.log('   or use VS Code task: "Start QB64PE Screenshot Server"\n');
        return false;
    }
}

function analyzeTestProgram(programPath, description) {
    console.log(`=== ${description} ===`);
    
    if (!fs.existsSync(programPath)) {
        console.log(`❌ Program not found: ${programPath}\n`);
        return;
    }
    
    const sourceCode = fs.readFileSync(programPath, 'utf8');
    console.log(`✅ Analyzing: ${path.basename(programPath)}`);
    
    // Simulate QB64PE analysis result
    const analysis = {
        executionState: {
            status: 'graphics_mode',
            hasGraphics: true,
            hasConsole: false,
            screenshotDir: path.resolve(SCREENSHOTS_DIR),
            logFile: path.resolve('qb64pe-logs', `execution_${Date.now()}.log`)
        },
        guidance: {
            recommendation: 'Graphics program - will generate screenshots',
            waitingBehavior: 'wait_timeout',
            monitoringStrategy: ['Monitor graphics window', 'Check for screenshot files']
        }
    };
    
    console.log(`📊 Status: ${analysis.executionState.status}`);
    console.log(`🖼️  Graphics: ${analysis.executionState.hasGraphics ? 'Yes' : 'No'}`);
    console.log(`📁 Screenshot Dir: ${analysis.executionState.screenshotDir}`);
    
    // Look for existing screenshots that match this program
    const programName = path.basename(programPath, '.bas');
    const expectedScreenshots = [
        `${programName}.png`,
        `${programName}-final.png`,
        `${programName}-test.png`,
        `${programName}-animated.png`,
        // Legacy BMP support
        `${programName}.bmp`,
        `${programName}-final.bmp`,
        `${programName}-test.bmp`,
        `${programName}-animated.bmp`
    ];
    
    const foundScreenshots = [];
    expectedScreenshots.forEach(filename => {
        const filepath = path.join(SCREENSHOTS_DIR, filename);
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            foundScreenshots.push({
                filename,
                size: stats.size,
                modified: stats.mtime,
                httpUrl: `${SERVER_URL}/${filename}`,
                fileUrl: `file:///${path.resolve(filepath).replace(/\\/g, '/')}`
            });
        }
    });
    
    if (foundScreenshots.length > 0) {
        console.log(`\n📷 Found Screenshots (${foundScreenshots.length}):`);
        foundScreenshots.forEach(shot => {
            console.log(`   • ${shot.filename}`);
            console.log(`     Size: ${(shot.size / 1024 / 1024).toFixed(2)} MB`);
            console.log(`     Modified: ${shot.modified.toLocaleString()}`);
            console.log(`     🌐 HTTP: ${shot.httpUrl}`);
            console.log(`     📁 File: ${shot.fileUrl}`);
        });
        
        console.log(`\n🔗 Quick Links for VS Code Simple Browser:`);
        console.log(`   📋 Index Page: ${SERVER_URL}/`);
        console.log(`   📋 Latest: ${foundScreenshots[0].httpUrl}`);
    } else {
        console.log('📷 No screenshots found yet - run the QB64PE program first');
    }
    
    console.log('');
    return { analysis, screenshots: foundScreenshots };
}

// Main execution
async function main() {
    const serverRunning = await checkServerStatus();
    
    // Analyze available test programs
    const testPrograms = [
        {
            path: path.join(path.dirname(new URL(import.meta.url).pathname), '../fixtures/bas-files/red-circle-screenshot-test.bas'),
            description: 'Red Circle Test Analysis'
        },
        {
            path: path.join(path.dirname(new URL(import.meta.url).pathname), '../fixtures/bas-files/grid-shapes-test.bas'), 
            description: 'Grid and Shapes Test Analysis'
        }
    ];
    
    const allResults = [];
    
    testPrograms.forEach(program => {
        const result = analyzeTestProgram(program.path, program.description);
        if (result) {
            allResults.push(result);
        }
    });
    
    // Summary
    console.log('📊 ANALYSIS SUMMARY');
    console.log('===================');
    
    const totalScreenshots = allResults.reduce((sum, result) => sum + result.screenshots.length, 0);
    console.log(`Programs analyzed: ${allResults.length}`);
    console.log(`Screenshots found: ${totalScreenshots}`);
    
    if (serverRunning && totalScreenshots > 0) {
        console.log(`\n🎯 READY FOR VISUAL ANALYSIS!`);
        console.log(`\n📋 Copy this URL to Simple Browser:`);
        console.log(`   ${SERVER_URL}/`);
        console.log(`\n💡 Instructions:`);
        console.log(`   1. Copy the URL above`);
        console.log(`   2. Open VS Code Command Palette (Ctrl+Shift+P)`);
        console.log(`   3. Type "Simple Browser: Show"`);
        console.log(`   4. Paste the URL`);
        console.log(`   5. View and analyze your QB64PE graphics!`);
    } else if (!serverRunning) {
        console.log(`\n⚠️  To view screenshots in VS Code:`);
        console.log(`   1. Start the server: npm run start:server`);
        console.log(`   2. Or use VS Code task: "Start QB64PE Screenshot Server"`);
        console.log(`   3. Then run this analysis again`);
    } else {
        console.log(`\n💡 Run some QB64PE graphics programs first to generate screenshots!`);
    }
}

main().catch(console.error);
