import { IsMongoId, IsString } from 'class-validator'

export class MessageDto {
    @IsString()
    readonly msg: string

    @IsString()
    readonly room: string

    @IsMongoId()
    readonly userId: string

    @IsMongoId()
    readonly chatId: string
}
