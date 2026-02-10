import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from './assets/images/img2.avif';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://alzheimer-detection-s9hi.onrender.com/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful!");
                navigate("/");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Failed to connect to the server.");
        }
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Arial, sans-serif",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f8f9fa",
                backgroundImage: `url(${img})`,
            }}
        >
            <div
                style={{
                    background: "#f0f0f0",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    textAlign: "center",
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h2 style={{ marginBottom: "20px", color: "black" }}>Signup</h2>

                <form onSubmit={handleSubmit}>
                    <label style={{ textAlign: "left", fontWeight: "bold", color: 'black' }}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%", padding: "10px", marginBottom: "10px",
                            borderRadius: "5px", border: "1px solid #ccc"
                        }}
                    />

                    <label style={{ textAlign: "left", fontWeight: "bold", color: 'black' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%", padding: "10px", marginBottom: "10px",
                            borderRadius: "5px", border: "1px solid #ccc"
                        }}
                    />

                    <label style={{ textAlign: "left", fontWeight: "bold", color: 'black' }}>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%", padding: "10px", marginBottom: "10px",
                            borderRadius: "5px", border: "1px solid #ccc"
                        }}
                    />

                    <label style={{ textAlign: "left", fontWeight: "bold", color: 'black' }}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%", padding: "10px", marginBottom: "15px",
                            borderRadius: "5px", border: "1px solid #ccc"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: "100%", padding: "12px", background: "#007BFF",
                            color: "#fff", border: "none", borderRadius: "5px",
                            cursor: "pointer", fontSize: "16px"
                        }}
                    >
                        Signup
                    </button>
                </form>

                <p style={{ marginTop: "15px", fontSize: "14px", color: "black" }}>
                    Already have an account?
                    <span
                        onClick={() => navigate("/login")}
                        style={{ color: "#007BFF", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" }}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
