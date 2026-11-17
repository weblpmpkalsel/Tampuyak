const fs = require('fs');
let code = fs.readFileSync('src/DocumentCompositionEngine/builders/AppendixBuilder.ts', 'utf8');

code = code.replace(/\[Photo Placeholder 1 - Belum diunggah\.\]/g, '[Ruang Foto 1 - Belum diunggah.]');
code = code.replace(/\[Photo Placeholder 2 - Belum diunggah\.\]/g, '[Ruang Foto 2 - Belum diunggah.]');
code = code.replace(/\[Photo Placeholder 3 - Belum diunggah\.\]/g, '[Ruang Foto 3 - Belum diunggah.]');

fs.writeFileSync('src/DocumentCompositionEngine/builders/AppendixBuilder.ts', code);
console.log('Done');
