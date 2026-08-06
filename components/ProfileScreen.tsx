import React, { useState, useEffect } from 'react';
import { User, UserSettings } from '../types';
import { getSettings, saveSettings } from '../services/settingsService';
import { getDaysLeft } from '../services/authUtils';

interface ProfileScreenProps {
    currentUser: User;
    onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, onBack }) => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [name, setName] = useState('');
    const [scoreTarget, setScoreTarget] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            const data = await getSettings(currentUser.username);
            setSettings(data);
            setName(data.name || '');
            setScoreTarget(data.scoreTarget || '');
        };
        loadSettings();
    }, [currentUser.username]);

    const handleSave = async () => {
        if (!settings) return;
        const newSettings = { ...settings, name, scoreTarget };
        await saveSettings(currentUser.username, newSettings);
        setSettings(newSettings);
        alert('Đã lưu thông tin thành công!');
    };

    if (!settings) return null;

    const daysLeft = getDaysLeft(currentUser);
    const isExpired = daysLeft !== 'permanent' && daysLeft <= 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="p-6 sm:p-10 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Trang Cá Nhân</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Quản lý thông tin tài khoản của bạn</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Họ tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập họ tên của bạn"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email (Tài khoản)</label>
                                <input
                                    type="text"
                                    value={currentUser.username}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mục tiêu điểm số</label>
                                <input
                                    type="text"
                                    value={scoreTarget}
                                    onChange={(e) => setScoreTarget(e.target.value)}
                                    placeholder="Ví dụ: 800"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ngày tạo</label>
                                <input
                                    type="text"
                                    value={currentUser.role === 'admin' || currentUser.role === 'tester' ? 'Vĩnh viễn' : (currentUser.created || 'Không rõ')}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hạn sử dụng tài khoản</label>
                                <input
                                    type="text"
                                    value={daysLeft === 'permanent' ? 'Vĩnh viễn' : `Còn ${daysLeft} ngày`}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-not-allowed"
                                />
                                {isExpired && (
                                    <p className="mt-2 text-sm text-red-600 font-bold">
                                        Tài khoản của bạn đã hết hạn, vui lòng liên hệ thầy Phát để được hỗ trợ.
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSave}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
