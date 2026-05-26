import { labels } from "../../labels";
import styles from "./ChartPlaceholder.module.css";

export function ChartPlaceholder() {
  return (
    <p className={styles.placeholder} role="status">
      {labels.placeholders.comingSoon}
    </p>
  );
}
