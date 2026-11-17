export const EducationLevelTaxonomy = {
  PAUD: "PAUD",
  SD: "SD",
  SMP: "SMP",
  SMA: "SMA",
  SMK: "SMK",
  SLB: "SLB"
};

export function mapEducationLevel(value: string): string {
  for (const [key, val] of Object.entries(EducationLevelTaxonomy)) {
    if (val === value) return key;
  }
  return value;
}
