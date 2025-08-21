const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from dashboard directory
app.use(express.static(path.join(__dirname)));

// Parse JSON bodies
app.use(express.json());

// CORS headers for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Dashboard routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes for MCP Server Integration

// Get system status
app.get('/api/status', async (req, res) => {
    try {
        // In production, this would call the MCP server tools
        // For now, return mock data
        const status = {
            timestamp: new Date().toISOString(),
            monitoring: {
                isMonitoring: Math.random() > 0.5,
                screenshotDir: 'qb64pe-screenshots'
            },
            watching: {
                isWatching: Math.random() > 0.3,
                watchedDirectories: ['qb64pe-screenshots'],
                queueLength: Math.floor(Math.random() * 5),
                totalAnalyses: Math.floor(Math.random() * 50) + 10
            },
            processes: {
                total: Math.floor(Math.random() * 3),
                active: Math.floor(Math.random() * 2)
            },
            screenshots: {
                total: Math.floor(Math.random() * 25) + 5,
                recent: Math.floor(Math.random() * 10) + 1
            }
        };
        
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent screenshots
app.get('/api/screenshots', async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        
        // Mock screenshot data
        const screenshots = [];
        for (let i = 0; i < limit; i++) {
            const timestamp = new Date(Date.now() - (i * 300000)); // 5 min intervals
            screenshots.push({
                filename: `test-${i + 1}.png`,
                path: `qb64pe-screenshots/test-${i + 1}.png`,
                timestamp: timestamp.toISOString(),
                size: Math.floor(Math.random() * 500000) + 50000,
                analyzed: Math.random() > 0.3,
                analysisResult: Math.random() > 0.3 ? {
                    shapes: Math.floor(Math.random() * 5) + 1,
                    colors: Math.floor(Math.random() * 6) + 1,
                    quality: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)]
                } : null
            });
        }
        
        res.json(screenshots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity log
app.get('/api/activity', async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        
        // Mock activity log
        const activities = [];
        const actions = [
            'Screenshot captured',
            'Analysis completed',
            'Feedback generated',
            'QB64PE process detected',
            'Monitoring started',
            'File watching started',
            'Process terminated',
            'Quality assessment completed'
        ];
        
        for (let i = 0; i < limit; i++) {
            const timestamp = new Date(Date.now() - (i * 60000)); // 1 min intervals
            activities.push({
                id: i + 1,
                timestamp: timestamp.toISOString(),
                action: actions[Math.floor(Math.random() * actions.length)],
                details: `Action ${i + 1} details`,
                level: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)]
            });
        }
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get programming feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        
        // Mock feedback data
        const feedback = [];
        const qualities = ['poor', 'fair', 'good', 'excellent'];
        const summaries = [
            'Well-structured graphics with good color variety',
            'Basic shapes detected, consider adding text elements',
            'Limited color palette, improve code organization',
            'Excellent use of modern QB64PE features',
            'Graphics quality needs improvement',
            'Good composition and layout design'
        ];
        
        for (let i = 0; i < limit; i++) {
            const timestamp = new Date(Date.now() - (i * 900000)); // 15 min intervals
            const quality = qualities[Math.floor(Math.random() * qualities.length)];
            feedback.push({
                id: i + 1,
                timestamp: timestamp.toISOString(),
                screenshotPath: `qb64pe-screenshots/test-${i + 1}.png`,
                quality,
                completeness: Math.floor(Math.random() * 40) + 60,
                accuracy: Math.floor(Math.random() * 30) + 70,
                suggestions: Math.floor(Math.random() * 8) + 1,
                summary: summaries[Math.floor(Math.random() * summaries.length)],
                topSuggestion: {
                    type: ['improvement', 'optimization', 'fix', 'enhancement'][Math.floor(Math.random() * 4)],
                    priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                    title: 'Sample suggestion title'
                }
            });
        }
        
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Control endpoints

// Start screenshot monitoring
app.post('/api/control/start-monitoring', async (req, res) => {
    try {
        const { checkInterval = 5000, captureInterval = 10000 } = req.body;
        
        // In production: call MCP server start_screenshot_monitoring
        console.log(`Starting monitoring: check=${checkInterval}ms, capture=${captureInterval}ms`);
        
        res.json({
            success: true,
            message: 'Screenshot monitoring started',
            config: { checkInterval, captureInterval }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stop screenshot monitoring
app.post('/api/control/stop-monitoring', async (req, res) => {
    try {
        // In production: call MCP server stop_screenshot_monitoring
        console.log('Stopping monitoring');
        
        res.json({
            success: true,
            message: 'Screenshot monitoring stopped'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start file watching
app.post('/api/control/start-watching', async (req, res) => {
    try {
        const { directory = 'qb64pe-screenshots', analysisType = 'comprehensive' } = req.body;
        
        // In production: call MCP server start_screenshot_watching
        console.log(`Starting watching: ${directory} (${analysisType})`);
        
        res.json({
            success: true,
            message: 'File watching started',
            config: { directory, analysisType }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stop file watching
app.post('/api/control/stop-watching', async (req, res) => {
    try {
        const { directory } = req.body;
        
        // In production: call MCP server stop_screenshot_watching
        console.log(`Stopping watching: ${directory || 'all'}`);
        
        res.json({
            success: true,
            message: 'File watching stopped'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Capture screenshot manually
app.post('/api/control/capture', async (req, res) => {
    try {
        const { windowTitle, processName, format = 'png' } = req.body;
        
        // In production: call MCP server capture_qb64pe_screenshot
        console.log(`Capturing screenshot: window=${windowTitle}, process=${processName}, format=${format}`);
        
        res.json({
            success: true,
            message: 'Screenshot capture triggered',
            filename: `manual-capture-${Date.now()}.${format}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get QB64PE processes
app.get('/api/processes', async (req, res) => {
    try {
        // Mock process data
        const processes = [];
        const processCount = Math.floor(Math.random() * 3);
        
        for (let i = 0; i < processCount; i++) {
            processes.push({
                pid: 1000 + i,
                name: 'qb64pe',
                windowTitle: `QB64PE Program ${i + 1}`,
                bounds: {
                    x: Math.floor(Math.random() * 500),
                    y: Math.floor(Math.random() * 300),
                    width: 800 + Math.floor(Math.random() * 400),
                    height: 600 + Math.floor(Math.random() * 200)
                }
            });
        }
        
        res.json(processes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Dashboard API Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 QB64PE Dashboard running at http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
    console.log(`🔧 Use this for real-time monitoring of QB64PE automation`);
    
    // Log available endpoints
    console.log(`\n📋 Available API endpoints:`);
    console.log(`   GET  /api/status     - System status`);
    console.log(`   GET  /api/screenshots - Recent screenshots`);
    console.log(`   GET  /api/activity   - Activity log`);
    console.log(`   GET  /api/feedback   - Programming feedback`);
    console.log(`   GET  /api/processes  - QB64PE processes`);
    console.log(`   POST /api/control/start-monitoring - Start monitoring`);
    console.log(`   POST /api/control/stop-monitoring  - Stop monitoring`);
    console.log(`   POST /api/control/start-watching   - Start watching`);
    console.log(`   POST /api/control/stop-watching    - Stop watching`);
    console.log(`   POST /api/control/capture          - Manual capture`);
    console.log(`   GET  /api/health     - Health check\n`);
});

module.exports = app;
