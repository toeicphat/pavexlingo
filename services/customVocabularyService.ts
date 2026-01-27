import { VocabularyTest, VocabItem } from '../types';

const STORAGE_KEY = 'pavex_custom_vocab_sets';

export const getCustomSets = (): VocabularyTest[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load custom sets", e);
        return [];
    }
};

export const saveCustomSet = (set: VocabularyTest) => {
    const sets = getCustomSets();
    const existingIndex = sets.findIndex(s => s.id === set.id);
    if (existingIndex >= 0) {
        sets[existingIndex] = set;
    } else {
        sets.push(set);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
};

export const deleteCustomSet = (id: number) => {
    const sets = getCustomSets().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
};

export const parseVocabularyInput = (text: string): VocabItem[] => {
    const lines = text.split('\n');
    return lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            let word = '';
            let definition = '';
            
            // Try delimiters in order of specificity
            // 1. Semicolon
            if (line.includes(';')) {
                const parts = line.split(';');
                word = parts[0];
                definition = parts.slice(1).join(';');
            } 
            // 2. Hyphen (try to find " - " first to avoid splitting hyphenated words like 'in-depth')
            else if (line.includes(' - ')) {
                const parts = line.split(' - ');
                word = parts[0];
                definition = parts.slice(1).join(' - ');
            }
             // 3. Simple hyphen if no spaces around it? (Risky for hyphenated words, but requested "bake - nướng")
             // Let's stick to checking if it looks like a separator.
             else if (line.includes('-') && !line.match(/^[a-zA-Z]+-[a-zA-Z]+$/)) {
                 const parts = line.split('-');
                 word = parts[0];
                 definition = parts.slice(1).join('-');
            }
            // 4. Comma
            else if (line.includes(',')) {
                const parts = line.split(',');
                word = parts[0];
                definition = parts.slice(1).join(',');
            } 
            // 5. Fallback: First space
            else {
                const firstSpace = line.indexOf(' ');
                if (firstSpace !== -1) {
                    word = line.substring(0, firstSpace);
                    definition = line.substring(firstSpace + 1);
                } else {
                    word = line; // No definition found
                }
            }

            return {
                word: word.trim(),
                definition: definition.trim(),
                example: ''
            };
        })
        .filter(item => item.word && item.definition);
};
