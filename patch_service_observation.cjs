const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface SubmitObservationDTO {
  supervisionId: string;
  startTime: number;
  endTime: number;
  className: string;
  subjectName: string;
  studentCount: number;
  scores: Array<{ rubricItemId: string; score: number }>;
  notes: Array<{ content: string }>;
  evidences: Array<{ type: EvidenceType; url: string; description: string }>;
}`,
  `export interface StartObservationDTO {
  schedule: SupervisionSchedule;
  instrument: SupervisionInstrument;
  className: string;
  subjectName: string;
  studentCount: number;
}

export interface ScoreIndicatorDTO {
  observation: Observation;
  rubricItemId: string;
  score: number;
}

export interface AddObservationNoteDTO {
  observation: Observation;
  content: string;
}

export interface AddEvidenceDTO {
  observation: Observation;
  type: EvidenceType;
  url: string;
  description: string;
}`
);

fs.writeFileSync(file, code);
