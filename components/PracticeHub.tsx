import React, { useState, useEffect } from 'react';
import { SectionVocabIcon, SectionDictationIcon, SectionGrammarIcon, MoneyEmojiIcon, SparklesIcon, TargetFillIcon, HeadphoneIcon, MegaphoneIcon, XCircleIcon } from './icons';

interface PracticeHubProps {
  onNavigateToVocabulary: () => void;
  onNavigateToDictation: () => void;
  onNavigateToGrammar: () => void;
  onNavigateToListeningIntense: () => void;
  isLoggedIn: boolean;
}

const announcements = [
  { date: '13/02/2026', time: '09:00', text: 'Đã có tính năng hướng dẫn sử dụng Website ở góc phải phía trên.' },
  { date: '01/02/2026', time: '14:30', text: 'Cập nhật tính năng Luyện Nghe (Chuyên sâu).' },
  { date: '15/01/2026', time: '10:15', text: 'Cập nhật tính năng Tạo từ vựng cá nhân trong mục Từ vựng.' },
];

const PracticeCard: React.FC<{
    title: string, 
    description: string, 
    onClick: () => void, 
    icon: React.FC<any>,
    iconColor: string,
    faded?: boolean
}> = ({ title, description, onClick, icon: Icon, iconColor, faded }) => (
    <button 
        onClick={onClick}
        className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 text-left w-full h-full flex flex-col items-center text-center ${
            faded 
            ? 'opacity-40 grayscale' 
            : 'hover:shadow-xl hover:-translate-y-1'
        }`}
    >
        <div className="relative">
            <Icon className={`h-12 w-12 ${iconColor} mb-4`} />
            {faded && (
                <div className="absolute -top-1 -right-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 flex-grow">{description}</p>
        {faded && <span className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Yêu cầu đăng nhập</span>}
    </button>
);


const PracticeHub: React.FC<PracticeHubProps> = ({ 
    onNavigateToVocabulary,
    onNavigateToDictation,
    onNavigateToGrammar,
    onNavigateToListeningIntense,
    isLoggedIn
}) => {
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  useEffect(() => {
    const hasSeenAnnouncements = sessionStorage.getItem('pavex_seen_announcements');
    if (!hasSeenAnnouncements) {
      setShowAnnouncements(true);
      sessionStorage.setItem('pavex_seen_announcements', 'true');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Floating Announcement Button */}
      <button 
        onClick={() => setShowAnnouncements(!showAnnouncements)}
        className="fixed left-6 bottom-24 z-40 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 group"
        aria-label="Xem thông báo"
      >
        <MegaphoneIcon className="h-8 w-8" />
        {!showAnnouncements && (
            <span className="absolute left-full ml-3 px-3 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cập nhật mới
            </span>
        )}
      </button>

      {/* Announcement Pop-up (Non-modal) */}
      {showAnnouncements && (
        <div className="fixed left-28 bottom-24 z-50 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform animate-in slide-in-from-bottom-5 duration-200 origin-bottom-left flex flex-col max-h-[60vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Cập nhật mới</h3>
                </div>
                <button 
                    onClick={() => setShowAnnouncements(false)} 
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                    <XCircleIcon className="h-6 w-6" />
                </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto p-4 space-y-3">
                 {announcements.map((ann, idx) => (
                      <div key={idx} className="pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-wider">{ann.date}</span>
                             <span className="text-[10px] text-slate-400 font-medium">{ann.time}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{ann.text}</p>
                      </div>
                 ))}
            </div>
            
             <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 rounded-b-2xl">
                <button 
                  onClick={() => setShowAnnouncements(false)}
                  className="w-full py-2 rounded-lg font-bold text-sm text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Đóng
                </button>
            </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center mb-12 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4 animate-bling">
          <TargetFillIcon className="h-20 w-20" />
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-blue-700 select-none">990</span>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight animate-shake">TOEIC không khó, học CHẮC bao ĐẬU</h2>
        <p className="mt-4 text-lg text-red-600 font-bold">
          Vì đây là sản phẩm đang phát triển. Nếu có sai sót, xin vui lòng nhắn tin cho thầy Phát qua Facebook cá nhân ở cuối trang.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <PracticeCard 
            title="Từ vựng"
            description="Luyện tập từ vựng qua hệ thống lặp lại ngắt quãng (SRS) và các trò chơi tương tác."
            onClick={onNavigateToVocabulary}
            icon={SectionVocabIcon}
            iconColor="text-purple-600"
        />
        <PracticeCard 
            title="Chép chính tả"
            description="Luyện nghe sâu và cải thiện chính tả qua các bài nghe từ kho đề ETS."
            onClick={onNavigateToDictation}
            icon={SectionDictationIcon}
            iconColor="text-orange-500"
            faded={!isLoggedIn}
        />
        <PracticeCard 
            title="Ngữ pháp"
            description="Ôn luyện các chủ điểm ngữ pháp TOEIC qua bài tập và đánh giá chi tiết."
            onClick={onNavigateToGrammar}
            icon={SectionGrammarIcon}
            iconColor="text-green-600"
            faded={!isLoggedIn}
        />
        <PracticeCard 
            title="Listening (Chuyên sâu)"
            description="Luyện tập nghe hiểu theo hình thức chuyên sâu."
            onClick={onNavigateToListeningIntense}
            icon={HeadphoneIcon}
            iconColor="text-blue-600"
            faded={!isLoggedIn}
        />
      </div>

      <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 border-2 border-yellow-200/50 shadow-xl shadow-yellow-500/10 shine flex flex-col justify-center">
            <div className="relative text-red-900 space-y-4 font-medium">
                <p>
                    <strong>Lưu ý:</strong> Bạn chỉ đang truy cập được vào mục TỪ VỰNG. Nếu bạn nghiêm túc và quyết tâm chinh phục mục tiêu TOEIC trong thời gian tới, hãy liên hệ ngay với Thầy qua Facebook (ở cuối trang) để được mở khóa các tính năng khác <strong>MIỄN PHÍ</strong>. Điều kiện cực kỳ đơn giản: Hãy chia sẻ rõ ràng Kế hoạch chinh phục TOEIC của bạn (<em>Ví dụ: Thời gian luyện thi? Cường độ ôn luyện mỗi tuần? Ngày dự kiến đi thi?</em>).
                </p>
                <p>
                    Thầy sẽ cấp cho bạn tài khoản truy cập vào trang web có thời hạn 6 tháng – một khoảng thời gian lý tưởng và thực tế nhất cho sự bứt phá. Sau 6 tháng, nếu bạn chưa hoàn thành kỳ thi, tài khoản sẽ được ưu tiên nhường lại cho những học viên mới, đảm bảo tài nguyên được sử dụng hiệu quả nhất!
                </p>
            </div>
        </div>

        <div className="relative overflow-hidden p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 shadow-xl shadow-blue-500/10 shine flex flex-col items-center text-center">
            <div className="absolute top-2 left-2 text-blue-300/40 dark:text-blue-400/20">
                <SparklesIcon className="h-10 w-10 rotate-12" />
            </div>
            <div className="absolute bottom-2 right-2 text-blue-300/40 dark:text-blue-400/20">
                <SparklesIcon className="h-10 w-10 -rotate-12" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative">
                <MoneyEmojiIcon className="h-10 w-10" />
                <h3 className="text-2xl font-black text-blue-700 uppercase tracking-wider">Hoạt động đổi thưởng</h3>
            </div>
            
            <p className="text-xl font-bold text-blue-700 mb-8 leading-relaxed px-6 relative">
                Khi thi đậu mục tiêu đã đặt ra, các bạn vui lòng báo điểm về cho thầy Phát để đổi thưởng tiền mặt $$$ nhé
            </p>
            
            <a 
                href="https://www.facebook.com/phattruong.english" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white font-black text-xl rounded-xl hover:bg-blue-700 transition-all shadow-[0_6px_0_0_rgba(29,78,216,1)] active:shadow-none active:translate-y-[6px] relative overflow-hidden"
            >
                BÁO ĐIỂM THẦY PHÁT
            </a>
        </div>
      </div>
    </div>
  );
};

export default PracticeHub;