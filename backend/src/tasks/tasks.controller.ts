import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
        return this.tasksService.create(createTaskDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAllByUser(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.tasksService.findOne(id, req.user.id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
        return this.tasksService.update(id, updateTaskDto, req.user.id);
    }

    @Patch(':id/complete')
    toggleComplete(@Param('id') id: string, @Request() req) {
        return this.tasksService.toggleComplete(id, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tasksService.remove(id, req.user.id);
    }
}
