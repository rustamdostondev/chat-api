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

    const secret = '5b012ae8c559e34373d75bca2d96d82ea238d370';
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      request['user'] = payload;
    } catch {
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: secret + 'doctor',
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
