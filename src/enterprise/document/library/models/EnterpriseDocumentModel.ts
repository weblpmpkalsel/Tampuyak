import { EnterpriseDocumentProps, DocumentStatus, DocumentSource, ReferencedBy } from '../types/EnterpriseDocumentTypes';

export class EnterpriseDocumentModel {
  private readonly props: EnterpriseDocumentProps;

  constructor(props: EnterpriseDocumentProps) {
    this.props = Object.freeze({ ...props, referencedBy: [...props.referencedBy] });
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get category(): string { return this.props.category; }
  get knowledgeDomain(): string { return this.props.knowledgeDomain; }
  get academicYear(): string { return this.props.academicYear; }
  get owner(): string { return this.props.owner; }
  get status(): DocumentStatus { return this.props.status; }
  get version(): number { return this.props.version; }
  get source(): DocumentSource { return this.props.source; }
  get description(): string | undefined { return this.props.description; }
  get referencedBy(): ReadonlyArray<ReferencedBy> { return this.props.referencedBy; }
  get createdAt(): number { return this.props.createdAt; }
  get updatedAt(): number { return this.props.updatedAt; }
  get referenceCount(): number { return this.props.referencedBy.length; }
  get content(): Record<string, any> | undefined { return this.props.content; }

  public toJSON(): EnterpriseDocumentProps {
    return { ...this.props, referencedBy: [...this.props.referencedBy] };
  }

  public cloneWith(updates: Partial<EnterpriseDocumentProps>): EnterpriseDocumentModel {
    return new EnterpriseDocumentModel({
      ...this.props,
      ...updates,
      updatedAt: Date.now(),
    });
  }
}
