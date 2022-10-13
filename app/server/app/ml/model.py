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
        'place',
        'net',
        'status',
    ]

    def __init__(self):
        self._model = CatBoostRegressor()
        self._model.load_model(_MODEL_FILE)

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.dropna(axis=0)
        normalized_df = normalize_df(df.copy(), columns=['nst', 'gap'])
        prediction = self._model.predict(normalized_df[self._FEATURES])
        df_pred = df.copy()
        df_pred['prediction'] = prediction
        df_pred['prediction'] = df_pred['prediction'].round(6)
        df_pred = df_pred.drop(columns=[
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
        ])
        return df_pred[::-1]


ml_model = MLModel()
