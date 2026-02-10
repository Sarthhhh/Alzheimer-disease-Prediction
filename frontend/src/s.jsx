import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SummaryReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const rawResult = location.state?.result || null;
  console.log(rawResult)
  // State variables
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (rawResult) {
      try {
        let resultString;
        console.log(typeof rawResult)
        // Ensure rawResult is a string before parsing
        if (typeof rawResult === "object") {
          // If it's already an object, use it directly
          setPatientData(rawResult);
          return;
        } else if (typeof rawResult === "string") {
          resultString = rawResult.trim();
        } else {
          throw new Error("Invalid data format");
        }

        // Replace single quotes with double quotes to ensure valid JSON format
        resultString = resultString.replace(/'/g, '"');

        // Parse the cleaned JSON string
        const parsedResult = JSON.parse(resultString);
        setPatientData(parsedResult);
      } catch (err) {
        console.error("Error parsing result:", err);
        setError("⚠ Invalid report format. Please check the data structure.");
      }
    }
  }, [rawResult]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🩺 Patient Diagnosis Report</h2>

        {error ? (
          <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>
        ) : patientData ? (
          <div>
            {/* Patient Info Section */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>🧑 Patient Details</h3>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td style={styles.label}>Patient Name:</td>
                    <td style={styles.value}>{patientData["Patient Name"] || "Not Available"}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Age:</td>
                    <td style={styles.value}>{patientData["Age"] || "Not Available"}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Gender:</td>
                    <td style={styles.value}>{patientData["Gender"] || "Not Available"}</td>
                  </tr>
                  <tr>
                    <td style={styles.label}>Report Date:</td>
                    <td style={styles.value}>{patientData["Report Date"] || "Not Available"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Diagnosis Summary */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>🩻 Diagnosis Summary</h3>
              <p style={styles.text}>{patientData["Summary of the diagnosis"] || "No diagnosis available"}</p>
            </div>

            {/* Possible Causes */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>⚠️ Possible Causes & Risk Factors</h3>
              <p style={styles.text}>{patientData["Possible causes and risk factors"] || "No data available"}</p>
            </div>

            {/* Lifestyle & Medical Recommendations */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>💡 Lifestyle & Medical Recommendations</h3>
              <p style={styles.text}>{patientData["Lifestyle and medical recommendations"] || "No recommendations available"}</p>
            </div>

            {/* Long-term Care Suggestions */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>🏥 Long-term Care Suggestions</h3>
              <p style={styles.text}>{patientData["Long-term care suggestions"] || "No data available"}</p>
            </div>

            {/* Emotional Support */}
            <div style={styles.section}>
              <h3 style={styles.subheading}>💙 Emotional & Psychological Support</h3>
              <p style={styles.text}>{patientData["Emotional and psychological support"] || "No details available"}</p>
            </div>

            {/* Back Button */}
            <button style={styles.button} onClick={() => navigate("/")}>
              ⬅ Back to Home
            </button>
          </div>
        ) : (
          <h3 style={{ textAlign: "center", color: "red" }}>⚠ No report available</h3>
        )}
      </div>
    </div>
  );
}

// Inline styles for beautiful formatting
const styles = {
  container: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    maxWidth: "700px",
    width: "100%",
  },
  heading: {
    textAlign: "center",
    color: "#007bff",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  subheading: {
    color: "#007bff",
    fontSize: "1.4rem",
    borderBottom: "2px solid #007bff",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  section: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  label: {
    fontWeight: "bold",
    textAlign: "left",
    padding: "8px",
    borderBottom: "1px solid #ddd",
    width: "40%",
    backgroundColor: "#e9ecef",
  },
  value: {
    textAlign: "left",
    padding: "8px",
    borderBottom: "1px solid #ddd",
    width: "60%",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.6",
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "5px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "bold",
  },
};
