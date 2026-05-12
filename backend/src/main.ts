import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  // 全局前缀
  const prefix = configService.get<string>('APP_PREFIX', 'api');
  app.setGlobalPrefix(prefix);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // 全局日志拦截器
  app.useGlobalInterceptors(new LoggerInterceptor());

  // 启用 CORS
  app.enableCors({
    origin: ['https://servicewechat.com'],
    credentials: true,
  });

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('企业顺风车平台 API')
    .setDescription('企业顺风车平台后端接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('APP_PORT', 3000);
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}/${prefix}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
