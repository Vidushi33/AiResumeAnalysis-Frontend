import { Mode } from "@/utils/interface";
import styles from "../app/page.module.css";

const EmptyState = ({ mode }: { mode: Mode }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        {mode === "text" ? (
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )}
      </div>
      <div className={styles.emptyTitle}>
        {mode === "text"
          ? "Paste a resume to get started"
          : "Upload a PDF to get started"}
      </div>
      <div className={styles.emptyDesc}>
        {mode === "text"
          ? "The analysis streams word by word, just like LLM Model."
          : "Get a structured breakdown of skills, strengths, and more."}
      </div>
      <div className={styles.emptyFeatures}>
        <div className={styles.emptyFeature}>
          <span
            className={styles.featureDot}
            style={{ background: "var(--emerald)" }}
          />
          Strengths identified
        </div>
        <div className={styles.emptyFeature}>
          <span
            className={styles.featureDot}
            style={{ background: "var(--rose)" }}
          />
          Red flags surfaced
        </div>
        <div className={styles.emptyFeature}>
          <span
            className={styles.featureDot}
            style={{ background: "var(--indigo)" }}
          />
          Roles suggested
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
