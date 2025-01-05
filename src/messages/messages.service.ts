import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { objectId } from 'src/util';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany({
      include: {
        roomProfile: {
          include: {
            profile: true,
            room: true,
          },
        },
      },
    });
  }

  async getMessageById(id: string): Promise<Message> {
    return this.prisma.message.findFirst({
      where: { id },
      include: {
        roomProfile: {
          include: {
            profile: true,
            room: true,
          },
        },
      },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        id: objectId(),
        text: createMessageDto.text,
        roomProfileId: createMessageDto.roomUserId,
      },
      include: {
        roomProfile: {
          include: {
            profile: true,
            room: true,
          },
        },
      },
    });
  }

  getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        roomProfile: {
          roomId,
        },
      },
      include: {
        roomProfile: {
          include: {
            profile: true,
            room: true,
          },
        },
      },
    });
  }

  async deleteMessage(id: string): Promise<Message> {
    return this.prisma.message.delete({
      where: { id },
      include: {
        roomProfile: {
          include: {
            profile: true,
            room: true,
          },
        },
      },
    });
  }
}
