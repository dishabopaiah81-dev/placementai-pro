import { NextResponse } from "next/server";

interface ResumeAnalysis {
  ats_score: number;
  clarity_score: number;
  technical_score: number;
  impact_score: number;
  structure_score: number;
  total_score: number;
  candidate_name: string;
  detected_role: string;
  detected_skills: string[];
  detected_projects: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resumeText = body.resumeText || "";

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text too short.");
    }

    // Clean PDF junk
    const cleanedResume = cleanPDFContent(resumeText);
    console.log("✅ Resume cleaned, length:", cleanedResume.length);

    // Extract key information
    const candidateName = extractName(cleanedResume);
    const detectedRole = detectRole(cleanedResume);
    const skills = extractSkills(cleanedResume);
    const projects = extractProjects(cleanedResume);
    const experience = extractExperience(cleanedResume);
    const education = extractEducation(cleanedResume);

    console.log("📝 Extracted Data:", {
      name: candidateName,
      role: detectedRole,
      skills: skills.length,
      projects: projects.length,
    });

    // Calculate scores (0-100)
    const ats_score = calculateATSScore(cleanedResume, skills, projects);
    const clarity_score = calculateClarity(cleanedResume);
    const technical_score = calculateTechnical(skills, projects, experience);
    const impact_score = calculateImpact(projects, experience);
    const structure_score = calculateStructure(cleanedResume);

    // Calculate total score
    const total_score = Math.round(
      (ats_score + clarity_score + technical_score + impact_score + structure_score) / 5
    );

    // Generate analysis
    const strengths = generateStrengths(skills, projects, experience, total_score);
    const weaknesses = generateWeaknesses(skills, projects, total_score);
    const improvements = generateImprovements(weaknesses, skills);

    const analysis: ResumeAnalysis = {
      ats_score,
      clarity_score,
      technical_score,
      impact_score,
      structure_score,
      total_score,
      candidate_name: candidateName,
      detected_role: detectedRole,
      detected_skills: skills.slice(0, 12),
      detected_projects: projects.slice(0, 5),
      strengths,
      weaknesses,
      improvements,
    };

    console.log("✅ Analysis Complete:", {
      total_score: analysis.total_score,
      name: analysis.candidate_name,
    });

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("❌ Resume Analysis Error:", error.message);

    return NextResponse.json(
      {
        error: error.message || "Failed to analyze resume",
        ats_score: 0,
        clarity_score: 0,
        technical_score: 0,
        impact_score: 0,
        structure_score: 0,
        total_score: 0,
        candidate_name: "Candidate",
        detected_role: "Not Detected",
        detected_skills: [],
        detected_projects: [],
        strengths: [],
        weaknesses: [],
        improvements: [],
      },
      { status: 400 }
    );
  }
}

// ============ HELPER FUNCTIONS ============

function cleanPDFContent(text: string): string {
  text = text.replace(/\/[A-Z][a-zA-Z]*/g, " ");
  text = text.replace(/\d+\s+\d+\s+obj/g, " ");
  text = text.replace(/endobj|stream|endstream|xref|trailer|startxref/gi, " ");
  text = text.replace(/Type\s+Catalog|Type\s+Page[s]?|Type\s+Font/gi, " ");
  text = text.replace(/MediaBox|CropBox|Contents|Resources/gi, " ");
  text = text.replace(/\\\\/g, " ");
  text = text.replace(/<<|>>/g, " ");
  text = text.replace(/[A-Za-z0-9]{50,}/g, " ");
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

function extractName(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  for (const line of lines.slice(0, 15)) {
    const cleaned = line
      .replace(/^[•\-\*\s|]+/, "")
      .trim()
      .split(/[\s|]+/)
      .slice(0, 3)
      .join(" ");

    if (
      cleaned.length > 3 &&
      cleaned.length < 60 &&
      /^[A-Za-z\s\-']+$/.test(cleaned) &&
      !cleaned.match(
        /email|phone|linkedin|github|skills|projects|experience|education|contact|address/i
      )
    ) {
      return cleaned;
    }
  }

  return "Candidate";
}

function detectRole(text: string): string {
  const roleKeywords = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Product Manager",
    "DevOps Engineer",
    "QA Engineer",
    "Cloud Architect",
    "Web Developer",
    "Mobile Developer",
    "System Administrator",
    "Database Administrator",
  ];

  const lowerText = text.toLowerCase();

  for (const role of roleKeywords) {
    if (lowerText.includes(role.toLowerCase())) {
      return role;
    }
  }

  return "Software Professional";
}

function extractSkills(text: string): string[] {
  const skillsSet = new Set<string>();
  const lines = text.split("\n");
  let inSkillSection = false;

  for (const line of lines) {
    if (line.match(/skills?|technologies?|technical|proficiencies?/i)) {
      inSkillSection = true;
      continue;
    }

    if (inSkillSection && line.match(/experience|education|projects|certifications/i)) {
      inSkillSection = false;
    }

    if (inSkillSection && line.trim().length > 1) {
      const items = line.split(/[,•\-\*|]/);
      for (const item of items) {
        const cleaned = item.replace(/^[•\-\*\s|]+/, "").trim();
        if (cleaned.length > 1 && cleaned.length < 50 && !cleaned.match(/^\d+$/)) {
          skillsSet.add(cleaned);
        }
      }
    }
  }

  const skillsArray = Array.from(skillsSet);
  return skillsArray.slice(0, 20);
}

function extractProjects(text: string): string[] {
  const projectsSet = new Set<string>();
  const lines = text.split("\n");
  let inProjectSection = false;

  for (const line of lines) {
    if (line.match(/projects?|portfolio|applications?|portfolio|academic/i)) {
      inProjectSection = true;
      continue;
    }

    if (inProjectSection && line.match(/skills|experience|education/i)) {
      inProjectSection = false;
    }

    if (inProjectSection && line.trim().length > 5) {
      const cleaned = line.replace(/^[•\-\*\s|]+/, "").trim();
      if (cleaned.length > 3 && cleaned.length < 120) {
        projectsSet.add(cleaned);
      }
    }
  }

  const projectsArray = Array.from(projectsSet);
  return projectsArray.slice(0, 10);
}

function extractExperience(text: string): string[] {
  const expSet = new Set<string>();
  const lines = text.split("\n");
  let inExpSection = false;

  for (const line of lines) {
    if (line.match(/experience|work history|professional experience/i)) {
      inExpSection = true;
      continue;
    }

    if (inExpSection && line.match(/skills|education|projects|certifications/i)) {
      inExpSection = false;
    }

    if (inExpSection && line.trim().length > 5) {
      const cleaned = line.replace(/^[•\-\*\s|]+/, "").trim();
      if (cleaned.length > 3 && cleaned.length < 150) {
        expSet.add(cleaned);
      }
    }
  }

  const expArray = Array.from(expSet);
  return expArray.slice(0, 8);
}

function extractEducation(text: string): string[] {
  const eduSet = new Set<string>();
  const lines = text.split("\n");
  let inEduSection = false;

  for (const line of lines) {
    if (line.match(/education|degree|bachelor|master|university|college/i)) {
      inEduSection = true;
      continue;
    }

    if (inEduSection && line.match(/skills|experience|projects|certifications/i)) {
      inEduSection = false;
    }

    if (inEduSection && line.trim().length > 3) {
      const cleaned = line.replace(/^[•\-\*\s|]+/, "").trim();
      if (cleaned.length > 3 && cleaned.length < 150) {
        eduSet.add(cleaned);
      }
    }
  }

  const eduArray = Array.from(eduSet);
  return eduArray.slice(0, 5);
}

function calculateATSScore(text: string, skills: string[], projects: string[]): number {
  let score = 50;

  if (text.match(/experience|work history/i)) score += 15;
  if (text.match(/education|degree|university/i)) score += 15;
  if (text.match(/skills|technical/i)) score += 10;
  if (skills.length > 5) score += 10;
  if (text.match(/project|achievement|responsibility/i)) score += 5;

  return Math.min(score, 100);
}

function calculateClarity(text: string): number {
  let score = 50;

  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 10) score += 20;
  if (lines.length > 20) score += 15;
  if (text.match(/bullet|point|\-|•/)) score += 15;

  return Math.min(score, 100);
}

