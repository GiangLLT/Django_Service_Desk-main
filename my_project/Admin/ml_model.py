# myapp/ml_model.py
from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier

iris = load_iris()
X, y = iris.data, iris.target

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X, y)

def predict(input_data):
    return model.predict([input_data])[0]