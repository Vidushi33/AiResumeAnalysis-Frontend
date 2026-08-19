import { Mode } from "@/utils/interface";
import styles from "../app/page.module.css";
import { AtsIcon, EmptyPdf, EmptyText } from "@/public/icons";

const EmptyState = ({ mode }: { mode: Mode }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        {mode === "text" ? (
          <EmptyText />
        ) : mode === "pdf" ? (
          <EmptyPdf />
        ) : (
          <AtsIcon
            height="40"
            width="40"
            style={{ color: "var(--text-muted)" }}
          />
        )}
      </div>
      <div className={styles.emptyTitle}>
        {mode === "text"
          ? "Paste a resume to get started"
          : mode == "pdf"
            ? "Upload a PDF to get started"
            : "Upload a resume to get your ATS score"}
      </div>
      <div className={styles.emptyDesc}>
        {mode === "text"
          ? "The analysis streams word by word, just like LLM Model."
          : mode === "pdf"
            ? "Get a structured breakdown of skills, strengths, and more."
            : "Optionally paste a job description for a targeted keyword match score."}
      </div>
      {mode !== "ats" && (
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
      )}
    </div>
  );
};

export default EmptyState;
