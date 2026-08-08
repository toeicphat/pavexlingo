const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');

code = code.replace(
    'lg:overflow-y-auto custom-scrollbar pl-2 pr-4',
    'lg:overflow-y-auto pl-2 pr-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600'
);

fs.writeFileSync('components/TestScreen.tsx', code);
