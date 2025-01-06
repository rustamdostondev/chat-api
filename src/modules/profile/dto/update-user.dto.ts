import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john_doe', description: 'User name' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'User email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
