from fastapi import APIRouter
from .endpoints import (
    data,
    time_series,
    clustering,
    # correlation,
    # regression,
    # anomaly,
    # statistical
)

api_router = APIRouter()

api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(time_series.router, prefix="/time-series", tags=["time-series"])
api_router.include_router(clustering.router, prefix="/clustering", tags=["clustering"])
# api_router.include_router(correlation.router, prefix="/correlation", tags=["correlation"])
# api_router.include_router(regression.router, prefix="/regression", tags=["regression"])
# api_router.include_router(anomaly.router, prefix="/anomaly", tags=["anomaly"])
# api_router.include_router(statistical.router, prefix="/statistical", tags=["statistical"]) 