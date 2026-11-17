cat << 'INNER_EOF' > /tmp/pending_patch.js
const fs = require('fs');
const file = 'src/portal/PendingPage.tsx';

const newCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-amber-100 mb-6">
          <Clock className="h-12 w-12 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Terima kasih.</h2>
        <p className="text-slate-600 mb-8 px-4 text-lg">
          Permohonan sekolah Anda telah diterima.<br/>
          Administrator akan melakukan verifikasi sebelum workspace sekolah diaktifkan.
        </p>
        
        <div className="mt-8">
          <Link to="/" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, newCode);
INNER_EOF
node /tmp/pending_patch.js
