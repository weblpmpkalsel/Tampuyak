import * as LucideIcons from "lucide-react";

const importedIcons = [
  "LayoutDashboard", "Settings", "Building2", "UserCircle", "Users", "BookOpen", "Wallet",
  "Palette", "Sparkles", "Layout", "Database", "CheckCircle2", "AlertCircle", "Download",
  "Upload", "Trash2", "ChevronRight", "RefreshCw", "Save", "X", "XCircle", "Image",
  "UploadCloud", "MoreVertical", "Check", "Info", "GitCompare", "FileJson", "AlertTriangle",
  "Lock", "FileText", "Calculator", "Mail", "CheckSquare", "ArrowRight", "ShieldCheck",
  "Rocket", "Gauge", "Layers", "FileBadge", "Terminal", "Target", "Lightbulb", "Server",
  "HardDrive", "Clock", "Activity", "Award", "CheckCircle", "Cpu", "ListChecks", "BarChart2",
  "Briefcase", "ChevronDown", "Network", "BookMarked", "FileSpreadsheet", "BrainCircuit",
  "ActivitySquare", "Scale", "Home", "UserCheck", "PieChart", "Plus", "Search", "Edit2",
  "Map", "MapPin", "Compass", "Star", "Camera", "Globe", "GripVertical", "Calendar", "Play",
  "Crosshair", "Printer", "FileCode", "FileSignature", "ShieldAlert", "GitCommit", "Share2",
  "FolderOpen", "Eye", "Edit3", "Bell", "Zap", "MessageSquare", "History", "AlignLeft",
  "AlignCenter", "AlignRight", "AlignJustify", "List", "FileEdit", "RefreshCcw", "Coins",
  "Link", "Wrench", "FileArchive", "QrCode", "BarChart3", "HelpCircle", "Library", "ChevronLeft",
  "ZoomIn", "ZoomOut", "ArrowDown", "Milestone", "Archive", "Code", "Instagram", "Facebook",
  "Youtube", "Maximize", "Minimize", "Bold", "Italic", "Underline", "Undo", "Redo", "FileDown",
  "Link2", "ExternalLink", "ThumbsUp", "Microscope"
];

for (const icon of importedIcons) {
  if (!LucideIcons[icon]) {
    console.error("Missing icon:", icon);
  }
}
console.log("Done checking icons.");
