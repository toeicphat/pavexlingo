import { UserSettings } from '../types';

const defaultSettings: UserSettings = {
    name: '',
    email: '',
    scoreTarget: '',
    examDate: '',
    darkMode: false,
};

export const getSettings = async (username: string): Promise<UserSettings> => {
    try {
        const item = localStorage.getItem(`settings_${username}`);
        if (item) {
            return { ...defaultSettings, ...JSON.parse(item) };
        }
    } catch (e) {
        console.error(e);
    }
    return { ...defaultSettings };
};

export const saveSettings = async (username: string, settings: UserSettings): Promise<void> => {
    try {
        localStorage.setItem(`settings_${username}`, JSON.stringify(settings));
    } catch (e) {
        console.error(e);
    }
};
