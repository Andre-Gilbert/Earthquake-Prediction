"""Tests the ML utils."""
import pandas as pd
from app.ml.utils import normalize_df


def test_normalize_df() -> None:
    df = pd.DataFrame({
        'col1': list(range(1, 11)),
        'col2': list(range(-10, 0)),
        'col3': list(range(-5, 5)),
    })

    normalized_df = normalize_df(df, columns=df.columns)
    for col in normalized_df.columns:
        assert normalized_df[col].min() == 0
        assert normalized_df[col].max() == 1
