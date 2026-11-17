const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldGroups = `  const menuGroups = [
    {
      title: "Identitas Sekolah",`;

const newGroups = `  const menuGroups = [
    {
      title: "Ringkasan",
      items: [
        { id: "dashboard", label: "Dashboard Data", icon: LayoutDashboard }
      ]
    },
    {
      title: "Identitas Sekolah",`;

code = code.replace(oldGroups, newGroups);
fs.writeFileSync('src/Tampuyak.tsx', code);
