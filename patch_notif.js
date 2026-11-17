const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const targetStr = `  const notifications = [];

  if (healthScore < 50) {`;

const replaceStr = `  const notifications = [];

  if (!settings.school?.name || !settings.school?.npsn) {
    notifications.unshift({
      title: "Profil Sekolah Belum Lengkap",
      desc: "Profil sekolah Anda belum lengkap. Silakan klik untuk melengkapi sekarang.",
      type: "danger",
      action: () => navigateToSettings("school"),
    });
  }

  if (healthScore < 50) {`;

fs.writeFileSync('src/Tampuyak.tsx', content.replace(targetStr, replaceStr));
