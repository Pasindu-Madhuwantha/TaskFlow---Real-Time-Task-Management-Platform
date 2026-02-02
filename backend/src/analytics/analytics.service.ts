import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class AnalyticsService {
    constructor(private tasksService: TasksService) { }

    async getStats(userId: string) {
        return this.tasksService.getTaskStats(userId);
    }
}
