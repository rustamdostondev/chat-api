import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { objectId } from '@utils';
import { CustomApiResponse } from '@common/utils/api-response.util';
import { IApiResponse } from '@common/interfaces/api-response.interface';
import { IRoom } from './interfaces';
import { IPagination } from '@common/interfaces/pagination.interface';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRooms(payload: IPagination): Promise<IApiResponse<Room[]>> {
    const { limit, page, search, sortBy, order } = payload;

    const select = {
      id: true,
      name: true,
    };

    // Build the search condition
    const where = search
      ? {
          isDeleted: false,
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              } as unknown,
            },
            {
              academicYear: {
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
      this.prisma.room.findMany({
        take: limit,
        skip: limit * (page - 1),
        where,
        orderBy: sort,
        include: {
          profiles: true,
          RoomProfile: {
            include: {
              profile: true,
            },
          },
        },
      }),
      this.prisma.room.count({ where }),
    ]);

    // Return the paginated response
    return CustomApiResponse.paginated(results, page, limit, total);
  }

  async getRoomById(id: string): Promise<IApiResponse<Room>> {
    const exist = await this.prisma.room.findFirst({
      where: { id, isDeleted: false },
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!exist) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return CustomApiResponse.success(exist);
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    user: any,
  ): Promise<IApiResponse<IRoom>> {
    const data = await this.prisma.room.create({
      data: {
        id: objectId(),
        name: createRoomDto.name,
        createdBy: user.id,
      },
    });

    return CustomApiResponse.success(data);
  }

  async updateRoom(
    id: string,
    updateRoomDto: UpdateRoomDto,
    user: any,
  ): Promise<IApiResponse<Room>> {
    const data: Partial<Room> = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    const exist = await this.prisma.room.findFirst({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    if (updateRoomDto.name) data.name = updateRoomDto.name;

    const updatedRoom = await this.prisma.room.update({
      where: { id },
      data,
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });
    return CustomApiResponse.success(updatedRoom);
  }

  async deleteRoom(id: string, user: any): Promise<IApiResponse<Room>> {
    const existingRoom = await this.prisma.room.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    const room = await this.prisma.room.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
    });
    return CustomApiResponse.success(room);
  }
}
