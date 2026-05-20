import { VocabularyPart } from '../../types';

export const medicalEnglishVocabulary: VocabularyPart = {
    id: 11, // Assigning a unique ID
    title: 'Medical English',
    description: 'Vocabulary for Medical Contexts',
    isNew: true,
    tests: [
        {
            id: 1,
            title: 'Set 1 - Health & illness',
            words: [
                { word: 'nausea', definition: 'buồn nôn' },
                { word: 'vomit', definition: 'nôn mửa' },
                { word: 'deteriorate', definition: 'xấu đi/ tệ đi' },
                { word: 'remission', definition: 'thuyên giảm' },
                { word: 'relapse', definition: 'tái phát' }
            ]
        },
        {
            id: 2,
            title: 'Set 2 - Parts of the body 1',
            words: [
                { word: 'jaw (mandible)', definition: 'Hàm dưới' },
                { word: 'axilla', definition: 'armpit, nách' },
                { word: 'armpit', definition: 'nách' },
                { word: 'upper arm', definition: 'cánh tay trên' },
                { word: 'nates', definition: 'mông' },
                { word: 'buttock', definition: 'mông' },
                { word: 'thigh', definition: 'đùi' },
                { word: 'calf', definition: 'bắp chân' },
                { word: 'chest (thorax)', definition: 'toàn bộ lồng ngực' },
                { word: 'thorax', definition: 'toàn bộ lồng ngực' },
                { word: 'breast (mamma)', definition: 'ngực tuyến vú' },
                { word: 'tummy', definition: 'bụng' },
                { word: 'abdomen', definition: 'bụng' },
                { word: 'navel', definition: 'rốn' },
                { word: 'umbilicus', definition: 'rốn' },
                { word: 'hip', definition: 'hông' },
                { word: 'coxa', definition: 'hông' },
                { word: 'groin (inguinal region)', definition: 'háng' },
                { word: 'knee', definition: 'gối, đầu gối' },
                { word: 'patella', definition: 'xương bánh chè' },
                { word: 'kneecap', definition: 'xương bánh chè' },
                { word: 'shin', definition: 'ống chân' },
                { word: 'limb', definition: 'chi' },
                { word: 'upper limb', definition: 'arm' },
                { word: 'lower limb', definition: 'leg' },
                { word: 'trunk', definition: 'body exclude head & limb' },
                { word: 'radiate', definition: 'lan ra/ tỏa ra' },
                { word: 'cubitus', definition: 'elbow' },
                { word: 'carpus', definition: 'wrist' },
                { word: 'testicle', definition: 'tinh hoàn' },
                { word: 'loin', definition: 'phần lưng dưới' }
            ]
        },
        {
            id: 3,
            title: 'Set 3 - The abdomen',
            words: [
                { word: 'stomach', definition: 'dạ dày' },
                { word: 'pancreas', definition: 'tuyến tụy' },
                { word: 'duodenum', definition: 'tá tràng' },
                { word: 'gall bladder', definition: 'túi mật' },
                { word: 'liver', definition: 'gan' },
                { word: 'kidney', definition: 'thận' },
                { word: 'spleen', definition: 'lá lách' },
                { word: 'intestine', definition: 'ruột' },
                { word: 'bowel', definition: 'ruột' },
                { word: 'small intestine', definition: 'ruột non' },
                { word: 'small bowel', definition: 'ruột non' },
                { word: 'large bowel', definition: 'ruột già' },
                { word: 'large intestune', definition: 'ruột già' },
                { word: 'anus', definition: 'hậu môn' },
                { word: 'rectrum', definition: 'trực tràng' },
                { word: 'back passage', definition: 'anus/ rectrum' }
            ]
        },
        {
            id: 4,
            title: 'Set 4 - The chest',
            words: [
                { word: 'respiration', definition: 'hô hấp' },
                { word: 'airway', definition: 'đường thở' },
                { word: 'lobe', definition: 'thùy phổi' },
                { word: 'larynx', definition: 'thanh quản' },
                { word: 'trachea', definition: 'khí quản' },
                { word: 'windpipe', definition: 'khí quản' },
                { word: 'bronchus', definition: 'phế quản' },
                { word: 'bronchioles', definition: 'tiểu phế quản' },
                { word: 'diaphragm', definition: 'màn ngăn, cơ hoành' }
            ]
        },
        {
            id: 5,
            title: 'Set 5 - The pelvis',
            words: [
                { word: 'pelvis', definition: 'xương chậu' },
                { word: 'ureter', definition: 'niệu quản' },
                { word: 'urine', definition: 'nước tiểu' },
                { word: 'bladder', definition: 'bàng quang' },
                { word: 'urethra', definition: 'niệu đạo' }
            ]
        },
        {
            id: 6,
            title: 'Set 6 - Diseases 1',
            words: [
                { word: 'angina pectoris', definition: 'đau thắt ngực' },
                { word: 'renal colic', definition: 'đau quặn thận' },
                { word: 'inguinal swelling', definition: 'sưng bẹn' },
                { word: 'abdominal pain', definition: 'đau bụng' },
                { word: 'periumbilical rash', definition: 'phát ban quanh rốn' },
                { word: 'thoracic pain', definition: 'đau lồng ngực' },
                { word: 'enlarged axillary node', definition: 'hạch nách to' },
                { word: 'mandibular pain', definition: 'đau hàm dưới' }
            ]
        },
        {
            id: 7,
            title: 'Set 7 - Diseases 2',
            words: [
                { word: 'hepatitis a, b', definition: 'viêm gan' },
                { word: 'pneumonia', definition: 'viêm phổi' },
                { word: 'nephritis', definition: 'viêm thận' },
                { word: 'gastric ulcer', definition: 'loét dạ dày' },
                { word: 'cystitis', definition: 'viêm bàng quang' },
                { word: 'angina pectoris', definition: 'đau thắt vùng ngực' },
                { word: 'cholecystitis', definition: 'viêm túi mật' },
                { word: 'ulcerative colitis', definition: 'viêm loét đại tràng' }
            ]
        },
        {
            id: 8,
            title: 'Set 8 - Body functions',
            words: [
                { word: 'sensation', definition: 'feeling' },
                { word: 'gait', definition: 'dáng đi' },
                { word: 'inhale', definition: 'breathe in/ take a breath in' },
                { word: 'exhale', definition: 'breathe out' },
                { word: 'urinate', definition: 'đi tiểu' },
                { word: 'micturate', definition: 'đi tiểu' },
                { word: 'pass urine, pass water', definition: 'đi tiểu' },
                { word: 'urine', definition: 'nước tiểu' },
                { word: 'defecate', definition: 'đại tiện' },
                { word: 'pass faeces', definition: 'đi ngoài, đi phân' },
                { word: 'pass stools', definition: 'đi ngoài, đi phân' },
                { word: 'faeces', definition: 'phân, cứt' },
                { word: 'stools', definition: 'phân, cứt' },
                { word: 'menstruate', definition: 'hành kinh, có kinh' },
                { word: 'have a period', definition: 'hành kinh, có kinh' },
                { word: 'menstrual period', definition: 'kỳ kinh nguyệt' },
                { word: 'monthly period', definition: 'kỳ kinh nguyệt' },
                { word: 'shake', definition: 'run' },
                { word: 'sweat', definition: 'đổ mồ hôi' }
            ]
        },
        {
            id: 9,
            title: 'Set 9 - Diseases 3',
            words: [
                { word: 'dysuria', definition: 'tiểu buốt/ rát' },
                { word: 'dysphagia', definition: 'khó nuốt' },
                { word: 'diplopia', definition: 'nhìn đôi/ song thị' },
                { word: 'dysphasia', definition: 'khó nói/ loạn ngôn' },
                { word: 'dyspnoea', definition: 'khó thở' },
                { word: 'numbness', definition: 'tê bì' },
                { word: 'tingling', definition: 'tê bì' },
                { word: 'peripheral neuropathy', definition: 'Bệnh thần kinh ngoại biên.' },
                { word: 'oesophageal stricture', definition: 'Hẹp thực quản.' },
                { word: 'prostatic hypertrophy', definition: 'Phì đại tuyến tiền liệt' },
                { word: 'hyperthyroidism', definition: 'Cường giáp' },
                { word: 'Parkinsonism', definition: 'Hội chứng Parkinson (tay run)' },
                { word: 'left heart failure', definition: 'Suy tim trái' }
            ]
        }
    ]
};

