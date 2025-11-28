import { GoogleGenAI } from "@google/genai";

// Helper to safely get the API key without crashing in browser environments where 'process' is undefined
const getApiKey = (): string | undefined => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Error accessing process.env:", e);
  }
  return undefined;
};

export const askAiTutor = async (
  code: string,
  context: string,
  language: string
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn("API Key is missing. AI features are disabled.");
      return "AI assistance is currently unavailable because the API key is missing. Please check your configuration.";
    }

    // Initialize the client only when needed
    const ai = new GoogleGenAI({ apiKey });
    
    const model = "gemini-2.5-flash";
    const systemInstruction = `You are a friendly and encouraging coding tutor for the softvibe platform. 
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
    return "Sorry, I'm having trouble connecting to the AI tutor right now. Please check your connection.";
  }
};