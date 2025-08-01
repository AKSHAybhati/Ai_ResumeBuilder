const { getEnhancedText } = require("../services/geminiService");

const enhanceSection = async (req, res) => {
  try {
    const { section, data } = req.body;

    if (!section || !data) {
      return res.status(400).json({ error: "Missing section or data" });
    }

    const prompt = generatePrompt(section, data);
    console.log("🧠 Prompt being sent to Gemini:", prompt);

    const enhancedText = await getEnhancedText(prompt);

    res.status(200).json({ enhanced: enhancedText });
  } catch (err) {
    console.error("❌ Enhancement Error:", err.message || err);
    res.status(500).json({ error: "Something went wrong in enhanceSection" });
  }
};

const generatePrompt = (section, data) => {
  switch (section) {
    case "summary":
      return `
You are a professional resume writer. 
Rewrite the following summary to be concise (2-3 lines), clear, and impactful for a software developer applying to top tech companies.

Instructions:
- Remove filler or vague phrases.
- Keep only the most impressive, relevant details.
- Output as 2 or 3 clean sentences.
- No bullet points, quotes, asterisks, or brackets.

Original:
${data}
`;

    case "skills":
      return `
Rewrite the following skills into 3–4 clean bullet points, one per line.

Instructions:
- Group related skills and avoid redundancy.
- Be concise, modern, and skip outdated tools.
- Do NOT use quotes, asterisks, or JSON.

Original:
${JSON.stringify(data)}
`;

    case "experience":
      return `
Enhance the job experience below into a clean, professional format.

Format:
Job Title @ Company
Duration | Location
• Achievement 1 (impact-driven)
• Achievement 2 (quantifiable if possible)

Avoid:
- Quotes, brackets, JSON, asterisks.
- Too many technical jargons unless relevant.

Original:
${JSON.stringify(data)}
`;

    case "education":
      return `
Format this education entry cleanly for a resume.

Instructions:
- Include degree, university, location, and dates.
- Use new lines for clarity.
- Do NOT include asterisks, quotes, or JSON.

Original:
${JSON.stringify(data)}
`;

    case "projects":
      return `
Reformat these projects professionally.

Instructions:
- List 1–2 impressive projects.
- Use this format:
  Project Name – Tech Used
  • What it does / why it matters (concise)

- No JSON, asterisks, or quotes.
- Focus on impact or usefulness.

Original:
${JSON.stringify(data)}
`;

    case "certifications":
      return `
List certifications in a professional and clean format.

Instructions:
- Use this format:
  Certification Name – Issuing Organization
  Date

- List only relevant ones.
- No quotes, JSON, or asterisks.

Original:
${JSON.stringify(data)}
`;

    case "achievements":
      return `
List professional achievements in bullet points.

Instructions:
- Each line should be one achievement.
- Focus on awards, recognitions, or milestones.
- Do NOT use asterisks, quotes, or JSON.

Original:
${JSON.stringify(data)}
`;

    case "interests":
      return `
List the user's interests in a clean, readable way.

Instructions:
- Bullet point format, like:
  - Interest 1
  - Interest 2
- Keep it short and simple.
- No stars, quotes, or extra decorations.

Original:
${JSON.stringify(data)}
`;

    case "languages":
      return `
List the languages known by the user in this format:

- Language (Proficiency)

Instructions:
- Example: English (Fluent)
- Do NOT use quotes or extra formatting.

Original:
${JSON.stringify(data)}
`;

    default:
      return `
Polish the following resume section. Avoid using JSON, quotes, or unnecessary symbols.

Original:
${JSON.stringify(data)}
`;
  }
};

module.exports = { enhanceSection };
