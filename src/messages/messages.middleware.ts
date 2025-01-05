import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageNotFound implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const message = await this.prisma.message.findFirst({
      where: {
        id: id,
      },
    });
    if (!message) {
      throw new NotFoundException(`Message with id "${id}" not found`);
    }
    console.log(message);
    next();
  }
}
