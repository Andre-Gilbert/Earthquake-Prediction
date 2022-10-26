"""ML model."""
import os

import pandas as pd
from catboost import CatBoostRegressor

_MODEL_FILE = os.path.join(os.path.dirname(__file__), 'model')


class MLModel:
    """ML model that predicts the magnitude of earthquakes."""
    _FEATURES = [
        'dayofyear',
        'hour',
        'dayofweek',
        'month',
        'season',
        'year',
        'mag_5d_lag',
        'mag_10d_lag',
        'mag_15d_lag',
        'mag_5d_avg',
        'mag_10d_avg',
        'mag_15d_avg',
        'mag_5d_min',
        'mag_10d_min',
        'mag_15d_min',
        'mag_5d_max',
        'mag_10d_max',
        'mag_15d_max',
        'mag_5d_std',
        'mag_10d_std',
        'mag_15d_std',
        'depth_5d_lag',
        'depth_10d_lag',
        'depth_15d_lag',
        'depth_5d_avg',
        'depth_10d_avg',
        'depth_15d_avg',
        'depth_5d_min',
        'depth_10d_min',
        'depth_15d_min',
        'depth_5d_max',
        'depth_10d_max',
        'depth_15d_max',
        'depth_5d_std',
        'depth_10d_std',
        'depth_15d_std',
        'latitude',
        'longitude',
    ]

    def __init__(self):
        self._model = CatBoostRegressor()
        self._model.load_model(_MODEL_FILE)

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.set_index('time')
        df.index = pd.to_datetime(df.index)
        df.place = df.place.str.split(', ', expand=True)[1]
        df = df[::-1]
        df = df.ffill()
        df = self._preprocess_data(df)

        prediction = self._model.predict(df[self._FEATURES]).round(6)
        df_pred = df[['latitude', 'longitude', 'depth', 'mag', 'magType', 'id', 'place']]
        df_pred['time'] = df.index.copy()
        df_pred['prediction'] = prediction
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
        df = pd.concat({f'mag_{i}eq_lag': df.mag.shift(i) for i in range(5, 16, 5)}, axis=1)
        df = pd.concat({f'depth_{i}eq_lag': df.depth.shift(i) for i in range(5, 16, 5)}, axis=1)
        return df

    def _add_rolling_windows(self, df: pd.DataFrame) -> pd.DataFrame:
        df = pd.concat(
            {f'mag_{i}eq_avg': df.mag.rolling(window=i, center=False).mean() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'mag_{i}eq_min': df.mag.rolling(window=i, center=False).min() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'mag_{i}eq_max': df.mag.rolling(window=i, center=False).max() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'mag_{i}eq_std': df.mag.rolling(window=i, center=False).std() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'depth_{i}eq_avg': df.depth.rolling(window=i, center=False).mean() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'depth_{i}eq_min': df.depth.rolling(window=i, center=False).min() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'depth_{i}eq_max': df.depth.rolling(window=i, center=False).max() for i in range(5, 16, 5)},
            axis=1,
        )

        df = pd.concat(
            {f'depth_{i}eq_std': df.depth.rolling(window=i, center=False).std() for i in range(5, 16, 5)},
            axis=1,
        )

        return df


ml_model = MLModel()
