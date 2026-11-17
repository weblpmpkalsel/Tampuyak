const fs = require('fs');

const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const t1 = 'defaultText={`Pendidikan merupakan fondasi utama dalam pembangunan karakter dan kompetensi peserta didik. ${settings.school?.name || "Sekolah ini"} berkomitmen untuk terus meningkatkan mutu layanan pendidikan melalui perencanaan yang terstruktur dan terukur.`}';
const newT1 = 'defaultText={`Dalam kerangka regulasi Sistem Pendidikan Nasional, dokumen ini disusun sebagai landasan administratif dan strategis penyelenggaraan pendidikan. ${settings.school?.name || "Sekolah"} menghadapi karakteristik lingkungan masyarakat yang dinamis, sehingga menuntut perencanaan operasional yang tepat sasaran, terukur, dan berbasis data dukung yang valid guna memastikan seluruh sumber daya dimanfaatkan secara efektif dan efisien.`}';

code = code.replace(t1, newT1);

const t2 = 'defaultText={`Tujuan utama penyusunan dokumen ini adalah untuk memberikan pedoman arah kebijakan dan operasional sekolah selama periode yang telah ditetapkan, guna memastikan seluruh sumber daya dimanfaatkan secara optimal.`}';
const newT2 = 'defaultText={`Tujuan perumusan perencanaan ini adalah menetapkan indikator kinerja utama (IKU) dan kerangka kerja evaluasi implementasi. Sasaran strategis difokuskan pada peningkatan kualitas layanan pembelajaran, pemenuhan Standar Nasional Pendidikan (SNP), serta penyediaan pedoman kerja bagi seluruh unit terkait selama periode yang ditetapkan.`}';

code = code.replace(t2, newT2);

const t3 = 'defaultText={`Berdasarkan hasil Rapor Pendidikan dan evaluasi internal, terdapat beberapa area yang menjadi fokus peningkatan, terutama pada literasi, numerasi, dan iklim keamanan sekolah.`}';
const newT3 = 'defaultText={`Sintesis kondisi internal dan eksternal sekolah didasarkan pada Rapor Pendidikan terbaru. Melalui proses Root Cause Analysis (Analisis Akar Masalah) dan analisis prioritas (SWOT), teridentifikasi area strategis yang membutuhkan intervensi spesifik, sehingga program yang dirumuskan merupakan solusi empiris yang berbasis bukti (evidence-based).`}';

code = code.replace(t3, newT3);

const t4 = 'defaultText={`Program kerja disusun berdasarkan skala prioritas yang ditetapkan dari hasil analisis kesenjangan mutu. Seluruh program berorientasi pada pencapaian Standar Nasional Pendidikan (SNP).`}';
const newT4 = 'defaultText={`Strategi pelaksanaan program dijabarkan secara rinci meliputi rasional, tujuan, indikator keberhasilan, dan unit penanggung jawab. Setiap langkah dimitigasi risiko pelaksanaannya dan dilengkapi mekanisme pengawasan serta evaluasi berkala untuk menjamin keberlanjutan dampak program.`}';

code = code.replace(t4, newT4);

const t5 = 'defaultText={`Seluruh rencana anggaran telah diselaraskan dengan kebutuhan program prioritas dan diinput melalui sistem ARKAS. Rincian anggaran mencakup belanja pegawai, belanja barang dan jasa, serta belanja modal.`}';
const newT5 = 'defaultText={`Filosofi penganggaran berpegang pada prinsip efektivitas, efisiensi, dan akuntabilitas. Alokasi pembiayaan secara langsung merujuk pada matriks program prioritas, mendistribusikan sumber dana sesuai kepatuhan regulasi, dan menjamin keberlanjutan tata kelola anggaran berbasis kinerja.`}';

code = code.replace(t5, newT5);

const t6 = 'defaultText={`Dokumen ${meta.title} ini diharapkan dapat menjadi panduan yang efektif bagi seluruh pemangku kepentingan dalam mewujudkan visi, misi, dan tujuan ${settings.school?.name || "Sekolah"}.`}';
const newT6 = 'defaultText={`Sebagai bentuk komitmen institusional, dokumen ${meta.title} ini ditetapkan sebagai instrumen tata kelola yang mengikat secara operasional. Pemantauan dan evaluasi (Monev) akan dilakukan secara sistematis guna menjamin perbaikan mutu yang berkesinambungan (continuous improvement).`}';

code = code.replace(t6, newT6);

fs.writeFileSync(file, code);
console.log("Updated narrative default texts");
