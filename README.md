# ANÁLISE DE DADOS SOBRE SAÚDE MENTAL UTILIZANDO MODELOS DE MACHINE LEARNING

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina de Projeto Integrador do Centro Universitário FAESA.

O projeto é uma aplicação web desenvolvida para análise de dados sobre saúde mental utilizando modelos de Machine Learning. A aplicação permite visualizar, analisar e prever tendências relacionadas a transtornos mentais em diferentes países e regiões.




### 🎯 Objetivos

- Analisar dados de saúde mental globalmente
- Identificar padrões e tendências em transtornos mentais
- Prever evolução de indicadores de saúde mental
- Detectar anomalias e casos atípicos
- Fornecer insights para políticas públicas de saúde mental

## 📱 Deploy

A aplicação está disponível em: [https://pi3-mental-health-app.vercel.app/ml-analysis](https://pi3-mental-health-app.vercel.app/ml-analysis)

## 👥 Autores

- FÁBIO BOEKER JÚNIOR
- FILIPE CAJADO ALMEIDA
- KEVIN RICARDO
- MACIEL COSTA DO NASCIMENTO
- PEDRO HENRIQUE DE FREITAS TESSNIARI
- VITOR DORNELA MASCARENHAS

## 📊 Fonte de Dados

Os dados utilizados neste projeto foram obtidos do dataset "Mental Health" disponível no Kaggle:

[https://www.kaggle.com/datasets/imtkaggleteam/mental-health/](https://www.kaggle.com/datasets/imtkaggleteam/mental-health/)

Este dataset contém informações sobre prevalência de transtornos mentais em diferentes países, incluindo dados sobre depressão, ansiedade e outros indicadores de saúde mental.

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Lucide Icons

- **Machine Learning:**
  - Prophet (Séries Temporais)
  - K-means (Clustering)
  - PCA (Análise de Correlação)
  - Regressão Linear
  - Isolation Forest (Detecção de Anomalias)

## 📊 Modelos de Machine Learning

A aplicação utiliza cinco modelos principais de Machine Learning:

1. **Previsão de Tendências (Time Series)**
   - Algoritmo: Prophet
   - Função: Prever evolução de transtornos mentais
   - Métricas: RMSE, MAE
   - Visualizações: Gráficos de tendência, previsões futuras

2. **Agrupamento de Perfis (Clustering)**
   - Algoritmo: K-means
   - Função: Identificar grupos de países com padrões similares
   - Métricas: Silhouette Score, Inertia
   - Visualizações: Mapa de calor, gráficos de dispersão

3. **Correlação entre Transtornos**
   - Algoritmo: PCA
   - Função: Analisar relações entre diferentes transtornos
   - Métricas: Variância Explicada
   - Visualizações: Matriz de correlação, biplot

4. **Fatores de Influência (Regression)**
   - Algoritmo: Regressão Linear
   - Função: Identificar fatores que influenciam a prevalência
   - Métricas: R², RMSE
   - Visualizações: Gráficos de importância de features

5. **Detecção de Anomalias**
   - Algoritmo: Isolation Forest
   - Função: Identificar padrões atípicos
   - Métricas: Anomaly Score
   - Visualizações: Gráficos de outliers

## 🛠️ Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pi3-analise-de-dados.git
cd pi3-analise-de-dados
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
App/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── ml-analysis/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── tabs.tsx
│   └── ml/
│       ├── model-selector.tsx
│       ├── data-upload.tsx
│       └── ml-results.tsx
├── utils/
│   └── index.ts
├── public/
├── styles.css
└── package.json
```

## 📈 Funcionalidades

- **Upload de Dados**
  - Suporte para arquivos CSV e JSON
  - Validação de dados
  - Pré-processamento automático

- **Análise de Dados**
  - Seleção de modelos
  - Configuração de parâmetros
  - Visualização em tempo real

- **Resultados**
  - Gráficos interativos
  - Métricas de performance
  - Exportação de relatórios

- **Personalização**
  - Ajuste de parâmetros
  - Seleção de features
  - Configuração de visualizações

