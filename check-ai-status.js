import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function diagnose() {
  console.log("\n🚀 INITIALIZING GEMINI AI DIAGNOSTIC...");
  console.log("======================================");

  try {
    const dataPath = path.resolve(process.cwd(), 'src/data/metadata.json');
    const metadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const apiKey = metadata.config?.geminiKey;

    if (!apiKey) {
      console.log("❌ ERROR: No API Key found in metadata.json");
      return;
    }

    console.log(`🔑 Key Detected: ****${apiKey.slice(-4)}`);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Fetch real list from v1 endpoint
    const listResult = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const listData = await listResult.json();
    
    if (!listData.models) {
      console.log("❌ ERROR: Could not fetch model list from Google.");
      if (listData.error) console.log(`   Message: ${listData.error.message}`);
      return;
    }

    console.log(`📡 Models found on your account: ${listData.models.length}\n`);
    
    const allowed = [];
    const restricted = [];

    for (const m of listData.models) {
      const modelName = m.name.replace('models/', '');
      
      // Filter for generation models only
      if (!m.supportedGenerationMethods.includes('generateContent')) continue;

      process.stdout.write(`🧪 Testing ${modelName.padEnd(25)} ... `);
      
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Use a 5s timeout to keep it fast
        const result = await Promise.race([
          model.generateContent("Test"),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
        ]);
        
        console.log("✅ ALLOWED");
        allowed.push(modelName);
      } catch (err) {
        if (err.message.includes("429") || err.message.includes("quota")) {
          console.log("🚫 NO QUOTA (429)");
          restricted.push({ name: modelName, reason: "Quota Exceeded / Free Tier Limit" });
        } else if (err.message.includes("403")) {
          console.log("🔒 FORBIDDEN (403)");
          restricted.push({ name: modelName, reason: "Permission Denied" });
        } else {
          console.log("❌ FAILED");
          restricted.push({ name: modelName, reason: err.message.split('\n')[0].slice(0, 40) });
        }
      }
    }

    console.log("\n======================================");
    console.log("📝 FINAL REPORT");
    console.log("======================================");
    
    console.log("\n✅ ALLOWED MODELS (Ready to use):");
    if (allowed.length > 0) {
      allowed.forEach(m => console.log(`   - ${m}`));
    } else {
      console.log("   (None found)");
    }

    console.log("\n🚫 NON-ALLOWING / RESTRICTED MODELS:");
    if (restricted.length > 0) {
      restricted.forEach(m => console.log(`   - ${m.name.padEnd(25)} [${m.reason}]`));
    } else {
      console.log("   (None found)");
    }

    if (allowed.length > 0) {
        console.log(`\n💡 RECOMMENDATION: Use "${allowed[0]}" for the best experience.`);
    } else {
        console.log("\n💡 RECOMMENDATION: Try checking your API key in Google AI Studio.");
    }
    console.log("======================================\n");

  } catch (err) {
    console.log("\n❌ DIAGNOSTIC CRASHED:", err.message);
  }
}

diagnose();
