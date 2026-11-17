import { ReferenceRequest } from './ReferenceTypes';

export class ReferenceMapper {
  /**
   * Maps a planning activity into a normalized reference request.
   */
  public static mapToRequest(planningActivity: any, year: number): ReferenceRequest {
    return {
      activityId: this.normalizeString(planningActivity?.id),
      activityCode: this.normalizeString(planningActivity?.kode),
      activityName: this.normalizeString(planningActivity?.nama || planningActivity?.name),
      year: year,
      originalPayload: planningActivity
    };
  }

  private static normalizeString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).trim();
  }
}
