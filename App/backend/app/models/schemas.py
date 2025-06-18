from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Base Models
class TimeRange(BaseModel):
    start_year: Optional[int] = Field(None, description="Start year for analysis")
    end_year: Optional[int] = Field(None, description="End year for analysis")

class RegionFilter(BaseModel):
    country: Optional[str] = Field(None, description="Country to filter by")
    region: Optional[str] = Field(None, description="Region to filter by")

# Time Series Models
class TimeSeriesRequest(TimeRange, RegionFilter):
    disorder: str = Field(..., description="Mental health disorder to analyze")

class ForecastRequest(TimeSeriesRequest):
    forecast_horizon: int = Field(5, description="Number of periods to forecast")

# Clustering Models
class ClusteringRequest(BaseModel):
    year: int = Field(..., description="Year to analyze")
    features: List[str] = Field(..., description="Features to use for clustering")
    n_clusters: int = Field(3, description="Number of clusters")
    method: str = Field("kmeans", description="Clustering method to use")

# Correlation Models
class CorrelationRequest(BaseModel):
    year: int = Field(..., description="Year to analyze")
    disorders: List[str] = Field(..., description="Disorders to correlate")
    method: str = Field("pearson", description="Correlation method to use")

# Regression Models
class RegressionRequest(RegionFilter):
    target: str = Field(..., description="Target variable to predict")
    features: List[str] = Field(..., description="Features to use for prediction")
    year: Optional[int] = Field(None, description="Year to analyze")
    method: str = Field("linear", description="Regression method to use")

# Anomaly Detection Models
class AnomalyRequest(RegionFilter):
    disorder: str = Field(..., description="Disorder to analyze for anomalies")
    year: Optional[int] = Field(None, description="Year to analyze")
    features: Optional[List[str]] = Field(None, description="Features to use for anomaly detection")
    method: str = Field("isolation_forest", description="Anomaly detection method to use")

# Statistical Analysis Models
class StatisticalRequest(RegionFilter):
    disorder: str = Field(..., description="Disorder to analyze")
    year: Optional[int] = Field(None, description="Year to analyze")
    analysis_type: str = Field("descriptive", description="Type of statistical analysis to perform")

# Response Models
class BaseResponse(BaseModel):
    message: str
    params: Dict[str, Any]

class TimeSeriesResponse(BaseResponse):
    data: List[Dict[str, Any]]
    metadata: Dict[str, Any]

class ForecastResponse(BaseResponse):
    predictions: List[Dict[str, Any]]
    confidence_intervals: Dict[str, List[float]]
    metrics: Dict[str, float]

class ClusteringResponse(BaseResponse):
    clusters: List[Dict[str, Any]]
    centroids: List[Dict[str, Any]]
    metrics: Dict[str, float]

class CorrelationResponse(BaseResponse):
    correlation_matrix: Dict[str, Dict[str, float]]
    p_values: Optional[Dict[str, Dict[str, float]]]

class RegressionResponse(BaseResponse):
    coefficients: Dict[str, float]
    predictions: List[Dict[str, Any]]
    metrics: Dict[str, float]

class AnomalyResponse(BaseResponse):
    anomalies: List[Dict[str, Any]]
    scores: List[float]
    threshold: float

class StatisticalResponse(BaseResponse):
    statistics: Dict[str, Any]
    tests: Optional[Dict[str, Any]]
    visualizations: Optional[Dict[str, Any]] 