"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { ModelType } from "./model-selector"

interface ParameterConfigProps {
  modelType: ModelType
  onParametersChange: (params: Record<string, any>) => void
  onStartTraining: () => void
  metadata?: any
}

export function ParameterConfig({ modelType, onParametersChange, onStartTraining, metadata }: ParameterConfigProps) {
  const [parameters, setParameters] = useState<Record<string, any>>({})

  // Set default values when metadata is loaded
  useEffect(() => {
    if (modelType === "timeSeries" && metadata?.disorders?.length > 0) {
      const defaultParams = {
        ...parameters,
        target: parameters.target || metadata.disorders[0],
        region: parameters.region || "global",
        year_start: parameters.year_start || metadata.year_range?.min || 1990,
        year_end: parameters.year_end || metadata.year_range?.max || 2019,
        forecastPeriod: parameters.forecastPeriod || 5,
        method: parameters.method || 'prophet'
      };
      setParameters(defaultParams);
      onParametersChange(defaultParams);
    }
  }, [metadata, modelType]);

  const updateParameter = (key: string, value: any) => {
    const updatedParams = { ...parameters, [key]: value }
    setParameters(updatedParams)
    onParametersChange(updatedParams)
  }

  // Renderiza diferentes configurações baseadas no tipo de modelo
  const renderModelConfig = () => {
    switch (modelType) {
      case "timeSeries":
        return renderTimeSeriesConfig()
      case "clustering":
        return renderClusteringConfig()
      case "correlation":
        return renderCorrelationConfig()
      case "regression":
        return renderRegressionConfig()
      case "anomaly":
        return renderAnomalyConfig()
      default:
        return <p>Selecione um modelo para configurar</p>
    }
  }

  const renderTimeSeriesConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target">Transtorno a ser previsto</Label>
          <Select 
            onValueChange={(value) => updateParameter("target", value)} 
            value={parameters.target}
          >
            <SelectTrigger id="target">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              {metadata?.disorders?.map((disorder: string) => (
                <SelectItem key={disorder} value={disorder}>
                  {disorder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Região</Label>
          <Select onValueChange={(value) => updateParameter("region", value)} defaultValue="global">
            <SelectTrigger id="region">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              {metadata?.regions?.map((region: string) => (
                <SelectItem key={region} value={region.toLowerCase()}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="forecast-period">Período de Previsão (anos)</Label>
          <Slider
            id="forecast-period"
            min={1}
            max={10}
            step={1}
            defaultValue={[5]}
            onValueChange={(value) => updateParameter("forecastPeriod", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
              <span key={year}>{year}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval-width">Nível de Confiança</Label>
          <RadioGroup
            defaultValue="80"
            onValueChange={(value) => updateParameter("intervalWidth", Number.parseInt(value) / 100)}
            className="flex justify-between"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="70" id="confidence-70" />
              <Label htmlFor="confidence-70">70%</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="80" id="confidence-80" />
              <Label htmlFor="confidence-80">80%</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="90" id="confidence-90" />
              <Label htmlFor="confidence-90">90%</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="95" id="confidence-95" />
              <Label htmlFor="confidence-95">95%</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="yearly-seasonality"
            defaultChecked
            onCheckedChange={(checked) => updateParameter("yearlySeasonality", checked)}
          />
          <Label htmlFor="yearly-seasonality">Considerar variações sazonais</Label>
        </div>
      </div>
    )
  }

  const renderClusteringConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="n-clusters">Número de Grupos</Label>
          <RadioGroup
            defaultValue="3"
            onValueChange={(value) => updateParameter("nClusters", Number.parseInt(value))}
            className="flex justify-between"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="clusters-2" />
              <Label htmlFor="clusters-2">2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="clusters-3" />
              <Label htmlFor="clusters-3">3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="clusters-4" />
              <Label htmlFor="clusters-4">4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="clusters-5" />
              <Label htmlFor="clusters-5">5</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Transtornos a considerar</Label>
          <div className="grid grid-cols-2 gap-4">
            {metadata?.disorders?.map((disorder: string) => (
              <div key={disorder} className="flex items-center space-x-2">
                <Switch
                  id={`feature-${disorder.toLowerCase()}`}
                  defaultChecked
                  onCheckedChange={(checked) => {
                    const features = parameters.features || []
                    const updatedFeatures = checked
                      ? [...features, disorder.toLowerCase()]
                      : features.filter((f) => f !== disorder.toLowerCase())
                    updateParameter("features", updatedFeatures)
                  }}
                />
                <Label htmlFor={`feature-${disorder.toLowerCase()}`}>{disorder}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCorrelationConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Transtornos a correlacionar</Label>
          <div className="grid grid-cols-2 gap-4">
            {metadata?.disorders?.map((disorder: string) => (
              <div key={disorder} className="flex items-center space-x-2">
                <Switch
                  id={`correlation-${disorder.toLowerCase()}`}
                  defaultChecked
                  onCheckedChange={(checked) => {
                    const disorders = parameters.disorders || []
                    const updatedDisorders = checked
                      ? [...disorders, disorder.toLowerCase()]
                      : disorders.filter((d) => d !== disorder.toLowerCase())
                    updateParameter("disorders", updatedDisorders)
                  }}
                />
                <Label htmlFor={`correlation-${disorder.toLowerCase()}`}>{disorder}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderRegressionConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target">Transtorno alvo</Label>
          <Select onValueChange={(value) => updateParameter("target", value)} defaultValue="depression">
            <SelectTrigger id="target">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              {metadata?.disorders?.map((disorder: string) => (
                <SelectItem key={disorder} value={disorder.toLowerCase()}>
                  {disorder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fatores a considerar</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-gdp"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked ? [...features, "gdp"] : features.filter((f) => f !== "gdp")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-gdp">PIB per capita</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-urbanization"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked
                    ? [...features, "urbanization"]
                    : features.filter((f) => f !== "urbanization")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-urbanization">Taxa de urbanização</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-healthcare"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked
                    ? [...features, "healthcare"]
                    : features.filter((f) => f !== "healthcare")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-healthcare">Acesso à saúde</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-education"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked
                    ? [...features, "education"]
                    : features.filter((f) => f !== "education")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-education">Nível educacional</Label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAnomalyConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target">Transtorno a analisar</Label>
          <Select onValueChange={(value) => updateParameter("target", value)} defaultValue="depression">
            <SelectTrigger id="target">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              {metadata?.disorders?.map((disorder: string) => (
                <SelectItem key={disorder} value={disorder.toLowerCase()}>
                  {disorder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sensitivity">Sensibilidade da detecção</Label>
          <Slider
            id="sensitivity"
            min={1}
            max={10}
            step={1}
            defaultValue={[5]}
            onValueChange={(value) => updateParameter("sensitivity", value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Menos sensível</span>
            <span>Mais sensível</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Configure os parâmetros da análise</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderModelConfig()}
          
          <Separator className="my-4" />
          
          <Button className="w-full" onClick={onStartTraining}>
            Iniciar Análise
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
