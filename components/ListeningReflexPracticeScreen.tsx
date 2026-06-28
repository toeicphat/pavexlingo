import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeftIcon, PlayIcon, PauseIcon, CheckCircleIcon } from "./icons";
import { ListeningIntenseConversation } from "../types";

interface ListeningReflexPracticeScreenProps {
  data: ListeningIntenseConversation[];
  onBack: () => void;
}

const ListeningReflexPracticeScreen: React.FC<
  ListeningReflexPracticeScreenProps
> = ({ data, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >(() => {
    try {
      const stored = localStorage.getItem("listening-reflex-progress");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load reflex progress", e);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem("listening-reflex-progress", JSON.stringify(selectedAnswers));
    } catch (e) {
      console.error("Failed to save reflex progress", e);
    }
  }, [selectedAnswers]);

  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [isPlayingAnswer, setIsPlayingAnswer] = useState(false);

  const currentQuestion = data[currentIndex];

  const parsedText = useMemo(() => {
    // Reconstruct full text safely
    const fullText = currentQuestion.sentences.map((s) => s.text).join(" ");
    const match = fullText.match(
      /([\s\S]*?)\(A\)([\s\S]*?)\(B\)([\s\S]*?)\(C\)([\s\S]*)/i,
    );
    if (match) {
      return {
        question: match[1].trim(),
        a: match[2].trim(),
        b: match[3].trim(),
        c: match[4].trim(),
      };
    }
    return {
      question: fullText,
      a: "Không lấy được dữ liệu do định dạng",
      b: "Không lấy được dữ liệu do định dạng",
      c: "Không lấy được dữ liệu do định dạng",
    };
  }, [currentQuestion]);

  const handleSelectAnswer = (ans: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: ans,
    }));
  };

  const playTTS = (text: string, onStart: () => void, onEnd: () => void) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = onEnd;

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayQuestion = () => {
    if (isPlayingQuestion || isPlayingAnswer) {
      window.speechSynthesis.cancel();
      setIsPlayingQuestion(false);
      setIsPlayingAnswer(false);
      return;
    }
    playTTS(
      parsedText.question,
      () => setIsPlayingQuestion(true),
      () => setIsPlayingQuestion(false),
    );
  };

  const handlePlayAnswer = () => {
    if (isPlayingQuestion || isPlayingAnswer) {
      window.speechSynthesis.cancel();
      setIsPlayingQuestion(false);
      setIsPlayingAnswer(false);
      return;
    }
    const answersText = `A. ${parsedText.a}. B. ${parsedText.b}. C. ${parsedText.c}.`;
    playTTS(
      answersText,
      () => setIsPlayingAnswer(true),
      () => setIsPlayingAnswer(false),
    );
  };

  // Cancel audio if component unmounts or question changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlayingQuestion(false);
    setIsPlayingAnswer(false);
  }, [currentIndex]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Quay lại
        </button>
        <h2 className="text-2xl font-bold ml-6 text-slate-800 dark:text-slate-100 hidden sm:block">
          Luyện phản xạ Part 2
        </h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Column: Question Palette */}
        <div className="w-full lg:w-1/4 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 text-lg sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
            Question Palette
          </div>
          <div className="p-4 grid grid-cols-5 gap-2 overflow-y-auto">
            {data.map((item, idx) => {
              const isSelected = idx === currentIndex;
              const hasAnswered = !!selectedAnswers[item.id];
              const displayId = item.title.replace("Question ", "");
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all shadow-sm ${
                    isSelected
                      ? "bg-blue-600 text-white ring-2 ring-blue-300"
                      : hasAnswered
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {displayId}
                  {hasAnswered && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white dark:bg-slate-800 rounded-full">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle & Right Columns Area */}
        <div className="w-full lg:w-3/4 flex flex-col md:flex-row gap-6">
          {/* Middle Column: Question TTS */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-400 font-bold rounded-full text-sm mb-4">
                {currentQuestion.title}
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                Listen to the question
              </h3>
            </div>

            <div className="relative group perspective">
              <button
                onClick={handlePlayQuestion}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isPlayingQuestion
                    ? "bg-indigo-600 shadow-indigo-500/50 scale-95"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-indigo-500/30"
                }`}
              >
                {isPlayingQuestion ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-8 bg-white/90 rounded-full animate-pulse"></div>
                    <div className="w-2 h-12 bg-white/90 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-8 bg-white/90 rounded-full animate-pulse delay-150"></div>
                  </div>
                ) : (
                  <PlayIcon className="w-16 h-16 text-white ml-2" />
                )}
              </button>
            </div>

            {/* For debugging only - let users actually hear TTS or see hidden text */}
            <div className="opacity-0 hover:opacity-10 transition-opacity p-4 bg-slate-100 dark:bg-slate-900 rounded select-all cursor-text text-sm">
              {parsedText.question}
            </div>
          </div>

          {/* Right Column: Answers TTS & Selection */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                Listen & Choose
              </h3>

              <button
                onClick={handlePlayAnswer}
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isPlayingAnswer
                    ? "bg-blue-600 shadow-blue-500/50 scale-95"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 hover:scale-105"
                }`}
              >
                {isPlayingAnswer ? (
                  <PauseIcon className="w-10 h-10 text-white" />
                ) : (
                  <PlayIcon className="w-10 h-10 text-slate-600 dark:text-slate-300 ml-1" />
                )}
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 max-w-sm mx-auto w-full">
              {["A", "B", "C"].map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center group font-bold text-lg ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-700"
                      }`}
                    >
                      {opt}
                    </div>
                    Lựa chọn {opt}
                  </button>
                );
              })}
            </div>

            {/* Hidden answers mapping for debug / check */}
            <div className="opacity-0 hover:opacity-10 mt-8 text-xs text-center space-y-1">
              <p>A: {parsedText.a}</p>
              <p>B: {parsedText.b}</p>
              <p>C: {parsedText.c}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningReflexPracticeScreen;
