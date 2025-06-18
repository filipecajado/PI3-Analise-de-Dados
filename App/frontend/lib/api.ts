const API_BASE_URL = 'http://localhost:8000/api/v1';

// Translation maps
const disorderTranslations: Record<string, string> = {
  "Ansiedade": "Anxiety disorders",
  "Transtornos de Ansiedade": "Anxiety disorders",
  "Bipolar": "Bipolar disorders",
  "Transtornos Bipolares": "Bipolar disorders",
  "Depressão": "Depressive disorders",
  "Transtornos Depressivos": "Depressive disorders",
  "Alimentar": "Eating disorders",
  "Transtornos Alimentares": "Eating disorders",
  "Esquizofrenia": "Schizophrenia disorders",
  "Transtornos Esquizofrênicos": "Schizophrenia disorders"
};

// Helper function to translate disorder name to English for API calls
export function translateDisorderToEnglish(disorder: string): string {
  const translated = disorderTranslations[disorder];
  if (!translated) {
    console.warn(`No translation found for disorder: ${disorder}`);
    return disorder;
  }
  return translated;
}

// Helper function to handle fetch with retry
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  try {
    console.log('Fetching URL:', url);
    console.log('Fetch options:', options);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (retries > 0) {
      console.log(`Retrying fetch... ${retries} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export interface TimeSeriesParams {
  target: string;
  region?: string;
  year_start?: number;
  year_end?: number;
}

export interface ForecastParams extends TimeSeriesParams {
  forecastPeriod?: number;
  method?: 'prophet' | 'arima';
}

export interface TimeSeriesResponse {
  message: string;
  params: TimeSeriesParams;
  data: Array<{
    year: number;
    value: number;
  }>;
  metadata: {
    statistics: {
      mean: number;
      std: number;
      min: number;
      max: number;
      trend: string;
    };
    n_points: number;
    years_covered: number[];
  };
}

export interface ForecastResponse {
  message: string;
  params: ForecastParams;
  predictions: Array<{
    year: number;
    value: number;
    lower_bound?: number;
    upper_bound?: number;
  }>;
  confidence_intervals: {
    lower: number[] | null;
    upper: number[] | null;
  };
  metrics: {
    rmse?: number;
    mae?: number;
    mape?: number;
    aic?: number;
    bic?: number;
  };
}

export async function getTimeSeries(params: TimeSeriesParams): Promise<TimeSeriesResponse> {
  const queryParams = new URLSearchParams();
  const translatedParams = {
    disorder: translateDisorderToEnglish(params.target),
    country: params.region || "global",
    year_start: params.year_start,
    year_end: params.year_end
  };
  
  Object.entries(translatedParams).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/time-series?${queryParams}`;
  console.log('Time series request:', {
    url,
    params: translatedParams,
    queryString: queryParams.toString()
  });

  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    console.log('Time series response:', data);
    return data;
  } catch (error) {
    console.error('Error in getTimeSeries:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: translatedParams
    });
    throw error;
  }
}

export async function getForecast(params: ForecastParams): Promise<ForecastResponse> {
  const queryParams = new URLSearchParams();
  const translatedParams = {
    disorder: translateDisorderToEnglish(params.target),
    country: params.region || "global",
    year_start: params.year_start,
    year_end: params.year_end,
    forecast_horizon: params.forecastPeriod || 5,
    method: params.method || 'prophet'
  };
  
  Object.entries(translatedParams).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/time-series/forecast?${queryParams}`;
  console.log('Forecast request:', {
    url,
    params: translatedParams,
    queryString: queryParams.toString()
  });

  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    console.log('Forecast response:', data);
    return data;
  } catch (error) {
    console.error('Error in getForecast:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      params: translatedParams
    });
    throw error;
  }
}

export async function getMetadata() {
  try {
    console.log('Fetching metadata from:', `${API_BASE_URL}/data/metadata`);
    const response = await fetchWithRetry(`${API_BASE_URL}/data/metadata`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Metadata fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch metadata: ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    console.log('Metadata received:', data);
    return data;
  } catch (error) {
    console.error('Error in getMetadata:', error);
    throw error;
  }
} 