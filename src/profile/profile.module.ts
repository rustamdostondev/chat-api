import { Module } from '@nestjs/common';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
