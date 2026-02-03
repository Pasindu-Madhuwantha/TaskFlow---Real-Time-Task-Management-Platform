import api from './api';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStats } from '../types/task.types';

export const taskService = {
    async getTasks(): Promise<Task[]> {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    async getTask(id: string): Promise<Task> {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    async createTask(taskData: CreateTaskDto): Promise<Task> {
        const response = await api.post<Task>('/tasks', taskData);
        return response.data;
    },

    async updateTask(id: string, updates: UpdateTaskDto): Promise<Task> {
        const response = await api.put<Task>(`/tasks/${id}`, updates);
        return response.data;
    },

    async toggleComplete(id: string): Promise<Task> {
        const response = await api.patch<Task>(`/tasks/${id}/complete`);
        return response.data;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    async getStats(): Promise<TaskStats> {
        const response = await api.get<TaskStats>('/analytics/stats');
        return response.data;
    },
};
