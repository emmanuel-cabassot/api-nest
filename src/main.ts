import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Asso Dev')
    .setDescription('Trouver des développeurs pour votre projet')
    .setVersion('1.0')
    .addTag('asso-dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options = new DocumentBuilder().addBearerAuth();
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
