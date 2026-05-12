import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const dbType = configService.get<string>('DB_TYPE', 'sqlite');
  
  if (dbType === 'sqlite') {
    // SQLite 配置（用于开发和测试）
    return {
      type: 'better-sqlite3',
      database: 'data/carpool.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }
  
  // MySQL 配置（用于生产环境）
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', 'root'),
    database: configService.get<string>('DB_DATABASE', 'carpool'),
    charset: configService.get<string>('DB_CHARSET', 'utf8mb4'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    logger: 'file',
    timezone: 'Z',
  };
};
