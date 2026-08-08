import React from 'react';
import { SectionGrammarIcon, StudyIcon } from './icons';

interface ReadingHubProps {
  onNavigateToGrammar: () => void;
  onNavigateToStudy: () => void;
  onBack: () => void;
}

const PracticeCard: React.FC<{
    title: string, 
    description: string, 
    onClick: () => void, 
    icon: React.FC<any>,
    iconColor: string,
}> = ({ title, description, onClick, icon: Icon, iconColor }) => (
    <button 
        onClick={onClick}
        className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 text-left w-full h-full flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1`}
    >
        <div className="relative">
            <Icon className={`h-12 w-12 ${iconColor} mb-4`} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 flex-grow">{description}</p>
    </button>
);

const ReadingHub: React.FC<ReadingHubProps> = ({ 
    onNavigateToGrammar,
    onNavigateToStudy,
    onBack
}) => {
  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="max-w-4xl mx-auto text-center mb-12 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight">Reading</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Các kỹ năng và bài tập phần Đọc
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <PracticeCard 
            title="Ngữ pháp"
            description="Ôn luyện các chủ điểm ngữ pháp TOEIC qua bài tập và đánh giá chi tiết."
            onClick={onNavigateToGrammar}
            icon={SectionGrammarIcon}
            iconColor="text-green-600"
        />
        <PracticeCard 
            title="Luyện tập"
            description="Luyện tập các phần bài đọc TOEIC."
            onClick={onNavigateToStudy}
            icon={StudyIcon}
            iconColor="text-blue-600"
        />
      </div>

      <div className="mt-8 max-w-4xl mx-auto text-center">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default ReadingHub;
