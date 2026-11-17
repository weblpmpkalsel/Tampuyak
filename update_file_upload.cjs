const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldHandleFileUpload = `    const handleFileUpload = (key: string) => (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Validation
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
         alert("Format file tidak didukung. Gunakan PNG, JPG, atau SVG.");
         return;
      }
      if (file.size > 5 * 1024 * 1024) {
         alert("Ukuran file maksimal 5 MB.");
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        updateVisual(key, base64Str);
      };
      reader.readAsDataURL(file);
    };`;
    
const newHandleFileUpload = `    const handleFileUpload = (key: string) => (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Validation
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
         alert("Format file tidak didukung. Gunakan PNG, JPG, atau SVG.");
         return;
      }
      if (file.size > 5 * 1024 * 1024) {
         alert("Ukuran file maksimal 5 MB.");
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        
        // Resize and compress to avoid localStorage quota issues
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
          
          // Use original format if PNG (for transparency) or SVG, else JPEG
          const exportFormat = file.type === 'image/png' || file.type === 'image/svg+xml' ? 'image/png' : 'image/jpeg';
          const compressedBase64 = canvas.toDataURL(exportFormat, 0.7);
          updateVisual(key, compressedBase64);
        };
        img.src = base64Str;
      };
      reader.readAsDataURL(file);
    };`;

if (content.includes(oldHandleFileUpload)) {
  content = content.replace(oldHandleFileUpload, newHandleFileUpload);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
