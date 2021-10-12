import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChatDocument = Chat & Document

@Schema({ timestamps: true })
export class Chat {
    _id: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId

    @Prop({ required: true })
    room: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    owner: Types.ObjectId

    @Prop({ required: true, type: Types.ObjectId, ref: 'Advertisement' })
    ad: Types.ObjectId

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'Message' }],
        default: [],
    })
    messages: Types.ObjectId[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
