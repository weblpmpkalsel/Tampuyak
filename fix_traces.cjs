const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf-8');
const target = `  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {`;
const replace = `  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [traces, setTraces] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'health' || activeTab === 'dashboard') {
        import('../services/admin/identityTraceService').then(m => m.IdentityTraceService.getTraces(50).then(setTraces));
      }`;
code = code.replace(target, replace);
fs.writeFileSync('src/control/ControlCenter.tsx', code);
console.log('done');
