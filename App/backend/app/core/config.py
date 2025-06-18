from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Mental Health Analysis API"
    
    # Data settings
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    RAW_DATA_DIR: str = os.path.join(DATA_DIR, "raw")
    PROCESSED_DATA_DIR: str = os.path.join(DATA_DIR, "processed")
    
    # Model settings
    DEFAULT_FORECAST_HORIZON: int = 5
    DEFAULT_N_CLUSTERS: int = 3
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 