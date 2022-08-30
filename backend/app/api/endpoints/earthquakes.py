"""Earthquake endpoint."""
from app.core.config import settings
from app.ml.utils import get_earthquakes_data
from fastapi import APIRouter

router = APIRouter()


@router.post('/predict-magnitudes')
def predict_magnitudes():
    df = get_earthquakes_data(settings.USGS_EARTHQUAKE_API_URL)
    return df
