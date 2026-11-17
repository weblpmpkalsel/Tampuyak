const testCases = [
  "A.1 Kemampuan Literasi",
  "A1 Kemampuan Literasi",
  "A-1 Kemampuan Literasi",
  "A_1 Kemampuan Literasi",
  "A. 1 Kemampuan Literasi",
  "A .1 Kemampuan Literasi",
  "A . 1 Kemampuan Literasi",
  "a.1 Kemampuan Literasi",
  "Kemampuan Literasi",
  "Iklim Kebhinekaan",
  "Karakter",
  "A.1. Kemampuan Literasi" // should get A.1
];

testCases.forEach(name => {
    let id = "IND-X";
    const codeRegex = /^([a-eA-E])[\.\-\_\s]*(\d+(?:\.\d+)?)/;
    const match = name.match(codeRegex);
    if (match) {
        id = `${match[1].toUpperCase()}.${match[2]}`;
    } else {
        const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const nameToId = {
            "kemampuanliterasi": "A.1",
            "kemampuannumerasi": "A.2",
            "karakter": "A.3",
            "kualitaspembelajaran": "D.1",
            "refleksidanperbaikanpembelajaranolehguru": "D.2",
            "kepemimpinaninstruksional": "D.3",
            "iklimkeamanansekolah": "D.4",
            "iklimkebhinekaan": "D.8",
            "iklimkebinekaan": "D.8",
            "ikliminklusivitas": "D.10"
        };
        for (const [key, val] of Object.entries(nameToId)) {
            if (normalizedName.includes(key)) {
                id = val;
                break;
            }
        }
    }
    console.log(`${name} -> ${id}`);
});
