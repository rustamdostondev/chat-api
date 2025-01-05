import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profile.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { User } from 'src/decorator/user.decorator';

@ApiTags('profiles')
@Controller('profiles')
@ApiBearerAuth('authorization')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('getMe')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the user profile.' })
  async getMe(@User() user: any): Promise<Profile> {
    return user;
  }

  @Get('findAll')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async getProfiles(): Promise<Profile[]> {
    return this.profilesService.getProfiles();
  }

  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfileById(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.getProfileById(id);
  }

  @Delete('deleteOne/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteProfile(@Param('id') id: string): Promise<Profile> {
    return this.profilesService.deleteProfile(id);
  }
}
