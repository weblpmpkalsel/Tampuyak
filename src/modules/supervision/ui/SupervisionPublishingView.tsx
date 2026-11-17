import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  FileOutput, 
  ChevronDown, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SupervisionPublishingService, PublishingDocumentType } from '../application/SupervisionPublishingService';
import { useSupervision } from '../context/useSupervision';
import { DocumentExportEngine } from '../../../DocumentExportEngine';

const publishingService = new SupervisionPublishingService();
const exportEngine = new DocumentExportEngine();

export const SupervisionPublishingView: React.FC = () => {
  const { repositories } = useSupervision();
  const planRepo = repositories.getSupervisionRepository();
  const scheduleRepo = repositories.getScheduleRepository();
  const obsRepo = repositories.getObservationRepository();
  const fuRepo = repositories.getFollowUpRepository();
  const poRepo = repositories.getPostObservationRepository();
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<PublishingDocumentType>(PublishingDocumentType.EXECUTIVE_SUMMARY);
  const [data, setData] = useState<any>(null);
  
  // Selection state
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [plans, schedules, observations, followUps, postObservations] = await Promise.all([
          planRepo.findAll(),
          scheduleRepo.findAll(),
          obsRepo.findAll(),
          fuRepo.findAll(),
          poRepo.findAll()
        ]);
        
        setData({ plans, schedules, observations, followUps, postObservations });
        
        if (plans.length > 0) setSelectedPlanId(plans[0].id);
        if (schedules.length > 0) {
          setSelectedScheduleId(schedules[0].id);
          setSelectedTeacherId(schedules[0].teacherSnapshot.id);
        }
      } catch (error) {
        console.error("Failed to load data for publishing", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!data) return;
    
    const html = publishingService.generateHtml(selectedDocType, {
      ...data,
      selectedPlanId,
      selectedScheduleId,
      selectedTeacherId
    });
    
    setHtmlContent(html);
  }, [selectedDocType, data, selectedPlanId, selectedScheduleId, selectedTeacherId]);

  const handlePrint = () => {
    if (!contentRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Dokumen - Tampuyak</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportPdf = async () => {
    if (!contentRef.current) return;
    
    try {
      // Use existing DocumentExportEngine
      await exportEngine.generatePDF(contentRef.current, {
        title: `Dokumen_${selectedDocType}`,
        generatedBy: 'System',
        version: 1,
        qualityScore: 100
      });
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Gagal membuat PDF. Silakan coba Print Preview dan simpan sebagai PDF.");
    }
  };

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
        <FileOutput className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enterprise Publishing Engine</h1>
          <p className="text-sm text-slate-500">Cetak dan Ekspor Dokumen Laporan Supervisi Akademik</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Pilih Dokumen
            </h3>
            
            <div className="space-y-2">
              {Object.values(PublishingDocumentType).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedDocType(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDocType === type 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Parameter Data</h3>
            
            {(selectedDocType === PublishingDocumentType.REKAP_PROGRAM) && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Program</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                >
                  {data?.plans.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            )}
            
            {(selectedDocType === PublishingDocumentType.REKAP_GURU) && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Guru</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                >
                  {data?.schedules.map((s: any) => (
                    <option key={s.id} value={s.teacherSnapshot.id}>{s.teacherSnapshot.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {([
              PublishingDocumentType.LAPORAN_OBSERVASI, 
              PublishingDocumentType.BERITA_ACARA, 
              PublishingDocumentType.RINGKASAN_COACHING,
              PublishingDocumentType.RTL
            ].includes(selectedDocType)) && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Jadwal / Guru</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                  value={selectedScheduleId}
                  onChange={(e) => setSelectedScheduleId(e.target.value)}
                >
                  {data?.schedules.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.teacherSnapshot.name} ({s.subject})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Perhatian
            </h4>
            <p className="text-xs text-slate-600">
              Dokumen ini dihasilkan secara otomatis (Read-Only) berdasarkan data yang ada di sistem. Tidak dapat diedit secara manual.
            </p>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-end gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Simpan PDF
            </button>
            <button 
              onClick={handleExportPdf}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export via Engine
            </button>
          </div>
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="bg-slate-100 border-b border-slate-200 p-3 flex justify-between items-center text-sm font-medium text-slate-500">
              <span>Preview Dokumen: {selectedDocType.replace(/_/g, ' ')}</span>
              <span>Kertas: A4 (Portrait)</span>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 p-8 flex justify-center">
              {/* Paper simulation */}
              <div 
                ref={contentRef}
                className="bg-white shadow-md border border-slate-200 w-full max-w-[800px] min-h-[1000px]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
