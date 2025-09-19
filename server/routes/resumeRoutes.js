const express = require("express");
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { 
  getUserResumes,
  createResume,
  getResume,
  updateResume,
  deleteResume,
  getUserSuggestions
} = require("../controllers/resumeController");
const { getEnhancementStats } = require("../models/resumeModel");

// Protected routes (require authentication)
router.get("/my-resumes", authenticateToken, getUserResumes);
router.post("/", authenticateToken, createResume);
router.get("/suggestions", authenticateToken, getUserSuggestions);
router.get("/:id", authenticateToken, getResume);
router.put("/:id", authenticateToken, updateResume);
router.delete("/:id", authenticateToken, deleteResume);

// Optional auth routes (work for both authenticated and guest users)
router.get("/stats/enhancements", optionalAuth, async (req, res) => {
  try {
    const stats = await getEnhancementStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("❌ Error getting enhancement stats:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to get enhancement statistics"
    });
  }
});

module.exports = router;