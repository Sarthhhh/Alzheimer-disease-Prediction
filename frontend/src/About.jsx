import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "./assets/images/h1.jpg"; 

const About = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "120vh", // Increased background height
        width: "100vw", // Full width
        backgroundColor: "white", // White background
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="p-5 text-dark text-center"
        style={{
          maxWidth: "900px", // Adjusted content box width
          width: "85%",
          backgroundColor: "#87CEEB", // Sky blue content box
          color: "black",
          borderRadius: "15px",
          boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)", // Smooth shadow
        }}
      >
        <h1 className="fw-bold">Alzheimer’s Disease</h1>
        <p className="mt-3">
          Alzheimer’s disease is a degenerative brain disorder that gradually impairs memory, thinking skills, and the ability to perform everyday tasks. It is the leading cause of dementia and affects millions worldwide. While the exact cause is still being studied, researchers believe that abnormal protein buildups in the brain, including amyloid plaques and tau tangles, play a significant role in its progression.
        </p>
        <p>
          Although there is no cure, early diagnosis allows individuals to seek medical intervention, manage symptoms more effectively, and explore potential treatments. Lifestyle modifications, such as regular exercise, a balanced diet, and cognitive training, may help slow cognitive decline. Our platform provides early screening tools to help detect Alzheimer's in its initial stages, enabling people to take proactive steps for better long-term health.
        </p>
        <div className="mt-4">
          <Link
            to="/home"
            className="btn btn-primary"
            style={{
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
