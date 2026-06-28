import React, { useState } from "react";
import { VocabularyPart, VocabularyTest } from "../types";
import SelectionCard from "./SelectionCard";
import { ArrowLeftIcon, ArrowRightIcon, XCircleIcon } from "./icons";

interface VocabularyPartScreenProps {
  partData: VocabularyPart;
  onSelectTest: (partId: number, testId: number, limit?: number) => void;
  onStartCustomTest: (test: VocabularyTest) => void;
  onBack: () => void;
}

const VocabularyPartScreen: React.FC<VocabularyPartScreenProps> = ({
  partData,
  onSelectTest,
  onStartCustomTest,
  onBack,
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [selectedWordIndices, setSelectedWordIndices] = useState<Set<number>>(
    new Set(),
  );

  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedSets, setSelectedSets] = useState<Set<number>>(new Set());

  const handleTestClick = (test: VocabularyTest) => {
    if (isSelectionMode) {
      const newSelected = new Set(selectedSets);
      if (newSelected.has(test.id)) {
        newSelected.delete(test.id);
      } else {
        newSelected.add(test.id);
      }
      setSelectedSets(newSelected);
    } else {
      if (test.words.length > 30) {
        setSelectedTestId(test.id);
        const allIndices = new Set(test.words.map((_, idx) => idx));
        setSelectedWordIndices(allIndices);
        setShowLimitModal(true);
      } else {
        onSelectTest(partData.id, test.id);
      }
    }
  };

  const handleConfirmLimit = () => {
    if (selectedTestId !== null) {
      const test = partData.tests.find((t) => t.id === selectedTestId);
      if (test) {
        const selectedWords = test.words.filter((_, idx) =>
          selectedWordIndices.has(idx),
        );
        if (selectedWords.length > 0) {
          onStartCustomTest({
            id: test.id,
            title: test.title,
            words: selectedWords,
          });
        }
      }
      setShowLimitModal(false);
    }
  };

  const handleStartCombinedTest = () => {
    if (selectedSets.size === 0) return;

    let combinedWords: any[] = [];
    selectedSets.forEach((testId) => {
      const test = partData.tests.find((t) => t.id === testId);
      if (test) {
        combinedWords = [...combinedWords, ...test.words];
      }
    });

    const customTest: VocabularyTest = {
      id: -1,
      title: `Ôn tập tổng hợp (${selectedSets.size} bộ)`,
      words: combinedWords,
    };
    onStartCustomTest(customTest);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vocabulary Hub
          </button>

          <div className="flex gap-2">
            {isSelectionMode ? (
              <>
                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedSets(new Set());
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStartCombinedTest}
                  disabled={selectedSets.size === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  Bắt đầu học {selectedSets.size} bộ
                  {selectedSets.size > 0 && (
                    <ArrowRightIcon className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm shadow-sm"
              >
                Ghép các bộ từ
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">
            {partData.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            {partData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partData.tests.map((test) => (
            <SelectionCard
              key={test.id}
              title={test.title}
              description={`${test.words.length} words`}
              onClick={() => handleTestClick(test)}
              showCheckbox={isSelectionMode}
              isSelected={selectedSets.has(test.id)}
              isLocked={false} // Assuming tests are rarely locked individually unless specified by part
            />
          ))}
        </div>
      </div>

      {/* Word Selection Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 transform animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                Chọn từ vựng muốn học
              </h3>
              <button
                onClick={() => setShowLimitModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {(() => {
              const test = partData.tests.find((t) => t.id === selectedTestId);
              if (!test) return null;
              const isAllSelected =
                selectedWordIndices.size === test.words.length;
              const isIndeterminate =
                selectedWordIndices.size > 0 &&
                selectedWordIndices.size < test.words.length;

              const toggleAll = () => {
                if (isAllSelected) {
                  setSelectedWordIndices(new Set());
                } else {
                  setSelectedWordIndices(new Set(test.words.map((_, i) => i)));
                }
              };

              const toggleWord = (idx: number) => {
                const newSet = new Set(selectedWordIndices);
                if (newSet.has(idx)) {
                  newSet.delete(idx);
                } else {
                  newSet.add(idx);
                }
                setSelectedWordIndices(newSet);
              };

              return (
                <>
                  <div className="px-6 py-3 bg-white dark:bg-slate-800 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      Đã chọn: {selectedWordIndices.size} / {test.words.length}{" "}
                      từ
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900/90 backdrop-blur z-10 text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="p-4 border-b border-slate-200 dark:border-slate-700 w-16 text-center">
                            <input
                              type="checkbox"
                              className="w-5 h-5 cursor-pointer accent-blue-600"
                              checked={isAllSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = isIndeterminate;
                              }}
                              onChange={toggleAll}
                            />
                          </th>
                          <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold w-1/2">
                            Từ vựng
                          </th>
                          <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold">
                            Nghĩa
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {test.words.map((word, idx) => {
                          const isSelected = selectedWordIndices.has(idx);
                          return (
                            <tr
                              key={idx}
                              className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
                              onClick={() => toggleWord(idx)}
                            >
                              <td className="p-4 text-center">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 cursor-pointer accent-blue-600"
                                  checked={isSelected}
                                  onChange={() => toggleWord(idx)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                                {word.word}
                              </td>
                              <td className="p-4 text-slate-600 dark:text-slate-400">
                                {word.definition}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmLimit}
                disabled={selectedWordIndices.size === 0}
                className="px-8 py-2.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-[0_4px_0_0_rgba(29,78,216,1)] active:shadow-none active:translate-y-[4px] transition-all"
              >
                Bắt đầu học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyPartScreen;
