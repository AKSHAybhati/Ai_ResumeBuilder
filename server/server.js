const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { connectToPostgreSQL } = require("./config/database");
const { errorHandler } = require("./utils/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// Dynamic Routes (legacy)
const dynamicResumeTemplateRoutes = require("./routes/dynamicRoutes/dynamicResumeRoutes");
const resumeTemplate1Routes = require("./routes/resumeTemplateRoutes/resumeTemplate1Route");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev
      "https://resume-builder-ai30.vercel.app", // your live frontend
    ],
    credentials: true,
  })
);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

//  Register API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/resumes", resumeRoutes); // Resume management routes
app.use("/api/enhance", geminiRoutes); // AI enhancement routes

// Legacy routes (backward compatibility)
app.use("/api/resume", resumeTemplate1Routes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    const isConnected = await connectToPostgreSQL(); //  Ensure PostgreSQL is connected before starting the server

    if (!isConnected) {
      console.error("❌ Failed to connect to PostgreSQL");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(" Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error(" Unhandled Rejection:", error);
  process.exit(1);
});

startServer();
