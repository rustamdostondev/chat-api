import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'general-chat', description: 'Room name' })
  @IsString()
  @MinLength(3)
  name: string;
}
