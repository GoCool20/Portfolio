import { GoogleGenAI } from "@google/genai";
import { Profile, Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface OptimizationResult {
  improvedBio: string;
  projectSuggestions: { projectId: string; suggestion: string }[];
  generalFeedback: string;
}

export const optimizePortfolio = async (profile: Profile, projects: Project[]): Promise<OptimizationResult> => {
  const projectContext = projects.map(p => `ID: ${p.id}\nTitle: ${p.title}\nDescription: ${p.description}`).join('\n---\n');

  const prompt = `
    You are an expert technical recruiter and portfolio consultant. 
    Analyze the following portfolio content and provide specific, actionable improvements.
    
    Current Bio: "${profile.bio}"
    
    Current Projects:
    ${projectContext}
    
    Please provide the output in the following JSON format ONLY (no markdown code blocks):
    {
      "improvedBio": "A rewritten version of the bio that is more impactful, professional, and uses strong action verbs.",
      "projectSuggestions": [
        { "projectId": "id_from_input", "suggestion": "A rewritten, punchy description for this project focusing on tech stack and outcome." }
      ],
      "generalFeedback": "A short paragraph on overall portfolio strength and missing keywords."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as OptimizationResult;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    throw error;
  }
};

export const getAiSuggestion = async (field: string, context: string): Promise<string> => {
    const prompt = `
        You are a helpful portfolio assistant.
        The user is writing content for their "${field}".
        Context/Existing Content: "${context}"
        
        Write a professional, concise, and impactful version of this content suitable for a portfolio.
        Return ONLY the suggested text, no explanations.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text?.trim() || context;
    } catch (error) {
        console.error("Gemini Suggestion Error:", error);
        return context;
    }
}