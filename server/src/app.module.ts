import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserModule } from './user/user.module'
import { CategoryModule } from './category/category.module'
import { AdvertisementModule } from './advertisement/advertisement.module'
import { ConfigModule } from '@nestjs/config'
import { FileModule } from './file/file.module'
import { ChatModule } from './chat/chat.module'
import { MessageModule } from './message/message.module'

const { DB_CONNECTION_STRING = 'mongodb://localhost/avito-clone' } = process.env

@Module({
    imports: [
        MongooseModule.forRoot(DB_CONNECTION_STRING, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        UserModule,
        CategoryModule,
        AdvertisementModule,
        FileModule,
        ChatModule,
        MessageModule,
    ],
})
export class AppModule {}
