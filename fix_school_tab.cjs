const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldSchoolTab = `  School: ({ data, update }: any) => {
    const handleImageUpload = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert("File terlalu besar"); return; }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">`;

const newSchoolTab = `  School: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const data = settings.school;
    const update = (f: any, v: any) => updateSetting("school", f, v);
    
    const identitasData = settings.identitas;
    const updateIdentitas = (f: any, v: any) => updateSetting("identitas", f, v);

    const handleImageUpload = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert("File terlalu besar"); return; }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">`;

code = code.replace(oldSchoolTab, newSchoolTab);

const oldDataSekolahSchool = `      case "school":
        return (
          <SettingsTabs.School
            data={settings.school}
            update={(f: any, v: any) => updateSetting("school", f, v)}
          />
        );`;
const newDataSekolahSchool = `      case "school":
        return (
          <SettingsTabs.School appCtx={appCtx} />
        );`;
code = code.replace(oldDataSekolahSchool, newDataSekolahSchool);

fs.writeFileSync('src/Tampuyak.tsx', code);
