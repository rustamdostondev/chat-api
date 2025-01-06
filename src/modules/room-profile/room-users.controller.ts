import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoomProfilesService } from './room-users.service';
import { User } from '@common/decorators/user.decorator';

@ApiTags('room-profiles')
@Controller('room-profiles')
@ApiBearerAuth('authorization')
export class RoomProfilesController {
  constructor(private readonly roomProfilesService: RoomProfilesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new room profile' })
  async createRoomProfile(
    @Body() createRoomUserDto: CreateRoomUserDto,
    @User() user: any,
  ) {
    return this.roomProfilesService.createRoomProfile(createRoomUserDto, user);
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Get all room profiles' })
  async getRoomProfiles() {
    return this.roomProfilesService.getRoomProfiles();
  }

  @Get('getById/:id')
  @ApiOperation({ summary: 'Get a room profile by id' })
  @ApiParam({ name: 'id', description: 'Room Profile ID' })
  async getRoomProfileById(@Param('id') id: string) {
    return this.roomProfilesService.getRoomProfileById(id);
  }

  @Delete('deletedById/:id')
  @ApiOperation({ summary: 'Delete a room profile' })
  @ApiParam({ name: 'id', description: 'Room Profile ID' })
  async deleteRoomProfile(@Param('id') id: string, @User() user: any) {
    return this.roomProfilesService.deleteRoomProfile(id, user);
  }
}
