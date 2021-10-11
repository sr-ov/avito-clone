import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
    Header,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/user/jwt-auth.guard'
import { Chat } from './chat.schema'
import { ChatService } from './chat.service'
import { ChatDto } from './dto/chat.dto'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('one/:id')
    getOne(
        @Param('id') id: string,
        @Body() dto: ChatDto,
        @Request() req
    ): Promise<Chat> {
        return this.chatService.getOne(id, dto, req.user._id)
    }

    @Header('x-flag', 'chats')
    @Get('all')
    getAll(@Request() req): Promise<Chat[]> {
        return this.chatService.getAll(req.user._id)
    }

    @Get('remove/:chatId')
    remove(@Param('chatId') chatId: string, @Request() req): Promise<Chat[]> {
        return this.chatService.remove(chatId, req.user._id)
    }
}
