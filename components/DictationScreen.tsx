import React from 'react';
import { ets2024Tests, ets2026Tests } from '../services/dictationLibrary';
import { User, DictationMode } from '../types';
import { BookOpenIcon, BrainIcon } from './icons';
import SelectionCard from './SelectionCard';

interface DictationScreenProps {
    currentUser: User;
    onSelectTestSet: (testId: number) => void;
    dictationMode: DictationMode;
    onModeChange: (mode: DictationMode) => void;
}

const DictationScreen: React.FC<DictationScreenProps> = ({ onSelectTestSet, dictationMode, onModeChange }) => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">Luyện chép chính tả</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                      Cải thiện khả năng nghe sâu qua kho đề thi ETS chính thức.
                    </p>
                </div>

                {/* Mode Selection */}
                <div className="max-w-xl mx-auto mb-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                    <h3 className="text-center font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-sm">Chọn chế độ luyện tập</h3>
                    <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                        <button 
                            onClick={() => onModeChange('easy')}
                            className={`flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all duration-200 ${dictationMode === 'easy' ? 'bg-white dark:bg-slate-700 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <BookOpenIcon className={`h-6 w-6 ${dictationMode === 'easy' ? 'text-blue-600' : ''}`} />
                            <span className="font-bold text-sm">Easy Mode</span>
                            <span className="text-[10px] opacity-70">Điền từ còn thiếu</span>
                        </button>
                        <button 
                            onClick={() => onModeChange('hard')}
                            className={`flex flex-col items-center gap-1 py-3 px-4 rounded-lg transition-all duration-200 ${dictationMode === 'hard' ? 'bg-white dark:bg-slate-700 shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <BrainIcon className={`h-6 w-6 ${dictationMode === 'hard' ? 'text-red-500' : ''}`} />
                            <span className="font-bold text-sm">Hard Mode</span>
                            <span className="text-[10px] opacity-70">Chép toàn bộ văn bản</span>
                        </button>
                    </div>
                </div>

                {/* ETS 2024 Section */}
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center border-b border-slate-200 dark:border-slate-700 pb-4 uppercase">
                        Thư viện đề ETS 2024
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {ets2024Tests.map(test => (
                            <SelectionCard 
                                key={test.id}
                                title={test.title}
                                description={test.description}
                                onClick={() => onSelectTestSet(test.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* ETS 2026 Section */}
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center border-b border-slate-200 dark:border-slate-700 pb-4 uppercase">
                        Thư viện đề ETS 2026
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {ets2026Tests.map(test => (
                            <SelectionCard 
                                key={test.id}
                                title={test.title}
                                description={test.description}
                                onClick={() => onSelectTestSet(test.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DictationScreen;
