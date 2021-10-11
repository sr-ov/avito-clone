import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator'

export class UpdateUser {
    @IsEmail({}, { message: 'некорректный email' })
    readonly email: string

    @IsString()
    @MinLength(6, { message: 'пароль не меньше 6 символов' })
    @IsOptional()
    readonly password?: string

    @IsString()
    @MinLength(6, { message: 'пароль не меньше 6 символов' })
    @IsOptional()
    readonly oldPassword?: string

    @IsString()
    readonly name: string

    @IsString()
    @Matches(/^\+7\s\(\d{3}\)\s\d{2}-\d{2}-\d{2}$/)
    readonly phone: string

    @IsString()
    readonly address: string

    @IsString()
    @IsOptional()
    readonly rmAvatarPath?: string

    @IsString()
    avatar: string
}
