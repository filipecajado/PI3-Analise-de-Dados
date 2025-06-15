"use client"

import { useState, useEffect } from "react"
import { ModelSelector, type ModelType } from "@/components/ml/model-selector"
import { ParameterConfig } from "@/components/ml/parameter-config"
import { ProcessingFeedback } from "@/components/ml/processing-feedback"
import { RealTimeMetrics } from "@/components/ml/real-time-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MLAnalysisPage() {
  // Estados para controle do fluxo de ML
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

  // Adicionar estado para controlar o cancelamento
  const [isCancelled, setIsCancelled] = useState(false)

  // Timer para tempo decorrido
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

  // Simulação de WebSocket para atualizações em tempo real
  useEffect(() => {
    if (!isProcessing) return

    let progressInterval: NodeJS.Timeout

    // Função para atualizar o progresso uma única vez
    const updateProgress = () => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 1

        // Atualiza estágio com base no novo progresso
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

        // Só atualiza o estágio se for diferente
        if (newStage !== processingStage) {
          setProcessingStage(newStage)
        }

        // Adiciona log a cada 10%
        if (newProgress % 10 === 0) {
          addLog(`Progresso: ${newProgress}% concluído`)
        }

        // Atualiza tempo restante
        if (newProgress > 0) {
          const remaining = Math.round((100 - newProgress) * (timeElapsed / newProgress))
          setTimeRemaining(remaining > 0 ? remaining : null)
        }

        // Finaliza o processamento
        if (newProgress >= 100) {
          setTimeout(() => {
            setIsProcessing(false)
            // Garantir que o último estágio seja marcado como concluído
            setProcessingProgress(100)
            setResults({
              // Resultados simulados
              metrics: {
                rmse: 0.0324,
                mae: 0.0256,
                mape: 3.45,
                r2: 0.876,
              },
              predictions: [],
              insights: [],
            })
            addLog("Processamento concluído com sucesso!")
          }, 1000)
          return 100
        }

        return newProgress
      })

      // Atualiza métricas independentemente do estado
      updateMetrics()
    }

    // Inicia o intervalo
    progressInterval = setInterval(updateProgress, 300)

    // Limpa o intervalo quando o componente é desmontado ou o processamento para
    return () => {
      clearInterval(progressInterval)
    }
  }, [isProcessing]) // Remova dependências que mudam frequentemente

  // Funções auxiliares
  const handleModelSelect = (modelType: ModelType, modelName: string) => {
    setSelectedModelType(modelType)
    setSelectedModelName(modelName)
    setModelParameters({})
    setResults(null)
  }

  const handleParametersChange = (params: Record<string, any>) => {
    setModelParameters(params)
  }

  // Atualizar a função handleStartTraining para resetar o estado de cancelamento
  const handleStartTraining = () => {
    setIsProcessing(true)
    setIsCancelled(false)
    setProcessingProgress(0)
    setTimeElapsed(0)
    setTimeRemaining(null)
    setProcessingLogs([])
    setMetricsData({})
    setResults(null)

    // Adiciona logs iniciais
    addLog(`Iniciando análise de ${getModelTypeName(selectedModelType)}`)
    addLog(`Parâmetros: ${JSON.stringify(modelParameters)}`)
  }

  // Função para obter nome amigável do tipo de modelo
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

  // Atualizar a função handleCancelProcessing para definir o estado de cancelamento
  const handleCancelProcessing = () => {
    setIsProcessing(false)
    setIsCancelled(true)
    addLog("Processamento cancelado pelo usuário")
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setProcessingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const updateMetrics = () => {
    // Simulação de métricas em tempo real
    if (selectedModelType === "timeSeries") {
      setMetricsData((prev) => {
        const loss = [
          ...(prev.loss || []),
          {
            iteration: (prev.loss?.length || 0) + 1,
            value: 0.5 * Math.exp(-0.05 * (prev.loss?.length || 0)) + 0.05 * Math.random(),
          },
        ]

        const rmse = [
          ...(prev.rmse || []),
          {
            iteration: (prev.rmse?.length || 0) + 1,
            value: 0.3 * Math.exp(-0.03 * (prev.rmse?.length || 0)) + 0.02 * Math.random(),
          },
        ]

        return { ...prev, loss, rmse }
      })
    } else if (selectedModelType === "clustering") {
      setMetricsData((prev) => {
        const silhouette = [
          ...(prev.silhouette || []),
          {
            iteration: (prev.silhouette?.length || 0) + 1,
            value: 0.5 + 0.3 * (1 - Math.exp(-0.1 * (prev.silhouette?.length || 0))) + 0.05 * Math.random(),
          },
        ]

        const inertia = [
          ...(prev.inertia || []),
          {
            iteration: (prev.inertia?.length || 0) + 1,
            value: 1000 * Math.exp(-0.05 * (prev.inertia?.length || 0)) + 50 * Math.random(),
          },
        ]

        return { ...prev, silhouette, inertia }
      })
    }
  }

  const handleExport = (format: string) => {
    addLog(`Exportando resultados em formato ${format}`)
    // Lógica de exportação seria implementada aqui
  }

  const handleShare = () => {
    addLog("Compartilhando resultados")
    // Lógica de compartilhamento seria implementada aqui
  }

  // Renderiza visualizações específicas para cada tipo de modelo
  const renderVisualization = () => {
    switch (selectedModelType) {
      case "timeSeries":
        return renderTimeSeriesVisualization()
      case "clustering":
        return renderClusteringVisualization()
      case "correlation":
        return renderCorrelationVisualization()
      case "regression":
        return renderRegressionVisualization()
      case "anomaly":
        return renderAnomalyVisualization()
      default:
        return (
          <div className="h-64 flex items-center justify-center">
            <p>Selecione um tipo de análise para visualizar resultados</p>
          </div>
        )
    }
  }

  const renderTimeSeriesVisualization = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Previsão de Tendências</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { date: "2015", actual: 3.2, predicted: 3.1 },
                { date: "2016", actual: 3.4, predicted: 3.3 },
                { date: "2017", actual: 3.6, predicted: 3.5 },
                { date: "2018", actual: 3.8, predicted: 3.7 },
                { date: "2019", actual: 4.0, predicted: 3.9 },
                { date: "2020", actual: 4.2, predicted: 4.1 },
                { date: "2021", predicted: 4.3, lower: 4.1, upper: 4.5 },
                { date: "2022", predicted: 4.5, lower: 4.2, upper: 4.8 },
                { date: "2023", predicted: 4.7, lower: 4.3, upper: 5.1 },
                { date: "2024", predicted: 4.9, lower: 4.4, upper: 5.4 },
                { date: "2025", predicted: 5.1, lower: 4.5, upper: 5.7 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: "Prevalência (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="#8884d833"
                fillOpacity={0.3}
                name="Intervalo Superior"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="#8884d833"
                fillOpacity={0.3}
                name="Intervalo Inferior"
              />
              <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Valor Real" />
              <Line type="monotone" dataKey="predicted" stroke="#8884d8" name="Previsão" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Decomposição de Tendência</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { date: "2015", trend: 3.0 },
                    { date: "2016", trend: 3.2 },
                    { date: "2017", trend: 3.4 },
                    { date: "2018", trend: 3.6 },
                    { date: "2019", trend: 3.8 },
                    { date: "2020", trend: 4.0 },
                    { date: "2021", trend: 4.2 },
                    { date: "2022", trend: 4.4 },
                    { date: "2023", trend: 4.6 },
                    { date: "2024", trend: 4.8 },
                    { date: "2025", trend: 5.0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="trend" stroke="#ff7300" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Decomposição de Sazonalidade</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Jan", seasonal: 0.2 },
                    { month: "Feb", seasonal: 0.1 },
                    { month: "Mar", seasonal: -0.1 },
                    { month: "Apr", seasonal: -0.2 },
                    { month: "May", seasonal: -0.3 },
                    { month: "Jun", seasonal: -0.2 },
                    { month: "Jul", seasonal: -0.1 },
                    { month: "Aug", seasonal: 0.0 },
                    { month: "Sep", seasonal: 0.1 },
                    { month: "Oct", seasonal: 0.2 },
                    { month: "Nov", seasonal: 0.3 },
                    { month: "Dec", seasonal: 0.2 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="seasonal" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderClusteringVisualization = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Análise de Grupos</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" dataKey="x" name="Depressão" />
              <YAxis type="number" dataKey="y" name="Ansiedade" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Grupo 1"
                data={[
                  { x: 2.3, y: 3.1, name: "País A" },
                  { x: 2.1, y: 2.8, name: "País B" },
                  { x: 2.5, y: 3.3, name: "País C" },
                  { x: 2.0, y: 2.9, name: "País D" },
                ]}
                fill="#8884d8"
              />
              <Scatter
                name="Grupo 2"
                data={[
                  { x: 4.2, y: 5.1, name: "País E" },
                  { x: 4.5, y: 4.8, name: "País F" },
                  { x: 4.1, y: 5.3, name: "País G" },
                  { x: 4.3, y: 4.9, name: "País H" },
                ]}
                fill="#82ca9d"
              />
              <Scatter
                name="Grupo 3"
                data={[
                  { x: 3.2, y: 2.1, name: "País I" },
                  { x: 3.5, y: 1.8, name: "País J" },
                  { x: 3.1, y: 2.3, name: "País K" },
                  { x: 3.3, y: 1.9, name: "País L" },
                ]}
                fill="#ffc658"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Distribuição por Grupo</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Grupo 1", value: 4 },
                      { name: "Grupo 2", value: 4 },
                      { name: "Grupo 3", value: 4 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Características dos Grupos</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Depressão", grupo1: 2.2, grupo2: 4.3, grupo3: 3.3 },
                    { name: "Ansiedade", grupo1: 3.0, grupo2: 5.0, grupo3: 2.0 },
                    { name: "Bipolar", grupo1: 0.5, grupo2: 0.8, grupo3: 0.6 },
                    { name: "Esquizofrenia", grupo1: 0.2, grupo2: 0.3, grupo3: 0.4 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="grupo1" fill="#8884d8" name="Grupo 1" />
                  <Bar dataKey="grupo2" fill="#82ca9d" name="Grupo 2" />
                  <Bar dataKey="grupo3" fill="#ffc658" name="Grupo 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCorrelationVisualization = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Correlação entre Transtornos</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              outerRadius={90}
              data={[
                { subject: "Depressão", A: 120, B: 110, fullMark: 150 },
                { subject: "Ansiedade", A: 98, B: 130, fullMark: 150 },
                { subject: "Bipolar", A: 86, B: 130, fullMark: 150 },
                { subject: "Esquizofrenia", A: 99, B: 100, fullMark: 150 },
                { subject: "T. Alimentares", A: 85, B: 90, fullMark: 150 },
              ]}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar name="Prevalência" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Comorbidade" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Matriz de Correlação</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={[
                    {
                      name: "Depressão",
                      children: [
                        { name: "Ansiedade", size: 0.72, fill: "#8884d8" },
                        { name: "Bipolar", size: 0.58, fill: "#82ca9d" },
                        { name: "Esquizofrenia", size: 0.31, fill: "#ffc658" },
                        { name: "T. Alimentares", size: 0.45, fill: "#ff8042" },
                      ],
                    },
                  ]}
                  dataKey="size"
                  ratio={4 / 3}
                  stroke="#fff"
                  fill="#8884d8"
                  content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          style={{
                            fill: depth === 1 ? colors[Math.floor((index / root.children.length) * 6)] : "none",
                            stroke: "#fff",
                            strokeWidth: 2 / (depth + 1e-10),
                            strokeOpacity: 1 / (depth + 1e-10),
                          }}
                        />
                        {depth === 1 ? (
                          <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                            {name}
                          </text>
                        ) : null}
                        {depth === 1 ? (
                          <text
                            x={x + width / 2}
                            y={y + height / 2 - 7}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                          >
                            {root.children[index].size.toFixed(2)}
                          </text>
                        ) : null}
                      </g>
                    )
                  }}
                />
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Força de Correlação</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Depressão-Ansiedade", value: 0.72 },
                    { name: "Depressão-Bipolar", value: 0.58 },
                    { name: "Ansiedade-Bipolar", value: 0.51 },
                    { name: "Depressão-Esquizofrenia", value: 0.31 },
                    { name: "Ansiedade-T. Alimentares", value: 0.48 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}`, "Correlação"]} />
                  <Bar dataKey="value" fill="#8884d8">
                    {[
                      { name: "Depressão-Ansiedade", value: 0.72 },
                      { name: "Depressão-Bipolar", value: 0.58 },
                      { name: "Ansiedade-Bipolar", value: 0.51 },
                      { name: "Depressão-Esquizofrenia", value: 0.31 },
                      { name: "Ansiedade-T. Alimentares", value: 0.48 },
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value > 0.6 ? "#ff8042" : entry.value > 0.4 ? "#82ca9d" : "#8884d8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRegressionVisualization = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fatores de Influência</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="horizontal"
              data={[
                { name: "Acesso à saúde", value: 0.68 },
                { name: "Nível socioeconômico", value: 0.57 },
                { name: "Urbanização", value: 0.42 },
                { name: "Desemprego", value: 0.39 },
                { name: "Isolamento social", value: 0.35 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip formatter={(value) => [`${value}`, "Impacto"]} />
              <Bar dataKey="value" fill="#8884d8">
                {[
                  { name: "Acesso à saúde", value: 0.68 },
                  { name: "Nível socioeconômico", value: 0.57 },
                  { name: "Urbanização", value: 0.42 },
                  { name: "Desemprego", value: 0.39 },
                  { name: "Isolamento social", value: 0.35 },
                ].map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 0.6 ? "#ff8042" : entry.value > 0.4 ? "#82ca9d" : "#8884d8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Relação entre Fatores</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" dataKey="x" name="Acesso à saúde" />
                  <YAxis type="number" dataKey="y" name="Prevalência de Depressão" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter
                    name="Países"
                    data={[
                      { x: 0.2, y: 6.7, name: "País A" },
                      { x: 0.3, y: 6.2, name: "País B" },
                      { x: 0.4, y: 5.8, name: "País C" },
                      { x: 0.5, y: 5.3, name: "País D" },
                      { x: 0.6, y: 4.9, name: "País E" },
                      { x: 0.7, y: 4.5, name: "País F" },
                      { x: 0.8, y: 4.1, name: "País G" },
                      { x: 0.9, y: 3.8, name: "País H" },
                    ]}
                    fill="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="y"
                    data={[
                      { x: 0.2, y: 6.5 },
                      { x: 0.9, y: 3.9 },
                    ]}
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                    legendType="none"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Importância dos Fatores</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Acesso à saúde", value: 32 },
                      { name: "Nível socioeconômico", value: 27 },
                      { name: "Urbanização", value: 20 },
                      { name: "Desemprego", value: 12 },
                      { name: "Outros", value: 9 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                    <Cell fill="#ff8042" />
                    <Cell fill="#a4de6c" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAnomalyVisualization = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Detecção de Anomalias</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" dataKey="x" name="Prevalência" domain={[0, 10]} />
              <YAxis type="number" dataKey="y" name="Tratamento" domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Países"
                data={[
                  { x: 2.3, y: 65, name: "País A" },
                  { x: 2.8, y: 72, name: "País B" },
                  { x: 3.1, y: 68, name: "País C" },
                  { x: 3.3, y: 70, name: "País D" },
                  { x: 3.5, y: 62, name: "País E" },
                  { x: 3.7, y: 58, name: "País F" },
                  { x: 4.0, y: 63, name: "País G" },
                  { x: 4.2, y: 59, name: "País H" },
                ]}
                fill="#8884d8"
              />
              <Scatter
                name="Anomalias"
                data={[
                  { x: 5.8, y: 25, name: "País X" },
                  { x: 2.1, y: 15, name: "País Y" },
                  { x: 7.2, y: 82, name: "País Z" },
                ]}
                fill="#ff7300"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Distribuição de Anomalias</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Normal", value: 85 },
                      { name: "Anomalia", value: 15 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#ff7300" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tipos de Anomalias</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Alta prevalência", value: 5 },
                    { name: "Baixo tratamento", value: 7 },
                    { name: "Tendência atípica", value: 3 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderiza métricas específicas para cada tipo de modelo
  const renderMetrics = () => {
    switch (selectedModelType) {
      case "timeSeries":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.0324</div>
                <div className="text-sm font-medium">RMSE</div>
                <div className="text-xs text-muted-foreground">Erro Quadrático Médio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.0256</div>
                <div className="text-sm font-medium">MAE</div>
                <div className="text-xs text-muted-foreground">Erro Absoluto Médio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">3.45%</div>
                <div className="text-sm font-medium">MAPE</div>
                <div className="text-xs text-muted-foreground">Erro Percentual Absoluto Médio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.876</div>
                <div className="text-sm font-medium">R²</div>
                <div className="text-xs text-muted-foreground">Coeficiente de Determinação</div>
              </CardContent>
            </Card>
          </div>
        )
      case "clustering":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.724</div>
                <div className="text-sm font-medium">Silhouette</div>
                <div className="text-xs text-muted-foreground">Coeficiente de Silhueta</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">245.3</div>
                <div className="text-sm font-medium">Inertia</div>
                <div className="text-xs text-muted-foreground">Soma das Distâncias Quadráticas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.453</div>
                <div className="text-sm font-medium">Davies-Bouldin</div>
                <div className="text-xs text-muted-foreground">Índice Davies-Bouldin</div>
              </CardContent>
            </Card>
          </div>
        )
      case "correlation":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.72</div>
                <div className="text-sm font-medium">Correlação Máxima</div>
                <div className="text-xs text-muted-foreground">Depressão-Ansiedade</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.31</div>
                <div className="text-sm font-medium">Correlação Mínima</div>
                <div className="text-xs text-muted-foreground">Depressão-Esquizofrenia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.51</div>
                <div className="text-sm font-medium">Correlação Média</div>
                <div className="text-xs text-muted-foreground">Entre todos os transtornos</div>
              </CardContent>
            </Card>
          </div>
        )
      case "regression":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.83</div>
                <div className="text-sm font-medium">R²</div>
                <div className="text-xs text-muted-foreground">Coeficiente de Determinação</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.68</div>
                <div className="text-sm font-medium">Fator Principal</div>
                <div className="text-xs text-muted-foreground">Acesso à saúde</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.0412</div>
                <div className="text-sm font-medium">RMSE</div>
                <div className="text-xs text-muted-foreground">Erro Quadrático Médio</div>
              </CardContent>
            </Card>
          </div>
        )
      case "anomaly":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">15%</div>
                <div className="text-sm font-medium">Taxa de Anomalias</div>
                <div className="text-xs text-muted-foreground">Percentual de países com anomalias</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.92</div>
                <div className="text-sm font-medium">Precisão</div>
                <div className="text-xs text-muted-foreground">Na detecção de anomalias</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">0.88</div>
                <div className="text-sm font-medium">Recall</div>
                <div className="text-xs text-muted-foreground">Na detecção de anomalias</div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-32">
            <p>Métricas não disponíveis para este tipo de modelo</p>
          </div>
        )
    }
  }

  // Renderiza insights específicos para cada tipo de modelo
  const renderInsights = () => {
    switch (selectedModelType) {
      case "timeSeries":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Tendência de Crescimento</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A prevalência de depressão mostra uma tendência de crescimento de 2.3% ao ano nos próximos 5 anos,
                podendo atingir 5.1% da população global até 2025.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Sazonalidade Detectada</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Média Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Detectamos um padrão sazonal anual com picos nos meses de inverno (novembro a janeiro), quando os casos
                de depressão aumentam em até 0.3% em relação à média anual.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Ponto de Inflexão</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Um ponto de inflexão é previsto para 2026, quando a taxa de crescimento deve desacelerar. Este é um
                momento crítico para intervenções preventivas antes que a tendência se estabilize em níveis elevados.
              </p>
            </div>
          </div>
        )
      case "clustering":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">3 Perfis Distintos</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Identificamos 3 grupos distintos de países: o Grupo 1 com baixa prevalência de transtornos, o Grupo 2
                com alta prevalência e o Grupo 3 com prevalência média mas baixo acesso a tratamento.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Grupo de Alto Risco</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O Grupo 2 apresenta altas taxas de depressão e ansiedade combinadas com baixa cobertura de tratamento,
                representando uma área prioritária para intervenções de saúde pública.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Correlação Socioeconômica</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Média Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Existe uma correlação significativa entre o PIB per capita e o grupo ao qual um país pertence, com
                países de maior renda tendendo a estar no Grupo 1, apesar de algumas exceções notáveis.
              </p>
            </div>
          </div>
        )
      case "correlation":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Forte Comorbidade</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Depressão e ansiedade apresentam a mais forte correlação (0.72), indicando alta comorbidade. Pacientes
                diagnosticados com um destes transtornos devem ser avaliados para o outro.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Correlações Moderadas</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Média Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transtorno bipolar apresenta correlações moderadas com depressão (0.58) e ansiedade (0.51), sugerindo
                mecanismos subjacentes compartilhados ou fatores de risco comuns.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Correlações Fracas</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Baixa Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Esquizofrenia apresenta as correlações mais fracas com outros transtornos, indicando mecanismos
                distintos e possivelmente abordagens de tratamento diferentes.
              </p>
            </div>
          </div>
        )
      case "regression":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Acesso à Saúde</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O acesso a serviços de saúde mental é o fator mais influente (0.68), explicando 32% da variação na
                prevalência de depressão entre países. Cada 10% de aumento na cobertura de tratamento está associado a
                uma redução de 0.7% na prevalência.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Fatores Socioeconômicos</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fatores socioeconômicos (0.57) são o segundo maior determinante, com desigualdade de renda tendo maior
                impacto que o PIB per capita absoluto. Países com índice Gini elevado tendem a apresentar maior
                prevalência de transtornos mentais.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Urbanização</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Média Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A urbanização (0.42) apresenta uma relação não-linear com a saúde mental, com benefícios até certo ponto
                devido ao melhor acesso a serviços, mas efeitos negativos em grandes centros urbanos com problemas de
                superlotação e isolamento social.
              </p>
            </div>
          </div>
        )
      case "anomaly":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Países com Alta Prevalência</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O País X apresenta uma prevalência de depressão de 5.8%, significativamente acima da média regional de
                3.5%. Fatores como conflitos recentes, crises econômicas e desastres naturais podem explicar esta
                anomalia.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Lacunas de Tratamento</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O País Y apresenta uma lacuna de tratamento anormalmente alta, com apenas 15% dos casos recebendo
                tratamento adequado, comparado à média regional de 65%. Isto sugere barreiras significativas no acesso a
                serviços de saúde mental.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Caso de Sucesso</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Baixa Relevância</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O País Z apresenta uma combinação incomum de alta prevalência (7.2%) com alta taxa de tratamento (82%),
                indicando um sistema de saúde mental eficaz na detecção e tratamento, apesar da alta carga de doença.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-32">
            <p>Insights não disponíveis para este tipo de modelo</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Análise de Saúde Mental</h1>
      <p className="text-muted-foreground">
        Selecione um tipo de análise, configure os parâmetros e gere insights a partir dos dados de saúde mental
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seleção e configuração de modelo */}
        <div className="space-y-6">
          <ModelSelector onModelSelect={handleModelSelect} />

          {selectedModelType && selectedModelName && (
            <ParameterConfig
              modelType={selectedModelType}
              modelName={selectedModelName}
              onParametersChange={handleParametersChange}
              onStartTraining={handleStartTraining}
            />
          )}
        </div>

        {/* Feedback de processamento */}
        <div className="space-y-6">
          {(isProcessing || processingLogs.length > 0) && (
            <ProcessingFeedback
              isProcessing={isProcessing}
              currentStage={processingStage}
              progress={processingProgress}
              timeElapsed={timeElapsed}
              timeRemaining={timeRemaining}
              logs={processingLogs}
              onCancel={handleCancelProcessing}
              isCancelled={isCancelled}
            />
          )}

          {isProcessing && Object.keys(metricsData).length > 0 && (
            <RealTimeMetrics modelType={selectedModelType || ""} metrics={metricsData} />
          )}
        </div>
      </div>

      {/* Resultados */}
      {results && selectedModelType && selectedModelName && (
        <div className="mt-8">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados da Análise</CardTitle>
                  <CardDescription>{getModelTypeName(selectedModelType)}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visualization">
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
        </div>
      )}
    </div>
  )
}
