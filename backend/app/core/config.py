"""API configuration."""
from pydantic import AnyHttpUrl, BaseSettings, validator


class Settings(BaseSettings):
    """Global API settings."""
    API_V1_STR: str = '/api/v1'
    PROJECT_NAME: str = 'Earthquake Prediction'
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []
    USGS_EARTHQUAKE_API_URL: str = 'https://earthquake.usgs.gov/fdsnws/event/1/'

    @classmethod
    @validator('BACKEND_CORS_ORIGINS', pre=True)
    def assemble_cors_origins(cls, value: list[str]) -> list[str]:
        if not isinstance(value, (list)): raise ValueError(value)
        return value

    class Config:
        case_sensitive = True
        env_file = '.env'


settings = Settings()
