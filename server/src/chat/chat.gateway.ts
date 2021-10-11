import {
    SubscribeMessage,
    WebSocketGateway,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { MessageDto } from 'src/message/dto/message.dto'
import { MessageService } from 'src/message/message.service'

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server
    rooms: { [room: string]: Set<string> } = {}

    constructor(private messageService: MessageService) {}

    checkConnection(room: string): void {
        const countUsersInRoom = this.rooms[room].size
        this.wss.to(room).emit(countUsersInRoom === 2 ? 'online' : 'offline')
    }

    handleInterlocutorConnection(room: string, userId: string): void {
        this.rooms[room] = this.rooms[room]
            ? this.rooms[room].add(userId)
            : new Set([userId])

        this.checkConnection(room)
    }

    handleInterlocutorDisconnection(room: string, userId: string): void {
        this.rooms[room].delete(userId)

        if (!this.rooms[room].size) {
            delete this.rooms[room]
        }

        this.checkConnection(room)
    }

    async handleDisconnect(client: Socket): Promise<void> {
        try {
            const { room, userId } = client.handshake.auth
            this.handleInterlocutorDisconnection(room, userId)
            client.leave(room)
        } catch (error) {
            console.error(error)
        }
    }

    async handleConnection(client: Socket): Promise<void> {
        try {
            const { room, userId } = client.handshake.auth
            client.join(room)

            this.handleInterlocutorConnection(room, userId)
        } catch (error) {
            console.error(error)
        }
    }

    @SubscribeMessage('msgToServer')
    async handleMessage(
        @MessageBody() { msg, room, userId, chatId }: MessageDto
    ): Promise<void> {
        const messages = await this.messageService.create(msg, chatId, userId)
        this.wss.to(room).emit('msgFromServer', messages)
    }
}
