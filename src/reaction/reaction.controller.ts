import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from 'src/reaction/reaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('reactions')
@ApiTags('reactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get()
  getreaction() {
    return this.reactionService.getreaction();
  }

  @Get(':id')
  findReactionById(@Param('id', ParseIntPipe) idR: number) {
    return this.reactionService.findReactionById(idR);
  }
}
