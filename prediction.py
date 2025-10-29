import pickle
import sys
import json

# Load the model
with open('model/crop_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Function to predict crop
def predict_crop(data):
    # Assuming the model expects a list of features in order: N, P, K, temperature, humidity, ph, rainfall
    features = [data['N'], data['P'], data['K'], data['temperature'], data['humidity'], data['ph'], data['rainfall']]
    prediction = model.predict([features])
    return prediction[0]

if __name__ == "__main__":
    # Read input from stdin
    input_data = json.loads(sys.stdin.read())
    result = predict_crop(input_data)
    print(json.dumps({"crop": result}))
