"""Tests the earthquakes endpoint."""
from datetime import datetime, timedelta

from app.core.config import settings
from fastapi.testclient import TestClient

_DATE_FORMAT = '%d-%m-%Y'


def test_predict_magnitudes(client: TestClient) -> None:
    starttime = datetime.today() - timedelta(days=30)
    endtime = datetime.today()
    data = {
        'starttime': starttime.strftime(_DATE_FORMAT),
        'endtime': endtime.strftime(_DATE_FORMAT),
    }
    response = client.post(f'{settings.API_V1_STR}/earthquakes/predict-magnitudes', json=data)
    assert response.status_code == 200
    data = response.json()
    assert 'predictions' in data
    assert data['predictions']
