"""ML model."""
import os

import pandas as pd
from app.ml.utils import normalize_df
from catboost import CatBoostRegressor

_MODEL_FILE = os.path.join(os.path.dirname(__file__), 'model')


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
        'status',
    ]
    _TARGET = 'mag'

    def __init__(self):
        self._model = CatBoostRegressor()
        self._model.load_model(_MODEL_FILE)

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        df.dropna(axis=0, inplace=True)
        normalized_df = normalize_df(df, columns=['latitude', 'longitude', 'nst', 'gap', 'dmin', self._TARGET])
        prediction = self._model.predict(normalized_df[self._FEATURES])
        df['prediction'] = prediction
        df.drop(
            columns=[
                'updated',
                'type',
                'status',
                'horizontalError',
                'depthError',
                'magError',
                'magNst',
                'nst',
                'rms',
                'dmin',
                'magSource',
                'locationSource',
                'gap',
                'net',
            ],
            inplace=True,
        )
        df = normalize_df(df, columns=['prediction'], revert=True)
        df = df[::-1]
        return df


ml_model = MLModel()
