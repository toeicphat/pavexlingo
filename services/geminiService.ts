
import { GoogleGenAI, Type } from "@google/genai";
import { 
    DeterminerExercise,
    TranslationEvaluationResult,
    VocabItem,
    TestData,
    SpeakingPart1EvaluationResult,
    SpeakingPart2EvaluationResult,
    SpeakingPart3EvaluationResult,
    SpeakingPart4Task,
    SpeakingPart4EvaluationResult,
    SpeakingPart5Scenario,
    SpeakingPart5EvaluationResult,
    WritingPart1Task,
    WritingPart1EvaluationResult,
    WritingPart2Task,
    WritingPart2EvaluationResult,
    WritingPart3Task,
    WritingPart3EvaluationResult,
    WordPronunciationEvaluationResult
} from '../types';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});

const testDataSchema = {
    type: Type.OBJECT,
    properties: {
        testTitle: { type: Type.STRING },
        duration: { type: Type.INTEGER },
        category: { type: Type.STRING },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    part: { type: Type.INTEGER },
                    questionText: { type: Type.STRING },
                    options: {
                        type: Type.OBJECT,
                        properties: {
                            A: { type: Type.STRING },
                            B: { type: Type.STRING },
                            C: { type: Type.STRING },
                            D: { type: Type.STRING }
                        },
                        required: ['A', 'B', 'C', 'D']
                    },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ['id', 'part', 'questionText', 'options', 'correctAnswer', 'explanation']
            }
        }
    },
    required: ['testTitle', 'duration', 'category', 'questions']
};

/**
 * Generates a full TOEIC Mini-Test
 */
export const generateTOEICMiniTest = async (): Promise<TestData | null> => {
    try {
        const prompt = "Generate a TOEIC Mini-Test with 10 questions. Include 2 questions for Part 1 (Photographs - provide a description in questionText), 2 for Part 2 (Question-Response), 2 for Part 5 (Incomplete Sentences), 2 for Part 6 (Text Completion), and 2 for Part 7 (Reading Comprehension). Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: testDataSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating TOEIC Mini-Test:", error);
        return null;
    }
};

/**
 * Generates a random grammar quiz
 */
export const generateRandomGrammarQuiz = async (): Promise<TestData | null> => {
    try {
        const prompt = "Generate a 10-question English grammar quiz focused on TOEIC patterns. Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: testDataSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating grammar quiz:", error);
        return null;
    }
};

const determinerExerciseSchema = {
    type: Type.OBJECT,
    properties: {
        paragraph: { type: Type.STRING, description: "A short English paragraph of about 50-70 words on a simple, common topic." },
        determiners: {
            type: Type.ARRAY,
            description: "An array of all the determiner words found in the paragraph, in lowercase.",
            items: { type: Type.STRING }
        }
    },
    required: ['paragraph', 'determiners']
};

