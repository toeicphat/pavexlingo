import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const QUOTES = [
    "Đi thi dựa vào thực lực, chứ phòng thi không có chế độ 'tâm linh' đâu em!",
    "Muốn đổi đời bằng TOEIC, thì trước hết phải đổi lịch ngủ thành lịch học cái đã.",
    "Tấm bằng TOEIC không tự sinh ra và cũng không tự mất đi, nó chỉ chuyển từ người chăm chỉ sang... người khác!",
    "Đừng để số điểm TOEIC của mình còn thấp hơn cả nhiệt độ phòng điều hòa nhé.",
    "Nước đến chân mới nhảy thì chỉ có nhảy... vào phòng thi lại thôi. Học ngay đi!",
    "Giấc mơ không tốn tiền mua, nhưng bằng TOEIC thì phải 'mua' bằng mồ hôi và nước mắt.",
    "Người yêu có thể bỏ bạn, nhưng TOEIC thì luôn chung thủy. Vào học thôi!",
    "Học TOEIC không mệt bằng cảm giác nhìn đứa bên cạnh nộp bài sớm đâu.",
    "Đừng hỏi tại sao TOEIC khó, hãy hỏi tại sao lúc người ta học thì mình lại bấm điện thoại.",
    "Muốn đứng ở vị trí không ai đứng được, thì phải học những lúc người ta đang... ngủ.",
    "Muốn thi đậu thì nhào vào mà học, không học thì sao mà đi thi được?"
];

const COLORS = [
    'text-red-500',
    'text-blue-500',
    'text-green-600',
    'text-yellow-600',
    'text-purple-500',
    'text-pink-500',
    'text-indigo-500',
    'text-teal-500',
    'text-orange-500'
];

export const QuotesMarquee = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const styledQuotes = useMemo(() => {
        return QUOTES.map(quote => {
            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            return { text: quote, className: randomColor };
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % styledQuotes.length);
        }, 5000); // Change quote every 5 seconds
        return () => clearInterval(interval);
    }, [styledQuotes.length]);

    const currentQuote = styledQuotes[currentIndex];

    return (
        <div className="flex-1 mx-4 relative h-16 sm:h-12 flex justify-center items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-inner px-4 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className={`font-bold text-sm text-center tracking-wide leading-snug line-clamp-2 ${currentQuote.className}`}
                >
                    {currentQuote.text}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

