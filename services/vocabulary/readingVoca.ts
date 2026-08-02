import { VocabItem, VocabularyPart } from '../../types';

const test1_words: VocabItem[] = [];

const test2_words: VocabItem[] = [];

const test3_words: VocabItem[] = [];

const test4_words: VocabItem[] = [];

const test5_words: VocabItem[] = [];

const test6_words: VocabItem[] = [];

const test7_words: VocabItem[] = [
    { word: "Survey", definition: "Cuộc khảo sát", example: "" },
    { word: "Results", definition: "Kết quả", example: "" },
    { word: "Attached", definition: "Được đính kèm", example: "" },
    { word: "Disappointing", definition: "Đáng thất vọng", example: "" },
    { word: "Flavour", definition: "Hương vị", example: "" },
    { word: "Taste", definition: "Vị / Nếm", example: "" },
    { word: "Rating", definition: "Sự đánh giá / Điểm số", example: "" },
    { word: "Advance", definition: "Tiến tới / Tiến bộ", example: "" },
    { word: "Consistent", definition: "Nhất quán / Đồng nhất", example: "" },
    { word: "Consumer", definition: "Người tiêu dùng", example: "" },
    { word: "Adjust", definition: "Điều chỉnh", example: "" },
    { word: "Potential", definition: "Tiềm năng", example: "" },
    { word: "Proceed", definition: "Tiến hành / Tiếp tục", example: "" },
    { word: "Stage", definition: "Giai đoạn", example: "" },
    { word: "Phase", definition: "Giai đoạn", example: "" },
    { word: "Development", definition: "Sự phát triển", example: "" },
    { word: "Participant", definition: "Người tham gia", example: "" },
    { word: "Rate", definition: "Đánh giá", example: "" },
    { word: "Pleasant", definition: "Dễ chịu", example: "" },
    { word: "Sample", definition: "Mẫu", example: "" }
];

const test8_words: VocabItem[] = [];

const test9_words: VocabItem[] = [];

const test10_words: VocabItem[] = [];

export const readingComprehensiveVocabulary: VocabularyPart = {
    id: 200,
    title: "Reading theo Khóa học",
    description: "Từ vựng Reading phổ biến, có tỉ lệ xuất hiện cao",
    tests: [
        { id: 2001, title: "Test 1", words: test1_words },
        { id: 2002, title: "Test 2", words: test2_words },
        { id: 2003, title: "Test 3", words: test3_words },
        { id: 2004, title: "Test 4", words: test4_words },
        { id: 2005, title: "Test 5", words: test5_words },
        { id: 2006, title: "Test 6", words: test6_words },
        { id: 2007, title: "T2 - P7(176-180)", words: test7_words },
        { id: 2008, title: "Test 8", words: test8_words },
        { id: 2009, title: "Test 9", words: test9_words },
        { id: 2010, title: "Test 10", words: test10_words },
    ]
};
