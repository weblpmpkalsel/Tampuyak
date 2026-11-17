import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { EnterpriseDocumentRegistry } from '../registry/EnterpriseDocumentRegistry';
import { DocumentStatus, DocumentSource, EnterpriseDocumentProps } from '../types/EnterpriseDocumentTypes';

export class EnterpriseDocumentService {
  private get repository() {
    return EnterpriseDocumentRegistry.getInstance().getRepository();
  }

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  }

  async create(data: Omit<EnterpriseDocumentProps, 'id' | 'createdAt' | 'updatedAt' | 'referencedBy' | 'version'>): Promise<EnterpriseDocumentModel> {
    const now = Date.now();
    const document = new EnterpriseDocumentModel({
      ...data,
      id: this.generateId(),
      version: 1,
      referencedBy: [],
      createdAt: now,
      updatedAt: now,
    });
    await this.repository.save(document);
    return document;
  }

  async updateMetadata(id: string, updates: Partial<Omit<EnterpriseDocumentProps, 'id' | 'createdAt' | 'updatedAt' | 'referencedBy'>>): Promise<EnterpriseDocumentModel> {
    const doc = await this.repository.findById(id);
    if (!doc) throw new Error(`Document with ID ${id} not found.`);
    
    // Auto-increment version on significant updates (simplified for now, ideally depends on update content)
    const updatedDoc = doc.cloneWith({
      ...updates,
      version: doc.version + 1 
    });
    
    await this.repository.save(updatedDoc);
    return updatedDoc;
  }

  async archive(id: string): Promise<EnterpriseDocumentModel> {
    const doc = await this.repository.findById(id);
    if (!doc) throw new Error(`Document with ID ${id} not found.`);

    const archivedDoc = doc.cloneWith({ status: DocumentStatus.ARCHIVED });
    await this.repository.save(archivedDoc);
    return archivedDoc;
  }

  async restore(id: string): Promise<EnterpriseDocumentModel> {
    const doc = await this.repository.findById(id);
    if (!doc) throw new Error(`Document with ID ${id} not found.`);
    if (doc.status !== DocumentStatus.ARCHIVED) return doc;

    const restoredDoc = doc.cloneWith({ status: DocumentStatus.DRAFT }); // Defaulting to Draft on restore
    await this.repository.save(restoredDoc);
    return restoredDoc;
  }

  async find(id: string): Promise<EnterpriseDocumentModel | null> {
    return this.repository.findById(id);
  }

  async list(): Promise<EnterpriseDocumentModel[]> {
    return this.repository.findAll();
  }

  async reference(documentId: string, moduleId: string, referenceContext?: string): Promise<EnterpriseDocumentModel> {
    const doc = await this.repository.findById(documentId);
    if (!doc) throw new Error(`Document with ID ${documentId} not found.`);

    if (doc.referencedBy.some(ref => ref.moduleId === moduleId)) {
        return doc;
    }

    const updatedReferences = [...doc.referencedBy, { moduleId, referenceContext }];
    const updatedDoc = doc.cloneWith({ referencedBy: updatedReferences });
    await this.repository.save(updatedDoc);
    return updatedDoc;
  }

  async dereference(documentId: string, moduleId: string): Promise<EnterpriseDocumentModel> {
    const doc = await this.repository.findById(documentId);
    if (!doc) throw new Error(`Document with ID ${documentId} not found.`);

    const updatedReferences = doc.referencedBy.filter(ref => ref.moduleId !== moduleId);
    const updatedDoc = doc.cloneWith({ referencedBy: updatedReferences });
    await this.repository.save(updatedDoc);
    return updatedDoc;
  }
}
