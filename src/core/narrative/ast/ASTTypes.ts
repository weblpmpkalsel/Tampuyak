export enum ASTNodeType {
  ROOT = 'ROOT',
  DOCUMENT = 'DOCUMENT',
  CHAPTER = 'CHAPTER',
  SECTION = 'SECTION',
  SUB_SECTION = 'SUB_SECTION',
  PARAGRAPH = 'PARAGRAPH',
  SENTENCE = 'SENTENCE',
  TEXT = 'TEXT',
  VARIABLE = 'VARIABLE',
  LIST = 'LIST',
  TABLE = 'TABLE',
  STATISTIC = 'STATISTIC',
  SUMMARY = 'SUMMARY',
  METADATA = 'METADATA'
}

export interface ASTNodePosition {
  chapter?: number;
  section?: number;
  paragraph?: number;
  sentence?: number;
  line?: number;
}

export interface ASTNodeMetadata {
  engineVersion: string;
  templateVersion: string;
  academicYear: string;
  language: string;
  generatedAt: number;
  generator: string;
  quality: number;
  [key: string]: any;
}

export interface ASTNodeSource {
  origin: string; // e.g., 'KnowledgeGraph', 'PlanningSnapshot', 'SchoolProfile', 'BusinessRules', 'Recommendations'
  referenceId?: string;
  context?: any;
}

export interface IASTNode {
  readonly id: string;
  readonly type: ASTNodeType;
  readonly children: IASTNode[];
  readonly metadata: ASTNodeMetadata;
  readonly source: ASTNodeSource;
  readonly position: ASTNodePosition;
  readonly parentId?: string;
  readonly createdAt: number;
  readonly version: string;
  readonly value?: any;
}

export interface IASTVisitor<T> {
  visitRoot(node: IASTNode): T;
  visitDocument(node: IASTNode): T;
  visitChapter(node: IASTNode): T;
  visitSection(node: IASTNode): T;
  visitSubSection(node: IASTNode): T;
  visitParagraph(node: IASTNode): T;
  visitSentence(node: IASTNode): T;
  visitText(node: IASTNode): T;
  visitVariable(node: IASTNode): T;
  visitList(node: IASTNode): T;
  visitTable(node: IASTNode): T;
  visitStatistic(node: IASTNode): T;
  visitSummary(node: IASTNode): T;
  visitMetadata(node: IASTNode): T;
}
