export function generateIssueId(ruleId: string): string {
  return `issue-${ruleId}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
}
