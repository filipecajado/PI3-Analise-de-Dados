// Este script gera dados de amostra para o aplicativo de saúde mental
const fs = require("fs")
const path = require("path")

// Configurações
const startYear = 2010
const endYear = 2020
const countries = [
  { name: "Brasil", region: "americas" },
  { name: "Estados Unidos", region: "americas" },
  { name: "Canadá", region: "americas" },
  { name: "México", region: "americas" },
  { name: "Argentina", region: "americas" },
  { name: "Reino Unido", region: "europe" },
  { name: "França", region: "europe" },
  { name: "Alemanha", region: "europe" },
  { name: "Itália", region: "europe" },
  { name: "Espanha", region: "europe" },
  { name: "China", region: "asia" },
  { name: "Japão", region: "asia" },
  { name: "Índia", region: "asia" },
  { name: "Coreia do Sul", region: "asia" },
  { name: "Austrália", region: "oceania" },
  { name: "Nova Zelândia", region: "oceania" },
  { name: "África do Sul", region: "africa" },
  { name: "Nigéria", region: "africa" },
  { name: "Egito", region: "africa" },
  { name: "Quênia", region: "africa" },
]

// Função para gerar um número aleatório dentro de um intervalo
function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}

// Função para gerar uma tendência crescente com alguma variação
function generateTrend(startValue, yearlyIncrease, year, startYear) {
  const yearsSince = year - startYear
  const baseValue = startValue + yearlyIncrease * yearsSince
  return baseValue + randomInRange(-0.2, 0.2) // Adiciona variação
}

// Gera os dados
const data = []

countries.forEach((country) => {
  // Valores base para cada país (com alguma variação por região)
  let baseDepression, baseAnxiety, baseBipolar, baseSchizophrenia, baseEating
  let baseGdp, baseUrban, baseUnemployment, baseTreatment

  switch (country.region) {
    case "americas":
      baseDepression = randomInRange(3.0, 4.0)
      baseAnxiety = randomInRange(3.5, 4.5)
      baseBipolar = randomInRange(0.8, 1.2)
      baseSchizophrenia = randomInRange(0.3, 0.5)
      baseEating = randomInRange(0.5, 1.0)
      baseGdp = randomInRange(15000, 60000)
      baseUrban = randomInRange(70, 90)
      baseUnemployment = randomInRange(4, 10)
      baseTreatment = randomInRange(40, 70)
      break
    case "europe":
      baseDepression = randomInRange(3.5, 4.5)
      baseAnxiety = randomInRange(3.0, 4.0)
      baseBipolar = randomInRange(0.7, 1.1)
      baseSchizophrenia = randomInRange(0.3, 0.5)
      baseEating = randomInRange(0.6, 1.1)
      baseGdp = randomInRange(25000, 70000)
      baseUrban = randomInRange(75, 95)
      baseUnemployment = randomInRange(3, 12)
      baseTreatment = randomInRange(50, 80)
      break
    case "asia":
      baseDepression = randomInRange(2.5, 3.5)
      baseAnxiety = randomInRange(2.0, 3.0)
      baseBipolar = randomInRange(0.5, 0.9)
      baseSchizophrenia = randomInRange(0.3, 0.5)
      baseEating = randomInRange(0.3, 0.7)
      baseGdp = randomInRange(5000, 50000)
      baseUrban = randomInRange(50, 95)
      baseUnemployment = randomInRange(2, 8)
      baseTreatment = randomInRange(30, 70)
      break
    case "oceania":
      baseDepression = randomInRange(3.2, 4.2)
      baseAnxiety = randomInRange(3.3, 4.3)
      baseBipolar = randomInRange(0.7, 1.1)
      baseSchizophrenia = randomInRange(0.3, 0.5)
      baseEating = randomInRange(0.5, 1.0)
      baseGdp = randomInRange(30000, 60000)
      baseUrban = randomInRange(80, 95)
      baseUnemployment = randomInRange(3, 7)
      baseTreatment = randomInRange(60, 85)
      break
    case "africa":
      baseDepression = randomInRange(2.0, 3.0)
      baseAnxiety = randomInRange(1.8, 2.8)
      baseBipolar = randomInRange(0.4, 0.8)
      baseSchizophrenia = randomInRange(0.3, 0.5)
      baseEating = randomInRange(0.2, 0.6)
      baseGdp = randomInRange(1000, 15000)
      baseUrban = randomInRange(30, 70)
      baseUnemployment = randomInRange(5, 20)
      baseTreatment = randomInRange(10, 40)
      break
  }

  // Gera dados para cada ano
  for (let year = startYear; year <= endYear; year++) {
    // Aplica tendências crescentes com o tempo
    const yearFactor = (year - startYear) / (endYear - startYear)

    const depression = generateTrend(baseDepression, 0.1, year, startYear)
    const anxiety = generateTrend(baseAnxiety, 0.12, year, startYear)
    const bipolar = generateTrend(baseBipolar, 0.02, year, startYear)
    const schizophrenia = generateTrend(baseSchizophrenia, 0.01, year, startYear)
    const eating_disorders = generateTrend(baseEating, 0.03, year, startYear)

    const gdp_per_capita = generateTrend(baseGdp, baseGdp * 0.02, year, startYear)
    const urbanization = Math.min(100, generateTrend(baseUrban, 0.5, year, startYear))
    const unemployment = generateTrend(baseUnemployment, -0.1, year, startYear) // Tendência de queda
    const treatment_coverage = Math.min(100, generateTrend(baseTreatment, 1.5, year, startYear))

    // Adiciona o registro
    data.push({
      country: country.name,
      year,
      region: country.region,
      depression: Number.parseFloat(depression.toFixed(2)),
      anxiety: Number.parseFloat(anxiety.toFixed(2)),
      bipolar: Number.parseFloat(bipolar.toFixed(2)),
      schizophrenia: Number.parseFloat(schizophrenia.toFixed(2)),
      eating_disorders: Number.parseFloat(eating_disorders.toFixed(2)),
      gdp_per_capita: Math.round(gdp_per_capita),
      urbanization: Number.parseFloat(urbanization.toFixed(1)),
      unemployment: Number.parseFloat(unemployment.toFixed(1)),
      treatment_coverage: Number.parseFloat(treatment_coverage.toFixed(1)),
    })
  }
})

