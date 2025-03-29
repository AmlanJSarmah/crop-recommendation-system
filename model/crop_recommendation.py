import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pickle
from flask import Flask, request, jsonify

# Constants
model = joblib.load("recommendation.pkl")
with open("data.pkl", "rb") as f:
    df = pickle.load(f)

#PCA
X = df.drop("label", axis=1, inplace=False)
y = df.label

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Output
app = Flask(__name__)

# Map Cluster to Crop
def map_cluster_to_crop(cluster: int):
    if cluster == 0:
        return ["chickpea", "kidneybeans", "lentil", "pigeonpeas", "mothbeans"]
    elif cluster == 1:
        return ["banana", "papaya", "rice", "coconut", "jute"]
    elif cluster == 2:
        return ["blackgram", "mango", "mothbeans", "maize", "mungbean"]
    elif cluster == 3:
        return ["grapes", "apple"]
    else:
        return ["cotton", "watermelon", "muskmelon", "coffee", "orange"]

# Routes
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    new_sample = pd.DataFrame({"N": [data["N"]], "P" : [data["P"]], "K" : [data["K"]], "temperature" : [data["temperature"]], "humidity" : [data["humidity"]], "ph" : [data["ph"]], "rainfall" : [data["rainfall"]]})
    new_sample_scaled = scaler.transform(new_sample)
    new_sample_pca = pca.transform(new_sample_scaled)
    cluster = model.predict(new_sample_pca)
    return jsonify({"Message": "Success", "Cluster" : int(cluster[0]), "Crops" : map_cluster_to_crop(int(cluster[0]))}) , 201

if __name__ == '__main__':
    app.run(debug=True)