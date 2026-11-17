const fs = require('fs');

const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const navStart = '<div className="flex items-center"><Database className="w-4 h-4 mr-2" /> Sertifikasi Data</div>\\n            </button>';

const newNav = '<div className="flex items-center"><Database className="w-4 h-4 mr-2" /> Sertifikasi Data</div>\\n            </button>\\n            <button onClick={() => setActiveTab("review")} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-4 ${activeTab === "review" ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-slate-600 hover:bg-slate-100 border border-transparent"}`}><div className="flex items-center"><Award className="w-4 h-4 mr-2" /> Sertifikasi Mutu</div></button>';

code = code.replace(navStart, newNav);

const toolbarStart = '<Button variant="ghost" className={`w-9 h-9 p-0 ${activeTab === "coverage" ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => setActiveTab("coverage")} title="Data Coverage Engine">\\n            <Database className="w-5 h-5" />\\n          </Button>';

code = code.replace(/<Button variant="ghost" className=\\{\`w-9 h-9 p-0 \\$\\{activeTab === 'coverage'.*?<Database className="w-5 h-5" \/>\n          <\/Button>/s, '<Button variant="ghost" className={`w-9 h-9 p-0 ${activeTab === "coverage" ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => setActiveTab("coverage")} title="Data Coverage Engine">\\n            <Database className="w-5 h-5" />\\n          </Button>\\n          <Button variant="ghost" className={`w-9 h-9 p-0 ${activeTab === "review" ? "bg-amber-100 text-amber-700" : "text-slate-600 hover:bg-slate-100"}`} onClick={() => setActiveTab("review")} title="Enterprise Quality Review">\\n            <Award className="w-5 h-5" />\\n          </Button>');

fs.writeFileSync(file, code);
console.log("Updated navigation and toolbar for review tab via replace");
