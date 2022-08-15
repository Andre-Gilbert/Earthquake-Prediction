"""API Configuration."""
from pydantic import AnyHttpUrl, BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = '/api/v1'
    PROJECT_NAME: str = 'Earthquake Prediction'

    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []


settings = Settings()
