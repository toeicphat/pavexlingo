
import { LibraryDictationExercise } from '../types';
import { dictationTest1Data } from './dictation/dictationTest1';
import { dictationTest2Data } from './dictation/dictationTest2';
import { dictationTest3Data } from './dictation/dictationTest3';
import { dictationTest4Data } from './dictation/dictationTest4';
import { dictationTest5Data } from './dictation/dictationTest5';
import { dictationTest6Data } from './dictation/dictationTest6';
import { dictationTest7Data } from './dictation/dictationTest7';
import { dictationTest8Data } from './dictation/dictationTest8';
import { dictationTest9Data } from './dictation/dictationTest9';
import { dictationTest10Data } from './dictation/dictationTest10';
import { dictationTest11Data } from './dictation/dictationTest11';
import { dictationTest12Data } from './dictation/dictationTest12';
import { dictationTest13Data } from './dictation/dictationTest13';
import { dictationTest14Data } from './dictation/dictationTest14';
import { dictationTest15Data } from './dictation/dictationTest15';
import { dictationTest16Data } from './dictation/dictationTest16';
import { dictationTest17Data } from './dictation/dictationTest17';
import { dictationTest18Data } from './dictation/dictationTest18';
import { dictationTest19Data } from './dictation/dictationTest19';
import { dictationTest20Data } from './dictation/dictationTest20';

export interface DictationTestSet {
    id: number;
    title: string;
    description: string;
    parts: {
        part1: LibraryDictationExercise[];
        part2: LibraryDictationExercise[];
        part3: LibraryDictationExercise[];
        part4: LibraryDictationExercise[];
    };
}

export const ets2024Tests: DictationTestSet[] = [
    { id: 1, title: "ETS 2024 Test 1", description: "Full dictation practice for Test 1", parts: dictationTest1Data },
    { id: 2, title: "ETS 2024 Test 2", description: "Full dictation practice for Test 2", parts: dictationTest2Data },
    { id: 3, title: "ETS 2024 Test 3", description: "Full dictation practice for Test 3", parts: dictationTest3Data },
    { id: 4, title: "ETS 2024 Test 4", description: "Full dictation practice for Test 4", parts: dictationTest4Data },
    { id: 5, title: "ETS 2024 Test 5", description: "Full dictation practice for Test 5", parts: dictationTest5Data },
    { id: 6, title: "ETS 2024 Test 6", description: "Full dictation practice for Test 6", parts: dictationTest6Data },
    { id: 7, title: "ETS 2024 Test 7", description: "Full dictation practice for Test 7", parts: dictationTest7Data },
    { id: 8, title: "ETS 2024 Test 8", description: "Full dictation practice for Test 8", parts: dictationTest8Data },
    { id: 9, title: "ETS 2024 Test 9", description: "Full dictation practice for Test 9", parts: dictationTest9Data },
    { id: 10, title: "ETS 2024 Test 10", description: "Full dictation practice for Test 10", parts: dictationTest10Data },
];

export const ets2026Tests: DictationTestSet[] = [
    { id: 11, title: "ETS 2026 Test 1", description: "Full dictation practice for Test 1", parts: dictationTest11Data },
    { id: 12, title: "ETS 2026 Test 2", description: "Full dictation practice for Test 2", parts: dictationTest12Data },
    { id: 13, title: "ETS 2026 Test 3", description: "Full dictation practice for Test 3", parts: dictationTest13Data },
    { id: 14, title: "ETS 2026 Test 4", description: "Full dictation practice for Test 4", parts: dictationTest14Data },
    { id: 15, title: "ETS 2026 Test 5", description: "Full dictation practice for Test 5", parts: dictationTest15Data },
    { id: 16, title: "ETS 2026 Test 6", description: "Full dictation practice for Test 6", parts: dictationTest16Data },
    { id: 17, title: "ETS 2026 Test 7", description: "Full dictation practice for Test 7", parts: dictationTest17Data },
    { id: 18, title: "ETS 2026 Test 8", description: "Full dictation practice for Test 8", parts: dictationTest18Data },
    { id: 19, title: "ETS 2026 Test 9", description: "Full dictation practice for Test 9", parts: dictationTest19Data },
    { id: 20, title: "ETS 2026 Test 10", description: "Full dictation practice for Test 10", parts: dictationTest20Data },
];

export const allDictationTests = [...ets2024Tests, ...ets2026Tests];

export const getDictationExercisesForParts = (testId: number, parts: number[]): LibraryDictationExercise[] => {
    const test = allDictationTests.find(t => t.id === testId);
    if (!test) return [];

    let exercises: LibraryDictationExercise[] = [];
    if (parts.includes(1)) exercises = [...exercises, ...test.parts.part1];
    if (parts.includes(2)) exercises = [...exercises, ...test.parts.part2];
    if (parts.includes(3)) exercises = [...exercises, ...test.parts.part3];
    if (parts.includes(4)) exercises = [...exercises, ...test.parts.part4];

    return exercises;
};
