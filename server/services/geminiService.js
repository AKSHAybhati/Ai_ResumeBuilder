const axios = require("axios");

const useOfficialGemini = process.env.USE_OFFICIAL_GEMINI === "true";

/**
 * Send enhancement prompt to Gemini AI
 * Supports both OpenRouter & official Google Gemini depending on .env flag
 * @param {string} prompt
 * @returns {string} enhanced text (raw string)
 */
const getEnhancedText = async (prompt) => {
  try {
    const response = useOfficialGemini
      ? await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              key: process.env.GEMINI_API_KEY,
            },
          }
        )
      : await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional resume editor. Return improved resume content only.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            },
          }
        );

    const aiText = useOfficialGemini
      ? response.data.candidates?.[0]?.content?.parts?.[0]?.text
      : response.data.choices?.[0]?.message?.content;

    return aiText || "❌ Error: No response from Gemini AI";
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    throw new Error("Failed to get response from Gemini");
  }
};

module.exports = { getEnhancedText };
