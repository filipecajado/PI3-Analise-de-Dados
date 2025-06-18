from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ....models.schemas import TimeSeriesRequest, ForecastRequest, TimeSeriesResponse, ForecastResponse
from ....utils.data_processing import load_data, prepare_time_series_data
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/", response_model=TimeSeriesResponse)
def get_time_series(
    disorder: str = Query(..., description="Mental health disorder to analyze"),
    country: Optional[str] = Query(None, description="Country code or 'global' for worldwide data"),
    year_start: Optional[int] = Query(None, description="Start year for analysis"),
    year_end: Optional[int] = Query(None, description="End year for analysis")
):
    """Get time series data for a specific disorder."""
    try:
        print(f"Processing time series request: disorder={disorder}, country={country}, year_start={year_start}, year_end={year_end}")
        
        # Load and prepare data
        print("Loading data...")
        df = load_data()
        print(f"Data loaded successfully. Shape: {df.shape}")
        
        print("Preparing time series data...")
        ts_data = prepare_time_series_data(df, disorder, country, year_start, year_end)
        print(f"Time series data prepared. Shape: {ts_data.shape}")
        
        # Convert to time series format
        time_series = ts_data.groupby('year')['value'].mean().reset_index()
        print(f"Time series grouped. Points: {len(time_series)}")
        
        # Convert numpy types to Python native types
        time_series['year'] = time_series['year'].astype(int)
        time_series['value'] = time_series['value'].astype(float)
        
        # Calculate basic statistics
        stats = {
            "mean": float(time_series['value'].mean()),
            "std": float(time_series['value'].std()),
            "min": float(time_series['value'].min()),
            "max": float(time_series['value'].max()),
            "trend": "increasing" if time_series['value'].iloc[-1] > time_series['value'].iloc[0] else "decreasing"
        }
        print("Statistics calculated:", stats)
        
        response = TimeSeriesResponse(
            message="Time series data retrieved successfully",
            params={
                "disorder": disorder,
                "country": country,
                "year_start": year_start,
                "year_end": year_end
            },
            data=time_series.to_dict('records'),
            metadata={
                "statistics": stats,
                "n_points": int(len(time_series)),
                "years_covered": [int(year) for year in time_series['year'].unique()]
            }
        )
        print("Response prepared successfully")
        return response
        
    except Exception as e:
        print(f"Error in get_time_series: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/forecast", response_model=ForecastResponse)
def forecast(
    disorder: str,
    country: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None,
    forecast_horizon: int = 5,
    method: str = "prophet"
):
    """Forecast mental health disorder trends."""
    try:
        # Load and prepare data
        df = load_data()
        ts_data = prepare_time_series_data(df, disorder, country, year_start, year_end)
        
        # Prepare data for forecasting
        time_series = ts_data.groupby('year')['value'].mean().reset_index()
        time_series['ds'] = pd.to_datetime(time_series['year'].astype(str))
        time_series['y'] = time_series['value']
        
        if method == "prophet":
            # Prophet model
            model = Prophet(yearly_seasonality=True)
            model.fit(time_series[['ds', 'y']])
            
            # Make future predictions
            future = model.make_future_dataframe(periods=forecast_horizon, freq='Y')
            forecast = model.predict(future)
            
            # Prepare response
            predictions = []
            for i in range(len(time_series), len(forecast)):
                predictions.append({
                    "year": forecast.iloc[i]['ds'].year,
                    "value": float(forecast.iloc[i]['yhat']),
                    "lower_bound": float(forecast.iloc[i]['yhat_lower']),
                    "upper_bound": float(forecast.iloc[i]['yhat_upper'])
                })
            
            metrics = {
                "rmse": float(np.sqrt(np.mean((time_series['y'] - forecast['yhat'][:len(time_series)])**2))),
                "mae": float(np.mean(np.abs(time_series['y'] - forecast['yhat'][:len(time_series)]))),
                "mape": float(np.mean(np.abs((time_series['y'] - forecast['yhat'][:len(time_series)]) / time_series['y'])) * 100)
            }
            
        elif method == "arima":
            # ARIMA model
            model = ARIMA(time_series['value'], order=(1,1,1))
            model_fit = model.fit()
            
            # Make predictions
            forecast = model_fit.forecast(steps=forecast_horizon)
            
            # Prepare response
            predictions = []
            last_year = time_series['year'].max()
            for i, value in enumerate(forecast):
                predictions.append({
                    "year": last_year + i + 1,
                    "value": float(value)
                })
            
            metrics = {
                "aic": float(model_fit.aic),
                "bic": float(model_fit.bic)
            }
            
        else:
            raise HTTPException(status_code=400, detail="Invalid forecasting method")
        
        return ForecastResponse(
            message="Forecast generated successfully",
            params={
                "disorder": disorder,
                "country": country,
                "year_start": year_start,
                "year_end": year_end,
                "forecast_horizon": forecast_horizon,
                "method": method
            },
            predictions=predictions,
            confidence_intervals={
                "lower": [p["lower_bound"] for p in predictions] if method == "prophet" else None,
                "upper": [p["upper_bound"] for p in predictions] if method == "prophet" else None
            },
            metrics=metrics
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 