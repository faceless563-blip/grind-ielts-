import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeIELTSWriting(task1: string, task2: string) {
  const prompt = `
    As an expert IELTS examiner, evaluate these two CBT (Computer Based Test) writing tasks.
    
    Task 1:
    ${task1}
    
    Task 2:
    ${task2}
    
    Provide a detailed evaluation in JSON format including:
    1. Estimated Band Score for each task and overall.
    2. Feedback for Task 1 and Task 2 (Grammatical Range, Lexical Resource, Task Response, Coherence/Cohesion).
    3. List of key misspellings found (important for CBT).
    4. 3 actionable tips for improvement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.NUMBER },
            task1Band: { type: Type.NUMBER },
            task2Band: { type: Type.NUMBER },
            feedbackTask1: { type: Type.STRING },
            feedbackTask2: { type: Type.STRING },
            misspellings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["overallBand", "task1Band", "task2Band", "feedbackTask1", "feedbackTask2", "misspellings", "tips"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}
