import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import os
from ..core.config import settings

def load_data(file_name: str = "1- mental-illnesses-prevalence.csv") -> pd.DataFrame:
    """Load data from CSV file."""
    # Get the absolute path to the App directory (two levels up from this file)
    app_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    file_path = os.path.join(app_dir, "data", "raw", file_name)
    
    print("Looking for file at:", file_path)
    print("File exists:", os.path.exists(file_path))
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Data file not found: {file_path}")
    return pd.read_csv(file_path)

def filter_data(
    df: pd.DataFrame,
    disorder: Optional[str] = None,
    country: Optional[str] = None,
    region: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None
) -> pd.DataFrame:
    """Filter data based on various criteria."""
    if disorder:
        df = df[df['Entity'] == disorder]
    if country:
        df = df[df['Code'] == country]
    if year_start:
        df = df[df['Year'] >= year_start]
    if year_end:
        df = df[df['Year'] <= year_end]
    return df

def translate_disorder(disorder: str) -> str:
    """Translate disorder name to Portuguese."""
    translations = {
        "Anxiety disorders": "Ansiedade",
        "Bipolar disorders": "Bipolar",
        "Depressive disorders": "Depressão",
        "Eating disorders": "Alimentar",
        "Schizophrenia disorders": "Esquizofrenia"
    }
    return translations.get(disorder, disorder)

def get_available_disorders(df: pd.DataFrame) -> List[str]:
    """Get list of available disorders in the dataset."""
    # Extract disorder names from column names
    disorder_columns = [col for col in df.columns if 'disorders' in col.lower()]
    # Clean up the column names to get just the disorder names
    disorders = []
    for col in disorder_columns:
        # Remove the common suffix and clean up the name
        disorder = col.split(' (')[0].strip()
        disorders.append(disorder)
    return [translate_disorder(d) for d in sorted(disorders)]

def get_available_countries(df: pd.DataFrame) -> List[str]:
    """Get list of available countries in the dataset."""
    # Filter out rows where Code is empty or NaN
    valid_codes = df[df['Code'].notna() & (df['Code'] != '')]['Code'].unique()
    return sorted(valid_codes.tolist())

def get_available_regions(df: pd.DataFrame) -> List[str]:
    """Get list of available regions in the dataset."""
    # Get entities where Code is empty or NaN
    regions = df[df['Code'].isna() | (df['Code'] == '')]['Entity'].unique()
    return sorted(regions.tolist())

def get_year_range(df: pd.DataFrame) -> Dict[str, int]:
    """Get the range of years in the dataset."""
    return {
        "min": int(df['Year'].min()),
        "max": int(df['Year'].max())
    }

def validate_features(df: pd.DataFrame, features: List[str]) -> None:
    """Validate that all requested features exist in the dataset."""
    missing_features = [f for f in features if f not in df.columns]
    if missing_features:
        raise ValueError(f"Features not found in dataset: {missing_features}")

def prepare_time_series_data(
    df: pd.DataFrame,
    disorder: str,
    country: Optional[str] = None,
    year_start: Optional[int] = None,
    year_end: Optional[int] = None
) -> pd.DataFrame:
    """Prepare data for time series analysis."""
    # Filter by country and year range
    filtered_df = df.copy()
    
    # Handle global data (average across all countries)
    if country == "global":
        # Filter out rows where Code is empty or NaN (regions)
        filtered_df = filtered_df[filtered_df['Code'].notna() & (filtered_df['Code'] != '')]
    elif country:
        filtered_df = filtered_df[filtered_df['Code'] == country]
        
    if year_start:
        filtered_df = filtered_df[filtered_df['Year'] >= year_start]
    if year_end:
        filtered_df = filtered_df[filtered_df['Year'] <= year_end]
    
    # Get the full column name for the disorder
    disorder_col = next((col for col in df.columns if disorder in col), None)
    if not disorder_col:
        raise ValueError(f"Disorder '{disorder}' not found in dataset")
    
    # Create a new DataFrame with just the time series data
    result_df = filtered_df[['Year', disorder_col]].copy()
    result_df.columns = ['year', 'value']  # Changed column names to match API response
    
    # For global data, calculate the mean across all countries for each year
    if country == "global":
        result_df = result_df.groupby('year')['value'].mean().reset_index()
    
    return result_df.sort_values('year')

def prepare_clustering_data(
    df: pd.DataFrame,
    year: int,
    features: List[str]
) -> pd.DataFrame:
    """Prepare data for clustering analysis."""
    filtered_df = df[df['Year'] == year]
    validate_features(filtered_df, features)
    return filtered_df[features]

def prepare_correlation_data(
    df: pd.DataFrame,
    year: int,
    disorders: List[str]
) -> pd.DataFrame:
    """Prepare data for correlation analysis."""
    filtered_df = df[df['Year'] == year]
    return filtered_df.pivot_table(
        index='Code',
        columns='Entity',
        values='Prevalence',
        aggfunc='mean'
    )[disorders]

def prepare_regression_data(
    df: pd.DataFrame,
    target: str,
    features: List[str],
    year: Optional[int] = None,
    country: Optional[str] = None
) -> pd.DataFrame:
    """Prepare data for regression analysis."""
    filtered_df = filter_data(df, None, country, None, year, year)
    validate_features(filtered_df, features + [target])
    return filtered_df[features + [target]]

def prepare_anomaly_data(
    df: pd.DataFrame,
    disorder: str,
    year: Optional[int] = None,
    features: Optional[List[str]] = None
) -> pd.DataFrame:
    """Prepare data for anomaly detection."""
    filtered_df = filter_data(df, disorder, None, None, year, year)
    if features:
        validate_features(filtered_df, features)
        return filtered_df[features]
    return filtered_df[['Prevalence']] 