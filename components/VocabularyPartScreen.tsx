import React, { useState } from 'react';
import { VocabularyPart, VocabularyTest } from '../types';
import SelectionCard from './SelectionCard';
import { ArrowLeftIcon, XCircleIcon } from './icons';

interface VocabularyPartScreenProps {
    partData: VocabularyPart;
    onSelectTest: (partId: number, testId: number, limit?: number) => void;
    onBack: () => void;
}

const VocabularyPartScreen: React.FC<VocabularyPartScreenProps> = ({ partData, onSelectTest, onBack }) => {
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
    const [wordLimit, setWordLimit] = useState<number>(30);
    const [maxWords, setMaxWords] = useState<number>(0);

    const handleTestClick = (test: VocabularyTest) => {
        if (test.words.length > 30) {
            setSelectedTestId(test.id);
            setMaxWords(test.words.length);
            setWordLimit(30);
            setShowLimitModal(true);
        } else {
            onSelectTest(partData.id, test.id);
        }
    };

    const handleConfirmLimit = () => {
        if (selectedTestId !== null) {
            const finalLimit = Math.max(1, Math.min(wordLimit, maxWords));
            onSelectTest(partData.id, selectedTestId, finalLimit);
            setShowLimitModal(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Vocabulary Hub
                </button>
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">{partData.title}</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{partData.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {partData.tests.map(test => (
                        <SelectionCard 
                            key={test.id}
                            title={test.title}
                            description={`${test.words.length} words`}
                            onClick={() => handleTestClick(test)}
                        />
                    ))}
                </div>
            </div>

            {/* Word Limit Modal */}
            {showLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700 transform animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Thiết lập bài học</h3>
                                <button onClick={() => setShowLimitModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 font-bold mb-4">
                                Xin vui lòng nhập số lượng từ bạn muốn học:
                            </p>
                            
                            <div className="relative mb-6">
                                <input 
                                    type="number" 
                                    value={wordLimit}
                                    min={1}
                                    max={maxWords}
                                    onChange={(e) => setWordLimit(parseInt(e.target.value) || 0)}
                                    className="w-full text-3xl font-black text-center p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-colors dark:text-white"
                                />
                                <div className="text-center mt-2 text-sm text-slate-400 font-bold">
                                    Tổng số từ trong bộ: {maxWords}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setShowLimitModal(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    onClick={handleConfirmLimit}
                                    className="px-6 py-3 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_0_0_rgba(29,78,216,1)] active:shadow-none active:translate-y-[4px] transition-all"
                                >
                                    Bắt đầu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VocabularyPartScreen;