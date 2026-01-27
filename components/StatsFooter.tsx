import React, { useState, useEffect } from 'react';

const StatsFooter: React.FC = () => {
    const [onlineUsers, setOnlineUsers] = useState<number>(0);

    useEffect(() => {
        // Random number between 50 and 100
        const randomNum = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        setOnlineUsers(randomNum);
    }, []);

    return (
        <footer className="bg-slate-100 dark:bg-slate-900 py-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-3">
                     <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse tracking-wide">
                        Practice makes perfect
                     </span>
                </div>
                <div className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
                    Hiện đang có <span className="font-bold text-blue-600 dark:text-blue-400 text-lg mx-1">{onlineUsers}</span> người đang cùng bạn chiến đấu cho bài thi TOEIC 😤🔥
                </div>

                <div className="mt-6 text-xs text-slate-500 dark:text-slate-600">
                    © {new Date().getFullYear()} <a href="https://www.facebook.com/phattruong.english" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mr.Phat TOEIC</a>. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default StatsFooter;