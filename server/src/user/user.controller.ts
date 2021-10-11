import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    Get,
    UseGuards,
    Request,
    Patch,
    Delete,
} from '@nestjs/common'

import { UpdateUser } from './dto/updateUser.dto'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UsePipes(new ValidationPipe())
    @Post('registration')
    registration(@Body() dto: UserDto) {
        return this.userService.registration(dto)
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    login(@Body() dto: UserDto) {
        return this.userService.login(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('check-auth-user')
    checkAuthUser(@Request() req: any) {
        return this.userService.checkAuthUser(req.user)
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Patch('update-user')
    update(@Body() dto: UpdateUser, @Request() req: any) {
        return this.userService.update(dto, req.user._id)
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Delete('remove-user')
    remove(@Request() req: any) {
        return this.userService.remove(req.user.email)
    }
}
