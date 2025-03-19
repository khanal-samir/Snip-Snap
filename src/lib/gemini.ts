import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeCode(code: string) {
  try {
    const prompt = `Analyze this code and provide 3 paragraphs with simple text no bold fonts and topics name at the top also make it easy to read:
     1. A brief description
     2. Potential improvements
     3. Language detection
     Code:
     ${code}
     `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log(err);
    return null;
  }
}
