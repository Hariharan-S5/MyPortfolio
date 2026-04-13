import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function findWorkingModel() {
  try {
    const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
    const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const apiKey = metadata.config?.geminiKey;

    if (!apiKey) {
      console.error("❌ No API Key found");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 1. Get the real list of models again
    const listResult = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const listData = await listResult.json();
    
    if (!listData.models) {
      console.error("❌ Could not list models:", listData.error);
      return;
    }

    console.log(`📡 Found ${listData.models.length} potential models. Testing them one by one...\n`);

    for (const m of listData.models) {
      const modelName = m.name.replace('models/', '');
      
      // We only care about models that support content generation
      if (!m.supportedGenerationMethods.includes('generateContent')) continue;

      console.log(`🧪 Testing: ${modelName} ...`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await Promise.race([
          model.generateContent("Hi"),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
        ]);
        
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        console.log(`👉 SOLUTION: Switch to "${modelName}" in vite.config.js`);
        process.exit(0);
      } catch (err) {
        if (err.message.includes("429") || err.message.includes("quota")) {
          console.log(`🚫 QUOTA EXCEEDED: ${modelName}`);
        } else if (err.message.includes("404")) {
          console.log(`❓ NOT FOUND: ${modelName}`);
        } else {
          console.log(`❌ FAILED: ${modelName} (${err.message.slice(0, 50)}...)`);
        }
      }
    }

    console.log("\n❌ No working models found with active quota.");

  } catch (err) {
    console.error("❌ Diagnostic error:", err.message);
  }
}

findWorkingModel();
