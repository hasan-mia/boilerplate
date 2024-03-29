import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FileUploadModule } from './fileupload/fileupload.module';
import { PaymentModule } from './payment/payment.module';
import { RedisCacheService } from './rediscloud.service';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: require('cache-manager-redis-store'),
    //   host: process.env.REDIS_HOST,
    //   port: parseInt(process.env.REDIS_PORT),
    //   auth_pass: process.env.REDIS_PASS,
    //   no_ready_check: true,
    // }),
    MongooseModule.forRoot(process.env.DB_URI),
    FileUploadModule,
    CloudinaryModule,
    AuthModule,
    UserModule,
    PaymentModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisCacheService],
  exports: [RedisCacheService],
})
export class AppModule {}
