import { Injectable } from '@nestjs/common';
import { RoomProfile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { objectId } from 'src/util';

@Injectable()
export class RoomProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomProfiles(): Promise<RoomProfile[]> {
    return this.prisma.roomProfile.findMany({
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });
  }

  async getRoomProfileById(id: string): Promise<RoomProfile> {
    return this.prisma.roomProfile.findFirst({
      where: { id },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });
  }

  async createRoomProfile(
    createRoomUserDto: CreateRoomUserDto,
  ): Promise<RoomProfile> {
    return this.prisma.roomProfile.create({
      data: {
        id: objectId(),
        profileId: createRoomUserDto.profileId,
        roomId: createRoomUserDto.roomId,
      },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });
  }

  async deleteRoomProfile(id: string): Promise<RoomProfile> {
    return this.prisma.roomProfile.delete({
      where: { id },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });
  }
}
