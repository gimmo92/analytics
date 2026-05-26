import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useState,
} from "react";
import { labels } from "../labels";
import styles from "./ChartCard.module.css";

interface ChartCardProps {
  title: string;
  subtitle: string;
  helpText: string;
  ariaLabel: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  chartId: string;
}

interface ChartCardErrorBoundaryProps {
  children: ReactNode;
  chartId: string;
}

interface ChartCardErrorBoundaryState {
  hasError: boolean;
}

class ChartCardErrorBoundary extends Component<
  ChartCardErrorBoundaryProps,
  ChartCardErrorBoundaryState
> {
  state: ChartCardErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ChartCardErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ChartCard:${this.props.chartId}]`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.error} role="alert">
          {labels.error}
        </div>
      );
    }
    return this.props.children;
  }
}

function ChartCardSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonBarShort} />
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  helpText,
  ariaLabel,
  loading = false,
  empty = false,
  emptyMessage = labels.emptyState,
  children,
  chartId,
}: ChartCardProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const handleExportPng = () => {
    // TODO: export chart as PNG
    console.log(`[export PNG] ${chartId}`);
  };

  const handleExportCsv = () => {
    // TODO: export chart data as CSV
    console.log(`[export CSV] ${chartId}`);
  };

  return (
    <article className={styles.card} aria-label={ariaLabel}>
      <header className={styles.header}>
        <div className={styles.titles}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.helpWrap}>
            <button
              type="button"
              className={styles.helpBtn}
              aria-label={`Informazioni: ${title}`}
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen((v) => !v)}
            >
              ℹ︎
            </button>
            {helpOpen && (
              <div className={styles.helpTooltip} role="tooltip">
                {helpText}
              </div>
            )}
          </div>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExportPng}
          >
            {labels.export.png}
          </button>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExportCsv}
          >
            {labels.export.csv}
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <ChartCardErrorBoundary chartId={chartId}>
          {loading ? (
            <ChartCardSkeleton />
          ) : empty ? (
            <p className={styles.empty} role="status">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </ChartCardErrorBoundary>
      </div>
    </article>
  );
}
