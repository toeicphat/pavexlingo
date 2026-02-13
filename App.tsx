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
import { LogoIcon } from './components/icons';

const mockUsers: User[] = [
    { username: 'admin', password: 'phattoeic' },
    { username: 'tester', password: '123456' },
    { username: 'hoangphuctayninh1708@gmail.com', password: 'thidautoeic' },
    { username: 'ntkimphuc.work@gmail.com', password: 'thidautoeic' },
    { username: 'luongzattu800@gmail.com', password: 'thidautoeic' },
    { username: 'phammynhu6104@gmail.com', password: 'thidautoeic' },
    { username: 'minhchungsuke121@gmail.com', password: 'thidautoeic' },
    { username: 'nttuephuong.2211@gmail.com', password: 'thidautoeic' },
    { username: 'kieuanhnguyen322@gmail.com', password: 'thidautoeic' },
    { username: 'luongthaonguyen2002@gmail.com', password: 'thidautoeic' },
    { username: 'nguyenkimkhanh278@gmail.com', password: 'thidautoeic' },
    { username: 'tl240806@gmail.com', password: 'thidautoeic' },
    { username: 'lehan2004.tayninh@gmail.com', password: 'thidautoeic' },
    { username: 'lethingoclinh2310@gmail.com', password: 'thidautoeic' },
    { username: 'nguyenthimyuyen1442014@gmail.com', password: 'thidautoeic' },
    { username: 'minhquan28032004@gmail.com', password: 'thidautoeic' },
    { username: 'giangtuyetcutes1@gmail.com', password: 'thidautoeic' },
    { username: 'nguyenthithanhnha11102005@gmail.com', password: 'thidautoeic' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.PracticeHub);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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
        if (!currentUser) {
            alert("Bạn cần đăng nhập để sử dụng tính năng này");
            return;
        }
        setAppState(AppState.DictationHub);
    }, [currentUser]);

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
        if (!currentUser) {
            alert("Bạn cần đăng nhập để sử dụng tính năng này");
            return;
        }
        setAppState(AppState.GrammarHub);
    }, [currentUser]);

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
        if (!currentUser) {
            alert("Bạn cần đăng nhập để sử dụng tính năng này");
            return;
        }
        setAppState(AppState.ListeningIntenseHub);
    }, [currentUser]);

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
                return <VocabularyPartScreen partData={selectedVocabularyPart} onSelectTest={handleSelectVocabularyTest} onBack={handleBackToVocabularyHome} />;
            case AppState.VocabularyTest:
                if (!selectedVocabularyTest) return null;
                return <VocabularyTestScreen testData={selectedVocabularyTest} onBack={handleBackToVocabularyPartHome} />;
            case AppState.DictationHub:
                if (!currentUser) return <PracticeHub {...practiceHubProps} />;
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
                if (!currentUser) return <PracticeHub {...practiceHubProps} />;
                return (
                    <GrammarScreen onSelectTopic={handleSelectGrammarTopic} onStartRandomTest={handleStartGrammarRandomTest} />
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
                if (!currentUser) return <PracticeHub {...practiceHubProps} />;
                return (
                    <ListeningIntenseScreen onBack={handleGoHome} onSelectPart={handleSelectListeningIntensePart} />
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
                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleGoHome}>
                        <LogoIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Pavex Lingo</span>
                    </div>
                    <div className="flex items-center gap-4">
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
        </div>
    );
};

export default App;