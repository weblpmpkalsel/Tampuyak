export function generateId(prefix: string): string {
    return prefix + '-' + Math.random().toString(36).substring(2, 9);
}

export function formatPlanningYear(year?: string): string {
    if (!year) return 'Tahun Pertama Pelaksanaan RKJM';
    const lower = year.toLowerCase();
    if (lower === 'y1') return 'Tahun Pertama Pelaksanaan RKJM';
    if (lower === 'y2') return 'Tahun Kedua Pelaksanaan RKJM';
    if (lower === 'y3') return 'Tahun Ketiga Pelaksanaan RKJM';
    if (lower === 'y4') return 'Tahun Keempat Pelaksanaan RKJM';
    if (year.includes('/')) return `Tahun Pelajaran ${year}`;
    return year;
}
export function sanitizeText(text: any, defaultValue: string): string {
    if (text === undefined || text === null) return defaultValue;
    const lower = String(text).trim().toLowerCase();
    if (lower === '' || lower === '-' || lower === 'belum ditetapkan' || lower === 'belum tersedia' || lower === 'unknown' || lower === 'undefined' || lower === 'n/a' || lower === 'null') {
        return defaultValue;
    }
    return String(text).trim();
}

export function getMonitoringReferenceDefault(activityName: any): string {
    if (!activityName) return "Monitoring Berkala oleh Tim Penjaminan Mutu Sekolah";
    const name = String(activityName).toLowerCase();
    if (name.includes('workshop') || name.includes('iht') || name.includes('training') || name.includes('pelatihan')) {
        return "Monitoring Berkala oleh Tim Penjaminan Mutu Sekolah";
    } else if (name.includes('kurikulum') || name.includes('pembelajaran')) {
        return "Monitoring Implementasi Kurikulum melalui Supervisi Akademik";
    } else if (name.includes('siswa') || name.includes('peserta didik') || name.includes('ekstrakurikuler')) {
        return "Monitoring Pelaksanaan Kegiatan Peserta Didik";
    } else if (name.includes('sarana') || name.includes('prasarana') || name.includes('pengadaan') || name.includes('barang') || name.includes('pemeliharaan')) {
        return "Monitoring Progres Pengadaan dan Pemeriksaan Barang";
    } else if (name.includes('rapat') || name.includes('manajemen') || name.includes('evaluasi')) {
        return "Monitoring Pelaksanaan Program melalui Rapat Evaluasi Berkala";
    }
    return "Monitoring Berkala oleh Tim Penjaminan Mutu Sekolah";
}

export function getEvaluationScheduleDefault(semester: any): string {
    if (semester === 1 || semester === '1') return "Akhir Semester 1";
    if (semester === 2 || semester === '2') return "Akhir Semester 2";
    return "Setiap Akhir Semester";
}
