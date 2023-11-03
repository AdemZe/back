import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../typeorm/user.entity';
import { Role } from '../../authorization/role.enum';
import { UserActivity } from './user-activity';

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  activity: UserActivity;

  @ApiProperty()
  createdAt: Date;

  constructor(user: User, full = false) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.profilePicture = user.profilePicture?.url;
    this.role = user.role;
    this.createdAt = user.created_at;
    if (full) {
      this.email = user.email;
    }
    if (user.activity) {
      this.activity = new UserActivity(user.activity);
    }
  }
}
