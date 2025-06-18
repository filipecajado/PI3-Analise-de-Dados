import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTimeSeries, getForecast, type TimeSeriesParams, type ForecastParams } from '@/lib/api';

interface TimeSeriesVisualizationProps {
  params: TimeSeriesParams;
  showForecast?: boolean;
  forecastParams?: ForecastParams;
}

export function TimeSeriesVisualization({ params, showForecast = false, forecastParams }: TimeSeriesVisualizationProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch time series data
        const tsResponse = await getTimeSeries(params);
        setTimeSeriesData(tsResponse);

        // Fetch forecast data if requested
        if (showForecast && forecastParams) {
          const fcResponse = await getForecast(forecastParams);
          setForecastData(fcResponse);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, showForecast, forecastParams]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!timeSeriesData) {
    return null;
  }

  // Prepare data for visualization
  const chartData = [
    ...timeSeriesData.data.map((point: any) => ({
      year: point.year,
      value: point.value,
      type: 'Historical'
    })),
    ...(forecastData?.predictions.map((point: any) => ({
      year: point.year,
      value: point.value,
      type: 'Forecast'
    })) || [])
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Series Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                name="Value"
                strokeWidth={2}
              />
              {forecastData && (
                <>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    name="Forecast"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  {forecastData.confidence_intervals.lower && (
                    <Line
                      type="monotone"
                      dataKey="lower_bound"
                      stroke="#82ca9d"
                      name="Lower Bound"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  )}
                  {forecastData.confidence_intervals.upper && (
                    <Line
                      type="monotone"
                      dataKey="upper_bound"
                      stroke="#82ca9d"
                      name="Upper Bound"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Display statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Statistics</h3>
            <ul className="space-y-1">
              <li>Mean: {timeSeriesData.metadata.statistics.mean.toFixed(2)}</li>
              <li>Std Dev: {timeSeriesData.metadata.statistics.std.toFixed(2)}</li>
              <li>Min: {timeSeriesData.metadata.statistics.min.toFixed(2)}</li>
              <li>Max: {timeSeriesData.metadata.statistics.max.toFixed(2)}</li>
              <li>Trend: {timeSeriesData.metadata.statistics.trend}</li>
            </ul>
          </div>
          {forecastData && (
            <div>
              <h3 className="font-semibold mb-2">Forecast Metrics</h3>
              <ul className="space-y-1">
                {forecastData.metrics.rmse && (
                  <li>RMSE: {forecastData.metrics.rmse.toFixed(4)}</li>
                )}
                {forecastData.metrics.mae && (
                  <li>MAE: {forecastData.metrics.mae.toFixed(4)}</li>
                )}
                {forecastData.metrics.mape && (
                  <li>MAPE: {forecastData.metrics.mape.toFixed(2)}%</li>
                )}
                {forecastData.metrics.aic && (
                  <li>AIC: {forecastData.metrics.aic.toFixed(2)}</li>
                )}
                {forecastData.metrics.bic && (
                  <li>BIC: {forecastData.metrics.bic.toFixed(2)}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 