export const generateDeterminerExercise = async (): Promise<DeterminerExercise | null> => {
    try {
        const prompt = `Generate a short English paragraph (about 50-70 words) on a simple topic like daily routines, hobbies, or work. Identify ALL determiners in the paragraph. Determiners include articles (a, an, the), demonstratives (this, that, these, those), possessives (my, your, his, her, its, our, their), quantifiers (some, any, many, few, several, all), and numbers (one, two). Return a JSON object with two keys: "paragraph" containing the text, and "determiners" containing an array of all the identified determiner words in lowercase.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: determinerExerciseSchema,
            },
        });

        const jsonStr = response.text?.trim() || '{}';
        const data = JSON.parse(jsonStr);

        if (data && data.paragraph && Array.isArray(data.determiners)) {
            data.determiners = [...new Set(data.determiners)];
            return data as DeterminerExercise;
        }
        return null;
    } catch (error) {
        console.error("Error generating determiner exercise:", error);
        throw new Error("Failed to generate exercise from API.");
    }
};

const translationEvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        score: { 
            type: Type.INTEGER,
            description: "A score from 0 to 100 evaluating the translation's accuracy, grammar, and naturalness. 100 is a perfect translation."
        },
        feedback_vi: { 
            type: Type.STRING,
            description: "Concise feedback in Vietnamese explaining what is good about the translation and what could be improved. Mention grammar, vocabulary choice, and natural phrasing."
        }
    },
    required: ['score', 'feedback_vi']
};

export const evaluateTranslation = async (originalSentence: string, userTranslation: string): Promise<TranslationEvaluationResult | null> => {
    try {
        const prompt = `
            You are an expert English to Vietnamese translator and teacher.
            The user was given the following English sentence to translate: "${originalSentence}"
            The user provided this Vietnamese translation: "${userTranslation}"

            Please evaluate the user's translation.
            1.  Assign a score from 0 to 100 based on accuracy, grammar, and naturalness.
            2.  Provide brief, constructive feedback in Vietnamese. Point out strengths and areas for improvement.

            Return the evaluation in JSON format according to the schema.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationEvaluationSchema,
            },
        });

        const jsonStr = response.text?.trim() || '{}';
        const data = JSON.parse(jsonStr);

        if (data && typeof data.score === 'number' && typeof data.feedback_vi === 'string') {
            return data as TranslationEvaluationResult;
        }
        return null;
    } catch (error) {
        console.error("Error evaluating translation:", error);
        throw new Error("Failed to get translation evaluation from API.");
    }
};

export const generateSentenceForTranslation = async (vocabList?: VocabItem[]): Promise<string | null> => {
    try {
        let vocabPrompt = '';
        if (vocabList && vocabList.length > 0) {
            const words = vocabList.map(v => v.word).join(', ');
            vocabPrompt = `The sentence MUST include at least one of the following words: ${words}.`;
        }

        const prompt = `
            You are an English teacher creating a practice sentence for an intermediate-level student to translate into Vietnamese.
            Generate a single, clear, and natural-sounding English sentence.
            The sentence should be between 10 and 20 words long.
            The topic should be about business, daily life, or technology.
            ${vocabPrompt}
            Provide only the sentence itself, without any quotation marks or introductory phrases.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const text = response.text?.trim() || null;
        return text || null;

    } catch (error) {
        console.error("Error generating sentence for translation:", error);
        throw new Error("Failed to generate sentence from API.");
    }
};

export const getWordDefinition = async (word: string, contextSentence: string = ''): Promise<string | null> => {
    try {
        const prompt = `
            Provide a simple, clear definition for the English word "${word}". 
            If a context sentence is provided, use it to determine the most relevant definition.
            Context sentence: "${contextSentence}"
            
            The definition should be concise and easy for an intermediate English learner to understand. 
            Do not include the word itself in the definition.
            Provide only the definition as a single string, without any introductory phrases like "The definition is:".
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const definition = response.text?.trim() || null;
        return definition || null;

    } catch (error) {
        console.error(`Error generating definition for "${word}":`, error);
        return "Could not retrieve definition at this time.";
    }
};

// --- FIX: Added Speaking and Writing Task Generation and Evaluation Functions ---

const speakingPart1Schema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        proficiencyLevel: { type: Type.STRING },
        pronunciationFeedback: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                examples: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['summary', 'examples']
        },
        intonationAndStressFeedback: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                examples: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['summary', 'examples']
        }
    },
    required: ['taskScore', 'estimatedScoreBand', 'proficiencyLevel', 'pronunciationFeedback', 'intonationAndStressFeedback']
};

const speakingPart2Schema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        proficiencyLevel: { type: Type.STRING },
        grammar: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        vocabulary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        cohesion: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        delivery: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
    },
    required: ['taskScore', 'estimatedScoreBand', 'proficiencyLevel', 'grammar', 'vocabulary', 'cohesion', 'delivery']
};

