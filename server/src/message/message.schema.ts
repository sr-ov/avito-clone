import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ timestamps: true })
export class Message {
	_id: string

	@Prop({ required: true })
	userId: Types.ObjectId

	@Prop({ required: true })
	chatId: Types.ObjectId

	@Prop({ required: true })
	message: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
