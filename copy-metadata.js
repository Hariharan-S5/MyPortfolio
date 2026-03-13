// Copy metadata.json to dist/data/ after build
// Run: node copy-metadata.js

import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'src', 'data', 'metadata.json');
const destDir = path.join(process.cwd(), 'dist', 'data');
const dest = path.join(destDir, 'metadata.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('metadata.json copied to dist/data/');
