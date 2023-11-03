import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { jwtConstants } from './constantes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findUserByUserName(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
      }),
      user: user.toDto(),
    };
  }

  async verifyToken(token) {
    try {
      await this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      return {
        access_token: token,
      };
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedException();
    }
  }
}