function calculateTechnical(skills: string[], projects: string[], experience: string[]): number {
  let score = 40;

  const techKeywords = [
    "python",
    "javascript",
    "java",
    "c++",
    "react",
    "node",
    "database",
    "sql",
    "api",
    "cloud",
    "docker",
    "git",
    "aws",
    "azure",
  ];

  const allText = [...skills, ...projects, ...experience].join(" ").toLowerCase();

  for (const keyword of techKeywords) {
    if (allText.includes(keyword)) score += 3;
  }

  if (skills.length > 8) score += 10;
  if (projects.length > 2) score += 15;

  return Math.min(score, 100);
}

function calculateImpact(projects: string[], experience: string[]): number {
  let score = 40;

  const impactKeywords = [
    "led",
    "improved",
    "increased",
    "designed",
    "built",
    "developed",
    "achieved",
    "reduced",
    "optimized",
  ];

  const allText = [...projects, ...experience].join(" ").toLowerCase();

  for (const keyword of impactKeywords) {
    if (allText.includes(keyword)) score += 3;
  }

  if (projects.length > 3) score += 15;
  if (experience.length > 3) score += 10;

  return Math.min(score, 100);
}

function calculateStructure(text: string): number {
  let score = 50;

  const sections = ["experience", "skills", "education", "projects"];

  for (const section of sections) {
    if (text.toLowerCase().includes(section)) score += 10;
  }

  return Math.min(score, 100);
}

function generateStrengths(
  skills: string[],
  projects: string[],
  experience: string[],
  score: number
): string[] {
  const strengths: string[] = [];

  if (skills.length > 8) {
    strengths.push("Strong technical skill set with diverse technologies");
  }

  if (projects.length > 2) {
    strengths.push("Good project portfolio demonstrating practical experience");
  }

  if (experience.length > 2) {
    strengths.push("Solid professional work experience");
  }

  if (score >= 75) {
    strengths.push("Well-structured and comprehensive resume");
  }

  if (strengths.length === 0) {
    strengths.push("Resume contains key professional information");
  }

  return strengths;
}

function generateWeaknesses(
  skills: string[],
  projects: string[],
  score: number
): string[] {
  const weaknesses: string[] = [];

  if (skills.length < 5) {
    weaknesses.push("Consider adding more relevant technical skills");
  }

  if (projects.length < 2) {
    weaknesses.push("Add more project examples to showcase your work");
  }

  if (score < 60) {
    weaknesses.push("Resume could benefit from better organization and formatting");
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Continue to expand your skill set and project portfolio");
  }

  return weaknesses;
}

function generateImprovements(weaknesses: string[], skills: string[]): string[] {
  const improvements: string[] = [];

  if (weaknesses.length > 0) {
    improvements.push("Add quantifiable metrics to your achievements");
  }

  improvements.push("Use action verbs to describe your responsibilities");
  improvements.push("Include relevant keywords for ATS optimization");
  improvements.push("Highlight projects with measurable impact");

  return improvements.slice(0, 4);
}