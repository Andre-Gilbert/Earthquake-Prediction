"""Tests the earthquakes endpoint."""
from app.core.config import settings
from fastapi.testclient import TestClient


def test_predict_magnitudes(client: TestClient) -> None:
    response = client.post(f'{settings.API_V1_STR}/earthquakes/predict-magnitudes')
    assert response.status_code == 200
    data = response.json()
    assert 'predictions' in data
    assert data['predictions']
