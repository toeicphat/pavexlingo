import { User } from '../types';

export const getDaysLeft = (user: User | null): number | 'permanent' => {
    if (!user) return 0;
    if (user.role === 'admin' || user.role === 'tester') return 'permanent';
    if (!user.created) return 0;

    const creationDate = new Date(user.created);
    const now = new Date();
    
    // Normalize to midnight
    creationDate.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    const msPassed = now.getTime() - creationDate.getTime();
    const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
    
    const daysLeft = 90 - daysPassed;
    return daysLeft < 0 ? 0 : daysLeft;
};

export const isAccountExpired = (user: User | null): boolean => {
    if (!user) return true;
    const daysLeft = getDaysLeft(user);
    if (daysLeft === 'permanent') return false;
    return daysLeft <= 0;
};
