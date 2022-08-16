"""Earthquake endpoint."""
from fastapi import APIRouter

router = APIRouter()


@router.post('/predict')
def predict():
    pass


@router.post('/predict-all')
def predict_all():
    pass
