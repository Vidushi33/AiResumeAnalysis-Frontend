"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";
import { Mode, Provider, ResumeAnalysis, Status } from "@/utils/interface";
import Navbar from "@/components/navbar";
import LeftPanel from "@/components/promptPanel/leftPanel";
import RightPanel from "@/components/analysisPanel/rightPanel";

export default function Home() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [mode, setMode] = useState<Mode>("text");
  const [status, setStatus] = useState<Status>("idle");
  const [streamedText, setStreamedText] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setStreamedText("");
    setAnalysis(null);
    setError("");
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Navbar />
      </header>

      <main className={styles.main}>
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
          />
        </div>
      </main>
    </div>
  );
}
