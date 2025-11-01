import apiService from "./apiService";

export const enhanceTextWithGemini = async (section, data) => {
  try {
    const response = await apiService.ai.enhance(section, data);
    return response.data.enhanced;
  } catch (error) {
    console.error("❌ Enhance API error:", error);
    return null;
  }
};
