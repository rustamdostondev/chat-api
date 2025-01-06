import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '@modules/prisma/prisma.service';

@Injectable()
export class RoomProfileNotFound implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const { id } = req.params;
    const roomProfile = await this.prisma.roomProfile.findFirst({
      where: {
        id: id,
      },
    });
    if (!roomProfile) {
      throw new NotFoundException(`RoomProfile with id "${id}" not found`);
    }
    console.log(roomProfile);
    next();
  }
}
