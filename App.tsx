import React, { useState, useCallback, useMemo } from 'react';
import PracticeHub from './components/PracticeHub';
import VocabularyScreen from './components/VocabularyScreen';
import VocabularyPartScreen from './components/VocabularyPartScreen';
import VocabularyTestScreen from './components/VocabularyTestScreen';
import StatsFooter from './components/StatsFooter';
import DictationScreen from './components/DictationScreen';
import DictationPracticeSetupScreen from './components/DictationPracticeSetupScreen';
import DictationTestScreen from './components/DictationTestScreen';
import GrammarScreen from './components/GrammarScreen';
import GrammarTopicScreen from './components/GrammarTopicScreen';
import TestScreen from './components/TestScreen';
import LoginScreen from './components/LoginScreen';
import GuideScreen from './components/GuideScreen';
import ListeningIntenseScreen from './components/ListeningIntenseScreen';
import ListeningIntensePracticeScreen from './components/ListeningIntensePracticeScreen';
import { AppState, VocabularyTest, VocabularyPart, User, DictationMode, TestData, UserAnswers } from './types';
import { getVocabularyPart, getVocabularyTest } from './services/vocabularyLibrary';
import { allDictationTests, getDictationExercisesForParts } from './services/dictationLibrary';
import { getListeningIntenseTest } from './services/listeningIntenseLibrary';
import { LogoIcon, XCircleIcon } from './components/icons';

