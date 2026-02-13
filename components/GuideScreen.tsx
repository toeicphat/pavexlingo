import React from 'react';
import { ArrowLeftIcon } from './icons';
import SelectionCard from './SelectionCard';

interface GuideScreenProps {
    onBack: () => void;
}

const guides = [
    {
        title: "Hướng dẫn - Học từ vựng",
        description: "Bấm vào để xem video hướng dẫn số.",
        link: "https://www.canva.com/design/DAHBGENW1wA/ZZ_xQIVXyF4QPnGijKgEqA/edit?utm_content=DAHBGENW1wA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
    },
    {
        title: "Hướng dẫn - Tự tạo từ vựng cá nhân hóa",
        description: "Bấm vào để xem video hướng dẫn số.",
        link: "https://www.canva.com/design/DAHBNRiPNZc/ivvs_B0IpXdS1EdY33WPeg/edit?utm_content=DAHBNRiPNZc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
    },
    {
        title: "Hướng dẫn - Hệ thống từ vựng lặp lại ngắt quãng",
        description: "Bấm vào để xem video hướng dẫn số.",
        link: "https://www.canva.com/design/DAHBNes1yHA/eUZ0AF7fmwgCfn1jbEDKkw/edit?utm_content=DAHBNes1yHA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
    }
];

const GuideScreen: React.FC<GuideScreenProps> = ({ onBack }) => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Quay lại Trang chủ
                </button>
                
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">Hướng dẫn sử dụng</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Chào mừng bạn! Dưới đây là các tài liệu hướng dẫn giúp bạn sử dụng ứng dụng hiệu quả hơn.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {guides.map((guide, index) => (
                        <SelectionCard 
                            key={index}
                            title={guide.title}
                            description={guide.description}
                            onClick={() => window.open(guide.link, '_blank')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideScreen;