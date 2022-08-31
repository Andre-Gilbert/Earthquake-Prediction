"""ML model."""
import pickle

import pandas as pd


class MLModel:
    """ML model that predicts the magnitude of earthquakes."""
    _FEATURES = [
        'latitude',
        'longitude',
        'nst',
        'gap',
        'dmin',
        'place',
        'net',
        'locationSource',
        'status',
    ]
    _TARGET = 'mag'

    def __init__(self) -> None:
        self._model = self._load_model('')

    def _load_model(self, filepath: str) -> None:
        with open(filepath, 'rb') as file:
            model = pickle.load(file)
            return model

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        predictions = self._model.predict(df[self._FEATURES])
        df['predictions'] = predictions
        return df


ml_model = MLModel()
