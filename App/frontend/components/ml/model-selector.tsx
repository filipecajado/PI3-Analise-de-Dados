"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, PieChart, Network, LineChart, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ModelType = "timeSeries" | "clustering" | "correlation" | "regression" | "anomaly"

interface ModelSelectorProps {
  onModelSelect: (modelType: ModelType, modelName: string) => void
}

export function ModelSelector({ onModelSelect }: ModelSelectorProps) {
  const [selectedType, setSelectedType] = useState<ModelType>("timeSeries")

  const handleModelSelect = (modelType: ModelType) => {
    // Mapeamento simplificado de tipo para nome do modelo
    const modelNames = {
      timeSeries: "prophet",
      clustering: "kmeans",
      correlation: "pca",
      regression: "linear",
      anomaly: "isolation",
    }

    onModelSelect(modelType, modelNames[modelType])
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Escolha o Tipo de Análise</CardTitle>
        <CardDescription>
          Selecione o tipo de análise que você deseja realizar com os dados de saúde mental
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="timeSeries"
          onValueChange={(value) => setSelectedType(value as ModelType)}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="timeSeries" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Previsão</span>
            </TabsTrigger>
            <TabsTrigger value="clustering" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Agrupamento</span>
            </TabsTrigger>
            <TabsTrigger value="correlation" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Correlação</span>
            </TabsTrigger>
            <TabsTrigger value="regression" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Fatores</span>
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Anomalias</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeSeries">
            <Card>
              <CardHeader>
                <CardTitle>Previsão de Tendências</CardTitle>
                <CardDescription>Preveja como os transtornos mentais evoluirão nos próximos anos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    Esta análise permite prever como a prevalência de transtornos mentais (como depressão e ansiedade)
                    evoluirá nos próximos anos, com base nos dados históricos.
                  </p>
                  <p>
                    <strong>Ideal para:</strong> Planejamento de políticas públicas, alocação de recursos de saúde, e
                    identificação de tendências preocupantes antes que se tornem críticas.
                  </p>
                </div>
                <Button className="w-full" onClick={() => handleModelSelect("timeSeries")}>
                  Selecionar Análise de Previsão
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clustering">
            <Card>
              <CardHeader>
                <CardTitle>Agrupamento de Perfis</CardTitle>
                <CardDescription>Identifique grupos de países com perfis semelhantes de saúde mental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    Esta análise agrupa países ou regiões com características semelhantes de saúde mental, revelando
                    padrões que podem não ser óbvios à primeira vista.
                  </p>
                  <p>
                    <strong>Ideal para:</strong> Identificar regiões com necessidades similares, comparar estratégias de
                    saúde mental entre grupos semelhantes, e descobrir fatores comuns.
                  </p>
                </div>
                <Button className="w-full" onClick={() => handleModelSelect("clustering")}>
                  Selecionar Análise de Agrupamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlation">
            <Card>
              <CardHeader>
                <CardTitle>Correlação entre Transtornos</CardTitle>
                <CardDescription>Descubra como diferentes transtornos mentais se relacionam entre si</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    Esta análise revela como diferentes transtornos mentais estão relacionados entre si, identificando
                    padrões de comorbidade e fatores compartilhados.
                  </p>
                  <p>
                    <strong>Ideal para:</strong> Compreender a relação entre diferentes transtornos, identificar fatores
                    de risco compartilhados, e desenvolver abordagens de tratamento integradas.
                  </p>
                </div>
                <Button className="w-full" onClick={() => handleModelSelect("correlation")}>
                  Selecionar Análise de Correlação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regression">
            <Card>
              <CardHeader>
                <CardTitle>Fatores de Influência</CardTitle>
                <CardDescription>
                  Identifique fatores que influenciam a prevalência de transtornos mentais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    Esta análise identifica quais fatores têm maior impacto na prevalência de transtornos mentais,
                    quantificando a influência de cada variável.
                  </p>
                  <p>
                    <strong>Ideal para:</strong> Identificar áreas prioritárias para intervenção, compreender causas
                    subjacentes, e desenvolver estratégias de prevenção mais eficazes.
                  </p>
                </div>
                <Button className="w-full" onClick={() => handleModelSelect("regression")}>
                  Selecionar Análise de Fatores
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomaly">
            <Card>
              <CardHeader>
                <CardTitle>Detecção de Anomalias</CardTitle>
                <CardDescription>Identifique padrões incomuns ou outliers nos dados de saúde mental</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    Esta análise detecta países, regiões ou períodos com padrões atípicos de saúde mental, que se
                    destacam significativamente da média global.
                  </p>
                  <p>
                    <strong>Ideal para:</strong> Identificar situações que requerem atenção especial, detectar mudanças
                    abruptas em tendências, e encontrar casos de sucesso ou fracasso notáveis.
                  </p>
                </div>
                <Button className="w-full" onClick={() => handleModelSelect("anomaly")}>
                  Selecionar Análise de Anomalias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
