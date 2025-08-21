const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 5174;
const ROOT = path.resolve('./qb64pe-screenshots');

const app = express();

console.log(`Serving directory: ${ROOT}`);

// Directory listing endpoint for dynamic file discovery
app.get('/files/', (req, res) => {
  try {
    const files = fs.readdirSync(ROOT);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
    });
    
    // Generate simple HTML directory listing
    const html = `
    <html>
    <head><title>Directory listing</title></head>
    <body>
    <h1>Directory listing for /</h1>
    <hr>
    ${imageFiles.map(file => `<a href="${file}">${file}</a><br>`).join('\n')}
    <hr>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Unable to read directory' });
  }
});

// JSON API for file listing
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(ROOT);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
    }).map(file => {
      const stats = fs.statSync(path.join(ROOT, file));
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    });
    
    res.json({ files: imageFiles });
  } catch (error) {
    res.status(500).json({ error: 'Unable to read directory' });
  }
});

// Simple static file serving with index.html as default
app.use(express.static(ROOT, {
  index: ['index.html'],
  setHeaders: (res, filePath) => {
    // No cache headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Set proper MIME types
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    serving: ROOT,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🖼️  QB64PE Screenshot Server (Simple)`);
  console.log(`📁 Serving: ${ROOT}`);
  console.log(`🌐 URL: http://localhost:${PORT}/`);
  console.log(`💡 Test: http://localhost:${PORT}/index.html`);
});
