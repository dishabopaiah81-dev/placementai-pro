import { NextResponse } from "next/server";

interface ConversationMessage {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GROQ_API_KEY");
      throw new Error("Missing GROQ_API_KEY");
    }

    const body = await request.json();
    const { conversationHistory, candidateName, resumeText } = body;

    if (!conversationHistory || conversationHistory.length === 0) {
      console.error("❌ No conversation history");
      throw new Error("No conversation history provided");
    }

    console.log("📊 Starting interview evaluation for:", candidateName);
    console.log("📊 Total answers to evaluate:", conversationHistory.length);

    // Evaluate each answer and get individual scores
    const evaluations = await Promise.all(
      conversationHistory.map((msg: ConversationMessage, index: number) =>
        evaluateAnswer(
          apiKey,
          msg.question,
          msg.answer,
          candidateName,
          index + 1,
          conversationHistory.length
        )
      )
    );

    // Calculate category scores based on actual evaluations
    const technicalScores = evaluations.map((e) => e.technicalScore);
    const communicationScores = evaluations.map((e) => e.communicationScore);
    const confidenceScores = evaluations.map((e) => e.confidenceScore);

    const technicalScore = Math.round(
      technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length
    );
    const communicationScore = Math.round(
      communicationScores.reduce((a, b) => a + b, 0) / communicationScores.length
    );
    const confidenceScore = Math.round(
      confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
    );

    // Overall interview score
    const overallScore = Math.round(
      (technicalScore + communicationScore + confidenceScore) / 3
    );

    // Generate strengths and weaknesses
    const { strengths, weaknesses } = analyzePerformance(
      evaluations,
      conversationHistory,
      technicalScore,
      communicationScore,
      confidenceScore
    );

    const result = {
      overallScore,
      technicalScore,
      communicationScore,
      confidenceScore,
      strengths,
      weaknesses,
      evaluations: evaluations.map((e) => ({
        question: e.question,
        score: e.overallScore,
        feedback: e.feedback,
        technicalScore: e.technicalScore,
        communicationScore: e.communicationScore,
        confidenceScore: e.confidenceScore,
      })),
      candidateName,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Evaluation Complete:", {
      overall: overallScore,
      technical: technicalScore,
      communication: communicationScore,
      confidence: confidenceScore,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Evaluation Error:", error.message);

    return NextResponse.json(
      {
        error: error.message || "Evaluation failed",
        overallScore: 65,
        technicalScore: 65,
        communicationScore: 65,
        confidenceScore: 65,
        strengths: ["Completed interview successfully"],
        weaknesses: ["Could not fully evaluate responses"],
        evaluations: [],
      },
      { status: 400 }
    );
  }
}

// ============ EVALUATE EACH ANSWER ============

async function evaluateAnswer(
  apiKey: string,
  question: string,
  answer: string,
  candidateName: string,
  questionIndex: number,
  totalQuestions: number
): Promise<any> {
  try {
    const systemPrompt = `You are an expert HR recruiter evaluating interview responses. Score each aspect independently (0-100).
Be REALISTIC - not everyone gets 90+. Most people score 40-80.
Consider answer length, detail, relevance, and professionalism.`;

    const userPrompt = `Candidate: ${candidateName}
Question #${questionIndex}/${totalQuestions}: "${question}"
Answer: "${answer}"

Evaluate this answer and provide scores in JSON format:
{
  "technicalScore": <0-100 based on technical depth and knowledge>,
  "communicationScore": <0-100 based on clarity, structure, professionalism>,
  "confidenceScore": <0-100 based on conviction, completeness, positivity>,
  "overallScore": <0-100 average of above three>,
  "feedback": "<brief specific feedback about this answer>"
}

SCORING GUIDELINES:
- 90-100: Excellent - detailed, professional, confident
- 75-89: Good - clear and competent
- 60-74: Average - acceptable but could improve
- 40-59: Below average - vague or incomplete
- Below 40: Poor - very weak response

Return ONLY valid JSON, no extra text.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse Groq response");
      }
    }

    const technicalScore = Math.max(0, Math.min(100, parseInt(parsed.technicalScore) || 50));
    const communicationScore = Math.max(0, Math.min(100, parseInt(parsed.communicationScore) || 50));
    const confidenceScore = Math.max(0, Math.min(100, parseInt(parsed.confidenceScore) || 50));
    const overallScore = Math.round((technicalScore + communicationScore + confidenceScore) / 3);
    const feedback = parsed.feedback || "No feedback provided";

    console.log(`✅ Q${questionIndex}: Tech=${technicalScore}, Comm=${communicationScore}, Conf=${confidenceScore}, Overall=${overallScore}`);

    return {
      question,
      answer,
      technicalScore,
      communicationScore,
      confidenceScore,
      overallScore,
      feedback,
      questionIndex,
    };
  } catch (error: any) {
    console.error(`❌ Error evaluating answer ${questionIndex}:`, error.message);

    return {
      question,
      answer,
      technicalScore: 50,
      communicationScore: 50,
      confidenceScore: 50,
      overallScore: 50,
      feedback: "Could not evaluate this answer",
      questionIndex,
    };
  }
}

// ============ ANALYZE PERFORMANCE ============

function analyzePerformance(
  evaluations: any[],
  conversationHistory: ConversationMessage[],
  technicalScore: number,
  communicationScore: number,
  confidenceScore: number
): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Find high-scoring answers
  const highScores = evaluations.filter((e) => e.overallScore >= 70);
  const lowScores = evaluations.filter((e) => e.overallScore < 50);

  // Analyze by category
  if (technicalScore >= 70) {
    strengths.push("Strong technical knowledge demonstrated");
  } else if (technicalScore < 50) {
    weaknesses.push("Technical knowledge needs improvement");
  }

  if (communicationScore >= 70) {
    strengths.push("Clear and articulate communication");
  } else if (communicationScore < 50) {
    weaknesses.push("Communication could be clearer and more structured");
  }

  if (confidenceScore >= 70) {
    strengths.push("High confidence and positive attitude");
  } else if (confidenceScore < 50) {
    weaknesses.push("Work on building confidence in responses");
  }

  if (highScores.length >= Math.ceil(evaluations.length / 2)) {
    strengths.push("Consistent performance across multiple questions");
  }

  if (lowScores.length >= 2) {
    weaknesses.push("Several weak responses - needs more practice");
  }

  // Check answer length
  const avgAnswerLength =
    conversationHistory.reduce((sum, msg) => sum + msg.answer.length, 0) /
    conversationHistory.length;

  if (avgAnswerLength > 200) {
    strengths.push("Provides detailed and thoughtful answers");
  } else if (avgAnswerLength < 50) {
    weaknesses.push("Answers are too brief - provide more detail");
  }

  // Ensure we have feedback
  if (strengths.length === 0) {
    strengths.push("Completed all interview questions");
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Continue practicing to maintain improvement");
  }

  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
  };
}