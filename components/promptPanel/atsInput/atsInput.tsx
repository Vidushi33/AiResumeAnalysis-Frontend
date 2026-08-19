"use client";

import { useRef } from "react";
import styles from "../../../app/page.module.css";
import { Status } from "@/utils/interface";
import {
  ResetIcon,
  SearchIcon,
  UploadIcon,
  UplpoadPdfIcon,
} from "@/public/icons";

interface Props {
  pdfFile: File | null;
  setPdfFile: (value: File | null) => void;
  jobDescription: string;
  setJobDescription: (value: string) => string;
  status: Status;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function AtsInput({
  pdfFile,
  setPdfFile,
  jobDescription,
  setJobDescription,
  status,
  onAnalyze,
  onReset,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRunning = status === "loading";

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      onReset();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      onReset();
    }
  };

  return (
    <div className={styles.wrap}>
      {/* PDF Upload */}
      <section className={styles.section}>
        <div className={styles.label}>Resume PDF</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <div
          className={`${styles.dropzone} ${pdfFile ? styles.dropzoneHasFile : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
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

      {/* Actions */}
      <section className={styles.section}>
        {isRunning ? (
          <button className={styles.btnStop} onClick={onReset}>
            <div className={styles.stopDot} />
            Stop
          </button>
        ) : (
          <button
            className={styles.btnAnalyze}
            onClick={onAnalyze}
            disabled={!pdfFile}
          >
            <SearchIcon />
            Get ATS Score
          </button>
        )}
        <button
          className={styles.btnReset}
          onClick={onReset}
          disabled={status === "idle"}
        >
          <ResetIcon />
          Reset
        </button>
      </section>
    </div>
  );
}
