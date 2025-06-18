"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import type { ModelType } from "./model-selector"

interface ResultsDashboardProps {
  modelType: ModelType
  modelName: string
  results: any // Tipo específico dependendo do modelo
  onExport: (format: string) => void
  onShare: () => void
}

export function ResultsDashboard({ modelType, modelName, results, onExport, onShare }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState("visualization")

  // Renderiza diferentes visualizações baseadas no tipo de modelo
  const renderVisualization = () => {
    switch (modelType) {
      case "timeSeries":
        return renderTimeSeriesVisualization()
      case "clustering":
        return renderClusteringVisualization()
      // Outros casos para diferentes tipos de modelos
      default:
        return <p>Nenhuma visualização disponível</p>
    }
  }

  const renderTimeSeriesVisualization = () => {
    // Aqui seria implementada a visualização específica para séries temporais
    // Usando bibliotecas como Recharts ou D3.js
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Previsão de Tendências</h3>
        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
          [Gráfico de Previsão de Séries Temporais]
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Decomposição de Tendência</h4>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">[Gráfico de Tendência]</div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Decomposição de Sazonalidade</h4>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              [Gráfico de Sazonalidade]
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderClusteringVisualization = () => {
    // Visualização específica para clustering
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Análise de Clusters</h3>
        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">[Gráfico de Clusters]</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Distribuição por Cluster</h4>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              [Gráfico de Distribuição]
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Características dos Clusters</h4>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              [Gráfico de Características]
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderiza métricas de desempenho
  const renderMetrics = () => {
    switch (modelType) {
      case "timeSeries":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="RMSE" value="0.0324" description="Erro Quadrático Médio" />
            <MetricCard title="MAE" value="0.0256" description="Erro Absoluto Médio" />
            <MetricCard title="MAPE" value="3.45%" description="Erro Percentual Absoluto Médio" />
            <MetricCard title="R²" value="0.876" description="Coeficiente de Determinação" />
          </div>
        )
      case "clustering":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard title="Silhouette" value="0.724" description="Coeficiente de Silhueta" />
            <MetricCard title="Inertia" value="245.3" description="Soma das Distâncias Quadráticas" />
            <MetricCard title="Davies-Bouldin" value="0.453" description="Índice Davies-Bouldin" />
          </div>
        )
      // Outros casos para diferentes tipos de modelos
      default:
        return <p>Nenhuma métrica disponível</p>
    }
  }

  // Renderiza insights gerados
  const renderInsights = () => {
    switch (modelType) {
      case "timeSeries":
        return (
          <div className="space-y-4">
            <InsightCard
              title="Tendência de Crescimento"
              description="A prevalência de depressão mostra uma tendência de crescimento de 2.3% ao ano nos próximos 5 anos."
              importance="high"
            />
            <InsightCard
              title="Sazonalidade Detectada"
              description="Detectamos um padrão sazonal anual com picos nos meses de inverno."
              importance="medium"
            />
            <InsightCard
              title="Ponto de Inflexão"
              description="Um ponto de inflexão é previsto para 2026, quando a taxa de crescimento deve desacelerar."
              importance="high"
            />
          </div>
        )
      case "clustering":
        return (
          <div className="space-y-4">
            <InsightCard
              title="3 Perfis Distintos"
              description="Identificamos 3 grupos distintos de países com padrões similares de saúde mental."
              importance="high"
            />
            <InsightCard
              title="Cluster de Alto Risco"
              description="O cluster 2 apresenta altas taxas de depressão e ansiedade combinadas com baixa cobertura de tratamento."
              importance="high"
            />
            <InsightCard
              title="Correlação Socioeconômica"
              description="Existe uma correlação significativa entre o PIB per capita e o cluster ao qual um país pertence."
              importance="medium"
            />
          </div>
        )
      // Outros casos para diferentes tipos de modelos
      default:
        return <p>Nenhum insight disponível</p>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resultados da Análise</CardTitle>
            <CardDescription>
              {modelName} ({modelType})
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visualization">Visualização</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization">{renderVisualization()}</TabsContent>

          <TabsContent value="metrics">{renderMetrics()}</TabsContent>

          <TabsContent value="insights">{renderInsights()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
}

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  )
}

interface InsightCardProps {
  title: string
  description: string
  importance: "low" | "medium" | "high"
}

function InsightCard({ title, description, importance }: InsightCardProps) {
  const getBadgeColor = () => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor()}`}>
          {importance === "high"
            ? "Alta Relevância"
            : importance === "medium"
              ? "Média Relevância"
              : "Baixa Relevância"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
