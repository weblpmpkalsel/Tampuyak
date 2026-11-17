import { SupervisionRootState } from '../state/SupervisionState';
import { SupervisionAction } from './SupervisionActions';

export const initialSupervisionState: SupervisionRootState = {
  plans: { plans: [], currentActivePlanId: null },
  schedules: { schedules: [] },
  observations: { currentObservation: null, relatedEvidences: [], reflection: null, coaching: null },
  recommendations: { recommendations: [], followUps: [] },
  selection: { selectedPlanId: null, selectedScheduleId: null, selectedRubricItemId: null },
  loading: { isFetchingPlans: false, isFetchingSchedules: false, isSavingObservation: false, isExportingReport: false },
  error: { globalError: null, syncError: null, validationErrors: {} },
  draft: { observationDraft: null, planDraft: null, instrumentDraft: null },
  attachments: { uploadQueue: [] },
  monitoring: { filterStatus: 'ALL', searchQuery: '' }
};

export function supervisionReducer(state: SupervisionRootState, action: SupervisionAction): SupervisionRootState {
  switch (action.type) {
    case 'SET_PLANS':
      return { ...state, plans: { ...state.plans, plans: action.payload } };
    case 'SET_ACTIVE_PLAN':
      return { ...state, plans: { ...state.plans, currentActivePlanId: action.payload } };
    case 'SET_SCHEDULES':
      return { ...state, schedules: { schedules: action.payload } };
    case 'SET_OBSERVATION':
      return { ...state, observations: { ...state.observations, currentObservation: action.payload } };
    case 'SET_EVIDENCES':
      return { ...state, observations: { ...state.observations, relatedEvidences: action.payload } };
    case 'SET_REFLECTION':
      return { ...state, observations: { ...state.observations, reflection: action.payload } };
    case 'SET_COACHING':
      return { ...state, observations: { ...state.observations, coaching: action.payload } };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: { ...state.recommendations, recommendations: action.payload } };
    case 'SET_FOLLOW_UPS':
      return { ...state, recommendations: { ...state.recommendations, followUps: action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } };
    case 'SET_ERROR':
      return { ...state, error: { ...state.error, [action.payload.key]: action.payload.value } };
    case 'CLEAR_ERRORS':
      return { ...state, error: initialSupervisionState.error };
    case 'SET_SELECTION':
      return { ...state, selection: { ...state.selection, [action.payload.key]: action.payload.value } };
    case 'UPDATE_DRAFT':
      return { ...state, draft: { ...state.draft, [action.payload.key]: action.payload.value } };
    case 'CLEAR_DRAFTS':
      return { ...state, draft: initialSupervisionState.draft };
    case 'SET_ATTACHMENT_QUEUE':
      return { ...state, attachments: { uploadQueue: action.payload } };
    case 'SET_MONITORING_FILTER':
      return { ...state, monitoring: { ...state.monitoring, ...action.payload } };
    case 'RESET_STATE':
      return initialSupervisionState;
    default:
      return state;
  }
}
