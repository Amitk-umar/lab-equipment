import { GoogleGenAI } from "@google/genai";

const API_KEY = 'AIzaSyBaIc1_ZoW584JtCZUpJxUAxbXnwAMDocA'

if (!API_KEY) {
  console.warn("Gemini API key is not set. AI features will not be available.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const getTroubleshootingSteps = async (problemDescription: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Gemini API key not configured. Please set the API_KEY environment variable.");
  }
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: problemDescription,
        config: {
          systemInstruction: "You are an expert lab instrument technician. A user will describe an issue they are having with a piece of equipment. Your task is to provide clear, concise, and safe troubleshooting steps. Structure your response in markdown format. Start with a brief summary of the likely problem, then provide a numbered list of steps to resolve it. If the problem is complex or requires a certified technician, state that clearly.",
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};

export const geminiService = {
  getTroubleshootingSteps,
};