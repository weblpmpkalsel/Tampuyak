import fs from 'fs';

const path = 'src/ksp/KSPAttachmentPanel.tsx';
let code = fs.readFileSync(path, 'utf-8');

const oldAtts = `  const attachments = [
    { name: 'Kalender Pendidikan', status: 'Missing', source: 'Unggah Manual', severity: 'Critical' },
    { name: 'SK Tim Pengembang Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major' },
    { name: 'SK Penetapan Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major' },
    { name: 'Jadwal Pelajaran', status: 'Available', source: 'Sinkronisasi Rapor Pendidikan', severity: 'Info' },
    { name: 'Berita Acara', status: 'Missing', source: 'Knowledge Builder', severity: 'Major' },
    { name: 'Dokumen Pendukung', status: 'Missing', source: 'Unggah Manual', severity: 'Minor' },
  ];`;

const newAtts = `  const attachments = [
    { name: 'Kalender Pendidikan', status: 'Missing', source: 'Unggah Manual', severity: 'Critical', type: 'Manual' },
    { name: 'SK Tim Pengembang Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major', type: 'Manual' },
    { name: 'SK Penetapan Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major', type: 'Manual' },
    { name: 'Jadwal Pelajaran', status: 'Available', source: 'Sinkronisasi Rapor Pendidikan', severity: 'Info', type: 'Generated' },
    { name: 'Berita Acara', status: 'Missing', source: 'Knowledge Builder', severity: 'Major', type: 'Generated' },
    { name: 'Dokumen Pendukung', status: 'Missing', source: 'Unggah Manual', severity: 'Minor', type: 'Manual' },
  ];`;

code = code.replace(oldAtts, newAtts);

const oldButtons = `               <div className="flex space-x-2">
                 {att.source === 'Knowledge Builder' ? (
                   <Button variant="outline" size="sm">Generate Draft</Button>
                 ) : null}
                 <Button size="sm" variant={att.status === 'Available' ? "outline" : "default"}>
                   {att.status === 'Available' ? 'Perbarui' : 'Upload'}
                 </Button>
               </div>`;

const newButtons = `               <div className="flex space-x-2">
                 {att.type === 'Generated' ? (
                   <>
                     <Button size="sm" variant="outline">{att.status === 'Available' ? 'Refresh' : 'Generate'}</Button>
                     <Button size="sm" variant="outline" disabled={att.status === 'Missing'}>Preview</Button>
                   </>
                 ) : (
                   <>
                     <Button size="sm" variant={att.status === 'Available' ? "outline" : "default"}>
                       {att.status === 'Available' ? 'Replace' : 'Upload'}
                     </Button>
                     <Button size="sm" variant="outline" disabled={att.status === 'Missing'}>Preview</Button>
                   </>
                 )}
               </div>`;

code = code.replace(oldButtons, newButtons);
fs.writeFileSync(path, code);
