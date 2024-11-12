const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");
const pdfParse = require("pdf-parse");

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Load API key from environment variable
});

const openai = new OpenAIApi(configuration);

// Configure multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// OpenAI token limits for text-davinci-003 are approximately 4097 tokens,
// including prompt and response.
// Let's set a safe limit of 3000 characters for input text.
const MAX_TEXT_LENGTH = 3000;

router.post("/summarize", upload.single("file"), async (req, res) => {
  console.log("Uploaded file metadata:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    // Parse the uploaded PDF to extract text
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    let extractedText = pdfData.text;

    if (!extractedText.trim()) {
      return res
        .status(400)
        .json({ error: "Failed to extract text from the document." });
    }

    // Truncate text if it exceeds the safe token limit
    if (extractedText.length > MAX_TEXT_LENGTH) {
      console.warn(
        `Extracted text exceeds ${MAX_TEXT_LENGTH} characters. Truncating.`
      );
      extractedText = extractedText.substring(0, MAX_TEXT_LENGTH);
    }

    // Use OpenAI to generate a summary
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize the following text in bullet points:\n\n${extractedText}`,
      max_tokens: 500, // Limit response to 500 tokens
      temperature: 0.7, // Adjust creativity
    });

    const summary = completion.data.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error.message);
    console.error("Error details:", error.response?.data || error.stack);

    // Provide detailed error response to client
    res.status(500).json({
      error: "Failed to generate summary.",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
