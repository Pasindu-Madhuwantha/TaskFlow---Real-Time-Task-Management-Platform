import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'TODO' })
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';

    @Column({ default: false })
    completed: boolean;

    @Column({ nullable: true })
    priority: 'LOW' | 'MEDIUM' | 'HIGH';

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.tasks)
    user: User;
}
