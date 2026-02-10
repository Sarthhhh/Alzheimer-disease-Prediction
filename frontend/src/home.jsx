import { Link } from "react-router-dom";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "./assets/images/h8.jpg"; // Ensure correct path

const Home = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm AlzBot. Ask me anything about Alzheimer's disease." }
  ]);

  const questionsAndAnswers = {
    "Alzheimer's disease?": "Alzheimer's is a progressive brain disorder that affects memory, thinking, and behavior.",
    "Causes of Alzheimer's?": "The exact cause is unknown, but it involves brain cell damage, genetic factors, and lifestyle.",
    "Early symptoms?": "Early symptoms include memory loss, confusion, difficulty completing tasks, and mood changes.",
    "Memory loss?": "Memory loss is one of the first signs of Alzheimer's, often starting with recent events.",
    "Cognitive decline?": "Cognitive decline affects thinking, decision-making, and problem-solving abilities.",
    "Stages of Alzheimer's?": "There are three stages: Early (mild), Middle (moderate), and Late (severe).",
    "Can it be cured?": "There is no cure yet, but treatments can help manage symptoms and improve quality of life.",
    "Treatment options?": "Treatment includes medications, cognitive therapy, and lifestyle adjustments.",
    "Risk factors?": "Risk factors include aging, genetics, head trauma, and heart health issues.",
    "Genetic link?": "Some cases of Alzheimer's are linked to genes, but not all cases are hereditary.",
    "Lifestyle impact?": "A healthy diet, regular exercise, and social engagement can help reduce risk.",
    "Prevention methods?": "Healthy eating, staying active, and mental exercises may lower the risk.",
    "Brain changes?": "Alzheimer's causes plaques and tangles in the brain, leading to neuron damage.",
    "Diagnosis process?": "Diagnosis includes memory tests, brain scans, and neurological assessments.",
    "Dementia vs. Alzheimer's?": "Dementia is a general term; Alzheimer's is a specific type of dementia.",
    "Common medications?": "Medications like Donepezil and Memantine help manage symptoms.",
    "Mental exercises?": "Reading, puzzles, and learning new skills help keep the brain active.",
    "Diet recommendations?": "A Mediterranean diet rich in fruits, vegetables, and healthy fats may help.",
    "Caregiving tips?": "Provide a structured routine, be patient, and ensure a safe environment."
  };

  const handleUserMessage = (userText) => {
    if (!userText) return;
    setMessages([...messages, { sender: "user", text: userText }]);
    setTimeout(() => {
      const botResponse = questionsAndAnswers[userText] || "I'm not sure about that. Please consult a medical expert.";
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botResponse }]);
    }, 800);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-white text-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        minHeight: "100vh",
        paddingTop: "56px"
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary w-100 p-3 fixed-top">
        <div className="container">
          <a className="navbar-brand fs-3 fw-bold" href="/">🧠 Alzheimer Detection</a>
          <div>
            <Link to="/home" className="btn btn-light me-2 fw-semibold">Home</Link>
            <Link to="/about" className="btn btn-light me-2 fw-semibold">About</Link>
            <Link to="/login" className="btn btn-light me-2 fw-semibold">Login</Link>
            <Link to="/signup" className="btn btn-light me-2 fw-semibold">Signup</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="d-flex flex-column align-items-center text-center p-5 bg-dark bg-opacity-75 rounded shadow-lg" style={{ maxWidth: "600px", width: "80%" }}>
        <h1 className="fw-bold display-5">Early Detection of Alzheimer's Disease Is the Key to a Happier Life</h1>
      </div>

      {/* AlzBot Chatbot - Placed in Right Corner */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "300px"
        }}
      >
        {!showChat ? (
          <button
            className="btn btn-primary"
            onClick={() => setShowChat(true)}
            style={{ borderRadius: "50%", width: "60px", height: "60px", fontSize: "1.5rem" }}
          >
            💬
          </button>
        ) : (
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
              <span>💡 AlzBot - Ask Me Anything</span>
              <button className="btn btn-sm btn-light" onClick={() => setShowChat(false)}>❌</button>
            </div>
            <div className="card-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded ${msg.sender === "bot" ? "bg-light text-dark" : "bg-primary text-white"}`}
                  style={{ maxWidth: "80%", alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end" }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="card-footer">
              <input
                type="text"
                className="form-control"
                placeholder="Type your question..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUserMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
