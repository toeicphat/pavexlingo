import React from 'react';

interface SelectionCardProps {
    title: string;
    description: string;
    onClick: () => void;
    isComingSoon?: boolean;
    isNew?: boolean;
    isLocked?: boolean;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ title, description, onClick, isComingSoon, isNew, isLocked }) => {
    const handleClick = () => {
        if (isComingSoon) return;
        if (isLocked) {
            alert('Bạn cần đăng nhập để sử dụng tính năng này.');
            return;
        }
        onClick();
    };

    return (
        <button 
            onClick={handleClick}
            className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 border border-slate-200 text-left w-full h-full flex flex-col relative overflow-hidden ${
                isComingSoon 
                ? 'opacity-80 cursor-default' 
                : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
            }`}
        >
            {isComingSoon && (
                <div className="absolute top-0 right-0">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 shadow-md rounded-bl-lg">
                        Sắp ra mắt
                    </div>
                </div>
            )}
            {!isComingSoon && isLocked && (
                <div className="absolute top-0 right-0">
                    <div className="rainbow-bg p-[2px] rounded-bl-lg shadow-md flex items-center justify-center">
                        <div className="bg-white rounded-bl-lg px-3 py-1 w-full h-full">
                            <span className="rainbow-text text-[10px] font-bold tracking-widest uppercase">Pro</span>
                        </div>
                    </div>
                </div>
            )}
            {!isComingSoon && !isLocked && isNew && (
                <div className="absolute top-0 right-0">
                    <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 shadow-md rounded-bl-lg">
                        Mới
                    </div>
                </div>
            )}
            <div className={(isComingSoon || isLocked) ? "opacity-40 grayscale filter" : ""}>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm flex-grow">{description}</p>
            </div>
        </button>
    );
};

export default SelectionCard;