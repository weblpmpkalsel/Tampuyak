import { IASTNode, ASTNodeType, ASTNodeMetadata, ASTNodeSource, ASTNodePosition } from './ASTTypes';
import { ASTNode } from './ASTNode';
import { generateId } from './ASTUtilities';

export class ASTBuilder {
  private baseMetadata: ASTNodeMetadata;

  constructor(metadata: Partial<ASTNodeMetadata> = {}) {
    this.baseMetadata = {
      engineVersion: metadata.engineVersion || '1.0',
      templateVersion: metadata.templateVersion || '1.0',
      academicYear: metadata.academicYear || '2024/2025',
      language: metadata.language || 'id-ID',
      generatedAt: metadata.generatedAt || Date.now(),
      generator: metadata.generator || 'ASTBuilder',
      quality: metadata.quality !== undefined ? metadata.quality : 1.0,
      ...metadata
    };
  }

  public createNode(
    type: ASTNodeType,
    source: ASTNodeSource,
    position: ASTNodePosition = {},
    value?: any,
    children: IASTNode[] = [],
    id?: string,
    parentId?: string
  ): ASTNode {
    return new ASTNode({
      id: id || generateId(type),
      type,
      children,
      metadata: { ...this.baseMetadata },
      source,
      position,
      parentId,
      value
    });
  }

  public buildRoot(children: IASTNode[] = [], source: ASTNodeSource = { origin: 'system' }): ASTNode {
    const root = this.createNode(ASTNodeType.ROOT, source, {}, null, children);
    return this.bindParents(root);
  }

  public buildDocument(children: IASTNode[] = [], source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.DOCUMENT, source, {}, null, children);
  }

  public buildChapter(children: IASTNode[] = [], position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.CHAPTER, source, position, null, children);
  }

  public buildSection(children: IASTNode[] = [], position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.SECTION, source, position, null, children);
  }

  public buildParagraph(children: IASTNode[] = [], position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.PARAGRAPH, source, position, null, children);
  }

  public buildSentence(children: IASTNode[] = [], position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.SENTENCE, source, position, null, children);
  }

  public buildText(text: string, position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.TEXT, source, position, text);
  }

  public buildVariable(name: string, position: ASTNodePosition = {}, source: ASTNodeSource = { origin: 'system' }): ASTNode {
    return this.createNode(ASTNodeType.VARIABLE, source, position, name);
  }

  public bindParents(node: ASTNode): ASTNode {
    if (!node.children || node.children.length === 0) {
      return node;
    }
    const boundChildren = node.children.map(child => {
      const c = child as unknown as ASTNode;
      const cBound = this.bindParents(c);
      return cBound.cloneWithParent(node.id);
    });
    return node.cloneWithChildren(boundChildren);
  }
}
