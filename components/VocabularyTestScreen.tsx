import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { VocabularyTest, VocabItem } from '../types';
import { updateWordSrsLevel } from '../services/vocabularyService';
import { BrainIcon, ShuffleIcon, ArrowLeftIcon, ArrowRightIcon, GridIcon, TypeIcon, HeadphoneIcon, LinkIcon, FlipIcon, RefreshIcon, TestQuizIcon, AudioChoiceIcon, DictationModeIcon, FlashcardsModeIcon } from './icons';
import AudioPlayer from './AudioPlayer';

type StudyMode = 'flashcards' | 'quiz' | 'matching_game' | 'scrambler' | 'spelling_recall' | 'audio_dictation' | 'definition_match' | 'audio_choice';

interface QuizQuestion {
    questionText: string; // The definition
    options: string[]; // Array of words
    correctAnswer: string; // The correct word
    userAnswer: string | null;
    isCorrect: boolean | null;
}

interface AudioChoiceQuestion {
    item: VocabItem;
    options: VocabItem[];
    userAnswer: string | null;
}

interface ScramblerQuestion {
    scrambled: string;
    original: VocabItem;
    userAnswer: string;
    isCorrect: boolean | null;
}

interface SpellingQuestion {
    original: VocabItem;
    userAnswer: string;
    isCorrect: boolean | null;
    revealedCount: number;
}

interface AudioDictationQuestion {
    original: VocabItem;
    userAnswer: string;
    isCorrect: boolean | null;
    meaningRevealed: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const WORDS_PER_MATCHING_TURN = 6;
type MatchingItem = { item: VocabItem; type: 'word' | 'definition' };

const WORDS_PER_DMATCH_TURN = 8;
type DMatchItemType = { item: VocabItem; type: 'word' | 'definition' };


const VocabularyTestScreen: React.FC<{ testData: VocabularyTest, onBack: () => void }> = ({ testData, onBack }) => {
    const wordsForSession = useMemo(() => {
        return testData.words;
    }, [testData.words]);

    const [mode, setMode] = useState<StudyMode>('flashcards');
    const [deck, setDeck] = useState<VocabItem[]>(wordsForSession);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizSessionFinished, setIsQuizSessionFinished] = useState(false);

    // State for Audio Choice
    const [audioChoiceQuestions, setAudioChoiceQuestions] = useState<AudioChoiceQuestion[]>([]);
    const [currentAudioChoiceIndex, setCurrentAudioChoiceIndex] = useState(0);
    const [isAutoAdvance, setIsAutoAdvance] = useState(false);

