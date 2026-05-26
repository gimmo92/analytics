export const labels = {
  tabs: {
    histogram: "Distribuzione rating",
    bellCurve: "Curva attesa vs reale",
    managerHeatmap: "Heatmap manager",
    departmentBoxplot: "Box plot dipartimenti",
    nineBox: "9-box globale",
  },

  filters: {
    cycle: "Ciclo di valutazione",
    department: "Dipartimento",
    manager: "Manager",
    completedOnly: "Includi solo valutazioni completate",
    allDepartments: "Tutti i dipartimenti",
    allManagers: "Tutti i manager",
  },

  emptyState: "Nessuna valutazione corrisponde ai filtri selezionati",
  loading: "Caricamento dati…",
  error: "Impossibile caricare i dati. Riprova più tardi.",

  export: {
    png: "Esporta PNG",
    csv: "Esporta CSV",
  },

  charts: {
    histogram: {
      title: "Distribuzione rating finali",
      subtitle: "Utile per valutare il bias verso l'alto o verso il basso",
      help:
        "Ogni barra rappresenta quante persone hanno ricevuto un rating nel relativo intervallo. La linea tratteggiata indica la media del campione filtrato.",
      ariaLabel: "Istogramma della distribuzione dei rating finali",
      meanLine: "Media",
      xAxis: "Rating",
      yAxis: "N. persone",
      tooltipCount: "Persone",
      tooltipPercent: "Percentuale",
      tooltipRange: "Intervallo",
    },
    bellCurve: {
      title: "Curva attesa vs reale",
      subtitle: "Confronto con la distribuzione target configurata",
      help:
        "La linea piena mostra la densità stimata dai dati (KDE). La linea tratteggiata è la distribuzione attesa (default: normale μ=3.0, σ=0.8). Il badge indica lo scostamento medio tra le due curve.",
      ariaLabel: "Grafico curva attesa vs distribuzione reale",
      xAxis: "Rating",
      yAxis: "Densità",
      realSeries: "Distribuzione reale",
      expectedSeries: "Distribuzione attesa",
      meanDeviation: "Scostamento medio",
      biasUp: "Bias verso l'alto",
      biasDown: "Bias verso il basso",
      tooltipRating: "Rating",
      tooltipReal: "Densità reale",
      tooltipExpected: "Densità attesa",
      tooltipGap: "Gap",
    },
    managerHeatmap: {
      title: "Heatmap rating per manager",
      subtitle: "Identifica manager generosi o severi rispetto alla media",
      help:
        "Ogni cella indica quante valutazioni del manager ricadono nel bucket di rating. La colonna a destra mostra media, totale e un badge di calibrazione rispetto alla media aziendale (soglia ±0.4). Clicca una riga per il drill-down.",
      ariaLabel: "Heatmap distribuzione rating per manager",
      sortBy: "Ordina per",
      sortName: "Nome",
      sortAvgAsc: "Media ↑",
      sortAvgDesc: "Media ↓",
      sortCount: "N. valutati",
      manager: "Manager",
      average: "Media",
      total: "Valutati",
      calibration: "Calibrazione",
      generous: "Generoso",
      strict: "Severo",
      aligned: "In linea",
      page: "Pagina",
      of: "di",
      prev: "Precedente",
      next: "Successiva",
      clickHint: "Clicca per dettaglio",
    },
    departmentBoxplot: {
      title: "Box plot per dipartimento",
      subtitle: "Confronto della dispersione dei rating tra aree",
      help:
        "Per ogni dipartimento: minimo, quartili, mediana, massimo e outlier (punti). La linea tratteggiata è la media aziendale del campione filtrato.",
      ariaLabel: "Box plot rating per dipartimento",
      sortMedian: "Per mediana",
      sortAlpha: "Alfabetico",
      companyMean: "Media aziendale",
      xAxis: "Dipartimento",
      yAxis: "Rating",
      tooltipMin: "Min",
      tooltipQ1: "Q1",
      tooltipMedian: "Mediana",
      tooltipQ3: "Q3",
      tooltipMax: "Max",
      tooltipOutliers: "Outlier",
      tooltipSample: "Campione",
    },
    nineBox: {
      title: "9-box globale",
      subtitle:
        "Mappa performance vs potenziale su tutto il campione filtrato",
      help:
        "Ogni pallino è una persona posizionata in base al percentile di performance (asse X) e potenziale (asse Y) nel campione filtrato. Passa il mouse per nome e cognome; clicca per i dettagli.",
      ariaLabel: "Matrice nove box performance e potenziale con posizionamento scatter",
      gridLabel: "Griglia nove box con distribuzione persone",
      axisPerformance: "% Performance",
      axisPotential: "% Potenziale",
      scatterHint:
        "Posizione = percentile relativo nel campione (linee a 33% e 67%).",
      total: "Totale valutati",
      closeDetail: "Chiudi",
    },
  },

  modal: {
    title: "Dettaglio manager",
    close: "Chiudi",
    placeholder:
      "Drill-down in arrivo: qui verranno mostrate le valutazioni del team per questo manager.",
    department: "Dipartimento",
    average: "Media rating",
    total: "Valutati",
    calibration: "Calibrazione",
  },
} as const;

export type Labels = typeof labels;
