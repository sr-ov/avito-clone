import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CategoryController } from './category.controller'
import { Category, CategorySchema } from './category.schema'
import { CategoryService } from './category.service'

@Module({
    controllers: [CategoryController],
    providers: [CategoryService],
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
        ]),
    ],
})
export class CategoryModule {}
