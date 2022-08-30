"""Earthquake endpoint."""
from backend.app.core.config import Settings
from backend.app.ml.utils import get_earthquake_data
from fastapi import APIRouter

router = APIRouter()


@router.post('/predict-earthquakes-magnitudes')
def predict_earthquake_magnitude():
    df = get_earthquake_data(Settings.USGS_EARTHQUAKE_API_URL)
    return df
