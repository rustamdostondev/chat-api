import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '@common/decorators/user.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth('authorization')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new message' })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @User() user: any,
  ) {
    return this.messagesService.createMessage(createMessageDto, user);
  }

  @Get('getByRoom/:roomId')
  @ApiOperation({ summary: 'Get messages by room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  async getMessagesByRoom(@Param('roomId') roomId: string) {
    return this.messagesService.getMessagesByRoom(roomId);
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Get all messages' })
  async getAllMessages(@Query() paginationDto: PaginationDto) {
    return this.messagesService.getMessages(paginationDto);
  }

  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get a message by id' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  async getMessageById(@Param('id') id: string) {
    return this.messagesService.getMessageById(id);
  }

  @Delete('deletedById/:id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  async deleteMessage(@Param('id') id: string, @User() user: any) {
    return this.messagesService.deleteMessage(id, user);
  }
}
