import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CategoryDocument = Category & Document

const CATEGORIES: readonly string[] = [
	'transport',
	'realEstate',
	'services',
	'personalBelongings',
]

const CATEGORIES_RU: readonly string[] = [
	'Транспорт',
	'Недвижимость',
	'Услуги',
	'Личные вещи',
]

@Schema()
export class Category {
	@Prop({ required: true, enum: CATEGORIES })
	name: string

	@Prop({ required: true, enum: CATEGORIES_RU })
	nameRu: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
