import { NarrativeContext } from './NarrativeTypes';
import { NarrativeFormatter } from './NarrativeFormatter';

export class NarrativeVariableResolver {
  private formatter: NarrativeFormatter;

  constructor() {
    this.formatter = new NarrativeFormatter();
  }

  resolve(template: string, context: NarrativeContext): string {
    let resolved = template;
    const variables: Record<string, string> = {
      schoolName: context.schoolName,
      principal: context.principal,
      academicYear: context.academicYear,
      vision: context.vision,
      mission: context.mission,
      goals: context.goals,
      programCount: context.programCount.toString(),
      activityCount: context.activityCount.toString(),
      budget: this.formatter.formatCurrency(parseFloat(context.budget) || 0),
      achievement: context.achievement,
      ...context.customData
    };

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      resolved = resolved.replace(regex, value || '');
    }

    return resolved;
  }
}
