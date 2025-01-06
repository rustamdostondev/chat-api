import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { objectId } from '@utils';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRooms(): Promise<Room[]> {
    return this.prisma.room.findMany({
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getRoomById(id: string): Promise<Room> {
    return this.prisma.room.findFirst({
      where: { id },
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({
      data: {
        id: objectId(),
        name: createRoomDto.name,
      },
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const data: Partial<Room> = {};
    if (updateRoomDto.name) data.name = updateRoomDto.name;

    return this.prisma.room.update({
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
  }

  async deleteRoom(id: string): Promise<Room> {
    return this.prisma.room.delete({
      where: { id },
      include: {
        profiles: true,
        RoomProfile: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
