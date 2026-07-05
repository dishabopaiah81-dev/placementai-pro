import { NextResponse } from "next/server";
import { parseResume, ParsedResume } from "@/lib/resumeParser";

interface ConversationMessage {
  question: string;
  answer: string;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GROQ_API_KEY");
      throw new Error("Missing GROQ_API_KEY in .env.local");
    }

    console.log("✅ Groq API Key found");

    const body = await request.json();
    const {
      resumeText,
      userAnswer,
      questionNumber,
      conversationHistory,
      isFirstQuestion,
      candidateName,
    } = body;

    if (!resumeText) {
      throw new Error("Missing resume text");
    }

    const parsedResume: ParsedResume = parseResume(resumeText);
    
    // Use candidateName from body if provided, otherwise use parsed name
    const finalCandidateName = candidateName || parsedResume.name;

    console.log("📝 Parsed Resume:", {
      name: finalCandidateName,
      skills: parsedResume.skills.length,
      projects: parsedResume.projects.length,
      experience: parsedResume.experience.length,
    });

    // Determine if this should be a RESUME-BASED question or FOLLOW-UP question
    // Pattern: Q1(Intro-not from here) → Q2(Resume) → Q3(Follow-up) → Q4(Resume) → Q5(Follow-up) → Q6(Resume) → Q7(Follow-up) → Q8(Resume)
    const isResumeQuestion = questionNumber % 2 === 0;

    const discussedTopics = conversationHistory
      .map((msg: ConversationMessage) => msg.question)
      .join("\n");

    let systemPrompt = `You are Priya, a professional and friendly HR recruiter at a top tech company. 
Your style:
- Warm, professional, and conversational
- Ask ONE clear question at a time
- Use the candidate's actual name naturally in conversation
- Sound like a real human interviewer, not a robot
- Ask relevant questions based on their resume and answers
- Follow up on interesting points with genuine curiosity
- Keep responses concise (one question only)
- Never introduce yourself again (that was done in the intro)
- Jump straight into interview questions`;

    let userPrompt = "";

    if (isFirstQuestion && questionNumber === 2) {
      // FIRST REAL QUESTION: Start the actual interview
      userPrompt = `Candidate Name: ${finalCandidateName}
Top Skills: ${parsedResume.skills.slice(0, 5).join(", ") || "Not specified"}
Top Projects: ${parsedResume.projects.slice(0, 3).join(", ") || "Not specified"}
Experience: ${parsedResume.experience.slice(0, 2).join(", ") || "Not specified"}

Ask ${finalCandidateName} to introduce themselves. Make it about THEM - their background, what they do, what they're interested in.
Keep it conversational and warm. Start with their name.
Return ONLY the question.`;

    } else if (isResumeQuestion) {
      // RESUME-BASED QUESTIONS: Ask about specific resume items
      const resumeItems = [
        ...parsedResume.projects.map((p) => `Project: ${p}`),
        ...parsedResume.skills.map((s) => `Skill: ${s}`),
        ...parsedResume.experience.map((e) => `Experience: ${e}`),
      ];

      const previousQuestions = conversationHistory
        .map((msg: ConversationMessage) => msg.question)
        .join(" ");

      userPrompt = `Candidate: ${finalCandidateName}

Resume Items:
${resumeItems.slice(0, 10).join("\n")}

Previous Questions Asked:
${previousQuestions || "None"}

Pick ONE resume item that hasn't been discussed yet. Ask a natural HR question about it.
Examples:
- "I see you worked on [Project]. Can you tell me about your role and what you built?"
- "I noticed you have [Skill]. How have you used that in your work?"
- "Your experience with [Experience] interests me. Can you walk me through what you learned?"

Make it conversational and specific to their resume. Return ONLY the question.`;

    } else {
      // FOLLOW-UP QUESTIONS: Based on their previous answer
      const lastConversation = conversationHistory[conversationHistory.length - 1];
      const lastQuestion = lastConversation?.question || "";
      const lastAnswer = lastConversation?.answer || userAnswer;

      userPrompt = `Candidate: ${finalCandidateName}

You asked: "${lastQuestion}"

Their answer: "${lastAnswer}"

Ask ONE natural follow-up question based on their answer. 
Go deeper into:
- Challenges they faced
- Their specific role or contribution
- What they learned
- Tools/technologies they used
- Results or impact

Make it conversational and genuine. Return ONLY the follow-up question.`;
    }

    console.log("🤖 Calling Groq API...");
    console.log("Question Type:", isResumeQuestion ? "RESUME-BASED" : "FOLLOW-UP");
    console.log("Question Number:", questionNumber);

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
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Groq API HTTP Error:", response.status, errorText);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      console.error("❌ Groq API Error:", result.error);
      throw new Error(result.error.message || "Groq API Error");
    }

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error("❌ Invalid Groq response:", result);
      throw new Error("No response from Groq API");
    }

    let nextQuestion = result.choices[0].message.content;

    if (!nextQuestion || typeof nextQuestion !== "string") {
      console.error("❌ Invalid response content:", result.choices[0].message);
      throw new Error("Invalid response from Groq");
    }

    nextQuestion = nextQuestion
      .trim()
      .replace(/^Question:\s*/i, "")
      .replace(/^Priya:\s*/i, "")
      .replace(/^["'`]/g, "")
      .replace(/["'`]$/g, "")
      .trim();

    if (!nextQuestion || nextQuestion.length < 5) {
      console.error("❌ Question too short or empty:", nextQuestion);
      throw new Error("Generated question is empty");
    }

    console.log("✅ Generated Question:", nextQuestion);

    return NextResponse.json({
      nextQuestion,
      shouldContinue: questionNumber < 8,
      questionNumber,
      isResumeQuestion,
      candidateName: finalCandidateName,
    });
  } catch (error: any) {
    console.error("❌ Chat API Error:", error.message);

    const fallbacks = [
      "Can you tell me about one of your projects that you're proud of?",
      "What was the biggest technical challenge you've faced and how did you overcome it?",
      "How do you approach learning new technologies or skills?",
      "Can you describe your experience with the tools and technologies you've used?",
      "Tell me about a situation where you had to collaborate with others on a project.",
      "What interests you most about this opportunity?",
      "How do you handle debugging or troubleshooting complex problems?",
      "What's your experience with working in teams or in a fast-paced environment?",
    ];

    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    return NextResponse.json({
      nextQuestion: randomFallback,
      shouldContinue: true,
    });
  }
}