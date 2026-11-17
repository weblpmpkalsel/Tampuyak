import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { EnterpriseDocumentProps } from '../types/EnterpriseDocumentTypes';

export interface IEnterpriseDocumentRepository {
  save(document: EnterpriseDocumentModel): Promise<void>;
  findById(id: string): Promise<EnterpriseDocumentModel | null>;
  findAll(): Promise<EnterpriseDocumentModel[]>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryEnterpriseDocumentRepository implements IEnterpriseDocumentRepository {
  private documents: Map<string, EnterpriseDocumentProps> = new Map();

  async save(document: EnterpriseDocumentModel): Promise<void> {
    this.documents.set(document.id, document.toJSON());
  }

  async findById(id: string): Promise<EnterpriseDocumentModel | null> {
    const data = this.documents.get(id);
    return data ? new EnterpriseDocumentModel(data) : null;
  }

  async findAll(): Promise<EnterpriseDocumentModel[]> {
    return Array.from(this.documents.values()).map(data => new EnterpriseDocumentModel(data));
  }

  async delete(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }
}