const speakingPart3QuestionsSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        question5: { type: Type.STRING },
        question6: { type: Type.STRING },
        question7: { type: Type.STRING }
    },
    required: ['topic', 'question5', 'question6', 'question7']
};

const speakingPart3EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        proficiencyLevel: { type: Type.STRING },
        generalSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        grammarAndVocab: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        fluencyAndCohesion: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        pronunciation: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        responseToQ7: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
    },
    required: ['taskScore', 'estimatedScoreBand', 'proficiencyLevel', 'generalSummary', 'grammarAndVocab', 'fluencyAndCohesion', 'pronunciation', 'responseToQ7']
};

const speakingPart4TaskSchema = {
    type: Type.OBJECT,
    properties: {
        documentTitle: { type: Type.STRING },
        documentContent: { type: Type.STRING },
        question8: { type: Type.STRING },
        question9: { type: Type.STRING },
        question10: { type: Type.STRING }
    },
    required: ['documentTitle', 'documentContent', 'question8', 'question9', 'question10']
};

const speakingPart4EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        proficiencyLevel: { type: Type.STRING },
        generalSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        accuracy: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        responseToQ10: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        languageUse: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        delivery: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
    },
    required: ['taskScore', 'estimatedScoreBand', 'proficiencyLevel', 'generalSummary', 'accuracy', 'responseToQ10', 'languageUse', 'delivery']
};

const speakingPart5ScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        callerName: { type: Type.STRING },
        problem: { type: Type.STRING }
    },
    required: ['callerName', 'problem']
};

const speakingPart5EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        proficiencyLevel: { type: Type.STRING },
        generalSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        solutionStructure: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        languageUse: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        fluencyAndCohesion: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        intonationAndTone: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
    },
    required: ['taskScore', 'estimatedScoreBand', 'proficiencyLevel', 'generalSummary', 'solutionStructure', 'languageUse', 'fluencyAndCohesion', 'intonationAndTone']
};

const writingPart1TasksSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            picture: { type: Type.STRING, description: "Base64 encoded image string" },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['picture', 'keywords']
    }
};

const writingPart1EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        totalRawScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        overallSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        questionFeedback: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    grammar: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
                    relevance: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
                },
                required: ['score', 'grammar', 'relevance']
            }
        }
    },
    required: ['totalRawScore', 'estimatedScoreBand', 'overallSummary', 'questionFeedback']
};

const writingPart2TasksSchema = {
    type: Type.OBJECT,
    properties: {
        question6: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, requestText: { type: Type.STRING } }, required: ['title', 'requestText'] },
        question7: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, requestText: { type: Type.STRING } }, required: ['title', 'requestText'] }
    },
    required: ['question6', 'question7']
};

const writingPart2EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        totalRawScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        overallSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        question6Feedback: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                completeness: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
                languageUse: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
                organization: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
            },
            required: ['score', 'completeness', 'languageUse']
        },
        question7Feedback: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                completeness: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
                languageUse: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
                organization: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
            },
            required: ['score', 'completeness', 'languageUse']
        }
    },
    required: ['totalRawScore', 'estimatedScoreBand', 'overallSummary', 'question6Feedback', 'question7Feedback']
};

const writingPart3TaskSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING }
    },
    required: ['question']
};

const writingPart3EvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        taskScore: { type: Type.INTEGER },
        estimatedScoreBand: { type: Type.STRING },
        overallSummary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        ideaDevelopment: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        organization: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        grammarAndSyntax: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] },
        vocabulary: { type: Type.OBJECT, properties: { english: { type: Type.STRING }, vietnamese: { type: Type.STRING } }, required: ['english', 'vietnamese'] }
    },
    required: ['taskScore', 'estimatedScoreBand', 'overallSummary', 'ideaDevelopment', 'organization', 'grammarAndSyntax', 'vocabulary']
};

const wordPronunciationEvaluationSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        overallScore: { type: Type.INTEGER },
        feedback_vi: { type: Type.STRING },
        phonemeEvaluations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    phoneme: { type: Type.STRING },
                    accuracyScore: { type: Type.NUMBER }
                },
                required: ['phoneme', 'accuracyScore']
            }
        }
    },
    required: ['word', 'overallScore', 'feedback_vi', 'phonemeEvaluations']
};

export const generateSpeakingPart1Text = async (): Promise<string | null> => {
    try {
        const prompt = "Generate a single English paragraph (about 50-70 words) for a TOEIC Speaking Part 1 task. The text should be a typical announcement, advertisement, or informational reading.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Error generating Speaking Part 1 text:", error);
        return null;
    }
};

export const evaluateSpeakingPart1 = async (text: string, audioBase64: string, mimeType: string): Promise<SpeakingPart1EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Speaking examiner. Evaluate the user's reading of the following text: "${text}". Assess pronunciation, intonation, and stress. Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: audioBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart1Schema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Speaking Part 1:", error);
        return null;
    }
};

export const generateImageForSpeakingPart2 = async (): Promise<string | null> => {
    try {
        const prompt = "A realistic photograph of a common scene (e.g., a park, a busy street, a cafe, an office) with at least 2-3 people performing identifiable actions for a TOEIC Speaking Part 2 'Describe a Picture' task.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio: "4:3" }
            }
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};

export const evaluateSpeakingPart2 = async (audioBase64: string, mimeType: string): Promise<SpeakingPart2EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Speaking examiner. Evaluate the user's description of a picture based on the audio provided. Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: audioBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart2Schema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Speaking Part 2:", error);
        return null;
    }
};

export const generateSpeakingPart3Questions = async (): Promise<{ topic: string, question5: string, question6: string, question7: string } | null> => {
    try {
        const prompt = "Generate a TOEIC Speaking Part 3 task with a topic and three related questions (Question 5, 6, and 7). Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart3QuestionsSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating Speaking Part 3 questions:", error);
        return null;
    }
};

export const evaluateSpeakingPart3 = async (questions: { topic: string, question5: string, question6: string, question7: string }, base64Audios: (string|null)[], mimeTypes: string[]): Promise<SpeakingPart3EvaluationResult | null> => {
    try {
        const parts = [
            { text: `You are a TOEIC Speaking examiner. Evaluate the user's responses to these questions on the topic "${questions.topic}": Q5: "${questions.question5}", Q6: "${questions.question6}", Q7: "${questions.question7}". Return as JSON.` }
        ];
        
        base64Audios.forEach((audio, index) => {
            if (audio) {
                parts.push({ inlineData: { mimeType: mimeTypes[index], data: audio } } as any);
            }
        });

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart3EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Speaking Part 3:", error);
        return null;
    }
};

export const generateSpeakingPart4Task = async (): Promise<SpeakingPart4Task | null> => {
    try {
        const prompt = "Generate a TOEIC Speaking Part 4 task with a document and three questions (8, 9, 10). Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart4TaskSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating Speaking Part 4 task:", error);
        return null;
    }
};

export const evaluateSpeakingPart4 = async (task: SpeakingPart4Task, base64Audios: (string|null)[], mimeTypes: string[]): Promise<SpeakingPart4EvaluationResult | null> => {
    try {
        const parts = [
            { text: `You are a TOEIC Speaking examiner. Evaluate the user's responses based on a document titled "${task.documentTitle}". Questions: Q8: "${task.question8}", Q9: "${task.question9}", Q10: "${task.question10}". Return as JSON.` }
        ];
        
        base64Audios.forEach((audio, index) => {
            if (audio) {
                parts.push({ inlineData: { mimeType: mimeTypes[index], data: audio } } as any);
            }
        });

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart4EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Speaking Part 4:", error);
        return null;
    }
};

