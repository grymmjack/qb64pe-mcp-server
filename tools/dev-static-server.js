const express = require('express');
const path = require('path');
const serveIndex = require('serve-index');
const cors = require('cors');

const PORT = process.env.STATIC_PORT || 5173;
const ROOT = path.resolve(process.env.STATIC_DIR || './qb64pe-screenshots');

const app = express();

// CORS (simple and permissive for local tooling)
app.use(cors());

// No-cache for rapid overwrite workflows
app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Static hosting with index.html priority
app.use(express.static(ROOT, {
  etag: false,
  lastModified: false,
  maxAge: 0,
  index: ['index.html'],  // Serve index.html as default
  setHeaders: (res, filePath) => {
    // Set proper MIME types for web-friendly image formats
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.bmp')) {
      res.setHeader('Content-Type', 'image/bmp');
    }
    // Additional no-cache headers for images
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Directory listing only for /files/ path  
app.use('/files/', serveIndex(ROOT, { 
  icons: true,
  view: 'details'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    serving: ROOT,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🖼️  QB64PE Screenshot Server`);
  console.log(`📁 Serving: ${ROOT}`);
  console.log(`🌐 URL: http://localhost:${PORT}/`);
  console.log(`💡 Tip: Open VS Code → View → Command Palette → "Simple Browser: Show"`);
  console.log(`📋 Then paste: http://localhost:${PORT}/`);
  console.log(`🔄 Screenshots will auto-refresh (no cache)`);
});
