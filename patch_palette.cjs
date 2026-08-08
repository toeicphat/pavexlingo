const fs = require('fs');
let code = fs.readFileSync('components/QuestionPalette.tsx', 'utf8');

code = code.replace(
    'markedForReview?: Set<string>;\n}',
    'markedForReview?: Set<string>;\n  isSubmitted?: boolean;\n  results?: Record<string, boolean>;\n}'
);

const oldLogic = `        if (isActive) {
          buttonClasses += 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300';
        } else if (isAnswered) {
          buttonClasses += 'bg-slate-700 text-white border-slate-800';
        } else {
          buttonClasses += 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100';
        }`;

const newLogic = `        if (isSubmitted && results) {
          if (results[questionId]) {
            buttonClasses += 'bg-green-500 text-white border-green-600';
          } else {
            buttonClasses += 'bg-red-500 text-white border-red-600';
          }
          if (isActive) {
            buttonClasses += ' ring-2 ring-blue-500 ring-offset-1';
          }
        } else {
          if (isActive) {
            buttonClasses += 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300';
          } else if (isAnswered) {
            buttonClasses += 'bg-slate-700 text-white border-slate-800';
          } else {
            buttonClasses += 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100';
          }
        }`;

code = code.replace(oldLogic, newLogic);
code = code.replace(
    'const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions, answers, currentQuestionIndex, onQuestionSelect, markedForReview }) => {',
    'const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions, answers, currentQuestionIndex, onQuestionSelect, markedForReview, isSubmitted, results }) => {'
);

fs.writeFileSync('components/QuestionPalette.tsx', code);
