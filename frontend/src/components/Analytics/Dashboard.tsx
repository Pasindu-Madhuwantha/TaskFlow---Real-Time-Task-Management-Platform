import React, { useEffect, useState } from 'react';
import { taskService } from '../../services/task.service';
import type { TaskStats } from '../../types/task.types';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await taskService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl">
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Tasks */}
                <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Tasks</p>
                            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed</p>
                            <p className="text-4xl font-bold text-green-600 mt-2">{stats.completed}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="glass-card p-6 rounded-2xl transform hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending</p>
                            <p className="text-4xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">Completion Rate</h3>
                    <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
                <p className="text-sm text-slate-600 mt-3">
                    {stats.completed} of {stats.total} tasks completed
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
