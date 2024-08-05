import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Session, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SWAGGER

  const config = new DocumentBuilder()
    .setTitle('Nest API - TypeORM')
    .setDescription('Nest api for test of auth and DB')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('', app, document);

  // PIPES

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    session({
      secret: 'adsadhjasdhjasdhasjdhjkh',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors({ credentials: true });

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
