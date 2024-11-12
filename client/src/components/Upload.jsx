import React, { useState } from "react";
import "../styles/Upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary(""); // Reset summary for new uploads
    setError(null); // Reset errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Prepare the file for upload using FormData
      const formData = new FormData();
      formData.append("file", file);

      // Send the file to the backend for processing and summarization
      const response = await fetch("http://localhost:5001/api/summarize", {
        method: "POST",
        body: formData, // Send the file as FormData
      });

      const result = await response.json();

      if (response.ok) {
        setSummary(result.summary); // Display the summary if successful
      } else {
        setError(result.error || "Failed to summarize the document.");
      }
    } catch (err) {
      setError(
        "An error occurred while uploading and summarizing the document."
      );
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Document</h2>
      <input type="file" className="file-input" onChange={handleFileChange} />
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload and Summarize"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {summary && (
        <div className="summary-box">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
