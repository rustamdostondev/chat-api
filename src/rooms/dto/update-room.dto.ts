import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'general-chat', description: 'Room name' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;
}
