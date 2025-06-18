from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from ....utils.data_processing import load_data, prepare_clustering_data

router = APIRouter()

@router.post("/analyze")
async def analyze_clusters(
    year: int,
    features: List[str],
    n_clusters: int = 3
) -> Dict[str, Any]:
    """Perform clustering analysis on the data."""
    try:
        # Load and prepare data
        df = load_data()
        data = prepare_clustering_data(df, year, features)
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(data)
        
        # Get cluster centers
        centers = kmeans.cluster_centers_
        
        # Prepare results
        results = {
            "clusters": clusters.tolist(),
            "centers": centers.tolist(),
            "feature_names": features,
            "inertia": float(kmeans.inertia_)
        }
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 