"""Earthquake endpoint."""
from typing import Any

from app.core.config import settings
from app.ml.model import ml_model
from app.ml.utils import get_earthquakes_data, parse_df
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Earthquake(BaseModel):
    """List object of the PredictMagnitudes response model."""
    time: str
    latitude: float
    longitude: float
    depth: float
    mag: float
    magType: str  # pylint: disable=invalid-name
    id: str
    place: str
    prediction: float


class PredictMagnitudes(BaseModel):
    """Response model of the /predict-magnitudes endpoint."""
    predictions: list[Earthquake]


class DateRange(BaseModel):
    """Request body."""
    starttime: str
    endtime: str


@router.post('/predict-magnitudes', response_model=PredictMagnitudes)
def predict_magnitudes(date_range: DateRange) -> Any:
    df = get_earthquakes_data(settings.USGS_EARTHQUAKE_API_URL, date_range)
    df_pred = ml_model.predict(df)
    return {'predictions': parse_df(df_pred)}
