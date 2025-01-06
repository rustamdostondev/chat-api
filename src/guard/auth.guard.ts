import { ACCESS_TOKEN_DOCTOR, ACCESS_TOKEN_USER } from '@env';
import { PrismaService } from '@modules/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      // Verify token and determine user type
      const userType = await this.verifyTokenAndSetUser(request, token);

      // Ensure profile exists for the user/doctor
      await this.ensureProfileExists(request, userType);

      request['token'] = token;
      return true;
    } catch {
      return false;
    }
  }

  private async verifyTokenAndSetUser(
    request: any,
    token: string,
  ): Promise<'user' | 'doctor'> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_TOKEN_USER,
      });
      request['user'] = { ...payload, userType: 'user' };
      return 'user';
    } catch {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_TOKEN_DOCTOR,
      });
      request['user'] = { ...payload, userType: 'doctor' };
      return 'doctor';
    }
  }

  private async ensureProfileExists(request: any, userType: 'user' | 'doctor') {
    const { id } = request['user'];
    const profileKey = userType === 'user' ? 'userId' : 'doctorId';

    let profile = await this.prisma.profile.findFirst({
      where: {
        [profileKey]: id,
        isDeleted: false,
      },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          id,
          [profileKey]: id,
          createdBy: id,
        },
      });
    }

    request['user'] = { ...profile, userType };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token.trim() : undefined;
  }
}
