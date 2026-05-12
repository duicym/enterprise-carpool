import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { RouteModule } from './modules/route/route.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { OssModule } from './modules/oss/oss.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'sqlite');
        
        if (dbType === 'sqlite') {
          return {
            type: 'better-sqlite3',
            database: 'data/carpool.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
          };
        }
        
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get<string>('DB_USERNAME', 'root'),
          password: configService.get<string>('DB_PASSWORD', 'root'),
          database: configService.get<string>('DB_DATABASE', 'carpool'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('NODE_ENV') === 'development',
          logging: false,
        };
      },
    }),
    
    // Redis
    RedisModule,
    
    // 业务模块
    AuthModule,
    UserModule,
    CompanyModule,
    RouteModule,
    OrderModule,
    ReviewModule,
    NotificationModule,
    AdminModule,
    OssModule,
  ],
})
export class AppModule {}
