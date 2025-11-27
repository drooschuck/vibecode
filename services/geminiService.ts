import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
// Note: In a real production app, requests should be proxied through a backend to hide the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askAiTutor = async (
  code: string,
  context: string,
  language: string
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are a friendly and encouraging coding tutor for the CodeMaster platform. 
    Your student is learning ${language}. 
    Analyze the provided code and the lesson context. 
    If the user asks for help, provide a hint, not the full solution immediately. 
    If the code has errors, explain them simply. 
    Keep responses concise (under 150 words) and formatted with Markdown.`;

    const prompt = `
    Context/Lesson: ${context}
    
    Student's Current Code:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
    
    Please analyze the code and provide helpful feedback or a hint to move forward.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI tutor right now. Please check your connection or API key.";
  }
};
