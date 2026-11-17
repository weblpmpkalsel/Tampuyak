const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    />AI Request</g,
    '>System Request<'
);

code = code.replace(
    />AI Response</g,
    '>System Response<'
);

code = code.replace(
    /"AI expands Programs into operational annual activities based on RKJM Programs\."/g,
    '"Sistem merinci Program menjadi kegiatan operasional tahunan berdasarkan Program RKJM."'
);

code = code.replace(
    /IndikatorKeberhasilan: { type: "DYNAMIC", source: "AI", ai_generate: true },/g,
    'IndikatorKeberhasilan: { type: "DYNAMIC", source: "Sistem", ai_generate: true },'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
