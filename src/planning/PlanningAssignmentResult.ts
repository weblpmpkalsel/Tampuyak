import { PlanningAssignment } from './PlanningAssignment';

export interface PlanningAssignmentResult {
  success: boolean;
  assignment?: PlanningAssignment;
  errors?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
}
