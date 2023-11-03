import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateactualityVO } from 'src/actuality/valueobjects/actuality.vo';
import { ActualityService } from 'src/actuality/actuality.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActualityDTO } from './dto/actuality.dto';
import { CreatecommentVO } from 'src/comment/valueobjects/comment.vo';
import { CreateReactionVO } from 'src/reaction/valueobjects/reaction.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';

@Controller('actualities')
@ApiTags('actualities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ActualityController {
  constructor(private readonly actualityService: ActualityService) {}

  @Get()
  @ApiResponse({ type: ActualityDTO, isArray: true })
  getActuality(): Promise<Array<ActualityDTO>> {
    return this.actualityService.getActuality();
  }

  @Get(':id')
  findActualityById(@Param('id', ParseIntPipe) idA: number, @Req() req) {
    return this.actualityService.findActualityById(idA, req.user);
  }

  @Delete(':id')
  @ApiCreatedResponse()
  @Roles(Role.Admin)
  deleteActualityById(@Param('id', ParseIntPipe) idA: number) {
    return this.actualityService.deleteActualityById(idA);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateactualityVO })
  @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  createActuality(
    @Req() req,
    @Body() createActuality: CreateactualityVO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.actualityService.createActuality(
      createActuality,
      file,
      req.user,
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateactualityVO })
  @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  updateActuality(
    @Req() req,
    @Param('id') id,
    @Body() createActuality: CreateactualityVO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.actualityService.updateActuality(
      id,
      createActuality,
      file,
      req.user,
    );
  }

  @Post(':id/comments')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: CreatecommentVO })
  @UsePipes(ValidationPipe)
  async actualityComment(
    @Req() req,
    @Param('id') id,
    @Body() createCommentVO: CreatecommentVO,
  ) {
    await this.actualityService.createActualityComment(
      id,
      req.user,
      createCommentVO,
    );
  }

  @Post(':id/reactions')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: CreateReactionVO })
  @UsePipes(ValidationPipe)
  async actualityReaction(
    @Req() req,
    @Param('id') id,
    @Body() createReactionVO: CreateReactionVO,
  ) {
    await this.actualityService.createActualityReaction(
      id,
      req.user,
      createReactionVO,
    );
  }
}
