import joblib

model = joblib.load("../models/delay_prediction_model.pkl")

# Example shipment
test = [[250,2,1,30]]   # distance, traffic, weather, weight

result = model.predict(test)

print("Delayed" if result[0]==1 else "On Time")