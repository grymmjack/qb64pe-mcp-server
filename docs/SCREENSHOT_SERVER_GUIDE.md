# QB64PE Screenshot Server - VS Code Integration Guide

## 🎯 Problem Solved

**Issue**: VS Code Simple Browser cannot view local `file://` BMP screenshots due to webview security restrictions.

**Solution**: Local HTTP server serving screenshots with proper MIME types, CORS, and no-cache headers for live viewing.

## 🚀 Quick Start

### 1. Start the Screenshot Server

Choose one of these methods:

**Option A: VS Code Task (Recommended)**
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type: `Tasks: Run Task`
3. Select: `Start QB64PE Screenshot Server`

**Option B: Terminal Command**
```bash
npm run start:server
```

**Option C: Manual**
```bash
node tools/dev-static-server.js
```

### 2. View Screenshots in VS Code

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type: `Simple Browser: Show`
3. Enter URL: `http://localhost:5173/`
4. Browse and click screenshots to view full-size

## 📁 Directory Structure

```
qb64pe-screenshots/
├── index.html              # Live dashboard with auto-refresh
├── red-circle-test.bmp     # Test screenshots
├── grid-shapes-test.bmp    
├── *.bmp                   # All QB64PE generated images
└── *-viewer.html           # Generated analysis viewers
```

## 🔧 Server Features

### Core Functionality
- ✅ **Serves BMP files** with correct `image/bmp` MIME type
- ✅ **No caching** - images refresh immediately when overwritten
- ✅ **CORS enabled** - works with VS Code webviews
- ✅ **Directory listing** - browse all files easily
- ✅ **Auto-discovery** - finds all BMP/PNG files automatically

### Live Dashboard (`http://localhost:5173/`)
- ✅ **Auto-refresh** every 3 seconds
- ✅ **Responsive grid** layout
- ✅ **Modal viewing** for full-size images
- ✅ **File info** showing size and timestamps
- ✅ **HTTP URLs** ready for copying

### HTTP Endpoints
- `GET /` - Live dashboard with all screenshots
- `GET /{filename}.bmp` - Direct image access
- `GET /health` - Server status check

## 📊 Integration with QB64PE Workflow

### Before (File URLs - Blocked)
```
QB64PE Program → Screenshot.bmp → file:///.../screenshot.bmp ❌
```

### After (HTTP Server - Works)
```
QB64PE Program → Screenshot.bmp → http://localhost:5173/screenshot.bmp ✅
```

### Enhanced Analysis Output
```javascript
// Old output
"Screenshot saved: screenshots/test.bmp"

// New output  
"Screenshot saved: screenshots/test.bmp"
"🌐 View in browser: http://localhost:5173/test.bmp"
"📋 Dashboard: http://localhost:5173/"
```

## 🎮 Usage Examples

### Running QB64PE Graphics Tests

1. **Start Server**: `npm run start:server`
2. **Run QB64PE Program**: `qb64pe -x test-program.bas`
3. **Auto-Analysis**: `npm run analyze:graphics`
4. **View Results**: Open provided HTTP URLs in Simple Browser

### Real-time Development Workflow

1. **Keep server running** in background
2. **Edit QB64PE program** → compile → run
3. **Screenshots auto-update** in dashboard
4. **Refresh browser** to see latest results
5. **No manual file copying** needed

## 🔗 URL Patterns

### Direct Image Access
```
http://localhost:5173/red-circle-test.bmp
http://localhost:5173/grid-shapes-animated.bmp
http://localhost:5173/my-program-screenshot.bmp
```

### Dashboard Views
```
http://localhost:5173/                    # Live auto-refresh dashboard
http://localhost:5173/index.html          # Same as above
```

### Generated Viewers
```
http://localhost:5173/universal-screenshot-viewer.html
http://localhost:5173/grid-and-shapes-test-viewer.html
http://localhost:5173/all-tests-viewer.html
```

## ⚙️ Configuration

### Environment Variables
```bash
STATIC_PORT=5173                    # Server port (default: 5173)
STATIC_DIR=./qb64pe-screenshots     # Directory to serve (default: qb64pe-screenshots)
```

### Custom Port
```bash
STATIC_PORT=8080 npm run start:server
```

### Custom Directory
```bash
STATIC_DIR=./my-screenshots npm run start:server
```

## 🛠️ Technical Details

### Server Implementation
- **Framework**: Express.js with serve-index
- **MIME Types**: Proper BMP image handling
- **Caching**: Disabled for live development
- **CORS**: Permissive for local tooling

### VS Code Integration
- **Tasks**: Automated server start/stop
- **Simple Browser**: Built-in webview for viewing
- **Command Palette**: Easy access to browser commands

### Performance
- **Startup Time**: ~1 second
- **Memory Usage**: Minimal (serves files directly)
- **Live Updates**: Instant refresh on file changes

## 🚨 Troubleshooting

### Server Won't Start
```bash
# Check if port is in use
netstat -an | findstr :5173

# Try different port
STATIC_PORT=8080 npm run start:server
```

### Images Not Loading
- ✅ Verify server is running: `http://localhost:5173/health`
- ✅ Check file exists in `qb64pe-screenshots/` directory
- ✅ Refresh browser (Ctrl+F5) to bypass any caching

### VS Code Simple Browser Issues
- ✅ Use HTTP URLs, not file:// URLs
- ✅ Ensure server is running before opening browser
- ✅ Try closing and reopening Simple Browser

## 📈 Benefits

### For Developers
- ✅ **Instant Visual Feedback** - See QB64PE output immediately
- ✅ **No File Management** - No copying/moving screenshots
- ✅ **Live Updates** - Changes appear instantly
- ✅ **Cross-Platform** - Works on Windows/Mac/Linux

### For LLM Analysis
- ✅ **Reliable Access** - HTTP URLs always work
- ✅ **Consistent Format** - Standardized image serving
- ✅ **Metadata Available** - File size, timestamps included
- ✅ **Batch Analysis** - Multiple images in single view

### For Team Collaboration
- ✅ **Shareable URLs** - Easy to copy/paste links
- ✅ **Version Control Friendly** - No binary files in repo
- ✅ **Documentation Ready** - URLs work in markdown/docs

## 🎯 Next Steps

### Enhancements
- [ ] **WebSocket Support** - Real-time push updates
- [ ] **Image Comparison** - Side-by-side diff views
- [ ] **Animation Support** - GIF generation from sequences
- [ ] **Zoom/Pan** - Better image inspection tools

### Integration
- [ ] **CI/CD Pipeline** - Automated screenshot testing
- [ ] **Cloud Storage** - Upload to external services
- [ ] **Database Logging** - Track screenshot history
- [ ] **Performance Metrics** - Analyze rendering performance

## 📋 Checklist for Success

- ✅ Server starts without errors
- ✅ Dashboard loads at `http://localhost:5173/`
- ✅ BMP files display correctly in browser
- ✅ Images refresh when files are overwritten
- ✅ VS Code Simple Browser opens HTTP URLs
- ✅ No console errors about blocked resources
- ✅ QB64PE programs generate visible screenshots

**Status**: ✅ Production ready for QB64PE graphics development and analysis!
