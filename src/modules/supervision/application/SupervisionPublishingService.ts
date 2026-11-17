import { 
  SupervisionPlan, 
  SupervisionSchedule, 
  Observation, 
  FollowUp, 
  PostObservation
} from '../types/SupervisionTypes';
import { QualityAnalyticsService } from './QualityAnalyticsService';

export enum PublishingDocumentType {
  LAPORAN_OBSERVASI = 'LAPORAN_OBSERVASI',
  BERITA_ACARA = 'BERITA_ACARA',
  RINGKASAN_COACHING = 'RINGKASAN_COACHING',
  RTL = 'RTL',
  REKAP_PROGRAM = 'REKAP_PROGRAM',
  REKAP_GURU = 'REKAP_GURU',
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY'
}

export class SupervisionPublishingService {
  private analytics = new QualityAnalyticsService();

  public generateHtml(
    docType: PublishingDocumentType, 
    data: {
      plans: SupervisionPlan[],
      schedules: SupervisionSchedule[],
      observations: Observation[],
      followUps: FollowUp[],
      postObservations: PostObservation[],
      selectedScheduleId?: string,
      selectedPlanId?: string,
      selectedTeacherId?: string
    }
  ): string {
    switch (docType) {
      case PublishingDocumentType.LAPORAN_OBSERVASI:
        return this.buildLaporanObservasi(data.schedules, data.observations, data.selectedScheduleId);
      case PublishingDocumentType.BERITA_ACARA:
        return this.buildBeritaAcara(data.schedules, data.observations, data.selectedScheduleId);
      case PublishingDocumentType.RINGKASAN_COACHING:
        return this.buildRingkasanCoaching(data.postObservations, data.selectedScheduleId);
      case PublishingDocumentType.RTL:
        return this.buildRtl(data.followUps, data.selectedScheduleId);
      case PublishingDocumentType.REKAP_PROGRAM:
        return this.buildRekapProgram(data.plans, data.schedules, data.selectedPlanId);
      case PublishingDocumentType.REKAP_GURU:
        return this.buildRekapGuru(data.schedules, data.selectedTeacherId);
      case PublishingDocumentType.EXECUTIVE_SUMMARY:
        return this.buildExecutiveSummary(data.plans, data.schedules, data.observations, data.followUps);
      default:
        return `<div>Dokumen tidak dikenali</div>`;
    }
  }

