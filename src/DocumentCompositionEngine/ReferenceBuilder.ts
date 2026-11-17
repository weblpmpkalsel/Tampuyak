import { CanonicalObject } from '../SPKG';

export class ReferenceBuilder {
  public extractReferences(nodes: CanonicalObject[]): string[] {
    return nodes.map(node => node.id).filter(id => id && id.trim() !== '');
  }

  public extractReferencesFromMultiple(...nodeArrays: (CanonicalObject | null)[]): string[] {
    const references: string[] = [];
    nodeArrays.forEach(item => {
      if (item) references.push(item.id);
    });
    return references.filter(id => id && id.trim() !== '');
  }
}
