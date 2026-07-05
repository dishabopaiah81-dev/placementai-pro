import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { question, userAnswer, profile } = await request.json();

    // STRICT CHECK: If you skip a question, leave it empty, or just type spaces, return 0 immediately
    if (!userAnswer || String(userAnswer).trim() === "" || String(userAnswer).trim() === "null" || String(userAnswer).trim() === "undefined") {
      return NextResponse.json({ score: 0 });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Using json response mode to guarantee we get a strict mathematical number back
   const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
});

    const prompt = `Act as an ultra-realistic, critically strict tech recruiter evaluating Deena's answer.
    
    Candidate Profile (Resume Data): "${profile}"
    Interview Question Asked: "${question}"
    Deena's Inputted Answer: "${userAnswer}"
    
    CRITICAL EVALUATION ENGINE RULES:
    1. DO NOT give generic numbers or safe average scores (like 72). Every score must dynamically change based on the quality of her answer.
    2. Assess her response strictly on the STAR Method (Situation, Task, Action, Result). 
       - If she provides a weak, superficial, or generic answer without details, calculate a low score (e.g., 20-50).
       - If she fails to mention specific technical tools, programming languages, or clear outcomes, deduct points honestly.
       - If she provides an excellent, detailed, metric-driven answer matching her profile, calculate a high score (e.g., 85-95).
    3. Be completely honest. A real recruiter does not sugarcoat placement readiness.

    Return your response strictly in the following JSON format:
    {
      "score": <Calculate a dynamic mathematical integer score between 0 and 100 based entirely on the quality rules above>
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    const data = JSON.parse(text);
    const score = parseInt(data.score, 10);
    
    return NextResponse.json({ score: isNaN(score) ? 0 : score });
  } catch (error) {
    console.error("Backend error:", error);
    return NextResponse.json({ score: 0 });
  }
}