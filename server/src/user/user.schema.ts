import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { Advertisement } from 'src/advertisement/advertisement.schema'

export type UserDocument = User & Document

@Schema()
export class User {
	_id: string

	@Prop({ default: '' })
	name: string

	@Prop({ unique: true })
	email: string

	@Prop({
		required: true,
		set: (pass: string): string => bcrypt.hashSync(pass, 5),
	})
	password: string

	@Prop({ default: '' })
	phone: string

	@Prop({ default: '' })
	address: string

	@Prop({ default: '' })
	avatar: string

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Advertisement' }], default: [] })
	advertisements: Advertisement[]

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Advertisement' }], default: [] })
	favorites: Advertisement[]
}

export const UserSchema = SchemaFactory.createForClass(User)
