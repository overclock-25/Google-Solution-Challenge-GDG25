import gradio as gr
import pandas as pd
from joblib import load
import numpy as np
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict
from pydantic import BaseModel

# Define a Pydantic model for the input data
class FeatureData(BaseModel):
    N: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    soil_moisture: float
    soil_type: float
    sunlight_exposure: float
    wind_speed: float
    co2_concentration: float
    organic_matter: float
    growth_stage: float
    urban_area_proximity: float
    water_source_type: float

# Load trained models
regressor = load("gbr_regressor_model.pkl")  # Regression model
classifier = load("rf_classifier_model.pkl")  # Classification model
label_encoder = load("label_encoder.pkl")

# Define expected feature order
feature_order = [
    "N", "temperature", "humidity", "ph", "rainfall", "soil_moisture", "soil_type",
    "sunlight_exposure", "wind_speed", "co2_concentration", "organic_matter", "growth_stage",
    "urban_area_proximity", "water_source_type"
]

def predict(*features):
    # Convert input features into a Pandas DataFrame
    input_df = pd.DataFrame([features], columns=feature_order)

    # Make predictions
    regression_prediction = regressor.predict(input_df).flatten().tolist()
    clf_prediction = classifier.predict(input_df)[0]
    predicted_crop = label_encoder.inverse_transform([clf_prediction])[0]
    if regression_prediction[0]<0:
        regression_prediction[0] = "No information"
    if regression_prediction[1] < 0:
        regression_prediction[1] = "No information"
    # Return JSON response
    return {
        "regression_prediction": regression_prediction,
        "crop_prediction": predicted_crop
    }

# Create a FastAPI app
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development).  CHANGE THIS FOR PRODUCTION!
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
@app.get("/wakeUp")
async def wakeUp():
    return {"status": 200}

@app.post("/predict")
async def api_predict(data: FeatureData):
 
    return predict(*data.dict().values())


# Gradio Interface (using the FastAPI endpoint)
def gradio_predict(*args):
    return predict(*args)

# Gradio Interface
iface = gr.Interface(
    fn=gradio_predict,  # Placeholder function
    inputs=[gr.Number(label=col) for col in feature_order],  # Inputs match feature order
    outputs="json",  # Return JSON output
    title="Farmer's API"
)

# Launch the Gradio interface
if __name__ == "__main__":
    app = gr.mount_gradio_app(app, iface, path="/")  # Mount Gradio app to FastAPI
    uvicorn.run(app, host="0.0.0.0", port=7860)