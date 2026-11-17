import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Activity, 
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { QualityAnalyticsService, ProgramSummary, TeacherProgress, ObservationStatistics, ActionPlanStatistics } from '../application/QualityAnalyticsService';
import { useSupervision } from '../context/useSupervision';

const analyticsService = new QualityAnalyticsService();

export const SupervisionExecutiveDashboard: React.FC = () => {
  const { repositories } = useSupervision();
  const planRepo = repositories.getSupervisionRepository();
  const scheduleRepo = repositories.getScheduleRepository();
  const obsRepo = repositories.getObservationRepository();
  const fuRepo = repositories.getFollowUpRepository();
  const [loading, setLoading] = useState(true);
  const [programSummary, setProgramSummary] = useState<ProgramSummary | null>(null);
  const [teacherProgress, setTeacherProgress] = useState<TeacherProgress[]>([]);
  const [obsStats, setObsStats] = useState<ObservationStatistics | null>(null);
  const [apStats, setApStats] = useState<ActionPlanStatistics | null>(null);
  const [completionRate, setCompletionRate] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [plans, schedules, observations, followUps] = await Promise.all([
          planRepo.findAll(),
          scheduleRepo.findAll(),
          obsRepo.findAll(),
          fuRepo.findAll()
        ]);

        const pSummary = analyticsService.calculateProgramSummary(plans, schedules);
        const tProgress = analyticsService.calculateTeacherProgress(schedules);
        const oStats = analyticsService.calculateObservationStatistics(observations);
        const aStats = analyticsService.calculateActionPlanStatistics(followUps);
        const cRate = analyticsService.calculateCompletionRate(schedules);

        setProgramSummary(pSummary);
        setTeacherProgress(tProgress);
        setObsStats(oStats);
        setApStats(aStats);
        setCompletionRate(cRate);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-sm text-slate-500">Quality Analytics Engine - Ringkasan Pelaksanaan Supervisi</p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-600 text-sm">Total Program</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{programSummary?.totalPrograms || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-600 text-sm">Total Guru Disupervisi</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{programSummary?.totalTeachers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Activity className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-600 text-sm">Sesi Supervisi</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{programSummary?.totalSupervisions || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
            <h3 className="font-bold text-slate-600 text-sm">Completion Rate</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{completionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observation Statistics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Statistik Observasi
            </h3>
            <span className="text-2xl font-black text-indigo-600">{obsStats?.averageScore.toFixed(1)}</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-slate-700">Sangat Baik (90-100)</span>
                <span className="text-slate-500">{obsStats?.scoreDistribution.excellent || 0} Guru</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${((obsStats?.scoreDistribution.excellent || 0) / Math.max(1, programSummary?.totalSupervisions || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-slate-700">Baik (75-89)</span>
                <span className="text-slate-500">{obsStats?.scoreDistribution.good || 0} Guru</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${((obsStats?.scoreDistribution.good || 0) / Math.max(1, programSummary?.totalSupervisions || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-slate-700">Cukup (60-74)</span>
                <span className="text-slate-500">{obsStats?.scoreDistribution.fair || 0} Guru</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${((obsStats?.scoreDistribution.fair || 0) / Math.max(1, programSummary?.totalSupervisions || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-slate-700">Kurang (&lt;60)</span>
                <span className="text-slate-500">{obsStats?.scoreDistribution.poor || 0} Guru</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${((obsStats?.scoreDistribution.poor || 0) / Math.max(1, programSummary?.totalSupervisions || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan (RTL) Statistics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-indigo-600" />
            Progres Rencana Tindak Lanjut
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <span className="block text-sm font-bold text-amber-800 mb-1">RTL Aktif</span>
              <span className="text-3xl font-black text-amber-600">{apStats?.activePlans || 0}</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="block text-sm font-bold text-emerald-800 mb-1">RTL Selesai</span>
              <span className="text-3xl font-black text-emerald-600">{apStats?.completedPlans || 0}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">Tingkat Penyelesaian RTL</span>
              <span className="font-bold text-indigo-600">
                {apStats?.totalPlans ? ((apStats.completedPlans / apStats.totalPlans) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600" 
                style={{ width: `${apStats?.totalPlans ? (apStats.completedPlans / apStats.totalPlans) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Progress (Teacher List) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Alur Supervisi Guru
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Nama Guru</th>
                <th className="px-6 py-4 font-bold">Status Saat Ini</th>
                <th className="px-6 py-4 font-bold w-1/3">Progres Keseluruhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teacherProgress.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data progres guru
                  </td>
                </tr>
              ) : (
                teacherProgress.map((tp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{tp.teacherName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                        {tp.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${tp.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${tp.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8">{tp.completionPercentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
