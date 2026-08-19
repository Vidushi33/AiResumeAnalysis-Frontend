"use client";

import { PROVIDERS } from "@/utils/constants";
import styles from "../../app/page.module.css";
import { ProviderIcon } from "@/utils/providerIcon";
import {
  AtsIcon,
  PasteTextIcon,
  ResetIcon,
  SearchIcon,
  UploadIcon,
  UplpoadPdfIcon,
} from "@/public/icons";
import {
  AtsAnalysis,
  Mode,
  Provider,
  ResumeAnalysis,
  Status,
} from "@/utils/interface";
import { useRef, useState, RefObject, Dispatch, SetStateAction } from "react";
import { API_BASE } from "@/utils/baseurl";

interface ILeft {
  provider: Provider;
  setProvider: (value: Provider) => void;
  mode: Mode;
  setMode: (value: Mode) => void;
  status: Status;
  setStatus: (value: Status) => void;
  abortRef: RefObject<AbortController | null>;
  reset: () => void;
  setStreamedText: Dispatch<SetStateAction<string>>;
  setError: (value: string) => void;
  setAnalysis: (value: ResumeAnalysis) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  setAtsAnalyses:(value:AtsAnalysis) =>void
}

const LeftPanel = ({
  abortRef,
  mode,
  provider,
  reset,
  setMode,
  setProvider,
  setStatus,
  setStreamedText,
  status,
  setAnalysis,
  setError,
  jobDescription,
  setJobDescription,
  setAtsAnalyses
}: ILeft) => {
  const [prompt, setPrompt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [atsFile, setAtsFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atsFileRef = useRef<HTMLInputElement>(null);

  const isRunning = status === "loading" || status === "streaming";

  const handleStream = async () => {
    if (!prompt.trim()) return;
    reset();

    await new Promise((r) => setTimeout(r, 10));
    setStatus("streaming");
    setStreamedText("");
    setError("");

    abortRef.current = new AbortController();

    try {
      const response = await fetch(
        `${API_BASE}/resume/analyze/stream?provider=${provider}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: abortRef.current.signal,
        },
      );

      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(err.message || `Error ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") {
            setStatus("done");
            return;
          }
          if (data.startsWith("[ERROR]")) {
            setError("Analysis failed mid-stream.");
            setStatus("error");
            return;
          }
          setStreamedText((prev) => prev + data);
        }
      }

      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message);
      setStatus("error");
    }
  };

  const handlePdfAnalyze = async () => {
    if (!pdfFile) return;
    reset();

    await new Promise((r) => setTimeout(r, 10));
    setStatus("loading");
    setError("");

    const formData = new FormData();
    formData.append("resume", pdfFile);

    try {
      const response = await fetch(
        `${API_BASE}/resume/analyze/pdf?provider=${provider}`,
        { method: "POST", body: formData },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");

      setAnalysis(data as ResumeAnalysis);
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    fileFunction: "analyze" | "checkAts",
  ) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      if (fileFunction == "analyze") {
        setPdfFile(file);
      } else {
        setAtsFile(file);
      }
      reset();
      setPrompt("");
    }
  };

  const handleAtsScore = async () => {
    if (!atsFile) return;
    reset();
    setStatus("loading");

    const formData = new FormData();
    formData.append("resume", atsFile);
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription);
    }

    try {
      const response = await fetch(
        `${API_BASE}/resume/ats-score/pdf?provider=${provider}`,
        { method: "POST", body: formData },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "ATS analysis failed");
      setAtsAnalyses(data as AtsAnalysis);
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <div className={styles.panel}>
      {/* Provider Selector */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>AI Provider</div>
        <div className={styles.providerGrid}>
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProvider(p.id);
                reset();
              }}
              className={`${styles.providerBtn} ${styles[`provider_${p.id}`]} ${provider === p.id ? styles.providerActive : ""}`}
            >
              <ProviderIcon id={p.id} />
              <div>
                <div className={styles.providerName}>{p.label}</div>
                <div className={styles.providerModel}>{p.model}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mode Toggle */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Input mode</div>
        <div className={styles.modeToggle}>
          <button
            onClick={() => {
              setMode("text");
              // reset();
            }}
            className={`${styles.modeBtn} ${mode === "text" ? styles.modeBtnActive : ""}`}
          >
            <PasteTextIcon />
            Paste text
          </button>
          <button
            onClick={() => {
              setMode("pdf");
              // reset();
            }}
            className={`${styles.modeBtn} ${mode === "pdf" ? styles.modeBtnActive : ""}`}
          >
            <UplpoadPdfIcon width="15" height="15" />
            Analyze PDF
          </button>
          <button
            onClick={() => {
              setMode("ats");
              // reset();
            }}
            className={`${styles.modeBtn} ${mode === "ats" ? styles.modeBtnActive : ""}`}
          >
            <AtsIcon height="15" width="15" />
            Check ATS Score
          </button>
        </div>
      </section>

      {/* Input Area */}
      <section className={`${styles.section} ${styles.sectionGrow}`}>
        {mode === "text" ? (
          <>
            <div className={styles.sectionLabel}>Resume text</div>
            <textarea
              className={styles.textarea}
              placeholder="Paste your resume content here. Include work experience, skills, education, and any other relevant information..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isRunning}
            />
            {prompt.length > 0 && (
              <div className={styles.inputMeta}>
                <span>
                  {prompt.split(/\s+/).filter(Boolean).length} words · ~
                  {Math.ceil(prompt.length / 4)} tokens
                </span>
              </div>
            )}
          </>
        ) : mode === "pdf" ? (
          <>
            <div className={styles.sectionLabel}>PDF file</div>
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""} ${pdfFile ? styles.dropzoneHasFile : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleDrop(e, "analyze")}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPdfFile(f);
                    reset();
                  }
                }}
              />
              {pdfFile ? (
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>
                    <UplpoadPdfIcon height="24" width="24" />
                  </div>
                  <div>
                    <div className={styles.fileName}>{pdfFile.name}</div>
                    <div className={styles.fileSize}>
                      {(pdfFile.size / 1024).toFixed(1)} KB · Click to change
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.dropzonePrompt}>
                  <div className={styles.dropzoneIconWrap}>
                    <UploadIcon />
                    {isDragging && <div className={styles.dropzonePulse} />}
                  </div>
                  <div className={styles.dropzoneText}>
                    Drop PDF here or click to browse
                  </div>
                  <div className={styles.dropzoneSub}>Max 5MB · PDF only</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <section className={styles.section}>
              <div className={styles.label}>Resume PDF</div>
              <input
                ref={atsFileRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setAtsFile(f);
                    reset();
                  }
                }}
              />
              <div
                className={`${styles.dropzone} ${atsFile ? styles.dropzoneHasFile : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, "checkAts")}
                onClick={() => atsFileRef.current?.click()}
              >
                {atsFile ? (
                  <div className={styles.fileInfo}>
                    <div className={styles.fileIcon}>
                      <UplpoadPdfIcon height="24" width="24" />
                    </div>
                    <div>
                      <div className={styles.fileName}>{atsFile.name}</div>
                      <div className={styles.fileSize}>
                        {(atsFile.size / 1024).toFixed(1)} KB · Click to change
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.dropzonePrompt}>
                    <div className={styles.uploadIcon}>
                      <UploadIcon />
                    </div>
                    <div className={styles.dropzoneText}>
                      Drop PDF here or click to browse
                    </div>
                    <div className={styles.dropzoneSub}>Max 5MB · PDF only</div>
                  </div>
                )}
              </div>
            </section>

            {/* Job Description — optional */}
            <section className={styles.section}>
              <div className={styles.labelRow}>
                <div className={styles.label}>Job Description</div>
                <span className={styles.optional}>optional</span>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="Paste the job description here for a more accurate keyword match score. Leave blank for a general ATS evaluation."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isRunning}
              />
              <div className={styles.inputMeta}>
                {jobDescription
                  ? "Score will be weighted against this JD's keywords"
                  : "General ATS criteria will be used"}
              </div>
            </section>
          </>
        )}
      </section>

      {/* CTA */}
      <section className={styles.section}>
        {isRunning ? (
          <button
            onClick={() => {
              abortRef.current?.abort();
              setStatus("idle");
            }}
            className={styles.btnStop}
          >
            <div className={styles.stopDot} />
            Stop generating
          </button>
        ) : (
          <button
            onClick={
              mode === "text"
                ? handleStream
                : mode === "pdf"
                  ? handlePdfAnalyze
                  : handleAtsScore
            }
            disabled={mode === "text" ? !prompt.trim() : mode==="pdf" ? !pdfFile : !atsFile}
            className={styles.btnAnalyze}
          >
            <SearchIcon />
            {mode === "text"
              ? "Analyze (streaming)"
              : mode === "pdf"
                ? "Analyze PDF"
                : "Get ATS Score"}
          </button>
        )}
      </section>

      <section className={styles.section}>
        <button
          onClick={() => {
            reset();
            setPrompt("");
          }}
          disabled={status === "idle"}
          className={styles.btnReset}
        >
          <ResetIcon />
          Reset
        </button>
      </section>
    </div>
  );
};

export default LeftPanel;
