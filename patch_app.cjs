const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Add import for readingPart5TestData
code = code.replace(
    "import { listeningIntenseData } from './data/listeningIntenseData';",
    "import { listeningIntenseData } from './data/listeningIntenseData';\nimport { readingPart5TestData } from './data/readingPart5Data';"
);

// Add handler for starting Part 5 test
code = code.replace(
    "const handleNavigateToStudy = useCallback(() => {\n        setAppState(AppState.StudyScreen);\n    }, []);",
    "const handleNavigateToStudy = useCallback(() => {\n        setAppState(AppState.StudyScreen);\n    }, []);\n\n    const handleStartPart5Test = useCallback(() => {\n        setAppState(AppState.ReadingPart5Test);\n    }, []);"
);

// Add onStartPart5Test prop to StudyScreen
code = code.replace(
    "return <StudyScreen onBack={() => setAppState(AppState.ReadingHub)} />;",
    "return <StudyScreen onBack={() => setAppState(AppState.ReadingHub)} onStartPart5Test={handleStartPart5Test} />;"
);

// Add case for ReadingPart5Test
code = code.replace(
    "case AppState.StudyScreen:\n                return <StudyScreen onBack={() => setAppState(AppState.ReadingHub)} onStartPart5Test={handleStartPart5Test} />;",
    "case AppState.StudyScreen:\n                return <StudyScreen onBack={() => setAppState(AppState.ReadingHub)} onStartPart5Test={handleStartPart5Test} />;\n            case AppState.ReadingPart5Test:\n                return (\n                    <TestScreen \n                        testData={readingPart5TestData} \n                        userAnswers={{}} \n                        onSubmit={(answers: UserAnswers) => {\n                            console.log(\"Part 5 Test Submitted:\", answers);\n                            setAppState(AppState.StudyScreen);\n                        }} \n                    />\n                );"
);

fs.writeFileSync('App.tsx', code);
