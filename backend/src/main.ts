import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database Host: ${process.env.DATABASE_HOST}`);

    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('TaskFlow API')
      .setDescription('The TaskFlow API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 8080;
    console.log(`Attempting to listen on port ${port}...`);

    await app.listen(port, '0.0.0.0');
    console.log(`Application is successfully running on port ${port}`);
  } catch (error) {
    console.error('CRITICAL ERROR DURING STARTUP:', error);
    process.exit(1);
  }
}
bootstrap();
