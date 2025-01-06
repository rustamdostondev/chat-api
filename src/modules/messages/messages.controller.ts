import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth('authorization')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get('getByRoom/:roomId')
  @ApiOperation({ summary: 'Get messages by room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Return all messages.' })
  async getMessagesByRoom(@Param('roomId') roomId: string): Promise<Message[]> {
    return this.messagesService.getMessagesByRoom(roomId);
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({ status: 200, description: 'Return all messages.' })
  async getAllMessages(): Promise<Message[]> {
    return this.messagesService.getMessages();
  }

  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get a message by id' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({ status: 200, description: 'Return the message.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  async getMessageById(@Param('id') id: string): Promise<Message> {
    return this.messagesService.getMessageById(id);
  }

  @Delete('deletedById/:id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  async deleteMessage(@Param('id') id: string): Promise<Message> {
    return this.messagesService.deleteMessage(id);
  }
}
