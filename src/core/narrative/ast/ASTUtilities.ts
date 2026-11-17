export function generateId(prefix: string): string {
  return `${prefix.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
}

export function isTextNode(node: any): boolean {
  return node && node.type === 'TEXT';
}

export function isVariableNode(node: any): boolean {
  return node && node.type === 'VARIABLE';
}
