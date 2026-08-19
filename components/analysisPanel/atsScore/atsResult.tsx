import styles from "../../../app/page.module.css";
import { AtsAnalysis, Provider } from "@/utils/interface";

interface Props {
  analysis: AtsAnalysis;
  provider: Provider;
  hasJobDescription: boolean;
}

const PROVIDER_LABELS: Record<Provider, string> = {
  openai: "OpenAI",
  gemini: "Gemini",
  claude: "Claude",
};

const BREAKDOWN_LABELS: Record<keyof AtsAnalysis["breakdown"], string> = {
  keywordRelevance: "Keyword Relevance",
  measurableAchievements: "Measurable Achievements",
  sectionStructure: "Section Structure",
  skillsCompleteness: "Skills Completeness",
  jobTitleAlignment: "Job Title Alignment",
};

// Weights matching your backend prompt
const BREAKDOWN_WEIGHTS: Record<keyof AtsAnalysis["breakdown"], number> = {
  keywordRelevance: 30,
  measurableAchievements: 25,
  sectionStructure: 20,
  skillsCompleteness: 15,
  jobTitleAlignment: 10,
};

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--emerald)";
  if (score >= 60) return "var(--amber)";
  return "var(--rose)";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs Work";
}

// SVG circular score ring
function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={styles.ringWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        {/* Progress — starts at top (rotate -90deg) */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.3s ease" }}
        />
      </svg>
      {/* Score text centered inside ring */}
      <div className={styles.ringInner}>
        <div className={styles.ringScore} style={{ color }}>
          {score}
        </div>
        <div className={styles.ringLabel}>{getScoreLabel(score)}</div>
      </div>
    </div>
  );
}

// Individual breakdown bar row
function BreakdownRow({
  label,
  item,
  weight,
}: {
  label: string;
  item: { score: number; comment: string };
  weight: number;
}) {
  const color = getScoreColor(item.score);

  return (
    <div className={styles.breakdownRow}>
      <div className={styles.breakdownHeader}>
        <div className={styles.breakdownLabel}>
          {label}
          <span className={styles.breakdownWeight}>{weight}%</span>
        </div>
        <div className={styles.breakdownScore} style={{ color }}>
          {item.score}
        </div>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{
            width: `${item.score}%`,
            background: color,
          }}
        />
      </div>
      <div className={styles.breakdownComment}>{item.comment}</div>
    </div>
  );
}

export default function AtsResult({
  analysis,
  provider,
  hasJobDescription,
}: Props) {
  const breakdownKeys = Object.keys(
    analysis.breakdown,
  ) as (keyof AtsAnalysis["breakdown"])[];

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.resultHeader}>
        <div className={styles.resultTitle}>
           <div className={`${styles.statusDot} ${styles.statusDotDone}`} />
          ATS Score
        </div>
        <div className={styles.headerRight}>
          {hasJobDescription && analysis.overallScore >= 80 &&(
            <span className={styles.jdBadge}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Matched against JD
            </span>
          )}
          <div className={`${styles.providerPill} ${styles[`pill_${provider}`]}`}>
            {PROVIDER_LABELS[provider]}
          </div>
        </div>
      </div>

      {/* Overall score */}
      <div className={styles.scoreCard}>
        <ScoreRing score={analysis.overallScore} />
        <div className={styles.scoreInfo}>
          <div className={styles.scoreTitle}>Overall ATS Score</div>
          <div className={styles.scoreDesc}>
            {analysis.overallScore >= 80
              ? "This resume is well-optimized for ATS systems and should pass most automated filters."
              : analysis.overallScore >= 60
                ? "This resume has a reasonable chance with ATS systems but has clear areas to improve."
                : "This resume may struggle to pass ATS filters. Focus on the improvements below."}
          </div>
          <div className={styles.disclaimer}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            AI estimate only — actual ATS results vary by company and role
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Score Breakdown
        </div>
        <div className={styles.breakdownList}>
          {breakdownKeys.map((key) => (
            <BreakdownRow
              key={key}
              label={BREAKDOWN_LABELS[key]}
              item={analysis.breakdown[key]}
              weight={BREAKDOWN_WEIGHTS[key]}
            />
          ))}
        </div>
      </div>

      {/* Strengths + Improvements */}
      <div className={styles.twoCol}>
        {analysis.strengths?.length > 0 && (
          <div className={`${styles.card} ${styles.cardSuccess}`}>
            <div className={`${styles.cardLabel} ${styles.labelSuccess}`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Strengths
            </div>
            <ul className={styles.list}>
              {analysis.strengths.map((s, i) => (
                <li key={i} className={styles.listItemSuccess}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.improvements?.length > 0 && (
          <div className={`${styles.card} ${styles.cardWarning}`}>
            <div className={`${styles.cardLabel} ${styles.labelWarning}`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Improvements
            </div>
            <ul className={styles.list}>
              {analysis.improvements.map((imp, i) => (
                <li key={i} className={styles.listItemDanger}>
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      {analysis.missingKeywords?.length > 0 && (
        <div className={styles.card}>
          <div className={`${styles.cardLabel} ${styles.labelDanger}`}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Missing Keywords
          </div>
          <p className={styles.keywordsHint}>
            These are commonly expected keywords for this type of role that
            were not detected in your resume:
          </p>
          <div className={styles.keywords}>
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className={styles.keyword}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