export const generateSpeakingPart5Scenario = async (): Promise<SpeakingPart5Scenario | null> => {
    try {
        const prompt = "Generate a TOEIC Speaking Part 5 'Propose a Solution' scenario with a caller name and problem description. Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart5ScenarioSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating Speaking Part 5 scenario:", error);
        return null;
    }
};

export const evaluateSpeakingPart5 = async (problem: string, audioBase64: string, mimeType: string): Promise<SpeakingPart5EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Speaking examiner. Evaluate the user's proposed solution to this problem: "${problem}". Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: audioBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: speakingPart5EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Speaking Part 5:", error);
        return null;
    }
};

export const generateWritingPart1Tasks = async (): Promise<WritingPart1Task[] | null> => {
    try {
        const tasks: WritingPart1Task[] = [];
        for (let i = 0; i < 5; i++) {
             const keywordsResponse = await ai.models.generateContent({
                 model: "gemini-3-flash-preview",
                 contents: "Generate 2 keywords for a TOEIC Writing Part 1 task. Return just the two words separated by a slash."
             });
             const keywords = (keywordsResponse.text || 'office / working').split('/').map(k => k.trim());
             
             const imageResponse = await ai.models.generateContent({
                 model: 'gemini-2.5-flash-image',
                 contents: { parts: [{ text: `A realistic photograph representing the keywords: ${keywords.join(', ')}` }] }
             });
             
             let picture = "";
             for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                 if (part.inlineData) {
                     picture = part.inlineData.data;
                     break;
                 }
             }
             tasks.push({ picture, keywords });
        }
        return tasks;
    } catch (error) {
        console.error("Error generating Writing Part 1 tasks:", error);
        return null;
    }
};

export const evaluateWritingPart1 = async (tasks: WritingPart1Task[], userAnswers: string[]): Promise<WritingPart1EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Writing examiner. Evaluate 5 sentences. 
        Tasks: ${JSON.stringify(tasks.map((t, i) => ({ keywords: t.keywords, answer: userAnswers[i] })))}
        Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingPart1EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Writing Part 1:", error);
        return null;
    }
};

export const generateWritingPart2Tasks = async (): Promise<WritingPart2Task | null> => {
    try {
        const prompt = "Generate two TOEIC Writing Part 2 e-mail requests (Question 6 and 7). Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingPart2TasksSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating Writing Part 2 tasks:", error);
        return null;
    }
};

export const evaluateWritingPart2 = async (tasks: WritingPart2Task, userAnswers: string[]): Promise<WritingPart2EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Writing examiner. Evaluate 2 email responses.
        Q6 Request: "${tasks.question6.requestText}", Response: "${userAnswers[0]}"
        Q7 Request: "${tasks.question7.requestText}", Response: "${userAnswers[1]}"
        Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingPart2EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Writing Part 2:", error);
        return null;
    }
};

export const generateWritingPart3Task = async (): Promise<WritingPart3Task | null> => {
    try {
        const prompt = "Generate a TOEIC Writing Part 3 opinion essay question. Return as JSON.";
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingPart3TaskSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error generating Writing Part 3 task:", error);
        return null;
    }
};

export const evaluateWritingPart3 = async (question: string, userAnswer: string): Promise<WritingPart3EvaluationResult | null> => {
    try {
        const prompt = `You are a TOEIC Writing examiner. Evaluate an opinion essay on: "${question}". Essay: "${userAnswer}". Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: writingPart3EvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating Writing Part 3:", error);
        return null;
    }
};

export const evaluateWordPronunciation = async (word: string, phonetic: string, audioBase64: string, mimeType: string): Promise<WordPronunciationEvaluationResult | null> => {
    try {
        const prompt = `You are an English pronunciation coach. Evaluate the pronunciation of "${word}" (phonetic: ${phonetic}) from the audio. Return as JSON.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: audioBase64 } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: wordPronunciationEvaluationSchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error evaluating word pronunciation:", error);
        return null;
    }
};
