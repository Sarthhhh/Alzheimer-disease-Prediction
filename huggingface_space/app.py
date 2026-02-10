import gradio as gr
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import os

# Load the CNN model
model_path = "alzheimer_cnn_model.keras"
try:
    cnn_model = load_model(model_path)
    print("✅ CNN model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    cnn_model = None

# Class labels
CLASS_LABELS = ["Non-Demented", "Very Mild Demented", "Mild Demented", "Moderate Demented"]

# Recommendations based on diagnosis
RECOMMENDATIONS = {
    "Non-Demented": {
        "summary": "No signs of dementia detected.",
        "recommendations": [
            "Continue regular health check-ups",
            "Maintain a healthy lifestyle with regular exercise",
            "Stay mentally active with puzzles, reading, and social activities",
            "Follow a balanced diet rich in omega-3 fatty acids"
        ]
    },
    "Very Mild Demented": {
        "summary": "Very mild cognitive impairment detected.",
        "recommendations": [
            "Schedule a follow-up appointment with a neurologist",
            "Consider cognitive assessment tests",
            "Engage in brain-stimulating activities",
            "Monitor for any progression of symptoms",
            "Maintain social connections and physical activity"
        ]
    },
    "Mild Demented": {
        "summary": "Mild dementia indicators present.",
        "recommendations": [
            "Consult with a neurologist immediately",
            "Consider starting cognitive therapy",
            "Discuss medication options with your doctor",
            "Set up a support system with family members",
            "Create daily routines and use memory aids",
            "Consider joining a support group"
        ]
    },
    "Moderate Demented": {
        "summary": "Moderate dementia indicators detected.",
        "recommendations": [
            "Urgent consultation with a neurologist required",
            "Comprehensive care plan needed",
            "Consider full-time care assistance",
            "Medication review and management",
            "Safety modifications at home",
            "Legal and financial planning with family",
            "Emotional support for patient and caregivers"
        ]
    }
}

def preprocess_image(image):
    """Preprocess the uploaded image for the model."""
    if image is None:
        return None
    
    # Convert to PIL Image if needed
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    
    # Resize to 128x128
    image = image.resize((128, 128))
    
    # Convert to array and normalize
    img_array = np.array(image) / 255.0
    
    # Ensure 3 channels (RGB)
    if len(img_array.shape) == 2:
        img_array = np.stack([img_array] * 3, axis=-1)
    elif img_array.shape[-1] == 4:
        img_array = img_array[:, :, :3]
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def analyze_mri(image, name, age, gender, memory_loss, daily_activities, family_history, exercise, diet):
    """Analyze the MRI scan and generate a report."""
    
    if image is None:
        return "Please upload an MRI image.", "", ""
    
    if cnn_model is None:
        return "Model not loaded. Please try again.", "", ""
    
    # Preprocess and predict
    processed_image = preprocess_image(image)
    prediction = cnn_model.predict(processed_image, verbose=0)
    diagnosis = CLASS_LABELS[np.argmax(prediction)]
    confidence = float(np.max(prediction)) * 100
    
    # Get recommendations
    rec_data = RECOMMENDATIONS[diagnosis]
    
    # Build the report
    diagnosis_text = f"## 🧠 Diagnosis: {diagnosis}\n\n"
    diagnosis_text += f"**Confidence:** {confidence:.1f}%\n\n"
    diagnosis_text += f"**Summary:** {rec_data['summary']}\n"
    
    # Patient info
    patient_info = f"## 👤 Patient Information\n\n"
    patient_info += f"- **Name:** {name or 'Not provided'}\n"
    patient_info += f"- **Age:** {age or 'Not provided'}\n"
    patient_info += f"- **Gender:** {gender or 'Not provided'}\n"
    patient_info += f"- **Memory Loss Issues:** {memory_loss}\n"
    patient_info += f"- **Difficulty in Daily Activities:** {daily_activities}\n"
    patient_info += f"- **Family History of Alzheimer's:** {family_history}\n"
    patient_info += f"- **Exercise Frequency:** {exercise}\n"
    patient_info += f"- **Diet Type:** {diet}\n"
    
    # Recommendations
    recommendations_text = "## 📋 Recommendations\n\n"
    for i, rec in enumerate(rec_data['recommendations'], 1):
        recommendations_text += f"{i}. {rec}\n"
    
    recommendations_text += "\n---\n"
    recommendations_text += "*⚠️ Disclaimer: This is an AI-based screening tool and should not replace professional medical diagnosis. Please consult a qualified healthcare provider.*"
    
    return diagnosis_text, patient_info, recommendations_text

# Create Gradio Interface
with gr.Blocks(title="Alzheimer's Detection System", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🧠 Alzheimer's Detection from MRI Scans")
    gr.Markdown("Upload a brain MRI scan to analyze for signs of Alzheimer's disease.")
    
    with gr.Row():
        with gr.Column(scale=1):
            image_input = gr.Image(label="Upload MRI Scan", type="pil")
            
            gr.Markdown("### Patient Information")
            name_input = gr.Textbox(label="Patient Name", placeholder="Enter name")
            
            with gr.Row():
                age_input = gr.Number(label="Age", minimum=1, maximum=120)
                gender_input = gr.Dropdown(label="Gender", choices=["Male", "Female", "Other"])
            
            memory_loss = gr.Radio(label="Memory Loss Issues?", choices=["Yes", "No"], value="No")
            daily_activities = gr.Radio(label="Difficulty in Daily Activities?", choices=["Yes", "No"], value="No")
            family_history = gr.Radio(label="Family History of Alzheimer's?", choices=["Yes", "No"], value="No")
            exercise = gr.Dropdown(label="Exercise Frequency", choices=["Regularly", "Sometimes", "Never"], value="Sometimes")
            diet = gr.Dropdown(label="Diet Type", choices=["Healthy", "Unhealthy"], value="Healthy")
            
            analyze_btn = gr.Button("🔍 Analyze MRI", variant="primary")
        
        with gr.Column(scale=1):
            diagnosis_output = gr.Markdown(label="Diagnosis")
            patient_output = gr.Markdown(label="Patient Info")
            recommendations_output = gr.Markdown(label="Recommendations")
    
    analyze_btn.click(
        fn=analyze_mri,
        inputs=[image_input, name_input, age_input, gender_input, memory_loss, daily_activities, family_history, exercise, diet],
        outputs=[diagnosis_output, patient_output, recommendations_output]
    )
    
    gr.Markdown("---")
    gr.Markdown("### Sample MRI Images for Testing")
    gr.Markdown("You can find sample Alzheimer's MRI images at: [Kaggle Dataset](https://www.kaggle.com/datasets/tourist55/alzheimers-dataset-4-class-of-images)")

if __name__ == "__main__":
    demo.launch()
