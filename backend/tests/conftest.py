"""Test fixtures."""
from typing import Generator

import pytest
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture(scope='module')
def client() -> Generator:
    with TestClient(app) as test_client:
        yield test_client
