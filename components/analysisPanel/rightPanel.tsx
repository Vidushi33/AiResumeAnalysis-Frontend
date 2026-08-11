import {
  CandidateIcon,
  CrossIcon,
  ExperienceIcon,
  HexagonIcon,
  SkillGraphIcon,
  SomethingWrongIcon,
  TickIcon,
} from "@/public/icons";
import styles from "../../app/page.module.css";
import EmptyState from "../emptyState";
import ProviderPill from "../providerPill";
import { Mode, Provider, ResumeAnalysis, Status } from "@/utils/interface";

interface IRight {
  mode: Mode;
  streamedText: string;
  error: string;
  reset: () => void;
  provider: Provider;
  analysis: ResumeAnalysis | null;
  status: Status;
}

const RightPanel = ({
  analysis,
  error,
  mode,
  provider,
  reset,
  streamedText,
  status,
}: IRight) => {
  const hasResult =
    (mode === "text" && streamedText) || (mode === "pdf" && analysis);

  return (
    <div className={styles.resultsPanel}>
      {status === "idle" && !hasResult && <EmptyState mode={mode} />}

      {status === "error" && (
        <div className={styles.errorBox} key="error">
          <div className={styles.errorIcon}>
            <SomethingWrongIcon />
          </div>
          <div>
            <div className={styles.errorTitle}>Something went wrong</div>
            <div className={styles.errorMsg}>
              {error ||
                "Unknown error. Check the server is running on port 3000."}
            </div>
          </div>
          <button onClick={reset} className={styles.errorRetry}>
            Dismiss
          </button>
        </div>
      )}

      {/* Streaming Text Result */}
      {mode === "text" &&
        (status === "streaming" || (status !== "error" && streamedText)) && (
          <div className={styles.streamResult} key="stream">
            <div className={styles.resultHeader}>
              <div className={styles.resultTitle}>
                <div
                  className={`${styles.statusDot} ${status === "streaming" ? styles.statusDotLive : styles.statusDotDone}`}
                />
                {status === "streaming" ? "Analyzing..." : "Analysis complete"}
              </div>
              <ProviderPill provider={provider} />
            </div>
            <div className={styles.streamText}>
              {streamedText}
              {status === "streaming" && (
                <span className={styles.cursor}>▋</span>
              )}
            </div>
          </div>
        )}

      {/* Loading skeleton for PDF */}
      {mode === "pdf" && status === "loading" && (
        <div className={styles.skeletonWrap} key="skeleton">
          <div className={styles.skeletonHeader}>
            <div className={styles.spinner} />
            <span>Extracting and analyzing...</span>
          </div>
          <div
            className={styles.skeleton}
            style={{ height: 80, marginBottom: 12 }}
          />
          <div
            className={styles.skeleton}
            style={{ height: 120, marginBottom: 12 }}
          />
          <div className={styles.skeleton} style={{ height: 100 }} />
        </div>
      )}

      {/* Structured JSON Result */}
      {mode === "pdf" && analysis && status !== "loading" && (
        <div className={styles.analysisWrap} key="analysis">
          <div className={styles.resultHeader}>
            <div className={styles.resultTitle}>
              <div className={`${styles.statusDot} ${styles.statusDotDone}`} />
              Analysis complete
            </div>
            <ProviderPill provider={provider} />
          </div>

          {!analysis.isValidResume && (
            <div className={styles.invalidBanner}>
              This file doesn&apos;t appear to be a resume. Results may be
              inaccurate.
            </div>
          )}

          {/* Summary card */}
          <div className={styles.card}>
            <div className={styles.cardLabel}>
              <CandidateIcon />
              Candidate summary
            </div>
            <p className={styles.summaryText}>{analysis.summary}</p>
            <div className={styles.expBadge}>
              <ExperienceIcon />
              {analysis.yearsOfExperience}{" "}
              {analysis.yearsOfExperience === 1 ? "year" : "years"} of
              experience
            </div>
          </div>

          {/* Top Skills */}
          {analysis.topSkills?.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardLabel}>
                <SkillGraphIcon />
                Top skills
              </div>
              <div className={styles.tagCloud}>
                {analysis.topSkills.map((skill) => (
                  <span key={skill} className={styles.tagSkill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Two column: Strengths + Red Flags */}
          <div className={styles.twoCol}>
            {analysis.strengths?.length > 0 && (
              <div className={`${styles.card} ${styles.cardSuccess}`}>
                <div className={`${styles.cardLabel} ${styles.labelSuccess}`}>
                  <TickIcon />
                  Strengths
                </div>
                <ul className={styles.list}>
                  {analysis.strengths.map((s) => (
                    <li key={s} className={styles.listItemSuccess}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.redFlags?.length > 0 ? (
              <div className={`${styles.card} ${styles.cardDanger}`}>
                <div className={`${styles.cardLabel} ${styles.labelDanger}`}>
                  <CrossIcon />
                  Red flags
                </div>
                <ul className={styles.list}>
                  {analysis.redFlags.map((f) => (
                    <li key={f} className={styles.listItemDanger}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={`${styles.card} ${styles.cardSuccess}`}>
                <div className={`${styles.cardLabel} ${styles.labelSuccess}`}>
                  <TickIcon />
                  Red flags
                </div>
                <div className={styles.noFlags}>No red flags detected</div>
              </div>
            )}
          </div>

          {/* Suggested Roles */}
          {analysis.suggestedRoles?.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardLabel}>
                <HexagonIcon />
                Suggested roles
              </div>
              <div className={styles.tagCloud}>
                {analysis.suggestedRoles.map((role) => (
                  <span key={role} className={styles.tagRole}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RightPanel;
