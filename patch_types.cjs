const fs = require('fs');
let code = fs.readFileSync('types.ts', 'utf8');

if (!code.includes("ReadingPart5Test = 'READING_PART_5_TEST'")) {
    code = code.replace(
        "StudyScreen = 'STUDY_SCREEN',",
        "StudyScreen = 'STUDY_SCREEN',\n    ReadingPart5Test = 'READING_PART_5_TEST',"
    );
    fs.writeFileSync('types.ts', code);
}
