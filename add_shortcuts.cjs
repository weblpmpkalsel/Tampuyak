const fs = require('fs');
const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = /const handlePrint = \(\) => {\\s*if \(!isPrintReady\) return showToast\("Dokumen belum siap dicetak. Periksa Health Score.", "error"\);\\s*setTimeout\(\(\) => window.print\(\), 100\);\\s*};/;

const replacement = `const handlePrint = () => {
     if (!isPrintReady) return showToast("Dokumen belum siap dicetak. Periksa Health Score.", "error");
     setTimeout(() => window.print(), 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showToast("Draft berhasil disimpan", "success");
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
  }, [isPrintReady]);`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Added keyboard shortcuts");
