"use client"

import Papa from "papaparse"

// Interface para os dados de saúde mental
export interface MentalHealthData {
  country: string
  year: number
  region: string
  depression: number
  anxiety: number
  bipolar: number
  schizophrenia: number
  eating_disorders: number
  treatment_coverage: number
  gdp_per_capita: number
  urbanization: number
  unemployment: number
  [key: string]: string | number // Para permitir acesso dinâmico a propriedades
}

// Cache para evitar carregamentos repetidos
const dataCache: Record<string, MentalHealthData[]> = {}

/**
 * Carrega dados de um arquivo CSV
 */
export async function loadCSVData(filename: string): Promise<MentalHealthData[]> {
  // Verifica se os dados já estão em cache
  if (dataCache[filename]) {
    return dataCache[filename]
  }

  try {
    // Carrega o arquivo CSV
    const response = await fetch(`/data/${filename}`)
    const csvText = await response.text()

    // Parse do CSV para JSON
    const result = Papa.parse<MentalHealthData>(csvText, {
      header: true,
      dynamicTyping: true, // Converte números automaticamente
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      console.error("Erros ao processar CSV:", result.errors)
    }

    // Armazena em cache e retorna
    dataCache[filename] = result.data
    return result.data
  } catch (error) {
    console.error("Erro ao carregar dados CSV:", error)
    return []
  }
}

/**
 * Filtra dados por região
 */
export function filterByRegion(data: MentalHealthData[], region: string): MentalHealthData[] {
  if (region === "global") {
    return data
  }
  return data.filter((item) => item.region.toLowerCase() === region.toLowerCase())
}

/**
 * Filtra dados por ano
 */
export function filterByYear(data: MentalHealthData[], year: number | string): MentalHealthData[] {
  const yearNum = typeof year === "string" ? Number.parseInt(year) : year
  return data.filter((item) => item.year === yearNum)
}

/**
 * Obtém dados de séries temporais para um transtorno específico
 */
export function getTimeSeriesData(
  data: MentalHealthData[],
  disorder: string,
  region = "global",
): { date: string; value: number }[] {
  const filteredData = filterByRegion(data, region)

  // Agrupa por ano e calcula a média
  const groupedByYear = filteredData.reduce(
    (acc, item) => {
      const year = item.year.toString()
      if (!acc[year]) {
        acc[year] = { sum: 0, count: 0 }
      }

      const value = item[disorder] as number
      if (typeof value === "number") {
        acc[year].sum += value
        acc[year].count += 1
      }

      return acc
    },
    {} as Record<string, { sum: number; count: number }>,
  )

  // Converte para o formato esperado pelos gráficos
  return Object.entries(groupedByYear)
    .map(([year, { sum, count }]) => ({
      date: year,
      value: count > 0 ? sum / count : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Obtém dados para clustering
 */
export function getClusteringData(
  data: MentalHealthData[],
  features: string[],
  year: number | string,
): { id: string; name: string; x: number; y: number; cluster?: number }[] {
  const yearData = filterByYear(data, year)

  if (features.length < 2) {
    features = ["depression", "anxiety"] // Valores padrão
  }

  return yearData.map((item) => ({
    id: item.country,
    name: item.country,
    x: (item[features[0]] as number) || 0,
    y: (item[features[1]] as number) || 0,
  }))
}

/**
 * Obtém matriz de correlação entre transtornos
 */
export function getCorrelationMatrix(data: MentalHealthData[], disorders: string[]): number[][] {
  // Implementação simplificada de correlação
  const matrix: number[][] = []

  for (let i = 0; i < disorders.length; i++) {
    matrix[i] = []
    for (let j = 0; j < disorders.length; j++) {
      if (i === j) {
        matrix[i][j] = 1 // Autocorrelação é sempre 1
      } else {
        // Cálculo simplificado de correlação (na prática, usaríamos Pearson ou Spearman)
        const disorder1 = disorders[i]
        const disorder2 = disorders[j]

        // Valores simulados baseados em correlações típicas
        const correlations: Record<string, Record<string, number>> = {
          depression: { anxiety: 0.72, bipolar: 0.58, schizophrenia: 0.31, eating_disorders: 0.45 },
          anxiety: { depression: 0.72, bipolar: 0.51, schizophrenia: 0.28, eating_disorders: 0.48 },
          bipolar: { depression: 0.58, anxiety: 0.51, schizophrenia: 0.42, eating_disorders: 0.33 },
          schizophrenia: { depression: 0.31, anxiety: 0.28, bipolar: 0.42, eating_disorders: 0.25 },
          eating_disorders: { depression: 0.45, anxiety: 0.48, bipolar: 0.33, schizophrenia: 0.25 },
        }

        matrix[i][j] = correlations[disorder1]?.[disorder2] || 0.3 // Valor padrão se não encontrado
      }
    }
  }

  return matrix
}
