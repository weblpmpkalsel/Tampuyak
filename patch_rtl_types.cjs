const fs = require('fs');
const file = 'src/modules/supervision/types/SupervisionTypes.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export interface ActionPlan {
  id: string;
  description: string;
  targetDate: number;
  isCompleted: boolean;
}`,
  `export enum ActionPlanStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  target: string;
  targetDate: number;
  priority: RecommendationPriority;
  status: ActionPlanStatus;
  evidences?: Evidence[];
}`
);

code = code.replace(
  `export interface FollowUp {
  id: string;
  supervisionId: string;
  actionPlans: ActionPlan[];
  createdAt: number;
}`,
  `export interface FollowUp {
  id: string;
  supervisionId: string;
  actionPlans: ActionPlan[];
  createdAt: number;
}`
);

fs.writeFileSync(file, code);
