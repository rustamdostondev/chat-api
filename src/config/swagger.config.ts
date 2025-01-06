import { ApiResponseDto } from '@common/interfaces/api-response.interface';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Davo Chat API')
    .setDescription('The Davo Chat API documentation')
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

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [ApiResponseDto],
  });

  // Customize Swagger UI
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      // docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
  };

  SwaggerModule.setup('api/docs', app, document, customOptions);
}
