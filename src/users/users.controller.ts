import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserVO } from 'src/users/valueobjects/user.vo';
import { UsersService } from 'src/users/users.service';
import { AuthGuard, Public } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/roles.decorator';
import { Role } from '../authorization/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import {UpdateUserVO} from "./valueobjects/user-update.vo";

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Public()
  getUsers(@Query() pageOptionsDto: PageOptionsDto) {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Put(':id/ban')
  @Roles(Role.Admin)
  banUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.banUser(id);
  }

  @Put(':id/activate')
  @Roles(Role.Admin)
  activateUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.activateUser(id);
  }

  @Put(':id/disable')
  @Roles(Role.Admin)
  disableUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.disableUser(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  @Roles(Role.Admin)
  async createUser(
    @Body() createUserDto: CreateUserVO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createUser(createUserDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  @Roles(Role.Admin)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserDto: UpdateUserVO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUserById(id, createUserDto, file);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @Roles(Role.Admin)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
