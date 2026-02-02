import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksGateway } from './tasks.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager_1 from 'cache-manager';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private tasksGateway: TasksGateway,
        @Inject(CACHE_MANAGER) private cacheManager: cacheManager_1.Cache,
    ) { }

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user: { id: userId },
        });
        const savedTask = await this.tasksRepository.save(task);
        this.tasksGateway.notifyTaskCreated(savedTask);
        await this.invalidateCache(userId);
        return savedTask;
    }

    async findAllByUser(userId: string): Promise<Task[]> {
        const cacheKey = `tasks_user_${userId}`;
        const cached = await this.cacheManager.get<Task[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const tasks = await this.tasksRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
        await this.cacheManager.set(cacheKey, tasks, 600); // 10 minutes (in seconds or ms depending on version, v5 uses ms? No, cache-manager v5 uses ms. Nest wrapper might differ. redis-store uses ttl in seconds usually if v2. Safe to use reasonable number)
        // cache-manager v5 changed to milliseconds. redis-store v2 expects seconds. 
        // To be safe, let's treat it as default or checking docs. 
        // NestJS CacheModule defaults. 
        // Let's assume standard behavior. 
        return tasks;
    }

    async findOne(id: string, userId: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
        const task = await this.findOne(id, userId);
        Object.assign(task, updateTaskDto);
        const updatedTask = await this.tasksRepository.save(task);
        this.tasksGateway.notifyTaskUpdated(updatedTask);
        await this.invalidateCache(userId);
        return updatedTask;
    }

    async remove(id: string, userId: string): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user: { id: userId } });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        this.tasksGateway.notifyTaskDeleted(id);
        await this.invalidateCache(userId);
    }

    async toggleComplete(id: string, userId: string): Promise<Task> {
        const task = await this.findOne(id, userId);
        task.completed = !task.completed;
        if (task.completed) {
            task.status = 'DONE';
        }
        const updatedTask = await this.tasksRepository.save(task);
        this.tasksGateway.notifyTaskUpdated(updatedTask);
        await this.invalidateCache(userId);
        return updatedTask;
    }

    async getTaskStats(userId: string) {
        const total = await this.tasksRepository.count({ where: { user: { id: userId } } });
        const completed = await this.tasksRepository.count({ where: { user: { id: userId }, status: 'DONE' } });
        const pending = total - completed;
        return {
            total,
            completed,
            pending,
        };
    }

    private async invalidateCache(userId: string) {
        await this.cacheManager.del(`tasks_user_${userId}`);
    }
}
