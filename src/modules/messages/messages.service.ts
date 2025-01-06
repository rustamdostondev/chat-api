import { Injectable, NotFoundException } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { objectId } from '@utils';
import { CustomApiResponse } from '@common/utils/api-response.util';
import { IApiResponse } from '@common/interfaces/api-response.interface';
import { IPagination } from '@common/interfaces/pagination.interface';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(payload: IPagination): Promise<IApiResponse<Message[]>> {
    const { limit, page, search, sortBy, order } = payload;

    const select = {
      id: true,
      text: true,
    };

    // Build the search condition
    const where = search
      ? {
          isDeleted: false,
          OR: [
            {
              text: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              } as unknown,
            },
          ],
        }
      : {};

    const sort =
      Object.keys(select).includes(sortBy) && sortBy ? { [sortBy]: order } : {};

    // Fetch paginated rooms
    const [results, total] = await Promise.all([
      this.prisma.message.findMany({
        take: limit,
        skip: limit * (page - 1),
        where,
        orderBy: sort,
        include: {
          roomProfile: {
            include: {
              profile: true,
              room: true,
            },
          },
        },
      }),
      this.prisma.message.count({ where }),
    ]);

    // Return the paginated response
    return CustomApiResponse.paginated(results, page, limit, total);
  }

  async getMessageById(id: string): Promise<IApiResponse<Message>> {
    const exist = await this.prisma.message.findFirst({
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

    if (!exist) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return CustomApiResponse.success(exist);
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    user: any,
  ): Promise<IApiResponse<Message>> {
    let roomProfile: any;

    if (createMessageDto.roomProfileId) {
      let exist = await this.prisma.roomProfile.findFirst({
        where: {
          id: createMessageDto.roomProfileId,
          isDeleted: false,
        },
      });

      if (!exist) {
        throw new NotFoundException(
          `RoomProfile with id "${createMessageDto.roomProfileId}" not found`,
        );
      }

      roomProfile = exist;
    } else {
      const createRoom = await this.prisma.room.create({
        data: {
          id: objectId(),
          name: 'General',
          createdAt: new Date(),
          createdBy: user.id,
        },
      });

      roomProfile = await this.prisma.roomProfile.create({
        data: {
          id: objectId(),
          profileId: createMessageDto.roomProfileId,
          roomId: createRoom.id,
          createdAt: new Date(),
          createdBy: user.id,
        },
      });
    }

    const data = await this.prisma.message.create({
      data: {
        id: objectId(),
        text: createMessageDto.text,
        roomProfileId: roomProfile.id,
        createdAt: new Date(),
        createdBy: user.id,
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

    return CustomApiResponse.success(data);
  }

  async getMessagesByRoom(roomId: string): Promise<IApiResponse<Message[]>> {
    const exist = await this.prisma.room.findFirst({
      where: { id: roomId, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const exit = await this.prisma.message.findMany({
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

    return CustomApiResponse.success(exit);
  }

  async deleteMessage(id: string, user: any): Promise<IApiResponse<Message>> {
    const exit = await this.prisma.message.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!exit) {
      throw new NotFoundException(`Message with id "${id}" not found`);
    }

    const message = await this.prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });

    return CustomApiResponse.success(message);
  }
}
