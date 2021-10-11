import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

const stringToObjectId = (id: string) => Types.ObjectId(id)

export type AdvertisementDocument = Advertisement & Document

@Schema({ timestamps: true })
export class Advertisement {
    _id: string

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    address: string

    @Prop({ required: true })
    phone: string

    @Prop({ default: [] })
    images: string[]

    @Prop({
        type: Types.ObjectId,
        ref: 'Category',
        required: true,
        set: stringToObjectId,
    })
    categoryId: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        set: stringToObjectId,
    })
    userId: Types.ObjectId

    @Prop({ required: true })
    communicationMethod: number

    @Prop({ default: 0 })
    views: number

    @Prop({ default: 0 })
    inFavorite: number
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement)
