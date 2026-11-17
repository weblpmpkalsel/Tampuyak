import { IASTNode, IASTVisitor, ASTNodeType } from './ASTTypes';

export abstract class BaseASTVisitor<T> implements IASTVisitor<T> {
  public visit(node: IASTNode): T {
    switch (node.type) {
      case ASTNodeType.ROOT: return this.visitRoot(node);
      case ASTNodeType.DOCUMENT: return this.visitDocument(node);
      case ASTNodeType.CHAPTER: return this.visitChapter(node);
      case ASTNodeType.SECTION: return this.visitSection(node);
      case ASTNodeType.SUB_SECTION: return this.visitSubSection(node);
      case ASTNodeType.PARAGRAPH: return this.visitParagraph(node);
      case ASTNodeType.SENTENCE: return this.visitSentence(node);
      case ASTNodeType.TEXT: return this.visitText(node);
      case ASTNodeType.VARIABLE: return this.visitVariable(node);
      case ASTNodeType.LIST: return this.visitList(node);
      case ASTNodeType.TABLE: return this.visitTable(node);
      case ASTNodeType.STATISTIC: return this.visitStatistic(node);
      case ASTNodeType.SUMMARY: return this.visitSummary(node);
      case ASTNodeType.METADATA: return this.visitMetadata(node);
      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  abstract visitRoot(node: IASTNode): T;
  abstract visitDocument(node: IASTNode): T;
  abstract visitChapter(node: IASTNode): T;
  abstract visitSection(node: IASTNode): T;
  abstract visitSubSection(node: IASTNode): T;
  abstract visitParagraph(node: IASTNode): T;
  abstract visitSentence(node: IASTNode): T;
  abstract visitText(node: IASTNode): T;
  abstract visitVariable(node: IASTNode): T;
  abstract visitList(node: IASTNode): T;
  abstract visitTable(node: IASTNode): T;
  abstract visitStatistic(node: IASTNode): T;
  abstract visitSummary(node: IASTNode): T;
  abstract visitMetadata(node: IASTNode): T;
}

export class TextRenderVisitor extends BaseASTVisitor<string> {
  visitRoot(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n');
  }
  visitDocument(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n');
  }
  visitChapter(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n\n');
  }
  visitSection(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n\n');
  }
  visitSubSection(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n\n');
  }
  visitParagraph(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join(' ') + '\n';
  }
  visitSentence(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('');
  }
  visitText(node: IASTNode): string {
    return node.value || '';
  }
  visitVariable(node: IASTNode): string {
    return `{{${node.value}}}`;
  }
  visitList(node: IASTNode): string {
    return node.children.map(c => `- ${this.visit(c)}`).join('\n');
  }
  visitTable(node: IASTNode): string {
    return '[Table]';
  }
  visitStatistic(node: IASTNode): string {
    return String(node.value || '');
  }
  visitSummary(node: IASTNode): string {
    return node.children.map(c => this.visit(c)).join('\n');
  }
  visitMetadata(node: IASTNode): string {
    return '';
  }
}
