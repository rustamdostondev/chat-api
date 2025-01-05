import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello everyone!', description: 'Message text' })
  @IsString()
  @MinLength(1)
  text: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Room User ID' })
  @IsString()
  roomUserId: string;
}
