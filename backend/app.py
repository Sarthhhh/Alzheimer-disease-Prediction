from flask import Flask, request, jsonify
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import google.generativeai as genai  # Gemini API
from flask_cors import CORS
import sqlite3
import json
import ast
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DATABASE = "db.sqlite3"

def create_connection():
    return sqlite3.connect(DATABASE)

def init_db():
    """Initialize database tables if they don't exist."""
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            memory_loss_issues TEXT NOT NULL,
            difficulty_in_daily_activities TEXT NOT NULL,
            family_history TEXT NOT NULL,
            exercise_daily TEXT NOT NULL,
            diet_type TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully.")

# Initialize DB on startup
init_db()

# Load CNN Model
try:
    model_path = os.path.join(os.path.dirname(__file__), "alzheimer_cnn_model.keras")
    cnn_model = load_model(model_path)
    print("✅ CNN model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading CNN model: {e}")
    cnn_model = None

# Configure Gemini API (Replace with your API key)
genai.configure(api_key="AIzaSyBctRA3rZ6ZM6v6xjvYdZk1XKtjmGEGW_4")

def preprocess_image(img_path):
    print(f"Preprocessing image at {img_path}")
    img = image.load_img(img_path, target_size=(128, 128))  # Ensure correct size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    print(f"Image preprocessed: {img_array.shape}")
    return img_array

def predict_mri(img_path):
    if cnn_model is None:
        print("❌ Error: CNN model not loaded.")
        return "Error: CNN model not loaded."

    img_array = preprocess_image(img_path)
    print("Running prediction...")
    prediction = cnn_model.predict(img_array)
    print(f"Prediction: {prediction}")

    class_labels = ["Non-Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]
    return class_labels[np.argmax(prediction)]

def generate_medical_report(diagnosis, patient_data):
    prompt = (
        f"Generate a detailed Alzheimer's medical report for a patient. "
        f"The MRI result is {diagnosis}. "
        f"Patient details: {patient_data}. "
        f"Include:\n"
        f"- Summary of the diagnosis\n"
        f"- Possible causes and risk factors\n"
        f"- Lifestyle and medical recommendations\n"
        f"- Long-term care suggestions\n"
        f"- Emotional and psychological support\n\n"
        f"""note :- give the output in proper below JSON format
        
            Patient Name:
            Age:
            Gender:
            Report Date:
            Summary of the diagnosis:
            Possible causes and risk factors:
            Lifestyle and medical recommendations:
            Long-term care suggestions:
            Emotional and psychological support:
        
        """
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Use gemini-1.5-pro if available
        response = model.generate_content(prompt)
        return response.text if response else "Report generation failed."
    except Exception as e:
        print(f"❌ Error generating report: {e}")
        return "Unable to generate report."

def add_patient(data):
    print("data=",data, type(data))
    data = ast.literal_eval(data)
    print("data=",data, type(data))
    name = data["name"]
    age = data["age"]
    gender = data["gender"]
    memory_loss_issues = data["memoryLoss"]
    difficulty_in_daily_activities = data["dailyActivities"]
    family_history = data["familyHistory"]
    exercise_daily = data["exercise"]
    diet_type = data["diet"]
    
    if not all([name, age, gender, memory_loss_issues, difficulty_in_daily_activities, family_history, exercise_daily, diet_type]):
        return jsonify({"message": "All fields are required"}), 400

    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO patients (name, age, gender, memory_loss_issues, difficulty_in_daily_activities, 
                                 family_history, exercise_daily, diet_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, age, gender, memory_loss_issues, difficulty_in_daily_activities, family_history, exercise_daily, diet_type))
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(e)
        return False
    finally:
        conn.close()
from test import ret_dict
@app.route("/predict", methods=["POST"])
def predict():
    pd = request.form.get('patient_data')
    print(pd)
    save_to_db = add_patient(pd)
    if not save_to_db:
        print("error saving")
        return jsonify({"message": f"Error saving data to db"}), 500
    print("Prediction started")
    
    # Check if the file is in the request
    if "file" not in request.files:
        print("❌ No file found in request.")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    
    # Check if the file has a name
    if file.filename == "":
        print("❌ No selected file.")
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file to the server
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    print(f"Saving file to {file_path}")
    file.save(file_path)

    try:
        # Get patient data from the form (if available)
        patient_data = request.form.get("patient_data", "No additional info provided.")
        print(f"Patient data received: {patient_data}")
        
        # Predict the MRI result
        mri_result = predict_mri(file_path)
        print(f"MRI result: {mri_result}")
        
        # Generate the medical report
        report = generate_medical_report(mri_result, patient_data)
        # report = str(report).replace("**",'')
        print(f"Report generated: {report}")
        new = ret_dict(report)
        print(new)
        # Clean up the uploaded file
        os.remove(file_path)
        # return jsonify({"diagnosis": mri_result, "report": report}), 200
        return jsonify({"report": new}), 200        

    except Exception as e:
        print(f"❌ Error in processing: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data["username"]
    email = data["email"]
    phone = data["phone"]
    password = data["password"]  # TODO: Hash the password for security

    if not (username and email and phone and password):
        return jsonify({"message": "All fields are required"}), 400

    conn = create_connection()
    cursor = conn.cursor()

    # Check if username or email already exists
    cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", (username, email))
    existing_user = cursor.fetchone()
    
    if existing_user:
        return jsonify({"message": "Username or email already exists"}), 400

    try:
        cursor.execute("INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)", 
                       (username, email, phone, password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return jsonify({"message": "Database error"}), 500
    finally:
        conn.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]
    print(username, password)

    if not (username and password):
        return jsonify({"message": "Username and password are required"}), 400

    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port, host='0.0.0.0')
