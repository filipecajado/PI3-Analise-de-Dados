"use client"

import { useState, useEffect } from "react"
import { ModelSelector, type ModelType } from "@/components/ml/model-selector"
import { ParameterConfig } from "@/components/ml/parameter-config"
import { ProcessingFeedback } from "@/components/ml/processing-feedback"
import { RealTimeMetrics } from "@/components/ml/real-time-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { TimeSeriesVisualization } from "@/components/ml/visualizations/time-series"
import { getMetadata, getTimeSeries, getForecast } from "@/lib/api"
import { translateDisorderToEnglish } from "@/lib/api"

export default function MLAnalysisPage() {
  const [selectedModelType, setSelectedModelType] = useState<ModelType | null>(null)
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null)
  const [modelParameters, setModelParameters] = useState<Record<string, any>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [processingLogs, setProcessingLogs] = useState<string[]>([])
  const [metricsData, setMetricsData] = useState<any>({})
  const [results, setResults] = useState<any>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [isCancelled, setIsCancelled] = useState(false)

  // Load metadata on component mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await getMetadata()
        setMetadata(data)
      } catch (error) {
        console.error('Failed to load metadata:', error)
      }
    }
    loadMetadata()
  }, [])

  // Timer for elapsed time
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isProcessing) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isProcessing])

  // Processing simulation
  useEffect(() => {
    if (!isProcessing) return

    let progressInterval: NodeJS.Timeout

    const updateProgress = () => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 1

        let newStage = processingStage
        if (newProgress < 20) {
          newStage = "Pré-processamento"
        } else if (newProgress < 70) {
          newStage = "Treinamento"
        } else if (newProgress < 90) {
          newStage = "Validação"
        } else {
          newStage = "Geração de Insights"
        }

        if (newStage !== processingStage) {
          setProcessingStage(newStage)
        }

        if (newProgress % 10 === 0) {
          addLog(`Progresso: ${newProgress}% concluído`)
        }

        if (newProgress > 0) {
          const remaining = Math.round((100 - newProgress) * (timeElapsed / newProgress))
          setTimeRemaining(remaining > 0 ? remaining : null)
        }

        if (newProgress >= 100) {
          setTimeout(() => {
            setIsProcessing(false)
            setProcessingProgress(100)
            addLog("Processamento concluído com sucesso!")
          }, 1000)
          return 100
        }

        return newProgress
      })
    }

    progressInterval = setInterval(updateProgress, 300)

    return () => {
      clearInterval(progressInterval)
    }
  }, [isProcessing, processingStage, timeElapsed])

  const handleModelSelect = (modelType: ModelType, modelName: string) => {
    setSelectedModelType(modelType)
    setSelectedModelName(modelName)
    setModelParameters({})
    setResults(null)
  }

  const handleParametersChange = (params: Record<string, any>) => {
    setModelParameters(params)
  }

  const handleStartTraining = async () => {
    setIsProcessing(true)
    setIsCancelled(false)
    setProcessingProgress(0)
    setTimeElapsed(0)
    setTimeRemaining(null)
    setProcessingLogs([])
    setMetricsData({})
    setResults(null)

    addLog(`Iniciando análise de ${getModelTypeName(selectedModelType)}`)
    addLog(`Parâmetros: ${JSON.stringify(modelParameters)}`)

    try {
      setProcessingStage("Pré-processamento")
      setProcessingProgress(20)
      addLog("Carregando dados históricos...")

      // Ensure we have all required parameters
      if (!modelParameters.target) {
        throw new Error("Transtorno não selecionado");
      }

      // Set default year range if not provided
      const yearRange = {
        year_start: modelParameters.year_start || metadata?.year_range?.min || 1990,
        year_end: modelParameters.year_end || metadata?.year_range?.max || 2019
      };

      // Fetch historical data
      const timeSeriesData = await getTimeSeries({
        target: modelParameters.target,
        region: modelParameters.region || "global",
        year_start: yearRange.year_start,
        year_end: yearRange.year_end
      });

      setProcessingStage("Treinamento")
      setProcessingProgress(50)
      addLog("Treinando modelo de previsão...")

      // Get forecast
      const forecastData = await getForecast({
        target: modelParameters.target,
        region: modelParameters.region || "global",
        year_start: yearRange.year_start,
        year_end: yearRange.year_end,
        forecastPeriod: modelParameters.forecastPeriod || 5,
        method: modelParameters.method || 'prophet'
      });

      setProcessingStage("Validação")
      setProcessingProgress(80)
      addLog("Validando resultados...")

      // Process results
      setResults({
        timeSeries: timeSeriesData,
        forecast: forecastData
      });

      setProcessingStage("Geração de Insights")
      setProcessingProgress(90)
      addLog("Gerando insights...")

      // Calculate metrics
      const metrics = {
        rmse: forecastData.metrics.rmse,
        mae: forecastData.metrics.mae,
        mape: forecastData.metrics.mape
      }
      setMetricsData(metrics)

      setProcessingProgress(100)
      addLog("Análise concluída com sucesso!")
      setIsProcessing(false)
    } catch (error) {
      console.error('Error during analysis:', error)
      addLog(`Erro durante a análise: ${error.message}`)
      setIsProcessing(false)
    }
  }

  const getModelTypeName = (type: ModelType | null): string => {
    switch (type) {
      case "timeSeries":
        return "Previsão de Tendências"
      case "clustering":
        return "Agrupamento de Perfis"
      case "correlation":
        return "Correlação entre Transtornos"
      case "regression":
        return "Fatores de Influência"
      case "anomaly":
        return "Detecção de Anomalias"
      default:
        return "análise"
    }
  }

  const handleCancelProcessing = () => {
    setIsProcessing(false)
    setIsCancelled(true)
    addLog("Processamento cancelado pelo usuário")
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setProcessingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const handleExport = (format: string) => {
    addLog(`Exportando resultados em formato ${format}`)
  }

  const handleShare = () => {
    addLog("Compartilhando resultados")
  }

  const renderVisualization = () => {
    if (!selectedModelType) return null

    switch (selectedModelType) {
      case "timeSeries":
        return (
          <TimeSeriesVisualization
            params={modelParameters}
            showForecast={true}
            forecastParams={{
              ...modelParameters,
              forecast_horizon: 5,
              method: "prophet"
            }}
          />
        )
      case "clustering":
        return <div>Clustering visualization (to be implemented)</div>
      case "correlation":
        return <div>Correlation visualization (to be implemented)</div>
      case "regression":
        return <div>Regression visualization (to be implemented)</div>
      case "anomaly":
        return <div>Anomaly visualization (to be implemented)</div>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ModelSelector onModelSelect={handleModelSelect} />
      
      {selectedModelType && (
        <>
          <ParameterConfig
            modelType={selectedModelType}
            onParametersChange={handleParametersChange}
            onStartTraining={handleStartTraining}
            metadata={metadata}
          />
          
          {isProcessing && (
            <Button
              onClick={handleCancelProcessing}
              variant="destructive"
              className="w-full"
            >
              Cancelar
            </Button>
          )}

          {isProcessing && (
            <ProcessingFeedback
              stage={processingStage}
              progress={processingProgress}
              timeElapsed={timeElapsed}
              timeRemaining={timeRemaining}
              logs={processingLogs}
            />
          )}

          {results && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RealTimeMetrics metrics={metricsData} />
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderVisualization()}
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={() => handleExport("csv")} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button onClick={() => handleExport("json")} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar JSON
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
