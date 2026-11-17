export interface NarrativeResult {
  text: string;
  sections: Record<string, string>;
  warnings: string[];
  statistics: {
    wordCount: number;
    paragraphCount: number;
  };
  qualityScore: number;
}

export interface NarrativeContext {
  schoolName: string;
  principal: string;
  academicYear: string;
  vision: string;
  mission: string;
  goals: string;
  programCount: number;
  activityCount: number;
  budget: string;
  achievement: string;
  customData: Record<string, any>;
}

export interface NarrativeTemplate {
  id: string;
  name: string;
  content: string;
}
