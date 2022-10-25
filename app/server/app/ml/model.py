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

    def _preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        data = []
        for place in set(df.place):
            temp = df.loc[df.place == place]
            temp = self._create_features(temp)
            temp = self._add_lags(temp)
            temp = self._add_rolling_windows(temp)

            data.append(temp)

        df = pd.concat(data)
        return df

    def _create_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df['hour'] = df.index.hour
        df['dayofweek'] = df.index.dayofweek
        df['month'] = df.index.month
        df['year'] = df.index.year
        df['dayofyear'] = df.index.dayofyear
        df['dayofmonth'] = df.index.day
        df['weekofyear'] = df.index.isocalendar().week
        df['quarter'] = df.index.quarter
        df['season'] = df.month % 12 // 3 + 1
        return df

    def _add_lags(self, df: pd.DataFrame) -> pd.DataFrame:
        df['mag_5d_lag'] = df.mag.shift(5)
        df['mag_10d_lag'] = df.mag.shift(10)
        df['mag_15d_lag'] = df.mag.shift(15)

        df['depth_5d_lag'] = df.depth.shift(5)
        df['depth_10d_lag'] = df.depth.shift(10)
        df['depth_15d_lag'] = df.depth.shift(15)
        return df

    def _add_rolling_windows(self, df: pd.DataFrame) -> pd.DataFrame:
        df['mag_5d_avg'] = df.mag.rolling(window=5, center=False).mean()
        df['mag_10d_avg'] = df.mag.rolling(window=10, center=False).mean()
        df['mag_15d_avg'] = df.mag.rolling(window=15, center=False).mean()
        df['mag_5d_min'] = df.mag.rolling(window=5, center=False).min()
        df['mag_10d_min'] = df.mag.rolling(window=10, center=False).min()
        df['mag_15d_min'] = df.mag.rolling(window=15, center=False).min()
        df['mag_5d_max'] = df.mag.rolling(window=5, center=False).max()
        df['mag_10d_max'] = df.mag.rolling(window=10, center=False).max()
        df['mag_15d_max'] = df.mag.rolling(window=15, center=False).max()
        df['mag_5d_std'] = df.mag.rolling(window=5, center=False).std()
        df['mag_10d_std'] = df.mag.rolling(window=10, center=False).std()
        df['mag_15d_std'] = df.mag.rolling(window=15, center=False).std()

        df['depth_5d_avg'] = df.depth.rolling(window=5, center=False).mean()
        df['depth_10d_avg'] = df.depth.rolling(window=10, center=False).mean()
        df['depth_15d_avg'] = df.depth.rolling(window=15, center=False).mean()
        df['depth_5d_min'] = df.depth.rolling(window=5, center=False).min()
        df['depth_10d_min'] = df.depth.rolling(window=10, center=False).min()
        df['depth_15d_min'] = df.depth.rolling(window=15, center=False).min()
        df['depth_5d_max'] = df.depth.rolling(window=5, center=False).max()
        df['depth_10d_max'] = df.depth.rolling(window=10, center=False).max()
        df['depth_15d_max'] = df.depth.rolling(window=15, center=False).max()
        df['depth_5d_std'] = df.depth.rolling(window=5, center=False).std()
        df['depth_10d_std'] = df.depth.rolling(window=10, center=False).std()
        df['depth_15d_std'] = df.depth.rolling(window=15, center=False).std()
        return df


ml_model = MLModel()
