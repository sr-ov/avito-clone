import { IsMongoId } from 'class-validator'

export class ChatDto {
    @IsMongoId()
    readonly userId: string

    @IsMongoId()
    readonly ownerId: string
}
