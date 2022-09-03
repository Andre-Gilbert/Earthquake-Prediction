"""ML utils."""
from typing import Any
from urllib import parse

import pandas as pd

_PARAMS = {'format': 'csv', 'eventtype': 'earthquake'}


def get_earthquakes_data(base_url: str) -> pd.DataFrame:
    url = build_url(base_url, _PARAMS)
    return pd.read_csv(url)


def build_url(base_url: str, params: dict[str, str]) -> str:
    return base_url + parse.urlencode(params)


def parse_df(df: pd.DataFrame) -> dict[str, Any]:
    return df.to_dict(orient='records')


def normalize_df(df: pd.DataFrame, columns: list[str], revert: bool = False) -> pd.DataFrame:
    if not columns: return df

    def min_max_scaling(series: pd.Series, revert: bool) -> pd.Series:
        if revert: return (series * (series.max() - series.min())) + series.min()
        return (series - series.min()) / (series.max() - series.min())

    for col in columns:
        df[col] = min_max_scaling(col, revert)

    return df
