export interface ParsedResume {
  name: string;
  skills: string[];
  projects: string[];
  experience: string[];
  education: string[];
  achievements: string[];
}

function cleanPDFText(text: string): string {
  // Remove PDF artifacts
  text = text.replace(/\/[A-Z][a-zA-Z]*/g, " ");
  text = text.replace(/\d+\s+\d+\s+obj/g, " ");
  text = text.replace(/\d+\s+\d+\s+R/g, " ");
  text = text.replace(/endobj|stream|endstream|xref|trailer|startxref/gi, " ");
  text = text.replace(/Type\s+Catalog|Type\s+Page|Type\s+Font/gi, " ");
  text = text.replace(/MediaBox|CropBox|BleedBox/gi, " ");
  text = text.replace(/Contents|Resources|Parent|Kids/g, " ");
  text = text.replace(/\\\\/g, " ");
  text = text.replace(/\\/g, " ");
  text = text.replace(/\[\s*\]/g, " ");
  text = text.replace(/<<|>>/g, " ");
  text = text.replace(/\s+/g, " ");

  return text.trim();
}

export function parseResume(resumeText: string): ParsedResume {
  let cleanText = cleanPDFText(resumeText);

  // Split into lines more intelligently
  const lines = cleanText
    .split(/[\n.]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // ============ IMPROVED NAME EXTRACTION ============
  let name = "Candidate";
  
  // Strategy 1: Look for name at the very beginning (first 3 lines)
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    
    // Check if line is likely a name (mostly letters, reasonable length)
    if (
      line.length > 2 &&
      line.length < 60 &&
      /^[A-Za-z\s\-']+$/.test(line) &&
      !line.match(/email|phone|linkedin|github|pdf|resume|cv|document/i)
    ) {
      name = line.trim();
      console.log("✅ Name extracted from early line:", name);
      break;
    }
  }

  // Strategy 2: If still "Candidate", search more aggressively in first 20 lines
  if (name === "Candidate") {
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i];
      
      if (
        line.length > 3 &&
        line.length < 60 &&
        /^[A-Za-z\s\-']+$/.test(line) &&
        !line.match(/email|phone|linkedin|github|skills|experience|education|projects|pdf|resume|cv|document|contact|address|objective|summary/i)
      ) {
        name = line.trim();
        console.log("✅ Name extracted (strategy 2):", name);
        break;
      }
    }
  }

  // Clean up name
  name = name
    .replace(/[^a-zA-Z\s\-']/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3) // Take only first 3 words max
    .join(" ");

  if (!name || name.length < 2) {
    name = "Candidate";
  }

  console.log("📝 Final extracted name:", name);

  const skills = extractFromSection(
    cleanText,
    /skills?|technical skills?|technologies?|programming|core concepts|tech stack/i
  );
  const projects = extractFromSection(
    cleanText,
    /projects?|portfolio|academic project|chatbot|development|work samples?|applications?/i
  );
  const experience = extractFromSection(
    cleanText,
    /experience|work experience|professional experience|employment|internship|career/i
  );
  const education = extractFromSection(
    cleanText,
    /education|academic|qualification|degree|bachelor|master|college|university|school/i
  );
  const achievements = extractFromSection(
    cleanText,
    /achievements?|awards|certifications?|accomplishments?|courses?|honors/i
  );

  return {
    name: name || "Candidate",
    skills: Array.from(new Set(skills))
      .filter((s) => s && s.length > 1 && !s.match(/^\d+$/) && !s.match(/pdf|obj|catalog|type|font/i))
      .slice(0, 15),
    projects: Array.from(new Set(projects))
      .filter((p) => p && p.length > 2 && !p.match(/^\d+$/) && !p.match(/pdf|obj|catalog|type|font/i))
      .slice(0, 10),
    experience: Array.from(new Set(experience))
      .filter((e) => e && e.length > 2 && !e.match(/^\d+$/) && !e.match(/pdf|obj|catalog|type|font/i))
      .slice(0, 10),
    education: Array.from(new Set(education))
      .filter((e) => e && e.length > 2 && !e.match(/^\d+$/) && !e.match(/pdf|obj|catalog|type|font/i))
      .slice(0, 10),
    achievements: Array.from(new Set(achievements))
      .filter((a) => a && a.length > 2 && !a.match(/^\d+$/) && !a.match(/pdf|obj|catalog|type|font/i))
      .slice(0, 10),
  };
}

function extractFromSection(text: string, sectionRegex: RegExp): string[] {
  const items: string[] = [];

  const sectionMatch = text.match(sectionRegex);
  if (!sectionMatch) return items;

  const startIndex = text.indexOf(sectionMatch[0]);
  
  // Find the next section (look for common section headers)
  const nextSectionRegex = /skills?|experience|education|projects?|achievements?|certifications?|about|summary|contact/i;
  let endIndex = text.length;
  
  const remainingText = text.substring(startIndex + 50);
  const nextMatch = remainingText.match(nextSectionRegex);
  if (nextMatch) {
    endIndex = startIndex + 50 + remainingText.indexOf(nextMatch[0]);
  }

  const section = text.substring(startIndex, endIndex);

  const lines = section.split(/[\n•\-\*,;]/);

  for (let line of lines) {
    line = line
      .replace(/^[:\s]+/, "")
      .replace(/[()[\]{}]/g, " ")
      .trim();

    if (
      line &&
      line.length > 1 &&
      !line.match(/^[a-z\s]{1,3}:/i) &&
      !line.match(/^\d+$/) &&
      !line.match(/pdf|obj|K\s|catalog|type|font|page|stream|resume|document/i)
    ) {
      items.push(line);
    }
  }

  return items;
}