import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function checkModels() {
  try {
    const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
    const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const apiKey = metadata.config?.geminiKey;

    if (!apiKey) {
      console.error("❌ No API Key found in metadata.json");
      process.exit(1);
    }

    console.log("🔍 Checking available models for key ending in:", apiKey.slice(-4));
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We'll try to list models for both v1 and v1beta to find the root cause
    try {
      console.log("\n--- Checking v1 Models ---");
      const result = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      const data = await result.json();
      if (data.models) {
        console.log("Available v1 Models:");
        data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
      } else {
        console.log("No models found or error:", data.error?.message || "Unknown error");
      }
    } catch (e) {
      console.error("v1 Fetch failed:", e.message);
    }

    try {
      console.log("\n--- Checking v1beta Models ---");
      const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await result.json();
      if (data.models) {
        console.log("Available v1beta Models:");
        data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
      } else {
        console.log("No models found or error:", data.error?.message || "Unknown error");
      }
    } catch (e) {
      console.error("v1beta Fetch failed:", e.message);
    }

  } catch (err) {
    console.error("❌ Diagnostic failed:", err.message);
  }
}

checkModels();
