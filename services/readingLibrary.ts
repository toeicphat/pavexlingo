
import { ReadingTestData } from '../types';

export interface ReadingTestSet {
    id: number;
    title: string;
    description: string;
    parts: {
        part5: ReadingTestData;
        part6: ReadingTestData;
        part7: ReadingTestData;
    }
}

// Data has been cleared as requested
export const allReadingTests: ReadingTestSet[] = [];

export const getReadingTest = (testId: number, part: number): ReadingTestData | null => {
    return null;
}
