import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { RoomProfile } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoomProfilesService } from './room-users.service';

@ApiTags('room-profiles')
@Controller('room-profiles')
@ApiBearerAuth('authorization')
export class RoomProfilesController {
  constructor(private readonly roomProfilesService: RoomProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room profile' })
  @ApiResponse({
    status: 201,
    description: 'Room profile has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createRoomProfile(
    @Body() createRoomUserDto: CreateRoomUserDto,
  ): Promise<RoomProfile> {
    return this.roomProfilesService.createRoomProfile(createRoomUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all room profiles' })
  @ApiResponse({ status: 200, description: 'Return all room profiles.' })
  async getRoomProfiles(): Promise<RoomProfile[]> {
    return this.roomProfilesService.getRoomProfiles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room profile by id' })
  @ApiParam({ name: 'id', description: 'Room Profile ID' })
  @ApiResponse({ status: 200, description: 'Return the room profile.' })
  @ApiResponse({ status: 404, description: 'Room profile not found.' })
  async getRoomProfileById(@Param('id') id: string): Promise<RoomProfile> {
    return this.roomProfilesService.getRoomProfileById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room profile' })
  @ApiParam({ name: 'id', description: 'Room Profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Room profile has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room profile not found.' })
  async deleteRoomProfile(@Param('id') id: string): Promise<RoomProfile> {
    return this.roomProfilesService.deleteRoomProfile(id);
  }
}
