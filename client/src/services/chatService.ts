import { IMessage } from '@/store/chat.interface'
import { io, Socket } from 'socket.io-client'

export class ChatService {
    readonly socket: Socket

    constructor(
        readonly room: string,
        readonly userId: string,
        readonly chatId: string
    ) {
        this.socket = io(process.env.VUE_APP_BASE_URL, {
            transports: ['websocket'],
            auth: { room, userId },
        })
        this.chatId = chatId
    }

    msgFromServer = (handler: (messages: IMessage[]) => void) => {
        this.socket.on('msgFromServer', handler)
    }

    msgToServer = (msg: string) => {
        const { room, userId, chatId } = this

        this.socket.emit('msgToServer', { msg, room, userId, chatId })
    }

    isOnline = (handler: () => void) => {
        this.socket.on('online', handler)
    }

    isOffline = (handler: () => void) => {
        this.socket.on('offline', handler)
    }

    disconnect = () => {
        this.socket.disconnect()
    }
}
