import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomNotFound implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const room = await this.prisma.room.findFirst({
      where: {
        id: id,
      },
    });
    if (!room) {
      throw new NotFoundException(`Room with id "${id}" not found`);
    }
    next();
  }
}
