const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `  useEffect(() => {
    setSaveStatus("saving");
    const saveToLocal = setTimeout(() => {
      try {
        const dataToSave = { ...settings, timestamp: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to save", error);
      }
    }, 800);
    return () => clearTimeout(saveToLocal);
  }, [settings]);`;

const replacement = `  useEffect(() => {
    setSaveStatus("saving");
    const dataToSave = { ...settings, timestamp: Date.now() };
    const saveToLocal = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setSaveStatus("saved");
      } catch (error) {
        setSaveStatus("error");
        console.error("Failed to save", error);
      }
    }, 800);
    
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(saveToLocal);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [settings]);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done beforeunload');
