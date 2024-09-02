import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Session, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURATION SERVICE

  const configService = new ConfigService()

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
      // Hay que pasar el secreto de sesión a una variable de entorno
      secret: configService.get<string>('COOKIE_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors({ credentials: true, origin: ['http://localhost:8080'] });

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
