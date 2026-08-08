const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');

const oldButton = `<button 
                        onClick={() => { 
                            const unanswered = testData.questions.length - Object.keys(answers).length;
                            const msg = unanswered > 0 
                                ? \`Bạn còn \${unanswered} câu chưa làm. Bạn có chắc chắn muốn nộp bài không?\` 
                                : 'Bạn có chắc chắn muốn nộp bài không?';
                            if(window.confirm(msg)) setIsSubmitted(true); 
                        }}
                        className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Nộp bài
                    </button>`;

const newButton = `<button 
                        onClick={() => setIsSubmitted(true)}
                        className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Nộp bài
                    </button>`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('components/TestScreen.tsx', code);
