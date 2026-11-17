import { SupervisionRootState, DerivedSupervisionState } from '../state/SupervisionState';
import { SupervisionStatus } from '../types/SupervisionTypes';

export const selectDerivedState = (state: SupervisionRootState): DerivedSupervisionState => {
  const schedules = state.schedules.schedules;
  
  const completedSchedules = schedules.filter(s => s.status === SupervisionStatus.COMPLETED);
  const completionPercentage = schedules.length === 0 ? 0 : (completedSchedules.length / schedules.length) * 100;
  
  const isReadyForRecommendation = schedules.length > 0 && completedSchedules.length === schedules.length;

  const now = Date.now();
  const upcomingSchedules = schedules.filter(s => s.scheduledDate > now && s.status === SupervisionStatus.SCHEDULED);

  return {
    completionPercentage,
    isReadyForRecommendation,
    upcomingSchedules
  };
};

export const selectActivePlan = (state: SupervisionRootState) => {
  return state.plans.plans.find(p => p.id === state.plans.currentActivePlanId) || null;
};
