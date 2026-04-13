import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
import crypto from 'crypto';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

function metadataApi(env) {
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
        } else if (req.url === '/api/parse-resume' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { base64 } = JSON.parse(body);
              const base64Data = base64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
              const buffer = Buffer.from(base64Data, 'base64');

              // 1. Parse PDF
              const pdfData = await pdf(buffer);
              const text = pdfData.text;

              // 2. Setup Gemini
              const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
              const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
              const apiKey = metadata.config?.geminiKey;

              if (!apiKey) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Missing Gemini API Key in metadata.json. Please configure it in the Admin Dashboard.' }));
                return;
              }

              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }, { apiVersion: "v1" });

              // 3. Prompt
              const prompt = `You are a professional resume parser. Read the following resume text and extract the candidate's details into a JSON object that strictly matches this schema formatting. Return ONLY the raw JSON format without markdown ticks. 
Make sure you use ALL available info.
{
  "name": "Full Name",
  "title": "Professional Title (e.g., Software Engineer, Data Analyst)",
  "location": "City, Country",
  "about": "A concise summary or objective extracted from the resume",
  "experience": [
    { "company": "Company Name", "role": "Job Title", "duration": "Start Date - End Date", "description": "Short description of what they did" }
  ],
  "education": [
    { "school": "University Name", "degree": "Degree and major", "year": "Graduation Year", "gpa": "GPA if available" }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "projects": [
    { "title": "Project Name", "description": "Project Description", "tech": ["Tech 1"], "category": "General Category" }
  ],
  "contact": {
    "email": "Email address", "github": "GitHub URL", "linkedin": "LinkedIn URL"
  }
}

Resume Text to parse:
${text}`;

              // 4. Generate & clean
              const result = await model.generateContent(prompt);
              let responseText = result.response.text();
              responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

              const parsedData = JSON.parse(responseText);

              // Update stats locally
              const today = new Date().toISOString().split('T')[0];
              if (!metadata.config.stats) metadata.config.stats = { dailyRequests: 0, lastReset: "" };
              if (metadata.config.stats.lastReset !== today) {
                metadata.config.stats.dailyRequests = 1;
                metadata.config.stats.lastReset = today;
              } else {
                metadata.config.stats.dailyRequests += 1;
              }
              fs.writeFileSync(dataPath, JSON.stringify(metadata, null, 2), 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: parsedData }));
            } catch (err) {
              console.error('API Error parsing resume:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || "AI Processing Error. Please check your connection." }));
            }
          });
        } else if (req.url === '/api/config' && req.method === 'GET') {
          try {
            const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
            const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              geminiKey: metadata.config?.geminiKey || '',
              adminAccessKey: metadata.config?.adminAccessKey || '45729181a21304931555490a74f362451b681dd358ea7d427ba26562d8881dd2',
              theme: metadata.config?.theme || 'light',
              github: metadata.config?.github || { token: "", repo: "", branch: "main" },
              stats: metadata.config?.stats || { dailyRequests: 0, lastReset: "" }
            }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read config' }));
          }
        } else if (req.url === '/api/config' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
            try {
              const updates = JSON.parse(body);
              const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
              const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

              if (!metadata.config) metadata.config = {};

              // Apply updates
              if (updates.geminiKey !== undefined) metadata.config.geminiKey = updates.geminiKey;
              if (updates.theme !== undefined) metadata.config.theme = updates.theme;
              if (updates.github !== undefined) {
                metadata.config.github = { ...metadata.config.github, ...updates.github };
              }
              if (updates.adminAccessKey !== undefined) {
                // Securely hash the access key before storing it
                const hashedKey = crypto.createHash('sha256').update(updates.adminAccessKey).digest('hex');
                metadata.config.adminAccessKey = hashedKey;
              }

              fs.writeFileSync(dataPath, JSON.stringify(metadata, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to update config' }));
            }
          });
        } else if (req.url === '/api/sync-github' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', async () => {
            try {
              const { token, repo, branch } = JSON.parse(body);
              if (!token || !repo) throw new Error("Missing GitHub credentials");

              const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
              const content = fs.readFileSync(dataPath, 'utf-8');
              const filePath = "src/data/metadata.json";
              
              const authHeader = `Bearer ${token}`;
              const baseUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

              // 1. Get current SHA
              const getRes = await fetch(`${baseUrl}?ref=${branch}`, {
                headers: { 'Authorization': authHeader, 'Accept': 'application/vnd.github.v3+json' }
              });
              
              let sha;
              if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
              }

              // 2. Push Update
              const putRes = await fetch(baseUrl, {
                method: 'PUT',
                headers: { 
                  'Authorization': authHeader, 
                  'Content-Type': 'application/json',
                  'Accept': 'application/vnd.github.v3+json' 
                },
                body: JSON.stringify({
                  message: "Portfolio update via Admin Dashboard",
                  content: Buffer.from(content).toString('base64'),
                  sha: sha,
                  branch: branch
                })
              });

              const result = await putRes.json();
              if (!putRes.ok) throw new Error(result.message || "GitHub Sync Failed");

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, commit: result.commit.html_url }));
            } catch (err) {
              console.error('GitHub Sync Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.url === '/api/verify-gemini' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', async () => {
            try {
              const { geminiKey } = JSON.parse(body);
              if (!geminiKey) throw new Error('Key is empty');
              // Use direct fetch to verify the key against the listModels endpoint
              // This is the most reliable way to check API key validity
              const verifyUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`;
              const response = await fetch(verifyUrl);
              const data = await response.json();

              if (response.ok) {
                // Update stats locally
                const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
                const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                if (!metadata.config.stats) metadata.config.stats = { dailyRequests: 0, lastReset: "" };
                const today = new Date().toISOString().split('T')[0];
                if (metadata.config.stats.lastReset !== today) {
                  metadata.config.stats.dailyRequests = 1;
                  metadata.config.stats.lastReset = today;
                } else {
                  metadata.config.stats.dailyRequests += 1;
                }
                fs.writeFileSync(dataPath, JSON.stringify(metadata, null, 2), 'utf-8');

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                const errorMsg = data.error?.message || 'API key not valid. Please pass a valid API key';
                res.statusCode = 400;
                res.end(JSON.stringify({ error: errorMsg }));
              }
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'API key not valid. Please pass a valid API key' }));
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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), metadataApi(env)],
    base: '/MyPortfolio/',
  };
});
