import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FileModule } from './../file/file.module'
import { UserModule } from './../user/user.module'
import { JwtAuthGuard } from 'src/user/jwt-auth.guard'
import { AdvertisementController } from './advertisement.controller'
import { Advertisement, AdvertisementSchema } from './advertisement.schema'
import { AdvertisementService } from './advertisement.service'
import { User, UserSchema } from 'src/user/user.schema'

@Module({
	controllers: [AdvertisementController],
	providers: [AdvertisementService],
	imports: [
		MongooseModule.forFeature([
			{ name: Advertisement.name, schema: AdvertisementSchema },
			{ name: User.name, schema: UserSchema },
		]),
		JwtAuthGuard,
		forwardRef(() => UserModule),
		FileModule,
	],
})
export class AdvertisementModule {}
