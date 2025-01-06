import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { RoomUsersModule } from './modules/room-profile/room-users.module';
import { MessagesModule } from './modules/messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesModule } from './modules/profile/profile.module';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    ProfilesModule,
    RoomsModule,
    RoomUsersModule,
    MessagesModule,
    JwtModule.register({}),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
