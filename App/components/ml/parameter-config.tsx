"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import type { ModelType } from "./model-selector"

interface ParameterConfigProps {
  modelType: ModelType
  modelName: string
  onParametersChange: (params: Record<string, any>) => void
  onStartTraining: () => void
}

export function ParameterConfig({ modelType, modelName, onParametersChange, onStartTraining }: ParameterConfigProps) {
  const [parameters, setParameters] = useState<Record<string, any>>({})

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
          <Select onValueChange={(value) => updateParameter("target", value)} defaultValue="depression">
            <SelectTrigger id="target">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depression">Depressão</SelectItem>
              <SelectItem value="anxiety">Ansiedade</SelectItem>
              <SelectItem value="bipolar">Transtorno Bipolar</SelectItem>
              <SelectItem value="schizophrenia">Esquizofrenia</SelectItem>
              <SelectItem value="eating">Transtornos Alimentares</SelectItem>
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
              <SelectItem value="americas">Américas</SelectItem>
              <SelectItem value="europe">Europa</SelectItem>
              <SelectItem value="asia">Ásia</SelectItem>
              <SelectItem value="africa">África</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
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
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-depression"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked
                    ? [...features, "depression"]
                    : features.filter((f) => f !== "depression")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-depression">Depressão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-anxiety"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked ? [...features, "anxiety"] : features.filter((f) => f !== "anxiety")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-anxiety">Ansiedade</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-bipolar"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked ? [...features, "bipolar"] : features.filter((f) => f !== "bipolar")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-bipolar">Transtorno Bipolar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="feature-schizophrenia"
                defaultChecked
                onCheckedChange={(checked) => {
                  const features = parameters.features || []
                  const updatedFeatures = checked
                    ? [...features, "schizophrenia"]
                    : features.filter((f) => f !== "schizophrenia")
                  updateParameter("features", updatedFeatures)
                }}
              />
              <Label htmlFor="feature-schizophrenia">Esquizofrenia</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano de Referência</Label>
          <Select onValueChange={(value) => updateParameter("year", value)} defaultValue="2019">
            <SelectTrigger id="year">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2015">2015</SelectItem>
              <SelectItem value="2016">2016</SelectItem>
              <SelectItem value="2017">2017</SelectItem>
              <SelectItem value="2018">2018</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderCorrelationConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Transtornos a analisar</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="corr-depression"
                defaultChecked
                onCheckedChange={(checked) => {
                  const disorders = parameters.disorders || []
                  const updatedDisorders = checked
                    ? [...disorders, "depression"]
                    : disorders.filter((d) => d !== "depression")
                  updateParameter("disorders", updatedDisorders)
                }}
              />
              <Label htmlFor="corr-depression">Depressão</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="corr-anxiety"
                defaultChecked
                onCheckedChange={(checked) => {
                  const disorders = parameters.disorders || []
                  const updatedDisorders = checked
                    ? [...disorders, "anxiety"]
                    : disorders.filter((d) => d !== "anxiety")
                  updateParameter("disorders", updatedDisorders)
                }}
              />
              <Label htmlFor="corr-anxiety">Ansiedade</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="corr-bipolar"
                defaultChecked
                onCheckedChange={(checked) => {
                  const disorders = parameters.disorders || []
                  const updatedDisorders = checked
                    ? [...disorders, "bipolar"]
                    : disorders.filter((d) => d !== "bipolar")
                  updateParameter("disorders", updatedDisorders)
                }}
              />
              <Label htmlFor="corr-bipolar">Transtorno Bipolar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="corr-schizophrenia"
                defaultChecked
                onCheckedChange={(checked) => {
                  const disorders = parameters.disorders || []
                  const updatedDisorders = checked
                    ? [...disorders, "schizophrenia"]
                    : disorders.filter((d) => d !== "schizophrenia")
                  updateParameter("disorders", updatedDisorders)
                }}
              />
              <Label htmlFor="corr-schizophrenia">Esquizofrenia</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Região</Label>
          <Select onValueChange={(value) => updateParameter("region", value)} defaultValue="global">
            <SelectTrigger id="region">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="americas">Américas</SelectItem>
              <SelectItem value="europe">Europa</SelectItem>
              <SelectItem value="asia">Ásia</SelectItem>
              <SelectItem value="africa">África</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select onValueChange={(value) => updateParameter("period", value)} defaultValue="all">
            <SelectTrigger id="period">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período disponível</SelectItem>
              <SelectItem value="recent">Últimos 5 anos</SelectItem>
              <SelectItem value="decade">Última década</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderRegressionConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target-disorder">Transtorno alvo</Label>
          <Select onValueChange={(value) => updateParameter("targetDisorder", value)} defaultValue="depression">
            <SelectTrigger id="target-disorder">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depression">Depressão</SelectItem>
              <SelectItem value="anxiety">Ansiedade</SelectItem>
              <SelectItem value="bipolar">Transtorno Bipolar</SelectItem>
              <SelectItem value="schizophrenia">Esquizofrenia</SelectItem>
              <SelectItem value="eating">Transtornos Alimentares</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fatores a considerar</Label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="factor-socioeconomic"
                defaultChecked
                onCheckedChange={(checked) => {
                  const factors = parameters.factors || []
                  const updatedFactors = checked
                    ? [...factors, "socioeconomic"]
                    : factors.filter((f) => f !== "socioeconomic")
                  updateParameter("factors", updatedFactors)
                }}
              />
              <Label htmlFor="factor-socioeconomic">Fatores socioeconômicos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="factor-healthcare"
                defaultChecked
                onCheckedChange={(checked) => {
                  const factors = parameters.factors || []
                  const updatedFactors = checked
                    ? [...factors, "healthcare"]
                    : factors.filter((f) => f !== "healthcare")
                  updateParameter("factors", updatedFactors)
                }}
              />
              <Label htmlFor="factor-healthcare">Acesso a serviços de saúde</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="factor-demographic"
                defaultChecked
                onCheckedChange={(checked) => {
                  const factors = parameters.factors || []
                  const updatedFactors = checked
                    ? [...factors, "demographic"]
                    : factors.filter((f) => f !== "demographic")
                  updateParameter("factors", updatedFactors)
                }}
              />
              <Label htmlFor="factor-demographic">Fatores demográficos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="factor-cultural"
                defaultChecked
                onCheckedChange={(checked) => {
                  const factors = parameters.factors || []
                  const updatedFactors = checked ? [...factors, "cultural"] : factors.filter((f) => f !== "cultural")
                  updateParameter("factors", updatedFactors)
                }}
              />
              <Label htmlFor="factor-cultural">Fatores culturais</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Região</Label>
          <Select onValueChange={(value) => updateParameter("region", value)} defaultValue="global">
            <SelectTrigger id="region">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="americas">Américas</SelectItem>
              <SelectItem value="europe">Europa</SelectItem>
              <SelectItem value="asia">Ásia</SelectItem>
              <SelectItem value="africa">África</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderAnomalyConfig = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="disorder">Transtorno a analisar</Label>
          <Select onValueChange={(value) => updateParameter("disorder", value)} defaultValue="depression">
            <SelectTrigger id="disorder">
              <SelectValue placeholder="Selecione o transtorno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depression">Depressão</SelectItem>
              <SelectItem value="anxiety">Ansiedade</SelectItem>
              <SelectItem value="bipolar">Transtorno Bipolar</SelectItem>
              <SelectItem value="schizophrenia">Esquizofrenia</SelectItem>
              <SelectItem value="eating">Transtornos Alimentares</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anomaly-type">Tipo de anomalia</Label>
          <RadioGroup defaultValue="prevalence" onValueChange={(value) => updateParameter("anomalyType", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prevalence" id="anomaly-prevalence" />
              <Label htmlFor="anomaly-prevalence">Prevalência incomum</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trend" id="anomaly-trend" />
              <Label htmlFor="anomaly-trend">Tendência atípica</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="treatment" id="anomaly-treatment" />
              <Label htmlFor="anomaly-treatment">Lacunas de tratamento</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sensitivity">Sensibilidade</Label>
          <RadioGroup
            defaultValue="medium"
            onValueChange={(value) => updateParameter("sensitivity", value)}
            className="flex justify-between"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="sensitivity-low" />
              <Label htmlFor="sensitivity-low">Baixa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="sensitivity-medium" />
              <Label htmlFor="sensitivity-medium">Média</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="sensitivity-high" />
              <Label htmlFor="sensitivity-high">Alta</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Sensibilidade alta detecta mais anomalias, mas pode incluir falsos positivos.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Ano de Referência</Label>
          <Select onValueChange={(value) => updateParameter("year", value)} defaultValue="2019">
            <SelectTrigger id="year">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2015">2015</SelectItem>
              <SelectItem value="2016">2016</SelectItem>
              <SelectItem value="2017">2017</SelectItem>
              <SelectItem value="2018">2018</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração da Análise</CardTitle>
        <CardDescription>Ajuste os parâmetros para personalizar sua análise</CardDescription>
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
