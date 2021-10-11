import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
	Advertisement,
	AdvertisementSchema,
} from 'src/advertisement/advertisement.schema'
import { ChatModule } from 'src/chat/chat.module'
import { Chat, ChatSchema } from 'src/chat/chat.schema'
import { User, UserSchema } from 'src/user/user.schema'
import { Message, MessageSchema } from './message.schema'
import { MessageService } from './message.service'

@Module({
	providers: [MessageService],
	exports: [MessageService],
	imports: [
		MongooseModule.forFeature([
			{ name: Chat.name, schema: ChatSchema },
			{ name: User.name, schema: UserSchema },
			{ name: Advertisement.name, schema: AdvertisementSchema },
			{ name: Message.name, schema: MessageSchema },
		]),
		forwardRef(() => ChatModule),
	],
})
export class MessageModule {}
