/**
 * Async Operations Test - CommonJS version
 */

const { QB64PEInstallationService } = require('./build/services/installation-service.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

console.log('=== ASYNC OPERATIONS DEBUG TEST ===');

async function runTests() {
    const service = new QB64PEInstallationService();

    // Test each async operation individually with detailed logging

    console.log('\n1. Testing basic exec() with timeout...');
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('exec timeout')), 5000)
        );
        
        const execPromise = execAsync('echo "Hello World"');
        
        const result = await Promise.race([execPromise, timeoutPromise]);
        console.log('✅ Basic exec() works:', result.stdout.trim());
    } catch (error) {
        console.log('❌ Basic exec() failed:', error.message);
    }

    console.log('\n2. Testing QB64PE version command...');
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('version check timeout')), 8000)
        );
        
        const versionCmd = '"C:\\Users\\grymmjack\\git\\QB64pe\\qb64pe.exe" --version';
        console.log('Command:', versionCmd);
        
        const execPromise = execAsync(versionCmd);
        
        const result = await Promise.race([execPromise, timeoutPromise]);
        console.log('✅ QB64PE version:', result.stdout.trim());
    } catch (error) {
        console.log('❌ QB64PE version failed:', error.message);
    }

    console.log('\n3. Testing PATH check...');
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('PATH check timeout')), 5000)
        );
        
        const pathCmd = 'where qb64pe';
        console.log('Command:', pathCmd);
        
        const execPromise = execAsync(pathCmd);
        
        const result = await Promise.race([execPromise, timeoutPromise]);
        console.log('✅ QB64PE in PATH:', result.stdout.trim());
    } catch (error) {
        console.log('❌ PATH check result:', error.message);
        // This is expected to fail if qb64pe is not in PATH
    }

    console.log('\n4. Testing service validatePath()...');
    try {
        const result = await service.validatePath('C:\\Users\\grymmjack\\git\\QB64pe');
        console.log('✅ validatePath() works:', result);
    } catch (error) {
        console.log('❌ validatePath() failed:', error.message);
    }

    console.log('\n5. Testing service checkInPath()...');
    try {
        // This is the most likely culprit for hanging
        console.log('Starting checkInPath() - this might hang...');
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('checkInPath timeout')), 10000)
        );
        
        const checkPromise = service.checkInPath();
        
        const result = await Promise.race([checkPromise, timeoutPromise]);
        console.log('✅ checkInPath() works:', result);
    } catch (error) {
        console.log('❌ checkInPath() failed/timeout:', error.message);
    }

    console.log('\n6. Testing service detectInstallation()...');
    try {
        console.log('Starting detectInstallation() - this might hang...');
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('detectInstallation timeout')), 15000)
        );
        
        const detectPromise = service.detectInstallation();
        
        const result = await Promise.race([detectPromise, timeoutPromise]);
        console.log('✅ detectInstallation() works:', result);
    } catch (error) {
        console.log('❌ detectInstallation() failed/timeout:', error.message);
    }

    console.log('\n=== ASYNC DEBUG COMPLETE ===');
    console.log('Check which operations succeeded/failed above.');
}

runTests().catch(error => {
    console.error('Test runner failed:', error);
});
