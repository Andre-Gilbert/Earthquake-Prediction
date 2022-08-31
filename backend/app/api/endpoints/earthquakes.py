"""Earthquake endpoint."""
from app.core.config import settings
from app.ml.model import ml_model
from app.ml.utils import get_earthquakes_data, parse_df
from fastapi import APIRouter

router = APIRouter()


@router.post('/predict-magnitudes')
def predict_magnitudes():
    df = get_earthquakes_data(settings.USGS_EARTHQUAKE_API_URL)
    df_pred = ml_model.predict(df)
    response = parse_df(df_pred)
    return response
