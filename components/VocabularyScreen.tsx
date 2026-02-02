import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getVocabularyList, getWordsForReview, updateWordSrsLevel, deleteVocabularyWord } from '../services/vocabularyService';
import { VocabularyWord, VocabularyPart, VocabularyTest } from '../types';
import { LoadingIcon, BrainIcon, BookOpenIcon, TrashIcon, LightBulbIcon, PlusIcon, PencilIcon } from './icons';
import { vocabularyData } from '../services/vocabularyLibrary';
import { getCustomSets, saveCustomSet, deleteCustomSet, parseVocabularyInput } from '../services/customVocabularyService';
import SelectionCard from './SelectionCard';

type InternalView = 'main_hub' | 'srs_hub' | 'srs_review' | 'srs_list' | 'custom_hub' | 'create_custom_set';

interface VocabularyScreenProps {
    onSelectPart: (partId: number) => void;
    onStartCustomTest?: (test: VocabularyTest) => void;
}

const VocabularyScreen: React.FC<VocabularyScreenProps> = ({ onSelectPart, onStartCustomTest }) => {
    const [view, setView] = useState<InternalView>('main_hub');
    const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
    const [reviewQueue, setReviewQueue] = useState<VocabularyWord[]>([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [isDefinitionVisible, setIsDefinitionVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Custom set state
    const [customSets, setCustomSets] = useState<VocabularyTest[]>([]);
    const [newSetTitle, setNewSetTitle] = useState('');
    const [newSetContent, setNewSetContent] = useState('');
    const [parsedPreview, setParsedPreview] = useState<any[]>([]);

    const loadSrsWords = useCallback(async () => {
        setIsLoading(true);
        const words = await getVocabularyList();
        setAllWords(words);
        setIsLoading(false);
    }, []);

    const loadCustomSets = useCallback(() => {
        setCustomSets(getCustomSets());
    }, []);

    useEffect(() => {
        if (view === 'srs_hub' || view === 'srs_review' || view === 'srs_list') {
            loadSrsWords();
        } else if (view === 'custom_hub') {
            loadCustomSets();
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [view, loadSrsWords, loadCustomSets]);
    
    const wordsDueForReview = useMemo(() => getWordsForReview(allWords), [allWords]);

    const startReviewSession = () => {
        setReviewQueue(wordsDueForReview);
        setCurrentReviewIndex(0);
        setIsDefinitionVisible(false);
        setView('srs_review');
    };

    const handleReviewAction = async (performance: 'hard' | 'good' | 'easy') => {
        if (currentReviewIndex >= reviewQueue.length) return;
        const currentWord = reviewQueue[currentReviewIndex];
        await updateWordSrsLevel(currentWord.id, performance);
        
        if (currentReviewIndex + 1 < reviewQueue.length) {
            setCurrentReviewIndex(prev => prev + 1);
            setIsDefinitionVisible(false);
        } else {
            // End of session, go back to hub which will trigger a refetch
            setView('srs_hub');
        }
    };
    
    const handleDeleteWord = async (wordId: string) => {
        if (window.confirm("Are you sure you want to delete this word? This action cannot be undone.")) {
            await deleteVocabularyWord(wordId);
            loadSrsWords(); // Refetch the list
        }
    };

    // Custom Set Handlers
    const handleSaveCustomSet = () => {
        if (!newSetTitle.trim()) {
            alert("Please enter a title for your set.");
            return;
        }
        const words = parseVocabularyInput(newSetContent);
        if (words.length === 0) {
            alert("Please enter at least one word.");
            return;
        }

        const newSet: VocabularyTest = {
            id: Date.now(),
            title: newSetTitle,
            words: words
        };

        saveCustomSet(newSet);
        setNewSetTitle('');
        setNewSetContent('');
        setParsedPreview([]);
        setView('custom_hub');
    };

    const handleDeleteCustomSet = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this set?")) {
            deleteCustomSet(id);
            loadCustomSets();
        }
    };

    useEffect(() => {
        if (view === 'create_custom_set') {
            const words = parseVocabularyInput(newSetContent);
            setParsedPreview(words);
        }
    }, [newSetContent, view]);


    const renderCreateCustomSet = () => (
        <div className="max-w-4xl mx-auto">
             <button onClick={() => setView('custom_hub')} className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to My Custom Sets
            </button>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Vocabulary Set</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Set Title</label>
                    <input 
                        type="text" 
                        value={newSetTitle}
                        onChange={(e) => setNewSetTitle(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g., My Difficult Words"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Words & Definitions 
                        <span className="font-normal text-slate-500 ml-2 text-xs">(Format: word - definition, or word, definition)</span>
                    </label>
                    <textarea 
                        value={newSetContent}
                        onChange={(e) => setNewSetContent(e.target.value)}
                        className="w-full h-64 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        placeholder={`flower - hoa\nbake, nướng\ncontrol; điều khiển`}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                        {parsedPreview.length} words recognized
                    </div>
                    <button 
                        onClick={handleSaveCustomSet}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Set
                    </button>
                </div>

                {parsedPreview.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Preview</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {parsedPreview.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200 text-sm">
                                    <span className="font-semibold text-slate-700">{item.word}</span>
                                    <span className="text-slate-500">{item.definition}</span>
                                </div>
                            ))}
                            {parsedPreview.length > 6 && <div className="text-sm text-slate-400 italic p-2">...and {parsedPreview.length - 6} more</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCustomHub = () => (
        <div className="max-w-6xl mx-auto">
             <button onClick={() => setView('main_hub')} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Vocabulary Hub
            </button>
            
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900">Tự chọn (Custom Sets)</h2>
                <button 
                    onClick={() => setView('create_custom_set')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Create New Set
                </button>
            </div>

            <p className="text-red-500 font-bold mb-8 animate-zoom-out-in text-center sm:text-left">
                Lưu ý: Từ vựng chỉ lưu lại trong thiết bị bạn đã tạo từ vựng
            </p>

            {customSets.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
                    <PencilIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No custom sets yet</h3>
                    <p className="text-slate-400 mt-2">Create your own vocabulary lists to practice specific words.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {customSets.map(set => (
                        <div 
                            key={set.id}
                            onClick={() => onStartCustomTest && onStartCustomTest(set)}
                            className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer relative group"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-2 pr-8">{set.title}</h3>
                            <p className="text-slate-500">{set.words.length} words</p>
                            
                            <button 
                                onClick={(e) => handleDeleteCustomSet(set.id, e)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Set"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
    const renderSrsHub = () => (
        <div className="max-w-4xl mx-auto">
             <button onClick={() => setView('main_hub')} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Vocabulary Hub
            </button>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">My Flashcards (SRS)</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Master your personally saved vocabulary with smart flashcards.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <p className="text-5xl font-bold text-blue-600">{wordsDueForReview.length}</p>
                    <p className="text-slate-600 font-semibold mt-1">Words to Review</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <p className="text-5xl font-bold text-slate-800">{allWords.length}</p>
                    <p className="text-slate-600 font-semibold mt-1">Total Words Saved</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <p className="text-5xl font-bold text-green-600">{allWords.filter(w => w.srsLevel > 0).length}</p>
                    <p className="text-slate-600 font-semibold mt-1">Words Learned</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <button
                    onClick={startReviewSession}
                    disabled={wordsDueForReview.length === 0}
                    className="flex-1 flex flex-col items-center justify-center p-8 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <BrainIcon className="h-12 w-12 mb-3" />
                    <span className="text-2xl font-bold">Start Review Session</span>
                    <span className="text-blue-200">{wordsDueForReview.length > 0 ? `${wordsDueForReview.length} words due` : 'All caught up!'}</span>
                </button>
                <button
                    onClick={() => setView('srs_list')}
                    className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-slate-800 rounded-xl shadow-lg hover:bg-slate-100 transition-all duration-300 border border-slate-200"
                >
                    <BookOpenIcon className="h-12 w-12 mb-3 text-slate-500" />
                    <span className="text-2xl font-bold">View All Saved Words</span>
                    <span className="text-slate-500">{allWords.length} words saved</span>
                </button>
            </div>
        </div>
    );
    
    const renderSrsReviewSession = () => {
        if (reviewQueue.length === 0) {
            return (
                <div className="text-center max-w-xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-800">All Done!</h3>
                    <p className="text-slate-600 mt-2">You have no words to review right now. Come back later!</p>
                    <button onClick={() => setView('srs_hub')} className="mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Back to My Flashcards</button>
                </div>
            );
        }

        const currentWord = reviewQueue[currentReviewIndex];

        return (
            <div className="max-w-2xl mx-auto">
                 <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setView('srs_hub')} className="text-blue-600 font-semibold hover:underline">Exit Session</button>
                    <span className="text-slate-600 font-bold">{currentReviewIndex + 1} / {reviewQueue.length}</span>
                </div>

                <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-8 min-h-[350px] flex flex-col items-center justify-center text-center transition-all duration-500">
                   <h3 className="text-5xl font-bold text-slate-800 tracking-tight">{currentWord.word}</h3>
                   
                   {isDefinitionVisible && (
                       <div className="mt-6 w-full animate-fade-in">
                          <p className="text-xl text-slate-700">{currentWord.definition}</p>
                          {currentWord.sourceText && (
                              <p className="text-sm text-slate-500 italic mt-4 bg-slate-50 p-3 rounded-md">
                                  {currentWord.sourceText}
                              </p>
                          )}
                       </div>
                   )}
                </div>

                <div className="mt-8">
                {!isDefinitionVisible ? (
                     <button onClick={() => setIsDefinitionVisible(true)} className="w-full flex items-center justify-center p-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                        <LightBulbIcon className="h-6 w-6 mr-2" />
                         Show Definition
                     </button>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => handleReviewAction('hard')} className="p-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">Hard</button>
                        <button onClick={() => handleReviewAction('good')} className="p-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors">Good</button>
                        <button onClick={() => handleReviewAction('easy')} className="p-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">Easy</button>
                    </div>
                )}
                </div>
            </div>
        );
    };

    const renderSrsWordList = () => (
        <div className="max-w-4xl mx-auto">
             <button onClick={() => setView('srs_hub')} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to My Flashcards
            </button>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">All Saved Words ({allWords.length})</h2>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {allWords.length > 0 ? allWords.map(word => (
                        <li key={word.id} className="p-4 md:p-6 flex justify-between items-start hover:bg-slate-50">
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">{word.word}</h4>
                                <p className="text-slate-600 mt-1">{word.definition}</p>
                                <p className="text-xs text-slate-400 mt-2">
                                    Next Review: {new Date(word.nextReviewDate).toLocaleDateString()} (Level {word.srsLevel})
                                </p>
                            </div>
                            <button 
                                onClick={() => handleDeleteWord(word.id)} 
                                className="ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                aria-label={`Delete ${word.word}`}
                            >
                                <TrashIcon className="h-5 w-5"/>
                            </button>
                        </li>
                    )) : (
                        <li className="p-8 text-center text-slate-500">You haven't saved any words yet. Select text during a test to save it!</li>
                    )}
                </ul>
            </div>
        </div>
    );
    
    const renderMainHub = () => (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Vocabulary Hub</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Choose a structured learning path or review your personal flashcards.
                </p>
            </div>

            <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Practice by Part</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {vocabularyData.map(part => (
                        <SelectionCard 
                            key={part.id}
                            title={part.title}
                            description={part.description}
                            onClick={() => onSelectPart(part.id)}
                            isComingSoon={part.isComingSoon}
                            isNew={part.isNew}
                        />
                    ))}
                    
                    {/* New "Tự chọn" Section */}
                    <button 
                        onClick={() => setView('custom_hub')}
                        className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 text-left w-full h-full flex flex-col relative overflow-hidden group"
                    >
                         <div className="absolute top-0 right-0">
                            <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 shadow-md rounded-bl-lg">
                                Tự tạo
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <h3 className="text-xl font-bold text-slate-800 mr-2">Tự chọn (Custom)</h3>
                                <PencilIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <p className="text-slate-500 text-sm flex-grow">Tự tạo từ vựng cá nhân hóa.</p>
                        </div>
                    </button>
                </div>
            </div>

            <div className="text-center">
                 <div className="bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-200 inline-block">
                     <h3 className="text-xl font-bold text-slate-800 mb-2">My Personal Flashcards</h3>
                     <p className="text-slate-600 text-sm mb-4">Review words you've saved using our Spaced Repetition System.</p>
                     <button
                        onClick={() => setView('srs_hub')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Go to My Flashcards
                    </button>
                 </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center"><LoadingIcon className="h-10 w-10 text-blue-600 animate-spin"/></div>
        }
        switch (view) {
            case 'main_hub':
                return renderMainHub();
            case 'srs_hub':
                return renderSrsHub();
            case 'srs_review':
                return renderSrsReviewSession();
            case 'srs_list':
                return renderSrsWordList();
            case 'custom_hub':
                return renderCustomHub();
            case 'create_custom_set':
                return renderCreateCustomSet();
            default:
                return renderMainHub();
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {renderContent()}
        </div>
    );
};

export default VocabularyScreen;