export type Provider = "openai" | "gemini" | "claude";
export type Mode = "text" | "pdf";
export type Status = "idle" | "loading" | "streaming" | "done" | "error";

export interface ResumeAnalysis {
  isValidResume: boolean;
  summary: string;
  yearsOfExperience: number;
  topSkills: string[];
  strengths: string[];
  redFlags: string[];
  suggestedRoles: string[];
}
