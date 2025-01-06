import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profile.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '@common/decorators/user.decorator';

@ApiTags('profiles')
@Controller('profiles')
@ApiBearerAuth('authorization')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('getMe')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the user profile.' })
  async getMe(@User() user: any) {
    return this.profilesService.getMe(user);
  }

  @Get('findAll')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async getProfiles() {
    return this.profilesService.getProfiles();
  }

  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getProfileById(@Param('id') id: string) {
    return this.profilesService.getProfileById(id);
  }
}
