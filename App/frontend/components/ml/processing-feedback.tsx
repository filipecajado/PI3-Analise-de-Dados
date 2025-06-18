"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react"

// Adicionar um novo status "cancelled" para os estágios
interface ProcessingStage {
  name: string
  status: "pending" | "active" | "completed" | "error" | "cancelled"
  progress: number
}

// Atualizar a interface de props para incluir um status de cancelamento
interface ProcessingFeedbackProps {
  isProcessing: boolean
  currentStage: string
  progress: number
  timeElapsed: number
  timeRemaining: number | null
  logs: string[]
  onCancel: () => void
  isCancelled?: boolean
}

// Atualizar a função para lidar com o status de cancelamento
export function ProcessingFeedback({
  isProcessing,
  currentStage,
  progress,
  timeElapsed,
  timeRemaining,
  logs,
  onCancel,
  isCancelled = false,
}: ProcessingFeedbackProps) {
  const [stages, setStages] = useState<ProcessingStage[]>([
    { name: "Pré-processamento", status: "pending", progress: 0 },
    { name: "Treinamento", status: "pending", progress: 0 },
    { name: "Validação", status: "pending", progress: 0 },
    { name: "Geração de Insights", status: "pending", progress: 0 },
  ])

  // Resetar os estágios quando um novo processamento começa
  useEffect(() => {
    if (isProcessing && progress === 0) {
      setStages([
        { name: "Pré-processamento", status: "pending", progress: 0 },
        { name: "Treinamento", status: "pending", progress: 0 },
        { name: "Validação", status: "pending", progress: 0 },
        { name: "Geração de Insights", status: "pending", progress: 0 },
      ])
    }
  }, [isProcessing, progress])

  // Atualiza o status dos estágios com base no estágio atual
  useEffect(() => {
    if (!isProcessing && !isCancelled) {
      // Se o processamento terminou normalmente (não cancelado), marque todos os estágios como concluídos
      if (progress >= 100) {
        const stageNames = ["Pré-processamento", "Treinamento", "Validação", "Geração de Insights"]
        const completedStages = stageNames.map((name) => ({
          name,
          status: "completed" as "pending" | "active" | "completed" | "error" | "cancelled",
          progress: 100,
        }))
        setStages(completedStages)
        return
      }
      return
    }

    // Crie uma cópia profunda dos estágios iniciais para evitar referências ao estado atual
    const stageNames = ["Pré-processamento", "Treinamento", "Validação", "Geração de Insights"]
    const updatedStages = stageNames.map((name) => ({
      name,
      status: "pending" as "pending" | "active" | "completed" | "error" | "cancelled",
      progress: 0,
    }))

    // Se foi cancelado, marca o estágio atual como cancelado
    if (isCancelled) {
      const currentIndex = stageNames.findIndex((name) => name.toLowerCase() === currentStage.toLowerCase())
      if (currentIndex >= 0) {
        // Marca estágios anteriores como concluídos
        for (let i = 0; i < currentIndex; i++) {
          updatedStages[i].status = "completed"
          updatedStages[i].progress = 100
        }

        // Marca o estágio atual como cancelado
        updatedStages[currentIndex].status = "cancelled"
        updatedStages[currentIndex].progress = progress
      }
    } else {
      // Processamento normal (não cancelado)
      const currentIndex = stageNames.findIndex((name) => name.toLowerCase() === currentStage.toLowerCase())
      if (currentIndex >= 0) {
        // Marca estágios anteriores como concluídos
        for (let i = 0; i < currentIndex; i++) {
          updatedStages[i].status = "completed"
          updatedStages[i].progress = 100
        }

        // Atualiza o estágio atual
        updatedStages[currentIndex].status = "active"
        updatedStages[currentIndex].progress = progress
      }
    }

    setStages(updatedStages)
  }, [currentStage, progress, isProcessing, isCancelled])

  // Formata o tempo em hh:mm:ss
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // No componente de renderização, atualizar para mostrar o ícone X para estágios cancelados
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Processamento em Andamento
          <Badge variant={isProcessing ? "default" : isCancelled ? "destructive" : "outline"}>
            {isProcessing ? "Processando" : isCancelled ? "Cancelado" : "Concluído"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {currentStage}: {progress}% concluído
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Tempo decorrido: {formatTime(timeElapsed)}</span>
          </div>
          {timeRemaining !== null && !isCancelled && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Tempo restante: {formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Progresso por Estágio</h4>
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stage.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : stage.status === "active" ? (
                      <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
                    ) : stage.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : stage.status === "cancelled" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span className="text-sm">{stage.name}</span>
                  </div>
                  <span className="text-xs">{stage.progress}%</span>
                </div>
                <Progress value={stage.progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Log de Execução</h4>
          <ScrollArea className="h-32 rounded-md border p-2">
            {logs.map((log, index) => (
              <div key={index} className="text-xs">
                {log}
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={isCancelled ? "destructive" : "destructive"}
          onClick={onCancel}
          disabled={!isProcessing || isCancelled}
          className="w-full"
        >
          {isCancelled ? "Cancelado" : "Cancelar Processamento"}
        </Button>
      </CardFooter>
    </Card>
  )
}
