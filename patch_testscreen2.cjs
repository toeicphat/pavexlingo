const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');

// 1. Add lucide imports
code = code.replace(
    "import { useWordSelection } from './useWordSelection';",
    "import { useWordSelection } from './useWordSelection';\nimport { CheckCircleIcon, XCircleIcon } from 'lucide-react';"
);

// 2. Add useMemo to imports
code = code.replace(
    "import React, { useState, useEffect, useCallback, useRef } from 'react';",
    "import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';"
);

// 3. Add states and memos
const stateInject = `  const [time, setTime] = useState(testData.duration);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!isSubmitted) return undefined;
    const res = {};
    testData.questions.forEach(q => {
      res[q.id] = answers[q.id] === q.correctAnswer;
    });
    return res;
  }, [isSubmitted, testData, answers]);
`;
code = code.replace("  const [time, setTime] = useState(testData.duration);", stateInject);

// 4. Update handleTimeUp
const oldTimeUp = `  const handleTimeUp = useCallback(() => {
    onSubmit(answers);
  }, [onSubmit, answers]);`;
const newTimeUp = `  const handleTimeUp = useCallback(() => {
    if (!isSubmitted) {
      setIsSubmitted(true);
    }
  }, [isSubmitted]);`;
code = code.replace(oldTimeUp, newTimeUp);

// 5. Update handleAnswerSelect
const oldAnswerSelect = `  const handleAnswerSelect = (questionId: number | string, option: QuestionOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };`;
const newAnswerSelect = `  const handleAnswerSelect = (questionId: number | string, option: QuestionOption) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };`;
code = code.replace(oldAnswerSelect, newAnswerSelect);

// 6. getOptionClasses helper
const renderHelpers = `  const getOptionClasses = (optionKey: QuestionOption) => {
    if (!isSubmitted) {
      return answers[currentQuestion.id] === optionKey ? 'bg-blue-100 border-blue-500 shadow-sm' : 'bg-white border-slate-300 hover:border-blue-400';
    }
    const isCorrect = optionKey === currentQuestion.correctAnswer;
    const isSelected = answers[currentQuestion.id] === optionKey;
    if (isCorrect) return 'bg-green-100 border-green-500 shadow-sm';
    if (isSelected && !isCorrect) return 'bg-red-100 border-red-500 shadow-sm';
    return 'bg-white border-slate-300 opacity-60';
  };`;

code = code.replace(
    'const currentQuestion = testData.questions[currentQuestionIndex];',
    'const currentQuestion = testData.questions[currentQuestionIndex];\n' + renderHelpers
);

// 7. Update options mapping
const oldOptionsMap = `            {(Object.keys(currentQuestion.options) as QuestionOption[]).map(optionKey => (
              currentQuestion.options[optionKey] && (
                 <label key={optionKey} className={\`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 \${answers[currentQuestion.id] === optionKey ? 'bg-blue-100 border-blue-500 shadow-sm' : 'bg-white border-slate-300 hover:border-blue-400'}\`}>
                    <input 
                        type="radio" 
                        name={\`question-\${currentQuestion.id}\`} 
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={answers[currentQuestion.id] === optionKey}
                        onChange={() => handleAnswerSelect(currentQuestion.id, optionKey)}
                    />
                    <span className="ml-4 text-base text-slate-700"><span className="font-bold">{optionKey}.</span> {currentQuestion.options[optionKey]}</span>
                 </label>
              )
            ))}`;

const newOptionsMap = `            {(Object.keys(currentQuestion.options) as QuestionOption[]).map(optionKey => (
              currentQuestion.options[optionKey] && (
                 <label key={optionKey} className={\`flex items-start p-4 border rounded-lg transition-all duration-200 \${!isSubmitted ? 'cursor-pointer' : ''} \${getOptionClasses(optionKey)}\`}>
                    <div className="flex-shrink-0 mt-1 flex items-center">
                        {!isSubmitted && (
                            <input 
                                type="radio" 
                                name={\`question-\${currentQuestion.id}\`} 
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                checked={answers[currentQuestion.id] === optionKey}
                                onChange={() => handleAnswerSelect(currentQuestion.id, optionKey)}
                            />
                        )}
                        {isSubmitted && answers[currentQuestion.id] === optionKey && answers[currentQuestion.id] !== currentQuestion.correctAnswer && <XCircleIcon className="h-5 w-5 text-red-600"/>}
                        {isSubmitted && optionKey === currentQuestion.correctAnswer && <CheckCircleIcon className="h-5 w-5 text-green-600"/>}
                    </div>
                    <span className="ml-4 text-base text-slate-700"><span className="font-bold">{optionKey}.</span> {currentQuestion.options[optionKey]}</span>
                 </label>
              )
            ))}
          </div>
          {isSubmitted && currentQuestion.explanation && (
            <div className="mt-6 bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h5 className="font-bold text-slate-800">Giải thích:</h5>
                <p className="text-slate-600 mt-2 whitespace-pre-wrap">{currentQuestion.explanation}</p>
            </div>
          )}`;

code = code.replace(oldOptionsMap, newOptionsMap);

// 8. Update sidebar button
const oldButton = `<button 
                    onClick={() => { 
                        const unanswered = testData.questions.length - Object.keys(answers).length;
                        const msg = unanswered > 0 
                            ? \`Bạn còn \${unanswered} câu chưa làm. Bạn có chắc chắn muốn nộp bài không?\` 
                            : 'Bạn có chắc chắn muốn nộp bài không?';
                        if(window.confirm(msg)) onSubmit(answers); 
                    }}
                    className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    Nộp bài
                </button>`;

const newButton = `{!isSubmitted ? (
                    <button 
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
                    </button>
                ) : (
                    <button 
                        onClick={() => onSubmit(answers)}
                        className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Hoàn thành
                    </button>
                )}`;

code = code.replace(oldButton, newButton);

// 9. Pass props to QuestionPalette
code = code.replace(
    'onQuestionSelect={goToQuestion}\n                />',
    'onQuestionSelect={goToQuestion}\n                    isSubmitted={isSubmitted}\n                    results={results}\n                />'
);

// 10. Hide timer if submitted, or just leave it
code = code.replace(
    '<Timer initialTime={time} onTimeUp={handleTimeUp} />',
    '{!isSubmitted && <Timer initialTime={time} onTimeUp={handleTimeUp} />}'
);

fs.writeFileSync('components/TestScreen.tsx', code);
