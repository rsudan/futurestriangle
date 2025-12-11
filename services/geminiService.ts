
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Source, GeneratedContent, AnalysisResult, TriangleDimension } from '../types';

const getClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is missing. Please set it in Settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        // Lightweight call to check validity
        await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Test",
        });
        return true;
    } catch (e) {
        console.error("API Key validation failed:", e);
        return false;
    }
};

export const DEFAULT_SUGGESTION_PROMPT = `
You are an expert futurist and strategic foresight analyst.
For the topic "{{topic}}", generate content for the "{{dimension}}" dimension of the Futures Triangle.
Please {{explanation}}.
Your response must be grounded in real-world data.
Respond ONLY with a valid JSON object following this exact schema, with no additional text or markdown formatting:
{
  "content": "A detailed paragraph explaining the concept in this dimension.",
  "confidence": <A number from 0 to 100 representing your confidence in the content's accuracy>
}
`.trim();

export const DEFAULT_ANALYSIS_PROMPT = `
You are an expert futurist and strategic foresight analyst. Analyze the following three dimensions of the Futures Triangle and identify the key tensions, contradictions, and synergies between them. Structure your analysis into clear sections.

1.  **Weight of the Past (Barriers & Legacies):**
    {{past}}

2.  **Push of the Present (Trends & Drivers):**
    {{present}}

3.  **Pull of the Future (Vision & Aspirations):**
    {{future}}

Your analysis should be insightful, pointing out where the past holds back the future, where present trends conflict with the desired vision, and where there are alignments that could accelerate progress. Your response must be grounded in verifiable sources.
`.trim();

const parseSources = (response: GenerateContentResponse): Source[] => {
  const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!rawChunks) return [];
  return rawChunks.map(chunk => ({
    uri: chunk.web?.uri || '#',
    title: chunk.web?.title || 'Untitled Source',
  })).filter(source => source.uri !== '#');
};

const cleanJsonString = (str: string): string => {
  return str.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
};

export const generateSuggestion = async (topic: string, dimension: TriangleDimension, promptTemplate: string = DEFAULT_SUGGESTION_PROMPT, apiKey?: string): Promise<GeneratedContent> => {
  const dimensionExplanation = {
    [TriangleDimension.Future]: "focus on visions, aspirations, and desired images of the future.",
    [TriangleDimension.Present]: "focus on current trends, technological shifts, and data-driven drivers.",
    [TriangleDimension.Past]: "focus on historical legacies, deep-seated beliefs, and systemic barriers.",
  };

  const explanation = dimensionExplanation[dimension];
  
  const prompt = promptTemplate
    .replace(/{{topic}}/g, topic)
    .replace(/{{dimension}}/g, dimension)
    .replace(/{{explanation}}/g, explanation);

  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources = parseSources(response);
    const rawText = response.text;
    const jsonString = cleanJsonString(rawText);
    
    let parsedJson;
    try {
        parsedJson = JSON.parse(jsonString);
    } catch(e) {
        console.error("Failed to parse JSON from Gemini response:", jsonString);
        throw new Error("AI response was not in the expected JSON format.");
    }

    return {
      content: parsedJson.content || "No content generated.",
      confidence: parsedJson.confidence || 0,
      sources: sources,
    };
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw new Error('Failed to generate suggestion from AI.');
  }
};


export const generateAnalysis = async (past: string, present: string, future: string, promptTemplate: string = DEFAULT_ANALYSIS_PROMPT, apiKey?: string): Promise<AnalysisResult> => {
  const prompt = promptTemplate
    .replace(/{{past}}/g, past || "No input provided.")
    .replace(/{{present}}/g, present || "No input provided.")
    .replace(/{{future}}/g, future || "No input provided.");
    
  try {
      const ai = getClient(apiKey);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
      });
    
      const sources = parseSources(response);
    
      return {
        analysis: response.text,
        sources: sources,
      };

  } catch (error) {
    console.error('Error generating analysis:', error);
    throw new Error('Failed to generate analysis from AI.');
  }
};
