import React from 'react';
import { Task } from '../../types/task.types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-lg bg-slate-200 h-6 w-6"></div>
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="glass-card p-12 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h3>
                <p className="text-slate-600">Create your first task to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskList;
