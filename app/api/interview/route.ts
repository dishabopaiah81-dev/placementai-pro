import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");

    const body = await request.json();
    const resumeText = body.resumeText || "";

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text too short.");
    }

    const compressedResume = compressResume(resumeText);

    const questionPrompt = `Extract information from this resume and generate 7 interview questions.

Resume:
"""
${compressedResume}
"""

Return ONLY this JSON (no markdown, no extra text):
{
  "candidateName": "full name from resume",
  "projects": ["project 1", "project 2"],
  "skills": ["skill1", "skill2"],
  "questions": [
    "Can you tell me about yourself and your background?",
    "Where are you from?",
    "Walk me through your professional journey",
    "Tell me about a specific project you built",
    "Describe a challenge you faced and solved",
    "How do you learn new technologies?",
    "Where do you see yourself in 2-3 years?"
  ]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: questionPrompt }],
        temperature: 0.3,
        max_tokens: 1500,
      })
    });

    const result = await response.json();

    if (!result.choices?.[0]?.message?.content) {
      throw new Error("Invalid API response");
    }

    const text = result.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);

    if (!data.questions || data.questions.length === 0) {
      throw new Error("No questions generated");
    }

    return NextResponse.json({
      candidateName: data.candidateName || "Candidate",
      projects: data.projects || [],
      skills: data.skills || [],
      questions: data.questions,
      success: true
    });

  } catch (error) {
    console.error("Interview API error:", error);
    
    return NextResponse.json({
      candidateName: "Candidate",
      projects: [],
      skills: [],
      questions: [
        "Can you tell me about yourself?",
        "Where are you from?",
        "Walk me through your experience",
        "Tell me about a project",
        "Describe a challenge you solved",
        "How do you learn new tech?",
        "Where do you see yourself?"
      ],
      success: false
    });
  }
}

function compressResume(text: string): string {
  let compressed = text.replace(/\n\n+/g, '\n').trim();
  if (compressed.length > 6000) {
    compressed = compressed.substring(0, 6000);
    compressed = compressed.substring(0, compressed.lastIndexOf(' ')) + '...';
  }
  return compressed;
}