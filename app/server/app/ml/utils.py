"""ML utils."""
from typing import Any
from urllib import parse

import pandas as pd
from sklearn.preprocessing import MinMaxScaler

_PARAMS = {'format': 'csv', 'eventtype': 'earthquake'}
_SCALER = MinMaxScaler()


def get_earthquakes_data(base_url: str, date_range: dict[str, str]) -> pd.DataFrame:
    _PARAMS.update(date_range)
    url = build_url(base_url, _PARAMS)
    print(url)
    return pd.read_csv(url)


def build_url(base_url: str, params: dict[str, str]) -> str:
    return base_url + parse.urlencode(params)


def parse_df(df: pd.DataFrame) -> dict[str, Any]:
    return df.to_dict(orient='records')


def normalize_df(df: pd.DataFrame, columns: list[str], revert: bool = False) -> pd.DataFrame:
    if revert:
        df[columns] = _SCALER.inverse_transform(df[columns])
    else:
        df[columns] = _SCALER.fit_transform(df[columns])

    return df
