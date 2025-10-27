import { GoogleGenAI } from "@google/genai";

const API_KEY: string = 'AIzaSyBaIc1_ZoW584JtCZUpJxUAxbXnwAMDocA'; // direct key

if (!API_KEY) {
  console.warn("Gemini API key is not set. AI features will not be available.");
}

// Explicitly type the client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getTroubleshootingSteps = async (problemDescription: string): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Please set the API_KEY variable.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: problemDescription,
      config: {
        systemInstruction:
          "You are an expert lab instrument technician. A user will describe an issue they are having with a piece of equipment. Your task is to provide clear, concise, and safe troubleshooting steps. Structure your response in markdown format. Start with a brief summary of the likely problem, then provide a numbered list of steps to resolve it. If the problem is complex or requires a certified technician, state that clearly.",
      },
    });

    // Ensure the response is correctly typed
    return typeof response.text === "string"
      ? response.text
      : JSON.stringify(response);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
};

export const geminiService = {
  getTroubleshootingSteps,
};
