export interface User {
    username: string;
    password?: string;
}

export type DictationMode = 'easy' | 'hard';

export enum AppState {
    PracticeHub = 'PRACTICE_HUB',
    VocabularyHome = 'VOCABULARY_HOME',
    VocabularyPartHome = 'VOCABULARY_PART_HOME',
    VocabularyTest = 'VOCABULARY_TEST',
    DictationHub = 'DICTATION_HUB',
    DictationSetup = 'DICTATION_SETUP',
    DictationPractice = 'DICTATION_PRACTICE',
    GrammarHub = 'GRAMMAR_HUB',
    GrammarTopic = 'GRAMMAR_TOPIC',
    GrammarRandomTest = 'GRAMMAR_RANDOM_TEST',
    ListeningIntenseHub = 'LISTENING_INTENSE_HUB',
    ListeningIntensePractice = 'LISTENING_INTENSE_PRACTICE',
    Login = 'LOGIN',
}

// For Listening & Translation (within Vocabulary)
export interface TranslationEvaluationResult {
    score: number;
    feedback_vi: string;
}

// For Vocabulary Review (SRS)
export interface VocabularyWord {
    id: string; // The word in lowercase
    word: string; // The original word casing
    definition: string;
    srsLevel: number; // 0-8, where 0 is new
    nextReviewDate: number; // timestamp
    lastReviewedDate: number | null; // timestamp
    sourceText?: string; // a sentence where the word was found
}

// For Pre-defined Vocabulary Lists
export interface VocabItem {
    word: string;
    definition: string;
    example: string;
}

export interface VocabularyTest {
    id: number;
    title: string;
    words: VocabItem[];
}

export interface VocabularyPart {
    id: number;
    title: string;
    description: string;
    tests: VocabularyTest[];
    isComingSoon?: boolean;
    isNew?: boolean;
}

// --- Unified API Configuration ---
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3001' 
    : 'https://your-production-api-domain.com';

export type QuestionOption = 'A' | 'B' | 'C' | 'D';

export interface UserAnswers {
  [questionId: string]: QuestionOption | null;
}

// For TOEIC Mini-Test and Grammar Quizzes
export interface Question {
  id: number | string;
  part: number;
  image?: string;
  audioScript?: string;
  questionText: string;
  options: { [key in QuestionOption]?: string };
  correctAnswer: QuestionOption;
  explanation: string;
}

export interface TestData {
  testTitle: string;
  duration: number;
  category: 'miniTest' | 'grammar';
  questions: Question[];
}

// For Dictation
export interface DictationExercise {
    title: string;
    fullText: string;
    textWithBlanks: string;
    missingWords: string[];
}

export interface LibraryDictationExercise extends DictationExercise {
    id: number;
    audioSrc: string;
}

// Listening Intense Types
export interface ListeningIntenseSentence {
    id: string;
    text: string;
    words: string[];
}

export interface ListeningIntenseConversation {
    id: number;
    title: string;
    sentences: ListeningIntenseSentence[];
}

export interface ListeningIntenseTestData {
    id: number;
    title: string;
    part1: ListeningIntenseConversation[];
    part2: ListeningIntenseConversation[];
    part3: ListeningIntenseConversation[];
    part4: ListeningIntenseConversation[];
}

// For Determiner Exercise
export interface DeterminerExercise {
    paragraph: string;
    determiners: string[];
}

// For Grammar Practice
export interface GrammarTopicContent {
    title: string;
    explanation: string[];
    examples: { sentence: string; translation: string }[];
    interactiveExercise?: string;
}

export interface GrammarQuestion {
    id: string;
    questionText: string;
    options: { [key in QuestionOption]?: string };
    correctAnswer: QuestionOption;
    explanation: string;
}

// For Reading Practice
export interface ReadingQuestion {
    id: string;
    questionText: string;
    options: { [key in QuestionOption]: string };
    correctAnswer: QuestionOption;
    explanation?: string;
}

export interface ReadingPassage {
    id: string;
    text?: string;
    questions: ReadingQuestion[];
}

