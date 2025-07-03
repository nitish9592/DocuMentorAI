import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  category: string;
  tags: string[];
  confidence: number;
}

export async function generateDocumentSummary(text: string, filename: string): Promise<DocumentSummary> {
  try {
    const prompt = `
    Please analyze the following document text and provide a comprehensive summary with categorization. 
    The document filename is: ${filename}
    
    Document text:
    ${text}
    
    Please respond with a JSON object containing:
    - summary: A concise but comprehensive summary (2-3 sentences)
    - keyPoints: An array of 3-5 key points from the document
    - category: A single category (e.g., "Finance", "Marketing", "Technical", "Legal", "HR", "Operations")
    - tags: An array of 2-4 relevant tags
    - confidence: A number between 0 and 1 representing confidence in the analysis
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert document analyst. Analyze documents and provide structured summaries in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "No summary available",
      keyPoints: result.keyPoints || [],
      category: result.category || "General",
      tags: result.tags || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI summary: " + (error as Error).message);
  }
}

export async function regenerateSummary(documentId: number, text: string, filename: string): Promise<DocumentSummary> {
  return generateDocumentSummary(text, filename);
}
