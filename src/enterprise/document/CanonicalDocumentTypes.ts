/**
 * Defines the structural hierarchy of the Enterprise Canonical Document Model.
 * Hierarchy: CanonicalDocument -> Section -> Block -> Node
 * 
 * Enforces Architectural Rules:
 * - Enterprise Rule 044: The model must remain document agnostic.
 * - Enterprise Rule 048: No presentation attributes. No HTML. No CSS. No Tailwind. No PDF/print properties.
 * - Enterprise Rule 049: Every document node shall have a stable identifier.
 * - Enterprise Rule 050: Canonical Document is immutable. (Enforced via Deep Readonly).
 */

export interface DocumentTeamMember {
  readonly name: string;
  readonly role: string;
  readonly identifier?: string;
}

export interface CanonicalDocumentMetadata {
  readonly documentId: string;
  readonly title: string;
  readonly version: string;
  readonly createdAt: string;
  readonly draftingTeam?: readonly DocumentTeamMember[];
}

export interface CanonicalDocument {
  readonly id: string; // Rule 049
  readonly metadata: CanonicalDocumentMetadata;
  readonly sections: readonly DocumentSection[];
}

export interface DocumentSection {
  readonly id: string; // Rule 049
  readonly chapterId: string;
  readonly title: string;
  readonly orientation?: 'portrait' | 'landscape';
  readonly blocks: readonly DocumentBlock[];
}

export type BlockType = 
  | 'HEADING'
  | 'PARAGRAPH'
  | 'TABLE'
  | 'LIST'
  | 'IMAGE'
  | 'ATTACHMENT'
  | 'CONTAINER'
  | 'PAGE_BREAK'
  | 'TIMELINE'
  | 'CALENDAR_GRID';

export interface BaseBlock {
  readonly id: string; // Rule 049
  readonly type: BlockType;
  readonly layoutStyle?: string;
}

export interface PageBreakBlock extends BaseBlock {
  readonly type: 'PAGE_BREAK';
}

export interface HeadingBlock extends BaseBlock {
  readonly type: 'HEADING';
  readonly level: number; // Semantic level only, e.g., 1-6. Not a presentation size.
  readonly nodes: readonly DocumentNode[];
}

export interface ParagraphBlock extends BaseBlock {
  readonly type: 'PARAGRAPH';
  readonly nodes: readonly DocumentNode[];
}

export interface TableBlock extends BaseBlock {
  readonly type: 'TABLE';
  readonly columnStrategy?: 'auto' | 'proportional' | 'fixed';
  readonly columnWidths?: readonly string[];
  readonly head: readonly TableRowNode[];
  readonly body: readonly TableRowNode[];
}

export interface ListBlock extends BaseBlock {
  readonly type: 'LIST';
  readonly ordered: boolean;
  readonly items: readonly ListItemNode[];
}

export interface ImageBlock extends BaseBlock {
  readonly type: 'IMAGE';
  readonly url: string;
  readonly altText: string;
}

export interface AttachmentBlock extends BaseBlock {
  readonly type: 'ATTACHMENT';
  readonly uri: string;
  readonly filename: string;
  readonly mimeType: string;
}

export interface ContainerBlock extends BaseBlock {
  readonly type: 'CONTAINER';
  readonly blocks: readonly DocumentBlock[];
}

export interface TimelineBlock extends BaseBlock {
  readonly type: 'TIMELINE';
  readonly items: readonly TimelineItemNode[];
}

export interface CalendarGridBlock extends BaseBlock {
  readonly type: 'CALENDAR_GRID';
  readonly academicYear: string;
  readonly events: readonly any[]; // Will cast to CalendarEvent in renderer
}

export type DocumentBlock = 
  | HeadingBlock
  | ParagraphBlock
  | TableBlock
  | ListBlock
  | ImageBlock
  | AttachmentBlock
  | ContainerBlock
  | PageBreakBlock
  | TimelineBlock
  | CalendarGridBlock;

// Node Definitions
export type NodeType = 'TEXT' | 'LINK' | 'TABLE_ROW' | 'TABLE_CELL' | 'LIST_ITEM' | 'TIMELINE_ITEM';

export interface BaseNode {
  readonly id: string; // Rule 049
  readonly type: NodeType;
}

export interface TextNode extends BaseNode {
  readonly type: 'TEXT';
  readonly text: string;
}

export interface LinkNode extends BaseNode {
  readonly type: 'LINK';
  readonly url: string;
  readonly nodes: readonly DocumentNode[];
}

export interface TableRowNode extends BaseNode {
  readonly type: 'TABLE_ROW';
  readonly cells: readonly TableCellNode[];
}

export interface TableCellNode extends BaseNode {
  readonly type: 'TABLE_CELL';
  readonly nodes: readonly DocumentNode[];
  readonly colSpan?: number;
  readonly rowSpan?: number;
}

export interface ListItemNode extends BaseNode {
  readonly type: 'LIST_ITEM';
  readonly nodes: readonly DocumentNode[]; // Can contain text, nested blocks/nodes, etc.
}

export interface TimelineItemNode extends BaseNode {
  readonly type: 'TIMELINE_ITEM';
  readonly start: string;
  readonly end?: string;
  readonly label: string;
  readonly description?: string;
  readonly itemStyle?: string;
  readonly metadata?: any;
}

export type DocumentNode = 
  | TextNode 
  | LinkNode 
  | TableRowNode 
  | TableCellNode 
  | ListItemNode
  | TimelineItemNode;
