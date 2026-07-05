import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidateName = "Candidate",
      overallScore = 0,
      resumeScore = 0,
      interviewScore = 0,
      technicalScore = 0,
      communicationScore = 0,
      confidenceScore = 0,
      strengths = [],
      weaknesses = [],
    } = body;

    const dateStr = new Date().toLocaleDateString();
    const status = overallScore >= 80 ? "✓ SELECTED" : "⏳ PENDING";
    const statusBgColor = overallScore >= 80 ? "#4CAF50" : "#FF9800";

    // Create HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        body { background: #f5f5f5; padding: 20px; }
        .page { background: white; width: 210mm; height: 297mm; margin: 0 auto 20px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; background: #f5f0fa; padding: 20px; border-radius: 10px; }
        .header h1 { color: #db2777; font-size: 28px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 14px; }
        .info { margin-bottom: 20px; }
        .info-line { margin: 8px 0; font-size: 12px; }
        .score-box { background: #db2777; color: white; padding: 25px; border-radius: 10px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
        .score-box h2 { font-size: 18px; margin-bottom: 10px; }
        .score-box .number { font-size: 40px; font-weight: bold; }
        .status-badge { background: ${statusBgColor}; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold; }
        .section { margin: 25px 0; }
        .section h3 { color: #db2777; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #db2777; padding-bottom: 8px; }
        .item { margin: 8px 0; padding: 8px 0 8px 20px; font-size: 12px; }
        .item:before { content: "✓ "; color: #db2777; font-weight: bold; margin-right: 5px; }
        .weakness { margin: 8px 0; padding: 8px 0 8px 20px; font-size: 12px; }
        .weakness:before { content: "⚠ "; color: #ff9800; font-weight: bold; margin-right: 5px; }
        .scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
        .score-item { font-size: 11px; }
        .score-item .label { font-weight: bold; margin-bottom: 3px; }
        .score-bar { background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden; }
        .score-fill { background: #db2777; height: 100%; }
        .page-break { page-break-after: always; }
        .seal { text-align: center; margin: 40px 0; }
        .seal-circle { 
          width: 120px; 
          height: 120px; 
          border: 3px solid #db2777; 
          border-radius: 50%; 
          margin: 0 auto 20px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center; 
          background: #db2777; 
          color: white; 
          font-weight: bold; 
        }
        .seal-circle .main { font-size: 18px; }
        .seal-circle .sub { font-size: 12px; }
        .message { 
          font-size: 12px; 
          line-height: 1.6; 
          margin: 30px 0; 
          padding: 20px; 
          background: #f9f9f9; 
          border-left: 4px solid #db2777; 
          white-space: pre-wrap;
        }
        .footer { 
          text-align: center; 
          font-size: 10px; 
          color: #999; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e0e0e0; 
        }
      </style>
    </head>
    <body>
      <!-- PAGE 1 -->
      <div class="page">
        <div class="header">
          <h1>PlacementAI Pro</h1>
          <p>Placement Readiness Assessment Report</p>
        </div>

        <div class="info">
          <div class="info-line"><strong>Candidate:</strong> ${candidateName}</div>
          <div class="info-line"><strong>Date:</strong> ${dateStr}</div>
          <div class="info-line"><strong>Assessment ID:</strong> PA-${Date.now()}</div>
        </div>

        <div class="score-box">
          <div>
            <h2>Overall Placement Score</h2>
            <div class="number">${overallScore}/100</div>
          </div>
          <div class="status-badge">${status}</div>
        </div>

        <div class="section">
          <h3>Score Breakdown</h3>
          <div class="scores-grid">
            <div class="score-item">
              <div class="label">Resume Score: ${resumeScore}/100</div>
              <div class="score-bar"><div class="score-fill" style="width: ${resumeScore}%"></div></div>
            </div>
            <div class="score-item">
              <div class="label">Interview Score: ${interviewScore}/100</div>
              <div class="score-bar"><div class="score-fill" style="width: ${interviewScore}%"></div></div>
            </div>
            <div class="score-item">
              <div class="label">Technical: ${technicalScore}/100</div>
              <div class="score-bar"><div class="score-fill" style="width: ${technicalScore}%"></div></div>
            </div>
            <div class="score-item">
              <div class="label">Communication: ${communicationScore}/100</div>
              <div class="score-bar"><div class="score-fill" style="width: ${communicationScore}%"></div></div>
            </div>
            <div class="score-item">
              <div class="label">Confidence: ${confidenceScore}/100</div>
              <div class="score-bar"><div class="score-fill" style="width: ${confidenceScore}%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="page">
        <div class="section">
          <h3>💪 Your Strengths</h3>
          ${
            strengths && strengths.length > 0
              ? strengths.map((s: string) => `<div class="item">${s}</div>`).join("")
              : '<div class="item">Completed all assessment sections</div>'
          }
        </div>

        <div class="section">
          <h3>📈 Areas to Improve</h3>
          ${
            weaknesses && weaknesses.length > 0
              ? weaknesses.map((w: string) => `<div class="weakness">${w}</div>`).join("")
              : '<div class="weakness">Continue practicing to improve performance</div>'
          }
        </div>

        <div class="section">
          <h3>📚 Recommended Learning Path</h3>
          <div class="item">Read: 'Cracking the Coding Interview'</div>
          <div class="item">Practice: Mock interviews 2-3 times weekly</div>
          <div class="item">Focus: System design and behavioral questions</div>
          <div class="item">Review: Your weaknesses regularly</div>
        </div>
      </div>

      <!-- PAGE 3 -->
      <div class="page">
        <h2 style="color: #db2777; text-align: center; margin: 30px 0;">${overallScore >= 80 ? "✅ Congratulations!" : "📝 Keep Improving!"}</h2>
        
        <div class="message">${
          overallScore >= 80
            ? `Dear ${candidateName},

Congratulations! Your score of ${overallScore}/100 demonstrates excellent potential.

You have shown:
• Strong technical foundation
• Excellent communication skills
• High confidence level

You are READY for placement interviews!

Next Steps:
1. Participate in company interviews
2. Research target companies
3. Continue practicing
4. Maintain confidence

We are confident in your success!

Best Regards,
Priya
AI Recruiter
PlacementAI Pro`
            : `Dear ${candidateName},

Your current score is ${overallScore}/100.

With focused practice, you can reach 80+!

Recommended Actions:
1. Practice more mock interviews
2. Study recommended resources
3. Work on weak areas
4. Retake in 2-3 weeks

You can do this!

Best Regards,
Priya
AI Recruiter
PlacementAI Pro`
        }</div>
      </div>

      <!-- PAGE 4 -->
      <div class="page" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="seal">
          <div class="seal-circle">
            <div class="main">PlacementAI</div>
            <div class="sub">Pro</div>
          </div>
          <h3 style="color: #333; margin: 20px 0;">Certified Assessment Report</h3>
          <p style="color: #666; font-size: 12px; margin: 10px 0;">This report certifies that ${candidateName}</p>
          <p style="color: #666; font-size: 12px; margin: 10px 0;">has completed the PlacementAI Pro Assessment</p>
          <p style="color: #999; font-size: 10px; margin: 20px 0;">Generated: ${dateStr}</p>
          <p style="color: #999; font-size: 10px;">Valid for: 6 Months</p>
          <p style="color: #333; font-size: 11px; margin-top: 40px; font-weight: bold;">Authorized by:</p>
          <p style="color: #666; font-size: 11px;">Priya - AI Recruiter</p>
          <p style="color: #666; font-size: 11px;">PlacementAI Pro</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Convert HTML to base64
    const base64Html = Buffer.from(htmlContent).toString("base64");

    // Return as downloadable file
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${candidateName}_Report.html"`,
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}