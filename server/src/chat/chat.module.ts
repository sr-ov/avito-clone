import {
    Advertisement,
    AdvertisementSchema,
} from './../advertisement/advertisement.schema'
import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { ChatController } from './chat.controller'
import { JwtAuthGuard } from 'src/user/jwt-auth.guard'
import { ChatService } from './chat.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Chat, ChatSchema } from './chat.schema'
import { User, UserSchema } from 'src/user/user.schema'
import { MessageModule } from 'src/message/message.module'
import { Message, MessageSchema } from 'src/message/message.schema'

@Module({
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
    imports: [
        JwtAuthGuard,
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: User.name, schema: UserSchema },
            { name: Advertisement.name, schema: AdvertisementSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
        MessageModule,
    ],
    exports: [ChatService],
})
export class ChatModule {}
