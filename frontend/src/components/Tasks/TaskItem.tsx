import React from 'react';
import { Task } from '../../types/task.types';

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DONE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityIcon = (priority?: string) => {
        switch (priority) {
            case 'HIGH':
                return (
                    <span className="text-red-500 font-bold" title="High Priority">
                        ⬆
                    </span>
                );
            case 'LOW':
                return (
                    <span className="text-blue-500" title="Low Priority">
                        ⬇
                    </span>
                );
            default:
                return (
                    <span className="text-yellow-500" title="Medium Priority">
                        ━
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="task-card group">
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                    <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${task.completed
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500'
                                : 'border-slate-300 hover:border-blue-500'
                            }`}
                    >
                        {task.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {getPriorityIcon(task.priority)}
                                <h3
                                    className={`text-lg font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                        }`}
                                >
                                    {task.title}
                                </h3>
                            </div>

                            {task.description && (
                                <p
                                    className={`text-sm mt-2 ${task.completed ? 'text-slate-400' : 'text-slate-600'
                                        }`}
                                >
                                    {task.description}
                                </p>
                            )}

                            <div className="flex items-center gap-3 mt-3">
                                <span className={`status-badge border ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDate(task.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => onDelete(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
                            title="Delete task"
                        >
                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
