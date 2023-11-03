import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginVO } from './valueobjects/login.dto';
import { UserDTO } from 'src/users/dto/user.dto';
import { CreateUserVO } from '../users/valueobjects/user.vo';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {UpdateUserVO} from "../users/valueobjects/user-update.vo";

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiBody({ type: LoginVO })
  async signIn(@Body() signInDto: LoginVO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('verify')
  @Public()
  async verifyToken(@Query('token') token: string) {
    return await this.authService.verifyToken(token);
  }

  @Get('profile')
  @ApiResponse({ type: UserDTO })
  getProfile(@Request() req): Promise<UserDTO> {
    return req.user;
  }

  @Put('profile')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  updateUser(
    @Request() req,
    @Body() createUserDto: UpdateUserVO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateUserById(req.user.id, createUserDto, file);
  }
}
