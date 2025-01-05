import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting API Path
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('The Chat API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPath}/docs`, app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  // Log application details
  const baseUrl = await app.getUrl();
  console.log(`🚀 Application is running on: ${baseUrl}`);
  console.log(`📚 API Documentation available at: ${baseUrl}/${apiPath}/docs`);
}
bootstrap();
