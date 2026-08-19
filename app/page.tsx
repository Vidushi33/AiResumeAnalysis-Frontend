"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";
import {
  AtsAnalysis,
  Mode,
  Provider,
  ResumeAnalysis,
  Status,
} from "@/utils/interface";
import Navbar from "@/components/navbar";
import LeftPanel from "@/components/promptPanel/leftPanel";
import RightPanel from "@/components/analysisPanel/rightPanel";
import {  InfoIcon } from "@/public/icons";

export default function Home() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [mode, setMode] = useState<Mode>("text");
  const [status, setStatus] = useState<Status>("idle");
  const [streamedText, setStreamedText] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setStreamedText("");
    setAnalysis(null);
    setError("");
    setAtsAnalysis(null);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Navbar />
      </header>

      <main className={styles.main}>
        <div className={styles.banner}>
          <InfoIcon />
          <span>
            This is a demo project hosted on a free server. The first request
            may take
            <strong> 50+ seconds</strong> to respond due to a cold start —
            subsequent requests will be fast.
          </span>
        </div>

        <div className={styles.layout}>
          {/* LEFT PANEL — Controls */}
          <LeftPanel
            abortRef={abortRef}
            mode={mode}
            provider={provider}
            reset={reset}
            setAnalysis={setAnalysis}
            setError={setError}
            setMode={setMode}
            setProvider={setProvider}
            setStatus={setStatus}
            setStreamedText={setStreamedText}
            status={status}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            setAtsAnalyses={setAtsAnalysis}
          />

          {/* RIGHT PANEL — Results */}
          <RightPanel
            analysis={analysis}
            error={error}
            mode={mode}
            provider={provider}
            reset={reset}
            status={status}
            streamedText={streamedText}
            atsAnalysis={atsAnalysis}
            hasJobDescription={!!jobDescription.trim()}
          />
        </div>
      </main>
    </div>
  );
}
