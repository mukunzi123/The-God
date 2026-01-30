
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBibleReflection = async (verse: string, language: Language = 'English'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a thoughtful, short reflection (2-3 paragraphs) on the Bible verse: "${verse}". 
      Write the entire reflection in the ${language} language.
      Contextualize it slightly for the people of Rwanda, focusing on themes of hope, unity, and faith. 
      Use a warm and pastoral tone.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "No reflection could be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating reflection in ${language}. Please write manually.`;
  }
};

export const generateMinistryImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, professional, and inspiring photography-style image for a Christian ministry in Rwanda. 
            The scene should be: ${prompt}. 
            Style: Soft natural lighting, cinematic composition, warm colors, hopeful atmosphere. 
            Avoid blurry elements, focus on sharp details.`
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const fetchBiblePassage = async (reference: string, language: Language = 'English'): Promise<{ verse: string; context: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide the full text of the Bible passage: "${reference}". 
      The text MUST be in the ${language} language. 
      Also provide a very brief historical or thematic context (1-2 sentences) in ${language}.
      Format the output as a JSON object with keys "text" and "context". 
      Do not include markdown formatting like \`\`\`json.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      verse: data.text || "Passage not found.",
      context: data.context || "No context available."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { verse: "Unable to retrieve the passage at this moment.", context: "" };
  }
};

export const createFaithChat = (language: Language) => {
  const chatAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return chatAi.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the "BSR Faith Assistant", a wise and compassionate spiritual guide for the Bible Society of Rwanda.
      Your goal is to help users engage deeply with the Bible. 
      - Always respond in ${language}.
      - Use a pastoral, encouraging, and respectful tone.
      - When quoting scripture, mention the reference.
      - Provide comfort, theological explanations, or prayer when requested.
      - Be sensitive to the Rwandan context of reconciliation and faith.`,
    },
  });
};
