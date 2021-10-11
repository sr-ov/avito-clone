import { IsMongoId } from 'class-validator'
import { AdvertisementDto } from './advertisement.dto'

export class UpdateAdDto extends AdvertisementDto {
    @IsMongoId()
    readonly adId: string
}
