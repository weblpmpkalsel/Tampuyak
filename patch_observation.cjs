const fs = require('fs');
const file = 'src/modules/supervision/types/SupervisionTypes.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface ObservationSession {
  id: string;
  supervisionId: string;
  startTime: number;
  endTime?: number;
  className: string;
  subjectName: string;
  studentCount: number;
}`,
  `export interface ObservationSession {
  id: string;
  supervisionId: string;
  teacherSnapshot: TeacherSnapshot;
  instrumentSnapshot: SupervisionInstrument;
  startTime: number;
  endTime?: number;
  className?: string;
  subjectName?: string;
  studentCount?: number;
}`
);

code = code.replace(
  `export interface Observation {
  id: string;
  supervisionId: string;
  session: ObservationSession;
  scores: ObservationScore[];
  notes: ObservationNote[];
  evidences: Evidence[];
  finalScoreCategory: SupervisionScoreCategory;
  status: ObservationStatus;
  completedAt?: number;
}`,
  `export interface Observation {
  id: string;
  supervisionId: string;
  session: ObservationSession;
  scores: ObservationScore[];
  notes: ObservationNote[];
  evidences: Evidence[];
  finalScoreCategory: SupervisionScoreCategory | null;
  status: ObservationStatus;
  completedAt?: number;
}`
);

fs.writeFileSync(file, code);
