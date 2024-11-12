const express = require("express");
const multer = require("multer"); // For file handling
const OpenAIApi = require("openai"); // Correct import for OpenAI
const pdfParse = require("pdf-parse"); // To extract text from PDFs

const router = express.Router();

// Configure OpenAI with environment variable

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
  // "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",
});

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/summarize", upload.single("file"), async (req, res) => {
  console.log("RES>>>>", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    if (!extractedText.trim()) {
      return res
        .status(400)
        .json({ error: "Failed to extract text from document." });
    }

    // Call OpenAI API for summarization
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Summarize the following text in bullet points.",
        },
        { role: "user", content: extractedText },
      ],
    });

    const summary = completion.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error.message);
    res.status(500).json({
      error: "Failed to generate summary.",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
