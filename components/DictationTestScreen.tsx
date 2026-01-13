import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LibraryDictationExercise, UserAnswers, DictationMode } from '../types';
import AudioPlayer from './AudioPlayer';
import QuestionPalette from './QuestionPalette';
import { ArrowLeftIcon, LightBulbIcon, XCircleIcon, QuestionMarkCircleIcon } from './icons';

interface DictationTestScreenProps {
    testData: { id: number; title: string; exercises: LibraryDictationExercise[] };
    onBack: () => void;
    mode: DictationMode;
}

const HintBox: React.FC<{onClose: () => void}> = ({onClose}) => (
    <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-r-lg mb-6 relative">
        <div className="flex">
            <div className="flex-shrink-0">
                <LightBulbIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-bold">Pro Tip for Dictation</h3>
                <p className="text-sm mt-1">Listen to the full sentence first to understand the context. Then, focus on the sounds of the missing words. Don't worry about perfect spelling on the first try; you can correct it before checking.</p>
            </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700" aria-label="Close hint">
            <XCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </button>
    </div>
);

const DictationTestScreen: React.FC<DictationTestScreenProps> = ({ testData, onBack, mode }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [allUserAnswers, setAllUserAnswers] = useState<{ [exerciseId: number]: string[] }>({});
    const [checkedExercises, setCheckedExercises] = useState<{ [exerciseId: number]: boolean }>({});
    const [showHint, setShowHint] = useState(true);
    const exerciseRefs = useRef<Record<number, HTMLDivElement | null>>({});

    // Hard mode structure generation
    const getHardModeItems = (fullText: string) => {
        // Regex to split by words while preserving punctuation and whitespace
        const tokens = fullText.split(/(\b\w+\b)/);
        const missingWords: string[] = [];
        const displayStructure: { text: string; isBlank: boolean; blankIndex?: number }[] = [];
        
        let blankCount = 0;
        tokens.forEach(token => {
            if (/^\w+$/.test(token)) {
                displayStructure.push({ text: '', isBlank: true, blankIndex: blankCount });
                missingWords.push(token);
                blankCount++;
            } else if (token) {
                displayStructure.push({ text: token, isBlank: false });
            }
        });
        
        return { missingWords, displayStructure };
    };

    // Store hard mode structures per exercise
    const hardModeStructures = useMemo(() => {
        const structures: { [exerciseId: number]: { missingWords: string[]; displayStructure: any[] } } = {};
        if (mode === 'hard') {
            testData.exercises.forEach(ex => {
                structures[ex.id] = getHardModeItems(ex.fullText);
            });
        }
        return structures;
    }, [testData, mode]);

    useEffect(() => {
        const initialAnswers: { [exerciseId: number]: string[] } = {};
        const initialChecked: { [exerciseId: number]: boolean } = {};
        testData.exercises.forEach(ex => {
            const count = mode === 'hard' ? hardModeStructures[ex.id].missingWords.length : ex.missingWords.length;
            initialAnswers[ex.id] = new Array(count).fill('');
            initialChecked[ex.id] = false;
        });
        setAllUserAnswers(initialAnswers);
        setCheckedExercises(initialChecked);
        setCurrentExerciseIndex(0);
        exerciseRefs.current = {};
    }, [testData, mode, hardModeStructures]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const intersectingEntry = entries.find(entry => entry.isIntersecting);
                if (intersectingEntry) {
                    const index = parseInt(intersectingEntry.target.getAttribute('data-index') || '0', 10);
                    setCurrentExerciseIndex(index);
                }
            },
            { 
                rootMargin: '-40% 0px -60% 0px',
                threshold: 0 
            }
        );

        const refs = exerciseRefs.current;
        const validRefs = Object.values(refs).filter(ref => ref !== null) as HTMLDivElement[];
        validRefs.forEach(ref => observer.observe(ref));

        return () => {
            validRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [testData.exercises]);

    const handleTestInputChange = (exerciseId: number, index: number, value: string) => {
        setAllUserAnswers(prev => ({
            ...prev,
            [exerciseId]: prev[exerciseId].map((ans, i) => i === index ? value : ans)
        }));
    };

    const handleCheckTestAnswers = (exerciseId: number) => {
        setCheckedExercises(prev => ({ ...prev, [exerciseId]: true }));
    };

    const handleTryAgainTest = (exerciseId: number) => {
        const exercise = testData.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;
        const count = mode === 'hard' ? hardModeStructures[exerciseId].missingWords.length : exercise.missingWords.length;
        setCheckedExercises(prev => ({ ...prev, [exerciseId]: false }));
        setAllUserAnswers(prev => ({ ...prev, [exerciseId]: new Array(count).fill('') }));
    };
    
    const goToExercise = (index: number) => {
         if (index >= 0 && index < testData.exercises.length) {
            exerciseRefs.current[index]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    };

    const goToNext = () => {
        if (currentExerciseIndex < testData.exercises.length - 1) {
            goToExercise(currentExerciseIndex + 1);
        }
    };

    const goToPrev = () => {
        if (currentExerciseIndex > 0) {
            goToExercise(currentExerciseIndex - 1);
        }
    };

    const renderTextWithInputsForTest = (exercise: LibraryDictationExercise) => {
        const isCurrentlyChecked = checkedExercises[exercise.id] || false;
        const currentAnswers = allUserAnswers[exercise.id] || [];

        if (mode === 'hard') {
            const { missingWords, displayStructure } = hardModeStructures[exercise.id];
            return (
                <div className="text-lg md:text-xl leading-[3.5rem] text-slate-700 dark:text-slate-300">
                    {displayStructure.map((item, idx) => {
                        if (!item.isBlank) {
                            return <span key={idx}>{item.text}</span>;
                        }
                        const bIdx = item.blankIndex!;
                        const missingWord = missingWords[bIdx];
                        const userAnswer = currentAnswers[bIdx] || '';
                        const isCorrect = userAnswer.trim().toLowerCase() === missingWord.trim().toLowerCase();

                        let inputClassName = "mx-0.5 px-1 py-0 border-b-2 bg-slate-100 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-t-sm";
                        if (isCurrentlyChecked) {
                            inputClassName += isCorrect ? ' border-green-500 text-green-700 dark:text-green-400' : ' border-red-500 text-red-700 dark:text-red-400';
                        } else {
                            inputClassName += ' border-slate-300 dark:border-slate-500';
                        }

                        return (
                            <span key={idx} className="inline-block relative">
                                <input 
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => handleTestInputChange(exercise.id, bIdx, e.target.value)}
                                    disabled={isCurrentlyChecked}
                                    className={inputClassName}
                                    style={{ width: `${Math.max(missingWord.length, 3)}ch` }}
                                    aria-label={`Blank number ${bIdx + 1}`}
                                />
                                {isCurrentlyChecked && !isCorrect && (
                                    <span className="absolute left-0 -bottom-6 text-xs text-green-600 dark:text-green-400 font-bold whitespace-nowrap z-10">{missingWord}</span>
                                )}
                            </span>
                        );
                    })}
                </div>
            );
        }

        // Easy Mode (Default)
        const parts = exercise.textWithBlanks.split(/_{2,}/);
        return (
            <p className="text-lg md:text-xl leading-[3.5rem] text-slate-700 dark:text-slate-300">
                {parts.map((part, index) => {
                    const isLastPart = index === parts.length - 1;
                    const missingWord = exercise.missingWords[index] || '';
                    const userAnswer = currentAnswers[index] || '';
                    const isCorrect = userAnswer.trim().toLowerCase() === missingWord.trim().toLowerCase();
                    
                    let inputClassName = "mx-1 px-2 py-1 border-b-2 bg-slate-100 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:outline-none focus:border-blue-500 transition-colors duration-200 rounded-t-md";
                    if (isCurrentlyChecked) {
                        inputClassName += isCorrect ? ' border-green-500 text-green-700 dark:text-green-400' : ' border-red-500 text-red-700 dark:text-red-400';
                    } else {
                        inputClassName += ' border-slate-300 dark:border-slate-500';
                    }

                    return (
                        <React.Fragment key={index}>
                            {part}
                            {!isLastPart && (
                                <span className="inline-block relative mx-1">
                                    <input 
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => handleTestInputChange(exercise.id, index, e.target.value)}
                                        disabled={isCurrentlyChecked}
                                        className={inputClassName}
                                        style={{ width: `${Math.max(missingWord.length, 8)}ch` }}
                                        aria-label={`Blank number ${index + 1}`}
                                    />
                                    {isCurrentlyChecked && !isCorrect && (
                                        <span className="absolute left-1 -bottom-6 text-sm text-green-600 dark:text-green-400 font-semibold z-10">{missingWord}</span>
                                    )}
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </p>
        );
    };
    
    const paletteAnswers: UserAnswers = Object.entries(checkedExercises).reduce((acc, [key, value]) => {
        acc[key] = value ? 'A' : null;
        return acc;
    }, {} as UserAnswers);

    return (
        <div className="container mx-auto p-4 lg:p-8">
             <div className="max-w-7xl mx-auto">
                { !showHint && (
                    <button onClick={() => setShowHint(true)} className="fixed top-24 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700" aria-label="Show hint">
                        <QuestionMarkCircleIcon className="h-6 w-6" />
                    </button>
                )}
                <button onClick={onBack} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Chọn phần khác
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{testData.title}</h2>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${mode === 'easy' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {mode === 'easy' ? 'Easy Mode' : 'Hard Mode'}
                    </span>
                </div>
                { showHint && <HintBox onClose={() => setShowHint(false)} /> }
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         {testData.exercises.map((exercise, index) => {
                            const isExerciseChecked = checkedExercises[exercise.id];
                            const userAnswersForExercise = allUserAnswers[exercise.id] || [];
                            const missingWordsList = mode === 'hard' ? hardModeStructures[exercise.id].missingWords : exercise.missingWords;

                            const score = userAnswersForExercise.reduce((acc, answer, idx) => {
                                const correctAnswer = missingWordsList[idx] || '';
                                return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase() ? acc + 1 : acc;
                            }, 0);

                            return (
                                <div 
                                    key={exercise.id}
                                    ref={el => { exerciseRefs.current[index] = el; }}
                                    data-index={index}
                                    className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 scroll-mt-24"
                                >
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">{exercise.title} ({index + 1}/{testData.exercises.length})</h3>
                                    <div className="mb-8">
                                        <AudioPlayer 
                                            audioSrc={exercise.audioSrc}
                                            audioScript={exercise.fullText} 
                                        />
                                    </div>
                                    <div className="mb-12 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg min-h-[10rem]">
                                       {renderTextWithInputsForTest(exercise)}
                                    </div>
                                    
                                    {isExerciseChecked && (
                                        <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                                            <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Your Score for this Exercise</h4>
                                            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 my-2">
                                                {score} / {missingWordsList.length}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        {!isExerciseChecked ? (
                                            <button onClick={() => handleCheckTestAnswers(exercise.id)} className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200">
                                                Check Answers
                                            </button>
                                        ) : (
                                            <button onClick={() => handleTryAgainTest(exercise.id)} className="w-full sm:w-auto px-8 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 lg:mt-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold mb-4 dark:text-white text-center uppercase tracking-widest text-xs opacity-50">Exercise Palette</h3>
                            <QuestionPalette 
                                questions={testData.exercises}
                                answers={paletteAnswers} 
                                currentQuestionIndex={currentExerciseIndex}
                                onQuestionSelect={goToExercise}
                            />
                             <div className="flex justify-between mt-6">
                                <button onClick={goToPrev} disabled={currentExerciseIndex === 0} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600">Previous</button>
                                <button onClick={goToNext} disabled={currentExerciseIndex === testData.exercises.length - 1} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DictationTestScreen;
