from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.router import api_router

app = FastAPI(
    title="Mental Health Analysis API",
    description="API for analyzing mental health data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    """Root endpoint returning API information"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": "1.0.0",
        "endpoints": {
            "data": f"{settings.API_V1_STR}/data",
            "time_series": f"{settings.API_V1_STR}/time-series",
            "clustering": f"{settings.API_V1_STR}/clustering",
            "correlation": f"{settings.API_V1_STR}/correlation",
            "regression": f"{settings.API_V1_STR}/regression",
            "anomaly": f"{settings.API_V1_STR}/anomaly",
            "statistical": f"{settings.API_V1_STR}/statistical"
        }
    } 