import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SummaryReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result.report || null;

  const sectionStyle = {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
  };



  const listStyle = {
    marginLeft: "20px",
    lineHeight: "1.6",
  };

  const reportContainer = {
    maxWidth: "900px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  <style>
    {`
    @media print {
      .action-buttons {
        display: none !important;
      }
    }
  `}
  </style>
  return (

    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "30px" }}>
        🧠 Diagnosis Summary Report
      </h1>

      {result ? (
        <div style={reportContainer}>
          {/* 🖨️ Print and 🔙 Go Back Buttons */}

          {/* 📄 Report Sections */}
          <div style={sectionStyle}>
            <h2>👤 Patient Information</h2>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Age:</strong> {result.age}</p>
            <p><strong>Gender:</strong> {result.gender}</p>
            <p><strong>Report Date:</strong> {result.report_date}</p>
          </div>

          <div style={sectionStyle}>
            <h2>📋 Summary of the Diagnosis</h2>
            <p style={{ textAlign: "justify" }}>{result["Summary of the diagnosis"]}</p>
          </div>

          <div style={sectionStyle}>
            <h2>🔍 Possible Causes and Risk Factors</h2>
            <p style={{ textAlign: "justify" }}>{result["Possible causes and risk factors"]}</p>
          </div>

          <div style={sectionStyle}>
            <h2>💡 Lifestyle and Medical Recommendations</h2>
            <p style={{ textAlign: "justify" }}>{result["Lifestyle and medical recommendations"]}</p>
      
          </div>

          <div style={sectionStyle}>
            <h2>🏥 Long-Term Care Suggestions</h2>
            <p style={{ textAlign: "justify" }}>{result["Long-term care suggestions"]}</p>
          </div>

          <div style={sectionStyle}>
            <h2>💬 Emotional and Psychological Support</h2>
            <p style={{ textAlign: "justify" }}>{result["Emotional and psychological support"]}</p>
          </div>
        </div>
      ) : (
        <h2 style={{ textAlign: "center", color: "#ff0000", fontWeight: "bold" }}>
          ⚠️ No report available
        </h2>
      )}
      <div className="action-buttons" style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            marginRight: "15px",
          }}
        >
          🖨️ Print Report
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🔙 Go Back
        </button>
      </div>
    </div>
  );

}
