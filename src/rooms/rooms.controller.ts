import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth('authorization')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'Room has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Return all rooms.' })
  async getRooms(): Promise<Room[]> {
    return this.roomsService.getRooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by id' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async getRoomById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.getRoomById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({
    status: 200,
    description: 'Room has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({
    status: 200,
    description: 'Room has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async deleteRoom(@Param('id') id: string): Promise<Room> {
    return this.roomsService.deleteRoom(id);
  }
}
