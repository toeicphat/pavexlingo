import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ListeningIntenseConversation, ListeningIntenseSentence } from '../types';
import { ArrowLeftIcon, PlayIcon, PauseIcon, CheckCircleIcon, RefreshIcon, ClockIcon } from './icons';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';

interface ListeningIntensePracticeScreenProps {
    data: ListeningIntenseConversation[];
    onBack: () => void;
}

type Mode = 'mode1' | 'sentence' | 'mode3';

// Helper for shuffling
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// Word block type for Mode 3
interface ScrambleBlock {
    id: string;
    text: string;
}

const ListeningIntensePracticeScreen: React.FC<ListeningIntensePracticeScreenProps> = ({ data, onBack }) => {
    const [mode, setMode] = useState<Mode>('mode1');
    const [currentConversationIdx, setCurrentConversationIdx] = useState(0);
    const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
    
    const audioPlayerRef = useRef<AudioPlayerHandle>(null);

    // --- State: Mode 1 & 2 ---
    const [userInputs, setUserInputs] = useState<Record<string, string[]>>({});
    const [revealedWords, setRevealedWords] = useState<Record<string, boolean[]>>({});

    // --- State: Mode 3 (Scramble) ---
    const [sourceBlocks, setSourceBlocks] = useState<ScrambleBlock[]>([]);
    const [targetBlocks, setTargetBlocks] = useState<ScrambleBlock[]>([]);
    const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    // --- State: General ---
    const [isAutoNext, setIsAutoNext] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const currentConversation = data[currentConversationIdx];
    const currentSentence = currentConversation?.sentences[currentSentenceIdx];
    
    // Clear countdown when changing sentence
    useEffect(() => {
        setCountdown(null);
    }, [currentSentenceIdx, currentConversationIdx]);

    // Initialize inputs for the current sentence if not exists (Mode 1 & 2)
    useEffect(() => {
        if (currentSentence && !userInputs[currentSentence.id]) {
            setUserInputs(prev => ({
                ...prev,
                [currentSentence.id]: new Array(currentSentence.words.length).fill('')
            }));
        }
    }, [currentSentence, userInputs]);

    // Initialize revealed state (Mode 1)
    useEffect(() => {
        if (currentSentence && !revealedWords[currentSentence.id]) {
            setRevealedWords(prev => ({
                ...prev,
                [currentSentence.id]: new Array(currentSentence.words.length).fill(false)
            }));
        }
    }, [currentSentence, revealedWords]);

    // Initialize Scramble Data (Mode 3)
    useEffect(() => {
        if (currentSentence) {
            // Split sentence into words, preserving basic structure
            const words = currentSentence.text.split(' ');
            const blocks: ScrambleBlock[] = words.map((word, idx) => ({
                id: `${currentSentence.id}-${idx}-${word}`, // Unique ID for duplicates
                text: word
            }));
            
            setSourceBlocks(shuffleArray(blocks));
            setTargetBlocks([]);
            setScrambleStatus('idle');
        }
    }, [currentSentenceIdx, currentConversationIdx, currentSentence]); // Re-run when sentence changes

    const handleFullSentenceChange = (value: string) => {
        if (!currentSentence) return;
        const words = value.split(' ');
        setUserInputs(prev => ({
            ...prev,
            [currentSentence.id]: words
        }));
    };

    const handleSentenceSelect = (convIndex: number, sentIndex: number) => {
        setCurrentConversationIdx(convIndex);
        setCurrentSentenceIdx(sentIndex);
    };

    const handleNext = useCallback(() => {
        if (!currentConversation) return;
        if (currentSentenceIdx < currentConversation.sentences.length - 1) {
            setCurrentSentenceIdx(prev => prev + 1);
        } else if (currentConversationIdx < data.length - 1) {
            setCurrentConversationIdx(prev => prev + 1);
            setCurrentSentenceIdx(0);
        }
    }, [currentConversation, currentSentenceIdx, currentConversationIdx, data.length]);

    const handlePrev = useCallback(() => {
        if (currentSentenceIdx > 0) {
            setCurrentSentenceIdx(prev => prev - 1);
        } else if (currentConversationIdx > 0) {
            setCurrentConversationIdx(prev => prev - 1);
            setCurrentSentenceIdx(data[currentConversationIdx - 1].sentences.length - 1);
        }
    }, [currentSentenceIdx, currentConversationIdx, data]);

    const handleReplayAudio = useCallback(() => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.replay();
        }
    }, []);

    // --- Logic for Mode 2 (Sentence Practice) moved to top level ---
    const currentInputValue = currentSentence ? (userInputs[currentSentence.id] || []).join(' ') : '';
    
    const solvedIndices = useMemo(() => {
        if (!currentSentence) return new Set<number>();
        const sIndices = new Set<number>();
        const targetWordsClean = currentSentence.words.map(w => w.toLowerCase().replace(/[^\w']/g, ''));
        const userWordsClean = currentInputValue.split(/\s+/).map(w => w.toLowerCase().replace(/[^\w']/g, ''));
        
        const tempMatchedIndices = new Set<number>();
        
        userWordsClean.forEach(uWord => {
            if (!uWord) return;
            const foundIndex = targetWordsClean.findIndex((tWord, tIdx) => 
                tWord === uWord && !tempMatchedIndices.has(tIdx)
            );
            if (foundIndex !== -1) {
                tempMatchedIndices.add(foundIndex);
                sIndices.add(foundIndex);
            }
        });
        return sIndices;
    }, [currentSentence, currentInputValue]);

    const allSolved = currentSentence && solvedIndices.size === currentSentence.words.length && currentSentence.words.length > 0;

    // Auto Next Effect
    useEffect(() => {
        if (mode !== 'sentence') {
            setCountdown(null);
            return;
        }

        let timer: number;

        if (isAutoNext && allSolved) {
            if (countdown === null) {
                setCountdown(10);
            } else if (countdown > 0) {
                timer = window.setTimeout(() => {
                    setCountdown(c => (c !== null ? c - 1 : null));
                }, 1000);
            } else if (countdown === 0) {
                handleNext();
            }
        } else {
             if (countdown !== null && !allSolved) {
                 setCountdown(null);
             }
        }

        return () => clearTimeout(timer);
    }, [mode, isAutoNext, allSolved, countdown, handleNext]);

    // --- Logic for Mode 3 (Scramble) ---
    const handleMoveBlock = (block: ScrambleBlock, from: 'source' | 'target') => {
        if (scrambleStatus === 'correct') return; // Lock if correct

        if (from === 'source') {
            setSourceBlocks(prev => prev.filter(b => b.id !== block.id));
            setTargetBlocks(prev => [...prev, block]);
        } else {
            setTargetBlocks(prev => prev.filter(b => b.id !== block.id));
            setSourceBlocks(prev => [...prev, block]);
        }
        // Reset status to idle when user modifies answer
        if (scrambleStatus === 'wrong') setScrambleStatus('idle');
    };

    const checkScrambleAnswer = () => {
        if (!currentSentence) return;
        const userSentence = targetBlocks.map(b => b.text).join(' ');
        if (userSentence === currentSentence.text) {
            setScrambleStatus('correct');
        } else {
            setScrambleStatus('wrong');
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;

            // Ctrl to Replay
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Control' || e.key === 'Meta') {
                     handleReplayAudio();
                }
            }

            // Enter Key
            if (e.key === 'Enter') {
                if (mode === 'mode1') {
                    e.preventDefault();
                    handleNext();
                } else if (mode === 'sentence') {
                    e.preventDefault();
                    const scoreEl = document.getElementById('score-display');
                    if (scoreEl) {
                        scoreEl.classList.add('scale-125', 'text-green-600');
                        setTimeout(() => scoreEl.classList.remove('scale-125', 'text-green-600'), 200);
                    }
                } else if (mode === 'mode3') {
                    e.preventDefault();
                    if (scrambleStatus === 'correct') {
                        handleNext();
                    } else {
                        checkScrambleAnswer();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, handleNext, handleReplayAudio, scrambleStatus, targetBlocks]); // Added dependencies for Mode 3


    // Mode 1 Helpers
    const handleWordReveal = (index: number) => {
        if (!currentSentence) return;
        const currentRevealed = revealedWords[currentSentence.id] || new Array(currentSentence.words.length).fill(false);
        const newRevealed = [...currentRevealed];
        newRevealed[index] = true;
        setRevealedWords(prev => ({ ...prev, [currentSentence.id]: newRevealed }));
    };

    const handleBulkReveal = (count: number | 'all') => {
        if (!currentSentence) return;
        const currentRevealed = revealedWords[currentSentence.id] || new Array(currentSentence.words.length).fill(false);
        const newRevealed = [...currentRevealed];

        if (count === 'all') {
            newRevealed.fill(true);
        } else {
            let revealedCount = 0;
            for (let i = 0; i < newRevealed.length; i++) {
                if (!newRevealed[i]) {
                    if (revealedCount < count) {
                        newRevealed[i] = true;
                        revealedCount++;
                    } else {
                        break;
                    }
                }
            }
        }
        setRevealedWords(prev => ({ ...prev, [currentSentence.id]: newRevealed }));
    };

    const handleResetReveal = () => {
         if (!currentSentence) return;
         setRevealedWords(prev => ({
             ...prev,
             [currentSentence.id]: new Array(currentSentence.words.length).fill(false)
         }));
    };

    const renderLeftSidebar = () => (
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                <button onClick={onBack} className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-4 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Selection
                </button>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Conversations</h3>
            </div>
            <div className="p-2 space-y-4">
                {data.map((conv, cIdx) => (
                    <div key={conv.id} className="mb-6">
                        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">{conv.title}</h4>
                        <div className="grid grid-cols-5 gap-2 px-2">
                            {conv.sentences.map((sent, sIdx) => {
                                const isActive = cIdx === currentConversationIdx && sIdx === currentSentenceIdx;
                                // For sidebar completion status - simple check if they touched it
                                const hasInput = (userInputs[sent.id] || []).join('').length > 0;

                                return (
                                    <button
                                        key={sent.id}
                                        onClick={() => handleSentenceSelect(cIdx, sIdx)}
                                        className={`flex items-center justify-center p-2 rounded-lg text-sm transition-all duration-200 border ${
                                            isActive 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                            : hasInput
                                                ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700'
                                        }`}
                                        title={`Sentence ${sIdx + 1}`}
                                    >
                                        <span className="font-bold">{sIdx + 1}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderModeSwitcher = () => (
        <div className="flex justify-center p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg inline-flex">
                <button 
                    onClick={() => setMode('mode1')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'mode1' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Nghe & Lặp lại
                </button>
                <button 
                    onClick={() => setMode('sentence')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'sentence' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Nghe & Chép
                </button>
                <button 
                    onClick={() => setMode('mode3')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'mode3' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sắp xếp lại câu
                </button>
            </div>
        </div>
    );

    const renderNavigation = () => (
        <div className="flex justify-between pt-4">
            <button 
                onClick={handlePrev}
                disabled={currentConversationIdx === 0 && currentSentenceIdx === 0}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
                Previous Sentence
            </button>
            <button 
                onClick={handleNext}
                disabled={currentConversationIdx === data.length - 1 && currentSentenceIdx === currentConversation.sentences.length - 1}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md transition-colors"
            >
                Next Sentence
            </button>
        </div>
    );

    const renderListenRepeat = () => {
         if (!currentSentence) return <div className="p-8 text-center text-slate-500">Select a sentence to begin practice.</div>;

         const revealed = revealedWords[currentSentence.id] || new Array(currentSentence.words.length).fill(false);

         return (
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Audio Player */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                             <h3 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-4">Nghe, lặp lại và check</h3>
                             <AudioPlayer ref={audioPlayerRef} audioScript={currentSentence.text} />
                        </div>

                        {/* Interactive Area */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                             <div className="flex flex-wrap gap-3 leading-loose justify-center min-h-[100px] content-center">
                                {currentSentence.words.map((word, index) => {
                                    const isRevealed = revealed[index];
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleWordReveal(index)}
                                            className={`rounded-lg px-3 py-2 text-lg font-medium transition-all duration-200 border-2 select-none ${
                                                isRevealed
                                                ? 'bg-transparent text-slate-800 dark:text-white border-transparent'
                                                : 'bg-slate-200 dark:bg-slate-700 text-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 min-w-[3rem]'
                                            }`}
                                        >
                                            {word}
                                        </button>
                                    );
                                })}
                             </div>

                             {/* Reveal Controls */}
                             <div className="flex flex-wrap justify-center gap-3 mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <span className="w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reveal Options</span>
                                <button onClick={() => handleBulkReveal(1)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600">1 từ</button>
                                <button onClick={() => handleBulkReveal(2)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600">2 từ</button>
                                <button onClick={() => handleBulkReveal(3)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600">3 từ</button>
                                <button onClick={() => handleBulkReveal('all')} className="px-4 py-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold shadow-sm transition-colors dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/50">Tất cả</button>
                                <button onClick={handleResetReveal} className="px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold shadow-sm transition-colors dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/50 flex items-center">
                                    <RefreshIcon className="w-4 h-4 mr-1" />
                                    Làm mới
                                </button>
                             </div>
                             
                             {/* Shortcuts Guide */}
                             <div className="mt-6 flex justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Ctrl</span> - Phát lại</span>
                                <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Enter</span> - Tiếp theo</span>
                             </div>
                        </div>

                         {renderNavigation()}
                    </div>
                </div>
            </div>
         );
    };

    const renderSentencePractice = () => {
        if (!currentSentence) return <div className="p-8 text-center text-slate-500">Select a sentence to begin practice.</div>;

        return (
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Audio Player */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                             <h3 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-4">Nghe và chép lại (Từ khóa)</h3>
                             <AudioPlayer ref={audioPlayerRef} audioScript={currentSentence.text} />
                        </div>

                        {/* Blocks Display & Input Area */}
                        <div className="space-y-6">
                            {/* Feedback Blocks */}
                            <div className="flex flex-wrap gap-2 leading-loose justify-center min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                {currentSentence.words.map((word, index) => {
                                    const isSolved = solvedIndices.has(index);
                                    
                                    let blockContent = "______";
                                    let blockClass = "px-2 py-1 border-b-2 text-lg transition-all duration-300 rounded-t ";

                                    if (isSolved) {
                                        blockContent = word;
                                        blockClass += "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 font-bold";
                                    } else {
                                        // Default hidden state
                                        blockClass += "border-slate-300 dark:border-slate-600 text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-700/50";
                                    }
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={blockClass}
                                        >
                                           {blockContent}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Single Textarea Input */}
                            <div className="w-full">
                                <textarea
                                    value={currentInputValue}
                                    onChange={(e) => handleFullSentenceChange(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg leading-relaxed shadow-sm resize-none"
                                    placeholder="Type the words you hear (order doesn't matter)..."
                                    rows={4}
                                    spellCheck={false}
                                />
                                <div className="flex justify-between items-start mt-4">
                                     <div className="flex flex-col gap-2">
                                        <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Ctrl</span> - Phát lại</span>
                                            <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Enter</span> - Kiểm tra</span>
                                        </div>
                                     </div>

                                    <div className="flex items-center gap-4">
                                        <p id="score-display" className="text-sm font-bold text-slate-500 transition-all duration-200">
                                            Found: {solvedIndices.size} / {currentSentence.words.length} words
                                        </p>
                                        <button 
                                            onClick={() => setIsAutoNext(!isAutoNext)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isAutoNext ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}
                                        >
                                            {isAutoNext && countdown !== null ? (
                                                <>
                                                    <ClockIcon className="w-3 h-3 animate-pulse" />
                                                    Next in {countdown}s
                                                </>
                                            ) : (
                                                "Chuyển tiếp sau 10s"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {renderNavigation()}
                    </div>
                </div>
            </div>
        );
    };

    const renderSentenceScramble = () => {
        if (!currentSentence) return <div className="p-8 text-center text-slate-500">Select a sentence to begin practice.</div>;

        return (
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Audio Player */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                             <h3 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-4">Nghe và sắp xếp lại câu</h3>
                             <AudioPlayer ref={audioPlayerRef} audioScript={currentSentence.text} />
                        </div>

                        {/* Interactive Area */}
                        <div className="space-y-6">
                            
                            {/* Target Drop Zone */}
                            <div className={`min-h-[80px] p-6 rounded-2xl border-2 transition-all duration-300 flex flex-wrap gap-3 items-center content-center ${
                                scrambleStatus === 'correct' 
                                    ? 'bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-600' 
                                    : scrambleStatus === 'wrong'
                                        ? 'bg-red-50 border-red-400 dark:bg-red-900/30 dark:border-red-600'
                                        : 'bg-white border-dashed border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                            }`}>
                                {targetBlocks.length === 0 && scrambleStatus === 'idle' && (
                                    <span className="text-slate-400 italic w-full text-center pointer-events-none select-none">
                                        Click words below to build the sentence...
                                    </span>
                                )}
                                {targetBlocks.map((block) => (
                                    <button
                                        key={block.id}
                                        onClick={() => handleMoveBlock(block, 'target')}
                                        className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all font-medium text-lg animate-in fade-in zoom-in-95 duration-200"
                                    >
                                        {block.text}
                                    </button>
                                ))}
                            </div>

                            {/* Status Message */}
                            <div className="h-8 text-center">
                                {scrambleStatus === 'correct' && <span className="text-green-600 font-bold text-lg animate-bounce inline-block">Correct! Excellent job.</span>}
                                {scrambleStatus === 'wrong' && <span className="text-red-600 font-bold text-lg animate-shake inline-block">Incorrect. Try again.</span>}
                            </div>

                            {/* Source Word Bank */}
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 justify-center min-h-[100px] content-start">
                                {sourceBlocks.map((block) => (
                                    <button
                                        key={block.id}
                                        onClick={() => handleMoveBlock(block, 'source')}
                                        className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-500 transition-all font-medium text-lg cursor-pointer"
                                    >
                                        {block.text}
                                    </button>
                                ))}
                                {sourceBlocks.length === 0 && (
                                    <span className="text-slate-400 italic">All words placed.</span>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center pt-4">
                                {scrambleStatus === 'correct' ? (
                                    <button 
                                        onClick={handleNext} 
                                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-all transform hover:scale-105"
                                    >
                                        Next Sentence
                                    </button>
                                ) : (
                                    <button 
                                        onClick={checkScrambleAnswer} 
                                        disabled={targetBlocks.length === 0}
                                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg transition-all transform hover:scale-105 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                                    >
                                        Check Answer
                                    </button>
                                )}
                            </div>
                            
                            {/* Shortcuts Guide */}
                             <div className="mt-6 flex justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Ctrl</span> - Phát lại</span>
                                <span className="flex items-center"><span className="border border-slate-300 px-1.5 py-0.5 rounded mx-1">Enter</span> - {scrambleStatus === 'correct' ? 'Next' : 'Check'}</span>
                             </div>

                        </div>
                        {renderNavigation()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {renderLeftSidebar()}
            <div className="flex-1 flex-col h-full overflow-hidden hidden md:flex">
                {renderModeSwitcher()}
                <div className="flex-1 overflow-hidden relative">
                    {mode === 'sentence' && renderSentencePractice()}
                    {mode === 'mode1' && renderListenRepeat()}
                    {mode === 'mode3' && renderSentenceScramble()}
                </div>
            </div>
             {/* Mobile View Placeholder */}
             <div className="flex-1 flex flex-col h-full overflow-hidden md:hidden">
                 {renderModeSwitcher()}
                 <div className="flex-1 overflow-hidden relative">
                     {mode === 'sentence' && renderSentencePractice()}
                     {mode === 'mode1' && renderListenRepeat()}
                     {mode === 'mode3' && renderSentenceScramble()}
                 </div>
             </div>
        </div>
    );
};

export default ListeningIntensePracticeScreen;