import { ProgramContent } from '../models/ProgramKnowledgeModel';
import { EnterpriseDocumentService } from '../../../../document/library/service/EnterpriseDocumentService';
import { EnterpriseDocumentModel } from '../../../../document/library/models/EnterpriseDocumentModel';
import { DocumentSource, DocumentStatus } from '../../../../document/library/types/EnterpriseDocumentTypes';
import { EnterpriseKnowledgeType } from '../../../types/EnterpriseKnowledgeType';

export class ProgramKnowledgeService {
  private documentService: EnterpriseDocumentService;

  constructor() {
    this.documentService = new EnterpriseDocumentService();
  }

  async createDraft(ownerId: string, knowledgeType: EnterpriseKnowledgeType, content: ProgramContent): Promise<EnterpriseDocumentModel> {
    const document = await this.documentService.create({
      title: content.identity.programName || `Untitled ${knowledgeType.displayName}`,
      category: knowledgeType.category,
      knowledgeDomain: knowledgeType.domain,
      academicYear: content.identity.academicYear,
      owner: ownerId,
      status: DocumentStatus.DRAFT,
      source: DocumentSource.GENERATED,
      description: content.identity.description,
      content: content
    });
    return document;
  }

  async save(documentId: string, content: ProgramContent): Promise<EnterpriseDocumentModel> {
    const updatedDocument = await this.documentService.updateMetadata(documentId, {
      title: content.identity.programName,
      academicYear: content.identity.academicYear,
      description: content.identity.description,
      content: content
    });
    return updatedDocument;
  }
}
