import React, { useState } from 'react';
import SelectionCard from './SelectionCard';
import { ArrowLeftIcon, XCircleIcon } from './icons';
import { ListeningIntenseTestData, User } from '../types';
import { allListeningIntenseTests } from '../services/listeningIntenseLibrary';

interface ListeningIntenseScreenProps {
    currentUser?: User | null;
    onBack: () => void;
    onSelectPart: (testId: number, part: 'part1' | 'part2' | 'part3' | 'part4') => void;
}

const ListeningIntenseScreen: React.FC<ListeningIntenseScreenProps> = ({ currentUser, onBack, onSelectPart }) => {
    const [selectedTest, setSelectedTest] = useState<ListeningIntenseTestData | null>(null);

    const handleTestClick = (test: ListeningIntenseTestData) => {
        setSelectedTest(test);
    };

    const handlePartSelect = (part: 'part1' | 'part2' | 'part3' | 'part4') => {
        if (selectedTest) {
            onSelectPart(selectedTest.id, part);
            setSelectedTest(null);
        }
    };

    const groupedTests = allListeningIntenseTests.reduce((acc, test) => {
        if (!acc[test.group]) acc[test.group] = [];
        acc[test.group].push(test);
        return acc;
    }, {} as Record<string, ListeningIntenseTestData[]>);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Quay lại
                </button>
                
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">Listening (Chuyên sâu)</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Nâng cao kỹ năng nghe với các bài luyện tập chuyên biệt dành cho mục tiêu điểm cao.
                    </p>
                </div>

                {Object.keys(groupedTests).sort().reverse().map(group => (
                    <div key={group} className="mb-12">
                         <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">{group}</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {groupedTests[group].map(test => (
                                <SelectionCard 
                                    key={test.id}
                                    title={test.title}
                                    description={`Luyện nghe chuyên sâu ${test.title} ${group}.`}
                                    onClick={() => handleTestClick(test)}
                                    isComingSoon={false}
                                    isLocked={!currentUser && test.id !== 1 && test.id !== 11}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Part Selection Modal */}
            {selectedTest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700 transform animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{selectedTest.title}</h3>
                                <button onClick={() => setSelectedTest(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 font-bold mb-4 text-center">
                                Chọn phần luyện tập:
                            </p>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => handlePartSelect('part1')}
                                    className="w-full px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-left flex justify-between items-center group"
                                >
                                    <span>Part 1 (Photographs)</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                                <button 
                                    onClick={() => handlePartSelect('part2')}
                                    className="w-full px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-left flex justify-between items-center group"
                                >
                                    <span>Part 2 (Question-Response)</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                                <button 
                                    onClick={() => handlePartSelect('part3')}
                                    className="w-full px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-left flex justify-between items-center group"
                                >
                                    <span>Part 3 (Conversations)</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                                <button 
                                    onClick={() => handlePartSelect('part4')}
                                    className="w-full px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-left flex justify-between items-center group"
                                >
                                    <span>Part 4 (Talks)</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeningIntenseScreen;