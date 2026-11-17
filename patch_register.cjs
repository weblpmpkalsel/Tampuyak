const fs = require('fs');
let code = fs.readFileSync('src/portal/RegisterPage.tsx', 'utf8');

// Logo
code = code.replace(
  'className="w-16 h-16 object-contain"',
  'className="w-[72px] h-[72px] md:w-24 md:h-24 object-contain"'
);

// Heading
code = code.replace(
  'text-3xl font-bold tracking-tight text-slate-900',
  'text-[36px] md:text-3xl font-bold tracking-tight text-slate-900'
);

// Inputs and Selects
code = code.replace(/className="block w-full appearance-none/g, 'className="block w-full min-h-[48px] appearance-none');
code = code.replace(/className="block w-full rounded-md border/g, 'className="block w-full min-h-[48px] rounded-md border');

// Button
code = code.replace(
  'className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"',
  'className="flex w-full min-h-[50px] items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"'
);

// Col-span-2 adjustments
code = code.replace(/className="col-span-2"/g, 'className="col-span-1 md:col-span-2"');
code = code.replace(/className="col-span-2 mt-4"/g, 'className="col-span-1 md:col-span-2 mt-4"');

fs.writeFileSync('src/portal/RegisterPage.tsx', code);