// Adiciona algumas anomalias para detecção
// País com prevalência muito alta de depressão
data.push({
  country: "País X",
  year: 2019,
  region: "europe",
  depression: 5.8,
  anxiety: 4.2,
  bipolar: 0.9,
  schizophrenia: 0.4,
  eating_disorders: 0.8,
  gdp_per_capita: 25000,
  urbanization: 82.5,
  unemployment: 12.3,
  treatment_coverage: 25.0,
})

// País com cobertura de tratamento muito baixa
data.push({
  country: "País Y",
  year: 2019,
  region: "asia",
  depression: 2.1,
  anxiety: 1.9,
  bipolar: 0.6,
  schizophrenia: 0.4,
  eating_disorders: 0.3,
  gdp_per_capita: 8000,
  urbanization: 45.2,
  unemployment: 7.8,
  treatment_coverage: 15.0,
})

// País com alta prevalência mas boa cobertura
data.push({
  country: "País Z",
  year: 2019,
  region: "americas",
  depression: 7.2,
  anxiety: 6.8,
  bipolar: 1.5,
  schizophrenia: 0.6,
  eating_disorders: 1.2,
  gdp_per_capita: 55000,
  urbanization: 91.3,
  unemployment: 3.2,
  treatment_coverage: 82.0,
})

// Converte para CSV
const headers = Object.keys(data[0]).join(",")
const rows = data.map((row) => Object.values(row).join(","))
const csv = [headers, ...rows].join("\n")

// Cria diretório se não existir
const dataDir = path.join(process.cwd(), "public", "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Salva o arquivo
fs.writeFileSync(path.join(dataDir, "mental_health_data.csv"), csv)
console.log("Arquivo CSV gerado com sucesso!")
