import { IsMongoId } from 'class-validator'

export class AdToFavoriteDto {
	@IsMongoId()
	readonly id: string
}
