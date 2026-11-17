import { IEnterpriseDocumentRepository, InMemoryEnterpriseDocumentRepository } from '../repository/EnterpriseDocumentRepository';

export class EnterpriseDocumentRegistry {
  private static instance: EnterpriseDocumentRegistry;
  private repository: IEnterpriseDocumentRepository;

  private constructor() {
    this.repository = new InMemoryEnterpriseDocumentRepository();
  }

  public static getInstance(): EnterpriseDocumentRegistry {
    if (!EnterpriseDocumentRegistry.instance) {
      EnterpriseDocumentRegistry.instance = new EnterpriseDocumentRegistry();
    }
    return EnterpriseDocumentRegistry.instance;
  }

  public getRepository(): IEnterpriseDocumentRepository {
    return this.repository;
  }

  public setRepository(repository: IEnterpriseDocumentRepository): void {
    this.repository = repository;
  }
}
