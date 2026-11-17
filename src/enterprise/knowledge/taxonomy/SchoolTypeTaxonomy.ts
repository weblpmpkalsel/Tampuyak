export const SchoolTypeTaxonomy = {
  GENERAL: "Umum",
  VOCATIONAL: "Kejuruan",
  SPECIAL_NEEDS: "Luar Biasa"
};

export function mapSchoolType(value: string): string {
  for (const [key, val] of Object.entries(SchoolTypeTaxonomy)) {
    if (val === value) return key;
  }
  return value;
}
