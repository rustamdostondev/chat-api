import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '@common/decorators/user.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth('authorization')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new room' })
  create(@Body() createRoomDto: CreateRoomDto, @User() user: any) {
    return this.roomsService.createRoom(createRoomDto, user);
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Get all rooms' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.roomsService.getRooms(paginationDto);
  }

  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room not found',
  })
  getRoomById(@Param('id', ParseIntPipe) id: string) {
    return this.roomsService.getRoomById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @User() user: any,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  async deleteRoom(@Param('id') id: string, @User() user: any) {
    return this.roomsService.deleteRoom(id, user);
  }
}
