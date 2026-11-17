import { ListItemNode, ListBlock } from './src/enterprise/document/CanonicalDocumentTypes';
const x: ListItemNode = {
  id: '1',
  type: 'LIST_ITEM',
  nodes: [
    {
      id: '2',
      type: 'LIST', // Wait, LIST is BlockType, not NodeType
      ordered: false,
      items: []
    } as any
  ]
}
