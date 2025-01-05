import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomUsersModule } from './room-profile/room-users.module';
import { MessagesModule } from './messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesModule } from './profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    ProfilesModule,
    RoomsModule,
    RoomUsersModule,
    MessagesModule,
    JwtModule.register({
      global: true,
      secret: '5b012ae8c559e34373d75bca2d96d82ea238d370',
    }),
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
