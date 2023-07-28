import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './providers/database.providers';
import { usersProviders } from './providers/users.provider';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

export const jwtSecret = process.env.JWT_SECRET;
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '2h' },
    }),
    // SequelizeModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...databaseProviders,
    ...usersProviders,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
