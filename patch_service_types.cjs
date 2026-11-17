const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let code = fs.readFileSync(file, 'utf8');

// Add TrackingLog to imports if missing
if (!code.includes("TrackingLog")) {
  code = code.replace(
    "  FollowUp,",
    "  FollowUp,\n  TrackingLog,"
  );
}

const newDTOs = `
export interface StartTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
}

export interface UpdateTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
  notes: string;
  evidenceUrl?: string;
}

export interface ScheduleFollowUpReviewDTO {
  followUp: FollowUp;
  actionPlanId: string;
  notes: string;
  nextReviewDate: number;
}

export interface CompleteTrackingDTO {
  followUp: FollowUp;
  actionPlanId: string;
}
`;

if (!code.includes("StartTrackingDTO")) {
  code = code.replace(
    "export class SupervisionApplicationService {",
    newDTOs + "\nexport class SupervisionApplicationService {"
  );
}

fs.writeFileSync(file, code);
