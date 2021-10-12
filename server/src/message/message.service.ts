import { ChatService } from './../chat/chat.service'
import {
    Advertisement,
    AdvertisementDocument,
} from './../advertisement/advertisement.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument } from 'src/user/user.schema'
import { Chat, ChatDocument } from 'src/chat/chat.schema'
import { Message, MessageDocument } from './message.schema'

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Chat.name)
        private chatModel: Model<ChatDocument>,
        @InjectModel(Advertisement.name)
        private adModel: Model<AdvertisementDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
        private chatService: ChatService,
    ) {}

    async create(message: string, chatId: string, userId: string) {
        const msg = await this.messageModel.create({
            userId: Types.ObjectId(userId),
            chatId: Types.ObjectId(chatId),
            message,
        })

        const chat = await this.chatModel
            .findOneAndUpdate(
                { _id: chatId },
                { $push: { messages: msg._id } },
                { new: true },
            )
            .populate('messages')

        return chat.messages
    }
}
