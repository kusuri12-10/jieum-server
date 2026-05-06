import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MailModule } from './mail/mail.module.js';
import { MainScreenModule } from './main-screen/main-screen.module.js';
import { StatModule } from './stat/stat.module.js';
import { ShopModule } from './shop/shop.module.js';
import { ThemeModule } from './theme/theme.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'jieum'),
        entities: [__dirname + '/**/*.orm-entity.{ts,js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    RedisModule,
    AdminModule,
    AuthModule,
    UserModule,
    MailModule,
    MainScreenModule,
    StatModule,
    ShopModule,
    ThemeModule,
  ],
})
export class AppModule {}
