import React from 'react';
import SelectionCard from './SelectionCard';

interface StudyScreenProps {
  onBack: () => void;
  onStartPart5Test: () => void;
}

const StudyScreen: React.FC<StudyScreenProps> = ({ onBack, onStartPart5Test }) => {
  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="max-w-4xl mx-auto text-center mb-12 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight">Luyện tập</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Luyện tập các phần bài đọc TOEIC.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectionCard 
            title="Chuyên sâu Part 5 tổng hợp 2026 - 100 câu"
            description="Bài luyện tập trắc nghiệm ngữ pháp và từ vựng Part 5."
            onClick={onStartPart5Test}
        />
      </div>
      <div className="mt-8 max-w-4xl mx-auto text-center">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline">
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default StudyScreen;
