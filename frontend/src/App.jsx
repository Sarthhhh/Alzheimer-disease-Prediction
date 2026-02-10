import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SummaryReport from "./summaryReport";
import Login from "./login";
import Signup from "./signup";
import 'bootstrap/dist/css/bootstrap.min.css';
import img from './assets/images/back.avif';
import Home from "./home";
import About from "./About"; // Import the About page




function FormPage() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    familyHistory: "",
    exercise: "",
    diet: "",
    memoryLoss: "",
    dailyActivities: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an MRI image.");
      return;
    }
    const datatosend = new FormData();
    datatosend.append("file", file);
    datatosend.append("patient_data", JSON.stringify(formData));

    try {
      const response = await fetch("https://alzheimer-detection-s9hi.onrender.com/predict", {
        method: "POST",
        body: datatosend,
      });
      const data = await response.json();
      setError(null);
      navigate("/summary", { state: { result: data } });
    } catch (error) {
      setError("Something went wrong while processing the request.");
    }
  };

  const selectFields = [
    { name: "familyHistory", label: "Family History of Alzheimer's", options: ["Yes", "No"] },
    { name: "exercise", label: "Do you exercise daily?", options: ["Regularly", "Sometimes", "Never"] },
    { name: "diet", label: "Diet Type", options: ["Healthy", "Unhealthy"] }
  ];




  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100" style={{
      backgroundImage: `url(${img})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="card shadow p-4 d-flex flex-row align-items-center" style={{ width: "60rem", height: "auto", background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)", borderRadius: "15px" }}>
        <div className="w-50 p-3">
          <h1 className="text-center mb-4">Alzheimer's Diagnosis</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Name</label>
              <input type="text" name="name" onChange={handleInputChange} required className="form-control" />
            </div>
            <div className="d-flex gap-3">
              <div className="mb-3 w-50">
                <label className="form-label fw-bold">Age</label>
                <input type="number" name="age" onChange={handleInputChange} required className="form-control" />
              </div>
              <div className="mb-3 w-50">
                <label className="form-label fw-bold">Gender</label>
                <select name="gender" onChange={handleInputChange} required className="form-select">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Memory Loss Issues</label>
              <select name="memoryLoss" onChange={handleInputChange} required className="form-select">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Difficulty in Daily Activities</label>
              <select name="dailyActivities" onChange={handleInputChange} required className="form-select">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </form>
        </div>

        <div className="w-50 p-3">
          <form onSubmit={handleSubmit}>
            {selectFields.map((field, index) => (
              <div key={index} className="mb-3">
                <label className="form-label fw-bold">{field.label}</label>
                <select name={field.name} onChange={handleInputChange} required className="form-select">
                  <option value="">Select</option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label fw-bold">Upload MRI Scan:</label>
              <input type="file" onChange={handleFileChange} required className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
          {error && <div className="text-danger text-center mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/summary" element={<SummaryReport />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} /> {/* New About Page Route */}
      </Routes>
    </Router>
  );
}
