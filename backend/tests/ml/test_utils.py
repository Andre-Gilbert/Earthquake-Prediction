"""Tests the ML utils."""
import pandas as pd
import pytest
from app.ml.utils import normalize_df

_DATA = [pd.DataFrame(data={'col1': list(range(1, 11)), 'col2': list(range(-10, 0)), 'col3': list(range(-5, 5))})]


@pytest.mark.parametrize('df', _DATA)
def test_normalize_df(df: pd.DataFrame) -> None:
    normalized_df = normalize_df(df, columns=df.columns)
    for col in normalized_df.columns:
        assert normalized_df[col].min() == 0
        assert normalized_df[col].max() == 1

    denormalized_df = normalize_df(normalized_df, columns=df.columns, revert=True)
    for col in denormalized_df.columns:
        assert denormalized_df[col].min() != 0
        assert denormalized_df[col].max() != 1

    assert denormalized_df.equals(df)
