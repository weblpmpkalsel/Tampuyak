const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldHandleFileUpload = `  const handleFileUpload = (e: any) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split("\\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const parsedData = [];
      const errors: any = {};
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(",");
        let rowObj: any = {};
        let rowHasError = false;
        
        headers.forEach((h, index) => {
          const val = values[index]?.trim() || "";
          rowObj[h] = val;
          if (activeType === "guru" && h === "nama" && !val) {
             rowHasError = true;
             if (!errors[i]) errors[i] = [];
             errors[i].push("Nama wajib diisi");
          }
        });
        
        rowObj._index = i;
        rowObj._hasError = rowHasError;
        parsedData.push(rowObj);
      }
      
      setPreviewData(parsedData);
      setValidationErrors(errors);
    };
    reader.readAsText(uploaded);
  };`;

const newHandleFileUpload = `  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e: any) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);
    setIsImporting(true);
    setImportProgress(0);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split("\\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      const parsedData: any[] = [];
      const errors: any = {};
      
      let currentIndex = 1;
      const chunkSize = 50;

      const processChunk = () => {
        const end = Math.min(currentIndex + chunkSize, lines.length);
        
        for (let i = currentIndex; i < end; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",");
          let rowObj: any = {};
          let rowHasError = false;
          
          headers.forEach((h, index) => {
            const val = values[index]?.trim() || "";
            rowObj[h] = val;
            if (activeType === "guru" && h === "nama" && !val) {
               rowHasError = true;
               if (!errors[i]) errors[i] = [];
               errors[i].push("Nama wajib diisi");
            }
          });
          
          rowObj._index = i;
          rowObj._hasError = rowHasError;
          parsedData.push(rowObj);
        }
        
        currentIndex = end;
        setImportProgress(Math.round((currentIndex / lines.length) * 100));
        
        if (currentIndex < lines.length) {
          setTimeout(processChunk, 0); // Yield to main thread
        } else {
          setPreviewData(parsedData);
          setValidationErrors(errors);
          setIsImporting(false);
          setImportProgress(0);
        }
      };
      
      processChunk();
    };
    reader.readAsText(uploaded);
  };`;

code = code.replace(oldHandleFileUpload, newHandleFileUpload);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed chunk import');
