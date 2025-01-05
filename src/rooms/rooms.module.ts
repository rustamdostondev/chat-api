import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomNotFound } from './rooms.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoomNotFound).forRoutes(
      {
        path: 'rooms/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'rooms/:id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
