import React, { useState } from "react";
import "../styles/Upload.css";
import { supabase } from "../supabaseClient";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`public/${file.name}`, file);

    if (data) {
      console.log("File uploaded:", data);
    } else {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Document</h2>
      <input type="file" className="file-input" onChange={handleFileChange} />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default Upload;
