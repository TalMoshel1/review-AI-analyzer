import OpenAI from "openai";
import { NextResponse } from "next/server";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { reviews } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional review analyzer. Return ONLY a valid JSON object.",
        },
        {
          role: "user",
          // content: `Analyze these reviews and return a JSON object with: 
          // 1. sentimentScore (0-100)
          // 2. summary (short paragraph)
          // 3. pros (array of strings)
          // 4. cons (array of strings)
          // 5. chartData: an array of objects (at least 5 categories), each containing:
          //    - 'subject': the category name (e.g., "Sound Quality")
          //    - 'score': 1-10
          //    - 'representativeReview': a specific short quote from the reviews that justifies this score.
          
          // Reviews to analyze: ${reviews}`,
          content: `You are a reviews Analyzer. 
             STRICT RULES:
1. Use ONLY the provided text. Do not invent reviews or sample sizes.
2. Count the EXACT number of reviews provided and refer to that number in your reasoning.
3. For each category in 'chartData', explain the score based on the SPECIFIC content of the provided text.



Analyze these reviews and return a JSON object with: 
1. sentimentScore (0-100)
2. summary (short paragraph)
3. pros (array of strings)
4. cons (array of strings)
5. chartData: an array of objects (5-7 categories), each containing:
   - 'subject': category name
   - 'score': 1-10
   - 'reasoning': Explain the "math" (e.g., "7 out of 10 reviews mentioned long battery life", "High intensity negative words used regarding price").
   - 'representativeReview': a short direct quote.



Reviews: ${reviews}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || "{}"));

  } catch (error: any) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}