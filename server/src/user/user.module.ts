import { FileModule } from './../file/file.module'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'

import { UserController } from './user.controller'
import { User, UserSchema } from './user.schema'
import { UserService } from './user.service'
import { AdvertisementModule } from 'src/advertisement/advertisement.module'
import {
	Advertisement,
	AdvertisementSchema,
} from 'src/advertisement/advertisement.schema'
import { AdvertisementService } from 'src/advertisement/advertisement.service'

@Module({
	controllers: [UserController],
	providers: [UserService, JwtStrategy, AdvertisementService],
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Advertisement.name, schema: AdvertisementSchema },
		]),
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET ?? 'SECRET',
			signOptions: {
				expiresIn: '24h',
			},
		}),
		forwardRef(() => AdvertisementModule),
		FileModule,
	],
})
export class UserModule {}