export interface ReadingTestData {
    id: number;
    title: string;
    part: number;
    passages: ReadingPassage[];
}

export interface TestResult {
    id: string;
    title: string;
    score: number;
    total: number;
    date: number; // timestamp
}

// Core Progress Categories
export type ProgressCategory = 'vocabulary' | 'reading' | 'grammar' | 'listening' | 'writing' | 'speaking';

export type UserProgress = {
    [key in ProgressCategory]?: TestResult[];
};

export interface UserSettings {
    name: string;
    email: string;
    scoreTarget: string;
    examDate: string; // YYYY-MM-DD
    darkMode: boolean;
}

export interface SpeakingPart1EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    proficiencyLevel: string;
    pronunciationFeedback: { summary: string; examples: string[] };
    intonationAndStressFeedback: { summary: string; examples: string[] };
}

export interface SpeakingPart2EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    proficiencyLevel: string;
    grammar: { english: string; vietnamese: string };
    vocabulary: { english: string; vietnamese: string };
    cohesion: { english: string; vietnamese: string };
    delivery: { english: string; vietnamese: string };
}

export interface SpeakingPart3EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    proficiencyLevel: string;
    generalSummary: { english: string; vietnamese: string };
    grammarAndVocab: { english: string; vietnamese: string };
    fluencyAndCohesion: { english: string; vietnamese: string };
    pronunciation: { english: string; vietnamese: string };
    responseToQ7: { english: string; vietnamese: string };
}

export interface SpeakingPart4Task {
    documentTitle: string;
    documentContent: string;
    question8: string;
    question9: string;
    question10: string;
}

export interface SpeakingPart4EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    proficiencyLevel: string;
    generalSummary: { english: string; vietnamese: string };
    accuracy: { english: string; vietnamese: string };
    responseToQ10: { english: string; vietnamese: string };
    languageUse: { english: string; vietnamese: string };
    delivery: { english: string; vietnamese: string };
}

export interface SpeakingPart5Scenario {
    callerName: string;
    problem: string;
}

export interface SpeakingPart5EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    proficiencyLevel: string;
    generalSummary: { english: string; vietnamese: string };
    solutionStructure: { english: string; vietnamese: string };
    languageUse: { english: string; vietnamese: string };
    fluencyAndCohesion: { english: string; vietnamese: string };
    intonationAndTone: { english: string; vietnamese: string };
}

export interface WritingPart1Task {
    picture: string; // base64
    keywords: string[];
}

export interface WritingPart1SingleEvaluation {
    score: number;
    grammar: { english: string; vietnamese: string };
    relevance: { english: string; vietnamese: string };
}

export interface WritingPart1EvaluationResult {
    totalRawScore: number;
    estimatedScoreBand: string;
    overallSummary: { english: string; vietnamese: string };
    questionFeedback: WritingPart1SingleEvaluation[];
}

export interface WritingPart2Task {
    question6: { title: string; requestText: string };
    question7: { title: string; requestText: string };
}

export interface WritingPart2SingleEvaluation {
    score: number;
    completeness: { english: string; vietnamese: string };
    languageUse: { english: string; vietnamese: string };
    organization?: { english: string; vietnamese: string };
}

export interface WritingPart2EvaluationResult {
    totalRawScore: number;
    estimatedScoreBand: string;
    overallSummary: { english: string; vietnamese: string };
    question6Feedback: WritingPart2SingleEvaluation;
    question7Feedback: WritingPart2SingleEvaluation;
}

export interface WritingPart3Task {
    question: string;
}

export interface WritingPart3EvaluationResult {
    taskScore: number;
    estimatedScoreBand: string;
    overallSummary: { english: string; vietnamese: string };
    ideaDevelopment: { english: string; vietnamese: string };
    organization: { english: string; vietnamese: string };
    grammarAndSyntax: { english: string; vietnamese: string };
    vocabulary: { english: string; vietnamese: string };
}

export interface WordPronunciationEvaluationResult {
    word: string;
    overallScore: number;
    feedback_vi: string;
    phonemeEvaluations: { phoneme: string; accuracyScore: number }[];
}