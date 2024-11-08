import React, { useState } from "react";
import "../styles/Homepage.css";
import Upload from "./Upload";

const Homepage = () => {
  const [showUpload, setShowUpload] = useState(false);

  const toggleUploadMenu = () => {
    setShowUpload((prev) => !prev);
  };

  return (
    <div className="homepage-container">
      <h1>Insights Engine</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Type a question..."
        />
        <button className="search-button">Search</button>
      </div>
      <button className="open-upload-button" onClick={toggleUploadMenu}>
        Upload Document
      </button>

      {showUpload && <Upload />}
    </div>
  );
};

export default Homepage;
