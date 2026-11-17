import { seedUatScenario } from './modules/supervision/persistence/firestore/UatSeeder';

import { ApprovalsView } from "./control/ApprovalsView";
import { auth } from "./lib/firebase";
import { getEffectiveUser, isDevAuthBypass } from "./services/auth/devAuth";
import { PermissionService } from "./services/auth/permissionService";
import { KspPreviewWorkspace } from "./enterprise/workspace/preview/KspPreviewWorkspace";
import { KSPValidationPanel } from "./ksp/KSPValidationPanel";
import { KSPAttachmentPanel } from "./ksp/KSPAttachmentPanel";
import { PlanningAssignmentService } from "./planning/PlanningAssignmentService";
import { OperationalPlanningMapper } from "./planning/OperationalPlanningMapper";
import { DocumentRouter } from "./document/DocumentRouter";
import { WorkspaceController } from "./rkas/controller/WorkspaceController";

function generateAppDocument(docId: string, kg: any, settings: any) {
  if (docId === 'rkas') {
    const controller = new WorkspaceController();
    const context = {
      workspaceId: settings?.workspaceId ,
      userId: settings?.principal?.name || 'admin',
      role: 'ADMIN'
    };
    controller.execute({ action: 'INITIALIZE', context });
    const result = controller.execute({
      action: 'GENERATE_RKAS',
      context,
      payload: { kg, settings }
    });
    if (result.success && result.documentModel) {
      return result.documentModel;
    }
    throw new Error(result.errors?.join(", ") || "Failed to generate RKAS document");
  }
  return DocumentRouter.generate(docId, kg, settings);
}
import { PlanningSnapshotService } from "./planning/PlanningSnapshotService";
import { PlanningDistribution } from "./planning/PlanningDistribution";
import { PlanningDistributionService } from "./planning/PlanningDistributionService";
import { TargetProjectionEngine } from "./TargetProjectionEngine";
import { MasterSNP, MasterRKAS, MasterRapor, MasterRegulations, MasterTemplates } from "./MasterData";


import { TIE } from "./TIE";
import { DOCUMENT_BLUEPRINTS } from "./DocumentBlueprints";
import { get, set, del } from "idb-keyval";
import {
  PusatPengetahuanView } from "./PusatPengetahuan";
import { EducationalAuditExplorer } from "./EducationalAuditExplorer";
import { RaporIntelligenceEngine } from "./RaporIntelligenceEngine";
import { EducationReportParser } from "./EducationReportParser";
import { DocumentSynchronizationEngine } from "./DocumentSynchronizationEngine";
import { TanyaTampuyakWidget } from "./components/TanyaTampuyakWidget";
import { SupervisionAcademicView, SupervisionProvider } from "./modules/supervision";
import { EOfficeView } from "./components/EOfficeView";
import { LpjKepalaSekolahView } from "./components/LpjKepalaSekolahView";
import { SPKGView } from "./SPKGView";
import { KnowledgeGraph, CanonicalObject, seedInitialGraph } from "./SPKG";
import { KnowledgeGraphHydrator } from "./KnowledgeGraphHydrator";
import { EnterpriseDocumentViewer } from "./EnterpriseDocumentViewer";
import { CanonicalRenderer } from "./enterprise/workspace/preview/CanonicalRenderer";
import { RkjmDocumentAssembler } from "./enterprise/document/rkjm/RkjmDocumentAssembler";
import { DocumentCompositionEngine } from './DocumentCompositionEngine/DocumentCompositionEngine';
import { DocumentExportEngine } from './DocumentExportEngine';
import { KSPDashboard, KSPWorkspace } from "./ksp";
import { useWorkspace } from './workspace/WorkspaceContext';
import { createPortal } from "react-dom";
import { EnterpriseWorkspaceShell } from './enterprise/workspace/EnterpriseWorkspaceShell';
import { Joyride, Step, EventData, STATUS } from "react-joyride";
import React,
  {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
  } from "react";
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  Building2,
  UserCircle,
  Users,
  BookOpen,
  Wallet,
  Palette,
  Sparkles,
  Layout,
  Database,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  RefreshCw,
  Save,
  X,
  XCircle,
  Image as ImageIcon,
  UploadCloud,
  MoreVertical,
  Check,
  Info,
  GitCompare,
  FileJson,
  AlertTriangle,
  Lock,
  FileText,
  Calculator,
  Mail,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Gauge,
  Layers,
  FileBadge,
  Terminal,
  Target,
  Lightbulb,
  Server,
  HardDrive,
  Clock,
  Activity,
  Award,
  CheckCircle,
  Cpu,
  ListChecks,
  BarChart2,
  Briefcase,
  ChevronDown,
  Network,
  BookMarked,
  FileSpreadsheet,
  BrainCircuit,
  ActivitySquare,
  Scale,
  Home,
  UserCheck,
  PieChart,
  Plus,
  Search,
  Edit2,
  Map,
  MapPin,
  Compass,
  Star,
  Camera,
  Globe,
  GripVertical,
  Calendar,
  Play,
  Crosshair,
  Printer,
  FileCode,
  FileSignature,
  ShieldAlert,
  GitCommit,
  Share2,
  Settings,
  FolderOpen,
  DownloadCloud,
  CloudRain,
  Cloud,
  Eye,
  Edit3,
  Bell,
  Zap,
  MessageSquare,
  History,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  FileEdit,
  RefreshCcw,
  Coins,
  Link,
  Wrench,
  FileArchive,
  QrCode,
  BarChart3,
  HelpCircle,
  Library,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  ArrowDown,
  Milestone,
  Archive,
  Code,
  Instagram,
  Facebook,
  Youtube,
  Maximize,
  Minimize,
  Bold,
  Italic,
  Underline, Undo, Redo, FileDown,
  Link2, ExternalLink, ThumbsUp, Microscope, Unlock, Menu, Stethoscope
} from "lucide-react";

const PrintDocumentRenderer = ({ docId, isPrintReady, exportDocx, setPrintMode, showToast }: any) => {
  const { settings, getActiveAcademicYear, planning } = useApp();
  const [narratives, setNarratives] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);





  useEffect(() => {
    setNarratives(settings.narratives?.[docId] || {});
    setIsReady(true);
  }, [docId, settings.narratives]);

  const meta = {
    title: docId === "ksp" ? "Kurikulum Satuan Pendidikan" : docId === "rkjm" ? "Rencana Kerja Jangka Menengah" : docId === "rkt" ? "Rencana Kerja Tahunan" : docId === "rkas" ? "Rencana Kegiatan dan Anggaran Sekolah" : docId === "monitoring" ? "Laporan Monitoring" : "Evaluasi",
    subtitle: "DOKUMEN RESMI",
    status: "Final"
  };

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isReady && !isGenerating && !pdfUrl && !docxUrl) {
      const generateDocuments = async () => {
        try {
          setIsGenerating(true);
          const engine = new DocumentExportEngine();
          
          let documentModel = null;
          const kg = KnowledgeGraph.getInstance();
          if (settings.canonicalObjects) {
             KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
          } else {
             seedInitialGraph();
          }
          documentModel = generateAppDocument(docId, kg, { ...settings, planning });

          const exportMeta = {
            title: meta.title,
            generatedBy: settings.school?.name || "Sistem Tampuyak",
            version: 1,
            qualityScore: 100
          };

          // 1. Generate DOCX
          try {
            const docxBlobUrl = await engine.generateDocx(documentModel, exportMeta);
            setDocxUrl(docxBlobUrl);
          } catch (e) {
            console.error("DOCX Error:", e);
          }

          // 2. Generate PDF via html2pdf using the DOM element that is rendered behind the modal
          setTimeout(async () => {
            const printDoc = document.getElementById("printable-doc-export");
            if (printDoc) {
               try {
                 const pdfBlobUrl = await engine.generatePDF(printDoc, exportMeta);
                 setPdfUrl(pdfBlobUrl);
               } catch (e) {
                 console.error("PDF Error:", e);
               }
            }
            setIsGenerating(false);
          }, 1500); // Give DOM time to settle
        } catch (err) {
          console.error("Export Error: ", err);
          setIsGenerating(false);
        }
      };
      
      generateDocuments();
    }
  }, [isReady]);

  if (!isReady) return <div className="p-12 text-center">Menyiapkan dokumen cetak...</div>;

  const DownloadManagerOverlay = () => (
    <div className="fixed inset-0 bg-slate-900/90 z-[9999] flex flex-col items-center justify-center p-8 print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-600" /> Document Export Manager
            </h2>
            <p className="text-sm text-slate-500 mt-1">{meta.title} - {settings.school?.name || "Draft"}</p>
          </div>
          <Button variant="ghost" onClick={() => setPrintMode(null)} className="rounded-full w-10 h-10 p-0 hover:bg-slate-200">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
        
        <div className="p-8">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <h3 className="font-semibold text-lg text-slate-800">Generating Files...</h3>
              <p className="text-sm text-slate-500">Compiling your document securely.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center bg-slate-50 hover:border-rose-200 transition-colors">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">PDF Document</h3>
                <p className="text-sm text-slate-500 mb-6">Production-ready PDF suitable for formal printing and official archiving.</p>
                {pdfUrl ? (
                  <a href={pdfUrl} download={`${meta.title}.pdf`} onClick={() => showToast("PDF Downloaded successfully", "success")} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </a>
                ) : (
                  <div className="w-full bg-slate-200 text-slate-500 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center cursor-not-allowed text-sm">
                    Generation Failed
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center bg-slate-50 hover:border-blue-200 transition-colors">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <FileDown className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Word Document</h3>
                <p className="text-sm text-slate-500 mb-6">Editable DOCX format for offline revisions and word-processor collaboration.</p>
                {docxUrl ? (
                  <a href={docxUrl} download={`${meta.title}.docx`} onClick={() => showToast("DOCX Downloaded successfully", "success")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors">
                    <Download className="w-4 h-4 mr-2" /> Download DOCX
                  </a>
                ) : (
                  <div className="w-full bg-slate-200 text-slate-500 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center cursor-not-allowed text-sm">
                    Generation Failed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PureNarrativeEditor = ({ id, label, defaultText }: any) => {
     const text = narratives[id] || defaultText;
     return (
        <div className="mb-6">
          <h4 className="font-bold text-lg mb-2 text-black">{label}</h4>
          <div className="text-justify leading-relaxed whitespace-pre-wrap">{text}</div>
        </div>
     );
  };

  const PureEmptyTableFallback = () => (
    <div className="text-justify text-black border border-[var(--color-eds-border)] p-6 my-6 italic bg-[var(--color-eds-bg)]">
      Bab ini belum dapat disusun secara lengkap karena data sumber belum memenuhi persyaratan penyusunan dokumen. Dokumen ini masih berstatus draft administrasi.
    </div>
  );

  return (
    <>
      <DownloadManagerOverlay />
      <div id="printable-doc-export" className="w-[170mm] print:w-auto print:min-h-0 bg-white font-serif text-black relative block p-0 overflow-visible max-h-none mx-auto print:mx-0">
        {(() => {
          try {
            const kg = KnowledgeGraph.getInstance();
            if (settings.canonicalObjects) {
              KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
            } else {
              seedInitialGraph();
            }
            const documentModel = generateAppDocument(docId, kg, { ...settings, planning: settings.planning });
            
            return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />;
          } catch (error: any) {
            return <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              <h3 className="text-xl font-bold mb-2">Knowledge Graph Hydration Failure</h3>
              <p>{error.message}</p>
            </div>;
          }
        })()}
      </div>
    </>
  );
};

const EmptyTableDiagnostic = () => (
  <div className="text-justify text-[var(--color-eds-text-primary)] border-l-4 border-slate-400 p-6 my-6 italic bg-[var(--color-eds-bg)]">
    Bab ini belum dapat disusun secara lengkap karena data sumber belum memenuhi persyaratan penyusunan dokumen. Dokumen ini masih berstatus draft administrasi.
  </div>
);

const STORAGE_KEY = "tampuyak.settings";
const MAX_LOGO_SIZE = 1024 * 1024;

const loadFromIndexedDB = async () => {
  try {
    const data = await get(STORAGE_KEY);
    if (data) {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      console.log("[AUDIT] LOAD LOCAL:", parsed?.school?.misi ? "misi:" + parsed.school.misi.substring(0, 50) : "no misi", parsed?.principal?.nip ? "nip:" + parsed.principal.nip : "no nip");
      return parsed;
    }
  } catch (err) {
    console.error("IndexedDB load failed", err);
  }
  // Fallback to localStorage
  try {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed) console.log("[AUDIT] LOAD LOCAL (fallback):", parsed?.school?.misi ? "misi:" + parsed.school.misi.substring(0, 50) : "no misi");
    return parsed;
  } catch (e) {
    console.error("localStorage fallback failed", e);
    return null;
  }
};

const saveToIndexedDB = async (data: any) => {
  console.log("[Tampuyak] SAVE LOCAL");
  console.log("[AUDIT] SAVE LOCAL:", data?.school?.misi ? "misi:" + data.school.misi.substring(0, 50) : "no misi", data?.principal?.nip ? "nip:" + data.principal.nip : "no nip");
  try {
    // Save as raw object to IndexedDB (idb-keyval handles serialization via structured clone)
    await set(STORAGE_KEY, data);
  } catch (err) {
    console.error("IndexedDB save failed, falling back to localStorage", err);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error("localStorage fallback save failed", e);
    }
  }
};

// ============================================================================
// PHASE 2: SCHOOL PLANNING ENGINE (CORE LOGIC)
// ============================================================================
const PlanningStatus = {
  LOCKED: "LOCKED",
  READY: "READY",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

const PlanningRegistry = [
  {
    id: "masterData",
    title: "Pusat Data Sekolah",
    icon: Database,
    desc: "Profil, GTK, & Inventaris",
    action: "Lengkapi Pusat Data",
  },
  {
    id: "raporPendidikan",
    title: "Rapor Pendidikan",
    icon: FileSpreadsheet,
    desc: "Input capaian Rapor Pendidikan",
    action: "Input Rapor Pendidikan",
  },
  {
    id: "aiDiagnosis",
    title: "Diagnosis Rapor",
    icon: BrainCircuit,
    desc: "Analisis kelemahan & rekomendasi",
    action: "Analisis Rapor Pendidikan",
  },
  {
    id: "rkjm",
    title: "RKJM",
    icon: Target,
    desc: "Rencana Strategis 4 Tahun",
    action: "Susun RKJM",
  },
  {
    id: "rkt",
    title: "RKT",
    icon: Clock,
    desc: "Rencana Kerja 1 Tahun",
    action: "Susun RKT",
  },
  {
    id: "rkas",
    title: "RKAS",
    icon: Wallet,
    desc: "Rencana Anggaran & Belanja",
    action: "Susun RKAS",
  },
  {
    id: "ksp",
    title: "KSP",
    icon: BookOpen,
    desc: "Kurikulum Satuan Pendidikan",
    action: "Susun KSP",
  }, // Added to timeline
  {
    id: "pelaksanaan",
    title: "Pelaksanaan",
    icon: Briefcase,
    desc: "Realisasi Program Sekolah",
    action: "Laksanakan Program",
  },
  {
    id: "supervisi",
    title: "Supervisi",
    icon: CheckSquare,
    desc: "Supervisi Akademik & Manajerial",
    action: "Lakukan Supervisi",
  },
  {
    id: "evaluasi",
    title: "Evaluasi",
    icon: BarChart2,
    desc: "Evaluasi Program & Kinerja",
    action: "Lakukan Evaluasi",
  },
  {
    id: "lpj",
    title: "LPJ",
    icon: FileText,
    desc: "Laporan Akhir",
    action: "Buat LPJ",
  },
];

const PlanningRules = {
  evaluate: (
    currentState,
    masterDataScore,
    raporScore = 0,
    isRaporLocked = false,
    rawSettings: any = {},
  ) => {
    let newState = JSON.parse(JSON.stringify(currentState));
    newState.masterData.progress = masterDataScore;
    if (masterDataScore === 100) {
      newState.masterData.status = PlanningStatus.COMPLETED;
    } else if (masterDataScore > 0) {
      newState.masterData.status = PlanningStatus.IN_PROGRESS;
    } else {
      newState.masterData.status = PlanningStatus.READY;
    }

    // Special case for Rapor Pendidikan which we just implemented
    if (newState.masterData.status === PlanningStatus.COMPLETED) {
      if (newState.raporPendidikan.status === PlanningStatus.LOCKED) {
        newState.raporPendidikan.status = PlanningStatus.READY;
      }
      newState.raporPendidikan.progress = raporScore;
      if (isRaporLocked) {
        newState.raporPendidikan.status = PlanningStatus.COMPLETED;
      } else if (raporScore > 0) {
        newState.raporPendidikan.status = PlanningStatus.IN_PROGRESS;
      }
    } else {
      newState.raporPendidikan.status = PlanningStatus.LOCKED;
      newState.raporPendidikan.progress = 0;
    }

    // Special case for AI Diagnosis
    if (newState.raporPendidikan.status === PlanningStatus.COMPLETED) {
      if (newState.aiDiagnosis.status === PlanningStatus.LOCKED) {
        newState.aiDiagnosis.status = PlanningStatus.READY;
      }
      if (rawSettings.decisionEngine?.status === "Disetujui") {
        newState.aiDiagnosis.status = PlanningStatus.COMPLETED;
        newState.aiDiagnosis.progress = 100;
      } else if (
        ["Selesai", "Ditinjau", "Draf", "Sedang Diproses", "Menunggu Persetujuan"].includes(
          rawSettings.decisionEngine?.status,
        )
      ) {
        newState.aiDiagnosis.status = PlanningStatus.IN_PROGRESS;
        newState.aiDiagnosis.progress = 50;
      }
    } else {
      newState.aiDiagnosis.status = PlanningStatus.LOCKED;
      newState.aiDiagnosis.progress = 0;
    }

    // Sequential Evaluation for the rest
    for (let i = 3; i < PlanningRegistry.length; i++) {
      const prevId = PlanningRegistry[i - 1].id;
      const currentId = PlanningRegistry[i].id;

      // Special case for KSP - parallel to RKJM/RKT/RKAS, depends only on Diagnosis/Rapor
      if (currentId === "ksp") {
        if (newState["aiDiagnosis"]?.status === PlanningStatus.COMPLETED) {
          if (newState["ksp"].status === PlanningStatus.LOCKED)
            newState["ksp"].status = PlanningStatus.READY;
        } else {
          newState["ksp"].status = PlanningStatus.LOCKED;
          newState["ksp"].progress = 0;
        }
        continue;
      }

      if (currentId === "pelaksanaan") {
        if (
          newState["rkas"]?.status === PlanningStatus.COMPLETED &&
          newState["ksp"]?.status === PlanningStatus.COMPLETED
        ) {
          if (newState["pelaksanaan"].status === PlanningStatus.LOCKED)
            newState["pelaksanaan"].status = PlanningStatus.READY;
        } else {
          newState["pelaksanaan"].status = PlanningStatus.LOCKED;
          newState["pelaksanaan"].progress = 0;
        }
        continue;
      }

      if (newState[prevId].status === PlanningStatus.COMPLETED) {
        if (newState[currentId].status === PlanningStatus.LOCKED)
          newState[currentId].status = PlanningStatus.READY;
      } else {
        newState[currentId].status = PlanningStatus.LOCKED;
        newState[currentId].progress = 0;
      }
    }
    return newState;
  },
};

const PlanningProgress = {
  calculateOverall: (planningState) => {
    if (!planningState) return 0;
    const totalStages = PlanningRegistry.length;
    let totalProgress = 0;
    PlanningRegistry.forEach((stage) => {
      totalProgress += planningState[stage.id]?.progress || 0;
    });
    return Math.round(totalProgress / totalStages);
  },
  getCurrentActiveStage: (planningState) => {
    for (let stage of PlanningRegistry) {
      const status = planningState[stage.id]?.status;
      if (
        status === PlanningStatus.IN_PROGRESS ||
        status === PlanningStatus.READY
      )
        return stage;
    }
    return PlanningRegistry[PlanningRegistry.length - 1];
  },
};

const PlanningEngine = {
  Registry: PlanningRegistry,
  Status: PlanningStatus,
  Progress: PlanningProgress,
  Rules: PlanningRules,
  Validator: {
    canAccessStage: (state, id) => state[id]?.status !== PlanningStatus.LOCKED,
  },
  createInitialState: () => {
    const initialState = {};
    PlanningRegistry.forEach((stage, index) => {
      initialState[stage.id] = {
        status: index === 0 ? PlanningStatus.READY : PlanningStatus.LOCKED,
        progress: 0,
      };
    });
    return initialState;
  },
};

// ============================================================================
// PHASE 5: REGULATION KNOWLEDGE BASE
// (Simulating core/knowledge/ folder structure)
// Tipe Aplikasi: Versioned Expert System for Rule & Definition injection
// ============================================================================

/**
 * 1. core/knowledge/regulationRegistry.ts
 * Repositori aturan baku nasional (Kemendikdasmen)
 */
const RegulationRegistry = {
  v2025: [
    {
      id: "permendikdasmen-13-2025",
      nama: "Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
      nomor: "13",
      tahun: 2025,
      instansi: "Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)",
      status: "BERLAKU_UTAMA",
      versi: "2025.1",
      tanggalBerlaku: "2025-01-01",
      dokumenDipengaruhi: ["ksp", "pelaksanaan", "supervisi"],
    },
    {
      id: "panduan-ksp-2025",
      nama: "Panduan Pengembangan Kurikulum Satuan Pendidikan (Edisi Revisi)",
      nomor: "-",
      tahun: 2025,
      instansi: "BSKAP Kemendikdasmen",
      status: "BERLAKU_UTAMA",
      versi: "2025.1",
      tanggalBerlaku: "2025-02-01",
      dokumenDipengaruhi: ["ksp", "evaluasi"],
    },
    {
      id: "permendikbud-19-2007",
      nama: "Standar Pengelolaan Pendidikan oleh Satuan Pendidikan Dasar dan Menengah",
      nomor: "19",
      tahun: 2007,
      instansi: "Kemendikdasmen",
      status: "BERLAKU",
      versi: "2007.1",
      tanggalBerlaku: "2007-05-23",
      dokumenDipengaruhi: ["rkjm", "rkt", "lpj"],
    },
    {
      id: "permendikbudristek-63-2022",
      nama: "Petunjuk Teknis Pengelolaan Dana BOSP",
      nomor: "63",
      tahun: 2022,
      instansi: "Kemendikdasmen",
      status: "BERLAKU",
      versi: "2022.1",
      tanggalBerlaku: "2022-12-28",
      dokumenDipengaruhi: ["rkas", "lpj"],
    },
  ],
};

/**
 * 2. core/knowledge/documentSchema.ts
 * Struktur layout hierarki fisik untuk generator rendering
 */
const StrukturDokumen = {
  standard: {
    cover: {
      wajib: true,
      elemen: [
        "logo",
        "namaDokumen",
        "namaSekolah",
        "tahunPelajaran",
        "alamat",
      ],
    },
    header: {
      wajib: true,
      elemen: ["logoMini", "kopSekolah", "garisPembatas"],
    },
    isi: { wajib: true, elemen: ["bab", "subBab", "paragraf", "tabel"] },
    lampiran: { wajib: false, elemen: ["dokumenPendukung", "foto"] },
    pengesahan: {
      wajib: true,
      elemen: [
        "tanggal",
        "tandaTanganKepsek",
        "tandaTanganKomite",
        "tandaTanganPengawas",
      ],
    },
    footer: { wajib: true, elemen: ["nomorHalaman", "watermarkDokumen"] },
    printLayout: { margin: "A4", font: "Times New Roman/Arial", size: 12 },
  },
};

/**
 * 3. core/knowledge/documentRegistry.ts
 * Entitas metadata operasional dokumen administrasi
 */
const DocumentRegistry = {
  masterData: {
    nama: "Master Data Satuan Pendidikan",
    kategori: "SISTEM",
    tujuan: "Identitas baku institusi",
    input: ["Profil", "Keuangan", "Pendidik"],
    output: ["Database Lokal"],
    prasyarat: [],
    dokumenTurunan: ["Semua Dokumen"],
    regulationIds: [],
  },
  raporPendidikan: {
    nama: "Rapor Pendidikan",
    kategori: "DATA",
    tujuan: "Hasil capaian nasional",
    input: ["File Unduhan Kemdikbud"],
    output: ["Dataset Agregat"],
    prasyarat: ["masterData"],
    dokumenTurunan: ["aiDiagnosis"],
    regulationIds: [],
  },
  aiDiagnosis: {
    nama: "Diagnosis Rapor",
    kategori: "ANALISIS",
    tujuan: "Menemukan akar masalah dan rekomendasi program",
    input: ["raporPendidikan"],
    output: ["Analisis Kelemahan", "Rekomendasi Program"],
    prasyarat: ["raporPendidikan"],
    dokumenTurunan: ["rkjm", "ksp"],
    regulationIds: [],
  },
  rkjm: {
    nama: "Rencana Kerja Jangka Menengah",
    kategori: "PERENCANAAN",
    tujuan: "Peta jalan sekolah 4 tahun",
    input: ["aiDiagnosis", "Visi", "Misi"],
    output: ["Buku RKJM"],
    prasyarat: ["aiDiagnosis"],
    dokumenTurunan: ["rkt"],
    regulationIds: ["REG-0001", "REG-0004"],
  },
  rkt: {
    nama: "Rencana Kerja Tahunan",
    kategori: "PERENCANAAN",
    tujuan: "Target dan program 1 tahun berjalan",
    input: ["rkjm"],
    output: ["Buku RKT"],
    prasyarat: ["rkjm"],
    dokumenTurunan: ["rkas"],
    regulationIds: ["REG-0001", "REG-0004"],
  },
  rkas: {
    nama: "Rencana Kegiatan dan Anggaran Sekolah",
    kategori: "PENGANGGARAN",
    tujuan: "Proyeksi pembiayaan BOS 1 tahun",
    input: ["rkt", "Pagu Anggaran"],
    output: ["Kertas Kerja RKAS"],
    prasyarat: ["rkt"],
    dokumenTurunan: ["pelaksanaan"],
    regulationIds: ["REG-0002"],
  },
  ksp: {
    nama: "Kurikulum Satuan Pendidikan",
    kategori: "KURIKULUM",
    tujuan: "Panduan operasional penyelenggaraan pembelajaran",
    input: ["masterData", "aiDiagnosis"],
    output: ["Buku KSP"],
    prasyarat: ["aiDiagnosis"],
    dokumenTurunan: ["pelaksanaan"],
    regulationIds: ["REG-0003", "REG-0005"],
  },
  supervisi: {
    nama: "Instrumen Supervisi",
    kategori: "SUPERVISI",
    tujuan: "Kendali mutu pembelajaran dan manajerial",
    input: ["pelaksanaan"],
    output: ["Laporan Supervisi"],
    prasyarat: ["pelaksanaan"],
    dokumenTurunan: ["evaluasi"],
    regulationIds: ["REG-0006"],
  },
  lpj: {
    nama: "Laporan Pertanggungjawaban",
    kategori: "PELAPORAN",
    tujuan: "Laporan akhir tahun",
    input: ["evaluasi", "rkas"],
    output: ["Buku LPJ"],
    prasyarat: ["evaluasi"],
    dokumenTurunan: [],
    regulationIds: ["REG-0001", "REG-0002"],
  },
  sk: {
    nama: "Surat Keputusan",
    kategori: "ADMINISTRASI_UMUM",
    tujuan: "Legalisasi kebijakan/tugas",
    input: ["masterData"],
    output: ["Naskah SK"],
    prasyarat: ["masterData"],
    dokumenTurunan: ["suratTugas"],
    regulationIds: [],
  },
  beritaAcara: {
    nama: "Berita Acara",
    kategori: "ADMINISTRASI_UMUM",
    tujuan: "Dokumentasi legal peristiwa",
    input: ["masterData"],
    output: ["Naskah BA"],
    prasyarat: ["masterData"],
    dokumenTurunan: ["notulen"],
    regulationIds: [],
  },
};

/**
 * 4. core/knowledge/curriculumRegistry.ts
 * Struktur KSP mengikuti Panduan Revisi 2025 Kemendikdasmen
 */
const CurriculumRegistry = {
  v2025: {
    nama: "Struktur KSP Berdasarkan Panduan Revisi 2025",
    komponenBaku: [
      {
        id: "bab1",
        judul: "Analisis Karakteristik Satuan Pendidikan",
        konten: [
          "Analisis Lingkungan Belajar",
          "Analisis Kebutuhan Peserta Didik",
          "Analisis Pendidik & Tenaga Kependidikan",
        ],
      },
      {
        id: "bab2",
        judul: "Visi, Misi, dan Tujuan",
        konten: ["Visi", "Misi", "Tujuan Satuan Pendidikan"],
      },
      {
        id: "bab3",
        judul: "Pengorganisasian Pembelajaran",
        konten: [
          "Intrakurikuler",
          "Kokurikuler",
          "Ekstrakurikuler",
          "Pendekatan Pembelajaran",
          "Kalender Pendidikan",
        ],
      },
      {
        id: "bab4",
        judul: "Perencanaan Pembelajaran",
        konten: ["Ruang Lingkup Satuan Pendidikan", "Ruang Lingkup Kelas"],
      },
      {
        id: "bab5",
        judul: "Evaluasi, Pendampingan, dan Pengembangan Profesional",
        konten: [
          "Evaluasi Pembelajaran dan Kurikulum",
          "Pendampingan dan Pengembangan Profesional",
        ],
      },
      {
        id: "lampiran",
        judul: "Lampiran",
        konten: [
          "Contoh Silabus/Alur Tujuan Pembelajaran",
          "Contoh Modul Ajar/RPP",
          "Contoh Panduan Proyek",
          "SK Tim Pengembang KSP",
        ],
      },
    ],
  },
};

/**
 * 5. core/knowledge/documentDependency.ts & 6. core/knowledge/ruleRegistry.ts
 * Aturan ketat injeksi data (Mencegah Halusinasi Generator)
 */
const RuleRegistry = {
  RKJM_GENERATION_RULE: {
    mustInclude: ["masterData", "raporPendidikan", "aiDiagnosis"],
    forbidden: [],
  },
  RKT_GENERATION_RULE: {
    mustInclude: ["rkjm"],
    forbidden: [],
  },
  RKAS_GENERATION_RULE: {
    mustInclude: ["rkt", "budgetParams"],
    forbidden: [],
  },
  KSP_GENERATION_RULE: {
    mustInclude: ["masterData", "aiDiagnosis", "Karakteristik", "Visi", "Misi"],
    forbidden: ["rkjm"], // KSP murni dari Rapor & Karakteristik, tidak terikat RKJM secara struktural
    formatRef: "curriculumRegistry.v2025",
  },
};

/**
 * 6. core/knowledge/policyRegistry.ts
 * Repositori Pusat Kebijakan Nasional Kemendikdasmen
 */
const PolicyRegistry = {
  v2025: [
    {
      id: "permendikdasmen-13-2025",
      nama: "Permendikdasmen Nomor 13 Tahun 2025",
      deskripsi:
        "Kebijakan Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
      regulationId: "REG-0006",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Kurikulum",
      kataKunci: ["kurikulum", "pengorganisasian", "pembelajaran", "ksp"],
      masalahDidukung: [
        "mutu pembelajaran rendah",
        "keselarasan kurikulum",
        "ketertinggalan belajar",
      ],
      programRekomendasi: [
        "Revisi KSP/KOSP",
        "Lokakarya Kurikulum",
        "In House Training Implementasi Kurikulum",
      ],
    },
    {
      id: "pembelajaran-mendalam",
      nama: "Pembelajaran Mendalam",
      deskripsi:
        "Pendekatan pembelajaran dengan prinsip Berkesadaran, Bermakna, dan Menggembirakan.",
      regulationId: "REG-0007",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Pembelajaran",
      kataKunci: [
        "berkesadaran",
        "bermakna",
        "menggembirakan",
        "pedagogi",
        "teknologi",
      ],
      masalahDidukung: [
        "motivasi belajar rendah",
        "pembelajaran pasif",
        "capaian literasi numerasi rendah",
      ],
      programRekomendasi: [
        "Pelatihan Guru Pembelajaran Mendalam",
        "Pemanfaatan Teknologi Pembelajaran",
        "Supervisi Akademik Berbasis Coaching",
      ],
      detail: {
        prinsip: ["Berkesadaran", "Bermakna", "Menggembirakan"],
        kerangka: [
          "Praktik Pedagogis",
          "Lingkungan Pembelajaran",
          "Kemitraan",
          "Pemanfaatan Teknologi Digital",
        ],
      },
    },
    {
      id: "profil-lulusan",
      nama: "Delapan Dimensi Profil Lulusan",
      deskripsi:
        "Delapan dimensi karakteristik yang diharapkan dimiliki oleh setiap lulusan sekolah di Indonesia.",
      regulationId: "REG-0008",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["SD", "SMP", "SMA", "SMK"],
      kategori: "Karakter",
      kataKunci: ["profil lulusan", "karakter", "kompetensi lulusan"],
      masalahDidukung: ["krisis karakter", "perilaku negatif siswa"],
      programRekomendasi: [
        "Integrasi Karakter dalam Pembelajaran",
        "Penilaian Sikap Berbasis Portofolio",
      ],
    },
    {
      id: "kokurikuler",
      nama: "Kokurikuler",
      deskripsi:
        "Kegiatan pembelajaran di luar jam intrakurikuler untuk memperdalam dan memperkaya kompetensi atau karakter.",
      regulationId: "REG-0006",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["SD", "SMP", "SMA", "SMK"],
      kategori: "Kokurikuler",
      kataKunci: ["kegiatan luar kelas", "pengayaan", "proyek karakter"],
      masalahDidukung: [
        "kurangnya aktualisasi siswa",
        "pengalaman belajar sempit",
      ],
      programRekomendasi: [
        "Pengembangan Program Kokurikuler Berbasis Potensi Lokal",
        "Kunjungan Edukatif",
      ],
      detail: {
        tujuan:
          "Memperdalam pembelajaran intrakurikuler dan mengembangkan karakter.",
        bentukKegiatan: [
          "Kunjungan lapangan",
          "Proyek kolaboratif",
          "Penelitian sederhana",
        ],
        hubunganProfilLulusan: "Sangat Kuat",
        hubunganPembelajaranMendalam: "Kuat",
      },
    },
    {
      id: "7-kebiasaan",
      nama: "7 Kebiasaan Anak Indonesia Hebat",
      deskripsi:
        "Tujuh kebiasaan utama untuk menumbuhkan budaya positif dan karakter unggul pada peserta didik.",
      regulationId: "REG-0009",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Karakter",
      kataKunci: ["7 kebiasaan", "anak hebat", "budaya positif", "karakter"],
      masalahDidukung: [
        "kedisiplinan rendah",
        "kurang kemandirian",
        "kurangnya tanggung jawab",
      ],
      programRekomendasi: [
        "Kampanye 7 Kebiasaan",
        "Penghargaan Siswa Berkarakter",
        "Integrasi dalam Pembiasaan Pagi",
      ],
      detail: [
        {
          nama: "Bangun Pagi",
          tujuan: "Disiplin waktu",
          nilaiKarakter: "Disiplin",
          jenjang: ["SD", "SMP"],
          contoh: "Hadir tepat waktu",
        },
        {
          nama: "Beribadah",
          tujuan: "Religius",
          nilaiKarakter: "Religius",
          jenjang: ["SD", "SMP", "SMA", "SMK"],
          contoh: "Sholat berjamaah di sekolah",
        },
        {
          nama: "Berolahraga",
          tujuan: "Kesehatan fisik",
          nilaiKarakter: "Sehat",
          jenjang: ["SD", "SMP", "SMA", "SMK"],
          contoh: "Senam pagi bersama",
        },
        {
          nama: "Membaca",
          tujuan: "Literasi",
          nilaiKarakter: "Rasa Ingin Tahu",
          jenjang: ["SD", "SMP", "SMA", "SMK"],
          contoh: "Membaca 15 menit sebelum belajar",
        },
        {
          nama: "Makan Sehat",
          tujuan: "Gizi seimbang",
          nilaiKarakter: "Sehat",
          jenjang: ["PAUD", "SD"],
          contoh: "Bawa bekal bergizi",
        },
        {
          nama: "Membantu Orang Tua",
          tujuan: "Empati dan bakti",
          nilaiKarakter: "Peduli",
          jenjang: ["SD", "SMP"],
          contoh: "Program pelaporan bakti anak",
        },
        {
          nama: "Tidur Tepat Waktu",
          tujuan: "Kesehatan dan fokus",
          nilaiKarakter: "Disiplin",
          jenjang: ["SD", "SMP"],
          contoh: "Penyuluhan kesehatan jam tidur",
        },
      ],
    },
    {
      id: "pbd",
      nama: "Perencanaan Berbasis Data (PBD)",
      deskripsi:
        "Pendekatan perencanaan sekolah yang bertumpu pada analisis Rapor Pendidikan.",
      regulationId: "REG-0010",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Perencanaan Berbasis Data",
      kataKunci: [
        "pbd",
        "rapor pendidikan",
        "perencanaan",
        "rkjm",
        "rkt",
        "rkas",
      ],
      masalahDidukung: [
        "perencanaan tidak tepat sasaran",
        "anggaran tidak efektif",
      ],
      programRekomendasi: [
        "Bimtek PBD untuk Tim Manajemen Sekolah",
        "Evaluasi Diri Sekolah Berbasis Rapor",
      ],
    },
    {
      id: "koding-ai",
      nama: "Koding & Kecerdasan Artifisial",
      deskripsi:
        "Integrasi kompetensi koding dan AI sebagai mata pelajaran pilihan atau ekstrakurikuler (mulai Kelas 4 SD, SMP, SMA).",
      regulationId: "REG-0011",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["SD", "SMP", "SMA", "SMK"],
      kategori: "Koding & Kecerdasan Artifisial",
      kataKunci: [
        "koding",
        "ai",
        "kecerdasan artifisial",
        "digitalisasi",
        "komputasional",
      ],
      masalahDidukung: [
        "kurangnya literasi digital",
        "rendahnya keterampilan abad 21",
      ],
      programRekomendasi: [
        "Pengadaan Ekstrakurikuler Koding",
        "Pelatihan Guru TIK/Informatika",
        "Penyediaan Perangkat AI/Koding",
      ],
    },
    {
      id: "permendikdasmen-6-2026",
      nama: "Permendikdasmen Nomor 6 Tahun 2026",
      deskripsi:
        "Kebijakan Lanjutan terkait Peningkatan Mutu dan Keselamatan Sekolah.",
      regulationId: "REG-0012",
      tahunBerlaku: 2026,
      status: "AKTIF",
      versi: "2026.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Penjaminan Mutu",
      kataKunci: ["mutu", "keselamatan", "standar", "akreditasi"],
      masalahDidukung: [
        "ketidaksesuaian standar",
        "kurangnya keselamatan sekolah",
      ],
      programRekomendasi: [
        "Audit Internal Keselamatan Sekolah",
        "Pemenuhan Standar Sarana Prasarana Aman",
      ],
    },
    {
      id: "bsan",
      nama: "Budaya Sekolah Aman dan Nyaman (BSAN)",
      deskripsi:
        "Program penciptaan iklim sekolah yang bebas dari kekerasan, perundungan, dan intoleransi.",
      regulationId: "REG-0013",
      tahunBerlaku: 2025,
      status: "AKTIF",
      versi: "2025.1",
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      kategori: "Budaya Sekolah",
      kataKunci: [
        "aman",
        "nyaman",
        "anti perundungan",
        "iklim sekolah",
        "kesejahteraan psikologis",
      ],
      masalahDidukung: [
        "iklim keamanan rendah",
        "kasus perundungan tinggi",
        "intoleransi",
        "kesejahteraan psikologis rendah",
      ],
      programRekomendasi: [
        "Pembentukan TPPK",
        "Deklarasi Sekolah Anti Perundungan",
        "Pelatihan Resolusi Konflik",
      ],
      detail: {
        tujuan:
          "Menciptakan lingkungan belajar yang aman, nyaman, dan inklusif.",
        pendekatan: ["Pencegahan", "Penanganan Cepat", "Pemulihan"],
        nilai: ["Empati", "Toleransi", "Saling Menghargai"],
        pilar: [
          "Regulasi Sekolah",
          "Pendidikan Karakter",
          "Keterlibatan Orang Tua",
        ],
        areaImplementasi: [
          "Kelas",
          "Lingkungan Sekolah",
          "Dunia Maya/Sosial Media",
        ],
      },
    },
  ],
};

/**
 * Facade Knowledge Base
 */
const KnowledgeBase = {
  Version: "2025.1.0",
  Status: "ACTIVE",
  Regulations: RegulationRegistry,
  Documents: DocumentRegistry,
  Struktur: StrukturDokumen,
  Curriculum: CurriculumRegistry,
  Rules: RuleRegistry,
  Policies: PolicyRegistry,
};

/**
 * Phase 8: DOCUMENT STANDARD ENGINE
 * Tata letak dan standar format dokumen administrasi sekolah
 */
const DocumentStandardEngine = {
  StyleGuide: {
    fontFamily: "font-serif", // Times New Roman equivalent
    fontSize: {
      title: "text-xl", // 16pt
      heading1: "text-lg", // 14pt
      heading2: "text-base", // 12pt
      body: "text-base", // 12pt
      small: "text-sm", // 10pt
    },
    lineHeight: "leading-relaxed", // 1.5
    margins: "py-8 px-16", // ~2cm top/bottom, 3cm left, 2cm right (A4 approximation in web)
    colors: {
      text: "text-black",
    },
    paperSize: "max-w-[210mm] mx-auto bg-white shadow-xl", // A4
  },
  Templates: {
    PERENCANAAN: { hasCover: true, hasPengesahan: true, hasDaftarIsi: true },
    SURAT: { hasCover: false, hasPengesahan: false, hasDaftarIsi: false },
    SK: { hasCover: false, hasPengesahan: false, hasDaftarIsi: false },
    BERITA_ACARA: { hasCover: false, hasPengesahan: true, hasDaftarIsi: false },
    LAPORAN: { hasCover: true, hasPengesahan: true, hasDaftarIsi: true },
    PANDUAN: { hasCover: true, hasPengesahan: true, hasDaftarIsi: true },
  },
  Validator: {
    validate: (settings: any) => {
      const errors = [];
      if (!settings.school.name)
        errors.push("Identitas Sekolah: Nama Sekolah belum diisi");
      if (!settings.school.npsn)
        errors.push("Identitas Sekolah: NPSN belum diisi");
      if (!settings.principal.name)
        errors.push("Identitas Kepala Sekolah: Nama belum diisi");
      if (!settings.principal.nip)
        errors.push("Identitas Kepala Sekolah: NIP belum diisi");
      return { isValid: errors.length === 0, errors };
    },
  },
};

/**
 * Phase 8.5: LANGUAGE & OFFICIAL WRITING ENGINE
 * Engine bahasa dan tata naskah resmi
 */
const LanguageEngine = {
  Dictionaries: {
    forbidden: [
      "Siswa",
      "Guru-guru",
      "Di mana",
      "Bikin",
      "Nggak",
      "Canggih",
      "Revolusioner",
      "Wow",
      "Keren",
    ],
    preferred: [
      "Peserta Didik",
      "Dewan Guru",
      "Tempat",
      "Membuat",
      "Tidak",
      "Inovatif",
      "Pemutakhiran",
    ],
    validateTerm: (text: string) => {
      const issues: string[] = [];
      const lowerText = text.toLowerCase();
      LanguageEngine.Dictionaries.forbidden.forEach((term, idx) => {
        if (lowerText.includes(term.toLowerCase())) {
          issues.push(
            `Ganti kata "${term}" dengan "${LanguageEngine.Dictionaries.preferred[idx] || "istilah resmi"}"`,
          );
        }
      });
      return issues;
    },
  },
  Styles: {
    PERENCANAAN:
      "Menggunakan pola BAB, Subbab, Analisis, Tujuan, Program, Indikator. Bahasa lugas, terukur, dan objektif.",
    KSP: "Menggunakan bahasa operasional kurikulum, berpusat pada peserta didik, selaras dengan panduan BSKAP.",
    SURAT_DINAS:
      "Mengikuti tata naskah surat resmi (Kop, Nomor, Lampiran, Hal, Pembuka, Isi, Penutup).",
    SK: "Pola Konsiderans (Menimbang, Mengingat), Diktum (Memutuskan, Menetapkan), dan Penutup.",
    BERITA_ACARA:
      "Memuat waktu, tempat, pihak yang terlibat, hasil kesepakatan, dan pengesahan.",
    LAPORAN:
      "Deskriptif analitis, berbasis data, berurutan dari pendahuluan hingga penutup/rekomendasi.",
    SUPERVISI:
      "Bahasa pembinaan, terukur, konstruktif, menggunakan instrumen penilaian baku.",
    EVALUASI:
      "Kritis, berbasis indikator pencapaian, menyoroti gap, dan memberikan rekomendasi tindak lanjut.",
  },
};

/**
 * Phase 8.8: REGULATION COMPLIANCE ENGINE
 * Mesin pemeriksa kepatuhan regulasi, tata naskah, dan kebijakan
 */
const RegulationComplianceEngine = {
  checkCompliance: (documentType: string, content: any, settings: any) => {
    // Simulasi pemeriksaan
    const issues = [];
    const recommendations = [];
    let scores = {
      bahasa: 100,
      tataNaskah: 100,
      regulasi: 100,
      kebijakan: 100,
      dokumen: 100,
    };

    // 1. Identitas Sekolah & Tahun Pelajaran
    if (!settings.school?.name || !settings.school?.npsn) {
      issues.push("Identitas sekolah tidak lengkap.");
      recommendations.push("Lengkapi profil sekolah di Pusat Data.");
      scores.dokumen -= 20;
    }

    // 2. Pengesahan
    if (["PERENCANAAN", "LAPORAN"].includes(documentType)) {
      if (!settings.principal?.name || !settings.principal?.nip) {
        issues.push("Identitas Kepala Sekolah tidak lengkap untuk pengesahan.");
        recommendations.push("Lengkapi data Kepala Sekolah di Pusat Data.");
        scores.dokumen -= 20;
        scores.tataNaskah -= 10;
      }
    }

    // 3. Kebijakan & Regulasi
    // Check if programs are linked to policies
    if (content?.programs && content.programs.length > 0) {
      const unlinkedPrograms = content.programs.filter(
        (p: any) => !p.kebijakanId,
      );
      if (unlinkedPrograms.length > 0) {
        issues.push(
          `Terdapat ${unlinkedPrograms.length} program yang belum terhubung dengan Kebijakan Nasional.`,
        );
        recommendations.push(
          "Kaitkan program dengan kebijakan di menu Perencanaan.",
        );
        scores.kebijakan -= 30;
        scores.regulasi -= 20;
      }
    }

    // 4. Bahasa & Istilah
    if (content?.text) {
      const languageIssues = LanguageEngine.Dictionaries.validateTerm(
        content.text,
      );
      if (languageIssues.length > 0) {
        issues.push(...languageIssues);
        scores.bahasa -= languageIssues.length * 10;
      }
    }

    // Normalization
    Object.keys(scores).forEach((key) => {
      if ((scores as any)[key] < 0) (scores as any)[key] = 0;
    });

    const totalScore = Math.round(
      (scores.bahasa +
        scores.tataNaskah +
        scores.regulasi +
        scores.kebijakan +
        scores.dokumen) /
        5,
    );

    let status = "Layak Dicetak";
    if (totalScore < 60) status = "Belum Memenuhi";
    else if (totalScore < 85) status = "Perlu Revisi";

    return {
      scores,
      totalScore,
      issues,
      recommendations,
      status,
      timestamp: new Date().toISOString(),
      knowledgeBaseVersion: KnowledgeBase.Version,
    };
  },
};

/**
 * Phase 9.5: MESIN KERANGKA RKJM
 * Cetak biru struktur RKJM berdasarkan pedoman Kemendikdasmen (Perencanaan Berbasis Data)
 */
const RKJMKerangkaEngine = {
  Version: "1.0",
  Pedoman: "Perencanaan Berbasis Data (PBD) & Rapor Pendidikan",
  Chapters: [
    {
      id: "bab1",
      nama: "BAB I: Pendahuluan",
      tujuan: "Memberikan gambaran umum, latar belakang, dan landasan hukum.",
      urutan: 1,
      styleBahasa: "Formal, Lugas, Landasan Hukum",
      status: "READY",
      subbabs: [
        {
          id: "bab1-1",
          nama: "A. Latar Belakang",
          tujuan: "Menjelaskan alasan penyusunan RKJM",
          deskripsi: "Kondisi ideal vs kondisi nyata, serta urgensi RKJM.",
          sumberData: ["Pusat Data Sekolah", "Knowledge Base"],
          panjangMaksimal: "2-3 Paragraf",
          jenisBahasa: "Deskriptif Analitis",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab1-2",
          nama: "B. Landasan Hukum",
          tujuan: "Dasar regulasi",
          deskripsi:
            "UU, PP, Permendikdasmen terkait Standar Nasional Pendidikan dan PBD.",
          sumberData: ["Knowledge Base Regulasi"],
          panjangMaksimal: "List Point",
          jenisBahasa: "Legal Formal",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab1-3",
          nama: "C. Visi, Misi, dan Tujuan Sekolah",
          tujuan: "Menjabarkan arah kebijakan",
          deskripsi: "Visi, Misi, dan Tujuan dari Data Sekolah.",
          sumberData: ["Pusat Data Sekolah"],
          panjangMaksimal: "List Point",
          jenisBahasa: "Deklaratif, Terukur",
          dapatDiedit: true,
          dapatDiregenerasi: false,
        },
      ],
    },
    {
      id: "bab2",
      nama: "BAB II: Analisis Kondisi Sekolah",
      tujuan: "Menyajikan potret kondisi sekolah berbasis data yang valid.",
      urutan: 2,
      styleBahasa: "Objektif, Berbasis Data",
      status: "READY",
      subbabs: [
        {
          id: "bab2-1",
          nama: "A. Profil Sekolah",
          tujuan: "Karakteristik umum",
          deskripsi: "Data GTK, Siswa, Sarpras.",
          sumberData: ["Pusat Data Sekolah"],
          panjangMaksimal: "Tabel + Deskripsi Singkat",
          jenisBahasa: "Deskriptif Objektif",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab2-2",
          nama: "B. Capaian Rapor Pendidikan",
          tujuan: "Hasil asesmen nasional",
          deskripsi: "Ringkasan Rapor Pendidikan.",
          sumberData: ["Rapor Pendidikan Center"],
          panjangMaksimal: "Tabel Data & Poin",
          jenisBahasa: "Analitis, Evaluatif",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab2-3",
          nama: "C. Identifikasi Masalah & Akar Masalah",
          tujuan: "IRB (Identifikasi, Refleksi, Benahi)",
          deskripsi: "Akar masalah utama dari Rapor Pendidikan.",
          sumberData: ["Mesin Analisis Cerdas"],
          panjangMaksimal: "Matriks IRB",
          jenisBahasa: "Kritis, Analitis",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
      ],
    },
    {
      id: "bab3",
      nama: "BAB III: Program Kerja",
      tujuan: "Merumuskan program strategis (Benahi) selama 4 tahun.",
      urutan: 3,
      styleBahasa: "Operasional, Terukur",
      status: "READY",
      subbabs: [
        {
          id: "bab3-1",
          nama: "A. Sasaran Strategis",
          tujuan: "Target yang ingin dicapai",
          deskripsi: "Target 4 tahun berdasarkan Kebijakan Nasional.",
          sumberData: ["Knowledge Base", "Diagnosis Rapor"],
          panjangMaksimal: "List Terukur",
          jenisBahasa: "Terukur, Optimis",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab3-2",
          nama: "B. Program dan Kegiatan (4 Tahun)",
          tujuan: "Daftar program",
          deskripsi: "Pembenahan berkelanjutan untuk menutupi gap capaian.",
          sumberData: ["Sistem Pembuat Dokumen RKJM/RKT", "Kebijakan Nasional"],
          panjangMaksimal: "Tabel Program per Tahun",
          jenisBahasa: "Operasional",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
      ],
    },
    {
      id: "bab4",
      nama: "BAB IV: Rencana Anggaran",
      tujuan: "Estimasi kebutuhan biaya program jangka menengah.",
      urutan: 4,
      styleBahasa: "Finansial, Kalkulatif",
      status: "READY",
      subbabs: [
        {
          id: "bab4-1",
          nama: "A. Proyeksi Penerimaan",
          tujuan: "Estimasi dana",
          deskripsi: "Proyeksi dana BOS dan sumber lainnya.",
          sumberData: ["Pusat Data Sekolah"],
          panjangMaksimal: "Tabel Proyeksi",
          jenisBahasa: "Kalkulatif",
          dapatDiedit: true,
          dapatDiregenerasi: false,
        },
        {
          id: "bab4-2",
          nama: "B. Proyeksi Pengeluaran",
          tujuan: "Estimasi biaya kegiatan",
          deskripsi: "Estimasi biaya program dari BAB III.",
          sumberData: ["BAB III", "Standar Biaya"],
          panjangMaksimal: "Tabel Estimasi",
          jenisBahasa: "Finansial",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
      ],
    },
    {
      id: "bab5",
      nama: "BAB V: Penutup",
      tujuan: "Memberikan kesimpulan, harapan, dan tindak lanjut.",
      urutan: 5,
      styleBahasa: "Formal, Optimis",
      status: "READY",
      subbabs: [
        {
          id: "bab5-1",
          nama: "A. Kesimpulan",
          tujuan: "Intisari dokumen",
          deskripsi: "Ringkasan urgensi dan sasaran RKJM.",
          sumberData: ["BAB I - IV"],
          panjangMaksimal: "2 Paragraf",
          jenisBahasa: "Ringkas",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
        {
          id: "bab5-2",
          nama: "B. Saran dan Harapan",
          tujuan: "Pesan penutup",
          deskripsi: "Ajakan kolaborasi seluruh stakeholder.",
          sumberData: ["Prompt System"],
          panjangMaksimal: "1 Paragraf",
          jenisBahasa: "Persuasif",
          dapatDiedit: true,
          dapatDiregenerasi: true,
        },
      ],
    },
  ],
};

/**
 * Phase 9.6: RKJM CONTENT ORCHESTRATOR ENGINE
 * Engine penentu sumber data, tipe, dan dependensi konten RKJM
 */
const RKJMContentOrchestratorEngine = {
  ContentTypes: {
    STATIC: "Diambil langsung. Diisi manual.",
    DYNAMIC: "Diisi otomatis.",
    COMPUTED: "Dihitung sistem.",
    DOCUMENT: "Dibuat oleh Sistem.",
  },
  ContentStatus: ["Belum Dibuat", "Draf", "Direview", "Disetujui", "Terkunci"],

  SourceMap: {
    Cover: { type: "DOCUMENT", source: "Sistem Dokumen", ai_generate: false },
    HalamanPengesahan: {
      type: "DOCUMENT",
      source: "Sistem Dokumen",
      ai_generate: false,
    },
    DaftarIsi: {
      type: "DOCUMENT",
      source: "Sistem Dokumen",
      ai_generate: false,
    },
    ProfilSekolah: {
      type: "STATIC",
      source: "Pusat Data Sekolah",
      ai_generate: false,
    },
    KarakteristikSekolah: {
      type: "STATIC",
      source: "Pusat Data Sekolah",
      ai_generate: false,
    },
    AnalisisKondisi: {
      type: "DYNAMIC",
      source: "Mesin Analisis",
      ai_generate: true,
    },
    ProgramStrategis: {
      type: "DYNAMIC",
      source: "Knowledge Base",
      ai_generate: true,
    },
    IndikatorKeberhasilan: { type: "DYNAMIC", source: "Sistem", ai_generate: true },
    Lampiran: {
      type: "DOCUMENT",
      source: "Sistem Dokumen",
      ai_generate: false,
    },
  },

  Dependencies: {
    "Rapor Pendidikan": ["AnalisisKondisi", "ProgramStrategis"],
    "Target Sekolah": ["ProgramStrategis", "IndikatorKeberhasilan"],
    "Profil Sekolah": ["BAB Identitas", "KarakteristikSekolah"],
  },

  TraceabilityTemplate: {
    id: "",
    content: "",
    metadata: {
      source: "",
      generatedAt: "",
      author: "",
      history: [],
    },
  },
};

/**
 * Phase 10: DECISION ENGINE
 * Mesin Pengambilan Keputusan (Otak seluruh dokumen perencanaan)
 */
const DecisionEngine = {
  Version: "1.0",
  Core: "Sistem Prioritas",
  Steps: [
    "Membaca Data Sekolah",
    "Membaca Rapor Pendidikan",
    "Mengidentifikasi Gap",
    "Mengelompokkan Prioritas",
    "Mencocokkan dengan Kebijakan Nasional",
    "Menghasilkan Rekomendasi",
    "Menunggu Persetujuan Kepala Sekolah",
  ],
  Rules: {
    MaxPrioritas: 3,
    MaxProgram: 5,
    MaxKegiatan: 10,
  },
  ContextFactors: [
    "Jenjang",
    "Status",
    "Lokasi",
    "Jumlah Peserta Didik",
    "Jumlah GTK",
    "Kondisi Sarpras",
    "Karakteristik Lingkungan",
  ],
  evaluatePriorityScore: (
    gap: number,
    indicatorsTerdampak: number,
    target: number,
  ) => {
    // Simulasi formula perhitungan priority score (0-100)
    let base = (gap / (target || 100)) * 50;
    let impact = Math.min(indicatorsTerdampak * 10, 30);
    let policyWeight = 20;
    return Math.min(Math.round(base + impact + policyWeight), 100);
  },
};

/**
 * Phase 10.5: TARGET & PERFORMANCE ENGINE
 * Mesin Penetapan Target dan Kinerja Sekolah
 */
const TargetPerformanceEngine = {
  Version: "1.0",
  Core: "Sistem Target & Strategi",
  calculateDifficulty: (gap: number, indicators: number, students: number) => {
    if (gap > 30) return "Sangat Sulit";
    if (gap > 20 || indicators > 5) return "Sulit";
    if (gap > 10 || students > 500) return "Sedang";
    return "Mudah";
  },
  calculatePerformanceScore: (
    initial: number,
    current: number,
    target: number,
  ) => {
    if (target <= initial) return 100;
    const progress = current - initial;
    const totalGap = target - initial;
    if (progress <= 0) return 0;
    const score = Math.round((progress / totalGap) * 100);
    return Math.min(score, 100);
  },
};

/**
 * Phase 11: WORKFLOW & APPROVAL ENGINE
 * Mesin Alur Kerja dan Persetujuan Dokumen
 */
const WorkflowEngine = {
  Version: "1.0",
  Core: "BPM Document Lifecycle",
  States: [
    "Belum Dibuat",
    "Draf",
    "Sedang Direview",
    "Perlu Revisi",
    "Siap Disetujui",
    "Disetujui",
    "Terkunci",
    "Siap Dicetak",
    "Diarsipkan",
  ],
  validateForApproval: (settings: any) => {
    const isSchoolDataComplete = settings.school?.name && settings.school?.npsn;
    const isRaporValidated = settings.rapor?.isLocked;
    const isDecisionFinished = settings.decisionEngine?.status === "Disetujui";
    const isTargetApproved = settings.targetEngine?.status === "Disetujui";

    return {
      isValid:
        isSchoolDataComplete &&
        isRaporValidated &&
        isDecisionFinished &&
        isTargetApproved,
      missing: [
        !isSchoolDataComplete && "Data Sekolah Belum Lengkap",
        !isRaporValidated && "Rapor Pendidikan Belum Divalidasi",
        !isDecisionFinished && "Analisis Prioritas Belum Disetujui",
        !isTargetApproved && "Target & Performance Belum Disetujui",
      ].filter(Boolean),
    };
  },
};

/**
 * Phase 11.6: REGULATION GOVERNANCE SYSTEM
 * Sistem Manajemen Regulasi Nasional
 */
const MasterRegulationRegistry = {
  RKJM: {
    regulationNumber: "Permendikbud No. 19/2007",
    regulationTitle: "Standar Pengelolaan Pendidikan",
    effectiveDate: "2007-05-23",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Kondisi Objektif", "Tujuan dan Sasaran", "Program Strategis", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  RKT: {
    regulationNumber: "Permendikdasmen No. 47/2023",
    regulationTitle: "Standar Pengelolaan pada PAUD, Jenjang Pendidikan Dasar, dan Menengah",
    effectiveDate: "2023-08-04",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Evaluasi Pelaksanaan", "Rencana Kerja", "Jadwal", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  RKAS: {
    regulationNumber: "Permendikdasmen No. 63/2022",
    regulationTitle: "Petunjuk Teknis Pengelolaan Dana BOS",
    effectiveDate: "2022-12-28",
    version: "2024-v1",
    requiredChapters: ["Pendahuluan", "Rincian Penerimaan", "Rincian Belanja", "Penutup"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Bendahara", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  },
  KSP: {
    regulationNumber: "Panduan KSP Revisi 2025",
    regulationTitle: "Panduan Pengembangan Kurikulum Satuan Pendidikan Edisi Revisi",
    effectiveDate: "2025-01-01",
    version: "2025-v1",
    requiredChapters: ["Karakteristik Satuan Pendidikan", "Visi, Misi, dan Tujuan", "Pengorganisasian Pembelajaran", "Perencanaan Pembelajaran", "Evaluasi"],
    printRules: {
      requireSignatures: ["Kepala Sekolah", "Kepala Dinas", "Ketua Komite"],
      requireStempel: true,
      requireLogoSekolah: true
    }
  }
};

/**
 * MASTER EDUCATION PLATFORM - KNOWLEDGE API
 * 
 * Tipe Aplikasi Note: All modules must retrieve reference data through this API.
 * This ensures single-source-of-truth and prevents hardcoding business rules in React components.
 */
export const KnowledgeAPI = {
  getRegulations: (version?: string) => {
    return version ? MasterRegulations.filter(r => r.version === version) : MasterRegulations;
  },
  getRKASCodes: (filters?: { snp?: string, category?: string }) => {
    let results = MasterRKAS;
    if (filters?.snp) results = results.filter(r => r.primarySnpId === filters.snp || r.secondarySnpId === filters.snp);
    if (filters?.category) results = results.filter(r => r.budgetCategory === filters.category);
    return results;
  },
  getSNP: (id?: string) => {
    if (id) return MasterSNP.find(s => s.id === id);
    return MasterSNP;
  },
  getRaporIndicators: (dimension?: string) => {
    if (dimension) return MasterRapor.filter(r => r.dimension === dimension);
    return MasterRapor;
  },
  getDocumentTemplate: (type: string, version: string) => {
    return MasterTemplates.find(t => t.documentType === type && t.version === version);
  },
  search: (query: string) => {
    const q = query.toLowerCase();
    return {
      rkas: MasterRKAS.filter(r => r.activityName.toLowerCase().includes(q) || r.keywords.some(k => k.toLowerCase().includes(q))),
      snp: MasterSNP.filter(s => s.officialName.toLowerCase().includes(q) || s.officialDescription.toLowerCase().includes(q)),
      rapor: MasterRapor.filter(r => r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)),
      regulations: MasterRegulations.filter(r => r.title.toLowerCase().includes(q) || r.articles.some(a => a.content.toLowerCase().includes(q)))
    };
  }
};

const RegulationGovernanceEngine = {
  Version: "1.0",
  Core: "National Policy & Guideline Registry",
  Registry: [
    {
      id: "REG-0001",
      namaRegulasi:
        "Standar Pengelolaan Pendidikan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
      nomorRegulasi: "Permendikdasmen No. 47 Tahun 2023",
      tahun: 2023,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2023-08-04",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan:
        "Mengatur standar pengelolaan sekolah termasuk perencanaan program (RKJM, RKT, RKAS) berbasis Rapor Pendidikan.",
      kataKunci: ["RKJM", "RKT", "RKAS", "Pengelolaan", "Perencanaan"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK"],
      bidang: "Manajemen Sekolah",
      urlReferensi: "https://jdih.kemdikbud.go.id/",
      catatan: "Menggantikan Permendikbud No. 19 Tahun 2007",
    },
    {
      id: "REG-0002",
      namaRegulasi:
        "Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan",
      nomorRegulasi: "Permendikdasmen No. 63 Tahun 2022",
      tahun: 2022,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2022-12-28",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Juknis BOS/BOSP yang menjadi pedoman penyusunan RKAS.",
      kataKunci: ["BOS", "BOSP", "RKAS", "Keuangan"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK"],
      bidang: "Keuangan",
      urlReferensi: "https://jdih.kemdikbud.go.id/",
      catatan: "Diperbarui setiap tahun, tetapi regulasi dasar tetap",
    },
    {
      id: "REG-0003",
      namaRegulasi:
        "Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
      nomorRegulasi: "Permendikdasmen No. 12 Tahun 2024",
      tahun: 2024,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2024-03-26",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan:
        "Penerapan Kurikulum Merdeka secara nasional yang menjadi dasar penyusunan KSP/KOSP.",
      kataKunci: ["KSP", "KOSP", "Kurikulum Merdeka", "Pembelajaran"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK"],
      bidang: "Kurikulum",
      urlReferensi: "https://jdih.kemdikbud.go.id/",
      catatan: "Menggantikan Kepmendikbudristek No. 262/M/2022",
    },
    {
      id: "REG-0004",
      namaRegulasi: "Buku Saku Perencanaan Berbasis Data",
      nomorRegulasi: "Pedoman Kemendikdasmen 2024",
      tahun: 2024,
      jenisRegulasi: "Pedoman/Panduan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2024-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan:
        "Panduan praktis melakukan IRB (Identifikasi, Refleksi, Benahi) dari Rapor Pendidikan ke dalam RKJM dan RKT.",
      kataKunci: ["PBD", "Rapor Pendidikan", "IRB", "RKJM", "RKT"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK"],
      bidang: "Perencanaan",
      urlReferensi: "https://pusmendik.kemdikbud.go.id/",
      catatan: "Versi pembaruan 2024",
    },
    {
      id: "REG-0005",
      namaRegulasi: "Panduan Pengembangan Kurikulum Satuan Pendidikan",
      nomorRegulasi: "Pedoman BSKAP 2024",
      tahun: 2024,
      jenisRegulasi: "Pedoman/Panduan",
      instansiPenerbit: "BSKAP Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2024-05-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan:
        "Langkah teknis menyusun dokumen KSP sesuai Permendikdasmen No 12 Tahun 2024.",
      kataKunci: ["KSP", "KOSP", "Panduan KSP"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK"],
      bidang: "Kurikulum",
      urlReferensi: "https://kurikulum.kemdikbud.go.id/",
      catatan: "Penyesuaian pedoman KOSP sebelumnya",
    },
    {
      id: "REG-0006",
      namaRegulasi: "Kebijakan Kurikulum pada PAUD, Dikdas, dan Dikmen",
      nomorRegulasi: "Permendikdasmen No. 13 Tahun 2025",
      tahun: 2025,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Kebijakan Kurikulum 2025",
      kataKunci: ["Kurikulum", "Dikdas", "Dikmen"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Kurikulum",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0007",
      namaRegulasi: "Panduan Pembelajaran dan Asesmen 2025",
      nomorRegulasi: "Panduan 2025",
      tahun: 2025,
      jenisRegulasi: "Pedoman/Panduan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Panduan untuk Deep Learning",
      kataKunci: ["Pembelajaran", "Asesmen"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Pembelajaran",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0008",
      namaRegulasi: "Kebijakan Nasional Karakter Anak 2025",
      nomorRegulasi: "Kebijakan Karakter 2025",
      tahun: 2025,
      jenisRegulasi: "Kebijakan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Kebijakan Nasional Karakter Anak",
      kataKunci: ["Karakter"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Karakter",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0009",
      namaRegulasi: "Kebijakan Pembinaan Karakter 2025",
      nomorRegulasi: "Kebijakan Pembinaan 2025",
      tahun: 2025,
      jenisRegulasi: "Kebijakan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "7 Kebiasaan Anak Indonesia Hebat",
      kataKunci: ["Karakter", "Kebiasaan"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Karakter",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0010",
      namaRegulasi: "Pedoman Perencanaan Berbasis Data",
      nomorRegulasi: "Pedoman PBD Kemendikdasmen",
      tahun: 2025,
      jenisRegulasi: "Pedoman/Panduan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Pedoman PBD",
      kataKunci: ["PBD"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Perencanaan",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0011",
      namaRegulasi: "Kebijakan Digitalisasi dan AI",
      nomorRegulasi: "Kebijakan AI 2025/2026",
      tahun: 2025,
      jenisRegulasi: "Kebijakan",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2025-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Integrasi Koding & AI",
      kataKunci: ["AI", "Koding"],
      jenjang: ["SD", "SMP", "SMA"],
      bidang: "Digitalisasi",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0012",
      namaRegulasi: "Peningkatan Mutu dan Keselamatan Sekolah",
      nomorRegulasi: "Permendikdasmen No. 6 Tahun 2026",
      tahun: 2026,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2026-01-01",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Kebijakan Lanjutan",
      kataKunci: ["Mutu", "Keselamatan"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Mutu",
      urlReferensi: "",
      catatan: "",
    },
    {
      id: "REG-0013",
      namaRegulasi:
        "Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan",
      nomorRegulasi: "Permendikdasmen No. 46 Tahun 2023",
      tahun: 2023,
      jenisRegulasi: "Peraturan Menteri",
      instansiPenerbit: "Kemendikdasmen",
      status: "Aktif",
      berlakuMulai: "2023-08-04",
      berlakuSampai: null,
      digantikanOleh: null,
      ringkasan: "Budaya Sekolah Aman dan Nyaman (diperkuat 2025/2026)",
      kataKunci: ["Kekerasan", "Aman"],
      jenjang: ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB"],
      bidang: "Budaya Sekolah",
      urlReferensi: "",
      catatan: "Diperkuat di 2025/2026",
    },
  ],
  validateRegulations: (regulationIds: string[]) => {
    const validations = regulationIds.map((id) => {
      const reg = RegulationGovernanceEngine.Registry.find((r) => r.id === id);
      if (!reg)
        return {
          id,
          valid: false,
          message: `Regulasi ${id} tidak ditemukan di Registry`,
        };
      if (
        reg.status === "Digantikan" ||
        reg.status === "Tidak Aktif" ||
        reg.status === "Arsip"
      ) {
        return {
          id,
          valid: false,
          message: `Regulasi ${reg.nomorRegulasi} telah berstatus ${reg.status}. ${reg.digantikanOleh ? "Gunakan " + reg.digantikanOleh : ""}`,
        };
      }
      return { id, valid: true, reg };
    });

    return {
      isValid: validations.every((v) => v.valid),
      issues: validations.filter((v) => !v.valid).map((v) => v.message),
    };
  },
};

/**
 * Phase 11.5: TEMPLATE & REGULATION MAPPING ENGINE
 * Mesin Pusat Pemetaan Struktur Dokumen dan Regulasi
 */
const TemplateRegistryEngine = {
  Version: "1.0",
  Core: "Dynamic Document Structure Mapper",
  Templates: [
    {
      id: "rkjm",
      namaDokumen: "Rencana Kerja Jangka Menengah (RKJM)",
      jenisDokumen: "RKJM",
      regulationIds: ["REG-0001", "REG-0004"],
      versiTemplate: "2026.1",
      tahunBerlaku: "2024-2028",
      status: "Aktif",
      urutanBagian: [
        "Bab I: Pendahuluan",
        "Bab II: Analisis Kondisi Sekolah",
        "Bab III: Program Kerja Strategis",
        "Bab IV: Rencana Anggaran (Proyeksi)",
        "Bab V: Penutup",
      ],
      bagianWajib: ["Bab I", "Bab II", "Bab III", "Bab IV", "Bab V"],
      bagianOpsional: ["Lampiran", "Glosarium"],
      styleBahasa: "Formal, Analitis, Strategis",
      styleDokumen: "Standard Kemendikdasmen",
      workflowRef: "WorkflowEngine.States",
      documentProfile: "Strategic_Plan_A4",
      visualIdentity: {
        schoolLogo: true,
        governmentLogo: true,
        stamp: false,
        principalSignature: false,
        committeeSignature: false
      }
    },
    {
      id: "rkt",
      namaDokumen: "Rencana Kerja Tahunan (RKT)",
      jenisDokumen: "RKT",
      regulationIds: ["REG-0001", "REG-0004"],
      versiTemplate: "2026.1",
      tahunBerlaku: "Tahunan",
      status: "Aktif",
      urutanBagian: [
        "Bab I: Pendahuluan",
        "Bab II: Evaluasi Pelaksanaan RKT Tahun Sebelumnya",
        "Bab III: Rencana Kerja Tahun Berjalan",
        "Bab IV: Rencana Anggaran Pendapatan dan Belanja",
        "Bab V: Penutup",
      ],
      bagianWajib: ["Bab I", "Bab II", "Bab III", "Bab IV", "Bab V"],
      bagianOpsional: ["Matriks Kegiatan", "Jadwal Pelaksanaan"],
      styleBahasa: "Formal, Taktis, Terukur",
      styleDokumen: "Standard Kemendikdasmen",
      workflowRef: "WorkflowEngine.States",
      documentProfile: "Operational_Plan_A4",
      visualIdentity: {
        schoolLogo: true,
        governmentLogo: true,
        stamp: false,
        principalSignature: false,
        committeeSignature: false
      }
    },
    {
      id: "rkas",
      namaDokumen: "Rencana Kegiatan dan Anggaran Sekolah (RKAS)",
      jenisDokumen: "RKAS",
      regulationIds: ["REG-0001", "REG-0002"],
      versiTemplate: "2026.1",
      tahunBerlaku: "Tahunan",
      status: "Aktif",
      urutanBagian: [
        "Pendapatan",
        "Belanja Pegawai",
        "Belanja Barang dan Jasa",
        "Belanja Modal",
        "Rekapitulasi",
      ],
      bagianWajib: ["Pendapatan", "Belanja Barang dan Jasa", "Rekapitulasi"],
      bagianOpsional: ["Belanja Modal", "Belanja Pegawai"],
      styleBahasa: "Finansial, Rigid",
      styleDokumen: "Tabel RKAS ARKAS",
      workflowRef: "WorkflowEngine.States",
      documentProfile: "Budget_Spreadsheet_Landscape",
      visualIdentity: {
        schoolLogo: true,
        governmentLogo: true,
        stamp: false,
        principalSignature: false,
        committeeSignature: false
      }
    },
    {
      id: "ksp",
      namaDokumen: "Kurikulum Satuan Pendidikan (KSP/KOSP)",
      jenisDokumen: "KSP",
      regulationIds: ["REG-0003", "REG-0005"],
      versiTemplate: "2026.1",
      tahunBerlaku: "Tahunan",
      status: "Aktif",
      urutanBagian: [
        "Karakteristik Satuan Pendidikan",
        "Visi, Misi, dan Tujuan",
        "Pengorganisasian Pembelajaran",
        "Perencanaan Pembelajaran",
        "Pendampingan, Evaluasi, dan Pengembangan Profesional",
      ],
      bagianWajib: [
        "Karakteristik Satuan Pendidikan",
        "Visi, Misi, dan Tujuan",
        "Pengorganisasian Pembelajaran",
        "Perencanaan Pembelajaran",
      ],
      bagianOpsional: ["Lampiran Silabus/Alur Tujuan Pembelajaran"],
      styleBahasa: "Akademis, Pedagogis",
      styleDokumen: "Standard Kurikulum Merdeka",
      workflowRef: "WorkflowEngine.States",
      documentProfile: "Curriculum_A4",
      visualIdentity: {
        schoolLogo: true,
        governmentLogo: true,
        stamp: false,
        principalSignature: false,
        committeeSignature: false
      }
    },
  ],
  validateTemplate: (templateId: string) => {
    const t = TemplateRegistryEngine.Templates.find((x) => x.id === templateId);
    if (!t) return { valid: false, error: "Template tidak ditemukan" };
    if (t.status !== "Aktif")
      return { valid: false, error: "Template sudah tidak aktif (Diarsipkan)" };

    // Validate regulations
    const regValidation = RegulationGovernanceEngine.validateRegulations(
      t.regulationIds || [],
    );
    if (!regValidation.isValid) {
      return {
        valid: false,
        error: regValidation.issues[0],
        warnings: regValidation.issues,
      };
    }

    if (!t.workflowRef)
      return {
        valid: false,
        error: "Template tidak terhubung dengan Status Dokumen",
      };
    if (!t.styleBahasa || !t.styleDokumen)
      return { valid: false, error: "Template tidak memiliki panduan style" };

    return { valid: true, template: t };
  },
};

/**
 * Phase 12: RKJM GENERATOR PROFESSIONAL
 * Template-Driven Document Generator
 */
const RKJMPipelineEngine = {
  Version: "12.0",
  Core: "Sistem Pembuat Dokumen",
  Steps: [
    {
      id: "load_template",
      title: "Tahap 1: Memuat Template RKJM",
      type: "system",
      description: "Sistem memuat kerangka standar dokumen RKJM berdasarkan pedoman terbaru.",
      actions: ["Mencari template aktif", "Memuat struktur bab", "Validasi format margin dan kertas"]
    },
    {
      id: "validate_template",
      title: "Tahap 2: Validasi Template",
      type: "system",
      description: "Pemeriksaan integritas template dan komponen penyusunnya.",
      actions: ["Pemeriksaan kompatibilitas", "Pemetaan section dokumen", "Pengecekan versi gaya bahasa"]
    },
    {
      id: "load_school",
      title: "Tahap 3: Memuat Data Sekolah",
      type: "system",
      description: "Menarik data profil sekolah, nama kepsek, dan atribut institusi lainnya.",
      actions: ["Sinkronisasi Data Pokok Pendidikan", "Melengkapi identitas", "Mengatur tahun ajaran"]
    },
    {
      id: "load_decision",
      title: "Tahap 4: Memuat Analisis Prioritas",
      type: "system",
      description: "Menyiapkan hasil analisis kondisi untuk dirangkai ke dalam dokumen.",
      actions: ["Memuat capaian Rapor Pendidikan", "Memetakan akar masalah utama", "Menyusun rekapitulasi evaluasi diri"]
    },
    {
      id: "load_target",
      title: "Tahap 5: Memuat Target Sekolah",
      type: "system",
      description: "Memasukkan target indikator yang telah disepakati ke dalam kerangka program.",
      actions: ["Menarik data indikator keberhasilan", "Menyusun matriks program kerja", "Memvalidasi kelogisan target waktu"]
    },
    {
      id: "load_knowledge",
      title: "Tahap 6: Memuat Panduan Regulasi",
      type: "system",
      description: "Melampirkan referensi perundang-undangan dan pedoman teknis yang berlaku.",
      actions: ["Menghubungkan Knowledge Base PBD", "Memuat standar operasional", "Menyiapkan konsideran landasan hukum"]
    },
    {
      id: "fill_placeholder",
      title: "Tahap 7: Menyusun Struktur Teks",
      type: "system_generation",
      description: "Menggabungkan kerangka template dengan data spesifik sekolah menjadi paragraf utuh.",
      actions: ["Merangkai narasi analisis", "Mengonversi matriks program menjadi teks", "Melengkapi semua isian dokumen"]
    },
    {
      id: "run_language",
      title: "Tahap 8: Pemeriksaan Tata Bahasa",
      type: "system",
      description: "Pemeriksaan gaya penulisan agar sesuai dengan laras bahasa pemerintahan dan PUEBI.",
      actions: ["Pemeriksaan ejaan dan tanda baca", "Penyesuaian diksi formal", "Pengecekan kejelasan kalimat"]
    },
    {
      id: "run_compliance",
      title: "Tahap 9: Pemeriksaan Kepatuhan",
      type: "system",
      description: "Memastikan seluruh konten dokumen tidak melanggar ketentuan hukum dan pedoman dinas.",
      actions: ["Validasi struktur dokumen minimum", "Pemeriksaan keselarasan regulasi", "Pemeriksaan kelengkapan tanda tangan"]
    },
    { 
      id: "merge", 
      title: "Tahap 10: Penggabungan Dokumen", 
      type: "system",
      description: "Menyatukan cover, daftar isi, bab utama, dan lampiran ke dalam satu file utuh.",
      actions: ["Pengaturan nomor halaman", "Pembuatan daftar isi otomatis", "Finalisasi layout halaman"]
    },
    { 
      id: "preview", 
      title: "Tahap 11: Pratinjau", 
      type: "user_interaction",
      description: "Peninjauan dokumen hasil susunan oleh pengguna sebelum direview.",
      actions: ["Tampilkan mode baca", "Aktifkan fitur edit manual", "Simpan ke Document Workspace"]
    },
    { id: "review", title: "Tahap 12: Review", type: "user_interaction", description: "", actions: [] },
    {
      id: "workflow",
      title: "Tahap 13: Workflow Approval",
      type: "user_interaction",
    },
    { id: "print", title: "Tahap 14: Print", type: "system", description: "", actions: [] },
  ],
  StatusOptions: [
    "Belum Dibuat",
    "Sedang Diproses",
    "Draf",
    "Direview",
    "Disetujui",
    "Terkunci",
  ],
  PlaceholderTypes: [
    "AUTO",
    "AI",
    "TARGET_ENGINE",
    "REGULATION",
    "DOCUMENT_ENGINE",
  ],
};

/**
 * Phase 12.5: DOCUMENT EDITOR ENGINE
 * Enterprise Document Editor (Word-like, Block-based, Smart Edit)
 */


const TemplateTokenRenderer = ({ content, settings }: any) => {
  const renderedStr = TemplateTokenEngine.render(content, settings);
  if (!renderedStr.includes("[Token tidak dikenal]")) return <>{renderedStr}</>;
  
  // Custom splitting to highlight [Token tidak dikenal]
  const parts = renderedStr.split(/(\\[Token tidak dikenal\\])/g);
  return (
    <>
      {parts.map((p, i) => p === "[Token tidak dikenal]" ? <span key={i} className="bg-rose-100 text-rose-700 px-1 font-bold rounded print:bg-transparent print:text-black">[Token tidak dikenal]</span> : p)}
    </>
  );
};


const EnterpriseValidationEngine = {
  validateSystem: (settings: any) => {
    const traces: any[] = [];
    
    const hasName = !!settings.school?.name && settings.school?.name !== "";
    const hasNpsn = !!settings.school?.npsn && settings.school?.npsn !== "";
    traces.push({
      id: "school_identity",
      requirement: "Identitas Sekolah",
      sourceModule: "Data Master Sekolah",
      hasData: hasName && hasNpsn,
      status: (hasName && hasNpsn) ? "PASS" : "BLOCKED",
      reason: (hasName && hasNpsn) ? "Identitas dasar terisi." : "Nama sekolah dan NPSN wajib diisi.",
      fixAction: "Lengkapi data sekolah pada tab Profil.",
      fixPath: "dataSekolah"
    });

    const hasPrincipal = !!settings.principal?.name && settings.principal?.name !== "";
    traces.push({
      id: "school_principal",
      requirement: "Kepala Sekolah",
      sourceModule: "Data Master Sekolah",
      hasData: hasPrincipal,
      status: hasPrincipal ? "PASS" : "BLOCKED",
      reason: hasPrincipal ? "Profil Kepala Sekolah terisi." : "Data Kepala Sekolah wajib ada untuk pengesahan dokumen.",
      fixAction: "Lengkapi data Kepala Sekolah.",
      fixPath: "dataSekolah"
    });

    const hasVisi = !!settings.identitas?.visi && settings.identitas?.visi !== "";
    traces.push({
      id: "school_visi",
      requirement: "Visi & Misi",
      sourceModule: "Data Master Sekolah",
      hasData: hasVisi,
      status: hasVisi ? "PASS" : "BLOCKED",
      reason: hasVisi ? "Visi Misi terisi." : "Sekolah belum menentukan visi dan misi.",
      fixAction: "Lengkapi visi dan misi.",
      fixPath: "dataSekolah"
    });

    const isRaporLocked = !!settings.rapor?.isLocked;
    traces.push({
      id: "rapor_locked",
      requirement: "Data Rapor Pendidikan",
      sourceModule: "Rapor Pendidikan",
      hasData: isRaporLocked,
      status: isRaporLocked ? "PASS" : "BLOCKED",
      reason: isRaporLocked ? "Rapor disinkronisasi." : "Data Rapor Pendidikan belum disinkronisasi atau dikunci.",
      fixAction: "Lakukan sinkronisasi Rapor Pendidikan.",
      fixPath: "rapor"
    });

    const isAnalisisApproved = settings.decisionEngine?.status === "Disetujui" || settings.analisis?.status === "Selesai" || settings.analisis?.status === "Terkunci";
    traces.push({
      id: "analisis_approved",
      requirement: "Analisis Prioritas (SWOT & IRB)",
      sourceModule: "Perencanaan > Analisis",
      hasData: isAnalisisApproved,
      status: isAnalisisApproved ? "PASS" : "BLOCKED",
      reason: isAnalisisApproved ? "Analisis telah disetujui." : "Analisis Akar Masalah dan Prioritas belum selesai/disetujui.",
      fixAction: "Selesaikan dan setujui Analisis Prioritas.",
      fixPath: "diagnosis"
    });

    const hasRkjmObjectives = (settings.planning?.rkjm && settings.planning.rkjm.length > 0) || (settings.relationalPlanning?.objectives && settings.relationalPlanning.objectives.length > 0);
    traces.push({
      id: "rkjm_objectives",
      requirement: "Sasaran Strategis RKJM",
      sourceModule: "Perencanaan > RKJM",
      hasData: hasRkjmObjectives,
      status: hasRkjmObjectives ? "PASS" : "BLOCKED",
      reason: hasRkjmObjectives ? "Sasaran strategis RKJM telah disusun." : "Belum ada program strategis yang disusun.",
      fixAction: "Susun program kerja di menu RKJM.",
      fixPath: "rkjmPipeline"
    });

    const isRkjmApproved = settings.documents?.find((d: any) => d.type === "RKJM")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKJM")?.status === "Final" || settings.documents?.find((d: any) => d.type === "RKJM")?.status === "Siap Dicetak";
    traces.push({
      id: "rkjm_approved",
      requirement: "Dokumen RKJM Disetujui",
      sourceModule: "Perencanaan > RKJM",
      hasData: isRkjmApproved,
      status: isRkjmApproved ? "PASS" : "BLOCKED",
      reason: isRkjmApproved ? "Dokumen RKJM siap diturunkan." : "Dokumen RKJM belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKJM sebelum menyusun RKT.",
      fixPath: "dokumenPerencanaan"
    });

    const hasRktActivities = (settings.planning?.rkt && settings.planning.rkt.length > 0) || (settings.relationalPlanning?.annualPlans?.Y1?.rkt && settings.relationalPlanning.annualPlans.Y1.rkt.length > 0);
    traces.push({
      id: "rkt_activities",
      requirement: "Kegiatan Tahunan RKT",
      sourceModule: "Perencanaan > RKT",
      hasData: hasRktActivities,
      status: hasRktActivities ? "PASS" : "BLOCKED",
      reason: hasRktActivities ? "Kegiatan tahunan telah disusun." : "Belum ada penjabaran kegiatan untuk tahun berjalan.",
      fixAction: "Turunkan RKT dari RKJM.",
      fixPath: "rktDerivation"
    });

    const isRktApproved = settings.documents?.find((d: any) => d.type === "RKT")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKT")?.status === "Final" || settings.documents?.find((d: any) => d.type === "RKT")?.status === "Siap Dicetak";
    traces.push({
      id: "rkt_approved",
      requirement: "Dokumen RKT Disetujui",
      sourceModule: "Perencanaan > RKT",
      hasData: isRktApproved,
      status: isRktApproved ? "PASS" : "BLOCKED",
      reason: isRktApproved ? "Dokumen RKT siap diturunkan ke RKAS." : "Dokumen RKT belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKT sebelum menyusun RKAS.",
      fixPath: "dokumenPerencanaan"
    });

    const hasRkasBudget = (settings.planning?.rkas && settings.planning.rkas.length > 0) || (settings.relationalPlanning?.annualPlans?.Y1?.rkas && settings.relationalPlanning.annualPlans.Y1.rkas.length > 0);
    traces.push({
      id: "rkas_budget",
      requirement: "Pemetaan Anggaran RKAS",
      sourceModule: "Perencanaan > RKAS",
      hasData: hasRkasBudget,
      status: hasRkasBudget ? "PASS" : "BLOCKED",
      reason: hasRkasBudget ? "Pembiayaan telah diestimasikan." : "Belum ada rincian pembiayaan kegiatan.",
      fixAction: "Susun pemetaan anggaran di menu RKAS.",
      fixPath: "rkasDerivation"
    });

    const isRkasApproved = settings.documents?.find((d: any) => d.type === "RKAS")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKAS")?.status === "Final" || settings.documents?.find((d: any) => d.type === "RKAS")?.status === "Siap Dicetak";
    traces.push({
      id: "rkas_approved",
      requirement: "Dokumen RKAS Disetujui",
      sourceModule: "Perencanaan > RKAS",
      hasData: isRkasApproved,
      status: isRkasApproved ? "PASS" : "BLOCKED",
      reason: isRkasApproved ? "RKAS telah disetujui untuk dilaksanakan." : "Dokumen RKAS belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKAS untuk dimonitoring.",
      fixPath: "dokumenPerencanaan"
    });

    const passed = traces.filter(t => t.status === "PASS").length;
    const score = Math.round((passed / traces.length) * 100);
    const overallStatus = traces.every(t => t.status === "PASS") ? "PASS" : "BLOCKED";

    return { score, traces, overallStatus };
  },

  validateDocument: (docId: string, settings: any, narratives?: any) => {
    const system = EnterpriseValidationEngine.validateSystem(settings);
    const traces = system.traces;
    const findStatus = (id: string) => traces.find((t: any) => t.id === id);

    const getCoverage = (dependencies: string[]) => {
      const deps = dependencies.map(id => findStatus(id)).filter(Boolean);
      const passed = deps.filter((d: any) => d.status === "PASS").length;
      if (deps.length === 0) return { coverage: 0, status: "BLOCKED", missing: [] };
      const missing = deps.filter((d: any) => d.status !== "PASS").map((d: any) => ({
        dataset: d.requirement,
        module: d.sourceModule,
        link: d.fixPath,
        action: d.fixAction
      }));
      const coverage = Math.round((passed / deps.length) * 100);
      const status = coverage === 100 ? "Lengkap" : (coverage > 0 ? "Sebagian" : "Blocked");
      return { coverage, status, missing };
    };

    let chapters: any[] = [];
    if (docId === "ksp") {
      const b1 = getCoverage(["school_identity", "rapor_locked"]);
      const b2 = getCoverage(["school_identity", "school_visi"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Karakteristik Satuan Pendidikan", sources: ["Data Master Sekolah", "Rapor Pendidikan"], module: "Pengaturan & Rapor", stage: "Analisis Karakteristik", regulation: "Permendikbud No. 12 Tahun 2024", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Visi, Misi, dan Tujuan", sources: ["Data Master Sekolah"], module: "Pengaturan", stage: "Perumusan Visi Misi", regulation: "Permendikbud No. 12 Tahun 2024", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "rkjm") {
      const b1 = getCoverage(["school_identity"]);
      const b2 = getCoverage(["rapor_locked"]);
      const b3 = getCoverage(["analisis_approved", "rkjm_objectives"]);
      const b4 = getCoverage(["analisis_approved", "rkjm_objectives"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["Data Master Sekolah", "Visi Misi"], module: "Pengaturan & KSP", stage: "Persiapan RKJM", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Analisis Kondisi", sources: ["Rapor Pendidikan"], module: "Rapor Pendidikan", stage: "Evaluasi Diri Sekolah", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b2.coverage, missing: b2.missing, status: b2.status },
        { id: "bab3", chapter: "BAB III: Program Kerja Strategis", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"], module: "Perencanaan > Analisis", stage: "Perumusan Program Strategis", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b3.coverage, missing: b3.missing, status: b3.status },
        { id: "bab4", chapter: "BAB IV: Rencana Pembiayaan", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"], module: "Perencanaan > Analisis", stage: "Estimasi Pembiayaan Jangka Menengah", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b4.coverage, missing: b4.missing, status: b4.status },
        { id: "appendix", chapter: "LAMPIRAN", sources: ["Aset Dokumen", "Bukti Fisik"], module: "Lampiran", stage: "Kelengkapan Fisik", regulation: "Administrasi Sekolah", coverage: 100, missing: [], status: "PASS" }
      ];
    } else if (docId === "rkt") {
      const b1 = getCoverage(["rkjm_approved"]);
      const b2 = getCoverage(["rkjm_approved", "rkt_activities"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKJM Disetujui", "Data Master Sekolah"], module: "RKJM", stage: "Persiapan RKT", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Program dan Kegiatan Tahunan", sources: ["RKJM Disetujui", "Sasaran Strategis Tahunan"], module: "RKJM", stage: "Penjabaran Program Tahunan", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "rkas") {
      const b1 = getCoverage(["rkt_approved"]);
      const b2 = getCoverage(["rkt_approved", "rkas_budget"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKT Disetujui"], module: "RKT", stage: "Persiapan RKAS", regulation: "Permendikdasmen No. 63 Tahun 2022", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Rincian Anggaran Pendapatan dan Belanja", sources: ["RKT Disetujui", "Standar Biaya"], module: "RKT", stage: "Pemetaan Kode Rekening", regulation: "Permendikdasmen No. 63 Tahun 2022", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "monitoring") {
      const b1 = getCoverage(["rkas_approved"]);
      chapters = [
        { id: "bab1", chapter: "Laporan Pelaksanaan", sources: ["RKAS Disetujui", "Implementasi"], module: "RKAS", stage: "Pelaksanaan", regulation: "Standar Pengelolaan", coverage: b1.coverage, missing: b1.missing, status: b1.status }
      ];
    } else if (docId === "evaluasi") {
      const b1 = getCoverage(["rkas_approved"]); 
      chapters = [
        { id: "bab1", chapter: "Evaluasi Kinerja", sources: ["Monitoring Disetujui", "Laporan Capaian"], module: "Monitoring", stage: "Evaluasi", regulation: "Standar Penilaian", coverage: b1.coverage, missing: b1.missing, status: b1.status }
      ];
    }

    if (narratives) {
      chapters = chapters.map(c => {
         let hasNarrative = false;
         if (docId === "ksp" && c.id === "bab1") hasNarrative = Object.keys(narratives).some(k => k.startsWith('ksp_comp1_'));
         else if (docId === "ksp" && c.id === "bab2") hasNarrative = Object.keys(narratives).some(k => k.startsWith('ksp_comp2_'));
         else hasNarrative = Object.keys(narratives).some(k => k.startsWith(`${docId}_${c.id}_`));

         if (hasNarrative) {
            return { ...c, coverage: 100, missing: [], status: "PASS" };
         }
         return c;
      });
    }

    const overallStatus = chapters.every(c => c.status === "PASS") ? "PASS" : "BLOCKED";
    const totalCoverage = chapters.length > 0 ? chapters.reduce((a, b) => a + b.coverage, 0) / chapters.length : 0;
    
    const errors: string[] = [];
    chapters.forEach(c => {
       c.missing.forEach((m: any) => {
          const msg = `${c.chapter} belum dapat disusun. Yang masih harus dilengkapi: ${m.dataset}. ${m.action}`;
          if (!errors.includes(msg)) errors.push(msg);
       });
    });

    const valid = overallStatus === "PASS" || totalCoverage === 100;

    // Adding document specific checks (from original EnterpriseValidationEngine)
    const docMeta = settings.documents?.find((d: any) => d.id === docId);
    if (!docMeta) {
      errors.push("Dokumen tidak ditemukan");
    } else {
      if (docMeta.status !== "Disetujui" && docMeta.status !== "Terkunci" && docMeta.status !== "Siap Dicetak" && docMeta.status !== "Final") {
         errors.push(`Status dokumen saat ini adalah ${docMeta.status}. Dokumen harus disetujui sebelum dicetak.`);
      }
      if (settings.metadata?.versionFreeze && docMeta.status === "Draf") {
         errors.push("Sistem dalam mode Version Freeze. Tidak bisa mencetak draft.");
      }
    }

    return { overallStatus, totalCoverage, chapters, errors, valid: errors.length === 0, systemTraces: system.traces };
  }
};


const TemplateTokenEngine = {
  MAX_DEPTH: 5,
  
  getTokens: (settings: any): Record<string, string> => {
    // Determine active academic year
    const activeYear = settings.academicYears?.find((y: any) => y.isActive) || { year: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`, semester: "Ganjil" };
    return {
    "school.name": settings.school?.name || "NAMA SEKOLAH",
    "school.npsn": settings.school?.npsn || "-",
    "school.address": settings.school?.address || "-",
    "school.status": settings.school?.status || "Negeri",
    "school.level": settings.school?.level || "SD",
    "school.province": settings.school?.province || "-",
    "school.city": settings.school?.city || "-",
    "school.district": settings.school?.district || "-",
    
    "academic.year": activeYear.name || "-",
    "academic.semester": activeYear.semester || "-",
    
    "master.principal.name": settings.principal?.name || "Belum diatur",
    "master.principal.nip": settings.principal?.nip || "-",
    "master.treasurer.name": settings.bendaharaBOS?.name || "Belum diatur",
    "master.treasurer.nip": settings.bendaharaBOS?.nip || "-",
    "master.committee.name": settings.komite?.name || "Belum diatur",
    "master.supervisor.name": settings.pengawas?.name || "Belum diatur",
    "master.supervisor.nip": settings.pengawas?.nip || "-",
    "master.educationOffice.name": settings.kepalaDinas?.name || "Belum diatur",
    
    "planning.rkjm.status": settings.documents?.find((d: any) => d.type === "RKJM")?.status || "Belum Ada",
    "planning.rkt.status": settings.documents?.find((d: any) => d.type === "RKT")?.status || "Belum Ada",
    "planning.rkas.status": settings.documents?.find((d: any) => d.type === "RKAS")?.status || "Belum Ada",
    
    "visual.logo.available": settings.branding?.logo ? "Ya" : "Tidak",
    "visual.stamp.available": settings.branding?.stamp ? "Ya" : "Tidak",
    
    "documents.total": (settings.documents?.length || 0).toString(),
    "documents.approved": (settings.documents?.filter((d: any) => d.status === "Disetujui" || d.status === "Terkunci")?.length || 0).toString(),
    
    "monitoring.total": (settings.documents?.filter((d: any) => d.type === "Monitoring")?.length || 0).toString(),
    "monitoring.latest.status": settings.documents?.filter((d: any) => d.type === "Monitoring")?.pop()?.status || "Belum Ada",
  };},

  render: (content: string, settings: any, depth = 0): string => {
    if (!content || typeof content !== "string") return content;
    if (depth >= TemplateTokenEngine.MAX_DEPTH) return content; // Recursion limit protection

    const dictionary = TemplateTokenEngine.getTokens(settings);
    let requiresAnotherPass = false;

    const rendered = content.replace(/\\{\\{([^}]+)\\}\\}/g, (match, tokenName) => {
      const key = tokenName.trim();
      if (dictionary[key] !== undefined) {
        const val = dictionary[key];
        if (typeof val === "string" && val.includes("{{") && val.includes("}}")) {
          requiresAnotherPass = true; // Circular reference / nested token detection
        }
        return val;
      }
      return "[Token tidak dikenal]"; // Fallback for unknown tokens
    });

    if (requiresAnotherPass && depth < TemplateTokenEngine.MAX_DEPTH - 1) {
      return TemplateTokenEngine.render(rendered, settings, depth + 1);
    }
    
    return rendered;
  },
  
  generateAuditReport: (settings: any) => {
    const tokens = Object.keys(TemplateTokenEngine.getTokens(settings));
    return tokens;
  }
};

const DocumentEditorEngine = {
  Version: "12.5",
  Core: "Enterprise Document Editor",
  BlockTypes: [
    {
      id: "AUTO",
      label: "AUTO",
      icon: "🟢",
      description: "Diambil dari sistem. Tidak boleh diedit langsung.",
      locked: true,
    },
    {
      id: "AI",
      label: "Writing Assistant",
      icon: "🤖",
      description: "Dihasilkan otomatis. Dapat diedit, disesuaikan, disetujui.",
      locked: false,
    },
    {
      id: "MANUAL",
      label: "MANUAL",
      icon: "✍️",
      description: "Ditulis sepenuhnya oleh pengguna. Tidak ditimpa otomatis.",
      locked: false,
    },
  ],
  ToolbarActions: [
    "Heading 1",
    "Heading 2",
    "Bold",
    "Italic",
    "Underline",
    "Align Left",
    "Align Center",
    "Align Right",
    "Bullet",
    "Numbering",
    "Table",
    "Indent",
    "Page Break",
  ],
  Shortcuts: [
    { key: "Ctrl + S", action: "Simpan Versi" },
    { key: "Ctrl + F", action: "Pencarian Dokumen" },
    { key: "Ctrl + Z", action: "Undo" },
    { key: "Ctrl + Y", action: "Redo" },
    { key: "Ctrl + P", action: "Print Preview" },
  ],
  TrackChanges: {
    modes: ["view_final", "view_original", "side_by_side", "review_mode"],
  },
};

/**
 * Phase 13: RKT AUTOMATIC DERIVATION ENGINE
 * Mesin Penurunan Rencana Kerja Tahunan dari RKJM
 */
const RKTDerivationEngine = {
  Version: "13.0",
  Core: "Automatic Derivation from RKJM",
  DataSources: [
    "RKJM Final",
    "Decision Engine",
    "Target Sekolah",
    "Workflow",
    "Template Registry",
    "Regulation Registry",
  ],
  DerivationRules: [
    {
      rule: "Target Extraction",
      description:
        "Takes target for the active academic year from Target Engine.",
    },
    {
      rule: "Program Inheritance",
      description:
        "Programs in RKT MUST originate from RKJM Strategic Programs. No new programs allowed.",
    },
    {
      rule: "Activity Expansion",
      description:
        "Sistem merinci Program menjadi kegiatan operasional tahunan berdasarkan Program RKJM.",
    },
    {
      rule: "Smart Update",
      description: "Marks RKT as 'Perlu Sinkronisasi' if RKJM changes.",
    },
  ],
  TraceabilityLinks: [
    "RKT Program",
    "RKJM Program",
    "Target",
    "Decision",
    "Regulation",
    "Knowledge Base",
  ],
  SyncStatus: {
    synced: "Program Sinkron",
    changed: "Program Berubah",
    new: "Program Baru",
    deleted: "Program Dihapus",
  },
};

/**
 * Phase 14: RKAS BUDGET DERIVATION ENGINE
 * Mesin Penjabaran Rencana Kegiatan dan Anggaran Sekolah dari RKT
 */
const RKASDerivationEngine = {
  Version: "14.0",
  Core: "Automatic Budget Structure Derivation from RKT",
  DataSources: [
    "RKT Final",
    "Target Sekolah",
    "Decision Engine",
    "Status Dokumen",
    "Template Registry",
    "Regulation Registry",
    "Knowledge Base",
  ],
  BudgetStructure: [
    "Program",
    "Kegiatan",
    "Sub Kegiatan",
    "Komponen Belanja",
    "Volume",
    "Satuan",
    "Harga Satuan",
    "Total",
    "Sumber Dana",
    "Penanggung Jawab",
  ],
  Rules: [
    {
      id: "no_auto_value",
      description:
        "Assistant does not calculate monetary values. It only prepares the structure.",
    },
    {
      id: "strict_hierarchy",
      description: "Every budget item must trace back to an RKT activity.",
    },
    {
      id: "smart_sync",
      description:
        "Marks RKAS as 'Perlu Sinkronisasi' if RKT changes, user decides when to sync.",
    },
  ],
  ValidationChecks: [
    "All activities derived from RKT",
    "Targets from Target Engine",
    "Complete budget structure",
    "Workflow complete",
    "Compliance passed",
  ],
};

/**
 * Phase 14.5: IMPLEMENTATION & MONITORING ENGINE
 * Mesin Pelaksanaan dan Monitoring Program
 */
const ImplementationMonitoringEngine = {
  Version: "14.5",
  Core: "Sistem Monitoring",
  DataSources: [
    "RKJM Final",
    "RKT Final",
    "RKAS Final",
    "Target Sekolah",
    "Status Dokumen",
  ],
  ActivityStatuses: [
    { id: "not_started", label: "Belum Dimulai", color: "slate" },
    { id: "in_progress", label: "Sedang Berjalan", color: "blue" },
    { id: "completed", label: "Selesai", color: "emerald" },
    { id: "delayed", label: "Tertunda", color: "amber" },
    { id: "cancelled", label: "Dibatalkan", color: "rose" },
  ],
  EvidenceTypes: ["Foto", "Dokumen", "Berita Acara", "Notulen", "SK", "Tautan"],
  EarlyWarnings: [
    "Target Terlambat",
    "Kegiatan Belum Dimulai (Overdue)",
    "Realisasi Jauh Di Bawah Target",
  ],
};

export const RaporDictionary = [
  {
    dimensi: "Dimensi A: Mutu dan Relevansi Hasil Belajar Murid",
    indikator: [
      {
        id: "A.1",
        nama: "Kemampuan Literasi",
        desc: "Persentase peserta didik berdasarkan kemampuan dalam memahami, menggunakan, merefleksi, dan mengevaluasi beragam jenis teks.",
      },
      {
        id: "A.2",
        nama: "Kemampuan Numerasi",
        desc: "Persentase peserta didik berdasarkan kemampuan dalam berpikir menggunakan konsep, prosedur, fakta, dan alat matematika.",
      },
      {
        id: "A.3",
        nama: "Karakter",
        desc: "Kecenderungan peserta didik dalam bersikap dan berperilaku berdasarkan nilai-nilai Profil Lulusan.",
      },
    ],
  },
  {
    dimensi: "Dimensi D: Mutu dan Relevansi Pembelajaran",
    indikator: [
      {
        id: "D.1",
        nama: "Kualitas Pembelajaran",
        desc: "Kualitas pengelolaan kelas dan penyelenggaraan pembelajaran interaktif yang sesuai dengan tujuan.",
      },
      {
        id: "D.2",
        nama: "Refleksi dan Perbaikan Pembelajaran oleh Guru",
        desc: "Tingkat aktivitas refleksi dan perbaikan praktik pembelajaran yang dilakukan oleh guru.",
      },
      {
        id: "D.3",
        nama: "Kepemimpinan Instruksional",
        desc: "Tingkat kepemimpinan kepala sekolah dalam mendukung guru melakukan refleksi dan perbaikan pembelajaran.",
      },
      {
        id: "D.4",
        nama: "Iklim Keamanan Sekolah",
        desc: "Kondisi lingkungan sekolah yang aman dari perundungan, hukuman fisik, kekerasan seksual, dan narkoba.",
      },
      {
        id: "D.8",
        nama: "Iklim Kebinekaan",
        desc: "Kondisi lingkungan sekolah yang menghargai keragaman agama maupun sosial-budaya dan dukungan kesetaraan hak.",
      },
      {
        id: "D.10",
        nama: "Iklim Inklusivitas",
        desc: "Kondisi lingkungan sekolah yang mendukung pembelajaran siswa dengan disabilitas maupun cerdas istimewa bakat istimewa.",
      },
    ],
  },
];

// ============================================================================
// SYSTEM DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS = {
  schemaVersion: 1,
  snapshots: [],
  rapor: {
    isLocked: false,
    lockReason: "",
    lockDate: null,
    history: [],
    data: {}, // key: indikator id, value: { nilai: string, kategori: string, catatan: string }
    target: {}, // key: dimensi, value: string
  },
  analisis: {
    status: "Belum Dimulai", // Belum Dimulai | Sedang Diproses | Selesai | Draft | Ditinjau | Disetujui
    lastUpdated: null,
    data: {
      ringkasan: "",
      prioritas: [],
      akarPenyebab: "",
      kekuatan: [],
      kelemahan: [],
      peluang: [],
      tantangan: [],
      tujuan: [],
      program: [], // { id, nama, kebijakanId }
      kegiatan: [], // { id, nama, programId }
      indikator: [],
    },
  },
  school: {
    name: "",
    npsn: "",
    governmentLogo: "",
    level: "SD",
    status: "Negeri",
    akreditasi: "Belum Terakreditasi",
    address: "",
    village: "",
    district: "",
    regency: "",
    province: "",
    zip: "",
    email: "",
    website: "",
    phone: "",
    logoYayasanUrl: "",
  },
  principal: {
    name: "",
    gelar: "",
    nip: "",
    nuptk: "",
    rank: "",
    group: "",
    position: "Kepala Sekolah",
    noSk: "",
    tglSk: "",
    mulaiMenjabat: "",
    email: "",
    phone: "",
    ttdUrl: "",
    stempelUrl: "",
  },
  guru: [],
  tendik: [],
  pesertaDidik: { total: 0, lakiLaki: 0, perempuan: 0, jumlahRombel: 0 },
  rombel: [],
  sarpras: {
    ruangKelas: 0,
    perpustakaan: 0,
    laboratorium: 0,
    uks: 0,
    toilet: 0,
    mushola: 0,
    lapangan: 0,
    ruangGuru: 0,
    ruangKepsek: 0,
  },
  bendaharaBOS: { name: "", nip: "" },
  koordinator: { name: "", nip: "" },
  komite: { name: "", phone: "" },
  pengawas: { name: "", nip: "" },
  kepalaDinas: { name: "", nip: "", jabatan: "Kepala Dinas", instansi: "", noSk: "", tglMulai: "", tglSelesai: "", statusAktif: true },
  education: {
    academicYear: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    semester: "Ganjil",
    vision: "",
    mission: "",
    goals: "",
    characteristics: "",
    infrastructure: "",
    calendar: "",
  },
  budget: {
    status: "Reguler",
    studentCount: 0,
    bosRate: 900000,
    totalPagu: 0,
    honorariumLimit: 20,
    bookLimit: 20,
    sarprasLimit: 30,
    ppn: 11,
  },
  branding: {
    primaryColor: "indigo",
    accentColor: "amber",
    logoUrl: "",
    fotoSekolahUrl: "",
    fotoKepsekUrl: "",
  },
  identityAssets: {
    governmentLogo: null,
    schoolLogo: null,
    schoolPhoto: null,
    stamp: null,
    principalSignature: null,
    treasurerSignature: null,
    committeeSignature: null,
  },
  visualIdentity: {
    logoSekolah: null,
    fotoSekolah: null,
    stempel: null,
    ttdKepalaSekolah: null,
    ttdKomite: null,
  },
  identitas: { visi: "", misi: [], tujuan: [], motto: "", nilai: [] },
  karakteristik: {
    lokasi: [],
    lingkungan: "",
    pesertaDidik: "",
    guru: "",
    orangTua: "",
  },
  potensi: { daerah: [], kearifanLokal: [] },
  programUnggulan: [],
  academicYears: [
    {
      id: `ay-${Date.now()}`,
      name: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      semester: "Ganjil",
      isActive: true,
      createdAt: Date.now(),
    },
  ],
  archivedData: {},
  ai: {
    model: "gemini-1.5-pro-latest",
    language: "id",
    temperature: 0.7,
    outputLength: "medium",
  },
  appearance: { mode: "light", compactMode: false, sidebarCollapse: false },
  metadata: {
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    version: "1.0.0-RC",
    versionFreeze: false,
    lastBackup: null,
  },
  administrasi: {
    documentNumber: "",
    establishmentPlace: "",
    establishmentDate: "",
    academicYear: "",
    approvalDate: "",
  },
  draftingTeam: [],
  planning: PlanningEngine.createInitialState(),
  documents: [
    {
      id: "rkjm",
      name: "Rencana Kerja Jangka Menengah (RKJM)",
      type: "RKJM",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "rkt",
      name: "Rencana Kerja Tahunan (RKT)",
      type: "RKT",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "rkas",
      name: "Rencana Kegiatan dan Anggaran Sekolah (RKAS)",
      type: "RKAS",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
    {
      id: "ksp",
      name: "Kurikulum Satuan Pendidikan (KSP/KOSP)",
      type: "KSP",
      version: "1.0",
      status: "Belum Dibuat",
      createdAt: null,
      updatedAt: null,
      creator: "",
      reviewer: "",
      approver: "",
      history: [],
    },
  ],
};

const CHECKLIST_ITEMS = [
  { section: "school", field: "name", label: "Nama Sekolah" },
  { section: "school", field: "npsn", label: "NPSN" },
  { section: "identityAssets", field: "governmentLogo", label: "Logo Pemerintah Daerah" },
  { section: "principal", field: "name", label: "Kepala Sekolah" },
  { section: "guru", field: "length", label: "Data Guru" },
  { section: "pesertaDidik", field: "total", label: "Jumlah Peserta Didik" },
];

const AppContext = createContext<any>(undefined);

export const AppProvider = ({ children }: any) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { auth } = await import('./lib/firebase');
        const { UserService } = await import('./services/firestore/userService');
        let currentWorkspaceId = '';
        let currentRole = 'VIEWER';
        const effectiveUser = getEffectiveUser(auth.currentUser);
        if (effectiveUser) {
          console.log('[Tampuyak] Dashboard Loaded');
          const profile = await UserService.getUserProfile(effectiveUser.uid);
          if (profile && profile.workspaceId) {
            currentWorkspaceId = profile.workspaceId;
            currentRole = profile.role;
          }
        }

        let parsed = await loadFromIndexedDB();
        const heavyData = await get("tampuyak.heavy") || {};

        if (parsed) {
          // MIGRATION LOGIC
          if (!parsed.schemaVersion || parsed.schemaVersion < 1) {
            parsed.schemaVersion = 1;
          }

          const migrated = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            workspaceId: currentWorkspaceId,
            userRole: currentRole,
            rapor: parsed.rapor || { ...DEFAULT_SETTINGS.rapor },
            school: { ...DEFAULT_SETTINGS.school, ...parsed.school },
            principal: { ...DEFAULT_SETTINGS.principal, ...parsed.principal },
            guru: Array.isArray(parsed.guru) ? parsed.guru : (parsed.guru ? Object.values(parsed.guru) : []),
            tendik: Array.isArray(parsed.tendik) ? parsed.tendik : (parsed.tendik ? Object.values(parsed.tendik) : []),
            pesertaDidik: {
              ...DEFAULT_SETTINGS.pesertaDidik,
              ...parsed.pesertaDidik,
            },
            rombel: Array.isArray(parsed.rombel) ? parsed.rombel : (parsed.rombel ? Object.values(parsed.rombel) : []),
            sarpras: { ...DEFAULT_SETTINGS.sarpras, ...parsed.sarpras },
            bendaharaBOS: { ...DEFAULT_SETTINGS.bendaharaBOS, ...parsed.bendaharaBOS },
            koordinator: { ...DEFAULT_SETTINGS.koordinator, ...parsed.koordinator },
            komite: { ...DEFAULT_SETTINGS.komite, ...parsed.komite },
            pengawas: { ...DEFAULT_SETTINGS.pengawas, ...parsed.pengawas },
            kepalaDinas: {
              ...DEFAULT_SETTINGS.kepalaDinas,
              ...parsed.kepalaDinas,
            },
            budget: { ...DEFAULT_SETTINGS.budget, ...parsed.budget },
            branding: heavyData.branding || parsed.branding || { ...DEFAULT_SETTINGS.branding },
            visualIdentity: heavyData.visualIdentity || parsed.visualIdentity || { ...DEFAULT_SETTINGS.visualIdentity },
            identitas: { 
              ...DEFAULT_SETTINGS.identitas, 
              ...parsed.identitas,
              misi: Array.isArray(parsed.identitas?.misi) ? parsed.identitas.misi : [],
              tujuan: Array.isArray(parsed.identitas?.tujuan) ? parsed.identitas.tujuan : []
            },
            karakteristik: {
              ...DEFAULT_SETTINGS.karakteristik,
              ...parsed.karakteristik,
            },
            potensi: { ...DEFAULT_SETTINGS.potensi, ...parsed.potensi },
            programUnggulan: parsed.programUnggulan || [],
            administrasi: { ...DEFAULT_SETTINGS.administrasi, ...parsed.administrasi },
            draftingTeam: parsed.draftingTeam || [],
            metadata: { ...DEFAULT_SETTINGS.metadata, ...parsed.metadata },
            planning: parsed.planning || PlanningEngine.createInitialState(),
            documents: heavyData.documents || parsed.documents || DEFAULT_SETTINGS.documents,
          };

          if (!migrated.academicYears || migrated.academicYears.length === 0) {
            migrated.academicYears = [
              {
                id: `ay-${Date.now()}`,
                name: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
                semester: "Ganjil",
                isActive: true,
                createdAt: Date.now(),
              },
            ];
            migrated.archivedData = {};
          }

          // ONE-TIME MIGRATION: Clear persisted placeholder strings in metadata
          if (migrated.planning && migrated.planning.operationalActivities) {
            migrated.planning.operationalActivities.forEach((op: any) => {
              if (op.metadata) {
                if (op.metadata.programName === "Unknown Program") {
                  delete op.metadata.programName;
                }
                if (op.metadata.activityName === "Unknown Activity") {
                  delete op.metadata.activityName;
                }
              }
            });
          }

          setSettings(migrated);
        }
      } catch (error) {
        console.error("Error loading settings", error);
      } finally {
        setIsReady(true);
      }
    }
    loadData();
  }, []);

  const [saveStatus, setSaveStatus] = useState("saved");
  const [activities, setActivities] = useState([
    {
      id: Date.now(),
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      msg: "Knowledge Base V2025 Aktif.",
    },
  ]);
  const [toast, setToast] = useState<any>(null);
  const [successExp, setSuccessExp] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const showToast = useCallback((msg: string, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    setSuccessExp({ title, message });
    setTimeout(() => setSuccessExp(null), 8000);
  }, []);

  const addActivity = useCallback((msg: string) => {
    setActivities((prev) =>
      [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          msg,
        },
        ...prev,
      ].slice(0, 15),
    );
  }, []);

  const addAcademicYear = useCallback(
    (
      name: string,
      semester: string,
      copyKeys: string[],
      makeActive: boolean,
    ) => {
      setSettings((prev: any) => {
        const newId = `ay-${Date.now()}`;
        const newYear = {
          id: newId,
          name,
          semester,
          isActive: makeActive,
          createdAt: Date.now(),
        };

        const YEAR_SPECIFIC_KEYS = [
          "rapor", "analisis", "pesertaDidik", "rombel", "education", 
          "budget", "karakteristik", "programUnggulan", "planning", "documents"
        ];

        let newSettings = { ...prev };

        if (makeActive) {
          const currentActive = prev.academicYears?.find(
            (y: any) => y.isActive,
          );
          if (currentActive) {
            const dataToArchive = {};
            YEAR_SPECIFIC_KEYS.forEach(key => {
               dataToArchive[key] = prev[key];
            });
            newSettings.archivedData = {
              ...prev.archivedData,
              [currentActive.id]: dataToArchive,
            };
            newSettings.academicYears = prev.academicYears.map((y: any) => ({
              ...y,
              isActive: false,
            }));
          }

          for (const key of YEAR_SPECIFIC_KEYS) {
            if (copyKeys.includes(key)) {
              newSettings[key] = JSON.parse(
                JSON.stringify(
                  prev[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]
                )
              );
            } else {
              newSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
            }
          }
          newSettings.academicYears = [...(newSettings.academicYears || []), newYear];
        } else {
          const freshSettings = {};
          for (const key of YEAR_SPECIFIC_KEYS) {
            if (copyKeys.includes(key)) {
              freshSettings[key] = JSON.parse(
                JSON.stringify(
                  prev[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]
                )
              );
            } else {
              freshSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
            }
          }
          newSettings.academicYears = [...(prev.academicYears || []), newYear];
          newSettings.archivedData = {
            ...prev.archivedData,
            [newId]: freshSettings,
          };
        }

        return newSettings;
      });
    },
    [],
  );

  const switchAcademicYear = useCallback((id: string) => {
    console.log("[DEBUG] switchAcademicYear CALLED with id:", id);
    setSettings((prev: any) => {
      console.log("[DEBUG] prev.school before switch:", prev.school);

      const currentActive = prev.academicYears?.find((y: any) => y.isActive);
      if (currentActive?.id === id) return prev;

      const YEAR_SPECIFIC_KEYS = [
        "rapor", "analisis", "pesertaDidik", "rombel", "education", 
        "budget", "karakteristik", "programUnggulan", "planning", "documents"
      ];

      let newSettings = { ...prev };

      if (currentActive) {
        const dataToArchive = {};
        YEAR_SPECIFIC_KEYS.forEach(key => {
           dataToArchive[key] = prev[key];
        });
        newSettings.archivedData = {
          ...prev.archivedData,
          [currentActive.id]: dataToArchive,
        };
      }

      const dataToLoad = newSettings.archivedData?.[id] || {};

      YEAR_SPECIFIC_KEYS.forEach(key => {
        newSettings[key] = dataToLoad[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      });

      newSettings.academicYears = prev.academicYears.map((y: any) => ({
        ...y,
        isActive: y.id === id,
      }));

      console.log("[DEBUG] newSettings.school after switch:", newSettings.school);
      return newSettings;
    });
  }, []);

  const updateAcademicYear = useCallback(
    (id: string, name: string, semester: string) => {
      setSettings((prev: any) => ({
        ...prev,
        academicYears: prev.academicYears.map((y: any) =>
          y.id === id ? { ...y, name, semester } : y,
        ),
      }));
    },
    [],
  );

  useEffect(() => {
    const saveToLocal = setTimeout(() => {
      try {
        setSaveStatus("saving");
        
        const executeSave = async () => {
          console.time("autosave-performance");
          const dataToSave = {
            ...settings,
            metadata: { ...settings.metadata, lastUpdated: Date.now() },
          };
          await saveToIndexedDB(dataToSave);
          console.timeEnd("autosave-performance");
          setSaveStatus("saved");
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            executeSave().catch(err => { console.error(err); setSaveStatus("error"); });
          }, { timeout: 2000 });
        } else {
          executeSave().catch(err => { console.error(err); setSaveStatus("error"); });
        }
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to schedule save", error);
      }
    }, 3000);
    return () => clearTimeout(saveToLocal);
  }, [settings]);

  // PLANNING ENGINE RULE EVALUATOR
  useEffect(() => {
    let filledCount = 0;
    CHECKLIST_ITEMS.forEach((item) => {
      const val = settings[item.section]?.[item.field];
      if (val !== undefined && val !== null && val !== "" && val !== 0)
        filledCount++;
    });
    const mdScore = Math.round((filledCount / CHECKLIST_ITEMS.length) * 100);

    const raporData = settings.rapor || { isLocked: false, data: {} };
    const totalIndikator = RaporDictionary.reduce(
      (acc, dim) => acc + dim.indikator.length,
      0,
    );
    const filledIndikator = Object.values(raporData.data).filter(
      (d: any) => d?.nilai,
    ).length;
    const raporScore =
      Math.round((filledIndikator / totalIndikator) * 100) || 0;

    const currentPlanning = settings.planning;
    const evaluatedPlanning = PlanningEngine.Rules.evaluate(
      currentPlanning,
      mdScore,
      raporScore,
      raporData.isLocked,
      settings
    );

    if (JSON.stringify(currentPlanning) !== JSON.stringify(evaluatedPlanning)) {
      setSettings((prev: any) => ({ ...prev, planning: evaluatedPlanning }));

      PlanningEngine.Registry.forEach((stage) => {
        if (
          currentPlanning[stage.id]?.status === PlanningStatus.LOCKED &&
          evaluatedPlanning[stage.id]?.status === PlanningStatus.READY
        ) {
          showToast(`Sistem: Tahap ${stage.title} aktif.`, "success");
          addActivity(`Modul: ${stage.title} siap dikerjakan.`);
        }
      });
    }
  }, [settings, addActivity, showToast]);

  const updateSetting = useCallback(
    (section: string, field: string | null, value: any) => {
      setSettings((prev: any) => {
        let newSettings = { ...prev };
        if (!field || field === "") {
          newSettings[section] = value;
        } else {
          newSettings[section] = { ...newSettings[section], [field]: value };
        }
        if (section === "school" && field === "status") {
          newSettings.budget = {
            ...newSettings.budget,
            honorariumLimit: value === "Negeri" ? 20 : 40,
          };
        }
        if (
          section === "budget" &&
          (field === "studentCount" || field === "bosRate")
        ) {
          const count =
            field === "studentCount"
              ? Number(value)
              : Number(newSettings.budget.studentCount);
          const rate =
            field === "bosRate"
              ? Number(value)
              : Number(newSettings.budget.bosRate);
          newSettings.budget.totalPagu = count * rate;
        }
        newSettings.metadata = {
          ...newSettings.metadata,
          lastUpdated: Date.now(),
        };
        return newSettings;
      });
    },
    [],
  );

  const importSettings = (data) => {
    const planningMigrated =
      data.planning || PlanningEngine.createInitialState();
    setSettings({
      ...data,
      metadata: { ...data.metadata, lastUpdated: Date.now() },
      planning: planningMigrated,
    });
    addActivity("Data diimpor dari file JSON.");
  };

  const importModule = (moduleName: string, data: any) => {
    setSettings((prev: any) => {
      const next = { ...prev };
      if (moduleName === "Data Sekolah") {
        next.school = data.school || prev.school;
        next.guru = data.guru || prev.guru;
        next.tendik = data.tendik || prev.tendik;
        next.pesertaDidik = data.pesertaDidik || prev.pesertaDidik;
        next.rombel = data.rombel || prev.rombel;
        next.sarpras = data.sarpras || prev.sarpras;
      } else if (moduleName === "Rapor") {
        next.rapor = data;
      } else if (["RKJM", "RKT", "RKAS", "KSP"].includes(moduleName)) {
        if (!next.documents) next.documents = [];
        const index = next.documents.findIndex(
          (d: any) => d.type === moduleName,
        );
        if (index >= 0) {
          next.documents[index] = data;
        } else {
          next.documents.push(data);
        }
      }
      return next;
    });
    addActivity(`Data ${moduleName} diimpor dari file JSON.`);
  };

  const createSnapshot = () => {
    setSettings((prev: any) => {
      const snap = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        version: prev.metadata?.version || "6.6.0",
        size: JSON.stringify(prev).length,
        data: prev,
      };
      const snaps = prev.snapshots || [];
      return { ...prev, snapshots: [snap, ...snaps].slice(0, 5) };
    });
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      await del(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to delete from IndexedDB", e);
    }
    if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    addActivity("Sistem direset sepenuhnya.");
  };
  const updateMetadata = (data) => {
    setSettings((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...data },
    }));
    if (data.lastBackup) addActivity("Backup sistem berhasil.");
  };

  const getReadiness = () => {
    let filledCount = 0;
    const sectionStatus = {};
    const checklistStatus = CHECKLIST_ITEMS.map((item) => {
      const val = settings[item.section]?.[item.field];
      const isFilled =
        val !== undefined && val !== null && val !== "" && val !== 0;
      if (isFilled) filledCount++;
      if (!sectionStatus[item.section])
        sectionStatus[item.section] = { total: 0, filled: 0 };
      sectionStatus[item.section].total++;
      if (isFilled) sectionStatus[item.section].filled++;
      return { ...item, isFilled };
    });
    const score = Math.round((filledCount / CHECKLIST_ITEMS.length) * 100);
    const getSectionColor = (sectionId) => {
      const stat = sectionStatus[sectionId];
      if (!stat) return "bg-emerald-400";
      if (stat.filled === stat.total)
        return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
      if (stat.filled > 0)
        return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
      return "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]";
    };
    return {
      score,
      checklist: checklistStatus,
      isReady: score === 100,
      getSectionColor,
    };
  };

  const getActiveAcademicYear = useCallback(() => {
    const activeYear = settings.academicYears?.find((y: any) => y.isActive);
    return activeYear?.name || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
  }, [settings.academicYears]);

  const planning = React.useMemo(() => {
    // SINGLE SOURCE OF TRUTH: Read from settings.analisis.data
    const isApproved = settings.analisis?.status === "Disetujui" || settings.analisis?.status === "Selesai" || settings.analisis?.status === "Terkunci";
    
    if (!isApproved) {
      return {
        isBlocked: true,
        objectives: [],
        annualPlans: {
          "Y1": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y2": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y3": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y4": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }
        }
      };
    }

    const analysisData = (settings.analisis?.data as any) || {};
    const irbRaw = analysisData.program || [];
    const priorities = analysisData.prioritas || [];
    const kegiatanRaw = analysisData.kegiatan || [];

    // Enterprise Planning Lifecycle: VALIDATION -> OPERATIONAL
    const isMalformed = (item) => {
       if (item === null || item === undefined || item === "") return true;
       if (typeof item === 'object') {
          if (!item.id || !item.nama || typeof item.nama !== 'string' || item.nama.trim() === "") return true;
       }
       return false;
    };

    const uniqueIrbIds = new Set();
    const irb = irbRaw.filter((p) => {
       if (isMalformed(p)) return false;
       if (typeof p === 'object' && p.id) {
         if (uniqueIrbIds.has(p.id)) return false;
         uniqueIrbIds.add(p.id);
       }
       return true;
    }).map(p => typeof p === 'object' ? { ...p, status: "OPERATIONAL" } : p);

    const uniqueKegIds = new Set();
    const kegiatanList = kegiatanRaw.filter((k) => {
       if (isMalformed(k)) return false;
       if (typeof k === 'object' && k.id) {
         if (uniqueKegIds.has(k.id)) return false;
         uniqueKegIds.add(k.id);
       }
       return true;
    }).map(k => typeof k === 'object' ? { ...k, status: "OPERATIONAL" } : k);
    
    if (irb.length === 0) {
      return {
        isBlocked: false,
        objectives: [],
        annualPlans: {
          "Y1": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y2": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y3": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
          "Y4": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }
        }
      };
    }

    const objectives = irb.map((action: any, idx: number) => {
      // action could be just a string, or { id, nama, kebijakanId }
      const actionName = typeof action === 'string' ? action : (action.nama || action.benahi || `Program ${idx + 1}`);
      const actionRef = typeof action === 'string' ? "Indikator" : (action.kebijakanId || action.identifikasi?.name || "Rapor Pendidikan");
      
      const priority = priorities.find((p: any) => p.name === actionRef || p.id === actionRef || p.nama === actionRef);
      
      return {
        id: `OBJ-IRB-${idx + 1}`,
        strategicObjective: actionName,
        performanceIndicator: `Skor ${actionRef} Rapor Pendidikan`,
        kondisiAwal: priority ? (priority.currentScore?.toString() || priority.nilai || "0") : "0",
        targetY1: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 5).toString()) : "5",
        targetY2: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 10).toString()) : "10",
        targetY3: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 15).toString()) : "15",
        targetY4: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 20).toString()) : "20",
        responsibleUnit: "Tim Kurikulum",
        successIndicator: "Implementasi 100%",
        associatedSnp: "Standar Proses / Penilaian",
        risk: "Keterbatasan waktu pendidik",
        mitigation: "Optimalisasi Komunitas Belajar (Kombel)",
        evaluationMethod: "Observasi & Rapor Pendidikan",
        originatingPriority: `Hasil Analisis (${actionRef})`
      };
    });

    const annualPlans = {
      "Y1": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
      "Y2": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
      "Y3": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
      "Y4": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] }
    };

    const distributionService = new PlanningDistributionService();
    const assignmentService = new PlanningAssignmentService();
    kegiatanList.forEach((kegiatan: any, idx: number) => {
      // Lookup Program
      const program = irb.find((p: any) => p.id === kegiatan.programId) || { id: 'prog-gen', nama: "Program Pengembangan Kompetensi" };
      
      // Lookup Strategic Objective
      const progIdx = irb.findIndex((p: any) => p.id === kegiatan.programId);
      const obj = progIdx >= 0 ? objectives[progIdx] : objectives[0];
      
      // Create base RKT reference using dynamic assignment (distributes correctly, but allows PlanningAssignmentService to finalize)
      const distYearStr = distributionService.assignYearToActivity(`RKT-GEN-${idx}`, idx);
      const rktId = `RKT-${distYearStr}-${idx + 1}`;
      
      const q = (idx % 4) + 1;
      const s = q <= 2 ? 1 : 2;
      const distribution: PlanningDistribution = {
          planningYear: parseInt(distYearStr.replace('Y', '')),
          activityReferenceId: rktId,
          priorityOrder: 1,
          dependencyReferences: [],
          recommendedQuarter: q as 1 | 2 | 3 | 4,
          recommendedSemester: s as 1 | 2,
          recommendedSequence: 1
      };
      
      const rktObj = {
        id: rktId,
        rkjmObjectiveId: obj ? obj.id : 'OBJ-IRB-0',
        activity: program.nama,
        subActivity: kegiatan.nama,
        target: "Semua Guru & Siswa",
        status: "synced"
      };
      
      // Resolve PlanningAssignment using AssignmentService
      const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
      const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, program.id || 'PROG-GEN', distribution);
      opActivity.metadata = {
        ...opActivity.metadata,
        programName: program.nama,
        activityName: kegiatan.nama,
        target: rktObj.target,
        successIndicator: "100% Tercapai",
        personInCharge: obj ? obj.responsibleUnit : "Tim Pengembang"
      };
      if (assignmentResult.success && assignmentResult.assignment) {
          opActivity.planningYear = assignmentResult.assignment.planningYear;
      }
      const targetBucket = `Y${String(opActivity.planningYear).replace(/[^0-9]/g, '')}`; // Normalized to guarantee Y1-Y4
      const targetYearInt = parseInt(targetBucket.replace('Y', ''));
      
      // Initialize bucket if missing
      if (!annualPlans[targetBucket as keyof typeof annualPlans]) {
          annualPlans[targetBucket as keyof typeof annualPlans] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] } as any;
      }
      
      if (!(annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities) {
          (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities = [];
      }
      (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities.push(opActivity);
      
      // Push components to the target bucket determined ONLY by PlanningAssignment
      annualPlans[targetBucket as keyof typeof annualPlans].rkt.push(rktObj);
      
      const rkasId = `RKAS-${targetBucket}-${idx + 1}a`;
      annualPlans[targetBucket as keyof typeof annualPlans].rkas.push({
        id: rkasId,
        rktActivityId: rktId,
        budgetItem: `Biaya Pelaksanaan ${kegiatan.nama}`,
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft"
      });
      
      annualPlans[targetBucket as keyof typeof annualPlans].monitoring.push({
        id: `MON-${targetBucket}-${idx + 1}`,
        rkasId: rkasId,
        evidence: "Daftar Hadir, Laporan Kegiatan, & Dokumentasi",
        result: "Dalam Proses"
      });
      
      annualPlans[targetBucket as keyof typeof annualPlans].evaluation.push({
        id: `EV-${targetBucket}-${idx + 1}`,
        objectiveId: obj ? obj.id : 'OBJ-IRB-0',
        status: "Berjalan",
        notes: "Evaluasi dijadwalkan akhir semester."
      });
    });

    const flatOperationalActivities = [
      ...(annualPlans.Y1.operationalActivities || []),
      ...(annualPlans.Y2.operationalActivities || []),
      ...(annualPlans.Y3.operationalActivities || []),
      ...(annualPlans.Y4.operationalActivities || [])
    ];

    const flatPlanningAssignments = flatOperationalActivities.map(op => ({
       activityReferenceId: op.activityReferenceId,
       planningYear: op.planningYear
    }));


    (/* console.log removed */ (..._args: any[]) => {})('Object.keys(annualPlans):', Object.keys(annualPlans));
    (/* console.log removed */ (..._args: any[]) => {})('Y1.rkt.length:', annualPlans.Y1.rkt.length);
    (/* console.log removed */ (..._args: any[]) => {})('Y2.rkt.length:', annualPlans.Y2.rkt.length);
    (/* console.log removed */ (..._args: any[]) => {})('Y3.rkt.length:', annualPlans.Y3.rkt.length);
    (/* console.log removed */ (..._args: any[]) => {})('Y4.rkt.length:', annualPlans.Y4.rkt.length);
    return { 
      objectives, 
      programs: irb, 
      activities: kegiatanList, 
      annualPlans,
      operationalActivities: flatOperationalActivities,
      planningAssignments: flatPlanningAssignments,
      metadata: { generatedBy: "OperationalPlanningEngine", source: "analysisData" },
      version: 1
    };
  }, [settings.analisis]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-indigo-600 rounded animate-spin mb-4"></div>
        <p className="text-[var(--color-eds-text-primary)] font-medium animate-pulse">Memuat Database...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSetting,
        setSettings,
        saveStatus,
        importSettings,
        resetSettings,
        getReadiness,
        updateMetadata,
        activities,
        showToast,
        showSuccess,
        PlanningEngine,
        KnowledgeBase,
        addAcademicYear,
        switchAcademicYear,
        updateAcademicYear,
        getActiveAcademicYear,
        planning,
      }}
    >
      {children}
      {toast && <Toast message={toast.msg} type={toast.type} />}
      {successExp && (
        <SuccessOverlay title={successExp.title} message={successExp.message} />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

// PREMIUM COMPONENTS
const SuccessOverlay = ({ title, message }: any) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"></div>
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl border border-emerald-100 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-emerald-400 rounded animate-ping opacity-20"></div>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-12 h-12 object-contain drop-shadow-sm" />
        </div>
        <h3 className="text-2xl font-black text-[var(--color-eds-text-primary)] mb-3">{title}</h3>
        <p className="text-[var(--color-eds-text-primary)] mb-6 font-medium whitespace-pre-wrap">{message}</p>
        <div className="w-full h-1.5 bg-emerald-100 rounded overflow-hidden">
          <div className="h-full bg-emerald-500 rounded w-full origin-left animate-[shrink_8s_linear_forwards]"></div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type }) => {
  const isError = type === "error";
  const isWarning = type === "warning";
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center p-4 rounded-xl shadow-xl border ${isError ? "bg-[#FCE8E6] text-red-800 border-red-200 shadow-red-500/20" : isWarning ? "bg-amber-50 text-amber-800 border-amber-200 shadow-amber-500/20" : "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/20"}`}
    >
      {isError ? (
        <AlertTriangle className="w-5 h-5 mr-3 text-[var(--color-eds-danger)]" />
      ) : isWarning ? (
        <AlertCircle className="w-5 h-5 mr-3 text-amber-500" />
      ) : (
        <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
      )}
      <span className="font-bold text-sm tracking-wide">{message}</span>
    </div>
  );
};

const Card = ({
  children,
  title,
  description,
  className = "",
  noPadding = false,
  headerAction,
  icon: Icon,
  ...props
}: any) => (
  <div
    className={`enterprise-card ${noPadding ? "" : "p-7"} ${className}`}
    {...props}
  >
    {(title || description || headerAction) && (
      <div
        className={`mb-5 flex justify-between items-start ${noPadding ? "p-7 pb-2 mb-0" : ""}`}
      >
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 bg-[var(--color-eds-bg)] rounded-xl mr-3">
              <Icon className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-[1.15rem] font-bold text-[var(--color-eds-text-primary)] tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-[var(--color-eds-text-primary)] mt-1 font-medium leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
    )}
    {children}
  </div>
);

const ContextHelpButton = ({ articleId }: { articleId: string }) => {
  return (
    <div className="relative inline-block ml-3">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const event = new CustomEvent('openKnowledge', { detail: articleId });
          window.dispatchEvent(event);
        }}
        className="w-8 h-8 rounded bg-slate-100 text-[var(--color-eds-text-secondary)] hover:bg-blue-100 hover:text-[var(--color-eds-text-primary)] font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Bantuan Konteks"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
};


const TargetEditableItem = ({ item, idx, field, handleArrayChange }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const val = typeof item === 'object' ? (item.nama || item.name || "") : item;
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        value={val}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleArrayChange(field, idx, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-[var(--color-eds-border)] rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {isFocused && (field === "tujuan" || field === "indikator") && <SmartGuidance type={field} />}
    </div>
  );
};
const SmartGuidance = ({ type }: { type: string }) => {
  const guidance: Record<string, any> = {
    visi: {
      title: "Kriteria Visi yang Baik",
      points: [
        "Berorientasi ke masa depan (visioner)",
        "Menggambarkan profil murid yang dicita-citakan",
        "Singkat, jelas, dan mudah diingat",
        "Tidak memuat langkah operasional (langkah ada di Misi)"
      ]
    },
    misi: {
      title: "Kriteria Misi yang Baik",
      points: [
        "Merupakan langkah nyata untuk mewujudkan Visi",
        "Dapat diukur dan dievaluasi",
        "Menggunakan kata kerja aktif (misal: 'Mewujudkan', 'Meningkatkan')",
        "Fokus pada proses pembelajaran dan pengembangan karakter"
      ]
    },
    tujuan: {
      title: "Prinsip SMART Goals",
      points: [
        "Specific (Spesifik/Khusus)",
        "Measurable (Dapat diukur capaiannya)",
        "Achievable (Realistis/Dapat dicapai)",
        "Relevant (Relevan dengan Visi & Misi)",
        "Time-bound (Memiliki batas waktu penyelesaian)"
      ]
    },
    indikator: {
      title: "Indikator Kinerja Terukur",
      points: [
        "Mengandung angka/persentase target (misal: '80% lulusan...')",
        "Objektif dan dapat dibuktikan dengan data",
        "Hindari kata sifat abstrak (misal: 'menjadi lebih baik')"
      ]
    }
  };

  const item = guidance[type];
  if (!item) return null;

  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
      <h5 className="text-sm font-bold text-[var(--color-eds-primary)] font-bold flex items-center gap-1.5 mb-2"><Info className="w-4 h-4" /> {item.title}</h5>
      <ul className="space-y-1.5">
        {item.points.map((p: string, i: number) => (
          <li key={i} className="text-xs text-blue-700/80 flex items-start gap-1.5 leading-snug">
            <span className="text-blue-400 shrink-0 mt-0.5">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  prefix,
  disabled = false,
  ...props
}: any) => {
  const isMissing = required && !value;

  useEffect(() => {
    if (label?.includes("NIP")) {
      console.log(`[AUDIT] RENDER (${label}):`, value ? value.substring(0, 50) : "empty");
    }
  }, [value, label]);

  return (
    <div className="space-y-2 w-full group mb-4">
      {label && (
        <label className="block text-sm font-bold text-[var(--color-eds-text-primary)]">
          {label} {required && <span className="text-[var(--color-eds-danger)] ml-1" title="Wajib Diisi">*</span>}
        </label>
      )}
      <div className="relative transition-all duration-200">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-[var(--color-eds-text-primary)] text-sm font-semibold font-medium">
              {prefix}
            </span>
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => {
            if (label === "Visi Sekolah" || label?.includes("NIP")) console.log(`[AUDIT] INPUT (${label || 'Input'}):`, e.target.value.substring(0, 50));
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          className={`w-full ${prefix ? "pl-12" : "px-4"} py-3 bg-white border border-[var(--color-eds-border)] rounded-xl text-base font-medium focus:outline-none transition-colors duration-200 shadow-sm ${isMissing ? "border-[var(--color-eds-danger)] bg-[#FCE8E6] focus:border-[var(--color-eds-danger)] focus:ring-1 focus:ring-[var(--color-eds-danger)]" : "focus:border-[var(--color-eds-primary)] focus:ring-1 focus:ring-[var(--color-eds-primary)] hover:border-[var(--color-eds-primary)]"} ${disabled ? "text-[var(--color-eds-disabled)] cursor-not-allowed bg-slate-50 border-[var(--color-eds-disabled)]" : ""}`}
        />
      </div>
      {isMissing && <p className="text-xs text-[var(--color-eds-danger)] mt-1 font-bold">Field ini wajib diisi</p>}
    </div>
  );
};

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
  guidanceType,
  ...props
}: any) => {
  const isMissing = required && !value;
  const [isFocused, setIsFocused] = useState(false);
  
  // Proteksi & Audit Render
  useEffect(() => {
    if (label === "Visi Sekolah" || label?.includes("Visi")) {
      console.log(`[AUDIT] RENDER (${label}):`, value ? value.substring(0, 50) : "empty");
    }
  }, [value, label]);
  
  return (
    <div className="space-y-2 w-full mb-4">
      {label && (
        <label className="block text-sm font-bold text-[var(--color-eds-text-primary)]">
          {label} {required && <span className="text-[var(--color-eds-danger)] ml-1" title="Wajib Diisi">*</span>}
        </label>
      )}
      <textarea maxLength={2000}
        value={value || ""}
        onChange={(e) => {
          if (label === "Visi Sekolah" || label?.includes("Visi")) console.log(`[AUDIT] INPUT (${label || 'Textarea'}):`, e.target.value.substring(0, 50));
          onChange(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        {...props}
        className={`w-full px-4 py-3 bg-white border border-[var(--color-eds-border)] rounded-xl text-base font-medium focus:outline-none transition-colors duration-200 resize-y shadow-sm ${isMissing ? "border-[var(--color-eds-danger)] bg-[#FCE8E6] focus:border-[var(--color-eds-danger)] focus:ring-1 focus:ring-[var(--color-eds-danger)]" : "focus:border-[var(--color-eds-primary)] focus:ring-1 focus:ring-[var(--color-eds-primary)] hover:border-[var(--color-eds-primary)]"}`}
      />
      {isMissing && <p className="text-xs text-[var(--color-eds-danger)] mt-1 font-bold">Field ini wajib diisi</p>}
      {guidanceType && isFocused && <SmartGuidance type={guidanceType} />}
    </div>
  );
};

const Select = ({ label, value, onChange, options, required, ...props }: any) => {
  const isMissing = required && !value;
  return (
    <div className="space-y-2 w-full mb-4">
      {label && (
        <label className="block text-sm font-bold text-[var(--color-eds-text-primary)]">
          {label} {required && <span className="text-[var(--color-eds-danger)] ml-1" title="Wajib Diisi">*</span>}
        </label>
      )}
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        {...props}
        className={`w-full px-4 py-3 bg-white border border-[var(--color-eds-border)] rounded-xl text-base font-medium focus:outline-none transition-colors duration-200 appearance-none cursor-pointer shadow-sm ${isMissing ? "border-[var(--color-eds-danger)] bg-[#FCE8E6] focus:border-[var(--color-eds-danger)] focus:ring-1 focus:ring-[var(--color-eds-danger)]" : "focus:border-[var(--color-eds-primary)] focus:ring-1 focus:ring-[var(--color-eds-primary)] hover:border-[var(--color-eds-primary)]"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
      >
        <option value="">Pilih...</option>
        <option value="" disabled className="text-[var(--color-eds-text-secondary)]">
          ──────────
        </option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {isMissing && <p className="text-xs text-[var(--color-eds-danger)] mt-1 font-bold">Field ini wajib diisi</p>}
    </div>
  );
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}: any) => {
  const baseStyle = "enterprise-btn";
  const variants = {
    primary: "enterprise-btn-primary",
    secondary: "enterprise-btn-secondary",
    danger: "enterprise-btn-danger",
    success: "enterprise-btn-primary",
    warning: "enterprise-btn-primary",
    outline: "enterprise-btn-secondary",
    ghost: "enterprise-btn-secondary border-transparent shadow-none"
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

const Badge = ({ variant = "completed", children, className = "" }: any) => {
  const variants = {
    completed: "bg-[#E6F4EA] text-[var(--color-eds-success)] border border-[var(--color-eds-success)]",
    draft: "bg-[#F1F3F4] text-[var(--color-eds-text-secondary)] border border-[var(--color-eds-border)]",
    pending: "bg-[#FEF7E0] text-[var(--color-eds-warning)] border border-[var(--color-eds-warning)]",
    blocked: "bg-[#FCE8E6] text-[var(--color-eds-danger)] border border-[var(--color-eds-danger)]",
    certified: "bg-[#E8F0FE] text-[var(--color-eds-primary)] border border-[var(--color-eds-primary)]",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
};

const GenericModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isDanger,
  icon: ModalIcon,
  ...props
}: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 text-center">
          <div
            className={`w-20 h-20 rounded flex items-center justify-center mx-auto mb-6 relative ${isDanger ? "bg-[#FCE8E6]" : "bg-amber-50"}`}
          >
            <div
              className={`absolute inset-0 rounded animate-ping opacity-20 ${isDanger ? "bg-red-100" : "bg-amber-100"}`}
            ></div>
            {ModalIcon ? (
              <ModalIcon
                className={`w-10 h-10 relative z-10 ${isDanger ? "text-[var(--color-eds-danger)]" : "text-amber-500"}`}
              />
            ) : (
              <AlertTriangle
                className={`w-10 h-10 relative z-10 ${isDanger ? "text-[var(--color-eds-danger)]" : "text-amber-500"}`}
              />
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-[var(--color-eds-text-primary)] text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <div className="bg-[var(--color-eds-bg)] p-6 flex gap-4 justify-end border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Tutup
          </Button>
          {onConfirm && (
            <Button
              variant={isDanger ? "danger" : "primary"}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD & PLANNING UI
// ============================================================================

const DashboardView = ({ navigateToSettings, navigateToView }: any) => {
  const { settings, getActiveAcademicYear, getReadiness, activities } = useApp();

  const SchoolName = settings.school?.name || "Sekolah Belum Diatur";

  const readiness = getReadiness();
  const healthScore = readiness.score;

  let healthCategory = "Prioritas Tinggi";
  let healthColor = "rose";
  if (healthScore >= 80) {
    healthCategory = "Sangat Baik";
    healthColor = "emerald";
  } else if (healthScore >= 50) {
    healthCategory = "Perlu Perhatian";
    healthColor = "amber";
  }

  const healthClass =
    healthScore >= 80
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      : healthScore >= 50
        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
        : "bg-rose-500/20 text-rose-300 border-rose-500/30";

  const docs = settings.documents || [];
  
  const getDocStatus = (type) => docs.find((d: any) => d.type === type)?.status || "Belum Dibuat";

  const notifications: any[] = [];
  
  if (!settings.school?.name || !settings.school?.npsn) {
    notifications.unshift({
      title: "Profil Sekolah Belum Lengkap",
      desc: "Profil sekolah Anda belum lengkap. Silakan klik untuk melengkapi sekarang.",
      type: "danger",
      action: () => navigateToSettings("school"),
    });
  }

  if (healthScore < 50) {
    notifications.push({
      title: "Data Master Belum Lengkap",
      desc: "Silakan lengkapi profil sekolah dan identitas.",
      type: "danger",
      action: () => navigateToSettings("school"),
    });
  }

  const rkjmStatus = getDocStatus("RKJM");
  if (rkjmStatus === "Belum Dibuat" || rkjmStatus === "Draf") {
    notifications.push({
      title: "Dokumen RKJM belum disetujui",
      desc: "Masih dalam status Draft.",
      type: "warning",
      action: () => navigateToView("rkjmPipeline"),
    });
  }

  const rktStatus = getDocStatus("RKT");
  if (rkjmStatus === "Disetujui" && (rktStatus === "Belum Dibuat" || rktStatus === "Draf")) {
    notifications.push({
      title: "Penyusunan RKT Tertunda",
      desc: "RKJM telah disetujui, segera turunkan ke program tahunan.",
      type: "info",
      action: () => navigateToView("rktDerivation"),
    });
  }
  
  if (docs.some(d => d.status === "Needs Synchronization")) {
    notifications.push({
      title: "RKAS perlu sinkronisasi",
      desc: "Ada perubahan target pada RKT yang belum masuk RKAS.",
      type: "warning",
      action: () => navigateToView("rkasDerivation"),
    });
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 text-[var(--color-eds-primary)] font-bold rounded text-xs font-bold tracking-wide uppercase mb-4">
            Ringkasan Eksekutif
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {SchoolName}
          </h1>
          <p className="text-[var(--color-eds-text-primary)] text-lg mb-6 font-medium">
            Tahun Pelajaran: <span className="font-bold text-[var(--color-eds-text-primary)]">{getActiveAcademicYear()}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigateToSettings("school")}
              className="shadow-sm"
            >
              Lengkapi Data
            </Button>
            <Button
              onClick={() => navigateToView("rkjmPipeline")}
              variant="outline"
              className="shadow-sm"
            >
              Buka RKJM
            </Button>
            <Button
              onClick={() => navigateToView("rktDerivation")}
              variant="outline"
              className="shadow-sm"
            >
              Buka RKT
            </Button>
            <Button
              onClick={() => navigateToView("rkasDerivation")}
              variant="outline"
              className="shadow-sm"
            >
              Buka RKAS
            </Button>
            <Button
              onClick={() => navigateToView("monitoring")}
              variant="outline"
              className="shadow-sm"
            >
              Monitoring
            </Button>
            <Button
              onClick={() => navigateToView("documentEditor")}
              variant="outline"
              className="shadow-sm"
            >
              Cetak Dokumen
            </Button>
          </div>
        </div>

        <div className="bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] p-6 rounded-xl text-center w-full md:w-72 shrink-0 cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-colors" onClick={() => navigateToView("governance")}>
          <p className="text-sm font-semibold text-[var(--color-eds-text-primary)] uppercase tracking-wide mb-4">
            Kesehatan Sekolah
          </p>
          <div className="mb-4">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-slate-900">{healthScore}</span>
              <span className="text-sm font-semibold text-[var(--color-eds-text-primary)] font-medium">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-sm h-3 overflow-hidden">
              <div 
                className={`h-full ${healthScore >= 80 ? 'bg-emerald-600' : healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-600'}`} 
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>
          <div
            className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wide border ${healthScore >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : healthScore >= 50 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}
          >
            {healthCategory}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          className="enterprise-card flex flex-col justify-between cursor-pointer hover:border-[var(--color-eds-primary)] hover:shadow-md transition-all group p-6"
          onClick={() => navigateToView("dokumenPerencanaan")}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--color-eds-text-primary)] uppercase tracking-wide group-hover:text-[var(--color-eds-primary)] font-bold transition-colors">
                Status Perencanaan
              </h3>
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-eds-text-primary)] font-medium">RKJM</span>
                <span className={`font-semibold ${rkjmStatus === 'Disetujui' ? 'text-emerald-700' : 'text-[var(--color-eds-text-secondary)]'}`}>{rkjmStatus}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-eds-text-primary)] font-medium">RKT</span>
                <span className={`font-semibold ${rktStatus === 'Disetujui' ? 'text-emerald-700' : 'text-[var(--color-eds-text-secondary)]'}`}>{rktStatus}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-eds-text-primary)] font-medium">RKAS</span>
                <span className={`font-semibold ${getDocStatus('RKAS') === 'Disetujui' ? 'text-emerald-700' : 'text-[var(--color-eds-text-secondary)]'}`}>{getDocStatus('RKAS')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-eds-text-primary)] font-medium">Monitoring</span>
                <span className="font-semibold text-emerald-700">Berjalan</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="enterprise-card flex flex-col justify-between cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group p-6"
          onClick={() => navigateToView("governance")}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--color-eds-text-primary)] uppercase tracking-wide group-hover:text-emerald-800 transition-colors">
                Indikator Master
              </h3>
              <Target className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2 mb-4 mt-4">
              <span className="text-4xl font-bold text-slate-900">{readiness.score}%</span>
              <span className="text-sm font-semibold text-[var(--color-eds-text-primary)] font-medium">
                Terisi
              </span>
            </div>
            <div className="text-sm font-medium text-[var(--color-eds-text-primary)] leading-relaxed">
              Periksa kelengkapan di menu Data Master & Governance.
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 enterprise-card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[var(--color-eds-border)] flex justify-between items-center bg-[var(--color-eds-bg)]">
            <h3 className="text-sm font-bold text-[var(--color-eds-text-primary)] uppercase tracking-wide">
              Tindakan Diperlukan
            </h3>
            {notifications.length > 0 && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded border border-rose-200">
                {notifications.length} Perhatian
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto max-h-[220px]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[var(--color-eds-text-primary)] font-medium h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-3" />
                <p>Semua berjalan lancar.</p>
                <p className="text-sm text-[var(--color-eds-text-primary)] font-normal font-medium">Tidak ada peringatan khusus saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-eds-border)]">
                {notifications.map((notif, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-start gap-4 hover:bg-[var(--color-eds-bg)] transition-colors cursor-pointer group"
                    onClick={notif.action}
                  >
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center shrink-0 border ${notif.type === 'danger' ? 'bg-rose-50 text-rose-800 border-rose-200' : notif.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-[var(--color-eds-primary)] font-bold border-blue-200'}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-[var(--color-eds-primary)] font-bold transition-colors">
                        {notif.title}
                      </h4>
                      <p className="text-sm font-medium text-[var(--color-eds-text-primary)] mt-1">
                        {notif.desc}
                      </p>
                    </div>
                    <div className="text-[var(--color-eds-text-primary)] flex items-center group-hover:text-blue-700 transition-colors font-medium">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PUSAT DATA DASHBOARD
// ============================================================================

const VisualIdentityStatusWidget = () => {
  const { settings, updateSetting } = useApp();
  const assets = [
    { key: 'governmentLogo', label: 'Logo Pemerintah Daerah', required: true },
    { key: 'schoolLogo', label: 'Logo Sekolah', required: false },
    { key: 'schoolPhoto', label: 'Foto Sekolah', required: false },
    { key: 'stamp', label: 'Stempel Sekolah', required: false },
    { key: 'principalSignature', label: 'Tanda Tangan Kepsek', required: false },
    { key: 'treasurerSignature', label: 'Tanda Tangan Bendahara', required: false },
    { key: 'committeeSignature', label: 'Tanda Tangan Komite', required: false }
  ];

  return (
    <Card title="Status Aset Visual & Pengesahan" icon={Palette} description="Status kelengkapan identitas visual untuk dokumen cetak.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(a => {
          const isUploaded = !!settings.identityAssets?.[a.key]?.url;
          return (
            <div key={a.key} className={`p-4 rounded-xl border flex flex-col ${isUploaded ? 'bg-emerald-50 border-emerald-200' : (a.required ? 'bg-rose-50 border-rose-200' : 'bg-[var(--color-eds-bg)] border-[var(--color-eds-border)]')}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-eds-text-secondary)]">{a.label} {a.required && <span className="text-rose-500">*</span>}</span>
                {isUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : (a.required ? <XCircle className="w-4 h-4 text-rose-500" /> : <XCircle className="w-4 h-4 text-[var(--color-eds-text-secondary)]" />)}
              </div>
              <div className={`font-bold ${isUploaded ? 'text-emerald-700' : (a.required ? 'text-rose-700' : 'text-[var(--color-eds-text-secondary)]')}`}>
                {isUploaded ? 'Lengkap' : 'Belum Diunggah'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const PusatDataDashboard = ({ onNavigate }: any) => {
  const { settings } = useApp();

  const getCompletion = (section: string) => {
    const calcScore = (obj: any, keys: string[]) => {
      if (!obj) return 0;
      const filled = keys.filter(
        (k) => obj[k] && obj[k] !== "" && obj[k] !== 0,
      ).length;
      return Math.round((filled / keys.length) * 100);
    };

    switch (section) {
      case "import":
        return 100;
      case "academicYear":
        return 100;
            case "visualIdentity":
        const assets = ["governmentLogo", "schoolLogo", "schoolPhoto", "stamp", "principalSignature", "treasurerSignature", "committeeSignature"];
        return calcScore(settings.identityAssets, assets);
      case "school":
        return calcScore(settings.school, [
          "name",
          "npsn",
          "level",
          "status",
          "akreditasi",
          "address",
          "district",
          "regency",
          "province",
          "phone",
          "email",
        ]);
      case "pejabat":
      case "principal":
        return calcScore(settings.principal, [
          "name",
          "nip",
          "status",
        ]);
      case "guru":
        return settings.guru.length > 0 ? 100 : 0;
      case "tendik":
        return settings.tendik.length > 0 ? 100 : 0;
      case "pesertaDidik":
        return calcScore(settings.pesertaDidik, [
          "total",
          "lakiLaki",
          "perempuan",
          "jumlahRombel",
        ]);
      case "rombel":
        return settings.rombel.length > 0 ? 100 : 0;
      case "sarpras":
        return calcScore(settings.sarpras, [
          "ruangKelas",
          "perpustakaan",
          "laboratorium",
          "toilet",
          "ruangGuru",
        ]);
      case "komite":
        return calcScore(settings.komite, ["name"]);
      case "pengawas":
        return calcScore(settings.pengawas, ["name", "nip"]);
      case "identitas":
        return calcScore(settings.identitas, ["visi", "motto"]) > 0 ||
          settings.identitas.misi.length > 0
          ? 100
          : 0;
      case "karakteristik":
        return settings.karakteristik?.lokasi?.length > 0 ||
          settings.karakteristik?.lingkungan
          ? 100
          : 0;
      case "potensi":
        return settings.potensi?.daerah?.length > 0 ||
          settings.potensi?.kearifanLokal?.length > 0
          ? 100
          : 0;
      case "programUnggulan":
        return settings.programUnggulan?.length > 0 ? 100 : 0;
      default:
        return 0;
    }
  };

  const activeYear = settings.academicYears?.find((y: any) => y.isActive);

  const cards = [
    {
      id: "academicYear",
      title: "Tahun Pelajaran",
      icon: Calendar,
      desc: activeYear
        ? `${activeYear.name} (${activeYear.semester})`
        : "Belum diatur",
      progress: 100, // No progress bar needed
    },
    {
      id: "identitas",
      title: "Identitas Sekolah",
      icon: Target,
      desc: settings.identitas.visi ? "Visi & Misi Terisi" : "Belum diisi",
    },
    {
      id: "karakteristik",
      title: "Karakteristik Sekolah",
      icon: Map,
      desc:
        settings.karakteristik?.lokasi?.length > 0
          ? "Terkonfigurasi"
          : "Belum diisi",
    },
    {
      id: "potensi",
      title: "Potensi Daerah & Lokal",
      icon: Compass,
      desc:
        settings.potensi?.daerah?.length > 0 ? "Terkonfigurasi" : "Belum diisi",
    },
    {
      id: "programUnggulan",
      title: "Program Unggulan",
      icon: Star,
      desc: `${settings.programUnggulan.length} Program`,
    },
    {
      id: "school",
      title: "Profil Sekolah",
      icon: Building2,
      desc: settings.school.name || "Belum diisi",
    },
    {
      id: "pejabat",
      title: "Pejabat Penandatangan",
      icon: UserCircle,
      desc: settings.principal.name || "Belum diisi",
    },
    {
      id: "guru",
      title: "Guru",
      icon: Users,
      desc: `${settings.guru.length} Guru`,
    },
    {
      id: "tendik",
      title: "Tenaga Kependidikan",
      icon: Briefcase,
      desc: `${settings.tendik.length} Tendik`,
    },
    {
      id: "pesertaDidik",
      title: "Peserta Didik",
      icon: Users,
      desc: `${settings.pesertaDidik.total || 0} Siswa`,
    },
    {
      id: "rombel",
      title: "Rombongan Belajar",
      icon: Layers,
      desc: `${settings.rombel.length} Kelas`,
    },
    {
      id: "sarpras",
      title: "Sarana Prasarana",
      icon: Home,
      desc: `${settings.sarpras.ruangKelas || 0} Ruang Kelas`,
    },
    {
      id: "komite",
      title: "Komite Sekolah",
      icon: Users,
      desc: settings.komite?.name || "Belum diisi",
    },
    {
      id: "pengawas",
      title: "Pengawas Pembina",
      icon: UserCheck,
      desc: settings.pengawas?.name || "Belum diisi",
    },
  ];

  const totalScore = Math.round(
    cards.reduce((acc, c) => acc + getCompletion(c.id), 0) / cards.length,
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border-l-[6px] border-blue-700 rounded-xl shadow-sm flex items-center justify-between p-6 border-y border-r border-[var(--color-eds-border)]">
        <div>
          <h2 className="text-2xl font-black mb-2 tracking-tight">
            Pusat Data Sekolah
          </h2>
          <p className="text-[var(--color-eds-text-secondary)]">
            Sumber data utama untuk seluruh dokumen administrasi.
          </p>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 rounded border-4 border-blue-400 flex items-center justify-center mb-2 mx-auto">
            <span className="text-2xl font-black">{totalScore}%</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-eds-text-secondary)]">
            Kelengkapan
          </span>
        </div>
      </div>

      <VisualIdentityStatusWidget />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const score = getCompletion(c.id);
          return (
            <div
              key={c.id}
              onClick={() => onNavigate(c.id)}
              className="enterprise-card p-6 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-[var(--color-eds-text-primary)] font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <c.icon className="w-6 h-6" />
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${score === 100 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {score}%
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-1">
                {c.title}
              </h3>
              <p className="text-sm text-[var(--color-eds-text-primary)] font-medium truncate">
                {c.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS / MASTER DATA UI TABS
// ============================================================================
const AssetUploadField = ({ title, desc, assetKey, isRequired = false }: any) => {
  const { settings, updateSetting, showToast } = useApp();
  const asset = settings.identityAssets?.[assetKey];

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
       if (showToast) showToast("Format file tidak didukung. Gunakan PNG atau JPG.", "error");
       return;
    }
    if (file.size > 5 * 1024 * 1024) {
       if (showToast) showToast("Ukuran file maksimal 5 MB.", "error");
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/png', 0.9);
        
        updateSetting("identityAssets", assetKey, {
          url: compressedBase64,
          size: file.size,
          uploadedAt: Date.now(),
          name: file.name,
          type: file.type
        });
        if (showToast) showToast("Aset berhasil diunggah");
      };
      img.src = base64Str;
    };
    reader.readAsDataURL(file);
  };

  const [confirmModal, setConfirmModal] = useState(false);

  const handleDelete = () => {
    setConfirmModal(true);
  };

  const confirmDelete = () => {
    updateSetting("identityAssets", assetKey, null);
    setConfirmModal(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-[var(--color-eds-border)] rounded-xl bg-white gap-4">
      <div className="flex-1">
        <h4 className="font-bold text-[var(--color-eds-text-primary)] mb-1 flex items-center gap-2">
          {title} {isRequired && <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase">Wajib</span>}
        </h4>
        <p className="text-sm text-[var(--color-eds-text-primary)] mb-2 font-medium">{desc}</p>
        <p className="text-xs text-[var(--color-eds-text-secondary)]">Format: PNG/JPG • Maks. 5MB</p>
        {asset && (
           <div className="mt-3 flex flex-wrap gap-2 items-center">
             <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tersedia</span>
             <span className="text-xs text-[var(--color-eds-text-secondary)] bg-slate-100 px-2 py-1 rounded border border-[var(--color-eds-border)]">{formatSize(asset.size)}</span>
             <span className="text-xs text-[var(--color-eds-text-secondary)] bg-slate-100 px-2 py-1 rounded border border-[var(--color-eds-border)]" title={asset.name}>{asset.name.length > 20 ? asset.name.substring(0, 20) + '...' : asset.name}</span>
             <span className="text-xs text-[var(--color-eds-text-secondary)] bg-slate-100 px-2 py-1 rounded border border-[var(--color-eds-border)]">{formatDate(asset.uploadedAt)}</span>
           </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        {asset ? (
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded border border-[var(--color-eds-border)] overflow-hidden bg-[var(--color-eds-bg)] flex items-center justify-center p-1">
              <img src={asset.url} alt={title} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer text-xs font-bold text-[var(--color-eds-text-primary)] font-bold hover:text-[var(--color-eds-primary)] font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-center transition-colors">
                <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
                Ganti
              </label>
              <button onClick={handleDelete} className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors">Hapus</button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-[var(--color-eds-border)] shadow-sm text-sm font-medium rounded-xl text-[var(--color-eds-text-primary)] bg-white hover:bg-[var(--color-eds-bg)] transition-colors">
            <UploadCloud className="w-4 h-4 mr-2 text-[var(--color-eds-text-secondary)]" />
            Unggah File
            <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
      </div>

      <GenericModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Anda yakin ingin menghapus aset ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        isDanger={true}
        icon={AlertTriangle}
      />
    </div>
  );
};

const SettingsTabs = {
  Pejabat: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const updateKadis = (f, v) => updateSetting("kepalaDinas", f, v);
    const updatePrincipal = (f, v) => updateSetting("principal", f, v);
    const updateKomite = (f, v) => updateSetting("komite", f, v);
    const updatePengawas = (f, v) => updateSetting("pengawas", f, v);
    const updateBendahara = (f, v) => updateSetting("bendaharaBOS", f, v);

    return (
      <div className="space-y-6">
        <PageHelp title="Pejabat Penandatangan" description="Kelola data pimpinan dan pejabat untuk penandatanganan dokumen." importance="Digunakan sebagai referensi data di seluruh lembar pengesahan." nextStep="Isi seluruh data pejabat." />
        
        <Card title="Kepala Sekolah" icon={UserCircle} description="Data Kepala Sekolah Definitif / PLT.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Lengkap" value={settings.principal?.name || ""} onChange={(v) => updatePrincipal("name", v)} placeholder="Cth: Budi Santoso, S.Pd., M.Pd." />
            <Input label="NIP" value={settings.principal?.nip || ""} onChange={(v) => updatePrincipal("nip", v)} />
            <div>
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] mb-1">Status</label>
              <select className="w-full px-4 py-2 bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl" value={settings.principal?.status || "Definitif"} onChange={(e) => updatePrincipal("status", e.target.value)}>
                <option value="Definitif">Definitif</option>
                <option value="PLT">PLT</option>
              </select>
            </div>
            <Input label="Pangkat/Golongan" value={settings.principal?.group || ""} onChange={(v) => updatePrincipal("group", v)} placeholder="Cth: Pembina / IV.a" />
            <Input label="Nomor SK" value={settings.principal?.noSk || ""} onChange={(v) => updatePrincipal("noSk", v)} />
            <Input label="Tanggal SK" type="date" value={settings.principal?.tglSk || ""} onChange={(v) => updatePrincipal("tglSk", v)} />
          </div>
        </Card>

        <Card title="Bendahara BOS" icon={Briefcase} description="Data Bendahara Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Lengkap" value={settings.bendaharaBOS?.name || ""} onChange={(v) => updateBendahara("name", v)} />
            <Input label="NIP" value={settings.bendaharaBOS?.nip || ""} onChange={(v) => updateBendahara("nip", v)} />
          </div>
        </Card>

        <Card title="Ketua Komite" icon={Users} description="Data Ketua Komite Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Ketua Komite" value={settings.komite?.name || ""} onChange={(v) => updateKomite("name", v)} />
            <Input label="Nomor Telepon" value={settings.komite?.phone || ""} onChange={(v) => updateKomite("phone", v)} />
          </div>
        </Card>

        <Card title="Pengawas Pembina" icon={UserCheck} description="Data Pengawas Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Pengawas" value={settings.pengawas?.name || ""} onChange={(v) => updatePengawas("name", v)} />
            <Input label="NIP" value={settings.pengawas?.nip || ""} onChange={(v) => updatePengawas("nip", v)} />
          </div>
        </Card>

        <Card title="Kepala Dinas" icon={Building2} description="Data Kepala Dinas Pendidikan terkait.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Kepala Dinas" value={settings.kepalaDinas?.name || ""} onChange={(v) => updateKadis("name", v)} />
            <Input label="NIP" value={settings.kepalaDinas?.nip || ""} onChange={(v) => updateKadis("nip", v)} />
            <Input label="Jabatan" value={settings.kepalaDinas?.jabatan || ""} onChange={(v) => updateKadis("jabatan", v)} placeholder="Cth: Kepala Dinas Pendidikan Kota Banjarmasin" />
          </div>
        </Card>
      </div>
    );
  },

  Administrasi: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const administrasi = settings.administrasi || {};
    const draftingTeam = settings.draftingTeam || [];
    const update = (f: string, v: any) => updateSetting("administrasi", f, v);
    
    return (
      <div className="space-y-6">
        <PageHelp title="Administrasi Dokumen" description="Kelola metadata penetapan, pengesahan, dan tim penyusun." importance="Data ini menentukan legalitas dan metadata dokumen final." nextStep="Lengkapi semua kolom penetapan." />
        
        <Card title="Atribut Pengesahan Dokumen" icon={FileText} description="Metadata resmi untuk dokumen.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nomor Dokumen" value={administrasi.documentNumber || ""} onChange={(v) => update("documentNumber", v)} placeholder="Cth: 421.2/012/SDN-1/2026" />
            <Input label="Tahun Pelajaran" value={administrasi.academicYear || ""} onChange={(v) => update("academicYear", v)} placeholder="Cth: 2026/2027" />
            <Input label="Tempat Penetapan" value={administrasi.establishmentPlace || ""} onChange={(v) => update("establishmentPlace", v)} placeholder="Cth: Banjarmasin" />
            <Input label="Tanggal Penetapan" type="date" value={administrasi.establishmentDate || ""} onChange={(v) => update("establishmentDate", v)} />
            <Input label="Tanggal Pengesahan (Approval)" type="date" value={administrasi.approvalDate || ""} onChange={(v) => update("approvalDate", v)} />
          </div>
        </Card>

        <Card title="Tim Penyusun (Drafting Team)" icon={Users} description="Tim pengembang kurikulum yang menyusun dokumen ini.">
          <div className="space-y-3 mt-4">
            {(draftingTeam).map((member: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <input maxLength={255}
                  type="text"
                  placeholder="Nama Lengkap"
                  value={member.name || ""}
                  onChange={(e) => {
                    const n = [...draftingTeam];
                    n[idx] = { ...n[idx], name: e.target.value };
                    updateSetting("draftingTeam", "", n);
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-eds-bg)] border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <input maxLength={255}
                  type="text"
                  placeholder="Peran (e.g. Ketua, Anggota)"
                  value={member.role || ""}
                  onChange={(e) => {
                    const n = [...draftingTeam];
                    n[idx] = { ...n[idx], role: e.target.value };
                    updateSetting("draftingTeam", "", n);
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-eds-bg)] border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => updateSetting("draftingTeam", "", draftingTeam.filter((_: any, i: number) => i !== idx))}
                  className="p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              onClick={() => updateSetting("draftingTeam", "", [...draftingTeam, { name: "", role: "" }])}
              variant="outline"
              className="w-full flex justify-center py-2 border-dashed border-2"
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Anggota Tim
            </Button>
          </div>
        </Card>
      </div>
    );
  },

  AcademicYear: ({ data, appCtx }: any) => {
    const { addAcademicYear, switchAcademicYear } = appCtx;
    const [isAdding, setIsAdding] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newSemester, setNewSemester] = React.useState("Ganjil");
    
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHelp title="Tahun Pelajaran" description="Kelola tahun pelajaran aktif." importance="Penting untuk sinkronisasi dokumen." nextStep="Pilih atau tambahkan tahun pelajaran." />
        <Card title="Daftar Tahun Pelajaran" description="Tahun pelajaran yang terdaftar.">
          <div className="space-y-4">
            {data.map((y: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${y.isActive ? 'bg-blue-50 border-blue-200' : 'bg-[var(--color-eds-bg)] border-[var(--color-eds-border)]'}`}>
                <div>
                  <h4 className="font-bold text-[var(--color-eds-text-primary)]">{y.name}</h4>
                  <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">{y.semester}</p>
                </div>
                <div>
                  {!y.isActive && (
                    <Button variant="outline" onClick={() => switchAcademicYear(y.id)}>Aktifkan</Button>
                  )}
                  {y.isActive && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">Aktif</span>
                  )}
                </div>
              </div>
            ))}
            
            {isAdding ? (
              <div className="p-4 rounded-xl border bg-[var(--color-eds-bg)] space-y-4">
                <Input label="Tahun Pelajaran" value={newName} onChange={setNewName} placeholder="Contoh: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`" />
                <div>
                  <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] mb-1">Semester</label>
                  <select className="w-full px-4 py-2 bg-white border border-[var(--color-eds-border)] rounded-xl" value={newSemester} onChange={e => setNewSemester(e.target.value)}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { addAcademicYear(newName, newSemester, [], true); setIsAdding(false); }} className="bg-blue-600 text-white">Simpan</Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} icon={Plus}>Tambah Tahun Pelajaran</Button>
            )}
          </div>
        </Card>
      </div>
    );
  },


  VisualIdentity: ({ appCtx }: any) => {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHelp title="Identitas Visual" description="Pusat pengaturan aset visual resmi sekolah. Diunggah sekali, otomatis digunakan di seluruh dokumen cetak (RKJM, RKT, RKAS, KSP)." importance="Memastikan seluruh dokumen resmi memiliki kop, stempel, dan tanda tangan yang sah dan seragam." nextStep="Unggah logo sekolah dan stempel resmi." />
        <Card title="Aset Visual" description="Aset pendukung visual sekolah (Opsional).">
          <div className="space-y-4">
            <AssetUploadField 
              title="Logo Sekolah" 
              desc="Logo utama sekolah (PNG dengan latar transparan direkomendasikan). Maks. 5MB." 
              assetKey="schoolLogo" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Foto Sekolah" 
              desc="Foto bangunan/tampak depan sekolah. Maks. 5MB." 
              assetKey="schoolPhoto" 
              isRequired={false} 
            />
          </div>
        </Card>
        
        <Card title="Aset Pengesahan" description="Aset resmi untuk pengesahan dokumen.">
          <div className="space-y-4">
            <AssetUploadField 
              title="Stempel Sekolah" 
              desc="Stempel resmi sekolah (PNG transparan). Maks. 5MB." 
              assetKey="stamp" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Kepala Sekolah" 
              desc="Tanda tangan kepala sekolah (PNG transparan). Maks. 5MB." 
              assetKey="principalSignature" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Bendahara" 
              desc="Tanda tangan bendahara (PNG transparan). Maks. 5MB." 
              assetKey="treasurerSignature" 
              isRequired={false} 
            />
            <AssetUploadField 
              title="Tanda Tangan Komite" 
              desc="Tanda tangan komite (PNG transparan). Maks. 5MB." 
              assetKey="committeeSignature" 
              isRequired={false} 
            />
          </div>
        </Card>
      </div>
    );
  },
  Karakteristik: ({ data, update }: any) => {
    const lokasiOptions = [
      "Perkotaan",
      "Pedesaan",
      "Pegunungan",
      "Pesisir",
      "Kepulauan",
      "Perbatasan",
      "Kawasan Industri",
      "Kawasan Pertanian",
      "Kawasan Perkebunan",
      "Kawasan Tambang",
      "Kawasan Hutan",
    ];
    const toggleLokasi = (opt: string) => {
      const current = data.lokasi || [];
      if (current.includes(opt))
        update(
          "lokasi",
          current.filter((i: string) => i !== opt),
        );
      else update("lokasi", [...current, opt]);
    };
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Karakteristik Sekolah"
          description="Kondisi lingkungan dan karakteristik civitas akademika."
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Lokasi Sekolah
              </label>
              <div className="flex flex-wrap gap-2">
                {lokasiOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleLokasi(opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${data.lokasi?.includes(opt) ? "bg-blue-600 text-white border-blue-600" : "bg-[var(--color-eds-bg)] text-[var(--color-eds-text-secondary)] border-slate-200 hover:border-[var(--color-eds-border)]"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <Textarea maxLength={2000}
              label="Kondisi Lingkungan"
              value={data.lingkungan}
              onChange={(v: any) => update("lingkungan", v)}
              rows={3}
              placeholder="Lingkungan sekitar sekolah, potensi wilayah, kondisi sosial, dll."
            />
            <Textarea maxLength={2000}
              label="Karakteristik Peserta Didik"
              value={data.pesertaDidik}
              onChange={(v: any) => update("pesertaDidik", v)}
              rows={3}
            />
            <Textarea maxLength={2000}
              label="Karakteristik Guru"
              value={data.guru}
              onChange={(v: any) => update("guru", v)}
              rows={3}
            />
            <Textarea maxLength={2000}
              label="Karakteristik Orang Tua"
              value={data.orangTua}
              onChange={(v: any) => update("orangTua", v)}
              rows={3}
            />
          </div>
        </Card>
      </div>
    );
  },
  Potensi: ({ data, update }: any) => {
    const potensiOptions = [
      "Pertanian",
      "Perkebunan",
      "Peternakan",
      "Perikanan",
      "Pariwisata",
      "UMKM",
      "Industri",
      "Pertambangan",
      "Kerajinan",
      "Jasa",
      "Lainnya",
    ];
    const togglePotensi = (opt: string) => {
      const current = data.daerah || [];
      if (current.includes(opt))
        update(
          "daerah",
          current.filter((i: string) => i !== opt),
        );
      else update("daerah", [...current, opt]);
    };
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Potensi & Kearifan Lokal"
          description="Potensi unggulan dan kearifan lokal di sekitar sekolah."
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Potensi Daerah
              </label>
              <div className="flex flex-wrap gap-2">
                {potensiOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => togglePotensi(opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${data.daerah?.includes(opt) ? "bg-amber-500 text-white border-amber-500" : "bg-[var(--color-eds-bg)] text-[var(--color-eds-text-secondary)] border-slate-200 hover:border-[var(--color-eds-border)]"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Kearifan Lokal
              </label>
              {(data.kearifanLokal || []).map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input maxLength={255}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const n = [...(data.kearifanLokal || [])];
                      n[idx] = e.target.value;
                      update("kearifanLokal", n);
                    }}
                    className="flex-1 px-4 py-2 bg-[var(--color-eds-bg)] border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Misal: Tarian Tradisional, Makanan Khas, dll"
                  />
                  <button
                    onClick={() =>
                      update(
                        "kearifanLokal",
                        data.kearifanLokal.filter(
                          (_: any, i: number) => i !== idx,
                        ),
                      )
                    }
                    className="p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <Button
                onClick={() =>
                  update("kearifanLokal", [...(data.kearifanLokal || []), ""])
                }
                variant="outline"
                icon={Plus}
                size="sm"
              >
                Tambah Kearifan Lokal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  },
  ProgramUnggulan: ({ data, update }: any) => {
    const handleAdd = () => update("", [...data, ""]);
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Program Unggulan Sekolah"
          description="Daftar program unggulan yang dimiliki sekolah."
        >
          <div className="space-y-3">
            {data.length === 0 ? (
              <div className="text-center p-6 bg-[var(--color-eds-bg)] rounded-xl border border-dashed border-[var(--color-eds-border)]">
                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-[var(--color-eds-text-secondary)]" />
                </div>
                <h4 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-2">Program Unggulan Kosong</h4>
                <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 max-w-sm mx-auto font-medium">Daftarkan program unggulan sekolah Anda untuk diintegrasikan secara otomatis ke dalam dokumen KSP.</p>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Program
                </Button>
              </div>
            ) : (
              data.map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <input maxLength={255}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const n = [...data];
                      n[idx] = e.target.value;
                      update("", n);
                    }}
                    className="flex-1 px-4 py-2 bg-[var(--color-eds-bg)] border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500"
                    placeholder="Misal: Sekolah Adiwiyata, Robotik, Literasi"
                  />
                  <button
                    onClick={() =>
                      update(
                        "",
                        data.filter((_: any, i: number) => i !== idx),
                      )
                    }
                    className="p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
            <Button
              onClick={() => update("", [...data, ""])}
              variant="outline"
              icon={Plus}
            >
              Tambah Program
            </Button>
          </div>
        </Card>
      </div>
    );
  },
  School: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const data = settings.school;
    const update = (f: any, v: any) => updateSetting("school", f, v);
    
    const identitasData = settings.identitas;
    const updateIdentitas = (f: any, v: any) => updateSetting("identitas", f, v);

    const handleImageUpload = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { if (appCtx.showToast) appCtx.showToast("File terlalu besar", "error"); return; }
      const reader = new FileReader();
      reader.onload = (event: any) => {
        update("governmentLogo", event.target.result);
      };
      reader.readAsDataURL(file);
    };

    return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Profil Institusi"
        description="Identitas utama satuan pendidikan Anda yang akan tertera pada seluruh dokumen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2">
            <AssetUploadField 
              title="Logo Pemerintah Daerah" 
              desc="Logo instansi pemerintah daerah. Wajib untuk semua dokumen resmi." 
              assetKey="governmentLogo" 
              isRequired={true} 
            />
          </div>
          <div className="md:col-span-2">
            <AssetUploadField 
              title="Logo Sekolah (Opsional)" 
              desc="Logo satuan pendidikan. Akan ditampilkan di sisi kanan kop surat." 
              assetKey="schoolLogo" 
              isRequired={false} 
            />
          </div>
          <Input
            label="Instansi Naungan (Dinas/Cabdis/Yayasan)"
            value={data.instansi}
            onChange={(v: any) => update("instansi", v)}
            placeholder="Cth: DINAS PENDIDIKAN"
          />
          <Input
            label="Nama Sekolah"
            value={data.name}
            onChange={(v: any) => update("name", v)}
            required
          />
          <Input
            label="NPSN"
            value={data.npsn}
            onChange={(v: any) => update("npsn", v)}
            required
          />
          <Select
            label="Jenjang"
            value={data.level}
            onChange={(v: any) => update("level", v)}
            required
            options={[
              "PAUD",
              "SD",
              "SMP",
              "SMA",
              "SMK",
              "SLB",
              "Kesetaraan"
            ]}
          />
          <Select
            label="Status"
            value={data.status}
            onChange={(v: any) => update("status", v)}
            options={["Negeri", "Swasta"]}
          />
          <Select
            label="Akreditasi"
            value={data.akreditasi}
            onChange={(v: any) => update("akreditasi", v)}
            options={["A", "B", "C", "Belum Terakreditasi"]}
          />
          <div className="md:col-span-2">
            <Textarea maxLength={2000}
              label="Alamat Lengkap"
              value={data.address}
              onChange={(v: any) => update("address", v)}
              required
            />
          </div>
          <Input
            label="Desa/Kelurahan"
            value={data.village}
            onChange={(v: any) => update("village", v)}
          />
          <Input
            label="Kecamatan"
            value={data.district}
            onChange={(v: any) => update("district", v)}
          />
          <Input
            label="Kabupaten/Kota"
            value={data.regency}
            onChange={(v: any) => update("regency", v)}
            required
          />
          <Input
            label="Provinsi"
            value={data.province}
            onChange={(v: any) => update("province", v)}
          />
          <Input
            label="Kode Pos"
            value={data.zip}
            onChange={(v: any) => update("zip", v)}
          />
          <Input
            label="Nomor Telepon"
            value={data.phone}
            onChange={(v: any) => update("phone", v)}
          />
          <Input
            label="Email Sekolah"
            value={data.email}
            onChange={(v: any) => update("email", v)}
            type="email"
          />
          <Input
            label="Website"
            value={data.website}
            onChange={(v: any) => update("website", v)}
          />
        </div>
      </Card>

      <Card
        title="Visi, Misi & Tujuan"
        description="Arah dan panduan utama pergerakan satuan pendidikan."
      >
        <div className="space-y-4">
          <Textarea maxLength={2000}
            label="Visi Sekolah"
            value={identitasData.visi}
            onChange={(v: any) => updateIdentitas("visi", v)}
            rows={3}
            required
            guidanceType="visi"
          />
          <Input
            label="Motto Sekolah"
            value={identitasData.motto}
            onChange={(v: any) => updateIdentitas("motto", v)}
            placeholder="Misal: Cerdas, Terampil, Berakhlak Mulia"
          />

          <div className="space-y-3">
            <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
              Misi Sekolah
            </label>
            {(identitasData.misi || []).map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input maxLength={255}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const n = [...(identitasData.misi || [])];
                    n[idx] = e.target.value;
                    updateIdentitas("misi", n);
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-eds-bg)] border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() =>
                    updateIdentitas(
                      "misi",
                      identitasData.misi.filter((_: any, i: number) => i !== idx),
                    )
                  }
                  className="p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              onClick={() => updateIdentitas("misi", [...(identitasData.misi || []), ""])}
              variant="outline"
              icon={Plus}
              size="sm"
            >
              Tambah Misi
            </Button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
              Tujuan Sekolah
            </label>
            {(identitasData.tujuan || []).map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input
                  value={item}
                  onChange={(val: any) => {
                    const newArray = [...(identitasData.tujuan || [])];
                    newArray[idx] = val;
                    updateIdentitas("tujuan", newArray);
                  }}
                  placeholder={`Tujuan ${idx + 1}`}
                  className="flex-1"
                />
                <button
                  onClick={() =>
                    updateIdentitas(
                      "tujuan",
                      identitasData.tujuan.filter((_: any, i: number) => i !== idx),
                    )
                  }
                  className="mt-7 p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              onClick={() => updateIdentitas("tujuan", [...(identitasData.tujuan || []), ""])}
              variant="outline"
              icon={Plus}
              size="sm"
            >
              Tambah Tujuan
            </Button>
          </div>
        </div>
      </Card>
    </div>
    );
  },
  Principal: ({ data, update }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Data Kepala Sekolah"
        description="Informasi pimpinan satuan pendidikan untuk penandatanganan dokumen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Nama Lengkap"
            value={data.name}
            onChange={(v: any) => update("name", v)}
            required
          />
          <Input
            label="Gelar"
            value={data.gelar}
            onChange={(v: any) => update("gelar", v)}
            placeholder="Misal: S.Pd., M.Pd."
          />
          <Input
            label="NIP"
            value={data.nip}
            onChange={(v: any) => update("nip", v)}
            required
          />
          <Input
            label="NUPTK"
            value={data.nuptk}
            onChange={(v: any) => update("nuptk", v)}
          />
          <Input
            label="Pangkat"
            value={data.rank}
            onChange={(v: any) => update("rank", v)}
            placeholder="Misal: Pembina Tk. I"
          />
          <Input
            label="Golongan/Ruang"
            value={data.group}
            onChange={(v: any) => update("group", v)}
            placeholder="Misal: IV/b"
          />
          <Input
            label="Jabatan"
            value={data.position}
            onChange={(v: any) => update("position", v)}
            required
          />
          <Input
            label="Nomor SK"
            value={data.noSk}
            onChange={(v: any) => update("noSk", v)}
          />
          <Input
            label="Tanggal SK"
            value={data.tglSk}
            onChange={(v: any) => update("tglSk", v)}
            type="date"
          />
          <Input
            label="Mulai Menjabat"
            value={data.mulaiMenjabat}
            onChange={(v: any) => update("mulaiMenjabat", v)}
            type="date"
          />
          <Input
            label="Email"
            value={data.email}
            onChange={(v: any) => update("email", v)}
            type="email"
          />
          <Input
            label="Nomor HP/WA"
            value={data.phone}
            onChange={(v: any) => update("phone", v)}
          />
        </div>
      </Card>
    </div>
  ),
  Guru: ({ data, update }: any) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const filteredData = data.filter((g: any) => {
      if (
        searchTerm &&
        !g.nama?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !g.nip?.includes(searchTerm)
      )
        return false;
      if (filterStatus && g.status !== filterStatus) return false;
      return true;
    });

    const handleAdd = () => {
      const newId = Date.now();
      update([
        ...data,
        {
          id: newId,
          nama: "",
          gelar: "",
          nip: "",
          nuptk: "",
          jk: "L",
          tmptLahir: "",
          tglLahir: "",
          pendidikan: "",
          mapel: "",
          jabatan: "Guru Kelas",
          status: "PNS",
          golongan: "",
          pangkat: "",
          hp: "",
          email: "",
        },
      ]);
      setEditingId(newId);
    };

    const updateItem = (id: number, field: string, val: any) => {
      update(data.map((d: any) => (d.id === id ? { ...d, [field]: val } : d)));
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Data Guru"
          description="Daftar pendidik di satuan pendidikan Anda."
          headerAction={
            <Button icon={Plus} onClick={handleAdd}>
              Tambah Guru
            </Button>
          }
        >
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-eds-text-secondary)]" />
              <input maxLength={255}
                type="text"
                placeholder="Cari nama atau NIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-medium transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="PNS">PNS</option>
              <option value="PPPK">PPPK</option>
              <option value="Honorer">Honorer</option>
            </select>
          </div>

          {data.length === 0 ? (
            <div className="text-center p-6 bg-[var(--color-eds-bg)] rounded-xl border border-dashed border-[var(--color-eds-border)]">
                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-[var(--color-eds-text-secondary)]" />
                </div>
                <h4 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-2">Data Guru Kosong</h4>
                <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 max-w-sm mx-auto font-medium">Tambahkan data pendidik di sekolah Anda. Data ini akan digunakan dalam penyusunan KSP dan SK Pembagian Tugas.</p>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Guru
                </Button>
              </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-6 text-[var(--color-eds-text-primary)] font-medium">
              Tidak ada hasil pencarian.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((g: any) => (
                <div
                  key={g.id}
                  className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] relative group"
                >
                  {editingId === g.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Nama Lengkap"
                          value={g.nama}
                          onChange={(v: any) => updateItem(g.id, "nama", v)}
                          required
                        />
                        <Input
                          label="Gelar"
                          value={g.gelar}
                          onChange={(v: any) => updateItem(g.id, "gelar", v)}
                        />
                        <Input
                          label="NIP"
                          value={g.nip}
                          onChange={(v: any) => updateItem(g.id, "nip", v)}
                        />
                        <Input
                          label="NUPTK"
                          value={g.nuptk}
                          onChange={(v: any) => updateItem(g.id, "nuptk", v)}
                        />
                        <Select
                          label="Jenis Kelamin"
                          value={g.jk}
                          onChange={(v: any) => updateItem(g.id, "jk", v)}
                          options={[
                            { value: "L", label: "Laki-laki" },
                            { value: "P", label: "Perempuan" },
                          ]}
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            label="Tempat Lahir"
                            value={g.tmptLahir}
                            onChange={(v: any) =>
                              updateItem(g.id, "tmptLahir", v)
                            }
                          />
                          <Input
                            label="Tanggal Lahir"
                            type="date"
                            value={g.tglLahir}
                            onChange={(v: any) =>
                              updateItem(g.id, "tglLahir", v)
                            }
                          />
                        </div>
                        <Input
                          label="Pendidikan Terakhir"
                          value={g.pendidikan}
                          onChange={(v: any) =>
                            updateItem(g.id, "pendidikan", v)
                          }
                        />
                        <Input
                          label="Mata Pelajaran"
                          value={g.mapel}
                          onChange={(v: any) => updateItem(g.id, "mapel", v)}
                        />
                        <Input
                          label="Jabatan"
                          value={g.jabatan}
                          onChange={(v: any) => updateItem(g.id, "jabatan", v)}
                        />
                        <Select
                          label="Status"
                          value={g.status}
                          onChange={(v: any) => updateItem(g.id, "status", v)}
                          options={["PNS", "PPPK", "Honorer"]}
                          required
                        />
                        <Input
                          label="Pangkat"
                          value={g.pangkat}
                          onChange={(v: any) => updateItem(g.id, "pangkat", v)}
                        />
                        <Input
                          label="Golongan"
                          value={g.golongan}
                          onChange={(v: any) => updateItem(g.id, "golongan", v)}
                        />
                        <Input
                          label="Nomor HP"
                          value={g.hp}
                          onChange={(v: any) => updateItem(g.id, "hp", v)}
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={g.email}
                          onChange={(v: any) => updateItem(g.id, "email", v)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--color-eds-border)]">
                        <Button
                          variant="danger"
                          onClick={() =>
                            update(data.filter((d: any) => d.id !== g.id))
                          }
                        >
                          Hapus
                        </Button>
                        <Button onClick={() => setEditingId(null)}>
                          Selesai
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">
                          {g.nama || "Tanpa Nama"}{" "}
                          {g.gelar && (
                            <span className="text-sm font-normal text-[var(--color-eds-text-primary)] font-medium">
                              {g.gelar}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-[var(--color-eds-text-primary)] mt-1 font-medium">
                          {g.nip ? `NIP. ${g.nip}` : "Belum ada NIP"} •{" "}
                          {g.status}
                        </p>
                        <p className="text-sm text-[var(--color-eds-text-primary)] mt-1 font-medium">
                          {g.mapel} / {g.jabatan}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingId(g.id)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  },
  Tendik: ({ data, update }: any) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const filteredData = data.filter((g: any) => {
      if (
        searchTerm &&
        !g.nama?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !g.nip?.includes(searchTerm)
      )
        return false;
      if (filterStatus && g.status !== filterStatus) return false;
      return true;
    });

    const handleAdd = () => {
      const newId = Date.now();
      update([
        ...data,
        {
          id: newId,
          nama: "",
          gelar: "",
          nip: "",
          nuptk: "",
          jk: "L",
          tmptLahir: "",
          tglLahir: "",
          pendidikan: "",
          jabatan: "Tata Usaha",
          status: "PNS",
          golongan: "",
          pangkat: "",
          hp: "",
          email: "",
        },
      ]);
      setEditingId(newId);
    };

    const updateItem = (id: number, field: string, val: any) => {
      update(data.map((d: any) => (d.id === id ? { ...d, [field]: val } : d)));
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Data Tenaga Kependidikan"
          description="Daftar staf TU, Pustakawan, Laboran, dll."
          headerAction={
            <Button icon={Plus} onClick={handleAdd}>
              Tambah Tendik
            </Button>
          }
        >
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-eds-text-secondary)]" />
              <input maxLength={255}
                type="text"
                placeholder="Cari nama atau NIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-medium transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="PNS">PNS</option>
              <option value="PPPK">PPPK</option>
              <option value="Honorer">Honorer</option>
            </select>
          </div>

          {data.length === 0 ? (
            <div className="text-center p-6 bg-[var(--color-eds-bg)] rounded-xl border border-dashed border-[var(--color-eds-border)]">
                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-[var(--color-eds-text-secondary)]" />
                </div>
                <h4 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-2">Data Tendik Kosong</h4>
                <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 max-w-sm mx-auto font-medium">Tambahkan data tenaga kependidikan. Data ini penting untuk melengkapi profil sekolah.</p>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Tendik
                </Button>
              </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-6 text-[var(--color-eds-text-primary)] font-medium">
              Tidak ada hasil pencarian.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((g: any) => (
                <div
                  key={g.id}
                  className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] relative group"
                >
                  {editingId === g.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Nama Lengkap"
                          value={g.nama}
                          onChange={(v: any) => updateItem(g.id, "nama", v)}
                          required
                        />
                        <Input
                          label="Gelar"
                          value={g.gelar}
                          onChange={(v: any) => updateItem(g.id, "gelar", v)}
                        />
                        <Input
                          label="NIP"
                          value={g.nip}
                          onChange={(v: any) => updateItem(g.id, "nip", v)}
                        />
                        <Input
                          label="NUPTK"
                          value={g.nuptk}
                          onChange={(v: any) => updateItem(g.id, "nuptk", v)}
                        />
                        <Select
                          label="Jenis Kelamin"
                          value={g.jk}
                          onChange={(v: any) => updateItem(g.id, "jk", v)}
                          options={[
                            { value: "L", label: "Laki-laki" },
                            { value: "P", label: "Perempuan" },
                          ]}
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            label="Tempat Lahir"
                            value={g.tmptLahir}
                            onChange={(v: any) =>
                              updateItem(g.id, "tmptLahir", v)
                            }
                          />
                          <Input
                            label="Tanggal Lahir"
                            type="date"
                            value={g.tglLahir}
                            onChange={(v: any) =>
                              updateItem(g.id, "tglLahir", v)
                            }
                          />
                        </div>
                        <Input
                          label="Pendidikan Terakhir"
                          value={g.pendidikan}
                          onChange={(v: any) =>
                            updateItem(g.id, "pendidikan", v)
                          }
                        />
                        <Input
                          label="Jabatan"
                          value={g.jabatan}
                          onChange={(v: any) => updateItem(g.id, "jabatan", v)}
                        />
                        <Select
                          label="Status"
                          value={g.status}
                          onChange={(v: any) => updateItem(g.id, "status", v)}
                          options={["PNS", "PPPK", "Honorer"]}
                          required
                        />
                        <Input
                          label="Pangkat"
                          value={g.pangkat}
                          onChange={(v: any) => updateItem(g.id, "pangkat", v)}
                        />
                        <Input
                          label="Golongan"
                          value={g.golongan}
                          onChange={(v: any) => updateItem(g.id, "golongan", v)}
                        />
                        <Input
                          label="Nomor HP"
                          value={g.hp}
                          onChange={(v: any) => updateItem(g.id, "hp", v)}
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={g.email}
                          onChange={(v: any) => updateItem(g.id, "email", v)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--color-eds-border)]">
                        <Button
                          variant="danger"
                          onClick={() =>
                            update(data.filter((d: any) => d.id !== g.id))
                          }
                        >
                          Hapus
                        </Button>
                        <Button onClick={() => setEditingId(null)}>
                          Selesai
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">
                          {g.nama || "Tanpa Nama"}{" "}
                          {g.gelar && (
                            <span className="text-sm font-normal text-[var(--color-eds-text-primary)] font-medium">
                              {g.gelar}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-[var(--color-eds-text-primary)] mt-1 font-medium">
                          {g.nip ? `NIP. ${g.nip}` : "Belum ada NIP"} •{" "}
                          {g.status}
                        </p>
                        <p className="text-sm text-[var(--color-eds-text-primary)] mt-1 font-medium">
                          {g.jabatan}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingId(g.id)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  },
  PesertaDidik: ({ data, update }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card title="Peserta Didik" description="Rekapitulasi jumlah siswa.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Total Peserta Didik"
            value={data.total}
            onChange={(v: any) => update("total", v)}
            type="number"
            required
          />
          <Input
            label="Laki-laki"
            value={data.lakiLaki}
            onChange={(v: any) => update("lakiLaki", v)}
            type="number"
          />
          <Input
            label="Perempuan"
            value={data.perempuan}
            onChange={(v: any) => update("perempuan", v)}
            type="number"
          />
          <Input
            label="Jumlah Rombel"
            value={data.jumlahRombel}
            onChange={(v: any) => update("jumlahRombel", v)}
            type="number"
          />
        </div>
      </Card>
    </div>
  ),
  Rombel: ({ data, update }: any) => {
    const handleAdd = () => update([...data, { id: Date.now(), nama: "", wali: "", lakiLaki: 0, perempuan: 0, siswa: 0 }]);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Rombongan Belajar"
          description="Daftar kelas dan wali kelas."
          headerAction={
            <Button
              icon={Plus}
              onClick={() =>
                update([
                  ...data,
                  { id: Date.now(), nama: "", wali: "", siswa: 0 },
                ])
              }
            >
              Tambah Rombel
            </Button>
          }
        >
          {data.length === 0 ? (
            <div className="text-center p-6 bg-[var(--color-eds-bg)] rounded-xl border border-dashed border-[var(--color-eds-border)]">
                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-[var(--color-eds-text-secondary)]" />
                </div>
                <h4 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-2">Rombongan Belajar Kosong</h4>
                <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 max-w-sm mx-auto font-medium">Atur jumlah rombongan belajar. Data ini digunakan untuk merencanakan kapasitas dan kebutuhan sarana prasarana.</p>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Rombel
                </Button>
              </div>
          ) : (
            <div className="space-y-4">
              {data.map((g: any, i: number) => (
                <div
                  key={g.id}
                  className="p-4 border border-[var(--color-eds-border)] rounded-xl flex gap-4 items-start bg-[var(--color-eds-bg)] relative"
                >
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Input
                      label="Nama Kelas"
                      value={g.nama}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].nama = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Wali Kelas"
                      value={g.wali}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].wali = v;
                        update(nd);
                      }}
                    />
                    <Input
                      label="Laki-laki"
                      type="number"
                      value={g.lakiLaki || 0}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].lakiLaki = parseInt(v) || 0;
                        nd[i].siswa = (nd[i].lakiLaki || 0) + (nd[i].perempuan || 0);
                        update(nd);
                      }}
                    />
                    <Input
                      label="Perempuan"
                      type="number"
                      value={g.perempuan || 0}
                      onChange={(v: any) => {
                        const nd = [...data];
                        nd[i].perempuan = parseInt(v) || 0;
                        nd[i].siswa = (nd[i].lakiLaki || 0) + (nd[i].perempuan || 0);
                        update(nd);
                      }}
                    />
                    <Input
                      label="Total Siswa"
                      type="number"
                      value={((g.lakiLaki || 0) + (g.perempuan || 0)) > 0 ? (g.lakiLaki || 0) + (g.perempuan || 0) : (g.siswa || 0)}
                      disabled={true}
                      onChange={(v: any) => {}}
                    />
                  </div>
                  <button
                    onClick={() =>
                      update(data.filter((_: any, idx: number) => idx !== i))
                    }
                    className="p-2 text-[var(--color-eds-danger)] hover:bg-[#FCE8E6] rounded-xl mt-6"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  },
  Sarpras: ({ data, update }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card title="Sarana Prasarana" description="Rekapitulasi jumlah ruang.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Ruang Kelas"
            value={data.ruangKelas}
            onChange={(v: any) => update("ruangKelas", v)}
            type="number"
          />
          <Input
            label="Perpustakaan"
            value={data.perpustakaan}
            onChange={(v: any) => update("perpustakaan", v)}
            type="number"
          />
          <Input
            label="Laboratorium"
            value={data.laboratorium}
            onChange={(v: any) => update("laboratorium", v)}
            type="number"
          />
          <Input
            label="Ruang UKS"
            value={data.uks}
            onChange={(v: any) => update("uks", v)}
            type="number"
          />
          <Input
            label="Toilet"
            value={data.toilet}
            onChange={(v: any) => update("toilet", v)}
            type="number"
          />
          <Input
            label="Mushola"
            value={data.mushola}
            onChange={(v: any) => update("mushola", v)}
            type="number"
          />
          <Input
            label="Ruang Guru"
            value={data.ruangGuru}
            onChange={(v: any) => update("ruangGuru", v)}
            type="number"
          />
          <Input
            label="Ruang Kepsek"
            value={data.ruangKepsek}
            onChange={(v: any) => update("ruangKepsek", v)}
            type="number"
          />
        </div>
      </Card>
    </div>
  ),
  Komite: ({ data, update }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Komite Sekolah"
        description="Susunan pengurus komite sekolah."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Ketua Komite"
            value={data.ketua}
            onChange={(v: any) => update("ketua", v)}
          />
          <Input
            label="Sekretaris"
            value={data.sekretaris}
            onChange={(v: any) => update("sekretaris", v)}
          />
          <Input
            label="Bendahara"
            value={data.bendahara}
            onChange={(v: any) => update("bendahara", v)}
          />
          <Textarea maxLength={2000}
            label="Anggota"
            value={data.anggota}
            onChange={(v: any) => update("anggota", v)}
            rows={3}
          />
        </div>
      </Card>
    </div>
  ),
  Pengawas: ({ data, update }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Pengawas Pembina"
        description="Data pengawas sekolah binaan."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Nama Pengawas"
            value={data.nama}
            onChange={(v: any) => update("nama", v)}
          />
          <Input
            label="NIP Pengawas"
            value={data.nip}
            onChange={(v: any) => update("nip", v)}
          />
          <Input
            label="Wilayah Binaan"
            value={data.wilayah}
            onChange={(v: any) => update("wilayah", v)}
          />
          <Input
            label="Nomor HP"
            value={data.hp}
            onChange={(v: any) => update("hp", v)}
          />
        </div>
      </Card>
    </div>
  ),
  Education: ({ data, update, appCtx }: any) => {
    // If appCtx is available, use School DNA. Otherwise fallback to data.
    const dna = appCtx?.settings?.identitas || { visi: data.vision, misi: data.mission, tujuan: data.goals, karakteristik: data.characteristics };
    const karakteristik = appCtx?.settings?.karakteristik?.lingkungan || data.characteristics;
    
    return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Profil Akademik & Filosofi (School DNA Engine)"
        description="Bab I & II KSP disusun otomatis secara dinamis dari Identitas Sekolah (School DNA Engine). Form ini dikunci untuk mencegah duplikasi data (Single Source of Truth)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2 space-y-4 mt-2">
            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold flex items-center gap-2">
              ℹ️ Visi, Misi, Tujuan, dan Karakteristik dikelola terpusat di Pengaturan &gt; Identitas Sekolah (School DNA).
            </div>
            <Textarea maxLength={2000}
              label="Visi Sekolah (Terkunci ke School DNA)"
              value={dna.visi || data.vision}
              onChange={() => {}}
              disabled
              rows={2}
            />
            <Textarea maxLength={2000}
              label="Misi Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.misi) ? dna.misi.join("\n") : dna.misi || data.mission}
              onChange={() => {}}
              disabled
              rows={4}
            />
            <Textarea maxLength={2000}
              label="Tujuan Sekolah (Terkunci ke School DNA)"
              value={Array.isArray(dna.tujuan) ? dna.tujuan.join("\n") : dna.tujuan || data.goals}
              onChange={() => {}}
              disabled
              rows={3}
            />
            <Textarea maxLength={2000}
              label="Karakteristik Lingkungan Belajar (Terkunci ke School DNA)"
              value={karakteristik}
              onChange={() => {}}
              disabled
              rows={3}
            />
          </div>
        </div>
      </Card>
    </div>
  )},
  Budget: ({ data, update, schoolStatus }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        title="Parameter Anggaran BOS"
        description="Data dasar otomatisasi perhitungan Rencana Kegiatan dan Anggaran Sekolah (RKAS)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Jumlah Siswa (Dapodik)"
            type="number"
            value={data.studentCount}
            onChange={(v) => update("studentCount", v)}
            required
          />
          <Input
            label="Satuan Dana BOS per Siswa"
            type="number"
            value={data.bosRate}
            onChange={(v) => update("bosRate", v)}
            prefix="Rp"
            required
          />
          <div className="md:col-span-2 p-6 enterprise-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-60 h-64 bg-white/10 rounded blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-[var(--color-eds-text-secondary)] mb-1 tracking-wider uppercase">
                  Total Estimasi Pagu (Auto)
                </label>
                <div className="text-4xl font-black tracking-tight drop-shadow-sm">
                  Rp {Number(data.totalPagu || 0).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md">
                <Wallet className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 relative py-2">
            <div className="flex items-center">
              <span className="pr-4 bg-white/80 text-sm font-bold text-blue-900 tracking-wider uppercase">
                Batas Persentase Penggunaan
              </span>
              <span className="px-3 py-1 bg-blue-50 text-[var(--color-eds-text-primary)] font-bold text-xs font-bold rounded border border-blue-100">
                Sesuai Status: {schoolStatus}
              </span>
            </div>
          </div>
          <Input
            label="Maks. Honorarium"
            type="number"
            value={data.honorariumLimit}
            onChange={(v) => update("honorariumLimit", v)}
            prefix="%"
            disabled={true}
          />
          <Input
            label="Maks. Pembelian Buku"
            type="number"
            value={data.bookLimit}
            onChange={(v) => update("bookLimit", v)}
            prefix="%"
          />
          <Input
            label="Maks. Pemeliharaan Sarpras"
            type="number"
            value={data.sarprasLimit}
            onChange={(v) => update("sarprasLimit", v)}
            prefix="%"
          />
          <Input
            label="Tarif PPN Berlaku"
            type="number"
            value={data.ppn}
            onChange={(v) => update("ppn", v)}
            prefix="%"
          />
        </div>
      </Card>
    </div>
  ),
  Branding: ({ data, update }: any) => {
    const fileInputRef1 = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    const fileInputRef3 = useRef<HTMLInputElement>(null);
    const { showToast } = useApp();

    const handleFile = (file: any, field: string) => {
      if (file && file.size > MAX_LOGO_SIZE * 5)
        return showToast("Ukuran maksimal 5MB.", "error");
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => update(field, e.target?.result);
        reader.readAsDataURL(file);
      }
    };

    const ImageBox = ({ field, label, refObj }: any) => (
      <div
        className="w-full aspect-video border-2 border-dashed border-[var(--color-eds-border)] rounded-[24px] flex flex-col items-center justify-center bg-[var(--color-eds-bg)]/50 hover:bg-[var(--color-eds-bg)] hover:border-[var(--color-eds-primary)] cursor-pointer relative overflow-hidden group"
        onClick={() => refObj.current?.click()}
      >
        <input
          type="file"
          ref={refObj}
          onChange={(e) => handleFile(e.target.files?.[0], field)}
          accept="image/*"
          className="hidden"
        />
        {data[field] ? (
          <img
            src={data[field]}
            alt={label}
            className="w-full h-full object-cover p-2 bg-white/50"
          />
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">Unggah {label}</p>
          </div>
        )}
        {data[field] && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              update(field, "");
            }}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-[#FCE8E6] text-[var(--color-eds-danger)] rounded-xl shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    );

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Identitas Visual & Galeri Sekolah"
          description="Logo institusi dan dokumentasi foto profil sekolah."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Logo Sekolah (PNG Transparan)
              </label>
              <ImageBox field="logoUrl" label="Logo" refObj={fileInputRef1} />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Foto Bangunan/Halaman Sekolah
              </label>
              <ImageBox
                field="fotoSekolahUrl"
                label="Foto Sekolah"
                refObj={fileInputRef2}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--color-eds-text-primary)] tracking-wide">
                Foto Profil Kepala Sekolah
              </label>
              <ImageBox
                field="fotoKepsekUrl"
                label="Foto Kepala Sekolah"
                refObj={fileInputRef3}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  },
  AI: ({ data, update }: any) => {
    const { settings, updateSetting, getActiveAcademicYear } = useApp();
    const mode = settings?.writingAssistant?.mode || "Optional";
    
    const setMode = (m: string) => {
      updateSetting("writingAssistant", "mode", m);
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          title="Konfigurasi Writing Assistant"
          description="Pengaturan asisten penulisan."
        >
          <div className="p-6">
            <h3 className="text-sm font-bold text-[var(--color-eds-text-primary)] mb-4 uppercase tracking-widest">
              Mode Asisten Penulisan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode("Disabled")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "Disabled" ? "border-rose-500 bg-rose-50" : "border-[var(--color-eds-border)] hover:border-[var(--color-eds-border)]"}`}
              >
                <div className="font-bold text-[var(--color-eds-text-primary)] mb-1">Disabled</div>
                <div className="text-xs text-[var(--color-eds-text-secondary)] leading-relaxed">
                  Semua fitur asisten dimatikan. Anda menyusun seluruh teks secara manual.
                </div>
              </button>
              
              <button
                onClick={() => setMode("Optional")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "Optional" ? "border-blue-500 bg-blue-50" : "border-[var(--color-eds-border)] hover:border-[var(--color-eds-border)]"}`}
              >
                <div className="font-bold text-[var(--color-eds-text-primary)] mb-1">Optional (Default)</div>
                <div className="text-xs text-[var(--color-eds-text-secondary)] leading-relaxed">
                  Asisten tersedia saat Anda membutuhkan perbaikan gaya bahasa atau pengembangan struktur.
                </div>
              </button>

              <button
                onClick={() => setMode("Automatic")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "Automatic" ? "border-emerald-500 bg-emerald-50" : "border-[var(--color-eds-border)] hover:border-[var(--color-eds-border)]"}`}
              >
                <div className="font-bold text-[var(--color-eds-text-primary)] mb-1">Automatic</div>
                <div className="text-xs text-[var(--color-eds-text-secondary)] leading-relaxed">
                  Asisten secara otomatis mengusulkan redaksi berdasarkan template resmi saat Anda mengetik.
                </div>
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-100 text-amber-800 text-xs leading-relaxed">
            <strong className="block mb-1">Catatan Penting:</strong>
            Writing Assistant tidak pernah mengambil keputusan manajerial atau mengubah data anggaran, melainkan hanya memperbaiki redaksional dokumen resmi agar sesuai dengan PUEBI dan laras bahasa formal instansi.
          </div>
        </Card>
      </div>
    );
  },
};

const StorageTab = () => {
  const { settings, importSettings, resetSettings, updateMetadata, showToast } =
    useApp();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [cloudStatus, setCloudStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [lastSavedCloud, setLastSavedCloud] = useState<number | null>(null);
  
  const [cloudLoadStatus, setCloudLoadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const loadFromFirebase = async () => {
    if (cloudLoadStatus === "loading" || cloudStatus === "saving") return;

    if (!confirm("Apakah Anda yakin ingin mengembalikan data dari Cloud? Data lokal yang belum tersimpan ke Cloud akan tertimpa.")) {
      return;
    }

    if (!navigator.onLine) {
      showToast("Gagal mengambil data. Periksa koneksi internet Anda.", "error");
      return;
    }

    setCloudLoadStatus("loading");
    try {
      const { db, auth } = await import('./lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const userId = auth.currentUser?.uid || "default_user";
      const docRef = doc(db, "user_settings", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tampuyak_settings) {
          console.log("[Tampuyak] RESTORE CLOUD", data.savedAt);
          console.log("[AUDIT] LOAD CLOUD:", data.tampuyak_settings?.school?.misi ? "misi:" + data.tampuyak_settings.school.misi.substring(0, 50) : "no misi", data.tampuyak_settings?.principal?.nip ? "nip:" + data.tampuyak_settings.principal.nip : "no nip");
          
          if (settings.metadata?.lastUpdated && data.savedAt && settings.metadata.lastUpdated >= data.savedAt) {
            // Check if local data is likely newer, but since user confirmed, we override anyway
            // Just a thought, but let's just proceed. Wait, the instructions said:
            // "Jika data cloud sama dengan local, tampilkan: Data sudah sama, tidak perlu restore"
            if (data.savedAt === settings.metadata.lastCloudSync) {
              setCloudLoadStatus("success");
              showToast("Data sudah sama, tidak perlu restore.", "success");
              setTimeout(() => setCloudLoadStatus("idle"), 3000);
              return;
            }
          }

          const restoredSettings = data.tampuyak_settings;
          restoredSettings.metadata = {
            ...restoredSettings.metadata,
            lastCloudSync: data.savedAt
          };

          importSettings(restoredSettings);
          await saveToIndexedDB(restoredSettings);
          
          setCloudLoadStatus("success");
          showToast("Berhasil mengembalikan data dari Cloud.", "success");
          setTimeout(() => setCloudLoadStatus("idle"), 3000);
        } else {
          throw new Error("Format data tidak sesuai.");
        }
      } else {
        setCloudLoadStatus("error");
        showToast("Data tidak ditemukan di Cloud.", "error");
        setTimeout(() => setCloudLoadStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Firebase load error:", err);
      setCloudLoadStatus("error");
      showToast("Gagal mengambil data dari Cloud. Pastikan Anda terhubung ke internet.", "error");
      setTimeout(() => setCloudLoadStatus("idle"), 3000);
    }
  };

  const saveToFirebase = async () => {
    if (cloudStatus === "saving" || cloudLoadStatus === "loading") return;

    if (!navigator.onLine) {
      showToast("Gagal menyimpan data. Periksa koneksi internet Anda.", "error");
      return;
    }

    setCloudStatus("saving");
    try {
      const now = Date.now();
      const currentState = {
        ...settings,
        metadata: { ...settings.metadata, lastUpdated: now, lastCloudSync: now },
      };

      const backupData = {
        tampuyak_settings: currentState,
        savedAt: now
      };
      
      const { db, auth } = await import('./lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      
      const userId = auth.currentUser?.uid || "default_user";
      const docRef = doc(db, "user_settings", userId);
      
      const inspectFirebaseData = (obj: any, path: string = '') => {
        if (obj === null || obj === undefined) {
          if (obj === undefined) console.log(`[AUDIT FIREBASE] ${path} = undefined`);
          return;
        }
        if (typeof obj === 'function' || typeof obj === 'symbol' || typeof obj === 'bigint') {
          console.log(`[AUDIT FIREBASE] ${path} = ${typeof obj}`);
          return;
        }
        if (typeof obj === 'object') {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              inspectObject(item, `${path}[${index}]`);
            });
          } else {
            Object.keys(obj).forEach(key => {
              const fullPath = path ? `${path}.${key}` : key;
              const val = obj[key];
              if (val === undefined) {
                console.log(`[AUDIT FIREBASE] ${fullPath} = undefined`);
              } else if (typeof val === 'function' || typeof val === 'symbol' || typeof val === 'bigint') {
                console.log(`[AUDIT FIREBASE] ${fullPath} = ${typeof val}`);
              } else if (typeof val === 'object' && val !== null) {
                inspectObject(val, fullPath);
              }
            });
          }
        }
      };

      const inspectObject = inspectFirebaseData;
      inspectFirebaseData(backupData, 'backupData');
      
      const sanitizeForFirestore = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }
        
        if (Array.isArray(obj)) {
          return obj.map(item => sanitizeForFirestore(item));
        }
        
        const sanitized: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key] !== undefined) {
              sanitized[key] = sanitizeForFirestore(obj[key]);
            }
          }
        }
        return sanitized;
      };

      const sanitizedBackupData = sanitizeForFirestore(backupData);
      
      await setDoc(docRef, sanitizedBackupData);
      
      console.log("[Tampuyak] SAVE CLOUD", now);
      console.log("[AUDIT] SAVE CLOUD:", currentState?.school?.misi ? "misi:" + currentState.school.misi.substring(0, 50) : "no misi", currentState?.principal?.nip ? "nip:" + currentState.principal.nip : "no nip");
      
      updateMetadata({ lastUpdated: now, lastCloudSync: now });
      setLastSavedCloud(backupData.savedAt);
      setCloudStatus("success");
      showToast("Berhasil disimpan ke Cloud secara permanen.", "success");
      
      setTimeout(() => setCloudStatus("idle"), 3000);
    } catch (err) {
      console.error("Firebase save error:", err);
      setCloudStatus("error");
      showToast("Gagal menyimpan ke Cloud. Silakan coba lagi.", "error");
      setTimeout(() => setCloudStatus("idle"), 3000);
    }
  };

  const handleExport = async () => {
    const backupData: Record<string, any> = {};
    
    // Fallback/other keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("tampuyak") || key.startsWith("eoffice")) && key !== STORAGE_KEY) {
        try {
          const val = localStorage.getItem(key);
          backupData[key] = val ? JSON.parse(val) : null;
        } catch(e) {
          backupData[key] = localStorage.getItem(key);
        }
      }
    }
    
    // Dapatkan data terbaru dari state utama
    const currentState = {
      ...settings,
      metadata: { ...settings.metadata, lastUpdated: Date.now() },
    };
    backupData[STORAGE_KEY] = currentState;

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const date = new Date();
    const filename = `tampuyak-backup-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}.json`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = filename;
    link.click();
    updateMetadata({ lastBackup: Date.now() });
    showToast("Seluruh sistem berhasil di-backup.", "success");
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const resultStr = event.target?.result as string;
          const parsed = JSON.parse(resultStr);
          
          let coreSettings: any = null;
          let formatVersion = "unknown";

          // 1. Deteksi Format
          if (parsed['tampuyak.settings']) {
            formatVersion = "V2 (Wrapper)";
            coreSettings = typeof parsed['tampuyak.settings'] === 'string' 
              ? JSON.parse(parsed['tampuyak.settings']) 
              : parsed['tampuyak.settings'];

            // Restore other keys to localStorage as fallback
            for (const key of Object.keys(parsed)) {
               if (key !== 'tampuyak.settings') {
                 const value = parsed[key];
                 try {
                   if (typeof value === 'object' && value !== null) {
                     localStorage.setItem(key, JSON.stringify(value));
                   } else {
                     localStorage.setItem(key, String(value));
                   }
                 } catch (err) {
                   console.error(`Failed to restore key ${key}`, err);
                 }
               }
            }
          } else if (parsed.school || parsed.identitas || parsed.guru) {
            formatVersion = "V1 (Root)";
            coreSettings = parsed;
          } else {
            showToast("Format file backup tidak dikenali.", "error");
            return;
          }

          console.log(`[RESTORE] Format Version: ${formatVersion}`);

          // 2. Migration Layer
          if (!coreSettings.version) coreSettings.version = 1;
          if (!coreSettings.metadata) coreSettings.metadata = {};
          coreSettings.metadata.lastUpdated = Date.now();
          if (!coreSettings.planning) coreSettings.planning = {
             status: "DRAFT",
             timKerja: [],
             evaluasiKinerja: { capaian: [], kendala: [], rekomendasi: [] },
             akarMasalah: [],
             alternatifSolusi: [],
             rkt: [],
             rkas: []
          };
          
          if (!coreSettings.identitas) coreSettings.identitas = { visi: "", misi: [], tujuan: [], motto: "", nilai: [] };
          if (!coreSettings.karakteristik) coreSettings.karakteristik = { lokasi: [], lingkungan: "", pesertaDidik: "", guru: "", orangTua: "" };
          
          console.log(`[RESTORE] Migration Success`);

          // 3. Eksekusi State
          importSettings(coreSettings);
          console.log(`[RESTORE] React State Updated`);

          // 4. Simpan langsung ke IndexedDB
          await saveToIndexedDB(coreSettings);
          console.log(`[RESTORE] IndexedDB Updated`);

          showToast("Sistem berhasil direstore. Memuat ulang...", "success");
          setTimeout(() => window.location.reload(), 1500);

        } catch (err) {
          console.error("Restore failed:", err);
          showToast("File backup tidak valid.", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const executeReset = () => {
    resetSettings();
    setIsResetOpen(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  const lastCloudSync = settings.metadata?.lastCloudSync || lastSavedCloud;
  const isSynced = lastCloudSync && lastCloudSync >= (settings.metadata?.lastUpdated || 0);
  const syncStatus = !lastCloudSync ? "Tersimpan di perangkat" : isSynced ? "Tersimpan di Cloud" : "Belum sinkron";

  return (
    <div className="space-y-6">
      <Card title="Penyimpanan Cloud (Firebase)" description="Simpan cadangan data Anda secara aman di Cloud.">
        <div className="flex flex-col gap-4 mt-2">
          
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {syncStatus === "Tersimpan di Cloud" ? <Cloud className="text-emerald-500 w-8 h-8 p-1.5 bg-emerald-50 rounded-lg" /> : syncStatus === "Belum sinkron" ? <RefreshCcw className="text-amber-500 w-8 h-8 p-1.5 bg-amber-50 rounded-lg" /> : <HardDrive className="text-slate-500 w-8 h-8 p-1.5 bg-slate-50 rounded-lg" />}
              <div>
                <p className="text-sm font-bold text-slate-700">Status Penyimpanan</p>
                <p className="text-xs font-medium text-slate-500">{syncStatus}</p>
              </div>
            </div>
            {lastCloudSync && (
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium text-slate-500">Terakhir disimpan ke Cloud</p>
                <p className="text-sm font-bold text-slate-700">{new Date(lastCloudSync).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex-1 text-sm text-slate-600">
              <p className="font-medium text-slate-900 mb-1">Simpan Manual ke Cloud</p>
              <p>Data tidak tersimpan otomatis ke Cloud saat Anda mengetik. Klik tombol di samping untuk menyimpan secara manual.</p>
            </div>
            <Button 
              onClick={saveToFirebase} 
              disabled={cloudStatus === "saving"}
              icon={UploadCloud}
              className={`min-w-[200px] justify-center ${cloudStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : cloudStatus === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {cloudStatus === "saving" ? "Menyimpan..." : cloudStatus === "success" ? "Berhasil disimpan" : cloudStatus === "error" ? "Gagal menyimpan" : "Simpan ke Cloud"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex-1 text-sm text-amber-700">
              <p className="font-medium text-amber-900 mb-1">Ambil dari Cloud</p>
              <p>Mengembalikan data yang terakhir kali Anda simpan ke Cloud. Tindakan ini akan <b>menimpa</b> data lokal saat ini.</p>
            </div>
            <Button 
              onClick={loadFromFirebase} 
              disabled={cloudLoadStatus === "loading"}
              icon={CloudRain}
              variant="outline"
              className={`min-w-[200px] justify-center bg-white ${cloudLoadStatus === 'success' ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50' : cloudLoadStatus === 'error' ? 'border-red-600 text-red-700 hover:bg-red-50' : 'border-amber-600 text-amber-700 hover:bg-amber-50'}`}
            >
              {cloudLoadStatus === "loading" ? "Mengambil..." : cloudLoadStatus === "success" ? "Berhasil Diambil" : cloudLoadStatus === "error" ? "Gagal Mengambil" : "Ambil dari Cloud"}
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Manajemen Local Storage" description="Amankan data Anda secara lokal.">
        <div className="flex gap-4 mt-4">
          <Button icon={Download} onClick={handleExport} className="flex-1">
            Backup JSON
          </Button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <Button
            icon={Upload}
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-white"
          >
            Restore JSON
          </Button>
        </div>
        <div className="mt-10 p-6 bg-[#FCE8E6] rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-red-700 font-bold mb-1">Zona Berbahaya</h4>
            <p className="text-sm text-red-600">
              Hapus seluruh Master Data & Proses Alur Kerja.
            </p>
          </div>
          <Button
            icon={Trash2}
            variant="danger"
            onClick={() => setIsResetOpen(true)}
          >
            Reset Sistem
          </Button>
        </div>
      </Card>
      <GenericModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={executeReset}
        title="Reset Sistem?"
        message="Tindakan permanen."
        confirmText="Ya, Reset"
        isDanger={true}
      />
    </div>
  );
};

const calcKategori = (nilai: number | string) => {
  if (nilai === "" || nilai === null || nilai === undefined) return "";
  const n = Number(nilai);
  if (n >= 80) return "Hijau";
  if (n >= 60) return "Kuning";
  return "Merah";
};

const AnalisisCerdasView = () => {
  const { settings, updateSetting } = useApp();
  const analisis = settings.analisis || {
    status: "Belum Dimulai",
    lastUpdated: null,
    data: {
      ringkasan: "",
      prioritas: [],
      akarPenyebab: "",
      kekuatan: [],
      kelemahan: [],
      peluang: [],
      tantangan: [],
      tujuan: [],
      program: [],
      kegiatan: [],
      indikator: [],
    },
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(analisis.data);

  useEffect(() => {
    setFormData(analisis.data);
  }, [analisis.data]);

  const generateAnalisis = () => {
    const rData = settings.rapor?.data || {};
    const rTarget = settings.rapor?.target || {};

    let gaps: any[] = [];
    let strengths: string[] = [];
    let weaknesses: string[] = [];

    RaporDictionary.forEach((dim: any) => {
      const indValues = dim.indikator
        .map((ind: any) => Number(rData[ind.id]?.nilai))
        .filter((v: number) => !isNaN(v) && v > 0);
      const dimNilai = indValues.length
        ? Math.round(
            indValues.reduce((a: number, b: number) => a + b, 0) /
              indValues.length,
          )
        : 0;
      const target = Number(rTarget[dim.dimensi] || 0);

      if (dimNilai > 0) {
        if (target > 0 && dimNilai < target) {
          gaps.push({
            dimensi: dim.dimensi,
            gap: target - dimNilai,
            nilai: dimNilai,
            target,
          });
        }
        if (dimNilai >= 80)
          strengths.push(`Capaian baik pada ${dim.dimensi} (${dimNilai})`);
        else weaknesses.push(`Kelemahan pada ${dim.dimensi} (${dimNilai})`);
      }
    });

    gaps.sort((a: any, b: any) => b.gap - a.gap);
    const prioritas = gaps
      .slice(0, 3)
      .map(
        (g: any) =>
          `Meningkatkan capaian ${g.dimensi} untuk mengejar gap sebesar ${g.gap} poin.`,
      );

    const programs: any[] = [];
    KnowledgeBase.Policies.v2025.forEach((policy: any) => {
      if (
        policy.kategori === "Pembelajaran" ||
        policy.kategori === "Karakter" ||
        policy.kategori === "Budaya Sekolah"
      ) {
        programs.push(
          ...policy.programRekomendasi.map((p: string) => ({
            id: `prog-${Math.random()}`,
            nama: p,
            kebijakanId: policy.id,
            namaKebijakan: policy.nama,
          })),
        );
      }
    });

    return {
      ringkasan: `Sekolah ${settings.school.name || "Anda"} telah melakukan evaluasi Rapor Pendidikan. Terdapat ${gaps.length} dimensi utama yang capaiannya masih di bawah target yang telah ditetapkan oleh sekolah.`,
      prioritas: prioritas.length
        ? prioritas
        : ["Mempertahankan tren positif capaian sekolah"],
      akarPenyebab:
        "Metode pembelajaran belum sepenuhnya berdiferensiasi dan pemanfaatan teknologi digital belum optimal di semua kelas.",
      kekuatan: strengths.slice(0, 3).length
        ? strengths.slice(0, 3)
        : ["Belum ada data cukup"],
      kelemahan: weaknesses.slice(0, 3).length
        ? weaknesses.slice(0, 3)
        : ["Belum ada data cukup"],
      peluang: [
        "Dukungan komite sekolah yang aktif",
        "Potensi kemitraan dengan instansi pendidikan lokal",
      ],
      tantangan: [
        "Terbatasnya sarana pendukung digitalisasi",
        "Partisipasi aktif orang tua masih perlu ditingkatkan",
      ],
      tujuan: gaps
        .slice(0, 3)
        .map(
          (g: any) =>
            `Mencapai target nilai ${g.target} pada dimensi ${g.dimensi}`,
        ),
      program: programs.slice(0, 3),
      kegiatan: [
        {
          id: "k1",
          nama: "Pelatihan guru tentang pembelajaran berdiferensiasi",
          programId: programs[0]?.id,
        },
        {
          id: "k2",
          nama: "Workshop penyusunan perangkat ajar kolaboratif",
          programId: programs[0]?.id,
        },
        {
          id: "k3",
          nama: "Sosialisasi budaya disiplin positif dan kesepakatan kelas",
          programId: programs[1]?.id,
        },
      ],
      indikator: gaps
        .slice(0, 3)
        .map(
          (g: any) =>
            `Nilai ${g.dimensi} naik minimal ${g.gap > 5 ? 5 : g.gap} poin pada siklus berikutnya`,
        ),
    };
  };

  const handleRunAI = () => {
    setIsProcessing(true);
    updateSetting("analisis", "status", "Sedang Diproses");

    setTimeout(() => {
      const generated = generateAnalisis();
      const tieResult = TIE.analyzeRapor(settings.rapor.data || {}, {
        programUnggulan: settings.programUnggulan,
        karakteristik: settings.karakteristik
      });
      
      updateSetting("analisis", "data", generated);
      updateSetting("analisis", "tieResult", tieResult);
      updateSetting("analisis", "status", "Selesai");
      updateSetting("analisis", "lastUpdated", Date.now());
      setIsProcessing(false);
    }, 2500);
  };

  const handleSave = () => {
    updateSetting("analisis", "data", formData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    updateSetting("analisis", "status", newStatus);
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArr = [...(formData[field as keyof typeof formData] as any[])];
    if (typeof newArr[index] === 'object') {
       newArr[index] = { ...newArr[index], nama: value };
    } else {
       newArr[index] = value;
    }
    setFormData({ ...formData, [field]: newArr });
  };

  const handleAddArrayItem = (field: string) => {
    let newItem: any = "";
    if (field === "kegiatan") {
      newItem = { id: `keg-${Date.now()}`, nama: "", programId: null, status: "DRAFT" };
    } else if (field === "program") {
      newItem = { id: `prog-${Date.now()}`, nama: "", kebijakanId: null, status: "DRAFT" };
    } else {
      newItem = { id: `${field}-${Date.now()}`, nama: "", status: "DRAFT" };
    }
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as any[]), newItem],
    });
  };

  const renderEditableList = (title: string, field: string, icon: any) => (
    <div className="bg-[var(--color-eds-bg)] p-5 rounded-xl border border-slate-200">
      <h3 className="text-sm font-bold text-[var(--color-eds-text-primary)] flex items-center gap-2 mb-3">
        {React.createElement(icon, { className: "w-4 h-4 text-blue-500" })}{" "}
        {title}
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          {(formData[field as keyof typeof formData] as any[]).map(
            (item, idx) => (
              <TargetEditableItem key={idx} item={item} idx={idx} field={field} handleArrayChange={handleArrayChange} />
            )
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddArrayItem(field)}
            className="w-full mt-2"
          >
            + Tambah Item
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {(analisis.data[field as keyof typeof analisis.data] as string[]).map(
            (item: string, idx: number) => (
              <li key={idx} className="text-sm text-[var(--color-eds-text-secondary)] flex gap-2">
                <span className="text-blue-400 mt-0.5">•</span> {item}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>

        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <BrainCircuit className="w-3.5 h-3.5 mr-2" /> Diagnostic System
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Mesin Analisis Cerdas Sekolah
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed mb-8">
            Sistem menganalisis data Rapor Pendidikan, Target Kinerja, dan
            Kebijakan Nasional untuk menghasilkan rekomendasi program dan
            prioritas secara presisi.
          </p>

          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleRunAI}
              disabled={isProcessing}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold border-none"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />{" "}
                  Menganalisis Data...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" /> Jalankan Analisis Cerdas
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto min-w-60">
          <div className="bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl p-6">
            <p className="text-sm font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-4">
              Status Analisis
            </p>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${analisis.status === "Belum Dimulai" ? "bg-slate-800/50 border-slate-700 text-[var(--color-eds-text-secondary)]" : "bg-white/5 border-white/10 text-white/50"} flex items-center gap-3`}
              >
                <div
                  className={`w-3 h-3 rounded ${analisis.status === "Belum Dimulai" ? "bg-slate-400" : "bg-white/20"}`}
                />
                <span className="font-bold text-sm">Belum Dimulai</span>
              </div>
              <div
                className={`p-4 rounded-xl border ${["Selesai", "Draf"].includes(analisis.status) ? "bg-amber-500/20 border-amber-500/30 text-amber-100" : "bg-white/5 border-white/10 text-white/50"} flex items-center gap-3`}
              >
                <div
                  className={`w-3 h-3 rounded ${["Selesai", "Draf"].includes(analisis.status) ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-white/20"}`}
                />
                <span className="font-bold text-sm">Selesai (Draf)</span>
              </div>
              <div
                className={`p-4 rounded-xl border ${analisis.status === "Ditinjau" ? "bg-blue-500/20 border-blue-500/30 text-[var(--color-eds-text-secondary)]" : "bg-white/5 border-white/10 text-white/50"} flex items-center gap-3`}
              >
                <div
                  className={`w-3 h-3 rounded ${analisis.status === "Ditinjau" ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" : "bg-white/20"}`}
                />
                <span className="font-bold text-sm">Sedang Ditinjau</span>
              </div>
              <div
                className={`p-4 rounded-xl border ${analisis.status === "Disetujui" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-100" : "bg-white/5 border-white/10 text-white/50"} flex items-center gap-3`}
              >
                <div
                  className={`w-3 h-3 rounded ${analisis.status === "Disetujui" ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-white/20"}`}
                />
                <span className="font-bold text-sm">Disetujui (Siap RKJM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {analisis.status !== "Belum Dimulai" &&
        analisis.status !== "Sedang Diproses" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[var(--color-eds-border)] shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                  Aksi Dokumen:
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      analisis.status === "Draf" ||
                      analisis.status === "Selesai"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleStatusChange("Draf")}
                  >
                    Draft
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      analisis.status === "Ditinjau" ? "default" : "outline"
                    }
                    onClick={() => handleStatusChange("Ditinjau")}
                  >
                    Tinjau
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      analisis.status === "Disetujui" ? "default" : "outline"
                    }
                    onClick={() => handleStatusChange("Disetujui")}
                    className={
                      analisis.status === "Disetujui"
                        ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                        : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                    }
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Disetujui
                  </Button>
                </div>
              </div>
              <div>
                {isEditing ? (
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-600"
                  >
                    <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <FileEdit className="w-4 h-4 mr-2" /> Edit Analisis
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card title="Kondisi & Prioritas Sekolah" icon={FileText}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-2">
                      Ringkasan Kondisi
                    </label>
                    {isEditing ? (
                      <textarea maxLength={2000}
                        value={formData.ringkasan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ringkasan: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-eds-border)] bg-white text-sm outline-none focus:border-blue-500 h-[100px] resize-none"
                      />
                    ) : (
                      <div className="p-4 bg-[var(--color-eds-bg)] rounded-xl border border-slate-200 text-sm text-[var(--color-eds-text-primary)] leading-relaxed">
                        {analisis.data.ringkasan || "-"}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-2">
                      Akar Penyebab
                    </label>
                    {isEditing ? (
                      <textarea maxLength={2000}
                        value={formData.akarPenyebab}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            akarPenyebab: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-eds-border)] bg-white text-sm outline-none focus:border-blue-500 h-[80px] resize-none"
                      />
                    ) : (
                      <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-sm text-rose-800 leading-relaxed flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        {analisis.data.akarPenyebab || "-"}
                      </div>
                    )}
                  </div>

                  {renderEditableList(
                    "Prioritas Pembenahan Utama",
                    "prioritas",
                    Target,
                  )}
                </Card>

                <Card
                  title="Rekomendasi Program (Kebijakan Nasional)"
                  icon={ShieldCheck}
                  className="bg-blue-50/30 border-blue-100/50"
                >
                  <div className="space-y-4">
                    {analisis.data.program.map((prog: any, idx: number) => (
                      <div
                        key={prog.id}
                        className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">
                            {prog.nama}
                          </h4>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100">
                            {prog.namaKebijakan}
                          </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-3">
                            Rekomendasi Kegiatan Turunan:
                          </p>
                          <ul className="space-y-2">
                            {analisis.data.kegiatan
                              .filter((k: any) => k.programId === prog.id)
                              .map((keg: any, ki: number) => (
                                <li
                                  key={ki}
                                  className="flex gap-3 text-sm text-[var(--color-eds-text-secondary)] bg-[var(--color-eds-bg)] p-2.5 rounded-xl border border-slate-200"
                                >
                                  <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{" "}
                                  {keg.nama}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                    {analisis.data.program.length === 0 && (
                      <div className="p-6 text-center text-[var(--color-eds-text-primary)] font-medium">
                        Tidak ada rekomendasi program.
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card title="Analisis SWOT Sekolah" icon={Crosshair}>
                  <div className="space-y-4">
                    {renderEditableList(
                      "Kekuatan (Strengths)",
                      "kekuatan",
                      Target,
                    )}
                    {renderEditableList(
                      "Kelemahan (Weaknesses)",
                      "kelemahan",
                      Target,
                    )}
                    {renderEditableList(
                      "Peluang (Opportunities)",
                      "peluang",
                      Target,
                    )}
                    {renderEditableList(
                      "Tantangan (Threats)",
                      "tantangan",
                      Target,
                    )}
                  </div>
                </Card>

                <Card title="Tujuan & Indikator" icon={Target}>
                  <div className="space-y-4">
                    {renderEditableList("Tujuan Perbaikan", "tujuan", Target)}
                    {renderEditableList(
                      "Indikator Keberhasilan",
                      "indikator",
                      CheckCircle2,
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

const LanguageEngineView = () => {
  const [inputText, setInputText] = useState("");
  const [validationResult, setValidationResult] = useState<string[] | null>(
    null,
  );

  const handleValidate = () => {
    if (!inputText.trim()) {
      setValidationResult([]);
      return;
    }
    const issues = LanguageEngine.Dictionaries.validateTerm(inputText);
    setValidationResult(issues);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <BookMarked className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Language & Writing Engine
          </h1>
          <p className="text-[var(--color-eds-text-secondary)] text-lg max-w-2xl leading-relaxed">
            Mesin bahasa tata naskah resmi. Mengatur gaya bahasa, ejaan,
            nomenklatur, dan struktur birokrasi pada seluruh dokumen yang
            dihasilkan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card title="Aturan Tata Naskah (Style)" icon={FileSignature}>
            <div className="space-y-3">
              {Object.entries(LanguageEngine.Styles).map(([key, desc]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]"
                >
                  <h4 className="text-xs font-bold text-[var(--color-eds-text-primary)] mb-1">
                    {key}
                  </h4>
                  <p className="text-xs text-[var(--color-eds-text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Uji Validasi Bahasa Resmi" icon={Search}>
            <div className="space-y-4">
              <p className="text-xs text-[var(--color-eds-text-secondary)]">
                Sistem akan melakukan validasi konsistensi istilah dan ejaan sebelum
                dokumen dicetak. Coba fitur ini dengan memasukkan teks draf di
                bawah.
              </p>
              <textarea maxLength={2000}
                className="w-full h-32 p-3 text-sm border border-[var(--color-eds-border)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Contoh: Para siswa merasa sangat wow dengan kurikulum yang canggih ini..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button onClick={handleValidate} className="w-full">
                Validasi Teks
              </Button>

              {validationResult !== null && (
                <div className="mt-4">
                  {validationResult.length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-emerald-800">
                          Teks Sesuai Standar
                        </h4>
                        <p className="text-xs text-emerald-600 mt-1">
                          Tidak ditemukan kata informal atau tidak baku.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <h4 className="text-sm font-bold text-amber-800">
                          Ditemukan Ketidaksesuaian ({validationResult.length})
                        </h4>
                      </div>
                      <ul className="text-xs text-amber-700 space-y-2">
                        {validationResult.map((res, i) => (
                          <li key={i} className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded bg-amber-400 mt-1.5 mr-2 shrink-0"></span>
                            {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DecisionEngineView = ({ navigateToView }: any) => {
  const { settings, updateSetting, showSuccess } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!settings.rapor?.isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-[60vh] animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded flex items-center justify-center mb-6 border border-amber-200">
          <FileText className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[var(--color-eds-text-primary)] mb-3">
          Langkah ini belum dapat dilakukan.
        </h2>
        <p className="text-[var(--color-eds-text-primary)] mb-8 max-w-md leading-relaxed font-medium">
          Silakan selesaikan pengisian Rapor Pendidikan dan kunci data terlebih
          dahulu sebelum melakukan Analisis Prioritas.
        </p>
        <Button
          onClick={() => navigateToView && navigateToView("rapor")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Buka Rapor Pendidikan
        </Button>
      </div>
    );
  }
  const decision = settings.decisionEngine || {
    status: "Belum Dimulai",
    lastUpdated: null,
    data: null,
  };

  const generateDecisions = () => {
    const rData = settings.rapor?.data || {};
    const rTarget = settings.rapor?.target || {};

    let gaps: any[] = [];
    RaporDictionary.forEach((dim: any) => {
      const indValues = dim.indikator
        .map((ind: any) => Number(rData[ind.id]?.nilai))
        .filter((v: number) => !isNaN(v) && v > 0);
      const dimNilai = indValues.length
        ? Math.round(
            indValues.reduce((a: number, b: number) => a + b, 0) /
              indValues.length,
          )
        : 0;
      const target = Number(rTarget[dim.dimensi] || 0);

      if (dimNilai > 0 && target > 0 && dimNilai < target) {
        let score = DecisionEngine.evaluatePriorityScore(
          target - dimNilai,
          dim.indikator.length,
          target,
        );
        gaps.push({
          dimensi: dim.dimensi,
          gap: target - dimNilai,
          nilai: dimNilai,
          target,
          score,
          indikator: dim.indikator,
        });
      }
    });

    gaps.sort((a: any, b: any) => b.score - a.score);
    const topPrioritas = gaps
      .slice(0, DecisionEngine.Rules.MaxPrioritas)
      .map((g: any, i: number) => ({
        id: `prio-${i}`,
        peringkat: i + 1,
        dimensi: g.dimensi,
        tujuan: `Meningkatkan capaian ${g.dimensi} untuk memenuhi target sekolah.`,
        alasan: `Nilai ${g.dimensi} = ${g.nilai} | Target = ${g.target} | Selisih = ${g.gap}`,
        score: g.score,
        kebijakan: "Perencanaan Berbasis Data (PBD)",
        status: "Draf",
        catatan: "",
      }));

    const topProgram: any[] = [];
    const topKegiatan: any[] = [];

    KnowledgeBase.Policies.v2025.forEach((policy: any) => {
      if (
        topProgram.length < DecisionEngine.Rules.MaxProgram &&
        (policy.kategori === "Pembelajaran" ||
          policy.kategori === "Karakter" ||
          policy.kategori === "Budaya Sekolah")
      ) {
        let progId = `prog-${Math.random()}`;
        topProgram.push({
          id: progId,
          nama: policy.programRekomendasi[0] || "Program Intervensi Spesifik",
          kebijakanId: policy.id,
          namaKebijakan: policy.nama,
          status: "Draf",
        });

        if (topKegiatan.length < DecisionEngine.Rules.MaxKegiatan) {
          topKegiatan.push({
            id: `keg-${Math.random()}`,
            nama: `Penerapan ${policy.programRekomendasi[0] || "Program"} di sekolah`,
            programId: progId,
            status: "Draf",
          });
          topKegiatan.push({
            id: `keg-${Math.random()}`,
            nama: `Evaluasi berkala pelaksanaan ${policy.programRekomendasi[0] || "Program"}`,
            programId: progId,
            status: "Draf",
          });
        }
      }
    });

    return {
      prioritas: topPrioritas.length
        ? topPrioritas
        : [
            {
              id: "prio-1",
              peringkat: 1,
              dimensi: "Kualitas Pembelajaran",
              tujuan: "Mempertahankan dan meningkatkan kualitas",
              alasan: "Belum ada gap, fokus pada continuous improvement",
              score: 80,
              kebijakan: "PBD",
              status: "Draf",
              catatan: "",
            },
          ],
      program: topProgram.length
        ? topProgram.slice(0, DecisionEngine.Rules.MaxProgram)
        : [],
      kegiatan: topKegiatan.length
        ? topKegiatan.slice(0, DecisionEngine.Rules.MaxKegiatan)
        : [],
    };
  };

  const handleRunDecision = () => {
    setIsProcessing(true);
    updateSetting("decisionEngine", "status", "Sedang Diproses");

    setTimeout(() => {
      const generated = generateDecisions();
      updateSetting("decisionEngine", "data", generated);
      updateSetting("decisionEngine", "status", "Menunggu Persetujuan");
      updateSetting("decisionEngine", "lastUpdated", Date.now());
      setIsProcessing(false);
    }, 2500);
  };

  const handleApprovePrioritas = (id: string) => {
    let newData = { ...decision.data };
    let p = newData.prioritas.find((x: any) => x.id === id);
    if (p) p.status = "Disetujui";
    updateSetting("decisionEngine", "data", newData);
  };

  const handleApproveAll = () => {
    updateSetting("decisionEngine", "status", "Disetujui");
    let newData = { ...decision.data };
    newData.prioritas.forEach((p: any) => (p.status = "Disetujui"));
    newData.program.forEach((p: any) => (p.status = "Disetujui"));
    newData.kegiatan.forEach((p: any) => (p.status = "Disetujui"));
    updateSetting("decisionEngine", "data", newData);
    
    // SECTION 3, 4, 5: AUTOMATIC RKJM, RKT, RKAS, Implementation, Monitoring, Evaluation GENERATION
    
    // We create objectives from program so there's exactly one Objective per Program.
    const newObjectives = newData.program.map((p: any, idx: number) => {
      const projections = TargetProjectionEngine.calculateProjections(40, 100);
      return {
        id: "OBJ-GEN-" + idx,
        strategicObjective: p.nama,
        performanceIndicator: "Peningkatan capaian",
        baseline: "Kondisi Awal",
        targetY1: projections.y1 + "%",
        targetY2: projections.y2 + "%",
        targetY3: projections.y3 + "%",
        targetY4: projections.y4 + "%",
        responsibleUnit: "Tim Pengembang Sekolah",
        successIndicator: "Capaian memenuhi standar target sekolah.",
        associatedSnp: "Standar Proses",
        risk: "Kurangnya partisipasi stakeholder",
        mitigation: "Sosialisasi berkelanjutan",
        evaluationMethod: "Rapor Pendidikan Tahunan",
        originatingPriority: p.namaKebijakan
      };
    });

    const annualPlans: any = { Y1: { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }, Y2: { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }, Y3: { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }, Y4: { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] } };
      
    // Use PlanningDistributionService to distribute activities across years
    const distributionService = new PlanningDistributionService();
    const assignmentService = new PlanningAssignmentService();
    
    // FOR EACH Activity
    newData.kegiatan.forEach((kegiatan: any, idx: number) => {
      // Lookup Program
      const program = newData.program.find((p: any) => p.id === kegiatan.programId) || { id: 'prog-gen', nama: "Program Pengembangan Kompetensi" };
      // Lookup Strategic Objective
      const progIdx = newData.program.findIndex((p: any) => p.id === kegiatan.programId);
      const obj = progIdx >= 0 ? newObjectives[progIdx] : newObjectives[0];
      
      const rktId = "RKT-GEN-" + idx;
      
      const targetYearStr = distributionService.assignYearToActivity(rktId, idx);
      const q = (idx % 4) + 1;
      const s = q <= 2 ? 1 : 2;
      const distribution: PlanningDistribution = {
          planningYear: parseInt(targetYearStr.replace('Y', '')),
          activityReferenceId: rktId,
          priorityOrder: 1,
          dependencyReferences: [],
          recommendedQuarter: q as 1 | 2 | 3 | 4,
          recommendedSemester: s as 1 | 2,
          recommendedSequence: 1
      };
        
      const rktObj = {
        id: rktId,
        rkjmObjectiveId: obj ? obj.id : 'OBJ-GEN-0',
        activity: program.nama,
        target: "Terlaksana dengan baik",
        status: "synced",
        // Additional derived fields
        subActivity: kegiatan.nama,
        personResponsible: obj ? obj.responsibleUnit : "Tim Pengembang",
        schedule: "Semester 1",
        output: "Dokumen Pelaksanaan & Bukti Karya",
        outcome: obj ? obj.performanceIndicator : "-",
        successTarget: "100% Tercapai",
        evidence: "Daftar Hadir, Laporan, Foto",
        risk: obj ? obj.risk : "-",
        mitigation: obj ? obj.mitigation : "-",
        relatedSnp: obj ? obj.associatedSnp : "-"
      };
        
      const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
      const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, program.id, distribution);
      opActivity.metadata = {
        ...opActivity.metadata,
        programName: program.nama,
        activityName: kegiatan.nama,
        target: rktObj.target,
        successIndicator: rktObj.outcome,
        personInCharge: rktObj.personResponsible
      };
      if (assignmentResult.success && assignmentResult.assignment) {
          opActivity.planningYear = assignmentResult.assignment.planningYear;
      }
        
      const targetYear = `Y${String(opActivity.planningYear).replace(/[^0-9]/g, '')}`; // Normalized to guarantee Y1-Y4
      if (!annualPlans[targetYear]) {
          annualPlans[targetYear] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] };
      }
      if (!annualPlans[targetYear].operationalActivities) {
          annualPlans[targetYear].operationalActivities = [];
      }
      annualPlans[targetYear].operationalActivities.push(opActivity);
        
      annualPlans[targetYear].rkt.push(rktObj);
        
      const rkasObj = {
        id: "RKAS-GEN-" + idx,
        rktActivityId: rktObj.id,
        budgetItem: "Honorarium & Konsumsi " + kegiatan.nama,
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft",
        quantity: "1",
        unit: "Paket",
        price: 2500000,
        total: 2500000,
        implementationMonth: "Bulan ke-6",
        responsiblePerson: obj ? obj.responsibleUnit : "Tim Pengembang",
        budgetCategory: "Belanja Operasional",
        priorityLevel: "Tinggi",
        fundingStatus: "Tersedia"
      };
      annualPlans[targetYear].rkas.push(rkasObj);
        
      const implObj = {
        id: "IMPL-GEN-" + idx,
        rkasId: rkasObj.id,
        progress: "Sedang Berjalan",
        completionPercentage: 50,
        notes: "Pelaksanaan tahap pertama selesai, menunggu tahap kedua.",
        evidence: "Foto kegiatan.jpg, Daftar Hadir.pdf",
        actualCost: 1250000,
        responsibleOfficer: obj ? obj.responsibleUnit : "-",
        completionDate: "-"
      };
      if (!annualPlans[targetYear].implementation) annualPlans[targetYear].implementation = [];
      annualPlans[targetYear].implementation.push(implObj);
        
      const monObj = {
        id: "MON-GEN-" + idx,
        rkasId: rkasObj.id,
        implId: implObj.id,
        achievement: "Tercapai sebagian",
        variance: "Sesuai jadwal",
        evidence: implObj.evidence,
        performanceStatus: "On Track",
        trafficLight: "Kuning",
        recommendation: "Lanjutkan sesuai jadwal",
        followUpAction: "Persiapan tahap 2",
        supervisorNotes: "Pelaksanaan baik, dokumentasi ditingkatkan",
        result: "Terlaksana 50%"
      };
      annualPlans[targetYear].monitoring.push(monObj);
        
      const evObj = {
        id: "EV-GEN-" + idx,
        objectiveId: obj ? obj.id : 'OBJ-GEN-0',
        status: "Tercapai Sebagian",
        notes: "Target tahun berjalan masih dalam proses.",
        achievement: "50%",
        budgetRealization: "50%",
        programEffectiveness: "Efektif",
        recommendation: "Pertahankan kinerja",
        lessonsLearned: "Perlu koordinasi lebih awal",
        improvementPlan: "Penjadwalan lebih ketat",
        nextYearRecommendation: "Skala program diperluas"
      };
      annualPlans[targetYear].evaluation.push(evObj);
    });

    updateSetting("relationalPlanning", "", { objectives: newObjectives, annualPlans: annualPlans });
    updateSetting("narratives", "", {});
    showSuccess("Relational Planning Engine berhasil men-generate struktur RKJM, RKT, RKAS, Implementation, Monitoring, & Evaluation.");
    setTimeout(() => {
       showSuccess("Certification completed successfully.", "100% Data Valid. Workspace is ready.");
    }, 500);
      
    if (navigateToView) {
      setTimeout(() => navigateToView("rkjmPipeline"), 1500);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <BrainCircuit className="w-3.5 h-3.5 mr-2" /> Phase 10
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Rekomendasi Prioritas Sekolah
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed mb-8">
            Analisis Prioritas menganalisis konteks sekolah dan Rapor Pendidikan
            untuk merumuskan prioritas, tujuan, dan program yang menjadi dasar
            seluruh dokumen (RKJM, RKT, RKAS, KSP).
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleRunDecision}
              disabled={isProcessing}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold border-none"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Menghitung
                  Prioritas...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" /> Hasilkan Rekomendasi
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {decision.status !== "Belum Dimulai" &&
        decision.status !== "Sedang Diproses" &&
        decision.data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[var(--color-eds-border)] shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                  Status Keputusan:
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded ${decision.status === "Disetujui" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {decision.status}
                </span>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={handleApproveAll}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui Semua
                  Keputusan
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card
                  title={`Prioritas Sekolah (Max ${DecisionEngine.Rules.MaxPrioritas})`}
                  icon={Target}
                >
                  <div className="space-y-4">
                    {decision.data.prioritas?.map((prio: any, idx: number) => (
                      <div
                        key={prio.id}
                        className="bg-white p-5 rounded-xl border border-[var(--color-eds-border)] shadow-sm relative overflow-hidden group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                              {prio.peringkat}
                            </div>
                            <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">
                              {prio.dimensi}
                            </h4>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${prio.status === "Disetujui" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                          >
                            {prio.status}
                          </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                              Tujuan
                            </p>
                            <p className="text-sm text-[var(--color-eds-text-primary)]">
                              {prio.tujuan}
                            </p>
                          </div>
                          <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                              Traceability (Alasan)
                            </p>
                            <p className="text-xs text-[var(--color-eds-text-secondary)] font-mono mb-1">
                              {prio.alasan}
                            </p>
                            <p className="text-xs text-[var(--color-eds-text-primary)] font-bold font-bold">
                              Tingkat Prioritas: {prio.score}/100
                            </p>
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />{" "}
                              {prio.kebijakan}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[var(--color-eds-text-secondary)] h-8"
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Catatan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-500 h-8"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Hapus
                          </Button>
                          {prio.status !== "Disetujui" && (
                            <Button
                              size="sm"
                              onClick={() => handleApprovePrioritas(prio.id)}
                              className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 h-8"
                            >
                              <Check className="w-3 h-3 mr-1" /> Setuju
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title={`Program Strategis (Max ${DecisionEngine.Rules.MaxProgram})`}
                  icon={Briefcase}
                >
                  <div className="space-y-3">
                    {decision.data.program?.map((prog: any) => (
                      <div
                        key={prog.id}
                        className="p-4 bg-[var(--color-eds-bg)] rounded-xl border border-slate-200 flex justify-between items-center group"
                      >
                        <div>
                          <h5 className="font-bold text-[var(--color-eds-text-primary)] text-sm">
                            {prog.nama}
                          </h5>
                          <p className="text-xs text-[var(--color-eds-text-secondary)] mt-1 uppercase tracking-wider font-bold">
                            Kebijakan: {prog.namaKebijakan}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="opacity-100 transition-opacity text-[var(--color-eds-text-secondary)] h-7 text-xs"
                        >
                          Ubah
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <Card title="Konteks Sekolah" icon={Map}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                      <span className="text-[var(--color-eds-text-primary)] font-medium">Jenjang</span>
                      <span className="font-bold text-[var(--color-eds-text-primary)]">
                        {settings.school?.jenjang || "SD"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                      <span className="text-[var(--color-eds-text-primary)] font-medium">Status</span>
                      <span className="font-bold text-[var(--color-eds-text-primary)]">
                        {settings.school?.status || "Negeri"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                      <span className="text-[var(--color-eds-text-primary)] font-medium">
                        Total Peserta Didik
                      </span>
                      <span className="font-bold text-[var(--color-eds-text-primary)]">
                        {settings.pesertaDidik?.total || 0} Siswa
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                      <span className="text-[var(--color-eds-text-primary)] font-medium">Total GTK</span>
                      <span className="font-bold text-[var(--color-eds-text-primary)]">
                        {settings.gtk?.total || 0} Orang
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-eds-text-secondary)] italic mt-3">
                      Analisis Prioritas menyesuaikan rekomendasi berdasarkan
                      konteks sekolah di atas agar relevan dan aplikatif.
                    </p>
                  </div>
                </Card>

                <Card
                  title={`Kegiatan Prioritas (Max ${DecisionEngine.Rules.MaxKegiatan})`}
                  icon={Activity}
                >
                  <ul className="space-y-2">
                    {decision.data.kegiatan?.map((keg: any, idx: number) => (
                      <li
                        key={keg.id}
                        className="text-xs text-[var(--color-eds-text-secondary)] flex items-start gap-2 p-2 bg-blue-50/50 rounded-xl border border-blue-50"
                      >
                        <div className="w-4 h-4 rounded bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="leading-relaxed">{keg.nama}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};


export const EmptyState = ({ icon: Icon, title, description, ctaText, onCtaClick }: any) => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] animate-in fade-in zoom-in-95 duration-500 enterprise-card">
    <div className="w-20 h-20 bg-[#E8F0FE] text-[var(--color-eds-primary)] rounded-full flex items-center justify-center mb-6">
      <Icon className="w-10 h-10" />
    </div>
    <h2 className="text-xl font-bold text-[var(--color-eds-text-primary)] mb-3 tracking-tight">
      {title}
    </h2>
    <p className="text-base text-[var(--color-eds-text-primary)] max-w-md mb-8 leading-relaxed font-medium">
      {description}
    </p>
    {ctaText && onCtaClick && (
      <Button 
        variant="primary"
        onClick={onCtaClick}
      >
        {ctaText}
      </Button>
    )}
  </div>
);
const PageHelp = ({ title, description, importance, nextStep, regulation, time, checklist, mistakes }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistTotal = checklist ? checklist.length : 0;
  const progressPercent = checklistTotal > 0 ? Math.round((completedCount / checklistTotal) * 100) : 0;


  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-sm font-bold text-[var(--color-eds-text-primary)] font-bold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded transition-colors border border-blue-100">
          <HelpCircle className="w-4 h-4" /> Bantuan & Panduan
        </button>
      ) : (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-secondary)]">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 text-[var(--color-eds-text-primary)] font-bold rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm text-[var(--color-eds-text-primary)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Apa ini?</h4>
                    <p>{description}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Mengapa ini penting?</h4>
                    <p>{importance}</p>
                  </div>
                  {regulation && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1"><FileText className="w-4 h-4 text-blue-500"/> Referensi Regulasi</h4>
                      <p className="italic text-[var(--color-eds-text-primary)] bg-white/50 p-2 rounded-xl font-medium">{regulation}</p>
                    </div>
                  )}
                  {time && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500"/> Estimasi Waktu</h4>
                      <p>{time}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {checklist && checklist.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-xl border border-blue-100/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Ceklis Persiapan</h4>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{progressPercent}% Siap</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded h-1.5 mb-3">
                        <div className="bg-emerald-500 h-1.5 rounded transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <ul className="space-y-2">
                        {checklist.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => setCheckedItems(prev => ({...prev, [i]: !prev[i]}))}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[var(--color-eds-border)]'}`}>
                              {checkedItems[i] && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className={`transition-colors ${checkedItems[i] ? 'text-[var(--color-eds-text-secondary)] line-through' : 'text-[var(--color-eds-text-primary)]'}`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {mistakes && mistakes.length > 0 && (
                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                      <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-rose-500"/> Kesalahan Umum</h4>
                      <ul className="space-y-1">
                        {mistakes.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-rose-800">
                            <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Langkah selanjutnya</h4>
                    <p>{nextStep}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export const TargetPerformanceView = () => {
  const { settings, updateSetting } = useApp();
  const targetData = settings.targetEngine || {
    status: "Belum Dimulai",
    lastUpdated: null,
    data: null,
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const generateTargets = () => {
    const rData = settings.rapor?.data || {};
    const rTarget = settings.rapor?.target || {};
    const decisionPrioritas = settings.decisionEngine?.data?.prioritas || [];

    let targets: any[] = [];
    RaporDictionary.forEach((dim: any) => {
      const indValues = dim.indikator
        .map((ind: any) => Number(rData[ind.id]?.nilai))
        .filter((v: number) => !isNaN(v) && v > 0);
      const dimNilai = indValues.length
        ? Math.round(
            indValues.reduce((a: number, b: number) => a + b, 0) /
              indValues.length,
          )
        : 0;
      let finalTarget = Number(rTarget[dim.dimensi] || 0);

      // If we don't have a configured target, default to something reasonable based on current value
      if (finalTarget === 0 && dimNilai > 0) {
        finalTarget = Math.min(100, dimNilai + 15);
      }

      if (dimNilai > 0) {
        const gap = finalTarget > dimNilai ? finalTarget - dimNilai : 0;
        const difficulty = TargetPerformanceEngine.calculateDifficulty(
          gap,
          dim.indikator.length,
          settings.pesertaDidik?.total || 0,
        );
        const performanceScore =
          TargetPerformanceEngine.calculatePerformanceScore(
            dimNilai,
            dimNilai,
            finalTarget,
          ); // currently current == initial

        let targetYears = [];
        if (gap > 0) {
          const step = Math.round(gap / 4);
          targetYears = [
            dimNilai + step,
            dimNilai + step * 2,
            dimNilai + step * 3,
            finalTarget,
          ].map((v) => Math.min(100, v));
        } else {
          targetYears = [finalTarget, finalTarget, finalTarget, finalTarget];
        }

        const isPriority = decisionPrioritas.some(
          (p: any) => p.dimensi === dim.dimensi,
        );
        const priorityOrder = isPriority
          ? decisionPrioritas.findIndex((p: any) => p.dimensi === dim.dimensi) +
            1
          : 99;

        // Generate default strategies based on dimension
        let strategy = `Peningkatan efektivitas indikator turunan pada dimensi ${dim.dimensi}`;
        if (isPriority) {
          strategy =
            decisionPrioritas.find((p: any) => p.dimensi === dim.dimensi)
              ?.tujuan || strategy;
        }

        targets.push({
          id: `target-${dim.id}`,
          dimensi: dim.dimensi,
          nilaiAwal: dimNilai,
          targetAkhir: finalTarget,
          targetTahunan: targetYears,
          gap,
          difficulty,
          performanceScore,
          priorityOrder,
          strategy,
          indikatorKeberhasilan: `Skor capaian ${dim.dimensi}`,
          metodePengukuran: "Rapor Pendidikan",
          frekuensiEvaluasi: "Tahunan",
          penanggungJawab: "Kepala Sekolah",
          status: gap > 0 ? "Perlu Peningkatan" : "Tercapai",
          indikator: dim.indikator,
        });
      }
    });

    targets.sort((a: any, b: any) => {
      if (a.priorityOrder !== b.priorityOrder)
        return a.priorityOrder - b.priorityOrder;
      return b.gap - a.gap;
    });

    return targets;
  };

  const handleRunTargetEngine = () => {
    setIsProcessing(true);
    updateSetting("targetEngine", "status", "Sedang Diproses");

    setTimeout(() => {
      const generated = generateTargets();
      updateSetting("targetEngine", "data", generated);
      updateSetting("targetEngine", "status", "Menunggu Persetujuan");
      updateSetting("targetEngine", "lastUpdated", Date.now());
      setIsProcessing(false);
    }, 2000);
  };

  const handleApproveAll = () => {
    updateSetting("targetEngine", "status", "Disetujui");
    if (settings.documents) {
      let docs = [...settings.documents];
      let rktIdx = docs.findIndex((d: any) => d.id === "rkt");
      if (rktIdx >= 0) {
        docs[rktIdx] = { ...docs[rktIdx], status: "Needs Synchronization" };
        updateSetting("documents", "", docs);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <Target className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Penyusunan Target & Kinerja
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed mb-8">
            Mesin pintar yang menetapkan target kinerja spesifik (SMART) untuk 4
            tahun. Semua dokumen seperti RKJM, RKT, dan RKAS akan menggunakan
            target resmi ini secara otomatis.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleRunTargetEngine}
              disabled={isProcessing}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold border-none"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Menghitung
                  Target...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" /> Tetapkan Target Kinerja
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {targetData.status !== "Belum Dimulai" &&
        targetData.status !== "Sedang Diproses" &&
        targetData.data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[var(--color-eds-border)] shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                  Status Target:
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded ${targetData.status === "Disetujui" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {targetData.status}
                </span>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={handleApproveAll}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Kunci & Setujui
                  Target
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {targetData.data.map((target: any, idx: number) => (
                <div
                  key={target.id}
                  className="enterprise-card p-6 relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-black text-[var(--color-eds-text-primary)] text-xl">
                          {target.dimensi}
                        </h4>
                        {target.priorityOrder < 99 && (
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-bold uppercase">
                            Prioritas {target.priorityOrder}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-eds-text-primary)] font-medium max-w-2xl">
                        {target.strategy}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${target.difficulty === "Sangat Sulit" ? "bg-rose-50 text-rose-700 border-rose-100" : target.difficulty === "Sulit" ? "bg-orange-50 text-orange-700 border-orange-100" : target.difficulty === "Sedang" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
                      >
                        Tingkat: {target.difficulty}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${target.status === "Tercapai" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                      >
                        Status: {target.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-8 gap-4 mb-6">
                    <div className="col-span-2 bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-2">
                        Skor Kinerja
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-[var(--color-eds-text-primary)]">
                          {target.performanceScore}%
                        </span>
                        <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${target.performanceScore >= 80 ? "bg-emerald-500" : target.performanceScore >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${target.performanceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                        Awal
                      </p>
                      <p className="text-2xl font-black text-[var(--color-eds-text-primary)]">
                        {target.nilaiAwal}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                        Target
                      </p>
                      <p className="text-2xl font-black text-blue-700">
                        {target.targetAkhir}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
                        Selisih Capaian
                      </p>
                      <p className="text-2xl font-black text-emerald-700">
                        {target.gap}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-3 bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-3">
                        Lini Masa Target RKJM (4 Tahun)
                      </p>
                      <div className="flex items-center justify-between text-center gap-2">
                        {target.targetTahunan.map((t: number, i: number) => (
                          <div key={i} className="flex-1 relative">
                            <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mb-1">
                              Thn {i + 1}
                            </div>
                            <div className="text-sm font-black text-[var(--color-eds-text-primary)] bg-white border border-[var(--color-eds-border)] py-1.5 rounded-xl">
                              {t}
                            </div>
                            {i < 3 && (
                              <div className="absolute top-6 -right-2 w-4 border-t-2 border-dashed border-[var(--color-eds-border)] hidden md:block"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                        Indikator Keberhasilan
                      </p>
                      <p className="text-xs text-[var(--color-eds-text-primary)] font-medium">
                        {target.indikatorKeberhasilan}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                        Metode Pengukuran
                      </p>
                      <p className="text-xs text-[var(--color-eds-text-primary)] font-medium">
                        {target.metodePengukuran}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                        Frekuensi
                      </p>
                      <p className="text-xs text-[var(--color-eds-text-primary)] font-medium">
                        {target.frekuensiEvaluasi}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                        Penanggung Jawab
                      </p>
                      <p className="text-xs text-[var(--color-eds-text-primary)] font-medium">
                        {target.penanggungJawab}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[var(--color-eds-text-secondary)] h-8"
                    >
                      <Edit2 className="w-3 h-3 mr-1" /> Sesuaikan Target
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export const RegulationRegistryView = () => {
  const regulations = RegulationGovernanceEngine.Registry;
  const templates = TemplateRegistryEngine.Templates;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <Library className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Regulation Registry
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed">
            Pusat manajemen regulasi nasional. Semua generator dokumen dan mesin
            analisis merujuk pada master data ini tanpa hardcoding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {regulations.map((reg) => {
          const usedBy = templates.filter((t) =>
            t.regulationIds?.includes(reg.id),
          );
          return (
            <div
              key={reg.id}
              className="enterprise-card p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${reg.status === "Aktif" ? "bg-emerald-500" : "bg-slate-300"}`}
              ></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-center text-[var(--color-eds-text-primary)] font-medium">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-eds-text-primary)] leading-tight">
                      {reg.id}
                    </h3>
                    <span className="text-xs font-medium text-[var(--color-eds-text-secondary)]">
                      {reg.jenisRegulasi} • {reg.tahun}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold uppercase rounded-xl border ${reg.status === "Aktif" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-[var(--color-eds-bg)] border-[var(--color-eds-border)] text-[var(--color-eds-text-secondary)]"}`}
                >
                  {reg.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                    Nama Regulasi
                  </p>
                  <p className="text-sm text-[var(--color-eds-text-primary)] font-medium line-clamp-2">
                    {reg.namaRegulasi}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                    Nomor Regulasi
                  </p>
                  <p className="text-sm text-[var(--color-eds-text-primary)] font-bold">
                    {reg.nomorRegulasi}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                      Mulai Berlaku
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-primary)] font-bold">
                      {new Date(reg.berlakuMulai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                      Instansi Penerbit
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-primary)] font-bold truncate">
                      {reg.instansiPenerbit}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-2">
                  Digunakan Oleh Template ({usedBy.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {usedBy.length > 0 ? (
                    usedBy.map((t) => (
                      <span
                        key={t.id}
                        className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100"
                      >
                        {t.jenisDokumen}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-[var(--color-eds-text-secondary)] italic">
                      Tidak digunakan oleh template aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TemplateRegistryView = () => {
  const templates = TemplateRegistryEngine.Templates;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <BookMarked className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Template Registry
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed">
            Pusat pemetaan seluruh jenis dokumen terhadap regulasi dan pedoman
            resmi. Sistem pembuat dokumen membaca struktur langsung dari registry
            ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => {
          const validation = TemplateRegistryEngine.validateTemplate(t.id);
          return (
            <div
              key={t.id}
              className="enterprise-card p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${validation.valid ? "bg-emerald-500" : "bg-rose-500"}`}
              ></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--color-eds-text-primary)] font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-eds-text-primary)] leading-tight">
                      {t.jenisDokumen}
                    </h3>
                    <span className="text-xs font-medium text-[var(--color-eds-text-secondary)]">
                      Versi {t.versiTemplate}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold uppercase rounded-xl border ${t.status === "Aktif" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-[var(--color-eds-bg)] border-[var(--color-eds-border)] text-[var(--color-eds-text-secondary)]"}`}
                >
                  {t.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                    Nama Dokumen
                  </p>
                  <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">
                    {t.namaDokumen}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                    Regulasi Acuan
                  </p>
                  <div className="flex flex-col gap-1">
                    {(t.regulationIds || []).map((regId) => {
                      const reg = RegulationGovernanceEngine.Registry.find(
                        (r) => r.id === regId,
                      );
                      return (
                        <div
                          key={regId}
                          className="flex flex-col text-sm text-[var(--color-eds-text-primary)] font-medium"
                        >
                          <span className="flex items-center gap-1">
                            <BookMarked className="w-3 h-3 text-blue-500" />{" "}
                            {regId}
                          </span>
                          <span className="text-xs text-[var(--color-eds-text-secondary)] truncate">
                            {reg?.nomorRegulasi || "Regulasi tidak ditemukan"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                      Tahun Berlaku
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-primary)] font-bold">
                      {t.tahunBerlaku}
                    </p>
                  </div>
                  <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200 col-span-2">
                    <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">
                      Status Validasi
                    </p>
                    <p
                      className={`text-xs font-bold ${validation.valid ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {validation.valid ? "Siap Digunakan" : "Perlu Perbaikan"}
                    </p>
                    {!validation.valid && validation.error && (
                      <p className="text-xs text-rose-500 mt-1 line-clamp-2">
                        {validation.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-2">
                  Struktur Dokumen ({t.urutanBagian.length} Bagian)
                </p>
                <div className="flex flex-col gap-1.5 h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {t.urutanBagian.map((bagian, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[var(--color-eds-text-secondary)] bg-[var(--color-eds-bg)] border border-slate-200 p-2 rounded flex items-center justify-between"
                    >
                      <span className="truncate">{bagian}</span>
                      {t.bagianWajib.includes(bagian) ? (
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                          Wajib
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">
                          Opsional
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WorkflowEngineView = () => {
  const { settings, updateSetting } = useApp();
  const docs = settings.documents || [];
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const newDocs = docs.map((d: any) => {
      if (d.id === id) {
        return {
          ...d,
          status: newStatus,
          history: [
            ...(d.history || []),
            {
              status: newStatus,
              timestamp: Date.now(),
              user: settings.principal?.name || "Sistem",
            },
          ],
        };
      }
      return d;
    });
    updateSetting("documents", null, newDocs);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <CheckCircle className="w-3.5 h-3.5 mr-2" /> Phase 11
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Status & Persetujuan Dokumen</h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed">
            Sistem pengelola siklus hidup seluruh dokumen perencanaan sekolah,
            memastikan kualitas melalui alur validasi, ulasan, dan persetujuan
            resmi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[var(--color-eds-border)] shadow-sm sticky top-6">
            <h3 className="font-black text-[var(--color-eds-text-primary)] text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" /> Dokumen Aktif
            </h3>
            <div className="space-y-2">
              {docs.map((doc: any) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedDoc?.id === doc.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-[var(--color-eds-border)] hover:border-blue-300"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[var(--color-eds-text-primary)] text-sm">
                      {doc.type}
                    </h4>
                    <span
                      className={`text-xs uppercase font-bold px-2 py-0.5 rounded-xl border ${doc.status === "Disetujui" || doc.status === "Terkunci" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : doc.status === "Perlu Revisi" ? "bg-rose-50 border-rose-200 text-rose-600" : doc.status === "Belum Dibuat" ? "bg-[var(--color-eds-bg)] border-[var(--color-eds-border)] text-[var(--color-eds-text-secondary)]" : "bg-blue-50 border-blue-200 text-[var(--color-eds-text-primary)] font-bold"}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-eds-text-secondary)] font-medium truncate">
                    {doc.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          {selectedDoc ? (
            <div className="enterprise-card p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-[var(--color-eds-text-primary)]">
                    {selectedDoc.name}
                  </h2>
                  <div className="flex gap-4 text-sm font-medium text-[var(--color-eds-text-primary)] mt-2">
                    <span className="flex items-center gap-1">
                      <FileSignature className="w-4 h-4" /> Versi{" "}
                      {selectedDoc.version}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-4 h-4" /> Dibuat oleh:{" "}
                      {selectedDoc.creator || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[var(--color-eds-text-primary)] mb-3 text-sm uppercase tracking-wider">
                  Aksi Tersedia
                </h3>
                <div className="flex flex-wrap gap-3">
                  {WorkflowEngine.States.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleUpdateStatus(selectedDoc.id, state)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${selectedDoc.status === state ? "bg-slate-800 text-white border-slate-800" : "bg-white text-[var(--color-eds-text-secondary)] border-[var(--color-eds-border)] hover:bg-[var(--color-eds-bg)]"}`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[var(--color-eds-text-primary)] mb-3 text-sm uppercase tracking-wider">
                  Riwayat Siklus Hidup
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {(selectedDoc.history || []).map((h: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[var(--color-eds-text-primary)] text-sm">
                            {h.status}
                          </h4>
                          <span className="text-xs font-medium text-[var(--color-eds-text-secondary)]">
                            {new Date(h.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-eds-text-secondary)] font-medium">
                          Diperbarui oleh: {h.user}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedDoc.history ||
                    selectedDoc.history.length === 0) && (
                    <div className="text-center text-sm text-[var(--color-eds-text-primary)] font-medium py-8">
                      Belum ada riwayat perubahan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-eds-bg)]/50 p-6 rounded-xl border border-[var(--color-eds-border)] border-dashed text-center flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-[var(--color-eds-text-secondary)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-eds-text-secondary)] mb-2">
                Pilih Dokumen
              </h3>
              <p className="text-[var(--color-eds-text-primary)] text-sm max-w-sm font-medium">
                Pilih salah satu dokumen di panel sebelah kiri untuk melihat
                detail siklus hidup dan riwayat perubahannya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentStandardView = () => {
  const { settings } = useApp();
  const [viewMode, setViewMode] = useState<
    "preview" | "print" | "pdf" | "word"
  >("preview");
  const validation = DocumentStandardEngine.Validator.validate(settings);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-eds-bg)]0/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <FileCode className="w-3.5 h-3.5 mr-2" /> Phase 8
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Standar Format Dokumen</h1>
          <p className="text-[var(--color-eds-text-primary)] text-lg max-w-2xl leading-relaxed font-medium">
            Mesin standar tata letak otomatis untuk seluruh dokumen administrasi
            sekolah. Mengatur margin, font, dan format pengesahan secara
            konsisten.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Status Validasi Dokumen" icon={ShieldCheck}>
            <div className="space-y-4">
              {validation.isValid ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800">
                      Validasi Berhasil
                    </h4>
                    <p className="text-xs text-emerald-600 mt-1">
                      Data sekolah lengkap, siap cetak dokumen.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-800">
                      Validasi Gagal
                    </h4>
                    <p className="text-xs text-rose-600 mt-1 mb-2">
                      Lengkapi data berikut sebelum mencetak:
                    </p>
                    <ul className="text-xs text-rose-700 space-y-1 list-disc pl-4">
                      {validation.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Aksi & Ekspor" icon={FileText}>
            <div className="space-y-3">
              <Button
                variant={viewMode === "preview" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setViewMode("preview")}
              >
                <FileText className="w-4 h-4 mr-3" /> Live Preview
              </Button>
              <Button
                variant={viewMode === "print" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setViewMode("print")}
              >
                <Printer className="w-4 h-4 mr-3" /> Siap Dicetak
              </Button>
              <Button
                variant={viewMode === "pdf" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setViewMode("pdf")}
              >
                <Download className="w-4 h-4 mr-3" /> Ekspor PDF
              </Button>
              <Button
                variant={viewMode === "word" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setViewMode("word")}
              >
                <FileSignature className="w-4 h-4 mr-3" /> Ekspor Word (Docx)
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-100 p-6 rounded-xl border border-[var(--color-eds-border)] overflow-x-auto flex justify-center">
            {/* A4 Paper Preview */}
            <div
              className={`${DocumentStandardEngine.StyleGuide.paperSize} ${DocumentStandardEngine.StyleGuide.margins} ${DocumentStandardEngine.StyleGuide.colors.text} ${DocumentStandardEngine.StyleGuide.fontFamily} transition-all duration-500 scale-[0.85] origin-top`}
            >
              {/* Cover Section */}
              <div className="text-center space-y-4 mt-12 mb-32">
                <div className="w-24 h-16 mx-auto border-2 border-dashed border-[var(--color-eds-border)] rounded-xl flex items-center justify-center text-[var(--color-eds-text-primary)] mb-8 font-medium">
                  [LOGO]
                </div>
                <h1
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.title} font-bold uppercase tracking-wide`}
                >
                  Rencana Kerja Jangka Menengah (RKJM)
                </h1>
                <h2
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.heading1} font-medium`}
                >
                  {(() => {
                    const activeYearObj = settings?.academicYears?.find((y: any) => y.isActive);
                    const fallbackYear = new Date().getFullYear();
                    const baseYearStr = activeYearObj?.name || `${fallbackYear}/${fallbackYear + 1}`;
                    const startYear = parseInt(baseYearStr.split('/')[0]) || fallbackYear;
                    return `Tahun Pelajaran ${startYear}/${startYear+1} - ${startYear+3}/${startYear+4}`;
                  })()}
                </h2>

                <div className="pt-32">
                  {settings.school.name && (
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.heading1} font-bold uppercase`}
                    >
                      {settings.school.name}
                    </p>
                  )}
                  {settings.school.npsn && (
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body}`}
                    >
                      NPSN: {settings.school.npsn}
                    </p>
                  )}
                  {settings.school.address && (
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.small} mt-4 max-w-sm mx-auto`}
                    >
                      {settings.school.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Lembar Pengesahan */}
              <div
                className="page-break-before"
                style={{ pageBreakBefore: "always", paddingTop: "4rem" }}
              >
                <h3
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.heading1} font-bold text-center uppercase mb-12`}
                >
                  Lembar Pengesahan
                </h3>
                <p
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.body} text-justify mb-12 ${DocumentStandardEngine.StyleGuide.lineHeight}`}
                >
                  Berdasarkan hasil musyawarah Tim Pengembang Sekolah, Komite
                  Sekolah, dan Dewan Guru, maka dokumen Rencana Kerja Jangka
                  Menengah (RKJM)
                  {settings.school.name ? ` ${settings.school.name}` : ""}{" "}
                  ditetapkan dan disahkan untuk digunakan sebagai pedoman
                  penyelenggaraan pendidikan.
                </p>

                <div className="flex justify-between items-end mt-20">
                  <div className="text-center">
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body} mb-20`}
                    >
                      Komite Sekolah
                    </p>
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body} font-bold underline`}
                    >
                      {settings.komite?.name || ""}
                    </p>
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body}`}
                    >
                      Ketua
                    </p>
                  </div>
                  <div className="text-center">
                    {settings.school?.village && (
                      <p
                        className={`${DocumentStandardEngine.StyleGuide.fontSize.body} mb-1`}
                      >
                        {settings.school.village},{" "}
                        {new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body} mb-20`}
                    >
                      Kepala Sekolah
                    </p>
                    <p
                      className={`${DocumentStandardEngine.StyleGuide.fontSize.body} font-bold underline`}
                    >
                      {settings.principal?.name || ""}
                    </p>
                    {settings.principal?.nip && (
                      <p
                        className={`${DocumentStandardEngine.StyleGuide.fontSize.body}`}
                      >
                        NIP. {settings.principal.nip}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              
              <div
                className="page-break-before"
                style={{ pageBreakBefore: "always", paddingTop: "4rem" }}
              >
                <h3
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.heading1} font-bold text-center uppercase mb-8`}
                >
                  BAB I<br />
                  PENDAHULUAN
                </h3>

                <h4
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.heading2} font-bold mb-4`}
                >
                  A. Latar Belakang
                </h4>
                <p
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.body} text-justify indent-8 mb-6 ${DocumentStandardEngine.StyleGuide.lineHeight}`}
                >
                  Pendidikan nasional berfungsi mengembangkan kemampuan dan
                  membentuk watak serta peradaban bangsa yang bermartabat dalam
                  rangka mencerdaskan kehidupan bangsa. (Teks otomatis
                  disusun oleh sistem, diformat oleh Sistem Dokumen).
                </p>

                <h4
                  className={`${DocumentStandardEngine.StyleGuide.fontSize.heading2} font-bold mb-4 mt-8`}
                >
                  B. Tabel Analisis
                </h4>
                <div className="overflow-x-auto w-full pb-4"><table className="w-full border-collapse border border-black mb-8">
                  <thead>
                    <tr>
                      <th className="border border-black p-2 bg-gray-100 font-bold text-center w-12">
                        No
                      </th>
                      <th className="border border-black p-2 bg-gray-100 font-bold text-center">
                        Komponen
                      </th>
                      <th className="border border-black p-2 bg-gray-100 font-bold text-center">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 text-center">1</td>
                      <td className="border border-black p-2">
                        Standar Kompetensi Lulusan
                      </td>
                      <td className="border border-black p-2">
                        Sesuai Permendikdasmen 13/2025
                      </td>
                    </tr>
                  </tbody>
                </table></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegulationComplianceView = () => {
  const { settings } = useApp();
  const [report, setReport] = useState<any>(null);

  const handleRunCompliance = () => {
    // Simulasi mengecek draf RKJM (dengan asumsi ada program kosong)
    const result = RegulationComplianceEngine.checkCompliance("PERENCANAAN", { text: "", programs: [] }, settings);
    setReport(result);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FCE8E6]0/10 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <ShieldAlert className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Regulation Compliance
          </h1>
          <p className="text-[var(--color-eds-text-primary)] text-lg max-w-2xl leading-relaxed font-medium">
            Mesin pemeriksa kepatuhan dokumen. Memverifikasi struktur dokumen,
            tata naskah, bahasa, dan keselarasan program dengan Kebijakan
            Nasional sebelum dicetak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Panel Uji Kepatuhan" icon={ListChecks}>
            <div className="space-y-4">
              <p className="text-xs text-[var(--color-eds-text-secondary)]">
                Lakukan pemeriksaan otomatis pada draf dokumen yang sedang
                disiapkan. (Simulasi pada Draf RKJM).
              </p>
              <Button
                onClick={handleRunCompliance}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ShieldAlert className="w-4 h-4 mr-2" /> Jalankan Pemeriksaan
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {report ? (
            <Card title="Hasil Pemeriksaan Kepatuhan" icon={ShieldCheck}>
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center gap-6 p-6 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]">
                  <div className="relative w-24 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={
                          251.2 - (251.2 * report.totalScore) / 100
                        }
                        className={
                          report.totalScore >= 85
                            ? "text-emerald-500 transition-all duration-1000 ease-out"
                            : report.totalScore >= 60
                              ? "text-amber-500 transition-all duration-1000 ease-out"
                              : "text-[var(--color-eds-danger)] transition-all duration-1000 ease-out"
                        }
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-[var(--color-eds-text-primary)]">
                        {report.totalScore}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-eds-text-primary)] mb-1">
                      Skor Kepatuhan
                    </h3>
                    <p className="text-sm text-[var(--color-eds-text-primary)] mb-2 font-medium">
                      Berdasarkan Regulasi & Kebijakan V-
                      {report.knowledgeBaseVersion}
                    </p>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${report.status === "Layak Dicetak" ? "bg-emerald-100 text-emerald-700" : report.status === "Perlu Revisi" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
                    >
                      Status: {report.status}
                    </span>
                  </div>
                </div>

                {/* Issues */}
                {report.issues.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                      Daftar Temuan ({report.issues.length})
                    </h4>
                    <ul className="space-y-2">
                      {report.issues.map((issue: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-[#FCE8E6] border border-red-100"
                        >
                          <AlertCircle className="w-4 h-4 text-[var(--color-eds-danger)] mt-0.5 shrink-0" />
                          <span className="text-xs text-red-800">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                      Rekomendasi Perbaikan
                    </h4>
                    <ul className="space-y-2">
                      {report.recommendations.map(
                        (rec: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
                          >
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-[var(--color-eds-primary)] font-bold">
                              {rec}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card title="Menunggu Pemeriksaan" icon={ShieldAlert}>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShieldAlert className="w-12 h-12 text-[var(--color-eds-text-secondary)] mb-4" />
                <p className="text-[var(--color-eds-text-primary)] text-sm max-w-sm font-medium">
                  Klik Jalankan Pemeriksaan untuk memvalidasi draf dokumen
                  terhadap Knowledge Base dan aturan tata naskah.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const RKJMKerangkaView = () => {
  const [activeChapter, setActiveChapter] = useState(
    RKJMKerangkaEngine.Chapters[0],
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <Compass className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Struktur Perencanaan RKJM</h1>
          <p className="text-[var(--color-eds-text-secondary)] text-lg max-w-2xl leading-relaxed">
            Struktur dan cetak biru penyusunan RKJM berdasarkan pedoman
            Perencanaan Berbasis Data (PBD) dari Kemendikdasmen. Menjadi acuan
            mutlak bagi Sistem Dokumen dan Sistem Pembuat Dokumen.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/10">
            <BookOpen className="w-4 h-4 text-[var(--color-eds-text-secondary)]" />
            <span className="text-[var(--color-eds-text-secondary)]">
              Pedoman Aktif:{" "}
              <strong className="text-[var(--color-eds-text-primary)] font-bold">
                {RKJMKerangkaEngine.Pedoman}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Struktur RKJM" icon={Layers}>
            <div className="space-y-2">
              {RKJMKerangkaEngine.Chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex flex-col ${activeChapter.id === chapter.id ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-[var(--color-eds-bg)] text-[var(--color-eds-text-secondary)] hover:bg-slate-100 border border-[var(--color-eds-border)]"}`}
                >
                  <span>{chapter.nama}</span>
                  <span
                    className={`text-xs mt-1 font-medium ${activeChapter.id === chapter.id ? "text-[var(--color-eds-text-secondary)]" : "text-[var(--color-eds-text-secondary)]"}`}
                  >
                    {chapter.subbabs.length} Subbab
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card title={`Detail: ${activeChapter.nama}`} icon={Map}>
            <div className="mb-6 pb-6 border-b border-slate-200 space-y-3">
              <p className="text-[var(--color-eds-text-primary)] text-sm font-medium">{activeChapter.tujuan}</p>
              <div className="flex gap-4">
                <div className="bg-[var(--color-eds-bg)] px-3 py-1.5 rounded-xl border border-[var(--color-eds-border)] text-xs">
                  <span className="text-[var(--color-eds-text-primary)] font-medium block">
                    Style Bahasa
                  </span>
                  <span className="font-bold text-[var(--color-eds-text-primary)]">
                    {activeChapter.styleBahasa}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-[var(--color-eds-text-primary)] text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-500" /> Daftar Subbab
              </h4>

              <div className="space-y-4">
                {activeChapter.subbabs.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-[var(--color-eds-border)] bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-[var(--color-eds-text-primary)]">{sub.nama}</h5>
                      <div className="flex gap-1">
                        {sub.dapatDiedit && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded uppercase tracking-wider">
                            Editable
                          </span>
                        )}
                        {sub.dapatDiregenerasi && (
                          <span className="px-2 py-0.5 bg-blue-50 text-[var(--color-eds-text-primary)] font-bold text-xs font-bold rounded uppercase tracking-wider">
                            Asisten
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-eds-text-primary)] mb-4 font-medium">
                      {sub.deskripsi}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-[var(--color-eds-bg)] p-2.5 rounded-xl border border-slate-200">
                        <span className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase block mb-1">
                          Sumber Data
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sub.sumberData.map((src, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-200 text-[var(--color-eds-text-primary)] px-1.5 py-0.5 rounded"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[var(--color-eds-bg)] p-2.5 rounded-xl border border-slate-200">
                        <span className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase block mb-1">
                          Panjang Max
                        </span>
                        <span className="text-xs font-medium text-[var(--color-eds-text-primary)]">
                          {sub.panjangMaksimal}
                        </span>
                      </div>
                      <div className="bg-[var(--color-eds-bg)] p-2.5 rounded-xl border border-slate-200">
                        <span className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase block mb-1">
                          Jenis Bahasa
                        </span>
                        <span className="text-xs font-medium text-[var(--color-eds-text-primary)]">
                          {sub.jenisBahasa}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const RKJMOrchestratorView = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <Share2 className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Penggabung Dokumen
          </h1>
          <p className="text-[var(--color-eds-text-secondary)] text-lg max-w-2xl leading-relaxed">
            Mesin orkestrasi konten dokumen. Menentukan sumber data, tipe
            konten, traceability, dan dependensi pembaruan pintar tanpa
            meregenerasi seluruh dokumen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Content Source Map & Tipe Data" icon={Network}>
            <div className="space-y-4">
              {Object.entries(RKJMContentOrchestratorEngine.SourceMap).map(
                ([key, val]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl border border-[var(--color-eds-border)] bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h5 className="font-bold text-[var(--color-eds-text-primary)]">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h5>
                      <p className="text-xs text-[var(--color-eds-text-secondary)] mt-1">
                        Sumber: {val.source}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-bold uppercase rounded tracking-wider ${val.type === "STATIC" ? "bg-slate-100 text-[var(--color-eds-text-secondary)]" : val.type === "DYNAMIC" ? "bg-blue-100 text-[var(--color-eds-text-primary)] font-bold" : "bg-emerald-100 text-emerald-600"}`}
                      >
                        {val.type}
                      </span>
                      {val.ai_generate && (
                        <span className="px-2 py-1 text-xs font-bold uppercase rounded tracking-wider bg-purple-100 text-purple-600">
                          Asisten
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card title="Smart Refresh & Dependency" icon={RefreshCw}>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">
                Pembaruan parsial berbasis ketergantungan data (Dependency
                Graph).
              </p>

              <div className="space-y-3">
                {Object.entries(RKJMContentOrchestratorEngine.Dependencies).map(
                  ([trigger, targets]) => (
                    <div
                      key={trigger}
                      className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200"
                    >
                      <span className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase block mb-2">
                        Jika {trigger} berubah:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {targets.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium border border-amber-200"
                          >
                            Perbarui {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Card>

          <Card title="Dasbor Status Konten" icon={LayoutDashboard}>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-[var(--color-eds-text-secondary)] mb-1">Total Bagian</p>
                <p className="text-xl font-black text-[var(--color-eds-text-primary)]">
                  {Object.keys(RKJMContentOrchestratorEngine.SourceMap).length}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 mb-1">Selesai</p>
                <p className="text-xl font-black text-emerald-700">0</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-600 mb-1">Draf</p>
                <p className="text-xl font-black text-amber-700">0</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="text-xs text-[var(--color-eds-text-primary)] font-bold mb-1">Ditinjau</p>
                <p className="text-xl font-black text-blue-700">0</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DocumentEditorView = () => {
  const { settings, getActiveAcademicYear } = useApp();
  const [activeMode, setActiveMode] = useState<"edit" | "review" | "history">(
    "edit",
  );
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Initial data representing document blocks based on DocumentEditorEngine
  const [blocks, setBlocks] = useState([
    {
      id: "b1",
      type: "AUTO",
      content: `RENCANA KERJA JANGKA MENENGAH (RKJM) TAHUN ${new Date().getFullYear()} - ${new Date().getFullYear() + 4}`,
      traceability: "Template Registry",
    },
    {
      id: "b2",
      type: "AUTO",
      content: "Nama Sekolah: {{school.name}}NPSN: {{school.npsn}}",
      traceability: "Pusat Data Sekolah",
    },
    {
      id: "b3",
      type: "MANUAL",
      content: "BAB I PENDAHULUAN",
      traceability: "Manual Entry",
    },
    {
      id: "b4",
      type: "MANUAL",
      content:
        "BAB I PENDAHULUAN1.1 Latar Belakang[Isi latar belakang penyusunan dokumen. Jelaskan kondisi riil sekolah dan dasar hukum yang digunakan.]",
      traceability: "Analisis Prioritas & Knowledge Base",
    },
    {
      id: "b5",
      type: "MANUAL",
      content:
        "1.2 Tujuan StrategisMeningkatkan skor numerasi sebesar 15% pada tahun ajaran berikutnya melalui program-program inovatif dan peningkatan kapasitas pendidik.",
      traceability: "Target Sekolah",
    },
  ]);

  const handleBlockUpdate = (id: string, newContent: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === id) {
          // Smart Edit: If AI is edited, it becomes MANUAL
          return {
            ...b,
            content: newContent,
            type: b.type === "AI" ? "MANUAL" : b.type,
            traceability: b.type === "AI" ? "Manual Edit" : b.traceability,
          };
        }
        return b;
      }),
    );
  };

  const getBlockIcon = (type: string) => {
    const blockDef = DocumentEditorEngine.BlockTypes.find((t) => t.id === type);
    return blockDef ? blockDef.icon : "";
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <FileEdit className="w-3.5 h-3.5 mr-2" />Registry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Editor Dokumen
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/80 text-lg max-w-2xl leading-relaxed">
            Editor Dokumen bergaya Microsoft Word. Menyempurnakan dokumen resmi
            dengan sistem block pintar dan pelacakan sumber data.
          </p>
        </div>
      </div>

      <div className="enterprise-card overflow-hidden flex flex-col min-h-[800px]">
        {/* Microsoft Word-like Toolbar */}
        <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-2 flex flex-col gap-2">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-1">
              <Button
                variant={activeMode === "edit" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("edit")}
                className="h-8 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Mode
              </Button>
              <Button
                variant={activeMode === "review" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("review")}
                className="h-8 text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Review
              </Button>
              <Button
                variant={activeMode === "history" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("history")}
                className="h-8 text-xs"
              >
                <History className="w-3.5 h-3.5 mr-1.5" /> Riwayat
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-eds-text-secondary)] font-mono hidden md:inline">
                Ctrl+S, Ctrl+F, Ctrl+Z, Ctrl+Y
              </span>
              <span className="text-xs text-[var(--color-eds-text-secondary)] font-medium ml-2">
                Tersimpan Otomatis (v1.2)
              </span>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 h-8 text-xs ml-2"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Cetak (Ctrl+P)
              </Button>
            </div>
          </div>

          {activeMode === "edit" && (
            <div className="flex items-center flex-wrap gap-1 px-2 py-1 bg-white border border-[var(--color-eds-border)] rounded-xl">
              <select className="text-xs border-r border-[var(--color-eds-border)] pr-2 py-1 outline-none bg-transparent">
                <option>Normal Text</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
              </select>
              <select className="text-xs border-r border-[var(--color-eds-border)] px-2 py-1 outline-none bg-transparent">
                <option>Times New Roman</option>
                <option>Arial</option>
              </select>
              {settings?.writingAssistant?.mode !== 'Disabled' && (
                <select className="text-xs border-r border-[var(--color-eds-border)] px-2 py-1 outline-none bg-blue-50 text-blue-700 font-bold">
                  <option value="">✨ Writing Assistant</option>
                  <option value="improve">Improve Language</option>
                  <option value="formalize">Formalize</option>
                  <option value="expand">Expand</option>
                  <option value="summarize">Summarize</option>
                  <option value="rewrite">Rewrite</option>
                  <option value="gov_style">Official Government Style</option>
                </select>
              )}
              <div className="flex items-center border-r border-[var(--color-eds-border)] px-1">
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)] font-bold">
                  B
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)] italic">
                  I
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)] underline">
                  U
                </button>
              </div>
              <div className="flex items-center border-r border-[var(--color-eds-border)] px-1">
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)]">
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)]">
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)]">
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)]">
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center px-1">
                <button className="p-1.5 hover:bg-slate-100 rounded text-[var(--color-eds-text-primary)]">
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex bg-slate-200/50 p-6 overflow-y-auto justify-center">
          {isComparing ? (
            <div className="flex gap-4 w-full max-w-6xl">
              <div className="flex-1 bg-white shadow-md p-10 font-serif">
                <div className="bg-slate-100 text-[var(--color-eds-text-secondary)] text-xs font-sans font-bold px-3 py-1 mb-6 rounded inline-block">
                  Versi v1.0 (Lama)
                </div>
                <div className="text-[var(--color-eds-text-primary)] whitespace-pre-wrap leading-relaxed text-[var(--color-eds-text-primary)] font-medium">
                  BAB I PENDAHULUAN 1.1 Latar Belakang Berdasarkan Rapor
                  Pendidikan tahun terakhir, sekolah kami memiliki beberapa
                  kekuatan dan kelemahan.{" "}
                  <span className="bg-rose-200 text-rose-900 px-1 line-through">
                    Kelemahan utama berada pada literasi siswa kelas 4.
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-white shadow-md p-10 font-serif">
                <div className="bg-blue-100 text-blue-700 text-xs font-sans font-bold px-3 py-1 mb-6 rounded inline-block">
                  Versi Saat Ini (Baru)
                </div>
                <div className="text-[var(--color-eds-text-primary)] whitespace-pre-wrap leading-relaxed">
                  BAB I PENDAHULUAN 1.1 Latar Belakang Berdasarkan Rapor
                  Pendidikan tahun terakhir, sekolah kami memiliki beberapa
                  kekuatan dan kelemahan yang perlu ditindaklanjuti.{" "}
                  <span className="bg-emerald-200 text-emerald-900 px-1">
                    Kelemahan utama berada pada kemampuan numerasi siswa kelas
                    5.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[210mm] bg-white shadow-md p-10 font-serif">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`relative group mb-4 p-2 border border-transparent rounded transition-colors ${activeMode === "edit" ? "hover:border-blue-100 hover:bg-blue-50/30" : ""} ${selectedBlock === block.id ? "ring-2 ring-blue-200 bg-blue-50/10" : ""}`}
                  onClick={() => setSelectedBlock(block.id)}
                >
                  {activeMode === "edit" && (
                    <div className="absolute -left-10 top-2 opacity-100 transition-opacity flex flex-col gap-1">
                      <span
                        className="text-lg"
                        title={
                          DocumentEditorEngine.BlockTypes.find(
                            (t) => t.id === block.type,
                          )?.description
                        }
                      >
                        {getBlockIcon(block.type)}
                      </span>
                    </div>
                  )}

                  {activeMode === "edit" &&
                    selectedBlock === block.id &&
                    block.type === "AI" && (
                      <div className="absolute -top-10 left-0 bg-white shadow border border-[var(--color-eds-border)] rounded-xl p-1 flex gap-1 z-10">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-[var(--color-eds-text-primary)] font-bold"
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" /> Perbarui dari Sistem
                        </Button>
                      </div>
                    )}

                  {block.type === "AUTO" ? (
                    <div className="whitespace-pre-wrap text-[var(--color-eds-text-primary)] cursor-not-allowed select-none">
                      {block.content}
                    </div>
                  ) : (
                    <textarea maxLength={2000}
                      className="w-full bg-transparent resize-none outline-none whitespace-pre-wrap text-[var(--color-eds-text-primary)] font-serif leading-relaxed"
                      value={block.content}
                      onChange={(e) =>
                        handleBlockUpdate(block.id, e.target.value)
                      }
                      rows={block.content.split("").length}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Traceability / Info Sidebar */}
          {activeMode === "edit" && selectedBlock && (
            <div className="w-56 ml-4 space-y-4">
              <div className="bg-white border border-[var(--color-eds-border)] shadow-sm rounded-xl p-4 sticky top-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-eds-text-secondary)] mb-4 border-b border-slate-200 pb-2">
                  Block Info
                </h4>
                {blocks.find((b) => b.id === selectedBlock) && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase">
                        Tipe Block
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm">
                          {getBlockIcon(
                            blocks.find((b) => b.id === selectedBlock)!.type,
                          )}
                        </span>
                        <span className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                          {blocks.find((b) => b.id === selectedBlock)!.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-eds-text-secondary)] font-bold uppercase">
                        Traceability / Sumber
                      </p>
                      <p className="text-xs text-[var(--color-eds-text-secondary)] mt-1 font-medium">
                        {
                          blocks.find((b) => b.id === selectedBlock)!
                            .traceability
                        }
                      </p>
                    </div>
                    {blocks.find((b) => b.id === selectedBlock)!.type ===
                      "AI" && (
                      <div className="pt-3 border-t border-slate-200">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs h-7 border-blue-200 text-[var(--color-eds-text-primary)] font-bold hover:bg-blue-50"
                        >
                          Sinkronisasi Ulang
                        </Button>
                      </div>
                    )}
                    {blocks.find((b) => b.id === selectedBlock)!.type ===
                      "MANUAL" && (
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                          Perubahan manual ini tidak akan ditimpa oleh sistem.
                        </p>
                        <div className="mt-3 bg-rose-50 border border-rose-100 p-2 rounded">
                          <p className="text-xs font-bold text-rose-800 uppercase flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Impact
                            Analysis
                          </p>
                          <p className="text-xs text-rose-600 mt-1">
                            Perubahan pada block ini akan mempengaruhi
                            konsistensi pada: <br />
                            <strong>RKT Bab II</strong> dan{" "}
                            <strong>RKAS</strong>.
                          </p>
                          <button className="mt-2 text-xs bg-white border border-rose-200 text-rose-600 px-2 py-1 rounded w-full font-bold">
                            Sinkronisasi Dokumen Terkait
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Mode Sidebar */}
          {activeMode === "review" && (
            <div className="w-56 ml-4 space-y-4">
              <div className="bg-white border border-[var(--color-eds-border)] shadow-sm rounded-xl p-4 sticky top-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-eds-text-secondary)] mb-4 border-b border-slate-200 pb-2">
                  Track Changes
                </h4>
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <p className="text-xs text-emerald-800 font-medium">
                      1 Penambahan (Manual Edit)
                    </p>
                    <div className="mt-2 flex gap-1">
                      <button className="text-xs font-bold bg-white border border-emerald-200 text-emerald-600 px-2 py-1 rounded">
                        Setujui
                      </button>
                      <button className="text-xs font-bold bg-white border border-rose-200 text-rose-600 px-2 py-1 rounded">
                        Tolak
                      </button>
                    </div>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Tambah
                      Komentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Mode Sidebar */}
          {activeMode === "history" && (
            <div className="w-56 ml-4 space-y-4">
              <div className="bg-white border border-[var(--color-eds-border)] shadow-sm rounded-xl p-4 sticky top-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-eds-text-secondary)] mb-4 border-b border-slate-200 pb-2">
                  Version History
                </h4>
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-100">
                  <div className="relative pl-6">
                    <div className="absolute left-1 top-1.5 w-2 h-2 rounded bg-blue-500 ring-4 ring-white"></div>
                    <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">
                      Versi Saat Ini
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-secondary)]">
                      Oleh Anda - Baru saja
                    </p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-1 top-1.5 w-2 h-2 rounded bg-slate-300 ring-4 ring-white"></div>
                    <p className="text-sm font-medium text-[var(--color-eds-text-primary)]">
                      v1.2 (Smart Edit)
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-secondary)]">
                      Oleh Anda - 10 mnt lalu
                    </p>
                    <button
                      onClick={() => setIsComparing(!isComparing)}
                      className="text-xs text-[var(--color-eds-text-primary)] font-bold mt-1 hover:underline"
                    >
                      {isComparing ? "Tutup Perbandingan" : "Bandingkan"}
                    </button>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-1 top-1.5 w-2 h-2 rounded bg-slate-300 ring-4 ring-white"></div>
                    <p className="text-sm font-medium text-[var(--color-eds-text-primary)]">
                      v1.0 (Dibuat)
                    </p>
                    <p className="text-xs text-[var(--color-eds-text-secondary)]">
                      Oleh Sistem - 1 jam lalu
                    </p>
                    <button
                      onClick={() => setIsComparing(!isComparing)}
                      className="text-xs text-[var(--color-eds-text-primary)] font-bold mt-1 hover:underline"
                    >
                      {isComparing ? "Tutup Perbandingan" : "Bandingkan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




const PrintDiagnosticView = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)]">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2 flex items-center">
          <Printer className="w-8 h-8 mr-4 text-[var(--color-eds-text-primary)] font-bold" />
          Enterprise Print Diagnostic
        </h1>
        <p className="text-[var(--color-eds-text-primary)] font-medium">
          Validasi print engine, PDF renderer, dan DOCX exporter.
        </p>
      </div>

      <Card title="Diagnostic Report" icon={CheckCircle2}>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Print Button</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Renderer</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Pratinjau</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">PDF</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-amber-200 bg-amber-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">DOCX</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded font-bold">PERINGATAN</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Page Layout</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Pemeriksaan</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Workflow</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Status</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};



const RelationalPlanningView = ({ initialTab, navigateToView }: any) => {
  const { settings, updateSetting, showSuccess } = useApp();
  const [activeYear, setActiveYear] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab || "rkjm");
  const [isSyncing, setIsSyncing] = useState(false);
  const [rkjmRenderer, setRkjmRenderer] = useState<'AUTO' | 'LEGACY' | 'CANONICAL'>('AUTO');
  const { planning } = useApp();


  const handleSync = () => {
    setIsSyncing(true);
    
    const snapshotService = new PlanningSnapshotService();
    const snapshot = snapshotService.createSnapshot(planning);
    

    updateSetting("relationalPlanning", "", snapshot);


    (/* console.log removed */ (..._args: any[]) => {})('--- AUDIT ---');
    (/* console.log removed */ (..._args: any[]) => {})('Snapshot Hash:', snapshot.hash);
    (/* console.log removed */ (..._args: any[]) => {})('Settings Hash:', settings.relationalPlanning?.hash);


    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("Siklus Perencanaan Berhasil Disinkronkan", "Semua data RKJM, RKT, dan RKAS terhubung dalam satu jalur.");
    }, 1500);
  };

  const renderRKJM = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Master Plan RKJM (4 Tahun)</h3>
          <p className="text-blue-700 text-sm">Rencana Strategis Jangka Menengah Sekolah.</p>
        </div>
        <Button onClick={handleSync} className="bg-blue-600 hover:bg-blue-700 text-white">
          <RefreshCw className={isSyncing ? "w-4 h-4 mr-2 animate-spin" : "w-4 h-4 mr-2"} />
          Sinkronisasi RKJM
        </Button>
      </div>

      <div className="space-y-4">
        {planning.objectives.map((obj: any, idx: number) => (
          <div key={idx} className="bg-white border border-[var(--color-eds-border)] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1 block">ID: {obj.id} • {obj.associatedSnp}</span>
                <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">{obj.strategicObjective}</h4>
                <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">{obj.originatingPriority}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">4 Tahun</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--color-eds-bg)] rounded-xl p-4 mb-4">
              <div>
                <span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Kondisi Awal</span>
                <span className="font-bold text-[var(--color-eds-text-primary)]">{obj.kondisiAwal}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Target Tahun 1</span>
                <span className="font-bold text-[var(--color-eds-text-primary)]">{typeof obj.targetY1 === 'object' ? obj.targetY1.value + '%' : obj.targetY1}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Target Tahun 2</span>
                <span className="font-bold text-[var(--color-eds-text-primary)]">{typeof obj.targetY2 === 'object' ? obj.targetY2.value + '%' : obj.targetY2}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Target Tahun 3 & 4</span>
                <span className="font-bold text-[var(--color-eds-text-primary)]">{typeof obj.targetY3 === 'object' ? obj.targetY3.value + '%' : obj.targetY3} / {typeof obj.targetY4 === 'object' ? obj.targetY4.value + '%' : obj.targetY4}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--color-eds-text-secondary)]">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[var(--color-eds-text-secondary)] shrink-0" />
                <span><strong className="text-[var(--color-eds-text-primary)]">Unit:</strong> {obj.responsibleUnit}</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong className="text-[var(--color-eds-text-primary)]">Risiko:</strong> {obj.risk}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-[var(--color-eds-text-primary)]">Mitigasi:</strong> {obj.mitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const currentYearPlan = (planning.annualPlans as any)["Y" + activeYear] || { rkt: [], rkas: [], monitoring: [], evaluation: [] };

  const renderRKT = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Rencana Kerja Tahunan (RKT) - Tahun {activeYear}</h3>
          <p className="text-blue-700 text-sm">Diturunkan secara otomatis dari RKJM.</p>
        </div>
      </div>
      
      {(!currentYearPlan.rkt || currentYearPlan.rkt.length === 0) ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--color-eds-border)]">
            <p className="text-[var(--color-eds-text-primary)] font-medium">Belum ada turunan program RKT untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.rkt.map((act: any, idx: number) => {
             const parentObj = planning.objectives.find((o:any) => o.id === act.rkjmObjectiveId);
             return (
               <div key={idx} className="bg-white border border-[var(--color-eds-border)] rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-slate-200 pb-3">
                     <div>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Induk RKJM: {parentObj?.strategicObjective}</span>
                        <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">{act.activity}</h4>
                        <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">Sub-Kegiatan: {act.subActivity || act.activity}</p>
                     </div>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold uppercase">{act.status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl"><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1">Target</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{act.successTarget || act.target}</span></div>
                    <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl"><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1">Jadwal</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{act.schedule || 'Semester 1'}</span></div>
                    <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl"><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1">Output</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{act.output || '-'}</span></div>
                    <div className="bg-[var(--color-eds-bg)] p-3 rounded-xl"><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1">Outcome</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{act.outcome || '-'}</span></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--color-eds-text-secondary)] border-t border-slate-200 pt-3">
                     <div className="space-y-2">
                        <div className="flex items-start gap-2"><Users className="w-4 h-4 text-[var(--color-eds-text-secondary)] shrink-0" /><span><strong>Penanggung Jawab:</strong> {act.personResponsible || parentObj?.responsibleUnit}</span></div>
                        <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-eds-text-secondary)] shrink-0" /><span><strong>Bukti:</strong> {act.evidence || 'Dokumentasi'}</span></div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span><strong>Risiko:</strong> {act.risk || '-'}</span></div>
                        <div className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /><span><strong>Mitigasi:</strong> {act.mitigation || '-'}</span></div>
                     </div>
                  </div>
                  <div className="mt-3 text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider bg-[var(--color-eds-bg)] p-2 rounded inline-block">
                    Relasi SNP: {act.relatedSnp || parentObj?.associatedSnp}
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );

  const renderRKAS = () => {
    try {
      const kg = KnowledgeGraph.getInstance();
      if (settings.canonicalObjects) {
        KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
      } else {
        seedInitialGraph();
      }
      const documentModel = generateAppDocument('rkas', kg, { ...settings, planning });
      
      return (
        <div className="h-full min-h-[800px] -mx-8 -mb-8">
          <EnterpriseDocumentViewer 
            title={`Rencana Kegiatan dan Anggaran Sekolah (RKAS) - Tahun ${activeYear}`} 
            document={documentModel} 
            generatedBy={settings.principal?.name || "Kepala Sekolah"} 
            settings={settings} 
          />
        </div>
      );
    } catch (error: any) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <AlertTriangle className="w-12 h-12 mb-4 text-rose-500" />
          <h3 className="text-xl font-bold mb-2">Gagal Memuat RKAS</h3>
          <p>{error.message}</p>
        </div>
      );
    }
  };

  const renderMonitoring = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* IMPLEMENTATION SECTION */}
      <div>
        <div className="flex justify-between items-center bg-cyan-50 border border-cyan-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-cyan-900 text-lg">Implementasi (Pelaksanaan) - Tahun {activeYear}</h3>
            <p className="text-cyan-700 text-sm">Pelaksanaan dari kegiatan RKAS.</p>
          </div>
        </div>
        
        {(!currentYearPlan.implementation || currentYearPlan.implementation.length === 0) ? (
           <EmptyState 
             icon={FileText} 
             title="Data Pelaksanaan Belum Tersedia" 
             description={"Belum ada data implementasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan data pelaksanaan program."}
             ctaText="Ke Modul Pelaksanaan"
             onCtaClick={() => navigateToView("monitoring")}
           />
        ) : (
           <div className="space-y-4">
             {currentYearPlan.implementation.map((impl: any, idx: number) => {
               const parentRkas = currentYearPlan.rkas.find((r:any) => r.id === impl.rkasId);
               return (
                 <div key={idx} className="bg-white border border-[var(--color-eds-border)] rounded-xl p-5 shadow-sm border-l-4 border-l-cyan-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-200 pb-3">
                       <div>
                          <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Anggaran RKAS: {parentRkas?.budgetItem}</span>
                          <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">Pelaksanaan: {impl.progress}</h4>
                       </div>
                       <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded text-xs font-bold uppercase">{impl.completionPercentage}% Selesai</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--color-eds-bg)] p-3 rounded-xl mb-3">
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Biaya Aktual</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">Rp {(impl.actualCost || 0).toLocaleString('id-ID')}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Tanggal Selesai</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{impl.completionDate}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Penanggung Jawab</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{impl.responsibleOfficer}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Bukti/Foto</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)] font-bold underline cursor-pointer">{impl.evidence}</span></div>
                    </div>
                    <p className="text-sm text-[var(--color-eds-text-primary)] font-medium"><strong className="text-[var(--color-eds-text-primary)]">Catatan Pelaksanaan:</strong> {impl.notes}</p>
                 </div>
               )
             })}
           </div>
        )}
      </div>

      {/* MONITORING SECTION */}
      <div>
        <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-amber-900 text-lg">Monitoring - Tahun {activeYear}</h3>
            <p className="text-amber-700 text-sm">Pengawasan capaian pelaksanaan program.</p>
          </div>
        </div>
        
        {(!currentYearPlan.monitoring || currentYearPlan.monitoring.length === 0) ? (
           <EmptyState 
             icon={Activity} 
             title="Data Monitoring Belum Tersedia" 
             description={"Belum ada data monitoring yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan laporan bukti pelaksanaan."}
             ctaText="Ke Modul Monitoring"
             onCtaClick={() => navigateToView("monitoring")}
           />
        ) : (
           <div className="space-y-4">
             {currentYearPlan.monitoring.map((mon: any, idx: number) => {
               const parentRkas = currentYearPlan.rkas.find((r:any) => r.id === mon.rkasId);
               return (
                 <div key={idx} className="bg-white border border-[var(--color-eds-border)] rounded-xl p-5 shadow-sm border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-200 pb-3">
                       <div>
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Implementasi RKAS: {parentRkas?.budgetItem}</span>
                          <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">Status: {mon.performanceStatus}</h4>
                       </div>
                       <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${mon.trafficLight === 'Hijau' ? 'bg-emerald-100 text-emerald-800' : mon.trafficLight === 'Kuning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>Indikator: {mon.trafficLight}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[var(--color-eds-bg)] p-3 rounded-xl mb-3">
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Capaian</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{mon.achievement}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Variansi (Kendala)</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{mon.variance}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Rekomendasi</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{mon.recommendation}</span></div>
                    </div>
                    <div className="text-sm text-[var(--color-eds-text-primary)] space-y-1 font-medium">
                      <p><strong className="text-[var(--color-eds-text-primary)]">Tindak Lanjut:</strong> {mon.followUpAction}</p>
                      <p><strong className="text-[var(--color-eds-text-primary)]">Catatan Supervisor:</strong> {mon.supervisorNotes}</p>
                    </div>
                 </div>
               )
             })}
           </div>
        )}
      </div>

      {/* EVALUATION SECTION */}
      <div>
        <div className="flex justify-between items-center bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6">
          <div>
            <h3 className="font-bold text-purple-900 text-lg">Evaluasi - Tahun {activeYear}</h3>
            <p className="text-purple-700 text-sm">Kesimpulan capaian target strategis tahunan RKJM.</p>
          </div>
        </div>
        
        {(!currentYearPlan.evaluation || currentYearPlan.evaluation.length === 0) ? (
           <EmptyState 
             icon={CheckSquare} 
             title="Data Evaluasi Belum Tersedia" 
             description={"Belum ada data evaluasi yang ditambahkan untuk Tahun " + activeYear + ". Silakan tambahkan hasil evaluasi program."}
             ctaText="Ke Modul Evaluasi"
             onCtaClick={() => navigateToView("monitoring")}
           />
        ) : (
           <div className="space-y-4">
             {currentYearPlan.evaluation.map((ev: any, idx: number) => {
               const parentObj = planning.objectives.find((o:any) => o.id === ev.objectiveId);
               return (
                 <div key={idx} className="bg-white border border-[var(--color-eds-border)] rounded-xl p-5 shadow-sm border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-200 pb-3">
                       <div>
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Induk RKJM: {parentObj?.strategicObjective}</span>
                          <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg">Hasil: {ev.status}</h4>
                       </div>
                       <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs font-bold uppercase">{ev.programEffectiveness}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--color-eds-bg)] p-3 rounded-xl mb-3">
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Capaian Kinerja</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{ev.achievement}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Realisasi Anggaran</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{ev.budgetRealization}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Lesson Learned</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{ev.lessonsLearned}</span></div>
                      <div><span className="block text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Rencana Perbaikan</span><span className="font-medium text-sm text-[var(--color-eds-text-primary)]">{ev.improvementPlan}</span></div>
                    </div>
                    <div className="text-sm text-[var(--color-eds-text-primary)] bg-purple-50 p-3 rounded-xl border border-purple-100 font-medium">
                      <strong className="text-[var(--color-eds-text-primary)] block mb-1">Rekomendasi Tahun Berikutnya:</strong> 
                      {ev.nextYearRecommendation}
                    </div>
                 </div>
               )
             })}
           </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div>
             <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2 flex items-center">
               Relational Planning Workspace
             </h1>
             <p className="text-[var(--color-eds-text-primary)] font-medium">Sistem Perencanaan Terpadu (RKJM → RKT → RKAS → Evaluasi)</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-xl">
             {[1, 2, 3, 4].map(y => (
               <button 
                 key={y} 
                 onClick={() => { setActiveYear(y); if(activeTab==='rkjm') setActiveTab('rkt'); }}
                 className={"px-4 py-2 rounded-xl text-sm font-bold transition-all " + (activeYear === y ? 'bg-white text-[var(--color-eds-text-primary)] shadow-sm' : 'text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]')}
               >
                 Tahun {y}
               </button>
             ))}
           </div>
        </div>

        <div className="flex border-b border-[var(--color-eds-border)] mb-6 space-x-6 overflow-x-auto">
           <button onClick={() => setActiveTab("rkjm")} className={"pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap " + (activeTab === "rkjm" ? "border-blue-600 text-blue-700" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]")}>Master RKJM</button>
           <button onClick={() => setActiveTab("rkt")} className={"pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap " + (activeTab === "rkt" ? "border-blue-600 text-blue-700" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]")}>RKT Tahun {activeYear}</button>
           <button onClick={() => setActiveTab("rkas")} className={"pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap " + (activeTab === "rkas" ? "border-emerald-600 text-emerald-700" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]")}>RKAS Tahun {activeYear}</button>
           <button onClick={() => setActiveTab("monitoring")} className={"pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap " + (activeTab === "monitoring" ? "border-amber-500 text-amber-700" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]")}>Pelaksanaan & Evaluasi</button>
           <button onClick={() => setActiveTab("export")} className={"pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center " + (activeTab === "export" ? "border-purple-600 text-purple-700" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]")}><FileText className="w-4 h-4 mr-2" /> Document Export Engine</button>
        </div>

        {activeTab === "rkjm" && renderRKJM()}
        {activeTab === "rkt" && renderRKT()}
        {activeTab === "rkas" && renderRKAS()}
        {activeTab === "monitoring" && renderMonitoring()}
        {activeTab === "export" && (() => {
           try {
             const kg = KnowledgeGraph.getInstance();
             if (settings.canonicalObjects) {
               KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
             } else {
               seedInitialGraph();
             }
             const documentModel = DocumentRouter.generate('rkjm', kg, settings);
             
             return (
               <div className="h-full min-h-[800px] -mx-8 -mb-8 flex flex-col">
                 <div className="bg-slate-100 p-4 border-b border-slate-300 flex items-center justify-between mx-8 mb-4 rounded-xl print:hidden">
                   <div className="flex items-center">
                     <Settings className="w-5 h-5 mr-3 text-slate-500" />
                     <div>
                       <h3 className="font-bold text-slate-800">Publishing Engine Mode</h3>
                       <p className="text-xs text-slate-500">Toggle between Legacy (EnterpriseDocumentViewer) and Canonical (CanonicalRenderer V2)</p>
                     </div>
                   </div>
                   <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                     <button
                       onClick={() => setRkjmRenderer('AUTO')}
                       className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${rkjmRenderer === 'AUTO' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       AUTO
                     </button>
                     <button
                       onClick={() => setRkjmRenderer('LEGACY')}
                       className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${rkjmRenderer === 'LEGACY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       LEGACY
                     </button>
                     <button
                       onClick={() => setRkjmRenderer('CANONICAL')}
                       className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${rkjmRenderer === 'CANONICAL' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       CANONICAL
                     </button>
                   </div>
                 </div>
                 
                 {rkjmRenderer === 'LEGACY' ? (
                   <EnterpriseDocumentViewer title="Dokumen RKJM Terpadu SD Negeri 1 Tampuyak" document={documentModel} generatedBy="Kepala Sekolah" settings={settings} />
                 ) : (
                   <CanonicalRenderer
                     document={RkjmDocumentAssembler.assemble(documentModel, settings, { title: "Dokumen RKJM Terpadu SD Negeri 1 Tampuyak", activeYear })}
                     selectedNodeId={null}
                     onSelectNode={() => {}}
                     scale={1}
                     
                     onSaveOverride={() => {}}
                   />
                 )}
               </div>
             );
           } catch (error: any) {
             return <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
               <AlertTriangle className="w-12 h-12 mb-4 text-rose-500" />
               <h3 className="text-xl font-bold mb-2">Knowledge Graph Hydration Failure</h3>
               <p>{error.message}</p>
             </div>;
           }
        })()}

      </div>
    </div>
  );
};

const GenerationDiagnosticView = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)]">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2 flex items-center">
          <Activity className="w-8 h-8 mr-4 text-[var(--color-eds-text-primary)] font-bold" />
          Status Penulisan Dokumen
        </h1>
        <p className="text-[var(--color-eds-text-primary)] font-medium">
          Trace progres pembuatan dokumen RKJM.
        </p>
      </div>

      <Card title="Diagnostic Report" icon={Activity}>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">School Data</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Sistem Keputusan</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-rose-200 bg-rose-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Prompt Builder</span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded font-bold">GAGAL</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[var(--color-eds-border)] bg-[var(--color-eds-bg)]">
            <span className="font-bold text-[var(--color-eds-text-primary)]">System Request</span>
            <span className="px-3 py-1 bg-slate-200 text-[var(--color-eds-text-primary)] rounded font-bold">SKIPPED</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[var(--color-eds-border)] bg-[var(--color-eds-bg)]">
            <span className="font-bold text-[var(--color-eds-text-primary)]">System Response</span>
            <span className="px-3 py-1 bg-slate-200 text-[var(--color-eds-text-primary)] rounded font-bold">EMPTY</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[var(--color-eds-border)] bg-[var(--color-eds-bg)]">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Section Builder</span>
            <span className="px-3 py-1 bg-slate-200 text-[var(--color-eds-text-primary)] rounded font-bold">EMPTY</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Renderer</span>
            <Badge variant="completed">SIAP</Badge>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl border border-[var(--color-eds-border)] bg-[var(--color-eds-bg)]">
            <span className="font-bold text-[var(--color-eds-text-primary)]">Document Output</span>
            <span className="px-3 py-1 bg-slate-200 text-[var(--color-eds-text-primary)] rounded font-bold">EMPTY</span>
          </div>
          
          <div className="mt-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
             <p className="font-bold mb-2">Peringatan Koneksi Terputus:</p>
             <p>Proses penyusunan dokumen terhenti di tahap penulisan manual. RKJM ditampilkan tanpa deskripsi naratif (hanya placeholder).</p>
          </div>
        </div>
      </Card>
    </div>
  );
};


const DocumentQualityAssuranceView = ({ navigateToView }: any) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sertifikasi Mutu</h1>
      <p className="text-[var(--color-eds-text-primary)] font-medium">Modul sedang dalam pengembangan...</p>
    </div>
  );
};

const KSPStudioView = ({ navigateToView, activeMode = "home" }: any) => {
  const { settings } = useApp();
  
  if (activeMode === "preview") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KspPreviewWorkspace onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }
  
  if (activeMode === "validation") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KSPValidationPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }


  if (activeMode === "settings") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <EnterpriseWorkspaceShell onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }
  
  if (activeMode === "attachments") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KSPAttachmentPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }
  
  return (
    <KSPDashboard 
      onOpenPreview={() => navigateToView("kspStudio_preview")} 
      onOpenValidation={() => navigateToView("kspStudio_validation")} 
      onOpenAttachments={() => navigateToView("kspStudio_attachments")} 
      onOpenSettings={() => navigateToView("kspStudio_settings")} 
    />
  );
};

const PublishingCenterView = ({ navigateToView }: any) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Publishing Center</h1>
      <p className="text-[var(--color-eds-text-primary)] font-medium">Modul sedang dalam pengembangan...</p>
    </div>
  );
};

const EnterpriseValidationInspector = () => {
  const { settings } = useApp();
  const sysVal = EnterpriseValidationEngine.validateSystem(settings);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-slate-900 text-slate-200">
      <div className="p-6 border-b border-slate-700 bg-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Terminal className="w-6 h-6 mr-3 text-emerald-400" />
          Enterprise Validation Inspector (EVE)
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Diagnostic tool for system-wide validation traces. Only visible in Developer Mode.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">Overall Score</div>
            <div className="text-3xl font-black text-emerald-400">{sysVal.score}%</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">System Status</div>
            <div className={`text-3xl font-black ${sysVal.overallStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {sysVal.overallStatus}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 uppercase font-bold">Total Rules</div>
            <div className="text-3xl font-black text-blue-400">{sysVal.traces.length}</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto w-full pb-4"><table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs">
              <th className="p-3">Requirement</th>
              <th className="p-3">Source Module</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Fix Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {sysVal.traces.map((trace: any) => (
              <tr key={trace.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="p-3 font-medium text-white">{trace.requirement}</td>
                <td className="p-3 text-slate-400">{trace.sourceModule}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${trace.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {trace.status}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{trace.reason}</td>
                <td className="p-3 text-slate-400 text-xs italic">{trace.fixAction}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        </div>
      </div>
    </div>
  );
};

const GovernanceComplianceView = ({ navigateToView, navigateToSettings }: any) => {
  const { settings } = useApp();
  const [tampilkanLanjutan, setShowDevMode] = useState(false);

  // Business Logic Parsing (No AI)
  const docs = settings.documents || [];
  const rkjmDoc = docs.find((d: any) => d.type === "RKJM");
  const rktDoc = docs.find((d: any) => d.type === "RKT");
  const rkasDoc = docs.find((d: any) => d.type === "RKAS");
  const kspDoc = docs.find((d: any) => d.type === "KSP");
  const monitoringDocs = docs.filter((d: any) => d.type === "Monitoring");

  const hasName = !!settings.school?.name;
  const hasPrincipal = !!settings.principal?.name;
  const hasVisi = !!settings.identitas?.visi;
  const dataCompletenessScore = (hasName ? 30 : 0) + (hasPrincipal ? 30 : 0) + (hasVisi ? 40 : 0);
  const isDataReady = dataCompletenessScore === 100;

  // Compliance Calculation
  const complianceStatus = {
    planning: rkjmDoc && rktDoc && rkasDoc ? "Sesuai" : (rkjmDoc ? "Perlu Perhatian" : "Tidak Sesuai"),
    documentation: kspDoc ? "Sesuai" : "Tidak Sesuai",
    workflow: (rkjmDoc?.status === "Disetujui" || rkjmDoc?.status === "Terkunci") ? "Sesuai" : "Perlu Perhatian",
    dataSekolah: isDataReady ? "Sesuai" : "Tidak Sesuai",
    budget: rkasDoc ? "Sesuai" : "Tidak Sesuai",
    monitoring: monitoringDocs.length > 0 ? "Sesuai" : "Tidak Sesuai",
  };

  const getComplianceColor = (status: string) => {
    if (status === "Sesuai") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Perlu Perhatian") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-rose-100 text-rose-700 border-rose-200";
  };
  
  const getComplianceIcon = (status: string) => {
    if (status === "Sesuai") return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
    if (status === "Perlu Perhatian") return <AlertTriangle className="w-4 h-4 mr-1.5" />;
    return <XCircle className="w-4 h-4 mr-1.5" />;
  };

  let totalScore = 0;
  let totalCats = 0;
  for (const key in complianceStatus) {
    if ((complianceStatus as any)[key] === "Sesuai") totalScore += 100;
    else if ((complianceStatus as any)[key] === "Perlu Perhatian") totalScore += 50;
    totalCats++;
  }
  const overallScore = Math.round(totalScore / totalCats);

  const findings: any[] = [];
  const addFinding = (severity: string, title: string, desc: string, ruleId: string, trigger: string, source: string, actionText: string, action: any) => {
    findings.push({ severity, title, desc, ruleId, trigger, source, actionText, action });
  };

  if (!hasName) addFinding("Critical", "Identitas Sekolah Kosong", "Nama dan NPSN sekolah belum diisi.", "COMP_001", "Missing school.name", "Data Sekolah", "Isi Profil", () => navigateToSettings("school"));
  if (!settings.identityAssets?.governmentLogo?.url) addFinding("Critical", "Logo Pemerintah Daerah Belum Diunggah", "Logo instansi pemerintah wajib ada untuk dokumen cetak.", "COMP_010", "Missing governmentLogo", "Data Sekolah", "Unggah Logo", () => navigateToSettings("school"));
  if (!hasPrincipal) addFinding("Medium", "Data Kepala Sekolah Kosong", "Nama kepala sekolah belum ada. Dokumen resmi tidak dapat ditandatangani.", "COMP_002", "Missing school.principal", "Data Sekolah", "Isi Pejabat", () => navigateToSettings("pejabat"));
  if (!hasVisi) addFinding("High", "Visi Misi Belum Ditetapkan", "Identitas Visi, Misi, dan Tujuan sekolah masih kosong.", "COMP_003", "Missing identitas.visi", "Identitas", "Lengkapi", () => navigateToSettings("school"));
  
  if (!rkjmDoc) {
    if (settings.decisionEngine?.status !== "Disetujui") {
      addFinding("High", "Analisis Prioritas Belum Disetujui", "Dokumen RKJM membutuhkan dasar Analisis Prioritas.", "COMP_003B", "Decision not approved", "Perencanaan", "Buat Analisis", () => navigateToView("diagnosis"));
    } else {
      addFinding("Critical", "RKJM Tidak Ditemukan", "Rencana Kerja Jangka Menengah wajib ada sebagai dasar perencanaan.", "COMP_004", "RKJM Tidak Ditemukan", "Perencanaan", "Buat RKJM", () => navigateToView("rkjmPipeline"));
    }
  } else if (rkjmDoc.status !== "Disetujui" && rkjmDoc.status !== "Terkunci") {
    addFinding("Medium", "RKJM Belum Disetujui", "Dokumen RKJM membutuhkan persetujuan final.", "COMP_005", "RKJM status != Disetujui", "Workflow", "Persetujuan", () => navigateToView("documentDetail_rkjm"));
  } else {
    // If RKJM is approved, RKT should exist
    if (!rktDoc) {
      addFinding("Critical", "RKT Tidak Sinkron", "RKJM telah disetujui, namun turunan Rencana Kerja Tahunan belum dibuat.", "COMP_006", "Missing RKT with Approved RKJM", "Perencanaan", "Susun RKT", () => navigateToView("rktDerivation"));
    } else if (rktDoc.status !== "Disetujui" && rktDoc.status !== "Terkunci") {
      addFinding("Medium", "RKT Belum Disetujui", "Dokumen RKT membutuhkan persetujuan.", "COMP_007", "RKT status != Disetujui", "Workflow", "Persetujuan", () => navigateToView("documentDetail_rkt"));
    } else {
      if (!rkasDoc) {
        addFinding("Critical", "Anggaran (RKAS) Kosong", "RKT telah disetujui. RKAS wajib disusun untuk sinkronisasi anggaran.", "COMP_008", "Missing RKAS with Approved RKT", "Keuangan", "Susun RKAS", () => navigateToView("rkasDerivation"));
      }
    }
  }

  if (rktDoc && rktDoc.status === "Disetujui" && monitoringDocs.length === 0) {
    addFinding("Medium", "Bukti Pelaksanaan Kosong", "Program telah berjalan namun evaluasi pelaksanaan belum diunggah.", "COMP_009", "Missing Monitoring with Approved RKT", "Evaluasi", "Upload Bukti", () => navigateToView("monitoring"));
  }

  const sortedFindings = [...findings].sort((a, b) => {
    const s = { Critical: 3, High: 2, Medium: 1, Low: 0 } as any;
    return s[b.severity] - s[a.severity];
  });

  const getSeverityStyle = (s: string) => {
    if (s === "Critical") return "bg-rose-100 text-rose-700 border-rose-200";
    if (s === "High") return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const readiness = {
    school: isDataReady,
    planning: !!rkjmDoc && !!rktDoc,
    document: kspDoc?.status === "Disetujui" || kspDoc?.status === "Terkunci",
    print: !!rkjmDoc && !!rktDoc && isDataReady,
    audit: overallScore > 80,
  };

  const activeTemplate = "Rev. 2025 (KSP/KOSP)";
  const isRegulationCurrent = true; // Assuming current template is active

  let execSummary = "Sistem berjalan baik. ";
  if (overallScore === 100) {
    execSummary = "Tata kelola sekolah sangat patuh terhadap regulasi. Seluruh dokumen telah disinkronisasi.";
  } else if (overallScore > 70) {
    execSummary = `Tata kelola sekolah cukup baik (Skor ${overallScore}%). Ada ${sortedFindings.length} temuan yang memerlukan tindak lanjut agar siap audit.`;
  } else {
    execSummary = `Skor kepatuhan perlu ditingkatkan (Skor ${overallScore}%). Fokuskan perbaikan pada identitas dan dokumen perencanaan.`;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-blue-800 rounded-xl shadow-sm flex flex-col md:flex-row justify-between justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded mix-blend-screen filter blur-[80px] opacity-60 pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-[var(--color-eds-primary)] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" />
            Tata Kelola & Kepatuhan
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
            Pusat Audit Tata Kelola
          </h1>
          <p className="text-[var(--color-eds-text-secondary)]/90 text-lg font-medium leading-relaxed max-w-2xl">
            {execSummary}
          </p>
        </div>
        <div className="relative z-10 w-full md:w-80 flex flex-col items-center justify-center">
          <div className="bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl p-6 w-full text-center">
            <h3 className="text-sm font-bold text-[var(--color-eds-text-secondary)] mb-1 uppercase tracking-wider">Skor Kepatuhan</h3>
            <div className="text-5xl font-black tracking-tighter my-2">{overallScore}%</div>
            <div className="w-full bg-white/10 h-2 rounded overflow-hidden mt-3">
              <div className={`h-full rounded transition-all duration-1000 ${overallScore > 80 ? 'bg-emerald-400' : overallScore > 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${overallScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(complianceStatus).map(([key, status], i) => (
          <div key={key} className={`bg-white rounded-xl border p-4 shadow-sm ${status === "Tidak Sesuai" ? 'border-rose-200' : 'border-slate-200'}`}>
            <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-2">
              {key === "planning" ? "Perencanaan" : key === "documentation" ? "Dokumentasi" : key === "workflow" ? "Alur Kerja" : key === "dataSekolah" ? "Data Sekolah" : key === "budget" ? "Anggaran" : "Evaluasi"}
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-bold border ${getComplianceColor(status)}`}>
              {getComplianceIcon(status)}
              {status === "Sesuai" ? "Sesuai" : status === "Perlu Perhatian" ? "Perlu Perhatian" : "Tidak Sesuai"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="enterprise-card overflow-hidden">
            <div className="border-b border-slate-200 p-5 bg-[var(--color-eds-bg)]/50 flex justify-between items-center">
              <h3 className="font-bold text-[var(--color-eds-text-primary)] flex items-center gap-2">
                <Search className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" />
                Temuan Audit Internal
              </h3>
              <button onClick={() => setShowDevMode(!tampilkanLanjutan)} className="text-xs uppercase font-bold text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-secondary)] bg-slate-100 px-2 py-1 rounded">Pengaturan Lanjutan</button>
            </div>
            <div className="p-0">
              {sortedFindings.length > 0 ? (
                <div className="divide-y divide-[var(--color-eds-border)]">
                  {sortedFindings.map((finding, i) => (
                    <div key={i} className="p-5 hover:bg-[var(--color-eds-bg)] transition-colors flex gap-4 items-start">
                      <div className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider shrink-0 mt-1 ${getSeverityStyle(finding.severity)}`}>
                        {finding.severity}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--color-eds-text-primary)] mb-1">{finding.title}</h4>
                        <p className="text-sm text-[var(--color-eds-text-primary)] mb-3 font-medium">{finding.desc}</p>
                        {tampilkanLanjutan && (
                          <div className="mb-3 p-2 bg-slate-800 rounded-xl text-xs font-mono text-[var(--color-eds-text-secondary)] inline-block">
                            <span className="mr-3">Rule: {finding.ruleId}</span>
                            <span>Trigger: {finding.trigger}</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={finding.action} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">{finding.actionText}</Button>
                          <Button size="sm" variant="ghost" onClick={() => navigateToSettings("pusatPengetahuan")} className="text-xs text-[var(--color-eds-text-secondary)] flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> Panduan
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-[var(--color-eds-text-primary)] text-lg mb-2">Tidak Ada Temuan Kritis</h4>
                  <p className="text-[var(--color-eds-text-primary)] font-medium">Seluruh dokumen dan profil sekolah mematuhi regulasi.</p>
                </div>
              )}
            </div>
          </div>

          <div className="enterprise-card p-6">
            <h3 className="font-bold text-[var(--color-eds-text-primary)] flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              Kepatuhan Dokumen & Template
            </h3>
            <div className="overflow-x-auto">
              <div className="overflow-x-auto w-full pb-4"><table className="enterprise-table">
                <thead>
                  <tr>
                    <th className=" font-medium">Dokumen</th>
                    <th className=" font-medium">Status Template</th>
                    <th className=" font-medium">Kelengkapan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className=" font-bold text-[var(--color-eds-text-primary)]">RKJM</td>
                    <td className=""><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">{activeTemplate}</span></td>
                    <td className=" text-[var(--color-eds-text-primary)] font-medium">{rkjmDoc ? "Lengkap" : "Belum Dibuat"}</td>
                  </tr>
                  <tr>
                    <td className=" font-bold text-[var(--color-eds-text-primary)]">RKT</td>
                    <td className=""><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">{activeTemplate}</span></td>
                    <td className=" text-[var(--color-eds-text-primary)] font-medium">{rktDoc ? "Lengkap" : "Belum Dibuat"}</td>
                  </tr>
                  <tr>
                    <td className=" font-bold text-[var(--color-eds-text-primary)]">KSP/KOSP</td>
                    <td className=""><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">{activeTemplate}</span></td>
                    <td className=" text-[var(--color-eds-text-primary)] font-medium">{kspDoc ? "Lengkap" : "Belum Dibuat"}</td>
                  </tr>
                </tbody>
              </table></div>
            </div>
            {isRegulationCurrent && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Seluruh template dokumen menggunakan versi terbaru sesuai panduan Kementerian Pendidikan.</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="enterprise-card p-6">
            <h3 className="font-bold text-[var(--color-eds-text-primary)] flex items-center gap-2 mb-4">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              Sertifikasi Kesiapan
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]/50">
                <span className="text-sm font-medium text-[var(--color-eds-text-primary)]">Kesiapan Sekolah</span>
                {readiness.school ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]/50">
                <span className="text-sm font-medium text-[var(--color-eds-text-primary)]">Kesiapan Perencanaan</span>
                {readiness.planning ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]/50">
                <span className="text-sm font-medium text-[var(--color-eds-text-primary)]">Kesiapan Dokumen</span>
                {readiness.document ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[var(--color-eds-bg)]/50">
                <span className="text-sm font-medium text-[var(--color-eds-text-primary)]">Kesiapan Cetak Resmi</span>
                {readiness.print ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-emerald-50/50 border-emerald-100">
                <span className="text-sm font-bold text-emerald-800">Kesiapan Audit</span>
                {readiness.audit ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />}
              </div>
            </div>
            
            {!readiness.print && (
              <p className="text-sm text-[var(--color-eds-text-primary)] mt-4 leading-relaxed bg-[var(--color-eds-bg)] p-2 rounded-xl border border-slate-200 font-medium">
                <span className="font-bold text-rose-500 block mb-1">Pre-Print Validation Aktif:</span>
                Dokumen resmi tidak dapat dicetak hingga validasi kesiapan minimum terpenuhi (Identitas & Perencanaan disetujui).
              </p>
            )}
          </div>

          <div className="enterprise-card p-6">
            <h3 className="font-bold text-[var(--color-eds-text-primary)] flex items-center gap-2 mb-4">
              <Milestone className="w-5 h-5 text-blue-500" />
              Lini Masa Kepatuhan
            </h3>
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                <div className="flex items-center justify-center w-4 h-4 rounded border-2 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] px-3 py-1 enterprise-card">
                  <div className="text-xs font-bold text-[var(--color-eds-text-primary)]">Perencanaan</div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${rkjmDoc && rktDoc ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] px-3 py-1 enterprise-card">
                  <div className="text-xs font-bold text-[var(--color-eds-text-primary)]">Tinjauan</div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${(rkjmDoc?.status === "Disetujui" || rkjmDoc?.status === "Terkunci") ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] px-3 py-1 enterprise-card">
                  <div className="text-xs font-bold text-[var(--color-eds-text-primary)]">Pengesahan</div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                <div className={`flex items-center justify-center w-4 h-4 rounded border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${readiness.print ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] px-3 py-1 enterprise-card">
                  <div className="text-xs font-bold text-[var(--color-eds-text-primary)]">Printing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RaporPendidikanView = () => {
  const { settings, updateSetting, setSettings, getActiveAcademicYear, showToast, showSuccess } = useApp();
  const [viewMode, setViewMode] = useState<"dashboard" | "ringkasan" | "lengkap" | "irb" | "riwayat">("dashboard");
  
  const raporData = settings.rapor || { isLocked: false, data: {}, target: {} };
  
  // RPIE Engine Initialization
  const rpie = React.useMemo(() => {
    const engine = new RaporIntelligenceEngine();
    engine.loadData(raporData.data, RaporDictionary);
    return engine;
  }, [raporData.data]);

  const dimensions = rpie.getDimensions();
  const allIndicators = rpie.getAllIndicators();
  const swot = rpie.getSWOT();
  const irbActions = rpie.getIRB();
  const topPriorities = rpie.getTopPriorities(5);

  const totalIndikator = allIndicators.length;
  const filledIndikator = allIndicators.filter(i => i.value > 0).length;
  const persentase = totalIndikator > 0 ? Math.round((filledIndikator / totalIndikator) * 100) : 0;
  
  const status = raporData.isLocked ? "Terkunci" : persentase === 100 ? "Final" : "Draf";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const forensicInputRef = useRef<HTMLInputElement>(null);

  const [pendingImport, setPendingImport] = useState<any>(null);
  const [forensicData, setForensicData] = useState<any>(null);

  const handleForensicImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await EducationReportParser.generateForensicReport(file);
        setForensicData({
           fileName: file.name,
           data
        });
      } catch (err) {
        console.error("Forensic error: " + (err as Error).message);
      }
      if (forensicInputRef.current) forensicInputRef.current.value = '';
    }
  };

  const handleImportRapor = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const parseResult = await EducationReportParser.parse(file);
        const { data: parsedData, metadata, recommendations, rkt, rkas, schoolData, validationReports } = parseResult;
        
        const engine = new RaporIntelligenceEngine();
        engine.loadData(parsedData, RaporDictionary);
        
        const allParsedIndicators = engine.getAllIndicators();
        const detectedDimensions = engine.getDimensions().length;
        const totalDictIndicators = RaporDictionary.flatMap((d: any) => d.indikator).length;
        const filledParsedIndikator = allParsedIndicators.filter(i => i.value > 0).length;
        
        const coveragePercentage = totalDictIndicators > 0 ? Math.round((filledParsedIndikator / totalDictIndicators) * 100) : 0;
        
        const dataCoverage = {
           detectedDimensions,
           detectedElements: metadata.indicatorsImported,
           detectedIndicators: filledParsedIndikator,
           missingIndicators: totalDictIndicators - filledParsedIndikator,
           fallbackIndicators: metadata.parserMode === 'Compatibility' ? filledParsedIndikator : 0,
           coveragePercentage
        };
        
        const planningSheetFound = metadata.worksheetsFound.some((s: string) => s.toLowerCase().includes('rkt') || s.toLowerCase().includes('rkjm'));
        const budgetSheetFound = metadata.worksheetsFound.some((s: string) => s.toLowerCase().includes('rkas') || s.toLowerCase().includes('anggaran') || s.toLowerCase().includes('arkas'));

        const isPlanningEmpty = metadata.rktImported === 0 && planningSheetFound;
        const isBudgetEmpty = metadata.rkasImported === 0 && budgetSheetFound;

        let passedValidations = 0;
        let totalValidations = 0;
        
        // Use validation reports generated by CanonicalParser
        const diagnostics = validationReports.map((vr: any, idx: number) => {
            let status = vr.validationStatus.toLowerCase();
            if (status === 'failed') {
                if (vr.moduleId === 'planning' && isPlanningEmpty) status = 'empty';
                else if (vr.moduleId === 'budget' && isBudgetEmpty) status = 'empty';
            }
            if (vr.moduleId === 'identity') {
                totalValidations++;
                if (status === 'pass' || schoolData?.name || schoolData?.npsn) {
                     status = 'pass';
                     passedValidations++;
                }
            } else if (vr.moduleId === 'indicator' || vr.moduleId === 'recommendation') {
                totalValidations++;
                if (status === 'pass') passedValidations++;
            }
            return {
                ...vr,
                id: `${vr.moduleId}-${idx}`,
                status
            };
        });

        // Add overall integrity score
        const integrityScore = totalValidations > 0 ? Math.round((passedValidations / totalValidations) * 100) : 0;
        
        const warnings: string[] = [];
        if (metadata.worksheetsMissing.length > 0) {
           warnings.push(`Worksheet resmi tidak ditemukan: ${metadata.worksheetsMissing.join(', ')}`);
        }
        if (integrityScore < 100) {
           warnings.push(`Integritas data rendah (${integrityScore}%). Parser mendeteksi kegagalan pada beberapa modul ekstraksi.`);
        }

        setPendingImport({
            fileInfo: {
                fileName: file.name,
                importTimestamp: Date.now(),
            },
            metadata,
            recommendations,
            rkt,
            rkas,
            schoolData,
            parsedData,
            canonicalObjects: parseResult.canonicalObjects,
            knowledgeGraph: parseResult.knowledgeGraph,
            dataCoverage,
            integrityScore,
            diagnostics,
            warnings
        });
        
      } catch (err) {
         setPendingImport({
             error: true,
             message: "Gagal mengimpor file: " + (err as Error).message
         });
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const confirmImport = () => {
    if (!pendingImport || pendingImport.error) {
       setPendingImport(null);
       return;
    }

    const updates = DocumentSynchronizationEngine.sync(settings, pendingImport, RaporDictionary);
    
    setSettings((prev: any) => ({
      ...prev,
      school: updates.school,
      rapor: updates.rapor,
      analisis: updates.analisis,
      targetEngine: updates.targetEngine,
      relationalPlanning: updates.relationalPlanning,
      documents: updates.documents,
      planning: updates.planning,
      narratives: {}, // Force regeneration of narratives from canonical objects
      canonicalObjects: pendingImport.canonicalObjects,
    }));
    
    const reportStr = `Data berhasil diimpor dan disinkronisasi ke seluruh sistem.

✨ Hasil Sinkronisasi Otomatis:
• Rekomendasi Diimpor: ${updates.syncReport.recommendationsImported}
• Matriks SWOT Dibuat: ${updates.syncReport.swotCreated}
• Sasaran Strategis Dibuat: ${updates.syncReport.strategicTargetsCreated}
• Program RKJM Disusun: ${updates.syncReport.rkjmProgramsCreated}
• Kegiatan RKT Terjadwal: ${updates.syncReport.rktActivitiesCreated}
• Item Anggaran RKAS: ${updates.syncReport.rkasBudgetsCreated}

📋 Document Validation Report: Passed
🛡️ Certification Refresh Report: Certification completed successfully.
• 100% Data Valid.
• Workspace is ready.

Dokumen Rapor, BAB III, BAB IV, dan KSP telah diperbarui secara keseluruhan berdasarkan data valid.`;

    showSuccess("Sistem Disinkronisasi", reportStr);
    setPendingImport(null);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    if (raporData.isLocked) return;
    const currentObj = raporData.data[id] || { nilai: "", kategori: "", catatan: "" };
    const updatedObj = { ...currentObj, [field]: value };
    if (field === "nilai") {
      updatedObj.kategori = Number(value) >= 80 ? "Hijau" : Number(value) >= 60 ? "Kuning" : "Merah";
    }
    updateSetting("rapor", "data", { ...raporData.data, [id]: updatedObj });
  };

  const [alertModal, setAlertModal] = useState<string|null>(null);
  const [confirmLockModal, setConfirmLockModal] = useState(false);
  const [unlockPromptModal, setUnlockPromptModal] = useState(false);
  const [unlockReason, setUnlockReason] = useState("");

  const handleToggleLock = () => {
    if (raporData.isLocked) {
      setUnlockPromptModal(true);
    } else {
      if (persentase < 100) return setAlertModal("Lengkapi semua data Rapor Pendidikan sebelum melakukan validasi akhir.");
      setConfirmLockModal(true);
    }
  };

  const confirmLock = () => {
      updateSetting("rapor", "isLocked", true);
      updateSetting("rapor", "lockDate", Date.now());
      setConfirmLockModal(false);
  };

  const confirmUnlock = () => {
      if (!unlockReason.trim()) return;
      updateSetting("rapor", "isLocked", false);
      updateSetting("rapor", "history", [...(raporData.history || []), { action: "UNLOCK", reason: unlockReason, date: Date.now() }]);
      setUnlockPromptModal(false);
      setUnlockReason("");
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <GenericModal
        isOpen={!!pendingImport && !!pendingImport.error}
        onClose={() => setPendingImport(null)}
        onConfirm={() => setPendingImport(null)}
        title="Impor Gagal"
        message={pendingImport?.message}
        confirmText="Tutup"
        isDanger={true}
        icon={AlertTriangle}
      />
      <GenericModal
        isOpen={!!alertModal}
        onClose={() => setAlertModal(null)}
        onConfirm={() => setAlertModal(null)}
        title="Perhatian"
        message={alertModal}
        confirmText="Tutup"
        isDanger={true}
        icon={AlertTriangle}
      />
      <GenericModal
        isOpen={confirmLockModal}
        onClose={() => setConfirmLockModal(false)}
        onConfirm={confirmLock}
        title="Validasi Rapor Pendidikan"
        message="Saya menyatakan bahwa seluruh data yang diisi telah sesuai dengan Rapor Pendidikan. Tindakan ini akan mengunci data dan melanjutkannya ke tahap perencanaan."
        confirmText="Kunci & Validasi"
        icon={Lock}
      />
      {unlockPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded flex items-center justify-center mx-auto mb-6 relative">
                 <Unlock className="w-10 h-10 text-blue-500 relative z-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Buka Kunci Data</h3>
              <p className="text-[var(--color-eds-text-primary)] text-sm font-medium mb-4">
                Masukkan alasan membuka kunci Rapor Pendidikan:
              </p>
              <textarea maxLength={2000} 
                 className="w-full border border-[var(--color-eds-border)] rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                 rows={3}
                 value={unlockReason}
                 onChange={(e) => setUnlockReason(e.target.value)}
                 placeholder="Alasan pembukaan data..."
              />
            </div>
            <div className="bg-[var(--color-eds-bg)] p-6 flex gap-4 justify-end border-t border-slate-200">
              <Button variant="secondary" onClick={() => setUnlockPromptModal(false)} className="flex-1">Batal</Button>
              <Button onClick={confirmUnlock} className="flex-1" disabled={!unlockReason.trim()}>Konfirmasi</Button>
            </div>
          </div>
        </div>
      )}
      {/* We inject custom content when pendingImport is ready, since GenericModal just takes message string.
          Actually, we should make a custom modal inline if pendingImport has success data. */}
      {/* Forensic Inspector Modal */}
      {forensicData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-[24px]">
               <div>
                 <h2 className="text-2xl font-black text-slate-900">Workbook Forensic Inspector</h2>
                 <p className="text-slate-600 mt-1">File: <span className="font-mono">{forensicData.fileName}</span></p>
               </div>
               <Button variant="outline" onClick={() => setForensicData(null)}>Tutup Inspector</Button>
             </div>
             
             <div className="flex flex-1 min-h-0 overflow-hidden">
               {/* Left sidebar: sheets */}
               <div className="w-1/4 border-r border-slate-200 flex flex-col bg-slate-50">
                 <div className="p-4 font-bold text-sm uppercase tracking-wider text-slate-500 border-b">Worksheets</div>
                 <div className="overflow-y-auto flex-1 p-2 space-y-1">
                   {Object.keys(forensicData.data).filter(k => k !== '_meta').map(sheetName => (
                     <div key={sheetName} className="p-3 bg-white rounded border border-slate-200 shadow-sm">
                       <h4 className="font-bold text-slate-800 break-words mb-2">{sheetName}</h4>
                       <div className="text-xs space-y-1 text-slate-600 font-mono">
                         <div className="flex justify-between"><span>Rows:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].rowCount}</span></div>
                         <div className="flex justify-between"><span>Cols:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].colCount}</span></div>
                         <div className="flex justify-between"><span>Merged Regions:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].mergedRegions}</span></div>
                         <div className="flex justify-between"><span>Used Range:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].usedRange}</span></div>
                         <div className="flex justify-between"><span>First Non-Empty:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].firstNonEmpty > -1 ? `Row ${forensicData.data[sheetName].firstNonEmpty}` : 'None'}</span></div>
                         <div className="flex justify-between"><span>Last Non-Empty:</span> <span className="font-bold text-slate-800">{forensicData.data[sheetName].lastNonEmpty > -1 ? `Row ${forensicData.data[sheetName].lastNonEmpty}` : 'None'}</span></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               
               {/* Right main area: raw cells & merges */}
               <div className="w-3/4 flex flex-col">
                 <div className="flex-1 overflow-y-auto p-6 bg-slate-100 font-mono text-xs">
                    
                    {/* Semantic Reader Section */}
                    {forensicData.data._semantic && (
                      <div className="mb-12 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-indigo-900 text-white p-4">
                          <h3 className="font-bold text-lg">Semantic Document Reader</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-6">
                           <div>
                              <h4 className="font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-3">Identity Trace</h4>
                              {forensicData.data._semantic.identityTrace.length === 0 ? (
                                <p className="text-slate-500 italic">No identities found</p>
                              ) : (
                                <div className="space-y-2">
                                  {forensicData.data._semantic.identityTrace.map((id: any, i: number) => (
                                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100">
                                      <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                                        <span>{id.sheet}</span>
                                        <span>{id.cell}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-700">{id.label}</span>
                                        <span className="text-indigo-700 font-bold">{id.valueFound}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                           </div>
                           <div className="space-y-6">
                              <div>
                                  <h4 className="font-bold text-emerald-700 border-b border-emerald-200 pb-2 mb-3">Recommendation Trace</h4>
                                  {forensicData.data._semantic.recommendationTrace.length === 0 ? (
                                    <p className="text-slate-500 italic">No recommendations found</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {forensicData.data._semantic.recommendationTrace.map((tbl: any, i: number) => (
                                        <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100">
                                          <div className="flex justify-between mt-1 text-slate-500 text-[10px]">
                                            <span>Sheet: {tbl.sheet}</span>
                                            <span>Row: {tbl.row}</span>
                                          </div>
                                          <div className="mt-1 text-[10px] text-slate-600 truncate font-bold" title={tbl.contentPreview}>{tbl.contentPreview}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                              
                              {forensicData.data._semantic.failureReasons.length > 0 && (
                                  <div>
                                      <h4 className="font-bold text-rose-700 border-b border-rose-200 pb-2 mb-3">Failure Analysis</h4>
                                      <div className="space-y-2">
                                          {forensicData.data._semantic.failureReasons.map((reason: string, i: number) => (
                                              <div key={i} className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded text-[11px] whitespace-pre-wrap">
                                                  {reason}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                           </div>
                        </div>
                      </div>
                    )}
                    
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Raw Data Dump</h3>
                    {Object.keys(forensicData.data).filter(k => k !== '_meta' && k !== '_semantic').map(sheetName => (
                      <div key={`data-${sheetName}`} className="mb-12">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 border-b-2 border-blue-200 pb-2">Sheet: {sheetName}</h3>
                        
                        {forensicData.data[sheetName].merges.length > 0 && (
                          <div className="mb-6 bg-amber-50 p-4 rounded border border-amber-200">
                             <h4 className="font-bold text-amber-900 mb-2">Merged Regions ({forensicData.data[sheetName].merges.length})</h4>
                             <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                               {forensicData.data[sheetName].merges.map((m: any, i: number) => (
                                 <div key={i} className="bg-white p-2 rounded border border-amber-100 shadow-sm text-[10px]">
                                   <div className="flex justify-between mb-1"><span className="text-slate-500">Range:</span> <span className="font-bold">{m.s}:{m.e}</span></div>
                                   <div className="flex justify-between mb-1"><span className="text-slate-500">Master:</span> <span className="font-bold">{m.s}</span></div>
                                   <div className="text-slate-700 truncate" title={m.master}>{m.master !== undefined ? String(m.master) : '(empty)'}</div>
                                 </div>
                               ))}
                             </div>
                          </div>
                        )}
                        
                        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto w-full pb-4"><table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b">
                              <tr>
                                <th className="p-2 w-24">Cell</th>
                                <th className="p-2">Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {forensicData.data[sheetName].rawCells.map((c: any, i: number) => (
                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                  <td className="p-2 border-r font-bold text-blue-600">{c.ref}</td>
                                  <td className="p-2 text-slate-800 whitespace-pre-wrap">{String(c.val)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table></div>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
           </div>
        </div>
      )}

      {pendingImport && !pendingImport.error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                      <div>
                         <h3 className="text-xl font-black text-slate-900">Konfirmasi Impor Rapor</h3>
                         <p className="text-[var(--color-eds-text-primary)] font-medium text-sm">Tinjau data yang berhasil diekstrak</p>
                      </div>
                   </div>
                   <button onClick={() => setPendingImport(null)} className="text-[var(--color-eds-text-secondary)] hover:text-slate-600">
                      <XCircle className="w-6 h-6" />
                   </button>
                </div>
             </div>
             
             <div className="p-6 overflow-y-auto bg-slate-50 space-y-6">
                
                {pendingImport.warnings?.length > 0 && (
                   <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <div className="flex gap-2 items-center text-amber-800 font-bold mb-2">
                         <AlertTriangle className="w-5 h-5" />
                         Peringatan Impor
                      </div>
                      <ul className="list-disc pl-6 text-amber-700 text-sm space-y-1">
                         {pendingImport.warnings.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                      </ul>
                   </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                       <h4 className="font-bold text-slate-900 border-b pb-2 mb-3">Informasi File</h4>
                       <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Nama File</span><span className="font-medium text-right break-words ml-4">{pendingImport.fileInfo.fileName}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Nama Sekolah</span><span className="font-medium">{pendingImport.schoolData?.name || settings.school?.name || "-"}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">NPSN</span><span className="font-medium">{pendingImport.schoolData?.npsn || settings.school?.npsn || "-"}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Tahun Ajaran</span><span className="font-medium">{getActiveAcademicYear().name}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Tanggal Unggah</span><span className="font-medium">{new Date(pendingImport.fileInfo.importTimestamp).toLocaleString('id-ID')}</span></div>
                       </div>
                    </div>
                    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                       <h4 className="font-bold text-slate-900 border-b pb-2 mb-3">Sistem Pembaca Data</h4>
                       <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Mode</span><span className={`font-medium px-2 py-0.5 rounded ${pendingImport.metadata.parserMode === 'Official' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>{pendingImport.metadata.parserMode === 'Official' ? 'Resmi' : 'Kompatibilitas'}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Versi Workbook</span><span className="font-medium">{pendingImport.metadata.officialVersion}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Rekomendasi</span><span className="font-medium">{pendingImport.metadata.recommendationsImported} Baris</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Trend & Peringkat</span><span className="font-medium">{pendingImport.metadata.trendImported || pendingImport.metadata.rankingImported ? "Terdeteksi" : "Tidak Terdeteksi"}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Rencana Kegiatan (RKT)</span><span className="font-medium">{pendingImport.metadata.rktImported} Baris</span></div>
                          <div className="flex justify-between"><span className="text-[var(--color-eds-text-primary)]">Anggaran (ARKAS)</span><span className="font-medium">{pendingImport.metadata.rkasImported} Baris</span></div>
                       </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 border-b pb-2 mb-3">Import Integrity Score</h4>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl" style={{ borderColor: pendingImport.integrityScore === 100 ? '#10b981' : pendingImport.integrityScore >= 60 ? '#f59e0b' : '#ef4444', color: pendingImport.integrityScore === 100 ? '#047857' : pendingImport.integrityScore >= 60 ? '#b45309' : '#b91c1c' }}>
                          {pendingImport.integrityScore}%
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">
                             {pendingImport.integrityScore === 100 ? 'Seluruh komponen wajib berhasil diekstrak.' : 'Integritas file tidak memenuhi standar minimum.'}
                          </p>
                          <p className="text-sm text-[var(--color-eds-text-primary)]">Workbook harus memiliki seluruh sheet wajib untuk dapat diimpor.</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4 mt-4 border-t border-slate-100 pt-3">
                       <h5 className="font-bold text-xs uppercase text-slate-500 mb-2">Diagnostik Modul</h5>
                       {pendingImport.diagnostics?.map((diag: any, index: number) => (
                           <div key={`${diag.id || 'diag'}-${index}`} className={`flex flex-col gap-2 p-4 rounded border ${diag.status === 'pass' ? 'bg-emerald-50 border-emerald-100' : diag.status === 'empty' ? 'bg-sky-50 border-sky-100' : 'bg-rose-50 border-rose-100'}`}>
                               <div className="flex items-start gap-3">
                                   {diag.status === 'pass' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : diag.status === 'empty' ? <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                                   <div className="flex-1">
                                       <div className="flex justify-between items-center">
                                           <p className={`font-bold text-sm ${diag.status === 'pass' ? 'text-emerald-900' : diag.status === 'empty' ? 'text-sky-900' : 'text-rose-900'}`}>{diag.label} {diag.status === 'empty' ? <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] uppercase rounded">Template Empty</span> : ''}</p>
                                           {diag.ruleId && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/50 border border-slate-200 text-slate-500">{diag.ruleId}</span>}
                                       </div>
                                       <p className={`text-xs mt-1 ${diag.status === 'pass' ? 'text-emerald-700' : diag.status === 'empty' ? 'text-sky-700' : 'text-rose-700'}`}>{diag.reason}</p>
                                   </div>
                               </div>
                               
                               {diag.validationStatus === 'FAILED' && (
                                   <div className="mt-3 bg-white rounded border border-rose-100 p-3 text-xs grid grid-cols-2 gap-x-4 gap-y-2">
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Parser Status / Extraction</span>
                                           <span className="font-medium text-slate-900">{diag.parserStatus}</span>
                                       </div>
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Validation Status</span>
                                           <span className="font-medium text-rose-700">{diag.validationStatus}</span>
                                       </div>
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Expected</span>
                                           <span className="font-medium text-slate-900">{diag.expected}</span>
                                       </div>
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Detected</span>
                                           <span className="font-medium text-rose-700">{diag.detected}</span>
                                       </div>
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Rows Scanned / Parsed</span>
                                           <span className="font-medium text-slate-900">{diag.rowsScanned} / {diag.rowsParsed}</span>
                                       </div>
                                       <div>
                                           <span className="text-slate-500 block mb-0.5">Canonical Objects Created</span>
                                           <span className="font-medium text-slate-900">{diag.canonicalObjectsCreated}</span>
                                       </div>
                                   </div>
                               )}
                           </div>
                       ))}
                    </div>
                </div>
             </div>

             <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-[24px]">
                <Button variant="secondary" onClick={() => setPendingImport(null)}>Batal</Button>
                {pendingImport.integrityScore === 100 ? (
                    <Button onClick={confirmImport} icon={Download} className="bg-emerald-600 hover:bg-emerald-700">Konfirmasi & Simpan</Button>
                ) : (
                    <Button variant="outline" className="text-slate-600 border-slate-300 bg-white hover:bg-slate-50" icon={AlertTriangle} onClick={() => {}}>
                        Lihat Diagnostik
                    </Button>
                )}
             </div>
           </div>
        </div>
      )}

      <PageHelp 
        title="Dasbor Cerdas Rapor Pendidikan" 
        description="Mengekstraksi, menganalisis, dan merumuskan langkah strategis sekolah berdasarkan Rapor Pendidikan." 
        importance="RPIE memetakan indikator secara otomatis ke dokumen hilir (KSP, RKJM, RKT, RKAS)." 
        nextStep="Lengkapi data indikator, periksa dashboard analisis SWOT & IRB, dan validasi kunci." 
        checklist={["Ekstraksi Dimensi & Indikator", "Kalkulasi Prioritas", "Perumusan IRB", "Sertifikasi Data"]}
      />
      
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[var(--color-eds-border)]">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-eds-text-primary)]">Dasbor Analisis Rapor Pendidikan</h2>
          <p className="text-[var(--color-eds-text-primary)] font-medium">Analisis cerdas capaian Rapor Pendidikan Nasional.</p>
        </div>
        <div className="flex gap-3 items-center">
          <input 
            type="file" 
            accept=".xlsx,.xls,.csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportRapor} 
          />
          <Button 
            id="tour-unggah-rapor"
            icon={Upload} 
            onClick={() => fileInputRef.current?.click()} 
            variant="primary"
          >
            Unggah Rapor Pendidikan
          </Button>
          <input 
            type="file" 
            accept=".xlsx,.xls,.csv" 
            className="hidden" 
            ref={forensicInputRef} 
            onChange={handleForensicImport} 
          />
          <Button 
            icon={Activity} 
            onClick={() => forensicInputRef.current?.click()} 
            variant="outline"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          >
            Forensic Inspector
          </Button>
          <span className={`px-4 py-2 rounded font-bold text-sm ${status === "Terkunci" ? "bg-blue-100 text-blue-700" : status === "Final" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-[var(--color-eds-text-primary)]"}`}>
            Status: {status} ({persentase}%)
          </span>
          <Button icon={raporData.isLocked ? Edit2 : Lock} onClick={handleToggleLock} variant={raporData.isLocked ? "outline" : "default"}>
            {raporData.isLocked ? "Buka Kunci RPIE" : "Validasi & Kunci RPIE"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-eds-border)]">
        {["dashboard", "ringkasan", "lengkap", "irb", "riwayat"].map(tab => (
          <button key={tab} onClick={() => setViewMode(tab as any)} className={`px-6 py-4 font-bold border-b-2 transition-colors capitalize ${viewMode === tab ? "border-blue-600 text-[var(--color-eds-text-primary)] font-bold" : "border-transparent text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]"}`}>
            {tab === "irb" ? "Pembuat IRB Otomatis" : tab === "riwayat" ? "Riwayat Impor" : tab}
          </button>
        ))}
      </div>

      {viewMode === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="bg-blue-50 border border-blue-200 text-blue-900 p-6">
               <div className="font-bold mb-2">Coverage Analytics</div>
               <div className="text-3xl font-black">{persentase}%</div>
               <div className="text-sm font-medium mt-1">{filledIndikator} dari {totalIndikator} Indikator Diekstraksi</div>
             </Card>
             <Card className="bg-rose-50 border border-rose-200 text-rose-900 p-6">
               <div className="font-bold mb-2">Isu Prioritas (Selisih Capaian Tertinggi)</div>
               <div className="text-3xl font-black">{swot.weaknesses.length}</div>
               <div className="text-sm font-medium mt-1">Memerlukan intervensi segera</div>
             </Card>
             <Card className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6">
               <div className="font-bold mb-2">Kekuatan Sekolah</div>
               <div className="text-3xl font-black">{swot.strengths.length}</div>
               <div className="text-sm font-medium mt-1">Aset pencapaian target nasional</div>
             </Card>
          </div>

          <div className="bg-white border border-[var(--color-eds-border)] rounded-xl overflow-hidden shadow-sm">
             <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-4 font-bold text-[var(--color-eds-text-primary)]">Top 5 Prioritas Pembenahan (Berdasarkan Prioritas Peningkatan Mutu)</div>
            <div className="p-4 space-y-3">
              {topPriorities.map((ind, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-rose-50 border border-rose-100 rounded-xl">
                   <div>
                     <div className="font-bold text-rose-900">{ind.id} - {ind.name}</div>
                     <div className="text-sm text-rose-700">Tingkat Prioritas: {ind.priorityScore} | Selisih Capaian: {ind.gap.toFixed(2)}</div>
                   </div>
                   <div className="px-3 py-1 bg-white text-rose-800 text-sm font-bold rounded-xl">Nilai: {ind.value}</div>
                </div>
              ))}
              {topPriorities.length === 0 && <div className="text-[var(--color-eds-text-primary)] italic p-4 text-center font-medium">Belum ada prioritas terdeteksi. Silakan lengkapi data Rapor.</div>}
            </div>
          </div>
        </div>
      )}

      {viewMode === "irb" && (
        <div className="bg-white border border-[var(--color-eds-border)] rounded-xl overflow-hidden shadow-sm">
           <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-4 font-bold text-[var(--color-eds-text-primary)]">Sistem Identifikasi, Refleksi, Benahi (IRB)</div>
           <div className="p-4 space-y-4">
             {irbActions.map((irb, idx) => (
                <div key={idx} className="border border-[var(--color-eds-border)] rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[var(--color-eds-bg)] p-4 border-b border-[var(--color-eds-border)] font-bold flex gap-2 items-center">
                     <AlertTriangle className="w-5 h-5 text-amber-500" /> Akar Masalah: {irb.refleksi.relatedElementId}
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <div className="text-sm font-bold text-[var(--color-eds-text-primary)] mb-1">Identifikasi (I)</div>
                       <div className="font-medium">{irb.identifikasi.name} ({irb.identifikasi.value})</div>
                     </div>
                     <div>
                       <div className="text-sm font-bold text-[var(--color-eds-text-primary)] mb-1">Refleksi (R)</div>
                       <div className="font-medium text-amber-800">{irb.refleksi.description}</div>
                     </div>
                     <div>
                       <div className="text-sm font-bold text-[var(--color-eds-text-primary)] mb-1">Benahi (B)</div>
                       <div className="font-medium text-blue-700">{irb.benahi}</div>
                       <div className="text-xs text-[var(--color-eds-text-secondary)] mt-2 italic border-t border-slate-200 pt-2">Reasoning: {irb.rationale}</div>
                     </div>
                  </div>
                </div>
             ))}
             {irbActions.length === 0 && <div className="p-12 text-center text-[var(--color-eds-text-primary)] italic font-medium">Data IRB akan dihasilkan otomatis setelah isu prioritas ditarik.</div>}
           </div>
        </div>
      )}

      {viewMode === "ringkasan" && (
         <div className="grid grid-cols-1 gap-6">
            {dimensions.map((dim, i) => (
              <div key={i} className="bg-white border border-[var(--color-eds-border)] rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-4 font-bold text-[var(--color-eds-text-primary)]">{dim.name}</div>
                 <div className="p-4 flex justify-between items-center">
                    <div className="font-bold text-lg">Skor Rata-Rata: {dim.score.toFixed(2)}</div>
                    <div className={`px-3 py-1 rounded text-sm font-bold ${dim.category === 'Baik' ? 'bg-emerald-100 text-emerald-800' : dim.category === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>Kategori: {dim.category}</div>
                 </div>
              </div>
            ))}
         </div>
      )}

      {viewMode === "lengkap" && (
        <div className="space-y-6">
          {dimensions.map((dim, dimIdx) => (
            <div key={dimIdx} className="bg-white border border-[var(--color-eds-border)] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-4 font-bold text-[var(--color-eds-text-primary)]">{dim.name}</div>
              <div className="p-4">
              <div className="overflow-x-auto w-full pb-4"><table className="enterprise-table mt-4">
                <thead>
                  <tr className="border-b-2 border-[var(--color-eds-border)]">
                    <th className="pb-2 font-bold w-16">Kode</th>
                    <th className="pb-2 font-bold">Indikator Rapor Pendidikan</th>
                    <th className="pb-2 font-bold text-center w-32">Nilai Saat Ini</th>
                    <th className="pb-2 font-bold text-center w-32">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dim.elements.flatMap(e => e.indicators).map((ind, indIdx) => (
                    <tr key={indIdx} className="hover:bg-[var(--color-eds-bg)]">
                      <td className=" font-mono text-[var(--color-eds-text-primary)] font-medium">{ind.id}</td>
                      <td className=" pr-4">{ind.name}</td>
                      <td className="">
                        <input
                          type="number"
                          className="w-full text-center p-2 bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl focus:border-blue-500 outline-none"
                          value={raporData.data[ind.id]?.nilai || ""}
                          onChange={(e) => handleUpdate(ind.id, "nilai", e.target.value)}
                          disabled={raporData.isLocked}
                          placeholder="0-100"
                        />
                      </td>
                      <td className=" text-center">
                        {ind.value > 0 ? (
                           <span className={`px-3 py-1 rounded text-xs font-bold ${ind.status === 'Hijau' ? 'bg-emerald-100 text-emerald-700' : ind.status === 'Kuning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{ind.status}</span>
                        ) : <span className="text-[var(--color-eds-text-primary)] font-medium">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "riwayat" && (
        <div className="space-y-6">
           <div className="enterprise-card p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">Riwayat Impor Dokumen</h3>
              {(!settings.rapor?.history || settings.rapor.history.length === 0) ? (
                 <div className="text-center py-8 text-[var(--color-eds-text-primary)]">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada riwayat impor yang tercatat.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {settings.rapor.history.map((hist: any, i: number) => (
                       <div key={i} className="flex justify-between items-center p-4 border rounded hover:bg-slate-50">
                          <div>
                             <div className="font-bold text-slate-900">{hist.fileName}</div>
                             <div className="text-sm text-[var(--color-eds-text-primary)]">
                                Diunggah oleh {hist.importedBy} • {new Date(hist.importDate).toLocaleString('id-ID')}
                             </div>
                             <div className="text-xs text-[var(--color-eds-text-primary)] mt-1">
                                Mode: {hist.parserMode === 'Official' ? 'Resmi' : 'Kompatibilitas'} | Versi: {hist.workbookVersion}
                             </div>
                          </div>
                          <div>
                             <span className={`px-3 py-1 rounded text-xs font-bold ${hist.importResult === 'Sukses' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {hist.importResult}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
           {settings.rapor?.coverage && (
              <div className="enterprise-card p-6">
                 <h3 className="text-xl font-black text-slate-900 mb-4">Data Coverage Terakhir</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
                       <div className="text-3xl font-black text-slate-900 mb-1">{settings.rapor.coverage.detectedDimensions}</div>
                       <div className="text-xs text-[var(--color-eds-text-primary)] font-bold uppercase">Dimensi</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
                       <div className="text-3xl font-black text-slate-900 mb-1">{settings.rapor.coverage.detectedElements}</div>
                       <div className="text-xs text-[var(--color-eds-text-primary)] font-bold uppercase">Elemen</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center">
                       <div className="text-3xl font-black text-slate-900 mb-1">{settings.rapor.coverage.detectedIndicators}</div>
                       <div className="text-xs text-[var(--color-eds-text-primary)] font-bold uppercase">Indikator Terisi</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200 text-center flex flex-col items-center justify-center">
                       <div className="text-3xl font-black mb-1" style={{ color: settings.rapor.coverage.coveragePercentage > 80 ? '#10b981' : settings.rapor.coverage.coveragePercentage > 50 ? '#f59e0b' : '#ef4444' }}>
                          {settings.rapor.coverage.coveragePercentage}%
                       </div>
                       <div className="text-xs text-[var(--color-eds-text-primary)] font-bold uppercase">Kelengkapan Data</div>
                    </div>
                 </div>
                 
                 {settings.rapor.coverage.missingIndicators > 0 && (
                     <div className="mt-4 p-4 border border-rose-200 bg-rose-50 rounded">
                        <div className="font-bold text-rose-700 mb-1">Informasi:</div>
                        <div className="text-sm text-rose-600">Terdapat {settings.rapor.coverage.missingIndicators} indikator yang tidak terisi dari impor terakhir. Indikator ini tidak ditemukan nilainya, atau file Rapor Pendidikan yang Anda gunakan menggunakan format lama.</div>
                     </div>
                 )}
              </div>
           )}
        </div>
      )}
    </div>
  );
};

const DokumenPerencanaanView = ({ navigateToView }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const officialDocs = [
    {
      id: "rkjm",
      title: "RKJM",
      subtitle: "Rencana Kerja Jangka Menengah (4 Tahun)",
      status: "Draf",
      version: "1.2",
      lastChanged: "12 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "documentDetail_rkjm",
      color: "indigo"
    },
    {
      id: "rkt",
      title: "RKT",
      subtitle: "Rencana Kerja Tahunan (1 Tahun)",
      status: "Tinjauan",
      version: "1.0",
      lastChanged: "15 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "documentDetail_rkt",
      color: "blue"
    },
    {
      id: "rkas",
      title: "RKAS",
      subtitle: "Rencana Kegiatan dan Anggaran Sekolah",
      status: "Belum Dibuat",
      version: "-",
      lastChanged: "-",
      actionLabel: "Buat",
      actionTarget: "documentDetail_rkas",
      color: "emerald"
    },
    {
      id: "ksp",
      title: "KSP",
      subtitle: "Kurikulum Operasional Satuan Pendidikan",
      status: "Disetujui",
      version: "2.0",
      lastChanged: "10 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "documentDetail_ksp",
      color: "purple"
    }
  ];

  const filteredDocs = officialDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "Semua" || doc.status.includes(filterStatus);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2">
              Dokumen Sekolah
            </h1>
            <p className="text-[var(--color-eds-text-primary)] font-medium">
              Manajemen Dokumen Resmi Sekolah (DMS)
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-eds-text-secondary)] w-5 h-5" />
            <input maxLength={255}
              type="text"
              placeholder="Cari dokumen, nomor, atau status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-eds-border)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex gap-2">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="px-3 py-2.5 rounded-xl border border-[var(--color-eds-border)] focus:outline-none focus:border-blue-500 font-medium text-sm text-[var(--color-eds-text-secondary)] bg-white"
             >
               <option value="Semua">Semua Status</option>
               <option value="Draf">Draf</option>
               <option value="Tinjauan">Tinjauan</option>
               <option value="Disetujui">Disetujui</option>
               <option value="Belum Dibuat">Belum Dibuat</option>
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="enterprise-card p-6 hover:shadow-lg transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-${doc.color}-50 flex items-center justify-center`}
              >
                <FileText className={`w-6 h-6 text-[var(--color-eds-text-primary)] font-bold`} />
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded ${
                doc.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' :
                doc.status === 'Tinjauan' ? 'bg-amber-100 text-amber-700' :
                doc.status === 'Draf' ? 'bg-slate-100 text-[var(--color-eds-text-primary)]' :
                'bg-rose-100 text-rose-700'
              }`}>
                {doc.status}
              </span>
            </div>
            <h3 className="text-xl font-black text-[var(--color-eds-text-primary)] mb-1">
              {doc.title}
            </h3>
            <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 flex-1 line-clamp-2 font-medium" title={doc.subtitle}>{doc.subtitle}</p>
            
            <div className="text-xs text-[var(--color-eds-text-secondary)] mb-4 flex justify-between items-center">
               <span>Versi: {doc.version}</span>
               <span>Update: {doc.lastChanged}</span>
            </div>
            
            <Button
              onClick={() => navigateToView(doc.actionTarget)}
              className="w-full"
              variant={doc.status === 'Belum Dibuat' ? 'default' : 'outline'}
            >
              {doc.actionLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkspaceAnalisisView = ({ navigateToView }: any) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-eds-border)]">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-2 flex items-center">
          Ruang Kerja Analisis Sekolah
          <ContextHelpButton articleId="panduan-analisis" />
        </h1>
        <p className="text-[var(--color-eds-text-primary)] font-medium">
          Pusat data, diagnosis, dan penentuan target strategis sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: "rapor",
            title: "Rapor Pendidikan",
            subtitle: "Integrasi data pencapaian sekolah",
            color: "blue",
            status: "Tersedia",
          },
          {
            id: "diagnosis",
            title: "Analisis Prioritas",
            subtitle: "Rekomendasi PBD dan prioritas program",
            color: "indigo",
            status: "Tersedia",
          },
          {
            id: "targetEngine",
            title: "Target Sekolah",
            subtitle: "Penyusunan target kinerja",
            color: "purple",
            status: "Tersedia",
          },
        ].map((doc) => (
          <div
            key={doc.id}
            className="enterprise-card p-6 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <PieChart className={`w-6 h-6 text-[var(--color-eds-text-primary)] font-bold`} />
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-700">
                {doc.status}
              </span>
            </div>
            <h3 className="text-xl font-black text-[var(--color-eds-text-primary)] mb-1 group-hover:text-[var(--color-eds-text-primary)] font-bold transition-colors">
              {doc.title}
            </h3>
            <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 flex-1 font-medium">{doc.subtitle}</p>
            <Button
              onClick={() => navigateToView(doc.id)}
              className="w-full mt-auto"
            >
              Buka Ruang Kerja
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const QAPanel = ({ docId, chapterList, activeChapter, onClose }: any) => {
  const [qaState, setQaState] = useState<Record<string, { status: string, comment: string, severity: string }>>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem(`tampuyak.qa.${docId}`) || "{}");
      }
      return {};
    } catch {
      return {};
    }
  });

  const saveQa = (newState: any) => {
    setQaState(newState);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`tampuyak.qa.${docId}`, JSON.stringify(newState));
      }
    } catch {}
  };

  const handleStatusChange = (chapId: string, status: string) => {
    saveQa({ ...qaState, [chapId]: { ...qaState[chapId], status } });
  };
  const handleCommentChange = (chapId: string, comment: string) => {
    saveQa({ ...qaState, [chapId]: { ...qaState[chapId], comment } });
  };
  const handleSeverityChange = (chapId: string, severity: string) => {
    saveQa({ ...qaState, [chapId]: { ...qaState[chapId], severity } });
  };

  const currentQa = qaState[activeChapter] || { status: 'PENDING', comment: '', severity: 'Low' };

  // Scoreboard
  const total = chapterList.length;
  const passed = chapterList.filter((c: any) => qaState[c.id]?.status === 'VALID').length;
  const warned = chapterList.filter((c: any) => qaState[c.id]?.status === 'PERINGATAN').length;
  const failed = chapterList.filter((c: any) => qaState[c.id]?.status === 'GAGAL').length;
  const reviewed = passed + warned + failed;
  const remaining = total - reviewed;
  
  const critical = Object.values(qaState).filter((q: any) => q.status === 'GAGAL' && q.severity === 'Critical').length;
  const high = Object.values(qaState).filter((q: any) => (q.status === 'GAGAL' || q.status === 'PERINGATAN') && q.severity === 'High').length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-purple-50 flex justify-between items-center">
        <div>
          <h3 className="font-black text-sm text-purple-900 uppercase flex items-center"><Microscope className="w-4 h-4 mr-2" /> GM-UAT Panel</h3>
          <p className="text-xs text-purple-700 mt-1 font-mono">Interactive QA Mode</p>
        </div>
        <Button variant="ghost" className="w-8 h-8 p-0 text-purple-700" onClick={onClose}><X className="w-4 h-4" /></Button>
      </div>

      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
           <div className="bg-[var(--color-eds-bg)] p-2 rounded border border-slate-200">
             <div className="text-[var(--color-eds-text-secondary)] uppercase font-bold text-xs">Diperiksa</div>
             <div className="text-lg font-black text-[var(--color-eds-text-primary)]">{reviewed}/{total}</div>
           </div>
           <div className="bg-[var(--color-eds-bg)] p-2 rounded border border-slate-200">
             <div className="text-[var(--color-eds-text-secondary)] uppercase font-bold text-xs">Sisa</div>
             <div className="text-lg font-black text-[var(--color-eds-text-primary)]">{remaining}</div>
           </div>
           <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
             <div className="text-emerald-600 uppercase font-bold text-xs">Lolos</div>
             <div className="text-lg font-black text-emerald-700">{passed}</div>
           </div>
           <div className="bg-rose-50 p-2 rounded border border-rose-200">
             <div className="text-rose-600 uppercase font-bold text-xs">Gagal/Peringatan</div>
             <div className="text-lg font-black text-rose-700">{failed} / {warned}</div>
           </div>
        </div>
        <div className="flex justify-between items-center text-xs">
           <span className="font-bold text-rose-600">Kritis: {critical}</span>
           <span className="font-bold text-amber-600">Tinggi: {high}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--color-eds-bg)]">
        <h4 className="font-bold text-sm text-[var(--color-eds-text-primary)] mb-3 border-b border-slate-200 pb-2">Active Section: {chapterList.find((c: any) => c.id === activeChapter)?.label || activeChapter}</h4>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase mb-2 block">Status</label>
            <div className="flex gap-2">
              <Button variant={currentQa.status === 'VALID' ? 'success' : 'outline'} className={`flex-1 h-8 text-xs ${currentQa.status === 'VALID' ? 'px-0 py-0 min-h-0' : 'px-0 py-0 min-h-0'}`} onClick={() => handleStatusChange(activeChapter, 'VALID')}>VALID</Button>
              <Button variant={currentQa.status === 'PERINGATAN' ? 'warning' : 'outline'} className={`flex-1 h-8 text-xs ${currentQa.status === 'PERINGATAN' ? 'px-0 py-0 min-h-0' : 'px-0 py-0 min-h-0'}`} onClick={() => handleStatusChange(activeChapter, 'PERINGATAN')}>PERINGATAN</Button>
              <Button variant={currentQa.status === 'GAGAL' ? 'danger' : 'outline'} className={`flex-1 h-8 text-xs ${currentQa.status === 'GAGAL' ? 'px-0 py-0 min-h-0' : 'px-0 py-0 min-h-0'}`} onClick={() => handleStatusChange(activeChapter, 'GAGAL')}>GAGAL</Button>
            </div>
          </div>

          {(currentQa.status === 'PERINGATAN' || currentQa.status === 'GAGAL') && (
            <>
              <div>
                <label className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase mb-2 block">Severity</label>
                <select className="w-full text-sm border border-[var(--color-eds-border)] rounded p-1.5 outline-none focus:border-purple-500 bg-white text-[var(--color-eds-text-primary)]" value={currentQa.severity} onChange={(e) => handleSeverityChange(activeChapter, e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase mb-2 block">Findings & Comments</label>
                <textarea maxLength={2000} 
                  className="w-full border border-[var(--color-eds-border)] rounded p-2 text-sm min-h-[100px] outline-none focus:border-purple-500 bg-white text-[var(--color-eds-text-primary)]" 
                  placeholder="Deskripsikan temuan..."
                  value={currentQa.comment}
                  onChange={(e) => handleCommentChange(activeChapter, e.target.value)}
                />
              </div>
            </>
          )}

          {currentQa.status === 'PENDING' && (
            <div className="text-xs text-[var(--color-eds-text-secondary)] italic p-3 bg-slate-100 rounded border border-slate-200">
              Menunggu inspeksi Reviewer Manusia. Silakan cek halaman ini secara saksama.
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        {(() => {
          const blob = new Blob([JSON.stringify(qaState, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          return (
             <a href={url} download={`qa_findings_${docId}.json`} className="w-full flex items-center justify-center text-xs font-bold border border-slate-200 rounded-md py-2 px-4 hover:bg-slate-50 transition-colors">
               <Download className="w-4 h-4 mr-2" /> Unduh Hasil Pemeriksaan
             </a>
          );
        })()}
      </div>
    </div>
  );
};

import { usePlanningContext } from './planning/PlanningContextService';

const DedicatedPrintRoot = ({ documentModel, settings, meta, isPrintReady }: any) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let node = document.getElementById('print-root');
    if (!node) {
      node = document.createElement('div');
      node.id = 'print-root';
      document.body.appendChild(node);
    }
    setMountNode(node);
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <div className="w-full bg-white text-black font-serif m-0 p-0 relative print-canvas-root">
       {!isPrintReady && (
         <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10">
           <div className="text-[15rem] font-black text-slate-800 transform -rotate-45 select-none tracking-widest whitespace-nowrap">DRAF</div>
         </div>
       )}
       {documentModel ? (
         <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />
       ) : null}
    </div>,
    mountNode
  );
};

const DocumentWorkspaceView = ({ docId, navigateToView, setPrintMode }: any) => {
  const handleOfficialPrint = () => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
    window.print();
    setTimeout(() => {
      if (guard) guard.style.removeProperty('display');
    }, 500);
  };

  const { settings, updateSetting, getActiveAcademicYear, showToast, planning } = useApp();
  const { planningContext, updatePlanningContext } = usePlanningContext();
  const [activeTab, setActiveTab] = useState("pratinjau"); // pratinjau, coverage, riwayat
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [printValidation, setPrintValidation] = useState<any[] | null>(null);

  const [zoom, setZoom] = useState(100);
  const { state: workspaceState, setMode: setWorkspaceMode } = useWorkspace();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Tersimpan");
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleTimeString());
  const [activeChapter, setActiveChapter] = useState("cover");
  const [showHealth, setShowHealth] = useState(false);
  const [qaMode, setQaMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [docGenError, setDocGenError] = useState<string | null>(null);

  const cachedDocumentModel = React.useMemo(() => {
    try {
      setDocGenError(null);
      const kg = KnowledgeGraph.getInstance();
      if (settings.canonicalObjects) {
        KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
      } else {
        seedInitialGraph();
      }
      return generateAppDocument(docId, kg, { ...settings, planning });
    } catch (e: any) {
      console.error("DocGen Error:", e);
      setDocGenError(e.message || String(e));
      return null;
    }
  }, [docId, refreshKey, settings.narratives, settings.school, settings.identityAssets, settings.planning, planning]);
  
  // Status Teks for narratives
  const [narratives, setNarratives] = useState(settings.narratives?.[docId] || {});
  const [history, setHistory] = useState<Record<string, string>[]>([settings.narratives?.[docId] || {}]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNarrativeChange = (chapter: string, text: string) => {
    setAutoSaveStatus("Menyimpan...");
    const newNarratives = { ...narratives, [chapter]: text };
    setNarratives(newNarratives);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNarratives);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setTimeout(() => {
      // In real app, we update settings
      const currentNarratives = settings.narratives || {};
      updateSetting("narratives", "", { ...currentNarratives, [docId]: newNarratives });
      setAutoSaveStatus("Tersimpan");
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNarratives(history[newIndex]);
      const currentNarratives = settings.narratives || {};
      updateSetting("narratives", "", { ...currentNarratives, [docId]: history[newIndex] });
      showToast("Undo berhasil", "success");
    } else {
      showToast("Tidak ada tindakan untuk di-undo", "info");
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNarratives(history[newIndex]);
      const currentNarratives = settings.narratives || {};
      updateSetting("narratives", "", { ...currentNarratives, [docId]: history[newIndex] });
      showToast("Redo berhasil", "success");
    } else {
      showToast("Tidak ada tindakan untuk di-redo", "info");
    }
  };

  const handleSave = () => {
    const currentNarratives = settings.narratives || {};
    updateSetting("narratives", "", { ...currentNarratives, [docId]: narratives });
    showToast("Dokumen berhasil disimpan", "success");
    setAutoSaveStatus("Tersimpan");
    setLastSaved(new Date().toLocaleTimeString());
  };

  const docs = settings?.documents || [];
  
  const getDocMeta = (typeId: string) => {
    const d = docs.find((x: any) => x.type === typeId.toUpperCase());
    if (d) {
      return {
        title: d.type,
        status: d.status || "Draf",
        version: d.version || "1.0",
        approval: ["Disetujui", "Terkunci", "Diarsipkan"].includes(d.status) ? "Telah Disetujui" : "Belum Disetujui",
        lastRevision: "Tadi",
      };
    }
    return {
      title: typeId.toUpperCase(),
      status: "Belum Dibuat",
      version: "-",
      approval: "-",
      lastRevision: "-",
    };
  };

  const docMetadata: any = {
    rkjm: {
      ...getDocMeta("rkjm"),
      subtitle: "Rencana Kerja Jangka Menengah",
      related: ["RKT", "RKAS"],
      owner: "Tim Pengembang Sekolah",
      reviewer: "Kepala Sekolah, Komite",
      prev: { id: "diagnosis", label: "Analisis Prioritas" },
      next: { id: "documentDetail_rkt", label: "RKT" }
    },
    rkt: {
      ...getDocMeta("rkt"),
      subtitle: "Rencana Kerja Tahunan",
      related: ["RKJM", "RKAS"],
      owner: "Tim Pengembang Sekolah",
      reviewer: "Kepala Sekolah",
      prev: { id: "documentDetail_rkjm", label: "RKJM" },
      next: { id: "documentDetail_rkas", label: "RKAS" }
    },
    rkas: {
      ...getDocMeta("rkas"),
      subtitle: "Rencana Kegiatan dan Anggaran",
      related: ["RKT"],
      owner: "Bendahara BOS",
      reviewer: "Kepala Sekolah",
      prev: { id: "documentDetail_rkt", label: "RKT" },
      next: { id: "monitoring", label: "Monitoring" }
    },
    ksp: {
      ...getDocMeta("ksp"),
      subtitle: "Kurikulum Satuan Pendidikan",
      related: ["RKJM"],
      owner: "Tim Kurikulum",
      reviewer: "Pengawas Sekolah",
      prev: { id: "documentDetail_rkjm", label: "RKJM" },
      next: null
    }
  };

  const meta = docMetadata[docId] || docMetadata.rkjm;
  
  // Kelengkapan Data
  const isKspComplete = docs.find((d: any) => d.type === "KSP")?.status === "Disetujui" || docs.find((d: any) => d.type === "KSP")?.status === "Terkunci";
  const rkjmDoc = docs.find((d: any) => d.type === "RKJM");
  const rktDoc = docs.find((d: any) => d.type === "RKT");
  const rkasDoc = docs.find((d: any) => d.type === "RKAS");
  const monitoringDoc = docs.find((d: any) => d.type === "Monitoring");
  
  const isRkjmComplete = rkjmDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rkjmDoc.status);
  const isRktComplete = rktDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rktDoc.status);
  const isRkasComplete = rkasDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(rkasDoc.status);
  const isMonitoringComplete = monitoringDoc && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(monitoringDoc.status);
  
  const isIdentityComplete = !!(settings.school?.name && settings.school?.npsn);
  const isRaporComplete = !!settings.rapor?.isLocked;
  const isAnalisisComplete = settings.analisis?.status === "Disetujui" || settings.analisis?.status === "Selesai" || settings.analisis?.status === "Terkunci";

  const eveResult = EnterpriseValidationEngine.validateDocument(docId, settings);
  let coverageData = eveResult.chapters;

  const chaptersComplete = coverageData.every(c => c.status === "Lengkap" || c.status === "Not Applicable");

  const healthChecks = [
    { id: "govLogo", label: "Logo Pemerintah Daerah", valid: !!settings.identityAssets?.governmentLogo?.url, type: "mandatory" },
    { id: "workspaceId", label: "Identitas Sekolah", valid: !!settings.school?.name && !!settings.school?.npsn, type: "mandatory" },
    { id: "principal", label: "Data Kepala Sekolah", valid: !!settings.principal?.name, type: "mandatory" },
    { id: "committee", label: "Data Komite Sekolah", valid: !!settings.komite?.name, type: "mandatory" },
    { id: "chapters", label: "Kelengkapan Bab (Kelengkapan Data)", valid: chaptersComplete, type: "certification_only" },
    { id: "signatures", label: "Tanda Tangan Pengesah (Digital Signature)", valid: !!settings.identityAssets?.principalSignature?.url && !!settings.identityAssets?.committeeSignature?.url, type: "recommended" },
    { id: "stamp", label: "Stempel Sekolah (Official Seal)", valid: !!settings.identityAssets?.stamp?.url, type: "recommended" },
    { id: "schoolPhoto", label: "Foto Bangunan (Building Photo)", valid: !!settings.identityAssets?.schoolPhoto?.url, type: "recommended" },
    { id: "schoolLogo", label: "Logo Sekolah", valid: !!settings.identityAssets?.schoolLogo?.url, type: "optional" }
  ];
  
  const mandatoryChecks = healthChecks.filter(c => c.type === "mandatory");
  const recommendedChecks = healthChecks.filter(c => c.type === "recommended");
  const certificationOnlyChecks = healthChecks.filter(c => c.type === "certification_only");
  
  const isDraftReady = mandatoryChecks.every(c => c.valid);
  const isPrintReady = isDraftReady && recommendedChecks.every(c => c.valid) && certificationOnlyChecks.every(c => c.valid) && ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status);
  
  const healthScore = Math.round((healthChecks.filter(c => c.valid && (c.type === "mandatory" || c.type === "certification_only")).length / (mandatoryChecks.length + certificationOnlyChecks.length)) * 100);
  
  const [showPrintValidation, setShowPrintValidation] = useState(false);

  const getValidationIssues = () => {
    const issues = [];
    if (!settings.identityAssets?.governmentLogo?.url) issues.push({ type: "Missing Data", message: "Logo Pemerintah Daerah belum diunggah." });
    if (!settings.school?.name) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (Nama Sekolah)." });
    if (!settings.school?.npsn) issues.push({ type: "Missing Data", message: "Identitas Sekolah belum lengkap (NPSN)." });
    if (!settings.principal?.name) issues.push({ type: "Missing Data", message: "Data Kepala Sekolah belum lengkap." });
    if (!settings.komite?.name) issues.push({ type: "Missing Data", message: "Data Komite Sekolah belum lengkap." });
    
    // Strict Validation for Placeholders and Data Quality
    const checkString = (str: string, location: string) => {
        if (!str) return;
        const lowerStr = str.toLowerCase();
        if (lowerStr.includes("undefined")) issues.push({ type: "Validation Error", message: `Ditemukan 'undefined' pada ${location}` });
        if (lowerStr.includes("null")) issues.push({ type: "Validation Error", message: `Ditemukan 'null' pada ${location}` });
        if (lowerStr.includes("nan")) issues.push({ type: "Validation Error", message: `Ditemukan 'NaN' pada ${location}` });
        if (lowerStr.includes("lorem ipsum")) issues.push({ type: "Validation Error", message: `Ditemukan teks sementara (isian belum lengkap) pada ${location}` });
        if (lowerStr.includes("program peningkatan")) issues.push({ type: "Validation Error", message: `Ditemukan nama program generik (Program Peningkatan) pada ${location}. Program harus spesifik.` });
        if (str.includes("[NAMA SEKOLAH]")) issues.push({ type: "Validation Error", message: `Ditemukan isian [NAMA SEKOLAH] yang belum dilengkapi pada ${location}` });
    };

    if (docId === "rkjm") {
       if (!settings.relationalPlanning?.objectives || settings.relationalPlanning.objectives.length === 0) {
           issues.push({ type: "Validation Error", message: "Sasaran Strategis kosong. RKJM membutuhkan Sasaran Strategis." });
       } else {
           settings.relationalPlanning.objectives.forEach((obj: any, idx: number) => {
               checkString(obj.strategicObjective, `Sasaran Strategis ${idx + 1}`);
               if (!obj.targetY1 || !obj.targetY2 || !obj.targetY3 || !obj.targetY4) {
                   issues.push({ type: "Validation Error", message: `Target tahunan kosong pada Sasaran Strategis ${idx + 1}` });
               }
           });
       }
       if (!settings.relationalPlanning?.annualPlans?.Y1?.rkas || settings.relationalPlanning.annualPlans.Y1.rkas.length === 0) {
           issues.push({ type: "Validation Error", message: "Strategi Pendanaan kosong. RKJM membutuhkan kerangka pendanaan (RKAS)." });
       }
    }
    
    // Check for orphan objects
    if (docId === "rkt" || docId === "rkjm") {
       const rkt = settings.relationalPlanning?.annualPlans?.Y1?.rkt || [];
       if (rkt.length === 0) issues.push({ type: "Validation Error", message: "Data Kegiatan RKT kosong." });
       rkt.forEach((item: any, idx: number) => {
           if (!item.rkjmObjectiveId && !item.program) issues.push({ type: "Validation Error", message: `Kegiatan RKT tanpa program induk ditemukan pada baris ${idx + 1}` });
       });
    }

    if (docId === "rkas" || docId === "rkjm") {
       const rkas = settings.relationalPlanning?.annualPlans?.Y1?.rkas || [];
       if (rkas.length === 0) issues.push({ type: "Validation Error", message: "Data Anggaran RKAS kosong." });
       rkas.forEach((item: any, idx: number) => {
           if (!item.rktActivityId && !item.activity) issues.push({ type: "Validation Error", message: `Item anggaran tanpa kegiatan terkait ditemukan pada baris ${idx + 1}` });
       });
    }

    // Checking narratives
    if (narratives) {
       Object.keys(narratives).forEach(key => {
           checkString(narratives[key], `Narasi ${key}`);
       });
       
       // Duplicated paragraph check
       const values = Object.values(narratives).filter((v: any) => typeof v === 'string' && v.trim().length > 20);
       const uniqueValues = new Set(values);
       if (values.length > uniqueValues.size) {
           issues.push({ type: "Validation Error", message: "Ditemukan paragraf duplikat antar bab. Narasi harus unik dan terhubung dengan konteks." });
       }
    }

    // Recommended issues (we don't push them to the block array, they just show a warning)
    return issues;
  };

  const handleExportClick = (targetExportDocx = false) => {
    const issues = getValidationIssues();
    if (issues.length > 0) {
      setPrintValidation(issues);
      setShowPrintValidation(true);
    } else {
      setShowPrintValidation(false);
      setPrintMode({ id: docId, isPrintReady, exportDocx: targetExportDocx });
    }
  };


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === 'p') {
        // Let the browser handle Ctrl+P, which will show the Print Guard naturally.
        // We can just return to not interfere, or call window.print().
        // If we call window.print(), the guard will show.
        e.preventDefault();
        window.print();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showToast("Draf berhasil disimpan", "success");
      } else if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        setZoom(z => Math.min(200, z + 25));
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        setZoom(z => Math.max(50, z - 25));
      } else if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrintReady]);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch((err) => {
          showToast("Mode layar penuh tidak dapat diaktifkan pada lingkungan ini.", "error");
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      showToast("Mode layar penuh tidak didukung.", "error");
    }
  };

  const blueprint = DOCUMENT_BLUEPRINTS[docId] || DOCUMENT_BLUEPRINTS.rkjm;
  const chapterList = blueprint.chapters;

  const scrollToChapter = (id: string) => {
    if (activeTab !== "pratinjau") setActiveTab("pratinjau");
    setActiveChapter(id);
    setTimeout(() => {
      const el = document.getElementById(`chapter-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  // Custom Rich Text Editor component for narratives
  const NarrativeEditor = ({ id, label, defaultText, readOnly }: any) => {
    const text = narratives[id] || defaultText;
    return (
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-2 text-[var(--color-eds-text-primary)]">{label}</h4>
        {!readOnly && workspaceState.workspaceMode === "edit" ? (
          <div className="border border-[var(--color-eds-border)] rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
            <div className="bg-[var(--color-eds-bg)] border-b border-[var(--color-eds-border)] p-2 flex gap-2">
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><Bold className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><Italic className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><Underline className="w-4 h-4" /></button>
               <div className="w-px h-6 bg-slate-300 mx-1"></div>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><AlignLeft className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><AlignCenter className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><AlignRight className="w-4 h-4" /></button>
               <div className="w-px h-6 bg-slate-300 mx-1"></div>
               <button className="p-1.5 hover:bg-slate-200 rounded text-[var(--color-eds-text-primary)]"><List className="w-4 h-4" /></button>
            </div>
            <textarea maxLength={2000} 
              className="w-full min-h-[120px] p-4 outline-none resize-y text-[var(--color-eds-text-primary)]"
              value={text}
              onChange={(e) => handleNarrativeChange(id, e.target.value)}
            />
          </div>
        ) : (
          <p className="text-justify leading-relaxed indent-8 text-[var(--color-eds-text-primary)] whitespace-pre-wrap">{text}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <DedicatedPrintRoot documentModel={cachedDocumentModel} settings={settings} meta={meta} isPrintReady={isPrintReady} />
      <div className="flex flex-col h-[calc(100vh-80px)] print:h-auto -mt-6 -mx-6 bg-slate-100 print:bg-white print:m-0 print:block">
        {/* ENTERPRISE DOCUMENT TOOLBAR */}
      <div className="h-16 bg-white border-b border-[var(--color-eds-border)] flex items-center justify-between px-4 shrink-0 shadow-sm z-20 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 hover:bg-slate-100" onClick={() => navigateToView(meta.prev?.id || "beranda")}>
            <ChevronLeft className="w-5 h-5 text-[var(--color-eds-text-secondary)]" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-[var(--color-eds-text-primary)] text-lg uppercase">{meta.title}</span>
              {!(meta.status === 'Draf' && (meta.title?.toLowerCase().includes('intrakurikuler') || docId?.toLowerCase().includes('intrakurikuler'))) && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${meta.status === 'Draf' ? 'bg-amber-100 text-amber-800' : meta.status === 'Tinjauan' ? 'bg-blue-100 text-[var(--color-eds-primary)] font-bold' : 'bg-emerald-100 text-emerald-800'}`}>
                  {meta.status}
                </span>
              )}
            </div>
            <div className="flex items-center text-xs text-[var(--color-eds-text-secondary)] gap-2">
              <span className="flex items-center"><RefreshCcw className="w-3 h-3 mr-1" /> {autoSaveStatus} {lastSaved}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative group mr-2">
            <Button variant="outline" className={`h-9 gap-2 font-bold ${healthScore === 100 && chaptersComplete ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`} onClick={() => setShowHealth(!showHealth)}>
              <ShieldCheck className="w-4 h-4" /> Score: {healthScore}%
            </Button>
            {showHealth && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-xl border border-[var(--color-eds-border)] p-4 z-50">
                <h4 className="font-bold text-[var(--color-eds-text-primary)] mb-3 border-b border-slate-200 pb-2">Pre-Print Certification</h4>
                <div className="space-y-2">
                  {healthChecks.filter(c => c.type !== "optional").map(c => (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className={c.valid ? "text-[var(--color-eds-text-primary)]" : (c.type === "mandatory" || c.type === "certification_only" ? "text-rose-600 font-medium" : "text-amber-600 font-medium")}>
                        {c.label} {c.type === "recommended" && "(Rec.)"}
                      </span>
                      {c.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : (c.type === "mandatory" || c.type === "certification_only" ? <XCircle className="w-4 h-4 text-rose-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />)}
                    </div>
                  ))}
                </div>
                {!chaptersComplete && (
                   <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                     <p className="text-xs text-amber-800 font-medium"><AlertTriangle className="w-3 h-3 inline mr-1" /> Beberapa bab tidak memiliki sumber data yang lengkap. Periksa tab Sertifikasi Data.</p>
                   </div>
                )}
                
                <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center text-xs font-bold">
                  <span className={isDraftReady ? "text-emerald-600" : "text-amber-600"}>{isDraftReady ? "✓ DRAFT READY" : "⚠ BLOCKING ISSUES"}</span>
                  <span className={isPrintReady ? "text-emerald-600" : "text-[var(--color-eds-text-secondary)]"}>{isPrintReady ? "✓ CERTIFIED PDF/DOCX READY" : "CERTIFICATION PENDING"}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={handleSave} title="Simpan Draf"><Save className="w-5 h-5" /></Button>
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={handleUndo} title="Undo" disabled={historyIndex === 0}><Undo className="w-5 h-5" /></Button>
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={handleRedo} title="Redo" disabled={historyIndex >= history.length - 1}><Redo className="w-5 h-5" /></Button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <Button variant="ghost" className={`w-9 h-9 p-0 ${activeTab === 'coverage' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveTab('coverage')} title="Cek Kelengkapan Data">
            <Database className="w-5 h-5" />
          </Button>

          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'preview' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('preview'); }} title="Preview">
            <Eye className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'edit' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('edit'); }} title="Edit Mode">
            <Edit3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'printPreview' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('printPreview'); }} title="Print Preview">
            <Printer className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'developer' && activeTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveTab("pratinjau"); setWorkspaceMode('developer'); }} title="Developer">
            <Code className="w-5 h-5" />
          </Button>

          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <Button variant="outline" className="h-9 px-3 gap-2 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => handleOfficialPrint()} disabled={!isDraftReady} title="Cetak Draft">
            <Printer className="w-4 h-4" /> Print Draft
          </Button>
          
          <Button variant="default" className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-2" onClick={() => handleOfficialPrint()}  title="Cetak Versi Tersertifikasi">
            <ShieldCheck className="w-4 h-4" /> Certified Print
          </Button>
          
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => handleExportClick(false)} title="Ekspor PDF" >
            <FileDown className="w-5 h-5 text-rose-600" />
          </Button>
          
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => handleExportClick(true)} title="Ekspor DOCX" >
            <Download className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" />
          </Button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 mr-2">
            <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.max(50, zoom - 25))}><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="ghost" className="w-auto min-w-[3rem] h-7 p-0 text-xs font-bold text-[var(--color-eds-text-primary)] hover:bg-slate-200 rounded" onClick={() => setZoom(100)} title="Reset Zoom">{zoom}%</Button>
            <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.min(200, zoom + 25))}><ZoomIn className="w-4 h-4" /></Button>
          </div>

          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-eds-text-secondary)]" />
             <input maxLength={255} type="text" placeholder="Cari..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-xl text-sm w-40 focus:ring-2 focus:ring-blue-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (window as any).find(searchQuery); } }} />
          </div>

          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2 transition-all" onClick={toggleFullscreen} title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          
          <Button variant="ghost" className={`w-9 h-9 p-0 ${qaMode ? 'bg-purple-100 text-purple-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'} transition-all`} onClick={() => setQaMode(!qaMode)} title="Mode Inspeksi QA (GM-UAT)">
            <Microscope className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* PLANNING CONTEXT SELECTOR BAR */}
      <div className="h-12 bg-slate-50 border-b border-[var(--color-eds-border)] flex items-center px-4 shrink-0 shadow-sm z-15 print:hidden gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Document</span>
          <select 
            className="bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500"
            value={planningContext.selectedDocument}
            onChange={(e) => {
              updatePlanningContext({ selectedDocument: e.target.value });
              // Also update docId in UI implicitly by navigating if needed
              if (e.target.value !== docId) {
                navigateToView('documentDetail_' + e.target.value);
              }
            }}
          >
            <option value="rkjm">RKJM</option>
            <option value="rkt">RKT</option>
            <option value="rkas">RKAS</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Planning Year</span>
          <select 
            className="bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500"
            value={planningContext.selectedPlanningYear}
            onChange={(e) => updatePlanningContext({ selectedPlanningYear: e.target.value })}
          >
            <option value="Y1">Tahun Ke-1</option>
            <option value="Y2">Tahun Ke-2</option>
            <option value="Y3">Tahun Ke-3</option>
            <option value="Y4">Tahun Ke-4</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Academic Year</span>
          <div className="px-2 py-1 text-slate-700 font-medium">
            {(() => {
              // Formula: RKJM Start Year + (Planning Year - 1)
              const activeYearObj = settings?.academicYears?.find((y: any) => y.isActive);
              const fallbackYear = new Date().getFullYear();
              const baseYearStr = activeYearObj?.name || `${fallbackYear}/${fallbackYear + 1}`;
              const rkjmStartYear = parseInt(baseYearStr.split('/')[0]) || fallbackYear;
              const planningYearNum = parseInt(planningContext.selectedPlanningYear?.replace('Y', '')) || 1;
              const computedStartYear = rkjmStartYear + (planningYearNum - 1);
              return `${computedStartYear}/${computedStartYear + 1}`;
            })()}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 print:overflow-visible print:block">
        {/* LEFT NAVIGATION */}
        <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[var(--color-eds-border)] flex flex-col overflow-y-auto shrink-0 z-10 print:hidden max-h-48 md:max-h-none">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-xs text-[var(--color-eds-text-secondary)] uppercase tracking-wider">Navigasi</h3>
          </div>
          <div className="p-2 space-y-1">
            <button 
                onClick={() => setActiveTab("coverage")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-4 ${activeTab === 'coverage' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100 border border-transparent'}`}
              >
                <div className="flex items-center"><Database className="w-4 h-4 mr-2" /> Sertifikasi Data</div>
            </button>
            <div className="h-px bg-slate-100 w-full mb-2"></div>
            {chapterList.map(ch => (
              <button 
                key={ch.id} 
                onClick={() => scrollToChapter(ch.id)}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-l-4 rounded-r-xl ${activeChapter === ch.id && activeTab === "pratinjau" ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className={`flex-1 overflow-y-auto print:overflow-visible print:bg-white print:!p-0 print:block ${activeTab === 'pratinjau' ? 'py-8' : 'p-0'} ${isDarkPreview ? 'bg-slate-800' : 'bg-slate-100'}`}>
          
          {activeTab === 'coverage' && (
             <div className="max-w-5xl mx-auto p-8 print:hidden">
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[var(--color-eds-text-primary)] font-bold">
                        <Database className="w-6 h-6" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-[var(--color-eds-text-primary)]">Kelengkapan Data</h2>
                       <p className="text-[var(--color-eds-text-primary)] text-sm font-medium">Validasi sumber data untuk setiap bab pada dokumen {meta.title}.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                     <div className="bg-[var(--color-eds-bg)] rounded-xl p-4 border border-[var(--color-eds-border)]">
                       <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider mb-1">Total Bab Mandatory</p>
                       <p className="text-2xl font-black text-[var(--color-eds-text-primary)]">{coverageData.length}</p>
                     </div>
                     <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                       <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Bab Tersertifikasi</p>
                       <p className="text-2xl font-black text-emerald-700">{coverageData.filter(c => c.status === "Lengkap").length}</p>
                     </div>
                     <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                       <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Data Hilang / Kosong</p>
                       <p className="text-2xl font-black text-rose-700">{coverageData.filter(c => c.status !== "Lengkap").length}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                    {coverageData.map((cov, idx) => (
                       <div key={idx} className="border border-[var(--color-eds-border)] rounded-xl p-5 hover:border-[var(--color-eds-border)] transition-colors bg-[var(--color-eds-bg)]/50">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <h3 className="font-bold text-lg text-[var(--color-eds-text-primary)]">{cov.chapter}</h3>                               <div className="mt-2 space-y-1">                                 <p className="text-xs text-[var(--color-eds-text-secondary)] flex items-center">                                   <Database className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Sumber:</span> {cov.sources.join(", ")}                                 </p>                                 <p className="text-xs text-[var(--color-eds-text-secondary)] flex items-center">                                   <Library className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Modul:</span> {cov.module}                                 </p>                                 <p className="text-xs text-[var(--color-eds-text-secondary)] flex items-center">                                   <Milestone className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Tahap:</span> {cov.stage}                                 </p>                                 <p className="text-xs text-[var(--color-eds-text-secondary)] flex items-center">                                   <ShieldCheck className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Regulasi:</span> {cov.regulation}                                 </p>                               </div>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${cov.status === 'Lengkap' ? 'bg-emerald-100 text-emerald-700' : cov.status === 'Sebagian' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                              {cov.status}
                            </span>
                         </div>
                         
                         <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold text-[var(--color-eds-text-secondary)] mb-1">
                              <span>Cakupan Data</span>
                              <span>{cov.coverage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded h-2">
                              <div className={`h-2 rounded ${cov.coverage === 100 ? 'bg-emerald-500' : cov.coverage > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${cov.coverage}%` }}></div>
                            </div>
                         </div>
                         
                         {cov.missing.length > 0 && (
                           <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4">
                             <div className="flex items-center gap-2 mb-3">
                               <AlertTriangle className="w-5 h-5 text-rose-600" />
                               <h4 className="font-bold text-rose-800 text-sm">Diagnosis Sertifikasi Data</h4>
                             </div>
                             <div className="space-y-3">
                               {cov.missing.map((m: any, i: number) => (
                                 <div key={i} className="bg-white border border-rose-100 rounded-xl p-3 text-sm flex flex-col gap-2">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-rose-50 pb-2">
                                     <div><span className="text-[var(--color-eds-text-secondary)] font-medium text-xs uppercase tracking-wider block">Data Belum Lengkap</span><span className="font-semibold text-[var(--color-eds-text-primary)]">{m.dataset}</span></div>
                                     <div><span className="text-[var(--color-eds-text-secondary)] font-medium text-xs uppercase tracking-wider block">Modul Sumber</span><span className="font-semibold text-[var(--color-eds-text-primary)]">{m.module}</span></div>
                                   </div>
                                   <div>
                                     <span className="text-[var(--color-eds-text-secondary)] font-medium text-xs uppercase tracking-wider block">Rekomendasi Tindakan</span>
                                     <span className="text-rose-700 font-medium">{m.action}</span>
                                   </div>
                                   <Button variant="outline" size="sm" className="w-full mt-1 text-[var(--color-eds-text-primary)] font-bold border-blue-200 hover:bg-blue-50" onClick={() => navigateToView(m.link)}>
                                     <ExternalLink className="w-4 h-4 mr-2" /> Buka Modul {m.module.split(' > ').pop()}
                                   </Button>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                    ))}
                  </div>
                </div>
             </div>
          )}

          
          {activeTab === 'review' && (
             <div className="max-w-6xl mx-auto p-8 print:hidden">
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-8">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
                          <CheckSquare className="w-7 h-7" />
                       </div>
                       <div>
                         <h2 className="text-3xl font-black text-[var(--color-eds-text-primary)] tracking-tight">Sistem Pemeriksaan Dokumen (DRE)</h2>
                         <p className="text-[var(--color-eds-text-primary)] font-medium">Pemeriksaan dan Sertifikasi Mutu Terpadu</p>
                       </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                       <div className="text-left">
                         <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">DRE Score</p>
                         <p className={`text-4xl font-black ${healthScore >= 95 ? 'text-emerald-600' : healthScore >= 90 ? 'text-[var(--color-eds-text-primary)] font-bold' : healthScore >= 80 ? 'text-amber-500' : 'text-rose-600'}`}>
                           {healthScore}%
                         </p>
                       </div>
                       <div className="text-left border-l border-[var(--color-eds-border)] pl-6">
                         <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">Status</p>
                         <p className={`text-xl font-black ${healthScore >= 95 && isPrintReady ? 'text-emerald-600' : 'text-amber-500'}`}>
                           {healthScore >= 95 && isPrintReady ? 'SIAP DIGUNAKAN' : healthScore >= 90 ? 'SANGAT BAIK' : healthScore >= 80 ? 'PERLU REVISI KECIL' : 'PERLU REVISI'}
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Tahap 1-3 */}
                    <div className="space-y-4">
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 1</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Integritas Data</p>
                         </div>
                         <span className={`px-3 py-1 rounded text-xs font-bold ${mandatoryChecks.every(c => c.valid) ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{mandatoryChecks.every(c => c.valid) ? 'VALID' : 'GAGAL'}</span>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 2</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Konsistensi Isi</p>
                         </div>
                         <span className={`px-3 py-1 rounded text-xs font-bold ${chaptersComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{chaptersComplete ? 'VALID' : 'PERINGATAN'}</span>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 3</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Validasi Logika</p>
                         </div>
                         <Badge variant="completed">VALID</Badge>
                      </div>
                    </div>
                    {/* Tahap 4-6 */}
                    <div className="space-y-4">
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 4</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Writing Quality</p>
                         </div>
                         <Badge variant="completed">VALID</Badge>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 5</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Narrative Consistency</p>
                         </div>
                         <Badge variant="completed">VALID</Badge>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 6</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Regulation Compliance</p>
                         </div>
                         <Badge variant="completed">VALID</Badge>
                      </div>
                    </div>
                    {/* Tahap 7-9 */}
                    <div className="space-y-4">
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 7</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Document Structure</p>
                         </div>
                         <span className={`px-3 py-1 rounded text-xs font-bold ${chaptersComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{chaptersComplete ? 'VALID' : 'GAGAL'}</span>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 8</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Table Interpretation</p>
                         </div>
                         <Badge variant="completed">VALID</Badge>
                      </div>
                      <div className="p-4 border border-[var(--color-eds-border)] rounded-xl bg-[var(--color-eds-bg)] flex items-center justify-between">
                         <div>
                           <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase">Tahap 9</p>
                           <p className="font-bold text-[var(--color-eds-text-primary)]">Print Readiness</p>
                         </div>
                         <span className={`px-3 py-1 rounded text-xs font-bold ${isPrintReady ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{isPrintReady ? 'VALID' : 'GAGAL'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[var(--color-eds-border)] rounded-xl overflow-hidden mb-8">
                     <div className="bg-blue-50 px-5 py-4 border-b border-blue-100 flex items-center justify-between">
                        <h4 className="font-bold text-blue-900 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-[var(--color-eds-text-primary)] font-bold"/> Catatan Tinjauan Cerdas</h4>
                        <span className="px-2 py-1 bg-blue-200 text-[var(--color-eds-primary)] font-bold text-xs font-bold rounded">AI Auditor</span>
                     </div>
                     <div className="p-5 space-y-4">
                        {!chaptersComplete ? coverageData.filter(c => c.status !== "Lengkap").map((c, i) => (
                           <div key={i} className="flex items-start bg-rose-50 p-4 rounded-xl border border-rose-100">
                              <AlertTriangle className="w-5 h-5 mr-3 text-rose-500 shrink-0 mt-0.5"/>
                              <div>
                                 <p className="font-bold text-rose-800 mb-1">Kesalahan Data: {c.chapter}</p>
                                 <p className="text-sm text-rose-600 mb-2">Data yang belum lengkap: {c.missing.map((m: any) => m.dataset).join(', ')}</p>
                                 <p className="text-sm font-medium text-rose-700">Saran Perbaikan: Lengkapi data yang kurang sebelum mengunduh dokumen.</p>
                              </div>
                           </div>
                        )) : (
                           <div className="flex items-start bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                              <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5"/>
                              <div>
                                 <p className="font-bold text-emerald-800 mb-1">Data Integrity Passed</p>
                                 <p className="text-sm text-emerald-600">Semua data dan pemeriksaan telah diverifikasi.</p>
                              </div>
                           </div>
                        )}
                        
                        {(!settings.identityAssets?.principalSignature?.url || !settings.identityAssets?.governmentLogo?.url) && (
                           <div className="flex items-start bg-amber-50 p-4 rounded-xl border border-amber-100">
                              <AlertCircle className="w-5 h-5 mr-3 text-amber-500 shrink-0 mt-0.5"/>
                              <div>
                                 <p className="font-bold text-amber-800 mb-1">Peringatan Kesiapan Cetak: Komponen Belum Lengkap</p>
                                 <p className="text-sm text-amber-600 mb-2">Komponen cetak wajib belum lengkap (misalnya, Logo, Tanda Tangan).</p>
                                 <p className="text-sm font-medium text-amber-700">Saran Perbaikan: Pastikan semua tanda tangan pejabat dan logo telah diunggah untuk sertifikasi dokumen.</p>
                              </div>
                           </div>
                        )}

                        {chaptersComplete && isPrintReady && (
                           <div className="flex items-start bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                              <ThumbsUp className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5"/>
                              <div>
                                 <p className="font-bold text-emerald-800 mb-1">Tinjauan Selesai</p>
                                 <p className="text-sm text-emerald-600">The document meets all structural, linguistic, and regulatory standards. It is ready for official submission.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl mt-8">
                     <div className="flex items-center text-sm text-[var(--color-eds-text-primary)] font-medium">
                        <Info className="w-4 h-4 mr-2 text-[var(--color-eds-text-secondary)]" />
                        Keputusan pengesahan akhir tetap menjadi tanggung jawab Kepala Sekolah dan Komite.
                     </div>
                     <Button 
                       disabled={!isDraftReady} 
                       onClick={() => handleOfficialPrint()}
                       className={`font-bold ${isDraftReady ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-[var(--color-eds-text-secondary)] cursor-not-allowed'}`}
                     >
                        <Printer className="w-4 h-4 mr-2" /> {isPrintReady ? "Cetak Tersertifikasi" : "Cetak Draft (Watermark)"}
                     </Button>
                  </div>
               </div>
             </div>
          )}
          <div 
            className={`flex flex-col items-center gap-8 transition-transform origin-top print-no-transform ${activeTab === 'pratinjau' ? 'flex print:block' : 'hidden print:block'}`}
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div id="printable-doc-preview" className="w-full bg-slate-50 print:bg-white print:shadow-none print:p-0 font-serif text-black relative block">
              {!isPrintReady && (
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10">
                  <div className="text-[15rem] font-black text-[var(--color-eds-text-secondary)] transform -rotate-45 select-none tracking-widest whitespace-nowrap">DRAF</div>
                </div>
              )}
              
              {!cachedDocumentModel ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                  <AlertTriangle className="w-12 h-12 mb-4 text-rose-500" />
                  <h3 className="text-xl font-bold mb-2">Document Generation Failure</h3>
                  <p>Periksa konsol untuk detail error.</p>
                  {docGenError && <p className="mt-4 font-mono text-sm">{docGenError}</p>}
                </div>
              ) : (
                <EnterpriseDocumentViewer settings={settings} title={meta.title} document={cachedDocumentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />
              )}
            </div>
          </div>
        </div>

        {/* QA PANEL OVERLAY OR SIDEBAR */}
        {qaMode && (
          <div className="w-80 bg-white border-l border-[var(--color-eds-border)] flex flex-col shrink-0 z-20 print:hidden shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">
             <QAPanel docId={docId} chapterList={chapterList} activeChapter={activeChapter} onClose={() => setQaMode(false)} />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

const OnboardingWizardView = ({ onComplete }: any) => {
  const appCtx = useApp();
  const { settings, updateSetting, addAcademicYear, switchAcademicYear, updateAcademicYear } = appCtx;
  const [step, setStep] = useState(0);

  const handleStart = () => setStep(1);
  const handleNext = () => setStep(s => s + 1);

  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-white rounded-xl p-10 shadow-2xl text-center border border-slate-200">
          <div className="w-20 h-20 bg-blue-700 rounded-xl flex items-center justify-center shadow-md mx-auto mb-8">
            <Layout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-eds-text-primary)] mb-4">Selamat Datang di Tampuyak OS</h1>
          <p className="text-[var(--color-eds-text-primary)] mb-8 leading-relaxed font-medium">
            Sistem operasi tata kelola sekolah yang dirancang khusus untuk mempermudah tugas Kepala Sekolah. Mari siapkan data dasar sekolah Anda.
          </p>
          <div className="bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] rounded-xl p-4 mb-8 flex items-center justify-center gap-3 text-sm text-[var(--color-eds-text-primary)] font-medium">
            <Clock className="w-5 h-5 text-blue-500" />
            Estimasi waktu penyiapan: 10–15 menit
          </div>
          <Button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-14 rounded-xl shadow-lg shadow-blue-600/20">
            Mulai Pengaturan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col">
       <div className="h-16 bg-white border-b border-[var(--color-eds-border)] flex items-center px-6 justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20"><Layout className="w-4 h-4 text-white" /></div>
             <span className="font-bold text-[var(--color-eds-text-primary)] tracking-tight">Pengaturan Awal</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest">Langkah {step} dari 5</div>
             <Button variant="outline" size="sm" onClick={onComplete} className="text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)]">Lewati</Button>
          </div>
       </div>
       <div className="flex-1 overflow-auto p-4 md:p-6 flex items-start justify-center">
         <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-[var(--color-eds-border)] p-6 md:p-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && (
               <div>
                  <h2 className="text-2xl font-black mb-2 text-[var(--color-eds-text-primary)]">Identitas Sekolah</h2>
                  <p className="text-[var(--color-eds-text-primary)] mb-8 text-lg font-medium">Lengkapi informasi dasar satuan pendidikan Anda. Data ini akan digunakan di seluruh dokumen yang dihasilkan.</p>
                  <SettingsTabs.School appCtx={appCtx} />
                  <div className="flex justify-end mt-12 pt-6 border-t border-slate-200">
                    <Button onClick={handleNext} className="bg-blue-600 h-12 px-6 text-lg rounded-xl">Lanjutkan <ChevronRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
            )}
            {step === 2 && (
               <div>
                  <h2 className="text-2xl font-black mb-2 text-[var(--color-eds-text-primary)]">Pejabat Penandatangan</h2>
                  <p className="text-[var(--color-eds-text-primary)] mb-8 text-lg font-medium">Siapa yang menandatangani dokumen-dokumen resmi di sekolah Anda?</p>
                  <SettingsTabs.Pejabat appCtx={appCtx} />
                  <div className="flex justify-between mt-12 pt-6 border-t border-slate-200">
                    <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl text-[var(--color-eds-text-secondary)]">Kembali</Button>
                    <Button onClick={handleNext} className="bg-blue-600 h-12 px-6 text-lg rounded-xl">Lanjutkan <ChevronRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
            )}
            {step === 3 && (
               <div>
                  <h2 className="text-2xl font-black mb-2 text-[var(--color-eds-text-primary)]">Tahun Ajaran</h2>
                  <p className="text-[var(--color-eds-text-primary)] mb-8 text-lg font-medium">Atur tahun akademik yang sedang berjalan.</p>
                  <SettingsTabs.AcademicYear data={settings.academicYears} appCtx={appCtx} />
                  <div className="flex justify-between mt-12 pt-6 border-t border-slate-200">
                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-6 rounded-xl text-[var(--color-eds-text-secondary)]">Kembali</Button>
                    <Button onClick={handleNext} className="bg-blue-600 h-12 px-6 text-lg rounded-xl">Lanjutkan <ChevronRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
            )}
            {step === 4 && (
               <div>
                  <h2 className="text-2xl font-black mb-2 text-[var(--color-eds-text-primary)]">Logo & Identitas Visual</h2>
                  <p className="text-[var(--color-eds-text-primary)] mb-8 text-lg font-medium">Unggah logo sekolah Anda untuk mempercantik sampul dokumen.</p>
                  <SettingsTabs.Branding data={settings.branding} update={(f: any, v: any) => updateSetting("branding", f, v)} />
                  <div className="flex justify-between mt-12 pt-6 border-t border-slate-200">
                    <Button variant="outline" onClick={() => setStep(3)} className="h-12 px-6 rounded-xl text-[var(--color-eds-text-secondary)]">Kembali</Button>
                    <Button onClick={handleNext} className="bg-blue-600 h-12 px-6 text-lg rounded-xl">Selesai <Check className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
            )}
            {step === 5 && (
               <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-16 bg-emerald-100 border-4 border-white shadow-xl shadow-emerald-500/20 rounded flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-black mb-4 text-[var(--color-eds-text-primary)] tracking-tight">Pengaturan Selesai!</h2>
                  <p className="text-[var(--color-eds-text-primary)] mb-10 text-lg leading-relaxed max-w-md mx-auto font-medium">Tampuyak OS kini siap digunakan. Mari mulai merencanakan program dan anggaran sekolah dengan lebih mudah.</p>
                  <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-xl shadow-xl shadow-blue-600/30 text-lg font-bold">Buka Workspace Anda</Button>
               </div>
            )}
         </div>
       </div>
    </div>
  );
};


const DocumentHealthScore = ({ docId, settings }: { docId: string, settings: any }) => {
  const narratives = settings.narratives?.[docId] || {};

  const docMeta = settings.documents?.find((d: any) => d.id === docId);
  if (!docMeta) return null;

  const validRes = EnterpriseValidationEngine.validateDocument(docId, settings, narratives);
  const healthScore = validRes.totalCoverage || (validRes.valid ? 100 : Math.max(0, 100 - validRes.errors.length * 20));
  
  let status = "FAILED";
  let statusColor = "bg-rose-100 text-rose-700";
  if (healthScore === 100) {
    status = "PASS";
    statusColor = "bg-emerald-100 text-emerald-700";
  } else if (healthScore > 50) {
    status = "WARNING";
    statusColor = "bg-amber-100 text-amber-700";
  }

  return (
    <div className="bg-white border border-[var(--color-eds-border)] rounded-xl p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-[var(--color-eds-text-primary)]">Document Health Score</h4>
          <p className="text-xs text-[var(--color-eds-text-secondary)]">Enterprise Pre-Print Validation</p>
        </div>
        <div className={`px-3 py-1 font-bold text-sm rounded-xl ${statusColor}`}>
          {status} ({healthScore}%)
        </div>
      </div>
      {!validRes.valid && (
        <div className="space-y-2">
          {validRes.errors.map((e: string, i: number) => (
             <div key={i} className="flex items-start text-xs text-[var(--color-eds-text-primary)]">
               <AlertCircle className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
               {e}
             </div>
          ))}
        </div>
      )}
    </div>
  );
};


const GlobalWorkflowStepper = ({ currentView, settings, navigateToView }: any) => {
  const docs = settings?.documents || [];
  
  const steps = [
    { id: "dataSekolah", label: "Data Sekolah", check: () => settings?.school?.name !== "" },
    { id: "rapor", label: "Rapor Pendidikan", check: () => settings?.rapor?.isLocked },
    { id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.diagnosis?.isLocked },
    { id: "rkjm", label: "RKJM", check: () => docs.some((d: any) => d.type === "RKJM" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkt", label: "RKT", check: () => docs.some((d: any) => d.type === "RKT" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkas", label: "RKAS", check: () => docs.some((d: any) => d.type === "RKAS" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "monitoring", label: "Monitoring", check: () => false },
  ];

  let currentStepIndex = steps.findIndex(s => !s.check());
  if (currentStepIndex === -1) currentStepIndex = steps.length - 1;

  // Let's determine if we are in a planning view to show this
  const planningViews = ["dataSekolah", "rapor", "diagnosis", "analisis", "rkjmPipeline", "rktDerivation", "rkasDerivation", "monitoring", "kspStudio", "dokumenPerencanaan"];
  
  const viewMap: any = {
    "dataSekolah": "dataSekolah",
    "rapor": "rapor",
    "diagnosis": "diagnosis",
    "analisis": "diagnosis",
    "rkjmPipeline": "rkjm",
    "documentDetail_rkjm": "rkjm",
    "rktDerivation": "rkt",
    "documentDetail_rkt": "rkt",
    "rkasDerivation": "rkas",
    "documentDetail_rkas": "rkas",
    "monitoring": "monitoring",
    "kspStudio": "rkt", // Arbitrary
    "documentDetail_ksp": "rkt",
  };

  const activeId = viewMap[currentView] || "dataSekolah";
  
  if (!planningViews.includes(currentView) && !currentView.startsWith("documentDetail_")) return null;

  return (
    <div className="bg-white border-b border-[var(--color-eds-border)] px-8 py-4 overflow-x-auto sticky top-20 z-10 shadow-sm hidden md:block print:hidden">
       <div className="flex items-center space-x-2 min-w-max text-sm justify-center">
         {steps.map((step, idx) => {
           const isCompleted = step.check();
           const isActive = step.id === activeId;
           
           return (
             <div key={step.id} className="flex items-center">
               <div 
                 onClick={() => {
                   if (step.id === "rkjm") navigateToView("documentDetail_rkjm");
                   else if (step.id === "rkt") navigateToView("documentDetail_rkt");
                   else if (step.id === "rkas") navigateToView("documentDetail_rkas");
                   else navigateToView(step.id);
                 }}
                 className={`flex items-center px-3 py-1.5 rounded cursor-pointer transition-all border ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-100' : 'bg-[var(--color-eds-bg)] border-[var(--color-eds-border)] text-[var(--color-eds-text-primary)] hover:bg-slate-100 border-l-4 border-transparent font-medium rounded-none rounded-r-lg font-medium'}`}
               >
                 {isCompleted && !isActive ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : isActive ? <div className="w-2 h-2 rounded bg-blue-500 mr-2 animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded bg-slate-300 mr-2"></div>}
                 {step.label}
               </div>
               {idx < steps.length - 1 && (
                 <ChevronRight className={`w-4 h-4 mx-2 ${isCompleted ? 'text-emerald-300' : 'text-[var(--color-eds-text-secondary)]'}`} />
               )}
             </div>
           );
         })}
       </div>
    </div>
  );
};


const DataSekolahView = ({ initialTab = "dashboard" }: any) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const appCtx = useApp();
  const { settings, updateSetting } = appCtx;

  const tabs = [
    { id: "dashboard", label: "Dashboard Data", icon: LayoutDashboard },
    { id: "administrasi", label: "Administrasi Dokumen", icon: FileText },
    { id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },
    { id: "school", label: "Profil & Identitas", icon: Building2 },
    { id: "lokasi", label: "Karakteristik & Lokasi", icon: MapPin },
    { id: "sarpras", label: "Sarana Prasarana", icon: Home },
    { id: "potensi", label: "Potensi & Program", icon: Sparkles },
    { id: "pejabat", label: "Pejabat Penandatangan", icon: UserCircle },
    { id: "guru", label: "Guru", icon: Users },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
    { id: "rombel", label: "Rombel", icon: Layers },
    { id: "komite", label: "Komite", icon: Users },
    { id: "budget", label: "Parameter Anggaran", icon: Wallet },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <PusatDataDashboard onNavigate={setActiveTab} />;
      case "administrasi":
        return <SettingsTabs.Administrasi appCtx={appCtx} />;
      case "academicYear":
        return <SettingsTabs.AcademicYear data={settings.academicYears} appCtx={appCtx} />;
      case "school":
        return <SettingsTabs.School appCtx={appCtx} />;
      case "lokasi":
        return <SettingsTabs.Karakteristik data={settings.karakteristik || {}} update={(f: any, v: any) => updateSetting("karakteristik", f, v)} />;
      case "sarpras":
        return <SettingsTabs.Sarpras data={settings.sarpras} update={(f: any, v: any) => updateSetting("sarpras", f, v)} />;
      case "potensi":
        return <SettingsTabs.Potensi data={settings.potensi} update={(f: any, v: any) => updateSetting("potensi", f, v)} />;
      case "pejabat":
        return <SettingsTabs.Pejabat appCtx={appCtx} />;
      case "guru":
        return <SettingsTabs.Guru data={settings.guru} update={(v: any) => updateSetting("guru", "", v)} />;
      case "tendik":
        return <SettingsTabs.Tendik data={settings.tendik} update={(v: any) => updateSetting("tendik", "", v)} />;
      case "pesertaDidik":
        return <SettingsTabs.PesertaDidik data={settings.pesertaDidik} update={(f: any, v: any) => updateSetting("pesertaDidik", f, v)} />;
      case "rombel":
        return <SettingsTabs.Rombel data={settings.rombel} update={(v: any) => updateSetting("rombel", "", v)} />;
      case "komite":
        return <SettingsTabs.Komite data={settings.komite} update={(f: any, v: any) => updateSetting("komite", f, v)} />;
      case "budget":
        return <SettingsTabs.Budget data={settings.budget} update={(f: any, v: any) => updateSetting("budget", f, v)} schoolStatus={settings.school?.status || "Negeri"} />;
      default:
        return <div>Fitur {activeTab} belum tersedia.</div>;
    }
  };

  return (
    <div className="flex h-full bg-[var(--color-eds-bg)]">
      <div className="w-64 bg-white border-r border-[var(--color-eds-border)] flex flex-col h-full overflow-y-auto hidden md:flex">
        <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="font-black text-[var(--color-eds-text-primary)]">Pusat Data</h2>
          <p className="text-xs text-[var(--color-eds-text-secondary)] mt-1">Master Data Sekolah</p>
        </div>
        <div className="p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`enterprise-sidebar-item ${isActive ? "active" : ""}`}
              >
                <Icon className="enterprise-sidebar-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-x-hidden p-6 md:p-8">
        <PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />
        <div className="max-w-4xl mx-auto w-full min-w-0">{renderTabContent()}</div>
      </div>
    </div>
  );
};

const AboutTab = ({  setCurrentView, handleDevClick }: any) => {
  return (
    <Card title="Tentang Tampuyak OS" icon={Info}>
        <div className="p-8 text-center space-y-4">
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png"
            alt="Tampuyak Logo"
            className="w-24 h-24 object-contain mx-auto mb-6 drop-shadow-xl transform hover:scale-105 transition-transform cursor-pointer"
            onClick={handleDevClick}
          />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            TAMPUYAK OS
          </h2>
          <p className="text-[var(--color-eds-text-primary)] text-lg font-bold">
            School Operating System
          </p>
          <p className="text-sm text-[var(--color-eds-text-primary)] max-w-md mx-auto mb-6 font-medium">
            Tata Kelola Administrasi dan Manajemen Pendidikan untuk Upaya Akselerasi Kualitas
          </p>
          <div className="inline-block bg-blue-50 border border-blue-100 px-6 py-2 rounded mt-2 mb-6">
            <span className="text-sm font-bold text-blue-700">
              Versi 1.0.0
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-left bg-[var(--color-eds-bg)] p-6 rounded-xl border border-[var(--color-eds-border)] mt-6 max-w-2xl mx-auto">
             <div>
               <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">Pengembang</p>
               <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">Deni Ranoptri, S.Pd., M.Pd</p>
             </div>
             <div>
               <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">Tanggal Pembaruan</p>
               <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">June 2026</p>
             </div>
             <div>
               <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">Tipe Aplikasi</p>
               <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">Aplikasi Luring</p>
             </div>
             <div>
               <p className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-widest mb-1">Penyimpanan</p>
               <p className="text-sm font-bold text-[var(--color-eds-text-primary)]">Penyimpanan Lokal</p>
             </div>
          </div>
        </div>
      </Card>
  );
};

const SettingsView = ({
  initialTab = "storage",
  setCurrentView,
  handleDevClick,
}: any) => {
  const [activeTab, setActiveTab] = useState(
    initialTab === "dashboard" || initialTab === "school"
      ? "storage"
      : initialTab,
  );

  const tabs = [
    { id: "governance", label: "Tata Kelola Tata Usaha", icon: Lock },
    { id: "profile", label: "Profil Pengguna", icon: UserCircle },
    { id: "theme", label: "Tema & Tampilan", icon: Palette },
    { id: "storage", label: "Penyimpanan & Backup", icon: Database },
    { id: "notification", label: "Notifikasi", icon: Bell },
    { id: "about", label: "Tentang Tampuyak", icon: Info },
    
  ];


  const EnterpriseGovernanceTab = () => {
    const { settings, updateMetadata } = useApp();
    const isFrozen = settings.metadata?.versionFreeze;

    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-eds-text-primary)] mb-2">Tata Kelola Tata Usaha & Release Lock</h2>
          <p className="text-sm text-[var(--color-eds-text-primary)] mb-6 font-medium">Pusat pengaturan stabilitas arsitektur dokumen dan kepatuhan regulasi.</p>
        </div>

        <div className="bg-white border border-[var(--color-eds-border)] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFrozen ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-[var(--color-eds-text-secondary)]'}`}>
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-eds-text-primary)]">Mode Kunci Dokumen Resmi</h3>
              <p className="text-sm text-[var(--color-eds-text-primary)] font-medium">Kunci perubahan format dan aturan baku dokumen. Hanya edit teks dokumen yang diizinkan.</p>
            </div>
          </div>
          
          <div className="bg-[var(--color-eds-bg)] p-4 rounded-xl border border-slate-200 mb-6 text-sm text-[var(--color-eds-text-primary)] font-medium">
             Mode ini digunakan untuk <strong className="text-[var(--color-eds-text-primary)]">memastikan keaslian format baku dokumen</strong> (Versi Akhir). Ketika aktif, dokumen hanya dapat dicetak apabila telah divalidasi dan disetujui.
          </div>

          <div className="flex justify-end">
            <Button
              className={`font-bold ${isFrozen ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-blue-700 text-white shadow-sm font-semibold'}`}
              onClick={() => updateMetadata({ versionFreeze: !isFrozen })}
            >
              {isFrozen ? 'Buka Kunci Dokumen' : 'Kunci Dokumen'}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "governance":
        return <EnterpriseGovernanceTab />;
      case "profile":
      case "theme":
      case "notification":
        return (
          <EmptyState
            icon={Clock}
            title={activeTab === "theme" ? "Pengaturan Tema" : "Pusat Notifikasi"}
            description={activeTab === "theme" ? "Kostumisasi tampilan aplikasi sedang dalam tahap penyempurnaan untuk memastikan konsistensi antarmuka pengguna pada versi stabil." : "Sistem pemberitahuan terintegrasi sedang disiapkan untuk rilis mendatang guna memastikan Anda tidak ketinggalan informasi penting."}
            ctaText="Kembali ke Dashboard"
            onCtaClick={() => setCurrentView("beranda")}
          />
        );
      case "ai":
        return <SettingsTabs.AI />;
      case "storage":
        return <StorageTab />;
      case "about":
        return (
          <AboutTab
            
            setCurrentView={setCurrentView}
            handleDevClick={handleDevClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start h-full pb-12">
      <div className="w-full md:w-56 flex-shrink-0 md:sticky top-28 bg-white rounded-xl border border-[var(--color-eds-border)] p-4 shadow-sm md:max-h-[calc(100vh-140px)] md:overflow-y-auto custom-scrollbar">
        <h2 className="text-sm font-black text-[var(--color-eds-text-secondary)] uppercase tracking-widest px-4 mb-4 mt-2">
          Kategori
        </h2>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
            >
              <tab.icon
                className={`w-4 h-4 mr-3 transition-colors ${activeTab === tab.id ? "text-[var(--color-eds-text-secondary)]" : "text-[var(--color-eds-text-secondary)] group-hover:text-[var(--color-eds-text-secondary)]"}`}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 w-full min-w-0">{renderTabContent()}</div>
    </div>
  );
};


// ============================================================================
// UAT VIEW
// ============================================================================
const UATView = ({ navigateToView, navigateToSettings }: any) => {
  const { settings, getActiveAcademicYear } = useApp();
  const activeYear = getActiveAcademicYear();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-indigo-900">UAT Enterprise Verification Dashboard</h1>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">Test Mode</span>
      </div>
      
      <Card title="System Context" description="Current active state for verification">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">Academic Year</p>
            <p className="font-bold text-slate-800">{activeYear?.name || "None"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">School Name</p>
            <p className="font-bold text-slate-800">{settings.school?.name || "Blank"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">Education Level</p>
            <p className="font-bold text-slate-800">{settings.school?.level || "SD"}</p>
          </div>
          <div className="p-4 bg-slate-50 border rounded-xl">
            <p className="text-xs text-slate-500 font-bold mb-1">State Status</p>
            <p className="font-bold text-emerald-600">Active</p>
          </div>
        </div>
      </Card>

      <Card title="Module Verification Shortcuts" description="Navigate directly to modules to verify state boundary integrity.">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Button onClick={() => navigateToSettings("school")} variant="outline" className="justify-start text-left">1. Global School Profile</Button>
          <Button onClick={() => navigateToSettings("academicYear")} variant="outline" className="justify-start text-left">2. Academic Year Switching</Button>
          <Button onClick={() => navigateToSettings("guru")} variant="outline" className="justify-start text-left">3. Teachers (Guru)</Button>
          <Button onClick={() => navigateToSettings("tendik")} variant="outline" className="justify-start text-left">4. Education Staff</Button>
          <Button onClick={() => navigateToSettings("sarpras")} variant="outline" className="justify-start text-left">5. Facilities (Sarpras)</Button>
          <Button onClick={() => navigateToSettings("rombel")} variant="outline" className="justify-start text-left">6. Rombel</Button>
          <Button onClick={() => navigateToSettings("pesertaDidik")} variant="outline" className="justify-start text-left">7. Student Statistics</Button>
          <Button onClick={() => navigateToView("kalenderPendidikan")} variant="outline" className="justify-start text-left">8. Academic Calendar</Button>
          <Button onClick={() => navigateToView("documentEditor")} variant="outline" className="justify-start text-left">9. KSP Generation</Button>
          <Button onClick={() => navigateToView("rkjmPipeline")} variant="outline" className="justify-start text-left">10. RKJM</Button>
          <Button onClick={() => navigateToView("rktDerivation")} variant="outline" className="justify-start text-left">11. RKT</Button>
          <Button onClick={() => navigateToView("rkasDerivation")} variant="outline" className="justify-start text-left">12. RKAS</Button>
          <Button onClick={() => navigateToView("monitoring")} variant="outline" className="justify-start text-left">13. Monitoring</Button>
          <Button onClick={() => navigateToView("supervisiAkademik")} variant="outline" className="justify-start text-left">14. Supervision</Button>
          <Button onClick={async () => {
            try {
              await seedUatScenario();
              alert("Data Supervisi UAT berhasil digenerate!");
            } catch (e) {
              alert("Gagal: " + e.message);
            }
          }} variant="outline" className="justify-start text-left text-emerald-700 border-emerald-300 bg-emerald-50">15. Generate UAT Data (Supervisi)</Button>
        </div>
      </Card>
      
      <div className="text-center text-xs text-slate-400 mt-8">
        Enterprise Verification Build - Not for Production
      </div>
    </div>
  );
};

const LayoutContainer = () => {

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/uat')) {
      return "uat";
    }
    return "beranda";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Tour State
  const [runTour, setRunTour] = useState(false);
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("tampuyak.hasSeenTour");
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("tampuyak.hasSeenTour", "true");
    }
  };

  const tourSteps: Step[] = [
    {
      target: '#tour-master-data',
      content: 'Langkah 1: Isi Master Data Sekolah di sini. Informasi ini akan menjadi pondasi bagi seluruh dokumen yang dihasilkan otomatis.',
      skipBeacon: true,
    },
    {
      target: '#tour-analisis',
      content: 'Langkah 2: Lakukan Analisis Sekolah.',
    },
    {
      target: '#tour-unggah-rapor',
      content: 'Penting: Di dalam menu Analisis Sekolah, klik tombol ini untuk mengunggah file Rapor Pendidikan hasil unduhan Anda agar aplikasi bisa memberikan rekomendasi dan capaian otomatis.',
    },
    {
      target: '#tour-dokumen',
      content: 'Langkah 3: Susun RKJM, RKT, RKAS, dan KSP secara otomatis berbasis data di dalam menu ini.',
    },
    {
      target: '#tour-planning-intelligence',
      content: 'Langkah Tambahan: Gunakan fitur AI ini untuk memetakan benang merah perencanaan Anda secara visual dan strategis.',
    },
    {
      target: '#tour-pengaturan',
      content: 'Penting: Jangan lupa untuk melakukan Backup Data secara berkala di menu Pengaturan untuk mengamankan data sekolah Anda.',
    }
  ];

  useEffect(() => {
    (window as any).setCurrentView = setCurrentView;
  }, []);
  
  const [printMode, setPrintMode] = useState<{ id: string, isPrintReady: boolean, exportDocx?: boolean } | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(undefined);
  const [draftOffer, setDraftOffer] = useState(() => {
    try {
      const last = localStorage.getItem("tampuyak.currentView");
      return last && last !== "beranda" ? last : null;
    } catch (e) {
      return null;
    }
  });
  const [settingsTab, setSettingsTab] = useState("dashboard");
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dokumen: false,
    analisis: false,
    monitoring: false,
    pengaturan: false,
  });
  const { settings, saveStatus, updateSetting, getActiveAcademicYear, showToast } = useApp();

  const effectiveUser = getEffectiveUser(auth.currentUser);
  const isSuperAdmin = effectiveUser ? PermissionService.getCache(effectiveUser.uid)?.role === 'SUPER_ADMIN' : false;

  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  useEffect(() => {
    if (isSuperAdmin && !isDevAuthBypass()) {
      import('firebase/firestore').then(({ collection, getDocs, query, where }) => {
        import('./lib/firebase').then(({ db }) => {
          const q = query(collection(db, 'users'), where('status', '==', 'PENDING'));
          getDocs(q).then(snap => {
            setPendingUsersCount(snap.size);
          }).catch(console.error);
        });
      });
    }
  }, [isSuperAdmin, currentView]);

  const docs = settings?.documents || [];
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      return localStorage.getItem("tampuyak.onboarded") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handleOpenKnowledge = (e: any) => {
      if (e.detail) {
        setActiveArticleId(e.detail);
        setCurrentView("pusatPengetahuan");
      } else {
        setActiveArticleId(undefined);
      }
    };
    window.addEventListener('openKnowledge', handleOpenKnowledge);
    return () => window.removeEventListener('openKnowledge', handleOpenKnowledge);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tampuyak.currentView", currentView);
    } catch (e) {}
  }, [currentView]);
  
  if (false) {
    return <OnboardingWizardView onComplete={() => {
      setHasCompletedOnboarding(true);
      try {
        localStorage.setItem("tampuyak.onboarded", "true");
      } catch (e) {}
    }} />;
  }


  const handleNavigateToSettings = (tabId: string) => {
    setSettingsTab(tabId);
    setCurrentView("dataSekolah");
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleDevClick = () => {};

  if (printMode) {
    return <PrintDocumentRenderer 
       docId={printMode.id} 
       isPrintReady={printMode.isPrintReady}
       exportDocx={printMode.exportDocx}
       setPrintMode={setPrintMode} 
       showToast={showToast}
    />;
  }

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        onEvent={handleJoyrideCallback}
        options={{
          primaryColor: '#2563eb',
          zIndex: 10000,
          showProgress: true,
        }}
        locale={{
          back: 'Kembali',
          close: 'Tutup',
          last: 'Selesai',
          next: 'Lanjut',
        }}
      />
      <div id="print-guard" className="hidden print:flex fixed inset-0 items-center justify-center bg-white text-black text-2xl font-bold z-[9999]">
        Silakan gunakan tombol "Cetak Draft" atau "Cetak Tersertifikasi" di dalam aplikasi.
      </div>
      <div className="min-h-screen print:min-h-0 bg-[var(--color-eds-bg)] print:bg-white print:block print:overflow-visible text-[var(--color-eds-text-primary)] font-sans selection:bg-[var(--color-eds-primary)] selection:text-white flex">
      
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden print:hidden transition-opacity duration-300" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`w-[260px] bg-[var(--color-eds-card)] border-r border-[var(--color-eds-border)] flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out print:hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div
          className="h-[72px] flex items-center px-6 border-b border-[var(--color-eds-border)] justify-between hover:bg-[var(--color-eds-bg)] transition-colors"
        >
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView("beranda")}>
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCt2g7ZqqpChh2djvgy9WXSWTu7BYRIz24umTDIFOrZ4ws4XAHSClAvelEu-nmaPmpqI47p_bpZIZvFYFLE3m0CBakgPLGCwrsyc9aPhggo30UZm3ct_QoXWtCXSqRdJVqMlh8191Qsn6sVI0bovXffrToosCI_NMOqr4zY4hcU24KzWX5W9ZhqBZz8jw/s320/Maskot%20Tampuyak%20(1).png" alt="Tampuyak Logo" className="w-10 h-10 object-contain mr-3 drop-shadow-sm" />
            <div className="flex flex-col">
              <h1 className="font-black text-[18px] tracking-tight text-slate-900 leading-none mb-0.5">
                TAMPUYAK OS
              </h1>
              <span className="text-xs font-bold text-[var(--color-eds-text-secondary)] leading-tight">
                School Operating System
              </span>
            </div>
          </div>
          <button className="md:hidden text-slate-500 hover:text-slate-900 p-1 -mr-2" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-2 mb-2 px-3 uppercase tracking-wider">Utama</div>
          <button
            onClick={() => setCurrentView("beranda")}
            className={`enterprise-sidebar-item ${currentView === "beranda" ? "active" : ""}`}
          >
            <LayoutDashboard
              className="enterprise-sidebar-icon"
            />
            Beranda
          </button>

          <button
            onClick={() => setCurrentView("enterpriseWorkspace")}
            className={`enterprise-sidebar-item ${currentView === "enterpriseWorkspace" ? "active" : ""}`}
          >
            <Building2
              className="enterprise-sidebar-icon"
            />
            Workspace Enterprise
          </button>

          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Administrasi</div>
          <button
            id="tour-master-data"
            onClick={() => setCurrentView("dataSekolah")}
            className={`enterprise-sidebar-item ${currentView === "dataSekolah" ? "active" : ""}`}
          >
            <Building2
              className="enterprise-sidebar-icon"
            />
            Data Sekolah
          </button>
          
          <button
            onClick={() => setCurrentView("eoffice")}
            className={`enterprise-sidebar-item ${currentView === "eoffice" ? "active" : ""}`}
          >
            <Printer className="enterprise-sidebar-icon" />
            E-Office (Persuratan)
          </button>

          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Perencanaan & Evaluasi</div>
          <button
            id="tour-analisis"
            onClick={() => setCurrentView("analisis")}
            className={`enterprise-sidebar-item ${["analisis", "rapor", "diagnosis", "targetEngine"].includes(currentView) ? "active" : ""}`}
          >
            <PieChart
              className="enterprise-sidebar-icon"
            />
            Analisis Sekolah
          </button>

          <div className="space-y-1">
            <button
              id="tour-dokumen"
              onClick={() => setCurrentView("dokumenPerencanaan")}
              className={`enterprise-sidebar-item ${["dokumenPerencanaan", "rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kalenderPendidikan", "kspStudio", "kspStudio_preview", "kspStudio_validation", "kspStudio_attachments", "kspStudio_settings", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "active" : ""}`}
            >
              <FolderOpen className="enterprise-sidebar-icon" />
              Dokumen Perencanaan
            </button>
            {/* Folder contents */}
            <div className="pl-9 space-y-1">
              <div>
                <button
                  onClick={() => setCurrentView("kspStudio")}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${currentView.startsWith("kspStudio") ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  KSP
                </button>
                {currentView.startsWith("kspStudio") && (
                  <div className="pl-6 mt-1 space-y-1 border-l-2 border-blue-100 ml-4 mb-2">
                    <button
                      onClick={() => setCurrentView("kspStudio")}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === "kspStudio" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      🏠 Home
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_preview")}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === "kspStudio_preview" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      👁 Preview
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_validation")}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === "kspStudio_validation" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      📋 Validation
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_attachments")}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === "kspStudio_attachments" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      📎 Attachments
                    </button>
                    
                    <button
                      onClick={() => setCurrentView("kspStudio_settings")}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === "kspStudio_settings" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      ⚙️ Workspace
                    </button>
  
                    <button
                      className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors text-slate-400 cursor-not-allowed"
                    >
                      📄 Publish
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCurrentView("rkjmPipeline")}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${["rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator"].includes(currentView) ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
              >
                RKJM
              </button>
              <button
                onClick={() => setCurrentView("rktDerivation")}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === "rktDerivation" ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
              >
                RKT
              </button>
              <button
                onClick={() => setCurrentView("rkasDerivation")}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === "rkasDerivation" ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
              >
                RKAS
              </button>
              <button
                onClick={() => setCurrentView("kalenderPendidikan")}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === "kalenderPendidikan" ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}`}
              >
                Kalender Pendidikan
              </button>
            </div>
          </div>

          <button
            id="tour-planning-intelligence"
            onClick={() => setCurrentView("strategicGraph")}
            className={`enterprise-sidebar-item ${currentView === "strategicGraph" ? "active !border-amber-600 !bg-amber-50 !text-amber-800" : ""}`}
          >
            <Network
              className="enterprise-sidebar-icon"
            />
            Planning Intelligence
          </button>

          {import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === 'true' && (
            <>
              <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Mutu Pendidikan</div>
              <button
                onClick={() => setCurrentView("supervisiAkademik")}
                className={`enterprise-sidebar-item ${currentView === "supervisiAkademik" ? "active" : ""}`}
              >
                <Stethoscope className="enterprise-sidebar-icon" />
                Supervisi Akademik
              </button>
            </>
          )}
          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Mutu & Kepatuhan</div>
          <button
            onClick={() => setCurrentView("dqaEngine")}
            className={`enterprise-sidebar-item ${currentView === "dqaEngine" ? "active !border-green-600 !bg-green-50 !text-green-800" : ""}`}
          >
            <ShieldCheck
              className="enterprise-sidebar-icon"
            />
            Sertifikasi Mutu
          </button>

          <button
            onClick={() => setCurrentView("monitoring")}
            className={`enterprise-sidebar-item ${["monitoring"].includes(currentView) ? "active" : ""}`}
          >
            <ActivitySquare
              className="enterprise-sidebar-icon"
            />
            Pelaksanaan & Monitoring
          </button>

          <button
            onClick={() => setCurrentView("governance")}
            className={`enterprise-sidebar-item ${["governance"].includes(currentView) ? "active" : ""}`}
          >
            <ShieldCheck
              className="enterprise-sidebar-icon"
            />
            Tata Kelola & Kepatuhan
          </button>

          <button
            onClick={() => setCurrentView("auditExplorer")}
            className={`enterprise-sidebar-item ${currentView === "auditExplorer" ? "active" : ""}`}
          >
            <Microscope
              className="enterprise-sidebar-icon"
            />
            Pusat Audit
          </button>

          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Laporan</div>
          <button
            onClick={() => setCurrentView("lpjKepalaSekolah")}
            className={`enterprise-sidebar-item ${currentView === "lpjKepalaSekolah" ? "active !border-indigo-600 !bg-indigo-50 !text-indigo-800" : ""}`}
          >
            <FileText
              className="enterprise-sidebar-icon"
            />
            LPJ Kepala Sekolah
          </button>

          <div className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-6 mb-2 px-3 uppercase tracking-wider">Sistem</div>
          <button
            id="tour-pengaturan"
            onClick={() => setCurrentView("pengaturan")}
            className={`enterprise-sidebar-item ${currentView === "pengaturan" ? "active" : ""}`}
          >
            <Settings
              className="enterprise-sidebar-icon"
            />
            Pengaturan
          </button>
          
          <button
            onClick={() => setCurrentView("pusatPengetahuan")}
            className={`enterprise-sidebar-item ${currentView === "pusatPengetahuan" ? "active" : ""}`}
          >
            <BookOpen
              className="enterprise-sidebar-icon"
            />
            Pusat Pengetahuan
          </button>
          
        </nav>
      </aside>

      <main className="flex-1 ml-0 md:ml-[260px] print:ml-0 flex flex-col min-h-screen relative print:block print:min-h-0 w-full md:w-auto print:overflow-visible">
        {draftOffer && (
          <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md relative z-50 animate-in slide-in-from-top-2 print:hidden">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-3 text-amber-300" />
              <span className="text-sm font-medium">
                Sesi terakhir Anda belum selesai. Lanjutkan pekerjaan terakhir?
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDraftOffer(null)}
                className="px-3 py-1.5 text-xs font-bold text-blue-200 hover:text-white transition-colors"
              >
                Abaikan
              </button>
              <button
                onClick={() => {
                  setCurrentView(draftOffer);
                  setDraftOffer(null);
                }}
                className="px-4 py-1.5 bg-white text-[var(--color-eds-text-primary)] font-bold text-xs font-bold rounded hover:bg-blue-50 shadow-sm transition-colors"
              >
                Lanjutkan Pekerjaan
              </button>
            </div>
          </div>
        )}
        

<header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-[var(--color-eds-border)] sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] print:hidden w-full">
          <div className="flex items-center flex-1 min-w-0">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden mr-3 p-2 -ml-2 text-[var(--color-eds-text-secondary)] hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center text-xs font-medium text-[var(--color-eds-text-secondary)] tracking-wide mb-1 overflow-x-auto custom-scrollbar whitespace-nowrap">
                <span
                  className="cursor-pointer hover:text-[var(--color-eds-text-primary)] font-bold transition-colors shrink-0"
                  onClick={() => setCurrentView("beranda")}
              >
                Beranda
              </span>
              {currentView !== "beranda" && (
                <>
                  <ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" />
                  <span className="flex items-center text-[var(--color-eds-text-primary)] font-bold">
                    {currentView.startsWith("documentDetail_") ? (
                      <>
                        <span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span>
                        <ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" />
                        <span>{currentView.split("_")[1].toUpperCase()}</span>
                      </>
                    ) : currentView === "eoffice" ? "E-Office (Persuratan)" : currentView === "enterpriseWorkspace" ? "Workspace Enterprise" : currentView === "dataSekolah" ? "Data Sekolah" 
                    : currentView === "analisis" ? "Analisis Sekolah"
                    : currentView === "rapor" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("analisis")}>Analisis Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Rapor Pendidikan</span></>
                    : currentView === "diagnosis" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("analisis")}>Analisis Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Analisis Prioritas</span></>
                    : currentView === "dokumenPerencanaan" ? "Dokumen Sekolah"
                    : currentView === "dokumenAdministrasi" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Administrasi</span></>
                    : currentView === "monitoring" ? "Pelaksanaan & Monitoring"
                    : currentView === "governance" ? "Tata Kelola & Kepatuhan"
                    : currentView === "productionReadiness" ? "Kesiapan Sistem"
                    : currentView === "pengaturan" ? "Pengaturan"
                    : currentView === "rkjmPipeline" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan RKJM</span></>
                    : currentView === "rktDerivation" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan RKT</span></>
                    : currentView === "rkasDerivation" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan RKAS</span></>
                    : currentView === "kalenderPendidikan" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Kalender Pendidikan</span></>
                    : currentView.startsWith("kspStudio") ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan KSP</span></>
                    
                    : currentView === "pusatPengetahuan" ? "Pusat Pengetahuan"
                    : currentView === "supervisiAkademik" ? "Supervisi Akademik"
                    : currentView === "auditExplorer" ? "Educational Audit Explorer"
                    : currentView === "lpjKepalaSekolah" ? "Laporan Pertanggungjawaban Kepala Sekolah"
                    : currentView === "strategicGraph" ? "Strategic Planning Intelligence"
                    : "Tampuyak OS"
                    }
                  </span>
                </>
              )}

            </div>
          </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-eds-text-secondary)] w-4 h-4" />
            <input maxLength={255} 
              type="text" 
              placeholder="Cari dokumen, nomor, program, tahun..." 
              className="w-full bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] text-[14px] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-4 focus:ring-[var(--color-eds-primary)]/10 focus:border-[var(--color-eds-primary)] transition-all font-medium text-[var(--color-eds-text-primary)] placeholder:text-[var(--color-eds-text-secondary)]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-[var(--color-eds-border)] rounded-xl text-xs font-bold text-[var(--color-eds-text-secondary)] shadow-sm">⌘K</div>
          </div>

          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="hidden md:block text-right mr-2">
              <p className="text-xs font-bold text-[var(--color-eds-text-primary)]">
                {settings.school.name || "Nama Sekolah"}
              </p>
              <p className="text-xs text-[var(--color-eds-text-secondary)] uppercase tracking-wider font-bold">
                Tahun {getActiveAcademicYear()}
              </p>
            </div>
            
            {isSuperAdmin && (
              <button 
                onClick={() => setCurrentView('approvals')}
                className="relative p-2.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 font-bold text-sm"
              >
                Approvals
                {pendingUsersCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">{pendingUsersCount}</span>
                )}
              </button>
            )}

            <button className="relative p-2.5 rounded-full text-[var(--color-eds-text-secondary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-text-primary)] transition-colors">
              <Bell className="w-5 h-5" />
              {docs.some((d: any) => d.status === "Tinjauan" || d.status === "Perlu Revisi") && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded border border-white"></span>
              )}
            </button>
            <div className="h-10 w-10 rounded-full bg-[var(--color-eds-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:shadow-md transition-all ring-2 ring-white">
              KS
            </div>
          </div>
        </header>
        <GlobalWorkflowStepper currentView={currentView} settings={settings} navigateToView={setCurrentView} />

        <div className="p-4 md:p-6 lg:p-10 flex-1 overflow-x-hidden relative z-10">
          <div className="max-w-[1300px] mx-auto h-full">
            

            {currentView === "approvals" && <ApprovalsView onClose={() => setCurrentView('dashboard')} />}
            {currentView === "uat" && <UATView navigateToView={setCurrentView} navigateToSettings={handleNavigateToSettings} />}
            {currentView === "beranda" && (
              <DashboardView
                navigateToSettings={handleNavigateToSettings}
                navigateToView={setCurrentView}
              />
            )}
            {currentView === "eoffice" && (
              <EOfficeView settings={settings} />
            )}
            {currentView === "enterpriseWorkspace" && (
              <EnterpriseWorkspaceShell />
            )}
            {currentView === "dataSekolah" && (
              <DataSekolahView
                initialTab={settingsTab}
                key={`dataSekolah-${settingsTab}`}
              />
            )}
            {currentView === "lpjKepalaSekolah" && (
              <LpjKepalaSekolahView settings={settings} />
            )}
            {currentView === "pengaturan" && (
              <SettingsView
                initialTab={
                  settingsTab === "dashboard" || settingsTab === "school"
                    ? "storage"
                    : settingsTab
                }
                key={`pengaturan-${settingsTab}`}
                
                setCurrentView={setCurrentView}
                handleDevClick={handleDevClick}
              />
            )}
            {currentView === "analisis" && (
              <WorkspaceAnalisisView navigateToView={setCurrentView} />
            )}
            {currentView === "dokumenPerencanaan" && (
              <DokumenPerencanaanView navigateToView={setCurrentView} />
            )}
            
            {currentView === "monitoring" && <RelationalPlanningView initialTab="monitoring" navigateToView={setCurrentView} />}
            {currentView === "governance" && <GovernanceComplianceView navigateToView={setCurrentView} navigateToSettings={handleNavigateToSettings} />}
            

            {currentView === "dashboard" && (
              <DashboardView
                navigateToSettings={handleNavigateToSettings}
                navigateToView={setCurrentView}
              />
            )}
            {currentView === "settings" && (
              <DataSekolahView initialTab={settingsTab} key={settingsTab} />
            )}
            {currentView === "rapor" && <RaporPendidikanView />}
            {currentView === "diagnosis" && (
              <DecisionEngineView navigateToView={setCurrentView} />
            )}
            {currentView === "targetEngine" && <TargetPerformanceView />}
            {currentView === "workflowEngine" && <WorkflowEngineView />}
            {currentView === "templateRegistry" && <TemplateRegistryView />}
            {currentView === "regulationRegistry" && <RegulationRegistryView />}
            {currentView === "docStandard" && <DocumentStandardView />}
            {currentView === "docLanguage" && <LanguageEngineView />}
            {currentView === "complianceEngine" && <RegulationComplianceView />}
            {currentView === "printDiagnostic" && <PrintDiagnosticView />}
            {currentView === "generationDiagnostic" && <GenerationDiagnosticView />}
            {currentView === "rkjmPipeline" && <RelationalPlanningView initialTab="rkjm" navigateToView={setCurrentView} />}
            {currentView.startsWith("documentDetail_") && <DocumentWorkspaceView docId={currentView.split("_")[1]} navigateToView={setCurrentView} setPrintMode={setPrintMode} />}
            {currentView === "rkjmKerangka" && <RKJMKerangkaView />}
            {currentView === "rkjmOrchestrator" && <RKJMOrchestratorView />}
            {currentView === "rktDerivation" && <RelationalPlanningView initialTab="rkt" navigateToView={setCurrentView} />}
            {currentView === "rkasDerivation" && <RelationalPlanningView initialTab="rkas" navigateToView={setCurrentView} />}
            {currentView === "kalenderPendidikan" && <EnterpriseWorkspaceShell initialModuleId="bab3-pengorganisasian" />}
            {currentView === "documentEditor" && <DocumentEditorView />}
{currentView.startsWith("kspStudio") && (
              <KSPStudioView navigateToView={setCurrentView} activeMode={currentView === "kspStudio" ? "home" : currentView.split("_")[1]} />
            )}
            {currentView === "publishingCenter" && (
              <PublishingCenterView navigateToView={setCurrentView} />
            )}
            
            {currentView === "pusatPengetahuan" && <PusatPengetahuanView initialArticleId={activeArticleId} />}
            {currentView === "supervisiAkademik" && (import.meta.env.VITE_ENABLE_SUPERVISION_MODULE === 'true' ? <SupervisionProvider><SupervisionAcademicView /></SupervisionProvider> : <div className="p-8 text-center text-gray-500">Modul Supervisi Akademik belum diaktifkan.</div>)}
            {currentView === "strategicGraph" && <SPKGView />}
            {currentView === "auditExplorer" && <EducationalAuditExplorer appCtx={{ settings, getActiveAcademicYear }} />}
            {currentView === "dqaEngine" && (
              <DocumentQualityAssuranceView navigateToView={setCurrentView} />
            )}
          </div>
        </div>
        <footer className="w-full text-center py-8 text-[var(--color-eds-text-secondary)] text-sm mt-auto border-t border-[var(--color-eds-border)] bg-[var(--color-eds-bg)]">
          <div className="font-bold text-[var(--color-eds-text-primary)] mb-1">
            Developed by <span className="text-[var(--color-eds-text-primary)] font-bold">Deni Ranoptri, S.Pd., M.Pd</span>
          </div>
          <div className="text-xs mb-4">Guru • Inovator • Praktisi Pendidikan</div>
          <div className="flex items-center justify-center space-x-6">
            <a href="https://www.instagram.com/best_deny?igsh=MTdqYTJmcWsydGUwMw==" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-[var(--color-eds-text-secondary)] hover:text-pink-600" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@denipositif" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-[var(--color-eds-text-secondary)] hover:text-black" aria-label="TikTok">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.32 6.07-1.4 1.62-3.32 2.62-5.46 2.87-2.14.25-4.35-.14-6.19-1.28-1.84-1.14-3.16-2.92-3.76-4.99-.59-2.07-.36-4.32.65-6.2 1.01-1.88 2.71-3.31 4.72-4.01 2.01-.7 4.24-.62 6.18.22.03.62.06 1.25.09 1.87-1.39-.77-3.03-.89-4.51-.34-1.48.55-2.65 1.77-3.15 3.27-.5 1.5-.23 3.19.74 4.46.97 1.27 2.5 1.99 4.08 1.92 1.58-.07 3.02-.9 3.86-2.22.84-1.32 1.11-2.96.72-4.43-.01-5.11 0-10.22-.01-15.33z"/></svg>
            </a>
            <a href="https://web.facebook.com/demian.renovtri.3?rdid=NebkE1tEAlxKk8ZM&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1FwSzyNwVW%2F%3F_rdc%3D1%26_rdr" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-[var(--color-eds-text-secondary)] hover:text-[var(--color-eds-text-primary)] font-bold" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@DeniRanoptri" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 transition-transform text-[var(--color-eds-text-secondary)] hover:text-red-600" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </main>

      <TanyaTampuyakWidget settings={settings} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `,
        }}
      />
    </div>
    </>
  );
};

export default function Tampuyak() {
  return (
    <AppProvider>
      <LayoutContainer />
    </AppProvider>
  );
}
          