const mockUsers: User[] = [
    { username: 'admin', password: 'phattoeic' },
    { username: 'tester', password: '123456' },
    { username: 'hoangphuctayninh1708@gmail.com', password: 'thidautoeic' },
    { username: 'luongzattu800@gmail.com', password: 'thidautoeic' },
    { username: 'minhchungsuke121@gmail.com', password: 'thidautoeic' },
    { username: 'nttuephuong.2211@gmail.com', password: 'thidautoeic' },
    { username: 'nguyenkimkhanh278@gmail.com', password: 'thidautoeic' },
    { username: 'minhquan28032004@gmail.com', password: 'thidautoeic' },
    { username: 'giangtuyetcutes1@gmail.com', password: 'thidautoeic' },
    { username: 'trangnt8905@gmail.com', password: 'thidautoeic' },
    { username: 'luongthimo357@gmail.com', password: 'thidautoeic' },
    { username: 'thaotrang27771@gmail.com', password: 'thidautoeic' },
    { username: 'trananhthu1802@gmail.com', password: 'thidautoeic' },
    { username: 'thupham.241004@gmail.com', password: 'thidautoeic' },
    { username: 'thaovimk0902@gmail.com', password: 'thidautoeic' },
    { username: 'huongnguyenthi280604@gmail.com', password: 'thidautoeic' },
    { username: 'tranthibichngoc1703@gmail.com', password: 'thidautoeic' },
    { username: 'lengochuyen8234@gmail.com', password: 'thidautoeic' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

import { QuotesMarquee } from './components/QuotesMarquee';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.PracticeHub);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  
  // Vocabulary State
  const [selectedVocabularyPart, setSelectedVocabularyPart] = useState<VocabularyPart | null>(null);
  const [selectedVocabularyTest, setSelectedVocabularyTest] = useState<VocabularyTest | null>(null);

  // Dictation State
  const [selectedDictationTestId, setSelectedDictationTestId] = useState<number | null>(null);
  const [selectedDictationParts, setSelectedDictationParts] = useState<number[]>([]);
  const [dictationMode, setDictationMode] = useState<DictationMode>('easy');

  // Grammar State
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<string | null>(null);
  const [grammarRandomTestData, setGrammarRandomTestData] = useState<TestData | null>(null);

  // Listening Intense State
  const [listeningIntenseData, setListeningIntenseData] = useState<any>(null);

  const handleGoHome = useCallback(() => {
    setSelectedVocabularyPart(null);
    setSelectedVocabularyTest(null);
    setSelectedDictationTestId(null);
    setSelectedDictationParts([]);
    setSelectedGrammarTopic(null);
    setGrammarRandomTestData(null);
    setListeningIntenseData(null);
    setAppState(AppState.PracticeHub);
  }, []);
  
  // Auth Handlers
  const handleLoginSuccess = useCallback((user: User) => {
      setCurrentUser(user);
      setAppState(AppState.PracticeHub);
  }, []);

  const handleLogout = useCallback(() => {
      setCurrentUser(null);
      handleGoHome();
  }, [handleGoHome]);

  const handleNavigateToGuide = useCallback(() => {
      setAppState(AppState.Guide);
  }, []);

  // Vocabulary Navigation Handlers
  const handleSelectVocabularyPart = useCallback((partId: number) => {
    const partData = getVocabularyPart(partId);
    setSelectedVocabularyPart(partData);
    setAppState(AppState.VocabularyPartHome);
  }, []);

  const handleSelectVocabularyTest = useCallback((partId: number, testId: number, limit?: number) => {
    const test = getVocabularyTest(partId, testId);
    if (test) {
        if (limit) {
            // If a limit is set, shuffle and take only requested amount
            const limitedTest = {
                ...test,
                words: shuffleArray(test.words).slice(0, limit)
            };
            setSelectedVocabularyTest(limitedTest);
        } else {
            setSelectedVocabularyTest(test);
        }
    }
    setAppState(AppState.VocabularyTest);
  }, []);

  const handleStartCustomTest = useCallback((test: VocabularyTest) => {
      setSelectedVocabularyTest(test);
      setAppState(AppState.VocabularyTest);
  }, []);
  
  const handleBackToVocabularyHome = useCallback(() => {
      setSelectedVocabularyPart(null);
      setAppState(AppState.VocabularyHome);
  }, []);
  
  const handleBackToVocabularyPartHome = useCallback(() => {
      // If we are coming back from a custom test (no selectedVocabularyPart), go to VocabularyHome
      if (!selectedVocabularyPart) {
          setSelectedVocabularyTest(null);
          setAppState(AppState.VocabularyHome);
      } else {
          setSelectedVocabularyTest(null);
          setAppState(AppState.VocabularyPartHome);
      }
  }, [selectedVocabularyPart]);

    const handleNavigateToVocabulary = useCallback(() => setAppState(AppState.VocabularyHome), []);

    // Dictation Handlers
    const handleNavigateToDictation = useCallback(() => {
        setAppState(AppState.DictationHub);
    }, []);

    const handleSelectDictationTestSet = useCallback((testId: number) => {
        setSelectedDictationTestId(testId);
        setAppState(AppState.DictationSetup);
    }, []);

    const handleStartDictationPractice = useCallback((parts: number[]) => {
        setSelectedDictationParts(parts);
        setAppState(AppState.DictationPractice);
    }, []);

    const handleBackToDictationHub = useCallback(() => {
        setSelectedDictationTestId(null);
        setAppState(AppState.DictationHub);
    }, []);

    // Grammar Handlers
    const handleNavigateToGrammar = useCallback(() => {
        setAppState(AppState.GrammarHub);
    }, []);

    const handleSelectGrammarTopic = useCallback((topic: string) => {
        setSelectedGrammarTopic(topic);
        setAppState(AppState.GrammarTopic);
    }, []);

    const handleStartGrammarRandomTest = useCallback((testData: TestData) => {
        setGrammarRandomTestData(testData);
        setAppState(AppState.GrammarRandomTest);
    }, []);

    const handleBackToGrammarHub = useCallback(() => {
        setSelectedGrammarTopic(null);
        setAppState(AppState.GrammarHub);
    }, []);

    // Listening Intense Handlers
    const handleNavigateToListeningIntense = useCallback(() => {
        setAppState(AppState.ListeningIntenseHub);
    }, []);

    const handleSelectListeningIntensePart = useCallback((testId: number, part: 'part1' | 'part2' | 'part3' | 'part4') => {
        const test = getListeningIntenseTest(testId);
        if (test) {
            setListeningIntenseData(test[part]);
            setAppState(AppState.ListeningIntensePractice);
        }
    }, []);

    const handleBackToListeningIntenseHub = useCallback(() => {
        setListeningIntenseData(null);
        setAppState(AppState.ListeningIntenseHub);
    }, []);

    const dictationPracticeData = useMemo(() => {
        if (selectedDictationTestId === null) return null;
        const testSet = allDictationTests.find(t => t.id === selectedDictationTestId);
        if (!testSet) return null;
        const exercises = getDictationExercisesForParts(selectedDictationTestId, selectedDictationParts);
        return {
            id: selectedDictationTestId,
            title: `${testSet.title} - Practice`,
            exercises
        };
    }, [selectedDictationTestId, selectedDictationParts]);

    const renderContent = () => {
        const practiceHubProps = {
            onNavigateToVocabulary: handleNavigateToVocabulary,
            onNavigateToDictation: handleNavigateToDictation,
            onNavigateToGrammar: handleNavigateToGrammar,
            onNavigateToListeningIntense: handleNavigateToListeningIntense,
            isLoggedIn: !!currentUser
        };
        switch (appState) {
            case AppState.PracticeHub:
                return <PracticeHub {...practiceHubProps} />;
            case AppState.Login:
                return <LoginScreen onLoginSuccess={handleLoginSuccess} users={mockUsers} />;
            case AppState.Guide:
                return <GuideScreen onBack={handleGoHome} />;
            case AppState.VocabularyHome:
                return (
                    <VocabularyScreen 
                        onSelectPart={handleSelectVocabularyPart} 
                        onStartCustomTest={handleStartCustomTest}
                    />
                );
            case AppState.VocabularyPartHome:
                if (!selectedVocabularyPart) return null;
                return <VocabularyPartScreen partData={selectedVocabularyPart} onSelectTest={handleSelectVocabularyTest} onStartCustomTest={handleStartCustomTest} onBack={handleBackToVocabularyHome} />;
            case AppState.VocabularyTest:
                if (!selectedVocabularyTest) return null;
                return <VocabularyTestScreen testData={selectedVocabularyTest} onBack={handleBackToVocabularyPartHome} />;
            case AppState.DictationHub:
                return (
                    <DictationScreen 
                        currentUser={currentUser} 
                        onSelectTestSet={handleSelectDictationTestSet} 
                        dictationMode={dictationMode}
                        onModeChange={(m) => setDictationMode(m)}
                    />
                );
            case AppState.DictationSetup:
                if (selectedDictationTestId === null) return null;
                return <DictationPracticeSetupScreen testId={selectedDictationTestId} onStartPractice={handleStartDictationPractice} onBack={handleBackToDictationHub} />;
            case AppState.DictationPractice:
                if (!dictationPracticeData) return null;
                return (
                    <DictationTestScreen 
                        testData={dictationPracticeData} 
                        onBack={() => setAppState(AppState.DictationSetup)} 
                        mode={dictationMode}
                    />
                );
            case AppState.GrammarHub:
                return (
                    <GrammarScreen 
                        currentUser={currentUser}
                        onSelectTopic={handleSelectGrammarTopic} 
                        onStartRandomTest={handleStartGrammarRandomTest} 
                    />
                );
            case AppState.GrammarTopic:
                if (!selectedGrammarTopic) return null;
                return <GrammarTopicScreen topic={selectedGrammarTopic} onBack={handleBackToGrammarHub} />;
            case AppState.GrammarRandomTest:
                if (!grammarRandomTestData) return null;
                return (
                    <TestScreen 
                        testData={grammarRandomTestData} 
                        userAnswers={{}} 
                        onSubmit={(answers: UserAnswers) => {
                            console.log("Grammar Quiz Submitted:", answers);
                            handleBackToGrammarHub();
                        }} 
                    />
                );
            case AppState.ListeningIntenseHub:
                return (
                    <ListeningIntenseScreen 
                        currentUser={currentUser}
                        onBack={handleGoHome} 
                        onSelectPart={handleSelectListeningIntensePart} 
                    />
                );
            case AppState.ListeningIntensePractice:
                if (!listeningIntenseData) return null;
                return <ListeningIntensePracticeScreen data={listeningIntenseData} onBack={handleBackToListeningIntenseHub} />;
            default:
                return <PracticeHub {...practiceHubProps} />;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={handleGoHome}>
                        <LogoIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">Pavex Lingo</span>
                    </div>
                    <QuotesMarquee />
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button 
                            onClick={() => setShowUpgradeModal(true)}
                            className="gold-bg p-[2px] rounded-lg shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-1.5 w-full h-full">
                                <span className="gold-text text-sm font-bold tracking-widest uppercase">Nâng cấp Pro</span>
                            </div>
                        </button>
                        <button 
                            onClick={handleNavigateToGuide}
                            className="px-4 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Hướng dẫn
                        </button>
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">Xin chào, <span className="text-blue-600 font-bold">{currentUser.username}</span></span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setAppState(AppState.Login)}
                                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </nav>
            </header>
    
                        <main className="py-8">
                {renderContent()}
            </main>
            
            <StatsFooter />

            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 relative text-center">
                        <button 
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 uppercase gold-text inline-block">Nâng cấp Pro</h3>
                        <div className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            <p>Để nâng cấp tài khoản Pro,</p>
                            <p>bạn hãy liên hệ với thầy Phát</p>
                            <p>qua Facebook ở cuối trang nhé.</p>
                        </div>
                        <button 
                            onClick={() => setShowUpgradeModal(false)}
                            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-full"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
