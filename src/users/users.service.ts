import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { Repository } from 'typeorm';
import { CreateUserVO } from './valueobjects/user.vo';
import { UserDTO } from './dto/user.dto';
import { UserStatus } from './valueobjects/user-status';
import { CreateMediaVO } from '../media/valueobjects/media.vo';
import { createWriteStream } from 'fs';
import { MediaService } from '../media/media.service';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { UpdateUserVO } from './valueobjects/user-update.vo';
import { Role } from '../authorization/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  findUserByUserName(username: any): Promise<User> {
    return this.userRepository.findOneBy({ email: username });
  }

  public async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDTO>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.activity', 'activity')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .where('user.role != :role', { role: Role.Admin });

    queryBuilder
      .orderBy(
        'user.' + (pageOptionsDto.orderBy || 'created_at'),
        pageOptionsDto.order,
      )
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(
      entities.map((user) => user.toDto(true)),
      pageMetaDto,
    );
  }

  async createUser(createUserDto: CreateUserVO, file: Express.Multer.File) {
    if (
      await this.userRepository.exist({ where: { email: createUserDto.email } })
    ) {
      throw new ConflictException('User already exists with the same email');
    }

    if (!file) {
      throw new BadRequestException('Profile picture is required');
    }

    const newUser = await this.userRepository.save({ ...createUserDto });

    const filePath = 'uploads/' + file.originalname;
    newUser.profilePicture = await this.mediaService.createMedia(
      new CreateMediaVO(filePath, file.mimetype),
      newUser,
    );
    const ws = createWriteStream(filePath);
    ws.write(file.buffer);
    ws.close();
    await this.userRepository.save(newUser);
    return this.findUserById(newUser.id);
  }

  async deleteUser(userId: number) {
    await this.userRepository.delete(userId);
  }

  async findUserById(id): Promise<UserDTO> {
    const user = await this.getUserById(id);
    return user.toDto(true);
  }

  async banUser(id): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    user.status = UserStatus.BANNED;
    await this.userRepository.save(user);
  }

  async activateUser(id): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    user.status = UserStatus.ACTIVE;
    await this.userRepository.save(user);
  }

  async disableUser(id): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    user.status = UserStatus.DISABLED;
    await this.userRepository.save(user);
  }

  async updateUserById(
    id: number,
    createUser: UpdateUserVO,
    file: Express.Multer.File,
  ) {
    const user = await this.getUserById(id);
    const updatedUser = await this.updateUser(user, createUser, file);
    return updatedUser.toDto(true);
  }

  async updateUser(
    user: User,
    createUser: UpdateUserVO,
    file: Express.Multer.File,
  ) {
    user.firstName = createUser.firstName || user.firstName;
    user.lastName = createUser.lastName || user.lastName;
    user.username = createUser.username || user.username;
    if (file) {
      const filePath = 'uploads/' + file.originalname;
      await this.mediaService.deleteMedia(user.profilePicture.idM);
      user.profilePicture = await this.mediaService.createMedia(
        new CreateMediaVO(filePath, file.mimetype),
        user,
      );
      const ws = createWriteStream(filePath);
      ws.write(file.buffer);
      ws.close();
    }
    return await this.userRepository.save(user, { reload: true });
  }

  private async getUserById(id): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profilePicture: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
