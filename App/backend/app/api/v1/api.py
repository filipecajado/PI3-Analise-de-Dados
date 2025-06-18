from fastapi import APIRouter
from .endpoints import data, time_series, clustering

api_router = APIRouter()

api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(time_series.router, prefix="/time-series", tags=["time-series"])
api_router.include_router(clustering.router, prefix="/clustering", tags=["clustering"]) 