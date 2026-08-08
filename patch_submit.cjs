const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');
code = code.replace(/Submit Test/g, 'Nộp bài');
fs.writeFileSync('components/TestScreen.tsx', code);
