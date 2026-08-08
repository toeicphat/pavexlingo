const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');
code = code.replace("import { CheckCircleIcon, XCircleIcon } from 'lucide-react';", "import { CheckCircleIcon, XCircleIcon } from './icons';");
fs.writeFileSync('components/TestScreen.tsx', code);
