import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getcomment() {
    return this.commentService.getcomment();
  }

  @Get(':id')
  findUsersById(@Param('id', ParseIntPipe) idC: number) {
    return this.commentService.findcommentById(idC);
  }
}
