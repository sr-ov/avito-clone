import { AdvertisementDocument, Advertisement } from './advertisement.schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { FileService } from './../file/file.service'
import { AdvertisementDto } from './dto/advertisement.dto'
import { User, UserDocument } from 'src/user/user.schema'
import { UpdateAdDto } from './dto/updateAdvertisement.dto'
import { AdsRes, PaginationQuery } from './advertisement.interface'

@Injectable()
export class AdvertisementService {
    constructor(
        @InjectModel(Advertisement.name)
        private advertisementModel: Model<AdvertisementDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private fileService: FileService
    ) {}

    async create(
        dto: AdvertisementDto,
        userId: string
    ): Promise<Advertisement> {
        const user = await this.userModel.findById(userId)

        const advertisement = await this.advertisementModel.create({
            ...dto,
            userId: user._id,
        })

        user.advertisements.push(advertisement._id)
        await user.save()

        return await advertisement.populate('userId').execPopulate()
    }

    async update(dto: UpdateAdDto): Promise<Advertisement> {
        return this.advertisementModel
            .findByIdAndUpdate(dto.adId, dto, {
                new: true,
            })
            .populate('userId')
    }

    async toFavorite(id: string, email: string): Promise<Advertisement[]> {
        const user = await this.userModel.findOne({ email })
        const ad = await this.advertisementModel.findById(id)
        const idx = user.favorites.findIndex((adId) => String(adId) === id)

        if (idx > -1) {
            ad.inFavorite -= 1
            user.favorites.splice(idx, 1)
        } else {
            ad.inFavorite += 1
            user.favorites.push(ad._id)
        }

        await Promise.all([ad.save(), user.save()])

        return user.favorites
    }

    async remove(adId: string, userId: string): Promise<AdsRes> {
        const adToRemoveFromUser = this.userModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { advertisements: adId } }
        )

        const ad = await this.advertisementModel.findById(adId)
        await Promise.all([adToRemoveFromUser, ad.delete()])

        return this.getAll()
    }

    async getOne(id: string): Promise<Advertisement> {
        return this.advertisementModel
            .findById(id)
            .populate('userId', 'email name avatar advarisement')
    }

    async getAllByUser(userId: string): Promise<Advertisement[]> {
        const user = await this.userModel
            .findById(Types.ObjectId(userId))
            .populate('advertisements')

        return user.advertisements
    }

    async pagination(
        dbQuery: unknown,
        query: PaginationQuery
    ): Promise<AdsRes> {
        const { limit = 6, curPage = 0 } = query ?? {}

        const ads = this.advertisementModel
            .find(dbQuery)
            .select(
                '-communicationMethod -views -inFavorite -description -updatedAt -__v'
            )
            .skip(limit * curPage)
            .limit(Number(limit))

        const countAds = this.advertisementModel.estimatedDocumentCount()

        return Promise.all([ads, countAds])
    }

    async getAll(
        categoryId?: string,
        query?: PaginationQuery
    ): Promise<AdsRes> {
        return this.pagination(
            categoryId && { categoryId: Types.ObjectId(categoryId) },
            query
        )
    }

    async getAllBySearch(
        search: string,
        query: PaginationQuery
    ): Promise<AdsRes> {
        return this.pagination(
            { name: { $regex: search, $options: 'i' } },
            query
        )
    }

    async getFavorites(userId: string): Promise<Advertisement[]> {
        const user = await this.userModel
            .findOne({ _id: userId })
            .populate('favorites')

        return user.favorites
    }
}
