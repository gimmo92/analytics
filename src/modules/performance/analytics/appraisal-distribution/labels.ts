export const labels = {
  tabs: {
    histogram: "Distribuzione rating",
    bellCurve: "Curva attesa vs reale",
    managerHeatmap: "Heatmap manager",
    departmentBoxplot: "Box plot dipartimenti",
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
      help: "In arrivo nello step successivo.",
      ariaLabel: "Grafico curva attesa vs reale",
    },
    managerHeatmap: {
      title: "Heatmap rating per manager",
      subtitle: "Identifica manager generosi o severi rispetto alla media",
      help: "In arrivo nello step successivo.",
      ariaLabel: "Heatmap rating per manager",
    },
    departmentBoxplot: {
      title: "Box plot per dipartimento",
      subtitle: "Confronto della dispersione dei rating tra aree",
      help: "In arrivo nello step successivo.",
      ariaLabel: "Box plot rating per dipartimento",
    },
  },

  placeholders: {
    comingSoon: "Grafico in arrivo nel prossimo step",
  },
} as const;

export type Labels = typeof labels;
