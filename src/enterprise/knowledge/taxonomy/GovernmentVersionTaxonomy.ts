export const GovernmentVersionTaxonomy = {
  V2024: "2024",
  V2026: "2026"
};

export function mapGovernmentVersion(value: string): string {
  for (const [key, val] of Object.entries(GovernmentVersionTaxonomy)) {
    if (val === value) return key;
  }
  return value;
}
