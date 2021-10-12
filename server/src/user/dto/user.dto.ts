import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class UserDto {
    @IsEmail({}, { message: 'некорректный email' })
    readonly email: string

    @IsString()
    @MinLength(6, { message: 'пароль не меньше 6 символов' })
    readonly password: string
}
