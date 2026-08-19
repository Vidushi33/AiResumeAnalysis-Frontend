import { Mode } from "@/utils/interface";
import styles from "../app/page.module.css";

interface IProps{
  mode:Mode
}

export default function LoadingState({mode}:IProps) {
  return (
    <div className={styles.skeletonWrap}>
      <div className={styles.skeletonHeader}>
        <div className={styles.spinner} />
        <span>{mode === "ats" ? "Scoring your resume..." : "Extracting and analyzing..."}</span>
      </div>
      {/* Ring placeholder */}
      {mode === "ats" && <div className={styles.skeletonScore} />}
      <div
        className={`${styles.skeleton}`}
        style={{ height: 160, marginBottom: 12 }}
      />
      <div className={`${styles.skeleton}`} style={{ height: 120 }} />
    </div>

  );
}
