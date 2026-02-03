import React, { useEffect, useState } from 'react';
import { taskService } from '../services/task.service';
import { socketService } from '../services/socket.service';
import { Task, CreateTaskDto } from '../types/task.types';
import { authService } from '../services/auth.service';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import Navbar from '../components/Layout/Navbar';

const DashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        loadTasks();
        setupWebSocket();

        return () => {
            socketService.disconnect();
        };
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = () => {
        const token = authService.getToken();
        if (!token) return;

        socketService.connect(token);

        socketService.on('taskCreated', (newTask: Task) => {
            console.log('New task received:', newTask);
            setTasks((prev) => [newTask, ...prev]);
        });

        socketService.on('taskUpdated', (updatedTask: Task) => {
            console.log('Task updated:', updatedTask);
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        });

        socketService.on('taskDeleted', (taskId: string) => {
            console.log('Task deleted:', taskId);
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        });
    };

    const handleCreateTask = async (taskData: CreateTaskDto) => {
        try {
            await taskService.createTask(taskData);
            // Real-time update will handle adding to list
        } catch (error) {
            console.error('Failed to create task:', error);
            throw error;
        }
    };

    const handleToggleComplete = async (id: string) => {
        try {
            await taskService.toggleComplete(id);
            // Real-time update will handle the UI update
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await taskService.deleteTask(id);
            // Real-time update will handle removing from list
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    const taskCounts = {
        all: tasks.length,
        active: tasks.filter((t) => !t.completed).length,
        completed: tasks.filter((t) => t.completed).length,
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">My Tasks</h1>
                    <p className="text-slate-600">Manage your tasks efficiently with TaskFlow</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'all'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        All ({taskCounts.all})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'active'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Active ({taskCounts.active})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === 'completed'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Completed ({taskCounts.completed})
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Task List */}
                    <div className="lg:col-span-2">
                        <TaskList
                            tasks={filteredTasks}
                            onToggleComplete={handleToggleComplete}
                            onDelete={handleDeleteTask}
                            loading={loading}
                        />
                    </div>

                    {/* Task Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <TaskForm onSubmit={handleCreateTask} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
