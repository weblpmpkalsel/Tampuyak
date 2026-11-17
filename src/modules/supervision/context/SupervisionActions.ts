import { 
  SupervisionPlan, 
  SupervisionSchedule, 
  Observation, 
  Reflection, 
  CoachingSession, 
  Evidence, 
  Recommendation, 
  FollowUp 
} from '../types/SupervisionTypes';

export type SupervisionAction =
  | { type: 'SET_PLANS'; payload: readonly SupervisionPlan[] }
  | { type: 'SET_ACTIVE_PLAN'; payload: string | null }
  | { type: 'SET_SCHEDULES'; payload: readonly SupervisionSchedule[] }
  | { type: 'SET_OBSERVATION'; payload: Observation | null }
  | { type: 'SET_EVIDENCES'; payload: readonly Evidence[] }
  | { type: 'SET_REFLECTION'; payload: Reflection | null }
  | { type: 'SET_COACHING'; payload: CoachingSession | null }
  | { type: 'SET_RECOMMENDATIONS'; payload: readonly Recommendation[] }
  | { type: 'SET_FOLLOW_UPS'; payload: readonly FollowUp[] }
  | { type: 'SET_LOADING'; payload: { key: keyof import('../state/SupervisionState').LoadingState; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof import('../state/SupervisionState').ErrorState; value: any } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SELECTION'; payload: { key: keyof import('../state/SupervisionState').SelectionState; value: string | null } }
  | { type: 'UPDATE_DRAFT'; payload: { key: keyof import('../state/SupervisionState').DraftState; value: any } }
  | { type: 'CLEAR_DRAFTS' }
  | { type: 'SET_ATTACHMENT_QUEUE'; payload: import('../state/SupervisionState').AttachmentState['uploadQueue'] }
  | { type: 'SET_MONITORING_FILTER'; payload: Partial<import('../state/SupervisionState').MonitoringState> }
  | { type: 'RESET_STATE' };
