"""ML utils."""
from typing import Any
from urllib import parse

import pandas as pd

_PARAMS = {'format': 'csv', 'eventtype': 'earthquake'}


def get_earthquakes_data(base_url: str, date_range: dict[str, str]) -> pd.DataFrame:
    _PARAMS.update(date_range)
    url = build_url(base_url, _PARAMS)
    return pd.read_csv(url)


def build_url(base_url: str, params: dict[str, str]) -> str:
    return base_url + parse.urlencode(params)


def parse_df(df: pd.DataFrame) -> list[dict[str, Any]]:
    return df.to_dict(orient='records')
