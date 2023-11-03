import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMediaVO } from 'src/media/valueobjects/media.vo';
import { MediaService } from 'src/media/media.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('media')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  getMedia() {
    return this.mediaService.getMedia();
  }

  @Get(':id')
  findMediaById(@Param('id', ParseIntPipe) idM: number) {
    return this.mediaService.findMediaById(idM);
  }

  @Post('')
  @UsePipes(ValidationPipe)
  createMedia(@Req() req, @Body() createMediaDto: CreateMediaVO) {
    return this.mediaService.createMedia(createMediaDto, req.user);
  }
}
