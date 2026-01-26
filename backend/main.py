from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

# CORS Fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("../models/delay_prediction_model.pkl")

@app.get("/")
def home():
    return {"message": "AI Logistics Backend Running Successfully"}

@app.post("/predict")
def predict_delay(data: dict):
    test_data = np.array([[
        data["distance_km"],
        data["traffic_level"],
        data["weather"],
        data["shipment_weight"]
    ]])

    result = model.predict(test_data)

    return {"prediction": "Delayed" if result[0]==1 else "On Time"}