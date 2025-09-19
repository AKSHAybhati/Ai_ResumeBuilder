const express = require("express");
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { enhanceSection } = require("../controllers/geminiController");

// AI enhancement endpoint with optional authentication
router.post("/", optionalAuth, enhanceSection);

module.exports = router;
