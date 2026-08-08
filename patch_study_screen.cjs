const fs = require('fs');
let code = fs.readFileSync('components/StudyScreen.tsx', 'utf8');

code = code.replace(
    "import React from 'react';",
    "import React from 'react';\nimport SelectionCard from './SelectionCard';"
);

code = code.replace(
    "interface StudyScreenProps {\n  onBack: () => void;\n}",
    "interface StudyScreenProps {\n  onBack: () => void;\n  onStartPart5Test: () => void;\n}"
);

code = code.replace(
    "const StudyScreen: React.FC<StudyScreenProps> = ({ onBack }) => {",
    "const StudyScreen: React.FC<StudyScreenProps> = ({ onBack, onStartPart5Test }) => {"
);

code = code.replace(
    "        <p className=\"mt-4 text-lg text-slate-600 dark:text-slate-400\">\n          Chức năng đang được phát triển...\n        </p>\n      </div>",
    "        <p className=\"mt-4 text-lg text-slate-600 dark:text-slate-400\">\n          Luyện tập các phần bài đọc TOEIC.\n        </p>\n      </div>\n      \n      <div className=\"max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">\n        <SelectionCard \n            title=\"Chuyên sâu Part 5 tổng hợp 2026 - 100 câu\"\n            description=\"Bài luyện tập trắc nghiệm ngữ pháp và từ vựng Part 5.\"\n            onClick={onStartPart5Test}\n        />\n      </div>"
);

fs.writeFileSync('components/StudyScreen.tsx', code);
