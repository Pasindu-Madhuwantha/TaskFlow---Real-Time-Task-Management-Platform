import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' })
    @IsOptional()
    @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';

    @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH'], required: false })
    @IsOptional()
    @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}
