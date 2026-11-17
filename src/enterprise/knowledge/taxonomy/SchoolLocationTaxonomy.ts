export const SchoolLocationTaxonomy = {
  RURAL: "Pedesaan",
  URBAN: "Perkotaan",
  COASTAL: "Pesisir",
  MOUNTAINOUS: "Pegunungan",
  BORDER: "Perbatasan",
  INDUSTRIAL: "Kawasan Industri",
  AGRICULTURAL: "Kawasan Pertanian",
  PLANTATION: "Kawasan Perkebunan",
  MINING: "Kawasan Tambang",
  FOREST: "Kawasan Hutan"
};

export function mapSchoolLocation(value: string): string {
  for (const [key, val] of Object.entries(SchoolLocationTaxonomy)) {
    if (val === value) return key;
  }
  return value;
}
