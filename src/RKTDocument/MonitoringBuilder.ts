import { DocumentChapter } from '../DocumentCompositionEngine/DocumentModel';
import { RKTProjectionResult } from '../rkt/RKTProjectionResult';
import { generateId, sanitizeText } from './utils';

export class MonitoringBuilder {
  public build(result: RKTProjectionResult, settings?: any): DocumentChapter {
    const tableData: any[] = result.projections.map((p, i) => {
        let monitoringRef = p.monitoringReference;
        if (!monitoringRef || String(monitoringRef).toLowerCase() === 'belum ditetapkan' || String(monitoringRef).toLowerCase() === 'unknown') {
            monitoringRef = p.quarter ? `Monitoring Akhir Kuartal ${p.quarter}` : 'Monitoring Berkala';
        }
        
        let evalSchedule = 'Setiap Akhir Semester';
        if (p.semester === 1 || p.semester === '1' as any) {
            evalSchedule = 'Akhir Semester 1';
        } else if (p.semester === 2 || p.semester === '2' as any) {
            evalSchedule = 'Akhir Semester 2';
        }

        return {
            'No': i + 1,
            'Kegiatan': sanitizeText(p.activityName, 'Penyelenggaraan Operasional Pendidikan'),
            'Referensi Monitoring': sanitizeText(monitoringRef, `Monitoring Akhir Kuartal ${p.quarter || 1}`),
            'Indikator Keberhasilan': sanitizeText(p.successIndicator, 'Terlaksananya kegiatan sesuai rencana operasional'),
            'Bukti Dukung': 'Laporan Pelaksanaan, Dokumentasi Kegiatan, Daftar Hadir, dan Berita Acara',
            'Jadwal Evaluasi': evalSchedule,
            'Penanggung Jawab': sanitizeText(p.personInCharge, 'Kepala Sekolah bersama Tim Penjaminan Mutu')
        };
    });

    if (tableData.length === 0) {
        tableData.push({
            'No': 1,
            'Kegiatan': 'Penyelenggaraan Operasional Pendidikan',
            'Referensi Monitoring': 'Monitoring Akhir Kuartal 1',
            'Indikator Keberhasilan': 'Terlaksananya kegiatan sesuai rencana operasional',
            'Bukti Dukung': 'Laporan Pelaksanaan, Dokumentasi Kegiatan, Daftar Hadir, dan Berita Acara',
            'Jadwal Evaluasi': 'Akhir Semester 1',
            'Penanggung Jawab': 'Kepala Sekolah bersama Tim Penjaminan Mutu'
        });
    }

    return {
      id: generateId('ChapterV'),
      title: 'BAB V: Penutup, Monitoring, dan Evaluasi',
      sections: [
        {
          id: generateId('Section'),
          title: '5.1 Skema Pengendalian Mutu Internal',
          paragraphs: [
            `Perencanaan yang baik tidak akan memberikan jaminan tanpa adanya mekanisme pengawasan yang terstruktur. RKT ini menetapkan standar pemantauan untuk memastikan bahwa setiap kegiatan tidak hanya dilaksanakan (output), tetapi juga mencapai indikator keberhasilan yang berdampak pada peningkatan mutu pendidikan (outcome).`,
            `Kami menetapkan skema evaluasi berbasis data empiris. Setiap capaian program wajib dilaporkan secara berkala, disertai bukti dukung otentik—baik berupa portofolio, hasil supervisi, maupun data kuantitatif dari asesmen. Evaluasi ini dilakukan untuk menangkap deviasi secara dini, sehingga langkah korektif atau penyesuaian strategi dapat dilakukan sebelum tahun anggaran berakhir.`
          ],
          tables: [], figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '5.2 Penjadwalan Evaluasi Kegiatan',
          paragraphs: [
            `Tabel berikut menjabarkan mekanisme dan jadwal monitoring untuk setiap kegiatan operasional. Penanggung jawab kegiatan berkewajiban menyiapkan instrumen pelaporan pada jadwal yang telah disepakati. Hasil dari evaluasi ini akan menjadi pondasi bagi siklus perencanaan tahunan berikutnya (umpan balik RKJM) dan intervensi pada pembaruan Rapor Pendidikan di masa mendatang.`
          ],
          tables: [{ title: 'Pemetaan Monitoring Kegiatan', data: tableData }],
          figures: [], references: []
        },
        {
          id: generateId('Section'),
          title: '5.3 Kesimpulan',
          paragraphs: [
            `Rencana Kerja Tahunan ini disusun sebagai pakta integritas institusi dalam menghadirkan layanan pendidikan terbaik. Dengan berpegang pada visi, fokus pada penyelesaian akar masalah, dan mengoptimalkan kolaborasi seluruh elemen sekolah, dokumen ini diharapkan mampu diimplementasikan dengan tingkat keberhasilan yang terukur dan akuntabel.`
          ],
          tables: [], figures: [], references: []
        }
      ],
      paragraphs: [], tables: [], figures: [], references: [], metadata: { generated: true }
    };
  }
}