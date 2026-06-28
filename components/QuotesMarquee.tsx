import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  "Muốn thi đậu thì nhào vào mà học, không học thì sao mà đi thi được?",
];

const COLORS = [
  "text-red-500",
  "text-blue-500",
  "text-green-600",
  "text-yellow-600",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-teal-500",
  "text-orange-500",
];

export const QuotesMarquee = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const styledQuotes = useMemo(() => {
    return QUOTES.map((quote) => {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      return { text: quote, className: randomColor };
    });
  }, []);

  useEffect(() => {
    const currentText = styledQuotes[currentIndex].text;

    let timeout: NodeJS.Timeout;
    if (charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 50); // Typing speed
    } else {
      timeout = setTimeout(() => {
        // Wait 3 seconds after fully typed, then move to next quote
        setCurrentIndex((prev) => (prev + 1) % styledQuotes.length);
        setCharIndex(0);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, charIndex, styledQuotes]);

  const currentQuote = styledQuotes[currentIndex];

  return (
    <div className="flex-1 mx-4 relative min-h-[3rem] h-auto flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-inner p-2 px-4 overflow-hidden">
      <div
        className={`font-bold text-sm text-center tracking-wide leading-relaxed line-clamp-2 w-full ${currentQuote.className}`}
      >
        {currentQuote.text.substring(0, charIndex)}
        <span className="animate-pulse opacity-70 ml-1">|</span>
      </div>
    </div>
  );
};
