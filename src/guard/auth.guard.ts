import { ACCESS_TOKEN_DOCTOR, ACCESS_TOKEN_USER } from '@env';
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
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: ACCESS_TOKEN_USER,
      });

      request['user'] = payload;
    } catch {
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: ACCESS_TOKEN_DOCTOR,
        });
        request['user'] = payload;
      } catch {
        // return false;
      }
    }
    request['token'] = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token.trim() : undefined;
  }
}
