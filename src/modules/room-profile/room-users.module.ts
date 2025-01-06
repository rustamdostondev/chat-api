import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoomProfilesService } from './room-users.service';
import { RoomProfilesController } from './room-users.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { RoomProfileNotFound } from './room-users.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [RoomProfilesController],
  providers: [RoomProfilesService],
})
export class RoomUsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoomProfileNotFound).forRoutes(
      {
        path: 'room-profiles/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'room-users/:id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
