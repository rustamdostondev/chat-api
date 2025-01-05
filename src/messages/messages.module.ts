import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageNotFound } from './messages.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MessageNotFound).forRoutes(
      {
        path: 'messages/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'messages/:id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
