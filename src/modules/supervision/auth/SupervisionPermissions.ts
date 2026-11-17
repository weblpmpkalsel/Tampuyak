export type SupervisionRole = 'HEADMASTER' | 'OPERATOR' | 'SUPERVISOR' | 'ASSESSOR';

export const SUPERVISION_PERMISSIONS = {
  VIEW_TEACHER_RECORD: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Program Management
  MANAGE_PROGRAM: ['HEADMASTER', 'SUPERVISOR'] as SupervisionRole[],
  VIEW_PROGRAM: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR'] as SupervisionRole[],
  
  // Teacher Assignment
  MANAGE_TEACHER_ASSIGNMENT: ['HEADMASTER'] as SupervisionRole[],
  VIEW_TEACHER_ASSIGNMENT: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Instrument Library
  MANAGE_INSTRUMENT: ['HEADMASTER', 'SUPERVISOR'] as SupervisionRole[],
  VIEW_INSTRUMENT: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Scheduling
  MANAGE_SCHEDULE: ['HEADMASTER', 'SUPERVISOR'] as SupervisionRole[],
  VIEW_SCHEDULE: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Pre-Observation
  APPROVE_PRE_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  UPLOAD_PRE_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  VIEW_PRE_OBSERVATION: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Observation
  CONDUCT_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  VIEW_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Post-Observation & Coaching
  CONDUCT_POST_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  ACKNOWLEDGE_POST_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  VIEW_POST_OBSERVATION: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // RTL (Action Plan)
  MANAGE_RTL: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  ACKNOWLEDGE_RTL: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  VIEW_RTL: ['HEADMASTER', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  
  // Dashboards & Analytics
  VIEW_EXECUTIVE_DASHBOARD: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[],
  VIEW_ANALYTICS: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR'] as SupervisionRole[],
  
  // Publishing & Export
  PUBLISH_REPORT: ['HEADMASTER', 'SUPERVISOR'] as SupervisionRole[],
  EXPORT_REPORT: ['HEADMASTER', 'OPERATOR', 'SUPERVISOR', 'ASSESSOR'] as SupervisionRole[]
};
