"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MetricPoint {
  iteration: number
  value: number
}

interface MetricsData {
  loss?: MetricPoint[]
  accuracy?: MetricPoint[]
  rmse?: MetricPoint[]
  silhouette?: MetricPoint[]
  [key: string]: MetricPoint[] | undefined
}

interface RealTimeMetricsProps {
  modelType: string
  metrics: MetricsData
}

export function RealTimeMetrics({ modelType, metrics }: RealTimeMetricsProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  // Determina quais métricas mostrar com base no tipo de modelo
  const getRelevantMetrics = () => {
    switch (modelType) {
      case "timeSeries":
        return ["loss", "rmse"]
      case "clustering":
        return ["silhouette", "inertia"]
      case "classification":
        return ["loss", "accuracy", "precision", "recall"]
      case "regression":
        return ["loss", "rmse", "r2"]
      default:
        return Object.keys(metrics)
    }
  }

  const relevantMetrics = getRelevantMetrics()

  // Cores para diferentes métricas
  const metricColors: Record<string, string> = {
    loss: "#ef4444",
    accuracy: "#22c55e",
    rmse: "#f59e0b",
    silhouette: "#3b82f6",
    inertia: "#8b5cf6",
    precision: "#06b6d4",
    recall: "#ec4899",
    r2: "#14b8a6",
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Métricas em Tempo Real</CardTitle>
        <CardDescription>Acompanhe o desempenho do modelo durante o treinamento</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={relevantMetrics[0]} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4">
            {relevantMetrics.map((metric) => (
              <TabsTrigger key={metric} value={metric} className="capitalize">
                {metric}
              </TabsTrigger>
            ))}
          </TabsList>

          {relevantMetrics.map((metric) => (
            <TabsContent key={metric} value={metric}>
              <div className="h-64" ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics[metric] || []} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="iteration" label={{ value: "Iteração", position: "insideBottom", offset: -5 }} />
                    <YAxis
                      label={{
                        value: metric.toUpperCase(),
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [Number(value).toFixed(4), metric.toUpperCase()]}
                      labelFormatter={(label) => `Iteração ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={metricColors[metric] || "#8884d8"}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <span className="font-medium">Atual: </span>
                  {metrics[metric] && metrics[metric]!.length > 0
                    ? metrics[metric]![metrics[metric]!.length - 1].value.toFixed(4)
                    : "N/A"}
                </div>
                <div>
                  <span className="font-medium">Melhor: </span>
                  {metrics[metric] && metrics[metric]!.length > 0
                    ? Math.min(...metrics[metric]!.map((m) => m.value)).toFixed(4)
                    : "N/A"}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
