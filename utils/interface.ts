export type Provider = "openai" | "gemini" | "claude";
export type Mode = "text" | "pdf" | "ats";
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


export interface AtsBreakdownItem {
  score: number;
  comment: string;
}
 
export interface AtsAnalysis {
  overallScore: number;
  breakdown: {
    keywordRelevance: AtsBreakdownItem;
    measurableAchievements: AtsBreakdownItem;
    sectionStructure: AtsBreakdownItem;
    skillsCompleteness: AtsBreakdownItem;
    jobTitleAlignment: AtsBreakdownItem;
  };
  improvements: string[];
  strengths: string[];
  missingKeywords: string[];
}
 
