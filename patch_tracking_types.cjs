const fs = require('fs');
const file = 'src/modules/supervision/types/SupervisionTypes.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("TRACKING_ACTIVE")) {
  code = code.replace(
    "REVISION_NEEDED = 'REVISION_NEEDED'",
    "REVISION_NEEDED = 'REVISION_NEEDED',\n  TRACKING_ACTIVE = 'TRACKING_ACTIVE',\n  FOLLOW_UP_REVIEW = 'FOLLOW_UP_REVIEW',\n  TRACKING_COMPLETED = 'TRACKING_COMPLETED'"
  );
}

if (!code.includes("TrackingLog")) {
  const trackingLogType = `
export interface TrackingLog {
  id: string;
  date: number;
  type: 'SUPERVISOR_MONITORING' | 'TEACHER_PROGRESS';
  notes: string;
  evidenceUrl?: string;
  nextReviewDate?: number;
}
`;
  code = code.replace(
    "export interface ActionPlan {",
    trackingLogType + "\nexport interface ActionPlan {"
  );
}

if (!code.includes("trackingLogs?:")) {
  code = code.replace(
    "evidences?: Evidence[];",
    "evidences?: Evidence[];\n  trackingLogs?: TrackingLog[];"
  );
}

fs.writeFileSync(file, code);
