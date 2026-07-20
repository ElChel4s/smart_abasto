import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake-key');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    await model.generateContent("test");
    console.log("Success");
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}

test();
