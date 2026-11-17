import { IASTNode, ASTNodeType, ASTNodeMetadata, ASTNodeSource, ASTNodePosition } from './ASTTypes';

export class ASTNode implements IASTNode {
  public readonly id: string;
  public readonly type: ASTNodeType;
  public readonly children: IASTNode[];
  public readonly metadata: Readonly<ASTNodeMetadata>;
  public readonly source: Readonly<ASTNodeSource>;
  public readonly position: Readonly<ASTNodePosition>;
  public readonly parentId?: string;
  public readonly createdAt: number;
  public readonly version: string;
  public readonly value?: any;

  constructor(params: {
    id: string;
    type: ASTNodeType;
    children?: IASTNode[];
    metadata: ASTNodeMetadata;
    source: ASTNodeSource;
    position: ASTNodePosition;
    parentId?: string;
    version?: string;
    value?: any;
    createdAt?: number;
  }) {
    this.id = params.id;
    this.type = params.type;
    this.children = [...(params.children || [])];
    this.metadata = Object.freeze({ ...params.metadata });
    this.source = Object.freeze({ ...params.source });
    this.position = Object.freeze({ ...params.position });
    this.parentId = params.parentId;
    this.createdAt = params.createdAt || Date.now();
    this.version = params.version || '1.0';
    this.value = params.value;
    
    Object.freeze(this);
  }

  public cloneWithChildren(newChildren: IASTNode[]): ASTNode {
    return new ASTNode({
      id: this.id,
      type: this.type,
      children: newChildren,
      metadata: { ...this.metadata },
      source: { ...this.source },
      position: { ...this.position },
      parentId: this.parentId,
      version: this.version,
      value: this.value,
      createdAt: this.createdAt
    });
  }

  public cloneWithParent(newParentId: string): ASTNode {
    return new ASTNode({
      id: this.id,
      type: this.type,
      children: [...this.children],
      metadata: { ...this.metadata },
      source: { ...this.source },
      position: { ...this.position },
      parentId: newParentId,
      version: this.version,
      value: this.value,
      createdAt: this.createdAt
    });
  }
}
