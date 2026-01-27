import React, { useState, useEffect } from 'react';
import { User, TestResult } from '../types';
import { getProgress, getLatestActivity } from '../services/progressService';
import { LoadingIcon, RefreshIcon } from './icons';

interface AdminScreenProps {
  users: User[];
  onViewStudentProgress: (user: User) => void;
  onLogout: () => void;
}

interface UserActivity extends User {
    latestActivity: TestResult | null;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ users, onViewStudentProgress, onLogout }) => {
    const [studentData, setStudentData] = useState<UserActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchActivities = async () => {
        const standardUsers = users.filter(u => u.username !== 'admin');
        const activitiesPromises = standardUsers.map(async (user) => {
             const progress = await getProgress(user.username);
             const latestActivity = getLatestActivity(progress);
             return { ...user, latestActivity };
        });

        const data = await Promise.all(activitiesPromises);
        
        // Sort by most recent activity
        data.sort((a, b) => {
            if (!a.latestActivity) return 1;
            if (!b.latestActivity) return -1;
            return b.latestActivity.date - a.latestActivity.date;
        });
        
        setStudentData(data);
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchActivities();
            setIsLoading(false);
        };
        load();
    }, [users]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchActivities();
        setIsRefreshing(false);
    };

    const formatResult = (result: TestResult) => {
        const percentage = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
        return `${result.score}/${result.total} (${percentage}%)`;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingIcon className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                    <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-700">Student Activity Overview</h2>
                        <button 
                            onClick={handleRefresh} 
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                            <RefreshIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="p-3 font-semibold text-slate-600">Student</th>
                                    <th className="p-3 font-semibold text-slate-600">Latest Activity</th>
                                    <th className="p-3 font-semibold text-slate-600">Date</th>
                                    <th className="p-3 font-semibold text-slate-600">Score</th>
                                    <th className="p-3 font-semibold text-slate-600 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.map(student => (
                                    <tr key={student.username} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-3 font-medium text-slate-800">{student.username}</td>
                                        <td className="p-3 text-slate-600">
                                            {student.latestActivity ? student.latestActivity.title : <span className="text-slate-400 italic">No activity yet</span>}
                                        </td>
                                        <td className="p-3 text-slate-600">
                                            {student.latestActivity ? new Date(student.latestActivity.date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-3 text-slate-600">
                                            {student.latestActivity ? formatResult(student.latestActivity) : '-'}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => onViewStudentProgress(student)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScreen;
