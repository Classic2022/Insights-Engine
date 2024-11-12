const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // Ensure dotenv is imported
dotenv.config(); // Load .env variables

const summarizeRoutes = require("./routes/summarize"); // Correct path to summarize.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the summarize route under /api
app.use("/api", summarizeRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Debug log to ensure API key is loaded
console.log("OpenAI API Key in index.js:", process.env.OPENAI_API_KEY);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