    // State for matching game
    const [fullMatchingDeck, setFullMatchingDeck] = useState<VocabItem[]>([]);
    const [matchingTurn, setMatchingTurn] = useState(0);
    const [currentTurnItems, setCurrentTurnItems] = useState<VocabItem[]>([]);
    const [matchingGridItems, setMatchingGridItems] = useState<MatchingItem[]>([]);
    const [selectedMatchingItem, setSelectedMatchingItem] = useState<MatchingItem | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [incorrectPairItems, setIncorrectPairItems] = useState<{ item1: MatchingItem, item2: MatchingItem } | null>(null);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isTurnFinished, setIsTurnFinished] = useState(false);

    // State for scrambler game
    const [scramblerQuestions, setScramblerQuestions] = useState<ScramblerQuestion[]>([]);
    const [currentScramblerIndex, setCurrentScramblerIndex] = useState(0);
    const [scramblerScore, setScramblerScore] = useState(0);
    const [isScramblerSessionFinished, setIsScramblerSessionFinished] = useState(false);

    // State for spelling recall game
    const [spellingQuestions, setSpellingQuestions] = useState<SpellingQuestion[]>([]);
    const [currentSpellingIndex, setCurrentSpellingIndex] = useState(0);
    const [spellingScore, setSpellingScore] = useState(0);
    const [isSpellingSessionFinished, setIsSpellingSessionFinished] = useState(false);

    // State for audio dictation game
    const [audioDictationQuestions, setAudioDictationQuestions] = useState<AudioDictationQuestion[]>([]);
    const [currentAudioDictationIndex, setCurrentAudioDictationIndex] = useState(0);
    const [audioDictationScore, setAudioDictationScore] = useState(0);
    const [isAudioDictationSessionFinished, setIsAudioDictationSessionFinished] = useState(false);

    // State for Definition Match
    const [fullDMatchDeck, setFullDMatchDeck] = useState<VocabItem[]>([]);
    const [dMatchTurn, setDMatchTurn] = useState(0);
    const [dMatchWords, setDMatchWords] = useState<DMatchItemType[]>([]);
    const [dMatchDefinitions, setDMatchDefinitions] = useState<DMatchItemType[]>([]);
    const [selectedDMatchWord, setSelectedDMatchWord] = useState<DMatchItemType | null>(null);
    const [correctDMatches, setCorrectDMatches] = useState<string[]>([]); // array of word strings
    const [incorrectDMatchPair, setIncorrectDMatchPair] = useState<string[] | null>(null); // [word, definition]
    const [isDMatchGameFinished, setIsDMatchGameFinished] = useState(false);
    const [isDMatchTurnFinished, setIsDMatchTurnFinished] = useState(false);

    const generateQuizQuestions = useCallback(() => {
        const shuffledWords = shuffleArray(wordsForSession);
        const questions = shuffledWords.map((correctItem: VocabItem) => {
            const distractors = shuffleArray(wordsForSession.filter((w: VocabItem) => w.word !== correctItem.word)).slice(0, 3).map((d: VocabItem) => d.word);
            const options = shuffleArray([correctItem.word, ...distractors]);
            return {
                questionText: correctItem.definition,
                options: options,
                correctAnswer: correctItem.word,
                userAnswer: null,
                isCorrect: null,
            };
        });
        setQuizQuestions(questions);
    }, [wordsForSession]);
    
    const startQuizSession = useCallback(() => {
        generateQuizQuestions();
        setCurrentQuizIndex(0);
        setScore(0);
        setIsQuizSessionFinished(false);
    }, [generateQuizQuestions]);

    const generateAudioChoiceQuestions = useCallback(() => {
        const shuffledWords = shuffleArray(wordsForSession);
        const questions = shuffledWords.map((correctItem) => {
            let pool = wordsForSession.filter(w => w.word !== correctItem.word);
            const distractors = shuffleArray(pool).slice(0, 8);
            const options = shuffleArray([correctItem, ...distractors]);
            return {
                item: correctItem,
                options: options,
                userAnswer: null
            };
        });
        setAudioChoiceQuestions(questions);
    }, [wordsForSession]);

    const startAudioChoiceGame = useCallback(() => {
        generateAudioChoiceQuestions();
        setCurrentAudioChoiceIndex(0);
    }, [generateAudioChoiceQuestions]);

    const setupMatchingTurn = useCallback((deck: VocabItem[], turn: number) => {
        const startIndex = turn * WORDS_PER_MATCHING_TURN;
        const turnItems = deck.slice(startIndex, startIndex + WORDS_PER_MATCHING_TURN);

        if (turnItems.length === 0) {
            setIsGameFinished(true);
            return;
        }

        const wordsForGrid = turnItems.map(item => ({ item, type: 'word' as const }));
        const defsForGrid = turnItems.map(item => ({ item, type: 'definition' as const }));
        
        setMatchingGridItems(shuffleArray([...wordsForGrid, ...defsForGrid]));
        setCurrentTurnItems(turnItems);
        
        setMatchingTurn(turn);
        setSelectedMatchingItem(null);
        setMatchedPairs([]);
        setIncorrectPairItems(null);
        setIsGameFinished(false);
        setIsTurnFinished(false);
    }, []);

    const startMatchingGame = useCallback(() => {
        const shuffledDeck = shuffleArray(wordsForSession);
        setFullMatchingDeck(shuffledDeck);
        setupMatchingTurn(shuffledDeck, 0);
    }, [wordsForSession, setupMatchingTurn]);
    
    const scrambleWord = (word: string): string => {
        if (word.length <= 1) return word;
        let scrambled: string;
        let attempts = 0;
        do {
            scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
            attempts++;
        } while (scrambled === word && attempts < 10); 
        return scrambled;
    };

    const generateScramblerQuestions = useCallback(() => {
        const shuffledWords = shuffleArray(wordsForSession);
        const questions = shuffledWords.map((item: VocabItem) => ({
            scrambled: scrambleWord(item.word),
            original: item,
            userAnswer: '',
            isCorrect: null,
        }));
        setScramblerQuestions(questions);
    }, [wordsForSession]);

    const startScramblerGame = useCallback(() => {
        generateScramblerQuestions();
        setCurrentScramblerIndex(0);
        setScramblerScore(0);
        setIsScramblerSessionFinished(false);
    }, [generateScramblerQuestions]);

    const handleShuffleScrambler = useCallback(() => {
        const unansweredQuestions = scramblerQuestions.slice(currentScramblerIndex).filter(q => q.isCorrect === null);
        if (unansweredQuestions.length < 2) {
            setToastMessage("Not enough words left to shuffle!");
            setTimeout(() => setToastMessage(null), 2000);
            return;
        }
    
        setScramblerQuestions(prev => {
            const currentItem = prev[currentScramblerIndex];
            const remainingItems = [
                ...prev.slice(0, currentScramblerIndex),
                ...prev.slice(currentScramblerIndex + 1)
            ];
            return [...remainingItems, currentItem];
        });
    }, [scramblerQuestions, currentScramblerIndex]);

    const generateSpellingQuestions = useCallback(() => {
        const shuffledWords = shuffleArray(wordsForSession);
        const questions = shuffledWords.map((item: VocabItem) => ({
            original: item,
            userAnswer: '',
            isCorrect: null,
            revealedCount: 0,
        }));
        setSpellingQuestions(questions);
    }, [wordsForSession]);

    const startSpellingGame = useCallback(() => {
        generateSpellingQuestions();
        setCurrentSpellingIndex(0);
        setSpellingScore(0);
        setIsSpellingSessionFinished(false);
    }, [generateSpellingQuestions]);
    
    const generateAudioDictationQuestions = useCallback(() => {
        const shuffledWords = shuffleArray(wordsForSession);
        const questions = shuffledWords.map((item: VocabItem) => ({
            original: item,
            userAnswer: '',
            isCorrect: null,
            meaningRevealed: false,
        }));
        setAudioDictationQuestions(questions);
    }, [wordsForSession]);

    const startAudioDictationGame = useCallback(() => {
        generateAudioDictationQuestions();
        setCurrentAudioDictationIndex(0);
        setAudioDictationScore(0);
        setIsAudioDictationSessionFinished(false);
    }, [generateAudioDictationQuestions]);

    const setupDMatchTurn = useCallback((deck: VocabItem[], turn: number) => {
        const startIndex = turn * WORDS_PER_DMATCH_TURN;
        const turnItems = deck.slice(startIndex, startIndex + WORDS_PER_DMATCH_TURN);

        if (turnItems.length === 0) {
            setIsDMatchGameFinished(true);
            return;
        }
        
        setDMatchWords(turnItems.map(item => ({ item, type: 'word' as const })));
        setDMatchDefinitions(shuffleArray(turnItems).map(item => ({ item, type: 'definition' as const })));
        
        setFullDMatchDeck(deck);
        setDMatchTurn(turn);
        setSelectedDMatchWord(null);
        setCorrectDMatches([]);
        setIncorrectDMatchPair(null);
        setIsDMatchGameFinished(false);
        setIsDMatchTurnFinished(false);
    }, []);

    const startDMatchGame = useCallback(() => {
        const shuffledDeck = shuffleArray(wordsForSession);
        setupDMatchTurn(shuffledDeck, 0);
    }, [wordsForSession, setupDMatchTurn]);
    
    useEffect(() => {
        setDeck(wordsForSession);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        if (mode === 'quiz') startQuizSession();
        if (mode === 'audio_choice') startAudioChoiceGame();
        if (mode === 'matching_game') startMatchingGame();
        if (mode === 'scrambler') startScramblerGame();
        if (mode === 'spelling_recall') startSpellingGame();
        if (mode === 'audio_dictation') startAudioDictationGame();
        if (mode === 'definition_match') startDMatchGame();
    }, [mode, wordsForSession, startQuizSession, startAudioChoiceGame, startMatchingGame, startScramblerGame, startSpellingGame, startAudioDictationGame, startDMatchGame]);
    
    const handleWordPractice = useCallback((word: VocabItem, performance: 'good' | 'hard') => {
        const wordId = word.word.toLowerCase();
        updateWordSrsLevel(wordId, performance, word, `From '${testData.title}' list.`);
    }, [testData.title]);
    
    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev + 1) % deck.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev - 1 + deck.length) % deck.length);
    };

    const handleShuffle = () => {
        setDeck(shuffleArray(deck));
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };
    
    const handleQuizAnswer = (selectedOption: string) => {
        if (quizQuestions[currentQuizIndex].userAnswer !== null) return;

        const currentQuestion = quizQuestions[currentQuizIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        
        const vocabItem = wordsForSession.find(w => w.word === currentQuestion.correctAnswer);
        if (vocabItem) {
            handleWordPractice(vocabItem, isCorrect ? 'good' : 'hard');
        }

        const updatedQuestions = [...quizQuestions];
        updatedQuestions[currentQuizIndex] = { ...currentQuestion, userAnswer: selectedOption, isCorrect };
        setQuizQuestions(updatedQuestions);

        setTimeout(() => {
            if (currentQuizIndex + 1 < quizQuestions.length) {
                setCurrentQuizIndex(prev => prev + 1);
            } else {
                setIsQuizSessionFinished(true);
            }
        }, 1500);
    };

    const handleAudioChoiceAnswer = (selectedItem: VocabItem) => {
        const currentQuestion = audioChoiceQuestions[currentAudioChoiceIndex];
        if (currentQuestion.userAnswer !== null) return;

        const isCorrect = selectedItem.word === currentQuestion.item.word;
        
        const updatedQuestions = [...audioChoiceQuestions];
        updatedQuestions[currentAudioChoiceIndex] = { ...currentQuestion, userAnswer: selectedItem.word };
        setAudioChoiceQuestions(updatedQuestions);

        handleWordPractice(currentQuestion.item, isCorrect ? 'good' : 'hard');

        if (isCorrect && isAutoAdvance) {
            setTimeout(() => {
                if (currentAudioChoiceIndex + 1 < audioChoiceQuestions.length) {
                    setCurrentAudioChoiceIndex(prev => prev + 1);
                }
            }, 1000);
        }
    };
    
    const handleMatchingItemSelect = (clickedItem: MatchingItem) => {
        if (matchedPairs.includes(clickedItem.item.word) || incorrectPairItems) return;

        if (!selectedMatchingItem) {
            setSelectedMatchingItem(clickedItem);
        } else {
            if (selectedMatchingItem.item.word === clickedItem.item.word && selectedMatchingItem.type !== clickedItem.type) {
                const newMatchedPairs = [...matchedPairs, clickedItem.item.word];
                setMatchedPairs(newMatchedPairs);
                setSelectedMatchingItem(null);
                if (newMatchedPairs.length === currentTurnItems.length) {
                    setIsTurnFinished(true);
                }
            } else {
                setIncorrectPairItems({ item1: selectedMatchingItem, item2: clickedItem });
                setSelectedMatchingItem(null);
                setTimeout(() => {
                    setIncorrectPairItems(null);
                }, 1000);
            }
        }
    };

    const handleScramblerInputChange = (index: number, value: string) => {
        const newQuestions = [...scramblerQuestions];
        newQuestions[index].userAnswer = value;
        setScramblerQuestions(newQuestions);
    };

    const handleScramblerSubmit = (index: number) => {
        const question = scramblerQuestions[index];
        const isCorrect = question.userAnswer.trim().toLowerCase() === question.original.word.toLowerCase();
        
        const newQuestions = [...scramblerQuestions];
        newQuestions[index].isCorrect = isCorrect;
        setScramblerQuestions(newQuestions);
        
        if(isCorrect) setScramblerScore(s => s + 1);

        setTimeout(() => {
            if (currentScramblerIndex + 1 < scramblerQuestions.length) {
                setCurrentScramblerIndex(prev => prev + 1);
            } else {
                setIsScramblerSessionFinished(true);
            }
        }, isCorrect ? 1000 : 2000);
    };

    const handleSpellingInputChange = (index: number, value: string) => {
        const newQuestions = [...spellingQuestions];
        newQuestions[index].userAnswer = value;
        setSpellingQuestions(newQuestions);
    };

    const handleSpellingSubmit = (index: number) => {
        const question = spellingQuestions[index];
        const isCorrect = question.userAnswer.trim().toLowerCase() === question.original.word.toLowerCase();
        
        const newQuestions = [...spellingQuestions];
        newQuestions[index].isCorrect = isCorrect;
        setSpellingQuestions(newQuestions);
        
        if(isCorrect) setSpellingScore(s => s + 1);

        setTimeout(() => {
            if (currentSpellingIndex + 1 < spellingQuestions.length) {
                setCurrentSpellingIndex(prev => prev + 1);
            } else {
                setIsSpellingSessionFinished(true);
            }
        }, isCorrect ? 1000 : 2000);
    };

    const revealLetter = (index: number) => {
        const newQuestions = [...spellingQuestions];
        const question = newQuestions[index];
        if (question.revealedCount < question.original.word.length -1) {
            question.revealedCount++;
            setSpellingQuestions(newQuestions);
        }
    };
    
    const handleAudioDictationInputChange = (index: number, value: string) => {
        const newQuestions = [...audioDictationQuestions];
        newQuestions[index].userAnswer = value;
        setAudioDictationQuestions(newQuestions);
    };

    const handleAudioDictationSubmit = (index: number) => {
        const question = audioDictationQuestions[index];
        const isCorrect = question.userAnswer.trim().toLowerCase() === question.original.word.toLowerCase();
        
        const newQuestions = [...audioDictationQuestions];
        newQuestions[index].isCorrect = isCorrect;
        setAudioDictationQuestions(newQuestions);
        
        if(isCorrect) setAudioDictationScore(s => s + 1);

        setTimeout(() => {
            if (currentAudioDictationIndex + 1 < audioDictationQuestions.length) {
                setCurrentAudioDictationIndex(prev => prev + 1);
            } else {
                setIsAudioDictationSessionFinished(true);
            }
        }, isCorrect ? 1000 : 2000);
    };

    const revealMeaning = (index: number) => {
        const newQuestions = [...audioDictationQuestions];
        newQuestions[index].meaningRevealed = true;
        setAudioDictationQuestions(newQuestions);
    };

    const handleDMatchWordClick = (word: DMatchItemType) => {
        if (correctDMatches.includes(word.item.word) || incorrectDMatchPair) return;
        setSelectedDMatchWord(word);
    };
    
    const handleDMatchDefinitionClick = (definition: DMatchItemType) => {
        if (!selectedDMatchWord || incorrectDMatchPair) return;

        if (selectedDMatchWord.item.word === definition.item.word) {
            const newCorrects = [...correctDMatches, selectedDMatchWord.item.word];
            setCorrectDMatches(newCorrects);
            setSelectedDMatchWord(null);
            if (newCorrects.length === dMatchWords.length) {
                 setIsDMatchTurnFinished(true);
            }
        } else {
            setIncorrectDMatchPair([selectedDMatchWord.item.word, definition.item.definition]);
            setSelectedDMatchWord(null);
            setTimeout(() => setIncorrectDMatchPair(null), 1000);
        }
    };

    const handleDMatchNextTurn = () => {
        setupDMatchTurn(fullDMatchDeck, dMatchTurn + 1);
    };

    const handleDMatchRestart = () => {
        startDMatchGame();
    };

    const currentWord = deck[currentCardIndex];
    const activeModeClasses = "bg-blue-600 text-white shadow-xl transform scale-105 border-blue-700 ring-4 ring-blue-500/20";
    const inactiveModeClasses = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-lg";

    const ModeButton: React.FC<{ active: boolean; onClick: () => void; icon: React.FC<any>; label: string }> = ({ active, onClick, icon: Icon, label }) => (
        <button 
            onClick={onClick} 
            className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl font-black text-xl transition-all duration-300 border-2 w-full h-48 ${active ? activeModeClasses : inactiveModeClasses}`}
        >
            <Icon className={`h-12 w-12 ${active ? 'text-white' : 'text-blue-500'}`} />
            <span className="text-center leading-tight">{label}</span>
        </button>
    );

    const renderFlashcards = () => {
        if (!currentWord) {
            return (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                    <p className="text-slate-500">No words to review in this test set.</p>
                </div>
            );
        }
        return (
            <div>
                <div className="relative mb-6" style={{ perspective: '1000px' }}>
                    <div
                        className={`relative w-full h-64 rounded-xl shadow-xl border border-slate-200 cursor-pointer transition-transform duration-500`}
                        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="absolute w-full h-full bg-white rounded-xl flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                            <h3 className="text-4xl font-bold text-slate-800">{currentWord.word}</h3>
                        </div>
                        <div className="absolute w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <p className="text-xl text-slate-700">{currentWord.definition}</p>
                            {currentWord.example && <p className="text-sm italic text-slate-500 mt-4">"{currentWord.example}"</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                     <button onClick={() => { handleWordPractice(currentWord, 'hard'); handleNextCard(); }} className="p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">Hard</button>
                     <button onClick={() => { handleWordPractice(currentWord, 'good'); handleNextCard(); }} className="p-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors">Good</button>
                     <button onClick={handleNextCard} className="p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Easy (No SRS)</button>
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={handlePrevCard} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors">
                        <ArrowLeftIcon className="h-6 w-6 text-slate-700" />
                    </button>
                    <span className="font-semibold text-slate-600">{currentCardIndex + 1} / {deck.length}</span>
                    <div className="flex gap-2">
                        <button onClick={handleShuffle} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors">
                            <ShuffleIcon className="h-6 w-6 text-slate-700" />
                        </button>
                        <button onClick={handleNextCard} className="p-3 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors">
                            <ArrowRightIcon className="h-6 w-6 text-slate-700" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderQuiz = () => {
        if (quizQuestions.length === 0) return null;
        const currentQuestion = quizQuestions[currentQuizIndex];
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Multiple Choice Quiz</h3>
                    <span className="font-semibold text-slate-500">{currentQuizIndex + 1} / {quizQuestions.length}</span>
                </div>
                <div className="p-8 bg-slate-100 rounded-lg text-center min-h-[120px] flex items-center justify-center">
                    <p className="text-lg text-slate-700">{currentQuestion.questionText}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        let buttonClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-semibold ";
                        if (currentQuestion.userAnswer) {
                            if (option === currentQuestion.correctAnswer) {
                                buttonClasses += "bg-green-100 border-green-500 text-green-800";
                            } else if (option === currentQuestion.userAnswer) {
                                buttonClasses += "bg-red-100 border-red-500 text-red-800";
                            } else {
                                buttonClasses += "bg-slate-100 border-slate-200 text-slate-500 opacity-70";
                            }
                        } else {
                            buttonClasses += "bg-white border-slate-300 hover:bg-blue-50 hover:border-blue-400";
                        }

                        return (
                            <button key={index} onClick={() => handleQuizAnswer(option)} disabled={!!currentQuestion.userAnswer} className={buttonClasses}>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderQuizResults = () => (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Quiz Complete!</h3>
            <p className="text-6xl font-bold text-blue-600 my-4">{score} / {quizQuestions.length}</p>
            <p className="text-lg text-slate-600">You've completed the quiz. Words you got wrong have been marked for 'hard' review in your SRS deck.</p>
            <button onClick={startQuizSession} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                Try Again
            </button>
        </div>
    );

    const renderAudioChoice = () => {
        if (audioChoiceQuestions.length === 0) return null;
        const currentQuestion = audioChoiceQuestions[currentAudioChoiceIndex];

        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="mb-8">
                    <AudioPlayer audioScript={currentQuestion.item.word} autoPlay={true} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {currentQuestion.options.map((option, idx) => {
                        const isCorrect = option.word === currentQuestion.item.word;
                        const isSelected = currentQuestion.userAnswer === option.word;
                        const hasAnswered = currentQuestion.userAnswer !== null;

                        let buttonClasses = "flex flex-col items-center justify-center p-6 h-32 rounded-xl border-2 transition-all duration-200 font-semibold shadow-sm ";
                        
                        if (hasAnswered) {
                            if (isCorrect) {
                                buttonClasses += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/40 dark:border-green-600 dark:text-green-300";
                            } else if (isSelected) {
                                buttonClasses += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:border-green-600 dark:text-green-300";
                            } else {
                                buttonClasses += "bg-slate-50 border-slate-100 text-slate-400 opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600";
                            }
                        } else {
                            buttonClasses += "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:border-blue-500 text-slate-800 dark:text-slate-100";
                        }

                        return (
                            <button 
                                key={idx} 
                                onClick={() => handleAudioChoiceAnswer(option)} 
                                disabled={hasAnswered}
                                className={buttonClasses}
                            >
                                <span className="text-xl mb-1">{option.word}</span>
                                <span className="text-xs opacity-75 font-normal">({option.definition})</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setCurrentAudioChoiceIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentAudioChoiceIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 disabled:opacity-30 font-bold"
                    >
                        〈 Câu trước
                    </button>
                    
                    <label className="flex items-center cursor-pointer select-none">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                checked={isAutoAdvance} 
                                onChange={(e) => setIsAutoAdvance(e.target.checked)}
                                className="sr-only" 
                            />
                            <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${isAutoAdvance ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAutoAdvance ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300">Tự động chuyển câu</span>
                    </label>

                    <button 
                        onClick={() => setCurrentAudioChoiceIndex(prev => Math.min(audioChoiceQuestions.length - 1, prev + 1))}
                        disabled={currentAudioChoiceIndex === audioChoiceQuestions.length - 1}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30 font-bold shadow-md"
                    >
                        Câu sau 〉
                    </button>
                </div>
            </div>
        );
    };

    const renderMatchingGame = () => {
        if (isGameFinished) {
             return (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800">Game Finished!</h3>
                    <p className="text-lg text-slate-600 mt-2">You've matched all the words.</p>
                    <button onClick={startMatchingGame} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Play Again
                    </button>
                </div>
            );
        }

        if (isTurnFinished) {
            return (
                 <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800">Round Complete!</h3>
                    <button onClick={() => setupMatchingTurn(fullMatchingDeck, matchingTurn + 1)} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Next Round
                    </button>
                </div>
            );
        }
        
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-4">Matching Game (Round {matchingTurn + 1})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {matchingGridItems.map((gridItem, index) => {
                        const isMatched = matchedPairs.includes(gridItem.item.word);
                        const isIncorrect = (incorrectPairItems?.item1 === gridItem || incorrectPairItems?.item2 === gridItem);
                        const isSelected = selectedMatchingItem === gridItem;
                        
                        let buttonClasses = "p-4 h-24 flex items-center justify-center text-center rounded-lg border-2 font-semibold transition-all duration-200 ";

                        if (isMatched) {
                            buttonClasses += "bg-green-100 border-green-300 text-green-800 opacity-50 cursor-not-allowed";
                        } else if (isIncorrect) {
                            buttonClasses += "bg-red-100 border-red-500 text-red-800";
                        } else if (isSelected) {
                            buttonClasses += "bg-blue-200 border-blue-500 ring-2 ring-blue-300";
                        } else {
                            buttonClasses += "bg-white border-slate-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";
                        }

                        return (
                            <button key={index} onClick={() => handleMatchingItemSelect(gridItem)} className={buttonClasses} disabled={isMatched}>
                                {gridItem.type === 'word' ? gridItem.item.word : gridItem.item.definition}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderScrambler = () => {
        if (scramblerQuestions.length === 0) return null;
        const currentQuestion = scramblerQuestions[currentScramblerIndex];

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Word Scrambler</h3>
                    <span className="font-semibold text-slate-500">{currentScramblerIndex + 1} / {scramblerQuestions.length}</span>
                </div>
                <div className="p-6 bg-slate-100 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-2">Unscramble the word for:</p>
                    <p className="text-base text-slate-700 font-medium">"{currentQuestion.original.definition}"</p>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-4xl font-bold tracking-widest text-blue-600 my-4 p-4 bg-blue-50 rounded-lg">{currentQuestion.scrambled}</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleScramblerSubmit(currentScramblerIndex); }}>
                        <input
                            type="text"
                            value={currentQuestion.userAnswer}
                            onChange={(e) => handleScramblerInputChange(currentScramblerIndex, e.target.value)}
                            disabled={currentQuestion.isCorrect !== null}
                            className={`w-full text-center text-lg p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200
                                ${currentQuestion.isCorrect === true ? 'bg-green-100 border-green-500' : ''}
                                ${currentQuestion.isCorrect === false ? 'bg-red-100 border-red-500' : 'border-slate-300'}`
                            }
                            placeholder="Type your answer"
                        />
                         {currentQuestion.isCorrect === false && (
                            <p className="text-green-600 font-semibold mt-2">Correct answer: {currentQuestion.original.word}</p>
                        )}
                         {currentQuestion.isCorrect === null && (
                            <div className="mt-4 flex gap-2 justify-center">
                                <button type="button" onClick={handleShuffleScrambler} className="px-4 py-2 bg-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-300">Skip/Shuffle</button>
                                <button type="submit" className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Check</button>
                            </div>
                         )}
                    </form>
                </div>
            </div>
        );
    };

    const renderScramblerResults = () => (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Scrambler Complete!</h3>
            <p className="text-6xl font-bold text-blue-600 my-4">{scramblerScore} / {scramblerQuestions.length}</p>
            <button onClick={startScramblerGame} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                Try Again
            </button>
        </div>
    );

    const renderSpellingRecall = () => {
        if (spellingQuestions.length === 0) return null;
        const currentQuestion = spellingQuestions[currentSpellingIndex];
        const revealedWord = currentQuestion.original.word.substring(0, currentQuestion.revealedCount) + '_'.repeat(currentQuestion.original.word.length - currentQuestion.revealedCount);

        return (
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Spelling Recall</h3>
                    <span className="font-semibold text-slate-500">{currentSpellingIndex + 1} / {spellingQuestions.length}</span>
                </div>
                 <div className="p-6 bg-slate-100 rounded-lg text-center min-h-[100px] flex items-center justify-center">
                    <p className="text-base text-slate-700 font-medium">"{currentQuestion.original.definition}"</p>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-2xl font-bold tracking-[0.5em] text-blue-600 my-4 p-2 bg-blue-50 rounded-lg uppercase">{revealedWord}</p>
                     <form onSubmit={(e) => { e.preventDefault(); handleSpellingSubmit(currentSpellingIndex); }}>
                        <input
                            type="text"
                            value={currentQuestion.userAnswer}
                            onChange={(e) => handleSpellingInputChange(currentSpellingIndex, e.target.value)}
                            disabled={currentQuestion.isCorrect !== null}
                            className={`w-full text-center text-lg p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200
                                ${currentQuestion.isCorrect === true ? 'bg-green-100 border-green-500' : ''}
                                ${currentQuestion.isCorrect === false ? 'bg-red-100 border-red-500' : 'border-slate-300'}`
                            }
                            placeholder="Type the word"
                            autoCapitalize="none"
                        />
                         {currentQuestion.isCorrect === false && (
                            <p className="text-green-600 font-semibold mt-2">Correct answer: {currentQuestion.original.word}</p>
                        )}
                         {currentQuestion.isCorrect === null && (
                             <div className="mt-4 flex gap-2 justify-center">
                                <button type="button" onClick={() => revealLetter(currentSpellingIndex)} className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md font-semibold hover:bg-yellow-500">Hint (Reveal Letter)</button>
                                <button type="submit" className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Check</button>
                            </div>
                         )}
                    </form>
                </div>
            </div>
        );
    };
    
    const renderSpellingResults = () => (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Spelling Practice Complete!</h3>
            <p className="text-6xl font-bold text-blue-600 my-4">{spellingScore} / {spellingQuestions.length}</p>
            <button onClick={startSpellingGame} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                Play Again
            </button>
        </div>
    );

    const renderAudioDictation = () => {
        if (audioDictationQuestions.length === 0) return null;
        const currentQuestion = audioDictationQuestions[currentAudioDictationIndex];

        return (
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Audio Dictation</h3>
                    <span className="font-semibold text-slate-500">{currentAudioDictationIndex + 1} / {audioDictationQuestions.length}</span>
                </div>
                <div className="p-4 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2 text-center">Listen to the word and type what you hear.</p>
                    <AudioPlayer audioScript={currentQuestion.original.word} />
                </div>

                {currentQuestion.meaningRevealed && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
                        <p className="text-sm text-yellow-700 font-semibold">Hint (Meaning): "{currentQuestion.original.definition}"</p>
                    </div>
                )}
                
                <div className="mt-6 text-center">
                     <form onSubmit={(e) => { e.preventDefault(); handleAudioDictationSubmit(currentAudioDictationIndex); }}>
                        <input
                            type="text"
                            value={currentQuestion.userAnswer}
                            onChange={(e) => handleAudioDictationInputChange(currentAudioDictationIndex, e.target.value)}
                            disabled={currentQuestion.isCorrect !== null}
                            className={`w-full text-center text-lg p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200
                                ${currentQuestion.isCorrect === true ? 'bg-green-100 border-green-500' : ''}
                                ${currentQuestion.isCorrect === false ? 'bg-red-100 border-red-500' : 'border-slate-300'}`
                            }
                            placeholder="Type the word"
                            autoCapitalize="none"
                        />
                         {currentQuestion.isCorrect === false && (
                            <p className="text-green-600 font-semibold mt-2">Correct answer: {currentQuestion.original.word}</p>
                        )}
                         {currentQuestion.isCorrect === null && (
                             <div className="mt-4 flex gap-2 justify-center">
                                <button type="button" onClick={() => revealMeaning(currentAudioDictationIndex)} className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md font-semibold hover:bg-yellow-500">Hint (Show Meaning)</button>
                                <button type="submit" className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Check</button>
                            </div>
                         )}
                    </form>
                </div>
            </div>
        );
    };

    const renderAudioDictationResults = () => (
         <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Audio Dictation Complete!</h3>
            <p className="text-6xl font-bold text-blue-600 my-4">{audioDictationScore} / {audioDictationQuestions.length}</p>
            <button onClick={startAudioDictationGame} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                Play Again
            </button>
        </div>
    );

    const renderDefinitionMatch = () => {
        if (isDMatchGameFinished) {
            return (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800">Game Finished!</h3>
                    <p className="text-lg text-slate-600 mt-2">You've matched all the words.</p>
                    <button onClick={handleDMatchRestart} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Play Again
                    </button>
                </div>
            );
        }

        if (isDMatchTurnFinished) {
            return (
                 <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
                    <h3 className="text-2xl font-bold text-slate-800">Round Complete!</h3>
                    <p className="text-lg text-slate-600 mt-2">You matched all words for this round.</p>
                    <button onClick={handleDMatchNextTurn} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Next Round
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-4">Definition Match (Round {dMatchTurn + 1})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        {dMatchWords.map((wordItem, index) => {
                            const isSelected = selectedDMatchWord === wordItem;
                            const isCorrect = correctDMatches.includes(wordItem.item.word);
                            const isIncorrect = incorrectDMatchPair?.[0] === wordItem.item.word;
                            
                            let classes = "w-full text-left p-3 rounded-lg border-2 font-semibold text-sm transition-all duration-200 min-h-[60px] flex items-center ";
                             if (isCorrect) classes += "bg-green-100 border-green-300 text-green-800 opacity-50 cursor-not-allowed";
                             else if (isIncorrect) classes += "bg-red-100 border-red-500 text-red-800";
                             else if (isSelected) classes += "bg-blue-200 border-blue-500 ring-2 ring-blue-300";
                             else classes += "bg-white border-slate-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";

                            return <button key={`word-${index}`} onClick={() => handleDMatchWordClick(wordItem)} className={classes} disabled={isCorrect}>{wordItem.item.word}</button>;
                        })}
                    </div>
                    <div className="space-y-3">
                         {dMatchDefinitions.map((defItem, index) => {
                            const isCorrect = correctDMatches.includes(defItem.item.word);
                            const isIncorrect = incorrectDMatchPair?.[1] === defItem.item.definition;

                            let classes = "w-full text-left p-3 rounded-lg border-2 text-sm transition-all duration-200 min-h-[60px] flex items-center ";
                             if (isCorrect) classes += "bg-green-100 border-green-300 text-green-800 opacity-50 cursor-not-allowed";
                             else if (isIncorrect) classes += "bg-red-100 border-red-500 text-red-800";
                             else if (selectedDMatchWord) classes += "bg-white border-slate-300 hover:bg-yellow-100 hover:border-yellow-400 cursor-pointer";
                             else classes += "bg-slate-100 border-slate-200 cursor-not-allowed";
                             
                            return <button key={`def-${index}`} onClick={() => handleDMatchDefinitionClick(defItem)} className={classes} disabled={isCorrect || !selectedDMatchWord}>{defItem.item.definition}</button>;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={onBack} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Test List
            </button>
    
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 text-center">{testData.title}</h2>
                    <p className="text-slate-500 text-center mt-2">{wordsForSession.length} words in this session</p>
                </div>
    
                <div className="mb-10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Chế độ luyện tập</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ModeButton active={mode === 'flashcards'} onClick={() => setMode('flashcards')} icon={FlashcardsModeIcon} label="Flashcards" />
                        <ModeButton active={mode === 'quiz'} onClick={() => setMode('quiz')} icon={TestQuizIcon} label="Quiz" />
                        <ModeButton active={mode === 'audio_choice'} onClick={() => setMode('audio_choice')} icon={AudioChoiceIcon} label="Nghe & Chọn" />
                        <ModeButton active={mode === 'matching_game'} onClick={() => setMode('matching_game')} icon={GridIcon} label="Matching" />
                        <ModeButton active={mode === 'definition_match'} onClick={() => setMode('definition_match')} icon={LinkIcon} label="Def Match" />
                        <ModeButton active={mode === 'scrambler'} onClick={() => setMode('scrambler')} icon={ShuffleIcon} label="Scrambler" />
                        <ModeButton active={mode === 'spelling_recall'} onClick={() => setMode('spelling_recall')} icon={TypeIcon} label="Spelling" />
                        <ModeButton active={mode === 'audio_dictation'} onClick={() => setMode('audio_dictation')} icon={DictationModeIcon} label="Dictation" />
                    </div>
                </div>
                
                {toastMessage && (
                    <div className="fixed bottom-5 right-5 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                        {toastMessage}
                    </div>
                )}

                {mode === 'flashcards' && renderFlashcards()}
                {mode === 'quiz' && (isQuizSessionFinished ? renderQuizResults() : renderQuiz())}
                {mode === 'audio_choice' && renderAudioChoice()}
                {mode === 'matching_game' && renderMatchingGame()}
                {mode === 'scrambler' && (isScramblerSessionFinished ? renderScramblerResults() : renderScrambler())}
                {mode === 'spelling_recall' && (isSpellingSessionFinished ? renderSpellingResults() : renderSpellingRecall())}
                {mode === 'audio_dictation' && (isAudioDictationSessionFinished ? renderAudioDictationResults() : renderAudioDictation())}
                {mode === 'definition_match' && renderDefinitionMatch()}

            </div>
        </div>
    );
};

export default VocabularyTestScreen;