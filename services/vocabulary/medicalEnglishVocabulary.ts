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
                { word: 'nausea', ipa: '/ˈnɔː.zi.ə/', definition: 'buồn nôn' },
                { word: 'vomit', ipa: '/ˈvɒm.ɪt/', definition: 'nôn mửa' },
                { word: 'deteriorate', ipa: '/dɪˈtɪə.ri.ə.reɪt/', definition: 'xấu đi/ tệ đi' },
                { word: 'remission', ipa: '/rɪˈmɪʃ.ən/', definition: 'thuyên giảm' },
                { word: 'relapse', ipa: '/rɪˈlæps/', definition: 'tái phát' }
            ]
        },
        {
            id: 2,
            title: 'Set 2 - Parts of the body 1',
            words: [
                { word: 'jaw (mandible)', ipa: '/dʒɔː/ (/ˈmæn.dɪ.bəl/)', definition: 'Hàm dưới' },
                { word: 'axilla', ipa: '/ækˈsɪl.ə/', definition: 'armpit, nách' },
                { word: 'armpit', ipa: '/ˈɑːm.pɪt/', definition: 'nách' },
                { word: 'upper arm', ipa: '/ˈʌp.ər ɑːm/', definition: 'cánh tay trên' },
                { word: 'nates', ipa: '/ˈneɪ.tiːz/', definition: 'mông' },
                { word: 'buttock', ipa: '/ˈbʌt.ək/', definition: 'mông' },
                { word: 'thigh', ipa: '/θaɪ/', definition: 'đùi' },
                { word: 'calf', ipa: '/kɑːf/', definition: 'bắp chân' },
                { word: 'chest (thorax)', ipa: '/tʃest/ (/ˈθɔː.ræks/)', definition: 'toàn bộ lồng ngực' },
                { word: 'thorax', ipa: '/ˈθɔː.ræks/', definition: 'toàn bộ lồng ngực' },
                { word: 'breast (mamma)', ipa: '/brest/ (/ˈmæm.ə/)', definition: 'ngực tuyến vú' },
                { word: 'tummy', ipa: '/ˈtʌm.i/', definition: 'bụng' },
                { word: 'abdomen', ipa: '/ˈæb.də.mən/', definition: 'bụng' },
                { word: 'navel', ipa: '/ˈneɪ.vəl/', definition: 'rốn' },
                { word: 'umbilicus', ipa: '/ʌmˈbɪl.ɪ.kəs/', definition: 'rốn' },
                { word: 'hip', ipa: '/hɪp/', definition: 'hông' },
                { word: 'coxa', ipa: '/ˈkɒk.sə/', definition: 'hông' },
                { word: 'groin (inguinal region)', ipa: '/ɡrɔɪn/ (/ˈɪŋ.ɡwɪ.nəl ˈriː.dʒən/)', definition: 'háng' },
                { word: 'knee', ipa: '/niː/', definition: 'gối, đầu gối' },
                { word: 'patella', ipa: '/pəˈtel.ə/', definition: 'xương bánh chè' },
                { word: 'kneecap', ipa: '/ˈniː.kæp/', definition: 'xương bánh chè' },
                { word: 'shin', ipa: '/ʃɪn/', definition: 'ống chân' },
                { word: 'limb', ipa: '/lɪm/', definition: 'chi' },
                { word: 'upper limb', ipa: '/ˈʌp.ər lɪm/', definition: 'arm' },
                { word: 'lower limb', ipa: '/ˈləʊ.ər lɪm/', definition: 'leg' },
                { word: 'trunk', ipa: '/trʌŋk/', definition: 'body exclude head & limb' },
                { word: 'radiate', ipa: '/ˈreɪ.di.eɪt/', definition: 'lan ra/ tỏa ra' },
                { word: 'cubitus', ipa: '/ˈkjuː.bɪ.təs/', definition: 'elbow' },
                { word: 'carpus', ipa: '/ˈkɑː.pəs/', definition: 'wrist' },
                { word: 'testicle', ipa: '/ˈtes.tɪ.kəl/', definition: 'tinh hoàn' },
                { word: 'loin', ipa: '/lɔɪn/', definition: 'phần lưng dưới' }
            ]
        },
        {
            id: 3,
            title: 'Set 3 - The abdomen',
            words: [
                { word: 'stomach', ipa: '/ˈstʌm.ək/', definition: 'dạ dày' },
                { word: 'pancreas', ipa: '/ˈpæŋ.kri.əs/', definition: 'tuyến tụy' },
                { word: 'duodenum', ipa: '/ˌdʒuː.əˈdiː.nəm/', definition: 'tá tràng' },
                { word: 'gall bladder', ipa: '/ˈɡɔːl ˌblæd.ər/', definition: 'túi mật' },
                { word: 'liver', ipa: '/ˈlɪv.ər/', definition: 'gan' },
                { word: 'kidney', ipa: '/ˈkɪd.ni/', definition: 'thận' },
                { word: 'spleen', ipa: '/spliːn/', definition: 'lá lách' },
                { word: 'intestine', ipa: '/ɪnˈtes.tɪn/', definition: 'ruột' },
                { word: 'bowel', ipa: '/baʊəl/', definition: 'ruột' },
                { word: 'small intestine', ipa: '/ˌsmɔːl ɪnˈtes.tɪn/', definition: 'ruột non' },
                { word: 'small bowel', ipa: '/ˌsmɔːl ˈbaʊ.əl/', definition: 'ruột non' },
                { word: 'large bowel', ipa: '/ˌlɑːdʒ ˈbaʊ.əl/', definition: 'ruột già' },
                { word: 'large intestune', ipa: '/ˌlɑːdʒ ɪnˈtes.tɪn/', definition: 'ruột già' },
                { word: 'anus', ipa: '/ˈeɪ.nəs/', definition: 'hậu môn' },
                { word: 'rectrum', ipa: '/ˈrek.təm/', definition: 'trực tràng' },
                { word: 'back passage', ipa: '/ˌbæk ˈpæs.ɪdʒ/', definition: 'anus/ rectrum' }
            ]
        },
        {
            id: 4,
            title: 'Set 4 - The chest',
            words: [
                { word: 'respiration', ipa: '/ˌres.pɪˈreɪ.ʃən/', definition: 'hô hấp' },
                { word: 'airway', ipa: '/ˈeə.weɪ/', definition: 'đường thở' },
                { word: 'lobe', ipa: '/ləʊb/', definition: 'thùy phổi' },
                { word: 'larynx', ipa: '/ˈlær.ɪŋks/', definition: 'thanh quản' },
                { word: 'trachea', ipa: '/trəˈkiː.ə/', definition: 'khí quản' },
                { word: 'windpipe', ipa: '/ˈwɪnd.paɪp/', definition: 'khí quản' },
                { word: 'bronchus', ipa: '/ˈbrɒŋ.kəs/', definition: 'phế quản' },
                { word: 'bronchioles', ipa: '/ˈbrɒŋ.ki.əʊlz/', definition: 'tiểu phế quản' },
                { word: 'diaphragm', ipa: '/ˈdaɪ.ə.fræm/', definition: 'màn ngăn, cơ hoành' }
            ]
        },
        {
            id: 5,
            title: 'Set 5 - The pelvis',
            words: [
                { word: 'pelvis', ipa: '/ˈpel.vɪs/', definition: 'xương chậu' },
                { word: 'ureter', ipa: '/jʊəˈriː.tər/', definition: 'niệu quản' },
                { word: 'urine', ipa: '/ˈjʊə.rɪn/', definition: 'nước tiểu' },
                { word: 'bladder', ipa: '/ˈblæd.ər/', definition: 'bàng quang' },
                { word: 'urethra', ipa: '/jʊˈriː.θrə/', definition: 'niệu đạo' }
            ]
        },
        {
            id: 6,
            title: 'Set 6 - Diseases 1',
            words: [
                { word: 'angina pectoris', ipa: '/ænˌdʒaɪ.nə ˈpek.tər.ɪs/', definition: 'đau thắt ngực' },
                { word: 'renal colic', ipa: '/ˌriː.nəl ˈkɒl.ɪk/', definition: 'đau quặn thận' },
                { word: 'inguinal swelling', ipa: '/ˈɪŋ.ɡwɪ.nəl ˈswel.ɪŋ/', definition: 'sưng bẹn' },
                { word: 'abdominal pain', ipa: '/æbˈdɒm.ɪ.nəl peɪn/', definition: 'đau bụng' },
                { word: 'periumbilical rash', ipa: '/ˌper.i.ʌmˈbɪl.ɪ.kəl ræʃ/', definition: 'phát ban quanh rốn' },
                { word: 'thoracic pain', ipa: '/θɔːˈræs.ɪk peɪn/', definition: 'đau lồng ngực' },
                { word: 'enlarged axillary node', ipa: '/ɪnˈlɑːdʒd ækˈsɪl.ər.i nəʊd/', definition: 'hạch nách to' },
                { word: 'mandibular pain', ipa: '/mænˈdɪb.jə.lər peɪn/', definition: 'đau hàm dưới' }
            ]
        },
        {
            id: 7,
            title: 'Set 7 - Diseases 2',
            words: [
                { word: 'hepatitis a, b', ipa: '/ˌhep.əˈtaɪ.tɪs eɪ, biː/', definition: 'viêm gan' },
                { word: 'pneumonia', ipa: '/njuːˈməʊ.ni.ə/', definition: 'viêm phổi' },
                { word: 'nephritis', ipa: '/nəˈfraɪ.tɪs/', definition: 'viêm thận' },
                { word: 'gastric ulcer', ipa: '/ˌɡæs.trɪk ˈʌl.sər/', definition: 'loét dạ dày' },
                { word: 'cystitis', ipa: '/sɪˈstaɪ.tɪs/', definition: 'viêm bàng quang' },
                { word: 'angina pectoris', ipa: '/ænˌdʒaɪ.nə ˈpek.tər.ɪs/', definition: 'đau thắt vùng ngực' },
                { word: 'cholecystitis', ipa: '/ˌkɒl.ɪ.sɪˈstaɪ.tɪs/', definition: 'viêm túi mật' },
                { word: 'ulcerative colitis', ipa: '/ˌʌl.sər.ə.tɪv kəˈlaɪ.tɪs/', definition: 'viêm loét đại tràng' }
            ]
        },
        {
            id: 8,
            title: 'Set 8 - Body functions',
            words: [
                { word: 'sensation', ipa: '/senˈseɪ.ʃən/', definition: 'feeling' },
                { word: 'gait', ipa: '/ɡeɪt/', definition: 'dáng đi' },
                { word: 'inhale', ipa: '/ɪnˈheɪl/', definition: 'breathe in/ take a breath in' },
                { word: 'exhale', ipa: '/eksˈheɪl/', definition: 'breathe out' },
                { word: 'urinate', ipa: '/ˈjʊə.rɪ.neɪt/', definition: 'đi tiểu' },
                { word: 'micturate', ipa: '/ˈmɪk.tʃə.reɪt/', definition: 'đi tiểu' },
                { word: 'pass urine, pass water', ipa: '/pɑːs ˈjʊə.rɪn/ - /pɑːs ˈwɔː.tər/', definition: 'đi tiểu' },
                { word: 'urine', ipa: '/ˈjʊə.rɪn/', definition: 'nước tiểu' },
                { word: 'defecate', ipa: '/ˈdef.ə.keɪt/', definition: 'đại tiện' },
                { word: 'pass faeces', ipa: '/pɑːs ˈfiː.siːz/', definition: 'đi ngoài, đi phân' },
                { word: 'pass stools', ipa: '/pɑːs stuːlz/', definition: 'đi ngoài, đi phân' },
                { word: 'faeces', ipa: '/ˈfiː.siːz/', definition: 'phân, cứt' },
                { word: 'stools', ipa: '/stuːlz/', definition: 'phân, cứt' },
                { word: 'menstruate', ipa: '/ˈmen.stru.eɪt/', definition: 'hành kinh, có kinh' },
                { word: 'have a period', ipa: '/hæv ə ˈpɪə.ri.əd/', definition: 'hành kinh, có kinh' },
                { word: 'menstrual period', ipa: '/ˈmen.stru.əl ˈpɪə.ri.əd/', definition: 'kỳ kinh nguyệt' },
                { word: 'monthly period', ipa: '/ˈmʌnθ.li ˈpɪə.ri.əd/', definition: 'kỳ kinh nguyệt' },
                { word: 'shake', ipa: '/ʃeɪk/', definition: 'run' },
                { word: 'sweat', ipa: '/swet/', definition: 'đổ mồ hôi' }
            ]
        },
        {
            id: 9,
            title: 'Set 9 - Diseases 3',
            words: [
                { word: 'dysuria', ipa: '/dɪsˈjʊə.ri.ə/', definition: 'tiểu buốt/ rát' },
                { word: 'dysphagia', ipa: '/dɪsˈfeɪ.dʒi.ə/', definition: 'khó nuốt' },
                { word: 'diplopia', ipa: '/dɪˈpləʊ.pi.ə/', definition: 'nhìn đôi/ song thị' },
                { word: 'dysphasia', ipa: '/dɪsˈfeɪ.zi.ə/', definition: 'khó nói/ loạn ngôn' },
                { word: 'dyspnoea', ipa: '/dɪspˈniː.ə/', definition: 'khó thở' },
                { word: 'numbness', ipa: '/ˈnʌm.nəs/', definition: 'tê bì' },
                { word: 'tingling', ipa: '/ˈtɪŋ.ɡlɪŋ/', definition: 'tê bì' },
                { word: 'peripheral neuropathy', ipa: '/pəˈrɪf.ər.əl njʊəˈrɒp.ə.θi/', definition: 'Bệnh thần kinh ngoại biên.' },
                { word: 'oesophageal stricture', ipa: '/ɪˌsɒf.əˈdʒiː.əl ˈstrɪk.tʃər/', definition: 'Hẹp thực quản.' },
                { word: 'prostatic hypertrophy', ipa: '/prɒsˈtæt.ɪk haɪˈpɜː.trə.fi/', definition: 'Phì đại tuyến tiền liệt' },
                { word: 'hyperthyroidism', ipa: '/ˌhaɪ.pəˈθaɪ.rɔɪ.dɪ.zəm/', definition: 'Cường giáp' },
                { word: 'Parkinsonism', ipa: '/ˈpɑː.kɪn.sən.ɪ.zəm/', definition: 'Hội chứng Parkinson (tay run)' },
                { word: 'left heart failure', ipa: '/left hɑːt ˈfeɪ.ljər/', definition: 'Suy tim trái' }
            ]
        }
    ]
};

