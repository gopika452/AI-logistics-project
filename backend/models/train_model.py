import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("../data/logistics_data.csv")

# Encode categorical data
le1 = LabelEncoder()
le2 = LabelEncoder()

data["traffic_level"] = le1.fit_transform(data["traffic_level"])
data["weather"] = le2.fit_transform(data["weather"])

X = data[["distance_km","traffic_level","weather","shipment_weight"]]
y = data["delayed"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)

# Model
model = LogisticRegression()
model.fit(X_train,y_train)

# Accuracy
pred = model.predict(X_test)
acc = accuracy_score(y_test,pred)

print("Model Accuracy:",acc)

# Save model
joblib.dump(model,"delay_prediction_model.pkl")

print("Model saved successfully")