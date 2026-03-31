import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function metadataApi() {
  return {
    name: 'metadata-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/metadata' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
              const jsonData = JSON.parse(body);
              fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              console.error('API Error writing metadata:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to write metadata' }));
            }
          });
        } else if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { filename, base64, folder = 'projects' } = JSON.parse(body);
              const uploadDir = path.resolve(process.cwd(), `public/${folder}`);
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              const filePath = path.resolve(uploadDir, filename);
              // Safely strip standard base64 data URIs for images or PDFs
              const base64Data = base64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: `/${folder}/${filename}` }));
            } catch (err) {
              console.error('API Error uploading file:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to upload file' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), metadataApi()],
});
