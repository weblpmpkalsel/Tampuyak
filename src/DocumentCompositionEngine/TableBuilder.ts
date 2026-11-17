import { CanonicalObject } from '../SPKG';
import { sanitizeAndSummarize } from './utils';

export class TableBuilder {
  public buildIRBTable(nodes: CanonicalObject[]): any[] {
    return nodes.map(n => ({
      title: sanitizeAndSummarize(n.title, 15),
      id: n.id,
      data: {
        identification: sanitizeAndSummarize(n.data?.identification, 15),
        reflection: sanitizeAndSummarize(n.data?.reflection, 20),
        improvement: sanitizeAndSummarize(n.data?.improvement, 25),
        responsible: sanitizeAndSummarize(n.data?.responsible, 15),
        expectedResult: sanitizeAndSummarize(n.data?.expectedResult, 20),
      }
    }));
  }

  public buildBudgetTable(nodes: CanonicalObject[]): any[] {
    return nodes.map(b => ({
      title: sanitizeAndSummarize(b.title, 15),
      amount: b.data?.amount || 0
    }));
  }

  public buildProgramActivityTable(programs: CanonicalObject[], activities: CanonicalObject[]): any[] {
    return programs.map(p => {
      const pActivities = activities.filter(a => a.parentId === p.id);
      return {
        program: sanitizeAndSummarize(p.title, 15),
        description: sanitizeAndSummarize(p.description, 15),
        activities: pActivities.map(a => ({
          title: sanitizeAndSummarize(a.title, 20),
          description: sanitizeAndSummarize(a.description, 20),
          data: a.data
        }))
      };
    });
  }
}
