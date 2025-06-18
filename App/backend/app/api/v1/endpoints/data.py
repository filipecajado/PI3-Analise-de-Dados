from fastapi import APIRouter, Query, HTTPException, Response
from typing import List, Dict, Any
import os
from ....core.config import settings
from ....utils.data_processing import load_data, get_available_disorders, get_available_countries, get_available_regions, get_year_range
import pandas as pd

router = APIRouter()

@router.get("/")
def get_data(file: str = Query("mental_health_data.csv")):
    """Get raw data files."""
    try:
        data_dir = settings.RAW_DATA_DIR
        file_path = os.path.join(data_dir, file)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return Response(content, media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename=\"{file}\""
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metadata")
def get_metadata() -> Dict[str, Any]:
    """Get metadata about available data."""
    try:
        print("Loading data...")
        df = load_data()
        print("Data loaded successfully")
        print("Columns:", df.columns.tolist())
        
        print("Getting disorders...")
        disorders = get_available_disorders(df)
        print("Disorders:", disorders)
        
        print("Getting countries...")
        countries = get_available_countries(df)
        print("Countries count:", len(countries))
        
        print("Getting regions...")
        regions = get_available_regions(df)
        print("Regions:", regions)
        
        print("Getting year range...")
        year_range = get_year_range(df)
        print("Year range:", year_range)
        
        return {
            "disorders": disorders,
            "countries": countries,
            "regions": regions,
            "year_range": year_range
        }
    except Exception as e:
        print("Error in get_metadata:", str(e))
        raise HTTPException(status_code=500, detail=str(e)) 