  private buildLaporanObservasi(schedules: SupervisionSchedule[], observations: Observation[], scheduleId?: string): string {
    const schedule = schedules.find(s => s.id === scheduleId);
    const obs = observations.find(o => o.supervisionId === scheduleId);
    
    if (!schedule || !obs) {
      return `<div>Data Laporan Observasi tidak lengkap. Pastikan observasi sudah dilakukan.</div>`;
    }
    
    let scoresHtml = '';
    if (obs.scores && obs.scores.length > 0) {
      scoresHtml = `
        <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px;">Aspek Penilaian</th>
              <th style="border: 1px solid #000; padding: 8px;">Skor</th>
            </tr>
          </thead>
          <tbody>
            ${obs.scores.map(s => {
              const item = obs.session.instrumentSnapshot?.items?.find((i: any) => i.id === s.rubricItemId);
              const description = item ? item.description : s.rubricItemId;
              return `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${description}</td>
                <td style="border: 1px solid #000; padding: 8px;">${s.score}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      `;
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px;">
        <h2 style="text-align: center;">LAPORAN OBSERVASI KELAS</h2>
        <hr />
        <table style="width: 100%; margin-top: 20px;">
          <tr><td style="width: 200px;">Nama Guru</td><td>: ${schedule.teacherSnapshot.name}</td></tr>
          <tr><td>Mata Pelajaran</td><td>: ${obs.session.subjectName}</td></tr>
          <tr><td>Kelas</td><td>: ${obs.session.className}</td></tr>
          <tr><td>Tanggal Observasi</td><td>: ${new Date(schedule.scheduledDate).toLocaleDateString('id-ID')}</td></tr>
          <tr><td>Kategori Nilai Akhir</td><td>: <strong>${(() => {
            if (obs.finalScoreCategory) return obs.finalScoreCategory;
            if (!obs.scores || obs.scores.length === 0) return '-';
            let sum = 0;
            let totalMax = 0;
            const items = obs.session.instrumentSnapshot?.items || [];
            obs.scores.forEach((s: any) => {
                sum += s.score;
                const item = items.find((i: any) => i.id === s.rubricItemId);
                totalMax += item ? item.maxScore : 4;
            });
            if (totalMax === 0) return '-';
            const percentage = (sum / totalMax) * 100;
            if (percentage >= 90) return 'SANGAT_BAIK';
            if (percentage >= 75) return 'BAIK';
            if (percentage >= 60) return 'CUKUP';
            return 'KURANG';
          })()}</strong></td></tr>
        </table>
        
        <h3 style="margin-top: 30px;">Hasil Penilaian</h3>
        ${scoresHtml}
        
        <h3 style="margin-top: 30px;">Catatan Observasi</h3>
        <ul>
          ${obs.notes ? obs.notes.map(n => `<li>${n.content}</li>`).join('') : '<li>Tidak ada catatan.</li>'}
        </ul>
      </div>
    `;
  }
  
  private buildBeritaAcara(schedules: SupervisionSchedule[], observations: Observation[], scheduleId?: string): string {
    const schedule = schedules.find(s => s.id === scheduleId);
    const obs = observations.find(o => o.supervisionId === scheduleId);
    
    if (!schedule) {
      return `<div>Data tidak ditemukan.</div>`;
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px; line-height: 1.6;">
        <h2 style="text-align: center;">BERITA ACARA PELAKSANAAN SUPERVISI AKADEMIK</h2>
        <hr />
        <p style="margin-top: 20px;">
          Pada hari ini, tanggal <strong>${new Date(schedule.scheduledDate).toLocaleDateString('id-ID')}</strong>, telah dilaksanakan Supervisi Akademik / Observasi Pembelajaran di kelas:
        </p>
        <table style="width: 100%; margin-top: 10px; margin-bottom: 20px;">
          <tr><td style="width: 200px;">Nama Guru</td><td>: <strong>${schedule.teacherSnapshot.name}</strong></td></tr>
          <tr><td>Mata Pelajaran</td><td>: ${obs.session.subjectName}</td></tr>
          <tr><td>Kelas</td><td>: ${obs.session.className}</td></tr>
          <tr><td>Status Pelaksanaan</td><td>: ${schedule.status}</td></tr>
        </table>
        <p>
          Demikian berita acara ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
        <br/><br/>
        <table style="width: 100%; text-align: center; margin-top: 50px;">
          <tr>
            <td style="width: 50%;">
              Guru yang disupervisi,
              <br/><br/><br/><br/>
              <strong>${schedule.teacherSnapshot.name}</strong>
            </td>
            <td style="width: 50%;">
              Supervisor,
              <br/><br/><br/><br/>
              <strong>_______________________</strong>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
  
  private buildRingkasanCoaching(postObservations: PostObservation[], scheduleId?: string): string {
    const fu = postObservations.find(f => f.supervisionId === scheduleId);
    if (!fu || !fu.coaching) {
      return `<div>Data Sesi Coaching belum tersedia untuk jadwal ini.</div>`;
    }
    
    const cs = fu.coaching;
    return `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px;">
        <h2 style="text-align: center;">RINGKASAN SESI COACHING</h2>
        <hr />
        <table style="width: 100%; margin-top: 20px; margin-bottom: 20px; border-collapse: collapse;">
          <tr><td style="width: 200px; padding: 5px 0;">Tanggal Coaching</td><td>: ${new Date((cs.conductedAt || Date.now())).toLocaleDateString('id-ID')}</td></tr>
          <tr><td style="padding: 5px 0;">Fokus Utama</td><td>: ${'-'}</td></tr>
          <tr><td style="padding: 5px 0;">Status</td><td>: ${cs.status}</td></tr>
        </table>
        
        <h3>Hasil Diskusi / Coaching</h3>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border: 1px solid #eee;">${cs.assessorNotes || 'Tidak ada catatan.'}</p>
        
        <h3>Kesepakatan / Komitmen</h3>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border: 1px solid #eee;">${cs.agreedCommitment || 'Tidak ada komitmen yang tercatat.'}</p>
      </div>
    `;
  }
  
  private buildRtl(followUps: FollowUp[], scheduleId?: string): string {
    const fu = followUps.find(f => f.supervisionId === scheduleId);
    if (!fu || !fu.actionPlans || fu.actionPlans.length === 0) {
      return `<div>Data Rencana Tindak Lanjut (RTL) belum tersedia untuk jadwal ini.</div>`;
    }
    
    let html = `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px;">
        <h2 style="text-align: center;">RENCANA TINDAK LANJUT (RTL)</h2>
        <hr />
        <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Strategi</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Batas Waktu</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Sumber Daya</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    fu.actionPlans.forEach(ap => {
      html += `
        <tr>
          <td style="border: 1px solid #000; padding: 8px;">${ap.title}</td>
          <td style="border: 1px solid #000; padding: 8px;">${new Date(ap.targetDate).toLocaleDateString('id-ID')}</td>
          <td style="border: 1px solid #000; padding: 8px;">${ap.expectedEvidence || '-'}</td>
          <td style="border: 1px solid #000; padding: 8px;">${ap.status}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    
    return html;
  }
  
  private buildRekapProgram(plans: SupervisionPlan[], schedules: SupervisionSchedule[], planId?: string): string {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      return `<div>Data Program tidak ditemukan.</div>`;
    }
    
    const planSchedules = schedules.filter(s => s.planId === planId);
    const completed = planSchedules.filter(s => s.status === 'COMPLETED').length;
    const rate = planSchedules.length > 0 ? (completed / planSchedules.length) * 100 : 0;
    
    let scheduleRows = '';
    planSchedules.forEach((s, idx) => {
      scheduleRows += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${idx + 1}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.teacherSnapshot.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.teacherSnapshot.subject || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(s.scheduledDate).toLocaleDateString('id-ID')}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.status}</td>
        </tr>
      `;
    });
    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px;">
        <h2 style="text-align: center;">REKAPITULASI PROGRAM SUPERVISI</h2>
        <hr />
        <h3 style="margin-top:20px;">${plan.title}</h3>
        <p><strong>Tahun Ajaran:</strong> ${plan.calendarSnapshot.academicYear} | <strong>Semester:</strong> ${plan.calendarSnapshot.semester}</p>
        <p><strong>Status Program:</strong> ${plan.status}</p>
        <p><strong>Tingkat Penyelesaian:</strong> ${rate.toFixed(1)}% (${completed} dari ${planSchedules.length} jadwal)</p>
        
        <h4 style="margin-top:20px;">Daftar Pelaksanaan</h4>
        <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">No</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Guru</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mapel/Kelas</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Jadwal</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleRows || '<tr><td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: center;">Belum ada jadwal</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
  
  private buildRekapGuru(schedules: SupervisionSchedule[], teacherId?: string): string {
    const tSchedules = schedules.filter(s => s.teacherSnapshot.id === teacherId);
    if (tSchedules.length === 0) {
      return `<div>Data Supervisi Guru tidak ditemukan.</div>`;
    }
    
    const teacher = tSchedules[0].teacherSnapshot;
    
    let html = `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px;">
        <h2 style="text-align: center;">REKAM JEJAK SUPERVISI GURU</h2>
        <hr />
        <table style="width: 100%; margin-top: 20px; margin-bottom: 30px;">
          <tr><td style="width: 150px;">Nama Guru</td><td>: <strong>${teacher.name}</strong></td></tr>
          <tr><td>NIP/ID</td><td>: ${teacher.id}</td></tr>
          <tr><td>Total Supervisi</td><td>: ${tSchedules.length}</td></tr>
        </table>
        
        <h3>Riwayat Supervisi</h3>
        <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tanggal</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mapel/Kelas</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    tSchedules.forEach(s => {
      html += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(s.scheduledDate).toLocaleDateString('id-ID')}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.teacherSnapshot.subject || '-'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${s.status}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
    return html;
  }
  
  private buildExecutiveSummary(
    plans: SupervisionPlan[], 
    schedules: SupervisionSchedule[], 
    observations: Observation[], 
    followUps: FollowUp[]
  ): string {
    const pSummary = this.analytics.calculateProgramSummary(plans, schedules);
    const oStats = this.analytics.calculateObservationStatistics(observations);
    const aStats = this.analytics.calculateActionPlanStatistics(followUps);
    const cRate = this.analytics.calculateCompletionRate(schedules);
    
    return `
      <div style="font-family: Arial, sans-serif; color: #000; padding: 20px; line-height: 1.6;">
        <h2 style="text-align: center;">EXECUTIVE SUMMARY</h2>
        <h3 style="text-align: center; color: #555; margin-top: -10px;">Supervisi Akademik</h3>
        <hr />
        
        <div style="display: flex; flex-wrap: wrap; margin-top: 30px; margin-bottom: 30px;">
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; margin: 5px; text-align: center; background-color: #f9f9f9;">
            <div style="font-size: 14px; color: #666;">Total Program</div>
            <div style="font-size: 24px; font-weight: bold;">${pSummary.totalPrograms}</div>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; margin: 5px; text-align: center; background-color: #f9f9f9;">
            <div style="font-size: 14px; color: #666;">Total Guru Disupervisi</div>
            <div style="font-size: 24px; font-weight: bold;">${pSummary.totalTeachers}</div>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; margin: 5px; text-align: center; background-color: #f9f9f9;">
            <div style="font-size: 14px; color: #666;">Tingkat Penyelesaian</div>
            <div style="font-size: 24px; font-weight: bold;">${cRate.toFixed(1)}%</div>
          </div>
        </div>
        
        <h3>Kualitas Observasi</h3>
        <p>Rata-rata Nilai Observasi: <strong>${oStats.averageScore.toFixed(1)}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr><td style="border: 1px solid #ddd; padding: 8px; width: 50%;">Sangat Baik (90-100)</td><td style="border: 1px solid #ddd; padding: 8px;">${oStats.scoreDistribution.excellent} Guru</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Baik (75-89)</td><td style="border: 1px solid #ddd; padding: 8px;">${oStats.scoreDistribution.good} Guru</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Cukup (60-74)</td><td style="border: 1px solid #ddd; padding: 8px;">${oStats.scoreDistribution.fair} Guru</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;">Kurang (&lt;60)</td><td style="border: 1px solid #ddd; padding: 8px;">${oStats.scoreDistribution.poor} Guru</td></tr>
        </table>
        
        <h3 style="margin-top: 30px;">Tindak Lanjut & Pengembangan</h3>
        <p>Total Rencana Tindak Lanjut (RTL) yang dibuat: <strong>${aStats.totalPlans}</strong></p>
        <ul>
          <li>RTL Sedang Berjalan: <strong>${aStats.activePlans}</strong></li>
          <li>RTL Selesai/Tuntas: <strong>${aStats.completedPlans}</strong></li>
        </ul>
      </div>
    `;
  }
}
