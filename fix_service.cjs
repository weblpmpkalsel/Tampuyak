const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionPublishingService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { \n  SupervisionPlan, \n  SupervisionSchedule, \n  Observation, \n  FollowUp \n} from '../types/SupervisionTypes';",
  "import { \n  SupervisionPlan, \n  SupervisionSchedule, \n  Observation, \n  FollowUp, \n  PostObservation\n} from '../types/SupervisionTypes';"
);

code = code.replace(
  "followUps: FollowUp[],",
  "followUps: FollowUp[],\n      postObservations: PostObservation[],"
);

code = code.replace(
  "return this.buildLaporanObservasi(data.schedules, data.observations, data.selectedScheduleId);",
  "return this.buildLaporanObservasi(data.schedules, data.observations, data.selectedScheduleId);"
);

code = code.replace(
  "return this.buildRingkasanCoaching(data.followUps, data.selectedScheduleId);",
  "return this.buildRingkasanCoaching(data.postObservations, data.selectedScheduleId);"
);

code = code.replace(
  "schedule.subject",
  "obs.session.subjectName"
);
code = code.replace(
  "schedule.className",
  "obs.session.className"
);
code = code.replace(
  "schedule.subject",
  "obs.session.subjectName"
);
code = code.replace(
  "schedule.className",
  "obs.session.className"
);

code = code.replace(
  "private buildRingkasanCoaching(followUps: FollowUp[], scheduleId?: string): string {",
  "private buildRingkasanCoaching(postObservations: PostObservation[], scheduleId?: string): string {"
);
code = code.replace(
  "const fu = followUps.find(f => f.supervisionId === scheduleId);\n    if (!fu || !fu.coachingSession) {",
  "const fu = postObservations.find(f => f.supervisionId === scheduleId);\n    if (!fu || !fu.coaching) {"
);
code = code.replace(
  "const cs = fu.coachingSession;",
  "const cs = fu.coaching;"
);
code = code.replace(
  "cs.scheduledDate",
  "(cs.conductedAt || Date.now())"
);
code = code.replace(
  "cs.focusArea",
  "'-'"
);
code = code.replace(
  "cs.notes",
  "cs.assessorNotes"
);
code = code.replace(
  "cs.agreedCommitments",
  "cs.agreedCommitment"
);

code = code.replace(
  "ap.strategy",
  "ap.title"
);
code = code.replace(
  "ap.resourceNeeded",
  "ap.expectedEvidence"
);

// For rekap program and rekap guru, where we iterate schedules and don't have direct access to obs easily
code = code.replace(
  "s.subject} - ${s.className",
  "'-' /* subject from obs */"
);
code = code.replace(
  "s.subject} - ${s.className",
  "'-' /* subject from obs */"
);

fs.writeFileSync(file, code);
