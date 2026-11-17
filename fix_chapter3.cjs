const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/DocumentCompositionEngine/builders/Chapter3Builder.ts', 'utf8');

// Replace synthesizeStages
const oldSynthesize = /function synthesizeStages\(text: string\): \{ y1: string, y2: string, y3: string, y4: string \} \{[\s\S]*?\}[\s\S]*?export class/g;

const newSynthesize = `function synthesizeStages(text: string): { y1: string, y2: string, y3: string, y4: string } {
    const s = (text || '').toLowerCase();
    
    if (s.includes('guru') || s.includes('pelatihan') || s.includes('pendidik') || s.includes('kompetensi')) return {
        y1: 'Pelatihan dan penguatan kompetensi dimulai.',
        y2: 'Implementasi dalam pembelajaran.',
        y3: 'Pendampingan dan optimalisasi praktik.',
        y4: 'Budaya profesional terbentuk dan berkelanjutan.'
    };
    if (s.includes('literasi') || s.includes('membaca')) return {
        y1: 'Gerakan literasi diinisiasi.',
        y2: 'Pembiasaan membaca diperkuat.',
        y3: 'Budaya literasi dioptimalkan.',
        y4: 'Budaya literasi menjadi karakter sekolah.'
    };
    if (s.includes('numerasi')) return {
        y1: 'Penguatan numerasi dimulai.',
        y2: 'Numerasi terintegrasi dalam pembelajaran.',
        y3: 'Peningkatan capaian numerasi dioptimalkan.',
        y4: 'Budaya numerasi berkelanjutan.'
    };
    if (s.includes('karakter') || s.includes('iklim') || s.includes('budaya positif') || s.includes('kekerasan')) return {
        y1: 'Program pendidikan karakter diinisiasi.',
        y2: 'Iklim keamanan sekolah diperkuat.',
        y3: 'Kualitas iklim dioptimalkan.',
        y4: 'Budaya positif dilembagakan secara berkelanjutan.'
    };
    if (s.includes('manajemen') || s.includes('pengelolaan') || s.includes('perencanaan') || s.includes('tata kelola') || s.includes('fasilitas') || s.includes('sarana')) return {
        y1: 'Perbaikan tata kelola diinisiasi.',
        y2: 'Sistem manajemen dan pengelolaan diperkuat.',
        y3: 'Kualitas layanan dan efisiensi dioptimalkan.',
        y4: 'Tata kelola yang akuntabel terbentuk dan berkelanjutan.'
    };
    if (s.includes('pembelajaran') || s.includes('asesmen')) return {
        y1: 'Peningkatan kualitas pembelajaran diinisiasi.',
        y2: 'Praktik pembelajaran dan asesmen diperkuat.',
        y3: 'Pelaksanaan asesmen untuk pembelajaran dioptimalkan.',
        y4: 'Budaya pembelajaran yang berpusat pada siswa berkelanjutan.'
    };
    
    // Default contextual progression
    return {
        y1: 'Persiapan dan inisiasi implementasi program.',
        y2: 'Implementasi program diperkuat dan diperluas.',
        y3: 'Pendampingan dan optimalisasi praktik pencapaian.',
        y4: 'Pelembagaan dan keberlanjutan program strategis.'
    };
}

export class`;

content = content.replace(oldSynthesize, newSynthesize);

// Replace targetData.push
const oldTargetPush = `            const stages = synthesizeStages(text);
            const targetsAreIdentical = obj.targetY1 && obj.targetY1 === obj.targetY2 && obj.targetY2 === obj.targetY3 && obj.targetY3 === obj.targetY4;
            const useStages = targetsAreIdentical || !obj.targetY1;
            
            targetData.push({
                'Sasaran Strategis': synthObj,
                'Tahun 1': useStages ? stages.y1 : obj.targetY1,
                'Tahun 2': useStages ? stages.y2 : obj.targetY2,
                'Tahun 3': useStages ? stages.y3 : obj.targetY3,
                'Tahun 4': useStages ? stages.y4 : obj.targetY4
            });`;

const newTargetPush = `            const stages = synthesizeStages(text);
            
            // Generate milestone text only during document rendering
            // Force true strategic milestones instead of numeric placeholders (like 5, 10, 15, 20)
            const isNumericOrShort = (val: any) => !val || !isNaN(Number(val)) || String(val).trim().length < 5;
            const useStages = isNumericOrShort(obj.targetY1) || isNumericOrShort(obj.targetY2) || (obj.targetY1 === obj.targetY2 && obj.targetY2 === obj.targetY3 && obj.targetY3 === obj.targetY4);
            
            targetData.push({
                'Sasaran Strategis': synthObj,
                'Tahun 1': useStages ? stages.y1 : obj.targetY1,
                'Tahun 2': useStages ? stages.y2 : obj.targetY2,
                'Tahun 3': useStages ? stages.y3 : obj.targetY3,
                'Tahun 4': useStages ? stages.y4 : obj.targetY4
            });`;

content = content.replace(oldTargetPush, newTargetPush);

fs.writeFileSync('/app/applet/src/DocumentCompositionEngine/builders/Chapter3Builder.ts', content);
