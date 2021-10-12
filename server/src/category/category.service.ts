import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Category, CategoryDocument } from './category.schema'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
    ) {}

    async create(dto: CategoryDto): Promise<Category> {
        return this.categoryModel.create(dto)
    }

    async getAll(): Promise<Category[]> {
        return this.categoryModel.find().select(['-__v', '-advertisements'])
    }
}
