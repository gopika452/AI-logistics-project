import pandas as pd
import random

# Number of rows
rows = 1000

data = []

for i in range(rows):
    distance = random.randint(5, 500)  # km
    traffic = random.choice(["Low", "Medium", "High"])
    weather = random.choice(["Clear", "Rainy", "Foggy"])
    weight = random.randint(1, 50)  # kg

    # Base delivery time calculation
    delivery_time = (distance / 45) + random.uniform(0.3, 2.5)

    # Improved realistic delay logic
    if traffic == "High" and distance > 120:
        delay = 1
    elif weather != "Clear" and distance > 150:
        delay = 1
    elif delivery_time > 7:
        delay = 1
    else:
        delay = 0

    data.append([
        distance,
        traffic,
        weather,
        weight,
        round(delivery_time, 2),
        delay
    ])

# Create DataFrame
df = pd.DataFrame(data, columns=[
    "distance_km",
    "traffic_level",
    "weather",
    "shipment_weight",
    "delivery_time_hr",
    "delayed"
])

# Save dataset
df.to_csv("logistics_data.csv", index=False)

print("Dataset created successfully: logistics_data.csv")