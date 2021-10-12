import {
	Advertisement,
	AdvertisementDocument,
} from './../advertisement/advertisement.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Chat, ChatDocument } from './chat.schema'
import { User, UserDocument } from 'src/user/user.schema'
import { ChatDto } from './dto/chat.dto'
import { Message, MessageDocument } from 'src/message/message.schema'

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private chatModel: Model<ChatDocument>,
        @InjectModel(Advertisement.name)
        private adModel: Model<AdvertisementDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
    ) {}

    async create(
        id: string,
        { userId, ownerId }: ChatDto,
    ): Promise<ChatDocument> {
        const chat = await this.chatModel.create({
            user: Types.ObjectId(userId),
            owner: Types.ObjectId(ownerId),
            ad: Types.ObjectId(id),
            room: id + userId + ownerId,
        })

        const c = await chat
            .populate('user', 'name email')
            .populate('owner', 'name email')
            .populate('ad', 'name')
            .execPopulate()

        return c
    }

    async getOne(id: string, dto: ChatDto, userId: string): Promise<Chat> {
        const user_id = Types.ObjectId(userId)
        const chat = await this.chatModel
            .findOne({
                $or: [{ user: user_id }, { owner: user_id }],
            })
            .populate('user', 'name email avatar')
            .populate('owner', 'name email avatar')
            .populate('ad', 'name')
            .populate('messages')

        return chat ?? this.create(id, dto)
    }

    async getAll(id: string): Promise<Chat[]> {
        const userId = Types.ObjectId(id)
        const chats = await this.chatModel
            .find({
                $or: [{ owner: userId }, { user: userId }],
            })
            .populate('user', 'name email avatar')
            .populate('owner', 'name email avatar')
            .populate('ad', 'name images')
            .select('-room -__v')

        return chats
    }

    async remove(chatId: string, userId: string): Promise<Chat[]> {
        await Promise.all([
            this.chatModel.findOneAndDelete({ _id: chatId }),
            this.messageModel.deleteMany({ chatId: Types.ObjectId(chatId) }),
        ])

        return this.getAll(userId)
    }
}
