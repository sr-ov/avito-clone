import {
    Body,
    Controller,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Request,
    Get,
    Param,
    Patch,
    Query,
    Delete,
    Header,
    UseInterceptors,
} from '@nestjs/common'
import { Request as Req } from 'express'

import { AdvertisementService } from './advertisement.service'
import { AdvertisementDto } from './dto/advertisement.dto'
import { AdToFavoriteDto } from './dto/adToFavorite.dto'
import { JwtAuthGuard } from 'src/user/jwt-auth.guard'
import { UpdateAdDto } from './dto/updateAdvertisement.dto'
import { Advertisement } from './advertisement.schema'
import { AdsRes, PaginationQuery } from './advertisement.interface'
import { AddTotalCountAdsInterceptor } from './advertisement.interceptor'

@Controller('advertisement')
export class AdvertisementController {
    constructor(private advertisementService: AdvertisementService) {}

    @Get('search')
    getAllBySearch(
        @Query('search') search: string,
        @Query() query: PaginationQuery
    ): Promise<AdsRes> {
        return this.advertisementService.getAllBySearch(search, query)
    }

    @Header('x-flag', 'ads')
    @UseGuards(JwtAuthGuard)
    @Get('my-ads')
    getAllByUser(@Request() req): Promise<Advertisement[]> {
        return this.advertisementService.getAllByUser(req.user._id)
    }

    @Header('x-flag', 'ads')
    @UseGuards(JwtAuthGuard)
    @Get('favorites')
    getFavorites(@Request() req: any): Promise<Advertisement[]> {
        return this.advertisementService.getFavorites(req.user._id)
    }

    @Header('x-flag', 'ad')
    @Get('one/:id')
    getOne(@Param('id') id: string): Promise<Advertisement> {
        return this.advertisementService.getOne(id)
    }

    @UseInterceptors(AddTotalCountAdsInterceptor)
    @Header('x-flag', 'ads')
    @Get(':category?')
    getAll(
        @Param('category') categoryId: string,
        @Query() query: PaginationQuery
    ): Promise<AdsRes> {
        return this.advertisementService.getAll(categoryId, query)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/:adId')
    remove(@Param('adId') adId: string, @Request() req): Promise<AdsRes> {
        return this.advertisementService.remove(adId, req.user._id)
    }

    @Header('x-flag', 'ad')
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(
        @Body() dto: AdvertisementDto,
        @Request() req
    ): Promise<Advertisement> {
        return this.advertisementService.create(dto, req.user._id)
    }

    @Header('x-flag', 'ad')
    @UseGuards(JwtAuthGuard)
    @Patch('update')
    update(@Body() dto: UpdateAdDto): Promise<Advertisement> {
        return this.advertisementService.update(dto)
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('to-favorite')
    toFavorite(
        @Body() dto: AdToFavoriteDto,
        @Request() req: any
    ): Promise<Advertisement[]> {
        return this.advertisementService.toFavorite(dto.id, req.user.email)
    }
}
