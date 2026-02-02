import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    notifyTaskCreated(task: any) {
        this.server.emit('taskCreated', task);
    }

    notifyTaskUpdated(task: any) {
        this.server.emit('taskUpdated', task);
    }

    notifyTaskDeleted(taskId: string) {
        this.server.emit('taskDeleted', taskId);
    }
}
