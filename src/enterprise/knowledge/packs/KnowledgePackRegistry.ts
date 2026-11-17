export interface PackRegistration {
  id: string;
  domain: string;
  loader: () => Promise<any>;
}

export class KnowledgePackRegistry {
  private static packs: Map<string, PackRegistration> = new Map();

  static register(registration: PackRegistration) {
    this.packs.set(registration.id, registration);
  }

  static getRegistration(id: string): PackRegistration | undefined {
    return this.packs.get(id);
  }

  static getAllRegistrations(): PackRegistration[] {
    return Array.from(this.packs.values());
  }
}
