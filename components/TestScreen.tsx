import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// FIX: Imported missing types for test data and user answers.
import { TestData, UserAnswers, Question, QuestionOption } from '../types';
import Timer from './Timer';
import QuestionPalette from './QuestionPalette';
import AudioPlayer from './AudioPlayer';
import AddVocabPopup from './AddVocabPopup';
import { useWordSelection } from './useWordSelection';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface TestScreenProps {
  testData: TestData;
  userAnswers: UserAnswers;
  onSubmit: (answers: UserAnswers) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ testData, userAnswers: initialAnswers, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [time, setTime] = useState(testData.duration);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!isSubmitted) return undefined;
    const res = {};
    testData.questions.forEach(q => {
      res[q.id] = answers[q.id] === q.correctAnswer;
    });
    return res;
  }, [isSubmitted, testData, answers]);

  const contentRef = useRef<HTMLDivElement>(null);
  const { selectionPopup, toastMessage, handleMouseUp, handleSaveWord } = useWordSelection(contentRef);
  
  const currentQuestion = testData.questions[currentQuestionIndex];
  const getOptionClasses = (optionKey: QuestionOption) => {
    if (!isSubmitted) {
      return answers[currentQuestion.id] === optionKey ? 'bg-blue-100 border-blue-500 shadow-sm' : 'bg-white border-slate-300 hover:border-blue-400';
    }
    const isCorrect = optionKey === currentQuestion.correctAnswer;
    const isSelected = answers[currentQuestion.id] === optionKey;
    if (isCorrect) return 'bg-green-100 border-green-500 shadow-sm';
    if (isSelected && !isCorrect) return 'bg-red-100 border-red-500 shadow-sm';
    return 'bg-white border-slate-300 opacity-60';
  };

  const handleTimeUp = useCallback(() => {
    if (!isSubmitted) {
      setIsSubmitted(true);
    }
  }, [isSubmitted]);

  const handleAnswerSelect = (questionId: number | string, option: QuestionOption) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
       {toastMessage && (
          <div className="fixed bottom-5 right-5 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
              {toastMessage}
          </div>
        )}
      {selectionPopup && <AddVocabPopup top={selectionPopup.top} left={selectionPopup.left} onSave={handleSaveWord} />}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg border" ref={contentRef} onMouseUp={handleMouseUp}>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Question {currentQuestionIndex + 1} of {testData.questions.length}</h2>
          
          {currentQuestion.part === 1 && currentQuestion.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
                <img src={currentQuestion.image} alt="TOEIC Part 1" className="w-full object-cover"/>
            </div>
          )}

          {currentQuestion.audioScript && (
            <div className="mb-6">
                <p className="font-semibold text-slate-700 mb-2">Listen to the audio:</p>
                <AudioPlayer audioScript={currentQuestion.audioScript} />
            </div>
          )}

          <div className="text-lg text-slate-800 mb-6 space-y-2">
             <p dangerouslySetInnerHTML={{ __html: currentQuestion.questionText.replace(/____/g, '<span class="font-bold text-blue-600">____</span>') }} />
          </div>

          <div className="space-y-3">
            {(Object.keys(currentQuestion.options) as QuestionOption[]).map(optionKey => (
              currentQuestion.options[optionKey] && (
                 <label key={optionKey} className={`flex items-start p-4 border rounded-lg transition-all duration-200 ${!isSubmitted ? 'cursor-pointer' : ''} ${getOptionClasses(optionKey)}`}>
                    <div className="flex-shrink-0 mt-1 flex items-center">
                        {!isSubmitted && (
                            <input 
                                type="radio" 
                                name={`question-${currentQuestion.id}`} 
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
          )}
        </div>

        {/* Right Sidebar */}
        <div className="mt-8 lg:mt-0 space-y-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain pl-2 pr-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                {!isSubmitted && <Timer initialTime={time} onTimeUp={handleTimeUp} />}
                {!isSubmitted ? (
                    <button 
                        onClick={() => setIsSubmitted(true)}
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
                )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h3 className="text-lg font-bold mb-4">Question Palette</h3>
                <QuestionPalette 
                    questions={testData.questions}
                    answers={answers} 
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionSelect={goToQuestion}
                    isSubmitted={isSubmitted}
                    results={results}
                />
                 <div className="flex justify-between mt-6">
                    <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="px-4 py-2 bg-slate-200 rounded-md font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300">Previous</button>
                    <button onClick={goToNext} disabled={currentQuestionIndex === testData.questions.length - 1} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700">Next</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
