import { KnowledgeRelation } from './KnowledgeRelation';
import { KnowledgeRelationType } from './KnowledgeRelationType';

export class PedagogicalKnowledgeGraph {
  private relations: KnowledgeRelation[] = [];

  constructor(initialRelations: KnowledgeRelation[] = []) {
    this.relations = [...initialRelations];
  }

  public addRelation(relation: KnowledgeRelation): void {
    this.relations.push(relation);
  }

  public getRelationsForSource(sourceId: string): KnowledgeRelation[] {
    return this.relations.filter(r => r.sourceId === sourceId);
  }

  public getRelationsForTarget(targetId: string): KnowledgeRelation[] {
    return this.relations.filter(r => r.targetId === targetId);
  }

  public getRelatedNodes(nodeId: string, relationType?: KnowledgeRelationType): string[] {
    const related = this.relations
      .filter(r => r.sourceId === nodeId && (!relationType || r.relationType === relationType))
      .map(r => r.targetId);
      
    return [...new Set(related)];
  }

  public getAllRelations(): KnowledgeRelation[] {
    return [...this.relations];
  }
}
