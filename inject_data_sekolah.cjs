const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 w-full min-w-0">{renderTabContent()}</div>',
  '<div className="flex-1 w-full min-w-0">\n        <PageHelp title="Data Sekolah" description="Pusat pengaturan profil, identitas, sarana prasarana, dan tenaga pendidik." importance="Menjadi sumber data utama bagi seluruh dokumen yang akan dihasilkan secara otomatis." nextStep="Lengkapi seluruh informasi secara akurat pada setiap tab." />\n        {renderTabContent()}\n      </div>'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
