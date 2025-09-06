import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResumeEditPage = () => {
    // 1. Upload page se data receive karo
    const location = useLocation();
    const { file, content } = location.state || {};
    
    // 2. State setup karo
    const [editedContent, setEditedContent] = useState(content || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnhanced, setIsEnhanced] = useState(false);
    const [error, setError] = useState('');

    const handleManualEdit = (e) => {
        setEditedContent(e.target.value);
        setIsEnhanced(false); // Agar manually edit kiya to AI enhanced status hata do
    };

    const enhanceWithAI = async () => {
  if (!editedContent) {
    setError("No resume content to enhance.");
    return;
  }

  setIsProcessing(true);
  setError("");

  try {
    const res = await fetch("http://localhost:8000/api/enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section: "summary",  // make this dynamic later
        data: editedContent,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const result = await res.json();
    const cleanedText = result.enhanced.replace(/\*/g, "").trim();
    setEditedContent(cleanedText);
    setIsEnhanced(true);
  } catch (err) {
    console.error("Enhance request failed:", err);
    setError("AI enhancement failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

    if (!file) {
        return (
            <div>
                <h2>Resume Not Found</h2>
                <p>Please go back to the upload page and upload a resume.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Edit Your Resume</h2>
            <div style={{ marginBottom: '15px' }}>
                <button 
                    onClick={handleManualEdit} 
                    style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}
                >
                    Manual Edit
                </button>
                <button 
                    onClick={enhanceWithAI} 
                    disabled={isProcessing} 
                    style={{ padding: '10px', cursor: 'pointer' }}
                >
                    {isProcessing ? 'Enhancing...' : 'AI Enhance'}
                </button>
            </div>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <textarea
                value={editedContent}
                onChange={handleManualEdit}
                rows="20"
                cols="80"
                style={{ width: '100%', border: '1px solid #ccc', padding: '10px' }}
            />
        </div>
    );
};

export default ResumeEditPage;