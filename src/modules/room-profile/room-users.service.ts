import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomProfile } from '@prisma/client';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { objectId } from '@utils';
import { CustomApiResponse } from '@common/utils/api-response.util';
import { IApiResponse } from '@common/interfaces/api-response.interface';

@Injectable()
export class RoomProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomProfiles(): Promise<IApiResponse<RoomProfile[]>> {
    const exit = await this.prisma.roomProfile.findMany({
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });
    return CustomApiResponse.success(exit);
  }

  async getRoomProfileById(id: string): Promise<IApiResponse<RoomProfile>> {
    const exit = await this.prisma.roomProfile.findFirst({
      where: { id, isDeleted: false },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });

    if (!exit) {
      throw new NotFoundException(`RoomProfile with ID ${id} not found`);
    }

    return CustomApiResponse.success(exit);
  }

  async createRoomProfile(
    createRoomUserDto: CreateRoomUserDto,
    user: any,
  ): Promise<IApiResponse<RoomProfile>> {
    const data = await this.prisma.roomProfile.create({
      data: {
        id: objectId(),
        profileId: createRoomUserDto.profileId,
        roomId: createRoomUserDto.roomId,

        createdAt: new Date(),
        createdBy: user.id,
      },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });

    return CustomApiResponse.success(data);
  }

  async deleteRoomProfile(
    id: string,
    user: any,
  ): Promise<IApiResponse<RoomProfile>> {
    const exist = await this.prisma.roomProfile.findFirst({
      where: { id, isDeleted: false },
    });

    if (!exist) {
      throw new NotFoundException(`RoomProfile with ID ${id} not found`);
    }

    const data = await this.prisma.roomProfile.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user.id,
      },
      include: {
        profile: true,
        room: true,
        messages: true,
      },
    });

    return CustomApiResponse.success(data);
  }
}
