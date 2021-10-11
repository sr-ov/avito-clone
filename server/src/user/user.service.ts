import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'

import { UserDto } from './dto/user.dto'
import { UpdateUser } from './dto/updateUser.dto'
import { User, UserDocument } from './user.schema'
import { FileService } from 'src/file/file.service'
import {
    Advertisement,
    AdvertisementDocument,
} from '../advertisement/advertisement.schema'
import { AdvertisementService } from 'src/advertisement/advertisement.service'
import { IUserToken } from './user.interface'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Advertisement.name)
        private advertisementModel: Model<AdvertisementDocument>,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,
        private readonly adService: AdvertisementService
    ) {}

    async registration(dto: UserDto): Promise<{ token: string }> {
        if (await this.userModel.findOne({ email: dto.email })) {
            throw new BadRequestException(
                'Пользователь с таким email уже зарегистрирован'
            )
        }

        return this.create(dto)
    }

    async create(dto: UserDto): Promise<{ token: string }> {
        const user = await this.userModel.create(dto)

        return this.generateToken(user)
    }

    async validateUser({ email, password }: UserDto): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new BadRequestException(
                'Пользователь с таким email не найден'
            )
        }

        if (!this.checkPassword(password, user.password)) {
            throw new BadRequestException('Неверный пароль')
        }

        return user
    }

    async login(dto: UserDto): Promise<{ token: string }> {
        const user = await this.validateUser(dto)

        return this.generateToken(user)
    }

    async update(dto: UpdateUser, userId: string): Promise<IUserToken> {
        const user = await this.userModel.findById(userId)

        if (dto.password && dto.oldPassword) {
            if (!this.checkPassword(dto.oldPassword, user.password)) {
                throw new BadRequestException('Неверный пароль')
            }
        } else if (
            (!dto.password && dto.oldPassword) ||
            (dto.password && !dto.oldPassword)
        ) {
            throw new BadRequestException('Введите оба пароля')
        }

        const newUser = await this.userModel.findByIdAndUpdate(userId, dto, {
            new: true,
        })

        return this.generateToken(newUser)
    }

    checkPassword(password: string, hashPassword: string): boolean {
        return bcrypt.compareSync(password, hashPassword)
    }

    async checkAuthUser(dto: UserDto): Promise<IUserToken> {
        const user = await this.userModel.findOne({
            email: dto.email,
        })

        return this.generateToken(user)
    }

    async generateToken(user: UserDocument): Promise<IUserToken> {
        return {
            token: this.jwtService.sign(
                (({ password, ...u }) => u)(user.toObject())
            ),
        }
    }

    async remove(email: string) {
        const user = await this.userModel.findOne({ email })
        await this.advertisementModel.deleteMany({ userId: user._id })

        this.fileService.removeFile([String(user._id)])

        return await user.delete()
    }
}
