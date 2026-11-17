import { RKTProjection } from './RKTProjection';
import { RKTContext } from './RKTContext';

export interface RKTProjectionResult {
  context: RKTContext;
  projections: RKTProjection[];
  totalActivities: number;
}
