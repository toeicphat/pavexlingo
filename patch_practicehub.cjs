const fs = require('fs');
let code = fs.readFileSync('components/PracticeHub.tsx', 'utf8');

code = code.replace(
    'import { SectionVocabIcon, SectionDictationIcon, SectionGrammarIcon, MoneyEmojiIcon, SparklesIcon, TargetFillIcon, HeadphoneIcon, MegaphoneIcon, XCircleIcon, ListeningIntenseIcon } from \'./icons\';',
    'import { SectionVocabIcon, SectionDictationIcon, ReadingIcon, MoneyEmojiIcon, SparklesIcon, TargetFillIcon, HeadphoneIcon, MegaphoneIcon, XCircleIcon, ListeningIntenseIcon } from \'./icons\';'
);

code = code.replace(
    'onNavigateToGrammar: () => void;',
    'onNavigateToReading: () => void;'
);

code = code.replace(
    'onNavigateToGrammar,',
    'onNavigateToReading,'
);

code = code.replace(
    `<PracticeCard 
            title="Ngữ pháp"
            description="Ôn luyện các chủ điểm ngữ pháp TOEIC qua bài tập và đánh giá chi tiết."
            onClick={onNavigateToGrammar}
            icon={SectionGrammarIcon}
            iconColor="text-green-600"
        />`,
    `<PracticeCard 
            title="Reading"
            description="Luyện tập các kỹ năng và bài tập phần Đọc TOEIC."
            onClick={onNavigateToReading}
            icon={ReadingIcon}
            iconColor="text-green-600"
        />`
);

fs.writeFileSync('components/PracticeHub.tsx', code);
