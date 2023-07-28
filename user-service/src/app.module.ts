import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './providers/database.providers';
import { usersProviders } from './providers/users.provider';
import { ConfigModule } from '@nestjs/config';

export const jwtSecret = process.env.JWT_SECRET;
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders, ...usersProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
