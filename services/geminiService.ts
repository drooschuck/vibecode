import { GoogleGenAI } from "@google/genai";

export const askAiTutor = async (
  code: string,
  context: string,
  language: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-pro-preview for complex coding tasks as per guidelines
    const model = "gemini-3-pro-preview";
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
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 4000 } // Enable reasoning for pedagogical depth
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error: any) {
    console.error("Gemini Tutor Error:", error);
    // Throw error so App.tsx can handle specific cases like key selection
    throw error;
  }
};

export const executeCode = async (
  code: string,
  language: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are a code execution engine. 
    Your task is to simulate the execution of the provided ${language} code and return ONLY the standard output (stdout).
    Do not provide explanations, markdown formatting, or introductory text.
    If there are syntax errors or logic errors, simulate the error message a real compiler/interpreter would produce.
    If the code is empty or only contains comments, return an empty string.`;

    const prompt = `
    Code to execute:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
    
    Return the simulated output now.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Execution Simulation Error:", error);
    throw error;
  }
};
