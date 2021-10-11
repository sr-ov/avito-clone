import { IsMongoId, IsNumber, IsString, Matches } from 'class-validator'

export class AdvertisementDto {
    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

    // @IsNumber()
    readonly price: number

    @IsString()
    readonly address: string

    @IsString({ each: true })
    readonly images: string[]

    @IsMongoId()
    readonly categoryId: string

    @IsString()
    @Matches(/^\+7\s\(\d{3}\)\s\d{2}-\d{2}-\d{2}$/)
    readonly phone: string

    // @IsNumber()
    readonly communicationMethod: number
}
